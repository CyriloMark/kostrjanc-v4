import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";

import * as s from "../../styles";

// import Firebase
import { get, child, ref, getDatabase } from "firebase/database";

// import SVGs
import SVG_Close from "../../assets/svg/CloseFilled";

// import Constants
import { User_Placeholder } from "../../constants/content/PlaceholderData";
import { LinearGradient } from "expo-linear-gradient";

export default function MemberElement({ style, id, onPress, selectable }) {
    const [name, setName] = useState(User_Placeholder.name);

    const loadData = () => {
        get(child(ref(getDatabase()), `users/${id}/name`))
            .then(nameSnap => {
                if (nameSnap.exists()) setName(nameSnap.val());
            })
            .catch(error =>
                console.log(
                    "error in components/groups/MemberElement.jsx",
                    "loadData",
                    error.code
                )
            );
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <View
            style={[
                style,
                s.oVisible,
                selectable ? styles.shadow : styles.blank,
            ]}>
            <Pressable
                style={[
                    s.allCenter,
                    styles.container,
                    s.oHidden,
                    {
                        opacity: selectable ? 1 : 0.5,
                    },
                ]}
                onPress={selectable ? onPress : null}>
                <LinearGradient
                    colors={[s.colors.red, s.colors.white]}
                    end={{ x: 0.5, y: 2.5 }}
                    locations={[0, 0.75]}
                    style={[s.allCenter, s.Psm, styles.inner]}>
                    {selectable ? (
                        <View style={styles.iconContainer}>
                            <SVG_Close style={s.allMax} fill={s.colors.black} />
                        </View>
                    ) : null}
                    <Text
                        style={[
                            s.TsmRg,
                            s.colors.black,
                            {
                                textAlign: "center",
                                fontFamily: "Barlow_Bold",
                            },
                        ]}>
                        {name}
                    </Text>
                </LinearGradient>
            </Pressable>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        // width: "100%",
        borderRadius: 9,
    },
    inner: {
        borderRadius: 9,
        flexDirection: "row",
    },

    iconContainer: {
        width: 12,
        height: 12,
        marginRight: s.defaultMsm,
    },

    shadow: {
        // Shadow
        shadowRadius: 5,
        shadowOpacity: 0.5,
        shadowColor: s.colors.red,
        shadowOffset: {
            width: 0,
            height: -2,
        },
        borderRadius: 10,
        backgroundColor: s.colors.black,

        borderColor: s.colors.red,
        borderWidth: 1,
    },
    blank: {
        // Shadow
        shadowRadius: 10,
        shadowOpacity: 0.25,
        shadowColor: s.colors.red,
        shadowOffset: {
            width: 0,
            height: -2,
        },
        borderRadius: 10,
        backgroundColor: s.colors.black,

        // borderColor: s.colors.red,
        // borderWidth: 1,
    },
});
