import fs from 'fs';
import path from 'path';

const ALPHABET = 'AÁBDEÉFGHIÍJKLMNOÓPRSTUÚVXYÝÞÆÐÖaábdeéfghiíjklmnoóprstuúvxyýþæðö';
const dirname = path.dirname(new URL(import.meta.url).pathname);
const binFile = path.resolve(dirname, './Storasnid_allt/Storasnid_beygm_subset.csv');
const rootFile = path.resolve(dirname, './Storasnid_allt/Storasnid_ord.csv');
const outputFile = path.resolve(dirname, '../src/utils/levels.js');

async function readLines (textfile, every_line) {
  const input = fs.createReadStream(textfile);
  let remaining = '';
  return new Promise(resolve => {
    input.on('data', data => {
      remaining += data;
      let index = remaining.indexOf('\n');
      let last  = 0;
      while (index > -1) {
        var line = remaining.substring(last, index);
        last = index + 1;
        every_line( line );
        index = remaining.indexOf('\n', last);
      }
      remaining = remaining.substring(last);
    });
    input.on('end', () => {
      if (remaining.length > 0) {
        every_line(remaining);
      }
      resolve();
    });
  });
}

async function readWords () {
  // start by reading the main defs
  const byKey = new Map();
  await readLines(rootFile, line => {
    const [
      // Uppflettiorð
      word,
      // BIN.ID
      id,
      // Orðflokkur eða kyn nafnorðs: [afn, ao, fn, fs, gr, hk, kk, hvk, lo, nhm, ...]
      type,
      // Orðgerð: [g, s]
      composition,
      // Merkingarleg flokkun orðaforðans [alm, bibl, bíl, brag,, bygg, bær, ...]
      bin_part,
      // Einkunn orðs er miðuð við notkun í nútímamáli [0-5]
      grade,
    ] = line.split(';');

    byKey.set(id, {
      word, id, type, composition, bin_part,
      grade: +grade,
    });
  });
  return byKey;
}

async function readWordForms (whitelist) {
  const words = new Map();
  let current1st = '';
  await readLines(binFile, line => {
    const [ word, id, type, wordform ] = line.split(';');
    if (current1st !== word[0]) {
      current1st = word[0];
    }
    if (
      wordform.length <= 6 &&
      whitelist.has(id) &&
      !words.has(wordform) &&
      wordform.toLowerCase() === wordform &&
      hasOnlyIcelandicCharacters(wordform)
    ) {
      words.set(wordform, 1);
    }
  });

  return words;
}

function is6Letters (wordDef) {
  return wordDef.word.length === 6;
}

function isNotProperNoun (wordDef) {
  return wordDef.word === wordDef.word.toLowerCase()
}

function isNotLowGrade (wordDef) {
  // remove garbage words
  // 1: Sjálfgildi – Orðið er tækt í hvaða málsniði sem er. Dæmi: "köttur"
  // 2: Notað – Orðið er notað en ekki fullkomlega viðurkennt í hvaða stílsniði sem er. Dæmi: "ballans" (tökuorð, "jafnvægi" þykir betra).
  // Mörkin eru þröng og ekki ástæða til að amast við orðum sem fá einkunnina 2 nema í formlegu máli.
  return (wordDef.grade === 1 || wordDef.grade === 2);
}

const BIN_OK_PARTS = [
  'alm', 'efna', 'ffl', 'gras', 'íþr', 'mat', 'málfr', 'mæl', 'natt', 'stærð',
  'text', 'titl', 'tími', 'tón', 'tung' ];
function isWantedCategory (wordDef) {
  return BIN_OK_PARTS.includes(wordDef.bin_part.toLowerCase());
}

export function collateSizeThenAlphabetical (a, b) {
  const d = b.length - a.length;
  if (d) {
    return d;
  }
  for (let i = 0; i < a.length; i++) {
    const ax = ALPHABET.indexOf(a[i].toLowerCase());
    const bx = ALPHABET.indexOf(b[i].toLowerCase());
    const d = ax - bx;
    if (d) {
      return d;
    }
  }
  return 0;
}

function hasOnlyIcelandicCharacters (word) {
  for (const char of word) {
    if (ALPHABET.includes(char)) {
    }
    else {
      return false;
    }
  }
  return true;
}

