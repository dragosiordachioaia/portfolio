import $ from "jquery";
import { TweenMax } from "gsap";

import { projects } from "./data/projects";
import { splitText, revealSplitText, hideSplitText } from "./splitText";

export function openProject() {
  loadDemo();
  resetProjectScreen();
  assignProjectData(selectedProject);

  $("#project-container").show();
  $("#header").removeClass("shown");

  showSlices().then(animateProjectContent);
}

export function closeProject() {
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
    }, index * 50 + 50);
  });
  setTimeout(hideSlices, 650);
  setTimeout(() => $("#project-content").hide(), 800);
  setTimeout(() => {
    $("#project-container").hide();
    $("#project-content").removeClass("demo");
    $("#header").addClass("shown");
  }, 1500);
}

function resetProjectScreen() {
  $("#project-title").html("");
  $("#project-specs").html("");
  $("#project-container .animatable").removeClass("visible");
  $("#project-content").removeClass("demo");
  $("#project-mockup-image").css("opacity", 0);
  TweenMax.set($("#project-explore"), { scale: 0 });
}

function assignProjectData(selectedProject) {
  $("#project-count").text("0" + window.selectedProject);
  $("#project-title").html(selectedProject.title);
  let rolesText = selectedProject.roles.join(", ");
  let rolesLabel = `my role${selectedProject.roles.length > 1 ? "s" : ""}`;
  $("#project-subtitle").text(`${rolesLabel}: ${rolesText}`);
  $("#project-description").text(selectedProject.description);

  // addProjectSpecs(selectedProject);
  addProjectTags(selectedProject);
  splitText("#project-title");
}

function addProjectSpecs(selectedProject) {
  let specs = $("#project-specs");
  selectedProject.specs.forEach(specData => {
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
}

function addProjectTags(selectedProject) {
  let specs = $("#project-specs");
  selectedProject.specs.forEach(specData => {
    specData.values.forEach(valueText => {
      let newSpecElement = $(`<li>${valueText}</li>`);
      specs.append(newSpecElement);
    });
  });
}

function showSlices() {
  return new Promise((resolve, reject) => {
    let count = $(".slice").length;
    $(".slice").css({ "background-color": selectedProject.colors.light });
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

    $("#project-border").css({
      "border-color": selectedProject.colors.medium,
    });
    $("#project-specs li").css({
      color: selectedProject.colors.dark,
    });
    $("#project-border").addClass("visible");
    $("#project-container .animatable").addClass("visible");
  }, 100);
  $("#project-specs li").each((index, element) => {
    setTimeout(() => {
      $(element).addClass("visible");
    }, index * 50 + 500);
  });
  setTimeout(() => {
    $("#project-close-button").addClass("visible");
    TweenMax.to($("#project-explore"), 0.4, { scale: 1 });
  }, 1000);
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
      // onComplete: () => setTimeout(loadDemo, 1500),
    });
    TweenMax.to($("#project-mockup"), 0.7, {
      top: 0,
      opacity: 1,
      ease: Power1.easeInOut,
      delay: 0.15,
    });
  }, 720);
}

function loadDemo() {
  if (selectedProject.demo.video) {
    // $("#project-mockup-image").hide();
    // $("#project-mockup-video").show();
    $("#project-mockup-video").html(selectedProject.demo.video);
  } else {
    // $("#project-mockup-video").hide();
    // $("#project-mockup-image").show();
    let imageElement = $("#project-mockup-image");

    imageElement.on("load", () => {
      TweenMax.to(imageElement, 0.4, { opacity: 1 });
    });
    imageElement.attr(
      "src",
      `graphics/portfolio/${selectedProject.demo.screenshot}`
    );
  }
}

export function showDemo() {
  TweenMax.to($("#project-explore"), 0.4, { scale: 0 });
  $("#project-border").css({ "border-width": 0 });
  $("#project-mockup").addClass("relative");
  let topPosition = $("#project-mockup")[0].getBoundingClientRect().top;
  let difference = $(window).height() - topPosition;
  console.log(topPosition, difference);
  $("#project-content").addClass("demo");

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
