$(document).ready(function () {
  $("#navigation nav").slimNav_sk78();
  $("#nav-icon0").click(function () {
    $(this).toggleClass("open");
  });

  // banner
  var owl = $(".banner-section .owl-carousel");
  owl.owlCarousel({
    items: 1,
    loop: true,
    autoplay: true,
    nav: false,
    dots: true,
    // dotsContainer: '#custom-owl-dots',
    animateIn: "fadeIn", // add this
    animateOut: "fadeOut", // and this
    //   navText: [
    //     '<img src="images/prev.svg" alt="">',
    //     '<img src="images/next.svg" alt="">'
    // ],

    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },

      1000: {
        items: 1,
      },
    },
  });

  AOS.init({
    duration: 1000,
    once: true,
    offset: 200, // Increase this to prevent early triggers
    startEvent: "load", // Wait for the window load event
  });

  setTimeout(() => {
    document.body.classList.add("menu-delay-active");
  }, 4000);
});

let SwiperTop = new Swiper(".swiper--top", {
  // 1. Use Swiper's spaceBetween for the gap (3.75rem = 60px)
  spaceBetween: 60,

  centeredSlides: true,

  // 2. Increase speed significantly (e.g., 5000ms). Faster speeds amplify jitter.
  speed: 5000,

  autoplay: {
    // 3. Set a small, but not *too* small, delay.
    //    10ms or 50ms is more stable than 1ms.
    delay: 50,

    // 4. CRITICAL: Prevents Swiper from pausing after a loop jump.
    //    This is often the main cause of the start/stop inconsistency.
    disableOnInteraction: false,
  },

  loop: true,
  slidesPerView: "auto",
  allowTouchMove: false,
});

