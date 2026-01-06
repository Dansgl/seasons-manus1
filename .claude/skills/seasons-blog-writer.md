# Seasons Blog Writer Skill

Ghid pentru scrierea articolelor de blog pentru BabySeasons.ro - un serviciu de închiriere haine premium pentru bebeluși.

## Brand Voice

### Ton
- **Empatic**: Înțelegem provocările părinților (nopți nedormite, buget limitat, lipsă de timp)
- **Prietenos**: Vorbim ca o prietenă care a trecut prin asta, nu ca un brand corporatist
- **Pragmatic**: Focus pe soluții practice, nu predici despre sustenabilitate
- **Încrezător dar nu arogant**: Știm că avem o soluție bună, dar nu forțăm

### Ce evităm
- Ton predicator sau moralizator despre mediu
- Jargon tehnic despre sustenabilitate
- Fraze clișeu ("revoluționăm industria", "schimbăm lumea")
- Promisiuni exagerate
- Anglicisme inutile (folosește "articole" nu "items", "închiriere" nu "rental")

### Formulări preferate
- "La Seasons..." (nu "Noi la Seasons...")
- "bebeluș" / "cel mic" / "copil" (variază)
- "350 lei pe sezon" sau "350 lei pe trimestru" (nu €70)
- "5 articole" / "5 piese" (nu "5 items")

## Structura articolelor

### Format standard
1. **Hook** (primul paragraf): Problema sau situația relatable
2. **Context**: De ce contează, statistici relevante
3. **Soluție/Insight**: Informația principală a articolului
4. **Legătura cu Seasons**: Cum ajută serviciul nostru (subtil, nu agresiv)
5. **Call-to-action**: Ușor, natural ("Explorează colecția" nu "CUMPĂRĂ ACUM")

### Lungime
- Articole scurte: 400-600 cuvinte (ghiduri, tips)
- Articole medii: 800-1200 cuvinte (topuri, comparații)
- Articole lungi: 1500-2500 cuvinte (deep-dives, SEO pillars)

## SEO Best Practices

### Keywords principale (RO)
- "închiriere haine bebeluși"
- "haine premium bebeluși"
- "abonament haine copii"
- "haine sustenabile copii"
- "garderobă bebeluș"
- "haine bumbac organic bebeluși"

### Keywords secundare
- "moda circulară copii"
- "haine de calitate bebeluși"
- "economisire haine copii"
- "branduri premium copii"

### Structura SEO
1. **Titlu**: Keyword principal + beneficiu sau curiozitate
   - Corect: "Garderoba capsulă pentru bebeluș: 5 piese esențiale"
   - Greșit: "Garderoba Capsulă Pentru Bebeluș: 5 Piese Esențiale" (nu capitalizăm fiecare cuvânt în română!)

2. **Meta description** (excerpt):
   - 150-160 caractere
   - Include keyword principal
   - Include CTA implicit

3. **Slug URL**:
   - Lowercase, cu cratimă
   - Fără diacritice: "inchiriere-haine-bebelusi" nu "închiriere-haine-bebeluși"
   - Scurt și descriptiv

4. **Headings**:
   - H2 pentru secțiuni principale (include keywords)
   - H3 pentru subsecțiuni
   - Nu sari nivele (H2 → H4)

5. **Imagini**:
   - Alt text descriptiv cu keywords
   - Nume fișiere relevante (nu IMG_1234.jpg)
   - Minim 1 imagine per 300 cuvinte

### Link building intern
- Link către pagina de catalog pentru produse menționate
- Link către alte articole de blog relevante
- Link către pagina "Cum funcționează" când explici procesul

## Template articol

```markdown
# [Titlu cu keyword principal]

[Hook - prima propoziție captivantă care adresează o problemă sau situație]

[Paragraf introductiv - extinde hook-ul, stabilește contextul]

## [H2 cu keyword relevant]

[Conținut principal secțiune 1]

## [H2 cu alt keyword]

[Conținut principal secțiune 2]

### [H3 dacă e nevoie de subsecțiuni]

[Detalii]

## Cum te ajută Seasons

[Legătura naturală cu serviciul - max 1-2 paragrafe]

[Call-to-action subtil]
```

## Checklist înainte de publicare

- [ ] Titlul are keyword principal în primele 60 caractere
- [ ] Excerpt/meta description are 150-160 caractere
- [ ] Slug URL este scurt, fără diacritice
- [ ] Primul paragraf include keyword principal
- [ ] Fiecare H2 conține un keyword
- [ ] Sunt linkuri interne (minim 2)
- [ ] Sunt imagini cu alt text descriptiv
- [ ] Tonul este empatic și prietenos, nu predicator
- [ ] Prețul este în RON (350 lei), nu EUR
- [ ] Nu sunt anglicisme inutile
- [ ] Capitalizarea titlului e corectă (doar prima literă și nume proprii)
- [ ] Articolul are language: 'ro' în Sanity

## Exemple de articole bune

### Titluri eficiente
- "4 servicii de închiriere haine pentru bebeluși din lume"
- "Garderoba capsulă pentru bebeluș: 5 piese esențiale"
- "De ce tot mai mulți părinți aleg să închirieze haine pentru copii"

### Titluri de evitat
- "REVOLUȚIA MODEI PENTRU BEBELUȘI!!!" (caps, exclamări)
- "Cum Să Construiești O Garderobă" (capitalizare EN)
- "Baby clothes rental trends" (engleză)

## Sanity CMS

### Câmpuri obligatorii
- title (string)
- slug (generat din titlu, fără diacritice)
- excerpt (pentru meta description)
- body (block content)
- language: "ro"
- publishedAt (data publicării)

### Câmpuri opționale
- mainImage (cover image)
- categories (pentru filtrare)
- author (referință)
