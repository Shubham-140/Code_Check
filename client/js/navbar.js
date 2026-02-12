import { ApiService } from "./api-service.js";

export async function renderNavbar(containerId) {

  const root = document.getElementById(containerId);

  if (!root) {
    return;
  }

  const res = await fetch('../pages/navbar.html');
  const html = await res.text();

  root.innerHTML = html;
  loadProfileContainer();

}

const navigateToProfilePage = () => {

  failureToast("This feature is not available yet. Please wait for updates", "Not found");

}

const showProfileDropdown = (profileBtn, profileDropdown, e) => {

  if (!profileBtn.contains(e.target)) {
    return;
  }

  profileDropdown.classList.remove("hidden");

  const closeDropdown = (event) => {
    if (!profileDropdown.contains(event.target) && !profileBtn.contains(event.target)) {
      profileDropdown.classList.add("hidden");
      document.removeEventListener("click", closeDropdown);
    }
  }

  setTimeout(() => {
    document.addEventListener('click', closeDropdown);
  }, 0);

}

const logoutUser = () => {

  localStorage.removeItem("jwt_token");
  window.location.href = "home.html";

}

async function loadProfileContainer() {
  const token = localStorage.getItem("jwt_token") || null;
  const profileContainer = document.getElementById('profile-container');
  const profileDropdown = document.getElementById("profile-dropdown");
  const navigateProfileBtn = document.getElementById("navigate-profile-btn");
  const logoutBtn = document.getElementsByClassName("logout-button");
  const loginBtn = profileContainer.querySelector('#login-btn');
  const profileBtn = profileContainer.querySelector('#profile-btn');
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!mobileMenuBtn || !mobileMenu) {
    return;
  }

  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  })

  if (!loginBtn || !profileBtn || !profileContainer) {
    return;
  }

  try {
    const response = await ApiService.get("/user/me");

    if (response.status === 401) {
      localStorage.removeItem("jwt_token");
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error("");
    }

    const userObj = response?.data;
    if (!userObj) {
      return;
    }

    const user = userObj?.user;
    const avatarContainer = profileBtn.querySelector('span');
    const img = profileBtn.querySelector('img');

    if (user?.image) {
      if (!img || !avatarContainer) {
        return;
      }

      avatarContainer.classList.add('hidden');
      img.classList.remove('hidden');
      img.src = user.image;
    }
    else {
      if (!avatarContainer || !img) {
        return;
      }

      avatarContainer.classList.remove('hidden');
      img.classList.add('hidden');
      avatarContainer.textContent = user?.name[0];
    }

    if (user) {
      loginBtn.classList.add('hidden');
      profileBtn.classList.remove('hidden');
    }
    else {
      loginBtn.classList.remove('hidden');
      profileBtn.classList.add('hidden');
    }

    if (profileBtn && user) {
      if (profileBtn && profileDropdown) {
        document.addEventListener("click", (e) => showProfileDropdown(profileBtn, profileDropdown, e));
      }

      if (navigateProfileBtn) {
        navigateProfileBtn.addEventListener("click", navigateToProfilePage);
      }

      if (logoutBtn && logoutBtn.length > 0) {
        for (const elem of logoutBtn) {
          elem.addEventListener("click", logoutUser);
        }
      }
    }
  } catch (error) {
    if (error.message === "Unauthorized") {
      // window.location.reload();
    }

    loginBtn.classList.remove('hidden');
    profileBtn.classList.add('hidden');
  }

}