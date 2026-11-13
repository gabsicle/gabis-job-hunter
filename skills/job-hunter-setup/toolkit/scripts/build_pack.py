#!/usr/bin/env python3
"""Build a single application PDF under a size cap.

  python3 build_pack.py OUT.pdf --max-mb 5 cover_letter.pdf cv.pdf certificates1.pdf certificates2.pdf ...

- Pages whose own content (content streams + images) exceed --heavy-kb (default 150 KB)
  are rasterised at --dpi (default 150) and re-encoded as JPEG (quality --q, default 72);
  light pages stay vector (sharp text, searchable).
- Use --gray to convert rasterised pages to grayscale (good for scanned letters).
- The first two inputs (letter, CV) are never rasterised.
- Prints final size and warns if above --max-mb.
Needs: pikepdf, img2pdf, Pillow, poppler-utils (pdftoppm).
"""
import argparse, io, os, subprocess, tempfile
import pikepdf, img2pdf
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument('out'); ap.add_argument('inputs', nargs='+')
ap.add_argument('--max-mb', type=float, default=5.0)
ap.add_argument('--heavy-kb', type=int, default=150)
ap.add_argument('--dpi', type=int, default=150)
ap.add_argument('--q', type=int, default=72)
ap.add_argument('--gray', action='store_true')
a = ap.parse_args()

def page_bytes(p):
    seen, tot = set(), 0
    c = p.obj.get('/Contents')
    if c is not None:
        tot += sum(len(x.read_raw_bytes()) for x in (c if isinstance(c, pikepdf.Array) else [c]))
    def walk(res):
        nonlocal tot
        if res is None: return
        xo = res.get('/XObject')
        if xo:
            for _, v in xo.items():
                if v.objgen in seen: continue
                seen.add(v.objgen); tot += len(v.read_raw_bytes())
                if v.get('/Subtype') == '/Form': walk(v.get('/Resources'))
    walk(p.get('/Resources'))
    return tot

out = pikepdf.new()
tmp = tempfile.mkdtemp()
for idx, path in enumerate(a.inputs):
    src = pikepdf.open(path)
    for i, p in enumerate(src.pages, 1):
        if idx >= 2 and page_bytes(p) > a.heavy_kb * 1024:
            base = os.path.join(tmp, f'p{idx}_{i}')
            subprocess.run(['pdftoppm', '-r', str(a.dpi), '-f', str(i), '-l', str(i), '-singlefile', '-png', path, base], check=True)
            im = Image.open(base + '.png'); im = im.convert('L' if a.gray else 'RGB')
            buf = io.BytesIO(); im.save(buf, 'JPEG', quality=a.q, optimize=True)
            mb = p.mediabox; w = float(mb[2]) - float(mb[0]); h = float(mb[3]) - float(mb[1])
            pg = pikepdf.open(io.BytesIO(img2pdf.convert(buf.getvalue(), layout_fun=img2pdf.get_layout_fun((w, h)))))
            out.pages.append(pg.pages[0])
        else:
            out.pages.append(p)
out.save(a.out, compress_streams=True, object_stream_mode=pikepdf.ObjectStreamMode.generate)
mb = os.path.getsize(a.out) / 1e6
print(f'{a.out}: {len(out.pages)} pages, {mb:.2f} MB' + ('  <-- ABOVE CAP: lower --dpi/--q or add --gray' if mb > a.max_mb else ''))
