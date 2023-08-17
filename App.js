import React, { useEffect, useRef, useState } from "react";

import { View, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

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

import AsyncStorage from "@react-native-async-storage/async-storage";

//#region Firebase
import { firebaseApp } from "./constants/firebaseApp";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get, child, set, onValue } from "firebase/database";
import {
    getReactNativePersistence,
    initializeAuth,
} from "firebase/auth/react-native";
const app = initializeApp(firebaseApp);
initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
//#endregion

//#region Navigation
import { NavigationContainer } from "@react-navigation/native";
//#endregion

// #region navbar
import {
    setBackgroundColorAsync,
    setButtonStyleAsync,
} from "expo-navigation-bar";
//#endregion

import * as style from "./styles";

import { storeData, removeData, hasData } from "./constants/storage";
import { checkIfLangIsSet } from "./constants/storage/language";

//#region Pages
import ViewportManager from "./pages/main/ViewportManager";
import AuthManager from "./pages/auth/AuthManager";

import Loading from "./pages/static/Loading";
import UpdateVersion from "./pages/static/UpdateVersion";
import ServerStatus from "./pages/static/ServerStatus";
import Ban from "./pages/static/Ban";
import LanguageSelect from "./pages/static/LanguageSelect";
import TestView from "./pages/static/TestView";

import TutorialView from "./components/tutorial/TutorialView";
import {
    TUTORIAL_DATA,
    setTutorialAsSeen,
    resetTutorials,
} from "./constants/tutorial";
//#endregion

const RESET_TUTORIALS_ENABELD = false;

export default function App() {
    const [fontsLoaded, fontsError] = useFonts({
        RobotoMono_Thin: require("./assets/fonts/RobotoMono-Thin.ttf"),
        Barlow_Regular: require("./assets/fonts/Barlow-Regular.ttf"),
        Barlow_Bold: require("./assets/fonts/Barlow-Bold.ttf"),
    });

    const [loaded, setLoaded] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    const [langIsSet, setLangIsSet] = useState(null);
    const [testIsChecked, setTestIsChecked] = useState(false);

    const [banned, setBanned] = useState(false);
    const [isRecentVersion, setIsRecentVersion] = useState(null);
    const [serverStatus, setServerStatus] = useState(null);

    const [expoPushToken, setExpoPushToken] = useState("");

    const [tutorial, setTutorial] = useState({
        visible: false,
        id: 0,
    });

    function showTutorial(id) {
        setTutorial({
            visible: true,
            id: id,
        });
    }

    useEffect(() => {
        // RESET TUTORIALS
        if (RESET_TUTORIALS_ENABELD) resetTutorials();

        const db = getDatabase();
        //onAuthChange
        onAuthStateChanged(
            getAuth(),
            user => {
                if (user) {
                    setLoggedIn(true);
                    setLoaded(true);

                    get(child(ref(db), `users/${user.uid}/isAdmin`)).then(
                        isAdminSnap => {
                            if (isAdminSnap.exists()) {
                                const isAdmin = isAdminSnap.val();
                                if (isAdmin) storeData("userIsAdmin", true);
                                else if (hasData("userIsAdmin"))
                                    removeData("userIsAdmin");
                            }
                        }
                    );

                    // Ban Check
                } else {
                    setLoggedIn(false);
                    setLoaded(true);
                }
            },
            error => console.log("error App.js", "onAuthChange", error.code)
        );

        // Android Bottom Nav Bar - Color
        if (Platform.OS === "android") {
            setBackgroundColorAsync(style.colors.black);
            setButtonStyleAsync("light");
        }

        checkIfLangIsSet().then(state => setLangIsSet(state));

        // Server Status - Firebase
        onValue(ref(db, "status"), statusSnap => {
            if (statusSnap.exists()) {
                const statusData = statusSnap.val();
                setServerStatus(statusData);
            }
        });

        // Version Check - Firebase
        onValue(ref(db, "version"), snapshot => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                if (data === require("./app.json").expo.version)
                    setIsRecentVersion({
                        equal: true,
                        client: data,
                        server: data,
                    });
                else
                    setIsRecentVersion({
                        equal: false,
                        client: require("./app.json").expo.version,
                        server: data,
                    });
            }
        });
    }, []);

    useEffect(() => {
        if (loggedIn) {
            const db = getDatabase();

            registerForPushNotifications().then(token =>
                setExpoPushToken(token)
            );

            // Ban Check
            onValue(
                ref(db, `users/${getAuth().currentUser.uid}/isBanned`),
                bannedSnap => {
                    if (bannedSnap.exists()) {
                        const isBanned = bannedSnap.val();
                        setBanned(isBanned);
                    }
                }
            );
        }
    }, [loggedIn]);

    // return null;
    if (!fontsLoaded) return <View style={style.bgBlack} />;
    if (
        !(
            loaded &&
            isRecentVersion !== null &&
            serverStatus !== null &&
            langIsSet !== null
        )
    )
        return <Loading />;

    if (langIsSet === false)
        return (
            <SafeAreaProvider style={[style.container, style.bgBlack]}>
                <LanguageSelect onLanguageChange={() => setLangIsSet(true)} />
            </SafeAreaProvider>
        );

    if (!testIsChecked) {
        return (
            <SafeAreaProvider style={[style.container, style.bgBlack]}>
                <TestView onCheck={() => setTestIsChecked(true)} />
            </SafeAreaProvider>
        );
    }

    // Server Status
    if (serverStatus !== "online")
        return <ServerStatus status={serverStatus} />;

    // not recent version
    if (isRecentVersion.equal === false)
        return <UpdateVersion versions={isRecentVersion} />;

    if (!loggedIn) {
        return (
            <NavigationContainer fallback={<Loading />}>
                <StatusBar
                    animated
                    networkActivityIndicatorVisible
                    translucent
                    backgroundColor={style.colors.black}
                    style="light"
                />
                <SafeAreaProvider
                    style={{
                        flex: 1,
                        width: "100%",
                        ...style.bgBlack,
                    }}>
                    <AuthManager />
                </SafeAreaProvider>
            </NavigationContainer>
        );
    }

    if (banned) return <Ban />;

    return (
        <NavigationContainer fallback={<Loading />}>
            <StatusBar
                animated
                networkActivityIndicatorVisible
                translucent
                backgroundColor={style.colors.black}
                style={"light"}
            />
            <SafeAreaProvider
                style={{
                    flex: 1,
                    width: "100%",
                    ...style.bgBlack,
                }}>
                <ViewportManager onTut={showTutorial} />
                <TutorialView
                    visible={tutorial.visible}
                    data={TUTORIAL_DATA[tutorial.id]}
                    onClose={() => {
                        setTutorial(prev => {
                            return {
                                ...prev,
                                visible: false,
                            };
                        });
                        setTutorialAsSeen(tutorial.id);
                    }}
                />
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
        token = (
            await Notifications.getExpoPushTokenAsync({
                projectId: require("./app.json").expo.extra.eas.projectId,
            })
        ).data;

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
