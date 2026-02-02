const defaultStatic = "assets/static.gif";
const flickerImage = "img/tv-flash.png";
const flickerDuration = 60;
const flickerMinDelay = 2000;
const flickerMaxDelay = 5000;

let imageInterval = null;
let flickerTimeout = null;

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
};

window.addEventListener("DOMContentLoaded", () => {
  initHomePage();
  initFooter();
});
