$(document).ready(function() {
    $('.toggleSidebar').click(function() {
        var sidebarId = $(this).data('sidebar');
        $('#' + sidebarId).toggleClass('collapsed expanded');
        $(this).find('i').toggleClass('fa-chevron-right fa-chevron-left');
        
        if ($('#' + sidebarId).hasClass('expanded')) {
            $('#' + sidebarId + ' .nav-link span').fadeIn(300);
        } else {
            $('#' + sidebarId + ' .nav-link span').fadeOut(300);
        }
    });
});