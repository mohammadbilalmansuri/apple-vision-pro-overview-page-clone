const lenis = new Lenis();
gsap.registerPlugin(ScrollTrigger);
lenis.on("scroll", ScrollTrigger.update);

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("unload", () => {
  window.scrollTo(0, 0);
  ScrollTrigger.refresh();
});

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Header Animations

const header = document.querySelector("header");
const headerHeight = header.offsetHeight;
const popupBtn = document.getElementById("popup-btn");
let isPopupOpen = false;
const headerDiv = document.getElementById("header-div");

const togglePopup = () => {
  if (!isPopupOpen) {
    popupBtn.classList.add("rotate-x-180");
    header.classList.add("h-screen");
    header.classList.replace("bg-gray-3/80", "bg-gray-3/40");
    header.classList.replace("dark:bg-black/80", "dark:bg-black/40");
    headerDiv.classList.add("bg-gray-3/80", "dark:bg-black/80", "shadow-sm");

    gsap.to(headerDiv, {
      height: "auto",
      duration: 0.3,
      onComplete: () => {
        window.addEventListener("scroll", onPopupOpenScrollHandler);
        isPopupOpen = true;
      },
    });
  } else {
    popupBtn.classList.remove("rotate-x-180");
    header.classList.remove("h-screen");
    header.classList.replace("bg-gray-3/40", "bg-gray-3/80");
    header.classList.replace("dark:bg-black/40", "dark:bg-black/80");
    headerDiv.classList.remove("bg-gray-3/80", "dark:bg-black/80", "shadow-sm");

    gsap.to(headerDiv, {
      height: headerHeight,
      duration: 0.3,
      onComplete: () => {
        window.removeEventListener("scroll", onPopupOpenScrollHandler);
        isPopupOpen = false;
      },
    });
  }
};

const onPopupOpenScrollHandler = () => {
  if (isPopupOpen) togglePopup();
};

popupBtn.addEventListener("click", debounce(togglePopup, 200));

// ScrollTrigger.create({
//   trigger: "#technology",
//   scroller: "body",
//   start: `top ${headerHeight}`,
//   end: "bottom top",
//   markers: true,
//   onEnter: () => {
//     document.documentElement.classList.add("dark");
//   },
//   onLeaveBack: () => {
//     document.documentElement.classList.remove("dark");
//   },
//   onEnterBack: () => {
//     document.documentElement.classList.add("dark");
//   },
//   onLeave: () => {
//     document.documentElement.classList.remove("dark");
//   },
// });

// Main Section Animations

function playVideo(videoElement, currentTime) {
  if (!(videoElement instanceof HTMLVideoElement)) {
    console.error("Invalid video element provided.");
    return;
  }

  if (currentTime && typeof currentTime === "number") {
    videoElement.currentTime = currentTime;
  }

  videoElement.play().catch((error) => {
    console.log(error);
  });
}

function toggleVideoPlayPause(videoElement, play, buttonElement) {
  if (!(videoElement instanceof HTMLVideoElement)) {
    console.error("Invalid video element provided.");
    return;
  }

  if (typeof play !== "boolean") {
    console.error("Invalid play state provided.");
    return;
  }

  if (!(buttonElement instanceof HTMLButtonElement)) {
    console.error("Invalid button element provided.");
    return;
  }

  const buttonSvgPath = buttonElement.querySelector("svg path");

  if (play) {
    playVideo(videoElement);
    buttonSvgPath.setAttribute(
      "d",
      "M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm224-72l0 144c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-144c0-13.3 10.7-24 24-24s24 10.7 24 24zm112 0l0 144c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-144c0-13.3 10.7-24 24-24s24 10.7 24 24z"
    );
  } else {
    videoElement.pause();
    buttonSvgPath.setAttribute(
      "d",
      "M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"
    );
  }
}

// Play/Pause buttons
document.querySelectorAll(".play-pause").forEach((button) => {
  button.addEventListener("click", () => {
    const video = button.parentElement.querySelector("video");
    if (!video) {
      console.error("Video element not found");
      return;
    }
    toggleVideoPlayPause(video, video.paused, button);
  });
});

// Hero Section
if (window.innerWidth >= 1240) {
  const heroVideo = document.getElementById("hero-video");
  heroVideo.addEventListener("ended", () => {
    playVideo(heroVideo, 5);
  });
}

