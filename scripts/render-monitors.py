"""
Premium desktop-monitor visuals (one consistent scene for every project).

  python scripts/render-monitors.py [slug ...]

Reads  review/desk/<slug>.jpg   (desktop screenshots / in-app video frames)
Writes review/visuals/<slug>.webp (2160x1440) and a small .jpg preview
Scene: deep blue studio light, aluminium display with thin black bezel,
tilted in perspective on a dark slatted desk, soft shadow and glass glare.
"""
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "review", "desk")
OUT = os.path.join(ROOT, "review", "visuals")
os.makedirs(OUT, exist_ok=True)

CW, CH = 2160, 1440  # canvas (3:2)
CROP_TOP = {"nostalux": 0.065}  # trim a status/permission bar off the top


def lerp(a, b, t):
    return a + (b - a) * t


def background():
    yy, xx = np.mgrid[0:CH, 0:CW].astype(np.float32)
    x, y = xx / CW, yy / CH
    # electric blue pool of light, centre-right, fading to near-black at the top-left
    d = np.sqrt(((x - 0.62) / 0.75) ** 2 + ((y - 0.62) / 0.8) ** 2)
    t = np.clip(1 - d, 0, 1) ** 1.35
    deep = np.array([4, 6, 18], np.float32)
    blue = np.array([28, 78, 236], np.float32)
    rgb = deep + (blue - deep) * t[..., None]
    # top-left shadow wedge like a studio flag
    flag = np.clip((0.55 - (x * 0.6 + y * 0.9)) * 2.2, 0, 1)
    rgb *= (1 - 0.55 * flag)[..., None]
    rng = np.random.default_rng(1)
    rgb += rng.normal(0, 1.6, rgb.shape)  # fine grain against banding
    return Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB").convert("RGBA")


def rot(p, ry, rx, rz):
    x, y, z = p
    c, s = math.cos(ry), math.sin(ry); x, z = x * c + z * s, -x * s + z * c
    c, s = math.cos(rx), math.sin(rx); y, z = y * c - z * s, y * s + z * c
    c, s = math.cos(rz), math.sin(rz); x, y = x * c - y * s, x * s + y * c
    return x, y, z


def project(p, f, cx, cy):
    x, y, z = p
    k = f / (f + z)
    return cx + x * k, cy + y * k


def solve_perspective(src, dst):
    A, B = [], []
    for (x, y), (u, v) in zip(dst, src):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); B.append(v)
    return np.linalg.solve(np.array(A, float), np.array(B, float)).tolist()


def warp(img, quad):
    w, h = img.size
    coeffs = solve_perspective([(0, 0), (w, 0), (w, h), (0, h)], quad)
    return img.transform((CW, CH), Image.PERSPECTIVE, coeffs, Image.BICUBIC)


def metal(w, h, horizontal=True, stops=None):
    stops = stops or [(0, 150), (0.08, 232), (0.2, 176), (0.5, 205), (0.8, 168), (0.93, 236), (1, 140)]
    n = w if horizontal else h
    xs = np.linspace(0, 1, n)
    v = np.interp(xs, [s[0] for s in stops], [s[1] for s in stops])
    arr = np.tile(v[None, :], (h, 1)) if horizontal else np.tile(v[:, None], (1, w))
    arr = np.dstack([arr, arr, arr * 1.03]) + np.random.default_rng(2).normal(0, 1.4, (h, w, 3))
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB").convert("RGBA")


