$(document).ready(function() {
    // hide .navbar first
    $(".navbar").hide();

    // show navbar after 1988 ms to help UX of landing page
    setTimeout(function(){
      $('.navbar').fadeIn(500);
    }, 1988);

    $(function () {
      $(window).scroll(function () {
            // after user scroll for 1 pixels show the menu
            if ($(this).scrollTop() > 1) {
              $('.navbar').fadeIn();
            } else {
                // $('.navbar').fadeOut();
              }
            });
    }); 

    /* smooth scrolling for nav sections */
    $('.scroll-link').on('click', function(event){
      event.preventDefault();
      var sectionID = $(this).attr("data-id");
      scrollToID('#' + sectionID, 750);
    });

  // scroll to top action
  $('.scroll-top').on('click', function(event) {
    event.preventDefault();
    $('html, body').animate({scrollTop:0}, 'slow');     
  });

  // mobile nav toggle
  $('#nav-toggle').on('click', function (event) {
    event.preventDefault();
    $('#main-nav').toggleClass("open");
  });

  // when clickin an element of the nav close the hamburger menu
  $("ul.nav.navbar-nav li a").click(function() {    
    $(".navbar-toggle").addClass("collapsed");
  });

  showHide();
  
});


/* highlight the top nav as scrolling occurs */
$('body').scrollspy({
  target: '#myNavBar',
});

// scrollToSection function. Allow you to do smooth To-section interaction.
function scrollToID(id, speed){
  var targetOffset = $(id).offset().top;
  var mainNav = $('#main-nav');
  $('html,body').animate({scrollTop:targetOffset}, speed);
  if (mainNav.hasClass("open")) {
    mainNav.css("height", "1px").removeClass("in").addClass("collapse");
    mainNav.removeClass("open");
  }
}

///////////////////////////////////////////////////////// ACCORDION functions. 
// activate accordion behavior of hiding all elements beside the one opened
function showHide() {
  $('#accordion').on('show.bs.collapse', function () {
   $('#accordion .in').collapse('hide');
 });
}

