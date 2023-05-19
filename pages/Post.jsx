import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    Text,
    TextInput,
    Image,
    Platform,
    KeyboardAvoidingView,
} from "react-native";

import * as style from "../styles";

import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, child, set } from "firebase/database";

import {
    Post_Placeholder,
    User_Placeholder,
} from "../constants/content/PlaceholderData";
import { wait } from "../constants/wait";
import { getData } from "../constants/storage";
import { share } from "../constants/share";
import { getLangs } from "../constants/langs";
import { checkLinkedUser } from "../constants/content/linking";

import BackHeader from "../components/BackHeader";
import Comment from "../components/comments/Comment";
import InteractionBar from "../components/InteractionBar";
import NewCommentButton from "../components/comments/NewCommentButton";
import AccessoryView from "../components/AccessoryView";
import SendButton from "../components/comments/SendButton";
import DeleteButton from "../components/comments/DeleteButton";
import Refresh from "../components/RefreshControl";

export default function Post({ navigation, route }) {
    const scrollRef = useRef();
    const commentInputRef = useRef();

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        loadData();

        wait(1000).then(() => setRefreshing(false));
    }, []);

    const { id } = route.params;

    const [user, setUser] = useState(User_Placeholder);
    const [post, setPost] = useState(Post_Placeholder);

    const [commentVisible, setCommentVisible] = useState(false);
    const [currentCommentInput, setCurrentCommentInput] = useState("");

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

                getIfCreatorIsClient(postData.creator);

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

    const openCommentInput = () => {
        if (!commentVisible) {
            commentInputRef.current.focus();
            setCommentVisible(true);
        }
    };

    const publishComment = () => {
        if (post.isBanned) return;
        if (
            !(
                currentCommentInput.length > 0 &&
                currentCommentInput.length <= 64
            )
        )
            return;

        const input = currentCommentInput;
        setCurrentCommentInput("");
        setCommentVisible(false);

        let uid = "";
        getData("userId")
            .then(userID => {
                if (userID) uid = userID;
                else uid = getAuth().currentUser.uid;
            })
            .finally(() => {
                let a = post.comments ? post.comments : [];
                a.unshift({
                    creator: uid,
                    created: Date.now(),
                    content: input,
                });
                setPost({
                    ...post,
                    comments: a,
                });

                const db = getDatabase();
                set(ref(db, `posts/${id}/comments`), a);
            });
    };

    const removeComment = comment => {
        const newCommentList = post.comments.filter(c => c !== comment);
        setPost(cur => {
            return {
                ...cur,
                comments: newCommentList,
            };
        });
        set(ref(getDatabase(), `posts/${id}/comments`), newCommentList);
    };

    useEffect(() => {
        loadData();
        getIfAdmin();
    }, []);

    const [clientIsAdmin, setClintIsAdmin] = useState(false);
    const getIfAdmin = async () => {
        await getData("userIsAdmin").then(isAdmin => {
            if (isAdmin === null) return setClintIsAdmin(false);
            return setClintIsAdmin(isAdmin);
        });
    };

    const [clientIsCreator, setClientIsCreator] = useState(false);
    const getIfCreatorIsClient = async creator => {
        await getData("userId").then(id => {
            if (id === creator) return setClientIsCreator(true);
            return setClientIsCreator(false);
        });
    };

    return (
        <View style={[style.container, style.bgBlack]}>
            <KeyboardAvoidingView
                style={style.allMax}
                behavior={Platform.OS === "ios" ? "padding" : "height"}>
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
                        // title={post.title}
                        title={""}
                        onBack={() => navigation.goBack()}
                        onReload={loadData}
                        showReload
                    />
                </Pressable>

                <ScrollView
                    scrollEnabled
                    automaticallyAdjustKeyboardInsets
                    automaticallyAdjustContentInsets
                    keyboardDismissMode="interactive"
                    snapToAlignment="center"
                    snapToEnd
                    ref={scrollRef}
                    style={[style.container, style.pH, style.oVisible]}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    refreshControl={
                        Platform.OS === "ios" ? (
                            <Refresh
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        ) : null
                    }>
                    {/* Image Container */}
                    <View>
                        {/* Title */}
                        <Text style={[style.tWhite, style.Ttitle2]}>
                            {post.title}
                        </Text>

                        {/* Img */}
                        <Pressable
                            onPress={() =>
                                navigation.navigate("imgFull", {
                                    uri: post.imgUri,
                                })
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
                                style={{ width: "100%", aspectRatio: 1 }}
                                resizeMode="cover"
                            />
                        </Pressable>

                        <View style={styles.textContainer}>
                            <Text style={[style.Tmd, style.tWhite]}>
                                {checkLinkedUser(post.description).map(
                                    (el, key) =>
                                        !el.isLinked ? (
                                            <Text key={key}>{el.text}</Text>
                                        ) : (
                                            <Text
                                                key={key}
                                                style={style.tBlue}
                                                onPress={() =>
                                                    navigation.navigate(
                                                        "profileView",
                                                        {
                                                            id: el.id,
                                                        }
                                                    )
                                                }>
                                                {el.text}
                                            </Text>
                                        )
                                )}
                            </Text>
                        </View>
                    </View>

                    {/* User Container */}
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("content_aboutcreator")}
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
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("content_comments_title")}
                        </Text>
                        <View
                            style={{
                                marginTop: style.defaultMmd,
                                flexDirection: "row",
                            }}>
                            <NewCommentButton onPress={openCommentInput} />
                        </View>

                        {/* New comment */}
                        <View
                            style={{
                                marginTop: commentVisible
                                    ? style.defaultMlg
                                    : 0,
                            }}>
                            {/* Title */}
                            {commentVisible ? (
                                <Text style={[style.tWhite, style.TlgBd]}>
                                    {getLangs(
                                        "content_comments_newcommenttitle"
                                    )}
                                </Text>
                            ) : null}
                            {/* Input */}
                            <TextInput
                                ref={commentInputRef}
                                hitSlop={10}
                                inputAccessoryViewID={"23488388256395198"}
                                allowFontScaling
                                autoCapitalize="none"
                                cursorColor={style.colors.blue}
                                multiline={true}
                                numberOfLines={1}
                                maxLength={128}
                                keyboardAppearance="dark"
                                keyboardType="default"
                                scrollEnabled
                                placeholder="Zapodaj twój komentar"
                                onBlur={() => {
                                    if (currentCommentInput.length === 0)
                                        setCommentVisible(false);
                                }}
                                selectTextOnFocus
                                placeholderTextColor={style.colors.sec}
                                textAlign="left"
                                textAlignVertical="center"
                                value={currentCommentInput}
                                textBreakStrategy="simple"
                                onChangeText={t => setCurrentCommentInput(t)}
                                style={[
                                    { marginTop: style.defaultMmd },
                                    style.tWhite,
                                    !commentVisible ? { height: 0 } : null,
                                ]}
                            />

                            {commentVisible ? (
                                <View style={styles.commentsButtonContainer}>
                                    <DeleteButton
                                        onPress={() => {
                                            setCurrentCommentInput("");
                                            setCommentVisible(false);
                                        }}
                                    />
                                    <SendButton
                                        onPress={publishComment}
                                        style={{ marginLeft: style.defaultMmd }}
                                    />
                                </View>
                            ) : null}
                        </View>

                        {/* Comments List */}
                        <View
                            style={{
                                marginTop: !commentVisible
                                    ? post.comments.length === 0
                                        ? 0
                                        : style.defaultMmd
                                    : style.defaultMlg,
                            }}>
                            {post.comments.map((comment, key) => (
                                <Comment
                                    key={key}
                                    style={
                                        key != post.comments.length - 1
                                            ? { marginBottom: style.defaultMmd }
                                            : null
                                    }
                                    commentData={comment}
                                    onRemove={() => removeComment(comment)}
                                    onCommentUserPress={id =>
                                        navigation.navigate("profileView", {
                                            id: id,
                                        })
                                    }
                                />
                            ))}
                        </View>
                    </View>

                    {/* Interaction Container */}
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("interactionbar_title")}
                        </Text>
                        <InteractionBar
                            style={{ marginTop: style.defaultMsm }}
                            ban={clientIsAdmin}
                            share
                            warn
                            del={clientIsCreator}
                            onShare={() => share(0, id, post.title)}
                            onWarn={() =>
                                navigation.navigate("report", {
                                    item: post,
                                    type: 0,
                                })
                            }
                            onBan={() =>
                                navigation.navigate("ban", {
                                    item: post,
                                    type: 0,
                                    id: post.id,
                                })
                            }
                            onDelete={() =>
                                navigation.navigate("delete", {
                                    type: 0,
                                    id: post.id,
                                })
                            }
                        />
                    </View>

                    <View style={styles.sectionContainer} />
                </ScrollView>
            </KeyboardAvoidingView>

            <AccessoryView
                text={currentCommentInput}
                onElementPress={l => setCurrentCommentInput(prev => prev + l)}
                nativeID={"23488388256395198"}
            />
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

    commentsButtonContainer: {
        marginTop: style.defaultMmd,
        flexDirection: "row",
        width: "100%",
        maxHeight: 58,
        alignItems: "center",
    },
});
