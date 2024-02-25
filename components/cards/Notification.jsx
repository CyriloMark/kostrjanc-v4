import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

import { getDatabase, ref, get, child } from "firebase/database";

import * as s from "../../styles";

import SVG_One from "../../assets/svg/One";

import { Notification_Placeholder } from "../../constants/content/PlaceholderData";
import Notification_Types from "../../constants/content/notifications";

import { LinearGradient } from "expo-linear-gradient";

export default function Notification({ type, style, id, onPress }) {
    const [notification, setNotification] = useState(Notification_Placeholder);

    useEffect(() => {
        loadGroupData();
    }, []);

    const loadGroupData = () => {
        get(child(ref(getDatabase()), `groups/${id}/name`)).then(nameSnap => {
            if (nameSnap.exists())
                setNotification({
                    ...Notification_Types.Group,
                    title: Notification_Types.Group.title.replace(
                        "$name",
                        nameSnap.val()
                    ),
                });
        });
    };

    return (
        <Pressable style={style} onPress={onPress}>
            <LinearGradient
                style={[s.Pmd, s.allCenter, styles.container]}
                colors={[s.colors.blue, "#69B058"]}
                start={{ x: 0, y: -0.5 }}
                end={{ x: 1, y: 2 }}
                locations={[0, 0.75]}>
                {/* Pin Sign: Banner Symbol | Container */}
                <View style={styles.signContainer}>
                    <SVG_One style={[styles.pin]} fill={s.colors.black} />
                </View>

                {/* Txt Container */}
                <View style={styles.textContainer}>
                    {/* Title */}
                    <Text style={[s.TlgBd, s.tBlack]}>
                        {notification.title}
                    </Text>
                    {/* Title */}
                    <Text
                        style={[
                            s.TsmRg,
                            s.tBlack,
                            { marginTop: s.defaultMsm },
                        ]}>
                        {notification.description}
                    </Text>
                </View>
            </LinearGradient>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 3,
        borderRadius: 10,
        flexDirection: "column",
    },
    signContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    pin: {
        aspectRatio: 1,
        maxHeight: 12,
        maxWidth: 12,
    },

    textContainer: {
        marginTop: s.defaultMsm,
        width: "100%",
        flexDirection: "column",
    },
});
