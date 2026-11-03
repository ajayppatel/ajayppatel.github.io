# Word Vistas

A Wordscapes-style word game for Mom. Drag across the 7-letter wheel to spell words and fill the crossword.
100 levels in 10 scenic packs of 10. Progress is saved in the phone's browser (localStorage), so there's no login.

## Files
- `index.html` — the whole game in one file (levels inlined). This is what gets hosted.
- `icon.png`, `manifest.json` — home-screen icon and app name for "Add to Home Screen".
- `src/game.html` — game source (HTML/CSS/JS). Edit this, then run `python3 build.py`.
- `levels.json` — the 100 levels (letters, crossword layout, accepted bonus words).
- `tools/gen_levels.py` — level generator.

## Edit the game
    python3 build.py          # rebuilds index.html (and dist/artifact.html) from src/game.html + levels.json

## Make more levels
    pip install wordfreq better_profanity
    npm i word-list@3 wordnet-db
    PYTHONHASHSEED=0 python3 tools/gen_levels.py   # run from this folder; writes levels.json
    python3 build.py
Tweak `target_count()` for difficulty, the level count in the `range(100)` loop, and the `PROPER` set to block words.
New levels must be appended (not reshuffled) to keep existing saved progress lined up.

## Hosting
Lives at https://ajayppatel.com/games/word-vistas/ (folder `games/word-vistas` in the ajayppatel.github.io repo). Push to `master` to deploy.
On iPhone: open the link in Safari → Share → Add to Home Screen.
