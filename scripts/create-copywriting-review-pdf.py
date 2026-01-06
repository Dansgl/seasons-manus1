#!/usr/bin/env python3
"""
Generate PDF report for BabySeasons copywriting review
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# Register fonts with Romanian diacritic support
# Try DejaVuSans first (commonly available), fall back to system fonts
font_paths = [
    # Common locations for DejaVuSans
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/dejavu/DejaVuSans.ttf",
    "/Library/Fonts/DejaVuSans.ttf",
    # macOS system fonts that support Romanian
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    "/Library/Fonts/Arial Unicode.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
]

font_registered = False
FONT_NAME = "DejaVuSans"
FONT_BOLD = "DejaVuSans-Bold"
FONT_ITALIC = "DejaVuSans-Oblique"

# Try to find and register DejaVuSans
dejavu_paths = [
    ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
     "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
     "/usr/share/fonts/truetype/dejavu/DejaVuSans-Oblique.ttf"),
    ("/Library/Fonts/DejaVuSans.ttf",
     "/Library/Fonts/DejaVuSans-Bold.ttf",
     "/Library/Fonts/DejaVuSans-Oblique.ttf"),
]

# Check if we have DejaVuSans in the virtual env
import subprocess
result = subprocess.run(['find', '/Users/dan/baby-seasons/.venv', '-name', 'DejaVuSans*.ttf'],
                       capture_output=True, text=True)
if result.stdout.strip():
    print(f"Found DejaVu fonts in venv")

# Use Arial Unicode MS on macOS (has full Romanian support)
arial_unicode = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
if os.path.exists(arial_unicode):
    pdfmetrics.registerFont(TTFont('ArialUnicode', arial_unicode))
    FONT_NAME = "ArialUnicode"
    FONT_BOLD = "ArialUnicode"  # Arial Unicode doesn't have separate bold
    FONT_ITALIC = "ArialUnicode"
    font_registered = True
    print(f"Using Arial Unicode MS for Romanian diacritics")

if not font_registered:
    # Fall back to Helvetica (diacritics may not render correctly)
    FONT_NAME = "Helvetica"
    FONT_BOLD = "Helvetica-Bold"
    FONT_ITALIC = "Helvetica-Oblique"
    print("Warning: Using Helvetica - diacritics may not display correctly")

# Colors
SEASONS_RED = HexColor("#FF3C1F")
SEASONS_BROWN = HexColor("#5C1A11")
SEASONS_BEIGE = HexColor("#F5F1ED")
SEASONS_TEXT = HexColor("#B85C4A")

# Output path
output_path = "/Users/dan/baby-seasons/docs/Review-Copy-BabySeasons.pdf"

# Ensure docs directory exists
os.makedirs(os.path.dirname(output_path), exist_ok=True)

# Create document
doc = SimpleDocTemplate(
    output_path,
    pagesize=A4,
    rightMargin=2*cm,
    leftMargin=2*cm,
    topMargin=2*cm,
    bottomMargin=2*cm
)

# Styles
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'CustomTitle',
    parent=styles['Heading1'],
    fontName=FONT_NAME,
    fontSize=24,
    textColor=SEASONS_BROWN,
    spaceAfter=20,
    alignment=TA_CENTER
)

subtitle_style = ParagraphStyle(
    'Subtitle',
    parent=styles['Normal'],
    fontName=FONT_NAME,
    fontSize=14,
    textColor=SEASONS_TEXT,
    spaceAfter=30,
    alignment=TA_CENTER
)

heading1_style = ParagraphStyle(
    'CustomH1',
    parent=styles['Heading1'],
    fontName=FONT_NAME,
    fontSize=16,
    textColor=SEASONS_RED,
    spaceBefore=20,
    spaceAfter=10
)

heading2_style = ParagraphStyle(
    'CustomH2',
    parent=styles['Heading2'],
    fontName=FONT_NAME,
    fontSize=13,
    textColor=SEASONS_BROWN,
    spaceBefore=15,
    spaceAfter=8
)

normal_style = ParagraphStyle(
    'CustomNormal',
    parent=styles['Normal'],
    fontName=FONT_NAME,
    fontSize=10,
    textColor=SEASONS_BROWN,
    spaceAfter=8,
    leading=14
)

quote_style = ParagraphStyle(
    'Quote',
    parent=styles['Normal'],
    fontName=FONT_ITALIC,
    fontSize=10,
    textColor=SEASONS_TEXT,
    leftIndent=20,
    rightIndent=20,
    spaceAfter=8,
    leading=14
)

bold_style = ParagraphStyle(
    'Bold',
    parent=normal_style,
    fontName=FONT_BOLD
)

# Build content
story = []

# Title page
story.append(Paragraph("ANALIZĂ COPY BABYSEASONS.RO", title_style))
story.append(Paragraph("Raport pentru Ioana, Fondator", subtitle_style))
story.append(Spacer(1, 30))

# Score
score_style = ParagraphStyle('Score', parent=title_style, fontSize=48, textColor=SEASONS_RED)
story.append(Paragraph("SCOR: 6.8/10", score_style))
story.append(Spacer(1, 20))

story.append(Paragraph(
    "Copy-ul are un nucleu emoțional solid și o voce autentică, dar lasă conversii pe masă prin lipsa de urgență, structură inconsecventă și absența unor elemente cheie de persuasiune.",
    normal_style
))

story.append(PageBreak())

# TOP 3 Critical
story.append(Paragraph("TOP 3 ÎMBUNĂTĂȚIRI CRITICE", heading1_style))

story.append(Paragraph("1. HEADLINE-UL 'SEASONS' E MORT", heading2_style))
story.append(Paragraph("Pagina 'Despre noi' începe cu un singur cuvânt: 'Seasons'. Zero hook. Zero promisiune.", normal_style))
story.append(Paragraph("<b>ÎNAINTE:</b> Seasons", normal_style))
story.append(Paragraph("<b>DUPĂ:</b> De ce plătești prețul întreg pentru haine purtate 6 săptămâni?", normal_style))
story.append(Paragraph("SAU: Garderoba premium pentru cel mic. Fără prețul premium. Fără risipă.", quote_style))

story.append(Paragraph("2. CTA-URILE SUNT PASIVE ȘI GENERICE", heading2_style))
story.append(Paragraph("'Vezi ce avem în selecție' nu creează urgență.", normal_style))
story.append(Paragraph("<b>ÎNAINTE:</b><br/>Alătură-te comunității noastre<br/>Încearcă o alternativă sustenabilă închiriind haine pentru cel mic începând de la 350 lei pe sezon.<br/>Vezi ce avem în selecție", normal_style))
story.append(Paragraph("<b>DUPĂ:</b><br/>Primul tău pachet poate ajunge în 3-5 zile.<br/>350 lei/sezon. 5 articole premium. Curățare inclusă. Fără obligații pe termen lung.<br/>[Explorează colecția curentă] sau [Calculează cât economisești]", normal_style))

story.append(Paragraph("3. PREȚUL E ASCUNS ȘI NECONTEXTUALIZAT", heading2_style))
story.append(Paragraph("350 RON/trimestru apare o singură dată, fără comparație.", normal_style))
story.append(Paragraph("<b>ADAUGĂ SECȚIUNE DE VALOARE:</b>", normal_style))
story.append(Paragraph("• 5 articole premium = valoare retail ~800-1200 lei<br/>• Tu plătești: 350 lei/sezon<br/>• Economisie: 60-70% față de cumpărare<br/>• + Curățare profesională inclusă<br/>• + Reparații minore incluse<br/>• + Zero timp pierdut pe Vinted", normal_style))

story.append(PageBreak())

# Problems table
story.append(Paragraph("PROBLEME CRITICE", heading1_style))

problems_data = [
    ["Problemă", "Soluție"],
    ['"X branduri premium" și "X membri"', "Șterge placeholder-urile sau pune numere reale!"],
    ['"It\'s a win-win-win situation"', '"Toată lumea câștigă. Hainele. Tu. Planeta."'],
    ['"tip top" - anglicism', '"design pe care l-ai purta și tu"'],
    ["Text tăiat la 'retur'", "Completează fraza întreruptă"],
    ['"tenul bebelușui"', 'Corectează: "bebelușului"'],
]

problems_table = Table(problems_data, colWidths=[8*cm, 8*cm])
problems_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), SEASONS_RED),
    ('TEXTCOLOR', (0, 0), (-1, 0), HexColor("#FFFFFF")),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('FONTNAME', (0, 0), (-1, 0), FONT_BOLD),
    ('FONTNAME', (0, 1), (-1, -1), FONT_NAME),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
    ('BACKGROUND', (0, 1), (-1, -1), SEASONS_BEIGE),
    ('GRID', (0, 0), (-1, -1), 1, SEASONS_BROWN),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
]))
story.append(problems_table)

story.append(Spacer(1, 20))

# What works
story.append(Paragraph("CE FUNCȚIONEAZĂ EXCELENT (PĂSTREAZĂ!)", heading1_style))

works_items = [
    '"7 mărimi în primii 2 ani" - Concret, memorabil, relatable',
    '"183 de milioane de articole" - Impact emoțional prin cifre',
    'Povestea personală "La 2 noaptea scrollam" - Autentic, empatic',
    'Secțiunea "Curățenia? Ne ocupăm noi" - Răspunde la obiecție',
    '"Apare o pată? Se rupe o capsă?" - Elimină frica',
    'Formatul valorilor - Sustenabilitate, Calitate, Grijă, Comunitate',
]

for item in works_items:
    story.append(Paragraph(f"✓ {item}", normal_style))

story.append(PageBreak())

# SEO Analysis
story.append(Paragraph("ANALIZĂ SEO", heading1_style))

story.append(Paragraph("CE EXISTĂ DEJA PE SITE (BUN):", heading2_style))
story.append(Paragraph('• Title: "Seasons | Închiriere Haine Premium pentru Bebeluși"', normal_style))
story.append(Paragraph('• Meta description cu preț și beneficii', normal_style))
story.append(Paragraph('• Keywords relevante configurate', normal_style))
story.append(Paragraph('• OG tags complete pentru social sharing', normal_style))

story.append(Paragraph("CE LIPSEȘTE:", heading2_style))
story.append(Paragraph('1. H1-ul "Seasons" - Zero valoare SEO', normal_style))
story.append(Paragraph('2. Keyword principal absent din prima propoziție', normal_style))
story.append(Paragraph('3. Pagini separate pentru categorii de vârstă', normal_style))

story.append(Paragraph("KEYWORDS ȚINTĂ:", heading2_style))
story.append(Paragraph('• "închiriere haine bebeluși" (volum mare)<br/>• "haine premium bebeluși" (intent bun)<br/>• "abonament haine bebeluși" (first-mover)<br/>• "haine sustenabile copii" (trend)', normal_style))

story.append(PageBreak())

# Complete rewrite
story.append(Paragraph("RESCRIEREA COMPLETĂ - DESPRE NOI", heading1_style))

rewrite_text = """De ce plătești prețul întreg pentru haine purtate 6 săptămâni?

