# AEGIS
## Investor Brief

Datum: 28. 4. 2026  
Doména: `https://aegis.d-international.eu`  
Produktové jméno: `AEGIS`  
Produktová větev: `Protokol: Aegis`

## 1. Jednověté shrnutí
AEGIS je local-first AI obranná vrstva pro web, která detekuje manipulační vzorce v rozhraní, přepisuje nátlakové prvky do neutrální podoby a vrací uživateli kontrolu nad pozorností, soukromím a rozhodováním.

## 2. Co je problém
Současný web je optimalizovaný pro konverzi, ne pro uživatele.

To se prakticky projevuje takto:
- rozhraní používají urgency, scarcity a confirmshaming
- cookie bannery jsou často asymetricky navržené
- reklamní a tracking vrstva vytváří tlak i tam, kde ji uživatel nevnímá
- běžné privacy nástroje řeší síť, bannery nebo cookies, ale neřeší psychologickou manipulaci jako celek

Důsledek:
- vyšší kognitivní zátěž
- nižší důvěra v digitální prostředí
- slabší kontrola nad rozhodováním
- vyšší pravděpodobnost ukvapených nebo nevýhodných kroků

## 3. Co AEGIS řeší
AEGIS funguje jako "obranná vrstva nad webem", ne jen jako další adblock.

Jádro řešení:
- stránku čte jako útokový povrch
- detekuje manipulační patterny v textu, vizuálu a chování stránky
- umí bezpečně zasáhnout do DOMu
- drží zásah auditovatelně
- umožňuje revert

Produktové pilíře:
- `detekce` manipulačních patternů
- `rewrite` tlakových textů do neutrální podoby
- `suppression` urgency efektů bez rozbití layoutu
- `cookie override` pro srozumitelnější consent flow
- `revert DOM` pro vratitelnost zásahu
- `lokální inference` přes AEGIS endpoint a volitelně Ollama backend

## 4. Proč je to důležité právě teď
Timing je silný ze tří důvodů:

- AI zvyšuje objem i přesnost manipulačních UI patternů
- local inference je dnes technicky proveditelná i mimo cloud
- privacy a důvěra v digitální prostředí přestávají být okrajové téma

AEGIS stojí na průniku těchto trendů:
- privacy by default
- local / on-prem AI
- digital wellbeing
- důvěryhodná AI obrana

## 5. Co je dnes opravdu hotové
AEGIS už není jen vizuální koncept.

Aktuální MVP obsahuje:
- veřejný produktový web na `aegis.d-international.eu`
- produktové sekce a architekturu `Protokol: Aegis`
- analytickou vrstvu `Expected Results` přímo v AEGIS experience
- browser extension scaffold v Manifest V3
- typed contracts mezi content skriptem, background workerem, sidepanelem a inference bridge
- heuristický content scanner
- první reálné DOM zásahy:
  - rewrite
  - urgency suppression
  - cookie banner normalization
  - revert DOM
- lokální endpoint `/api/aegis/evaluate`
- fail-soft inference flow:
  - když běží Ollama, použije se lokální model
  - když neběží, systém přejde do AEGIS local policy fallbacku

## 6. Co ještě hotové není
Tohle je důležité říct poctivě:

- není to ještě distribuovatelná production extension verze
- nemáme ještě uzavřený product-market fit
- nemáme zatím produkčně validovanou precision/recall metriku modelu
- unpacked Chrome flow ještě potřebuje formální end-to-end ověření
- enterprise audit a governance vrstva je ve roadmapě, ne v hotové verzi

## 7. Proč to není "jen další adblock"
Adblock blokuje reklamní a síťové artefakty.  
AEGIS interpretuje úmysl rozhraní.

To je zásadní rozdíl:
- `adblock`: blokuje prvky
- `privacy tool`: omezuje tracking
- `AEGIS`: čte stránku jako rozhodovací prostředí a chrání samotný úsudek uživatele

To z AEGIS dělá základ nové kategorie:
`cognitive defense software`

