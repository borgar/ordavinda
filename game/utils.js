(function(){

  /*
   * This file provides some utility functions to make life easier and simplify 
   * the game logic code. Most/many of these extend native JavaScript objects 
   * which, in general, you SHOULD NOT do:
   *   http://www.nczonline.net/blog/2010/03/02/maintainable-javascript-dont-modify-objects-you-down-own/
   *
   * So why is it done? -- Because this game is a completely closed of application that was
   * written within a record breakingly short period of time.
   *
   */

  /* Very basic python style string variable injection
   * 
   * "My name is %s, and I am %s".format("Manny", 8)  // => "My name is Manny, and I am 8"
   */
  String.prototype.format = function () {
    var s = this;
    for (var i=0; i < arguments.length; i++) {
      s = s.replace( '%s', arguments[i] );
    }
    return s;
  };


  /* Subtract the characters of a given string from another string
   * 
   * "Abracadabra".subtract('arbd')  // => "Acaabra"
   */
  String.prototype.subtract = function ( chars ) {
    var out = '', 
        str = chars + '';
    if ( arguments.length > 1 ) {
      str = Array.prototype.join.call( arguments, '' );
    }
    for (var i=0; i<this.length; i++) {
      var ch = this.charAt( i );
      if ( str.indexOf( ch ) !== -1 ) {
        str = str.replace( ch, '' );
      }
      else {
        out += ch;
      }
    }
    return out;
  };
  

  /* Remove all of the characters of a given string from a string
   *
   * "Abracadabra".removechars('ar')  // => "Abcdb"
   */
  String.prototype.removechars = function ( chars ) {
    if ( arguments.length > 1 ) {
      chars = Array.prototype.join.call( arguments, '' );
    }
    var rx = RegExp.compile('['+RegExp.escape(chars)+']', 'g');
    return this.replace( rx, '' );
  };


  /* Remove all BUT the characters of a given string from a string
   *
   * "Abracadabra".remove('ar') => "raaara"
   */
  String.prototype.filterchars = function ( chars ) {
    if ( arguments.length > 1 ) {
      chars = Array.prototype.join.call( arguments, '' );
    }
    var rx = RegExp.compile('[^'+RegExp.escape(chars)+']', 'g');
    return this.replace( rx, '' );
  };
  
  
  /* "Randomly" shuffle the elements of an array
   *
   * [1,2,3,4].shuffle()  // => [4, 3, 1, 2]
   */
  Array.prototype.shuffle = function () {
    var p, t, l = this.length;
    while ( l ) {
      p = ~~( l * Math.random( l-- ) );
      t = this[l];
      this[l] = this[p];
      this[p] = t;
    }
    return this;
  };
  
  
  /* Natural sort with extended alphabet suport
   * 
   * ['c1234á2345','c11234á2345','c1234a2345'].natural_sort()
   *    // => ["c1234a2345", "c1234á2345", "c11234á2345"]
   *
   */
  var ns_order = 'aàáâãäåbcçdðeèéêëfghiìíîïjklmnñoòóôõpqrsšƒßtuùúûüvwxyÿýzžþæöø';
  var ns_alpha = new RegExp( '^[' + ns_order + ']$', 'i' );
  function ns_chunker ( s ) {
    var bits = [],
        s = String( s ).toLowerCase().split( '' ),
        c = '',
        ch;
    while ( s.length ) {
      ch = s.pop();
      if ( /^(-?(\d*\.)?\d+)$/.test( ch + c ) ) {
        c = ch + c;
      }
      else {
        c && bits.unshift( parseFloat( c ) );
        bits.unshift( ch );
        c = '';
      }
    }
    c && bits.unshift( parseFloat( c ) );
    return bits;
  }
  
  function natural_sort ( a, b ) {
    var c = ns_chunker( a ),
        d = ns_chunker( b ),
        l = Math.max( c.length, d.length ),
        i = -1
        ;
    while ( ++i < l ) {
      var A = c[ i ] || 0,
          B = d[ i ] || 0
          ;
      if ( typeof( A ) === 'number' && typeof( B ) === 'string' ) {
        return -1;
      }
      else if ( typeof( A ) === 'string' && typeof( B ) === 'number' ) {
        return 1;
      }
      if ( ns_alpha.test( A ) && ns_alpha.test( B ) ) {
        A = ns_order.indexOf( A );
        B = ns_order.indexOf( B );
      }
      if ( A < B ) {
        return -1;
      }
      else if ( A > B ) {
        return 1;
      }
    }
    return 0;
  }
  
  Array.prototype.natural_sort = function () {
    return this.sort( natural_sort );
  }


  /* Escape regular expression operators in a string for safe inclusion in compiled expressions.
   *
   * RegExp.escape( "+1.23" )  // => "\+1\.23"
   */
  RegExp.escape = function ( s ) {
    return s.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
  };


  /* "Compiles" a regular expression from a string (and parameters).
   * This has the same interface as calling `new RegExp` except the
   * compile function leverages a cache to make regexp building faster.
   * 
   * RegExp.compile( '[a-z]+', 'g' )  // => `/[a-z]+/g+`
   */
  var _regexp_cache = {};
  RegExp.compile = function ( r, p ) {
    return ( _regexp_cache[r] = _regexp_cache[r] || new RegExp( r, p || '' ) );
  };
  

  /*
   * Patched map to work with strings in IE7
   * (arg is for jQuery internal usage only)
   *
   * This allows writing in this style:
   * 
   * // remove uppercase characters
   * var new_str = $.map("my string", function (ch) {
   *   return ( ch.toLowerCase() === ch ) ? ch : null;
   * }).join('');
   *
   */
	jQuery.map = function ( elems, callback, arg ) {
		var ret = [], value;

    // patched:
    if ( typeof elems === "string" ) {
      elems = elems.split( '' );
    }
    
		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			value = callback( elems[ i ], i, arg );
			if ( value != null ) {
				ret[ ret.length ] = value;
			}
		}

		return ret.concat.apply( [], ret );
	};
	

  /*
   * Additional easing functions for jQuery
   */
	jQuery.extend(jQuery.easing, {

    // These next two easing equations lifted from jQuery Easing
    // Copyright © 2008 George McGinley Smith (BSD licence)

    easeOutElastic: function ( x, t, b, c, d ) {
  		var s=1.70158;var p=0;var a=c;
  		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  		if (a < Math.abs(c)) { a=c; var s=p/4; }
  		else var s = p/(2*Math.PI) * Math.asin (c/a);
  		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
  	},

  	easeOutBack: function ( x, t, b, c, d, s ) {
  		if (s == undefined) s = 1.70158;
  		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
  	},

  	// end-easing
  	dip: function ( p, n, firstNum, diff ) {
      var a = 2 * Math.PI * ( p );
  	  return 20 * Math.sin( a / 2 );
  	},

  	dap: function ( p, n, firstNum, diff ) {
      var a = 2 * Math.PI * ( p );
  	  return 20 * -Math.sin( a / 2 );
    }

	});


})();