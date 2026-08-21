#!/usr/bin/env python3
"""Subset Noto Sans JP to the glyphs this app renders. Authoring-time only.

The app teaches hiragana and katakana and shows a handful of kanji (numbers,
water, Japan). Everything outside that is dead weight; the full variable font
is ~9.6 MB, the subset ~44 KB per weight.

    python3 scripts/subset-jp-font.py /path/to/NotoSansJP[wght].ttf

Download the source (SIL OFL 1.1): https://fonts.google.com/noto/specimen/Noto+Sans+JP
The google/fonts repo keeps it at ofl/notosansjp/NotoSansJP[wght].ttf.
"""
import subprocess
import sys
import tempfile
from pathlib import Path

FONTS_DIR = Path(__file__).resolve().parent.parent / "public" / "fonts"

# Hiragana (incl. small kana) + iteration marks, full katakana block (ー、・、ヴ),
# Japanese punctuation, full-width ! ? , , and the kanji this app renders.
KEEP_RANGES = ",".join([
    "U+3041-3096",
    "U+309D-309E",
    "U+30A0-30FF",
    "U+3001-3003",
    "U+3005",
    "U+3007-3011",
    "U+3014-3015",
    "U+30FB",
    "U+FF01",
    "U+FF1F",
    "U+FF0C",
    # 一 二 三 九 十 五 六 八 四 水 日 本 語 私
    "U+4E00",
    "U+4E03",
    "U+4E09",
    "U+4E5D",
    "U+4E8C",
    "U+4E94",
    "U+516B",
    "U+516D",
    "U+5341",
    "U+56DB",
    "U+6C34",
    "U+65E5",
    "U+672C",
    "U+8A9E",
    "U+79C1",
])


def instantiate(source: Path, target: Path, weight: int) -> None:
    subprocess.run(
        [
            sys.executable,
            "-m",
            "fontTools.varLib.instancer",
            str(source),
            f"wght={weight}",
            "--output",
            str(target),
        ],
        check=True,
    )


def subset(source: Path, target: Path) -> None:
    with tempfile.TemporaryDirectory() as tmp:
        static = Path(tmp) / f"NotoSansJP-{source.stem}.ttf"
        instantiate(source, static, 400 if target.name.endswith("Regular.woff2") else 700)
        subprocess.run(
            [
                sys.executable,
                "-m",
                "fontTools.subset",
                str(static),
                f"--unicodes={KEEP_RANGES}",
                "--name-IDs=*",
                "--flavor=woff2",
                "--output-file",
                str(target),
            ],
            check=True,
        )


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    source = Path(sys.argv[1])
    if not source.exists():
        raise SystemExit(f"Missing source font: {source}")
    subset(source, FONTS_DIR / "NotoSansJP-Regular.woff2")
    subset(source, FONTS_DIR / "NotoSansJP-Bold.woff2")
    print("Wrote NotoSansJP-Regular.woff2 and NotoSansJP-Bold.woff2")


if __name__ == "__main__":
    main()
