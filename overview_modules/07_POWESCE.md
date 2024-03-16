# 7 Prototyp modula "_powěsćowe zastajenja a dopomnjenki_" finalizować

### Dieses Modul beinhaltet folgende Funktionalitäten:

-   Erstellen eines sogenannten `ExpoPushToken` für den etwaigen Benutzer und Speicherung diesen in `Firebase`
-   Benutzer können personalisieren, welche Benachrichtigungen sie erhalten wollen und welche nicht
-   Das zielgerichtete Versenden von Benachrichtigungen an die etwaigen Benutzer

> [!NOTE]
> Im gesamten Abschnitt wird die Rede von Benachrichtigungen sein. Dabei beziehen wir uns explizit genau auf Push-Benachrichtigungen bei den Benutzern.

> [!IMPORTANT]
> Wie in den einzelnen Fällen die Benachrichtigungen aufgerufen und verschickt werden ist Teil der Backend Technologie und werden auf dem Server verarbeitet.

> [!NOTE]
> "Das zielgerichtete Versenden von Benachrichtigungen an die etwaigen Benutzer" funktioniert sehr eingeschrenkt. Nach vielseitigen Versuchen erreicht mehr oder weniger zufällig einige Apple Benutzer manchmal eine Benachrichtigungen. Für Android Benutzer klappt die Technologie gar nicht.

## Übersicht der Dateien

```
App.js
constants/settings/notifications.js
pages/settings/Notifications.jsx
```

## `App.js`

Als Kern für die Benachrichtigungen wird die `expo-notification` API benutzt. Diese wird mit all ihren Funktionen auch importiert.

Benachrichtigungen werden lediglich auf Smartphones unterstützt. Mittels `expo-device` kann man mit der Abfrage `isDevice` herausfinden, ob es sich bei dem aktuellen Benutzer um einen mobilen Client handelt.

Die Benachrichtigungen werden zu Beginn mit `setNotificationHandler` konfiguriert.

Der `ExpoPushToken` von dem akutellen Client wird in einem State gesetzt. Am Anfang ist dies ein leerer _String_.

In dem `useEffect`-Hook, welches auf den Status des Einloggens spezifiert ist, wird nach dem erfolgreichem Einloggen in ein Nutzerkonto die Funktion `registerForPushNotifications` aufgerufen.

#### `registerForPushNotifications()`

> [!IMPORTANT]
> Die folgende Erklärung spiegelt die aktuelle Implementierung wieder. Es ist nicht ausgeschlossen, dass dieser Teil Grund ist für das defekte Abschicken von Benachrichtigungen.

Diese Funktion dient dazu, den aktuellen Benutzer für Benachrichtigungen zu registrieren.

Vorerst wird mit der o.g. Funktion `isDevice` überprüft, ob es sich beim aktuellen Client um eine Version auf einem Smartphone handelt.

Weiter wird überprüft, ob der Benutzer den Berechtigungen vom Senden von Push-Benachrichtigungen zugestimmt hat, bzw. diese werden im nötigen Fall eingeholt.

Nachdem die `kostrjanc`-App die Rechte für das Senden von Benachrichtigungen hat, wird mittels `getExpoPushTokenAsync` aus `expo-notifications` der ExpoPushToken aufgerufen.

Dieser Token wird mit dem Eintrag des etwaigen Benutzers in der Firebase Datenbank abgeglichen und nötigenfalls korrigiert.

Für Android wird der Kanal zum Senden von Benachrichtigungen gesetzt.

Die Funktion gibt den ExpoPushToken zurück. Dieser wird im entsprechendem State gesetzt.

### Zusammenfassung

Das Registrieren, damit der Client Push-Benachrichtigungen erhalten kann erfolgt lediglich in der `App.js`-Methode. Das Registieren erfolgt hierbei einfach über den ExpoPushToken und der Funktion `registerForPushNotifications`.

## `constants/settings/notifications.js`

#### Funktionenen in autoCorrect.js

