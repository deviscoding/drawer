/**
 * jQuery Plugin for managing a navigation drawer.
 *
 * @version v2.0.1
 * @license https://github.com/strapless/strapless/LICENSE
 * @author  Aaron M Jones <am@jonesiscoding.com>
 */
(function( $ ){

  $.fn.responsiveDrawer = function() {

    return this.each( function () {
      var drawer   = this;
      var $trigger = $( this );
      var href     = $trigger.attr( 'href' );
      var $target  = $( $trigger.attr( 'data-target' ) || (href && href.replace( /.*(?=#[^\s]+$)/, '' )) ); // strip for ie7
      var $html    = $('html');

      drawer.isTemporary = function() {
        return $.fn.isBreakpoint( [ 'xs', 'sm', 'md' ] ) || ($.fn.isBreakpoint(['lg']) && $html.hasClass('touch'));
      };

      drawer.isPersistent = function() {
        return ($.fn.isBreakpoint(['lg']) || ($.fn.isBreakpoint(['xl']) && $html.hasClass('touch'))) && !drawer.isTemporary();
      };

      drawer.init = function() {
        if ( typeof $target !== 'undefined' ) {
          if(drawer.isTemporary()) {
            $html.removeClass('on off persistent permanent').addClass('temporary');
          } else if(drawer.isPersistent()) {
            if(!$html.hasClass('temporary') && $html.hasClass('touch')) {
              $html.addClass('off');
            }
            $html.addClass('persistent').removeClass('on temporary permanent');
          } else {
            $html.addClass('permanent').removeClass('temporary persistent on off');
          }
        }
      };

      drawer.collapseGroup = function($heading) {
        var $group = $heading.parent('.drawer-group');
        if($group.length > 0) {
          if(!$group.data('bs.collapse')) {
            var height = ($heading.outerHeight() || 0) - ($group.marginBottom || 0);
            $group.css('min-height',height).collapse({toggle: false});
          } else {
            $group.collapse('toggle');
          }
        }
      };

      $trigger.on( 'click', function ( e ) {
        if ( $trigger.is( 'a' ) ) { e.preventDefault(); }
        if ( typeof $target !== 'undefined' ) {
          if ( drawer.isTemporary() ) {
            $html.toggleClass('on');
          } else if (drawer.isPersistent() ) {
            $html.toggleClass('off');
          }
        }
      } );

      $('body').on('click.collapse-group.data-api', '[data-toggle=collapse-group]', function (e) {
        e.preventDefault();
        drawer.collapseGroup($(this));
      });

      $(window).afterwards('resize',function() { drawer.init(); });

      drawer.init();

    } );
  };
})( jQuery );