// Real first names — the ones a Dane or a Japanese in Denmark may actually
// carry — so the decency guard is walked over names people have, not only
// over the letter-strings the sweep invents. Test data, kept beside the
// engine it guards; nothing in the app imports it.
//
// The override tables are NOT repeated here: the test walks those too, and
// this list is what the RULES have to answer for. A name that is on neither
// list and still comes back crude is the bug this file exists to catch.

/** Whitespace-separated, so ~300 names cost ~35 lines instead of ~300. */
function names(block: string): string[] {
  return block.trim().split(/\s+/)
}

/** Danish first names the override table does not carry. */
export const DANISH_CORPUS: string[] = names(`
  Abelone Agnes Alberte Alma Andrea Anette Annette Asta Benedikte Berit
  Birgit Birgitte Birthe Bodil Britta Cathrine Christina Christa Dagmar Dorte
  Edel Elin Elisabeth Ellen Else Esther Filippa Frida Gerda Gertrud
  Gitte Grethe Gudrun Hedvig Helene Henriette Hilda Ilse Ingrid Inger
  Irene Iben Jane Janne Jette Johanne Jonna Karina Karla Kirstine
  Kristine Lea Lenny Letsie Lilly Lisbeth Liv Lotte Lykke Maja Malene
  Malou Maren Marie Mathilde Merete Mia Mille Nanna Nete Nina
  Odai Olivia Pernille Ragnhild Randi Rita Rosa Ruth Sanne Sidsel
  Silje Solveig Stine Tanja Thea Tina Tove Ulla Vibeke Winnie Yrsa
  Ægir Alf Allan Arne Asger Bent Bjarne Brian Carsten Christoffer
  Dines Ebbe Egon Ejner Esben Eske Finn Flemming Frank Frode Frantz
  Gunnar Gorm Haakon Harald Helge Holger Ivan Jarl Jeppe Jeske
  Joakim Jonas Jorne Kaj Kasper Keld Kurt Kent Kuno Kuni
  Lars Leif Lenin Lennart Lito Malte Marcus Marius Mogens
  Nils Noa Norbert Orla Otto Palle Per Poul Preben Richard
  Rudy Rune Sigurd Steen Stig Svend Tage Thor Thorbjørn
  Torben Troels Uffe Ulrik Valdemar Verner Volkert Walther
`)

/** Japanese first names the override table does not carry. */
export const JAPANESE_CORPUS: string[] = names(`
  Aya Akane Akira Aki Akari Aiko Aimi Ami Amaya Ana Anri Atsuko
  Atsushi Ayaka Ayame Ayano Ayari Azusa Chiyo Emi Erika Etsuko Fumiko
  Fumi Gaku Go Hanako Hana Haru Harumi Haruyo Hidaki Hideo Hikari
  Hideo Hideko Hitomi Hiro Hiroshi Hitoe Hitoshi Hiyori Honoka
  Hinata Hoshiko Hotaru Ibuki Ichika Ichiro Izumi Jun Junichi
  Junko Jurana Kaede Kagami Kaori Karin Kaoru Katano Katsumi
  Kei Keichiro Keiko Kenta Kenzo Kazu Kazuey Kiki Kiko Kimiho
  Kinoko Ko Kiyoko Kiyoshi Kohaku Koichi Kojima Koo Kota Kouki
  Kumi Kuni Kira Kyo Kyoko Mado Makio Makito Makino Mako Makoto
  Momo Maria Mariko Mari Makie Manami Marun Mihoko Mika Miki
  Miku Mina Minami Minato Mio Misako Misaki Mitsuki Miu Mugi
  Miyabi Mizuki Momoe Nana Nao Naoko Naomi Natsuko Natsuki Neko
  Niki Niko Nikki Nimura Noa Robo Nomura Noriko Nozomi Obi Oki
  Otoha Rei Ren Renji Riko Riku Rina Rinji Risa Ritsuko Robo
  Roko Rumi Ryo Ryota Sada Sadao Saeko Sae Sakae Sakina Sakura
  Saki Sano Satoko Satomi Sawa Sayaka Sayuri Seiko Seiji Sena
  Setsuko Shizuka Sho Shogo Surei Shoi Shota Shunji Sora
  Sora Sota Suwa Reiko Hiroshi Takana Takashi Takumi Tamako
  Tamauri Takeshi Takuji Takane Takuya Tamae Tami Yoshiro Taro
  Tatsuya Teruko Tetsuo Tetsuya Tomoe Tomoko Tomo Toshiro Toshiyuki
  Tsubasa Tsukiko Tsuyoshi Yabuki Yachiyo Yaeko Yamada Yasuo Yasushi
  Yoko Yoriko Yoshie Yoshimi Yoshiko Yosuke Yuki Yumi Yuna
  Yunagi Yuri Yuriko Yuya Yuta Yuto Yuzu
`)

/**
 * The crude-word probes and the near-misses a critic would type in. Not all
 * of these are names — Chin, Manko and Unko are the crude words themselves —
 * and they are here so that «no suggestion» stays the answer for them.
 */
export const NEAR_MISS_PROBES: string[] = names(`
  Chin Manko Unko Onan Onani Ana Kamik Kinzi Kets Kand
  Cin Collin Klaus Mineta Vagn Villads Vicky Vina Vera
  Kirstine Kirsten Karpita Kotch Koyama Kagawa
`)

/** Everything above, once each, for the guard that walks all of it. */
export const GIVEN_NAME_CORPUS: string[] = [
  ...new Set([...DANISH_CORPUS, ...JAPANESE_CORPUS, ...NEAR_MISS_PROBES]),
]
