/**
 * jQuery Plugin for managing a navigation drawer.
 *
 * @version v2.1
 * @license https://github.com/deviscoding/drawer/LICENSE
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
      var bps      = ['xs','sm','md','lg','xl'];
      var types    = [ 'temporary', 'persistent', 'permanent' ];

      drawer.isTemporary = function() {
        return true === ( getDrawerType() === 'temporary' );
      };

      drawer.isPersistent = function() {
        return true === ( getDrawerType() === 'persistent' );
      };

      function getViewport() {
        for(var x = 0; x < bps.length; x++) {
          if ( $.fn.isBreakpoint( bps[ x ] ) ) {
            return bps[x];
          }
        }

        return 'xs'
      }

      function getDrawerType() {
        var type = 'temporary';
        var viewport = getViewport();
        var infix;
        for(var i = 0; i < bps.length; i++) {
          infix = (i === 0) ? '' : bps[i] + '-';
          for(var x = 0; x < types.length; x++) {
            if ( $target.hasClass( 'drawer-' + infix + types[ x ] ) ) {
              type = types[x];
            }
          }

          if ( bps[ i ] === viewport ) { return type; }
        }
      }

      drawer.init = function() {
        if ( typeof $target !== 'undefined' ) {
          if(drawer.isTemporary()) {
            $html.removeClass('on off persistent permanent').addClass('temporary');
          } else if(drawer.isPersistent()) {
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