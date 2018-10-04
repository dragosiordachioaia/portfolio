import $ from "jquery";
import { TweenMax } from "gsap";

import "./less/main.less";

import { skills } from "./data/skills";
import { buildings } from "./data/buildings";
import { projects } from "./data/projects";
import { markers } from "./data/markers";
import { openProject, closeProject } from "./project";
import { animateWithBlur, setBlur } from "./blur";
import { showDemo } from "./project";
// import { printMarkerPositions } from "./markers";

var initialMapWidth;
var initialMapHeight;
let crtScale = 0;
var mapContent = $("#map-content");
var jumpTween;
var jumpTarget;
let buildingsScale = 0;

window.selectedProject = null;
window.selectedMarker = 0;

const SLICE_COUNT = 6;

init();

function init() {
  addEventListeners();
  createSlices();
  initialiseMap();

  // for getting the map immediately
  setTimeout(showMap, 1000);

  // for going through with the normal flow
  // startAnimation();
}

function addEventListeners() {
  $("#project-explore").click(showDemo);
  $("#project-close-button").click(closeProject);
  // let headerTop = $(
  //   "#menu-trigger, #menu-name, #menu-profession, #header .folding-list > li.hover"
  // );
  // $("#header").mouseenter(expandMenu);
  // $("#header").mouseleave(collapseMenu);
}

function expandMenu() {
  // console.log("expand");
  // return;
  $("#menu").attr("data-hovered", "1");
  let count = $("#menu .folding-list > li").length;
  $("#menu .folding-list > li").each((index, element) => {
    setTimeout(() => {
      if ($("#menu").attr("data-hovered") == 1) {
        $(element).addClass("hover");
      }
    }, index * 150);
  });
}

function collapseMenu() {
  // console.log("collapse");
  // return;
  $("#menu").attr("data-hovered", null);
  let count = $("#menu .folding-list > li").length;
  $("#menu .folding-list > li").each((index, element) => {
    setTimeout(() => {
      $(element).removeClass("hover");
    }, (count - index) * 150);
  });
}

function createSlices() {
  for (let i = 0; i < SLICE_COUNT; i++) {
    let newSlice = $(`<div id="slice-${i}" class="slice"></div>`);
    newSlice.css({
      left: `${(i / SLICE_COUNT) * 100}%`,
      width: `calc(${100 / SLICE_COUNT}% + 2px)`,
      "z-index": SLICE_COUNT - i,
    });
    $("#slice-container").append(newSlice);
  }
}

function initialiseMap() {
  createMapElements();
}

function createMapElements() {
  let crtMapSize = $("#bg-map").width();
  buildingsScale = crtMapSize / 2000;

  buildings.forEach(function(graphicData, index) {
    setTimeout(function() {
      let elem = $(
        `<img class="building" src="graphics/map/clear/${
          graphicData.name
        }.png" id="graphics-${graphicData.name}" />`
      );
      let newElement = mapContent.append(elem);
    }, index * 200);
  });
  markers.forEach(function(element, index) {
    let newElem = $(`<div class="marker" id="marker-${index}"></div>`);
    newElem.append('<img src="graphics/map/clear/marker.png"/>');
    newElem.append(`<p class="marker-label">${element.name} </p>`);
    // var newElem = $(elemStr);
    mapContent.append(newElem);
    $(newElem).css({
      left: element.left,
    });
    $(newElem).attr({
      "data-end-top": element.top,
      "data-left": parseFloat(element.left),
      "data-top": parseFloat(element.top),
    });
    $(newElem).on("mouseenter", e => onMarkerHover(newElem));
    $(newElem).on("mouseleave", onMarkerLeave);

    $(newElem).on("click", e => {
      window.selectedProject = projects.filter(
        project => project.id === element.id
      )[0];
      openProject();
    });
    // $(newElem).on("click", e => (window.selectedMarker = $(newElem)));
  });
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
    opacity: 0,
    left: "80%",
  });

  TweenMax.to(iswhatido, 0.1, {
    skewX: "-30deg",
    delay: 0.25,
    onComplete: () => {
      TweenMax.to(iswhatido, 0.3, { opacity: 1 });
      TweenMax.to(iswhatido, 1, { left: "50%", ease: Elastic.easeOut });
      TweenMax.to(iswhatido, 1, { skewX: "0deg", ease: Elastic.easeOut });
      setTimeout(showSkillList, 1300);
    },
  });
}

