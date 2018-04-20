TweenMax.to($('#first-half'), 0.7, {width: '50vw', delay: 0.5, ease: Power2.easeInOut, onComplete: function() {


  var halfWidth = $(window).width();
  var hi = $('#hi');
  var hiWidth = hi.width();
  var hiStartRight = halfWidth/2 - hiWidth - 10;
  var hiEndRight = hiStartRight + hiWidth + 20;

  hi.css('right', hiStartRight + 'px');
  TweenMax.to(hi, 0.3, {right: hiEndRight, delay: 0.7, ease: Power2.easeOut, onComplete: function() {
    var nice = $('#nice');
    var niceWidth = nice.width();
    var niceStartLeft = halfWidth/2 - niceWidth - 10;
    var niceEndLeft = niceStartLeft + niceWidth + 20;
    nice.css({
      left: niceStartLeft + 'px',
      display: 'inline',
    });
    TweenMax.to(nice, 0.3, {left: niceEndLeft, delay: 1, ease: Power2.easeOut});
  }});
}});
