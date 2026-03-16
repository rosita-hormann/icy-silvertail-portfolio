document.addEventListener("DOMContentLoaded", function () {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabPanels = document.querySelectorAll(".tab-panel");
    loadPortfolioFromJson();

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
    // const triggers = document.querySelectorAll(".lightbox-trigger");

    document.addEventListener("click", function (event) {
        const trigger = event.target.closest(".lightbox-trigger");
        if (!trigger) return;

        const img = trigger.querySelector("img");
        const fullSrc = trigger.getAttribute("data-full");
        const altText = img ? img.getAttribute("alt") : "Expanded artwork";

        if (fullSrc) {
            openLightbox(fullSrc, altText);
        }
    });
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

    // triggers.forEach((trigger) => {
    //     trigger.addEventListener("click", function () {
    //         const img = trigger.querySelector("img");
    //         const fullSrc = trigger.getAttribute("data-full");
    //         const altText = img ? img.getAttribute("alt") : "Expanded artwork";
    //         if (fullSrc) {
    //             openLightbox(fullSrc, altText);
    //         }
    //     });
    // });

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

async function loadPortfolioFromJson() {
    const portfolioMap = {
        main_artworks: "gallery-main",
        creatures: "gallery-creatures",
        sketches: "gallery-sketches",
        traditional: "gallery-traditional",
    };

    try {
        const response = await fetch("gallery.json", { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`Could not load gallery.json (${response.status})`);
        }

        const data = await response.json();

        Object.entries(portfolioMap).forEach(([jsonKey, containerId]) => {
            const container = document.getElementById(containerId);
            if (!container) return;

            const items = Array.isArray(data[jsonKey]) ? data[jsonKey] : [];

            container.innerHTML = "";

            const sortedItems = items.slice().sort((a, b) => {
                const nameA = (a.display_name || a.public_id || "").toLowerCase();
                const nameB = (b.display_name || b.public_id || "").toLowerCase();
                return nameB.localeCompare(nameA);
            });

            sortedItems.forEach((item) => {
                const imageUrl = item.secure_url;
                const imageAlt = item.display_name || item.public_id || "Artwork";

                if (!imageUrl) return;

                const button = document.createElement("button");
                button.className = "gallery-card lightbox-trigger";
                button.type = "button";
                button.dataset.full = imageUrl;

                const img = document.createElement("img");
                img.src = imageUrl;
                img.alt = imageAlt;
                img.loading = "lazy";

                button.appendChild(img);
                container.appendChild(button);
            });
        });
    } catch (error) {
        console.error("Error loading portfolio from gallery.json:", error);
    }
}