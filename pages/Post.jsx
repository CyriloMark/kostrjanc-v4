import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    Text,
    Image,
} from "react-native";

import * as style from "../styles";

import { getDatabase, ref, get, child } from "firebase/database";

import {
    Post_Placeholder,
    User_Placeholder,
} from "../constants/content/PlaceholderData";

import BackHeader from "../components/BackHeader";
import Refresh from "../components/RefreshControl";
import Comment from "../components/comments/Comment";
import InteractionBar from "../components/InteractionBar";

import { wait } from "../constants/wait";
import NewCommentButton from "../components/comments/NewCommentButton";

export default function Post({ navigation, route }) {
    const scrollRef = useRef();

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        loadData();

        wait(1000).then(() => setRefreshing(false));
    }, []);

    const { id } = route.params;

    const [user, setUser] = useState(User_Placeholder);
    const [post, setPost] = useState(Post_Placeholder);

    const loadData = () => {
        const db = getDatabase();
        get(child(ref(db), "posts/" + id))
            .then(postSnap => {
                if (!postSnap.exists()) {
                    setPost(Post_Placeholder);
                    setUser(User_Placeholder);
                    return;
                }
                const postData = postSnap.val();

                if (postSnap.hasChild("isBanned")) {
                    if (postData["isBanned"]) {
                        setPost({
                            ...Post_Placeholder,
                            isBanned: true,
                        });
                        setUser(User_Placeholder);
                        return;
                    }
                }

                setPost({
                    ...postData,
                    comments: postSnap.hasChild("comments")
                        ? postData["comments"]
                        : [],
                    isBanned: false,
                });

                get(child(ref(db), "users/" + postData["creator"]))
                    .then(userSnap => {
                        if (!userSnap.exists()) {
                            setUser(User_Placeholder);
                            return;
                        }

                        const userData = userSnap.val();

                        setUser(userData);
                    })
                    .catch(error =>
                        console.log("pages/Post.jsx", "get user", error.code)
                    );
            })
            .catch(error =>
                console.log("pages/Post.jsx", "get post", error.code)
            );
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <View style={[style.container, style.bgBlack]}>
            {/* Header */}
            <Pressable
                style={{ zIndex: 10 }}
                onPress={() =>
                    scrollRef.current.scrollTo({
                        y: 0,
                        animated: true,
                    })
                }>
                <BackHeader
                    title={post.title}
                    onBack={() => navigation.goBack()}
                />
            </Pressable>

            <ScrollView
                ref={scrollRef}
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
                {/* Image Container */}
                <View>
                    {/* Title */}
                    <Text style={[style.tWhite, style.TlgBd]}>
                        {post.title}
                    </Text>

                    {/* Img */}
                    <Pressable
                        onPress={() =>
                            navigation.navigate("imgFull", { uri: post.imgUri })
                        }
                        style={[
                            style.allCenter,
                            styles.imgContainer,
                            style.oHidden,
                        ]}>
                        <Image
                            source={{
                                uri: post.imgUri,
                            }}
                            style={[style.container, { aspectRatio: 0.9 }]}
                            resizeMode="cover"
                        />
                    </Pressable>

                    <View style={styles.textContainer}>
                        <Text style={[style.Tmd, style.tWhite]}>
                            {post.description}
                        </Text>
                    </View>
                </View>

                {/* User Container */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.tWhite, style.TlgBd]}>
                        Přez awtora:
                    </Text>

                    <Pressable
                        style={[styles.userContainer, style.Psm]}
                        onPress={() =>
                            navigation.push("profileView", {
                                id: post.creator,
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
                </View>

                {/* Comments Container */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.tWhite, style.TlgBd]}>Komentary:</Text>
                    <View style={{ marginTop: style.defaultMmd }}>
                        <NewCommentButton />
                    </View>

                    <View style={{ marginTop: style.defaultMmd }}>
                        {post.comments.map((comment, key) => (
                            <Comment
                                key={key}
                                style={
                                    key != post.comments.length - 1
                                        ? { marginBottom: style.defaultMmd }
                                        : null
                                }
                                commentData={comment}
                            />
                        ))}
                    </View>
                </View>

                {/* Interaction Container */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.tWhite, style.TlgBd]}>
                        Funkcije za wužiwarja:
                    </Text>
                    <InteractionBar
                        style={{ marginTop: style.defaultMsm }}
                        ban
                        share
                        warn
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    interactionBarContainer: {
        position: "absolute",
        width: "100%",
        bottom: style.defaultMsm,
    },

    imgContainer: {
        marginTop: style.defaultMmd,
        width: "100%",
        borderRadius: 10,
    },
    textContainer: {
        // paddingHorizontal: style.Psm.paddingHorizontal,
        width: "100%",
        justifyContent: "center",
        marginTop: style.defaultMmd,
    },

    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
    },

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
