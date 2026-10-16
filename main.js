document.documentElement.classList.add("js");

const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const sections = [...document.querySelectorAll("main section[id]")];
const year = document.getElementById("currentYear");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxCounter = document.getElementById("lightboxCounter");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

const setHeaderState = () => {
  header?.classList.toggle("scrolled", window.scrollY > 24);
};

const closeMenu = () => {
  siteNav?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open navigation");
  document.body.classList.remove("menu-open");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  siteNav?.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const activeSectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px" },
);

sections.forEach((section) => activeSectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".carousel-slide")];
  const dotsContainer = carousel.querySelector(".carousel-dots");
  const previousButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const interval = Number(carousel.dataset.interval) || 4500;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentIndex = 0;
  let timer;

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Show screenshot ${index + 1}`);
    dot.addEventListener("click", () => {
      showSlide(index);
      restartCarousel();
    });
    dotsContainer?.append(dot);
    return dot;
  });

  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentIndex;
      slide.classList.toggle("active", isActive);
      slide.tabIndex = isActive ? 0 : -1;
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === currentIndex));
  };

  const stopCarousel = () => window.clearInterval(timer);
  const startCarousel = () => {
    if (reduceMotion || slides.length < 2) return;
    stopCarousel();
    timer = window.setInterval(() => showSlide(currentIndex + 1), interval);
  };
  const restartCarousel = () => {
    stopCarousel();
    startCarousel();
  };

  previousButton?.addEventListener("click", () => {
    showSlide(currentIndex - 1);
    restartCarousel();
  });
  nextButton?.addEventListener("click", () => {
    showSlide(currentIndex + 1);
    restartCarousel();
  });
  carousel.addEventListener("mouseenter", stopCarousel);
  carousel.addEventListener("mouseleave", startCarousel);
  carousel.addEventListener("focusin", stopCarousel);
  carousel.addEventListener("focusout", startCarousel);

  showSlide(0);
  startCarousel();
});

let lightboxItems = [];
let lightboxIndex = 0;

const renderLightbox = () => {
  if (!lightboxImage || !lightboxItems.length) return;
  const item = lightboxItems[lightboxIndex];
  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  if (lightboxCaption) lightboxCaption.textContent = item.caption;
  if (lightboxCounter) lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxItems.length}`;
  const hideNavigation = lightboxItems.length < 2;
  if (lightboxPrev) lightboxPrev.hidden = hideNavigation;
  if (lightboxNext) lightboxNext.hidden = hideNavigation;
};

const moveLightbox = (direction) => {
  if (!lightboxItems.length) return;
  lightboxIndex = (lightboxIndex + direction + lightboxItems.length) % lightboxItems.length;
  renderLightbox();
};

document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;
    const galleryName = trigger.dataset.lightboxGallery;
    const galleryTriggers = galleryName
      ? [...document.querySelectorAll(`[data-lightbox-gallery="${galleryName}"]`)]
      : [trigger];

    lightboxItems = galleryTriggers.map((item) => {
      const previewImage = item.querySelector("img");
      return {
        src: previewImage?.currentSrc || previewImage?.src || item.dataset.lightbox,
        alt: previewImage?.alt || "Project preview",
        caption: item.dataset.caption || "Project preview",
      };
    });
    lightboxIndex = Math.max(0, galleryTriggers.indexOf(trigger));
    renderLightbox();
    lightbox.showModal();
  });
});

document.querySelectorAll(".experience-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const detailsId = button.getAttribute("aria-controls");
    const details = detailsId ? document.getElementById(detailsId) : null;
    if (!details) return;

    const isExpanded = button.getAttribute("aria-expanded") === "true";
    details.hidden = isExpanded;
    button.setAttribute("aria-expanded", String(!isExpanded));
    button.classList.toggle("expanded", !isExpanded);

    const label = button.querySelector("span");
    if (label) label.textContent = isExpanded ? "Read More" : "Show Less";
  });
});

lightboxClose?.addEventListener("click", () => lightbox?.close());
lightboxPrev?.addEventListener("click", () => moveLightbox(-1));
lightboxNext?.addEventListener("click", () => moveLightbox(1));
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox?.open) return;
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});

window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 980) closeMenu();
});

setHeaderState();
if (year) year.textContent = new Date().getFullYear();
