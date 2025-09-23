import { Directory, File, FileHandle, Paths } from "expo-file-system";
import { Buffer } from "buffer";

import { getAuth } from "firebase/auth";
import { checkForUnnecessaryNewLine } from ".";
import { checkLinkedUser } from "./linking";
import { getUnsignedTranslationText } from "./translation";

/**
 * Returns the plain text for posts and events
 * @param {string} text Given text
 * @returns string
 */
export function getPlainText(text) {
    let output = "";
    checkLinkedUser(
        getUnsignedTranslationText(checkForUnnecessaryNewLine(text))
    ).forEach(el => (output += el.text));

    return output;
}

/**
 * Calculates estimated generation time for given text
 * @param {string} text Input Text
 * @returns {number} Time in seconds
 */
export function calculateEstimatedGenerationTime(text) {
    if (text == null) return 0;
    return Math.ceil(text.length * 0.15);
}

/**
 * Generiert eine Text-to-Speech (TTS) Audiodatei für den übergebenen Text.
 * Der Text wird an einen Backend-Endpunkt geschickt, welcher eine MP3-Datei zurückgibt.
 * Diese Datei wird anschließend im Cache-Verzeichnis der App gespeichert.
 *
 * @param {string} text - Der Eingabetext, der in Sprache umgewandelt werden soll.
 * @returns {Promise<string|null>} - Pfad (URI) zur gespeicherten MP3-Datei
 *                                   oder `null`, falls ein Fehler auftritt.
 */
export default async function generate(text) {
    // 1. Erzeuge ein File-Objekt im Cache-Verzeichnis (tts.mp3).
    //    Das File-Objekt kümmert sich selbst um Pfad und Methoden wie write(), delete(), etc.
    const file = new File(Paths.cache, "tts.mp3");

    // Status, ob die Generierung erfolgreich war
    let generated = false;

    try {
        // 2. Hole den aktuell eingeloggten Firebase-User
        const user = getAuth().currentUser;
        if (!user) throw new Error("No user logged in");

        // 3. Besorge ein gültiges JWT-Token, das am Backend die Authentifizierung übernimmt
        const token = await user.getIdToken();

        // 4. Schicke einen POST-Request an den Backend-Endpunkt `/generate_speech`
        //    mit dem Eingabetext und dem Token. Erwartet wird ein MP3-File im Response-Body.
        const rsp = await fetch(
            `${process.env.EXPO_PUBLIC_SERVER_URL}/generate_speech`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, token }),
            }
        );

        // 5. Falls der Server mit einem Fehler antwortet, abbrechen
        if (!rsp.ok) {
            console.error("generate TTS: server error", rsp.status);
            return null;
        }

        // 6. Die Antwort des Servers als ArrayBuffer (rohe Bytes) lesen
        const arrayBuffer = await rsp.arrayBuffer();

        // 7. ArrayBuffer in ein Uint8Array umwandeln (Byte-Array),
        //    damit expo-file-system es schreiben kann
        const bytes = new Uint8Array(arrayBuffer);

        // 8. Speichere die Bytes in die Datei tts.mp3 im Cache.
        //    Das überschreibt die Datei, falls sie schon existiert.
        await file.write(bytes);

        // 9. Wenn alles geklappt hat, setzen wir generated auf true
        generated = true;
    } catch (err) {
        // 10. Fehlerbehandlung: gibt Fehlermeldung in der Konsole aus
        console.error("generate TTS: error", err);
    }

    // 11. Falls erfolgreich: gebe den Pfad zur gespeicherten Datei zurück.
    //     Andernfalls null.
    return generated ? file.uri : null;
}
