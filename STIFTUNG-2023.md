# Wotličenje za 2023

> [!NOTE]
> Za wotličenje sćěhuje připódla powšitkowne wujasnjenje rozrjadowanja našeho projekta. Wšitke slědowace wobsahi sćěhuja w němskej rěči, dokelž to za dokumentaciju (za Cyrila na Mac) jednorišo padnje.

## 0 Gliederung

1. [Informationen](./STIFTUNG-2023.md#1-informationen)
2. [Übersicht der Module](./STIFTUNG-2023.md#2-übersicht-der-module)
3. [Installation](./STIFTUNG-2023.md#3-installation)
4. [Impressum](./STIFTUNG-2023.md#4-impressum)

## 1 Informationen

### 1.1 GitHub Repository

Hier befindet sich die aktuelle Version unseres Github Repositories.

[kostrjanc na GitHub](https://github.com/CyriloMark/kostrjanc-v4)

[kostrjanc Website na GitHub](https://github.com/CyriloMark/kostrjanc-website/tree/main)

[kostrjanc Backend na GitHub](https://github.com/Korla-tech/kostrjanc-scripts)

### 1.2 Unsere Website

Unter folgendem Link befindet sich die `kostrjanc` Website mit nützlichen Informationen.

[kostrjanc Website](https://www.kostrjanc.de)

[kostrjanc Dashboard](https://dashboard.kostrjanc.de)

### 1.3 Benutzte Technologien

-   [React](https://legacy.reactjs.org)
-   [React Native](https://reactnative.dev)
-   [Expo](https://expo.dev)
-   [Firebase](https://firebase.google.com)
-   [MeiliSearch](https://www.meilisearch.com)
-   [Google Cloud](https://cloud.google.com)
-   [Sotra](https://sotra.app)

### 1.4 Allgemeine Gliederung

#### Stuktur der Ordner

-   **assets**: Ordner mit allen Bilddateien wie dem App-Icon oder den umgewandelten SVG Dateien für die App.
-   **pages**: Ordner mit allen JSX-Dateien, die eine Seite in `kostrjanc` bilden.
-   **components**: Ordner mit Komponenten, die in den Seiten integriert werden. Um eine bessere Struktur zu schaffen und Code-Wiederholungen zu vermeiden, werden `Buttons` oder verschiedene `Cards` einmal Programmiert und designt und werden so mittels `import` in den Pages integriert.
-   **constants**: Ordner, in denen Constante Funktionalitäten definiert und implementiert werden. Diese Funktionalitäten werden mittels `import` in den Pages und Components integriert.
-   **styles**: Ordner mit (einer) styles Datei. Diese Datei enthält vorgegebene Standardwerte für Stile in `kostrjanc`. Um eine einheitliche Struktur in der UI zu behalten werden hier oft verwendete Stile einheitlich definiert und können so einfach angepasst werden.

#### Inhalt des main-Ordners

-   **.gitignore**: Datei mit allen Inhalten, die nicht auf Github mitgepusht werden sollen, wie `.env` oder `node_modules`.
-   **App.js**: Die Root-Datei der `kostrjanc`-App. Hier werden verschiedene Standardabfragen abgearbeitet, wie z.B.:
    -   ist der Client eingeloggt oder nicht
    -   ist der Client gebannt
    -   hat der Client die richtige Version
    -   Fonts werden geladen
    -   etc.
-   **GoogleService-Info.plist**: Die plist-Datei für den Google Play Store.
-   **LICENCE**: Die GPL-3.0 Lizens
-   **README.md**: Readme-Datei mit (fast) nützlichen Informationen
-   **app.json**: Informationen für den Build der App
-   **eas.json**: Daten ebenfalls für den Build von der App, spezifisch hierbei `eas` $\cong$ `Expo Application Services`
-   **index.js**: Sogesehen die eingentliche Root-Datei der App. Diese Registiert aber lediglich die App.js-Datei.
-   **package.json/package-lock.json**: Package-Daten für `Node.js`

### 1.5 Copyright

> [!IMPORTANT] > &copy; Karl Baier und Cyril Mark kostrjanc GbR. All Rights Reserved. 2022 - 2024

Dieses und alle mit kostrjanc gekennzeichneten (softwaretechnischen) Produkte sind in Besitz von der Karl Baier und Cyril Mark kostrjanc GbR und sind nicht zu missbrauchen. Es gelten die AGB.

## 2 Übersicht der Module

Anbei befindet sich die Verlinkung zu den einzelnen Modulbeschreibungen:

1. Prototyp modula "pisanska podpěra za serbšćinu" finalizować: [Link](./overview_modules/01_PISANSKA_PODPERA.md)
1. Prototyp modula "algoritmus za doporučenje serbskich wobsahow na hłownej strony" finalizować: [Link](./overview_modules/02_ALGORITMUS_DOPORUCENJE.md)
1. Prototyp modula "awtomatiske přełožowanje němskich wobsahow do serbšćiny" finalizować: [Link](./overview_modules/03_AWTOMATISKE_PROLOZOWANJE.md)
1. Prototyp modula "žana marěć" finalizować: [Link](./overview_modules/04_ZANA_MAREC.md)
1. Prototyp modula "dźělenje wobsahow" finalizować: [Link](./overview_modules/05_DZELENJE_WOBSAHOW.md)
1. Protyp modula "moderacija/přizjewjenje wobsahow" finalizować: [Link](./overview_modules/06_MODERACIJA.md)
1. Prototyp modula "powěsćowe zastajenja a dopomnjenki" finalizować: [Link](./overview_modules/07_POWESCE.md)
1. Pomocna strona, datowy škit a impresum: [Link](./overview_modules/08_POMOC_DATOSKIT.md)
1. Protyp modula "doporučenje wužiwarja" finalizować: [Link](./overview_modules/09_DOPORUCENJE_WUZIWARJA.md)
1. Protyp regulow kostrjanc finalizować: [Link](./overview_modules/10_REGULE.md)
1. Korektura maličkosćow na wužiwarskim powěrchu: [Link](./overview_modules/11_MALICKOSCE.md)
1. Prototyp modula "składowanje na lokalnej runinje wužiwarja" korigować: [Link](./overview_modules/12_SKLADOWANJE_LOKAL.md)

## 3 Installation

1. Führe einfach die folgenden Schritte aus:

```
git clone https://github.com/CyriloMark/kostrjanc-v4.git
cd kostrjanc-v4
npm install
```

2. Erstelle die Datei `.env` und fülle entsprechend `example.env` deine API-Keys.

3. Führe aus:

```
expo start
```

## 4 Impressum

### Angaben nach §5 TMG

#### Geschäftsführer sind

```
Cyrill Mark
Hermann-Liebmann-Straße 31
04315 Leipzig
```

und

```
Karl Georg Josef Baier
Mittelweg 12
01920 Panschwitz-Kuckau
```

Alle anderen Angaben zum Impressum befinden sich unter [kostrjanc.de](https://kostrjanc.de/pages/impresum.html)

<hr>

#### Last Updated 19.03.2024
