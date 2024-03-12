# 5 Prototyp modula "_dźělenje wobsahow_" finalizować

### Dieses Modul beinhaltet folgende Funktionalitäten:

-   Die Möglichkeit _Posts_ und _Events_ mit einem Link zu Teilen
-   Der Link führt auf [kostrjanc.de](https://www.kostrjanc.de), wo der geteilte Inhalt (_Post_/_Event_) statisch dargestellt wird

> [!IMPORTANT]
> Die eigentliche _Magie_ geschieht auf [kostrjanc.de](https://www.kostrjanc.de).

## Übersicht der Dateien

```
constants/share.js

components/InteractionBar.js

pages/Post.jsx
pages/Event.jsx
```

## `constants/share.js`

#### Funktionenen in autoCorrect.js

> [!NOTE]
> Anbei werden die folgenden Funktionen grob beschrieben. Tiefgründigere Erklärungen der Funktionalitäten und konkrete Erklärung von Return-Types, Input-Verarbeitungen, etc. findet man unter [share.md](../constants/CONSTANTS.md#sharejs-link)

```
share(type, id, title) { }
```

#### `share(type, id, title)`

Diese Funktion nimmt folgende Paramter:

-   `type`: `0` für _Posts_ und `1` für _Events_
-   `id`: Die `id` des zu teilenden Inhaltes
-   `title`: Der Titel des Inhaltes

Mittels der Share API von React-Native öffnet sich das typische Fenster zum Teilen von Inhalten auf dem Handy des Benutzers. Als Ziel-URL wird ein statischer Teil der `kostrjanc`-Website-Domain verwendet und als Parameter werden dem Pfad noch `type` und `id` angefügt.

Die URL hat somit folgende Form:

```
STATIC_URL/share.html?type={type === 0 ? p : e}?id={id}
```

Das Fenster zum Teilen besitzt dann den Titel des Parameters `title`. Und beim Teilen wird dann noch eine passende Nachricht erstellt mit dem `title` und dem Link.

<hr>

#### Last Updated 12.03.2024
