/**
 * Fires an event after the last repeated event.  Useful for resize & similar events.
 *
 * @returns {jQuery}
 */
;(function($){
  $.fn.extend({
    afterwards: function( eventName, callback, options ) {

      var plugin = this;
      var $plugin = $(plugin);
      var eTimer;

      plugin.defaultOptions = {
        'interval': 250,
        'preventDefault': false,
        'stopPropagation': false
      };

      var settings = $.extend({}, plugin.defaultOptions, options);

      return $plugin.on(eventName, function(e) {

        if ( settings.preventDefault ) { e.preventDefault(); }
        if ( settings.stopPropagation ) { e.stopPropagation(); }
        if ( settings.stopImmediatePropagation ) { e.stopImmediatePropagation(); }

        clearTimeout(eTimer);
        eTimer = setTimeout(callback, settings.interval);
      });
    }
  });
})(jQuery);
/**
 * Determines which breakpoint is currently active, either by querying for a psuedo element on the body
 * or by injecting an element with display classes.
 *
 * @returns {jQuery}
 */
jQuery.fn.extend( {
  isBreakpoint: function ( points ) {
    var query = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/\"/g, '') || null;
    if ( !points.constructor === Array ) { points = [ points ]; }
    if (null !== query) { return (points.indexOf(query) !== -1); }
    var test  = false;
    var $body = $( 'body' );
    var cls = ' d-none d-sm-none d-md-none d-lg-none d-xl-none';
    $.each( points, function ( index, alias ) {
      if ( !$body.find( '.detect-' + alias ).length ) {
        var tCls = 'detect-' + alias + cls;
        tCls = (alias === 'xs') ? tCls.replace('d-none','d-inline') : tCls.replace(alias + '-none',alias + '-inline');
        $body.append( '<span class="' + tCls + '"></span>' );
      }
      if ( $( '.detect-' + alias ).first().is( ':visible' ) ) {
        test = true;
        return false;
      }
    } );
    return test
  }
} );
/**
 * jQuery Plugin for managing a navigation drawer.
 *
 * @version v1.1.5
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