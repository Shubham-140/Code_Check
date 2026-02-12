import connectDB from "./db.js";
import { Question } from "./models/question.model.js";
import dotenv from "dotenv";

dotenv.config();

import { questions } from "./questions.js";

const seedQuestions = async () => {
  try {
    await connectDB();
    console.log("🔌 Connected to DB. Starting seed...");

    let insertedCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (const q of questions) {
      try {
        const exists = await Question.findOne({ description: q.description });
        if (exists) {
          skippedCount++;
          continue;
        }
        await Question.create(q);
        insertedCount++;
      } catch (err) {
        errors.push({ description: q.description, error: err.message });
      }
    }

    console.log(`✅ Inserted : ${insertedCount}`);
    console.log(`⏭️  Skipped  : ${skippedCount} (already exist)`);
    if (errors.length > 0) {
      console.log(`❌ Errors   : ${errors.length}`);
      errors.forEach((e) => console.error(`   - "${e.description}": ${e.error}`));
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Fatal error during seeding:", error);
    process.exit(1);
  }
};

seedQuestions();