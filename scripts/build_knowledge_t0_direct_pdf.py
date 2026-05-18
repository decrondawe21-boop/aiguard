from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTDIR = ROOT / "dist" / "knowledge"
PDF_PATH = OUTDIR / "AEGIS_knowledge_T0.pdf"

FONT_REGULAR = r"C:\Windows\Fonts\segoeui.ttf"
FONT_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("SegoeUI", FONT_REGULAR))
    pdfmetrics.registerFont(TTFont("SegoeUI-Bold", FONT_BOLD))


def styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "AegisTitle",
            parent=base["Title"],
            fontName="SegoeUI-Bold",
            fontSize=30,
            leading=34,
            textColor=colors.HexColor("#0F233F"),
            spaceAfter=4 * mm,
            alignment=TA_LEFT,
        ),
        "subtitle": ParagraphStyle(
            "AegisSubtitle",
            parent=base["Normal"],
            fontName="SegoeUI-Bold",
            fontSize=16,
            leading=20,
            textColor=colors.HexColor("#0A8197"),
            spaceAfter=6 * mm,
        ),
        "h1": ParagraphStyle(
            "AegisH1",
            parent=base["Heading1"],
            fontName="SegoeUI-Bold",
            fontSize=15,
            leading=19,
            textColor=colors.HexColor("#0A8197"),
            spaceBefore=7 * mm,
            spaceAfter=3 * mm,
        ),
        "h2": ParagraphStyle(
            "AegisH2",
            parent=base["Heading2"],
            fontName="SegoeUI-Bold",
            fontSize=12,
            leading=15,
            textColor=colors.HexColor("#0F233F"),
            spaceBefore=4 * mm,
            spaceAfter=2 * mm,
        ),
        "body": ParagraphStyle(
            "AegisBody",
            parent=base["BodyText"],
            fontName="SegoeUI",
            fontSize=9.5,
            leading=13,
            textColor=colors.HexColor("#222732"),
            spaceAfter=2.5 * mm,
        ),
        "small": ParagraphStyle(
            "AegisSmall",
            parent=base["BodyText"],
            fontName="SegoeUI",
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor("#586376"),
        ),
        "label": ParagraphStyle(
            "AegisLabel",
            parent=base["BodyText"],
            fontName="SegoeUI-Bold",
            fontSize=8.7,
            leading=11,
            textColor=colors.HexColor("#0F233F"),
        ),
        "table": ParagraphStyle(
            "AegisTable",
            parent=base["BodyText"],
            fontName="SegoeUI",
            fontSize=8.7,
            leading=11.2,
            textColor=colors.HexColor("#222732"),
        ),
        "callout": ParagraphStyle(
            "AegisCallout",
            parent=base["BodyText"],
            fontName="SegoeUI",
            fontSize=9.3,
            leading=13,
            textColor=colors.HexColor("#222732"),
        ),
    }


def safe(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\n", "<br/>")
    )


