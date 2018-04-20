TweenMax.to($('#first-half'), 0.7, {width: '50vw', delay: 0.5, ease: Power2.easeInOut});
setTimeout(function() {
  $('#nice').show();
}, 2000);
TweenMax.to($('#hi'), 0.3, {left: '40%', delay: 1.7, ease: Power2.easeOut});
TweenMax.to($('#nice'), 0.3, {left: '52%', delay: 2.7, ease: Power2.easeOut});