function hideSkillList() {
  deleteLetters([], 0);
  TweenMax.to($("body"), 0.4, { backgroundColor: "#0e1b28" });
  TweenMax.to($("#first-half"), 0.4, {
    opacity: 0,
    delay: 0.05,
    ease: Power2.easeIn,
    onComplete: () => {
      $("#first-half").hide();
      showMap();
    },
  });
}

function changeWord(words, index, cb) {
  let iswhatido = $("#iswhatido");
  let hasSpan = iswhatido.find("span").length > 0;
  if (!hasSpan) {
    let newSpanElement = $(`<span class="word">${iswhatido.text()}</span>`);
    iswhatido.html(newSpanElement);
  }
  if (words.length > 0 && index <= words.length - 1) {
    let secondSpanElement = $(
      `<span class="word">${words[index].content}</span>`
    );
    secondSpanElement.css({ top: "110%" });
    iswhatido.append(secondSpanElement);
    let firstSpanElement = iswhatido.find(".word").first();
    let duration = 0.7;
    let ease = Linear.easeNone;

    if (words[index].elastic) {
      ease = Back.easeInOut;
    }

    if (
      words[index].hasOwnProperty("duration") &&
      !isNaN(words[index].duration) &&
      words[index].duration >= 0
    ) {
      duration = words[index].duration / 1000;
    }

    let lastPos = firstSpanElement[0].getBoundingClientRect().top;
    let crtPos = firstSpanElement[0].getBoundingClientRect().top;
    let speed = 0;

    let filter = "url(#blur-filter)";

    iswhatido.css({
      webkitFilter: filter,
      filter: filter,
    });

    TweenMax.to(firstSpanElement, duration, {
      top: "-110%",
      ease: Back.easeInOut,
      onUpdate: updateBlur,
    });

    TweenMax.to(secondSpanElement, duration, {
      top: "0.4em",
      ease: Back.easeInOut,
      onComplete: () => moveOn(words, index, cb),
    });

    function updateBlur() {
      crtPos = firstSpanElement[0].getBoundingClientRect().top;
      speed = crtPos - lastPos;
      lastPos = crtPos;
      setBlur("#blur-filter", speed / 2);
    }
  }

  function moveOn(words, index, cb) {
    let firstSpanElement = iswhatido.find(".word").first();
    firstSpanElement.remove();
    let delay = 450;
    if (
      words[index].hasOwnProperty("delay") &&
      !isNaN(words[index].delay) &&
      words[index].delay >= 0
    ) {
      delay = words[index].delay;
    }

    if (index < words.length - 1) {
      setTimeout(() => changeWord(words, index + 1, cb), delay);
    } else {
      if (cb && typeof cb === "function") {
        setTimeout(cb, delay);
      }
    }
  }
}

function showSkillList() {
  changeWord(skills, 0, hideSkillList);
}

function deleteLetters(skills, index, cb) {
  let iswhatido = $("#iswhatido");
  let currentText = iswhatido.text();
  if (currentText.length > 0) {
    iswhatido.text(currentText.substr(0, currentText.length - 1));
    setTimeout(() => deleteLetters(skills, index, cb), 25);
  } else {
    if (skills.length > 0 && index <= skills.length - 1) {
      showLetters(skills, index, cb);
    }
  }
}

function showLetters(skills, index, cb) {
  let iswhatido = $("#iswhatido");
  let currentText = iswhatido.text();
  let newText = skills[index];
  if (currentText.length < newText.length) {
    iswhatido.text(newText.substr(0, currentText.length + 1));
    setTimeout(() => showLetters(skills, index, cb), 25);
  } else {
    if (index < skills.length - 1) {
      setTimeout(() => deleteLetters(skills, index + 1, cb), 600);
    } else {
      setTimeout(cb, 600);
    }
  }
}

