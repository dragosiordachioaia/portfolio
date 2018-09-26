import $ from "jquery";
import { TweenMax } from "gsap";

import "./less/main.less";

var initialMapWidth;
var initialMapHeight;
var crtScale = 0;
var mapContent = $("#map-content");
var jumpTween;
var jumpTarget;

var graphicsBlur = [
  "buildings_blur_sd",
  "clouds_blur_sd",
  // 'sun_blur_sd',
];

var graphicsClear = [
  "buildings_clear_sd",
  "clouds_clear_sd",
  // 'sun_clear_sd',
];

var markers = [
  {
    name: "1",
    left: "46%",
    top: "64%",
  },
  {
    name: "2",
    left: "56%",
    top: "74%",
  },
  {
    name: "3",
    left: "57.5%",
    top: "31%",
  },
];

openMap();
$("#map").css({
  top: "0",
});
mapContent.css({
  top: "100vh",
});
setTimeout(showMap, 1000);
// startAnimation();
createSlices();

function createSlices() {
  const SLICE_COUNT = 6;
  for (let i = 0; i < SLICE_COUNT; i++) {
    let newSlice = $(`<div id="slice-${i}" class="slice"></div>`);
    newSlice.css({
      left: (i / SLICE_COUNT) * 100 + "%",
      width: 100 / SLICE_COUNT + "%",
      "z-index": SLICE_COUNT - i,
    });
    $("#slice-container").append(newSlice);
  }
}

function openMap() {
  $(window).resize(function() {
    centerMapH();
    setTimeout(centerMapV, 200);
  });
  createMapElements();
  setTimeout(centerMapH, 500);

  mapContent.css("opacity", 1);
}

function centerMapH() {
  if ($("#bg-map").width() < 100) {
    setTimeout(centerMapH, 100);
    return;
  }

  var windowWidth = $(window).width();
  var windowHeight = $(window).height();
  var targetWidth = windowWidth; //Math.min(windowWidth, 1100);

  if (!initialMapWidth) {
    initialMapWidth = mapContent.width();
    initialMapHeight = mapContent.height();
    mapContent.css({ width: "85%" });
  }

  var targetScale = targetWidth / initialMapWidth;
  // console.log('initialMapWidth: ', initialMapWidth);
  // console.log('targetWidth: ', targetWidth);
  // console.log('windowWidth: ', windowWidth);
  // console.log('targetScale: ', targetScale);
  if (targetScale * initialMapHeight >= windowHeight * 0.95) {
    targetScale = (windowHeight / initialMapHeight) * 0.95;
  }
  crtScale = targetScale;
  // TODO: fix vertical scaling responsiveness

  // mapContent.css({transform: 'scale('+targetScale+')'})
  var newScaleStr = "translate(-33%, -92%) scale(" + targetScale / 1.96 + ")";
  $(".element-marker-clear").css("transform", newScaleStr);
  setTimeout(function() {
    var targetLeft =
      ((windowWidth - targetWidth - 20) / 2) * targetScale + "px";
    $(mapContent).css({ left: "5%" });
  }, 200);
}
window.centerMapH = centerMapH;

function centerMapV() {
  var mapHeight = mapContent.height();
  $(mapContent).css({ top: ($(window).height() - mapHeight + 10) / 2 + "px" });
}

function createMapElements() {
  graphicsBlur.forEach(function(element, index) {
    setTimeout(function() {
      var elemStr =
        '<img class="graphic-element element-blur" src="graphics/map/blur/' +
        element +
        '.png" id="' +
        element +
        '"/>';
      var newElement = mapContent.append($(elemStr));
    }, index * 200);
  });
  graphicsClear.forEach(function(element, index) {
    setTimeout(function() {
      var elemStr =
        '<img class="graphic-element element-clear" src="graphics/map/clear/' +
        element +
        '.png" id="' +
        element +
        '"/>';
      var newElement = mapContent.append($(elemStr));
    }, index * 200);
  });
  markers.forEach(function(element, index) {
    var elemStrClear =
      '<img class="marker element-marker-clear" src="graphics/map/clear/' +
      element.name +
      '.png" id="' +
      element.name +
      '-clear"/>';
    var newElementClear = $(elemStrClear);
    mapContent.append(newElementClear);
    $(newElementClear).css({
      left: element.left,
    });
    $(newElementClear).attr({ "data-end-top": element.top });
    $(newElementClear).on("mouseenter", onMarkerHover);
    $(newElementClear).on("click", e => openProject(index));
    $(newElementClear).on("mouseleave", onMarkerLeave);
  });
}

