# 8 Pomocna strona, datowy škit a impresum

### Dieses Modul beinhaltet folgende Funktionalitäten:

-   Bereitstellung des Impressums mit allen rechtlich relevanten Themen
-   Informationen zur Datenverarbeitung
-   Möglichkeit der Kontolöschung
-   Möglichkeit für das Senden von Feedback oder Fragen

> [!IMPORTANT]
> Dieses Modul enthält eher weniger funktionalen Code. Hier steht die Arbeit am Impressum, der Datenschutzerklärung und dem Schaffen von einer simplen Lösung für die Kommunikation zwischen Benutzer und Ersteller im Vordergrund.

## Übersicht der Dateien

```
// Rechtliche Informationen - AGB
pages/auth/Register.jsx
pages/settings/DataSecurityImpressum.jsx

// Kontoverwaltung
components/settings/index.js
pages/settings/Landing.jsx
pages/settings/Profile.jsx
```

> [!IMPORTANT]
> Das Impressum, die Datenschutzerklärung wie auch unsere **Regeln** für die Nutzung von `kostrjanc` befinden sich zusammen auf einer Seite. Daher spiegelt die Zustimmung unserer Allgemeinen Geschäftsbedingungen beim Registrierungsprozess genau die Zustimmung der drei o.g. Abschnitte wider.

## `pages/auth/Register.jsx` und `pages/settings/DataSecurityImpressum.jsx`

> [!NOTE]
> Bei der Erstellung der Dokumentation haben wir das Modul [10 Regule](./10_REGULE.md) vor diesem erstellt. Inhaltlich sind das Modul 10 Regule und genau dieses Unterthema sehr ähnlich. Daher würden wir gerne Dopplungen vermeiden.

## `constants/settings/index.js`

#### Funktionenen in translation.js

