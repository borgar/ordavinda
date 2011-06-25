(function(){

  // if native html5 audio mp3 is available then we provide or
  // overwrite soundmanager2 interface with a look-a-like...
  var a = document.createElement('audio');
  if ( a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, '') ) {
    window.soundManager = {
      onload: function () {},
      createSound: function ( conf ) {
        var a = document.createElement('audio');
        a.id = conf.id;
        a.src = conf.url;
        if ( 'volume' in conf ) { a.volume = conf.volume/50; }
        return a;
      }
    };
    setTimeout(function(){ soundManager.onload.call(soundManager); },40);
  }
  
  if ( window.soundManager ) {

    var soundRegistry = {};

    soundManager.onload = function() {

      soundRegistry.fail = soundManager.createSound({
        id: 'bonk',
        url: 'sound/bonk.mp3',
        volume: 50
      });

      soundRegistry.match = soundManager.createSound({
        id: 'fingerplop',
        url: 'sound/fingerplop.mp3',
        volume: 50
      });

      soundRegistry.passed = soundManager.createSound({
        id: 'bell_tree',
        url: 'sound/bell_tree.mp3',
        volume: 50
      });

      soundRegistry.tick = soundManager.createSound({
        id: 'clock',
        url: 'sound/clock.mp3',
        volume: 40
      });

      soundRegistry.gameover = soundManager.createSound({
        id: 'chime',
        url: 'sound/chime.mp3',
        volume: 50
      });

    }
  
    jQuery(function($){
    
      // Because a new game is simply a reload, sound state is stored in a cookie
      // so that users' selection sticks across games.
      var on = $.cookie( 'sounds' );

      // Add UI to enable/disable sounds:
      var container = $( '<div id="sounds"></div>' ).appendTo( $('#top') );
      var snd = $( '<input type="checkbox" value="1" checked="checked" id="snd" />' ).appendTo( container );
      snd.attr( 'checked', on == null ? true : on === 'true' );
      $( '<label for="snd">Hljóð<label>' ).appendTo( container );

      // Save sound preference
      snd.click(function () {
        $.cookie( 'sounds', $( this ).attr('checked') );
      });

      // The game provides custom events which are hooked here and used as sounds triggers
      $( '#game' ).bind( 'fail match start passed tick complete gameover', function (e) {
        if ( snd.attr('checked') && e.type in soundRegistry ) {
          soundRegistry[ e.type ].play();
        }
      });

    });

  }

})();