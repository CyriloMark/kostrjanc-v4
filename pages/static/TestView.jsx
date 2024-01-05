import React, { useEffect, useState } from "react";
import {
    View,
    Image,
    StyleSheet,
    Text,
    ScrollView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as style from "../../styles";

// import Constants
import { getLangs } from "../../constants/langs";
import { openLink } from "../../constants";

// import Components
import AppHeader from "../../components/auth/AppHeader";
import EnterButton from "../../components/auth/EnterButton";

import { getAuth } from "firebase/auth";
import { get, getDatabase, ref, child } from "firebase/database";
import Loading from "./Loading";

export default function TestView(props) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (getAuth().currentUser.uid === "Co2jZnyLZaf04HihTPtrzDNzaBG2")
            props.onCheck();
        else {
            const db = getDatabase();
            get(child(ref(db), "beta"))
                .then(betaSnap => {
                    if (!betaSnap.exists) {
                        props.onCheck();
                        return;
                    }
                    const beta = betaSnap.val();
                    setLangCriteriasWorking(beta.working);
                    setLangCriteriasReported(beta.reported);
                    setLoading(false);
                })
                .catch(error =>
                    console.log("error in TestView", "getBetaData", error.code)
                );
        }
    }, []);

    const [langCriteriasWorking, setLangCriteriasWorking] = useState([]);
    const [langCriteriasReported, setLangCriteriasReported] = useState([]);

    if (loading) return <Loading />;

    return (
        <SafeAreaView style={[style.container, style.bgBlack]}>
            <AppHeader />
            <ScrollView
                keyboardDismissMode="interactive"
                automaticallyAdjustKeyboardInsets
                automaticallyAdjustContentInsets
                style={[style.container, style.pH, style.oVisible]}>
                <Text
                    style={[
                        style.Ttitle2,
                        style.tWhite,
                        { marginTop: style.defaultMsm },
                    ]}>
                    {getLangs("testview_title")}
                    <Text style={style.tBlue}>kostrjanc</Text>.
                </Text>
                <Text
                    style={[
                        style.Tmd,
                        style.tWhite,
                        { marginTop: style.defaultMmd },
                    ]}>
                    {getLangs("testview_sub_0")}
                    <Text
                        style={[
                            style.tBlue,
                            {
                                textDecorationStyle: "solid",
                                textDecorationLine: "underline",
                                textDecorationColor: style.colors.blue,
                            },
                        ]}
                        onPress={() => openLink("mailto:kostrjanc@gmail.com")}>
                        kostrjanc@gmail.com
                    </Text>
                    {getLangs("testview_sub_1")}
                </Text>

                <Text
                    style={[
                        style.tCenter,
                        style.Tmd,
                        style.tWhite,
                        { marginTop: style.defaultMlg },
                    ]}>
                    {getLangs("updateversion_currentversion")}{" "}
                    <Text style={style.TsmLt}>
                        {require("../../app.json").expo.version}
                    </Text>
                </Text>

                <View style={{ marginTop: style.defaultMlg }}>
                    <Text style={[style.TlgBd, style.tWhite]}>
                        {getLangs("testview_new_title")}
                    </Text>
                    {langCriteriasWorking.map((fkt, key) => (
                        <Text
                            key={key}
                            style={[
                                style.Tmd,
                                style.tWhite,
                                { marginTop: style.defaultMsm },
                            ]}>
                            {"- "}
                            {fkt}
                        </Text>
                    ))}
                </View>
                <View style={{ marginTop: style.defaultMlg }}>
                    <Text style={[style.TlgBd, style.tWhite]}>
                        {getLangs("testview_missing_title")}
                    </Text>
                    {langCriteriasReported.map((fkt, key) => (
                        <Text
                            key={key}
                            style={[
                                style.Tmd,
                                style.tWhite,
                                { marginTop: style.defaultMsm },
                            ]}>
                            {"- "}
                            {fkt}
                        </Text>
                    ))}
                </View>

                <Text
                    style={[
                        style.tCenter,
                        style.TlgBd,
                        style.tWhite,
                        { marginTop: style.defaultMlg },
                    ]}>
                    {getLangs("testview_thx")}
                </Text>

                <View style={[style.allCenter, styles.button]}>
                    <EnterButton onPress={() => props.onCheck()} checked />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        // justifyContent: "space-evenly",
        flexDirection: "column",
    },
    button: {
        marginVertical: style.defaultMlg,
    },
});