def para(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(safe(text), style)


def bullet(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(f"• {safe(text)}", style)


def kv_table(rows: list[tuple[str, str]], st: dict[str, ParagraphStyle], col1: float = 44 * mm) -> Table:
    data = [[para("Oblast", st["label"]), para("Znalost T=0", st["label"])]]
    for label, value in rows:
        data.append([para(label, st["label"]), para(value, st["table"])])
    table = Table(data, colWidths=[col1, 166 * mm - col1], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#DDEFF3")),
                ("GRID", (0, 0), (-1, -1), 0.45, colors.HexColor("#B8C7D0")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return table


def callout(text: str, st: dict[str, ParagraphStyle]) -> Table:
    table = Table([[para(text, st["callout"])]], colWidths=[166 * mm], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F2F8FA")),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#9DCCD5")),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return table


def build_story() -> list:
    st = styles()
    story: list = []

    story.append(para("AEGIS", st["title"]))
    story.append(para("Knowledge T=0", st["subtitle"]))
    story.append(
        para(
            "Výchozí znalostní báze projektu podle funkcí, které jsou v repozitáři aktuálně implementované. Dokument odděluje skutečný stav od roadmapy.",
            st["body"],
        )
    )
    story.append(
        kv_table(
            [
                ("Datum snapshotu", "10. 5. 2026"),
                ("Produkční doména", "https://aegis.d-international.eu"),
                ("Repo root", str(ROOT)),
                ("Primární identita", "AEGIS, Protokol: Aegis, Ultimate OS"),
                ("Charakter dokumentu", "T=0 knowledge: implementovaný stav, ne budoucí slib."),
            ],
            st,
        )
    )
    story.append(Spacer(1, 5 * mm))
    story.append(
        callout(
            "Jedna věta: AEGIS je local-first obranná vrstva pro web, která detekuje manipulační vzorce v rozhraní, umí bezpečně zasáhnout do DOMu a dává uživateli možnost zásah vrátit.",
            st,
        )
    )

    story.append(para("1. Produktová definice", st["h1"]))
    story.append(
        para(
            "AEGIS je prototyp nové kategorie cognitive defense software. Neřeší pouze reklamu nebo tracking, ale samotné rozhodovací prostředí webu: nátlakové texty, asymetrické cookie flow, urgency efekty a prvky navržené pro manipulaci pozornosti.",
            st["body"],
        )
    )
    for item in [
        "Ultimate OS je prezentační a brandový surface projektu.",
        "Protokol: Aegis je produktová větev zaměřená na AI obranu webového prostředí.",
        "AEGIS Results je analytická vrstva pro modelové metriky efektivity, rizik a návratnosti.",
    ]:
        story.append(bullet(item, st["body"]))

    story.append(para("2. Implementované části v T=0", st["h1"]))
    story.append(
        kv_table(
            [
                ("Web a shell", "Next.js 16 + TypeScript, Once UI, vlastní design shell, route pro Ultimate OS i AEGIS sekce."),
                ("AEGIS UI", "App-like ops console: threat feed, security vault, object inspector, forensic assistant a scan progress."),
                ("Metriky", "Expected Results je vnořené do AEGIS experience přes /ai-guard#expected-results."),
                ("SEO a brand", "Metadata, favicon pack, manifest, robots, sitemap a tři OG obrázky."),
                ("Dokumentace", "Investor brief, technical brief, Q&A, prezentační script, slovníky pojmů a PDF podklady."),
                ("Vercel", "Projekt je nasazený na doméně aegis.d-international.eu s Next.js konfigurací."),
            ],
            st,
        )
    )

    story.append(PageBreak())
    story.append(para("3. Browser extension vrstva", st["h1"]))
    story.append(
        kv_table(
            [
                ("Manifest", "Manifest V3 extension scaffold v E:\\guard\\extension."),
                ("Content script", "Skenuje textové prvky a detekuje urgency, scarcity a social proof patterny."),
                ("Background", "Drží session data per-tab, inference výsledky a messaging mezi vrstvami."),
                ("Sidepanel", "Zobrazuje threats, inference update, audit trail, manual scan a Revert DOM."),
                ("Ikony", "Extension používá finální AEGIS shield sadu 16 / 48 / 128."),
                ("Typecheck", "Extension vrstva má vlastní tsconfig.extension.json a běží pod @ts-check."),
            ],
            st,
        )
    )

    story.append(para("4. Intervenční schopnosti", st["h1"]))
    for item in [
        "Rewrite: tlakové texty se přepisují do neutrálnější podoby a originál se drží v data-* metadatech.",
        "Suppression: urgency prvky dostávají jemné ztlumení animace, glow a agresivního stylingu.",
        "Cookie override: consent copy se normalizuje do srozumitelnější podoby bez automatického odkliknutí.",
        "Revert DOM: sidepanel umí vrátit zásahy zpět a ponechat element do reloadu bez další intervence.",
    ]:
        story.append(bullet(item, st["body"]))

    story.append(para("5. Lokální inference", st["h1"]))
    story.append(
        para(
            "Implementovaný endpoint /api/aegis/evaluate slouží jako lokální vyhodnocovací vrstva. Bridge má default na localhost a podporuje fail-soft režim: pokud lokální model není dostupný, systém vrací local policy fallback místo pádu.",
            st["body"],
        )
    )
    story.append(
        kv_table(
            [
                ("Endpoint", "E:\\guard\\app\\api\\aegis\\evaluate\\route.ts"),
                ("Bridge", "E:\\guard\\extension\\inference-bridge.js"),
                ("Kontrakty", "E:\\guard\\src\\lib\\ai-guard\\contracts.ts"),
                ("Provider logika", "Ollama / custom / disabled, podle konfigurace."),
            ],
            st,
        )
    )

    story.append(para("6. Runtime flow", st["h1"]))
    for idx, item in enumerate(
        [
            "Content script přečte stránku a vytvoří ThreatRecord[] z podezřelých prvků.",
            "Background worker uloží stav pro aktivní tab a informuje sidepanel.",
            "Inference bridge volitelně pošle data na lokální endpoint.",
            "AEGIS aplikuje zásah: flag, rewrite, suppression nebo cookie normalization.",
            "Sidepanel ukáže výsledek a umožní Revert DOM.",
        ],
        1,
    ):
        story.append(para(f"{idx}. {item}", st["body"]))

    story.append(PageBreak())
    story.append(para("7. Klíčové cesty v repozitáři", st["h1"]))
    story.append(
        kv_table(
            [
                ("Hlavní shell", "E:\\guard\\src\\App.tsx"),
                ("AEGIS sekce", "E:\\guard\\src\\components\\architecture\\SectionPages.tsx"),
                ("Ops console", "E:\\guard\\src\\components\\architecture\\AiGuardOpsConsole.tsx"),
                ("Metriky", "E:\\guard\\src\\components\\analytics\\ExpectedResultsPage.tsx"),
                ("Menu data", "E:\\guard\\src\\mocks\\megaMenuData.ts"),
                ("Extension", "E:\\guard\\extension\\content.js, background.js, sidepanel.js"),
                ("SEO", "E:\\guard\\app\\resources\\seo.ts, layout.tsx, sitemap.ts, robots.ts"),
                ("OG builder", "E:\\guard\\scripts\\build_og_images.py"),
            ],
            st,
        )
    )

    story.append(para("8. Demo mapa", st["h1"]))
    story.append(
        kv_table(
            [
                ("Ultimate OS", "https://aegis.d-international.eu/"),
                ("Protokol: Aegis", "https://aegis.d-international.eu/ai-guard"),
                ("Philosophy", "/ai-guard/philosophy"),
                ("Detection", "/ai-guard/detection"),
                ("Defense", "/ai-guard/defense"),
                ("Build", "/ai-guard/build"),
                ("Results", "/ai-guard#expected-results"),
            ],
            st,
        )
    )

    story.append(para("9. Co v T=0 netvrdit jako hotové", st["h1"]))
    for item in [
        "AEGIS není ještě enterprise-ready browser security produkt.",
        "Product-market fit zatím není validovaný na trhu.",
        "Precision/recall modelu a dataset manipulačních patternů ještě nejsou uzavřené.",
        "Unpacked Chrome flow má být ještě formálně ověřený end-to-end.",
        "Část UI je app-like simulace a čeká na reálný runtime threat feed.",
    ]:
        story.append(bullet(item, st["body"]))

    story.append(para("10. Příkazy pro vývoj", st["h1"]))
    story.append(
        kv_table(
            [
                ("Dev server", "npm run dev"),
                ("Build", "npm run build"),
                ("Typecheck web", "npm run typecheck:web"),
                ("Typecheck extension", "npm run typecheck:extension"),
                ("Celý typecheck", "npm run typecheck"),
            ],
            st,
        )
    )

    story.append(para("11. T=0 znalostní věty", st["h1"]))
    for item in [
        "AEGIS už má produkční web, brand, SEO a nasazenou doménu.",
        "Extension vrstva už má první reálné DOM zásahy a revert flow.",
        "Local inference endpoint existuje a má fallback, takže demo nestojí na dostupnosti modelu.",
        "Architektura je typovaná a připravená na rozšíření intervention modes.",
        "Další nejlepší krok je end-to-end ověření extension flow a napojení reálného threat feedu.",
    ]:
        story.append(bullet(item, st["body"]))

    return story


def footer(canvas_obj, doc):
    canvas_obj.saveState()
    canvas_obj.setFont("SegoeUI", 8)
    canvas_obj.setFillColor(colors.HexColor("#586376"))
    canvas_obj.drawString(20 * mm, 12 * mm, "AEGIS | Knowledge T=0 | aegis.d-international.eu")
    canvas_obj.drawRightString(190 * mm, 12 * mm, f"Strana {doc.page}")
    canvas_obj.restoreState()


def main() -> None:
    register_fonts()
    OUTDIR.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(PDF_PATH),
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title="AEGIS Knowledge T=0",
        author="David Kozák",
        subject="Výchozí znalostní báze projektu AEGIS",
    )
    doc.build(build_story(), onFirstPage=footer, onLaterPages=footer)
    print(PDF_PATH)


if __name__ == "__main__":
    main()
