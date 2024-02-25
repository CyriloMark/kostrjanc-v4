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
import { child, get, getDatabase, ref } from "firebase/database";

// import SVGs
import SVG_Pencil from "../../assets/svg/Pencil";
import SVG_Post from "../../assets/svg/Post";
import SVG_Kamera from "../../assets/svg/Kamera";
import SVG_Search from "../../assets/svg/Search";

import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import {
    launchImageLibraryAsync,
    MediaTypeOptions,
    launchCameraAsync,
    requestCameraPermissionsAsync,
    requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import * as FileSystem from "expo-file-system";

// Constants
import { Group_Placeholder } from "../../constants/content/PlaceholderData";
import { getLangs } from "../../constants/langs";
import { insertCharacterOnCursor } from "../../constants/content";
import getStatusCodeText from "../../components/content/status";
import checkForAutoCorrectInside, {
    getCursorPosition,
} from "../../constants/content/autoCorrect";
import { getData, storeData } from "../../constants/storage";

// import Components
import BackHeader from "../../components/BackHeader";
import EnterButton from "../../components/auth/EnterButton";
import InputField from "../../components/InputField";
import TextField from "../../components/TextField";
import AccessoryView from "../../components/AccessoryView";

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import MemberElement from "../../components/groups/MemberElement";
import makeRequest from "../../constants/request";

const IMAGE_DEFAULT_WIDTH = 152;

let cursorPos = -1;
export default function GroupCreate({ navigation, route }) {
    let btnPressed = false;
    let groupNameIsNotAvailable = false;

    const [uploading, setUploading] = useState(btnPressed);

    const [autoCorrect, setAutoCorrect] = useState({
        status: 100,
        content: [],
    });

    const [group, setGroup] = useState(Group_Placeholder);
    const [buttonChecked, setButtonChecked] = useState(false);
    const [imageUri, setImageUri] = useState(null);

    const [userSearchInput, setUserSearchInput] = useState("");
    const [userSearchResult, setUserSearchResult] = useState([]);
    const [staticMembers, setStaticMembers] = useState([]);

    const { fromEdit, editData } = route.params;

    useEffect(() => {
        cursorPos = -1;

        if (fromEdit) {
            setStaticMembers(editData.members);
            setGroup(editData);
            setImageUri(editData.imgUri);
        } else {
            const uid = getAuth().currentUser.uid;
            setStaticMembers([uid]);
            setGroup(prev => {
                return {
                    ...prev,
                    members: [uid], // Client is always Member
                };
            });
        }
    }, []);

    useEffect(() => {
        checkButton();
    }, [group]);

    const checkButton = () => {
        let inputValid = false;
        if (
            group.name.length !== 0 &&
            !groupNameIsNotAvailable &&
            group.description.length !== 0 &&
            group.imgUri !== Group_Placeholder.imgUri &&
            group.members.length > 1
        )
            inputValid = true;
        setButtonChecked(inputValid);
    };

    //#region Camera and Gallery
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

            if (!imageUri)
                imageWidthMultipier.value = withSpring(1, {
                    damping: 10,
                    stiffness: 50,
                });

            setImageUri(pickerResult.assets[0].uri);
            setGroup(prev => {
                return {
                    ...prev,
                    imgUri: croppedPicker.uri,
                };
            });
        } catch (e) {
            setImageUri(pickerResult.assets[0].uri);
            setGroup(prev => {
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

            if (!imageUri)
                imageWidthMultipier.value = withSpring(1, {
                    damping: 10,
                    stiffness: 50,
                });

            setImageUri(camResult.assets[0].uri);
            setGroup(prev => {
                return {
                    ...prev,
                    imgUri: croppedPicker.uri,
                };
            });
        } catch (e) {
            setImageUri(camResult.assets[0].uri);
            setGroup(prev => {
                return {
                    ...prev,
                    imgUri: camResult.assets[0].uri,
                };
            });
        }
    };
    //#endregion

    const addToLocalStorage = id => {
        getData("userData").then(userData => {
            let groups = [];
            if (userData["groups"]) groups = userData["groups"];
            group.push(id);

            storeData("userData", {
                ...userData,
                groups: groups,
            }).finally(() => console.log("complete"));
        });
    };

    const setUnfullfilledAlert = () => {
        let missing = "";
        if (group.name.length === 0) missing += `\n${getLangs("missing_name")}`;
        if (groupNameIsNotAvailable)
            missing += `\n${getLangs("missing_existinggroupname")}`;
        if (group.description.length === 0)
            missing += `\n${getLangs("missing_description")}`;
        if (group.imgUri === Group_Placeholder.imgUri)
            missing += `\n${getLangs("missing_img")}`;
        if (group.members <= 1)
            missing += `\n${getLangs("missing_memberslist")}`;

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

    const publishGroup = async () => {
        if (!buttonChecked) {
            setUnfullfilledAlert();
            return;
        }

        if (btnPressed) return;
        setButtonChecked(false);
        btnPressed = true;
        setUploading(true);

        const base64 = await FileSystem.readAsStringAsync(group.imgUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Yoo
        const response = await makeRequest("/groups/create", {
            name: group.name,
            description: group.description,
            members: group.members,
            img: base64,
        });

        if (response.code < 400) {
            addToLocalStorage(response.id);
            Alert.alert(
                getLangs("groupcreate_publishsuccessful_title"),
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
                getLangs("groupcreate_publishrejected_title"),
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

    //#region handleMembers
    const searchUsers = val => {
        makeRequest("/user/search", {
            query: val,
        })
            .then(rsp => {
                let results = [];
                rsp.hits.map(hit =>
                    results.push({
                        name: hit.primary,
                        pbUri: hit.img,
                        id: hit.id.substring(2),
                    })
                );
                setUserSearchResult(results);
            })
            .catch(error =>
                console.log(
                    "error getMeiliSearch request",
                    "InputField pages/create/GroupCreate.jsx",
                    error
                )
            );
    };

    const onMemberAdd = userId => {
        if (group.members.includes(userId)) return;

        setGroup(prev => {
            let newMemberLit = prev.members.concat([userId]);
            return {
                ...prev,
                members: newMemberLit,
            };
        });

        setUserSearchInput("");
        setUserSearchResult([]);
    };

    const onMemberRemove = userId => {
        let userPos = group.members.indexOf(userId);
        if (userPos == -1) return;

        // setGroup(prev => {
        //     let newMemberList = prev.members.filter(a => a != userId);

        //     return {
        //         ...prev,
        //         members: newMemberList,
        //     };
        // });

        setGroup({
            ...group,
            members: group.members.filter(a => a !== userId),
        });
    };
    //#endregion

    const checkIfGroupNameIsAvailable = () => {
        get(child(ref(getDatabase()), `groups/${group.name}/name`))
            .then(groupSnap => {
                if (!groupSnap.exists()) return;

                groupNameIsNotAvailable = true;
                Alert.alert(
                    getLangs("groupcreate_info_name_notavailable_title"),
                    getLangs("groupcreate_info_name_notavailable_sub"),
                    [
                        {
                            isPreferred: true,
                            style: "default",
                            text: "Ok",
                        },
                    ]
                );
            })
            .catch(error =>
                console.log(
                    "error in pages/create/GroupCreate.jsx",
                    "checkIfGroupNameIsAvailable",
                    error.code
                )
            );
    };

    //#region Animation
    const imageWidthMultipier = useSharedValue(2);

    const imageStyles = useAnimatedStyle(() => {
        return {
            width: IMAGE_DEFAULT_WIDTH * imageWidthMultipier.value,
            height: IMAGE_DEFAULT_WIDTH * imageWidthMultipier.value,
        };
    });
    //#endregion

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
                        title={getLangs("groupcreate_headertitle")}
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
                    {/* Preview + Image select */}
                    <View
                        style={{
                            marginTop: style.defaultMmd,
                        }}>
                        {/* Header Container */}
                        <View style={{ alignItems: "center" }}>
                            {/* Pb */}

                            <View
                                style={[
                                    style.shadowSec,
                                    {
                                        borderRadius: 25,
                                        shadowOpacity: 0.33,
                                        shadowRadius: 25,
                                        shadowColor: imageUri
                                            ? style.colors.red
                                            : style.colors.black,
                                    },
                                ]}>
                                <Animated.View
                                    style={[
                                        styles.imageOutlineContainer,
                                        !imageUri ? style.border : null,
                                        style.allCenter,
                                        imageStyles,
                                    ]}>
                                    <Pressable
                                        onPress={openImagePickerAsync}
                                        style={[
                                            styles.imageContainer,
                                            style.allCenter,
                                            style.oHidden,
                                            !imageUri ? style.Psm : null,
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
                                                <Text
                                                    style={[
                                                        style.Tmd,
                                                        style.tBlue,
                                                        styles.hintText,
                                                    ]}>
                                                    {getLangs(
                                                        "postcreate_imghint"
                                                    )}
                                                </Text>
                                                <View
                                                    style={
                                                        styles.imageHintOptSelectionContainer
                                                    }>
                                                    <Pressable
                                                        onPress={
                                                            openImagePickerAsync
                                                        }
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
                                                            fill={
                                                                style.colors
                                                                    .blue
                                                            }
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
                                                            fill={
                                                                style.colors
                                                                    .blue
                                                            }
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
                                    </Pressable>
                                </Animated.View>
                            </View>

                            {/* Name */}
                            <View style={styles.nameContainer}>
                                <Text style={[style.tWhite, style.Ttitle2]}>
                                    {group.name.length === 0
                                        ? getLangs("groupcreate_groupname")
                                        : group.name}
                                </Text>
                            </View>

                            {/* Description */}
                            <View style={styles.textContainer}>
                                <Text style={[style.Tmd, style.tWhite]}>
                                    {group.description.length === 0
                                        ? getLangs(
                                              "groupcreate_groupdescription"
                                          )
                                        : group.description}
                                </Text>
                            </View>
                        </View>

                        {/* Stats Container */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.statsContainer}>
                                {/* Members */}
                                <View
                                    style={[
                                        style.allCenter,
                                        styles.statElementContainer,
                                    ]}>
                                    <Text style={[style.tWhite, style.TlgBd]}>
                                        {group.members
                                            ? group.members.length
                                            : "0"}
                                    </Text>
                                    <Text
                                        style={[
                                            style.tRed,
                                            style.TsmRg,
                                            { marginTop: style.defaultMsm },
                                        ]}>
                                        {getLangs("grouppage_members")}
                                    </Text>
                                </View>

                                {/* Posts */}
                                <View
                                    style={[
                                        style.allCenter,
                                        styles.statElementContainer,
                                    ]}>
                                    <Text style={[style.tWhite, style.TlgBd]}>
                                        {group.posts ? group.posts.length : "0"}
                                    </Text>
                                    <Text
                                        style={[
                                            style.tRed,
                                            style.TsmRg,
                                            { marginTop: style.defaultMsm },
                                        ]}>
                                        {getLangs("grouppage_posts")}
                                    </Text>
                                </View>

                                {/* Events */}
                                <View
                                    style={[
                                        style.allCenter,
                                        styles.statElementContainer,
                                    ]}>
                                    <Text style={[style.tWhite, style.TlgBd]}>
                                        {group.events
                                            ? group.events.length
                                            : "0"}
                                    </Text>
                                    <Text
                                        style={[
                                            style.tRed,
                                            style.TsmRg,
                                            { marginTop: style.defaultMsm },
                                        ]}>
                                        {getLangs("grouppage_events")}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Info Edit */}
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("groupcreate_addinformation")}
                        </Text>
                        <View
                            style={[style.pH, { marginTop: style.defaultMmd }]}>
                            {/* Name */}
                            <View style={{ opacity: fromEdit ? 0.5 : 1 }}>
                                <Text
                                    style={[
                                        style.Tmd,
                                        style.tWhite,
                                        {
                                            marginBottom: style.defaultMsm,
                                        },
                                    ]}>
                                    {getLangs("groupcreate_info_name")}
                                </Text>
                                <InputField
                                    placeholder={getLangs(
                                        "input_placeholder_groupname"
                                    )}
                                    editable={!fromEdit}
                                    autoCapitalize="sentences"
                                    keyboardType="default"
                                    value={group.name}
                                    maxLength={128}
                                    onBlur={checkIfGroupNameIsAvailable}
                                    inputAccessoryViewID="group_name_InputAccessoryViewID"
                                    icon={
                                        <SVG_Pencil fill={style.colors.blue} />
                                    }
                                    supportsAutoCorrect
                                    onSelectionChange={async e => {
                                        cursorPos =
                                            e.nativeEvent.selection.start;

                                        const autoC =
                                            await checkForAutoCorrectInside(
                                                group.name,
                                                cursorPos
                                            );
                                        setAutoCorrect(autoC);
                                    }}
                                    onChangeText={async val => {
                                        if (fromEdit) return;

                                        // Check Selection
                                        cursorPos = getCursorPosition(
                                            group.name,
                                            val
                                        );

                                        // Add Input to Post Data -> Changes Title
                                        setGroup({
                                            ...group,
                                            name: val,
                                        });

                                        groupNameIsNotAvailable = false;

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
                                        setGroup(prev => {
                                            let name = prev.name.split(" ");
                                            let namePartSplit = prev.name
                                                .substring(0, cursorPos)
                                                .split(" ");

                                            namePartSplit.pop();
                                            namePartSplit.push(word);

                                            let newName = "";
                                            namePartSplit.forEach(
                                                el => (newName += `${el} `)
                                            );
                                            for (
                                                let i = namePartSplit.length;
                                                i < name.length;
                                                i++
                                            )
                                                newName += `${name[i]}${
                                                    i == name.length - 1
                                                        ? ""
                                                        : " "
                                                }`;

                                            setAutoCorrect({
                                                status: 100,
                                                content: [],
                                            });
                                            return {
                                                ...prev,
                                                name: newName,
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
                                    {getLangs("groupcreate_info_description")}
                                </Text>
                                <TextField
                                    placeholder={getLangs(
                                        "input_placeholder_description"
                                    )}
                                    value={group.description}
                                    maxLength={512}
                                    inputAccessoryViewID="group_description_InputAccessoryViewID"
                                    supportsAutoCorrect
                                    onSelectionChange={async e => {
                                        cursorPos =
                                            e.nativeEvent.selection.start;

                                        const autoC =
                                            await checkForAutoCorrectInside(
                                                group.description,
                                                cursorPos
                                            );
                                        setAutoCorrect(autoC);
                                    }}
                                    onChangeText={async val => {
                                        // Check Selection
                                        cursorPos = getCursorPosition(
                                            group.description,
                                            val
                                        );

                                        // Add Input to Post Data -> Changes Desc
                                        setGroup({
                                            ...group,
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
                                        setGroup(prev => {
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

                    {/* Search Input */}
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("groupcreate_addmembers_input_title")}
                        </Text>
                        <View
                            style={[style.pH, { marginTop: style.defaultMmd }]}>
                            <Text
                                style={[
                                    style.Tmd,
                                    style.tWhite,
                                    { marginBottom: style.defaultMsm },
                                ]}>
                                {getLangs("groupcreate_addmembers_input_sub")}
                            </Text>
                            <InputField
                                placeholder={getLangs(
                                    "input_placeholder_search"
                                )}
                                autoCapitalize="sentences"
                                keyboardType="default"
                                value={userSearchInput}
                                maxLength={32}
                                inputAccessoryViewID="group_usersearch_InputAccessoryViewID"
                                icon={<SVG_Search fill={style.colors.blue} />}
                                onSelectionChange={async e => {
                                    cursorPos = e.nativeEvent.selection.start;
                                }}
                                onChangeText={async val => {
                                    // Check Selection
                                    cursorPos = getCursorPosition(
                                        userSearchInput,
                                        val
                                    );

                                    // Add Input to Post Data -> Changes Title
                                    setUserSearchInput(val);

                                    if (val !== "") searchUsers(val);
                                }}
                            />
                        </View>
                    </View>

                    {/* Search Result */}
                    {userSearchResult.length != 0 ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                {getLangs(
                                    "groupcreate_addmembers_result_title"
                                )}
                            </Text>
                            {userSearchResult.map(user => (
                                <Pressable
                                    key={user.id}
                                    style={[styles.userContainer, style.Psm]}
                                    onPress={() => onMemberAdd(user.id)}>
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
                            ))}
                        </View>
                    ) : null}

                    {/* Member List */}
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("groupcreate_addmembers_list_title")}
                        </Text>
                        <Text
                            style={[
                                style.Tmd,
                                style.tWhite,
                                { marginTop: style.defaultMsm },
                            ]}>
                            {getLangs("groupcreate_addmembers_list_hint")}
                        </Text>
                        <View style={styles.memberContainer}>
                            {group.members.map(user => (
                                <MemberElement
                                    key={user}
                                    id={user}
                                    style={{
                                        margin: style.defaultMsm,
                                    }}
                                    selectable={!staticMembers.includes(user)}
                                    onPress={() => onMemberRemove(user)}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Button */}
                    <View style={[style.allCenter, styles.button]}>
                        <EnterButton
                            onPress={publishGroup}
                            checked={buttonChecked}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Title */}
            <AccessoryView
                onElementPress={l => {
                    setGroup(prev => {
                        return {
                            ...prev,
                            name: insertCharacterOnCursor(
                                group.name,
                                cursorPos,
                                l
                            ),
                        };
                    });
                }}
                nativeID={"group_name_InputAccessoryViewID"}
            />
            {/* Description */}
            <AccessoryView
                onElementPress={l => {
                    setGroup(prev => {
                        return {
                            ...prev,
                            description: insertCharacterOnCursor(
                                group.description,
                                cursorPos,
                                l
                            ),
                        };
                    });
                }}
                nativeID={"group_description_InputAccessoryViewID"}
            />
            {/* User Search */}
            <AccessoryView
                onElementPress={l => {
                    setUserSearchInput(prev => {
                        return insertCharacterOnCursor(prev, cursorPos, l);
                    });
                }}
                nativeID={"group_usersearch_InputAccessoryViewID"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
    },
    loadingContainer: {
        position: "absolute",
    },

    //#region Preview
    nameContainer: {
        flexDirection: "row",
        marginTop: style.defaultMmd,
        ...style.allCenter,
    },
    textContainer: {
        marginTop: style.defaultMmd,
    },

    statsContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        flexWrap: "wrap",
    },
    statElementContainer: {
        flexDirection: "column",
    },
    //#endregion

    imageOutlineContainer: {
        borderRadius: 25,
        aspectRatio: 1,
        alignSelf: "center",
        zIndex: 3,
        borderColor: style.colors.blue,
        // width: 152 * 2,
        // height: 152 * 2,
    },
    imageContainer: {
        width: "100%",
        borderRadius: 15,
    },
    image: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 25,
    },
    imageBorder: {
        borderRadius: 15,
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

    memberContainer: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        marginTop: style.defaultMmd,
    },

    button: {
        marginVertical: style.defaultMlg,
    },
});
