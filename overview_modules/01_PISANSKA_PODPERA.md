# 1 Prototyp modula "_pisanska podpěra za serbšćinu_" finalizować

### Dieses Modul beinhaltet folgende Funktionalitäten:

-   Erkennung und Korrigierung Rechtschreibfehler und Tippfehler auf Obersorbisch in Echtzeit
-   Eingeschrenktes Vorschlagen von Wörtern
-   `iOS`: Beim Tippen erscheinen über der Tastatur alle Obersorbischen diakritischen Zeichen, die zum Schreiben von Texten verwendet werden können

## Übersicht der Dateien

```
constants/content/autoCorrect.js

components/InputField.js
components/TextInput.js

components/AccessoryView.js
```

## Video

Für dieses Modul ist ein kurzes Video verfügbar, in dem die Funktionalitäten gezeigt werden ([zum Video](../videos/01_pisanska_podpera.mov)).

## `constants/content/autoCorrect.js`

#### Funktionenen in autoCorrect.js

> [!NOTE]
> Anbei werden die folgenden Funktionen grob beschrieben. Tiefgründigere Erklärungen der Funktionalitäten und konkrete Erklärung von Return-Types, Input-Verarbeitungen, etc. findet man unter [autoCorrect.md](../constants/content/CONSTANTS_CONTENT.md#autocorrectjs)

```
getCurrentWord() { }
getCursorPosition(word1, word2) { }
checkForAutoCorrect(input) { }
checkForAutoCorrectInside(input, selection) { }
```

#### `getCurrentWord()`

Funktion, die aus einem Input-String das letzte Wort extrahiert und zurückgibt. Diese Funktion wird in einer anderen Funktion aufgerufen.

#### `getCursorPosition(word1, word2)`

Diese Funktion nimmt als Input einen vorhergehenden _String_ und einen neuen _String_ und vergleicht diese auf die Änderung der Cursorposition. Die Funktion gibt die neue Cursorposition zurück.

#### `checkForAutoCorrect(input)`

Diese Funktion nimmt als Input die aktuelle Texteingabe.
Aus dieser wird das aktuell letzte Wort mittels `getCurrentWord()` extrahiert. Falls dieses Wort länger als 2 Zeichen hat wird ein Request mittels [`makeRequest`]() an das `kostrjanc`-Backend geschickt. Falls kein Fehler gefangen wird kommt als Rückgabewert eine Liste an Wörtern, die diese Funktion mit dem entsprechenden Rückgabecode zurückgibt.

#### `checkForAutoCorrectInside(input, selection)`

Diese Funktion ist eine Erweiterung der `checkForAutoCorrect(input)` Funktion. Diese nimmt als Parameter die aktuelle Texteingabe und eine Zahl der aktuellen Position des Cursors ein. Der Eingabetext wird dann an der Position des Cursors abgeschnitten und `checkForAutoCorrect(input)` wird mit dem linken Teil des Substrings abgerufen und zurückgegeben.

### Implementierung

> [!NOTE]
> Eine Liste aller Implementierungen von der automatischen Korrektur befindet sich unter der o.g. tiefgründigeren Beschreibung.

Anbei wird die Implementierung aus `pages/create/PostCreate.jsx` beschrieben. Die Implementierung in allen anderen Fällen erfolgt auf identischer Art und Weise.

Folgende Schritte beinhaltet die Implementierung:

-   `import` der Funktionen
-   Setzen des Attributs `cursorPos` für die akutelle Cursorposition gleich -1
-   Initialisierung des States `[autoCorrect, setAutoCorrect]` gleich der leeren Menge der Rückgabemenge der Funktionen
-   Konkret im Beispiel unter `<InputField>` und `<TextInput>` befinden sich die Attribute `supportsAutoCorrect`, `onSelectionChange`, `onChangeText`, `autoCorrection` und `applyAutoCorrection`

`import`, das Setzen von `cursorPos` und das Attribut für den State von autoCorrect sind trivial.

Eher wichtiger ist die Erläuterung der Funktionen in den beiden Komponenten.

> [!NOTE]
> Die Implementierung der o.g. Funktionen in `<InputField>` und `<TextField>` ist technisch dieselbe.

#### `supportsAutoCorrect`

Dieses Attribut ist vom Typ _boolean_ und gibt an, ob diese Texteingabe die automatische Korrektur unterstützt oder nicht.

#### `onSelectionChange`

Dieses Attribut ist eine Callback-Funktion aus der direkten Implementierung von React-Native und wird aufgerufen, wenn der Cursor sich bewegt bzw. die Auswahl im allgemeinen sich ändert. Wenn diese Funktion aufgerufen wird, passieren folgende Aktionen:

-   das Attribut `cursorPos` wird mittels `getCursorPosition` auf die neue Position gesetzt
-   es werden mittels `checkForAutoCorrectInside` neue Wörter für die automatische Korrektur ermittelt und das Ergebnis wird in das State `autoCorrect` gesetzt

#### `onChangeText`

Dieses Attribut ist ebenfalls eine Callback-Funktion von React-Native.
Diese wird aufgerufen, wenn sich die Texteingabe ändert. Es passieren folgende Aktionen:

-   das Attribut `cursorPos` wird mittels `getCursorPosition` auf die neue Position gesetzt
-   der Inhalt des Textes wird im entsprechenden State gesetzt (konkret im Beispiel der Titel wird in das `post` State gesetzt)
-   es werden mittels `checkForAutoCorrectInside` neue Wörter für die automatische Korrektur ermittelt und das Ergebnis wird in das State `autoCorrect` gesetzt

#### `autoCorrection`

Dieses Attribut ist eine Referenz zu allen aktuellen Wörtern, die für die automatische Korrektur vorgesehen sind. Das Attribut bekommt das State `autoCorrect` übermittelt, sodass dieses die Wörter anzeigen kann, konkret im dafür vorgesehenen Abschnitt.

#### `applyAutoCorrection`

Dieses Attribut ist eine Callback-Funktion, wie wir selber implementiert haben. Diese wird aufgerufen, sobalt der Benutzer auf ein Wort aus der List der automatischen Korrektur drückt, welches geändert werden soll. Der State des zu ändernden Wertes wird folgendermaßen bearbeitet:

-   Sei `t1` folgende Liste: aus dem State wird der aktuelle Wert der Eingabe abgerufen und wird wortweise aufgetrennt, d.h. man erhält eine Liste aller einzelnen Wörter der Texteingabe
-   Sei `t2` dasselbe nur dass vorerst die Texteingabe auf die Länge der aktuellen Cursorposition gekürzt wurde
-   der letzte Eintrag aus `t2` wird ersetzt mit dem neuen Wort
-   mit `t1` und `t2` wird nun ein kombinierter Text für den neuen Wert wirder kreiert
-   der State von `autoCorrect` wird wieder auf die leere Menge gesetzt
-   es wird der State des zu ändernden Wertes auf den neuen gesetzt

### Zusammfassung

Mittels der Funktionen in `constants/content/autoCorrect.js` können ausgehend von einer Texteingabe und der aktuellen Position des Cursors Wörter vorgeschlagen werden, die als Korrektur vorgesehen werden.

## `components/InputField.js` und `components/TextInput.js`

Nun haben wir mit der Implementierung der automatischen Korrekur bereits ziemlich vorgegriffen. Anbei folgt eine kurze Beschreibung der beiden Komponenten.

`<InputField>` ist eine einzeilige Eingabemöglichkeit für den Benutzer. Im Unterschied dazu ist `<TextInput>` mehrzeilig. Nur darin unterscheiden sich diese Komponente. Alle anderen Beschreibungen stimmen auf beide gleich ein.

Mittels `props` werden dem Komponent verschiedene Parameter mitübergeben, wie zum Beispiel der Stil, konkret die Größe bzw. Position, der angepasst werden kann. Under the Hood steckt in dieser Komponente die Komponente `<TextInput>` die von React-Native stammt.

Neben den typischen Attributen dieses, kann man in unserer Variante noch folgende Weitere beeinflussen:

```
// Allgemeine
style
bg
icon
optRef

// Speziefisch für die automatische Korrektur
supportsAutoCorrect
autoCorrection
applyAutoCorrection
```

Auf die speziefischen Attribute sind wir bereits eingegangen. Im Folgendem eine kurze Beschreibung der allgemeinen Attribute:

#### `style`

Ein singeschrengtes `style`-Prop, sodass man das Komponent nicht in der Implementierung zerstören kann.

#### `bg`

Ein Prop, welches die Hintergrundfarbe der Eingabezeile bestimmt. So kann die Hintergrundfarbe variiert werden.

#### `icon`

Links vom Placeholder-Text findet sich ein kleines Icon. Dieses kann mittels diesem Attributs bestimmt werden. Das Icon muss ein JSX-Element sein, so kann die Größe und Farbe ebenfalls angepasst werden.

#### `optRef`

Dieses Attribut ersetzt das Standard `Ref` Prop. Frage bitte nicht warum das so ist :)