let blogSwiper = new Swiper(".blogSwiper", {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  slidesPerGroup: 1, // Moves one by one
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

let chaosSwiper = new Swiper(".chaosSwiper", {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: false,
  slidesPerGroup: 1, // Moves one by one
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

function initHorizontalScroll() {
  const section = document.querySelector(".family-law-strategist");
  const slidesContainer = document.querySelector(
    ".family-law-strategist .slides"
  );
  const slides = gsap.utils.toArray(".family-law-strategist .slide");

  if (!section || !slidesContainer || slides.length === 0) return;

  let ctx = gsap.context(() => {
    const calculateDistance = () => {
      const lastSlide = slides[slides.length - 1];
      const lastSlideRight = lastSlide.offsetLeft + lastSlide.offsetWidth;
      const viewportWidth = window.innerWidth;
      return lastSlideRight - viewportWidth;
    };

    let scrollDistance = calculateDistance();

    gsap.to(slidesContainer, {
      x: -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => "+=" + scrollDistance,
        invalidateOnRefresh: true,
        // HIGHER PRIORITY: Calculate this first so lower sections shift down correctly
        refreshPriority: -1, // Wait for the horizontal pin calculation
        onUpdate: (self) => {
          // Optional: If AOS still trips, you can force a refresh during scroll
        },
      },
    });
  });
}

// Update the global scroll refresh
window.addEventListener("load", () => {
  setTimeout(() => {
    initHorizontalScroll();

    // Tell AOS to listen to ScrollTrigger's refresh
    ScrollTrigger.addEventListener("refresh", () => AOS.refresh());
    ScrollTrigger.refresh();
  }, 200);
});

window.addEventListener("load", () => {
  const menu = document.querySelector(".menu-outer .menu");
  const spans = document.querySelectorAll(".menu-outer .menu-inner span");
  const nav = document.querySelector(".menu-outer nav");

  // Initial nav state
  gsap.set(nav, { y: -50, opacity: 0 });

  // Timeline
  const tl = gsap.timeline({ paused: true });

  // STEP 1: normalize widths when opening
  tl.to(
    spans,
    {
      width: 70, // SAME WIDTH FOR PERFECT X
      duration: 0.35,
      ease: "power2.inOut",
    },
    0
  );

  // STEP 2: form the X
  tl.to(
    spans[0],
    {
      rotation: 45,
      y: 14,
      backgroundColor: "#ffffff",
      duration: 0.6,
      ease: "power2.inOut",
    },
    0.15
  );

  tl.to(
    spans[1],
    {
      rotation: -45,
      y: -11,
      backgroundColor: "#ffffff",
      duration: 0.6,
      ease: "power2.inOut",
    },
    0.15
  );

  // STEP 3: nav reveal
  tl.to(
    nav,
    {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: "power2.inOut",
    },
    0.3
  ).to(
    nav,
    {
      y: 0,
      duration: 0.4,
      ease: "power2.inOut",
    },
    0.3
  );

  //! Toggle
  let isOpen = false;
  const menuOuter = document.querySelector(".menu-outer");
  menu.addEventListener("click", () => {
    isOpen ? tl.reverse() : tl.play();
    menuOuter.classList.toggle("active", !isOpen);
    isOpen = !isOpen;
  });

  //! Mask reveal
  gsap.fromTo(
    ".maskbox",
    { height: 0 },
    {
      height: "13.375rem",
      duration: 1.4,
      ease: "expo.out",
      delay: 2, // ✅ 5 second delay
      scrollTrigger: {
        trigger: ".maskbox",
        start: "top 80%",
        once: true,
      },
    }
  );

  //! slice
  //! slice (Chaos Section)
  const masterTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".chaos",
      // CHANGE: start only when the top of .chaos hits the bottom of the viewport
      // OR better yet, use "top bottom" to ensure it starts exactly as it enters
      start: "top bottom-=100",
      toggleActions: "play none none none",
      // This ensures ScrollTrigger recalculates positions after the pin above is set
      refreshPriority: -1,
    },
  });

  // ===== IMAGE SLICE =====
  masterTL
    .to(
      ".chaos .imgbx .mask",
      {
        height: "100%",
        duration: 1.2,
        ease: "power2.out",
      },
      0
    )
    .to(
      ".chaos .imgbx .mask",
      {
        width: 681,
        duration: 1,
        ease: "power3.inOut",
      },
      1.3
    );

  // ===== TEXT SLIDER =====
  masterTL
    .to(
      ".textslider-mask",
      {
        height: "37.125rem",
        duration: 1.2,
        ease: "power2.out",
      },
      0
    )
    .to(
      ".textslider-mask",
      {
        width: 417,
        duration: 1,
        ease: "power3.inOut",
      },
      1.3
    );

  const section = document.querySelector(".public-speaking");
  const light = document.querySelector(".lightsouter");
  const imgBlock = document.querySelector(".imgblock"); // The woman
  const stage = document.querySelector(".stage"); // The stage
  const heading = document.querySelector(
    ".public-speaking .heading1:nth-child(2)"
  );

  // Check if all elements exist
  if (!heading || !light || !section || !imgBlock || !stage) return;

  // 1. Wrap the 'O' in ADVOCACY
  heading.innerHTML = heading.innerHTML.replace(
    "ADVOCACY",
    'ADVC<span class="o-anchor">O</span>ACY'
  );

  const oAnchor = heading.querySelector(".o-anchor");

  // 2. Move all elements INSIDE the 'O' span
  // They will now follow the AOS movement perfectly
  oAnchor.appendChild(light);
  oAnchor.appendChild(imgBlock);
  oAnchor.appendChild(stage);

  // 3. GSAP Animation Sequence
  const lightAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: ".public-speaking",
      start: "top 60%",
      toggleActions: "play none none none",
    },
  });

  lightAnimation
    .to(".spanbg", {
      opacity: 1,
      width: "100%",
      height: "100%",
      duration: 1.5, // Made slightly longer for high-end feel
      ease: "power3.inOut",
    })
    .to(
      ".lightsouter",
      {
        height: "527px",
        duration: 1.5,
        ease: "power2.out",
      },
      "-=0.7"
    )
    .from(
      [imgBlock, stage],
      {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out",
      },
      "-=0.8"
    );

  //! Animation for the Background Expansion
});

// ! lines

createAnimatedLine({
  section: ".heading",
  heading: "h1",
  targetSpan: "h1 span:first",
  lineId: "line-b",
  leftOffset: 9,
  heightOffset: 15,
  triggerClass: "menu-delay-active",
  backgroundColor: "#DB4A2F",
  position: "absolute",
  direction: "vertical",
  thickness: 1,
});

