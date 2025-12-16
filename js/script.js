

$(document).ready(function () {
  $('#navigation nav').slimNav_sk78();
  $('#nav-icon0').click(function() {
      $(this).toggleClass('open');
  });
 


  // banner
  var owl = $(".banner-section .owl-carousel");
  owl.owlCarousel({
      items: 1,
      loop: true,
      autoplay: true,
      nav: false,
      dots: true,
      // dotsContainer: '#custom-owl-dots',
      animateIn: 'fadeIn', // add this
      animateOut: 'fadeOut', // and this
      //   navText: [
      //     '<img src="images/prev.svg" alt="">',
      //     '<img src="images/next.svg" alt="">'
      // ],

      responsive: {
          0: {
              items: 1
          },
          600: {
              items: 1
          },

          1000: {
              items: 1
          },
      }
      
  });
 
});




        
