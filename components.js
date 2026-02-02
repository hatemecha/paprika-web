const SITE_LINKS = {
  paprika: {
    instagram: "https://www.instagram.com/_p4prik4/",
    youtube:
      "https://www.youtube.com/playlist?list=PL_YuZMoaWvvPZUah5E_D3i9PGZ-VQEAqh",
    spotify:
      "https://open.spotify.com/intl-es/artist/63oydwT8lSZtuA7K41zBeI?si=qGFhkeXlSmW7z0NEKuzoRQ",
  },
  ruidoMolesto: {
    instagram: "https://www.instagram.com/ruidomolesto.sello/",
    site: "https://ruidomolesto.online",
  },
  hatemecha: {
    instagram: "https://www.instagram.com/hatemecha/",
    site: "https://porqueodiasamecha.lol",
  },
  contactEmail: "gmrgabo@gmail.com",
};

window.SITE_LINKS = SITE_LINKS;

const createHeader = (container, isHome = false, activePage = "") => {
  const titleLink = document.createElement("a");
  titleLink.href = isHome ? "assets/cv.pdf" : "index.html";
  titleLink.className = "title-link";
  if (!isHome) {
    titleLink.target = "";
  } else {
    titleLink.target = "_blank";
  }

  const titleImage = document.createElement("img");
  titleImage.src = "assets/paprika-title.webp";
  titleImage.alt = "Paprika";
  titleImage.className = isHome
    ? "title-image"
    : "title-image title-image-small";
  titleLink.appendChild(titleImage);

  container.appendChild(titleLink);

  if (isHome) {
    const mainContent = document.createElement("div");
    mainContent.className = "main-content";

    const tvWrapper = document.createElement("div");
    tvWrapper.className = "tv-wrapper";

    const tvImage = document.createElement("img");
    tvImage.src = "assets/oldtv.webp";
    tvImage.alt = "TV";
    tvImage.className = "tv-image";

    const staticOverlay = document.createElement("img");
    staticOverlay.src = "assets/static.gif";
    staticOverlay.alt = "Static";
    staticOverlay.className = "static-overlay";
    staticOverlay.id = "tv-screen";

    const noiseOverlay = document.createElement("div");
    noiseOverlay.className = "static-noise";

    tvWrapper.appendChild(tvImage);
    tvWrapper.appendChild(staticOverlay);
    tvWrapper.appendChild(noiseOverlay);
    mainContent.appendChild(tvWrapper);

    const navLinks = document.createElement("nav");
    navLinks.className = "nav-links";

    const pages = [
      { name: "musica", href: "musica.html", image: "img/musica.webp" },
      { name: "galeria", href: "galeria.html", image: "img/galeria.webp" },
      {
        name: "recitales",
        href: "recitales.html",
        image: "img/recitales.webp",
      },
      { name: "nosotros", href: "nosotros.html", image: "img/nosotros.webp" },
      {
        name: "extras",
        href: "extras.html",
        image: "img/paprikaperfeccionada.png",
      },
    ];

    pages.forEach((page) => {
      const link = document.createElement("a");
      link.href = page.href;
      link.className = "nav-link";
      link.setAttribute("data-image", page.image);
      link.textContent = page.name;
      navLinks.appendChild(link);
    });

    mainContent.appendChild(navLinks);
    container.appendChild(mainContent);
  } else {
    const navHorizontal = document.createElement("nav");
    navHorizontal.className = "nav-horizontal";

    const pages = [
      { name: "musica", href: "musica.html" },
      { name: "galeria", href: "galeria.html" },
      { name: "recitales", href: "recitales.html" },
      { name: "nosotros", href: "nosotros.html" },
      { name: "extras", href: "extras.html" },
    ];

    pages.forEach((page, index) => {
      const link = document.createElement("a");
      link.href = page.href;
      link.className = "nav-horizontal-link";
      if (activePage === page.name) {
        link.classList.add("active");
      }
      link.textContent = page.name;
      navHorizontal.appendChild(link);

      if (index < pages.length - 1) {
        const separator = document.createElement("span");
        separator.className = "nav-separator";
        separator.textContent = "|";
        navHorizontal.appendChild(separator);
      }
    });

    container.appendChild(navHorizontal);
  }
};