function showMap() {
  $("#map").css({
    top: "0",
  });
  $("#iswhatido").hide();
  $("#iamdragos").hide();

  mapContent.css({ opacity: 1 });
  $("#bg-map").css({ opacity: 0 });
  $(".building").css({ opacity: 0 });

  setTimeout(() => {
    $("#cloud-1").css({ left: "110vw" });
    $("#cloud-2").css({ left: "-100vw" });
    $("#cloud-3").css({ left: "110vw" });
    $("#cloud-4").css({ left: "-100vw" });
  }, 200);
  TweenMax.to($("#bg-map"), 0.6, { opacity: 1, delay: 1.2 });
  setTimeout(showMapElements, 1200);
  // setTimeout(showMapElements, 1900);

  $("#mouse").css({
    transform: "scale(1,1)",
  });
  $("#header").addClass("shown");
  // $("#sun, #moon").css({
  //   opacity: 1,
  // });
  // $(window).on("mousemove", doParallax);
}

function showMapElements() {
  $(".building").css({ opacity: 1 });
  var markerElements = $(".marker");

  var tweenEndTime = buildings.length * 0.1;
  buildings.forEach((graphicData, index) => {
    let element = $(`#graphics-${graphicData.name}`);

    // clearElements.each(function(index, element) {
    let elemID = element.attr("id");

    element.css({
      opacity: 0,
      top: "5vh",
    });
    TweenMax.to(element, 0.7, {
      top: 0,
      opacity: 1,
      ease: Strong.easeInOut,
      delay: index * 0.15,
    });
  });

  setTimeout(function() {
    markerElements.each(function(index, element) {
      $(element).css({
        opacity: 0,
        top: "-10vh",
      });
      animateWithBlur({
        element,
        coordinate: "top",
        duration: 1.5,
        tweenParams: {
          top: $(element).attr("data-end-top"),
          opacity: 1,
          delay: index * 0.1,
          ease: Bounce.easeOut,
        },
      });
    });
  }, tweenEndTime * 1000 + 900);
}

function onMarkerHover(markerElement) {
  resetJump();
  jumpTarget = markerElement;
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
  const clouds = $("#graphics-clouds_clear_sd");
  const mapContent = $("#map-content");

  const offsetLeft = -(e.clientX - $(window).width() / 2);
  const offsetTop = -(e.clientY - $(window).height() / 2);
  if (clouds) {
    TweenMax.to(clouds, 0.3, {
      marginLeft: offsetLeft / 16,
      marginTop: offsetTop / 16,
    });
  }
  // if (mapContent) {
  //   TweenMax.to(mapContent, 0.3, {
  //     marginLeft: offsetLeft / 25,
  //     marginTop: offsetTop / 25,
  //   });
  // }
}

// setTimeout(() => {
//   let x = -$(window).width() * 0.1;
//   setInterval(() => {
//     x += 10;
//     if (x >= $(window).width() * 1.1) {
//       x = -$(window).width() * 0.2;
//       changeTimeOfDay(x, false);
//     }
//     changeTimeOfDay(x, true);
//   }, 300);
// }, 2000);

// function changeTimeOfDay(clientX, animate) {
//   const sun = $("#sun");
//   const moon = $("#moon");
//   const bgDay = $("#bg-day");
//
//   const offsetLeft = -(clientX - $(window).width() / 2);
//   let duration = animate ? 0.3 : 0;
//   if (sun) {
//     let top;
//     let x = clientX * 2;
//     let leftPercentage = x / $(window).width();
//     if (leftPercentage < 0.5) {
//       top = 50 - leftPercentage * 50;
//     } else {
//       top = leftPercentage * 50;
//     }
//
//     TweenMax.to(sun, duration, {
//       left: x,
//       top: top - 20 + "vh",
//       ease: Linear.easeNone,
//     });
//   }
//
//   if (moon) {
//     let top;
//     let x = clientX * 2 - $(window).width();
//     let leftPercentage = x / $(window).width();
//     if (leftPercentage < 0.5) {
//       top = 50 - leftPercentage * 50;
//     } else {
//       top = leftPercentage * 50;
//     }
//     TweenMax.to(moon, duration, {
//       left: x,
//       top: top - 20 + "vh",
//       ease: Linear.easeNone,
//     });
//   }
//
//   if (bgDay) {
//     let opacity = 0;
//     let x = clientX;
//     let leftPercentage = x / $(window).width();
//     if (leftPercentage < 0.25) {
//       opacity = leftPercentage * 4 + 0.15;
//     } else if (leftPercentage < 0.4) {
//       opacity = 1;
//     } else if (leftPercentage < 0.6) {
//       opacity = 1 - (leftPercentage - 0.4) * 5;
//     } else {
//       opacity = 0;
//     }
//
//     bgDay.css({ opacity });
//   }
// }
