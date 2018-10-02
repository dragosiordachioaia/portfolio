import $ from "jquery";
import { TweenMax } from "gsap";

let filters = document.querySelector(".filters"); // the SVG that contains the filters
let defs = filters.querySelector("defs"); // the  element inside the SVG
let blurFilter = defs.querySelector("#blur-filter"); // the blur filter

let speed = 0;

export function setBlur(blurID, y) {
  let filterElement = document.querySelector(blurID).children[0];
  y = Math.floor(Math.abs(y));
  filterElement.setAttribute("stdDeviation", `0,${y}`);
}

function deleteBlurFilter(blurID) {
  let filterElement = document.querySelector(blurID);
  filterElement.parentNode.removeChild(filterElement);
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

export function animateWithBlur({
  element,
  coordinate,
  tweenParams,
  duration,
}) {
  let lastPos = element.getBoundingClientRect()[coordinate];
  let crtPos = element.getBoundingClientRect()[coordinate];
  let speed = 0;
  let randomID = Math.floor(Math.random() * 1000000);
  let blurName = `blur-${randomID}`;
  let blurID = `#${blurName}`;
  cloneBlurFilter(blurName, element);

  function onCompleteCallback() {
    setBlur(blurID, 0);
    deleteBlurFilter(blurID);
    if (
      tweenParams.onComplete &&
      typeof tweenParams.onComplete === "function"
    ) {
      tweenParams.onComplete();
    }
  }

  var endTop = $(element).attr("data-end-top");
  TweenMax.to($(element), duration, {
    ...tweenParams,
    onUpdate: () => {
      crtPos = element.getBoundingClientRect()[coordinate];
      speed = crtPos - lastPos;
      setBlur(blurID, speed / 2);
      lastPos = crtPos;
    },
    onComplete: onCompleteCallback,
  });
}
