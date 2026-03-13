const defaultStatic = "assets/static.gif";
const flickerImage = "img/tv-flash.png";
const flickerDuration = 60;
const flickerMinDelay = 2000;
const flickerMaxDelay = 5000;

let imageInterval = null;
let flickerTimeout = null;
let footerRevealBound = false;
let footerRevealRaf = null;
let footerScrollSource = null;

const FOOTER_REVEAL_OFFSET = 24;
const LONG_PAGE_MIN_OVERFLOW = 80;

const scheduleFooterRevealUpdate = () => {
  if (footerRevealRaf !== null) {
    cancelAnimationFrame(footerRevealRaf);
  }

  footerRevealRaf = requestAnimationFrame(() => {
    footerRevealRaf = null;
    updateFooterVisibility();
  });
};

const bindFooterScrollSource = (nextSource) => {
  if (footerScrollSource === nextSource) return;

  if (footerScrollSource === window) {
    window.removeEventListener("scroll", scheduleFooterRevealUpdate);
  } else if (footerScrollSource) {
    footerScrollSource.removeEventListener("scroll", scheduleFooterRevealUpdate);
  }

  footerScrollSource = nextSource;

  if (footerScrollSource === window) {
    window.addEventListener("scroll", scheduleFooterRevealUpdate, {
      passive: true,
    });
  } else if (footerScrollSource) {
    footerScrollSource.addEventListener("scroll", scheduleFooterRevealUpdate, {
      passive: true,
    });
  }
};

const getFooterScrollSource = () => {
  const container = document.querySelector(".container");
  const docOverflow = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );

  if (container) {
    const containerStyle = window.getComputedStyle(container);
    const containerOverflowY = containerStyle?.overflowY || "visible";
    const containerAllowsScroll = ["auto", "scroll", "overlay"].includes(
      containerOverflowY,
    );
    const containerOverflow = Math.max(
      0,
      container.scrollHeight - container.clientHeight,
    );

    if (containerAllowsScroll && containerOverflow > docOverflow + 8) {
      return container;
    }
  }

  return window;
};

const getScrollMetrics = (source) => {
  if (source === window) {
    const doc = document.documentElement;
    return {
      current: window.scrollY + window.innerHeight,
      total: doc.scrollHeight,
      viewport: window.innerHeight,
    };
  }

  return {
    current: source.scrollTop + source.clientHeight,
    total: source.scrollHeight,
    viewport: source.clientHeight,
  };
};

const updateFooterVisibility = () => {
  const body = document.body;
  const footer = document.querySelector(".footer");
  if (!body || !footer) return;

  const scrollSource = getFooterScrollSource();
  bindFooterScrollSource(scrollSource);

  const { current, total, viewport } = getScrollMetrics(scrollSource);
  const overflow = total - viewport;
  const isLongPage = overflow > LONG_PAGE_MIN_OVERFLOW;
  const showFooter = !isLongPage || current >= total - FOOTER_REVEAL_OFFSET;

  body.classList.toggle("footer-on-long-page", isLongPage);
  body.classList.toggle("footer-visible-at-bottom", showFooter);
};

const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const initHomePage = () => {
  const tvScreen = document.getElementById("tv-screen");
  const navLinks = document.querySelectorAll(".nav-link");
  const flickerPreload = new Image();
  flickerPreload.src = flickerImage;
  let currentScreenSrc = defaultStatic;
  let isHovering = false;

  if (!tvScreen || navLinks.length === 0) return;

  const setTvImage = (src) => {
    currentScreenSrc = src || defaultStatic;
    tvScreen.src = currentScreenSrc;
  };

  const stopFlicker = () => {
    if (flickerTimeout) {
      clearTimeout(flickerTimeout);
      flickerTimeout = null;
    }
  };

  const startFlicker = () => {
    stopFlicker();
    const schedule = () => {
      const delay = randomBetween(flickerMinDelay, flickerMaxDelay);
      flickerTimeout = setTimeout(() => {
        if (isHovering) {
          schedule();
          return;
        }
        const returnImage = currentScreenSrc;
        setTvImage(flickerImage);

        setTimeout(() => {
          setTvImage(returnImage);
          schedule();
        }, flickerDuration);
      }, delay);
    };

    schedule();
  };

  const checkDeviceAndSetup = () => {
    const isMobile = window.innerWidth <= 768;

    if (imageInterval) {
      clearInterval(imageInterval);
      imageInterval = null;
    }

    navLinks.forEach((link) => {
      link.removeEventListener("mouseenter", handleMouseEnter);
      link.removeEventListener("mouseleave", handleMouseLeave);
    });

    if (isMobile) {
      const images = Array.from(navLinks).map((link) =>
        link.getAttribute("data-image"),
      );
      let currentIndex = 0;

      const changeImage = () => {
        if (tvScreen && images.length > 0) {
          setTvImage(images[currentIndex]);
          currentIndex = (currentIndex + 1) % images.length;
        }
      };

      changeImage();
      imageInterval = setInterval(changeImage, 1000);
    } else {
      navLinks.forEach((link) => {
        link.addEventListener("mouseenter", handleMouseEnter);
        link.addEventListener("mouseleave", handleMouseLeave);
      });
    }
  };

  const handleMouseEnter = (e) => {
    const imagePath = e.currentTarget.getAttribute("data-image");
    isHovering = true;
    if (tvScreen) {
      setTvImage(imagePath);
    }
  };

  const handleMouseLeave = () => {
    isHovering = false;
    if (tvScreen) {
      setTvImage(defaultStatic);
    }
  };

  checkDeviceAndSetup();
  startFlicker();
  window.addEventListener("resize", checkDeviceAndSetup);
};

const initFooter = () => {
  const currentYearElement = document.getElementById("current-year");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  scheduleFooterRevealUpdate();

  if (!footerRevealBound) {
    window.addEventListener("resize", scheduleFooterRevealUpdate);
    window.addEventListener("load", scheduleFooterRevealUpdate);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => {
          scheduleFooterRevealUpdate();
        })
        .catch(() => {});
    }

    footerRevealBound = true;
  }
};

window.addEventListener("DOMContentLoaded", () => {
  initHomePage();
  initFooter();
});
