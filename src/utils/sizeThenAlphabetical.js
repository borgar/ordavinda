export const alphabet = 'aábdeéfghiíjklmnoóprstuúvxyýþæðö';

export function sizeThenAlphabetical (a, b) {
  const d = b.length - a.length;
  if (d) {
    return d;
  }
  for (let i = 0; i < a.length; i++) {
    const ax = alphabet.indexOf(a[i].toLowerCase());
    const bx = alphabet.indexOf(b[i].toLowerCase());
    const d = ax - bx;
    if (d) {
      return d;
    }
  }
  return 0;
}
