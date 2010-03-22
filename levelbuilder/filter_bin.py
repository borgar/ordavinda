# encoding: UTF-8
import sys

"""
filter_bin.py

This simple script runs though the SHsnid.csv BÍN dump provided by http://bin.arnastofnun.is/gogn/
and outputs a list of all general words between 3-6 characters long.

Usage should be something along the lines of:

$ python filter_bin.py > dictionary.txt

This produces a file usable by the levelbuilder (build_levels.py).
"""


is_char = { u'Á':u'á', u'É':u'é', u'Í':u'í', u'Ó':u'ó', u'Ú':u'ú', u'Ý':u'ý', u'Þ':u'þ', u'Æ':u'æ', u'Ð':u'ð', u'Ö':u'ö' }
def lowercase ( s ):
    return ''.join( is_char[c] if c in is_char else c.lower() for c in s )


def filter_bin ( filename ):
    words = {}
    for line in open( filename, 'r' ):
        lemma, id, group, category, word, tag = line.strip().split(';')
        word = unicode( word, encoding='UTF-8' )
        if len( word ) >= 3 and len( word ) <= 6 and category not in ['ism','örn','göt','fyr','föð','móð','bibl','lönd']:
            lc = lowercase( word )
            if lc not in words:
                if lc == word:
                    words[ lc ] = lc
                    print word.encode('UTF-8')


if __name__ == '__main__':
    # Allow a file to be passed as a parameter, but assume user is using BÍN
    filter_bin( sys.argv[1] if len(sys.argv) > 1 else 'SHsnid.csv' )
