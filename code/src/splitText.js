import $ from "jquery";

export function splitText(elementSelector) {
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

export function revealSplitText(elementSelector) {
  $(`${elementSelector} .letter`).each((index, element) => {
    setTimeout(() => {
      $(element).addClass("visible");
    }, index * 30);
  });
}

export function hideSplitText(elementSelector) {
  let count = $(`${elementSelector} .letter`).length;
  $(`${elementSelector} .letter`).each((index, element) => {
    setTimeout(() => {
      $(element).removeClass("visible");
    }, (count - index) * 30);
  });
}
