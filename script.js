// ========================================
// HUNGRY POINT CAFE - SCRIPT
// ========================================

// MOBILE MENU
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  // Close menu after clicking a link
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}


// ========================================
// SCROLL REVEAL
// ========================================

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealElements.forEach(element => {
  observer.observe(element);
});


// ========================================
// NAVBAR SCROLL EFFECT
// ========================================

const navbar = document.querySelector(".nav");

window.addEventListener("scroll", () => {
  if (!navbar) return;

  if (window.scrollY > 50) {
    navbar.style.background = "rgba(5, 5, 5, 0.92)";
    navbar.style.boxShadow =
      "0 15px 45px rgba(0,0,0,0.35)";
  } else {
    navbar.style.background = "rgba(10, 10, 10, 0.72)";
    navbar.style.boxShadow =
      "0 12px 40px rgba(0,0,0,0.25)";
  }
});


// ========================================
// MENU IMAGE MODAL
// ========================================

const modal = document.querySelector(".modal");
const menuPreview = document.querySelector("#menuPreview");
const modalClose = document.querySelector("#modalClose");

function openMenu() {
  if (!modal) return;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";
}

function closeMenu() {
  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}

if (menuPreview) {
  menuPreview.addEventListener("click", openMenu);
}

if (modalClose) {
  modalClose.addEventListener("click", closeMenu);
}


// Close modal by clicking outside

if (modal) {
  modal.addEventListener("click", event => {
    if (event.target === modal) {
      closeMenu();
    }
  });
}


// Close modal with ESC

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeMenu();
  }
});


// ========================================
// CURRENT YEAR
// ========================================

const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}


// ========================================
// SMOOTH SCROLL
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(link => {

  link.addEventListener("click", event => {

    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);

    if (target) {

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

  });

});


// ========================================
// BUTTON PRESS EFFECT
// ========================================

document.querySelectorAll(".btn").forEach(button => {

  button.addEventListener("click", () => {

    button.style.transform = "scale(0.97)";

    setTimeout(() => {
      button.style.transform = "";
    }, 120);

  });

});


// ========================================
// PAGE LOADED
// ========================================

window.addEventListener("load", () => {

  document.body.classList.add("loaded");

  console.log(
    "🍔 Hungry Point Cafe website loaded successfully!"
  );

});
