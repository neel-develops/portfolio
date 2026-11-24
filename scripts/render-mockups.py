"""
Render high-fidelity iPhone mockup images from the real app screenshots.

  python scripts/render-mockups.py

Inputs : data/shots.json  (slug -> list of /shots/*.jpg, 430x932 phone screenshots)
         data/projects-lite.json (slug -> {name, accent}) for placeholder screens
Outputs: public/mockups/<slug>-front-<n>.webp  straight phone, transparent
         public/mockups/<slug>-tilt.webp      tilted phone with thickness + shadow
         data/mockups.json                    manifest used by the site
"""
import json
import math
import os

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "mockups")
os.makedirs(OUT, exist_ok=True)

SS = 2  # supersampling factor
W, H = 1000, 2106  # final front phone size (iPhone Pro Max proportions 77.6 x 163.4 mm)
PX = W / 77.6  # px per mm at final size
PAD = int(14 * 1)  # room for side buttons


def font(size, bold=True):
    for f in (["segoeuib.ttf", "arialbd.ttf"] if bold else ["segoeui.ttf", "arial.ttf"]):
        p = os.path.join("C:/Windows/Fonts", f)
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def rrect_mask(size, box, r):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle(box, radius=r, fill=255)
    return m


def metal_gradient(size, stops, horizontal=True):
    """Brushed-titanium gradient. stops: list of (pos, (r,g,b))."""
    w, h = size
    n = w if horizontal else h
    xs = np.linspace(0, 1, n)
    cols = np.zeros((n, 3))
    for c in range(3):
        cols[:, c] = np.interp(xs, [s[0] for s in stops], [s[1][c] for s in stops])
    if horizontal:
        arr = np.tile(cols[None, :, :], (h, 1, 1))
    else:
        arr = np.tile(cols[:, None, :], (1, w, 1))
    # fine brushed noise
    rng = np.random.default_rng(7)
    noise = rng.normal(0, 2.2, (h, w, 1))
    arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
    return Image.fromarray(arr, "RGB")


TITANIUM = [(0, (72, 72, 76)), (0.035, (168, 168, 172)), (0.08, (96, 96, 100)), (0.5, (58, 58, 62)),
            (0.92, (96, 96, 100)), (0.965, (176, 176, 180)), (1, (70, 70, 74))]


def placeholder_screen(name, accent):
    w, h = 860, 1864
    a = tuple(int(accent[i:i + 2], 16) for i in (1, 3, 5))
    top = np.array(a, float)
    bot = np.array((12, 12, 16), float)
    t = np.linspace(0, 1, h)[:, None]
    grad = (top * (1 - t) * 0.9 + bot * (t + 0.1 * (1 - t))).clip(0, 255)
    img = Image.fromarray(np.tile(grad[:, None, :], (1, w, 1)).astype(np.uint8), "RGB")
    d = ImageDraw.Draw(img, "RGBA")
    d.rounded_rectangle((48, 150, 300, 200), 25, fill=(255, 255, 255, 40))
    y = 300
    words = name.split()
    line = ""
    f = font(96)
    for wd in words:
        test = (line + " " + wd).strip()
        if d.textlength(test, font=f) > 740:
            d.text((48, y), line, font=f, fill="white"); y += 112; line = wd
        else:
            line = test
    d.text((48, y), line, font=f, fill="white")
    y += 190
    for i in range(4):
        d.rounded_rectangle((48, y, 812, y + 220), 36, fill=(255, 255, 255, 26 if i else 44))
        d.rounded_rectangle((84, y + 44, 84 + 300 - i * 40, y + 74), 15, fill=(255, 255, 255, 90))
        d.rounded_rectangle((84, y + 110, 84 + 520 - i * 60, y + 134), 12, fill=(255, 255, 255, 50))
        y += 260
    d.rounded_rectangle((48, 1700, 812, 1790), 45, fill=(255, 255, 255, 230))
    return img


