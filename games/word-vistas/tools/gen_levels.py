"""Generate Wordscapes-style levels: 7 letters, crossword of sub-words, bonus list."""
import json, random, sys
from collections import Counter
from wordfreq import zipf_frequency
from better_profanity import profanity

random.seed(20261102)
profanity.load_censor_words()

ALL = [w.strip() for w in open("node_modules/word-list/words.txt") if w.strip().isalpha()]
ALL = [w for w in ALL if 3 <= len(w) <= 7]
EXTRA_BAD = {"rape", "raped", "rapes", "rapist", "nazi", "nazis", "slut", "sluts", "whore", "porn", "anal", "anus",
             "penis", "semen", "sperm", "cock", "cocks", "dick", "dicks", "tit", "tits", "fag", "fags", "homo",
             "homos", "kike", "spic", "spics", "gook", "coon", "coons", "negro", "dyke", "dykes", "twat", "cum",
             "cums", "jizz", "piss", "shit", "fuck", "cunt", "bitch", "bastard", "damn", "hell", "ass", "arse",
             "crap", "kill", "killer", "suicide", "lynch", "murder", "corpse", "nude", "nudes", "sex", "sexy",
             "orgasm", "orgy", "pimp", "pimps", "booze", "drugs", "heroin", "opium", "vagina", "breast", "nipple",
             "nipples", "erotic", "lust", "horny", "bra", "bras", "pee", "poo", "poop", "fart", "farts", "turd"}

PROPER0 = None
PROPER = {"firearm","randy","damning","cant","ford","whit","leftist","troy","ems","yen","wally","brothel","carnage","hostage","bullets","centred","stalked","maxwell","mina","chi","toon","inter","stabbed","max","don","heinous","hackers","ting","sept","prof","ref","non","euro","goon","freeman","granger","ding","pro","info","auto","tech","anti","cent","rep","reps","feb","nov","oct","dec","aug","jun","jul","mar","apr","thu","tue","wed","fri","sat","sun","sen","shooter","violent","disease","death","deaths","cocaine","hipster","sexiest","puberty","cyanide","atheism","addicts","addict","tripoli","william","riviera","alan","cole","vera","obesity","aids","drug","drugs","toilets","toilet","bladder","gen","comp","tang","sexes","sexier","dildo","bomb","bombs","gun","guns","dead","died","die","dies","kills","killed","corrupt","nazi","sexy","sex","thong","bong","meth","cocaine","rapes","noel","ale","cia","fbi","nba","nfl","nhl","mlb","eds","ted","gloria","dickens","yankees","los","del","lee","pre","centre","eric","ann","anne","jan","dan","ted","tim","jim",
          "sam","tom","ben","joe","jon","ron","rio","san","las","von","der","les","ian","ada","dna","usa",
          "ira","ida","ali","abe","ito","ono","oni","ave","st","ltd","inc","etc","yeah","nah","fda","mrs","nan","nat","ted","rae",
          "carl","diane","elena","ella","tina","lisa","mary","rita","sara","sarah","ruth","rosa","nora","lena",
          "dane","danes","swede","paris","rome","texas","london","italia","maria","mario","sonia","annie","jesse","jose","jean",
          "dante","otto","leon","noel","lola","nina","nile","asia","india","korea","china","peru","iran","iraq","cuba","chile",
          "tony","june","april","august","mona","emma","olga"}
def bad(w):
    return w in PROPER or w in EXTRA_BAD or profanity.contains_profanity(w)

import glob
WN_LOW, WN_CAP = set(), set()
for f in glob.glob("node_modules/wordnet-db/dict/data.*"):
    for line in open(f, encoding="latin-1"):
        if line.startswith("  "): continue
        p = line.split(" ")
        for i in range(int(p[3], 16)):
            lem = p[4 + 2 * i].split("(")[0]
            if "_" in lem: continue
            (WN_LOW if lem.islower() else WN_CAP).add(lem.lower())

def stems(w):
    out = {w}
    for suf, rep in (("ies", "y"), ("es", ""), ("s", ""), ("ed", ""), ("ed", "e"), ("ing", ""), ("ing", "e"),
                     ("er", ""), ("er", "e"), ("est", ""), ("est", "e"), ("ly", ""), ("ied", "y"), ("ier", "y"), ("iest", "y")):
        if w.endswith(suf) and len(w) - len(suf) >= 2:
            b = w[: -len(suf)] + rep
            out.add(b)
            if len(b) > 2 and b[-1] == b[-2]: out.add(b[:-1])
    return out

DICT = set(w for w in ALL if not bad(w))
FREQ = {w: zipf_frequency(w, "en") for w in DICT}

def is_common_word(w):
    if any(s in WN_LOW for s in stems(w)): return True
    return FREQ[w] >= 4.8 and w not in WN_CAP

def subwords(letters):
    c = Counter(letters)
    out = []
    for w in DICT:
        wc = Counter(w)
        if all(wc[k] <= c[k] for k in wc):
            out.append(w)
    return out

# ---------------- crossword layout ----------------
def can_place(grid, word, r, c, d):
    dr, dc = (0, 1) if d == "H" else (1, 0)
    pr, pc = r - dr, c - dc
    if (pr, pc) in grid: return -1
    er, ec = r + dr * len(word), c + dc * len(word)
    if (er, ec) in grid: return -1
    inter = 0
    for i, ch in enumerate(word):
        rr, cc = r + dr * i, c + dc * i
        cell = grid.get((rr, cc))
        if cell:
            letter, dirs = cell
            if letter != ch or d in dirs: return -1
            inter += 1
        else:
            # perpendicular neighbours must be empty
            n1 = (rr + dc, cc + dr); n2 = (rr - dc, cc - dr)
            if n1 in grid or n2 in grid: return -1
    return inter

