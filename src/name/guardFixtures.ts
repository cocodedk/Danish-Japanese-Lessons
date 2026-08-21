// Names the Japanese text-rule guard transliterates and then checks, so a
// broken rule or a mistyped override shows up as a failing test rather than
// as a Latin letter on a learner's own name. Test data, kept beside the
// engine it guards; nothing in the app imports it.

export const GUARD_FIXTURE_NAMES: string[] = [
  // The golden table from the port spec.
  'Babak',
  'Sara',
  'Mette',
  'Søren',
  'Anna',
  'Ali',
  'Lærke',
  // Japanese names, on and off the override list.
  'Hiroshi',
  'Yuki',
  'Satoshi',
  'Haruka',
  'Aiko',
  'Kenji',
  'Naoko',
  'Takashi',
  'Shota',
  'Yumi',
  'Ken',
  'Miyuki',
  // Danish names, on and off the list.
  'Peter',
  'Jørgen',
  'Bjørn',
  'Signe',
  'Louise',
  'Frederik',
  'Emma',
  'Astrid',
  'Rasmus',
  'Josefine',
  'Villads',
  'Malthe',
  'Thøger',
  // Compound and awkward input.
  'Anne-Mette',
  'Anne Mette',
  'Karen Margrethe',
  'X Æ A-12',
]
