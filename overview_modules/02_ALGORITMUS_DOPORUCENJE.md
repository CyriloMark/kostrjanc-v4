# 2 Prototyp modula "_algoritmus za doporučenje serbskich wobsahow na hłownej strony_" finalizować

Der Algorithmus auf der Hauptseite befindet sich mittlerweile in der 4. Version.
Der Anfang der Arbeit an der vierten Version war Ende Dezember 2023.
Die dritte Version wurde aber erst Ende Februar abgelöst.

Daher ziehen wir in diesem Abschnitt die dritte Version dieses Algorithmus in Betracht. Daher nutzen wir hier den Stand vom 5. Januar 2024 [(GitHub-Link)](https://github.com/CyriloMark/kostrjanc-v4/tree/ad4e15e0d0673c44a112495f5bea7dc3856aba29).

> [!IMPORTANT]
> Die Versionen 1, 2 und 3 des Algorithmus zur Empfehlung der Inhalte sind schwer zu Verstehen und zu Lesen, da diese nicht in einzelnen Blöcken aufgeteilt wurden, sondern mehr

## Übersicht der Dateien

```
pages/main/Landing.jsx
```

## Aufruf des Algorithmus

Der Algorithmus wird in folgenden Szenarien aufgerufen:

1. beim Öffnen der Seite
2. wenn der Benutzer bis zu einer entsprechenden Stelle im `<ScrollView>` gescrollt hat
3. beim Aktualisieren der Seite

## Ablauf des Algorithmus

Dem Algorithmus werden folgende Parameter übergeben:

-   **\_id**: Benutzer-Id des Clients
-   **user**: Benutzerdaten vom Client
-   **updateBanners**: Bedingung, ob die Banner neu geladen werden müssen

Im Allgemeinen kann gesagt werden, ist **updateBanners** nur beim in den Fällen 1. und 3. gleich `true`, da dort alle Inhalte neu geladen werden. Hat der Benutzer bis zum Ende der aktuellen Inhaltsliste vorgescrollt, so bleiben ja die bisherigen Inhalte gleich, es werden nur neue Inhalte unten angefügt.

Der Algorithmus arbeitet so, dass dieser sich beim jeden Ladevorgang eine bestimmte Menge _Posts_ und _Events_ generiert. Davon ist dann ebenfalls eine bestimmte Anzahl von Benutzern, denen der Benutzer selbst nicht folgt.

Sind die Parameter **\_id** und **user** gleich `null`, so werden diese aus dem Cache geladen.

Der Algorithmus arbeitet _Posts_ und _Events_ getrennt voneinander ab. Deshalb werden die Attribute `hasPosts` und `hasEvents` zu beginn initialisiert.

Das Attribut `AMTs` muss lediglich einmal geladen werden. Dieses wird dann während der Nutzung von `kostrjanc` gespeichert. Dieses ist ein Array, welches folgende Werte besitzt:

```
[
    Anz. Posts insg.,
    Anz. Events insg.,
    Anz. Posts spez.,
    Anz. Events spez.,
    Anz. wurde geladen
]
```

Ist das letzte Element gleich `false`, dann werden diese Anzahlen aus Firebase geladen.

Im nächsten Block werden die Banner geladen. Ist `updateBanners` gleich `true`, dann werden die Banner direkt aus Firebase abgerufen und darauf überprüft, ob diese im Zeitrahmen liegen. Danach werden diese schon in das State `contentData` gesetzt.

Das State `contentData` hat die _Childs_ `banners` und `content`, wobei `banners` die Banner selbst sind und `content` die Inhalte _Posts_ und _Events_ zusammen vermischt.

Damals war noch das Problem, dass man im Fall, dass man niemanden folgte, keine Inhalte angezeigt bekommen hat.

Die Listen der _Posts_ und _Events_ werden in einem Attribut in der Hauptmethode gespeichert. Wie schon angesprochen, werden _Posts_ und _Events_ getrennt voneinander geladen. Der Ablauf ist aber sehr ähnlich.

Jeder Ablauf ist in zwei Etappen untergliedert: `getClientPosts` und `getRandomPosts`.

#### `getClientPosts`

In jedem Durchlauf werden nicht verwendete _Posts_ (und nachher auch _Events_) gespeichert und um für späteren Nutzung verwendet zu werden. Deshalb setzt man die aktuelle Liste der _Posts_ gleich der gesicherten _Posts_-Liste. Es werden auch die Benutzer-Ids von bereits geladenen Benutzern gespeichert, sodass Dopplungen vermieden werden. Es wird also auch die Liste der nicht verwendeten Ids aus den Benutzern, denen der Client folgt ausgefiltert.

Ist diese Liste leer und oder die Anzahl der gesicherten _Posts_ ist noch mehr als benötigt, so werden diese sofort dem Datum nach sotiert, auf die konkrete Menge (AMTs[0]-AMTs[2]) getrimmt und der Überschuss wird wieder gesichert. Danach wird zum nächsten Block übergegangen: `getRandomPosts`, die eine Liste der angepassten _Posts_ aus "zufällig" gewählten, neuen Benutzern, zurückgibt. Diese neuen _Posts_ werden den anderen _Posts_ einfach angefügt. Falls `hasEvents` gleich `true` ist, so wird der finale Block ausgeführt: `combinePostsAndEvents`, ansonsten wird `hasPosts` gleich `true` gesetzt.

Ist die o.g. Liste nicht leer und die gesicherten _Posts_ reichen nicht für einen erneuten Durchgang aus, so müssen neue _Posts_ geladen werden. Dann wird jeder Benutzer aus den vorhin gefilterten Following-Ids einzeln aus Firebase aufgerufen, speziell die _Posts_ dieser. Ist dieser Snap nicht leer, so werden die _Posts_ auf Duplikate überprüft und dann der Liste für _Posts_ zu den vorhin gesicherten zugefügt. Wurden alle Benutzer gefetcht, so wird die Liste der geladenen Benutzer aktualisiert und der selbe Ablauf wie schon im ersten Fall beschrieben durchgefürt.

#### `getRandomPosts`

Dieser Block ist eine _nested Function_ mit der Anzahl der _Posts_, die diese Funktion generieren soll als Parameter. Es werden ebenfalls bereits zufällig geladene _Posts_ für spätere Nutzung gesichert.

Ist diese Liste größer als Benötigt, so wird diese dem Datum nach sortiert, auf die richtige Größe getrimmt und der Überschuss wird wieder gesichert. Im Anschluss wird die Liste mittels `return` zurückgegeben.

Ist die Liste nicht groß genug, so müssen neue _Posts_ geladen werden. Das passiert wieder durch dem Benutzer angepasste Benutzerlisten. Diese Generierung ist konkreter im Abschnitt [09 Doporučenje wužiwarja](./09_DOPORUCENJE_WUZIWARJA.md). Ist diese Liste nicht leer so werden alle Benutzer durchgeloopt und die _Posts_ von denen geladen, und vorerst auf Duplikate überprüft. Danach werden ebenfalls die Benutzer-Ids in die Liste der benutzten Ids gespeichert. Diese Liste der _Posts_ wird gleich bearbeitet wie im o.g. Ablauf.

#### `getClientEvents` und `getRandomEvents`

Diese Abläufe sind im Grunde genau dieselben, nur dass zusätzlich zu jedem _Event_ überprüft wird, ob dieses nicht abgelaufen ist. Ansonsten ist der Ablauf gleich dem der _Posts_. Am Ende wird überprüft, ob `hasPosts` bereits `true` ist oder ob `hasEvents` auf `true` gesetzt werden muss.

Sind beide Abläufe fertig, so wird der finale Schritt eingeleitet, und zwar `combinePostsAndEvents`.

#### `combinePostsAndEvents`

Im Grunde funktioniert das Kombinieren so, dass sich die Liste der _Posts_ als Grundlage genommen wird und darin zufällig die _Events_ verteilt werden. Am Ende wird diese finale Liste in das State gesetzt.

<hr>

#### Last Updated 22.03.2024
