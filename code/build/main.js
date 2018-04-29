var graphics = [
  'mountain',
  'buildings',
  'fair_fence',
  'fair',
  'container_ship',
  'big_ship',
  'macbook',
  // 'smokestacks',
  // 'residential',
  // 'theatre',
  // 'wind_turbines',
  // 'tennis',
  'cars',
  //'farm',
  //'orchard',
  //'plexiled',
  // 'generic_building_1',
  // 'generic_tree_1',
  // 'travel',
  // 'generic_building_2',
  // 'chairs',
  'people',

  // 'stadium',
  // 'gameloft',
  // 'mcdonalds',
  'clouds',
  'sun',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9'
];

// graphics = [];

openMap();
startAnimation();
// addSectionInteraction(false);
// addSectionInteraction(true);

var inBlackMode = false;

function openMap() {
  $(window).resize(repositionMap);
  repositionMap();
  createMapElements();
  $('#map-content').css('opacity', 1);
}

function repositionMap() {
  var mapHeight = $('#map-content').height();
  $('#map-content').css({
    top: ($(window).height() - mapHeight)/2 + 'px',
  });
}

function createMapElements() {
  graphics.forEach(function(element, index) {
    setTimeout(function() {
      var elemStr = '<img class="graphic-element" src="graphics/map/' + element + '.png" id="' + element + '"/>';
      var newElement = $('#map-content').append($(elemStr));
    }, index * 200);
  });
}

function addSectionInteraction(instant) {
  if(instant) {
    $('#sections').css({
      display: 'block',
      opacity: 1,
    });
    $('#sections li span').css('opacity', 1);
    $('#iamdragos').hide();
  }

  $('#sections li').on('mouseenter', function() {
    if(inBlackMode) return;

    $('#sections li').css('color', '#000');
    $(this).css('color', '#fff');
    TweenMax.to($('body'), 0.5, {backgroundColor: '#000'});
  });

  $('#sections li').on('mouseleave', function() {
    if(inBlackMode) return;

    $('#sections li').css('color', '#000');
    TweenMax.to($('body'), 0.5, {backgroundColor: '#fff'});
  });

  $('#sections li').on('click', function(e) {
    inBlackMode = true;
    var button = $(this);
    var crtTop = button.offset().top;
    var crtLeft = button.offset().left;
    var targetLeft = - crtLeft + button.text().length * 11 - 120;
    var targetTop = -crtTop - 35;

    $('#sections li').each(function() {
      if($(this).attr('id') !== button.attr('id')) {
        $(this).css('opacity', 0);
      }
    });
    button.css({
      visibility: 'visible',
    });

    TweenMax.to(button, 1, {top: targetTop, left: targetLeft, delay: 0, ease: Power2.easeInOut});

    var projectsHeight = $(window).height() - 50;
    $('#projects-frontend').css('height', projectsHeight);
    var projectElementWidth = $('#projects-frontend li .content').first().width();
    $('#projects-frontend li .content').css('height', (projectElementWidth * 9/16) + 'px');
    TweenMax.to($('#projects-frontend li'), 0, {scale: 0});
    $('#projects-frontend li').each(function(index, projectElement) {
      // projectElement.css()
      // TweenMax.to($(projectElement), 0, {scale: 0, delay: index * 0.5 + 1, onComplete: function() {
        $(projectElement).css('display', 'inline-block');
        TweenMax.to($(projectElement), 0.5, {scale: 1, delay: index * 0.5 + 1});
      // }});
    });
    // TweenMax.to($('#projects-frontend'), 1, {height: projectsHeight + 'px', delay: 1, ease: Power2.easeInOut});
    TweenMax.to($('body'), 0.7, {backgroundColor: '#31CEB7', ease: Power2.easeInOut});
  });
}

function startAnimation() {
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
        TweenMax.to(hi, 0.2, {right: hiStartRight, delay: 0.5, onComplete: function() {
          hi.hide();
          TweenMax.to(nice, 0.2, {left: niceStartLeft, ease: Power2.easeOut, onComplete: function() {
            nice.hide();
            TweenMax.to($('#first-half'), 0.7, {right: '0', backgroundColor: '#E5A12B', ease: Power2.easeInOut, onComplete: function() {
              var andthis = $('#andthis');
              andthis.css('display', 'inline');
              TweenMax.to($('#first-half'), 0.5, {top: '-50%', ease: Power2.easeInOut, onComplete: function() {
                TweenMax.to(iam, 0.7, {top: '40%', color: '#E5A12B', ease: Power2.easeInOut});
                TweenMax.to(andthis, 0.7, {top: '52%', ease: Power2.easeInOut});
                TweenMax.to($('#first-half'), 0.7, {height: '4px', top: '50%', ease: Power2.easeInOut, onComplete: function() {
                  TweenMax.to($('#first-half'), 0.2, {top: '0%', height: '100vh', delay: 0.2, ease: Power2.easeInOut, onComplete: function() {
                    iam.hide();
                    andthis.hide();
                    TweenMax.to($('#first-half'), 0.8, {backgroundColor: '#85C149', ease: Power2.easeInOut});
                    var iswhatido = $('#iswhatido');
                    var thisElement = $('#this');
                    iswhatido.show();
                    $('#first-half').css({
                      'z-index': 1,
                    });
                    $(iswhatido).css({
                      'z-index': 2,
                    });
                    $('#map').css({
                      'z-index': -1,
                      top: 0,
                    });
                    TweenMax.to(iswhatido, 1.5, {top: '45%', ease: Bounce.easeOut, onComplete: function() {
                      thisElement.show();
                      TweenMax.to($('#first-half'), 0.4, {top: '100vh', delay: 0.2, ease: Power2.easeIn});
                      // TweenMax.to($('#map'), 1, {top: '0', delay: 0.15, ease: Power2.easeInOut});
                      // $('#map').css({top: 0});
                      // TweenMax.to($('#first-half'), 0.3, {scale: 0, delay: 0.15, ease: Power2.easeInOut});

                      setTimeout(showMap, 1200);
                      // TweenMax.to(iswhatido, 1, {top: '15%'/*, color: '#444'*/, opacity: 0, scale: 0.6, delay: 0.5, ease: Power2.easeInOut, onComplete: function() {
                      TweenMax.to(iswhatido, 0.4, {top: '145%'/*, color: '#444'*/, delay: 0.15, ease: Back.easeIn, onComplete: function() {
                        console.log('done');

                        // var sections = $('#sections');
                        // sections.show();
                        // TweenMax.to(sections, 1, {opacity: 1});
                        // var sectionElements = $('#sections li');
                        // sectionElements.each(function(index, elem) {
                        //   TweenMax.to($(this).find('span'), 3, {opacity: 1, delay: index * 1.5});
                        // });
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

function showMap() {
  // TweenMax.to($('#map'), 0.5, {opacity: 1});
  // $('#map').css({'opacity': 1});
  $('.graphic-element').each(function(index, element) {
    var delay = 0;
    // if(index === 0) {
    //   delay = 0.5;
    // } else if(index === 1) {
    //   delay = 1;
    // } else {
    //   delay = 1.5 + index * 0.2;
    // }
    delay = 0.3 + index * 0.1;
    // TweenMax.to($(element), 0.8, {top: 0, delay: delay, ease: Bounce.easeOut});
    setTimeout(function() {
      $(element).css({top: 0});
    }, delay * 1000);
  });
}
