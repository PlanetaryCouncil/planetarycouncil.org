#!/usr/bin/env python3
"""Measure the v2 badge boxes (gold-framed white text box + gold QR square).

usage: python3 measure-seal-v2.py seal-world-v2.png [seal-uk-v2.png ...]
Prints interior pixel bounds and SEAL_LAYOUTS fractions (textArea inset 3px,
qrArea inset 1px). Gold = R-B > 60 and R > 140.
"""
import sys
import numpy as np
from PIL import Image

def measure(path):
    im = np.array(Image.open(path).convert("RGB")).astype(int)
    H, W = im.shape[:2]
    s = W / 1254.0  # probe positions were picked on the 1254px art
    G = (im[..., 0] - im[..., 2] > 60) & (im[..., 0] > 140)
    def box(x0, x1, y0, y1, xmid, ymid, ys, xs):
        L, R, T, B = [], [], [], []
        for y in ys:
            row = np.where(G[y, x0:x1])[0] + x0
            L.append(row[row < xmid].max()); R.append(row[row > xmid].min())
        for x in xs:
            col = np.where(G[y0:y1, x])[0] + y0
            T.append(col[col < ymid].max()); B.append(col[col > ymid].min())
        return int(max(L)) + 1, int(min(R)) - 1, int(max(T)) + 1, int(min(B)) - 1
    S = lambda v: int(round(v * s))
    text = box(S(230), S(790), S(840), S(1080), S(500), S(950), range(S(900), S(1010), 10), range(S(320), S(720), 20))
    qr = box(S(780), S(1010), S(840), S(1080), S(890), S(950), range(S(900), S(1010), 10), range(S(820), S(970), 10))
    def frac(b, inset):
        l, r, t, bt = b
        return dict(x=round(float(l + inset) / W, 4), y=round(float(t + inset) / H, 4),
                    w=round(float(r - l + 1 - 2 * inset) / W, 4), h=round(float(bt - t + 1 - 2 * inset) / H, 4))
    print(path, f"{W}x{H}")
    print("  text interior", text, "textArea", frac(text, 3))
    print("  qr   interior", qr, "qrArea", frac(qr, 1))

for p in sys.argv[1:]:
    measure(p)
