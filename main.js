// Portfolio JavaScript - All functionality in one file

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all components
  initMobileMenu();
  initSmoothScrolling();
  initScrollProgress();
  initCardEffects();
  initAnimations();
  initRippleEffects();
  updateCopyrightYear();
  initExpandSections();
  initProjectCarousels();
});

// Mobile Menu Functionality
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const navLinks = document.querySelectorAll("nav a, .mobile-menu a");

  if (!mobileMenuBtn || !mobileMenu) return;

  mobileMenuBtn.addEventListener("click", () => {
    const isActive = mobileMenu.classList.toggle("active");
    mobileMenuBtn.setAttribute("aria-expanded", isActive);
    mobileMenu.hidden = !isActive;

    const icon = mobileMenuBtn.querySelector("i");
    if (isActive) {
      icon.classList.replace("fa-bars", "fa-times");
    } else {
      icon.classList.replace("fa-times", "fa-bars");
    }
  });

  // Close mobile menu when clicking links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
      mobileMenu.hidden = true;
      const icon = mobileMenuBtn.querySelector("i");
      icon.classList.replace("fa-times", "fa-bars");
    });
  });
}

// Smooth Scrolling Functionality
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll("nav a, .mobile-menu a");
  const header = document.querySelector("header");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      const headerHeight = header ? header.offsetHeight : 0;

      window.scrollTo({
        top: targetElement.offsetTop - headerHeight,
        behavior: "smooth",
      });

      // Update active nav link
      updateActiveNavLink(targetId);
    });
  });
}

// Update Active Navigation Link
function updateActiveNavLink(targetId) {
  const navLinks = document.querySelectorAll("nav a, .mobile-menu a");
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === targetId) {
      link.classList.add("active");
    }
  });
}

// Scroll Progress Bar
function initScrollProgress() {
  const loadingBar = document.getElementById("loadingBar");
  const header = document.querySelector("header");

  if (!loadingBar || !header) return;

  window.addEventListener("scroll", () => {
    // Progress bar
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = Math.min((winScroll / height) * 100, 100);
    loadingBar.style.width = scrolled + "%";
    loadingBar.setAttribute("aria-valuenow", Math.round(scrolled));

    // Header background on scroll
    if (window.scrollY > 50) {
      header.style.backdropFilter = "blur(15px)";
      header.style.backgroundColor = "rgba(10, 25, 47, 0.95)";
    } else {
      header.style.backdropFilter = "blur(10px)";
      header.style.backgroundColor = "var(--glass)";
    }

    // Update active nav link on scroll
    updateActiveNavLinkOnScroll();
  });
}

// Update Active Nav Link on Scroll
function updateActiveNavLinkOnScroll() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav a, .mobile-menu a");
  const scrollPos = window.scrollY + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const sectionId = section.getAttribute("id");

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + sectionId) {
          link.classList.add("active");
        }
      });
    }
  });
}

// Card Hover Effects
function initCardEffects() {
  document.querySelectorAll(".glass-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });
}

// Intersection Observer for Animations
function initAnimations() {
  if ("IntersectionObserver" in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      });
    }, observerOptions);

    // Observe elements to animate
    document
      .querySelectorAll(".hero-content > *")
      .forEach((el) => observer.observe(el));
    document
      .querySelectorAll(".glass-card")
      .forEach((el) => observer.observe(el));
    document
      .querySelectorAll(".timeline-item")
      .forEach((el) => observer.observe(el));
    document
      .querySelectorAll(".contact-item")
      .forEach((el) => observer.observe(el));
  } else {
    // Fallback for browsers without IntersectionObserver
    document.querySelectorAll(".animate").forEach((el) => {
      el.classList.add("animate");
    });
  }
}

// Ripple Effect for Buttons
function initRippleEffects() {
  document.querySelectorAll(".cta-button, .social-link").forEach((button) => {
    button.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement("span");
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple-effect");

      this.appendChild(ripple);

      setTimeout(() => {
        if (ripple.parentNode === this) {
          this.removeChild(ripple);
        }
      }, 600);
    });
  });
}

