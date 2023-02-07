import React, { useEffect, useState } from "react";

import { StatusBar, View, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

//#region Notifications
import * as Notifications from "expo-notifications";
import { isDevice } from "expo-device";
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});
//#endregion

import { useFonts } from "expo-font";

//#region Firebase
import { firebaseApp } from "./constants/firebaseApp";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, get, child, set } from "firebase/database";
const app = initializeApp(firebaseApp);
//#endregion

//#region Navigation
import { NavigationContainer } from "@react-navigation/native";
//#endregion

//#region Pages
import ViewportManager from "./pages/main/ViewportManager";
import AuthManager from "./pages/auth/AuthManager";
//#endregion

export default function App() {
    const [fontsLoaded, fontsError] = useFonts({
        RobotoMono_Thin: require("./assets/fonts/RobotoMono-Thin.ttf"),
        Barlow_Regular: require("./assets/fonts/Barlow-Regular.ttf"),
        Barlow_Bold: require("./assets/fonts/Barlow-Bold.ttf"),
    });

    const [loaded, setLoaded] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            if (user) {
                setLoggedIn(true);
                setLoaded(true);
            } else {
                setLoggedIn(false);
                setLoaded(true);
            }
        });
    }, []);

    // return null;
    if (!fontsLoaded) return null;
    if (!loaded) return null;

    if (!loggedIn) {
        return (
            <NavigationContainer>
                <StatusBar
                    animated
                    networkActivityIndicatorVisible
                    translucent
                    barStyle={"light-content"}
                />
                <SafeAreaProvider
                    style={{
                        flex: 1,
                        width: "100%",
                        backgroundColor: "#000000",
                    }}>
                    <AuthManager />
                </SafeAreaProvider>
            </NavigationContainer>
        );
    }
    return (
        <NavigationContainer>
            <StatusBar
                animated
                networkActivityIndicatorVisible
                translucent
                barStyle={"light-content"}
            />
            <SafeAreaProvider
                style={{
                    flex: 1,
                    width: "100%",
                    backgroundColor: "#000000",
                }}>
                <ViewportManager />
            </SafeAreaProvider>
        </NavigationContainer>
    );
}

//#region Notifications
async function registerForPushNotifications() {
    let token;
    if (isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            console.log("Failed to get push token for push notification");
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;

        const expoPushToken = (
            await get(
                child(
                    ref(getDatabase()),
                    "users/" + getAuth().currentUser.uid + "/expoPushToken"
                )
            )
        ).val();
        if (expoPushToken != token)
            set(
                ref(
                    getDatabase(),
                    "users/" + getAuth().currentUser.uid + "/expoPushToken"
                ),
                token
            );
    } else console.log("no ph. Device");

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    return token;
}
//#endregion
