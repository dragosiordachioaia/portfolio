import $ from "jquery";
import { TweenMax } from "gsap";

import "./less/main.less";

import { skills } from "./skills";

var initialMapWidth;
var initialMapHeight;
let crtScale = 0;
var mapContent = $("#map-content");
var jumpTween;
var jumpTarget;
let buildingsScale = 0;
let selectedProject;

// var buildings = ["buildings_clear_sd", "clouds_clear_sd"];
let buildings = [
  // { name: "buildings_clear_sd" },
  { name: "map_contents" },
  { name: "clouds_clear_sd" },
  // { name: "bat_signal" },
  { name: "big_ship" },
  // { name: "cars" },
  // { name: "chairs" },
  // { name: "clouds_clear_sd" },
  { name: "container_ship" },
  // { name: "fair" },
  // { name: "fair_fence" },
  // { name: "farm" },
  // { name: "gameloft" },
  // { name: "generic_building_1" },
  // { name: "generic_building_2" },
  // { name: "generic_tree_1" },
  { name: "macbook" },
  // { name: "mcdonalds" },
  // { name: "mountain" },
  // { name: "orchard" },
  // { name: "people" },
  // { name: "plexiled" },
  // { name: "residential" },
  // { name: "smokestacks" },
  // { name: "stadium" },
  // { name: "tennis" },
  // { name: "theatre" },
  // { name: "travel" },
  // { name: "wind_turbines" },
];