let seen = [];
function isNotRepeat (wordDef) {
  if (seen.includes(wordDef.word)) {
    return false;
  }
  seen.push(wordDef.word);
  return true;
};


function permutations (str) {
  if (str.length === 1) {
    return str;
  }
  const result = [];
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (str.indexOf(char) !== i) {
      continue;
    }
    const remainder = str.slice(0, i) + str.slice(i + 1, str.length);
    for (const p of permutations(remainder)) {
      result.push(char + p);
    }
  }
  return result;
}


/**
 * Return all valid words in a dictionary generatable by any
 * subset of at least three characters of a given string.
 * 
 * @param {string} keyword
 * @param {Map<string, number>} dictionary
 */
function find_all (keyword, dictionary) {
  const perm = permutations(keyword);
  let words = [];
  for (let i = 6; i >= 3; i--) {
    for (const d of perm) {
      const w = d.slice(0, i);
      if (dictionary.has(w) && !words.includes(w)) {
        words.push(w);
      }
    }
  }
  return {
    keyword,
    words
  };
}

function ucfirst (str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

// single letter prefix elmination: blýi;böli;býir;býli => _bLýiÖliÝirÝli
function compress (level) {
  let output = '';
  let head = '';
  const wordlist = [ ...level.words ].sort(collateSizeThenAlphabetical);
  for (const word of wordlist) {
    if (word[0] != head) {
      head = word[0];
      output += '_' + head;
    }
    output += ucfirst(word.slice(1));
  }
  return level.keyword + output;
}

const unpacker = `
function unpack (str) {
  let words = [];
  let head = '';
  let w = '';
  const flush = () => {
    w && words.push(w);
    w = '';
  };
  for (let c, i = 6; c = str[i]; i++) {
    if (c === '_') {
      flush();
      head = str[++i];
    }
    else if (/^[A-ZÁÉÍÓÚÝÞÆÐÖ]/.test(c)) {
      flush();
      w = head + c.toLowerCase();
    }
    else {
      w += c;
    }
  }
  flush();
  return { key: str.slice(0, 6), words };
}
`.trim();

(async function main () {
  if (!fs.existsSync(binFile)) {
    console.log(binFile, 'is missing!');
    process.exit(1);
  }
  if (!fs.existsSync(rootFile)) {
    console.log(rootFile, 'is missing!');
    process.exit(1);
  }

  console.time('collect root words');
  // create a list of words that serve as level keys
  let words = Array.from((await readWords()).values())
    .filter(isNotLowGrade)
    .filter(isWantedCategory);

  const whitelist = new Map(words.map(d => [ d.id, 1 ]));

  words = words
    .filter(isNotProperNoun)
    .filter(d => hasOnlyIcelandicCharacters(d.word))
    .filter(is6Letters)
    .filter(isNotRepeat);

  console.timeEnd('collect root words');

  console.time('collect word forms');
  const wordForms = await readWordForms(whitelist);
  console.timeEnd('collect word forms');

  const keys = [];
  let levels = [];

  // build a level for each level keyword
  const scores = [ 0, 0, 0, 75, 150, 300, 500 ];
  words.forEach(d => {
    const key = d.word.split('').sort().join('');
    if (keys.includes(key)) {
      // key may have been used by a previous level
      return;
    }
    const level = find_all(key, wordForms);
    const histo = [ 0, 0, 0, 0, 0, 0, 0 ];
    let score = 0;
    level.words.forEach(w => {
      histo[w.length]++;
      score += scores[w.length];
    });

    // prune outlier levels
    if (level.words.length > 50 || level.words.length < 15) {
      // only allow levels with between 15 and 50 words
      return;
    }
    if (histo[6] > 2) {
      // only allow levels with 1 or 2 6-letter words
      return;
    }
    levels.push(level);
  });

  console.log('number of levels:', levels.length);
  const levelJson = `${unpacker}\n\nexport const levels = [\n${levels.map(d => JSON.stringify(compress(d))).join(',\n')}\n].map(unpack);\n`;
  console.log('writing to', outputFile);
  fs.writeFileSync(outputFile, levelJson, 'utf8');
})();