def monitor_face(screen: Image.Image):
    """Flat front of the display: aluminium edge, black bezel, the screenshot, glass glare."""
    W, H = 1700, 1063  # 16:10 panel incl. frame
    rim, bezel = 14, 30
    face = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    m = Image.new("L", (W, H), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, W - 1, H - 1), radius=34, fill=255)
    alu = metal(W, H, horizontal=False, stops=[(0, 238), (0.04, 196), (0.5, 186), (0.96, 160), (1, 120)])
    face.paste(alu, (0, 0), m)
    inner = Image.new("L", (W, H), 0)
    ImageDraw.Draw(inner).rounded_rectangle((rim, rim, W - 1 - rim, H - 1 - rim), radius=24, fill=255)
    face.paste(Image.new("RGBA", (W, H), (7, 7, 9, 255)), (0, 0), inner)
    sx0, sy0, sx1, sy1 = rim + bezel, rim + bezel, W - rim - bezel, H - rim - bezel
    sw, sh = sx1 - sx0, sy1 - sy0
    # cover-fit the screenshot, anchored to the top
    s = screen.convert("RGB")
    sc = max(sw / s.width, sh / s.height)
    s = s.resize((math.ceil(s.width * sc), math.ceil(s.height * sc)), Image.LANCZOS)
    ox = (s.width - sw) // 2
    s = s.crop((ox, 0, ox + sw, sh))
    face.paste(s, (sx0, sy0))
    # glass: soft diagonal glare + gentle top sheen
    gl = np.zeros((sh, sw), np.float32)
    yy, xx = np.mgrid[0:sh, 0:sw].astype(np.float32)
    band = np.clip(1 - np.abs((xx / sw) * 0.9 + (yy / sh) * 0.55 - 0.42) / 0.12, 0, 1)
    gl += band * 26 + (1 - yy / sh) * 8
    glare = Image.fromarray(np.dstack([np.full((sh, sw), 255, np.uint8)] * 3 + [np.clip(gl, 0, 255).astype(np.uint8)]), "RGBA")
    face.alpha_composite(glare, (sx0, sy0))
    return face


def stand_layer(base_pts):
    """Aluminium neck from under the display down to the desk."""
    layer = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.polygon(base_pts, fill=(150, 152, 160, 255))
    # vertical brushed shading
    shade = metal(CW, CH, horizontal=True, stops=[(0, 120), (0.45, 120), (0.48, 215), (0.52, 170), (0.56, 120), (1, 120)])
    mask = layer.split()[3]
    out = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
    out.paste(shade, (0, 0), mask)
    return out


