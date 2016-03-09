$(document).ready(function() {
    $(window).on('resize', function(event) {
        $(".col-8").height($(".col-8").width());
    });
});
