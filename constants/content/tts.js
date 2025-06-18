import * as FileSystem from "expo-file-system";
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
 * Fetches the API to generate a TTS from the given text
 * @param {string} text Text to generate the TTS
 */
export default async function generate(text) {
    // Lokalen Pfad festlegen
    const fileUri = FileSystem.cacheDirectory + "tts.mp3";
    let generated = true;
    await getAuth()
        .currentUser.getIdToken()
        .then(async token => {
            await fetch(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/generate_speech`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: text,
                        token: token,
                    }),
                }
            )
                .then(async rsp => {
                    // ArrayBuffer aus der Response holen
                    const arrayBuffer = await rsp
                        .arrayBuffer()
                        .catch(error =>
                            console.log(
                                "error",
                                "tts.js rsp.arrayBuffer()",
                                error
                            )
                        );
                    // In Base64 umwandeln
                    const base64Audio =
                        Buffer.from(arrayBuffer).toString("base64");
                    // Datei speichern
                    await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
                        encoding: FileSystem.EncodingType.Base64,
                    })
                        .then(() => (generated = true))
                        .catch(error =>
                            console.log("error", "tts.js write", error)
                        );
                })
                .catch(error => {
                    console.log("error", "tts.js generate fetch", error);
                });
        });

    return generated ? fileUri : null;
}