const createFooter = () => {
  const footer = document.createElement("footer");
  footer.className = "footer";

  const footerContent = document.createElement("div");
  footerContent.className = "footer-content";

  const p = document.createElement("p");
  const yearSpan = document.createElement("span");
  yearSpan.id = "current-year";
  yearSpan.textContent = new Date().getFullYear();

  p.className = "footer-credit";
  const bandSpan = document.createElement("span");
  bandSpan.className = "footer-band";
  bandSpan.textContent = "Paprika Spicy";
  const authorLink = document.createElement("a");
  authorLink.href = SITE_LINKS.hatemecha.instagram;
  authorLink.target = "_blank";
  authorLink.rel = "noopener noreferrer";
  authorLink.className = "footer-author";
  authorLink.textContent = "hatemecha";
  const sepSpan = document.createElement("span");
  sepSpan.className = "footer-sep";
  sepSpan.textContent = "©";
  const crossSpan = document.createElement("span");
  crossSpan.className = "footer-cross";
  crossSpan.textContent = "x";

  p.appendChild(bandSpan);
  p.appendChild(document.createTextNode(" "));
  p.appendChild(crossSpan);
  p.appendChild(document.createTextNode(" "));
  p.appendChild(authorLink);
  p.appendChild(document.createTextNode(" "));
  p.appendChild(sepSpan);
  p.appendChild(document.createTextNode(" "));
  p.appendChild(yearSpan);

  footerContent.appendChild(p);

  const socialLinks = document.createElement("div");
  socialLinks.className = "social-links";

  const instagramLink = document.createElement("a");
  instagramLink.href = SITE_LINKS.paprika.instagram;
  instagramLink.target = "_blank";
  instagramLink.rel = "noopener noreferrer";
  instagramLink.className = "social-link";
  instagramLink.setAttribute("aria-label", "Instagram de PAPRIKA");
  instagramLink.innerHTML = "<i class='fab fa-instagram'></i>";

  const youtubeLink = document.createElement("a");
  youtubeLink.href = SITE_LINKS.paprika.youtube;
  youtubeLink.target = "_blank";
  youtubeLink.rel = "noopener noreferrer";
  youtubeLink.className = "social-link";
  youtubeLink.setAttribute("aria-label", "YouTube de PAPRIKA");
  youtubeLink.innerHTML = "<i class='fab fa-youtube'></i>";

  const spotifyLink = document.createElement("a");
  spotifyLink.href = SITE_LINKS.paprika.spotify;
  spotifyLink.target = "_blank";
  spotifyLink.rel = "noopener noreferrer";
  spotifyLink.className = "social-link";
  spotifyLink.setAttribute("aria-label", "Spotify de PAPRIKA");
  spotifyLink.innerHTML = "<i class='fab fa-spotify'></i>";

  socialLinks.appendChild(instagramLink);
  socialLinks.appendChild(youtubeLink);
  socialLinks.appendChild(spotifyLink);

  footerContent.appendChild(socialLinks);
  footer.appendChild(footerContent);
  return footer;
};

const initPacman = () => {
  if (document.querySelector(".pacman-modal")) return;

  const pacmanScriptPath = "assets/pacman-game.js";
  let pacmanScriptPromise = null;

  const modal = document.createElement("div");
  modal.className = "pacman-modal";
  modal.innerHTML = `
    <div class="pacman-panel" role="dialog" aria-modal="true" aria-label="Pacman">
      <button class="pacman-close" type="button" aria-label="Cerrar Pacman">
        <span aria-hidden="true">x</span>
      </button>
      <div class="pacman-header">
        <div class="pacman-title">:v</div>
        <div class="pacman-subtitle">
          Flechas para mover · P pausa · S mute
        </div>
      </div>
      <div class="pacman-game-shell">
        <div id="pacman-game" class="pacman-game"></div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeButton = modal.querySelector(".pacman-close");

  const loadPacmanGame = () => {
    if (window.initPacmanGame) {
      return Promise.resolve();
    }
    if (pacmanScriptPromise) {
      return pacmanScriptPromise;
    }
    pacmanScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = pacmanScriptPath;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = reject;
      document.body.appendChild(script);
    });
    return pacmanScriptPromise;
  };

  const openModal = () => {
    modal.classList.add("is-open");
    window.PACMAN_ACTIVE = true;
    loadPacmanGame().then(() => {
      const wrapper = modal.querySelector("#pacman-game");
      if (wrapper && typeof window.initPacmanGame === "function") {
        window.initPacmanGame(wrapper);
      }
    });
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    window.PACMAN_ACTIVE = false;
    if (typeof window.pausePacmanAudio === "function") {
      window.pausePacmanAudio();
    }
    document.querySelectorAll("audio").forEach((audio) => {
      if (audio && audio.src && (audio.src.includes("daleharvey/pacman") || audio.src.includes("pacman"))) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  };

  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  const attachPacmanTrigger = () => {
    const img = document.querySelector('img[src*="paprikaperfeccionada"]');
    if (img) {
      img.addEventListener("dblclick", openModal);
      img.classList.add("pacman-trigger");
    }
  };
  setTimeout(attachPacmanTrigger, 0);
};

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.protocol === "file:") {
    document
      .querySelectorAll('link[rel="preload"][as="font"]')
      .forEach((link) => link.remove());
  }
  const isExtrasPage =
    document.body.classList.contains("extras-page") ||
    /extras\.html$/i.test(window.location.pathname) ||
    window.location.pathname.endsWith("extras");
  if (isExtrasPage) {
    initPacman();
  }
});
