import React, { useState, useEffect } from "react";
import { View, Pressable, StyleSheet, ScrollView, Text } from "react-native";

import * as style from "../../styles";

import { getLangs } from "../../constants/langs";
import * as notifications from "../../constants/settings/notifications";

import BackHeader from "../../components/BackHeader";
import Switch from "../../components/settings/Switch";
import EditProfileButton from "../../components/profile/EditProfileButton";

export default function Notifications({ navigation }) {
    const [actives, setActives] = useState({
        follower: false,
        contents: false,
        comments: false,
        eventStart: false,
    });

    const overrideNotificationSettings = async () => {
        notifications.setNotificationSettings(actives).then(res => {
            // Alert
            navigation.goBack();
        });
    };

    useEffect(() => {
        setActives(notifications.getNotificationSettings());
    }, []);

    return (
        <View style={[style.container, style.bgBlack]}>
            {/* Header */}
            <Pressable style={{ zIndex: 10 }}>
                <BackHeader
                    title={getLangs("settings_notifications_title")}
                    onBack={() => navigation.goBack()}
                    showReload={false}
                />
            </Pressable>

            <ScrollView
                style={[
                    style.container,
                    style.pH,
                    style.oVisible,
                    { marginTop: style.defaultMsm },
                ]}
                keyboardDismissMode="interactive"
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                automaticallyAdjustKeyboardInsets
                automaticallyAdjustContentInsets
                snapToAlignment="center"
                snapToEnd>
                {/* Title */}
                <View>
                    <Text style={[style.TlgBd, style.tWhite]}>
                        {getLangs("settings_notifications_h2")}
                    </Text>
                </View>

                {/* New Follow */}
                <View style={styles.sectionContainer}>
                    <View
                        style={[
                            style.Pmd,
                            style.border,
                            styles.subsectionContainer,
                        ]}>
                        <View style={styles.subsectionTitleContainer}>
                            <Text style={[style.TlgBd, style.tWhite]}>
                                {getLangs(
                                    "settings_notifications_follower_title"
                                )}
                            </Text>
                            <Switch
                                active={actives.follower}
                                onToggle={() =>
                                    setActives(prev => {
                                        return {
                                            ...prev,
                                            follower: !prev.follower,
                                        };
                                    })
                                }
                            />
                        </View>
                        <Text
                            style={[
                                { marginTop: style.defaultMmd },
                                style.tWhite,
                                style.Tmd,
                            ]}>
                            {getLangs("settings_notifications_follower_sub")}
                        </Text>
                    </View>
                    {/* <Text
                        style={[
                            style.pH,
                            style.TsmRg,
                            style.tWhite,
                            { marginTop: style.defaultMmd },
                        ]}>
                        Adipisicing ut laborum est elit ut aliquip mollit.
                    </Text> */}
                </View>

                {/* New Content */}
                <View style={styles.sectionContainer}>
                    <View
                        style={[
                            style.Pmd,
                            style.border,
                            styles.subsectionContainer,
                        ]}>
                        <View style={styles.subsectionTitleContainer}>
                            <Text style={[style.TlgBd, style.tWhite]}>
                                {getLangs(
                                    "settings_notifications_contents_title"
                                )}
                            </Text>
                            <Switch
                                active={actives.contents}
                                onToggle={() =>
                                    setActives(prev => {
                                        return {
                                            ...prev,
                                            contents: !prev.contents,
                                        };
                                    })
                                }
                            />
                        </View>
                        <Text
                            style={[
                                { marginTop: style.defaultMmd },
                                style.tWhite,
                                style.Tmd,
                            ]}>
                            {getLangs("settings_notifications_contents_sub")}
                        </Text>
                    </View>
                    {/* <Text
                        style={[
                            style.pH,
                            style.TsmRg,
                            style.tWhite,
                            { marginTop: style.defaultMmd },
                        ]}>
                        Adipisicing ut laborum est elit ut aliquip mollit.
                    </Text> */}
                </View>

                {/* Comment on Content */}
                <View style={styles.sectionContainer}>
                    <View
                        style={[
                            style.Pmd,
                            style.border,
                            styles.subsectionContainer,
                        ]}>
                        <View style={styles.subsectionTitleContainer}>
                            <Text style={[style.TlgBd, style.tWhite]}>
                                {getLangs(
                                    "settings_notifications_comments_title"
                                )}
                            </Text>
                            <Switch
                                active={actives.comments}
                                onToggle={() =>
                                    setActives(prev => {
                                        return {
                                            ...prev,
                                            comments: !prev.comments,
                                        };
                                    })
                                }
                            />
                        </View>
                        <Text
                            style={[
                                { marginTop: style.defaultMmd },
                                style.tWhite,
                                style.Tmd,
                            ]}>
                            {getLangs("settings_notifications_comments_sub")}
                        </Text>
                    </View>
                    {/* <Text
                        style={[
                            style.pH,
                            style.TsmRg,
                            style.tWhite,
                            { marginTop: style.defaultMmd },
                        ]}>
                        Adipisicing ut laborum est elit ut aliquip mollit.
                    </Text> */}
                </View>

                {/* Event Start */}
                <View style={styles.sectionContainer}>
                    <View
                        style={[
                            style.Pmd,
                            style.border,
                            styles.subsectionContainer,
                        ]}>
                        <View style={styles.subsectionTitleContainer}>
                            <Text style={[style.TlgBd, style.tWhite]}>
                                {getLangs(
                                    "settings_notifications_eventstart_title"
                                )}
                            </Text>
                            <Switch
                                active={actives.eventStart}
                                onToggle={() =>
                                    setActives(prev => {
                                        return {
                                            ...prev,
                                            eventStart: !prev.eventStart,
                                        };
                                    })
                                }
                            />
                        </View>
                        <Text
                            style={[
                                { marginTop: style.defaultMmd },
                                style.tWhite,
                                style.Tmd,
                            ]}>
                            {getLangs("settings_notifications_eventstart_sub")}
                        </Text>
                    </View>
                    {/* <Text
                        style={[
                            style.pH,
                            style.TsmRg,
                            style.tWhite,
                            { marginTop: style.defaultMmd },
                        ]}>
                        Adipisicing ut laborum est elit ut aliquip mollit.
                    </Text> */}
                </View>

                <View style={styles.editButton}>
                    <EditProfileButton
                        checked
                        title={getLangs("profile_editbuttontext")}
                        onPress={overrideNotificationSettings}
                    />
                </View>

                <View style={styles.sectionContainer}></View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
    },

    subsectionContainer: {
        width: "100%",
        borderRadius: 10,
        borderColor: style.colors.white,
    },
    subsectionTitleContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    editButton: {
        marginVertical: style.defaultMlg,
        alignSelf: "center",
    },
});
