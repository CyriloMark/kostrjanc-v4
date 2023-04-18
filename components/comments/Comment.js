import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions,
    Alert,
    Vibration,
} from "react-native";

import * as s from "../../styles";

import { convertTimestampToString } from "../../constants/time";
import { User_Placeholder } from "../../constants/content/PlaceholderData";
import { getLangs } from "../../constants/langs";

import { getDatabase, get, child, ref } from "firebase/database";

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    withSpring,
    runOnJS,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

import SVG_Basket from "../../assets/svg/Basket";
import { getData } from "../../constants/storage";

let VIBRATED = false;
const REMOVE_ENABLED = false;

const TRANSLATE_X_THRESHOLD = Dimensions.get("window").width * 0.3;

export default function Comment({ style, commentData, onRemove }) {
    const [user, setUser] = useState(User_Placeholder);
    const [clientIsAdmin, setClientIsAdmin] = useState(false);

    const x = useSharedValue(0);
    const iconScale = useSharedValue(1);

    const getUserData = () => {
        const db = ref(getDatabase());
        get(child(db, "users/" + commentData.creator)).then(userSnap => {
            if (!userSnap.exists()) return;
            const userData = userSnap.val();
            setUser({
                name: userData["name"],
                pbUri: userData["pbUri"],
            });
        });
    };

    const onRem = useCallback(function () {
        Alert.alert(
            "Komentar wotstronić",
            `Komentar wot ${user.name} woprawdźe wotstronić?`,
            [
                {
                    text: getLangs("no"),
                    isPreferred: true,
                    style: "destructive",
                },
                {
                    text: getLangs("yes"),
                    isPreferred: false,
                    style: "default",
                    onPress: onRemove,
                },
            ]
        );
    }, []);

    useEffect(() => {
        getUserData();
        getData("userData").then(res => {
            if (res["isAdmin"] !== undefined && res["isAdmin"] === true)
                setClientIsAdmin(true);
            else setClientIsAdmin(false);
        });
    }, []);

    const onGesture = useAnimatedGestureHandler({
        onActive: event => {
            x.value = event.translationX;
            const shouldRemove = event.translationX >= TRANSLATE_X_THRESHOLD;
            if (shouldRemove) {
                iconScale.value = withSpring(1.33, {
                    damping: 10,
                    stiffness: 90,
                });
            } else
                iconScale.value = withSpring(1, {
                    damping: 10,
                    stiffness: 90,
                });
        },
        onEnd: () => {
            const shouldRemove = x.value >= TRANSLATE_X_THRESHOLD;
            VIBRATED = false;
            if (shouldRemove) {
                x.value = withSpring(
                    0,
                    {
                        damping: 10,
                        stiffness: 90,
                    },
                    done => {
                        if (done && onRem) runOnJS(onRem)();
                    }
                );
            } else {
                x.value = withSpring(0, {
                    damping: 10,
                    stiffness: 90,
                });
            }
        },
    });

    const panStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: x.value,
                },
            ],
        };
    });
    const iconStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: iconScale.value,
                },
            ],
        };
    });

    return (
        <View style={style}>
            <PanGestureHandler
                onGestureEvent={onGesture}
                enabled={clientIsAdmin && REMOVE_ENABLED}>
                <Animated.View
                    style={[{ width: "100%", position: "relative" }, panStyle]}>
                    {/* Header */}
                    <View style={[styles.userContainer]}>
                        {/* Profile pic */}
                        <View style={styles.userPbContainer}>
                            <Image
                                source={{ uri: user.pbUri }}
                                style={styles.userPb}
                                resizeMode="cover"
                                resizeMethod="auto"
                            />
                        </View>
                        {/* Username */}
                        <Text
                            style={[
                                s.Tmd,
                                s.tWhite,
                                {
                                    marginLeft: s.defaultMmd,
                                },
                            ]}>
                            {user.name}
                        </Text>
                        {/* Timestamp */}
                        <Text
                            style={[
                                s.TsmLt,
                                s.tBlue,
                                {
                                    marginLeft: s.defaultMmd,
                                },
                            ]}>
                            {convertTimestampToString(commentData.created)}
                        </Text>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={[s.tWhite, s.Tmd]}>
                            {commentData.content}
                        </Text>
                    </View>

                    {/* ICON */}
                    <View style={[styles.iconContainer, s.bgRed]}>
                        <Animated.View style={[styles.icon, iconStyle]}>
                            <SVG_Basket fill={s.colors.white} />
                        </Animated.View>
                    </View>
                </Animated.View>
            </PanGestureHandler>
        </View>
    );

    return (
        <View style={style}>
            <View>
                {/* Header */}
                <View style={[styles.userContainer]}>
                    {/* Profile pic */}
                    <View style={styles.userPbContainer}>
                        <Image
                            source={{ uri: user.pbUri }}
                            style={styles.userPb}
                            resizeMode="cover"
                            resizeMethod="auto"
                        />
                    </View>
                    {/* Username */}
                    <Text
                        style={[
                            s.Tmd,
                            s.tWhite,
                            {
                                marginLeft: s.defaultMmd,
                            },
                        ]}>
                        {user.name}
                    </Text>
                    {/* Timestamp */}
                    <Text
                        style={[
                            s.TsmLt,
                            s.tBlue,
                            {
                                marginLeft: s.defaultMmd,
                            },
                        ]}>
                        {convertTimestampToString(commentData.created)}
                    </Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={[s.tWhite, s.Tmd]}>{commentData.content}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    userContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    userPbContainer: {
        aspectRatio: 1,
        flex: 1,
        width: "100%",
        maxWidth: 32,
        maxHeight: 32,
        borderRadius: 100,
        overflow: "hidden",
        justifyContent: "center",
    },
    userPb: {
        width: "100%",
        height: "100%",
    },

    textContainer: {
        marginTop: s.defaultMsm,
        width: "100%",
    },

    iconContainer: {
        position: "absolute",
        height: "100%",
        width: Dimensions.get("window").width,
        justifyContent: "center",
        alignItems: "flex-end",
        left: -Dimensions.get("window").width - s.Pmd.paddingHorizontal,
    },
    icon: {
        aspectRatio: 1,
        height: "40%",
        marginRight: "5%",
    },
});
