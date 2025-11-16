import React, { useState, useEffect } from "react";

import { Pressable, View, StyleSheet, Image, Text } from "react-native";

// import Firebase
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, child, set } from "firebase/database";

import * as s from "../../styles";

import { LinearGradient } from "expo-linear-gradient";

// import Constants
import {
    User_Placeholder,
    Post_Placeholder,
} from "../../constants/content/PlaceholderData";
import { getUnsignedTranslationText } from "../../constants/content/translation";
import { checkForUnnecessaryNewLine, like } from "../../constants/content";
import { checkLinkedUser } from "../../constants/content/linking";
import { getUID } from "../../constants/storage";

// import Components
import LikeButton from "../content/LikeButton";
import Comment from "../comments/Comment";

export default function Post({ style, id, group, likeable, onPress }) {
    let LIKING = false;
    let UID = null;

    const [user, setUser] = useState(User_Placeholder);
    const [post, setPost] = useState(Post_Placeholder);
    const [liked, setLiked] = useState(false);
    const [commentsList, setCommentsList] = useState([]);

    const loadData = () => {
        const db = getDatabase();
        get(child(ref(db), `posts/${id}`))
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

                setPost(postData);

                if (likeable && postSnap.hasChild("likes"))
                    loadLikes(postData.likes);
                if (postData.comments) setCommentsList(postData.comments);

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
                        console.log("cards/Post.jsx", "get user", error.code)
                    );
            })
            .catch(error =>
                console.log("cards/Post.jsx", "get post", error.code)
            );
    };

    const loadLikes = async likeList => {
        if (UID === null) await getUID();
        if (likeList !== null) setLiked(likeList.includes(UID));
    };

    useEffect(() => {
        loadData();
    }, []);

    const _handleLikePress = async () => {
        if (!likeable || LIKING) return;
        LIKING = true;

        const rsp = await like(id);
        if (rsp)
            setLiked(prev => {
                return !prev;
            });

        LIKING = false;
    };

    if (!group && post.group) return null;
    if (post.isBanned) return null;
    return (
        <View style={[style, styles.shadow, s.oVisible]}>
            <Pressable style={[styles.container, s.oHidden]} onPress={onPress}>
                {
                    //#region Image
                }
                <Image
                    source={{ uri: post.imgUri }}
                    style={[s.allMax]}
                    resizeMode="cover"
                />

                {
                    //#region Upper Area
                }
                <View style={[styles.contentContainer, s.allMax]}>
                    <LinearGradient
                        colors={[s.colors.black, "transparent"]}
                        start={{
                            x: 0,
                            y: -1,
                        }}
                        end={{
                            x: 0.25,
                            y: 2,
                        }}
                        locations={[0, 0.5]}
                        style={[s.Pmd]}>
                        {
                            //#region Header
                        }
                        <View style={[styles.headerContainer, s.oVisible]}>
                            <View
                                style={[s.oVisible, styles.headerPbContainer]}>
                                <View
                                    style={[
                                        styles.headerPbInnerContainer,
                                        s.oHidden,
                                    ]}>
                                    <Image
                                        source={{ uri: user.pbUri }}
                                        style={s.allMax}
                                        resizeMode="cover"
                                        resizeMethod="auto"
                                    />
                                </View>
                            </View>
                            <Text
                                style={[
                                    s.Tmd,
                                    s.tWhite,
                                    styles.textShadow,
                                    {
                                        marginLeft: s.defaultMmd,
                                        fontFamily: "Barlow_Bold",
                                    },
                                ]}>
                                {user.name}
                            </Text>
                        </View>
                    </LinearGradient>
                </View>

                {
                    //#region Lower Area
                }
                <View
                    style={[
                        styles.contentContainer,
                        s.allMax,
                        { justifyContent: "flex-end" },
                    ]}>
                    <LinearGradient
                        colors={["transparent", s.colors.black]}
                        start={{
                            x: 0.5,
                            y: 0,
                        }}
                        end={{
                            x: 0.5,
                            y: 1.5,
                        }}
                        locations={[0, 1]}
                        style={[s.Pmd, styles.textContainer]}>
                        {likeable ? (
                            <LikeButton
                                style={{ marginRight: s.defaultMmd }}
                                liked={liked}
                                onPress={_handleLikePress}
                            />
                        ) : null}
                        <View style={styles.titleContainer}>
                            {checkLinkedUser(
                                getUnsignedTranslationText(
                                    checkForUnnecessaryNewLine(post.title)
                                )
                            ).map((el, key) => (
                                <Text
                                    key={key}
                                    style={[
                                        s.Tmd,
                                        s.tWhite,
                                        styles.textShadow,
                                        { fontFamily: "Barlow_Bold" },
                                    ]}>
                                    {el.text}
                                </Text>
                            ))}
                        </View>
                    </LinearGradient>
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    shadow: {
        width: "100%",

        // Shadow
        shadowRadius: 10,
        shadowOpacity: 0.5,
        shadowColor: s.colors.sec,
        shadowOffset: {
            width: 0,
            height: -2,
        },
        borderRadius: 10,
        backgroundColor: s.colors.black,

        borderColor: s.colors.sec,
        borderWidth: 1,
    },

    container: {
        aspectRatio: 1,
        width: "100%",
        borderRadius: 9,
    },

    contentContainer: {
        position: "absolute",
        flexDirection: "column",
        // justifyContent: "flex-end",
    },
    headerContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },

    headerPbContainer: {
        aspectRatio: 1,
        width: 32,
        height: 32,

        shadowColor: s.colors.black,
        shadowOpacity: 0.6,
        shadowRadius: 6,
        shadowOffset: {
            width: 0,
            height: 0,
        },
    },
    headerPbInnerContainer: {
        aspectRatio: 1,
        width: 32,
        height: 32,
        borderRadius: 100,
        overflow: "hidden",
        justifyContent: "center",
    },

    textShadow: {
        shadowColor: s.colors.black,
        shadowOpacity: 1,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 0,
        },
    },

    textContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    titleContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
});
