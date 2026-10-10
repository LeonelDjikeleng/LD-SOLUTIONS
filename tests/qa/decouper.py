# Découpe une capture pleine page en morceaux lisibles. Usage : python3 tests/qa/decouper.py <image> <hauteur> <echelle>
import sys
from PIL import Image
src, h, ech = sys.argv[1], int(sys.argv[2]), float(sys.argv[3])
im = Image.open(src)
w, H = im.size
n = 0
for y in range(0, H, h):
    part = im.crop((0, y, w, min(H, y + h)))
    if ech != 1: part = part.resize((int(part.width * ech), int(part.height * ech)))
    out = src.replace(".png", f"-p{n}.png"); part.save(out); print(out); n += 1
