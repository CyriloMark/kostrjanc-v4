import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    Pressable,
    Text,
    Image,
    Dimensions,
} from "react-native";

import * as style from "../../styles";

import {
    Post_Placeholder,
    User_Placeholder,
} from "../../constants/content/PlaceholderData";

import { child, get, getDatabase, ref } from "firebase/database";
import { convertTimestampToString } from "../../constants/time";
import { checkLinkedUser } from "../../constants/content/linking";
import { checkForUnnecessaryNewLine } from "../../constants/content";

export default function PComment({
    commentData,
    showDate,
    onRemove,
    onPress,
    onCommentUserPress,
}) {
    const [user, setUser] = useState(User_Placeholder);
    const [post, setPost] = useState(Post_Placeholder);

    //#region Load Data
    const loadData = () => {
        const db = ref(getDatabase());

        get(child(db, `posts/${commentData.content}`))
            .then(postSnap => {
                if (postSnap.exists()) {
                    const p = postSnap.val();
                    setPost(p);
                }
            })
            .catch(error =>
                console.log("error", "PComment.jsx get imgUri", error.code)
            );
        get(child(db, `users/${commentData.creator}`))
            .then(userSnap => {
                if (userSnap.exists()) {
                    const data = userSnap.val();
                    setUser(data);
                }
            })
            .catch(error =>
                console.log("error", "PComment.jsx get creator", error.code)
            );
    };

    useEffect(() => {
        loadData();
    }, []);
    //#endregion

    if (post.isBanned) return null;
    return (
        <View>
            <View
                style={{
                    flexDirection: "row",
                    width: "100%",
                }}>
                {
                    //#region Profile Picture
                }
                <Pressable
                    style={styles.userPbContainer}
                    onPress={onCommentUserPress}>
                    <Image
                        source={{ uri: user.pbUri }}
                        style={styles.userPb}
                        resizeMode="cover"
                        resizeMethod="auto"
                    />
                </Pressable>

                {
                    //#region Text Area
                }
                <View
                    style={{
                        flex: 1,
                        flexDirection: "column",
                        marginLeft: style.defaultMmd,
                    }}>
                    {
                        //#region First Line
                    }
                    <View
                        style={{
                            // flex: 1,
                            flexDirection: "row",
                            alignItems: "baseline",
                        }}>
                        {
                            //#region Username
                        }
                        <Text style={[style.Tmd, style.tWhite]}>
                            {user.name}
                        </Text>
                        {
                            //#region Timestamp
                        }
                        {showDate ? (
                            <Text
                                style={[
                                    style.TsmRg,
                                    style.tBlue,
                                    {
                                        marginLeft: style.defaultMmd,
                                    },
                                ]}>
                                {convertTimestampToString(commentData.created)}
                            </Text>
                        ) : null}
                    </View>

                    {
                        //#region Second Line
                    }
                    <View style={[styles.imgContainer, style.oVisible]}>
                        <Pressable
                            onPress={onPress}
                            style={[styles.imgInner, style.oHidden]}>
                            <Image
                                source={{
                                    uri: post.imgUri,
                                }}
                                style={style.allMax}
                                resizeMode="cover"
                            />
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    _container: {
        width: "100%",
    },
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

    imgContainer: {
        marginTop: 5,
        width: "100%",
        aspectRatio: 1,

        // Shadow
        shadowRadius: 10,
        shadowOpacity: 0.5,
        shadowColor: style.colors.sec,
        shadowOffset: {
            width: 0,
            height: -2,
        },
        borderRadius: 10,
        backgroundColor: style.colors.black,

        borderColor: style.colors.sec,
        borderWidth: 1,
    },
    imgInner: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 10,
    },

    iconContainer: {
        position: "absolute",
        height: "100%",
        width: Dimensions.get("window").width,
        justifyContent: "center",
        alignItems: "flex-end",
        left: -Dimensions.get("window").width - style.Pmd.paddingHorizontal,
    },
    icon: {
        aspectRatio: 1,
        height: "33%",
        marginRight: "5%",
    },
});