// Foundation Section
const foundationVideo = document.getElementById("foundation-video");
const foundationPlayPauseButton =
  foundationVideo.parentElement.querySelector(".play-pause");
const introVideo = document.querySelector("#intro-video");

if (window.innerWidth < 1240) {
  ScrollTrigger.create({
    trigger: "#foundation-video",
    scroller: "body",
    start: "top 80%",
    end: `bottom ${headerHeight}`,
    onEnter: () =>
      toggleVideoPlayPause(foundationVideo, true, foundationPlayPauseButton),
    onLeaveBack: () =>
      toggleVideoPlayPause(foundationVideo, false, foundationPlayPauseButton),
    onLeave: () => {
      toggleVideoPlayPause(foundationVideo, false, foundationPlayPauseButton);
    },
    onEnterBack: () => {
      toggleVideoPlayPause(foundationVideo, true, foundationPlayPauseButton);
    },
  });

  introVideo.setAttribute("autoplay", "");
} else {
  ScrollTrigger.create({
    trigger: "#foundation",
    scroller: "body",
    start: "top 75%",
    end: "top 75%",
    onEnter: () =>
      toggleVideoPlayPause(foundationVideo, true, foundationPlayPauseButton),
    onLeaveBack: () =>
      toggleVideoPlayPause(foundationVideo, false, foundationPlayPauseButton),
  });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: "#foundation",
        scroller: "body",
        start: `top ${headerHeight}`,
        end: "top -250%",
        scrub: true,
        pin: true,
        onLeave: () =>
          toggleVideoPlayPause(
            foundationVideo,
            false,
            foundationPlayPauseButton
          ),
        onEnterBack: () =>
          toggleVideoPlayPause(
            foundationVideo,
            true,
            foundationPlayPauseButton
          ),
      },
    })
    .to("#foundation-content", {
      top: "-60%",
      ease: "none",
    })
    .to("#intro", {
      top: 0,
      ease: "none",
    });

  ScrollTrigger.create({
    trigger: "#intro-content",
    scroller: "body",
    start: "top -75%",
    end: "top -150%",
    scrub: true,
    onUpdate: (self) => {
      const currentTime = self.progress * introVideo.duration;
      requestAnimationFrame(() => {
        if (Math.abs(introVideo.currentTime - currentTime) > 0.1) {
          introVideo.currentTime = currentTime;
        }
      });
    },
  });
}

function videoHeadingAnimation(sectionSelector) {
  if (!sectionSelector) {
    console.error("Section selector not provided");
    return;
  }

  const video = document.querySelector(`${sectionSelector} video`);
  const playPauseButton = document.querySelector(
    `${sectionSelector} .play-pause`
  );

  ScrollTrigger.create({
    trigger: sectionSelector,
    scroller: "body",
    start: "top 75%",
    end: "top 75%",
    onEnter: () => toggleVideoPlayPause(video, true, playPauseButton),
    onLeaveBack: () => toggleVideoPlayPause(video, false, playPauseButton),
  });

  gsap.to(`${sectionSelector} .heading`, {
    top: "-25%",
    ease: "none",
    scrollTrigger: {
      trigger: sectionSelector,
      scroller: "body",
      start: `top ${headerHeight}`,
      end: "top -50%",
      scrub: true,
      pin: true,
    },
  });

  const linkElement = document.querySelector(`${sectionSelector} .link`);
  if (linkElement) {
    gsap.to(linkElement, {
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: sectionSelector,
        scroller: "body",
        start: "top top",
        end: "top -1%",
        scrub: true,
      },
    });
  }

  gsap.to(`${sectionSelector} .video-div`, {
    scaleX: 0.9,
    ease: "none",
    scrollTrigger: {
      trigger: sectionSelector,
      scroller: "body",
      start: "top -1%",
      end: "top -100%",
      scrub: true,
    },
  });
}

// Experience Sections
videoHeadingAnimation("#entertainment");
videoHeadingAnimation("#productivity");
videoHeadingAnimation("#photos-videos");
videoHeadingAnimation("#connection");
videoHeadingAnimation("#apps");
videoHeadingAnimation("#visionOS");