let projects = [
  {
    title: "The second project",
    roles: ["front-end", "back-end"],
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ut gravida arcu. Curabitur dapibus dolor nisi. Pellentesque ex dolor,
      tristique ut magna vel, rhoncus laoreet purus. Vestibulum maximus arcu sed enim ultricies hendrerit. Aenean sit amet accumsan nibh.
       Nam dictum vulputate sem at iaculis. Morbi fermentum nunc vel aliquet feugiat. Vestibulum ac sapien cursus mi varius hendrerit.
       Nulla fermentum, metus ac vestibulum blandit, ipsum nisl pharetra odio, eu vestibulum tellus ipsum sagittis dolor. Mauris sit
       amet euismod neque, sed facilisis leo. Cras vitae lorem in magna varius venenatis. Vestibulum in porta mauris.`,
  },
  {
    title: "Seating Plan Editor",
    roles: ["back-end"],
    demo: {
      screenshot: "charts.png",
      video:
        '<iframe src="https://www.youtube-nocookie.com/embed/Z3DVf80p3uM?rel=0&amp;controls=0&amp;showinfo=0&amp;mute=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""></iframe>',
    },
    specs: [
      {
        label: "front-end",
        values: ["jQuery", "LESS"],
      },
      {
        label: "back-end",
        values: ["Flask"],
      },
      {
        label: "storage",
        values: ["MySQL"],
      },
      {
        label: "deployment",
        values: ["CircleCI", "Kubernetes", "Google Cloud"],
      },
    ],
    description:
      "Sed a velit efficitur, cursus massa vitae, aliquam justo. Suspendisse lobortis pretium ligula ut laoreet. Cras eleifend aliquam enim, sed eleifend ipsum vulputate eu. Aliquam erat volutpat. Quisque venenatis vitae neque a vulputate. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin tincidunt vel purus in tincidunt. Maecenas sed erat elit. Proin imperdiet, diam nec congue cursus, lectus quam sollicitudin tortor, sit amet auctor justo ante nec sem. Vestibulum luctus dictum eros rutrum interdum. Integer laoreet accumsan felis et dignissim. Maecenas porttitor ipsum enim, in mattis nulla ultricies in. Duis sed venenatis purus. Aenean dapibus, ipsum non varius malesuada, lacus dui aliquam arcu, id aliquam massa ante eget odio. Suspendisse augue enim, tincidunt ac nunc sed, condimentum blandit eros.",
  },
];

let markers = [
  { name: 1, left: "11.5%", top: "59%" },
  { name: 2, left: "46%", top: "64.5%" },
  { name: 3, left: "54%", top: "51.5%" },
  { name: 4, left: "56%", top: "75%" },
  { name: 5, left: "58%", top: "29.5%" },
  { name: 7, left: "63.5%", top: "39%" },
  { name: 6, left: "69%", top: "57%" },
  { name: 8, left: "74.5%", top: "81.5%" },
  { name: 9, left: "77.5%", top: "29.5%" },
];

$("#project-explore").click(showDemo);

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
    mapContent.css({ width: "110%", left: "-2%" });
  }

  var targetScale = targetWidth / initialMapWidth;
  if (targetScale * initialMapHeight >= windowHeight * 0.95) {
    targetScale = (windowHeight / initialMapHeight) * 0.95;
  }
  crtScale = targetScale;
  // TODO: fix vertical scaling responsiveness

  // mapContent.css({transform: 'scale('+targetScale+')'})
  // var newScaleStr = "translate(-33%, -92%) scale(" + targetScale / 1.1 + ")";
  // var newScaleStr = "translate(-33%, -92%)";
  // $(".element-marker-clear").css("transform", newScaleStr);
  // setTimeout(function() {
  //   var targetLeft =
  //     ((windowWidth - targetWidth - 20) / 2) * targetScale + "px";
  //   $(mapContent).css({ left: "5%" });
  // }, 200);
}
window.centerMapH = centerMapH;

function centerMapV() {
  var mapHeight = mapContent.height();
  $(mapContent).css({ top: ($(window).height() - mapHeight + 10) / 2 + "px" });
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
    $(newElem).on("click", e => {
      selectedProject = index;
      openProject();
    });
    $(newElem).on("mouseleave", onMarkerLeave);

    // $(newElem).on("click", e => (selectedMarker = $(newElem)));
  });
}

let selectedMarker;

$(window).on("keydown", e => {
  let code = e.keyCode;
  switch (code) {
    case 39:
      moveMarker(1, 0);
      break;
    case 38:
      moveMarker(0, -1);
      break;
    case 37:
      moveMarker(-1, 0);
      break;
    case 40:
      moveMarker(0, 1);
      break;
    case 80:
      printMarkerPositions();
      break;
  }
});

function printMarkerPositions() {
  let results = [];
  $(".marker").each((index, element) => {
    results.push({
      name: index + 1,
      left: $(element).data("left"),
      top: $(element).data("top"),
    });
  });
  console.log(results);
  results.sort((a, b) => a.left - b.left);
  console.log(results);
  results = results.map(element => {
    return {
      name: element.name,
      left: element.left + "%",
      top: element.top + "%",
    };
  });
  console.log(JSON.stringify(results));
}

function moveMarker(x, y) {
  let crtLeft = parseFloat(selectedMarker.data("left"));
  let crtTop = parseFloat(selectedMarker.data("top"));
  let newLeft = crtLeft + x / 2;
  let newTop = crtTop + y / 2;
  console.log(newLeft, newTop);
  selectedMarker.css({ left: newLeft + "%", top: newTop + "%" });
  selectedMarker.data({ left: newLeft, top: newTop });
}

function closeProject() {
  hideSplitText("#project-title");
  $("#project-border").removeClass("visible");
  $("#project-content .animatable").removeClass("visible");
  $("#project-close-button").removeClass("visible");
  TweenMax.to($("#project-description, #project-mockup"), 0.7, {
    top: "50px",
    opacity: 0,
    ease: Power1.easeInOut,
    onComplete: () => {
      $("#project-description, #project-mockup").hide();
    },
  });
  TweenMax.to($("#project-explore"), 0.4, { scale: 0, delay: 0.2 });
  $("#project-specs li").each((index, element) => {
    setTimeout(() => {
      $(element).removeClass("visible");
    }, index * 100 + 50);
  });
  setTimeout(hideSlices, 450);
  setTimeout(() => $("#project-content").hide(), 800);
  setTimeout(() => {
    $("#project-container").hide();
    $("#project-content").removeClass("demo");
  }, 1500);
}

function openProject() {
  let projectData = projects[selectedProject];

  resetProjectScreen();
  assignProjectData(projectData);

  $("#project-container").show();
  $("#header").removeClass("shown");

  showSlices().then(animateProjectContent);
}

function showDemo() {
  let projectData = projects[selectedProject];
  TweenMax.to($("#project-explore"), 0.4, { scale: 0 });
  $("#project-border").css({ "border-width": 0 });
  $("#project-mockup").addClass("relative");
  let topPosition = $("#project-mockup")[0].getBoundingClientRect().top;
  let difference = $(window).height() - topPosition;
  console.log(topPosition, difference);
  $("#project-content").addClass("demo");
  if (projectData.demo.video) {
    $("#project-mockup-image").hide();
    $("#project-mockup-video").show();
    $("#project-mockup-video").html(projectData.demo.video);
  } else {
    $("#project-mockup-video").hide();
    $("#project-mockup-image").show();
    $("#project-mockup-image").attr(
      "src",
      `graphics/portfolio/${projectData.demo.screenshot}`
    );
  }

  setTimeout(() => {
    $("#project-mockup, #project-description").css({
      display: "block",
      opacity: 0,
      top: "-50px",
    });
    $("#project-mockup").css({ top: "50px" });
    TweenMax.to($("#project-description"), 0.7, {
      top: 0,
      opacity: 1,
      ease: Power1.easeInOut,
    });
    TweenMax.to($("#project-mockup"), 0.7, {
      top: 0,
      opacity: 1,
      ease: Power1.easeInOut,
      delay: 0.15,
    });
  }, 720);
}

function resetProjectScreen() {
  $("#project-title").html("");
  $("#project-specs").html("");
  $("#project-container .animatable").removeClass("visible");
  $("#project-content").removeClass("demo");
  TweenMax.set($("#project-explore"), { scale: 0 });
}

function assignProjectData(projectData) {
  $("#project-count").text("0" + selectedProject);
  $("#project-title").html(projectData.title);
  let rolesText = projectData.roles.join(" | ");
  $("#project-subtitle").text(rolesText);
  $("#project-description").text(projectData.description);
  let specs = $("#project-specs");
  projectData.specs.forEach(specData => {
    let newSpecElement = $("<li></li>");
    newSpecElement.append(
      `<span class="project-spec-label">${specData.label}</span>`
    );
    newSpecElement.append(`<span class="project-spec-values"></span>`);
    specData.values.forEach(valueText => {
      let newSpecValueElement = $(
        `<span class="project-spec-values-inside">${valueText}</span>`
      );
      newSpecElement.find(".project-spec-values").append(newSpecValueElement);
    });
    specs.append(newSpecElement);
  });
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
  $("#project-specs li").each((index, element) => {
    setTimeout(() => {
      $(element).addClass("visible");
    }, index * 150 + 200);
  });
  setTimeout(() => {
    $("#project-close-button").addClass("visible");
    TweenMax.to($("#project-explore"), 0.4, { scale: 1 });
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
  $("#map").css({
    top: "0",
  });
  mapContent.css({
    top: "100vh",
  });
  $("#iswhatido").hide();
  $("#iamdragos").hide();

  mapContent.css({ opacity: 1 });
  $("#bg-map").css({ opacity: 0 });
  $(".building").css({ opacity: 0 });

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
    onComplete: showMapElements,
  });
  // setTimeout(showMapElements, 1900);

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
  }, tweenEndTime * 1000 + 400);
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