def place(grid, word, r, c, d):
    dr, dc = (0, 1) if d == "H" else (1, 0)
    for i, ch in enumerate(word):
        k = (r + dr * i, c + dc * i)
        if k in grid: grid[k][1].add(d)
        else: grid[k] = [ch, {d}]

def bbox(grid):
    rs = [k[0] for k in grid]; cs = [k[1] for k in grid]
    return min(rs), max(rs), min(cs), max(cs)

MAXW, MAXH = 11, 11

def try_layout(words):
    words = list(words)
    grid = {}
    first = words[0]
    d0 = random.choice("HV")
    place(grid, first, 0, 0, d0)
    placed = [(first, 0, 0, d0)]
    rest = words[1:]
    failed = []
    for w in rest:
        best = None
        cells = list(grid.items())
        for (gr, gc), (letter, dirs) in cells:
            for i, ch in enumerate(w):
                if ch != letter: continue
                for d in ("H", "V"):
                    if d in dirs: continue
                    r, c = (gr, gc - i) if d == "H" else (gr - i, gc)
                    inter = can_place(grid, w, r, c, d)
                    if inter < 1: continue
                    # score: bounding box after placing
                    dr, dc = (0, 1) if d == "H" else (1, 0)
                    r0, r1, c0, c1 = bbox(grid)
                    r0 = min(r0, r); c0 = min(c0, c)
                    r1 = max(r1, r + dr * (len(w) - 1)); c1 = max(c1, c + dc * (len(w) - 1))
                    h, wd = r1 - r0 + 1, c1 - c0 + 1
                    if h > MAXH or wd > MAXW: continue
                    score = inter * 6 - (h * wd) * 0.35 - abs(h - wd) * 0.8 + random.random() * 2
                    if best is None or score > best[0]:
                        best = (score, r, c, d)
        if best:
            _, r, c, d = best
            place(grid, w, r, c, d)
            placed.append((w, r, c, d))
        else:
            failed.append(w)
    r0, r1, c0, c1 = bbox(grid)
    placed = [(w, r - r0, c - c0, d) for w, r, c, d in placed]
    return placed, failed, r1 - r0 + 1, c1 - c0 + 1

def best_layout(words, tries=250):
    best = None
    for _ in range(tries):
        head = words[0]
        tail = words[1:]
        random.shuffle(tail)
        tail.sort(key=lambda w: -len(w) + random.random() * 2.5)
        placed, failed, h, w = try_layout([head] + tail)
        score = len(placed) * 100 - h * w - abs(h - w) * 3
        if best is None or score > best[0]:
            best = (score, placed, failed, h, w)
    return best[1:]

# ---------------- level selection ----------------
def target_count(i):
    # i = 0..99 ; ramps from ~5 words to ~12
    return int(round(5 + (i / 99) ** 0.9 * 7))

bases = [w for w in DICT if len(w) == 7 and FREQ[w] >= 3.2 and is_common_word(w) and len(set(w)) >= 5]
random.shuffle(bases)
seen_sets = set()
cands = []
for b in bases:
    key = "".join(sorted(b))
    if key in seen_sets: continue
    subs = subwords(b)
    common = [w for w in subs if FREQ[w] >= 3.0 and w != b and is_common_word(w)]
    if len(common) < 6: continue
    seen_sets.add(key)
    cands.append((b, subs, common))
    if len(cands) >= 400: break
print("candidate bases", len(cands), file=sys.stderr)

# easier bases (more very-common words, fewer letters repeated) earlier
def ease(c):
    b, subs, common = c
    return sum(FREQ[w] for w in common) / len(common) + min(len(common), 20) * 0.05
cands.sort(key=ease, reverse=True)

levels = []
used = set()
ci = 0
for i in range(100):
    n = target_count(i)
    while True:
        b, subs, common = cands[ci]; ci += 1
        pool = sorted(common, key=lambda w: -FREQ[w])
        # prefer longer words as difficulty rises, but keep it friendly
        three = [w for w in pool if len(w) == 3]
        longer = [w for w in pool if len(w) > 3]
        k3 = max(1, min(len(three), n // 3))
        chosen = longer[: n - 1 - k3] + three[:k3]
        if len(chosen) < n - 1:
            chosen += [w for w in pool if w not in chosen][: n - 1 - len(chosen)]
        words = [b] + sorted(chosen, key=lambda w: -len(w))
        placed, failed, h, w = best_layout(words)
        if len(placed) >= max(4, n - 1) and h <= MAXH and w <= MAXW:
            break
    grid_words = {p[0] for p in placed}
    bonus = sorted(set(subs) - grid_words)
    letters = list(b.upper())
    random.shuffle(letters)
    levels.append({
        "letters": "".join(letters),
        "rows": h, "cols": w,
        "words": [{"w": p[0].upper(), "r": p[1], "c": p[2], "d": p[3]} for p in placed],
        "bonus": [x.upper() for x in bonus],
    })
    print(i + 1, b, len(placed), f"{h}x{w}", file=sys.stderr)

json.dump(levels, open("levels.json", "w"), separators=(",", ":"))
