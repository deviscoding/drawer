/**
 * jQuery Plugin for managing a navigation drawer.
 *
 * @version v1.1.3
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
        return $.fn.isBreakpoint( [ 'xs', 'sm', 'md' ] ) || ($.fn.isBreakpoint(['md']) && $html.hasClass('touch'));
      };

      drawer.isPersistent = function() {
        return $.fn.isBreakpoint(['lg']) && !drawer.isTemporary();
      };

      drawer.init = function() {
        if ( typeof $target !== 'undefined' ) {
          if(drawer.isTemporary()) {
            console.log('temporary');
            $html.removeClass('on persistent permanent').addClass('temporary');
          } else if(drawer.isPersistent()) {
            if(!$html.hasClass('temporary') && !$html.hasClass('touch')) {
              $html.addClass('on');
            }
            $html.addClass('animate persistent').removeClass('temporary permanent');
          } else {
            $html.addClass('animate permanent').removeClass('temporary persistent on');
          }
        }
      };

      drawer.transition = function() {
        if(!$html.hasClass('temporary') && drawer.isTemporary()) {
          $target.addClass('fade');
        } else {
          $target.removeClass('fade');
        }
      };

      drawer.collapseGroup = function($heading) {
        var $group = $heading.parent('.list-group');
        if(!$group.data('bs.collapse')) {
          var height = $heading.outerHeight() - $group.marginBottom;
          $group.css('min-height',height).addClass('collapse');
          $group.collapse('toggle');
        } else {
          $group.collapse('toggle');
        }
      };

      $trigger.on( 'click', function ( e ) {
        if ( $trigger.is( 'a' ) ) { e.preventDefault(); }
        if ( typeof $target !== 'undefined' ) {
          if ( drawer.isTemporary() ) {
            $html.toggleClass('on');
          } else if (drawer.isPersistent() ) {
            $html.toggleClass('on');
          }
        }
      } );

      $('body').on('click.collapse-group.data-api', '[data-toggle=collapse-group]', function (e) {
        e.preventDefault();
        drawer.collapseGroup($(this));
      });

      $(window).afterwards('resize',function() { drawer.transition(); drawer.init(); });

      drawer.init();

    } );
  };
})( jQuery );