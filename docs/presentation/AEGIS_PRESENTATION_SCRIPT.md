# AEGIS
## Presentation Script for Tomorrow

Použití: 8-12 minut  
Publikum: investoři + IT/developers  
Cíl: mluvit jedním příběhem, ale jemně přepnout akcent podle publika

## Slide 1
### Titulek
AEGIS: AI obrana proti digitální manipulaci

### Slide goal
Zarámovat AEGIS jako novou obrannou vrstvu, ne jako další designový web.

### Co říct
"AEGIS vzniká jako obranná vrstva pro web. Neřeší jen reklamu nebo tracking. Řeší samotný mechanismus, jak rozhraní tlačí uživatele k rozhodnutí, které by bez toho tlaku neudělal."

### Pro investory zdůrazni
- category creation
- why now

### Pro developery zdůrazni
- intervention layer over browser DOM

## Slide 2
### Titulek
Problém: web je optimalizovaný pro konverzi, ne pro uživatele

### Slide goal
Ukázat, že problém není abstraktní, ale každodenní.

### Co říct
"Dnes je normální, že stránka používá urgency, scarcity, asymetrické cookie flow a behaviorální tlak. To není jen UX detail. To je problém důvěry, soukromí a kvality rozhodování."

### Příklad věty
"Klasický adblock zastaví banner. AEGIS řeší otázku, jestli už samotné rozhraní nemanipuluje uživatele."

## Slide 3
### Titulek
Kategorie produktu: adblock pro psychologii

### Slide goal
Jednoduše odlišit AEGIS od stávajících nástrojů.

### Co říct
"AEGIS jde o vrstvu výš. Neřeší jen síť nebo prvky. Čte stránku jako rozhodovací prostředí a vyhodnocuje úmysl rozhraní."

### Rychlé srovnání
- adblock: blokace prvků
- privacy tool: omezení trackerů
- AEGIS: ochrana úsudku uživatele

## Slide 4
### Titulek
Jak AEGIS funguje

### Slide goal
Ukázat technický loop bez zbytečné složitosti.

### Co říct
"Aktuální MVP dnes umí detekci, rewrite, suppression, audit a revert. To je důležité, protože produkt už nejen označuje problém, ale dokáže bezpečně zasáhnout a zásah vrátit zpět."

### Zkrácený flow
`scan -> classify -> rewrite / suppress -> audit -> revert`

## Slide 5
### Titulek
Co je dnes opravdu hotové

### Slide goal
Oddělit realitu MVP od roadmapy.

### Co říct
"Máme veřejný web, produktovou architekturu, browser extension scaffold, typed contracts, sidepanel, lokální endpoint a první reálné DOM zásahy. To znamená, že nejde jen o designový koncept."

### Ukázat
- `rewrite`
- `urgency suppression`
- `cookie normalization`
- `Revert DOM`

## Slide 6
### Titulek
Local-first inference

### Slide goal
Vysvětlit technickou výhodu i důvěryhodnost přístupu.

### Co říct
"Inference je navržená lokálně. Když běží Ollama, použijeme lokální model. Když neběží, AEGIS nespadne a přepne se do konzervativního policy fallbacku."

### Pro investory
- privacy
- lower cloud dependency
- enterprise angle

### Pro developery
- local endpoint
- fail-soft architecture

## Slide 7
### Titulek
Proč je to investičně zajímavé

### Slide goal
Ukázat, že AEGIS otevírá novou kategorii.

### Co říct
"Pokud vznikla vrstva pro blokaci reklam a vrstva pro blokaci trackerů, další logická vrstva je software, který chrání samotný úsudek uživatele. AEGIS se snaží obsadit právě tuto kategorii."

### Klíčová věta
`AEGIS = cognitive defense software`

## Slide 8
### Titulek
Monetizace

### Slide goal
Ukázat, že nejde jen o hobby privacy plugin.

### Co říct
"Nejrychlejší vstup je browser extension freemium. Dlouhodobě ale dává smysl team license a on-prem enterprise model s auditovatelností a policy vrstvou."

### Varianty
- B2C freemium
- team / B2B
- enterprise on-prem

## Slide 9
### Titulek
Roadmapa

### Slide goal
Ukázat realistický další krok.

### Co říct
"Nejsme ve fázi, kdy potřebujeme další vizuál. Potřebujeme produktizaci: ověřit unpacked extension flow, inference kvalitu, audit trail a pilotní validaci."

### Následující milníky
- end-to-end Chrome flow
- real threat feed
- audit export
- dataset patternů

## Slide 10
### Titulek
Co od nás dnes potřebujeme

### Slide goal
Přeložit vizi do konkrétního asku.

### Co říct
"Hledáme kapitál a prostor na to, abychom z funkčního MVP udělali distribuovatelný produkt a ověřili, že z privacy tooling vzniká nová, samostatná kategorie obranného softwaru."

### Formulace asku
- pre-seed / seed
- pilot capital
- design partner

## Slide 11
### Titulek
Rizika a poctivá hranice

### Slide goal
Zvýšit důvěryhodnost tím, že nebudeš přehánět.

### Co říct
"Dnes ještě netvrdíme, že máme enterprise-ready produkt nebo validovanou modelovou přesnost. Tvrdíme, že máme silné, funkční local-first MVP a velmi jasnou další technickou osu."

### Neříkat
- hotový PMF
- validovaný production model
- enterprise-ready deployment

## Slide 12
### Titulek
Close

### Slide goal
Nechat po sobě silnou poslední větu.

### Co říct
"AEGIS není anti-internet produkt. Je to pro-user vrstva, která vrací rovnováhu mezi systémem a člověkem. A pokud web optimalizuje každou sekundu pozornosti, obrana pozornosti bude další logická bezpečnostní vrstva."

---

## 1min elevator pitch
"AEGIS je local-first AI obranná vrstva pro web. Detekuje manipulační rozhraní, přepisuje tlakové prvky do neutrální podoby, tlumí urgency efekty a drží zásahy auditovatelně s možností revertu. Dnes už máme funkční MVP stack od browser extension přes sidepanel až po lokální inference endpoint. Další krok je validovat, že z privacy tooling nevzniká jen plugin, ale nová produktová kategorie: cognitive defense software."

## 30s opener
"Web je dnes optimalizovaný pro konverzi, ne pro uživatele. AEGIS vzniká jako AI obranná vrstva, která neřeší jen bannery a trackery, ale samotné mechanismy digitální manipulace."

## 30s close
"Máme funkční local-first MVP a jasně pojmenovaný problém, který dnešní nástroje řeší jen částečně. Teď potřebujeme z této technické a produktové osy udělat distribuovatelný produkt."

## Jak stejnou prezentaci jemně přepnout

### Když sedí investoři
Přitlač na:
- category creation
- timing
- moat
- monetization
- ask

### Když sedí CTO / developeri
Přitlač na:
- typed contracts
- intervention model
- fail-soft inference
- revertability
- practical roadmap

## Doporučené demo během prezentace
1. otevřít `https://aegis.d-international.eu`
2. přejít na `/ai-guard`
3. stručně ukázat architekturu
4. otevřít sidepanel extension
5. ukázat threat feed
6. ukázat rewrite a revert
7. zakončit `Expected Results` sekcí

## Co zdůraznit poctivě
- MVP je reálné, ne jen obrazovky
- zásahy jsou reverzibilní
- inference je local-first
- produkt řeší novou obrannou vrstvu, ne jen další privacy plugin