// Update Copyright Year
function updateCopyrightYear() {
  const copyrightElement = document.getElementById("copyrightYear");
  if (copyrightElement) {
    const currentYear = new Date().getFullYear();
    copyrightElement.textContent = "© " + currentYear + " All rights reserved";
  }
}

// Expand/Collapse Sections for Experience and Education
function initExpandSections() {
  const seeMoreButtons = document.querySelectorAll(".see-more-btn");

  if (!seeMoreButtons.length) return;

  seeMoreButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const card = this.closest(".timeline-content");
      const additionalDetails = card.querySelectorAll(".additional-detail");
      const seeMoreText = this.querySelector(".see-more-text");
      const seeMoreIcon = this.querySelector(".see-more-icon");

      // Check if already expanded
      const isExpanded = this.classList.contains("expanded");

      // Close all other expanded items in the same section
      const section = card.closest("section");
      section.querySelectorAll(".see-more-btn.expanded").forEach((otherBtn) => {
        if (otherBtn !== this) {
          collapseItem(otherBtn);
        }
      });

      // Toggle current item
      if (isExpanded) {
        collapseItem(this);
      } else {
        expandItem(this);
      }

      // Toggle card and details
      card.classList.toggle("expanded");
      additionalDetails.forEach((detail) => {
        detail.classList.toggle("expanded");
      });

      // Scroll to show expanded content
      if (!isExpanded) {
        setTimeout(() => {
          const headerHeight = document.querySelector("header").offsetHeight;
          const cardTop = card.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: cardTop - headerHeight - 20,
            behavior: "smooth",
          });
        }, 300);
      }
    });

    // Keyboard accessibility
    button.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  });

  function expandItem(button) {
    button.classList.add("expanded");
    const seeMoreText = button.querySelector(".see-more-text");
    const seeMoreIcon = button.querySelector(".see-more-icon");
    seeMoreText.textContent = "See Less";
    seeMoreIcon.classList.replace("fa-chevron-down", "fa-chevron-up");
  }

  function collapseItem(button) {
    button.classList.remove("expanded");
    const seeMoreText = button.querySelector(".see-more-text");
    const seeMoreIcon = button.querySelector(".see-more-icon");
    seeMoreText.textContent = "See More Details";
    seeMoreIcon.classList.replace("fa-chevron-up", "fa-chevron-down");

    // Also collapse details
    const card = button.closest(".timeline-content");
    const additionalDetails = card.querySelectorAll(".additional-detail");
    additionalDetails.forEach((detail) => {
      detail.classList.remove("expanded");
    });
    card.classList.remove("expanded");
  }
}

// Projects Section Functionality
function initProjectsSection() {
  // Carousel Functionality
  initCarousels();

  // See More Projects Button
  initSeeMoreProjects();

  // Image Lightbox - FIXED
  initImageLightbox();
}

// Carousel Functionality
function initCarousels() {
  document.querySelectorAll(".carousel-container").forEach((carousel) => {
    const slides = carousel.querySelector(".carousel-slides");
    const slideElements = carousel.querySelectorAll(".carousel-slide");
    const prevBtn = carousel.querySelector(".prev-btn");
    const nextBtn = carousel.querySelector(".next-btn");
    const dots = carousel.querySelectorAll(".dot");
    const currentSlideSpan = carousel.querySelector(".current-slide");
    const totalSlidesSpan = carousel.querySelector(".total-slides");

    let currentIndex = 0;
    const totalSlides = slideElements.length;

    // Set total slides counter
    if (totalSlidesSpan) {
      totalSlidesSpan.textContent = totalSlides;
    }

    // Function to update carousel
    function updateCarousel() {
      if (slides) {
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
      }

      // Update active class on slides
      slideElements.forEach((slide, index) => {
        slide.classList.toggle("active", index === currentIndex);
      });

      // Update dots
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });

      // Update counter
      if (currentSlideSpan) {
        currentSlideSpan.textContent = currentIndex + 1;
      }
    }

    // Initialize
    updateCarousel();

    // Next button
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
      });
    }

    // Previous button
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
      });
    }

    // Dot navigation
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        currentIndex = parseInt(dot.getAttribute("data-slide"));
        updateCarousel();
      });
    });
  });
}

