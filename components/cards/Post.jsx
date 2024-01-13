import React, { useState, useEffect } from "react";

import { Pressable, View, StyleSheet, Image, Text } from "react-native";

import { getDatabase, ref, get, child } from "firebase/database";

import * as style from "../../styles";

import {
    User_Placeholder,
    Post_Placeholder,
} from "../../constants/content/PlaceholderData";
import { getUnsignedTranslationText } from "../../constants/content/translation";
import { checkForUnnecessaryNewLine } from "../../constants/content";
import { checkLinkedUser } from "../../constants/content/linking";

export default function Post(props) {
    const [user, setUser] = useState(User_Placeholder);
    const [post, setPost] = useState(Post_Placeholder);

    const loadData = () => {
        const db = getDatabase();
        get(child(ref(db), "posts/" + props.id))
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

    useEffect(() => {
        loadData();
    }, []);

    if (post.isBanned) return null;
    return (
        <View
            style={[
                props.style,
                {
                    marginVertical: style.defaultMmd,
                },
            ]}>
            <Pressable style={styles.container} onPress={props.onPress}>
                {/* Header */}
                <View style={[styles.headerContainer, style.Psm]}>
                    <View style={styles.headerPbContainer}>
                        <Image
                            source={{ uri: user.pbUri }}
                            style={styles.headerPb}
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
                </View>

                {/* Img */}
                <View
                    style={{
                        marginTop: style.defaultMsm,
                        ...style.shadowSecSmall,
                        borderRadius: 10,
                    }}>
                    <View
                        style={[
                            style.allCenter,
                            styles.imgContainer,
                            style.oHidden,
                        ]}>
                        <Image
                            source={{ uri: post.imgUri }}
                            style={[styles.img]}
                            resizeMode="cover"
                        />
                    </View>
                </View>

                {/* Text */}
                <View style={[styles.textContainer]}>
                    {checkLinkedUser(
                        getUnsignedTranslationText(
                            checkForUnnecessaryNewLine(post.title)
                        )
                    ).map((el, key) => (
                        <Text key={key} style={[style.Tmd, style.tWhite]}>
                            {el.text}
                        </Text>
                    ))}
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
    },

    headerContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    headerPbContainer: {
        aspectRatio: 1,
        flex: 1,
        width: "100%",
        maxWidth: 32,
        maxHeight: 32,
        borderRadius: 100,
        overflow: "hidden",
        justifyContent: "center",
    },
    headerPb: {
        width: "100%",
        height: "100%",
    },

    imgContainer: {
        // marginTop: style.defaultMsm,
        width: "100%",
        borderRadius: 10,
    },
    img: {
        width: "100%",
        aspectRatio: 1,
    },

    textContainer: {
        // paddingHorizontal: style.Psm.paddingHorizontal,
        width: "100%",
        justifyContent: "center",
        marginTop: style.defaultMsm,
    },
});
