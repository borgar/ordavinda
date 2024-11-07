import fs from 'fs';
import path from 'path';

const dirname = path.dirname(new URL(import.meta.url).pathname);
const file1 = path.resolve(dirname, './Storasnid_allt/Storasnid_beygm.csv');
const file2 = path.resolve(dirname, './Storasnid_allt/Storasnid_beygm_subset.csv');

const alphabet = 'AÁBDEÉFGHIÍJKLMNOÓPRSTUÚVXYÝÞÆÐÖaábdeéfghiíjklmnoóprstuúvxyýþæðö';
function hasOnlyIcelandicCharacters (word) {
  for (const char of word) {
    if (!alphabet.includes(char)) {
      return false;
    }
  }
  return true;
}

if (!fs.existsSync(file1)) {
  console.log(file1, 'is missing!');
  process.exit(1);
}

console.log('writing to', file2, '...');

const rawLines = fs
  .readFileSync(file1, 'utf8')
  .split('\n')
  .filter(line => {
    if (line) {
      const [ a, b, c, word ] = line.split(';');
      return (
        word.length <= 6 &&
        hasOnlyIcelandicCharacters(word) &&
        word.toLowerCase() === word
      );
    }
    return false;
  });

fs.writeFileSync(file2, rawLines.join('\n'), 'utf8');
