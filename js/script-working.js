// Disable browser scroll restoration to prevent conflicts with ScrollTrigger
history.scrollRestoration = "manual";
// Global function to refresh ScrollTrigger and related elements
function globalRefresh() {
  ScrollTrigger.refresh();
  if (typeof AOS !== "undefined") {
    AOS.refreshHard(); // Force AOS to recalc positions
  }
  recalcAllLines(); // Recalc lines after refresh
}
// Global array to track active lines for cleanup
let activeLines = [];

// Function to clear all lines
function clearAllLines() {
  activeLines.forEach(($line) => $line.remove());
  activeLines = [];
}

// Function to recalc all lines (clear and re-run creations)
function recalcAllLines() {
  clearAllLines();
  // Re-run all line creations below
  initAllLines();
}



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
    animateIn: "fadeIn",
    animateOut: "fadeOut",
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 },
    },
  });

  setTimeout(() => {
    document.body.classList.add("menu-delay-active");
  }, 4000);
});

AOS.init({
  duration: 1000,
  once: true,
  offset: 200,
  startEvent: "load",
  disable: "mobile",
});

let SwiperTop = new Swiper(".swiper--top", {
  spaceBetween: 60,
  centeredSlides: true,
  speed: 5000,
  autoplay: { delay: 50, disableOnInteraction: false },
  loop: true,
  slidesPerView: "auto",
  allowTouchMove: false,
});

let blogSwiper = new Swiper(".blogSwiper", {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  slidesPerGroup: 1,
  navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
});

let chaosSwiper = new Swiper(".chaosSwiper", {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: false,
  slidesPerGroup: 1,
  navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
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
        refreshPriority: -1,
        onUpdate: (self) => {},
      },
    });
  });
}

// Merged load event: Handles scroll-to-top, refresh, and your existing inits
window.addEventListener("load", () => {
  const initialScrollY = window.scrollY;
  if (initialScrollY > 0) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      globalRefresh();
    }, 500);
  } else {
    globalRefresh();
  }

  setTimeout(
    () => {
      initHorizontalScroll();
      ScrollTrigger.addEventListener("refresh", () => AOS.refresh());
      ScrollTrigger.refresh();
    },
    initialScrollY > 0 ? 1000 : 200
  );

  // Initialize all lines
  initAllLines();

  // Watch for body class changes
  var observer = new MutationObserver(function () {
    if ($("body").hasClass("menu-delay-active")) {
      // Trigger bodyClass-based lines (handled inside createAnimatedLine)
    }
  });
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });
});

// Throttled resize handler
let resizeTimeout;
$(window).on("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    globalRefresh();
  }, 100);
});

// Throttled scroll handler
let scrollTimeout;
$(window).on("scroll", () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    // Scroll-triggered lines are handled inside createAnimatedLine
  }, 50);
});

// Your new createAnimatedLine utility (pasted as-is)
(function ($) {
  var FixedLineRegistry = [];

  function isInViewport($el) {
    var elementTop = $el.offset().top;
    var elementBottom = elementTop + $el.outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
  }

  window.createAnimatedLine = function (options) {
    var settings = $.extend(
      {
        from: null,
        to: null,
        direction: "lr",
        color: "#ff0000",
        thickness: 2,
        duration: 1200,
        delay: 0,
        trigger: "scroll",
        bodyClass: "",
        triggerElement: null,
      },
      options
    );

    // Prevent duplicates based on a unique class (add to options if needed)
    if (settings.uniqueClass && $("." + settings.uniqueClass).length) return;

    var $line = $("<div></div>")
      .css({
        position: "absolute",
        backgroundColor: settings.color,
        zIndex: 9999,
        opacity: 1,
      })
      .addClass(settings.uniqueClass || "") // Optional unique class
      .appendTo("body");

    activeLines.push($line); // Track for global cleanup

    function calculateCoordinates() {
      var start = {},
        end = {};

      if (settings.from instanceof jQuery) {
        var o = settings.from.offset();
        start.x = o.left + settings.from.outerWidth() / 2;
        start.y = o.top + settings.from.outerHeight() / 2;
      } else {
        start = settings.from;
      }

      if (settings.to instanceof jQuery) {
        var o2 = settings.to.offset();
        end.x = o2.left + settings.to.outerWidth() / 2;
        end.y = o2.top + settings.to.outerHeight() / 2;
      } else {
        end = settings.to;
      }

      return { start: start, end: end };
    }

    var coords = calculateCoordinates();
    FixedLineRegistry.push(coords);

    if (settings.direction === "lr" || settings.direction === "rl") {
      $line.css({
        top: coords.start.y,
        left: Math.min(coords.start.x, coords.end.x),
        height: settings.thickness,
        width: 0,
      });
    } else {
      $line.css({
        left: coords.start.x,
        top: Math.min(coords.start.y, coords.end.y),
        width: settings.thickness,
        height: 0,
      });
    }

    function animateLine() {
      setTimeout(function () {
        if (settings.direction === "lr" || settings.direction === "rl") {
          $line.animate(
            { width: Math.abs(coords.end.x - coords.start.x) },
            settings.duration
          );
        } else {
          $line.animate(
            { height: Math.abs(coords.end.y - coords.start.y) },
            settings.duration
          );
        }
      }, settings.delay);
    }

    if (settings.trigger === "bodyClass") {
      var bodyObserver = setInterval(function () {
        if ($("body").hasClass(settings.bodyClass)) {
          animateLine();
          clearInterval(bodyObserver);
        }
      }, 100);
    }

    if (settings.trigger === "scroll") {
      $(window).one("scroll", animateLine);
    }

    if (settings.trigger === "viewport" && settings.triggerElement) {
      $(window).on("scroll", function () {
        if (isInViewport(settings.triggerElement)) {
          animateLine();
          $(window).off("scroll");
        }
      });
    }
  };
})(jQuery);

