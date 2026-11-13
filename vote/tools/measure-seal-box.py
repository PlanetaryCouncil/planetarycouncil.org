#!/usr/bin/env python3
"""Measure the blank text box on a seal image and print a SEAL_LAYOUTS textArea.

Usage: python3 measure-seal-box.py seal.png [--band 0.60 0.90]

Finds the largest axis-aligned run of near-uniform light pixels (the blank
box) inside a vertical band of the image, then prints its bounds as
fractions of the image size, ready to paste into SEAL_LAYOUTS.
"""
import sys
from PIL import Image

def main():
    path = sys.argv[1]
    lo, hi = 0.60, 0.90
    if "--band" in sys.argv:
        i = sys.argv.index("--band"); lo, hi = float(sys.argv[i+1]), float(sys.argv[i+2])
    im = Image.open(path).convert("RGB")
    W, H = im.size
    px = im.load()
    cx = W // 2
    y0, y1 = int(H * lo), int(H * hi)

    def light(p, ref, tol=14):
        return all(abs(p[k] - ref[k]) <= tol for k in range(3)) and sum(p) > 600

    # Box fill colour = most common light colour on the centre column in the band.
    from collections import Counter
    col = Counter(px[cx, y] for y in range(y0, y1) if sum(px[cx, y]) > 600)
    ref = col.most_common(1)[0][0]

    # Rows whose centre segment (±20% width) is uniformly the fill colour.
    seg = int(W * 0.20)
    def frac(y, tol):
        xs = range(cx - seg, cx + seg, 2)
        return sum(light(px[x, y], ref, tol) for x in xs) / len(xs)
    tol = 14
    for tol in (14, 24, 34):  # a flat white box passes at 14; a textured cream box needs more
        rows = [y for y in range(y0, y1) if frac(y, tol) >= 0.97]
        if len(rows) > (y1 - y0) * 0.05:
            break
    # Longest contiguous run of such rows.
    best, run = [], []
    for y in rows:
        if run and y != run[-1] + 1:
            best = max(best, run, key=len); run = []
        run.append(y)
    best = max(best, run, key=len)
    top, bot = best[0], best[-1]
    mid = (top + bot) // 2
    # Horizontal extent on the middle row, tolerant of anti-aliasing.
    l = cx
    while l > 0 and light(px[l - 1, mid], ref, tol + 8): l -= 1
    r = cx
    while r < W - 1 and light(px[r + 1, mid], ref, tol + 8): r += 1
    print(f"image {W}x{H}  fill rgb{ref}")
    print(f"box px: x={l}..{r}  y={top}..{bot}  ({r-l+1}x{bot-top+1})")
    print(f"textArea: {{ x: {l/W:.4f}, y: {top/H:.4f}, w: {(r-l+1)/W:.4f}, h: {(bot-top+1)/H:.4f} }}")

if __name__ == "__main__":
    main()
