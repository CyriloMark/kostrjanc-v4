# 10 Protyp regulow kostrjanc finalizować

### Dieses Modul beinhaltet folgende Funktionalitäten:

-   Bereitstellung von einem angenehmen Klima für alle Benutzer und Benuterinnen von `kostrjanc`
-   Vorgabe von angebrachten Regeln zur Nutzung von `kostrjanc`
-   Die Moderation und Kontrolle, dass es zu keinem Verstoß der Regeln kommt
-   Die Möglichkeit, dass Benutzer diese Regeln kennen, akzeptieren können und Fragen stellen können
-   im Allgemeinen die Erhaltung der sorbischsprachigen Kommunikation auf `kostrjanc`

> [!IMPORTANT]
> Dieses Modul enthält eher weniger funktionalen Code. Dafür steht hier der Umgang der Benutzer, die Sicherheit anderer Benutzer und Benutzerinnen, und der Erhalt der sorbischsprachigen Kommunikation im Mittelpunkt.

## Übersicht der Dateien

```
pages/auth/Register.jsx
pages/settings/DataSecurityImpressum.jsx
```

#### Weitere Themen in diesem Abschnitt:

-   Sichterheit der Benutzer

## `pages/auth/Register.jsx`

Diese Seite ist im Allgemeinen die Registrierungsseite. Benutzer, die sich ein neues Konto auf `kostrjanc` anlegen wollen, kehren auf diese Seite hin.

Im Falle, dass man sich ein zweites Konto erstellen will:

-   in den Einstellungen findet man im letzten Abschnitt den _Button_ "ausloggen"
-   man wird aus seinem jetzigen Konto ausgeloggt und findet die App so wieder wie bei der ersten Benutzung
-   auf den _Button_ "Konto anlegen" drücken

Im fünften Abschnitt der Registrierung wird der Benutzer aufgefordert, sich die Allgemeinen Geschäftsbedingungen von `kostrjanc` sich durchzulesen und diesen zuzustimmen.

Der Nutzer ist verpflichtet, diesen zuzustimmen, damit er ein neues Benutzerkonto eröffnen kann.

Der Benutzer finden einen Link zur `kostrjanc`-[Website Impressum](https://kostrjanc.de/pages/impresum.html), wo sich die AGBs und die Regeln befinden.

Nach dem Akzeptieren kann der Registrierungsprozess fortgeführt werden.

## `pages/settings/DataSecurityImpressum.jsx`

Die Seite mit den Allgeminen Geschäftsbedingungen, dem Impressum und eben auch den Regeln von `kostrjanc` ist auch durch die Einstellungen erreichbar.

Diese Seite enthält die identischen Daten wie die o.g. Internetseite.

Durch diese Seite müssen Benutzer nicht mehr unbedingt die `kostrjanc` App verlassen, um die rechtlichen Informationen lesen zu können.

## Sicherheit der Benutzer

Die Sicherheit unserer Benutzer und Benutzerinnen steht auf aller erster Stelle. Um diese zu gewährleisten gibt es selbstverständlich die Regeln für die Nutzung von `kostrjanc`, auf die sich unsere Benutzer und Benutzerinnen halten müssen.

### Maßnahmen zum Erhalt der Sicherheit

Zur Prävention von Missbrauch haben wir die im Kapitel [04 Žana marěč](./04_ZANA_MAREC.md) thematisierten Sicherheitsvorkehrungen implementiert:

-   Wortfilter
-   Erkennung von verbotenen Inhalten auf Bildern

Weiter gibt es wie im Kapitel [06 Moderacija](./06_MODERACIJA.md) (Stand 13.03.2024 noch leer) angesprochen die Moderatoren und Admins. Diese besonderen Rollen teilen das Recht, Inhalte (Posts und Events) wie auch ganze Benutzerkonten zu bannen.

Sollte es trotzdem zum Verstoß der Regeln von `kostrjanc` kommen, haben alle Benutzer die Möglichkeit, Inhalte zu melden.

### Zusammenfassung

Um einen angenehmen Ort zur Kommunikation zu schaffen bietet `kostrjanc` die idealen Voraussetzungen. Damit aber Ordnung herrscht, gibt es trotzdem Regeln, die jeder Nutzer kennen soll, und auch akzeptiert hat.

Um Missbrauch vorzubeugen, bietet die App auch Sicherheitsmaßnahmen, wie die Kontrolle von Bildern mittels künstlicher Intelligenz.

Sollte es trotzdem mal zum Verstoß kommen, werden Benutzer diesen Inhalt melden und Moderatoren oder Admins werden diese Inhalte vernichten.

### Gute Nachrichten

Nach etwa 2,5 Monaten, wo `kostrjanc` schon Live ist konnten wir feststellen, dass es bis jetzt zu keinen Komplikationen kam, im Gegenteil, wir stellten fest, dass die Analyse der Bilder am Anfang oft falsch ausschlug, was behoben wurde.

<hr>

#### Last Updated 13.03.2024
