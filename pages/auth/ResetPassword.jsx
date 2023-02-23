import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    Pressable,
    Keyboard,
    Alert,
    Platform,
    ScrollView,
    KeyboardAvoidingView,
    InputAccessoryView,
} from "react-native";

import * as style from "../../styles";

import { getAuthErrorMsg } from "../../constants/error/auth";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import BackHeader from "../../components/BackHeader";
import InputField from "../../components/InputField";
import EnterButton from "../../components/auth/EnterButton";

let reseted = false;

export default function ResetPassword({ navigation }) {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    const [resetPWData, setResetPWData] = useState({
        email: "",
    });
    const [dataFull, setDataFull] = useState(false);

    const setAlert = error => {
        Alert.alert("Zmylk we wróčosadźenju", getAuthErrorMsg(error), [
            {
                text: "Ok",
                isPreferred: true,
                style: "cancel",
            },
        ]);
    };

    const reset = () => {
        if (reseted) {
            setAlert("Sy hižo hesło wróčo sadźił.");
            return;
        }
        reseted = true;
        const auth = getAuth();
        sendPasswordResetEmail(auth, resetEmail)
            .then(() => {
                Alert.alert(
                    "Email je so wotpósłała",
                    "Email za wróčosadźenje hesła je so na twoju mailku pósłała.",
                    [
                        {
                            text: "Ok",
                            onPress: () => navigation.goBack(),
                            isPreferred: true,
                            style: "cancel",
                        },
                    ]
                );
            })
            .catch(error => {
                setAlert(error.code);
                console.log(
                    "error pages/auth/ResetPassword.jsx",
                    "reset sendPasswordResetEmail",
                    error.code
                );
            });
    };

    useEffect(() => {
        if (resetPWData.email.match(emailRegex)) setDataFull(true);
        else setDataFull(false);
    }, [resetPWData]);

    return (
        <View style={[style.container, style.bgBlack]}>
            <KeyboardAvoidingView
                style={style.allMax}
                behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <Pressable style={style.allMax} onPress={Keyboard.dismiss}>
                    <BackHeader
                        onBack={() => navigation.goBack()}
                        showReload={false}
                    />

                    <ScrollView
                        keyboardDismissMode="interactive"
                        automaticallyAdjustKeyboardInsets
                        automaticallyAdjustContentInsets
                        snapToAlignment="center"
                        snapToEnd
                        style={[style.container, style.pH, style.oVisible]}>
                        <View style={styles.titleContainer}>
                            <Text style={[style.Ttitle, style.tWhite]}>
                                Hesło wróčo sadźić:
                            </Text>
                        </View>

                        <View style={[style.pH, styles.inputContainer]}>
                            {/* Email */}
                            <View>
                                <Text
                                    style={[
                                        style.Tmd,
                                        style.tWhite,
                                        { marginBottom: style.defaultMsm },
                                    ]}>
                                    Email zapodać:
                                </Text>
                                <InputField
                                    placeholder="Email"
                                    keyboardType="email-address"
                                    autoComplete="email"
                                    inputAccessoryViewID="loginInputAccessoryViewID"
                                    textContentType="email"
                                    icon={
                                        <Text style={[style.tSec, style.Tmd]}>
                                            @
                                        </Text>
                                    }
                                    onChangeText={val => {
                                        setResetPWData({
                                            ...resetPWData,
                                            email: val,
                                        });
                                    }}
                                />
                            </View>
                        </View>

                        <View style={[style.allCenter, styles.button]}>
                            <EnterButton
                                onPress={() => {
                                    if (dataFull) login();
                                }}
                                checked={dataFull}
                            />
                        </View>
                    </ScrollView>
                </Pressable>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "column",
        width: "100%",
        zIndex: 1,
    },
    inputContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
        zIndex: 10,
    },
    button: {
        marginTop: style.defaultMlg,
    },
});
