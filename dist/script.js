// --------------------- Canvas ------------------------

class CreateCanvas {
  constructor(config) {
    this.canvas = document.querySelector(config.canvasElement);
    this.context = this.canvas.getContext("2d");
    this.defaultImages = config.defaultImages || [];
    this.mobileImages = config.mobileImages || [];
    this.coverImages = config.coverImages || false;
    this.pinCanvas = config.pinCanvas || false;
    this.triggerElement = document.querySelector(config.triggerElement);
    this.startTrigger = config.startTrigger || "top center";
    this.endTrigger = config.endTrigger || "top -50%";

    window.addEventListener(
      "resize",
      this.debounce(() => this.handleResize(), 250)
    );

    this.initialize();
  }

  async initialize() {
    try {
      await this.loadImages();
      this.setCanvasSize();
      this.setupAnimation();
      this.render(this.images[0]);
    } catch (error) {
      console.error("Failed to initialize canvas:", error);
    }
  }

  async loadImages() {
    if (window.innerWidth < 640 && this.mobileImages.length > 0) {
      this.images = await this.loadImagesArray(this.mobileImages);
    } else {
      this.images = await this.loadImagesArray(this.defaultImages);
    }
    if (this.images.length === 0) {
      throw new Error("No images loaded.");
    }
  }

  async loadImagesArray(imagePaths) {
    const promises = imagePaths.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
      });
    });
    return Promise.all(promises);
  }

  setupAnimation() {
    const imageSeq = { frame: 0 };
    gsap.to(imageSeq, {
      frame: this.images.length - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: this.triggerElement,
        scroller: "body",
        start: this.startTrigger,
        end: this.endTrigger,
        scrub: true,
        pin: this.pinCanvas,
        pinSpacing: this.pinCanvas,
      },
      onUpdate: () => this.render(this.images[imageSeq.frame]),
    });
  }

  render(image) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (image) {
      if (this.coverImages) {
        const ratio = Math.min(
          this.canvas.width / image.width,
          this.canvas.height / image.height
        );
        const newWidth = image.width * ratio;
        const newHeight = image.height * ratio;
        const offsetX = (this.canvas.width - newWidth) / 2;
        const offsetY = (this.canvas.height - newHeight) / 2;
        this.context.drawImage(
          image,
          0,
          0,
          image.width,
          image.height,
          offsetX,
          offsetY,
          newWidth,
          newHeight
        );
      } else {
        this.context.drawImage(
          image,
          0,
          0,
          image.width,
          image.height,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
      }
    }
  }

  setCanvasSize() {
    const { offsetWidth: width, offsetHeight: height } = this.canvas;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  handleResize() {
    this.setCanvasSize();
    this.render(this.images[0]);
  }
}

// ----------- Guide Section -------------

const canvas1Config = {
  canvasElement: "#canvas-1",
  defaultImages: [
    "./assets/images/canvas1/01.png",
    "./assets/images/canvas1/02.png",
    "./assets/images/canvas1/03.png",
    "./assets/images/canvas1/04.png",
    "./assets/images/canvas1/05.png",
    "./assets/images/canvas1/06.png",
    "./assets/images/canvas1/07.png",
    "./assets/images/canvas1/08.png",
    "./assets/images/canvas1/09.png",
    "./assets/images/canvas1/10.png",
    "./assets/images/canvas1/11.png",
    "./assets/images/canvas1/12.png",
    "./assets/images/canvas1/13.png",
    "./assets/images/canvas1/14.png",
    "./assets/images/canvas1/15.png",
    "./assets/images/canvas1/16.png",
    "./assets/images/canvas1/17.png",
    "./assets/images/canvas1/18.png",
    "./assets/images/canvas1/19.png",
    "./assets/images/canvas1/20.png",
    "./assets/images/canvas1/21.png",
    "./assets/images/canvas1/22.png",
    "./assets/images/canvas1/23.png",
    "./assets/images/canvas1/24.png",
    "./assets/images/canvas1/25.png",
    "./assets/images/canvas1/26.png",
    "./assets/images/canvas1/27.png",
    "./assets/images/canvas1/28.png",
    "./assets/images/canvas1/29.png",
    "./assets/images/canvas1/30.png",
    "./assets/images/canvas1/31.png",
    "./assets/images/canvas1/32.png",
    "./assets/images/canvas1/33.png",
    "./assets/images/canvas1/34.png",
    "./assets/images/canvas1/35.png",
    "./assets/images/canvas1/36.png",
    "./assets/images/canvas1/37.png",
    "./assets/images/canvas1/38.png",
    "./assets/images/canvas1/39.png",
    "./assets/images/canvas1/40.png",
  ],
  // mobileImages: [],
  triggerElement: "#guide-section",
  startTrigger: "top 10%",
  endTrigger: "top -50%",
  pinCanvas: false,
  // coverImages: true,
};

