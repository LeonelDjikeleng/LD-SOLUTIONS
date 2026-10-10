# Assemble des morceaux côte à côte. Usage : python3 tests/qa/montage.py sortie.png a.png b.png ...
import sys
from PIL import Image
ims = [Image.open(f) for f in sys.argv[2:]]
h = max(i.height for i in ims); w = sum(i.width for i in ims) + 10 * (len(ims) - 1)
m = Image.new("RGB", (w, h), (200, 200, 200)); x = 0
for i in ims: m.paste(i, (x, 0)); x += i.width + 10
m.save(sys.argv[1])