> [!NOTE]
> Anbei werden die folgenden Funktionen grob beschrieben. Tiefgründigere Erklärungen der Funktionalitäten und konkrete Erklärung von Return-Types, Input-Verarbeitungen, etc. findet man unter [notifications.md](../constants/settings/CONSTANTS_SETTINGS.md#notificationsjs-link).

```
getNotificationSettings() { }
setNotificationSettings(settings) { }
```

Diese Funktionen benutzen speziell den von Firebase bereitgestellten _Displayname_ für den Benutzer. Jeder neu registrierte Benutzer bekommt automatisch eine Nutzer-Id mit zusätzlichen Informationen zugeordnet. Darunter fällt auch der _Displayname_, welchen wir beim Entwickeln nicht mitnutzten, dafür aber nun bei den Einstellungen für die Benachrichtigungen verwenden.

#### `getNotificationSettings()`

Diese Funktion lädt die Benachrichtigungseinstellungen vom Benutzer aus Firebase, konvertiert diese in ein `JavaScript Object` und gibt diese zurück.

Konkret wird mittels `getAuth.currentUser.displayName` der _Displayname_ vom aktuellen Benutzer aufgerufen. Mit `JSON.parse()` wird der _String_ in ein nützlicheres JSON Format umgewandelt. Folglich wird abgefragt, ob überhaupt schon Einstellungen getätigt wurden, denn wenn nicht, ist das Objekt leer und es wird ein Standardobjekt mit allen Einstellungen deaktiviert zurückgegeben. Anderenfalls werden die alten Einstellungen als `return` verarbeitet.

#### `setNotificationSettings(settings)`

Als Parameter wird ein Objekt übergeben mit den den jeweiligen Einstellungsmöglichkeiten für die Benachrichtigungen mit `true` oder `false`, also ist diese Einstellung aktiv oder nicht. Die Funktion kodiert dieses Objekt in einen _String_ um und setzt den _Displayname_ des eingeloggten Benutzers mit diesen Daten.

Der Parameter wird mit Hilfe von `JSON.stringify()` in einen _String_ kodiert. Mit der Funktion `updateProfile` mit `getAuth().currentUser` können Benutzerinformationen in Firebase angepasst werden. In dem Fall wird also zweiter Parameter ein Objekt mit `displayName` und dem kodierten _String_ als Wert übergeben.

Als Rückgabewert wird bei erfolgreichen Änderung `true` übergeben, anderenfalls `false`.

## pages/settings/Notifications.jsx

Unter den Einstellungen findet sich die Seite für die Einstellungen der Benachrichtigungen.

Diese hat folgende Funktionalitäten:

-   Laden der akutellen Einstellungen
-   Darstellung dieser mit _Switches_ abhängig von der aktuellen Einstellung und einer Information, was wie dargestellt wird
-   die _Switches_ bieten die Möglichkeit, umgestellt zu werden
-   nach Veränderungen der Einstellungen besteht die Möglichkeit, die neuen Einstellungen zu speichern

Das Laden erfolgt mit einem `useEffect`-Hook und mit der o.g. Funktion `getNotificationSettings`. Diese geladenen Einstellungen werden in einem State `actives` geladen. Standardmäßig sind alle Einstellungen deaktiviert.

Die Darstellung erfolgt wie schon bereits kurz angedeutet mit _Switches_, eine selbstdefinierte Komponente [(Link)](../components/settings/Switch.jsx). Als erstes steht eine kurze Überschrift, um welche Einstellung es sich handelt, gefolgt von einer Beschreibung, welche Situationen genau diese Benachrichtigung losschicken. Rechts von diesen beiden Texten ist dann der angesprochene _Switch_, mit _link und rot_ (deaktiviert) oder _rechts und blau_ (aktiviert). Die aktuelle Einstellung wird durch das Attribus `active` gesetzt und entspricht genau dem Wert des etwaigen _Child_ aus dem `actives`-State. Durch drücken auf den _Switch_ wird eine `onToggle`-Callback-Funktion aufgerufen. In dieser wird der aktuelle Wert des _Child_ aus dem State negiert und gesetzt.

Am Ende der Seite befindet sich ein _Button_. Wenn Benutzer auf diesen drücken, wird die Funktion `overrideNotificationSettings` getriggert. Diese Funktion nimmt sich den aktuellen Wert des State `actives` und übergibt diesen der Funktion `setNotificationSettings`. Wurden die Einstellungen geändert, wird der Benutzer auf die `Landing`-Seite der Einstellungen zurückgeführt.

## Warum funktionieren die Benachrichtigungen noch nicht so wie geplant?

> [!NOTE]
> Zurzeit wird noch nicht zwischen den einzelnen Typen von Benachrichtigungen unterschieden. Uns ist wichtig erst einmal das allgemeine Senden zu ermöglichen. Danach kann man spezifieren.

### Was wurde alles probiert?

-   sämtliche Tests mit den Expo [Push notification tool](https://expo.dev/notifications)
-   lokale Tests haben funktioniert, auch auf Android
-   nach dem Deploy in den Play Store und App Store mehrere globale Tests mit mäßigen erfolgen
    $\to$ auf iOS können manuelle Benachrichtigungen verschickt werden, Android nicht

### Wo kann der Fehler liegen?

-   beim Registrieren liegt ein Fehler vor
    -   auf iOS lassen sich lokale Benachrichtigungen verschicken, teilweise werden sogar (richtige) Benachrichtigungen in der App automatisch verschickt
-   Cloud Functions
-   Falsche Methodik zum Senden im Backend

Kurz gesagt: wir haben so viele verschiede Wege probiert, dass die Benachrichtigungen nicht mehr auf dem 1. oder 2. Platz der Prioritätenliste steht.

<hr>

#### Last Updated 13.03.2024
