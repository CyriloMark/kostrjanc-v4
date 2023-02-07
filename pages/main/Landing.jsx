import React, { useRef, useState, useCallback, useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import * as style from "../../styles";

import { wait } from "../../constants/wait";
import { getData, removeData, storeData } from "../../constants/storage";
import { get, ref, getDatabase, child } from "firebase/database";

import AppHeader from "../../components/landing/AppHeader";
import Refresh from "../../components/RefreshControl";
import Post from "../../components/cards/Post";
import Event from "../../components/cards/Event";
import Banner from "../../components/cards/Banner";

import { getAuth } from "firebase/auth";
import { User_Placeholder } from "../../constants/content/PlaceholderData";

export default function Landing({ navigation }) {
    const mainScrollRef = useRef();

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        wait(1000).then(() => setRefreshing(false));
    }, []);

    const [user, setUser] = useState(User_Placeholder);

    const loadUser = () => {
        const id = getAuth().currentUser.uid;
        // storeData("userId", id);

        const db = getDatabase();
        get(child(ref(db), "users/" + id))
            .then(userSnap => {
                if (!userSnap.exists()) return;
                const userData = userSnap.val();

                // Man könnte hier ban abfragen
                setUser(userData);
                storeData("userData", userData);
            })
            .catch(error =>
                console.log(
                    "error main/Landing.jsx",
                    "get user data",
                    error.code
                )
            );
    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <View style={[style.container, style.bgBlack]}>
            <Pressable
                style={{ zIndex: 10 }}
                onPress={() =>
                    mainScrollRef.current.scrollTo({
                        y: 0,
                        animated: true,
                    })
                }>
                <AppHeader
                    pbUri={user.pbUri}
                    onUserPress={() => navigation.navigate("userProfile")}
                    onContentPress={() => navigation.navigate("content")}
                />
            </Pressable>
            <ScrollView
                ref={mainScrollRef}
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
                snapToEnd
                refreshControl={
                    <Refresh onRefresh={onRefresh} refreshing={refreshing} />
                }>
                <Banner
                    id="1673607600000"
                    style={{
                        marginTop: style.defaultMmd,
                    }}
                />
                <Post
                    style={{ marginVertical: style.defaultMmd }}
                    id="1669820894535"
                    onPress={() =>
                        navigation.navigate("postView", {
                            id: "1669820894535",
                        })
                    }
                />
                <Post
                    style={{ marginVertical: style.defaultMmd }}
                    id="1669820894535"
                    onPress={() =>
                        navigation.navigate("postView", {
                            id: "1669820894535",
                        })
                    }
                />
                <Post
                    style={{ marginVertical: style.defaultMmd }}
                    id="1669820894535"
                    onPress={() =>
                        navigation.navigate("postView", {
                            id: "1669820894535",
                        })
                    }
                />
                <Event
                    style={{ marginVertical: style.defaultMmd }}
                    id="1664814877240"
                    onPress={() =>
                        navigation.navigate("eventView", {
                            id: "1664814877240",
                        })
                    }
                />
            </ScrollView>
        </View>
    );
}
