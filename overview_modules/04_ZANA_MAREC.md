# 4 Prototyp modula "_žana marěć_" finalizować

### Dieses Modul beinhaltet folgende Funktionalitäten:

-   Erkennung von **nicht**-jugendfreien Wörtern
-   Abweisung von Inhalten, die solche Wörter enthält
-   Erkennung von Bildern mit nicht-jugendfreien- , illegalen-, belästigenden Inhalten mittels künstlicher Intelligenz
-   Abweisung von Inhalten mit solchen Bildern

> [!IMPORTANT]
> Es erfolgt keine Zensur! Die Erkennung und Ablehnung der Inhalte erfogt (wie unter _03_AWTOMATISKE_PROLOZOWANJE_) im Backend auf dem Server.

## Übersicht der Dateien

```
pages/create/PostCreate.jsx
pages/create/EventCreate.jsx
pages/create/GroupCreate.jsx
```

## `pages/create/*.jsx`

Alle drei o.g. Dateien dienen zum Erstellen von Inhalten. Dabei werden Texte und Bilder auf anstößige und nicht wünschenswerte Inhalte nach dem abschicken mittels `makeRequest` in `publishPost` / `publishEvent` / `publishGroup` geprüft. Sollten unsere Systeme auf dem Server etwas Unerwünschtes erkennen, so wird der Vorgang des Veröffentlichens abgebrochen und das Request schickt einen Fehlercode zurück.

> [!NOTE]
> Alle Statuscodes und Fehlercodes befinden sich unter `constants/content/status.js`

#### Code `450` resp. `460`

Code 450 wird gesendet, wenn es einen allgemeinen Fehler beim Veröffentlichen von **Posts** gibt (resp. Code 460 beim Veröffentlichen von **Events**).

#### Code `451` resp. `461`

Code 451 wird gesendet, wenn verbotene oder negative Wörter erkannt wurden, die nicht den AGBs von `kostrjanc` entsprechen (resp. Code 461 beim Event).

#### Code `452` resp. `462`

Code 452 wird gesendet, wenn verbotene Inhalte bzw. Inhalte die nicht den AGBs von `kostrjanc` entsprechen auf Bildern zu sehen sind (resp. Code 462 beim Event).

<hr>

#### Last Updated 12.03.2024
