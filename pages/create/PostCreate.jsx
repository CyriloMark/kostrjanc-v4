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
    ActivityIndicator,
} from "react-native";

import * as style from "../../styles";

//#region import Constants
import { Post_Placeholder } from "../../constants/content/PlaceholderData";
import { getData, storeData } from "../../constants/storage";
import { getLangs } from "../../constants/langs";
import {
    checkForLinkings,
    getClearedLinkedText,
    LINKING_TYPES,
} from "../../constants/content/linking";
import makeRequest from "../../constants/request";
import checkForAutoCorrectInside, {
    getCursorPosition,
} from "../../constants/content/autoCorrect";
import { getImageData, insertCharacterOnCursor } from "../../constants/content";
import { sendContentUploadPushNotification } from "../../constants/notifications/content";
import getStatusCodeText from "../../components/content/status";
//#endregion

//#region import SVGs
import SVG_Pencil from "../../assets/svg/Pencil";
import SVG_Post from "../../assets/svg/Post";
import SVG_Kamera from "../../assets/svg/Kamera";
//#endregion

//#region import Camer & Gallery
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import {
    launchImageLibraryAsync,
    launchCameraAsync,
    requestCameraPermissionsAsync,
    requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import * as FileSystem from "expo-file-system";
//#endregion

//#region import Components
import BackHeader from "../../components/BackHeader";
import EnterButton from "../../components/auth/EnterButton";
import InputField from "../../components/InputField";
import TextField from "../../components/TextField";
import AccessoryView from "../../components/AccessoryView";
import SmallCard from "../../components/content/variableEventCard/SmallCard";
//#endregion

let cursorPos = -1;
export default function PostCreate({ navigation, route }) {
    let btnPressed = false;
    const [uploading, setUploading] = useState(btnPressed);

    const [post, setPost] = useState(Post_Placeholder);
    const [imageUri, setImageUri] = useState(null);
    const [buttonChecked, setButtonChecked] = useState(false);

    const [autoCorrect, setAutoCorrect] = useState({
        status: 100,
        content: [],
    });

    // From linking → when comes back fromLinking = true || = false
    // dest = { type, id }
    const { fromLinking, /*linkingData,*/ fromEdit, editData, dest } =
        route.params;

    //#region useEffect Start
    useEffect(() => {
        cursorPos = -1;

        if (fromEdit) {
            setPost({
                ...editData,
                title: getClearedLinkedText(editData.title),
                description: getClearedLinkedText(editData.description),
            });
            setImageUri(editData.imgUri);
        } else if (dest.type === "g")
            setPost(p => {
                return {
                    ...p,
                    group: dest.id,
                };
            });
    }, []);
    //#endregion

    //#region IMG Load + Compress
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
            mediaTypes: "images",
            allowsEditing: true,
            quality: 0.5,
            aspect: [1, 1],
            allowsMultipleSelection: false,
            base64: true,
        });

        if (pickerResult.canceled) return;

        try {
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
                    base64: true,
                }
            );

            setImageUri(pickerResult.assets[0].uri);
            setPost(prev => {
                return {
                    ...prev,
                    imgUri: croppedPicker.uri,
                    imgBase64: croppedPicker.base64,
                };
            });
        } catch (e) {
            setImageUri(pickerResult.assets[0].uri);
            setPost(prev => {
                return {
                    ...prev,
                    imgUri: pickerResult.assets[0].uri,
                    imgBase64: pickerResult.assets[0].base64,
                };
            });
        }
    };

    const openCamera = async () => {
        let permissionResult = await requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert(
                "kostrjanc njesmě na kameru přistupić.",
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
        let camResult = await launchCameraAsync({
            mediaTypes: "images",
            allowsMultipleSelection: false,
            allowsEditing: true,
            quality: 0.5,
            aspect: [1, 1],
            base64: true,
        });

        if (camResult.canceled) return;

        try {
            const croppedPicker = await manipulateAsync(
                camResult.assets[0].uri,
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
                    base64: true,
                }
            );
            setImageUri(camResult.assets[0].uri);
            setPost(prev => {
                return {
                    ...prev,
                    imgUri: croppedPicker.uri,
                    imgBase64: croppedPicker.base64,
                };
            });
        } catch (e) {
            setImageUri(camResult.assets[0].uri);
            setPost(prev => {
                return {
                    ...prev,
                    imgUri: camResult.assets[0].uri,
                    imgBase64: camResult.assets[0].base64,
                };
            });
        }
    };
    //#endregion

    //#region checkButton
    const checkButton = () => {
        let inputValid = true;
        if (
            post.title.length === 0 ||
            post.description.length === 0 ||
            post.imgUri === Post_Placeholder.imgUri
        )
            inputValid = false;

        if (
            fromEdit &&
            post.title == getClearedLinkedText(editData.title) &&
            post.description == getClearedLinkedText(editData.description)
        )
            inputValid = false;

        setButtonChecked(inputValid);
    };

    //#region setUnfullfilledAlert
    const setUnfullfilledAlert = () => {
        let missing = "";
        if (post.title.length === 0)
            missing += `\n${getLangs("missing_title")}`;
        if (post.description.length === 0)
            missing += `\n${getLangs("missing_description")}`;
        if (post.imgUri === Post_Placeholder.imgUri)
            missing += `\n${getLangs("missing_img")}`;

        if (
            fromEdit &&
            post.title == getClearedLinkedText(editData.title) &&
            post.description == getClearedLinkedText(editData.description)
        )
            missing += `\n${getLangs("missing_equaldata")}`;

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

    //#region useEffect fromLinking?
    useEffect(() => {
        // console.log("useEffect [] line 276");
        if (!fromLinking) checkButton();
        else {
            setButtonChecked(true);
            publishPost();
        }
    }, [post]);

    //#region publish
    const publishPost = async () => {
        if (!buttonChecked) {
            setUnfullfilledAlert();
            return;
        }

        if (
            !fromLinking &&
            !(
                !checkForLinkings(post.title) &&
                !checkForLinkings(post.description)
            )
        ) {
            navigation.navigate("linkingScreen", {
                content: post,
                type: LINKING_TYPES.Post,
                origin: "postCreate",
                fromEdit: fromEdit,
                dest: dest,
            });
            return;
        }

        if (btnPressed) return;
        setButtonChecked(false);
        btnPressed = true;
        setUploading(true);

        console.log("fromEdit", fromEdit);
        if (!fromEdit) publishPostNew();
        else publishPostEdit();
    };

    const publishPostNew = async () => {
        const base64 = post.imgBase64;
        if (!base64) {
            Alert.alert(
                "Fehler",
                "Kein Bild ausgewählt oder Base64-Daten fehlen."
            );
            return;
        }

        const body = {
            type: "post",
            img: base64,
            title: post.title,
            description: post.description,
            group: post.group,
        };

        const response = await makeRequest("/post_event/publish", body);

        if (response.code < 400) {
            if (post.group === 2) storeData("hasUploadForChallenge", true);
            addToLocalStorage(response.id);
            sendContentUploadPushNotification(0);

            Alert.alert(
                getLangs("postcreate_publishsuccessful_title"),
                getLangs(getStatusCodeText(response.code)),
                [
                    {
                        text: "Ok",
                        isPreferred: true,
                        style: "cancel",
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } else {
            Alert.alert(
                getLangs("postcreate_publishrejected_title"),
                getLangs(getStatusCodeText(response.code)),
                [
                    {
                        text: "Ok",
                        isPreferred: true,
                        style: "cancel",
                        onPress: () => {
                            btnPressed = false;
                            setUploading(false);
                            checkButton();
                        },
                    },
                ]
            );
        }
    };

    const publishPostEdit = async () => {
        const body = {
            type: "post",
            id: post.id,
            title: post.title,
            description: post.description,
        };

        const response = await makeRequest("/post_event/edit", body);

        if (response.code < 400)
            Alert.alert(
                getLangs("postcreate_editsuccessful_title"),
                getLangs(getStatusCodeText(response.code)),
                [
                    {
                        text: "Ok",
                        isPreferred: true,
                        style: "cancel",
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        else
            Alert.alert(
                getLangs("postcreate_publishrejected_title"),
                getLangs(getStatusCodeText(response.code)),
                [
                    {
                        text: "Ok",
                        isPreferred: true,
                        style: "cancel",
                        onPress: () => {
                            btnPressed = false;
                            setUploading(false);
                            checkButton();
                        },
                    },
                ]
            );
    };

    //#region addToLocalStorage
    const addToLocalStorage = id => {
        getData("userData").then(userData => {
            let posts = [];
            if (userData["posts"]) posts = userData["posts"];
            posts.push(id);

            storeData("userData", {
                ...userData,
                posts: posts,
            }).finally(() => console.log("complete"));
        });
    };

    return (
        <View style={[style.container, style.bgBlack]}>
            {uploading ? (
                <Pressable
                    onPress={() => {}}
                    style={[
                        styles.loadingContainer,
                        style.allCenter,
                        style.allMax,
                    ]}>
                    <ActivityIndicator
                        size={"large"}
                        color={style.colors.blue}
                    />
                </Pressable>
            ) : null}
            <KeyboardAvoidingView
                style={[style.allMax, { opacity: uploading ? 0.5 : 1 }]}
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
                    style={[style.container, style.pH, style.oVisible]}
                    keyboardDismissMode="interactive"
                    scrollEnabled
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    keyboardShouldPersistTaps="handled"
                    automaticallyAdjustKeyboardInsets
                    automaticallyAdjustContentInsets
                    snapToAlignment="center"
                    snapToEnd>
                    <View>
                        {
                            //#region Title
                        }
                        <Text style={[style.tWhite, style.Ttitle2]}>
                            {post.title.length === 0
                                ? getLangs("postcreate_posttitle")
                                : post.title}
                        </Text>

                        {/* Img */}
                        {
                            //#region Image
                        }
                        <Pressable
                            onPress={!fromEdit ? openImagePickerAsync : null}
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
                                        {/* <SVG_Post
                                            style={styles.hintIcon}
                                            fill={style.colors.blue}
                                        /> */}
                                        <Text
                                            style={[
                                                style.Tmd,
                                                style.tBlue,
                                                styles.hintText,
                                            ]}>
                                            {getLangs("postcreate_imghint")}
                                        </Text>
                                        <View
                                            style={
                                                styles.imageHintOptSelectionContainer
                                            }>
                                            <Pressable
                                                onPress={openImagePickerAsync}
                                                style={[
                                                    styles.imageHintOptItem,
                                                    style.Pmd,
                                                    style.border,
                                                    style.allCenter,
                                                ]}>
                                                <SVG_Post
                                                    style={
                                                        styles.imageHintOptSelectionImg
                                                    }
                                                    fill={style.colors.blue}
                                                />
                                                <Text
                                                    style={[
                                                        style.TsmRg,
                                                        style.tBlue,
                                                        {
                                                            marginTop:
                                                                style.defaultMsm,
                                                        },
                                                    ]}>
                                                    Galerija
                                                </Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={openCamera}
                                                style={[
                                                    styles.imageHintOptItem,
                                                    style.Pmd,
                                                    style.border,
                                                    style.allCenter,
                                                ]}>
                                                <SVG_Kamera
                                                    style={
                                                        styles.imageHintOptSelectionImg
                                                    }
                                                    fill={style.colors.blue}
                                                />
                                                <Text
                                                    style={[
                                                        style.TsmRg,
                                                        style.tBlue,
                                                        {
                                                            marginTop:
                                                                style.defaultMsm,
                                                        },
                                                    ]}>
                                                    Kamera
                                                </Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </Pressable>

                        {
                            //#region Description
                        }
                        <View style={styles.textContainer}>
                            <Text style={[style.Tmd, style.tWhite]}>
                                {post.description.length === 0
                                    ? getLangs("postcreate_postdescription")
                                    : post.description}
                            </Text>
                        </View>

                        {
                            //#region Group / Event
                        }
                        {dest.type === "g" ? (
                            <View style={styles.sectionContainer}>
                                <Text style={[style.tWhite, style.TlgBd]}>
                                    {getLangs("content_group_title")}
                                </Text>

                                <View
                                    style={[styles.groupContainer, style.Psm]}>
                                    <View
                                        style={[
                                            styles.groupImgContainer,
                                            { borderRadius: 10 },
                                        ]}>
                                        <Image
                                            source={{
                                                uri: dest.data.imgUri,
                                            }}
                                            style={style.allMax}
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
                                        {dest.data.name}
                                    </Text>
                                </View>
                            </View>
                        ) : dest.type === "e" ? (
                            <View style={styles.sectionContainer}>
                                <Text style={[style.tWhite, style.TlgBd]}>
                                    {getLangs("contentcreate_eventinfo_title")}
                                </Text>
                                <View style={styles.eventContainer}>
                                    <SmallCard
                                        event={dest.data}
                                        onPress={() => {}}
                                    />
                                </View>
                            </View>
                        ) : null}
                    </View>

                    {
                        //#region Info Edit
                    }
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("postcreate_addinformation")}
                        </Text>
                        <View
                            style={[style.pH, { marginTop: style.defaultMmd }]}>
                            {
                                //#region Titel Edit
                            }
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
                                    maxLength={128}
                                    inputAccessoryViewID="post_title_InputAccessoryViewID"
                                    icon={
                                        <SVG_Pencil fill={style.colors.blue} />
                                    }
                                    supportsAutoCorrect
                                    onSelectionChange={async e => {
                                        cursorPos =
                                            e.nativeEvent.selection.start;

                                        const autoC =
                                            await checkForAutoCorrectInside(
                                                post.title,
                                                cursorPos
                                            );
                                        setAutoCorrect(autoC);
                                    }}
                                    onChangeText={async val => {
                                        // Check Selection
                                        cursorPos = getCursorPosition(
                                            post.title,
                                            val
                                        );

                                        // Add Input to Post Data -> Changes Title
                                        setPost({
                                            ...post,
                                            title: val,
                                        });

                                        // Auto Correct
                                        const autoC =
                                            await checkForAutoCorrectInside(
                                                val,
                                                cursorPos
                                            );
                                        setAutoCorrect(autoC);
                                    }}
                                    autoCorrection={autoCorrect}
                                    applyAutoCorrection={word => {
                                        setPost(prev => {
                                            let title = prev.title.split(" ");
                                            let titlePartSplit = prev.title
                                                .substring(0, cursorPos)
                                                .split(" ");

                                            titlePartSplit.pop();
                                            titlePartSplit.push(word);

                                            let newTitle = "";
                                            titlePartSplit.forEach(
                                                el => (newTitle += `${el} `)
                                            );
                                            for (
                                                let i = titlePartSplit.length;
                                                i < title.length;
                                                i++
                                            )
                                                newTitle += `${title[i]}${
                                                    i == title.length - 1
                                                        ? ""
                                                        : " "
                                                }`;

                                            setAutoCorrect({
                                                status: 100,
                                                content: [],
                                            });
                                            return {
                                                ...prev,
                                                title: newTitle,
                                            };
                                        });
                                    }}
                                />
                            </View>
                            {
                                //#region Description Edit
                            }
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
                                    maxLength={512}
                                    inputAccessoryViewID="post_description_InputAccessoryViewID"
                                    supportsAutoCorrect
                                    onSelectionChange={async e => {
                                        cursorPos =
                                            e.nativeEvent.selection.start;

                                        const autoC =
                                            await checkForAutoCorrectInside(
                                                post.description,
                                                cursorPos
                                            );
                                        setAutoCorrect(autoC);
                                    }}
                                    onChangeText={async val => {
                                        // Check Selection
                                        cursorPos = getCursorPosition(
                                            post.description,
                                            val
                                        );

                                        // Add Input to Post Data -> Changes Desc
                                        setPost({
                                            ...post,
                                            description: val,
                                        });

                                        // Auto Correct
                                        const autoC =
                                            await checkForAutoCorrectInside(
                                                val,
                                                cursorPos
                                            );
                                        setAutoCorrect(autoC);
                                    }}
                                    autoCorrection={autoCorrect}
                                    applyAutoCorrection={word => {
                                        setPost(prev => {
                                            let desc =
                                                prev.description.split(" ");
                                            let descPartSplit = prev.description
                                                .substring(0, cursorPos)
                                                .split(" ");

                                            descPartSplit.pop();
                                            descPartSplit.push(word);

                                            let newDesc = "";
                                            descPartSplit.forEach(
                                                el => (newDesc += `${el} `)
                                            );
                                            for (
                                                let i = descPartSplit.length;
                                                i < desc.length;
                                                i++
                                            )
                                                newDesc += `${desc[i]}${
                                                    i == desc.length - 1
                                                        ? ""
                                                        : " "
                                                }`;

                                            setAutoCorrect({
                                                status: 100,
                                                content: [],
                                            });
                                            return {
                                                ...prev,
                                                description: newDesc,
                                            };
                                        });
                                    }}
                                />
                            </View>
                        </View>
                    </View>

                    {
                        //#region Button
                    }
                    <View style={[style.allCenter, styles.button]}>
                        <EnterButton
                            onPress={publishPost}
                            checked={buttonChecked}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {
                //#region AccessoryViews
            }
            {/* Title */}
            <AccessoryView
                onElementPress={l => {
                    setPost(prev => {
                        return {
                            ...prev,
                            title: insertCharacterOnCursor(
                                post.title,
                                cursorPos,
                                l
                            ),
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
                            description: insertCharacterOnCursor(
                                post.description,
                                cursorPos,
                                l
                            ),
                        };
                    });
                }}
                nativeID={"post_description_InputAccessoryViewID"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    //#region Image Styles
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
        width: "100%",
        textAlign: "center",
    },
    textContainer: {
        // paddingHorizontal: style.Psm.paddingHorizontal,
        width: "100%",
        justifyContent: "center",
        marginTop: style.defaultMmd,
    },
    imageHintOptSelectionContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: style.defaultMlg,
    },
    imageHintOptItem: {
        borderColor: style.colors.blue,
        borderRadius: 10,
        marginHorizontal: style.defaultMsm,
    },
    imageHintOptSelectionImg: {
        width: 48,
        height: 48,
    },
    //#endregion

    //#region Group Styles
    groupContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginTop: style.defaultMsm,
    },
    groupImgContainer: {
        aspectRatio: 1,
        flex: 1,
        width: "100%",
        maxWidth: 32,
        maxHeight: 32,
        borderRadius: 100,
        overflow: "hidden",
        justifyContent: "center",
    },

    eventContainer: {
        marginTop: style.defaultMmd,

        overflow: "visible",

        alignSelf: "center",
        width: "100%",

        // Shadow
        shadowRadius: 10,
        shadowOpacity: 0.5,
        shadowColor: style.colors.sec,
        shadowOffset: {
            width: 0,
            height: -2,
        },

        backgroundColor: style.colors.black,
        borderRadius: 10,
        borderColor: style.colors.sec,
        borderWidth: 1,
    },
    //#endregion

    //#region Linking Styles
    linkingsContainer: {
        width: "100%",
        minHeight: 12,
        flexDirection: "column",
        marginTop: style.defaultMmd,
    },
    linkingsElement: {
        width: "100%",
        marginTop: style.defaultMsm,
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        // maxHeight: 24,
    },
    userContainer: {
        marginLeft: style.defaultMmd,
    },
    userInner: {
        flexDirection: "row",
        alignItems: "center",
    },
    userPbContainer: {
        aspectRatio: 1,
        flex: 1,
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
    //#endregion

    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
    },

    button: {
        marginVertical: style.defaultMlg,
    },

    //#region SelectUser Styles
    selectUserContainer: {
        marginTop: style.defaultMsm,
        maxHeight: 32,
        // maxWidth: Dimensions.get("screen").width,
        maxWidth: "100%",
        borderRadius: 25,
    },
    selectUserInner: {
        flexDirection: "row",
        justifyContent: "center",
    },
    selectUserIcon: {
        aspectRatio: 1,
        maxWidth: 12,
        maxHeight: 12,
    },
    //#endregion

    //#region Group Select Styles
    groupSelectContainer: {
        marginTop: style.defaultMmd,
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    groupSelectElement: {
        margin: style.defaultMsm,
        maxWidth: 72,
        maxHeight: 128,
    },
    groupSelectElementImgContainer: {
        aspectRatio: 4 / 5,
        minWidth: 48,
        minHeight: 48,
        borderRadius: 10,
        maxHeight: 72,
    },
    //#endregion

    loadingContainer: {
        position: "absolute",
    },
});
