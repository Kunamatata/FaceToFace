$(document).ready(function() {
$(".col-8").height($(".col-8").width());

  $(window).on('resize', function(event) {
    $(".col-8").height($(".col-8").width());
  });


});