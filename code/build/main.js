frame1();

function frame1() {
  TweenMax.to($('#first-half'), 0.7, {width: '100vw', delay: 0.5, ease: Power2.easeInOut, onComplete: function() {
    var halfWidth = $(window).width();
    var hi = $('#hi');
    var hiWidth = hi.width() + 20;
    var hiStartRight = halfWidth/2 - hiWidth - 10;
    var hiEndRight = hiStartRight + hiWidth + 40;

    var hiDot = $('#hi-dot');

    hi.css('right', hiStartRight + 'px');
    TweenMax.to(hi, 0.3, {right: hiEndRight, delay: 0.7, ease: Power2.easeOut, onComplete: function() {
      TweenMax.to(hiDot, 0.7, {scale: 1, delay: 0.3, ease: Elastic.easeOut})
      var nice = $('#nice');
      var niceWidth = nice.width();
      var niceStartLeft = halfWidth/2 - niceWidth - 10;
      var niceEndLeft = niceStartLeft + niceWidth + 20;
      nice.css({
        left: niceStartLeft + 'px',
        display: 'inline',
      });
      TweenMax.to(nice, 0.3, {left: niceEndLeft, delay: 1, ease: Power2.easeOut, onComplete: function() {
        var iam = $('#iamdragos');
        hi.css('z-index', 0);
        TweenMax.to(hi, 0.2, {right: hiStartRight, delay: 1.5, onComplete: function() {
          hi.hide();
          TweenMax.to(nice, 0.2, {left: niceStartLeft, ease: Power2.easeOut, onComplete: function() {
            nice.hide();
            TweenMax.to($('#first-half'), 0.7, {right: '0', backgroundColor: '#ff5e59', delay: 0.5, ease: Power2.easeInOut, onComplete: function() {
              var andthis = $('#andthis');
              andthis.css('display', 'inline');
              TweenMax.to($('#first-half'), 0.5, {top: '-50%', delay: 0.5, ease: Power2.easeInOut, onComplete: function() {
                TweenMax.to(iam, 0.5, {top: '40%', color: '#ff5e59', delay: 0.5, ease: Power2.easeInOut});
                TweenMax.to(andthis, 0.5, {top: '52%', delay: 0.5, ease: Power2.easeInOut});
                TweenMax.to($('#first-half'), 0.5, {height: '4px', top: '50%', delay: 0.5, ease: Power2.easeInOut, onComplete: function() {
                  TweenMax.to($('#first-half'), 0.2, {top: '0%', height: '100vh', delay: 0.5, ease: Power2.easeInOut, onComplete: function() {
                    iam.hide();
                    andthis.hide();
                    TweenMax.to($('#first-half'), 0.5, {backgroundColor: '#7A285C', ease: Power2.easeInOut});
                    var iswhatido = $('#iswhatido');
                    var thisElement = $('#this');
                    iswhatido.show();

                    TweenMax.to(iswhatido, 1.5, {top: '45%', delay: 0.5, ease: Bounce.easeOut, onComplete: function() {
                      thisElement.show();
                      TweenMax.to(thisElement, 0.5, {top: '9%', delay: 0.5, ease: Power2.easeInOut});
                      TweenMax.to(iswhatido, 0.5, {top: '15%', scale: 0.6, delay: 0.5, ease: Power2.easeInOut, onComplete: function() {

                      }});
                    }});
                  }});
                }});
              }});
            }});
          }});
        }});
      }});
    }});
  }});
}
