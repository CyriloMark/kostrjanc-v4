import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";

import * as style from "../../styles";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import BackHeader from "../../components/BackHeader";
import InputField from "../../components/InputField";

export default function Login({ navigation }) {
    const [loginData, setLoginData] = useState({
        email: "cyrilo.mark@gmail.com",
        password: "aA1@962005",
    });

    const login = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, loginData.email, loginData.password)
            .then(userCredential => {
                console.log(userCredential.user.email);
            })
            .catch(error =>
                console.log("error auth/Login.jsx", "login user", error.code)
            );
    };

    useEffect(() => {
        // login();
    }, []);

    return (
        <View style={[style.container, style.bgBlack]}>
            <BackHeader onBack={() => navigation.goBack()} />

            <View
                style={[
                    style.container,
                    style.pH,
                    styles.container,
                    style.oVisible,
                ]}>
                <View style={styles.titleContainer}>
                    <Text style={[style.Ttitle, style.tWhite]}>
                        Přizjew so z twojim kontom:
                    </Text>
                </View>
                <View style={[style.pH, styles.inputContainer]}>
                    <View style={[styles.inputElementContainer]}>
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
                            icon={
                                <Text style={[style.tSec, style.Tmd]}>@</Text>
                            }
                            onChangeText={val => {
                                fetchUsers(val);
                            }}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        marginTop: style.defaultMsm,
        alignItems: "center",
    },
    titleContainer: {
        flexDirection: "column",
        width: "100%",
        marginTop: style.defaultMlg,
        zIndex: 1,
    },
    inputContainer: {
        width: "100%",
        marginTop: style.defaultMsm,
        zIndex: 10,
    },
    inputElementContainer: {},
});
