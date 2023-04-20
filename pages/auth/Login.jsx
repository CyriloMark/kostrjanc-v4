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
} from "react-native";

import * as style from "../../styles";

import { getAuthErrorMsg } from "../../constants/error/auth";
import { getLangs } from "../../constants/langs";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import SVG_Pencil from "../../assets/svg/Pencil";
import SVG_Email from "../../assets/svg/Email";

import BackHeader from "../../components/BackHeader";
import InputField from "../../components/InputField";
import EnterButton from "../../components/auth/EnterButton";

export default function Login({ navigation }) {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [dataFull, setDataFull] = useState(false);

    const login = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, loginData.email, loginData.password)
            .then(userCredential => {
                console.log(userCredential.user.email);
            })
            .catch(error => {
                setAlert(getAuthErrorMsg(error.code));
                console.log("error auth/Login.jsx", "login user", error.code);
            });
    };

    const setAlert = error => {
        Alert.alert(getLangs("auth_login_error_login"), error, [
            {
                text: "Ok",
                isPreferred: true,
                style: "cancel",
            },
        ]);
    };

    useEffect(() => {
        if (loginData.email.match(emailRegex)) setDataFull(true);
        else setDataFull(false);
    }, [loginData]);

    const setUnfullfilledAlert = () => {
        let missing = "";
        if (!loginData.email.match(emailRegex))
            missing += `\n${getLangs("missing_email")}`;

        Alert.alert(
            getLangs("missing_alert_title"),
            `${getLangs("missing_alert_sub")}${missing}`,
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
                            <Text style={[style.Ttitle2, style.tWhite]}>
                                {getLangs("auth_login_title")}
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
                                    {getLangs("input_entertitle_email")}
                                </Text>
                                <InputField
                                    placeholder={getLangs(
                                        "input_placeholder_email"
                                    )}
                                    maxLength={128}
                                    keyboardType="email-address"
                                    autoComplete="email"
                                    textContentType="emailAddress"
                                    icon={
                                        <SVG_Email fill={style.colors.blue} />
                                    }
                                    onChangeText={val => {
                                        setLoginData({
                                            ...loginData,
                                            email: val,
                                        });
                                    }}
                                />
                            </View>

                            {/* PW */}
                            <View style={{ marginTop: style.defaultMlg }}>
                                <Text
                                    style={[
                                        style.Tmd,
                                        style.tWhite,
                                        { marginBottom: style.defaultMsm },
                                    ]}>
                                    {getLangs("input_entertitle_password")}
                                </Text>
                                <InputField
                                    placeholder={getLangs(
                                        "input_placeholder_password"
                                    )}
                                    maxLength={128}
                                    keyboardType="default"
                                    textContentType="password"
                                    secureTextEntry
                                    icon={
                                        <SVG_Pencil fill={style.colors.blue} />
                                    }
                                    onChangeText={val => {
                                        setLoginData({
                                            ...loginData,
                                            password: val,
                                        });
                                    }}
                                />
                            </View>

                            {/* Reset PW */}
                            <Pressable
                                style={{ marginTop: style.defaultMlg }}
                                hitSlop={40}
                                onPress={() => navigation.navigate("reset")}>
                                <Text
                                    style={[
                                        style.tWhite,
                                        style.Tmd,
                                        style.tCenter,
                                    ]}>
                                    {getLangs("auth_login_forgetpassword")}
                                </Text>
                            </Pressable>
                        </View>

                        <View style={[style.allCenter, styles.button]}>
                            <EnterButton
                                onPress={() => {
                                    if (dataFull) login();
                                    else setUnfullfilledAlert();
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
