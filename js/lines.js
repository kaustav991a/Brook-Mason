(function ($) {
  // Store fixed coordinates so they never change on resize
  var FixedLineRegistry = [];

  // Utility: check if element is in viewport
  function isInViewport($el) {
    var elementTop = $el.offset().top;
    var elementBottom = elementTop + $el.outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
  }

  // Main function to create & animate a line
  window.createAnimatedLine = function (options) {
    var settings = $.extend(
      {
        from: null, // jQuery element OR {x,y}
        to: null, // jQuery element OR {x,y}
        direction: "lr", // lr, rl, tb, bt, el-to-left, el-to-right
        color: "#ff0000",
        thickness: 2,
        duration: 1200,
        delay: 0,
        trigger: "scroll", // scroll | bodyClass | viewport
        bodyClass: "",
        triggerElement: null,
      },
      options
    );

    var $line = $("<div></div>")
      .css({
        position: "absolute",
        backgroundColor: settings.color,
        zIndex: 9999,
        opacity: 1,
      })
      .appendTo("body");

    // Calculate coordinates ONCE
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

    // Initial line state
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

    // Animate
    function animateLine() {
      setTimeout(function () {
        if (settings.direction === "lr" || settings.direction === "rl") {
          $line.animate(
            {
              width: Math.abs(coords.end.x - coords.start.x),
            },
            settings.duration
          );
        } else {
          $line.animate(
            {
              height: Math.abs(coords.end.y - coords.start.y),
            },
            settings.duration
          );
        }
      }, settings.delay);
    }

    // Trigger logic
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