def front_phone(screen: Image.Image) -> Image.Image:
    """Straight-on iPhone, transparent background."""
    s = SS
    fw, fh = (W + 2 * PAD) * s, H * s
    img = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
    ox = PAD * s
    R = int(12.6 * PX * s)  # outer corner radius
    body = (ox, 0, ox + W * s - 1, fh - 1)

    # side buttons (behind body)
    btn = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
    bd = ImageDraw.Draw(btn)
    bcol = (110, 110, 114, 255)
    for (y0, y1) in [(0.165, 0.205), (0.255, 0.33), (0.355, 0.43)]:  # action, vol+, vol-
        bd.rounded_rectangle((ox - 9 * s, int(y0 * fh), ox + 6 * s, int(y1 * fh)), radius=5 * s, fill=bcol)
    for (y0, y1) in [(0.27, 0.39), (0.6, 0.66)]:  # power, camera control
        bd.rounded_rectangle((ox + W * s - 6 * s, int(y0 * fh), ox + W * s + 9 * s, int(y1 * fh)), radius=5 * s, fill=bcol)
    img.alpha_composite(btn)

    # titanium rim
    rim = metal_gradient((fw, fh), TITANIUM, horizontal=True).convert("RGBA")
    rim.putalpha(rrect_mask((fw, fh), body, R))
    img.alpha_composite(rim)
    # subtle top/bottom light on the rim
    hl = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
    ImageDraw.Draw(hl).rounded_rectangle(body, radius=R, outline=(220, 220, 224, 150), width=2 * s)
    img.alpha_composite(hl)

    # black glass front (thin, ~1mm rim showing)
    rim_w = int(0.95 * PX * s)
    glass_box = (body[0] + rim_w, rim_w, body[2] - rim_w, fh - 1 - rim_w)
    glass = Image.new("RGBA", (fw, fh), (4, 4, 6, 255))
    glass.putalpha(rrect_mask((fw, fh), glass_box, R - rim_w))
    img.alpha_composite(glass)

    # display
    bez = int(1.2 * PX * s)
    sb = (glass_box[0] + bez, glass_box[1] + bez, glass_box[2] - bez, glass_box[3] - bez)
    sw, sh = sb[2] - sb[0], sb[3] - sb[1]
    scr = screen.convert("RGB").resize((sw, sh), Image.LANCZOS)
    scr = scr.convert("RGBA")
    scr.putalpha(rrect_mask((sw, sh), (0, 0, sw - 1, sh - 1), R - rim_w - bez))
    img.alpha_composite(scr, (sb[0], sb[1]))

    # Dynamic Island
    iw, ih = int(sw * 0.29), int(sh * 0.0175)
    ix, iy = sb[0] + (sw - iw) // 2, sb[1] + int(sh * 0.0135)
    di = ImageDraw.Draw(img)
    di.rounded_rectangle((ix, iy, ix + iw, iy + ih), radius=ih // 2, fill=(0, 0, 0, 255))
    # camera lens glint inside island
    cx, cy, cr = ix + iw - ih * 0.8, iy + ih / 2, ih * 0.28
    di.ellipse((cx - cr, cy - cr, cx + cr, cy + cr), fill=(18, 20, 34, 255))

    return img.resize((W + 2 * PAD, H), Image.LANCZOS)


def solve_perspective(src, dst):
    """Coefficients for PIL PERSPECTIVE transform mapping output(dst) -> input(src)."""
    A, B = [], []
    for (x, y), (u, v) in zip(dst, src):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); B.append(v)
    return np.linalg.solve(np.array(A, float), np.array(B, float)).tolist()


def rot(p, ry, rx, rz):
    x, y, z = p
    # Y
    c, s = math.cos(ry), math.sin(ry); x, z = x * c + z * s, -x * s + z * c
    # X
    c, s = math.cos(rx), math.sin(rx); y, z = y * c - z * s, y * s + z * c
    # Z
    c, s = math.cos(rz), math.sin(rz); x, y = x * c - y * s, x * s + y * c
    return x, y, z


def project(p, f, cx, cy):
    x, y, z = p
    k = f / (f + z)
    return cx + x * k, cy + y * k


