#!/usr/bin/env python3
"""Post-process the AI-edited JOBSONN logo:
1. Trim black margins
2. Flood-fill border-connected black -> transparent
3. Remove enclosed pure-black regions (letter counters)
4. Feather edges slightly for clean anti-aliasing on any surface
"""
from PIL import Image, ImageDraw, ImageFilter
from collections import deque

img = Image.open("/tmp/jobsonn_edit_raw.png").convert("RGB")
W, H = img.size
px = img.load()

def lum_max(p):
    return max(p[0], p[1], p[2])

# --- 1. trim: find bbox of non-near-black pixels ---
thr_trim = 16
minx, miny, maxx, maxy = W, H, 0, 0
for y in range(H):
    for x in range(W):
        if lum_max(px[x, y]) > thr_trim:
            if x < minx: minx = x
            if x > maxx: maxx = x
            if y < miny: miny = y
            if y > maxy: maxy = y
pad = 6
minx = max(0, minx - pad); miny = max(0, miny - pad)
maxx = min(W - 1, maxx + pad); maxy = min(H - 1, maxy + pad)
img = img.crop((minx, miny, maxx + 1, maxy + 1))
W, H = img.size
px = img.load()
print("trimmed:", img.size)

# --- 2. flood fill from border: connected near-black -> mark for removal ---
thr_fill = 30
visited = [[False] * W for _ in range(H)]
q = deque()
for x in range(W):
    for y in (0, H - 1):
        if lum_max(px[x, y]) < thr_fill and not visited[y][x]:
            visited[y][x] = True; q.append((x, y))
for y in range(H):
    for x in (0, W - 1):
        if lum_max(px[x, y]) < thr_fill and not visited[y][x]:
            visited[y][x] = True; q.append((x, y))
while q:
    x, y = q.popleft()
    for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
        nx, ny = x + dx, y + dy
        if 0 <= nx < W and 0 <= ny < H and not visited[ny][nx]:
            if lum_max(px[nx, ny]) < thr_fill:
                visited[ny][nx] = True
                q.append((nx, ny))

# --- 3. any remaining near-pure-black pixel anywhere -> also transparent ---
pure_thr = 10
rgba = Image.new("RGBA", (W, H))
rpx = rgba.load()
removed = 0
for y in range(H):
    for x in range(W):
        r, g, b = px[x, y]
        if visited[y][x] or lum_max((r, g, b)) < pure_thr:
            rpx[x, y] = (r, g, b, 0)
            removed += 1
        else:
            # soft alpha for very dark edge pixels to avoid hard black halo
            m = lum_max((r, g, b))
            a = 255
            if m < 40:
                # ramp alpha from 60 at m=10 to 255 at m=40
                a = int(60 + (m - 10) * (255 - 60) / 30)
                a = max(60, min(255, a))
            rpx[x, y] = (r, g, b, a)
print("transparent px:", removed, "of", W * H)

# slight alpha smoothing on edges
alpha = rgba.split()[3].filter(ImageFilter.GaussianBlur(0.6))
rgba.putalpha(alpha)

rgba.save("/tmp/jobsonn_clean.png")
print("saved /tmp/jobsonn_clean.png", rgba.size)

# previews on white and dark
prev_w = Image.new("RGB", (W + 40, H + 40), (255, 255, 255))
prev_w.paste(rgba, (20, 20), rgba)
prev_w.save("/tmp/preview_white.png")
prev_d = Image.new("RGB", (W + 40, H + 40), (13, 15, 20))
prev_d.paste(rgba, (20, 20), rgba)
prev_d.save("/tmp/preview_dark.png")
print("previews saved")
