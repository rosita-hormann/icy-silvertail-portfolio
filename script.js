document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabPanels = document.querySelectorAll(".tab-panel");

  if (tabButtons.length && tabPanels.length) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const targetId = button.getAttribute("data-tab");

        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabPanels.forEach((panel) => {
          panel.classList.remove("active");
          panel.hidden = true;
        });

        button.classList.add("active");

        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add("active");
          targetPanel.hidden = false;
        }
      });
    });
  }

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxBackdrop = document.getElementById("lightboxBackdrop");
  const triggers = document.querySelectorAll(".lightbox-trigger");

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightbox.hidden = true;
    lightboxImage.src = "";
  }

  function openLightbox(src, altText) {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = src;
    lightboxImage.alt = altText || "Expanded artwork";
    lightbox.hidden = false;
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const img = trigger.querySelector("img");
      const fullSrc = trigger.getAttribute("data-full");
      const altText = img ? img.getAttribute("alt") : "Expanded artwork";
      if (fullSrc) {
        openLightbox(fullSrc, altText);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener("click", closeLightbox);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });
});
