(function () {
    const siteConfig = {
        siteName: "Icy's Site",
        favicon: "assets/favicon.png",
        nav: [
            { href: "index.html", label: "Home", key: "home" },
            { href: "portfolio.html", label: "Portfolio", key: "portfolio" },
            { href: "links.html", label: "Links", key: "links" },
            { href: "about.html", label: "About me", key: "about" }
        ]
    };

    const body = document.body;
    const pageKey = body.dataset.page || "";
    const pageTitle = body.dataset.title || siteConfig.siteName;

    document.title = pageTitle;

    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
    }
    favicon.href = siteConfig.favicon;

    const app = document.getElementById("site-app");
    if (!app) return;

    const existingMain = app.querySelector("main");
    const contentNode = existingMain ? existingMain : app.firstElementChild;
    if (!contentNode) return;

    const pageShell = document.createElement("div");
    pageShell.className = "page-shell";

    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `
    <div class="brand">
      <a href="index.html">${siteConfig.siteName}</a>
    </div>
    <nav class="main-nav" aria-label="Main navigation">
      ${siteConfig.nav
            .map(
                (item) =>
                    `<a href="${item.href}"${item.key === pageKey ? ' class="active"' : ""}>${item.label}</a>`
            )
            .join("")}
    </nav>
  `;

    pageShell.appendChild(header);
    pageShell.appendChild(contentNode);

    app.innerHTML = "";
    app.appendChild(pageShell);
})();
