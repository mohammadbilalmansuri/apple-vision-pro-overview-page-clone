gsap.registerPlugin(ScrollTrigger);

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
(() => {
  const heroVideo = document.getElementById("hero-video");

  if (!heroVideo) {
    console.error("Hero Video not found");
    return;
  }

  heroVideo.addEventListener("ended", () => {
    playVideo(heroVideo, 5);
  });
})();

// Foundation Section
(() => {
  const foundationVideo = document.getElementById("foundation-video");
  if (!foundationVideo) {
    console.error("Foundation video not found");
    return;
  }

  const foundationPlayPauseButton =
    foundationVideo.parentElement.querySelector(".play-pause");

  ScrollTrigger.create({
    trigger: "#foundation",
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
        start: "bottom bottom",
        end: "top -190%",
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
    })
    .to("#intro", {
      top: 0,
    });

  // const introVideo = document.querySelector("#intro-video");

  // if (!introVideo) {
  //   console.error("Intro video not found");
  //   return;
  // }

  // ScrollTrigger.create({
  //   trigger: "#intro-content",
  //   start: "top top",
  //   end: "top -75%",
  //   scrub: true,
  //   onUpdate: (self) => {
  //     introVideo.currentTime = self.progress * introVideo.duration;
  //   },
  // });
})();

// Canvas
class CanvasAnimation {
  constructor(
    canvasSelector,
    desktopImages,
    scrollConfig,
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

    this.init();
  }

  setCanvasSize() {
    const computedStyle = getComputedStyle(this.canvas);
    this.canvas.width = parseInt(computedStyle.width, 10);
    this.canvas.height = parseInt(computedStyle.height, 10);
  }

  getCurrentImageSet() {
    if (this.mobileImages && window.innerWidth < 768) {
      return this.mobileImages;
    }
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
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  }

  setupResizeListener() {
    const throttle = (func, limit) => {
      let lastFunc;
      let lastRan;
      return function (...args) {
        const context = this;
        if (!lastRan) {
          func.apply(context, args);
          lastRan = Date.now();
        } else {
          clearTimeout(lastFunc);
          lastFunc = setTimeout(() => {
            if (Date.now() - lastRan >= limit) {
              func.apply(context, args);
              lastRan = Date.now();
            }
          }, limit - (Date.now() - lastRan));
        }
      };
    };

    window.addEventListener(
      "resize",
      throttle(() => {
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
    const { trigger, start, end, scrub, scroller } = this.scrollConfig;

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
      },
    });
  }
}

// Usage Example
// const desktopImages = Array.from(
//   { length: 118 },
//   (_, i) =>
//     `https://res.cloudinary.com/mohammadbilalmansuri/image/upload/v1735043877/zelt/canvas/${String(
//       i + 1
//     )}.webp`
// );

// const scrollConfig = {
//   trigger: "#hero canvas",
//   start: "top top",
//   end: "300% top",
//   scrub: 0.15,
//   scroller: "body",
// };
