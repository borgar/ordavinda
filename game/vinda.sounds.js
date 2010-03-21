if ( window.soundManager ) {
  
  var soundRegistry = {};
  
  soundManager.onload = function() {

    soundRegistry.fail = soundManager.createSound({
      id: 'bonk',
      url: 'sound/fail.mp3',
      volume: 50
    });

    soundRegistry.match = soundManager.createSound({
      id: 'fingerplop',
      url: 'sound/match.mp3',
      volume: 50
    });

    soundRegistry.passed = soundManager.createSound({
      id: 'bell_tree',
      url: 'sound/passed.mp3',
      volume: 50
    });

    soundRegistry.tick = soundManager.createSound({
      id: 'clock',
      url: 'sound/tick.mp3',
      volume: 40
    });

    soundRegistry.gameover = soundManager.createSound({
      id: 'chime',
      url: 'sound/gameover.mp3',
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