> [!NOTE]
> Anbei werden die folgenden Funktionen grob beschrieben. Tiefgründigere Erklärungen der Funktionalitäten und konkrete Erklärung von Return-Types, Input-Verarbeitungen, etc. findet man unter [index.md](../components/settings/COMPONENTS_SETTINGS.md#indexjs-link)

```
logout() { }
deleteAccount(uid, userData) { }

setServer(opt) { }
copyUIDToClipboard(uid) { }
refreshEventRanking() { }
```

#### `logout()`

Diese Funktion loggt einen Benutzer aus seinem Benutzerkonto aus.

Der Benutzer bekommt einen `Alert` mit dem Hinweis, dass dieser nach dem Bestätigen aus dem Benutzerkonto ausgeloggt wird. Nach der Bestätigung wird mittels der Funktion `signOut` mit `getAuth` als Parameter der Benutzer ausgeloggt. Diese Funktionen stammen wieder von Firebase.

Darüber hinaus werden die lokal speicherten Daten über den (aktuellen) Benutzer aus dem Cache gelöscht. Mehr dazu im Abschnitt [12 Składowanje na lokalnej runinje wužiwarja](./12_SKLADOWANJE_LOKAL.md).

#### `deleteAccount(uid, userData)`

Diese Funktion löscht den Eintrag des Benutzers und die Email-Adresse wird wieder freigeschaltet zum erneuten Registrieren. Sämtliche Daten von dem Benutzer werden jedoch nicht mehr zugänglich für andere Benutzer weiterhin gespeichert. Es wird ein seperater Eintrag für die Information, dass das Konto gelöscht wurde, zzgl. mit der Email-Adresse mitgespeichert.

Der Parameter `uid` übergibt die aktuelle Nutzer-Id. Somit muss man diese nicht ein weiteres mal fetchen. Der Parameter `userData` übergibt alle Daten des Benutzers aus der Datenbank. Somit kann man diese ebenfalls gleich verwenden und muss diese nicht nochmals sich aus der Datenbank abfragen.

Der Benutzer bekommt hierbei ebenfalls einen `Alert` mit der Warnung, dass alle Informationen gelöscht werden. Nach der Bestätigung muss der Benutzer nochmals zur Bestätigung ein zweites Mal zustimmen.

Nach zweimaliger Zustimmung werden in allen Einträgen von Benutzern, denen der akutelle Benutzer folgte, und umgekehrt die `userId` des aktuellen Benutzers aus der Datenbank gelöscht.

Danach wird in allen Posts und Events des Benutzers das Attribut `isBanned` auf `true` gesetzt. Somit ist der Inhalt für alle anderen Benutzer nicht mehr einsehbar.

Darüber hinaus wird das Attribut `isDeleted` im Eintag des Benutzers in der Datenbank auf `true` gesetzt und ein neuer Eintrag wird in `deleted_users` für den Benutzer erstellt. Dieser Eintrag umfasst ein _Timestamp_, die Email-Adresse des Benutzers, die mittels `getAuth().currentUser.email` geladen wird, und die Benutzer-Id.

Im Anschluss werden wie in `logout` die Cache-Daten gelöscht und das Benutzerkonto wird mit der Funktion von Firebase `deleteUser` mit dem aktuellen Benutzer als Parameter gelöscht.

War der Prozess erfolgreich, so bekommt der Benutzer auch die Information, wieder als `Alert`. Der Client wird ebenfalls automatisch wieder auf die Startseite weitergeleitet, wo dieser sich z.B. ein neues Konto erstellen kann.

> [!NOTE]
> Die folgenden Funktionen sind nicht unbedingt relevant für das Modul. Trotz alle dem folgt der Vollständigkeit halber die Erklärung dieser mit unter den anderen.

#### `setServer(opt)`

Diese Funktion wird nötig, falls ein Admin direkt vom Client aus den Zugriff für alle auf `kostrjanc` verweigern möchte. Zum Beispiel im Fall einer Hacking-Attacke. Mittels dieser Funktion kann man den Server auf `offline` oder auf `pause` setzen. Diese Option wird durch den Parameter mitgegeben.

Die Funktion selbst besitzt zwei `nested Functions` die die zwei Fälle abarbeiten. Ein `switch`-Operator unterscheidet zwischen den beiden Fällen und ruft die jeweilige Funktion ab.

In beiden Fällen muss der Admin zuerst bestätigen, dass dieser die Operation ausführen möchte. Nach der Bestätigen folgt eine Aufforderung, zur Sicherheit den Parameter `opt` wortwörtlich abzuschreiben und abzuschicken, also im Fall Server - Offline muss der Benutzer `offline` tippen, bzw. im Fall Server - Pause `pause`. Falls der eingegebene _String_ korrekt ist, wird in der Firebase Datenbank der Eintrag `status` auf den neuen Status gesetzt.

Im Fall `offline` ist das einfach `offline`.

Der Fall `pause` hat einen zusätzlichen Schritt. Und zwar muss der Benutzer zusätzlich eine geschätzte Zeit eingeben, wie lange der Server nicht zugänglich ist. Der Eintrag von `status` bekommt dann folgenden Wert:

```
pause/{die eingegebene Zeit}/{der aktuelle Zeitpunkt bzw. Date.now()}
```

#### `copyUIDToClipboard(uid)`

Diese Funktion dient dazu, die Nutzer-Id, die über den Parameter übergeben wird, in die Zwischenablage zu kopieren.

Das Kopieren geschieht durch die Funktion `setStringAsync` mit dem Parameter als Parameter. Diese Funktion stammt von dem _Package_ `expo-clipboard`. Danach bekommt der Benutzer zusätzlich noch einen `Alert` für die Bestätigung der Kopie.

#### `refreshEventRanking()`

Diese Funktion ist wieder nur für Admins und Moderatoren zugänglich. Nach dem Aufruf wird das Ranking der Events, welches auf der Content-Seite zu finden ist, neu berechnet und gesetzt.

Der Benutzer bekommt zuerst einen `Alert` mit dem Hinweis, dass das Event-Ranking aktualisiert wird. Nach Bestätigung wird ein _Request_ mittels `makeRequest` an das `kostrjanc`-Backend gesendet. Das Backend behandelt zu 100% das Berechnen des Event-Rankings. Ob das Berechnen erfolgreich war oder nicht, wird als _Response_ vom Server zurückgesendet und wieder als `Alert` als Hinweis dem Nutzer mitgeteilt.

## `pages/settings/Landing.jsx`

Diese Seite ist die Startseite der Einstellungen. Hier findet man alle Unterpunkte der Einstellungen, darunter auch das Impressum mit den Regeln und der Datenschutzerklärung. Die Einstellungen sind unterteilt in drei Abschnitte: Applikation, Über kostrjanc und Konto. Die o.g. Funktionen sind alle lediglich relevant für den dritten Abschnitt.

Der Abschnitt Konto bietet folgende Möglichkeiten:

-   Profil anzeigen mit allen Daten
-   aus dem Konto ausloggen
-   Konto löschen

"Profil anzeigen" ist eine Schaltfläche mit dem Profilbild des Benutzers links und rechts steht der Benutzername gefolgt von der Nutzer-Id. Tippt man auf diese Schaltfläche wird man auf eine seperate Seite weitergeleitet: Profil (`pages/settings/Profile`, [zum Abschnitt](#pagessettingsprofilejsx)).

"aus dem Konto ausloggen" und "Konto löschen" sind zwei _Buttons_, konkret zwei `<OptionButton>` mit dem Attribut `red={true}` ([OptionButton.md](../components/COMPONENTS.md#optionbutton-link)). Beide zeigen jeweils ein passendes Icon und den passenden Text. Durch ein Tippen auf diese wird die etwaige o.g. Funktion aufgerufen. Beim ersten also `logout` und beim zweiten `deleteAccount`.

Bei `deleteAccount` werden die beiden Paramter jeweils als _Childs_ in einem State `userData` gesetzt. Dieses ist zu Beginn mit Platzhalter-Daten gefüllt. Mittels dem `useEffect`-Hook wird eine Funktion `getUserData` aufgerufen, um die Benutzerdaten zu laden. Diese Funktion lädt die Benutzerdaten aus dem Cache und setzt diese in den State. Mehr dazu wieder im Abschnitt [12 Składowanje na lokalnej runinje wužiwarja](./12_SKLADOWANJE_LOKAL.md).

## `pages/settings/Profile.jsx`

Diese Seite dient der Feststellung aller Daten des aktuellen Benutzers für den Nutzer selbst.

Mittels `react-navigation` kann man der `navigate` Funktion noch als Parameter übergeben und als `route`-Prop auf der neuen Seite abfangen. Hierbei werden `uid` und `userData` mit übergeben, also dieselben Parameter wie für das Löschen von Konten. So kann man die Daten ganz einfach weiterverwenden, ohne diese ein neues Mal abfragen zu müssen.

Auf der Seite befindet sich als erstes dieselbe Schaltfläche, die den Benutzer vorher auf diese Seite gebracht hat. Drückt man lange auf diese wird die Funktion `copyUIDToClipboard` aufgerufen. Unter dieser befindet sich ein _Button_ damit man sein Profil bearbeiten kann.

Darauf folgt der eher Interessante Teil für dieses Modul. Der Benutzer findet hier eine Liste aller seiner Benutzerdaten:

-   Benutzername
-   User-Id
-   Profilbeschreibung
-   Anzahl der Followern
-   Anzahl der Konten, denen der Benutzer folgt
-   Anzahl veröffentlichter Posts
-   Anzahl veröffentlichter Events
-   List der Ids der veröffentlichten Posts
-   List der Ids der veröffentlichten Events
-   Gebannt
-   Moderator
-   Admin

Unter dieser Aufzählung befindet sich ein normaler `<OptionButton>` mit der Möglichkeit diese Daten in die Zwischenablage zu kopieren. Dabei wird die Funktion `copy` aufgerufen. Diese Funktion formatiert die o.g. Daten in einen _String_ und kopiert diese mit `setStringAsync` in die Zwischenablage. Als Rückmeldung erscheint wieder ein `Alert`.

Darauf folgen nochmals dieselben _Buttons_ um sich auszuloggen bzw. sein Konto zu löschen mit denselben Funktionalitäten.

<hr>

#### Last Updated 14.03.2024
