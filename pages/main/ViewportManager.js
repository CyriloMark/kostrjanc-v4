import React, { useEffect } from "react";

import { Platform } from "react-native";
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
import Content from "./Content";

import UserProfile from "./UserProfile";

import Post from "../Post";
import Event from "../Event";
import Profile from "../Profile";

import Settings from "../settings/Landing";
import Settings_Language from "../settings/Language";
import Settings_Help from "../settings/Help";
import Settings_Verify from "../settings/Verify";
import Settings_DataSecurityImpresum from "../settings/DataSecurityImpresum";
import Settings_Admin from "../settings/Admin";
import Settings_Profile from "../settings/Profile";

import LandingCreate from "../create/LandingCreate";
import PostCreate from "../create/PostCreate";
import EventCreate from "../create/EventCreate";

import UserProfileEdit from "../UserProfileEdit";

import ImageFullscreen from "../ImageFullscreen";
import UserList from "../UserList";
import Report from "../interaction/Report";
import Ban from "../interaction/Ban";
import Delete from "../interaction/Delete";
//#endregion

const MainNavStack = createStackNavigator();

export default function ViewportManager({ onTut }) {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={[style.container]}>
            <MainNavStack.Navigator
                screenOptions={{
                    animationEnabled: true,
                    gestureEnabled: Platform.OS === "ios",
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
                    options={{
                        gestureDirection: "horizontal-inverted",
                    }}>
                    {props => <Content {...props} onTut={onTut} />}
                </MainNavStack.Screen>
                <MainNavStack.Screen name="landing">
                    {props => <Landing {...props} onTut={onTut} />}
                </MainNavStack.Screen>

                <MainNavStack.Screen name="userProfile">
                    {props => <UserProfile {...props} onTut={onTut} />}
                </MainNavStack.Screen>

                <MainNavStack.Screen name="postView">
                    {props => <Post {...props} onTut={onTut} />}
                </MainNavStack.Screen>
                <MainNavStack.Screen name="eventView">
                    {props => <Event {...props} onTut={onTut} />}
                </MainNavStack.Screen>
                <MainNavStack.Screen name="profileView" component={Profile} />

                <MainNavStack.Screen name="settings" component={Settings} />

                <MainNavStack.Screen
                    name="settings-language"
                    component={Settings_Language}
                />
                <MainNavStack.Screen
                    name="settings-help"
                    component={Settings_Help}
                />
                <MainNavStack.Screen
                    name="settings-verify"
                    component={Settings_Verify}
                />
                <MainNavStack.Screen
                    name="settings-datasec&impresum"
                    component={Settings_DataSecurityImpresum}
                />
                <MainNavStack.Screen
                    name="settings-admin"
                    component={Settings_Admin}
                />

                <MainNavStack.Screen
                    name="settings-profile"
                    component={Settings_Profile}
                />

                <MainNavStack.Screen
                    name="landingCreate"
                    component={LandingCreate}
                />
                <MainNavStack.Screen name="postCreate" component={PostCreate} />
                <MainNavStack.Screen
                    name="eventCreate"
                    component={EventCreate}
                />

                <MainNavStack.Screen
                    name="editProfile"
                    component={UserProfileEdit}
                />

                <MainNavStack.Screen
                    name="imgFull"
                    component={ImageFullscreen}
                />
                <MainNavStack.Screen name="userList" component={UserList} />
                <MainNavStack.Screen name="report" component={Report} />
                <MainNavStack.Screen name="ban" component={Ban} />
                <MainNavStack.Screen name="delete" component={Delete} />
            </MainNavStack.Navigator>

            <BottomTransitionBar style={{ bottom: insets.bottom }} />
        </SafeAreaView>
    );
}
