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

import { getAuth } from "firebase/auth";
import { child, get, getDatabase, ref, set } from "firebase/database";
import * as Storage from "firebase/storage";

// import Constants
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
import getStatusCodeText from "../../components/content/status";

// import SVGs
import SVG_Pencil from "../../assets/svg/Pencil";
import SVG_Post from "../../assets/svg/Post";
import SVG_Kamera from "../../assets/svg/Kamera";

import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import {
    launchImageLibraryAsync,
    MediaTypeOptions,
    launchCameraAsync,
    requestCameraPermissionsAsync,
    requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import * as FileSystem from "expo-file-system";

// import Components
import BackHeader from "../../components/BackHeader";
import EnterButton from "../../components/auth/EnterButton";
import InputField from "../../components/InputField";
import TextField from "../../components/TextField";
import AccessoryView from "../../components/AccessoryView";
import ChallengeSubmitButton from "../../components/groups/ChallengeSubmitButton";

let cursorPos = -1;
export default function PostCreate({ navigation, route }) {
    let btnPressed = false;
    const [uploading, setUploading] = useState(btnPressed);

    const [post, setPost] = useState(Post_Placeholder);
    const [imageUri, setImageUri] = useState(null);
    const [buttonChecked, setButtonChecked] = useState(false);
    const [groups, setGroups] = useState([]);
    const [canUploadForChallenge, setCanUploadForChallenge] = useState(false);

    const [autoCorrect, setAutoCorrect] = useState({
        status: 100,
        content: [],
    });

    // From linking → when comes back fromLinking = true || = false
    const { fromLinking, /*linkingData,*/ fromEdit, editData } = route.params;

    useEffect(() => {
        cursorPos = -1;
        getGroups();
        checkForChallengeable();

        if (fromEdit) {
            setPost({
                ...editData,
                title: getClearedLinkedText(editData.title),
                description: getClearedLinkedText(editData.description),
            });
            setImageUri(editData.imgUri);
        }
    }, []);

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
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
            aspect: [1, 1],
            allowsMultipleSelection: false,
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
                }
            );
            setImageUri(pickerResult.assets[0].uri);
            setPost(prev => {
                return {
                    ...prev,
                    imgUri: croppedPicker.uri,
                };
            });
        } catch (e) {
            setImageUri(pickerResult.assets[0].uri);
            setPost(prev => {
                return {
                    ...prev,
                    imgUri: pickerResult.assets[0].uri,
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
            mediaTypes: MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            allowsEditing: true,
            quality: 0.5,
            aspect: [1, 1],
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
                }
            );
            setImageUri(camResult.assets[0].uri);
            setPost(prev => {
                return {
                    ...prev,
                    imgUri: croppedPicker.uri,
                };
            });
        } catch (e) {
            setImageUri(camResult.assets[0].uri);
            setPost(prev => {
                return {
                    ...prev,
                    imgUri: camResult.assets[0].uri,
                };
            });
        }
    };
    //#endregion

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

    const checkForChallengeable = async () => {
        const hasUploadForChallenge = await getData("hasUploadForChallenge");
        if (hasUploadForChallenge != null)
            return setCanUploadForChallenge(!hasUploadForChallenge);

        const data = await getData("userData");
        if (!data.posts) return setCanUploadForChallenge(true);

        let postsList = data.posts;

        let count = 0;
        for (let i = postsList.length; i > 0; i--)
            get(
                child(ref(getDatabase()), `posts/${postsList[i - 1]}/group`)
            ).then(groupSnap => {
                if (groupSnap.exists())
                    if (groupSnap.val() == 2) {
                        console.log("3");
                        setCanUploadForChallenge(false);
                        storeData("hasUploadForChallenge", true);
                        i = 0;
                    } else count++;
                else count++;
                if (i === 1 && count === postsList.length) {
                    setCanUploadForChallenge(true);
                    storeData("hasUploadForChallenge", false);
                }
            });
    };

    useEffect(() => {
        if (!fromLinking) checkButton();
        else {
            setButtonChecked(true);
            publishPost();
        }
    }, [post]);

    //#region get Groups of Client
    const getGroupsData = g => {
        if (!Array.isArray(g)) return;

        const db = ref(getDatabase());
        let output = [];

        for (let i = 0; i < g.length; i++) {
            get(child(db, `groups/${g[i]}`)).then(gSnap => {
                if (gSnap.exists()) {
                    const gData = gSnap.val();
                    output.push({
                        name: gData.name,
                        imgUri: gData.imgUri,
                        id: g[i],
                    });
                }
                if (i === g.length - 1) setGroups(output);
            });
        }
    };
    const getGroups = async () => {
        const userData = await getData("userData");

        const db = ref(getDatabase());
        if (!userData)
            get(child(db, `users/${getAuth().currentUser.uid}/groups`)).then(
                groupsSnap => {
                    if (groupsSnap.exists()) getGroupsData(groupsSnap.val());
                }
            );
        else if (userData.groups) getGroupsData(userData.groups);
    };
    //#endregion

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
            });
            return;
        }

        if (btnPressed) return;
        setButtonChecked(false);
        btnPressed = true;
        setUploading(true);

        console.log("1", fromEdit);
        if (!fromEdit) publishPostNew();
        else publishPostEdit();
    };

    const publishPostNew = async () => {
        const base64 = await FileSystem.readAsStringAsync(post.imgUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const body = {
            type: "post",
            img: base64,
            title: post.title,
            description: post.description,
            group: post.group,
        };

        const response = await makeRequest("/post_event/publish", body);
        console.log(response);

        if (response.code < 400) {
            if (post.group === 2) storeData("hasUploadForChallenge", true);
            addToLocalStorage(response.id);

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
                <View
                    style={[
                        styles.loadingContainer,
                        style.allCenter,
                        style.allMax,
                    ]}>
                    <ActivityIndicator
                        size={"large"}
                        color={style.colors.blue}
                    />
                </View>
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
                    {/* Image Container */}
                    <View>
                        {/* Title */}
                        <Text style={[style.tWhite, style.Ttitle2]}>
                            {post.title.length === 0
                                ? getLangs("postcreate_posttitle")
                                : post.title}
                        </Text>

                        {/* Img */}
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
                            {/* Titel */}
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

                    {/* Challenge Group Select */}
                    {!fromEdit ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                {getLangs("postcreate_challengeselect_title")}
                            </Text>

                            {canUploadForChallenge ? (
                                <View style={{ marginTop: style.defaultMsm }}>
                                    <Text style={[style.tWhite, style.Tmd]}>
                                        {getLangs(
                                            "postcreate_challengeselect_description"
                                        )}
                                    </Text>

                                    <ChallengeSubmitButton
                                        active={post.group === 2}
                                        onPress={() =>
                                            setPost(prev => {
                                                if (!prev.group)
                                                    return {
                                                        ...prev,
                                                        group: 2,
                                                    };
                                                else if (prev.group === 2)
                                                    return {
                                                        ...prev,
                                                        group: null,
                                                    };
                                                else
                                                    return {
                                                        ...prev,
                                                        group: 2,
                                                    };
                                            })
                                        }
                                    />
                                </View>
                            ) : (
                                <Text
                                    style={[
                                        style.tWhite,
                                        style.Tmd,
                                        { marginTop: style.defaultMsm },
                                    ]}>
                                    {getLangs(
                                        "postcreate_challengeselect_alreadysent"
                                    )}
                                </Text>
                            )}
                        </View>
                    ) : null}

                    {/* Group Select */}
                    {groups.length !== 0 && !fromEdit ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                {getLangs("contentcreate_groupselect_title")}
                            </Text>
                            <Text
                                style={[
                                    style.tWhite,
                                    style.Tmd,
                                    { marginTop: style.defaultMsm },
                                ]}>
                                {getLangs("contentcreate_groupselect_hint")}
                            </Text>

                            <View style={[styles.groupSelectContainer]}>
                                {groups.map((group, key) => (
                                    <Pressable
                                        key={key}
                                        style={[
                                            styles.groupSelectElement,
                                            style.oHidden,
                                            style.Psm,
                                        ]}
                                        onPress={() => {
                                            setPost(prev => {
                                                if (!prev.group)
                                                    return {
                                                        ...prev,
                                                        group: group.id,
                                                    };
                                                else if (
                                                    prev.group === group.id
                                                )
                                                    return {
                                                        ...prev,
                                                        group: null,
                                                    };
                                                else
                                                    return {
                                                        ...prev,
                                                        group: group.id,
                                                    };
                                            });
                                        }}>
                                        <View
                                            style={[
                                                styles.groupSelectElementImgContainer,
                                                style.oHidden,
                                                post.group == group.id
                                                    ? {
                                                          borderColor:
                                                              style.colors.red,
                                                          ...style.border,
                                                      }
                                                    : null,
                                            ]}>
                                            <Image
                                                style={style.allMax}
                                                source={{ uri: group.imgUri }}
                                            />
                                        </View>
                                        <Text
                                            style={[
                                                post.group == group.id
                                                    ? style.tRed
                                                    : style.tWhite,
                                                style.TsmRg,
                                                {
                                                    marginTop: style.defaultMsm,
                                                    textAlign: "center",
                                                },
                                            ]}>
                                            {group.name}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    ) : fromEdit ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                {getLangs("contentcreate_groupselect_title")}
                            </Text>
                            <Text
                                style={[
                                    style.tWhite,
                                    style.Tmd,
                                    { marginTop: style.defaultMsm },
                                ]}>
                                {getLangs(
                                    "contentcreate_groupselect_fromedit_hint"
                                )}
                            </Text>
                        </View>
                    ) : null}

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

    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
    },

    button: {
        marginVertical: style.defaultMlg,
    },

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

    loadingContainer: {
        position: "absolute",
    },
});