// See More Projects Functionality
function initSeeMoreProjects() {
  const seeMoreBtn = document.getElementById("seeMoreProjects");
  const hiddenProjects = document.querySelectorAll(".hidden-project");

  if (!seeMoreBtn || hiddenProjects.length === 0) return;

  let showingAll = false;

  seeMoreBtn.addEventListener("click", function () {
    if (!showingAll) {
      // Show all hidden projects
      hiddenProjects.forEach((project) => {
        project.style.display = "block";
        project.style.animation = "fadeInUp 0.5s ease";
      });

      // Update button text
      this.querySelector(".see-more-text").textContent = "Show Less Projects";
      this.classList.add("showing");

      showingAll = true;

      // Re-initialize carousels for newly shown projects
      setTimeout(initCarousels, 100);
      setTimeout(initImageLightbox, 100); // Re-initialize lightbox
    } else {
      // Hide projects again
      hiddenProjects.forEach((project) => {
        project.style.display = "none";
      });

      // Update button text
      this.querySelector(".see-more-text").textContent = "See More Projects";
      this.classList.remove("showing");

      showingAll = false;
    }

    // Scroll to button to keep it in view
    this.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

// Image Lightbox Functionality - FIXED VERSION
function initImageLightbox() {
  const lightbox = document.getElementById("imageLightbox");
  const lightboxOverlay = document.getElementById("lightboxOverlay");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const prevLightboxBtn = document.getElementById("prevLightbox");
  const nextLightboxBtn = document.getElementById("nextLightbox");

  if (!lightbox) return;

  let currentImages = [];
  let currentIndex = 0;
  let currentCarouselId = "";

  // FIXED: Attach click event to each image properly
  document.querySelectorAll(".project-image").forEach((img, index) => {
    img.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent event bubbling

      const carouselContainer = this.closest(".carousel-container");
      if (carouselContainer) {
        currentCarouselId = carouselContainer.id;
        const carouselSlides =
          carouselContainer.querySelectorAll(".carousel-slide");

        // Get all images from this carousel
        currentImages = [];
        carouselSlides.forEach((slide, slideIndex) => {
          const slideImg = slide.querySelector("img");
          if (slideImg) {
            currentImages.push({
              src: slideImg.getAttribute("data-full") || slideImg.src,
              alt: slideImg.alt || "Project image",
              index: slideIndex,
            });
          }
        });

        // Find which image was clicked
        const clickedImageSrc = this.getAttribute("data-full") || this.src;
        currentIndex = currentImages.findIndex(
          (img) => img.src === clickedImageSrc,
        );

        if (currentIndex === -1) currentIndex = 0;

        openLightbox();
      }
    });
  });

  // Also attach click to image overlay
  document.querySelectorAll(".image-overlay").forEach((overlay) => {
    overlay.addEventListener("click", function (e) {
      e.stopPropagation();
      const img =
        this.closest(".carousel-slide").querySelector(".project-image");
      if (img) img.click();
    });
  });

  function openLightbox() {
    if (currentImages.length === 0) return;

    const currentImage = currentImages[currentIndex];
    lightboxImage.src = currentImage.src;
    lightboxImage.alt = currentImage.alt;
    lightboxTitle.textContent = currentImage.alt;
    lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;

    // Preload adjacent images for smoother navigation
    preloadAdjacentImages();

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    currentImages = [];
    currentIndex = 0;
  }

  function navigateLightbox(direction) {
    if (currentImages.length === 0) return;

    if (direction === "next") {
      currentIndex = (currentIndex + 1) % currentImages.length;
    } else if (direction === "prev") {
      currentIndex =
        (currentIndex - 1 + currentImages.length) % currentImages.length;
    }

    const currentImage = currentImages[currentIndex];
    lightboxImage.src = currentImage.src;
    lightboxImage.alt = currentImage.alt;
    lightboxTitle.textContent = currentImage.alt;
    lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;

    // Preload next/prev images
    preloadAdjacentImages();
  }

  function preloadAdjacentImages() {
    if (currentImages.length > 1) {
      // Preload next image
      const nextIndex = (currentIndex + 1) % currentImages.length;
      const nextImg = new Image();
      nextImg.src = currentImages[nextIndex].src;

      // Preload previous image
      const prevIndex =
        (currentIndex - 1 + currentImages.length) % currentImages.length;
      const prevImg = new Image();
      prevImg.src = currentImages[prevIndex].src;
    }
  }

  // Close lightbox
  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxOverlay) {
    lightboxOverlay.addEventListener("click", closeLightbox);
  }

  // Navigation
  if (prevLightboxBtn) {
    prevLightboxBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navigateLightbox("prev");
    });
  }

  if (nextLightboxBtn) {
    nextLightboxBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navigateLightbox("next");
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      navigateLightbox("prev");
    } else if (e.key === "ArrowRight") {
      navigateLightbox("next");
    }
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightbox) {
    lightbox.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener("touchend", function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }

  function handleSwipe() {
    const swipeThreshold = 50;

    if (touchEndX < touchStartX - swipeThreshold) {
      navigateLightbox("next"); // Swipe left
    } else if (touchEndX > touchStartX + swipeThreshold) {
      navigateLightbox("prev"); // Swipe right
    }
  }

  // Handle image loading errors
  if (lightboxImage) {
    lightboxImage.addEventListener("error", function () {
      console.error("Failed to load lightbox image:", this.src);
      // Fallback to regular image source
      const regularSrc = this.src.replace(/\?.*$/, "");
      if (regularSrc !== this.src) {
        this.src = regularSrc;
      }
    });
  }
}

