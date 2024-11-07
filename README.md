# Orðavinda

Orðavinda is a simple browser word game. Given a set of 6 letters, the
player must use them to find as many valid words as possible before time
runs out. In order to qualify to play the next round, the player must guess
at least one of the 6 letter word combinations.

The game was the winning entry in [Þú átt orðið][ordid], a 2009 contest of creating
solutions using the Icelandic declension dictionary ([BÍN][bin]). As such
it is Icelandic-centric but can with minimal effort be made to work in other
languages.


### 2024 rewrite

The game was completely redone in 2024 as the older version was very dated and
did not work well on mobile phones. The original version is still available [on
a branch][v1].


### How to build the levels:

1. [Download and unzip the *BÍN* data][bindata]. Specifically: `Storasnid_allt.zip`

2. Unzip and place the data into the scripts folder.

3. Run `pnpm filterbin` to produce a manageable filtered
   subset of the dictionary.

4. Run `pnpm levelgen` on the output to produce the levels.

4. Open the game in your browser.



[ordid]: https://vefsafn.is/is/20190118152842/http://www.ordid.is/forsida/
[bin]: http://bin.arnastofnun.is/
[bindata]: http://bin.arnastofnun.is/gogn/
[v1]: https://github.com/borgar/ordavinda/tree/version-1