createAnimatedLine({
  section: ".heading",
  heading: "h1",
  targetSpan: "h1 span:first",
  lineId: "line-b-horizontal",
  // leftOffset: -100,
  offsetTop: -15,
  offsetLeft: -100,
  triggerClass: "menu-delay-active",
  backgroundColor: "#3363E8",
  position: "absolute",
  direction: "horizontal",
  thickness: 1,
  duration: 800,
  toScreenEdge: "right",
});
createAnimatedLine({
  section: ".heading",
  heading: "h1",
  targetSpan: "h1 span:nth-child(2)",
  lineId: "line-b1-horizontal",
  offsetTop: -15,
  offsetLeft: -100,
  triggerClass: "menu-delay-active",
  backgroundColor: "#3363E8",
  position: "absolute",
  direction: "horizontal",
  thickness: 1,
  duration: 800,
  toScreenEdge: "right",
});

createAnimatedLine({
  section: ".banner .img-sec",
  anchor: ".lady-img",
  lineId: "img-sec-line",

  triggerType: "scroll",
  scrollOffset: -100,

  direction: "horizontal",
  useSectionBottom: true,
  toScreenEdge: "left",

  thickness: 1,
  backgroundColor: "#3363E8",

  heightOffset: 70,
  offsetLeft: 100, // start slightly inside image
  offsetTop: 0,

  extraWidth: 200,
  freeWidth: null,

  duration: 1200,
});

// !scroll line
function createScrollLine(config) {
  const {
    section,
    anchor,
    target,
    lineId,

    thickness = 2,
    backgroundColor = "#3363E8",

    offsetLeft = 0,
    fixedTop = null,
    extraHeight = 0,

    scrollOffset = 0,
    triggerClass = "menu-delay-active", // 🔥 REQUIRED BODY CLASS
  } = config;

  let hasAnimated = false;
  let isAllowedToStart = false;
  let $line = null;

  function buildAndAnimate() {
    if (hasAnimated || !isAllowedToStart) return;

    const $anchor = $(anchor).first();
    const $target = $(target).first();
    const $section = $(section).first();

    if (!$anchor.length || !$target.length || !$section.length) return;

    $("#" + lineId).remove();

    const anchorOffset = $anchor.offset();
    const anchorWidth = $anchor.outerWidth();
    const targetOffset = $target.offset();

    /* ===== START POSITION ===== */
    const startTop =
      fixedTop !== null
        ? parseFloat(fixedTop)
        : anchorOffset.top + $anchor.outerHeight() / 2;

    const leftPos = anchorOffset.left + anchorWidth / 2 + offsetLeft;

    /* ===== FINAL HEIGHT ===== */
    const finalHeight = targetOffset.top - startTop + extraHeight;

    /* ===== CREATE LINE ===== */
    $line = $("<div>", { id: lineId }).css({
      position: "absolute",
      left: leftPos + "px",
      top: startTop + "px",
      width: thickness + "px",
      height: 0,
      backgroundColor,
      zIndex: 10,
      pointerEvents: "none",
    });

    $("body").append($line);

    /* ===== SCROLL GROW ===== */
    const onScroll = () => {
      const scrollBottom = $(window).scrollTop() + $(window).height();
      const triggerTop = $section.offset().top + scrollOffset;

      if (scrollBottom >= triggerTop) {
        const progress = Math.min(1, (scrollBottom - startTop) / finalHeight);

        if (progress > 0) {
          $line.css("height", finalHeight * progress);
        }

        if (progress >= 1) {
          $(window).off("scroll", onScroll);
        }
      }
    };

    $(window).on("scroll", onScroll);
    onScroll();

    hasAnimated = true;
  }

  /* ===============================
     WAIT FOR BODY CLASS
  ================================ */
  const bodyObserver = new MutationObserver(() => {
    if ($("body").hasClass(triggerClass)) {
      isAllowedToStart = true;
      buildAndAnimate();
      bodyObserver.disconnect();
    }
  });

  bodyObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  /* ===============================
     RESIZE REBUILD
  ================================ */
  $(window).on("resize", () => {
    if (!isAllowedToStart) return;
    hasAnimated = false;
    buildAndAnimate();
  });
}

