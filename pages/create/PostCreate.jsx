import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Pressable,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";

import * as style from "../../styles";

import { getAuth } from "firebase/auth";
import { child, get, getDatabase, ref, set } from "firebase/database";
import * as Storage from "firebase/storage";

import { Post_Placeholder } from "../../constants/content/PlaceholderData";
import { getData } from "../../constants/storage";
import { getLangs } from "../../constants/langs";

import SVG_Pencil from "../../assets/svg/Pencil";
import SVG_Post from "../../assets/svg/Post";

import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import {
    launchImageLibraryAsync,
    requestMediaLibraryPermissionsAsync,
    MediaTypeOptions,
} from "expo-image-picker";

import BackHeader from "../../components/BackHeader";
import EnterButton from "../../components/auth/EnterButton";
import InputField from "../../components/InputField";
import TextField from "../../components/TextField";
import AccessoryView from "../../components/AccessoryView";

const userUploadMetadata = {
    contentType: "image/jpeg",
};

export default function PostCreate({ navigation }) {
    let btnPressed = false;

    const [post, setPost] = useState(Post_Placeholder);
    const [imageUri, setImageUri] = useState(null);
    const [buttonChecked, setButtonChecked] = useState(false);

    // IMG Load + Compress
    const openImagePickerAsync = async () => {
        let permissionResult = await requestMediaLibraryPermissionsAsync(true);
        if (!permissionResult.granted) {
            Alert.alert(
                "kostrjanc njesmě na galeriju přistupić.",
                `Status: ${permissionResult.status}`,
                [
                    {
                        text: "Ok",
                        isPreferred: true,
                        style: "cancel",
                    },
                ]
            );
            return;
        }

        let pickerResult = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
            aspect: [1, 1],
            allowsMultipleSelection: false,
        });
        if (pickerResult.canceled) return;

        const croppedPicker = await manipulateAsync(
            pickerResult.assets[0].uri,
            [
                {
                    resize: {
                        width: 1024,
                        height: 1024,
                    },
                },
            ],
            {
                compress: 0.5,
                format: SaveFormat.JPEG,
            }
        );
        setImageUri(pickerResult.assets[0].uri);
        setPost(prev => {
            return {
                ...prev,
                imgUri: croppedPicker.uri,
            };
        });
    };

    const checkButton = () => {
        let inputValid = false;
        if (
            post.title.length !== 0 &&
            post.description.length !== 0 &&
            post.imgUri !== Post_Placeholder.imgUri
        )
            inputValid = true;
        setButtonChecked(inputValid);
    };

    const setUnfullfilledAlert = () => {
        let missing = "";
        if (post.title.length === 0)
            missing += `\n${getLangs("missing_title")}`;
        if (post.description.length === 0)
            missing += `\n${getLangs("missing_description")}`;
        if (post.imgUri === Post_Placeholder.imgUri)
            missing += `\n${getLangs("missing_img")}`;

        Alert.alert(
            getLangs("missing_alert_title"),
            `${getLangs("missing_alert_sub")}${missing}`,
            [
                {
                    text: "Ok",
                    style: "cancel",
                    isPreferred: true,
                },
            ]
        );
    };

    useEffect(() => {
        checkButton();
    }, [post]);

    const publishPost = async () => {
        if (!buttonChecked) {
            setUnfullfilledAlert();
            return;
        }
        if (btnPressed) return;
        btnPressed = true;

        const uid = await getData("userId").catch(() => {
            return getAuth().currentUser.uid;
        });

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError("Network request failed!"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", post.imgUri, true);
            xhr.send(null);
        });

        const id = Date.now();
        const storage = Storage.getStorage();
        const db = getDatabase();

        const storageRef = Storage.ref(storage, `posts_pics/${id}`);
        Storage.uploadBytes(storageRef, blob, userUploadMetadata)
            .then(() => {
                Storage.getDownloadURL(storageRef)
                    .then(url => {
                        set(ref(db, `posts/${id}`), {
                            id: id,
                            type: 0,
                            title: post.title,
                            description: post.description,
                            created: id,
                            creator: uid,
                            imgUri: url,
                            isBanned: false,
                        }).catch(error =>
                            console.log(
                                "error pages/create/PostCreate.jsx",
                                "publishPost set post",
                                error.code
                            )
                        );

                        get(child(ref(db), `users/${uid}/posts`))
                            .then(postsSnap => {
                                let posts = [];
                                if (postsSnap.exists()) posts = postsSnap.val();
                                posts.push(id);

                                set(ref(db, `users/${uid}/posts`), posts)
                                    .catch(error =>
                                        console.log(
                                            "error pages/create/PostCreate.jsx",
                                            "publishPost set user posts",
                                            error.code
                                        )
                                    )
                                    .finally(() => {
                                        Alert.alert(
                                            getLangs(
                                                "postcreate_publishsuccessful_title"
                                            ),
                                            `${getLangs(
                                                "postcreate_publishsuccessful_sub_0"
                                            )} ${post.title} ${getLangs(
                                                "postcreate_publishsuccessful_sub_1"
                                            )}`,
                                            [
                                                {
                                                    text: "Ok",
                                                    isPreferred: true,
                                                    style: "cancel",
                                                    onPress: () => {
                                                        navigation.goBack();
                                                    },
                                                },
                                            ]
                                        );
                                    });
                            })
                            .catch(error =>
                                console.log(
                                    "error pages/create/PostCreate.jsx",
                                    "publishPost get user posts",
                                    error.code
                                )
                            );
                    })
                    .catch(error =>
                        console.log(
                            "error pages/create/PostCreate.jsx",
                            "publishPost Storage.getDownloadUrl",
                            error.code
                        )
                    );
            })
            .catch(error =>
                console.log(
                    "error pages/create/PostCreate.jsx",
                    "publishPost Storage.uploadBytes",
                    error.code
                )
            );
    };

    return (
        <View style={[style.container, style.bgBlack]}>
            <KeyboardAvoidingView
                style={style.allMax}
                behavior={Platform.OS === "ios" ? "padding" : "height"}>
                {/* Header */}
                <Pressable style={{ zIndex: 10 }}>
                    <BackHeader
                        title={getLangs("postcreate_headertitle")}
                        onBack={() => navigation.goBack()}
                        showReload={false}
                    />
                </Pressable>

                <ScrollView
                    style={[
                        style.container,
                        style.pH,
                        style.oVisible,
                        { marginTop: style.defaultMsm },
                    ]}
                    keyboardDismissMode="interactive"
                    scrollEnabled
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    automaticallyAdjustKeyboardInsets
                    automaticallyAdjustContentInsets
                    snapToAlignment="center"
                    snapToEnd>
                    {/* Image Container */}
                    <View>
                        {/* Title */}
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {post.title.length === 0
                                ? getLangs("postcreate_posttitle")
                                : post.title}
                        </Text>

                        {/* Img */}
                        <Pressable
                            onPress={openImagePickerAsync}
                            style={[
                                styles.imageOutlineContainer,
                                style.border,
                                style.allCenter,
                            ]}>
                            <View
                                style={[
                                    styles.imageContainer,
                                    style.allCenter,
                                    style.oHidden,
                                    style.Psm,
                                ]}>
                                {imageUri !== null ? (
                                    <Image
                                        source={{ uri: imageUri }}
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View
                                        style={[
                                            styles.image,
                                            style.allCenter,
                                            styles.imageBorder,
                                        ]}>
                                        <SVG_Post
                                            style={styles.hintIcon}
                                            fill={style.colors.blue}
                                        />
                                        <Text
                                            style={[
                                                style.Tmd,
                                                style.tBlue,
                                                styles.hintText,
                                            ]}>
                                            {getLangs("postcreate_imghint")}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </Pressable>

                        <View style={styles.textContainer}>
                            <Text style={[style.Tmd, style.tWhite]}>
                                {post.description.length === 0
                                    ? getLangs("postcreate_postdescription")
                                    : post.description}
                            </Text>
                        </View>
                    </View>

                    {/* Info Edit */}
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("postcreate_addinformation")}
                        </Text>
                        <View
                            style={[style.pH, { marginTop: style.defaultMmd }]}>
                            {/* Mjeno */}
                            <View>
                                <Text
                                    style={[
                                        style.Tmd,
                                        style.tWhite,
                                        { marginBottom: style.defaultMsm },
                                    ]}>
                                    {getLangs("postcreate_info_title")}
                                </Text>
                                <InputField
                                    placeholder={getLangs(
                                        "input_placeholder_contentname"
                                    )}
                                    autoCapitalize="sentences"
                                    keyboardType="default"
                                    value={post.title}
                                    inputAccessoryViewID="post_title_InputAccessoryViewID"
                                    icon={
                                        <SVG_Pencil fill={style.colors.sec} />
                                    }
                                    onChangeText={val => {
                                        setPost({
                                            ...post,
                                            title: val,
                                        });
                                    }}
                                />
                            </View>
                            {/* Description */}
                            <View style={{ marginTop: style.defaultMmd }}>
                                <Text
                                    style={[
                                        style.Tmd,
                                        style.tWhite,
                                        { marginBottom: style.defaultMsm },
                                    ]}>
                                    {getLangs("postcreate_info_description")}
                                </Text>
                                <TextField
                                    placeholder={getLangs(
                                        "input_placeholder_description"
                                    )}
                                    value={post.description}
                                    inputAccessoryViewID="post_description_InputAccessoryViewID"
                                    onChangeText={val => {
                                        setPost({
                                            ...post,
                                            description: val,
                                        });
                                    }}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Button */}
                    <View style={[style.allCenter, styles.button]}>
                        <EnterButton
                            onPress={publishPost}
                            checked={buttonChecked}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Title */}
            <AccessoryView
                onElementPress={l => {
                    setPost(prev => {
                        return {
                            ...prev,
                            title: prev.title + l,
                        };
                    });
                }}
                nativeID={"post_title_InputAccessoryViewID"}
            />
            {/* Description */}
            <AccessoryView
                onElementPress={l => {
                    setPost(prev => {
                        return {
                            ...prev,
                            description: prev.description + l,
                        };
                    });
                }}
                nativeID={"post_description_InputAccessoryViewID"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    imageOutlineContainer: {
        width: "100%",
        borderRadius: 10,
        aspectRatio: 1,
        marginTop: style.defaultMmd,
        alignSelf: "center",
        zIndex: 3,
        borderColor: style.colors.blue,
    },
    imageContainer: {
        width: "100%",
        borderRadius: 5,
    },
    image: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 5,
    },
    imageBorder: {
        borderRadius: 5,
        borderColor: style.colors.red,
        borderWidth: 1,
        borderStyle: "dashed",
    },
    hintIcon: {
        width: "50%",
        aspectRatio: 1,
        zIndex: 10,
    },
    hintText: {
        marginTop: style.defaultMmd,
        width: "60%",
        textAlign: "center",
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

    button: {
        marginVertical: style.defaultMlg,
    },
});
