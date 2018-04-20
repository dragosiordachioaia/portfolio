frame1();

function frame1() {
  // console.log('here');
  $('#sections li').on('mouseenter', function() {
    $('#sections li').css('color', '#000');
    $(this).css('color', '#fff');
    TweenMax.to($('body'), 0.5, {backgroundColor: '#000'});
    // $('#sections li:not(:last-child)').css('border-right-color', '#000');
  });

  $('#sections li').on('mouseleave', function() {
    $('#sections li').css('color', '#000');
    TweenMax.to($('body'), 0.5, {backgroundColor: '#fff'});
    // $('#sections li:not(:last-child)').css('border-right-color', '#000');
  });


  TweenMax.to($('#first-half'), 0.7, {width: '100vw', delay: 0.5, ease: Power2.easeInOut, onComplete: function() {
    var halfWidth = $(window).width();
    var hi = $('#hi');
    var hiWidth = hi.width() + 20;
    var hiStartRight = halfWidth/2 - hiWidth - 10;
    var hiEndRight = hiStartRight + hiWidth + 40;

    var hiDot = $('#hi-dot');

    hi.css('right', hiStartRight + 'px');
    TweenMax.to(hi, 0.3, {right: hiEndRight, ease: Power2.easeOut, onComplete: function() {
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
            TweenMax.to($('#first-half'), 0.7, {right: '0', backgroundColor: '#E5A12B', ease: Power2.easeInOut, onComplete: function() {
              var andthis = $('#andthis');
              andthis.css('display', 'inline');
              TweenMax.to($('#first-half'), 0.5, {top: '-50%', ease: Power2.easeInOut, onComplete: function() {
                TweenMax.to(iam, 0.5, {top: '40%', color: '#E5A12B', ease: Power2.easeInOut});
                TweenMax.to(andthis, 0.5, {top: '52%', ease: Power2.easeInOut});
                TweenMax.to($('#first-half'), 0.5, {height: '4px', top: '50%', ease: Power2.easeInOut, onComplete: function() {
                  TweenMax.to($('#first-half'), 0.2, {top: '0%', height: '100vh', delay: 0.2, ease: Power2.easeInOut, onComplete: function() {
                    iam.hide();
                    andthis.hide();
                    TweenMax.to($('#first-half'), 0.5, {backgroundColor: '#85C149', ease: Power2.easeInOut});
                    var iswhatido = $('#iswhatido');
                    var thisElement = $('#this');
                    iswhatido.show();
                    TweenMax.to(iswhatido, 1.5, {top: '45%', ease: Bounce.easeOut, onComplete: function() {
                      thisElement.show();
                      TweenMax.to($('#first-half'), 1, {backgroundColor: 'fff', delay: 0.15, ease: Power2.easeInOut});
                      // TweenMax.to(thisElement, 0.5, {top: '9%', color: '#444', delay: 0.5, ease: Power2.easeInOut});
                      TweenMax.to(iswhatido, 1, {top: '15%'/*, color: '#444'*/, opacity: 0, scale: 0.6, delay: 0.5, ease: Power2.easeInOut, onComplete: function() {
                        var sections = $('#sections');
                        sections.show();
                        TweenMax.to(sections, 1, {opacity: 1});
                        var sectionElements = $('#sections li');
                        sectionElements.each(function(index, elem) {
                        //   console.log(index, elem);
                          TweenMax.to($(this).find('span'), 3, {opacity: 1, delay: index * 1.5});
                        });
                        // TweenMax.to($(this).find('span'), 2, {opacity: 1, top: 0, delay: 1});
                        // TweenMax.to(thisElement, 0.5, {opacity: 0, delay: 0.5});
                        // TweenMax.to(iswhatido, 0.5, {opacity: 0, delay: 0.5});
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
