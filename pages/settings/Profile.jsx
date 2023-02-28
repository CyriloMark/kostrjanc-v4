import React from "react";
import {
    View,
    Pressable,
    StyleSheet,
    ScrollView,
    Text,
    Image,
} from "react-native";

import * as style from "../../styles";
import * as Account from "../../components/settings";

import BackHeader from "../../components/BackHeader";
import EditProfileButton from "../../components/profile/EditProfileButton";
import OptionButton from "../../components/OptionButton";

export default function Profile({ navigation, route }) {
    const { uid, userData } = route.params;

    return (
        <View style={[style.container, style.bgBlack]}>
            {/* Header */}
            <Pressable style={{ zIndex: 10 }}>
                <BackHeader
                    title={"Konto"}
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
                    style={[
                        style.Pmd,
                        style.border,
                        style.container,
                        styles.accountContainer,
                    ]}
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
                    title={"Wobdźěłać"}
                    onPress={() =>
                        navigation.navigate("editProfile", {
                            userData: userData,
                        })
                    }
                />

                {/* Stats */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.tWhite, style.TlgBd]}>
                        Statistiki a informacije:
                    </Text>
                    <View style={{ marginTop: style.defaultMmd }}>
                        <Text style={[style.Tmd, style.tWhite]}>
                            Wužiwarske mjeno: {userData.name}
                            {"\n"}
                            Wužiwarska id: {uid}
                            {"\n"}
                            Wopisownje konta: {userData.description}
                            {"\n"}
                            Expo Push Token: {userData.expoPushToken}
                            {"\n"}
                            Link k profilnemu wobrazej: {userData.pbUri}
                            {"\n"}
                            Mnóstwo sćěhowarjow:{" "}
                            {userData.follower ? userData.follower.length : 0}
                            {"\n"}
                            Mnóstwo sćěhowanych profilow:{" "}
                            {userData.following ? userData.following.length : 0}
                            {"\n\n"}
                            Mnóstwo wozjewjenych postow:{" "}
                            {userData.posts ? userData.posts.length : 0}
                            {"\n"}
                            Mnóstwo wozjewjenych ewentow:{" "}
                            {userData.events ? userData.events.length : 0}
                            {"\n\n"}
                            {userData.posts ? (
                                <Text>
                                    Lisćina wozjewjenych postow z id:{"\n"}
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
                                    Lisćina wozjewjenych ewentow z id:{"\n"}
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
                            Banowany: {userData.isBanned ? "Haj" : "Ně"}
                            {"\n"}
                            Moderator: {userData.isMod ? "Haj" : "Ně"}
                            {"\n"}
                            Business Program Partner:{" "}
                            {userData.isBuisness ? "Haj" : "Ně"}
                            {"\n"}
                            Admin: {userData.isAdmin ? "Haj" : "Ně"}
                        </Text>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.tWhite, style.TlgBd]}>
                        Interakcije:
                    </Text>
                    <OptionButton
                        style={styles.optionButton}
                        title="So wulogować"
                        onPress={Account.logout}
                        red
                    />
                    <OptionButton
                        style={styles.optionButton}
                        title="Konto wotstronić"
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
