# Orðavinda

Orðavinda is a simple JavaScript word game. Given a set of 6 letters, the
player must find as many correct words as possible before time runs out. In
order to qualify to play the next level, the player must guess at least one
of the 6 letter word combinations.

The game is written as an entry to [Þú átt orðið][1], a contest in creating
solutions exploiting the Icelandic declension dictionary ([BÍN][2]). As such
it is icelandic-centric but can with minimal effort be made to work with other 
languages.



## The Game

The game must be run from a web server to work as it fetches levels via an
Ajax request. The game is comprised of 3 parts:

  * `vinda.js` - The main game logic.
  * `utils.js` - JavaScript utility functions.
  * `vinta.sounds.js` - Sound extensions for the game.

The game requires [jQuery][3] JavaScript library to run. Additionally the
[Soundmanager2][4] library is needed to enable sound support.

The levels have been cut down to a single demonstration level. You will need
to build a level collection using the tools provided.


## Why are the sounds not included?

The sounds are not essential to the gameplay and take an unreasonable amount
of space. Also, including a one more library with yet another license 
complicated things unnecessarily.

### How to add sounds:

 1. Download [Soundmanager2][4].
 2. Copy `soundmanager2.js` and `soundmanager2.swf` into the game directory.
 3. Create the folder `sound` and copy some mp3 sfx files into it.
 4. Edit `vinda.sounds.js` to reflect correct mp3 filenames.
 5. Uncomment the sound script references in `index.html`.



## Why are the levels not included?

The current license for *BÍN* does not allow redistribution or relicensing of
the data under an open license. This may change in the future, in which case
the levels will be bundled with source.

You currently need to opt-in to the BÍN license and download it for yourself,
and build the levels with the tools provided. Users are urged to adapt the
game for more languages buy building levels for other dictionaries.

### How to build the levels:

 1. [Download and unzip the *BÍN* data][6]. Specifically: `SHsnid.csv.zip`

 2. Run `filter_bin.py` on `SHsnid.csv` to produce a manageable filtered
    subset of the dictionary:  

    `$ python filter_bin.py SHsnid.csv > dictionary.txt`

 3. Run `build_levels.py` on the output to produce the levels.  

    `$ python build_levels.py dictionary.txt`

    The output will be a large collection of JSON files, each one 
    representing a single level, written to the `game/level` directory.
    
 4. Open the game in your browser.


## Licence

The game and all it's parts not specifically marked as such are licensed with
the [GPL free software licence][5].



[1]: http://ordid.is/forsida/
[2]: http://bin.arnastofnun.is/
[3]: http://jquery.com/
[4]: http://www.schillmania.com/projects/soundmanager2/
[5]: http://www.gnu.org/licenses/gpl-3.0.html
[6]: http://bin.arnastofnun.is/gogn/

