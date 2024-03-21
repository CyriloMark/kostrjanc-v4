# 12 Prototyp modula "_składowanje na lokalnej runinje wužiwarja_" korigować

### Dieses Modul beinhaltet folgende Funktionalitäten:

-   das Allgemeine effiziente und nachhaltige Verarbeiten und Speichern von Daten
-   Speicherung von Daten, die oft beansprucht werden im Cache der Clients
-   Verarbeitung von Prozessen mit so wenig wie möglichen Anfragen, sodass sodass der Datenverkehr für Server und Client minimal ist

## Übersicht der Dateien

```
constants/storage/index.js

pages/main/Landing.jsx
pages/main/UserProfile.jsx

pages/Post.jsx
pages/Event.jsx
pages/Profile.jsx

pages/create/PostCreate.jsx
pages/create/EventCreate.jsx
```

## Backend-Solutions zur Datensparung

Im Folgenden zählen wir die wichtigsten Backend Implementierungen auf, wodurch Daten und Anfragen an Firebase gespart werden:

-   Algorithmus auf der Startseite
    -   der Algorithmus wurde so gebaut, dass so wenig Anfragen an die Firebase Datenbank gesendet werden
    -   zusätzlich nutzt dieser Algorithmus das Effiziente Generieren von angepassten Benutzern für den Client (siehe Modul 09 Doporučenje wužiwarja)
-   Erstellung von Posts und Events
    -   Inhalte werden mittels Anfrage an das Backend erstellt
    -   $\to$ mehr Sicherheit und weniger Anfragen auf Firebase
-   "Zufälliger"- / Angepasster Benutze
    -   durch die Anfrage an das Backend kann intelligenter, schneller und sparsamer ein angepasster Benutzer für den aktuellen Client gefunden werden
-   Suche nach Benutzern
    -   bei der Suche wird _MeiliSearch_ verwendet
    -   zu Beginn haben wir unsere eigene Lösung für das Suche entwickelt
    -   $\to$ _MeiliSearch_ ist schneller und sicherer

## `constants/storage/index.js`

Diese Datei definiert genau die Funktionen zur Speicherung und zum Abfragen vom Cache. Diese Funktionen übernehmen genau folgende Funktionen:

```
storeData(key, value) { }
getData(key) { }
removeData(key) { }
hasData(key) { }
```

## `pages/main/Landing.jsx`

Hier werden die folgenden Daten beim Laden des Benutzers im Cache gespeichert:

-   **userId**: Benutzer-Id des Clients
-   **userData**: Daten des Benutzerprofils wie Liste der Follower oder URL zum Profilbild

## `pages/main/UserProfile.jsx`

Beim Öffnen der Seite wird zunächst überprüft, ob die Daten **userData** existieren. Falls ja, müssen diese nicht extra geladen werden. Anderenfalls werden diese geladen und ebenfalls in **userData** gespeichert. Beim Aktualisieren der Seite werden die Daten neu geladen und gespeichert.

## `pages/Post.jsx` und `pages/Event.jsx`

In beiden Fällen wird der Cache-Speicher zum Abschicken von Kommentaren und der Abfrage, ob es sich beim Ersteller um den Client handelt, genutzt.

Wird ein neu verfasster Kommentar veröffentlicht, wird die Funktion `publishComment` aufgerufen. Nach einigen Abfragen wird die **userId** aus dem Cache geladen und mit dieser weitergearbeitet.

Bei der Abfrage, ob es sich beim Ersteller des Inhaltes um den Client selbst handelt wird beim Öffnen der Seite die Funktion `getIfCreatorIsClient` aufgerufen. Diese lädt ebenfalls die Benutzer-Id aus dem Zwischenspeicher und vergleicht diese mit der Id des Erstellers des Inhaltet.

## `pages/Profile.jsx`

Auf der allgemeinen Profil-Seite für alle Benutzer wird auch zu Beginn die **userId** geladen (oder auch wenn nötig gespeichert), damit überprüft werden kann, ob es sich bei dem Profil um den Client selber handelt.

## `pages/create/PostCreate.jsx` und `pages/create/EventCreate.jsx`

In beiden Fällen werden die neuen Ids der Inhalte mittels der Funktion `addToLocalStorage` in die etwaigen Listen in **userData** gespeichert. So werden die neuen Inhalte auch gleich im Profil angezeigt, ohne dass man aktualisieren muss.

<hr>

#### Last Updated 21.03.2024
