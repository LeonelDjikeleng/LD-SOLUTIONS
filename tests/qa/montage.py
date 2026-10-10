# Assemble des morceaux côte à côte. Usage : python3 tests/qa/montage.py sortie.png a.png b.png ...
import sys
from PIL import Image
ims = [Image.open(f) for f in sys.argv[2:]]
# Captures en haute densité : ramenées à 844 px de haut pour la planche contact
ims = [i.resize((round(i.width * 844 / i.height), 844), Image.LANCZOS) if i.height > 844 else i for i in ims]
h = max(i.height for i in ims); w = sum(i.width for i in ims) + 10 * (len(ims) - 1)
m = Image.new("RGB", (w, h), (200, 200, 200)); x = 0
for i in ims: m.paste(i, (x, 0)); x += i.width + 10
m.save(sys.argv[1])
