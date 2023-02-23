import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Pressable,
    Image,
} from "react-native";

import * as style from "../styles";

import { child, get, getDatabase, ref } from "firebase/database";

import BackHeader from "../components/BackHeader";

export default function UserList({ navigation, route }) {
    const { users, title, needData } = route.params;

    const [usersList, setUsersList] = useState([]);

    const getUserData = () => {
        const db = getDatabase();

        let u = [];

        for (let i = 0; i < users.length; i++) {
            get(child(ref(db), "users/" + users[i]))
                .then(userSnap => {
                    if (userSnap.exists()) {
                        const userData = userSnap.val();
                        u.push({
                            id: users[i],
                            name: userData["name"],
                            pbUri: userData["pbUri"],
                        });
                    }
                })
                .finally(() => {
                    if (i === users.length - 1) setUsersList(u);
                })
                .catch(error =>
                    console.log(
                        "error pages/UserList.jsx",
                        "getUserData",
                        error.code
                    )
                );
        }
    };

    useEffect(() => {
        if (needData) getUserData();
        else setUsersList(users);
    }, []);

    return (
        <View style={[style.allMax, style.bgBlack]}>
            <BackHeader
                onBack={() => navigation.goBack()}
                title={title}
                showReload={false}
            />

            <ScrollView
                style={[
                    style.container,
                    style.pH,
                    style.oVisible,
                    { marginTop: style.defaultMsm },
                ]}
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                automaticallyAdjustKeyboardInsets
                automaticallyAdjustContentInsets
                snapToAlignment="center"
                snapToEnd>
                {usersList.map((user, key) => (
                    <Pressable
                        key={key}
                        style={[styles.userContainer, style.Psm]}
                        onPress={() =>
                            navigation.push("profileView", {
                                id: user.id,
                            })
                        }>
                        <View style={styles.userPbContainer}>
                            <Image
                                source={{
                                    uri: user.pbUri,
                                }}
                                style={styles.userPb}
                                resizeMode="cover"
                                resizeMethod="auto"
                            />
                        </View>
                        <Text
                            style={[
                                style.Tmd,
                                style.tWhite,
                                {
                                    marginLeft: style.defaultMmd,
                                },
                            ]}>
                            {user.name}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    userContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginTop: style.defaultMsm,
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
});
