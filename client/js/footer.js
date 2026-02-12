export async function renderFooter(containerId){

    const root=document.getElementById(containerId);
    if(!root){
        return;
    }

    const res=await fetch('../pages/footer.html');
    const html=await res.text();

    root.innerHTML=html;

}