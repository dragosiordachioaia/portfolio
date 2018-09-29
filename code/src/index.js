import $ from "jquery";
import { TweenMax } from "gsap";

import "./less/main.less";

import { skills } from "./skills";

var initialMapWidth;
var initialMapHeight;
var crtScale = 0;
var mapContent = $("#map-content");
var jumpTween;
var jumpTarget;

// var graphicsClear = ["buildings_clear_sd", "clouds_clear_sd"];
var graphicsClear = ["buildings_clear_sd"];

let projects = [
  {
    title: "New Project title",
    roles: ["front-end", "back-end"],
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ut gravida arcu. Curabitur dapibus dolor nisi. Pellentesque ex dolor,
      tristique ut magna vel, rhoncus laoreet purus. Vestibulum maximus arcu sed enim ultricies hendrerit. Aenean sit amet accumsan nibh.
       Nam dictum vulputate sem at iaculis. Morbi fermentum nunc vel aliquet feugiat. Vestibulum ac sapien cursus mi varius hendrerit.
       Nulla fermentum, metus ac vestibulum blandit, ipsum nisl pharetra odio, eu vestibulum tellus ipsum sagittis dolor. Mauris sit
       amet euismod neque, sed facilisis leo. Cras vitae lorem in magna varius venenatis. Vestibulum in porta mauris.`,
  },
  {
    title: "Project numero dos",
    roles: ["back-end"],
    description:
      "Once upon a second time there was a lovely project, and it actually worked.",
  },
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
setTimeout(showMap, 1000);
// startAnimation();
createSlices();
$("#project-close-button").click(closeProject);

function createSlices() {
  const SLICE_COUNT = 6;
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

function splitText(elementSelector) {
  let element = $(elementSelector);
  let newText = element
    .text()
    .split("")
    .map(convertLetterToElement);
  element.html(newText);
}

function convertLetterToElement(letter, index) {
  let isNewLine = false;
  if (letter.charCodeAt(0) === 10) {
    isNewLine = true;
  }

  if (isNewLine) {
    return "<br />";
  } else {
    return `<span class='letter'>${letter}</span>`;
  }
}

function revealSplitText(elementSelector) {
  $(`${elementSelector} .letter`).each((index, element) => {
    setTimeout(() => {
      $(element).addClass("visible");
    }, index * 30);
  });
}

function hideSplitText(elementSelector) {
  let count = $(`${elementSelector} .letter`).length;
  $(`${elementSelector} .letter`).each((index, element) => {
    setTimeout(() => {
      $(element).removeClass("visible");
    }, (count - index) * 30);
  });
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
  graphicsClear.forEach(function(element, index) {
    setTimeout(function() {
      var elemStr = `<img class="graphic-element element-clear" src="graphics/map/clear/${element}.png" id="${element}" />`;
      var newElement = mapContent.append($(elemStr));
    }, index * 200);
  });
  markers.forEach(function(element, index) {
    var elemStrClear = `<img class="marker element-marker-clear" src="graphics/map/clear/${
      element.name
    }.png" id="${element.name}-clear"/>`;
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

function closeProject() {
  hideSplitText("#project-title");
  $("#project-border").removeClass("visible");
  $("#project-content .animatable").removeClass("visible");
  $("#project-close-button").removeClass("visible");
  setTimeout(hideSlices, 450);
  setTimeout(() => $("#project-content").hide(), 800);
  setTimeout(() => $("#project-container").hide(), 1500);
}

function openProject(projectIndex) {
  let projectData = projects[projectIndex];

  resetProjectScreen();
  assignProjectData(projectData, projectIndex);

  $("#project-container").show();
  $("#header").removeClass("shown");

  showSlices().then(animateProjectContent);
}

function resetProjectScreen() {
  $("#project-title").html("");
  $("#project-container .animatable").removeClass("visible");
}

function assignProjectData(projectData, projectIndex) {
  $("#project-count").text("0" + projectIndex);
  $("#project-title").html(projectData.title);
  let rolesText = projectData.roles.join(" | ");
  $("#project-subtitle").text(rolesText);
  $("#project-description").text(projectData.description);
  splitText("#project-title");
}

function showSlices() {
  return new Promise((resolve, reject) => {
    let count = $(".slice").length;
    $(".slice").each((index, sliceElement) => {
      $(sliceElement).addClass("with-shadow");
      setTimeout(() => {
        TweenMax.to($(sliceElement), 0.7, {
          height: "100%",
          ease: Power2.easeIn,
        });
      }, index * 100);
      setTimeout(() => {
        if (index === count - 1) {
          resolve();
        }
      }, index * 100 + 500);
      setTimeout(() => {
        $(sliceElement).removeClass("with-shadow");
      }, index * 100 + 800);
    });
  });
}

function hideSlices() {
  let count = $(".slice").length;
  $(".slice").each((index, sliceElement) => {
    $(sliceElement).addClass("with-shadow");
    setTimeout(() => {
      TweenMax.to($(sliceElement), 0.4, {
        height: 0,
        ease: Power1.easeIn,
      });
    }, (count - index) * 70);
  });
}

function animateProjectContent() {
  $("#project-content").show();
  setTimeout(() => {
    revealSplitText("#project-title");
    $("#project-border").addClass("visible");
    $("#project-container .animatable").addClass("visible");
  }, 100);
  setTimeout(() => {
    $("#project-close-button").addClass("visible");
  }, 1000);
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
  // $("#map").css({
  //   top: "0",
  // });
  // mapContent.css({
  //   top: "100vh",
  // });
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

let filters = document.querySelector(".filters"); // the SVG that contains the filters
let defs = filters.querySelector("defs"); // the  element inside the SVG
let blurFilter = defs.querySelector("#blur-filter"); // the blur filter
let filter = "url(#blur-filter)";
let speed = 0;

function setBlur(blurID, y) {
  let filterElement = document.querySelector(blurID).children[0];
  y = Math.floor(Math.abs(y));
  filterElement.setAttribute("stdDeviation", `0,${y}`);
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
      onComplete: moveOn,
    });

    function updateBlur() {
      crtPos = firstSpanElement[0].getBoundingClientRect().top;
      speed = crtPos - lastPos;
      lastPos = crtPos;
      setBlur("#blur-filter", speed / 2);
    }
  }

  function moveOn() {
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
  // deleteLetters(skills, 0, hideSkillList);
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
  $("#iamdragos").hide();
  $("#map").css({
    top: "0",
  });
  mapContent.css({
    top: "100vh",
  });

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
    // onComplete: () => {
    //   ();
    // },
  });
  setTimeout(showMapElements, 1100);

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
  $(".graphic-element").css({ opacity: 1 });
  var clearElements = $(".element-clear");
  var markerElements = $(".element-marker-clear");

  var tweenEndTime = (clearElements.length - 1) * 0.3;
  clearElements.each(function(index, element) {
    let elemID = $(element).attr("id");
    let top;
    if (elemID === "buildings_clear_sd") {
      top = "5vh";
    } else if (elemID === "clouds_clear_sd") {
      top = "30vh";
    }
    $(element).css({
      opacity: 0,
      top,
    });

    console.log();
    animateWithBlur({
      element,
      blurName: `blur-graphic-${index}`,
      coordinate: "top",
      duration: 1,
      tweenParams: {
        top: 0,
        opacity: 1,
        delay: 0, //index * 0.3,
        ease: Strong.easeInOut,
      },
    });
  });

  setTimeout(function() {
    markerElements.each(function(index, element) {
      $(element).css({
        opacity: 0,
        top: "-30vh",
      });
      animateWithBlur({
        element,
        blurName: `blur-marker-${index}`,
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
  }, tweenEndTime * 1000 + 1200);
}

function animateWithBlur({
  coordinate,
  tweenParams,
  element,
  blurName,
  duration,
}) {
  let lastPos = element.getBoundingClientRect()[coordinate];
  let crtPos = element.getBoundingClientRect()[coordinate];
  let speed = 0;
  let blurID = `#${blurName}`;
  cloneBlurFilter(blurName, element);

  var endTop = $(element).attr("data-end-top");
  TweenMax.to($(element), duration, {
    ...tweenParams,
    onUpdate: () => {
      crtPos = element.getBoundingClientRect()[coordinate];
      speed = crtPos - lastPos;
      setBlur(blurID, speed / 2);
      lastPos = crtPos;
    },
    onComplete: () => {
      setBlur(blurID, 0);
    },
  });
}

function cloneBlurFilter(blurID, targetElement) {
  let blurClone = blurFilter.cloneNode(true);
  // create and set a new ID so we can use the filter through CSS
  blurClone.setAttribute("id", blurID);
  let filterID = "url(#" + blurID + ")";
  defs.appendChild(blurClone);

  $(targetElement)
    .css({
      webkitFilter: filterID,
      filter: filterID,
    })
    .attr("data-blur-id", blurID);
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
