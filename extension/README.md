# AI Bodyguard Extension Scaffold

Tato složka obsahuje první funkční kostru pro browser extension:

- `manifest.json`: MV3 manifest
- `background.js`: centrála mezi content skriptem a UI
- `content.js`: heuristický DOM scanner
- `sidepanel.html/css/js`: živý side panel pro logy, scan a analytics
- `inference-bridge.js`: volitelný bridge na lokální inference endpoint
- `../src/lib/ai-guard/contracts.ts`: sdílené typy pro threat flow, bridge requesty a audit trail

## Jak spustit

1. Otevři `chrome://extensions`
2. Zapni `Developer mode`
3. Klikni na `Load unpacked`
4. Vyber složku `E:\guard\extension`

## Typová kontrola

- `npm run typecheck:web` kontroluje Next app
- `npm run typecheck:extension` kontroluje MV3 vrstvu přes `@ts-check` + shared contracts
- `npm run typecheck` spouští obě kontroly

## Co to umí teď

- skenuje textové dark pattern heuristiky v navštívené stránce
- zvýrazní podezřelé prvky přímo v DOM
- drží hrozby per-tab v background workeru
- zobrazí live systémový side panel
- umí ručně vyžádat scan z aktivní karty
- má připravený typed inference bridge kontrakt pro lokální `Ollama` nebo custom endpoint

## Lokální inference bridge

Bridge je záměrně volitelný. Pokud není v `chrome.storage.local` uložená konfigurace `inferenceBridge`, extension zůstává v heuristickém režimu.

Příklad konfigurace z DevTools konzole v extension contextu:

```js
chrome.storage.local.set({
  inferenceBridge: {
    enabled: true,
    provider: "custom",
    endpoint: "http://127.0.0.1:8787/api/guard/evaluate",
    model: "llama3.1:8b",
    interventionMode: "rewrite",
    timeoutMs: 4000,
  },
});
```

Endpoint by měl přijmout payload podle `InferenceEvaluationRequest` a vrátit `InferenceEvaluationResponse`.

## Další rozumný krok

- nahradit heuristiky lokálním LLM přes Ollama / lokální inference vrstvu
- doplnit rewrite mód místo pouhého highlightu
- napojit side panel na React build místo vanilla panelu
- přidat audit trail a dom-level revert operace
