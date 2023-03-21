import React, { useState, useEffect } from "react";

import { Pressable, View, StyleSheet, Image } from "react-native";

import { getDatabase, ref, get, child } from "firebase/database";

import * as s from "../../styles";

import { Post_Placeholder } from "../../constants/content/PlaceholderData";

export default function Post({ id, onPress, style }) {
    const [post, setPost] = useState(Post_Placeholder);

    const loadData = () => {
        const db = getDatabase();
        get(child(ref(db), "posts/" + id))
            .then(postSnap => {
                if (!postSnap.exists()) {
                    setPost(Post_Placeholder);
                    return;
                }
                const postData = postSnap.val();

                if (postSnap.hasChild("isBanned")) {
                    if (postData["isBanned"]) {
                        setPost({
                            ...Post_Placeholder,
                            isBanned: true,
                        });
                        return;
                    }
                }

                setPost(postData);
            })
            .catch(error =>
                console.log("content/Post.jsx", "get post", error.code)
            );
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <View style={style}>
            <Pressable style={styles.container} onPress={onPress}>
                {/* Img */}
                <View style={[s.allCenter, styles.imgContainer, s.oHidden]}>
                    <Image
                        source={{ uri: post.imgUri }}
                        style={[styles.img]}
                        resizeMode="cover"
                    />
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

    imgContainer: {
        marginTop: s.defaultMsm,
        width: "100%",
        borderRadius: 10,
    },
    img: {
        width: "100%",
        aspectRatio: 1,
    },
});