def desk():
    """Dark slatted surface: bevelled ridges that grow toward the viewer, slightly angled."""
    top = int(CH * 0.79)
    h = CH - top + 160
    w = int(CW * 1.3)
    v = np.linspace(0, 1, h)[:, None]             # 0 = far edge, 1 = nearest
    # stripe phase: frequency falls as we come closer (perspective)
    phase = (v ** 0.55) * 15.0
    fr = phase - np.floor(phase)
    # bevel profile: bright top lip, lit face, dark groove
    lip = np.exp(-((fr - 0.04) / 0.035) ** 2)
    face = np.clip((0.62 - fr) / 0.62, 0, 1)
    groove = (fr > 0.62).astype(np.float32)
    lum = 34 + face * (40 + 48 * v) + lip * (150 + 60 * v) - groove * 18
    lum = np.repeat(lum, w, axis=1)
    # horizontal light falloff (brighter toward the right where the blue light is)
    xs = np.linspace(0, 1, w)[None, :]
    lum *= 0.72 + 0.4 * xs
    rgb = np.dstack([lum * 0.94, lum * 0.96, lum * 1.06])
    tex = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB").convert("RGBA")
    tex = tex.rotate(-4.5, resample=Image.BICUBIC, expand=False)
    layer = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
    layer.alpha_composite(tex, (-(w - CW) // 2, top - 40))
    # soft far edge + darker foreground corners
    yy_, xx_ = np.mgrid[0:CH, 0:CW]
    edge = top - 40 + (xx_ - CW / 2) * np.tan(np.deg2rad(4.5))
    fade = np.clip((yy_ - edge) / 70, 0, 1)
    a = np.array(layer.split()[3]).astype(np.float32) * fade
    layer.putalpha(Image.fromarray(a.astype(np.uint8)))
    vign = np.clip(((xx_ / CW - 0.5) ** 2 * 1.4 + ((yy_ / CH) - 0.8) ** 2 * 2), 0, 1)
    dark = Image.fromarray((vign * 150).astype(np.uint8))
    shade = Image.new("RGBA", (CW, CH), (0, 0, 0, 255)); shade.putalpha(dark)
    return layer, shade


def render(slug):
    src = Image.open(os.path.join(SRC, f"{slug}.jpg")).convert("RGB")
    ct = CROP_TOP.get(slug, 0)
    if ct:
        src = src.crop((0, int(src.height * ct), src.width, src.height))
    face = monitor_face(src)
    fw, fh = face.size

    canvas = background()
    desk_l, desk_shade = desk()
    canvas.alpha_composite(desk_l)

    # pose: seen slightly from below-left, turned away to the right
    ry, rx, rz = 0.30, -0.10, -0.035
    f = 3400
    cx, cy = CW * 0.52, CH * 0.43
    sc = 0.86
    hw, hh = fw / 2 * sc, fh / 2 * sc
    corners = [(-hw, -hh, 0), (hw, -hh, 0), (hw, hh, 0), (-hw, hh, 0)]
    front_q = [project(rot(c, ry, rx, rz), f, cx, cy) for c in corners]
    T = 34
    back_q = [project(rot((c[0], c[1], T), ry, rx, rz), f, cx, cy) for c in corners]

    # stand: from the back of the display down into the desk
    nb = [project(rot(p, ry, rx, rz), f, cx, cy) for p in [(-120, hh * 0.55, 60), (120, hh * 0.55, 60)]]
    foot_y = CH * 0.90
    neck = [nb[0], nb[1], (nb[1][0] + 18, foot_y), (nb[0][0] + 6, foot_y)]
    canvas.alpha_composite(stand_layer(neck))
    # foot plate on the desk with a contact shadow
    fx = (neck[2][0] + neck[3][0]) / 2
    foot = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
    fd = ImageDraw.Draw(foot)
    fd.ellipse((fx - 250, foot_y - 26, fx + 250, foot_y + 40), fill=(0, 0, 0, 150))
    foot = foot.filter(ImageFilter.GaussianBlur(18))
    canvas.alpha_composite(foot)
    plate = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
    ImageDraw.Draw(plate).rounded_rectangle((fx - 210, foot_y - 12, fx + 210, foot_y + 16), radius=14, fill=(178, 180, 188, 255))
    ImageDraw.Draw(plate).rounded_rectangle((fx - 210, foot_y - 12, fx + 210, foot_y - 6), radius=6, fill=(232, 234, 240, 255))
    canvas.alpha_composite(plate)

    # soft shadow of the display on the backdrop
    sil = warp(face, back_q).split()[3]
    sh = Image.new("RGBA", (CW, CH), (0, 0, 10, 0))
    sh.putalpha(sil.point(lambda v: int(v * 0.55)))
    sh = sh.transform((CW, CH), Image.AFFINE, (1, 0, -40, 0, 1, -50), Image.BICUBIC).filter(ImageFilter.GaussianBlur(60))
    canvas.alpha_composite(sh)

    # aluminium thickness (extrude back → front)
    steps = 18
    for i in range(steps, 0, -1):
        t = i / steps
        q = [(fx + (bx - fx) * t, fy + (by - fy) * t) for (fx, fy), (bx, by) in zip(front_q, back_q)]
        a = warp(face, q).split()[3]
        v = int(110 + 90 * (1 - abs(t - 0.4) * 1.6))
        side = Image.new("RGBA", (CW, CH), (v, v, v + 6, 0))
        side.putalpha(a)
        canvas.alpha_composite(side)
    canvas.alpha_composite(warp(face, front_q))

    canvas.alpha_composite(desk_shade)
    canvas = canvas.convert("RGB")
    canvas.save(os.path.join(OUT, f"{slug}.webp"), "WEBP", quality=90, method=6)
    pv = canvas.copy(); pv.thumbnail((960, 640)); pv.save(os.path.join(OUT, f"{slug}-preview.jpg"), quality=82)
    print("ok", slug)


if __name__ == "__main__":
    slugs = sys.argv[1:] or sorted(os.path.splitext(f)[0] for f in os.listdir(SRC) if f.endswith(".jpg"))
    for s in slugs:
        render(s)
