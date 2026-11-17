#!/usr/bin/env python3
"""Remove the thin black keyline the AI render left around the logo:
iteratively make near-dark pixels transparent when adjacent to transparency.
Interior dark shades are preserved (never adjacent to outer transparency).
"""
from PIL import Image, ImageFilter

rgba = Image.open("/tmp/jobsonn_clean.png").convert("RGBA")
W, H = rgba.size
px = rgba.load()

def lum_max(p):
    return max(p[0], p[1], p[2])

DARK = 95          # max channel below this counts as "dark edge"
PASSES = 4         # grow transparency up to 4px into dark rim

for it in range(PASSES):
    to_clear = []
    for y in range(H):
        for x in range(W):
            p = px[x, y]
            if p[3] == 0:
                continue
            if lum_max(p) >= DARK:
                continue
            # check 4-neighbors (and diagonals) for transparency
            near_trans = False
            for dx, dy in ((1,0),(-1,0),(0,1),(0,-1),(1,1),(1,-1),(-1,1),(-1,-1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < W and 0 <= ny < H and px[nx, ny][3] < 40:
                    near_trans = True
                    break
            if near_trans:
                to_clear.append((x, y))
    if not to_clear:
        print(f"pass {it}: nothing to clear, stop")
        break
    for x, y in to_clear:
        r, g, b, _ = px[x, y]
        px[x, y] = (r, g, b, 0)
    print(f"pass {it}: cleared {len(to_clear)} px")

# smooth alpha edges
alpha = rgba.split()[3].filter(ImageFilter.GaussianBlur(0.5))
rgba.putalpha(alpha)

# trim to final bbox
bbox = rgba.getbbox()
rgba = rgba.crop(bbox)
print("final size:", rgba.size)
rgba.save("/tmp/jobsonn_final.png")

prev_w = Image.new("RGB", (rgba.size[0] + 40, rgba.size[1] + 40), (255, 255, 255))
prev_w.paste(rgba, (20, 20), rgba)
prev_w.save("/tmp/preview_white2.png")
prev_d = Image.new("RGB", (rgba.size[0] + 40, rgba.size[1] + 40), (13, 15, 20))
prev_d.paste(rgba, (20, 20), rgba)
prev_d.save("/tmp/preview_dark2.png")
print("saved previews")
