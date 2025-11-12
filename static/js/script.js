'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// --- Sidebar Toggle functionality ---
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// DEFENSIVE CHECK: Ensure both elements exist before adding the listener
if (sidebar && sidebarBtn) {
    // sidebar toggle functionality for mobile
    sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}

// --- Testimonials Modal functionality ---
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// DEFENSIVE CHECK: Ensure critical modal elements exist before proceeding
if (modalContainer && modalCloseBtn && overlay) {
    // modal variables
    const modalImg = document.querySelector("[data-modal-img]");
    const modalTitle = document.querySelector("[data-modal-title]");
    const modalText = document.querySelector("[data-modal-text]");

    // modal toggle function
    const testimonialsModalFunc = function () {
        modalContainer.classList.toggle("active");
        overlay.classList.toggle("active");
    }

    // add click event to all modal items
    for (let i = 0; i < testimonialsItem.length; i++) {

        testimonialsItem[i].addEventListener("click", function () {
            // DEFENSIVE CHECK: Ensure target elements exist before accessing properties (like src)
            if (modalImg && modalTitle && modalText) {
                modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
                modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
                modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
                modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
            }
            testimonialsModalFunc();
        });

    }

    // add click event to modal close button
    modalCloseBtn.addEventListener("click", testimonialsModalFunc);
    overlay.addEventListener("click", testimonialsModalFunc);
}


// --- Custom Select/Filter functionality (This section was causing the error) ---
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
// Keeping the original attribute with the typo for consistency with your HTML
const selectValue = document.querySelector("[data-selecct-value]"); 
const filterBtn = document.querySelectorAll("[data-filter-btn]");

// DEFENSIVE CHECK: Ensure the main 'select' dropdown exists before trying to add listeners to it.
if (select) {
    select.addEventListener("click", function () { elementToggleFunc(this); });
    
    // add event in all select items
    for (let i = 0; i < selectItems.length; i++) {
        selectItems[i].addEventListener("click", function () {

            let selectedValue = this.innerText.toLowerCase();
            if (selectValue) { // Check before setting text
                selectValue.innerText = this.innerText;
            }
            elementToggleFunc(select);
            filterFunc(selectedValue);

        });
    }

    // filter variables are defined globally, so reuse that variable
    const filterItems = document.querySelectorAll("[data-filter-item]");

    const filterFunc = function (selectedValue) {

        for (let i = 0; i < filterItems.length; i++) {

            // Simplified conditional logic
            if (selectedValue === "all" || selectedValue === filterItems[i].dataset.category) {
                filterItems[i].classList.add("active");
            } else {
                filterItems[i].classList.remove("active");
            }

        }

    }

    // add event in all filter button items for large screen
    let lastClickedBtn = filterBtn[0];

    for (let i = 0; i < filterBtn.length; i++) {

        filterBtn[i].addEventListener("click", function () {

            let selectedValue = this.innerText.toLowerCase();
            if (selectValue) { // Check before setting text
                selectValue.innerText = this.innerText;
            }
            filterFunc(selectedValue);
            
            if (lastClickedBtn) { // Check if lastClickedBtn is defined
                lastClickedBtn.classList.remove("active");
            }
            this.classList.add("active");
            lastClickedBtn = this;

        });

    }
}


// --- Contact Form validation ---
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// DEFENSIVE CHECK: Ensure form and button exist
if (form && formBtn) {
    // add event to all form input field
    for (let i = 0; i < formInputs.length; i++) {
        formInputs[i].addEventListener("input", function () {

            // check form validation
            if (form.checkValidity()) {
                formBtn.removeAttribute("disabled");
            } else {
                formBtn.setAttribute("disabled", "");
            }

        });
    }
}


// --- Page Navigation (Navbar) functionality ---
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener("click", function () {

        // FIX: The inner loop must use a different iterator (e.g., 'j') 
        // to avoid conflicting with the outer loop's 'i'.
        for (let j = 0; j < pages.length; j++) { 
            const navLinkText = this.innerHTML.toLowerCase();
            const pageData = pages[j].dataset.page;

            if (navLinkText === pageData) {
                pages[j].classList.add("active");
                navigationLinks[i].classList.add("active");
                window.scrollTo(0, 0);
            } else {
                pages[j].classList.remove("active");
                // Use the inner loop index 'j' here to remove 'active' from ALL other links/pages
                navigationLinks[j].classList.remove("active"); 
            }
        }
    });
}