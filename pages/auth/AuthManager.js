import React from "react";

import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import * as style from "../../styles";

import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";

import BottomTransitionBar from "../../components/BottomTransitionBar";

//#region Pages
import Landing from "./Landing";

import Login from "./Login";
import Register from "./Register";
import ResetPassword from "./ResetPassword";
//#endregion

const AuthNavStack = createStackNavigator();

export default function AuthManager() {
    const insets = useSafeAreaInsets();

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
                <AuthNavStack.Screen name="register" component={Register} />
                <AuthNavStack.Screen name="reset" component={ResetPassword} />
            </AuthNavStack.Navigator>

            <BottomTransitionBar style={{ bottom: insets.bottom }} />
        </SafeAreaView>
    );
}
