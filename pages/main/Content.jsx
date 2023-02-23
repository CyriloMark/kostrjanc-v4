import React, { useRef, useCallback, useState } from "react";
import {
    Keyboard,
    Pressable,
    StyleSheet,
    View,
    Text,
    ScrollView,
    RefreshControl,
    Image,
    Platform,
} from "react-native";

import AddButton from "../../components/content/AddButton";
import ContentHeader from "../../components/content/ContentHeader";
import InputField from "../../components/InputField";
import User from "../../components/cards/User";
import Refresh from "../../components/RefreshControl";

import { getDatabase, get, ref, child } from "firebase/database";

import { wait } from "../../constants/wait";
import { lerp, splitterForContent } from "../../constants";

import * as style from "../../styles";

import SVG_Search from "../../assets/svg/Search";
import SVG_Post from "../../assets/svg/Post";
import SVG_Event from "../../assets/svg/Event";

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    Easing,
} from "react-native-reanimated";

let UsersData = null;

export default function Content({ navigation }) {
    const contentScrollRef = useRef();

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getRandomUser();
        wait(1000).then(() => setRefreshing(false));
    }, []);

    const [searchResult, setSearchResult] = useState([]);
    const [randomUser, setRandomUser] = useState(null);

    let getSearchResult = text => {
        let output = [];
        let searchQuery = text.toLowerCase();

        for (const key in UsersData) {
            let user = UsersData[key].name.toLowerCase();

            if (user.slice(0, searchQuery.length).indexOf(searchQuery) !== -1) {
                if (searchResult.length <= 5) {
                    if (!UsersData[key].isBanned) {
                        output.push({
                            name: UsersData[key].name,
                            pbUri: UsersData[key].pbUri,
                            id: key,
                        });
                    }
                }
            }
        }

        setSearchResult(output);
    };

    const fetchUsers = text => {
        if (text.length <= 0 || text.length > 64) {
            setSearchResult([]);
            return;
        }

        if (!UsersData) {
            const db = getDatabase();
            get(child(ref(db), "users"))
                .then(usersSnap => {
                    if (!usersSnap.exists()) {
                        setSearchResult([]);
                        return;
                    }

                    const usersData = usersSnap.val();
                    UsersData = usersData;

                    getSearchResult(text);
                })
                .catch(error =>
                    console.log(
                        "error main/Content.jsx",
                        "fetchUsers get users",
                        error.code
                    )
                );
        } else getSearchResult(text);
    };

    const getRandomUser = () => {
        const db = getDatabase();
        get(child(ref(db), "users"))
            .then(usersSnap => {
                if (!usersSnap.exists()) return;

                const usersData = usersSnap.val();
                UsersData = usersData;

                const data = Object.entries(usersData);
                const random = Math.round(lerp(0, data.length, Math.random()));
                const randomUser = {
                    id: data[random][0],
                    name: data[random][1]["name"],
                    pbUri: data[random][1]["pbUri"],
                };
                setRandomUser(randomUser);
            })
            .catch(error =>
                console.log(
                    "error main/Content.jsx",
                    "getRandomUser get users",
                    error.code
                )
            );
    };

    //#region anim

    const [createViewVisible, setCreateViewVisible] = useState(false);

    const leftBoxOpacity = useSharedValue(0);
    const leftBoxOffsetX = useSharedValue(0);
    const leftBoxOffsetY = useSharedValue(0);

    const rightBoxOpacity = useSharedValue(0);
    const rightBoxOffsetX = useSharedValue(0);
    const rightBoxOffsetY = useSharedValue(0);

    const leftBoxStyles = useAnimatedStyle(() => {
        return {
            top: withSpring(leftBoxOffsetY.value, {
                damping: 10,
                stiffness: 90,
            }),
            left: withSpring(leftBoxOffsetX.value, {
                damping: 10,
                stiffness: 90,
            }),
            opacity: withTiming(leftBoxOpacity.value, {
                duration: 100,
                easing: Easing.ease,
            }),
        };
    });

    const rightBoxStyles = useAnimatedStyle(() => {
        return {
            top: withSpring(rightBoxOffsetY.value, {
                damping: 10,
                stiffness: 90,
            }),
            right: withSpring(rightBoxOffsetX.value, {
                damping: 10,
                stiffness: 90,
            }),
            opacity: withTiming(rightBoxOpacity.value, {
                duration: 100,
                easing: Easing.ease,
            }),
        };
    });

    const toggleAccountView = () => {
        setCreateViewVisible(val => {
            leftBoxOffsetX.value = val ? 0 : -72;
            leftBoxOffsetY.value = val ? 0 : -72;
            leftBoxOpacity.value = val ? 0 : 1;

            rightBoxOffsetX.value = val ? 0 : -72;
            rightBoxOffsetY.value = val ? 0 : -72;
            rightBoxOpacity.value = val ? 0 : 1;

            return !val;
        });
    };
    //#endregion

    return (
        <View style={[style.container, style.bgBlack]}>
            <ContentHeader
                onBack={() => navigation.navigate("landing")}
                onSettingsPress={() => navigation.navigate("settings")}
            />
            {/* Search Input */}
            <View
                style={[
                    style.pH,
                    { width: "100%", marginTop: style.defaultMsm, zIndex: 10 },
                ]}>
                <InputField
                    placeholder="Pytaj za něčim..."
                    icon={<SVG_Search fill={style.colors.sec} />}
                    onChangeText={val => {
                        fetchUsers(val);
                    }}
                    bg={`rgba(${style.colorsRGB.black},.9)`}
                />
            </View>

            <ScrollView
                ref={contentScrollRef}
                style={[
                    style.container,
                    style.pH,
                    style.oVisible,
                    { marginTop: style.defaultMsm },
                ]}
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                automaticallyAdjustKeyboardInsets
                automaticallyAdjustContentInsets
                snapToAlignment="center"
                snapToEnd
                refreshControl={
                    Platform.OS === "ios" ? (
                        <Refresh
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    ) : null
                }>
                <Pressable
                    onPress={() => {
                        Keyboard.dismiss();
                        if (createViewVisible) toggleAccountView();
                    }}
                    style={{ alignItems: "center" }}>
                    {randomUser ? (
                        <View
                            style={{
                                marginTop: style.defaultMmd,
                                width: "100%",
                                alignItems: "center",
                            }}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                Pohladaj raz pola:
                            </Text>
                            <User
                                onPress={() => {
                                    navigation.navigate("profileView", {
                                        id: randomUser.id,
                                    });
                                }}
                                style={{
                                    marginTop: style.defaultMmd,
                                }}
                                user={randomUser}
                            />
                        </View>
                    ) : (
                        <Text
                            style={[
                                style.tWhite,
                                style.TlgBd,
                                { marginTop: style.defaultMmd },
                            ]}>
                            {getRandomUser()}
                            Pytaj za něčim.
                        </Text>
                    )}

                    {searchResult.length !== 0 ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                Pytanski wuslědk:
                            </Text>
                            {searchResult.map((user, key) => (
                                <Pressable
                                    key={key}
                                    style={[styles.userContainer, style.Psm]}
                                    onPress={() =>
                                        navigation.navigate("profileView", {
                                            id: user.id,
                                        })
                                    }>
                                    <View style={styles.userPbContainer}>
                                        <Image
                                            source={{
                                                uri: user.pbUri,
                                            }}
                                            style={styles.userPb}
                                            resizeMode="cover"
                                            resizeMethod="auto"
                                        />
                                    </View>
                                    <Text
                                        style={[
                                            style.Tmd,
                                            style.tWhite,
                                            {
                                                marginLeft: style.defaultMmd,
                                            },
                                        ]}>
                                        {user.name}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    ) : null}
                </Pressable>
            </ScrollView>

            <View style={[styles.addBtnContainer, style.allCenter]}>
                <View style={{ position: "relative" }}>
                    {/* Left Box / Post */}
                    <Animated.View style={[styles.sideBox, leftBoxStyles]}>
                        <Pressable
                            onPress={() => navigation.navigate("postCreate")}
                            style={[
                                styles.sideBoxInner,
                                style.Pmd,
                                style.border,
                                style.allCenter,
                                style.allMax,
                            ]}>
                            <SVG_Post
                                style={[style.boxShadow, style.oVisible]}
                                fill={style.colors.white}
                            />
                        </Pressable>
                    </Animated.View>

                    {/* Right Box / Event */}
                    <Animated.View style={[styles.sideBox, rightBoxStyles]}>
                        <Pressable
                            onPress={() => navigation.navigate("eventCreate")}
                            style={[
                                styles.sideBoxInner,
                                style.Pmd,
                                style.border,
                                style.allCenter,
                                style.allMax,
                            ]}>
                            <SVG_Event
                                style={[style.boxShadow, style.oVisible]}
                                fill={style.colors.white}
                            />
                        </Pressable>
                    </Animated.View>

                    <AddButton
                        checked={createViewVisible}
                        onPress={toggleAccountView}
                        style={{ zIndex: 2 }}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    addBtnContainer: {
        position: "absolute",
        width: "100%",
        bottom: Platform.OS === "ios" ? style.defaultMsm : style.defaultMlg,
        minHeight: 72,
    },

    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
    },

    userContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginTop: style.defaultMsm,
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

    sideBox: {
        position: "absolute",
        aspectRatio: 1,
        width: 58,
        zIndex: 2,
    },
    sideBoxInner: {
        borderColor: style.colors.blue,
        backgroundColor: `rgba(${style.colorsRGB.black}, .75)`,
        borderRadius: 10,
    },
});