def tilted_phone(front: Image.Image, ry=-0.36, rx=0.1, rz=-0.2) -> Image.Image:
    fw, fh = front.size
    CW, CH = 1700, 2300
    cx, cy, f = CW / 2, CH / 2 - 40, 4200
    T = 6.6 * PX  # thickness in px
    hw, hh = fw / 2, fh / 2
    corners = [(-hw, -hh, 0), (hw, -hh, 0), (hw, hh, 0), (-hw, hh, 0)]
    front_q = [project(rot(c, ry, rx, rz), f, cx, cy) for c in corners]
    back_q = [project(rot((c[0], c[1], T), ry, rx, rz), f, cx, cy) for c in corners]
    src = [(0, 0), (fw, 0), (fw, fh), (0, fh)]

    def warp(im, quad):
        coeffs = solve_perspective(src, quad)
        return im.transform((CW, CH), Image.PERSPECTIVE, coeffs, Image.BICUBIC)

    canvas = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))

    # soft shadow
    sil = warp(front, back_q).split()[3]
    shadow = Image.new("RGBA", (CW, CH), (10, 12, 20, 0))
    shadow.putalpha(sil.point(lambda a: int(a * 0.42)))
    shadow = shadow.transform((CW, CH), Image.AFFINE, (1, 0, -60, 0, 1, -70), Image.BICUBIC).filter(ImageFilter.GaussianBlur(55))
    canvas.alpha_composite(shadow)

    # extruded titanium side: stack silhouettes from back to front
    steps = 26
    for i in range(steps, 0, -1):
        t = i / steps
        quad = [(fx + (bx - fx) * t, fy + (by - fy) * t) for (fx, fy), (bx, by) in zip(front_q, back_q)]
        layer_alpha = warp(front, quad).split()[3]
        shade = int(52 + 70 * (1 - abs(t - 0.5) * 2))  # brighter mid-band like a polished edge
        side = Image.new("RGBA", (CW, CH), (shade, shade, shade + 4, 0))
        side.putalpha(layer_alpha)
        canvas.alpha_composite(side)

    canvas.alpha_composite(warp(front, front_q))
    bbox = canvas.getbbox()
    pad = 40
    return canvas.crop((max(bbox[0] - pad, 0), max(bbox[1] - pad, 0), min(bbox[2] + pad, CW), min(bbox[3] + pad, CH)))


def main():
    shots = json.load(open(os.path.join(ROOT, "data", "shots.json"), encoding="utf8"))
    lite = json.load(open(os.path.join(ROOT, "data", "projects-lite.json"), encoding="utf8"))
    manifest = {}
    for slug, meta in lite.items():
        files = shots.get(slug, [])
        screens = [Image.open(os.path.join(ROOT, "public", f.lstrip("/"))) for f in files] or [placeholder_screen(meta["name"], meta["accent"])]
        fronts = []
        for i, sc in enumerate(screens):
            fr = front_phone(sc)
            name = f"{slug}-front-{i + 1}.webp"
            fr.save(os.path.join(OUT, name), "WEBP", quality=88, method=6)
            fronts.append(f"/mockups/{name}")
            if i == 0:
                tilt = tilted_phone(fr)
                tilt.thumbnail((900, 1200), Image.LANCZOS)
                tilt.save(os.path.join(OUT, f"{slug}-tilt.webp"), "WEBP", quality=88, method=6)
                small = fr.copy(); small.thumbnail((360, 760), Image.LANCZOS)
                small.save(os.path.join(OUT, f"{slug}-front-sm.webp"), "WEBP", quality=88, method=6)
        manifest[slug] = {"front": fronts, "frontSm": f"/mockups/{slug}-front-sm.webp", "tilt": f"/mockups/{slug}-tilt.webp", "real": bool(files)}
        print("ok", slug, len(fronts))
    json.dump(manifest, open(os.path.join(ROOT, "data", "mockups.json"), "w", encoding="utf8"), indent=1)


if __name__ == "__main__":
    main()
