// Review sources stay out of the learner bundle but share the bridge IDs.
// Every bridge keeps at least two honest references — one for the Japanese
// side (ja.wiktionary.org) and one for the Danish side (ordnet.dk), with the
// route-language source where it clarifies the loan.
export const wordBridgeSources: Record<string, readonly string[]> = {
  'kohii-kaffe': [
    'https://ja.wiktionary.org/wiki/%E3%82%B3%E3%83%BC%E3%83%92%E3%83%BC',
    'https://www.etymonline.com/word/coffee',
    'https://ordnet.dk/ddo/ordbog/kaffe',
  ],
  'hoteru-hotel': [
    'https://ja.wiktionary.org/wiki/%E3%83%9B%E3%83%86%E3%83%AB',
    'https://denstoredanske.lex.dk/hotel',
    'https://ordnet.dk/ddo/ordbog/hotel',
  ],
  'basu-bus': [
    'https://ja.wiktionary.org/wiki/%E3%83%90%E3%82%B9',
    'https://www.etymonline.com/word/bus',
    'https://ordnet.dk/ddo/ordbog/bus',
  ],
  'takushii-taxi': [
    'https://ja.wiktionary.org/wiki/%E3%82%BF%E3%82%AF%E3%82%B7%E3%83%BC',
    'https://www.etymonline.com/word/taxi',
    'https://ordnet.dk/ddo/ordbog/taxi',
  ],
  'menyuu-menu': [
    'https://ja.wiktionary.org/wiki/%E3%83%A1%E3%83%8B%E3%83%A5%E3%83%BC',
    'https://www.etymonline.com/word/menu',
    'https://ordnet.dk/ddo/ordbog/menu',
  ],
  'terebi-tv': [
    'https://ja.wiktionary.org/wiki/%E3%83%86%E3%83%AC%E3%83%93',
    'https://www.etymonline.com/word/television',
    'https://ordnet.dk/ddo/ordbog/1575896',
  ],
  'rajio-radio': [
    'https://ja.wiktionary.org/wiki/%E3%83%A9%E3%82%B8%E3%82%AA',
    'https://www.etymonline.com/word/radio',
    'https://ordnet.dk/ddo/ordbog/radio',
  ],
  'kamera-kamera': [
    'https://ja.wiktionary.org/wiki/%E3%82%AB%E3%83%A1%E3%83%A9',
    'https://www.etymonline.com/word/camera',
    'https://ordnet.dk/ddo/ordbog/kamera',
  ],
  'resutoran-restaurant': [
    'https://ja.wiktionary.org/wiki/%E3%83%AC%E3%82%B9%E3%83%88%E3%83%A9%E3%83%B3',
    'https://www.etymonline.com/word/restaurant',
    'https://ordnet.dk/ddo/ordbog/restaurant',
  ],
  'sarada-salat': [
    'https://ja.wiktionary.org/wiki/%E3%82%B5%E3%83%A9%E3%83%80',
    'https://www.etymonline.com/word/salad',
    'https://ordnet.dk/ddo/ordbog/salat',
  ],
  'hottodoggu-hotdog': [
    'https://ja.wiktionary.org/wiki/%E3%83%9B%E3%83%83%E3%83%88%E3%83%89%E3%83%83%E3%82%B0',
    'https://www.etymonline.com/word/hot-dog',
    'https://ordnet.dk/ddo/ordbog/hotdog',
  ],
  'pen-pen': [
    'https://ja.wiktionary.org/wiki/%E3%83%9A%E3%83%B3',
    'https://www.etymonline.com/word/pen',
    'https://ordnet.dk/ddo/ordbog/pen',
  ],
  'piano-piano': [
    'https://ja.wiktionary.org/wiki/%E3%83%94%E3%82%A2%E3%83%8E',
    'https://www.etymonline.com/word/piano',
    'https://ordnet.dk/ddo/ordbog/piano',
  ],
}
