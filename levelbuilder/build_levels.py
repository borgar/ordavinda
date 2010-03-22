# encoding: UTF-8
import sys
import random

usage = """
Use it like this:

$ python build_levels.py dictionary.txt

dictionary is expected to be a UTF-8 encoded file
out will be a line-by-line list of JSON formatted levels as expected by the game
"""

def permutations ( str ):
    """Generate all possible permutations of a sequence."""
    if len( str ) <= 1:
        yield str
    else:
        for perm in permutations( str[1:] ):
            for i in range( len( perm ) + 1 ):
                yield perm[:i] + str[0:1] + perm[i:]

def find_all ( keyword, words ):
    """Return all valid words in a dictionary generatable by any
       subset of at least three characters of a given string."""
    perm = set( f for f in permutations( keyword ) )
    candidates = set([ w[:5] for w in perm ]) 
    candidates.update( set([ w[:4] for w in perm ]) ) 
    candidates.update( set([ w[:3] for w in perm ]) ) 
    candidates.update( perm )
    return words.intersection( candidates )


def build_levels( filename ):
    # load the dictionary
    words = set( open( filename ).read().decode( 'UTF-8' ).strip().split( '\n' ) )

    # get all 6 letter words, which will be used as "keys"
    keywords = [ w for w in words if len(w) == 6 ]

    json_template = u'{ "key":"%s", "words":["%s"] }'
    skip = {}
    for key in keywords:
        if key not in skip:
            candidates = find_all( key, words )
            skip.update( dict( (k, 1) for k in candidates if len(k) is 6 ) )
            found = sorted([ w for w in candidates ])
            # only use levels where number of words is >=10 and <=50
            if len(found) >= 10 and len(found) <= 50:
                level = json_template % ( key, '","'.join( found ) )
                print level.encode( 'UTF-8' )


if __name__ == '__main__':    
    if len(sys.argv) < 1:
        print usage
        sys.exit(2)
    build_levels( sys.argv[1] )
