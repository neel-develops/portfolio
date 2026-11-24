"""
Build the chrome ID card faces from the template image.

  python scripts/make-id-card.py <template.webp> <photo.png>

- splits the template into front/back, removes the cream background
- erases the sample text on the front (our own text is laid over in HTML)
- puts the photo into the front's photo slot (exact slot shape)
- saves public/idcard-front.webp and public/idcard-back.webp
- prints the photo-slot / text-panel boxes as percentages for the CSS
"""
import sys
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFilter

tpl = Image.open(sys.argv[1]).convert("RGB")
photo = Image.open(sys.argv[2]).convert("RGB")
A = np.asarray(tpl).astype(int)
BG = A[:15, :15].reshape(-1, 3).mean(0)


def cutout(img: Image.Image) -> Image.Image:
    """Exact silhouette: the cream backdrop plus the smooth grey drop shadow that touches it are
    background; the chrome rim (busy, high-contrast) stops the flood."""
    a = np.asarray(img).astype(np.float32)
    rgb8 = np.asarray(img).astype(np.uint8)
    diff = np.abs(a - BG).max(2)
    gray = cv2.cvtColor(rgb8, cv2.COLOR_RGB2GRAY).astype(np.float32)
    sat = cv2.cvtColor(rgb8, cv2.COLOR_RGB2HSV)[..., 1]
    mean = cv2.blur(gray, (7, 7))
    std = np.sqrt(np.maximum(cv2.blur(gray * gray, (7, 7)) - mean * mean, 0))
    warmth = a[..., 0] - a[..., 2]
    backdrop = diff < 16
    warm_shadow = (warmth > 4) & (diff < 110)
    soft_shadow = (std < 6) & (sat < 32) & (warmth > -3) & (gray > 80)
    passable = (backdrop | warm_shadow | soft_shadow).astype(np.uint8)
    n, lab = cv2.connectedComponents(passable, connectivity=8)
    H, W = passable.shape
    border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    bg = np.isin(lab, border[border > 0])
    fg = (~bg).astype(np.uint8)
    n, lab2, st, _ = cv2.connectedComponentsWithStats(fg, 8)
    fg = (lab2 == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
    cnts, _ = cv2.findContours(fg, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    solid = np.zeros_like(fg)
    cv2.drawContours(solid, cnts, -1, 1, thickness=cv2.FILLED)
    solid = cv2.morphologyEx(solid, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
    # peel the soft grey shadow fringe: boundary pixels that are smooth, neutral-warm and mid-grey
    std15 = np.sqrt(np.maximum(cv2.blur(gray * gray, (5, 5)) - cv2.blur(gray, (5, 5)) ** 2, 0))
    peelable = (sat < 34) & (warmth > -4) & (std15 < 9) & (gray > 85) & (gray < 246)
    for _ in range(14):
        edge = solid & (cv2.erode(solid, np.ones((3, 3), np.uint8)) == 0)
        rm = (edge == 1) & peelable
        if not rm.any():
            break
        solid[rm] = 0
    solid = cv2.morphologyEx(solid, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    # smooth the contour (removes 1-2 px jaggies) then feather
    solid = (cv2.GaussianBlur(solid.astype(np.float32), (0, 0), 2.2) > 0.5).astype(np.uint8)
    alpha = cv2.GaussianBlur(solid.astype(np.float32) * 255, (0, 0), 0.9)
    out = img.convert("RGBA")
    out.putalpha(Image.fromarray(np.clip(alpha, 0, 255).astype(np.uint8), "L"))
    return out


def crop_card(y0, y1):
    part = tpl.crop((0, y0, tpl.width, y1))
    cut = cutout(part)
    # tight box on the solid card (ignore the faint shadow)
    solid = np.asarray(cut)[..., 3] > 200
    ys, xs = np.nonzero(solid)
    box = (xs.min() - 6, ys.min() - 6, xs.max() + 7, ys.max() + 7)
    return part, cut.crop(box), box


front_rgb, front, fbox = crop_card(60, 790)
back_rgb, back, bbox = crop_card(790, tpl.height)
FW, FH = front.size
print("front", front.size, "back", back.size)

# ---- erase the sample text on the front (dark, low-saturation pixels inside the panels)
rgb = np.asarray(front)[..., :3].copy()
alpha = np.asarray(front)[..., 3]
hsv = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2HSV)
dark = (hsv[..., 2] < 140) & (hsv[..., 1] < 110)


def pct_box(x0, y0, x1, y1):
    return int(x0 * FW), int(y0 * FH), int(x1 * FW), int(y1 * FH)


# sample text sits in two known boxes (fractions of the cropped front); fill its pixels with a
# normalised-convolution estimate of the surrounding brushed metal so the gradient is preserved
# sample-text boxes measured on the 1024x1536 template (x0, y0, x1, y1)
TEXT_BOXES_T = [(150, 268, 512, 628), (650, 601, 868, 657)]
PILL_SEED_T = (760, 676)
SWOOSH_T = (425, 336, 600, 414)
def tbox(x0, y0, x1, y1):
    ox, oy = fbox[0], fbox[1] + 60
    return max(0, x0 - ox), max(0, y0 - oy), x1 - ox, y1 - oy
_g = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2GRAY)
faint = cv2.morphologyEx(_g, cv2.MORPH_BLACKHAT, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))) > 10  # thin strokes/rules
faint &= hsv[..., 1] < 45  # never the blue chrome
textmask = np.zeros((FH, FW), bool)
masks = []
for i, bx in enumerate(TEXT_BOXES_T):
    x0, y0, x1, y1 = tbox(*bx)
    m = np.zeros((FH, FW), bool)
    # the left panel also has faint rules; the pill only has crisp dark text
    m[y0:y1, x0:x1] = ((dark | faint) if i == 0 else (hsv[..., 2] < 120))[y0:y1, x0:x1]
    masks.append(cv2.dilate(m.astype(np.uint8), np.ones((5, 5), np.uint8), iterations=2) > 0)