function openProject(projectIndex) {
  $("#project-container").show();
  $("#header").removeClass("shown");
  console.log("openProject() projectIndex = ", projectIndex);
  $(".slice").each((index, sliceElement) => {
    $(sliceElement).addClass("with-shadow");
    TweenMax.to($(sliceElement), 1, {
      height: "100%",
      ease: Strong.easeInOut,
      delay: index * 0.15,
      onComplete: () => {
        $(sliceElement).removeClass("with-shadow");
      },
    });
  });
  setTimeout(() => {
    $("#project-content").show();
    $("#slice-container").hide();
    $(".slice").css({ height: 0 });
    setTimeout(() => {
      $("#project-border").addClass("visible");
    }, 2000);
    setTimeout(() => {
      console.log($("#project-close-button"));
      $("#project-close-button").addClass("visible");
    }, 3000);
  }, 2000);
}

function startAnimation() {
  TweenMax.to($("#first-half"), 0.7, {
    width: "100vw",
    delay: 0.5,
    ease: Power2.easeInOut,
    onComplete: function() {
      var halfWidth = $(window).width();
      var hi = $("#hi");
      var hiWidth = hi.width() + 20;
      var hiStartRight = halfWidth / 2 - hiWidth - 10;
      var hiEndRight = hiStartRight + hiWidth + 40;

      var hiDot = $("#hi-dot");

      hi.css("right", hiStartRight + "px");
      TweenMax.to(hi, 0.3, {
        right: hiEndRight,
        ease: Power2.easeOut,
        onComplete: function() {
          TweenMax.to(hiDot, 0.7, {
            scale: 1,
            delay: 0.3,
            ease: Elastic.easeOut,
          });
          var nice = $("#nice");
          var niceWidth = nice.width();
          var niceStartLeft = halfWidth / 2 - niceWidth - 10;
          var niceEndLeft = niceStartLeft + niceWidth + 20;
          nice.css({
            left: niceStartLeft + "px",
            display: "inline",
          });
          TweenMax.to(nice, 0.3, {
            left: niceEndLeft,
            delay: 1,
            ease: Power2.easeOut,
            onComplete: function() {
              var iam = $("#iamdragos");
              hi.css("z-index", 0);
              TweenMax.to(hi, 0.2, {
                right: hiStartRight,
                delay: 0.5,
                onComplete: function() {
                  hi.hide();
                  TweenMax.to(nice, 0.2, {
                    left: niceStartLeft,
                    ease: Power2.easeOut,
                    onComplete: function() {
                      nice.hide();
                      showIAm();
                    },
                  });
                },
              });
            },
          });
        },
      });
    },
  });
}

function showIAm() {
  var iam = $("#iamdragos");
  TweenMax.to($("#first-half"), 0.7, {
    right: "0",
    backgroundColor: "#E5A12B",
    ease: Power2.easeInOut,
    onComplete: function() {
      var andthis = $("#andthis");
      andthis.css("display", "inline");
      TweenMax.to($("#first-half"), 0.5, {
        top: "-50%",
        ease: Power2.easeInOut,
        onComplete: function() {
          TweenMax.to(iam, 0.7, {
            top: "40%",
            color: "#E5A12B",
            ease: Power2.easeInOut,
          });
          showAndThis();
        },
      });
    },
  });
}

function showAndThis() {
  var iam = $("#iamdragos");
  var andthis = $("#andthis");
  TweenMax.to(andthis, 0.7, { top: "52%", ease: Power2.easeInOut });
  TweenMax.to($("#first-half"), 0.7, {
    height: "4px",
    top: "50%",
    ease: Power2.easeInOut,
    onComplete: function() {
      TweenMax.to($("#first-half"), 0.2, {
        top: "0%",
        height: "100vh",
        delay: 0.2,
        ease: Power2.easeInOut,
        onComplete: function() {
          iam.hide();
          andthis.hide();
          showIsWhatIDo();
        },
      });
    },
  });
}

function showIsWhatIDo() {
  TweenMax.to($("#first-half"), 0.8, {
    backgroundColor: "#85C149",
    ease: Power2.easeInOut,
  });
  var iswhatido = $("#iswhatido");
  var thisElement = $("#this");
  iswhatido.show();
  $("#first-half").css({
    "z-index": 1,
  });
  $(iswhatido).css({
    "z-index": 2,
  });
  $("#map").css({
    top: "0",
  });
  mapContent.css({
    top: "100vh",
  });
  TweenMax.to(iswhatido, 1.5, {
    top: "45%",
    ease: Bounce.easeOut,
    onComplete: function() {
      thisElement.show();
      TweenMax.to(iswhatido, 0.4, {
        top: "145%",
        delay: 0.25,
        ease: Back.easeIn,
        onComplete: function() {
          TweenMax.to($("#first-half"), 0.4, {
            opacity: 0,
            delay: 0.05,
            ease: Power2.easeIn,
            onComplete: () => {
              $("#first-half").hide();
            },
          });
          showMap();
        },
      });
    },
  });
}