const canvas1 = new CreateCanvas(canvas1Config);

gsap.from("#guide-links", {
  y: 100,
  opacity: 0,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#guide-section",
    scroller: "body",
    start: "top 40%",
    end: "top 20%",
    scrub: 1,
  },
});

// -------------- Video With Content Sections ---------------

function headingVideoAnimation(section, videoDiv, headingDiv) {
  const video = document.querySelector(`${videoDiv} video`);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      scroller: "body",
      start: "top 60%",
      end: "top -100%",
      scrub: true,
      pin: false,
      onEnter: () => {
        playVideo(video);
      },
      onLeaveBack: () => {
        video.pause();
      },
      onEnterBack: () => {
        video.currentTime = 0;
      },
    },
  });

  tl.from(headingDiv, {
    bottom: 0,
    ease: "none",
  })
    .to(
      headingDiv,
      {
        bottom: "100%",
        ease: "none",
      },
      "parallelAnim"
    )
    .to(
      video,
      {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scroller: "body",
          start: "top top",
          end: "top -50%",
          scrub: true,
          pin: true,
          pinSpacing: true,
        },
      },
      "parallelAnim"
    )
    .to(videoDiv, {
      scaleX: 0.93,
      ease: "none",
      duration: 0.5,
    });
}

headingVideoAnimation("#apps-section", "#apps-video", "#apps-heading");

headingVideoAnimation(
  "#entertainment-section",
  "#entertainment-video",
  "#entertainment-heading"
);

headingVideoAnimation(
  "#memories-section",
  "#memories-video",
  "#memories-heading"
);

headingVideoAnimation(
  "#connection-section",
  "#connection-video",
  "#connection-heading"
);

// ------------ Design Section -------------

const canvas2InitialConfig = {
  canvasElement: "#canvas-2",
  defaultImages: [
    "./assets/images/canvas2/00.jpeg",
    "./assets/images/canvas2/01.jpeg",
    "./assets/images/canvas2/02.jpeg",
    "./assets/images/canvas2/03.jpeg",
    "./assets/images/canvas2/04.jpeg",
    "./assets/images/canvas2/05.jpeg",
    "./assets/images/canvas2/06.jpeg",
    "./assets/images/canvas2/07.jpeg",
    "./assets/images/canvas2/08.jpeg",
    "./assets/images/canvas2/09.jpeg",
    "./assets/images/canvas2/10.jpeg",
    "./assets/images/canvas2/11.jpeg",
    "./assets/images/canvas2/12.jpeg",
    "./assets/images/canvas2/13.jpeg",
    "./assets/images/canvas2/14.jpeg",
    "./assets/images/canvas2/15.jpeg",
    "./assets/images/canvas2/16.jpeg",
    "./assets/images/canvas2/17.jpeg",
    "./assets/images/canvas2/18.jpeg",
    "./assets/images/canvas2/19.jpeg",
    "./assets/images/canvas2/20.jpeg",
  ],
  triggerElement: "#design-canvas",
  startTrigger: "top center",
  endTrigger: "top top",
  pinCanvas: false,
};

