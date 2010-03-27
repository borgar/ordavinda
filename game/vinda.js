/*
 * Wordgame "ordavinda"
 * http://borgar.net/programs/ordavinda
 *
 * Copyright (c) 2009 Borgar Thorsteinsson
 * Licensed under the terms of the GPL v3 license.
 * http://www.gnu.org/licenses/gpl-3.0.html
 *
 */
jQuery(function($){

  var dict_url = "http://bin.arnastofnun.is/leit.php?q=%s&ordmyndir=on";

  var score = 0;
  var levelsPlayed = [];
  var currentLevel = null;

  var msgHoldTime = 4;
  var levelTime = 60 * 2.5;
  var scores = [ 75, 150, 300, 500 ];
  var bonusPoints = 400;
  var shuffleTime = 900;
  var animateYAxis = true;

  var W;
  var letters = [];
  var startTime = null;
  var endTime = null;
  
  var _timer = null;
  var _msgTimer = null;
  var _lastClock;
  var _lastInput = '';
  var __lock = false;
  var __game_over = false;
  var _history = [];
  var inp = $( '#inp' );

  // report user agent to the css
  $.each($.browser,function(a,b){ if (b===true) { $('body').addClass(a); } });

  function lock () {
    __lock = true;
    inp.attr( 'disabled', true );
    $( '#word_recall, #word_shuffle, #word_enter, #word_clear' ).attr( 'disabled', true );
  }
  
  function unlock () {
    __lock = false;
    evalButtons();
    inp.attr( 'disabled', false ).focus();
  }


  function formatTime ( seconds ) {
    var min = '' + ~~(seconds / 60),
        sec = '00' + (seconds % 60);
    return min + ':' + sec.substr( sec.length - 2 );
  }


  function showMessage ( message, expires ) {
    var msg = $( '#message strong' );
    
    if ( msg ) {
      msg.hide();
      msg.text( message );
      msg.fadeIn();
    }

    if ( message == '' && !_msgTimer ) {
      msg.fadeOut(function () {
        $( this ).empty();
      });
      expires = false;
    }
    
    clearTimeout( _msgTimer );
    if ( expires ) {
      _msgTimer = setTimeout(function () {
        $( '#message strong' ).fadeOut(function () {
          $( this ).empty();
        });
      }, expires * 1000 );
    }
  }

  function isCleared () {
    for (var i=3; i<=6; i++) {
      for ( var word in W[ i ] ) {
        if ( !W[ i ][ word ].used ) {
          return false;
        }
      }
    }
    return true;
  }

  function isSolved () {
    for ( var word in W[6] ) {
      if ( W[6][ word ].used ) {
        return true;
      }
    }
    return false;
  }

  function showPermutations ( solve ) {
    var b = $( '#board' ).empty();
    var n = '<span></span>';
    for (var i=3; i<=6; i++) {
      var ul = $( '<ul class="l' + i + '"></ul>' );
      var c = 0;
      for ( var word in W[ i ] ) {
        var used = !!W[ i ][ word ].used;
        var o = '<a target="_blank" href="%s"></a>'.format( dict_url.format( word ) );
        var cls = (++c % 2) ? ' odd' : ' even';
        cls += solve ? ' solver' : '' ;
        var li = '<li class="%s">%s</li>'.format( cls, (used || solve) ? o : n );
        li = $( li ).appendTo( ul );
        var a = li.find( 'a,span' );
        var letters = $.map(word, function(a,i){
          return $( '<b>' + ((used || solve) ? a : '?') + '</b>' )[0];
        });
        if ( used ) { li.addClass( 'completed' ); }
        a.append( letters );
      }
      b.append( ul );
    }
  }


  function setInput ( str ) {
    _lastInput = inp.val();
    inp.val( str );
  }


  function renderLetters () {
    var l = $.map(letters, function(a,i){
      a.id = 'letter' + i;
      return '<a href="#" class="char" id="' + a.id + '"><b>' + a.char + '</b></a>';
    });
    $( '#letters' ).html( l.join('') );
  }

  function releaseLetters() {
    $.each(letters, function ( i, a ) {
      freeLetter( a.char );
    });
    setInput( '' );
  }
  
  function wordizeLetters () {
    return $.map(letters,function (c) { return c.char; }).join('');
  }
  
  function unusedLetters () {
    return $.map(letters,function (c) { return c.in_use ? null : c.char; }).join('');
  }
  
  function shuffleLetters ( animate ) {

    for (var i=0; i<letters.length; i++) {
      letters[i].xpos = i;
    }

    var c, current = wordizeLetters();
    do {
      letters.shuffle();
      c = wordizeLetters();
    } 
    while ( c == current && !( c in W[6] ) );

    // move the letters into position
    var container = $( '#letters' );
    lock();
    $.each( letters, function ( i, a ) {
      var e = $( '#' + a.id );
      e.css({
        'position': 'absolute',
        'top': animateYAxis ? Math.random() : 0, 
        'left': (animate !== false) ? (a.xpos * 40) : (i * 40)
      });
      container.append( e );
      if ( animate !== false ) {
        e.animate({
            'left': [i * 40, animateYAxis ? 'easeOutBack' : 'easeOutElastic' ], // easeOutElastic, easeOutBack
            'top': (animateYAxis ? [0, ( Math.random() > 0.5 ? 'dip' : 'dap')] : 0),
          },
          shuffleTime,
          function () {
            if ( !__game_over ) {
              unlock();
            }
          }
        );
      }
      else {
        if ( !__game_over ) {
          unlock();
        }
      }
    });
  }

  function useLetter ( char ) {
    for (var i=0; i<letters.length; i++) {
      if ( !letters[i].in_use && letters[i].char == char ) {
        letters[i].in_use = true;
        $( '#' + letters[i].id ).hide();
        return true;
      }
    }
    return false;
  }


  function freeLetter ( char ) {
    for (var i=0; i<letters.length; i++) {
      if ( letters[i].char == char && letters[i].in_use ) {
        letters[i].in_use = false;
        $( '#' + letters[i].id ).show();
        return true;
      }
    }
    return false;
  }
  
  
  function tick () {
    
    var curr = ( new Date() ).getTime();
    var et = endTime.getTime();
    var st = startTime.getTime()
    
    if ( curr < et ) {
      // still playing
      
      var secondsleft = Math.ceil(( et - curr ) / 1000);
      if ( secondsleft != _lastClock ) {
        $('#time em').text( formatTime( secondsleft ) );

        if ( secondsleft < 11 ) {
          $( '#game' ).trigger( 'tick' );
        }

        // exit early if level is complete
        if ( isCleared() ) {
          __game_over = true;
          lock();
          score += bonusPoints;   // bonus points for level completeness
          $( '#score strong' ).text( score );
          //  add key to played list
          levelsPlayed.push( currentLevel.key );
          //  display "level complete message"
          $( '#leveldone' ).fadeIn( 600, function () {
            $( this ).find('a').focus();
          });
          $( '#game' ).trigger( 'complete' );
          // stop the clock
          clearInterval( _timer );
        }

      }
      _lastClock = secondsleft;

    }
    else {
      // time over
      $('#time em').text( formatTime( 0 ) );
      clearInterval( _timer );

      //  lock everything down
      __game_over = true;
      lock();

      // expose the words
      showPermutations( true );

      // if level is solved: 
      if ( isSolved() ) {
        //  add key to played list
        levelsPlayed.push( currentLevel.key );
        //  display "level complete message"
        $( '#leveldone' ).fadeIn( 600, function () {
          $( this ).find('a').focus();
        });
        $( '#game' ).trigger( 'complete' );
      }
      // else:
      else {
        //  display game over message
        $( '#gameover' ).fadeIn( 600, function () {
          $( this ).find('a').focus();
        });
        $( '#game' ).trigger( 'gameover' );
      }
      
    }
  }
  
  
  function evalButtons () {
    var word = inp.val();
    $( '#word_shuffle' ).attr( 'disabled', word.length > 5 );
    $( '#word_enter, #word_clear' ).attr( 'disabled', word.length < 1 );
    $( '#word_recall' ).attr( 'disabled', word.length > 1 || !_history.length );
  }
  
  
  function startLevel () {
    unlock();
    __game_over = false;
    // start the clock
    startTime = new Date();
    endTime = new Date( startTime.getTime() + (1000 * levelTime) );  // you have 2 minutes, 30 seconds
    clearInterval( _timer );
    _lastClock = null;
    _timer = setInterval( tick, 100 );
    // clear history
    _history = [];
    _lastInput = '';
    // focus the input field
    inp.val( '' ).attr( 'disabled', false ).focus();
    // off we go...
    evalButtons();
    $( '#game' ).trigger( 'start' );
  }


  function newLevel () {
    
    // clear all messages
    $( '#leveldone' ).hide();
    $( '#time em' ).text( formatTime( 0 ) );
    $( '#score strong' ).text( score );
    $( '#message strong' ).text( '' );
    inp.val( '' ).attr( 'disabled', true );
    _lastInput = '';
    
    // clear old gameitems
    $( '#letters' ).empty();
    $( '#board ul' ).empty();
    
    // show game
    $( '#game' ).addClass( 'loading' ).show();

    showMessage( 'Sæki orðasafn...' );
    lock();

    $.ajax({
      url: 'level/?played=' + levelsPlayed.join(','),
      dataType: 'json',
      success: function ( r ) {
          
        $( '#game' ).removeClass( 'loading' );
        showMessage( '' );
        
        currentLevel = r;
        
        // prepare the words
        $( '#board' ).hide();
        W = this.w = { 6:{}, 5:{}, 4:{}, 3:{} };
        for (var i=0; i<currentLevel.words.length; i++) {
            var l = currentLevel.words[i].length;
            W[ l ][ currentLevel.words[i] ] = {};
        }
        showPermutations();
        $( '#board' ).animate({
          'height': 'show',
          'opacity': 'show'
        });

        // prepare the letters
        $( '#letters' ).hide();
        letters = $.map( currentLevel.key, function (c) {
          return { 'char': c, in_use: false }
        });
        renderLetters();
        shuffleLetters( false );
        $( '#letters' ).fadeIn();
        
        // run the level
        setTimeout( startLevel, 1 );

      },
      error: function () {

        $( '#game' ).removeClass( 'loading' ).addClass( 'error' );
        showMessage( 'Villa: Get ekki sótt orðasafn!' );
        lock();

      }
    });
  }


  // hook some events
  $( '#tray' ).submit(function(e){
    var word = $.trim( inp.val() ).toLowerCase();
    // if tray is empty, then this should recall last entry
    if ( !word ) {
      setInput( _history.pop() );
    }
    // try to enter this word
    else {
      var l = word.length;
      _history.push( word );
      // word isn't a match
      if ( l < 3 || !W[ l ][ word ] ) {
        $( '#game' ).trigger( 'fail' );
        showMessage( 'Orðið er ekki samþykkt!', msgHoldTime );
      }
      // word is already done
      else if ( W[ l ][ word ].used ) {
        $( '#game' ).trigger( 'fail' );
        showMessage( 'Orðið er í notkun!', msgHoldTime );
      }
      // we have a match
      else {
        $( '#game' ).trigger( 'match' );
        var wasSolved = isSolved();
        W[ l ][ word ].used = true;
        showPermutations();

        score += scores[ l - 3 ];
        $( '#score strong' ).text( score );

        if ( word.length === 6 && !wasSolved ) {
          $( '#game' ).trigger( 'passed' );
          showMessage( 'Opið á næsta borð...', msgHoldTime );
        }
      }
      releaseLetters();
      evalButtons();
    }
    return false;
  });


  inp.bind('keydown', function ( e ) {
    if ( e.metaKey || e.altKey || e.ctrlKey ) { return; }
    var w  = e.which, ch = String.fromCharCode( w );
    // if game is over then we should block all input here!
    return !__lock;
  });


  inp.bind('keypress', function ( e ) {
    if ( e.metaKey || e.altKey || e.ctrlKey ) { return; }
    var w  = e.which, k = e.keyCode, ch = String.fromCharCode( w );
    if ( w === 32 ) { // space
      shuffleLetters();
      return false;
    }
    if ( k === 27 ) {
      releaseLetters();
      evalButtons();
      inp.focus();
      return false;
    }
    if ( k === 8 || k === 13 || k === 46 ) {  // backspace, enter 
      return;
    }
    if ( k === 40 || k === 39 || k === 38 || k === 37 ) {  // arrows
      return;
    }
    if ( /^[a-záéíóúýþæðö´]$/i.test( ch ) ) {
      return $.inArray( ch.toLowerCase(), unusedLetters() ) !== -1;
    }
    return false;
  });


  inp.bind('keyup', function ( e ) {
    if ( e.metaKey || e.altKey || e.ctrlKey ) { return; }
    var w  = e.which, ch = String.fromCharCode( w );

    // because "´p" or pastes can happen, we need to clean the input first
    var keyword = wordizeLetters(), m = '';
    for (var i=0; i<this.value.length; i++) {
      var ch = this.value.charAt( i );
      if ( keyword.indexOf( ch ) !== -1 ) {
        keyword = keyword.replace( ch, '' );
        m += ch;
      }
    }
    var word = this.value = m;

    var diff_added = word.subtract( _lastInput );
    if ( diff_added ) {
      for (var i=0,l=diff_added.length; i<l; i++) {
        useLetter( diff_added.charAt(i) );
      }
    }
    var diff_removed = _lastInput.subtract( word );
    if ( diff_removed ) {
      for (var i=0,l=diff_removed.length; i<l; i++) {
        freeLetter( diff_removed.charAt(i) );
      }
    }

    _lastInput = this.value;
    evalButtons();
    
  });

  // allow clicking on letters
  $('#letters a').live('click', function () {
    if ( !__lock ) {
      if ( !inp.attr('disabled') ) {
        for (var i=0; i<letters.length; i++) {
          if ( letters[i].id == this.id ) {
            setInput( inp.val() + letters[i].char );
            inp.trigger('keyup');
          }
        }
      }
    }
    return false;
  });


  // shuffle
  $( '#word_shuffle' ).click(function () {
    shuffleLetters();
    inp.focus();
    return false;
  });


  // enter
  $( '#word_enter' ).click(function () {
    $( '#tray' ).submit();
    inp.focus();
    return false;
  });


  // recall
  $( '#word_recall' ).click(function () {
    var word = $.trim( inp.val() ).toLowerCase();
    // if tray is empty, then this should recall last entry
    if ( !word ) {
      setInput( _history.pop() );
    }
    inp.trigger('keyup');
    inp.focus();
    evalButtons();
    return false;
  });
  
  
  // clear
  $( '#word_clear' ).click(function () {
    releaseLetters();
    evalButtons();
    inp.focus();
    return false;
  });


  // maintain focus on the input element
  $( '#game' ).bind('click', function () {
    inp.focus();
  });


  // fetch new level when this one is done...
  $( '#leveldone a' ).click(function () {
    setTimeout(function () { newLevel(); }, 1);
    return false;
  });
  

  // help text
  $('a#gethelp').click(function () {
    $('#help').show();
    return false;
  });
  $('#help').hide().click(function () {
    $( this ).hide();
    $( '#game' ).click();
    return false;
  });


  // start the game
  setTimeout(function () { newLevel(); }, 1);

});