Bebелușii cresc prin 7 mărimi în primii 2 ani. Hainele cumpărate azi rămân mici luna viitoare. Peste 183 de milioane de articole ajung anual la gunoi din această cauză.

Seasons e răspunsul simplu: închiriezi haine premium, le porți cât se potrivesc, le returnezi, primești următoarea mărime. Curățate profesional, livrate acasă, fără grija întreținerii.

350 lei pe sezon. 5 articole de calitate. Zero risipă."""

story.append(Paragraph(rewrite_text.replace('\n\n', '<br/><br/>'), quote_style))

story.append(Paragraph("POVESTEA DIN SPATELE SEASONS", heading2_style))

story_text = """Înainte de bebeluș, investeam în haine de calitate - piese pe care le țin ani de zile în garderobă.

Apoi a apărut el. Și la 2 noaptea, scrollam prin body-uri, tricouașe și salopete adorabile. După câteva sesiuni de shopping nocturn, am realizat: nu poți investi în haine de calitate pentru un bebeluș. Crește prea repede.

Am încercat alternativele. Știu de ce nu funcționează.

<b>Fast fashion:</b> Body la 30 de lei care după 3 spălări își pierde forma.

<b>Grupuri Facebook:</b> "Cine are 68 în București?" - aștepți răspunsuri, te deplasezi. Cu un bebeluș în brațe.