createScrollLine({
  section: ".steelyard",
  anchor: ".steelyard",
  target: ".making-sense .making-top span:nth-child(2)",
  lineId: "steelyard-to-making-line",

  thickness: 1,
  backgroundColor: "#3363E8",

  offsetLeft: 0,
  fixedTop: 378, // 🔥 exact start
  extraHeight: 0,

  scrollOffset: 0,
  triggerClass: "menu-delay-active",
});

// ! --------------------------------------

function createSurvivorTimeLine(config) {
  const {
    section,
    anchor,
    target,
    lineId,

    thickness = 1,
    backgroundColor = "#3363E8",

    offsetLeft = 0,
    extraHeight = 0,
    touchOffset = 0,

    duration = 1200,
  } = config;

  let hasAnimated = false;

  function buildAndAnimate() {
    if (hasAnimated) return;

    $("#" + lineId).remove();

    const $anchor = $(anchor);
    const $target = $(target);

    if (!$anchor.length || !$target.length) return;

    /* ===== FORCE LAYOUT FLUSH (AOS) ===== */
    $target[0].getBoundingClientRect();

    /* ===== START POSITION ===== */
    const anchorOffset = $anchor.offset();
    const startTop = anchorOffset.top;
    const leftPos = anchorOffset.left + offsetLeft;

    /* ===== TARGET VISUAL TOP (AOS SAFE) ===== */
    const rect = $target[0].getBoundingClientRect();
    const style = window.getComputedStyle($target[0]);
    const matrix = new DOMMatrixReadOnly(style.transform);
    const translateY = matrix.m42 || 0;

    const targetTop = rect.top + window.scrollY + translateY + touchOffset;

    const finalHeight = targetTop - startTop + extraHeight;

    if (finalHeight <= 0) return;

    /* ===== CREATE LINE ===== */
    const $line = $("<div>", { id: lineId }).css({
      position: "absolute",
      top: startTop + "px",
      left: leftPos + "px",
      width: thickness + "px",
      height: 0,
      backgroundColor,
      zIndex: 10,
      pointerEvents: "none",
    });

    $("body").append($line);

    /* ===== TIME-BASED ANIMATION ===== */
    $line.animate({ height: finalHeight }, duration, "swing");

    hasAnimated = true;
  }

  /* ===============================
     WAIT FOR AOS
  ================================ */
  function waitForAOS() {
    const $target = $(target);

    if ($target.hasClass("aos-animate")) {
      buildAndAnimate();
      return;
    }

    document.addEventListener(
      "aos:in",
      function (e) {
        if ($(e.detail).is($target)) {
          buildAndAnimate();
        }
      },
      { once: true }
    );

    // safety fallback
    setTimeout(buildAndAnimate, 900);
  }

  /* ===============================
     WAIT FOR SECTION HALF VISIBLE
  ================================ */
  function onScroll() {
    if (hasAnimated) return;

    const $section = $(section);
    const scrollBottom = $(window).scrollTop() + $(window).height();
    const sectionMid = $section.offset().top + $section.outerHeight() / 2;

    if (scrollBottom >= sectionMid) {
      waitForAOS();
      $(window).off("scroll", onScroll);
    }
  }

  $(window).on("scroll", onScroll);
  onScroll();

  /* ===============================
     RESIZE RESET
  ================================ */
  $(window).on("resize", () => {
    hasAnimated = false;
    $("#" + lineId).remove();
    $(window).on("scroll", onScroll);
    onScroll();
  });
}

createSurvivorTimeLine({
  section: ".survivor",
  anchor: ".survivor .main-sec",
  target: ".survivor .main-sec .img",
  lineId: "survivor-scroll-line",

  thickness: 1,
  backgroundColor: "#db4a2f",

  offsetLeft: 0,
  touchOffset: 22, // 🔥 final fine-tune
  duration: 1200,
});

// ! --------------------------------------

