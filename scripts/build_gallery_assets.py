#!/usr/bin/env python3
"""
Genera miniaturas WebP y JPEG con marca de agua para la galería.

  pip install -r scripts/requirements-gallery.txt
  python scripts/build_gallery_assets.py --root . --folders fechas ensayos sesiones

Por cada foto NNN.* (jpg/jpeg), escribe en la misma carpeta:
  - NNN.webp  (miniatura, sin marca)
  - NNN.jpg   (calidad alta, texto @hatemecha abajo-derecha)

Si existe NNN.JPG y NNN.jpg, se prefiere NNN.JPG como fuente. Tras generar,
con --replace-sources se elimina el archivo fuente si su nombre difiere del
destino JPEG (p. ej. borra NNN.JPG al haber escrito NNN.jpg).
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

NUMERIC_STEM = re.compile(r"^(\d{3})$", re.IGNORECASE)

WATERMARK_TEXT = "@hatemecha"
THUMB_MAX_SIDE = 720
WEBP_QUALITY = 82
JPEG_QUALITY = 92
WATERMARK_OPACITY = 70  # 0-255 (~27%)


def _pick_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "C:\\Windows\\Fonts\\segoeui.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/TTF/DejaVuSans.ttf",
    ]
    for path in candidates:
        p = Path(path)
        if p.is_file():
            try:
                return ImageFont.truetype(str(p), size=size)
            except OSError:
                continue
    return ImageFont.load_default()


def add_watermark_bottom_right(img: Image.Image, text: str = WATERMARK_TEXT) -> Image.Image:
    img = img.convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    min_side = min(img.size)
    margin = max(10, int(min_side * 0.015))
    font_size = max(16, int(min_side * 0.022))
    font = _pick_font(font_size)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = img.width - tw - margin
    y = img.height - th - margin
    draw.text((x, y), text, font=font, fill=(255, 255, 255, WATERMARK_OPACITY))
    out = Image.alpha_composite(img, overlay)
    return out.convert("RGB")


def make_thumbnail(img: Image.Image, max_side: int) -> Image.Image:
    img = img.convert("RGB")
    w, h = img.size
    scale = min(max_side / w, max_side / h, 1.0)
    if scale < 1.0:
        nw, nh = int(w * scale), int(h * scale)
        img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    return img


def resolve_source(folder: Path, stem: str, *, force: bool) -> Path | None:
    """Prefiere NNN.JPG (original); NNN.jpg solo si aún no hay par webp+jpg o --force."""
    stem = stem.zfill(3)
    upper = folder / f"{stem}.JPG"
    lower = folder / f"{stem}.jpg"
    dest_webp = folder / f"{stem}.webp"
    dest_jpg = folder / f"{stem}.jpg"

    if upper.is_file():
        return upper
    if lower.is_file():
        if dest_webp.is_file() and dest_jpg.is_file() and not force:
            return None
        return lower
    for ext in (".jpeg", ".JPEG"):
        p = folder / f"{stem}{ext}"
        if p.is_file():
            return p
    return None


def iter_stems(folder: Path) -> set[str]:
    stems: set[str] = set()
    for p in folder.iterdir():
        if not p.is_file():
            continue
        if not NUMERIC_STEM.match(p.stem):
            continue
        if p.suffix.lower() not in (".jpg", ".jpeg"):
            continue
        stems.add(p.stem.zfill(3))
    return stems


def process_one(
    source: Path,
    dest_dir: Path,
    *,
    replace_sources: bool,
) -> tuple[Path, Path]:
    stem = source.stem.zfill(3)
    dest_jpg = dest_dir / f"{stem}.jpg"
    dest_webp = dest_dir / f"{stem}.webp"

    img = Image.open(source)
    thumb = make_thumbnail(img, THUMB_MAX_SIDE)
    thumb.save(dest_webp, format="WEBP", quality=WEBP_QUALITY, method=6)

    full_wm = add_watermark_bottom_right(img)
    full_wm.save(dest_jpg, format="JPEG", quality=JPEG_QUALITY, optimize=True)

    if replace_sources and source.resolve() != dest_jpg.resolve():
        try:
            source.unlink()
        except OSError:
            pass

    return dest_webp, dest_jpg


def main() -> int:
    ap = argparse.ArgumentParser(description="Build WebP thumbs + watermarked JPEGs for gallery.")
    ap.add_argument(
        "--root",
        type=Path,
        default=Path(__file__).resolve().parent.parent,
        help="Raíz del repo (por defecto: padre de scripts/).",
    )
    ap.add_argument(
        "--folders",
        nargs="+",
        default=["fechas", "ensayos", "sesiones"],
        help="Subcarpetas bajo img/ a procesar.",
    )
    ap.add_argument(
        "--replace-sources",
        action="store_true",
        help="Eliminar el archivo fuente tras generar (p. ej. NNN.JPG).",
    )
    ap.add_argument(
        "--force",
        action="store_true",
        help="Volver a generar aunque ya existan NNN.webp y NNN.jpg (p. ej. tras editar marca).",
    )
    args = ap.parse_args()
    root: Path = args.root
    img_root = root / "img"

    if not img_root.is_dir():
        print(f"No existe {img_root}", file=sys.stderr)
        return 1

    for name in args.folders:
        folder = img_root / name
        if not folder.is_dir():
            print(f"Omitido (no existe): {folder}")
            continue
        stems = iter_stems(folder)
        if not stems:
            print(f"Sin JPG numerados en: {folder}")
            continue
        for stem in sorted(stems):
            src = resolve_source(folder, stem, force=args.force)
            if src is None:
                continue
            try:
                webp, jpg = process_one(src, folder, replace_sources=args.replace_sources)
                print(f"OK {name}/{webp.name} + {jpg.name} <- {src.name}")
            except Exception as e:
                print(f"ERROR {name}/{src.name}: {e}", file=sys.stderr)
                return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
