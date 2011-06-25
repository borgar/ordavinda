# Orðavinda

Orðavinda is a simple JavaScript word game. Given a set of 6 letters, the
player must use them to find as many valid words as possible before time
runs out. In order to qualify to play the next round, the player must guess
at least one of the 6 letter word combinations.

The game is written as an entry to [Þú átt orðið][ordid], a contest in creating
solutions exploiting the Icelandic declension dictionary ([BÍN][bin]). As such
it is icelandic-centric but can with minimal effort be made to work with other
languages.



## The Game

The game must be run from a web server to work as it fetches levels via an
Ajax request. The game logic is comprised of 3 parts:

  * `vinda.js` - The main game logic.
  * `utils.js` - JavaScript utility functions.
  * `vinta.sounds.js` - Sound extension for the game.

The game requires [jQuery][jq] JavaScript library to run. Additionally the
[Soundmanager2][sm2] library is needed to enable sound support.

The levels have been cut down to a single demonstration level. You will need
to build a level collection using the tools provided.



## Why are the levels not included?

The current license for [BÍN][bin] does not allow redistribution or relicensing of
the data under an open license. This may change in the future, in which case
the levels will be bundled with source.

You currently need to opt-in to the BÍN license, download it for yourself,
and then build the levels with the tools provided. Users are urged to adapt the
game for more languages buy building levels for other dictionaries.

### How to build the levels:

 1. [Download and unzip the *BÍN* data][bindata]. Specifically: `SHsnid.csv.zip`

 2. Run `filter_bin.py` on `SHsnid.csv` to produce a manageable filtered
    subset of the dictionary:  

    `$ python filter_bin.py SHsnid.csv > dictionary.txt`

 3. Run `build_levels.py` on the output to produce the levels.  

    `$ python build_levels.py dictionary.txt`
a
    The output will be a large collection of JSON files, each one 
    representing a single level, written to the `game/level` directory.
    
 4. Open the game in your browser.


## Licence

The game and all it's parts not specifically marked as such are licensed with
the [GPL free software licence][gpl].



[ordid]: http://ordid.is/forsida/
[bin]: http://bin.arnastofnun.is/
[jq]: http://jquery.com/
[sm2]: http://www.schillmania.com/projects/soundmanager2/
[gpl]: http://www.gnu.org/licenses/gpl-3.0.html
[bindata]: http://bin.arnastofnun.is/gogn/
