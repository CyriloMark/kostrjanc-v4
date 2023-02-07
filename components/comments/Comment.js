import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text } from "react-native";

import * as s from "../../styles";

import { convertTimestampToString } from "../../constants/time";

import { getDatabase, get, child, ref } from "firebase/database";

import { User_Placeholder } from "../../constants/content/PlaceholderData";

export default function Comment({ style, commentData }) {
    const [user, setUser] = useState(User_Placeholder);

    const getUserData = () => {
        const db = ref(getDatabase());
        get(child(db, "users/" + commentData.creator)).then(userSnap => {
            if (!userSnap.exists()) return;
            const userData = userSnap.val();
            setUser(userData);
        });
    };

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <View style={style}>
            <View>
                {/* Header */}
                <View style={[styles.userContainer]}>
                    {/* Profile pic */}
                    <View style={styles.userPbContainer}>
                        <Image
                            source={{ uri: user.pbUri }}
                            style={styles.userPb}
                            resizeMode="cover"
                            resizeMethod="auto"
                        />
                    </View>
                    {/* Username */}
                    <Text
                        style={[
                            s.Tmd,
                            s.tWhite,
                            {
                                marginLeft: s.defaultMmd,
                            },
                        ]}>
                        {user.name}
                    </Text>
                    {/* Timestamp */}
                    <Text
                        style={[
                            s.Tmd,
                            s.tSec,
                            {
                                marginLeft: s.defaultMmd,
                            },
                        ]}>
                        {convertTimestampToString(commentData.created)}
                    </Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={[s.tWhite, s.Tmd]}>{commentData.content}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    userContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    userPbContainer: {
        aspectRatio: 1,
        flex: 1,
        width: "100%",
        maxWidth: 32,
        maxHeight: 32,
        borderRadius: 100,
        overflow: "hidden",
        justifyContent: "center",
    },
    userPb: {
        width: "100%",
        height: "100%",
    },

    textContainer: {
        marginTop: s.defaultMsm,
        width: "100%",
    },
});
