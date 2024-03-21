# 6 Protyp modula "_moderacija/přizjewjenje wobsahow_" finalizować

### Dieses Modul beinhaltet folgende Funktionalitäten:

-   Die Möglichkeit, dass Inhalte, die nicht den Regeln angepasst sind, gemeldet oder sogar gebannt werden
-   Die Bildung von Benutzerrollen und die Regelung der Erteilung dieser Rollen
-   Meldungen an einem zentralen Ort für berechtigte Benutzer anzeigen

> [!IMPORTANT]
> Für Moderatoren und Admins existiert ein externes Dashboard zum Bearbeiten von Meldungen. Das Dashboard ist erreichbar unter [dashboard.kostrjanc.de](https://dashboard.kostrjanc.de).

## Übersicht der Dateien

```
constants/content/PlaceholderData.js
constants/content/report.js

pages/interaction/Report.jsx
pages/interaction/Ban.jsx

pages/static/Ban.jsx
```

## Video

Für dieses Modul ist ein kurzes Video verfügbar, in dem die Funktionalitäten gezeigt werden ([zum Video](../videos/06_moderacija.mov)).

## `constants/content/PlaceholderData.js`

In dieser Datei werden typische Datenstruckturen mit ihren Komponenten definiert. Unter anderem sind hier `Report` und `Ban` definiert. Also hier wird definiert, wie ein Eintrag von einem `Report` resp. `Ban` in der Datenbank ausschaut.

## `constants/content/report.js`

In dieser Datei findet man lediglich eine Liste aller möglichen Auswahltypen für eine Meldung.

> [!NOTE]
> Um auf die im Folgenden beschriebenen Seiten zu landen muss man die dazugehörigen _Buttons_ in der `<InteractionBar>` drücken. Siehe [05 Dźělenje wobsahow](./05_DZELENJE_WOBSAHOW.md).

## `pages/interaction/Report.jsx`

Auf dieser Seite können Nutzer Inhalte melden. Die Seite ist in 4 Bereiche aufgeteilt:

1. Überschrift
2. Auswahl des Typs des Problems
3. Bereich, um einen Text einzugeben
4. _Button_ zum Absenden

Der Titel beinhaltet den Titel des Inhaltes. Bei der Auswahl des Typs stehen diejenigen Elemente aus `pages/content/report` zur Verfügung. Der Benutzer kann genau ein Element auswählen. Under the Hood steckt hier ein `<SelectbableButton>` und die aktuelle Auswahl wird in einem State gesetzt, welche Standardmäßig das _Placeholder_-Element vom _Report_ ist. Die darauf folgende Beschreibung ist ein `<TextField>` und der Inhalt wird auch im selben State gesetzt. Sind die nötigen Informationen ausgefüllt, so wird der _Button_ zum Abschicken undurchsichtig. Standardmäßig ist dieser transparent. Wird auf diesen gedrückt, wird die Funktion `report` aufgerufen.

Die Funktion `report` stellt erstmal sicher, dass bereits kein Meldeprozess aktiv ist. Ist dem nicht so, so wird mittels `makeRequest` eine Anfrage an das Backend gesendet mit den soeben angebenen Informationen und der Id des Inhaltes gesendent. Das Ergebnis wird dem Benutzer als `Alert` mitgeteilt und der Benutzer wird auf die Seite des Inhaltes zurückgeleitet.

## `pages/interaction/Ban.jsx`

> [!IMPORTANT]
> Diese Seite ist nur für Admins und Moderatoren zugänglich.

Die Seite zum Bannen von Inhalten ist identisch zur Report-Seite, nur dass diese keine Optionen zur Typ-Auswahl hat. Beim Betätigen des _Buttons_ zum Abschicken wird die Funktion `ban` aufgerufen.

Diese Funktion checkt auch erstmal, ob nicht bereits der _Button_ gedrückt wurde. Dann bekommt der Benutzer einen Hinweis, ob dieser sich sicher ist, dass dieser Inhalt gebannt werden soll. Wird dem zugestimmt, so bekommt der Inhalt in der Firebase-Datenbank eine _Flag_ `isBanned` mit dem Wert `true`. Handelt es sich hierbei um einen ganzen Benutzer, so werden alle Inhalte einzelnd gebannt und danach der Benutzer selbst.

## `pages/static/Ban.jsx`

Diese Seite bekommt man normalerweise nie zu sehen, wenn man sich artig auf `kostrjanc` verhält.

Ist ein Benutzerkonto mit dem Flag `isBanned` gleich `true` versehen, so wird dieser nur noch diese Seite zu Sehen bekommen. Diese Seite zeigt den Hinweis, dass das Benutzerkonte gesperrt wurde, und einen Hinweis, wo man Hilfe bekommen kann.

## Moderatoren und Admins

Auf `kostrjanc` unterscheidet man zurzeit zwei resp. drei Benutzerrollen:

-   Admins
-   Moderatoren
-   (Benutzer ohne Rolle)

Für die ersten zwei Rollen werden etwaige _Icons_ im Profil neben dem Namen angezeigt. Nur Admins und Moderatoren haben Zugriff auf das `kostrjanc Dashboard`.

#### Admin

Admins sind die Chefs auf `kostrjanc`. Diese Rolle besitzen lediglich Cyril, Korla und der Admin-Account selbst. Mit dieser Rolle kann man Inhalte bannen, Benutzer bannen und den Server regulieren.

#### Moderatoren

Moderatoren sind "schwächere" Admins. Diese können auch Inhalte und Benutzer bannen, aber können nicht den Server regulieren.

#### Benutzer ohne Rolle

Jeder neu Registrierte Benutzer "besitzt" diese Rolle. Mit dieser Rolle kann man weder Inhalte und Benutzer bannen, noch den Server regulieren.

#### Warum Benutzerrollen?

Es gibt Benutzerrollen, damit nicht jeder Benutzer die Möglichkeit hat Inhalte zu bannen oder sogar den Server auf offline zu setzen. Das Risiko, dass diese Rechte ausgenutzt werden ist zu groß.

Darüber hinaus sind diese Rollen nötig, da so schnell und einfach Inhalte, die nicht erwünscht sind, entfernt werden können.

<hr>

#### Last Updated 21.03.2024