// Function to initialize all lines using createAnimatedLine
function initAllLines() {
  // Brooke Line (lr, bodyClass trigger)
  createAnimatedLine({
    from: $(".heading h1 span").first(),
    to: {
      x: window.innerWidth,
      y:
        $(".heading h1 span").first().offset().top +
        $(".heading h1 span").first().outerHeight() -
        15,
    },
    direction: "lr",
    color: "#3363e8",
    trigger: "bodyClass",
    bodyClass: "menu-delay-active",
    uniqueClass: "brooke-line",
  });

  // Mason Line (lr, bodyClass)
  createAnimatedLine({
    from: $(".heading h1 span").eq(1),
    to: {
      x: window.innerWidth,
      y:
        $(".heading h1 span").eq(1).offset().top +
        $(".heading h1 span").eq(1).outerHeight() -
        15,
    },
    direction: "lr",
    color: "#3363e8",
    trigger: "bodyClass",
    bodyClass: "menu-delay-active",
    uniqueClass: "mason-line",
  });

  // Mason Vertical Line (tb, bodyClass)
  createAnimatedLine({
    from: {
      x: $(".heading h1 span").eq(1).offset().left - 14,
      y: window.scrollY,
    },
    to: {
      x: $(".heading h1 span").eq(1).offset().left - 14,
      y:
        $(".heading h1 span").eq(1).offset().top +
        $(".heading h1 span").eq(1).outerHeight() -
        15,
    },
    direction: "tb",
    color: "red",
    trigger: "bodyClass",
    bodyClass: "menu-delay-active",
    uniqueClass: "mason-vertical-line",
  });

  // Lady Image Left Line (rl, bodyClass)
  createAnimatedLine({
    from: {
      x: $(".lady-img").offset().left + 200,
      y: $(".lady-img").offset().top + $(".lady-img").outerHeight() - 70,
    },
    to: {
      x: 0,
      y: $(".lady-img").offset().top + $(".lady-img").outerHeight() - 70,
    },
    direction: "rl",
    color: "#3363e8",
    trigger: "bodyClass",
    bodyClass: "menu-delay-active",
    uniqueClass: "lady-left-line",
  });

  // Brooke to Making Vertical Line (tb, scroll-dependent - approximated as viewport)
  createAnimatedLine({
    from: {
      x:
        $(".heading h1 span").first().offset().left +
        $(".heading h1 span").first().outerWidth() -
        85,
      y:
        $(".heading h1 span").first().offset().top +
        $(".heading h1 span").first().outerHeight() -
        17,
    },
    to: {
      x:
        $(".heading h1 span").first().offset().left +
        $(".heading h1 span").first().outerWidth() -
        85,
      y: $(".making-top span").first().offset().top + 30,
    },
    direction: "tb",
    color: "#3363e8",
    trigger: "viewport",
    triggerElement: $(".making-top"),
    uniqueClass: "brooke-making-line",
  });

  // Add more lines here as needed (e.g., for survivor, podcast, etc., mapping to viewport/scroll triggers)
  // Example: Survivor Img Left Line (rl, viewport)
  createAnimatedLine({
    from: {
      x:
        $(".survivor .img").offset().left +
        $(".survivor .img").outerWidth() -
        10,
      y: $(".survivor .img").offset().top + $(".survivor .img").outerHeight(),
    },
    to: {
      x: 0,
      y: $(".survivor .img").offset().top + $(".survivor .img").outerHeight(),
    },
    direction: "rl",
    color: "#3363e8",
    trigger: "viewport",
    triggerElement: $(".survivor"),
    uniqueClass: "survivor-img-left-line",
  });

  // Continue for others... (I've added a few key ones; map the rest similarly based on your original triggers)
}