function showMap() {
  mapContent.css({ opacity: 1 });
  $("#bg-map").css({ opacity: 0 });
  $(".graphic-element").css({ opacity: 0 });

  centerMapV();
  setTimeout(() => {
    $("#cloud-1").css({ left: "110vw" });
    $("#cloud-2").css({ left: "-100vw" });
    $("#cloud-3").css({ left: "110vw" });
    $("#cloud-4").css({ left: "-100vw" });
  }, 200);
  TweenMax.to($("#bg-map"), 0.6, {
    opacity: 1,
    delay: 1.2,
    onComplete: () => {
      $(".graphic-element").css({ opacity: 1 });
      showMapElements();
    },
  });

  $("#mouse").css({
    transform: "scale(1,1)",
  });
  $("#header").addClass("shown");
  $("#sun, #moon").css({
    opacity: 1,
  });
  $(window).on("mousemove", doParallax);
}

function showMapElements() {
  var blurElements = $(".element-blur");
  var clearElements = $(".element-clear");
  var markerElements = $(".element-marker-clear");

  var tweenEndTime = (blurElements.length - 1) * 0.3;
  blurElements.each(function(index, element) {
    var delay = index * 0.3;
    $(element).css({ opacity: 1 });
    TweenMax.to($(element), 0.8, {
      delay: delay,
      top: 0,
      ease: Strong.easeOut,
      onComplete: function() {
        var id = $(element).attr("id");
        var clearID = id.split("blur").join("clear");
        $(element).hide();
        $("#" + clearID).css({ top: 0 });
      },
    });
  });

  setTimeout(function() {
    markerElements.each(function(index, element) {
      var delay = index * 0.1;
      var endTop = $(element).attr("data-end-top");
      TweenMax.to($(element), 1.5, {
        delay: delay,
        top: endTop,
        ease: Bounce.easeOut,
      });
    });
  }, tweenEndTime * 1000 + 1200);
}

function onMarkerHover(e) {
  resetJump();
  jumpTarget = e.target;
  jumpTween = TweenMax.fromTo(
    $(jumpTarget),
    0.5,
    { marginTop: 15 },
    { marginTop: -15, yoyo: true, repeat: 1000 }
  );
}
function onMarkerLeave(e) {
  resetJump();
}

function resetJump() {
  if (jumpTarget) {
    TweenMax.to($(jumpTarget), 0.35, { marginTop: 15, ease: Strong.easeIn });
    jumpTarget = null;
  }
  if (jumpTween) {
    jumpTween.kill();
    jumpTween = null;
  }
}

function doParallax(e) {
  const clouds = $("#clouds_clear_sd");
  const sun = $("#sun");
  const moon = $("#moon");
  const mapContent = $("#map-content");
  const bgDay = $("#bg-day");

  const offsetLeft = -(e.clientX - $(window).width() / 2);
  const offsetTop = -(e.clientY - $(window).height() / 2);

  if (sun) {
    let top;
    let x = e.clientX * 2;
    let leftPercentage = x / $(window).width();
    if (leftPercentage < 0.5) {
      top = 50 - leftPercentage * 50;
    } else {
      top = leftPercentage * 50;
    }
    TweenMax.to(sun, 0.3, {
      left: x,
      top: top - 20 + "vh",
    });
  }

  if (moon) {
    let top;
    let x = e.clientX * 2 - $(window).width();
    let leftPercentage = x / $(window).width();
    if (leftPercentage < 0.5) {
      top = 50 - leftPercentage * 50;
    } else {
      top = leftPercentage * 50;
    }
    TweenMax.to(moon, 0.3, {
      left: x,
      top: top - 20 + "vh",
    });
  }

  if (bgDay) {
    let opacity = 0;
    let x = e.clientX;
    let leftPercentage = x / $(window).width();
    if (leftPercentage < 0.25) {
      opacity = leftPercentage * 4 + 0.15;
    } else if (leftPercentage < 0.4) {
      opacity = 1;
    } else if (leftPercentage < 0.6) {
      opacity = 1 - (leftPercentage - 0.4) * 5;
    } else {
      opacity = 0;
    }

    bgDay.css({ opacity });
  }

  if (clouds) {
    TweenMax.to(clouds, 0.3, {
      marginLeft: offsetLeft / 16,
      marginTop: offsetTop / 16,
    });
  }
  if (mapContent) {
    TweenMax.to(mapContent, 0.3, {
      marginLeft: offsetLeft / 25,
      marginTop: offsetTop / 25,
    });
  }
}
