from __future__ import annotations

from pathlib import Path
from typing import Sequence

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(r"E:\guard")
OUTDIR = ROOT / "public" / "og"
ICON_PATH = ROOT / "public" / "android-chrome-512x512.png"

WIDTH = 1200
HEIGHT = 630

FONT_REGULAR = Path(r"C:\Windows\Fonts\segoeui.ttf")
FONT_SEMIBOLD = Path(r"C:\Windows\Fonts\seguisb.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\segoeuib.ttf")


def load_font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size)


def rounded_rect(draw: ImageDraw.ImageDraw, box, radius: int, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def text_width(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont) -> float:
    if not text:
        return 0
    return draw.textbbox((0, 0), text, font=font)[2]


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if text_width(draw, candidate, font) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_multiline(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    lines: Sequence[str],
    font: ImageFont.FreeTypeFont,
    fill,
    line_gap: int,
):
    x, y = xy
    for line in lines:
        draw.text((x, y), line, font=font, fill=fill)
        y += font.size + line_gap


def add_background_glow(image: Image.Image, color: tuple[int, int, int, int], center: tuple[int, int], radius: int):
    glow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    x, y = center
    gdraw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=color)
    glow = glow.filter(ImageFilter.GaussianBlur(radius=90))
    image.alpha_composite(glow)


def add_dot_grid(draw: ImageDraw.ImageDraw, bounds: tuple[int, int, int, int], color, step: int = 24, size: int = 2):
    left, top, right, bottom = bounds
    for y in range(top, bottom, step):
        for x in range(left, right, step):
            draw.rectangle((x, y, x + size, y + size), fill=color)


def paste_icon(base: Image.Image, box: tuple[int, int, int, int]) -> None:
    icon = Image.open(ICON_PATH).convert("RGBA")
    icon.thumbnail((box[2] - box[0], box[3] - box[1]), Image.LANCZOS)
    x = box[0] + ((box[2] - box[0]) - icon.width) // 2
    y = box[1] + ((box[3] - box[1]) - icon.height) // 2
    base.alpha_composite(icon, (x, y))


def build_image(
    outfile: Path,
    *,
    page_pill: str,
    title: str,
    subtitle: str,
    right_heading: str,
    right_lines: Sequence[str],
    bg_top: tuple[int, int, int],
    bg_bottom: tuple[int, int, int],
    dot_color: tuple[int, int, int, int],
    shell_tint: tuple[int, int, int, int],
    inner_tint: tuple[int, int, int, int],
    accent: tuple[int, int, int],
    glow_a: tuple[int, int, int, int],
    glow_b: tuple[int, int, int, int],
) -> None:
    image = Image.new("RGBA", (WIDTH, HEIGHT), bg_top + (255,))
    draw = ImageDraw.Draw(image)

    # vertical gradient
    for y in range(HEIGHT):
        t = y / max(HEIGHT - 1, 1)
        row = tuple(int(bg_top[i] * (1 - t) + bg_bottom[i] * t) for i in range(3))
        draw.line((0, y, WIDTH, y), fill=row + (255,))

    add_background_glow(image, glow_a, (240, 520), 220)
    add_background_glow(image, glow_b, (1020, 500), 220)

    draw = ImageDraw.Draw(image)
    add_dot_grid(draw, (0, 0, WIDTH, HEIGHT), dot_color, step=24, size=2)

    shell_box = (68, 68, WIDTH - 68, HEIGHT - 68)
    rounded_rect(draw, shell_box, 40, fill=shell_tint, outline=(255, 255, 255, 140), width=2)

    inner_box = (118, 142, WIDTH - 118, HEIGHT - 118)
    rounded_rect(draw, inner_box, 34, fill=inner_tint, outline=(255, 255, 255, 70), width=1)
    add_dot_grid(draw, inner_box, (255, 255, 255, 160), step=24, size=2)

    # pills
    pill_font = load_font(FONT_BOLD, 26)
    small_font = load_font(FONT_REGULAR, 18)
    semibold_26 = load_font(FONT_SEMIBOLD, 26)
    title_font = load_font(FONT_BOLD, 88)
    subtitle_font = load_font(FONT_REGULAR, 29)
    domain_font = load_font(FONT_BOLD, 24)
    right_title_font = load_font(FONT_BOLD, 42)
    right_body_font = load_font(FONT_REGULAR, 22)

    page_pill_box = (358, 150, 622, 206)
    rounded_rect(draw, page_pill_box, 28, fill=(255, 255, 255, 255))
    draw.text((390, 161), page_pill, font=pill_font, fill=accent + (255,))

    shield_pill_box = (900, 150, 1048, 206)
    rounded_rect(draw, shield_pill_box, 28, fill=(255, 255, 255, 255))
    draw.text((928, 166), "Shielded", font=semibold_26, fill=accent + (255,))

    paste_icon(image, (138, 178, 316, 392))

    # left/main text column
    title_x = 360
    title_y = 246
    draw.text((title_x, title_y), title, font=title_font, fill=(17, 33, 61, 255))

    subtitle_width = 470
    subtitle_lines = wrap_text(draw, subtitle, subtitle_font, subtitle_width)
    draw_multiline(
        draw,
        (title_x, 382),
        subtitle_lines,
        subtitle_font,
        accent + (230,),
        line_gap=8,
    )

    draw.text((120, 96), "aegis.d-international.eu", font=domain_font, fill=accent + (230,))

    # right info card
    info_box = (850, 238, 1056, 470)
    rounded_rect(draw, info_box, 26, fill=(255, 255, 255, 104), outline=(255, 255, 255, 45), width=1)
    right_center_x = (info_box[0] + info_box[2]) // 2
    heading_bbox = draw.textbbox((0, 0), right_heading, font=right_title_font)
    heading_w = heading_bbox[2] - heading_bbox[0]
    draw.text((right_center_x - heading_w / 2, 262), right_heading, font=right_title_font, fill=accent + (255,))

    line_y = 332
    for line in right_lines:
        wrapped = wrap_text(draw, line, right_body_font, 160)
        for part in wrapped:
            part_w = text_width(draw, part, right_body_font)
            draw.text((right_center_x - part_w / 2, line_y), part, font=right_body_font, fill=(32, 58, 92, 235))
            line_y += 28
        line_y += 8

    outfile.parent.mkdir(parents=True, exist_ok=True)
    image.save(outfile)