// Add this to your main initialization
function initAll() {
  // ... your existing initialization ...
  initProjectsSection();
}

document.addEventListener("DOMContentLoaded", initAll);

// See More Projects functionality
document.addEventListener("DOMContentLoaded", function () {
  const seeMoreBtn = document.getElementById("see-more-projects");
  const btnText = document.getElementById("btn-text");
  const btnIcon = document.getElementById("btn-icon");
  const hiddenProjects = document.querySelectorAll(".hidden-project");
  let projectsVisible = false;

  seeMoreBtn.addEventListener("click", function () {
    projectsVisible = !projectsVisible;

    if (projectsVisible) {
      hiddenProjects.forEach((project) => {
        project.style.display = "block";
      });
      btnText.textContent = "See Less Projects";
      btnIcon.classList.add("btn-icon-rotated");
    } else {
      hiddenProjects.forEach((project) => {
        project.style.display = "none";
      });
      btnText.textContent = "See More Projects";
      btnIcon.classList.remove("btn-icon-rotated");
    }
  });

  // Lightbox functionality
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.querySelector(".lightbox-caption");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxPrev = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");

  // Get all images with lightbox-trigger class
  const lightboxTriggers = document.querySelectorAll(".lightbox-trigger");
  let currentImageIndex = 0;
  let currentImages = [];

  // Function to open lightbox
  function openLightbox(image) {
    lightboxImage.src = image.src;
    lightboxCaption.textContent = image.alt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling when lightbox is open

    // Get all images in the same group
    const group = image.dataset.lightboxGroup;
    currentImages = Array.from(
      document.querySelectorAll(`[data-lightbox-group="${group}"]`),
    );
    currentImageIndex = currentImages.indexOf(image);
  }

  // Function to close lightbox
  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = ""; // Restore scrolling
  }

  // Function to show previous image
  function showPrevImage() {
    currentImageIndex =
      (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    const prevImage = currentImages[currentImageIndex];
    lightboxImage.src = prevImage.src;
    lightboxCaption.textContent = prevImage.alt;
  }

  // Function to show next image
  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    const nextImage = currentImages[currentImageIndex];
    lightboxImage.src = nextImage.src;
    lightboxCaption.textContent = nextImage.alt;
  }

  // Add click event to all lightbox triggers
  lightboxTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      openLightbox(this);
    });
  });

  // Close lightbox when clicking the close button
  lightboxClose.addEventListener("click", closeLightbox);

  // Close lightbox when clicking outside the image
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Navigate to previous image
  lightboxPrev.addEventListener("click", showPrevImage);

  // Navigate to next image
  lightboxNext.addEventListener("click", showNextImage);

  // Close lightbox with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    } else if (e.key === "ArrowLeft" && lightbox.classList.contains("active")) {
      showPrevImage();
    } else if (
      e.key === "ArrowRight" &&
      lightbox.classList.contains("active")
    ) {
      showNextImage();
    }
  });
});