<b>OLX, Vinted:</b> Scroll infinit, calitate variabilă. Tot rămâi cu hainele după.

<b>Pachetul de la prietenă:</b> Minunat dacă ai o prietenă cu copil mai mare, în același sezon, cu gust similar. Câte bifezi?

Așa s-a născut Seasons. O garderobă comună de piese premium, alese cu atenție, îngrijite profesional.

Toată lumea câștigă. Hainele trăiesc mai mult. Tu scapi de bătăi de cap. Planeta respiră mai ușor. Cei mici arată impecabil în fiecare poză."""

story.append(Paragraph(story_text.replace('\n\n', '<br/><br/>'), normal_style))

story.append(PageBreak())

# New elements
story.append(Paragraph("ELEMENTE NOI RECOMANDATE", heading1_style))

story.append(Paragraph("1. TESTIMONIALE", heading2_style))
story.append(Paragraph('"Am comandat sceptică. După primul pachet, am înțeles. Zero stres, haine superbe, și scap de ele când rămân mici."<br/>- Ana, mama lui Matei (8 luni)', quote_style))
story.append(Paragraph('"Calculasem: pentru 5 body-uri premium plătesc 400+ lei și le poartă 2 luni. La Seasons, le închiriez, le returnez, primesc altele. Matematica e clară."<br/>- Mihai, tată lui Sofia (14 luni)', quote_style))

story.append(Paragraph("2. GARANȚIE EXPLICITĂ", heading2_style))
story.append(Paragraph("Dacă nu ești 100% mulțumită de calitatea sau starea hainelor, le returnezi în 7 zile și îți dăm banii înapoi. Fără întrebări.", normal_style))

story.append(Paragraph("3. URGENȚĂ AUTENTICĂ", heading2_style))
story.append(Paragraph("Colecția de vară se reînnoiește lunar. Anumite piese populare se duc repede. Activează-ți abonamentul și fii prima care primește acces la noutăți.", normal_style))

story.append(PageBreak())

# Quick wins
story.append(Paragraph("QUICK WINS - SCHIMBĂRI RAPIDE, IMPACT MARE", heading1_style))

quick_wins_data = [
    ["Schimbare", "Timp", "Impact"],
    ['Înlocuiește "X" cu numere reale', "5 min", "MARE"],
    ['Corectează "bebelușui" → "bebelușului"', "1 min", "Credibilitate"],
    ["Completează textul tăiat la 'retur'", "10 min", "CRITIC"],
    ["Adaugă breakdown preț cu economii", "15 min", "Conversie"],
    ['Înlocuiește "tip top" și "win-win-win"', "5 min", "Ton"],
    ["Adaugă 2-3 testimoniale", "20 min", "Dovadă socială"],
]

qw_table = Table(quick_wins_data, colWidths=[9*cm, 3*cm, 4*cm])
qw_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), SEASONS_RED),
    ('TEXTCOLOR', (0, 0), (-1, 0), HexColor("#FFFFFF")),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('ALIGN', (1, 0), (2, -1), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, 0), FONT_BOLD),
    ('FONTNAME', (0, 1), (-1, -1), FONT_NAME),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
    ('BACKGROUND', (0, 1), (-1, -1), SEASONS_BEIGE),
    ('GRID', (0, 0), (-1, -1), 1, SEASONS_BROWN),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
story.append(qw_table)

story.append(Spacer(1, 20))

# Strategic recommendations
story.append(Paragraph("RECOMANDĂRI STRATEGICE", heading1_style))

strategies = [
    ("<b>Calculator de economii</b> - Utilizatorul introduce câte articole cumpără normal, vede cât economisește cu Seasons", ""),
    ("<b>Pachet de probă</b> - Un singur articol pentru 50-70 RON, fără abonament. Reduce bariera de intrare", ""),
    ("<b>Program 'Recomandă o prietenă'</b> - Tu și prietena ta primiți fiecare 50 lei reducere", ""),
    ("<b>Colaborare cu brandurile</b> - Menționează explicit: 'Selecție din colecțiile iELM, Iridor'", ""),
    ("<b>Content marketing</b> - 'Ghidul mărimilor 0-24 luni' - captează trafic SEO, oferă valoare", ""),
]

for i, (strat, _) in enumerate(strategies, 1):
    story.append(Paragraph(f"{i}. {strat}", normal_style))

story.append(PageBreak())

# Conclusion
story.append(Paragraph("CONCLUZIE", heading1_style))

story.append(Paragraph(
    "BabySeasons are un produs excelent pentru o piață românească ne-educată încă în conceptul de clothing rental. Copy-ul actual are inimă - vocea Ioanei e autentică și empatică.",
    normal_style
))

story.append(Paragraph("Dar lasă conversii pe masă prin:", normal_style))
story.append(Paragraph("• Hook-uri slabe<br/>• CTA-uri pasive<br/>• Lipsa totală de urgență și dovadă socială<br/>• Placeholder-uri vizibile ('X')<br/>• Erori tehnice (text tăiat, greșeli de tipar)", normal_style))

story.append(Paragraph(
    "Cu ajustările propuse, copy-ul poate trece de la 'informativ și simpatic' la 'convingător și convertitor'.",
    normal_style
))

story.append(Spacer(1, 30))

# Priorities
priority_style = ParagraphStyle('Priority', parent=bold_style, fontSize=11, textColor=SEASONS_RED)
story.append(Paragraph("PRIORITĂȚI:", priority_style))
story.append(Paragraph("<b>#1:</b> Completează textul tăiat și elimină placeholder-urile", normal_style))
story.append(Paragraph("<b>#2:</b> Adaugă testimoniale și numere reale", normal_style))
story.append(Paragraph("<b>#3:</b> Rescrie CTA-urile cu valoare clară și urgență autentică", normal_style))

story.append(Spacer(1, 50))

# Footer
footer_style = ParagraphStyle('Footer', parent=normal_style, fontSize=9, textColor=SEASONS_TEXT, alignment=TA_CENTER)
story.append(Paragraph("—", footer_style))
story.append(Paragraph("Raport generat pentru Seasons / BabySeasons.ro", footer_style))
story.append(Paragraph("Ianuarie 2026", footer_style))

# Build PDF
doc.build(story)
print(f"PDF created: {output_path}")
