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

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import SVG_Pencil from "../../assets/svg/Pencil";

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
        Alert.alert("Zmylk w přizjewjenju", error, [
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
                                Přizjew so z twojim kontom:
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
                                    Hesło zapodać:
                                </Text>
                                <InputField
                                    placeholder="Hesło"
                                    keyboardType="default"
                                    textContentType="password"
                                    secureTextEntry
                                    icon={
                                        <SVG_Pencil fill={style.colors.sec} />
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
                                onPress={() => navigation.navigate("reset")}>
                                <Text
                                    style={[
                                        style.tBlue,
                                        style.Tmd,
                                        style.tCenter,
                                    ]}>
                                    Hesło zabył?
                                </Text>
                            </Pressable>
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
