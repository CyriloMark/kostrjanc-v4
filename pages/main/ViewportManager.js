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

import UserProfile from "./UserProfile";

import Post from "../Post";
import Event from "../Event";
import Profile from "../Profile";

import ImageFullscreen from "../ImageFullscreen";
import UserList from "../UserList";
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

                <MainNavStack.Screen
                    name="userProfile"
                    component={UserProfile}
                />

                <MainNavStack.Screen name="postView" component={Post} />
                <MainNavStack.Screen name="eventView" component={Event} />
                <MainNavStack.Screen name="profileView" component={Profile} />

                <MainNavStack.Screen
                    name="imgFull"
                    component={ImageFullscreen}
                />
                <MainNavStack.Screen name="userList" component={UserList} />
            </MainNavStack.Navigator>
        </SafeAreaView>
    );
}
