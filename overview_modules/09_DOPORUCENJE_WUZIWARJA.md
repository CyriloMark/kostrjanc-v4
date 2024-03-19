# 9 Protyp modula "_doporučenje wužiwarja_" finalizować

### Dieses Modul beinhaltet folgende Funktionalitäten:

-   Das intelligente Vorschlagen von Benutzern denen der Client selbst am ehesten Folgen kann bzw. kennen kann
-   Visualisierung dieser Vorschläge
-   im "algoritmus za doporučenje serbskich wobsahow na hłownej strony" um Abwechslung von bekannten Gesichtern zu schaffen

> [!IMPORTANT]
> Der Algorithmus des tatsächtlichen Generieren der angepassten Benutzerliste geschiet im Backend. Die Visualisierung wird in diesem Abschnitt besprochen.

## Übersicht der Dateien

```
pages/main/Landing.jsx
pages/main/Content.jsx
```

#### `pages/main/Landing.jsx`

Alle Informationen zu der Implementierung der "zufällig" gewählten Benutzerinhalte im Algorithmus zum Vorschlagen obersorbischen Inhalte im Abschnitt [Algoritmus za doporučenje serbskich wobsahow na hłownej strony](./02_ALGORITMUS_DOPORUCENJE.md).

#### `pages/main/Content.jsx`

Diese Seite ist genau die `kostrjanc Studio`-Seite. Hier wird dem Benutzer einen angepasst gewählten Benutzer, denen er noch nicht folgt, angezeigt.

Diese Generierung der Benutzer erfolgt durch die zwei folgenden Funktionen: `getRandomUser` und `loadRandomUser`. Zu der konkreten Visualisierung nachher.

Die Funktion `getRandomUser` stellt zuerst sicher, dass bereits kein Prozess der Generierung läuft. Dann werden zwei Fälle unterschieden:

1. Es gibt keine bereits generierten Benutzer. Dann wird mittels `makeRequest` eine Anfrage an das Backend geschickt, die als Response ein Array an Benutzern zurückschickt. Dieses wird in der Variable `currentRandomUserList` gespeichert. Danach wird die zweite Funktion aufgerufen.
2. Wenn es bereits generierte Benutzer gibt, wird sofort die Funktion `loadRandomUser` aufgerufen.

Die Funktion `loadRandomUser` überprüft zuerst, ob die Liste der eben generierten Benutzerliste nicht leer ist. Die Liste selbst beinhaltet nur die Benutzer-Ids. Mit der ersten Id wird eine Anfrage an die Firebase Datenbank gesendet, die die Benutzerdaten zurückgibt. Ist der Benutzer nicht gebannt, so wird dieser in dem State `randomUser` gesetzt. Ist dieser Benutzer gebannt, wird die Funktion rekursiv aufgerufen; und oder ist die Liste der Benutzer leer, so wird der State `randomUser` auf `null` gesetzt. Standardmäßig ist dieses State `null`.

Bezüglich der Visualisierung kann genannt werden, dass sich als erstes _Child_ im `<ScrollView>` die Abfrage befindet, ob `randomuser` gleich `null` ist oder nicht. Ist dem so, so wird ein Hinweistext gezeigt. Ist `randomUser` ungleich `null`, so wird eine UserCard gezeigt mit dem Profilbild und dem Namen den Benutzers. Drückt man auf diese Karte, so wird man auf das Profil des Benutzers weitergeleitet. Auf iOS kann man auch von oben nach unten wischen, um die Seite zu aktualisieren. Dann wird ein neuer Benutzer mit `getRandomUser` generiert.

<hr>

#### Last Updated 19.03.2023
