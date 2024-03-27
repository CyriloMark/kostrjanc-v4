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

## Video

Für dieses Modul ist ein kurzes Video verfügbar, in dem die Funktionalitäten gezeigt werden ([Zum Video](../assets/videos/05_dzelenje.mov)).

## Erklärung der Funktionalität

Um Inhalte durch die App zu Teilen gibt es mehrere Methoden. Bekannt ist schließlich auch die Art und Weise, dass eine URL geteilt werden kann und beim Drücken darauf wird die Ziel-App wieder geöffnet mit dem gewünschten Inhalt. In React-Native passiert das durch sogenannte Deep-Links.

Da diese Deep-Links in der Implementierung in Expo ziemlich kompliziert sind, und zu dem Zeitpunkt wo wir diese erstmalig Einbetten wollten haben wir mitbekommen, dass der Aufbau und die Übermittlung von Daten durch `routes` beim Öffnen von neuen Seiten in der App nicht für dieses Deep-Linking ausgelegt wäre. Darum musste eine Alternative her.

Die Alternative ist die folgende: Beim Teilen wird ebenfalls ein Link generiert und mit diesem kommt der Benutzer auf die [kostrjanc.de](https://www.kostrjanc.de) Website. Dieser Link hat den Typen des Inhaltes, also Post = p oder Event = e und die Id des Inhaltes als Parameter in der URL. Wird die URL im Browser geöffnet, so öffnet sich also nicht die kostrjanc-App, sondern die kostrjanc-Website.

Beim Öffnen werden die zwei Parameter (Typ und Id) extrahiert und es wird eine Anfrage an das kostrjanc-Backend mit diesen Informationen gesendet und zurück kommen die Daten des Inhaltes:

-   Titel
-   Beschreibung
-   Benutzername und Profilbild des Erstellers
-   beim Post URL des geposteten Bildes

Diese Daten bekommt der Benutzer im Browser nachgebiltet und zusätzlich steht die Information, dass es sich dabei um eine Vorschau handelt und dass sich alle Inhalte in der kostrjanc-App befinden.

## Aufbau der URL

Die URL hat immer denselben Aufbau. Diese URL wird direkt beim Betätigen des u.g. Teilen-_Button_ im Frontend erstellt. Diese hat einen statischen "linken" Teil `https://www.kostrjanc.de/pages/share.html` und hinzugefügt werden die Parameter `t=typ_des_Inhaltes` und `id=id_des_Inhaltes`. Ein Beispiel für so eine URL ist zum Beispiel:

```
https://www.kostrjanc.de/pages/share.html?t=p?id=1711361548922
```

PS: Beim Probieren hat die Seite knapp 5 Sek geladen, aber der Inhalt ist trotzdem erschienen. Also bitte kurz warten.

## `constants/share.js`

#### Funktionenen in autoCorrect.js

> [!NOTE]
> Anbei werden die folgenden Funktionen grob beschrieben. Tiefgründigere Erklärungen der Funktionalitäten und konkrete Erklärung von Return-Types, Input-Verarbeitungen, etc. findet man unter [share.md](../constants/CONSTANTS.md#sharejs-link)

```
share(type, id, title) { }
```

#### `share(type, id, title)`

Diese Funktion nimmt folgende Parameter:

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

#### Last Updated 26.03.2024
