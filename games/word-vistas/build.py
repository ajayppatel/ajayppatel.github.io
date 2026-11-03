"""Build: inline levels.json into src/game.html -> dist/artifact.html (artifact body) and index.html (full page for any static host)."""
import json, pathlib
root = pathlib.Path(__file__).parent
src = (root / "src/game.html").read_text()
levels = json.loads((root / "levels.json").read_text())
body = src.replace("/*LEVELS*/[]", json.dumps(levels, separators=(",", ":")))
(root / "dist").mkdir(exist_ok=True)
(root / "dist/artifact.html").write_text(body)
head = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#f6a96b">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Word Vistas">
<link rel="apple-touch-icon" href="icon.png">
<link rel="icon" href="icon.png">
<link rel="manifest" href="manifest.json">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);box-sizing:border-box;height:100%}[hidden]{display:none!important}</style>
"""
(root / "index.html").write_text(head + body.replace("<title>", "<title>", 1).replace("\n<div id=\"scene\">", "\n</head>\n<body>\n<div id=\"scene\">", 1) + "\n</body>\n</html>\n")
print("built", len(levels), "levels")
