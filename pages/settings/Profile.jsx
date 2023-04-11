import React from "react";
import {
    View,
    Pressable,
    StyleSheet,
    ScrollView,
    Text,
    Image,
    Alert,
} from "react-native";

import * as style from "../../styles";
import * as Account from "../../components/settings";

import { setStringAsync } from "expo-clipboard";

import BackHeader from "../../components/BackHeader";
import EditProfileButton from "../../components/profile/EditProfileButton";
import OptionButton from "../../components/OptionButton";

import { getLangs } from "../../constants/langs";

import SVG_Copy from "../../assets/svg/Share";
import SVG_Logout from "../../assets/svg/Logout";
import SVG_Basket from "../../assets/svg/Basket";

export default function Profile({ navigation, route }) {
    const { uid, userData } = route.params;

    const copy = async () => {
        const output = `${getLangs("settings_profile_statinfo_username")} ${
            userData.name
        }\n${getLangs("settings_profile_statinfo_uid")} ${uid}\n${getLangs(
            "settings_profile_statinfo_description"
        )} ${userData.description}\n${getLangs(
            "settings_profile_statinfo_amtfollower"
        )} ${userData.follower ? userData.follower.length : 0}\n${getLangs(
            "settings_profile_statinfo_amtfollowing"
        )} ${userData.following ? userData.following.length : 0}\n\n${getLangs(
            "settings_profile_statinfo_amtposts"
        )} ${userData.posts ? userData.posts.length : 0}\n${getLangs(
            "settings_profile_statinfo_amtevents"
        )} ${userData.events ? userData.events.length : 0}\n\n${getLangs(
            "settings_profile_statinfo_posts"
        )}\n
        ${userData.posts.map(
            (p, key) => `${p}${key !== userData.posts.length - 1 ? ", " : ""}`
        )}\n\n${getLangs("settings_profile_statinfo_events")}\n
        ${userData.events.map(
            (e, key) => `${e}${key !== userData.events.length - 1 ? ", " : ""}`
        )}\n\n${getLangs("settings_profile_statinfo_banned")} ${
            userData.isBanned ? getLangs("yes") : getLangs("no")
        }\n${getLangs("settings_profile_statinfo_mod")} ${
            userData.isMod ? getLangs("yes") : getLangs("no")
        }\n${getLangs("settings_profile_statinfo_businessprogram")} ${
            userData.isBuisness ? getLangs("yes") : getLangs("no")
        }\n${getLangs("settings_profile_statinfo_admin")} ${
            userData.isAdmin ? getLangs("yes") : getLangs("no")
        }`;

        await setStringAsync(output);
        Alert.alert(
            getLangs("settings_profile_copy_title"),
            getLangs("settings_profile_copy_sub"),
            [
                {
                    text: "Ok",
                    style: "cancel",
                    isPreferred: true,
                },
            ]
        );
    };

    return (
        <View style={[style.container, style.bgBlack]}>
            {/* Header */}
            <Pressable style={{ zIndex: 10 }}>
                <BackHeader
                    title={getLangs("settings_profile_title")}
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
                {/* Profile Header */}
                <Pressable
                    style={[style.Pmd, style.border, styles.accountContainer]}
                    onLongPress={() => Account.copyUIDToClipboard(uid)}>
                    <View style={[styles.accountImageContainer, style.oHidden]}>
                        <Image
                            style={[style.allMax]}
                            resizeMode="cover"
                            source={{ uri: userData.pbUri }}
                        />
                    </View>
                    <View style={styles.accountTextContainer}>
                        <Text style={[style.tWhite, style.TlgRg]}>
                            {userData.name}
                        </Text>
                        <Text
                            style={[
                                style.tWhite,
                                style.TsmLt,
                                { marginTop: style.defaultMsm },
                            ]}>
                            {uid}
                        </Text>
                    </View>
                </Pressable>

                {/* Edit */}
                <EditProfileButton
                    checked
                    style={[styles.sectionContainer, style.allCenter]}
                    title={getLangs("settings_profile_editbutton")}
                    onPress={() =>
                        navigation.navigate("editProfile", {
                            userData: userData,
                        })
                    }
                />

                {/* Stats */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.tWhite, style.TlgBd]}>
                        {getLangs("settings_profile_statinfo_title")}
                    </Text>
                    <View style={{ marginTop: style.defaultMmd }}>
                        <Text style={[style.Tmd, style.tWhite]}>
                            {getLangs("settings_profile_statinfo_username")}{" "}
                            {userData.name}
                            {"\n"}
                            {getLangs("settings_profile_statinfo_uid")} {uid}
                            {"\n"}
                            {getLangs(
                                "settings_profile_statinfo_description"
                            )}{" "}
                            {userData.description}
                            {"\n"}
                            {getLangs(
                                "settings_profile_statinfo_amtfollower"
                            )}{" "}
                            {userData.follower ? userData.follower.length : 0}
                            {"\n"}
                            {getLangs(
                                "settings_profile_statinfo_amtfollowing"
                            )}{" "}
                            {userData.following ? userData.following.length : 0}
                            {"\n\n"}
                            {getLangs(
                                "settings_profile_statinfo_amtposts"
                            )}{" "}
                            {userData.posts ? userData.posts.length : 0}
                            {"\n"}
                            {getLangs(
                                "settings_profile_statinfo_amtevents"
                            )}{" "}
                            {userData.events ? userData.events.length : 0}
                            {"\n\n"}
                            {userData.posts ? (
                                <Text>
                                    {getLangs(
                                        "settings_profile_statinfo_posts"
                                    )}
                                    {"\n"}
                                    {userData.posts.map((p, key) => (
                                        <Text key={key}>
                                            {p}
                                            {key !== userData.posts.length - 1
                                                ? ", "
                                                : ""}
                                        </Text>
                                    ))}
                                </Text>
                            ) : null}
                            {"\n\n"}
                            {userData.events ? (
                                <Text>
                                    {getLangs(
                                        "settings_profile_statinfo_events"
                                    )}
                                    {"\n"}
                                    {userData.events.map((e, key) => (
                                        <Text key={key}>
                                            {e}
                                            {key !== userData.events.length - 1
                                                ? ", "
                                                : ""}
                                        </Text>
                                    ))}
                                </Text>
                            ) : null}
                            {"\n\n"}
                            {getLangs("settings_profile_statinfo_banned")}{" "}
                            {userData.isBanned
                                ? getLangs("yes")
                                : getLangs("no")}
                            {"\n"}
                            {getLangs("settings_profile_statinfo_mod")}{" "}
                            {userData.isMod ? getLangs("yes") : getLangs("no")}
                            {"\n"}
                            {getLangs(
                                "settings_profile_statinfo_businessprogram"
                            )}{" "}
                            {userData.isBuisness
                                ? getLangs("yes")
                                : getLangs("no")}
                            {"\n"}
                            {getLangs("settings_profile_statinfo_admin")}{" "}
                            {userData.isAdmin
                                ? getLangs("yes")
                                : getLangs("no")}
                        </Text>
                    </View>
                    <OptionButton
                        style={styles.optionButton}
                        title={getLangs("settings_profile_account_copy")}
                        icon={
                            <SVG_Copy
                                style={{
                                    transform: [
                                        {
                                            scale: 0.9,
                                        },
                                    ],
                                }}
                                fill={style.colors.white}
                            />
                        }
                        onPress={copy}
                    />
                </View>

                {/* Actions */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.tWhite, style.TlgBd]}>
                        {getLangs("settings_profile_interaction_title")}
                    </Text>
                    <OptionButton
                        style={styles.optionButton}
                        title={getLangs("settings_landing_account_logout")}
                        icon={
                            <SVG_Logout
                                style={{
                                    transform: [
                                        {
                                            scaleX: -1,
                                        },
                                    ],
                                }}
                                fill={style.colors.red}
                            />
                        }
                        onPress={Account.logout}
                        red
                    />
                    <OptionButton
                        style={styles.optionButton}
                        title={getLangs("settings_landing_account_delete")}
                        icon={<SVG_Basket fill={style.colors.red} />}
                        onPress={() =>
                            Account.deleteAccount(userData.uid, userData.data)
                        }
                        red
                    />
                </View>

                <View style={styles.sectionContainer} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
        flexDirection: "column",
    },

    optionButton: {
        width: "100%",
        marginTop: style.defaultMmd,
    },

    accountContainer: {
        borderRadius: 10,
        borderColor: style.colors.white,
        flexDirection: "row",
        alignItems: "center",
    },
    accountImageContainer: {
        aspectRatio: 1,
        flex: 1,
        maxWidth: 58,
        maxHeight: 58,
        borderRadius: 100,
    },
    accountTextContainer: {
        flexDirection: "column",
        marginLeft: style.defaultMmd,
        flex: 1,
    },
});
