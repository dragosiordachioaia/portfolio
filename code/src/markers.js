/**
 This stuff is only to help with repositioning markers and is normally 
 activated by un-commenting the corresponding event listener for clicks
 on markers
**/

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
  let crtLeft = parseFloat(window.selectedMarker.data("left"));
  let crtTop = parseFloat(window.selectedMarker.data("top"));
  let newLeft = crtLeft + x / 2;
  let newTop = crtTop + y / 2;
  console.log(newLeft, newTop);
  window.selectedMarker.css({ left: newLeft + "%", top: newTop + "%" });
  window.selectedMarker.data({ left: newLeft, top: newTop });
}