// Skills Section Expand/Collapse
function initSkillsExpand() {
  const skillsButtons = document.querySelectorAll(".skills-see-more");

  if (!skillsButtons.length) return;

  skillsButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.closest(".skills-category");
      const additionalSkills = category.querySelectorAll(".additional-skill");
      const seeMoreText = this.querySelector(".see-more-text");
      const seeMoreIcon = this.querySelector(".see-more-icon");

      // Check if already expanded
      const isExpanded = this.classList.contains("expanded");

      // Toggle expanded class on button and category
      this.classList.toggle("expanded");
      category.classList.toggle("expanded");

      // Toggle each additional skill
      additionalSkills.forEach((skill) => {
        skill.classList.toggle("expanded");
      });

      // Update button text and icon
      if (this.classList.contains("expanded")) {
        seeMoreText.textContent = "See Less";
        seeMoreIcon.classList.replace("fa-chevron-down", "fa-chevron-up");

        // Scroll to show expanded content
        setTimeout(() => {
          const headerHeight = document.querySelector("header").offsetHeight;
          const categoryTop =
            category.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: categoryTop - headerHeight - 20,
            behavior: "smooth",
          });
        }, 300);
      } else {
        seeMoreText.textContent = seeMoreText.textContent.includes("Technical")
          ? "See More Technical Skills"
          : "See More Soft Skills";
        seeMoreIcon.classList.replace("fa-chevron-up", "fa-chevron-down");
      }

      // Add click animation
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);
    });

    // Keyboard accessibility
    button.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  });
}

// Update your initialization function
function initAll() {
  // ... all your existing initialization calls ...
  initSkillsExpand(); // Add this
}

// Update your DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", initAll);

// Certificate Modal Functionality
function initCertificateModal() {
  const viewButtons = document.querySelectorAll(".view-certificate-btn");
  const modal = document.getElementById("certificateModal");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalClose = document.getElementById("modalClose");
  const certificateImage = document.getElementById("certificateImage");
  const shareButton = document.getElementById("shareCertificate");

  if (!modal) return;

  // Open modal when "View Certificate" button is clicked
  viewButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const certificateData = this.getAttribute("data-certificate");
      openCertificateModal(certificateData);
    });
  });

  // Open modal function
  function openCertificateModal(certificateId) {
    // Update certificate image based on certificateId
    const certificateImages = {
      certificate1: "./images/certficicate Image.jpeg",
    };

    if (certificateImages[certificateId]) {
      certificateImage.src = certificateImages[certificateId];
      certificateImage.alt = "Global Digital Skills Award Certificate";
    }

    // Show modal
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Prevent scrolling
  }

  // Close modal functions
  function closeCertificateModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Re-enable scrolling
  }

  // Close modal when clicking X
  if (modalClose) {
    modalClose.addEventListener("click", closeCertificateModal);
  }

  // Close modal when clicking overlay
  if (modalOverlay) {
    modalOverlay.addEventListener("click", closeCertificateModal);
  }

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeCertificateModal();
    }
  });

  // Share certificate functionality
  if (shareButton) {
    shareButton.addEventListener("click", function () {
      if (navigator.share) {
        navigator
          .share({
            title: "Global Digital Skills Award Certificate",
            text: "Check out my Global Digital Skills Award in Web & Mobile Development (React)",
            url: window.location.href,
          })
          .catch(console.error);
      } else {
        // Fallback: Copy URL to clipboard
        navigator.clipboard
          .writeText(window.location.href)
          .then(() => {
            const originalText = shareButton.innerHTML;
            shareButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
              shareButton.innerHTML = originalText;
            }, 2000);
          })
          .catch(console.error);
      }
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initCertificateModal();
  // Add any other initialization functions here
});
