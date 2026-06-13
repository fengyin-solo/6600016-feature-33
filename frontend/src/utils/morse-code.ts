// International Morse Code table
export const MORSE_TABLE: Record<string, string> = {
  'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
  'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
  'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
  'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
  'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
  'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-',  ',': '--..--',  '?': '..--..',  '!': '-.-.--',
  '/': '-..-.',   '(': '-.--.',   ')': '-.--.-',  '&': '.-...',
  ':': '---...',  ';': '-.-.-.',  '=': '-...-',   '+': '.-.-.',
  '-': '-....-',  '_': '..--.-',  '"': '.-..-.',  '$': '...-..-',
  '@': '.--.-.',  ' ': '/',
}

export const REVERSE_TABLE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_TABLE).map(([k, v]) => [v, k])
)

export function textToMorse(text: string): string {
  return text.toUpperCase().split('').map(c => MORSE_TABLE[c] || '').join(' ')
}

export function morseToText(morse: string): string {
  return morse.split(' ').map(code => REVERSE_TABLE[code] || '').join('')
}
