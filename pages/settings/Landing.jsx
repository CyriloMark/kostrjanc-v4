import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Pressable,
    Image,
} from "react-native";

import * as style from "../../styles";

import * as Account from "../../components/settings";

import { openLink } from "../../constants";
import { User_Placeholder } from "../../constants/content/PlaceholderData";
import { getData } from "../../constants/storage";

import BackHeader from "../../components/BackHeader";
import WarnButton from "../../components/settings/WarnButton";
import OptionButton from "../../components/OptionButton";

import SVG_Settings from "../../assets/svg/Settings";
import SVG_Recent from "../../assets/svg/Recent";
import SVG_Search from "../../assets/svg/Search";
import SVG_Moderator from "../../assets/svg/Moderator";
import SVG_Ban from "../../assets/svg/Ban";
import SVG_Admin from "../../assets/svg/Admin";
import SVG_Profile from "../../assets/svg/Profile";
import SVG_Basket from "../../assets/svg/Basket";

export default function Landing({ navigation }) {
    const [userData, setUserData] = useState({
        uid: "",
        data: User_Placeholder,
    });

    useEffect(() => {
        getUserData();
    }, []);

    let getUserData = async () => {
        setUserData({
            uid: await getData("userId"),
            data: await getData("userData"),
        });
    };

    return (
        <View style={[style.container, style.bgBlack]}>
            {/* Header */}
            <Pressable style={{ zIndex: 10 }}>
                <BackHeader
                    title={"Zastajenja"}
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
                scrollEventThrottle={16}
                automaticallyAdjustKeyboardInsets
                automaticallyAdjustContentInsets
                snapToAlignment="center"
                snapToEnd>
                <WarnButton
                    style={styles.sectionContainer}
                    text={"Sy zmylk namakał?"}
                    sub={"Přizjeł tutón nam prošu!"}
                    onPress={() =>
                        openLink("https://kostrjanc.de/pomoc/formular#bugs")
                    }
                />

                {/* Client */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.tWhite, style.TlgBd]}>Aplikacija:</Text>
                    <OptionButton
                        style={styles.optionButton}
                        icon={<SVG_Settings fill={style.colors.white} />}
                        title="Powšitkowne zastajenja"
                    />
                    <OptionButton
                        style={styles.optionButton}
                        icon={<SVG_Recent fill={style.colors.white} />}
                        title="Powěsće wot kostrjanc"
                    />
                </View>

                {/* about kostrjanc */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.tWhite, style.TlgBd]}>
                        Přez kostrjanc:
                    </Text>
                    <OptionButton
                        style={styles.optionButton}
                        title="Pomoc"
                        icon={<SVG_Search fill={style.colors.white} />}
                        onPress={() => navigation.navigate("settings-help")}
                    />
                    <OptionButton
                        style={styles.optionButton}
                        icon={<SVG_Moderator fill={style.colors.white} />}
                        title="Werifikacija"
                        onPress={() => navigation.navigate("settings-verify")}
                    />
                    <OptionButton
                        style={styles.optionButton}
                        title="Datowy škit a impresum"
                        icon={<SVG_Ban fill={style.colors.white} />}
                        onPress={() =>
                            navigation.navigate("settings-datasec&impresum")
                        }
                    />
                    <OptionButton
                        style={styles.optionButton}
                        icon={<SVG_Admin fill={style.colors.white} />}
                        title="Funkcije za admina a moderatora"
                        onPress={() => navigation.navigate("settings-admin")}
                    />
                </View>

                {/* Account */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.tWhite, style.TlgBd]}>Konto:</Text>

                    {/* Account */}
                    <Pressable
                        style={[
                            style.Pmd,
                            style.border,
                            styles.optionButton,
                            styles.accountContainer,
                        ]}
                        onPress={() =>
                            navigation.navigate("settings-profile", {
                                uid: userData.uid,
                                userData: userData.data,
                            })
                        }>
                        <View
                            style={[
                                styles.accountImageContainer,
                                style.oHidden,
                            ]}>
                            <Image
                                style={[style.allMax]}
                                resizeMode="cover"
                                source={{ uri: userData.data.pbUri }}
                            />
                        </View>
                        <View style={styles.accountTextContainer}>
                            <Text style={[style.tWhite, style.TlgRg]}>
                                {userData.data.name}
                            </Text>
                            <Text
                                style={[
                                    style.tWhite,
                                    style.TsmLt,
                                    { marginTop: style.defaultMsm },
                                ]}>
                                {userData.uid}
                            </Text>
                        </View>
                    </Pressable>

                    <OptionButton
                        style={styles.optionButton}
                        title="So wulogować"
                        onPress={Account.logout}
                        icon={<SVG_Profile fill={style.colors.red} />}
                        red
                    />
                    <OptionButton
                        style={styles.optionButton}
                        title="Konto wotstronić"
                        icon={<SVG_Basket fill={style.colors.red} />}
                        onPress={() =>
                            Account.deleteAccount(userData.uid, userData.data)
                        }
                        red
                    />
                </View>
                {/* End Account */}

                {/* Footer */}
                <View style={[styles.sectionContainer, style.allCenter]}>
                    <Text style={[style.TsmLt, style.tWhite, style.tCenter]}>
                        wersija {require("../../app.json").expo.version}
                        {"\n"}
                        Produced by Mark, Cyril; Baier, Korla{"\n"}© 2023 All
                        Rights Reserved
                    </Text>
                </View>
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