const canvas2FinalConfig = {
  canvasElement: "#canvas-2",
  defaultImages: [
    "./assets/images/canvas2/20.jpeg",
    "./assets/images/canvas2/21.jpeg",
    "./assets/images/canvas2/22.jpeg",
    "./assets/images/canvas2/23.jpeg",
    "./assets/images/canvas2/24.jpeg",
    "./assets/images/canvas2/25.jpeg",
    "./assets/images/canvas2/26.jpeg",
    "./assets/images/canvas2/27.jpeg",
    "./assets/images/canvas2/28.jpeg",
    "./assets/images/canvas2/29.jpeg",
    "./assets/images/canvas2/30.jpeg",
    "./assets/images/canvas2/31.jpeg",
    "./assets/images/canvas2/32.jpeg",
    "./assets/images/canvas2/33.jpeg",
    "./assets/images/canvas2/34.jpeg",
    "./assets/images/canvas2/35.jpeg",
    "./assets/images/canvas2/36.jpeg",
    "./assets/images/canvas2/37.jpeg",
    "./assets/images/canvas2/38.jpeg",
    "./assets/images/canvas2/39.jpeg",
    "./assets/images/canvas2/40.jpeg",
    "./assets/images/canvas2/41.jpeg",
    "./assets/images/canvas2/42.jpeg",
    "./assets/images/canvas2/43.jpeg",
    "./assets/images/canvas2/44.jpeg",
    "./assets/images/canvas2/45.jpeg",
    "./assets/images/canvas2/46.jpeg",
    "./assets/images/canvas2/47.jpeg",
    "./assets/images/canvas2/48.jpeg",
    "./assets/images/canvas2/49.jpeg",
    "./assets/images/canvas2/50.jpeg",
    "./assets/images/canvas2/51.jpeg",
    "./assets/images/canvas2/52.jpeg",
    "./assets/images/canvas2/53.jpeg",
    "./assets/images/canvas2/54.jpeg",
    "./assets/images/canvas2/55.jpeg",
    "./assets/images/canvas2/56.jpeg",
    "./assets/images/canvas2/57.jpeg",
    "./assets/images/canvas2/58.jpeg",
    "./assets/images/canvas2/59.jpeg",
    "./assets/images/canvas2/60.jpeg",
    "./assets/images/canvas2/61.jpeg",
    "./assets/images/canvas2/62.jpeg",
    "./assets/images/canvas2/63.jpeg",
    "./assets/images/canvas2/64.jpeg",
    "./assets/images/canvas2/65.jpeg",
    "./assets/images/canvas2/66.jpeg",
    "./assets/images/canvas2/67.jpeg",
    "./assets/images/canvas2/68.jpeg",
    "./assets/images/canvas2/69.jpeg",
    "./assets/images/canvas2/70.jpeg",
    "./assets/images/canvas2/71.jpeg",
    "./assets/images/canvas2/72.jpeg",
    "./assets/images/canvas2/73.jpeg",
    "./assets/images/canvas2/74.jpeg",
    "./assets/images/canvas2/75.jpeg",
    "./assets/images/canvas2/76.jpeg",
    "./assets/images/canvas2/77.jpeg",
    "./assets/images/canvas2/78.jpeg",
    "./assets/images/canvas2/79.jpeg",
    "./assets/images/canvas2/80.jpeg",
    "./assets/images/canvas2/81.jpeg",
    "./assets/images/canvas2/82.jpeg",
    "./assets/images/canvas2/83.jpeg",
    "./assets/images/canvas2/84.jpeg",
    "./assets/images/canvas2/85.jpeg",
    "./assets/images/canvas2/86.jpeg",
    "./assets/images/canvas2/87.jpeg",
    "./assets/images/canvas2/88.jpeg",
    "./assets/images/canvas2/89.jpeg",
    "./assets/images/canvas2/90.jpeg",
    "./assets/images/canvas2/91.jpeg",
    "./assets/images/canvas2/92.jpeg",
    "./assets/images/canvas2/93.jpeg",
    "./assets/images/canvas2/94.jpeg",
    "./assets/images/canvas2/95.jpeg",
    "./assets/images/canvas2/96.jpeg",
    "./assets/images/canvas2/97.jpeg",
    "./assets/images/canvas2/98.jpeg",
    "./assets/images/canvas2/99.jpeg",
    "./assets/images/canvas2/100.jpeg",
    "./assets/images/canvas2/101.jpeg",
    "./assets/images/canvas2/102.jpeg",
    "./assets/images/canvas2/103.jpeg",
    "./assets/images/canvas2/104.jpeg",
    "./assets/images/canvas2/105.jpeg",
    "./assets/images/canvas2/106.jpeg",
    "./assets/images/canvas2/107.jpeg",
    "./assets/images/canvas2/108.jpeg",
    "./assets/images/canvas2/109.jpeg",
    "./assets/images/canvas2/110.jpeg",
    "./assets/images/canvas2/111.jpeg",
    "./assets/images/canvas2/112.jpeg",
    "./assets/images/canvas2/113.jpeg",
    "./assets/images/canvas2/114.jpeg",
    "./assets/images/canvas2/115.jpeg",
    "./assets/images/canvas2/116.jpeg",
    "./assets/images/canvas2/117.jpeg",
    "./assets/images/canvas2/118.jpeg",
    "./assets/images/canvas2/119.jpeg",
    "./assets/images/canvas2/120.jpeg",
    "./assets/images/canvas2/121.jpeg",
    "./assets/images/canvas2/122.jpeg",
    "./assets/images/canvas2/123.jpeg",
    "./assets/images/canvas2/124.jpeg",
    "./assets/images/canvas2/125.jpeg",
    "./assets/images/canvas2/126.jpeg",
    "./assets/images/canvas2/127.jpeg",
    "./assets/images/canvas2/128.jpeg",
    "./assets/images/canvas2/129.jpeg",
    "./assets/images/canvas2/130.jpeg",
    "./assets/images/canvas2/131.jpeg",
    "./assets/images/canvas2/132.jpeg",
    "./assets/images/canvas2/133.jpeg",
    "./assets/images/canvas2/134.jpeg",
    "./assets/images/canvas2/135.jpeg",
    "./assets/images/canvas2/136.jpeg",
    "./assets/images/canvas2/137.jpeg",
    "./assets/images/canvas2/138.jpeg",
    "./assets/images/canvas2/139.jpeg",
    "./assets/images/canvas2/140.jpeg",
    "./assets/images/canvas2/141.jpeg",
    "./assets/images/canvas2/142.jpeg",
    "./assets/images/canvas2/143.jpeg",
    "./assets/images/canvas2/144.jpeg",
    "./assets/images/canvas2/145.jpeg",
    "./assets/images/canvas2/146.jpeg",
    "./assets/images/canvas2/147.jpeg",
    "./assets/images/canvas2/148.jpeg",
    "./assets/images/canvas2/149.jpeg",
    "./assets/images/canvas2/150.jpeg",
    "./assets/images/canvas2/151.jpeg",
    "./assets/images/canvas2/152.jpeg",
    "./assets/images/canvas2/153.jpeg",
    "./assets/images/canvas2/154.jpeg",
    "./assets/images/canvas2/155.jpeg",
    "./assets/images/canvas2/156.jpeg",
    "./assets/images/canvas2/157.jpeg",
    "./assets/images/canvas2/158.jpeg",
    "./assets/images/canvas2/159.jpeg",
    "./assets/images/canvas2/160.jpeg",
    "./assets/images/canvas2/161.jpeg",
    "./assets/images/canvas2/162.jpeg",
    "./assets/images/canvas2/163.jpeg",
    "./assets/images/canvas2/164.jpeg",
    "./assets/images/canvas2/165.jpeg",
    "./assets/images/canvas2/166.jpeg",
    "./assets/images/canvas2/167.jpeg",
    "./assets/images/canvas2/168.jpeg",
    "./assets/images/canvas2/169.jpeg",
    "./assets/images/canvas2/170.jpeg",
    "./assets/images/canvas2/171.jpeg",
    "./assets/images/canvas2/172.jpeg",
    "./assets/images/canvas2/173.jpeg",
    "./assets/images/canvas2/174.jpeg",
    "./assets/images/canvas2/175.jpeg",
    "./assets/images/canvas2/176.jpeg",
    "./assets/images/canvas2/177.jpeg",
    "./assets/images/canvas2/178.jpeg",
    "./assets/images/canvas2/179.jpeg",
    "./assets/images/canvas2/180.jpeg",
    "./assets/images/canvas2/181.jpeg",
    "./assets/images/canvas2/182.jpeg",
    "./assets/images/canvas2/183.jpeg",
    "./assets/images/canvas2/184.jpeg",
    "./assets/images/canvas2/185.jpeg",
    "./assets/images/canvas2/186.jpeg",
    "./assets/images/canvas2/187.jpeg",
    "./assets/images/canvas2/188.jpeg",
    "./assets/images/canvas2/189.jpeg",
    "./assets/images/canvas2/190.jpeg",
    "./assets/images/canvas2/191.jpeg",
    "./assets/images/canvas2/192.jpeg",
    "./assets/images/canvas2/193.jpeg",
    "./assets/images/canvas2/194.jpeg",
    "./assets/images/canvas2/195.jpeg",
    "./assets/images/canvas2/196.jpeg",
    "./assets/images/canvas2/197.jpeg",
  ],
  triggerElement: "#design-canvas",
  startTrigger: "top top",
  endTrigger: "top -300%",
  pinCanvas: true,
};