fill = masks[0] | masks[1]
sx0, sy0, sx1, sy1 = tbox(*SWOOSH_T)
fill[sy0:sy1, sx0:sx1] = False  # leave the blue chrome swoosh tip alone
src = rgb.astype(np.float64)
bad = fill | dark | faint
fill_left, fill_pill = masks[0] & fill, masks[1]

# left panel: normalised convolution from clean metal only (big smooth area)
w = (~bad).astype(np.float64)
est = np.zeros_like(src)
for sig in (6, 14, 30, 60, 120):
    num = np.dstack([cv2.GaussianBlur(src[..., c] * w, (0, 0), sig) for c in range(3)])
    den = cv2.GaussianBlur(w, (0, 0), sig)[..., None]
    e = num / np.maximum(den, 1e-6)
    est = np.where((den > 0.02) & (est.sum(2, keepdims=True) == 0), e, est)
est = np.where(est.sum(2, keepdims=True) == 0, np.median(src[~bad], axis=0), est)
clean = src.copy()
clean[fill_left] = est[fill_left]

# pill: same idea but the estimate only draws from the pill's own light metal (not the chrome around it)
g8 = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2GRAY)
lightm = ((g8 > 128) & (hsv[..., 1] < 34)).astype(np.uint8)
bx0, by0, bx1, by1 = tbox(600, 578, 900, 705)
lightm[:by0] = 0; lightm[by1:] = 0; lightm[:, :bx0] = 0; lightm[:, bx1:] = 0
lightm[cv2.dilate(fill_pill.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0] = 1
n, lab = cv2.connectedComponents(lightm, connectivity=8)
sx, sy, _, _ = tbox(*PILL_SEED_T, 0, 0)
pill_dom = lab == lab[sy, sx]
pill_closed = cv2.morphologyEx(pill_dom.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8)) > 0
pill_closed = cv2.erode(pill_closed.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0
fill_pill &= pill_closed  # never touch the chrome rim around the pill
pill_dom = cv2.erode(pill_dom.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
# repaint the whole pill interior with a smooth surface fitted to its clean metal, feathered into the rim
fitpx = pill_dom & ~bad
yy, xx = np.mgrid[0:FH, 0:FW].astype(np.float64)
def design(m):
    x, y = xx[m] / FW, yy[m] / FH
    return np.stack([np.ones_like(x), x, y, x * x, y * y, x * y, x ** 3, y ** 3], 1)
inside = cv2.erode(pill_closed.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
Xf, Xi = design(fitpx), design(inside)
surf = np.zeros((inside.sum(), 3))
for c in range(3):
    coef, *_ = np.linalg.lstsq(Xf, src[..., c][fitpx], rcond=None)
    surf[:, c] = Xi @ coef
paint = clean.copy()
paint[inside] = surf + np.random.default_rng(5).normal(0, 1.6, surf.shape)
feather = cv2.GaussianBlur(inside.astype(np.float64), (0, 0), 2.5)[..., None]
clean = clean * (1 - feather) + paint * feather
fill_pill = np.zeros_like(fill_pill)  # already handled

region = cv2.dilate(fill_left.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
rng = np.random.default_rng(3)
clean[region] += rng.normal(0, 1.3, (region.sum(), 3))
soft = np.maximum(cv2.GaussianBlur(region.astype(np.float64), (0, 0), 1.2)[..., None], feather)
clean = np.clip(src * (1 - soft) + clean * soft, 0, 255).astype(np.uint8)
print("refilled px", int(fill.sum()))
front = Image.fromarray(np.dstack([clean, alpha]), "RGBA")

# ---- find the photo slot: flat light area around its centre
probe = (int(FW * 0.715), int(FH * 0.5))
flat = Image.fromarray(clean).convert("L").filter(ImageFilter.GaussianBlur(2))
slot = flat.copy()
ImageDraw.floodfill(slot, probe, 0, thresh=14)
s = np.array(slot) == 0
ys, xs = np.nonzero(s)
print("slot %%: left %.2f top %.2f width %.2f height %.2f" % (xs.min() / FW * 100, ys.min() / FH * 100, (xs.max() - xs.min()) / FW * 100, (ys.max() - ys.min()) / FH * 100))

# ---- put the photo INTO the slot: exact slot shape, inner shadow, faint glass sheen
# slot shape by ray casting from its centre to the inner edge of the chrome rim
g = cv2.GaussianBlur(cv2.cvtColor(np.asarray(front)[..., :3], cv2.COLOR_RGB2GRAY).astype(np.float64), (0, 0), 1.2)
ys0, xs0 = np.nonzero(s)
cx, cy = xs0.mean(), ys0.mean()
base = np.median(g[ys0, xs0])
sat_f = cv2.cvtColor(np.asarray(front)[..., :3], cv2.COLOR_RGB2HSV)[..., 1]
angles = np.deg2rad(np.arange(0, 360, 1.0))
radii = []
for t in angles:
    r = 5.0
    while r < 400:
        x, y = int(round(cx + r * np.cos(t))), int(round(cy + r * np.sin(t)))
        if not (0 <= x < FW and 0 <= y < FH) or sat_f[y, x] > 70 or g[y, x] < base - 48 or g[y, x] > base + 38:
            break
        r += 1
    radii.append(r - 2)
radii = np.array(radii)
# smooth the radius profile (circular moving average)
k = 7
radii = np.convolve(np.r_[radii[-k:], radii, radii[:k]], np.ones(2 * k + 1) / (2 * k + 1), mode="same")[k:-k]
poly = np.stack([cx + radii * np.cos(angles), cy + radii * np.sin(angles)], 1).astype(np.int32)
slot_m = np.zeros((FH, FW), np.uint8)
cv2.fillPoly(slot_m, [poly], 1)
ys, xs = np.nonzero(slot_m)
x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
sw, sh = x1 - x0, y1 - y0
pw, ph = photo.size
scale = max(sw / pw, sh / ph)
ph_img = photo.resize((int(pw * scale) + 1, int(ph * scale) + 1), Image.LANCZOS)
ox = (ph_img.width - sw) // 2
oy = int((ph_img.height - sh) * 0.25)  # keep the face high in frame
ph_arr = np.asarray(ph_img).astype(np.float64)[oy:oy + sh, ox:ox + sw]
# inner shadow: darker near the slot edge
inner = cv2.GaussianBlur(slot_m.astype(np.float64), (0, 0), 7)[y0:y1, x0:x1]
shade = 0.72 + 0.28 * np.clip((inner - 0.5) * 2, 0, 1)
ph_arr = ph_arr * shade[..., None]
# soft diagonal glass sheen
gy, gx = np.mgrid[0:sh, 0:sw]
sheen = np.clip(1 - np.abs((gx / sw + gy / sh) - 0.55) * 4, 0, 1) * 18
ph_arr = np.clip(ph_arr + sheen[..., None], 0, 255)
fa = np.asarray(front).astype(np.float64)
m = cv2.GaussianBlur(slot_m.astype(np.float64), (0, 0), 0.8)[y0:y1, x0:x1][..., None]
fa[y0:y1, x0:x1, :3] = fa[y0:y1, x0:x1, :3] * (1 - m) + ph_arr * m
front = Image.fromarray(fa.astype(np.uint8), "RGBA")
print("photo placed in slot", (x0, y0, sw, sh))

front.save("public/idcard-front.webp", "WEBP", quality=92, method=6)
back.save("public/idcard-back.webp", "WEBP", quality=92, method=6)

print("done")