function createSurvivorImageBottomLine(config) {
  const {
    section,
    image,
    lineId,

    thickness = 1,
    backgroundColor = "#3363E8",
    offsetBottom = 0,
    duration = 1200,
  } = config;

  let hasAnimated = false;
  let sectionVisible = false;
  let aosReady = false;

  /* ===============================
     CHECK SECTION HALF VISIBLE
  ================================ */
  function checkSectionVisibility() {
    const winBottom = $(window).scrollTop() + $(window).height();
    const $section = $(section);

    if (!$section.length) return;

    const sectionMid = $section.offset().top + $section.outerHeight() / 2;

    if (winBottom >= sectionMid) {
      sectionVisible = true;
      tryBuild();
      $(window).off("scroll", checkSectionVisibility);
    }
  }

  /* ===============================
     WAIT FOR AOS
  ================================ */
  function waitForAOS() {
    const $img = $(image);
    if (!$img.length) return;

    if ($img.hasClass("aos-animate")) {
      aosReady = true;
      tryBuild();
      return;
    }

    document.addEventListener(
      "aos:in",
      function (e) {
        if ($(e.detail).is($img)) {
          aosReady = true;
          tryBuild();
        }
      },
      { once: true }
    );

    // safety fallback
    setTimeout(() => {
      aosReady = true;
      tryBuild();
    }, 900);
  }

  /* ===============================
     BUILD & ANIMATE LINE
  ================================ */
  function tryBuild() {
    if (hasAnimated || !sectionVisible || !aosReady) return;

    const $img = $(image);
    if (!$img.length) return;

    $("#" + lineId).remove();

    /* === FORCE LAYOUT FLUSH === */
    $img[0].getBoundingClientRect();

    /* === AOS-safe position === */
    const rect = $img[0].getBoundingClientRect();
    const style = window.getComputedStyle($img[0]);
    const matrix = new DOMMatrixReadOnly(style.transform);
    const translateY = matrix.m42 || 0;

    const topPos =
      rect.top +
      window.scrollY +
      translateY +
      $img.outerHeight() +
      offsetBottom;

    const rightEdge = rect.left + window.scrollX + $img.outerWidth();

    if (rightEdge <= 0) return;

    /* === CREATE LINE === */
    const $line = $("<div>", { id: lineId }).css({
      position: "absolute",
      top: topPos + "px",
      left: rightEdge + "px",
      width: 0,
      height: thickness + "px",
      backgroundColor,
      zIndex: 10,
      pointerEvents: "none",
    });

    $("body").append($line);

    /* === TIME-BASED ANIMATION (RIGHT → LEFT) === */
    $line.animate(
      {
        width: rightEdge,
        left: 0,
      },
      duration,
      "swing"
    );

    hasAnimated = true;
  }

  /* ===============================
     INIT
  ================================ */
  $(window).on("scroll", checkSectionVisibility);
  checkSectionVisibility();
  waitForAOS();

  /* ===============================
     RESIZE RESET
  ================================ */
  $(window).on("resize", () => {
    hasAnimated = false;
    sectionVisible = false;
    aosReady = false;
    $("#" + lineId).remove();
    $(window).on("scroll", checkSectionVisibility);
    checkSectionVisibility();
    waitForAOS();
  });
}

createSurvivorImageBottomLine({
  section: ".survivor",
  image: ".survivor .img",
  lineId: "survivor-horizontal-line",

  thickness: 1,
  backgroundColor: "#3363E8",
  offsetBottom: 15,
  duration: 1200,
});

// ! ---------------