Ist die automatische Korrektur erlaubt (mit `supportsAutoCorrect={true}`) dann wird immer wenn das Eingabefeld fokusiert oder verlassen wird ein entsprechender State gesetzt. Wenn das Eingabefeld fokusiert ist, erscheint unter dem Eingabefeld ein neues Feld mit der Liste aller Wörtern, die zur automatischen Korrektur vorgeschlagen werden. Man unterscheide dabei drei Szenarien:

1. Wort ist richtig geschrieben
2. Es gibt keine Wörter die für eine automatische Korrektur in Frage kommen bzw. die Eingabe ist leer
3. Liste von Wörtern

Für die Fälle 1 und 2 werden entsprechende Hinweise dargestellt in Form von Texten in der Box. Für den 3. Fall wird dann jeweils jedes Wort einzeln in einer Box dargestellt. Wird auf dieses Wort gedrückt wird die o.g. Funktion `applyAutoCorrection` aufgerufen.

## `components/AccessoryView.js`

> [!NOTE]
> Anbei werden die folgenden Funktionen grob beschrieben. Tiefgründigere Erklärungen der Funktionalitäten und konkrete Erklärung von Return-Types, Input-Verarbeitungen, etc. findet man unter [AccessoryView.md](../components/COMPONENTS.md#accessoryview-link)

> [!IMPORTANT]
> Die Implementierung des Komponents basiert auf dem InputAccessoryView von React-Native. Dieses wird zurzeit nur für iOS Systeme unterstützt. Das heißt alle folgenden Funktionalitäten sind nur auf Apple-Handys verfügbar.

Ein AccessoryView ist eine Hilfe für die Eingabe von Text. Beim Tippen erscheint über der virtuellen Tastatur ein Bereich, den man beliebig gestalten kann.

Im Fall `kostrjanc` ist unser AccessoryView eine Zeile mit allen obersorbischen diakritischen Zeichen. Links befindet sich ein Pfeil, damit mit zwischen Groß- und Kleinschreibung variieren kann. Rechts vom Pfeil folgend dann alle Zeichen, auf die man drücken kann. Beim Drücken wird eine Funktion aufgerufen, die Callback-Funktion `onElementPress`.

Damit ein AccessoryView eindeutig zugeordnet werden kann, braucht man eine eindeutige `nativeID`. Diese und die `onElementPress`-Callback-Funktion müssen beim Implementieren des Elementes angegeben werden. `nativeID` ist ein einfacher, eindeutiger _String_, der in der gesamten Applikation nur einmal auftaucht.

### Implementierung

> [!NOTE]
> Eine Liste aller Implementierungen von dem AccessoryView befindet sich unter der o.g. tiefgründigeren Beschreibung.

Anbei wird die Implementierung aus `pages/create/PostCreate.jsx` beschrieben. Die Implementierung in allen anderen Fällen erfolgt auf identischer Art und Weise.

Folgende Schritte beinhaltet die Implementierung:

-   `import` der Komponente
-   Initialisierung der Komponente am Ende der Seite
-   Zuordnung des `<AccessoryView>` zum passenden `<InputField>` oder `<TextInput>` mittels `nativeID`

Der Schritt des `import` ist trivial.

Die Initialisierung erfolgt am Schluss der Seite. Diese Komponente ist ein _self-closing Tag_ und hat, wie oben beschrieben, die Attribute `nativeID` und `onElementPress`.

`nativeID` ist in diesen Fällen ein _String_, hier im Bsp. `"post_title_InputAccessoryViewID"`.

`onElementPress` ist eine Callback-Funktion, die den Buchstaben zurückgibt, auf den gedrückt wurde. Der State mit dem zu ändernden Wert wird nun mittels der Funktion `insertCharacterOnCursor` auf die richtige Position gesetzt und der State wird gesetzt. Eine ausführliche Erklärung der Funktion `insertCharacterOnCursor` bindert sich [hier](../constants/content/CONSTANTS_CONTENT.md#insertcharacteroncursortext-selection-char).

`<AccessoryView>`-Komponenten ergeben nur Sinn zusammen mit einem `<InputField>` oder `<TextInput>`. Um das `<AccessoryView>` richtig zuzuordnen, übergibt man dem `<InputField>` oder dem `<TextInput>` das Attribut `nativeID` mit demselben Wert wie dem `<AccessoryView>` selbst.

### Zusammenfassung

`<AccessoryView>` ist eine schöne Möglichkeit das Tippen in Obersorbisch zu vereinfachen. Man bekommt die Möglichkeit, einfach und schnell diakritische obersorbische Zeichen in seinen Texten zu verwenden. Selbst wenn die eigene Tastatur diese Zeichen nicht zur Verfügung stellt.

<hr>

#### Last Updated 21.03.2024
