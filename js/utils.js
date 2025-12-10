import { loaderIcon } from "./links.js";


export function showError(id, message){
    const el = document.getElementById(id);
    if(!el) return;
    el.textContent = message;
    el.style.display = 'block';
}

export function clearError(id){
    const el = document.getElementById(id);
    if(!el) return;
    el.textContent = "";
    el.style.display = 'none';
}

export function clearErrors(form){
    form.querySelectorAll('.error').forEach(e=>{
        e.textContent = '';
        e.style.display = 'none';
    });
}

export function clearInputErrors(id){
    const el = document.getElementById(id); 
    if(el){
        el.textContent = '';
        el.style.display = 'none';
    };
}

export function showMessage(id, message){
    const el = document.getElementById(id);
    if(!el){
        el.style.display = "none"
        return;
    }
    el.textContent = message;
    el.style.display = "block";

    setTimeout(() => {
        el.style.display = "none";
    }, 2000);
}

export function popoverDelay(action){
    const loader = document.querySelector(".loader");
  loader.src = loaderIcon;
    const pmtsPopoverContainer = document.querySelector(".popover-container");
    setTimeout(() => {
    if(loader){loader.style.display = "none"}
        // Refresh UI
        action;        
        if(pmtsPopoverContainer){pmtsPopoverContainer.style.display = "none"}
    }, 3000);
}