## 8. Kde je obchodní potenciál
AEGIS může být monetizovaný ve třech liniích:

### B2C
- freemium extension
- placený pro režim:
  - advanced rewrite
  - AI explanation
  - session history
  - audit log

### B2B / teams
- týmové licence
- interní ochrana zaměstnanců v citlivých workflow
- bezpečnostní / compliance / wellbeing scénáře

### Enterprise / on-prem
- local inference
- policy-driven zásahy
- audit export
- fleet deployment

## 9. Co je moat
Moat není jen design nebo branding. Je to kombinace:

- local-first inference architektury
- typed intervention modelu `flag / rewrite / block / revert`
- budoucího datasetu manipulačních patternů v češtině a dalších jazycích
- auditovatelnosti zásahu
- jasného positioning "AI obrana proti manipulaci"

Největší síla produktu je v tom, že je současně:
- privacy-oriented
- intervention-capable
- AI-native
- auditovatelný

## 10. Odhadovaný produktový dopad
V embedded analytické vrstvě AEGIS dnes pracujeme s orientační modelovou projekcí:
- efektivita: `+145 %`
- snížení kritických rizik: `-88 %`
- předpokládaný break-even: `4,5 měsíce`

Tyto hodnoty nejsou zatím produkčně validovaná traction data.  
Jsou to modelové scénáře pro prezentaci očekávaného dopadu a ekonomiky řešení.

## 11. Roadmapa na dalších 6-12 měsíců
### Krátkodobě
- ověřit unpacked Chrome flow end-to-end
- napojit live threat feed na skutečná runtime data
- dotáhnout audit trail a export
- připravit demo s lokální Ollama inference

### Střednědobě
- připravit dataset manipulačních patternů
- rozšířit intervention model o řízený `block`
- zavést vault / quarantine historii
- otestovat první B2C a design-partner scénář

### Dlouhodobě
- cross-browser support
- enterprise distribution
- policy engine pro organizace
- session-level cognitive defense

## 12. Největší rizika
Transparentně:

- product-market fit se musí teprve potvrdit
- false positives musí být velmi dobře zvládnuté
- zásahy do DOMu budou vždy citlivé na variabilitu webů
- enterprise adoption bude vyžadovat silné governance a audit schopnosti

## 13. Investiční teze
Pokud vznikla vrstva pro blokaci reklam a vrstva pro blokaci trackerů, další logická vrstva je obrana proti manipulaci samotného rozhodovacího prostředí.

AEGIS se nesnaží jen "vylepšit UX".  
Snaží se otevřít novou kategorii:
`software, který chrání lidský úsudek v digitálním prostředí`

## 14. O co si říkáme
Pro investory je vhodné formulovat ask jako:

- kapitál na dotažení MVP do distribuovatelné extension verze
- finance na validaci user demand a pilotní adopci
- rozpočet na inference kvalitu, dataset a enterprise-grade audit layer

Praktické rámování:
- pre-seed / seed
- pilot capital
- strategický design partner + validace

## 15. Co říct v jedné minutě
"AEGIS je AI obranná vrstva pro web, která neřeší jen reklamu nebo tracking, ale samotný mechanismus, jak internet manipuluje pozornost a rozhodování. Dnes už máme funkční MVP stack: browser extension, sidepanel, typed intervention flow, první reálné DOM zásahy, lokální inference endpoint a revert. Další krok je z toho udělat distribuovatelný produkt a ověřit, že z privacy nástroje vzniká nová kategorie: cognitive defense software."

## 16. Co v prezentaci nepřehánět
Neříkat:
- že je produkt enterprise-ready
- že je model validovaný na produkčních datech
- že už máme hotový product-market fit
- že je to hotová bezpečnostní platforma

Říkat poctivě:
- MVP je reálné, ne jen design
- zásahy jsou reverzibilní
- inference je local-first
- produkt řeší problém, který dnešní privacy tooling řeší jen částečně