// Canvas
class CanvasAnimation {
  constructor(
    canvasSelector,
    desktopImages,
    scrollConfig,
    isImageCenterFromY = true,
    isImageCenterFromX = true,
    mobileImages = null
  ) {
    this.canvas = document.querySelector(canvasSelector);
    if (!this.canvas) {
      console.error(`Canvas element "${canvasSelector}" not found!`);
      return;
    }

    this.context = this.canvas.getContext("2d");
    this.setCanvasSize();
    this.desktopImages = desktopImages;
    this.mobileImages = mobileImages;
    this.currentImages = this.getCurrentImageSet();
    this.images = new Map();
    this.imageSeq = { frame: 0 };
    this.scrollConfig = scrollConfig;
    this.isImageCenterFromY = isImageCenterFromY;
    this.isImageCenterFromX = isImageCenterFromX;
    this.init();
  }

  setCanvasSize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  getCurrentImageSet() {
    if (this.mobileImages && window.innerWidth < 768) return this.mobileImages;
    return this.desktopImages;
  }

  async preloadImages(imageUrls) {
    const promises = imageUrls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(img);
        })
    );

    const loadedImages = await Promise.all(promises);
    loadedImages.forEach((img, index) => this.images.set(index, img));
  }

  async init() {
    await this.preloadImages(this.currentImages);
    this.render();
    this.setupResizeListener();
    this.setupScrollAnimation();
  }

  render() {
    const img = this.images.get(this.imageSeq.frame) || this.images.get(0);
    if (img) {
      this.drawImageOnCanvas(img);
    }
  }

  drawImageOnCanvas(img) {
    const ctx = this.context;
    const canvas = ctx.canvas;
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const shift_x = this.isImageCenterFromX
      ? (canvas.width - img.width * ratio) / 2
      : 0;
    const shift_y = this.isImageCenterFromY
      ? (canvas.height - img.height * ratio) / 2
      : 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      shift_x,
      shift_y,
      img.width * ratio,
      img.height * ratio
    );
  }

  setupResizeListener() {
    window.addEventListener(
      "resize",
      debounce(() => {
        this.setCanvasSize();
        const newImageSet = this.getCurrentImageSet();
        if (newImageSet !== this.currentImages) {
          this.currentImages = newImageSet;
          this.images.clear();
          this.preloadImages(this.currentImages).then(() => this.render());
        }
      }, 100)
    );
  }

  setupScrollAnimation() {
    const { trigger, scroller, start, end, scrub, pin, ...rest } =
      this.scrollConfig;

    gsap.to(this.imageSeq, {
      frame: this.currentImages.length - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger,
        scroller,
        start,
        end,
        scrub,
        pin,
        onUpdate: () => this.render(),
        ...rest,
      },
    });
  }
}

// Design Section Initial Canvas Animation
gsap.from("#design-canvas", {
  scale: 0.9,
  ease: "none",
  scrollTrigger: {
    trigger: "#design-canvas-div",
    scroller: "body",
    start: "top 75%",
    end: `top ${headerHeight}`,
    scrub: true,
  },
});

new CanvasAnimation(
  "#design-canvas",
  Array.from(
    { length: 20 },
    (_, i) =>
      `https://res.cloudinary.com/mohammadbilalmansuri/image/upload/applevisionpro/images/design/${i}.webp`
  ),
  {
    trigger: "#design-canvas-div",
    scroller: "body",
    start: "top 75%",
    end: `top ${headerHeight}`,
    scrub: true,
  },
  false
);

// Design Section Pinned Canvas Animation
new CanvasAnimation(
  "#design-canvas",
  Array.from(
    { length: 177 },
    (_, i) =>
      `https://res.cloudinary.com/mohammadbilalmansuri/image/upload/applevisionpro/images/design/${
        i + 21
      }.webp`
  ),
  {
    trigger: "#design-canvas-div",
    scroller: "body",
    start: `top ${headerHeight}`,
    end: "top -400%",
    scrub: true,
    pin: true,
  },
  false
);

let lastWidth = window.innerWidth;
window.addEventListener(
  "resize",
  debounce(() => {
    const newWidth = window.innerWidth;
    if (
      (lastWidth >= 1240 && newWidth < 1240) ||
      (lastWidth < 1240 && newWidth >= 1240)
    ) {
      window.location.reload();
    }
    lastWidth = newWidth;
  }, 50)
);
