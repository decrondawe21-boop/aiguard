# AEGIS
## Q&A Pack for Tomorrow

Datum: 28. 4. 2026

## Investor Q&A

### Co přesně AEGIS prodává?
AEGIS prodává obrannou vrstvu nad webem, která chrání uživatele před manipulačním rozhraním, tlakem na rozhodování a agresivním consent/tracking designem.

### Proč to není jen adblock?
Protože adblock řeší hlavně síťové a vizuální artefakty. AEGIS řeší interpretaci úmyslu rozhraní a zásah do manipulačních patternů.

### Kdo je první zákazník?
Nejrychlejší wedge je B2C privacy/security extension uživatel. Komerčně nejzajímavější dlouhodobý směr je team a enterprise mode pro citlivé a regulované prostředí.

### Jaká je monetizace?
- freemium extension
- pro vrstva s AI explainability a advanced interventions
- team license
- enterprise on-prem / policy mode

### Jaký je moat?
Moat je kombinace local-first inference, typed intervention modelu, auditovatelnosti a budoucího datasetu patternů. Samotný UI design moat netvoří.

### Jaké je hlavní riziko?
Největší riziko je přesnost zásahů a validace product-market fit. Pokud by produkt dělal příliš mnoho false positives, naruší důvěru.

### Proč teď?
Protože se potkávají tři trendy: privacy pressure, local inference feasibility a růst AI-driven manipulačních patternů.

### Co je dnes hotové a co je roadmapa?
Hotové je MVP web + extension stack + první zásahy + local endpoint + revert. Roadmapa je distribuovatelná verze, audit export, dataset a enterprise policy layer.

### Co hledáte od investora?
Kapitál a validaci. Konkrétně prostředky na produktizaci extension vrstvy, inference kvalitu, piloty a auditovatelnou enterprise vrstvu.

## Developer / CTO Q&A

### Kde běží AI?
Primárně lokálně přes `/api/aegis/evaluate`, s podporou Ollama backendu a fail-soft fallbackem na lokální policy engine.

### Jak vypadá flow?
`content.js` detekuje patterny, `background.js` je ukládá per-tab, sidepanel je zobrazuje a inference bridge může vrátit doporučené zásahy.

### Co je typed?
Threat model, runtime messages, inference request/response i audit trail jsou definované ve sdílených kontraktech.

### Jak řešíte revert?
Každý zásah ukládá originální stav do `data-*` atributů. `Revert DOM` vrátí původní text/styl a označí element jako reverted do reloadu.

### Jak řešíte false positives?
Konzervativně. Preferujeme rewrite a suppression před tvrdým block režimem, držíme audit log a dáváme možnost revertu.

### Je to cloud-first?
Ne. Strategický směr je local-first a on-prem friendly.

### Je už hotový block mode?
Kontraktově ano, produktově ne. Dnes je reálně použitý hlavně rewrite a suppression flow.

### Co je další technický milestone?
End-to-end extension ověření v Chrome, real threat feed, audit export a rozhodnutí finální inference policy.

### Máte už dataset?
Ne jako uzavřenou produkční assetovou vrstvu. Dataset patternů v češtině je explicitně v roadmapě.

## Nepříjemné otázky a bezpečné odpovědi

### "Není to přehnané? Nestačí adblock a cookie plugin?"
Neřeší. Tyto nástroje pomáhají proti části problému, ale nečtou semantický ani psychologický tlak rozhraní jako celek.

### "Jak zabráníte tomu, aby produkt nerozbíjel weby?"
Zásahy jsou záměrně konzervativní, reverzibilní a aktuálně orientované na bezpečné DOM úpravy bez agresivního layoutového zásahu.

### "Co když lokální model nebude dostatečně přesný?"
Proto je systém navržený s fallbackem, audit trail vrstvou a postupným escalation modelem místo slepé závislosti na jednom inference runtime.

### "Je to spíš security produkt nebo wellbeing produkt?"
Oboje, ale vstupní positioning je obrana proti manipulaci. Právě ten dává smysl jak pro jednotlivce, tak pro regulovanější prostředí.

## Co si hlídat při odpovědích
- netvrdit production-readiness tam, kde ještě není
- nemluvit o validovaných datech, která zatím nejsou
- vždy oddělit `MVP dnes` vs `roadmapa zítra`
- držet AEGIS jako kategorii "cognitive defense", ne jako obecný AI browser helper
