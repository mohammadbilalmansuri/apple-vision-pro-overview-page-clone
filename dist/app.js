(() => {
  lenis = new Lenis();
  gsap.registerPlugin(ScrollTrigger);
  lenis.on("scroll", ScrollTrigger.update);

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  function debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  const header = document.querySelector("header");
  let headerHeight = header.offsetHeight;
  const popupBtn = document.getElementById("popup-btn");
  let isPopupOpen = false;
  const headerDiv = document.getElementById("header-div");

  function togglePopup() {
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
      headerDiv.classList.remove(
        "bg-gray-3/80",
        "dark:bg-black/80",
        "shadow-sm"
      );

      gsap.to(headerDiv, {
        height: headerHeight,
        duration: 0.3,
        onComplete: () => {
          window.removeEventListener("scroll", onPopupOpenScrollHandler);
          isPopupOpen = false;
        },
      });
    }
  }

  const onPopupOpenScrollHandler = () => isPopupOpen && togglePopup();
  popupBtn.addEventListener("click", debounce(togglePopup, 200));

  // NOT CALLED
  function setHeaderColorChangeAnimation() {
    ScrollTrigger.create({
      trigger: "#technology",
      scroller: "body",
      start: `top ${headerHeight}`,
      end: "bottom top",
      markers: true,
      onEnter: () => {
        document.documentElement.classList.add("dark");
      },
      onLeaveBack: () => {
        document.documentElement.classList.remove("dark");
      },
      onEnterBack: () => {
        document.documentElement.classList.add("dark");
      },
      onLeave: () => {
        document.documentElement.classList.remove("dark");
      },
    });
  }

  // Helper function to play video and catch error if occurs while playing video
  function playVideo(videoElement, currentTime) {
    if (!(videoElement instanceof HTMLVideoElement)) {
      console.error("Invalid video element provided.");
      return;
    }

    if (currentTime && typeof currentTime === "number")
      videoElement.currentTime = currentTime;

    videoElement.play().catch((error) => console.log(error));
  }

  // Play/Pause video and change button SVG path
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

  // Event for play/pause video from button
  document.querySelectorAll(".play-pause").forEach((button) => {
    button.addEventListener("click", () => {
      const video = button.parentElement.querySelector("video");
      toggleVideoPlayPause(video, video.paused, button);
    });
  });

  const mediaQuery = window.matchMedia("(min-width: 1240px)");

  // Hero Section Vide
  function setHeroVideoLoop() {
    if (!mediaQuery.matches) return;
    const heroVideo = document.getElementById("hero-video");
    heroVideo.addEventListener("ended", () => playVideo(heroVideo, 5));
  }

  // Foundation and Intro Section
  function setFoundationAndIntroAnimation() {
    const foundationVideo = document.getElementById("foundation-video");
    const foundationPlayPauseButton =
      foundationVideo.parentElement.querySelector(".play-pause");
    const introVideo = document.querySelector("#intro-video");

    if (mediaQuery.matches) {
      ScrollTrigger.create({
        trigger: "#foundation",
        scroller: "body",
        start: "top 75%",
        end: "top 75%",
        onEnter: () =>
          toggleVideoPlayPause(
            foundationVideo,
            true,
            foundationPlayPauseButton
          ),
        onLeaveBack: () =>
          toggleVideoPlayPause(
            foundationVideo,
            false,
            foundationPlayPauseButton
          ),
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
    } else {
      ScrollTrigger.create({
        trigger: "#foundation-video",
        scroller: "body",
        start: "top 80%",
        end: `bottom ${headerHeight}`,
        onEnter: () =>
          toggleVideoPlayPause(
            foundationVideo,
            true,
            foundationPlayPauseButton
          ),
        onLeaveBack: () =>
          toggleVideoPlayPause(
            foundationVideo,
            false,
            foundationPlayPauseButton
          ),
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
      });

      introVideo.playbackRate = 2;
      introVideo.setAttribute("autoplay", "");
    }
  }

  // Experience Sections Video Heading Animation
  function videoHeadingAnimation(sectionSelector) {
    if (!sectionSelector) {
      console.error("Section selector not provided");
      return;
    }

    const video = document.querySelector(`${sectionSelector} video`);
    const playPauseButton = document.querySelector(
      `${sectionSelector} .play-pause`
    );

    if (mediaQuery.matches) {
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

      const videoText = document.querySelector(
        `${sectionSelector} .video-text`
      );
      if (videoText) {
        gsap.to(videoText, {
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
    } else {
      ScrollTrigger.create({
        trigger: `${sectionSelector} video`,
        scroller: "body",
        start: "top 80%",
        end: `bottom ${headerHeight}`,
        onEnter: () => toggleVideoPlayPause(video, true, playPauseButton),
        onLeaveBack: () => toggleVideoPlayPause(video, false, playPauseButton),
        onLeave: () => toggleVideoPlayPause(video, false, playPauseButton),
        onEnterBack: () => toggleVideoPlayPause(video, true, playPauseButton),
      });
    }
  }

  // Setup All Video Heading Animations
  function setVideoHeadingsAnimation() {
    [
      "#entertainment",
      "#productivity",
      "#photos-videos",
      "#connection",
      "#apps",
      "#visionOS",
    ].forEach((sectionSelector) => videoHeadingAnimation(sectionSelector));
  }

  // Design Section Canvas Animations
  function setDesignSectionCanvasAnimation() {
    const canvasElem = document.getElementById("design-canvas");
    const context = canvasElem.getContext("2d");

    const setCanvasSize = () => {
      const canvas = context.canvas;
      canvas.width = canvasElem.offsetWidth;
      canvas.height = canvasElem.offsetHeight;
    };

    setCanvasSize();

    const imageUrls = Array.from(
      { length: 198 },
      (_, i) =>
        `https://res.cloudinary.com/samaxy/image/upload/applevisionpro/images/design/${i}.webp`
    );

    const images = new Map();
    const imageSeq = { frame: 0 };

    const headerHeight = document.querySelector("header")?.offsetHeight || 100;

    const debounce = (func, delay) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
      };
    };

    ScrollTrigger.create({
      trigger: "#design",
      scroller: "body",
      start: "top bottom",
      end: "top bottom",
      onEnter: async () => {
        const promises = imageUrls.map(
          (src) =>
            new Promise((resolve) => {
              const img = new Image();
              img.src = src;
              img.onload = () => resolve(img);
            })
        );

        const loadedImages = await Promise.all(promises);
        loadedImages.forEach((img, index) => images.set(index, img));
        requestAnimationFrame(render);
      },
    });

    function render() {
      const img = images.get(imageSeq.frame) || images.get(0);
      if (img) drawImageOnCanvas(img);
    }

    function drawImageOnCanvas(img) {
      const canvas = context.canvas;
      const ratio = Math.max(
        canvas.width / img.width,
        canvas.height / img.height
      );
      const shiftX = (canvas.width - img.width * ratio) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        shiftX,
        0,
        img.width * ratio,
        img.height * ratio
      );
    }

    // Frame 0 to 20
    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#design-canvas-div",
          scroller: "body",
          start: "top bottom",
          end: `top ${headerHeight}`,
          scrub: true,
          onUpdate: () => requestAnimationFrame(render),
        },
      })
      .to(
        imageSeq,
        {
          frame: 20,
          snap: "frame",
          ease: "none",
        },
        "initial"
      )
      .from(
        "#design-canvas",
        {
          scale: 0.8,
          ease: "none",
        },
        "initial"
      );

    // Frame 21 to Last Frame
    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#design-canvas-div",
          scroller: "body",
          start: `top ${headerHeight}`,
          end: "top -600%",
          scrub: true,
          pin: true,
          onUpdate: () => requestAnimationFrame(render),
        },
      })
      .to(imageSeq, {
        frame: 197,
        snap: "frame",
        ease: "none",
      });

    let lastWidth = window.innerWidth;
    new ResizeObserver(() => {
      debounce(() => {
        const currentWidth = window.innerWidth;
        if (lastWidth !== currentWidth) {
          lastWidth = currentWidth;
          setCanvasSize();
          requestAnimationFrame(render);
        }
      }, 100);
    }).observe(document.body);
  }

  function initializeSectionLogic() {
    // setHeaderColorChangeAnimation();
    setHeroVideoLoop();
    setFoundationAndIntroAnimation();
    setVideoHeadingsAnimation();
    setDesignSectionCanvasAnimation();
    ScrollTrigger.refresh();
  }

  // Reset Function: Clears State and Re-initializes Everything
  const resetApp = () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    document
      .querySelectorAll(".pin-spacer")
      .forEach((spacer) => spacer.remove());
    ScrollTrigger.refresh();
    initializeSectionLogic();
  };

  mediaQuery.addEventListener("change", resetApp);
  initializeSectionLogic();
})();
