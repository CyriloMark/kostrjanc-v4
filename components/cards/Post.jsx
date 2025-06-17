import React, { useState, useEffect } from "react";

import { Pressable, View, StyleSheet, Image, Text } from "react-native";

// import Firebase
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, child, set } from "firebase/database";

import * as style from "../../styles";

// import Constants
import {
    User_Placeholder,
    Post_Placeholder,
} from "../../constants/content/PlaceholderData";
import { getUnsignedTranslationText } from "../../constants/content/translation";
import { checkForUnnecessaryNewLine } from "../../constants/content";
import { checkLinkedUser } from "../../constants/content/linking";
import { getData } from "../../constants/storage";

// import Components
import LikeButton from "../content/LikeButton";
import Comment from "../comments/Comment";

const COMMENTS_BELOW_ENABLED = false;

export default function Post(props) {
    let LIKING = false;
    let UID = null;

    const [user, setUser] = useState(User_Placeholder);
    const [post, setPost] = useState(Post_Placeholder);
    const [liked, setLiked] = useState(false);
    const [commentsList, setCommentsList] = useState([]);

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

                if (props.likeable && postSnap.hasChild("likes"))
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
        if (UID === null) {
            UID = await getData("userId");
            if (UID === null) UID = getAuth().currentUser.uid;
        }

        if (likeList !== null) setLiked(likeList.includes(UID));
    };

    useEffect(() => {
        loadData();
    }, []);

    const like = async () => {
        if (!props.likeable || LIKING) return;
        LIKING = true;

        if (UID === null) {
            UID = await getData("userId");
            if (UID === null) UID = getAuth().currentUser.uid;
        }

        const db = getDatabase();

        get(child(ref(db), `posts/${props.id}/likes`))
            .then(likesSnap => {
                let l = [];
                if (likesSnap.exists()) l = likesSnap.val();

                if (l.includes(UID)) l.splice(l.indexOf(UID), 1);
                else l.push(UID);

                set(ref(db, `posts/${props.id}/likes`), l)
                    .finally(() => (LIKING = false))
                    .then(() => setLiked(!liked))
                    .catch(error =>
                        console.log(
                            "error in components/card/Post.jsx",
                            "like set DB",
                            error.code
                        )
                    );
            })
            .catch(error =>
                console.log(
                    "error in components/cards/Post.jsx",
                    "like get Likes",
                    error.code
                )
            );
    };

    if (!props.group && post.group) return null;
    if (post.isBanned) return null;
    return (
        <View
            style={[
                props.style,
                {
                    marginVertical: style.defaultMmd,
                    zIndex: 10,
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
                {!props.likeable ? (
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
                ) : (
                    <View style={styles.likeContainer}>
                        <LikeButton
                            style={{ marginRight: style.defaultMmd }}
                            liked={liked}
                            onPress={like}
                        />

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
                )}

                {props.group && COMMENTS_BELOW_ENABLED ? (
                    <View style={styles.commentsContainer}>
                        {commentsList.map(comment => (
                            <Comment
                                key={comment.created}
                                style={{ marginTop: style.defaultMmd }}
                                commentData={comment}
                                onRemove={() => null}
                                onPress={id => props.onCommentPress(id)}
                                onCommentUserPress={id =>
                                    props.onCommentUserPress(id)
                                }
                            />
                        ))}
                    </View>
                ) : null}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        zIndex: 10,
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

    likeContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginTop: style.defaultMmd,
        marginLeft: style.defaultMsm,
    },

    commentsContainer: {
        width: "100%",
        flexDirection: "column",
        marginTop: style.defaultMmd,
    },
});
