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

  setTimeout(() => {
    document.body.classList.add("menu-delay-active");
  }, 4000);
});

AOS.init({
  duration: 1000,
  once: true,
  offset: 200, // Increase this to prevent early triggers
  startEvent: "load", // Wait for the window load event
  disable: "mobile",
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
      start: "top 70%",
      toggleActions: "play none none none",
      // This ensures ScrollTrigger recalculates positions after the pin above is set
      refreshPriority: -1,
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
        delay: 0.2,
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

(function ($) {
  //! Functions for lines
  function initBrookeLine() {
    var $line = $(".brooke-line");

    function calculateCoords() {
      var $brooke = $(".heading h1 span").first();
      if (!$brooke.length) return null;

      var rect = $brooke[0].getBoundingClientRect();

      return {
        startX: rect.left + window.scrollX - 100,
        startY: rect.bottom + window.scrollY - 15,
        endX: window.innerWidth,
      };
    }

    function drawLine(animate) {
      var coords = calculateCoords();
      if (!coords) return;

      if (!$line.length) {
        $line = $('<div class="brooke-line"></div>')
          .css({
            position: "absolute",
            height: "1px",
            backgroundColor: "#3363e8",
            zIndex: 0,
            pointerEvents: "none",
          })
          .appendTo("body");
      }

      $line.stop(true).css({
        left: coords.startX,
        top: coords.startY,
      });

      if (animate) {
        $line.width(0).animate({ width: coords.endX - coords.startX }, 1200);
      } else {
        $line.width(coords.endX - coords.startX);
      }
    }

    drawLine(true);

    // 🔄 Update on resize
    $(window).on("resize.brooke", function () {
      drawLine(false);
    });
  }

  function initMasonLine() {
    var $line = $(".mason-line");

    function calculateCoords() {
      var $mason = $(".heading h1 span").eq(1);
      if (!$mason.length) return null;

      var rect = $mason[0].getBoundingClientRect();

      return {
        startX: rect.left + window.scrollX - 100,
        startY: rect.bottom + window.scrollY - 15,
        endX: window.innerWidth,
      };
    }

    function drawLine(animate) {
      var coords = calculateCoords();
      if (!coords) return;

      if (!$line.length) {
        $line = $('<div class="mason-line"></div>')
          .css({
            position: "absolute",
            height: "1px",
            backgroundColor: "#3363e8",
            zIndex: 0,
            pointerEvents: "none",
          })
          .appendTo("body");
      }

      $line.stop(true).css({
        left: coords.startX,
        top: coords.startY,
      });

      if (animate) {
        $line.width(0).animate({ width: coords.endX - coords.startX }, 1200);
      } else {
        $line.width(coords.endX - coords.startX);
      }
    }

    drawLine(true);

    // 🔄 Update on resize
    $(window).on("resize.mason", function () {
      drawLine(false);
    });
  }

  function initMasonVerticalLine() {
    var $line = $(".mason-vertical-line");

    function calculateCoords() {
      var $mason = $(".heading h1 span").eq(1);
      if (!$mason.length) return null;

      var rect = $mason[0].getBoundingClientRect();

      return {
        x: rect.left + window.scrollX - 14, // end of "M"
        topY: window.scrollY, // top of viewport
        bottomY: rect.bottom + window.scrollY - 15, // start near MASON
      };
    }

    function drawLine(animate) {
      var coords = calculateCoords();
      if (!coords) return;

      var height = coords.bottomY - coords.topY;

      if (!$line.length) {
        $line = $('<div class="mason-vertical-line"></div>')
          .css({
            position: "absolute",
            width: "1px",
            backgroundColor: "red",
            zIndex: 1,
            pointerEvents: "none",
          })
          .appendTo("body");
      }

      if (animate) {
        // 🔥 Start at bottom, grow upward
        $line
          .stop(true)
          .css({
            left: coords.x,
            top: coords.bottomY,
            height: 0,
          })
          .animate(
            {
              top: coords.topY,
              height: height,
            },
            1200
          );
      } else {
        // On resize, just update position
        $line.css({
          left: coords.x,
          top: coords.topY,
          height: height,
        });
      }
    }

    // ▶ Animate once on load
    drawLine(true);

    // 🔄 Update on resize (no animation)
    $(window).on("resize.masonVertical", function () {
      drawLine(false);
    });
  }

  function initLadyImageLeftLine() {
    var $line = $(".lady-left-line");

    function calculateCoords() {
      var $img = $(".lady-img");
      if (!$img.length) return null;

      var rect = $img[0].getBoundingClientRect();

      return {
        startX: rect.left + window.scrollX + 200, // image left edge
        endX: 0 + window.scrollX, // left screen edge
        y: rect.bottom + window.scrollY - 70, // bottom of image
      };
    }

    function drawLine(animate) {
      var coords = calculateCoords();
      if (!coords) return;

      var width = coords.startX - coords.endX;

      if (!$line.length) {
        $line = $('<div class="lady-left-line"></div>')
          .css({
            position: "absolute",
            height: "1px",
            backgroundColor: "#3363e8",
            zIndex: 1,
            pointerEvents: "none",
          })
          .appendTo("body");
      }

      if (animate) {
        // 🔥 Animate from image → left
        $line
          .stop(true)
          .css({
            left: coords.startX,
            top: coords.y,
            width: 0,
          })
          .animate(
            {
              left: coords.endX,
              width: width,
            },
            1200
          );
      } else {
        // Resize update (no animation)
        $line.css({
          left: coords.endX,
          top: coords.y,
          width: width,
        });
      }
    }

    // ▶ Animate once on load
    drawLine(true);

    // 🔄 Update on resize
    $(window).on("resize.ladyLeft", function () {
      drawLine(false);
    });
  }

  function initBrookeToMakingVerticalLine() {
    var $line = null;
    var phase1Done = false;
    var buffer = 150; // space from viewport bottom
    var phase1EndY = 0;

    function getBrookeCoords() {
      var $brooke = $(".heading h1 span").first();
      if (!$brooke.length) return null;
      var rect = $brooke[0].getBoundingClientRect();
      return {
        x: rect.right + window.scrollX,
        startY: rect.bottom + window.scrollY - 17,
      };
    }

    function getMakingTopY() {
      var $target = $(".making-top span").first();
      if (!$target.length) return null;
      var rect = $target[0].getBoundingClientRect();
      return rect.bottom + window.scrollY + 30;
    }

    function createLine(coords) {
      $line = $('<div class="brooke-making-line"></div>')
        .css({
          position: "absolute",
          left: coords.x - 85,
          top: coords.startY,
          width: "1px",
          height: 0,
          backgroundColor: "#3363e8",
          zIndex: 2,
          pointerEvents: "none",
        })
        .appendTo("body");
    }

    // PHASE 1: animate to viewport bottom minus buffer
    function animatePhase1() {
      var coords = getBrookeCoords();
      if (!coords) return;

      createLine(coords);

      var viewportBottom = window.scrollY + window.innerHeight - buffer;
      var height = viewportBottom - coords.startY;
      phase1EndY = coords.startY + height;

      $line.animate({ height: height }, 1200, function () {
        phase1Done = true;
      });
    }

    // PHASE 2: scroll-based growth, visible inside viewport
    function handleScrollGrow() {
      if (!phase1Done || !$line) return;

      var coords = getBrookeCoords();
      var targetY = getMakingTopY();
      if (!coords || !targetY) return;

      var viewportTop = $(window).scrollTop();
      var viewportBottom = viewportTop + $(window).height() - 150;

      // The line grows only while inside viewport
      var maxVisibleBottom = Math.min(targetY, viewportBottom);
      var newHeight = maxVisibleBottom - coords.startY;

      // ensure line never shrinks below Phase1 endpoint
      if (newHeight < phase1EndY - coords.startY)
        newHeight = phase1EndY - coords.startY;

      $line.height(newHeight);
    }

    // START PHASE 1
    animatePhase1();

    // ATTACH PHASE 2 SCROLL HANDLER
    $(window).on("scroll.brookeGrow", handleScrollGrow);
  }

  function initMainSecVerticalLine() {
    var triggered = false;
    var $line = null;
    var STATIC_HEIGHT = 130; // ✅ fixed height

    function getCoords() {
      var $main = $(".main-sec");
      if (!$main.length) return null;

      var mainRect = $main[0].getBoundingClientRect();

      return {
        x: mainRect.left + window.scrollX,
        startY: mainRect.top + window.scrollY,
      };
    }

    function drawLine() {
      if ($line) return;

      // wait for layout + AOS transforms to settle
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          var coords = getCoords();
          if (!coords) return;

          $line = $('<div class="mainsec-vertical-line"></div>')
            .css({
              position: "absolute",
              left: coords.x,
              top: coords.startY,
              width: "1px",
              height: 0,
              backgroundColor: "#db4a2f",
              zIndex: 2,
              pointerEvents: "none",
            })
            .appendTo("body");

          // ✅ Animate to static height
          $line.animate({ height: STATIC_HEIGHT }, 1200);
        });
      });
    }

    function checkTrigger() {
      if (triggered) return;

      var $section = $(".survivor");
      if (!$section.length) return;

      var rect = $section[0].getBoundingClientRect();
      var vh = window.innerHeight;

      var halfVisible = rect.top <= vh * 0.5 && rect.bottom >= vh * 0.5;

      if (halfVisible) {
        triggered = true;
        $(window).off("scroll.mainsecLine");
        drawLine();
      }
    }

    $(window).on("scroll.mainsecLine", checkTrigger);
  }

  function initSurvivorImgLeftLine() {
    var triggered = false;
    var $line = null;

    function getCoords() {
      var $img = $(".survivor .img");
      if (!$img.length) return null;

      var rect = $img[0].getBoundingClientRect();

      return {
        startX: rect.right + window.scrollX - 10,
        y: rect.bottom + window.scrollY,
        endX: window.scrollX,
      };
    }

    function drawLine() {
      if ($line) return;

      // wait for layout + AOS transforms to settle
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          var coords = getCoords();
          if (!coords) return;

          var width = coords.startX - coords.endX;

          $line = $('<div class="survivor-img-left-line"></div>')
            .css({
              position: "absolute",
              left: coords.startX,
              top: coords.y - 1,
              height: "1px",
              width: 0,
              backgroundColor: "#3363e8",
              zIndex: 3,
              pointerEvents: "none",
            })
            .appendTo("body");

          $line.animate(
            {
              left: coords.endX,
              width: width,
            },
            1200
          );
        });
      });
    }

    function waitForImgAOS() {
      var $img = $(".survivor .img");
      if (!$img.length) return;

      // ✅ CASE 1: AOS already finished
      if ($img.hasClass("aos-animate")) {
        drawLine();
        return;
      }

      // ✅ CASE 2: wait for AOS
      document.addEventListener(
        "aos:in",
        function onAOSIn(e) {
          if (e.detail === $img[0]) {
            document.removeEventListener("aos:in", onAOSIn);
            drawLine();
          }
        },
        { once: true }
      );
    }

    function checkTrigger() {
      if (triggered) return;

      var $section = $(".survivor");
      if (!$section.length) return;

      var rect = $section[0].getBoundingClientRect();
      var sectionHeight = rect.height;

      // ✅ Fire when only last 30% is visible
      var exited70 = rect.top <= -(sectionHeight * 0.3);

      if (exited70) {
        triggered = true;
        $(window).off("scroll.survivorImgLine");
        waitForImgAOS();
      }
    }

    $(window).on("scroll.survivorImgLine", checkTrigger);
  }

  function initMakingTopDoubleLines() {
    var triggered = false;
    var $topLine = null;
    var $bottomLine = null;

    function getCoords() {
      var $span = $(".making-top span:nth-child(2)");
      if (!$span.length) return null;

      var rect = $span[0].getBoundingClientRect();

      return {
        startX: rect.left + window.scrollX,
        topY: rect.top + window.scrollY,
        bottomY: rect.bottom + window.scrollY,
        endX: window.innerWidth + window.scrollX,
      };
    }

    function drawLines() {
      if ($topLine || $bottomLine) return;

      // wait for AOS + layout settle
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          var coords = getCoords();
          if (!coords) return;

          var width = coords.endX - coords.startX;

          // TOP LINE
          $topLine = $('<div class="making-line-top"></div>')
            .css({
              position: "absolute",
              left: coords.startX,
              top: coords.topY,
              height: "1px",
              width: 0,
              backgroundColor: "#db4a2f",
              zIndex: 2,
              pointerEvents: "none",
            })
            .appendTo("body")
            .animate({ width: width }, 1200);

          // BOTTOM LINE
          $bottomLine = $('<div class="making-line-bottom"></div>')
            .css({
              position: "absolute",
              left: coords.startX,
              top: coords.bottomY,
              height: "1px",
              width: 0,
              backgroundColor: "#db4a2f",
              zIndex: 2,
              pointerEvents: "none",
            })
            .appendTo("body")
            .animate({ width: width }, 1500);
        });
      });
    }

    function checkTrigger() {
      if (triggered) return;

      var $section = $(".making-sense");
      if (!$section.length) return;

      var rect = $section[0].getBoundingClientRect();
      var vh = window.innerHeight;

      // ✅ 60% visible trigger
      var visible60 = rect.top <= vh * 0.5;

      if (visible60) {
        triggered = true;
        $(window).off("scroll.makingTopLines");
        drawLines();
      }
    }

    $(window).on("scroll.makingTopLines", checkTrigger);
  }

  function initBorderAnimVerticalLine() {
    var triggered = false;
    var phase1Done = false;
    var $line = null;
    var baseHeight = 200;
    var startScroll = 0;

    function getCoords() {
      var $border = $(".border-anim");
      var $end = $(".public-speaking");

      if (!$border.length || !$end.length) return null;

      var b = $border[0].getBoundingClientRect();
      var e = $end[0].getBoundingClientRect();

      return {
        x: b.right + window.scrollX - 10,
        startY: b.top + window.scrollY - 90,
        endY: e.top + window.scrollY,
      };
    }

    /* ---------------- PHASE 1 ---------------- */
    function animatePhase1() {
      var c = getCoords();
      if (!c) return;

      startScroll = window.scrollY;

      $line = $('<div class="border-vertical-line"></div>')
        .css({
          position: "absolute",
          left: c.x,
          top: c.startY,
          width: "1px",
          height: 0,
          backgroundColor: "#ff0000",
          zIndex: 5,
          pointerEvents: "none",
        })
        .appendTo("body");

      // 🔥 visible growth
      $line.animate({ height: baseHeight }, 900, "linear", function () {
        phase1Done = true;
      });
    }

    /* ---------------- PHASE 2 ---------------- */
    function handleScrollGrow() {
      if (!phase1Done || !$line) return;

      var c = getCoords();
      if (!c) return;

      var scrolled = window.scrollY - startScroll;
      if (scrolled < 0) scrolled = 0;

      var newHeight = baseHeight + scrolled * 0.6;
      var maxHeight = c.endY - c.startY;

      if (newHeight > maxHeight) newHeight = maxHeight;

      $line.height(newHeight);
    }

    /* ---------------- TRIGGER ---------------- */
    function checkTrigger() {
      if (triggered) return;

      var $chaos = $(".chaos");
      if (!$chaos.length) return;

      var rect = $chaos[0].getBoundingClientRect();
      var vh = window.innerHeight;

      // ✅ START as soon as chaos enters viewport
      if (rect.top < vh && rect.bottom > 0) {
        triggered = true;
        $(window).off("scroll.borderAnimTrigger");

        // wait for AOS/layout settle
        setTimeout(() => {
          animatePhase1();
          $(window).on("scroll.borderAnimGrow", handleScrollGrow);
        }, 100);
      }
    }

    $(window).on("scroll.borderAnimTrigger", checkTrigger);
  }

  function initSurvivorImgTopRightLine() {
    var triggered = false;
    var $line = null;

    function getCoords() {
      var $img = $(".survivor .img");
      if (!$img.length) return null;

      var rect = $img[0].getBoundingClientRect();

      return {
        startX: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        endX: window.scrollX + window.innerWidth,
      };
    }

    function drawLine() {
      if ($line) return;

      // wait for AOS + layout to fully settle
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          var c = getCoords();
          if (!c) return;

          var width = c.endX - c.startX;

          $line = $('<div class="survivor-img-top-line"></div>')
            .css({
              position: "absolute",
              left: c.startX,
              top: c.y,
              height: "1px",
              width: 0,
              backgroundColor: "#db4a2f",
              zIndex: 10,
              pointerEvents: "none",
            })
            .appendTo("body");

          // 🔥 animate left → right
          $line.animate({ width: width }, 1200, "linear");
        });
      });
    }

    function checkTrigger() {
      if (triggered) return;

      var $section = $(".survivor");
      if (!$section.length) return;

      var rect = $section[0].getBoundingClientRect();

      // 🔥 section touches top of viewport
      if (rect.top <= 70) {
        triggered = true;
        $(window).off("scroll.survivorTopLine");

        // 🔥 wait for AOS on image
        document.addEventListener(
          "aos:in",
          function onAOSIn(e) {
            if ($(e.detail).is(".survivor .img")) {
              document.removeEventListener("aos:in", onAOSIn);
              drawLine();
            }
          },
          { once: true }
        );

        // ⚠️ fallback if AOS already finished
        if ($(".survivor .img").hasClass("aos-animate")) {
          drawLine();
        }
      }
    }

    $(window).on("scroll.survivorTopLine", checkTrigger);
  }

  function initMakingSenseSafeLine() {
    var triggered = false;
    var $line;

    function getCoords() {
      var $img = $(".making-sense .making-btm .img");
      if (!$img.length) return null;

      var rect = $img[0].getBoundingClientRect();

      return {
        startX: window.scrollX,
        endX: rect.left + window.scrollX, // ⛔ STOP BEFORE SECTION
        y: rect.bottom + window.scrollY,
      };
    }

    function drawLine() {
      if ($line) return;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          var c = getCoords();
          if (!c) return;

          var width = c.endX - c.startX;

          $line = $('<div class="making-sense-safe-line"></div>')
            .css({
              position: "absolute",
              left: c.startX,
              top: c.y,
              height: "1px",
              width: 0,
              backgroundColor: "#db4a2f",
              zIndex: 9999,
              pointerEvents: "none",
            })
            .appendTo("body");

          $line.animate({ width }, 1200, "linear");
        });
      });
    }

    function checkTrigger() {
      if (triggered) return;

      var $section = $(".making-sense");
      if (!$section.length) return;

      var rect = $section[0].getBoundingClientRect();

      if (rect.top <= 0) {
        // touches top viewport
        triggered = true;
        $(window).off("scroll.makingSenseLine");
        drawLine();
      }
    }

    $(window).on("scroll.makingSenseLine", checkTrigger);
  }

  function initMakingSenseImgVerticalLine() {
    var triggered = false;
    var $line = null;

    function getCoords() {
      var $img = $(".making-sense .making-btm .img");
      if (!$img.length) return null;

      var rect = $img[0].getBoundingClientRect();

      return {
        x: rect.left + window.scrollX,
        startY: rect.top + window.scrollY,
        height: rect.height,
      };
    }

    function drawLine() {
      if ($line) return;

      // wait for AOS + layout settle
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          var c = getCoords();
          if (!c) return;

          $line = $('<div class="making-sense-img-vertical-line"></div>')
            .css({
              position: "absolute",
              left: c.x,
              top: c.startY,
              width: "1px",
              height: 0,
              backgroundColor: "#db4a2f",
              zIndex: 10,
              pointerEvents: "none",
            })
            .appendTo("body");

          // 🔥 animate top → bottom
          $line.animate({ height: c.height }, 1200, "linear");
        });
      });
    }

    function checkTrigger() {
      if (triggered) return;

      var $section = $(".making-sense");
      if (!$section.length) return;

      var rect = $section[0].getBoundingClientRect();

      // ✅ section touches top of viewport
      if (rect.top <= 0) {
        triggered = true;
        $(window).off("scroll.makingSenseLine");

        // wait for AOS on image if present
        document.addEventListener(
          "aos:in",
          function onAOSIn(e) {
            if ($(e.detail).is(".making-sense .making-btm .img")) {
              document.removeEventListener("aos:in", onAOSIn);
              drawLine();
            }
          },
          { once: true }
        );

        // fallback if no AOS
        setTimeout(drawLine, 100);
      }
    }

    $(window).on("scroll.makingSenseLine", checkTrigger);
  }

  function initFamilyStrategistBottomLine() {
    var triggered = false;
    var $line = null;

    function getCoords() {
      var $section = $(".family-law-strategist");
      var $el = $section.find(".top-sec");

      if (!$section.length || !$el.length) return null;

      var secRect = $section[0].getBoundingClientRect();
      var elRect = $el[0].getBoundingClientRect();

      return {
        container: $section,
        y: elRect.bottom - secRect.top, // relative to section
        width: secRect.width,
      };
    }

    function drawLine() {
      if ($line) return;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          var c = getCoords();
          if (!c) return;

          // 🔒 ensure overflow-safe container
          c.container.css("position", "relative");

          $line = $('<div class="family-strategist-line"></div>')
            .css({
              position: "absolute",
              left: 0,
              top: c.y,
              height: "1px",
              width: 0,
              backgroundColor: "#db4a2f",
              zIndex: 5,
              pointerEvents: "none",
            })
            .appendTo(c.container);

          // 🔥 animate left → right INSIDE section
          $line.animate({ width: c.width }, 1200, "linear");
        });
      });
    }

    function checkTrigger() {
      if (triggered) return;

      var $section = $(".family-law-strategist");
      if (!$section.length) return;

      var rect = $section[0].getBoundingClientRect();
      var vh = window.innerHeight;

      // ✅ start 100px before touching viewport
      if (rect.top <= vh + 100) {
        triggered = true;
        $(window).off("scroll.familyStrategistLine");

        // ✅ wait for AOS (if exists)
        if (typeof AOS !== "undefined") {
          document.addEventListener(
            "aos:in",
            function onAOSIn(e) {
              if ($(e.detail).closest(".family-law-strategist").length) {
                document.removeEventListener("aos:in", onAOSIn);
                drawLine();
              }
            },
            { once: true }
          );
        } else {
          drawLine();
        }
      }
    }

    $(window).on("scroll.familyStrategistLine", checkTrigger);
  }

  function initPodcastToMainftVerticalLine() {
    let triggered = false;
    let $line = null;

    function getCoords() {
      const podcast = document.querySelector(".podcast");
      const podcastMain = document.querySelector(".podcast-main");
      const mainft = document.querySelector(".mainft");

      if (!podcast || !podcastMain || !mainft) return null;

      const podcastRect = podcast.getBoundingClientRect();
      const podcastMainRect = podcastMain.getBoundingClientRect();
      const mainftRect = mainft.getBoundingClientRect();

      return {
        x: podcastMainRect.left + window.scrollX + 15,
        startY: podcastRect.top + window.scrollY,
        endY: mainftRect.top + window.scrollY,
      };
    }

    function drawLine() {
      if ($line) return;

      const c = getCoords();
      if (!c || c.endY <= c.startY) return;

      const height = c.endY - c.startY;

      $line = $("<div class='podcast-mainft-line'></div>")
        .css({
          position: "absolute",
          left: c.x,
          top: c.startY,
          width: "1px",
          height: 0,
          backgroundColor: "#db4a2f",
          zIndex: 9999,
          pointerEvents: "none",
        })
        .appendTo("body");

      $line.animate({ height }, 1200, "linear");
    }

    function checkTrigger() {
      if (triggered) return;

      const rect = document.querySelector(".podcast").getBoundingClientRect();

      // 🔥 Start when podcast touches viewport
      if (rect.top <= 200) {
        triggered = true;
        window.removeEventListener("scroll", checkTrigger);
        drawLine();
      }
    }

    window.addEventListener("scroll", checkTrigger);
  }

  function initPodcastRightVerticalLine() {
    let triggered = false;
    let $line = null;

    function getCoords() {
      const podcast = document.querySelector(".podcast");
      const lastCol = document.querySelector(".podcast-sec .col:last-child");

      if (!podcast || !lastCol) return null;

      const podcastRect = podcast.getBoundingClientRect();
      const colRect = lastCol.getBoundingClientRect();

      return {
        x: colRect.right - podcastRect.left, // inside podcast
        startY: 0,
        endY: podcastRect.height,
      };
    }

    function drawLine() {
      if ($line) return;

      // wait for layout + AOS transforms to settle
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const c = getCoords();
          if (!c || c.endY <= 0) return;

          $line = $("<div class='podcast-right-line'></div>")
            .css({
              position: "absolute",
              left: c.x,
              top: c.startY,
              width: "1px",
              height: 0,
              backgroundColor: "#db4a2f",
              zIndex: 10,
              pointerEvents: "none",
            })
            .appendTo(".podcast"); // 🔥 INSIDE → overflow safe

          $line.animate({ height: c.endY }, 1200, "linear");
        });
      });
    }

    function triggerWithAOS() {
      if (typeof AOS === "undefined") {
        drawLine();
        return;
      }

      document.addEventListener(
        "aos:in",
        function onAOS(e) {
          if (e.detail.closest(".podcast")) {
            document.removeEventListener("aos:in", onAOS);
            drawLine();
          }
        },
        { once: true }
      );
    }

    function checkTrigger() {
      if (triggered) return;

      const rect = document.querySelector(".podcast").getBoundingClientRect();

      if (rect.top <= 0) {
        triggered = true;
        window.removeEventListener("scroll", checkTrigger);
        triggerWithAOS();
      }
    }

    window.addEventListener("scroll", checkTrigger);
  }

  //! Functions for lines
  var hasRun = false;
  var LINE_TRIGGER_CLASS = "menu-delay-active";

  function runHeroLines() {
    if (hasRun) return; // 🔒 only once
    hasRun = true;

    // ONLY these four
    initBrookeLine();
    initMasonLine();
    initMasonVerticalLine();
    initLadyImageLeftLine();
    initBrookeToMakingVerticalLine();
  }

  function checkAndRun() {
    if ($("body").hasClass(LINE_TRIGGER_CLASS)) {
      if (typeof AOS !== "undefined") {
        AOS.refreshHard();
      }

      setTimeout(runHeroLines, 300);
    }
  }

  // Run if class already exists
  $(window).on("load", function () {
    checkAndRun();
    initMainSecVerticalLine();
    initSurvivorImgLeftLine();
    initMakingTopDoubleLines();
    initBorderAnimVerticalLine();
    initSurvivorImgTopRightLine();
    initMakingSenseSafeLine();
    initMakingSenseImgVerticalLine();
    initFamilyStrategistBottomLine();
    initPodcastToMainftVerticalLine();
    initPodcastRightVerticalLine();
  });

  // Watch for class being added later
  var observer = new MutationObserver(function () {
    checkAndRun();
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });
})(jQuery);