function createPodcastLine({
  sectionSelector = ".podcast-sec",
  lineId = "podcast-horizontal-line",
  thickness = 1,
  color = "#3363E8",
  topOffset = -20,
  duration = 1200,
}) {
  let lineCreated = false;

  function buildLine() {
    if (lineCreated) return;

    const section = document.querySelector(sectionSelector);
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const scrollLeft = window.scrollX || window.pageXOffset;

    const top = rect.top + scrollTop + topOffset;
    const startX = rect.right + scrollLeft;

    // remove old line
    const oldLine = document.getElementById(lineId);
    if (oldLine) oldLine.remove();

    // create line
    const line = document.createElement("div");
    line.id = lineId;
    line.classList.add("podcast-line");
    line.style.top = top + "px";
    line.style.left = startX + "px";
    line.style.width = "0px";
    line.style.height = thickness + "px";
    line.style.backgroundColor = color;
    line.style.position = absolute;

    // animate line after a frame
    setTimeout(() => {
      line.style.width = startX + "px"; // expand left
      line.style.left = "0px";
    }, 50);

    lineCreated = true;
  }

  function checkVisibility() {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    const scrollBottom = window.scrollY + window.innerHeight;
    const sectionMid = section.offsetTop + section.offsetHeight / 2;

    if (scrollBottom >= sectionMid) {
      buildLine();
      window.removeEventListener("scroll", checkVisibility);
    }
  }

  window.addEventListener("scroll", checkVisibility);
  checkVisibility();

  // resize
  window.addEventListener("resize", () => {
    lineCreated = false;
    const oldLine = document.getElementById(lineId);
    if (oldLine) oldLine.remove();
    checkVisibility();
  });
}

// Usage
createPodcastLine({
  sectionSelector: ".podcast-sec",
  lineId: "podcast-horizontal-line",
  thickness: 1,
  color: "#3363E8",
  topOffset: -20,
  duration: 1200,
});

// !-----------

function createVerticalLineFromChaosToPublic(config) {
  const {
    startSection = ".family-law-strategist .top-sec", // line start container
    anchor = ".chaos .textslider .chaos-cube", // get x-position from here
    targetSection = ".public-speaking", // line end
    lineId = "chaos-to-public-line",
    thickness = 2,
    color = "#3363E8",
    scrollOffset = 0, // optional scroll trigger offset
  } = config;

  let hasAnimated = false;

  function buildLine() {
    if (hasAnimated) return;

    const $start = $(startSection);
    const $anchor = $(anchor).first();
    const $target = $(targetSection).first();

    if (!$start.length || !$anchor.length || !$target.length) return;

    $("#" + lineId).remove();

    const anchorRect = $anchor[0].getBoundingClientRect();
    const anchorOffset = $anchor.offset();
    const startOffset = $start.offset();
    const targetOffset = $target.offset();

    const startX = anchorOffset.left + anchorRect.width / 2; // middle of anchor
    const startY = startOffset.top; // top of start section
    const endY = targetOffset.top; // top of target section
    const height = endY - startY;

    // create line
    const $line = $("<div>", { id: lineId }).css({
      position: "absolute",
      left: startX + "px",
      top: startY + "px",
      width: thickness + "px",
      height: 0,
      backgroundColor: color,
      zIndex: 20,
      pointerEvents: "none",
    });

    $("body").append($line);

    // animate height as user scrolls
    function onScroll() {
      const scrollBottom = $(window).scrollTop() + $(window).height();
      const triggerPoint = startY + scrollOffset;

      if (scrollBottom >= triggerPoint) {
        const progress = Math.min(1, (scrollBottom - triggerPoint) / height);
        $line.css("height", height * progress);
        if (progress >= 1) {
          $(window).off("scroll", onScroll);
        }
      }
    }

    $(window).on("scroll", onScroll);
    onScroll();

    hasAnimated = true;
  }

  // wait for section half visible
  function waitForVisibility() {
    const $start = $(startSection);
    const scrollBottom = $(window).scrollTop() + $(window).height();
    const sectionMid = $start.offset().top + $start.outerHeight() / 2;

    if (scrollBottom >= sectionMid) {
      buildLine();
      $(window).off("scroll", waitForVisibility);
    }
  }

  $(window).on("scroll", waitForVisibility);
  waitForVisibility();

  // resize recalculation
  $(window).on("resize", () => {
    hasAnimated = false;
    $("#" + lineId).remove();
    $(window).on("scroll", waitForVisibility);
    waitForVisibility();
  });
}

// Usage
createVerticalLineFromChaosToPublic({
  startSection: ".family-law-strategist .top-sec",
  anchor: ".chaos .textslider .chaos-cube",
  targetSection: ".public-speaking",
  lineId: "chaos-to-public-line",
  thickness: 2,
  color: "#3363E8",
});
