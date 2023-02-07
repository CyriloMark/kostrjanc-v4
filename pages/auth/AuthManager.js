import React from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import * as style from "../../styles";

import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";

//#region Pages
import Landing from "./Landing";

import Login from "./Login";
//#endregion

const AuthNavStack = createStackNavigator();

export default function AuthManager() {
    return (
        <SafeAreaView style={[style.container]}>
            <AuthNavStack.Navigator
                screenOptions={{
                    animationEnabled: true,
                    gestureEnabled: true,
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS,
                    headerShown: false,
                    cardOverlayEnabled: true,
                    cardShadowEnabled: true,
                    presentation: "card",
                }}
                initialRouteName="landing">
                <AuthNavStack.Screen name="landing" component={Landing} />

                <AuthNavStack.Screen name="login" component={Login} />
                {/* <AuthNavStack.Screen name="landing" component={Landing} /> */}
            </AuthNavStack.Navigator>
        </SafeAreaView>
    );
}
