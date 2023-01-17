import React from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import * as style from "../../styles";

import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";

//#region Pages
import Landing from "./Landing";
import Content from "./Content";
//#endregion

const MainNavStack = createStackNavigator();

export default function ViewportManager() {
    return (
        <SafeAreaView style={[style.container]}>
            <MainNavStack.Navigator
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
                <MainNavStack.Screen
                    name="content"
                    component={Content}
                    options={{
                        gestureDirection: "horizontal-inverted",
                    }}
                />
                <MainNavStack.Screen name="landing" component={Landing} />
            </MainNavStack.Navigator>
        </SafeAreaView>
    );
}
