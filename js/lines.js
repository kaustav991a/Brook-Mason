function createAnimatedLine(config) {
  const {
    section,
    heading = null,
    targetSpan = null,
    anchor = null, // optional element to align from
    lineId,

    // triggers
    triggerClass = null,
    triggerType = "class", // "class" | "scroll" | "both"
    scrollTriggerElement = null,
    scrollOffset = 0,
    once = true,

    // line basics
    direction = "vertical", // "vertical" or "horizontal"
    position = "absolute",
    duration = 1200,
    thickness = 1,
    backgroundColor = "transparent",

    // offsets
    leftOffset = 0,
    heightOffset = 0,
    offsetTop = 0,
    offsetRight = 0,
    offsetBottom = 0,
    offsetLeft = 0,

    // sizing
    extraWidth = 0,
    extraHeight = 0,
    freeWidth = null,
    freeHeight = null,

    // new features
    useSectionBottom = false, // for horizontal line anchored to section bottom
    toScreenEdge = null, // "left" or "right"
  } = config;

  let hasAnimated = false;

  function animateLine() {
    if (once && hasAnimated) return;

    const $section = $(section);
    if (!$section.length) return;

    const $heading = heading ? $section.find(heading).first() : null;
    const $span = targetSpan ? $section.find(targetSpan).first() : null;
    const $anchor = anchor ? $section.find(anchor).first() : $span;

    if (!($heading || $span || $anchor)) return;

    $("#" + lineId).remove();

    const headingOffset = $heading?.offset() || { top: 0 };
    const headingHeight = $heading?.outerHeight() || 0;

    const anchorOffset = $anchor?.offset() || $section.offset();
    const anchorWidth = $anchor?.outerWidth() || 0;
    const anchorHeight = $anchor?.outerHeight() || 0;

    let $line,
      animationProps = {};

    /* ========= VERTICAL ========= */
    if (direction === "vertical") {
      const startTop =
        (headingOffset.top || anchorOffset.top) +
        (headingHeight || anchorHeight) -
        heightOffset +
        offsetTop -
        offsetBottom;

      const finalHeight =
        freeHeight !== null ? freeHeight : startTop + extraHeight;

      $line = $("<div>", { id: lineId }).css({
        position,
        left:
          (anchorOffset.left || 0) +
          leftOffset +
          offsetLeft -
          offsetRight +
          "px",
        top: startTop + "px",
        width: thickness + "px",
        height: 0,
        backgroundColor,
        zIndex: 1,
        pointerEvents: "none",
      });

      animationProps = {
        top: 0 + offsetTop,
        height: finalHeight,
      };
    }

    /* ========= HORIZONTAL ========= */
    if (direction === "horizontal") {
      const topPos = useSectionBottom
        ? $section.offset().top +
          $section.outerHeight() -
          heightOffset +
          offsetTop -
          offsetBottom
        : anchorOffset.top +
          anchorHeight +
          heightOffset +
          offsetTop -
          offsetBottom;

      let startLeft = anchorOffset.left + leftOffset + offsetLeft - offsetRight;
      let finalWidth;

      if (toScreenEdge === "left") {
        finalWidth =
          startLeft + extraWidth + (freeWidth !== null ? freeWidth : 0);
        startLeft = 0;
      } else if (toScreenEdge === "right") {
        finalWidth =
          window.innerWidth -
          startLeft +
          extraWidth +
          (freeWidth !== null ? freeWidth : 0);
      } else {
        finalWidth = freeWidth !== null ? freeWidth : anchorWidth + extraWidth;
      }

      $line = $("<div>", { id: lineId }).css({
        position,
        left: startLeft + "px",
        top: topPos + "px",
        width: 0,
        height: thickness + "px",
        backgroundColor,
        zIndex: 1,
        pointerEvents: "none",
      });

      animationProps = { width: finalWidth };
    }

    $("body").append($line);
    $line.animate(animationProps, duration, "swing");

    hasAnimated = true;
  }

  /* ===============================
     CLASS TRIGGER
  ================================ */
  if (triggerType === "class" || triggerType === "both") {
    const observer = new MutationObserver(() => {
      if ($("body").hasClass(triggerClass)) {
        animateLine();
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  /* ===============================
     SCROLL TRIGGER
  ================================ */
  if (triggerType === "scroll") {
    const $trigger = scrollTriggerElement
      ? $(scrollTriggerElement)
      : $(section);

    const onScroll = () => {
      const triggerTop = $trigger.offset().top;
      const scrollPos = $(window).scrollTop() + $(window).height();

      if (scrollPos >= triggerTop + scrollOffset) {
        animateLine();
        if (once) $(window).off("scroll", onScroll);
      }
    };

    $(window).on("scroll", onScroll);
    onScroll(); // initial check
  }

  /* ===============================
     BOTH (class + scroll)
  ================================ */
  if (triggerType === "both") {
    const $trigger = scrollTriggerElement
      ? $(scrollTriggerElement)
      : $(section);

    const onScroll = () => {
      if (!$("body").hasClass(triggerClass)) return;

      const triggerTop = $trigger.offset().top;
      const scrollPos = $(window).scrollTop() + $(window).height();

      if (scrollPos >= triggerTop + scrollOffset) {
        animateLine();
        if (once) $(window).off("scroll", onScroll);
      }
    };

    $(window).on("scroll", onScroll);
  }

  /* ===============================
     RESIZE
  ================================ */
  let resizeTimer;
  $(window).on("resize", function () {
    if (!hasAnimated) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      hasAnimated = false;
      animateLine();
    }, 150);
  });
}
