/**
 * Speech Recognition Utilities for Mobile & Desktop Web Browsers.
 * Resolves Android Chrome / Gboard repetition bugs where progressive snapshots
 * or identical phrase loops are emitted.
 */

/**
 * Removes immediately adjacent duplicate words or repeated multi-word phrases.
 * e.g., "science because as Art and Science because as Art and Science because" -> "science because as Art and Science because"
 */
export function cleanRepeatedPhrases(text: string): string {
  if (!text) return '';
  let words = text.trim().split(/\s+/);
  if (words.length < 2) return text.trim();

  // 1. Single word adjacent deduplication (e.g., "because because" -> "because")
  const dedupedWords: string[] = [];
  for (let i = 0; i < words.length; i++) {
    if (i > 0 && words[i].toLowerCase() === words[i - 1].toLowerCase()) {
      continue;
    }
    dedupedWords.push(words[i]);
  }
  words = dedupedWords;

  if (words.length < 4) return words.join(' ');

  // 2. Multi-word phrase adjacent loop deduplication (from 12-word phrases down to 2-word phrases)
  let changed = true;
  let iterations = 0;
  while (changed && iterations < 12) {
    changed = false;
    iterations++;

    const maxLen = Math.min(Math.floor(words.length / 2), 12);
    for (let phraseLen = maxLen; phraseLen >= 2; phraseLen--) {
      for (let i = 0; i <= words.length - 2 * phraseLen; i++) {
        const p1 = words.slice(i, i + phraseLen).join(' ').toLowerCase();
        const p2 = words.slice(i + phraseLen, i + 2 * phraseLen).join(' ').toLowerCase();
        if (p1 === p2) {
          words.splice(i + phraseLen, phraseLen);
          changed = true;
          break;
        }
      }
      if (changed) break;
    }
  }

  return words.join(' ');
}

/**
 * Merges a list of transcript pieces, intelligently handling:
 * - Progressive revisions (where a later chunk is an extension of an earlier chunk)
 * - Boundary overlaps (where chunk B repeats the tail words of chunk A)
 * - Distinct sentences
 */
export function mergeSpeechTranscripts(pieces: string[]): string {
  if (!pieces || pieces.length === 0) return '';

  const cleaned = pieces
    .map(p => p.trim())
    .filter(p => p.length > 0);

  if (cleaned.length === 0) return '';

  let merged = cleaned[0];

  for (let i = 1; i < cleaned.length; i++) {
    const nextPiece = cleaned[i];
    const mLower = merged.toLowerCase();
    const nLower = nextPiece.toLowerCase();

    // 1. If nextPiece starts with or contains previous merged text, nextPiece is a progressive snapshot
    if (nLower.includes(mLower)) {
      merged = nextPiece;
      continue;
    }

    // 2. If merged already contains nextPiece, ignore it
    if (mLower.includes(nLower)) {
      continue;
    }

    // 3. Check for boundary overlap between words at end of `merged` and start of `nextPiece`
    const mergedWords = merged.split(/\s+/);
    const nextWords = nextPiece.split(/\s+/);
    let overlapCount = 0;
    const maxOverlap = Math.min(mergedWords.length, nextWords.length, 8);

    for (let len = maxOverlap; len > 0; len--) {
      const tail = mergedWords.slice(-len).join(' ').toLowerCase();
      const head = nextWords.slice(0, len).join(' ').toLowerCase();
      if (tail === head) {
        overlapCount = len;
        break;
      }
    }

    if (overlapCount > 0) {
      const nonOverlapping = nextWords.slice(overlapCount).join(' ');
      if (nonOverlapping) {
        merged = `${merged} ${nonOverlapping}`;
      }
    } else {
      // 4. Distinct sentence
      merged = `${merged} ${nextPiece}`;
    }
  }

  return cleanRepeatedPhrases(merged.trim());
}
