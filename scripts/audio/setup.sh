#!/usr/bin/env bash
set -eu

cd "$(dirname "$0")/../.."
audio_root=.audio
venv="$audio_root/.venv"
voices="$audio_root/voices"

python3 -m venv "$venv"
"$venv/bin/pip" install -r scripts/audio/requirements.txt
mkdir -p "$voices" "$audio_root/work" "$audio_root/reports"

if [ ! -f "$voices/ja_JA-hi_fi_captain-medium.onnx" ]; then
  "$venv/bin/python" -m piper.download_voices \
    ja_JA-hi_fi_captain-medium --data-dir "$voices"
fi
"$venv/bin/python" -c 'import sys; sys.path.insert(0, "scripts/audio"); from common import config, require_model; require_model(config())'


printf 'Audio tools are ready in %s\n' "$audio_root"
