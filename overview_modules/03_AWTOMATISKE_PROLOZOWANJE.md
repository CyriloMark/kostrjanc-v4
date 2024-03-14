# 3 Prototyp modula "_awtomatiske přełožowanje němskich wobsahow do serbšćiny_" finalizować

### Dieses Modul beinhaltet folgende Funktionalitäten:

-   Erkennung von Deutschen Texteingaben während dem Prozess des Veröffentlichens
-   Übersetzten von erkannten deutschen Texten automatisch mittels [Sotra.app](https://sotra.app)
-   Graphische Darstellung von automatisch übersetzten Texten

> [!IMPORTANT]
> Die Anbindung zu Sotra.app und die Erkennung von deutschen Texten erfolgt nach dem Abschicken der Daten an das Backend. Die Weiterverarbeitung erfolgt auf dem Server.

## Übersicht der Dateien

```
constants/content/translation.js

pages/Post.jsx
pages/Event.jsx
```

## `constants/content/translation.js`

#### Funktionenen in translation.js

> [!NOTE]
> Anbei werden die folgenden Funktionen grob beschrieben. Tiefgründigere Erklärungen der Funktionalitäten und konkrete Erklärung von Return-Types, Input-Verarbeitungen, etc. findet man unter [translation.md](../constants/content/CONSTANTS_CONTENT.md#translationjs)

```
checkIsTranslated(text) { }
getUnsignedTranslationText(text) { }
alertForTranslation() { }
```

#### Translation Sign

Um die Arbeit zu vereinfach und Übersicht zu Bergen benutzen wir zu bei übersetzten Texten als Prefix das sogenannte `TRANSLATION_SIGN: ∂` (gespr. $\text{delta}$). Die o.g. Funktionen erkennen diesen Prefix und können dadurch zuverlässig arbeiten.

#### `checkIsTranslated(text)`

Diese Funktion nimmt ein _String_ als Parameter uns gibt `true` zurück, falls der Parametertext mit dem o.g. `TRANSLATION_SIGN` beginnt. Ansonsten ist `false` der Rückgabewert.

#### `getUnsignedTranslationText(text)`

Damit man wieder einen _unsignierten_ Text hat, kann man diese Funktion mit dem _signierten_ Text aufrufen. Diese Funktion überprüft vorerst, ob es sich überhaupt um einen _signierten_ Text handelt. Ist dem so, so wird das erste Zeichens des Textes entfernt und der neue Text wird zurückgegeben. Handelt es sich aber um einen _unsignierten_ Text, wird dieser sofort zurückgegeben.

#### `alertForTranslation()`

Diese Funktion ist für ein Icon, auf welches später noch eingegangen wird.
Wird diese Funktion aufgerufen, bekommt der Benutzer ein `Alert` mit dem Hinweis, dass es sich bei diesem \[speziefischen\] Text um eine automatisch übersetzte Variante von [Sotra.app](https://sotra.app) handelt.

## `pages/Post.jsx` und `pages/Event.jsx`

Um zu sehen, wie diese automatisch übersetzten Texte in Aktion ausschauen, müssen wir in die etwaigen `Pages` schauen.
Texte werden in _Posts_ und _Events_ automatisch analysiert und übersetzt.

Die Implementierung erfolgt bei _Posts_ und _Events_ jeweils gleich. Es werden jeweils immer `title` und `description` sprachlich ermittelt. Im Folgendem folgt nur die UI-Technische Implementierung.

Folgende Schritte beinhaltet die Implementierung:

-   `import` der Funktionen und der _SVG_-Datei
-   Bei der Darstellung von `title` und `description` wird der _unsignierte_ Text gerendert und falls es sich um eine Übersetzung handelt wird das Icon gezeigt

Der `import` der Funktionen ist trivial. Bei der _SVG_-Datei handelt es sich um ein spezielles Icon, welches die obersorbische und deutsche Flagge zeigt, quasi als Symbol von einer Übersetzung.

Bei den Texten wird mittels `checkIsTranslated` und `*.title` resp. `*.description` als Parameter überprüft, ob es sich um einen übersetzten Text handelt. Ist dem so, wird vor dem Text das o.g. Icon gezeigt. Dieses Icon ist eingenestet in ein `<Pressable>`-Parent-Element. Dieses bildet somit einen Container um dem Icon. Durch ein tippen auf diesen Container wird das `onPress`-Event aufgerufen. Durch dieses Event wird die Funktion `alertForTranslation` aufgerufen.

Der folgende Text wird in jedem Fall mit der Funktion `getUnsignedTranslationText` mit dem Text selbst als Parameter gerendert. Wie oben beschrieben ist die Rückgabe entweder der Text selbst oder die _unsignierte_ Variante. So sehen alle Text immer noch gleich aus.

### Zusammenfassung

In `kostrjanc` kann man sogar sorbisch schreiben, ohne sorbisch sprechen zu können. [Sotra.app](https://sotra.app) erkennet deutsche Texte und übersetzt diese automatisch ins Obersorbische. Damit nun die Benutzer nicht faul werden und nur noch Deutsch schreiben, wird übersetzter Text auch mit den o.g. Funktionen und dem Icon neben den Texten im `pages/Post.jsx` und `pages/Event.jsx` kenntlich gemacht.

<hr>

#### Last Updated 14.03.2024