const canvas2Final = new CreateCanvas(canvas2FinalConfig);
const canvas2Initial = new CreateCanvas(canvas2InitialConfig);

const designCanvasTextTimeline = gsap.timeline({
  ease: "power2.in",
  scrollTrigger: {
    trigger: "#design-canvas",
    scroller: "body",
    start: "top 5%",
    end: "top -300%",
    scrub: true,
  },
});

designCanvasTextTimeline
  .to("#design-canvas-texts p:nth-child(1)", {
    zIndex: 2,
    opacity: 1,
    y: 0,
    duration: 0.25,
  })
  .to("#design-canvas-texts p:nth-child(1)", {
    opacity: 0,
    zIndex: 1,
    duration: 0.1,
  })
  .to(
    "#design-canvas-texts p:nth-child(2)",
    {
      zIndex: 2,
      y: 0,
      opacity: 1,
      duration: 0.25,
    },
    "+=100%"
  )
  .to("#design-canvas-texts p:nth-child(2)", {
    opacity: 0,
    zIndex: 1,
    duration: 0.1,
  })
  .to(
    "#design-canvas-texts p:nth-child(3)",
    {
      zIndex: 2,
      y: 18,
      opacity: 1,
      duration: 0.25,
    },
    "+=100%"
  )
  .to("#design-canvas-texts p:nth-child(3)", {
    opacity: 0,
    zIndex: 1,
    duration: 0.1,
  })
  .to(
    "#design-canvas-texts p:nth-child(4)",
    {
      zIndex: 2,
      y: 0,
      opacity: 1,
      duration: 0.25,
    },
    "+=200%"
  )
  .to("#design-canvas-texts p:nth-child(4)", {
    opacity: 0,
    zIndex: 1,
    duration: 0.1,
  })
  .to(
    "#design-canvas-texts p:nth-child(5)",
    {
      zIndex: 2,
      y: 0,
      opacity: 1,
      duration: 0.25,
    },
    "+=100%"
  )
  .to("#design-canvas-texts p:nth-child(5)", {
    opacity: 0,
    zIndex: 1,
    duration: 0.1,
  })
  .to(
    "#design-canvas-texts p:nth-child(6)",
    {
      zIndex: 2,
      y: 0,
      opacity: 1,
      duration: 0.25,
    },
    "+=100%"
  )
  .to("#design-canvas-texts p:nth-child(6)", {
    opacity: 0,
    zIndex: 1,
    duration: 0.1,
  });

const designCloseVideo = document.querySelector("#design-close-video");

ScrollTrigger.create({
  trigger: designCloseVideo,
  scroller: "body",
  start: "bottom -95%",
  end: "bottom -300%",
  onEnter: () => {
    playVideo(designCloseVideo);
  },
  onEnterBack: () => {
    playVideo(designCloseVideo);
  },
  onLeave: () => {
    designCloseVideo.pause();
  },
  onLeaveBack: () => {
    designCloseVideo.pause();
  },
});

// ------------- VisionOS Section --------------

// headingVideoAnimation("#vision-main", "#vision-video", "#vision-heading");

// Swiper Slider
let visionSlider = new Swiper(".swiper-slider", {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

ScrollTrigger.refresh();