def main():
    build_image(
        OUTDIR / "aegis-ultimate.png",
        page_pill="ULTIMATE OS",
        title="AEGIS",
        subtitle="Digitální identita, ochrana pozornosti a prémiový surface systém pro vědomé rozhodování.",
        right_heading="Surface",
        right_lines=["Local AI", "Brand layer"],
        bg_top=(48, 26, 52),
        bg_bottom=(255, 207, 226),
        dot_color=(255, 153, 214, 200),
        shell_tint=(255, 248, 253, 232),
        inner_tint=(188, 142, 165, 148),
        accent=(118, 52, 95),
        glow_a=(255, 116, 180, 78),
        glow_b=(255, 210, 137, 72),
    )

    build_image(
        OUTDIR / "protokol-aegis.png",
        page_pill="PROTOKOL: AEGIS",
        title="AEGIS",
        subtitle="Lokální AI obrana proti manipulaci, trackingu a digitálnímu nátlaku.",
        right_heading="Defense",
        right_lines=["Local AI", "Rewrite • Revert"],
        bg_top=(12, 42, 58),
        bg_bottom=(121, 231, 255),
        dot_color=(83, 237, 255, 200),
        shell_tint=(244, 251, 255, 232),
        inner_tint=(122, 196, 223, 150),
        accent=(43, 93, 134),
        glow_a=(0, 225, 255, 70),
        glow_b=(144, 255, 182, 64),
    )

    build_image(
        OUTDIR / "aegis-results.png",
        page_pill="AEGIS RESULTS",
        title="Results",
        subtitle="Analytická vrstva s výhledem na výkon, rizika a návratnost implementace.",
        right_heading="Metrics",
        right_lines=["145 % efektivita", "88 % méně rizik", "4,5 měsíce ROI"],
        bg_top=(15, 30, 49),
        bg_bottom=(177, 220, 255),
        dot_color=(104, 168, 255, 200),
        shell_tint=(247, 251, 255, 236),
        inner_tint=(142, 173, 210, 150),
        accent=(64, 104, 145),
        glow_a=(64, 141, 255, 68),
        glow_b=(44, 228, 186, 68),
    )


if __name__ == "__main__":
    main()
