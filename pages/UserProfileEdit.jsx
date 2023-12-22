import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    Text,
    KeyboardAvoidingView,
    Platform,
    Image,
    Alert,
} from "react-native";

import * as style from "../styles";

import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import {
    launchImageLibraryAsync,
    requestMediaLibraryPermissionsAsync,
    MediaTypeOptions,
} from "expo-image-picker";

import { getAuth } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import * as Storage from "firebase/storage";

import BackHeader from "../components/BackHeader";
import EditProfileButton from "../components/profile/EditProfileButton";
import TextField from "../components/TextField";
import AccessoryView from "../components/AccessoryView";

import { storeData } from "../constants/storage";
import { getLangs } from "../constants/langs";
import makeRequest from "../constants/request";
import checkForAutoCorrectInside, {
    getCursorPosition,
} from "../constants/content/autoCorrect";

import SVG_Post from "../assets/svg/Post";

const userUploadMetadata = {
    contentType: "image/jpeg",
};

let pbChanged = false;
let cursorPos = -1;
export default function UserProfileEdit({ navigation, route }) {
    const { userData } = route.params;

    const [updatedUserData, setUpdatedUserData] = useState(userData);
    const [buttonChecked, setButtonChecked] = useState(false);
    const [pbImageUri, setPbImageUri] = useState(userData.pbUri);

    const [autoCorrect, setAutoCorrect] = useState({
        status: 100,
        content: [],
    });

    useEffect(() => {
        cursorPos = -1;
    }, []);

    // IMG Load + Compress
    const openImagePickerAsync = async () => {
        // let permissionResult = await requestMediaLibraryPermissionsAsync();
        // if (!permissionResult.granted) {
        //     Alert.alert(
        //         "kostrjanc njesmě na galeriju přistupić.",
        //         `Status: ${permissionResult.status}`,
        //         [
        //             {
        //                 text: "Ok",
        //                 isPreferred: true,
        //                 style: "cancel",
        //             },
        //         ]
        //     );
        //     return;
        // }

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
                        width: 256,
                        height: 256,
                    },
                },
            ],
            {
                compress: 0.5,
                format: SaveFormat.JPEG,
            }
        );

        pbChanged = true;
        setButtonChecked(true);
        setPbImageUri(croppedPicker.uri);
    };

    const checkButton = () => {
        let inputValid = false;
        if (updatedUserData.description != userData.description)
            inputValid = true;
        if (pbChanged) inputValid = true;
        if (
            !(
                updatedUserData.description.length > 0 &&
                updatedUserData.description.length <= 512
            )
        )
            inputValid = false;

        setButtonChecked(inputValid);
    };

    useEffect(() => {
        checkButton();
    }, [updatedUserData]);

    const overrideUserData = async () => {
        if (!buttonChecked) return;
        setButtonChecked(false);
        const storage = Storage.getStorage();
        const db = getDatabase();
        let uid = getAuth().currentUser.uid;

        let processDone = [false, false];
        let newUserData = updatedUserData;

        if (pbChanged) {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function () {
                    reject(new TypeError("Network request failed!"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", pbImageUri, true);
                xhr.send(null);
            });

            const pbRef = Storage.ref(storage, `profile_pics/${uid}`);

            Storage.deleteObject(pbRef)
                .then(() => {
                    Storage.uploadBytes(pbRef, blob, userUploadMetadata)
                        .then(() => {
                            Storage.getDownloadURL(pbRef)
                                .then(url => {
                                    newUserData.pbUri = url;
                                    set(ref(db, `users/${uid}/pbUri`), url)
                                        .finally(() => {
                                            if (processDone[1]) {
                                                storeData(
                                                    "userData",
                                                    newUserData
                                                );
                                                navigation.goBack();
                                            } else processDone[0] = true;
                                        })
                                        .catch(error =>
                                            console.log(
                                                "error pages/UserProfileEdit",
                                                "overrideUserData set pb",
                                                error.code
                                            )
                                        );
                                })
                                .catch(error =>
                                    console.log(
                                        "error pages/UserProfileEdit",
                                        "overrideUserData Storage.getDownloadUrl",
                                        error.code
                                    )
                                );
                        })
                        .catch(error =>
                            console.log(
                                "error pages/UserProfileEdit",
                                "overrideUserData Storage.uploadBytes",
                                error.code
                            )
                        );
                })
                .catch(error =>
                    console.log(
                        "error pages/UserProfileEdit",
                        "overrideUserData Storage.deleteObject",
                        error.code
                    )
                );
        }
        if (userData.description !== updatedUserData.description) {
            set(
                ref(db, `users/${uid}/description`),
                updatedUserData.description
            )
                .finally(() => {
                    if (pbChanged && !processDone[0]) {
                        processDone[1] = true;
                    } else {
                        makeRequest("/user/add_to_index", {});
                        console.log(newUserData);
                        storeData("userData", newUserData);
                        navigation.goBack();
                    }
                })
                .catch(error =>
                    console.log(
                        "error pages/UserProfileEdit",
                        "overrideUserData set description",
                        error.code
                    )
                );
        }
    };

    const setUnfullfilledAlert = () => {
        let missing = "";
        if (updatedUserData.description == userData.description)
            missing += `\n${getLangs("missing_equaldata")}`;
        if (
            !(
                updatedUserData.description.length > 0 &&
                updatedUserData.description.length <= 512
            )
        )
            missing += `\n${getLangs("missing_description")}`;

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

    return (
        <View style={[style.container, style.bgBlack]}>
            <KeyboardAvoidingView
                style={style.allMax}
                behavior={Platform.OS === "ios" ? "padding" : "height"}>
                {/* Header */}
                <Pressable style={{ zIndex: 10 }}>
                    <BackHeader
                        title={`${getLangs("editprofile_headeredit")} ${
                            userData.name
                        }`}
                        onBack={() => navigation.goBack()}
                        showReload={false}
                    />
                </Pressable>

                <ScrollView
                    scrollEnabled
                    automaticallyAdjustKeyboardInsets
                    keyboardDismissMode="interactive"
                    automaticallyAdjustContentInsets
                    snapToAlignment="center"
                    keyboardShouldPersistTaps="handled"
                    snapToEnd
                    style={[style.container, style.pH, style.oVisible]}>
                    {/* Name */}
                    <View
                        style={{
                            width: "100%",
                            flex: 1,
                            flexDirection: "column",
                        }}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("editprofile_myname")}
                        </Text>
                        <Text style={[style.tBlue, style.Ttitle2]}>
                            {userData.name}
                        </Text>
                        <Text
                            style={[
                                style.tWhite,
                                style.TsmRg,
                                { marginTop: style.defaultMsm },
                            ]}>
                            {getLangs("editprofile_namehint")}
                        </Text>
                    </View>

                    {/* PB Image */}
                    <View style={[styles.sectionContainer]}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("editprofile_pbtitle")}
                        </Text>
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
                                {pbImageUri !== null ? (
                                    <Image
                                        source={{ uri: pbImageUri }}
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
                                            {getLangs("editprofile_pbhint")}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </Pressable>
                    </View>
                    {/* Description */}
                    <View style={[styles.sectionContainer]}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("editprofile_descriptiontitle")}
                        </Text>
                        <View
                            style={[style.pH, { marginTop: style.defaultMmd }]}>
                            <TextField
                                placeholder={getLangs(
                                    "input_placeholder_description"
                                )}
                                defaultValue={userData.description}
                                value={updatedUserData.description}
                                inputAccessoryViewID="userprofileedit_Description_InputAccessoryViewID"
                                supportsAutoCorrect
                                onSelectionChange={async e => {
                                    cursorPos = e.nativeEvent.selection.start;

                                    const autoC =
                                        await checkForAutoCorrectInside(
                                            updatedUserData.description,
                                            cursorPos
                                        );
                                    setAutoCorrect(autoC);
                                }}
                                onChangeText={async val => {
                                    // Check Selection
                                    cursorPos = getCursorPosition(
                                        updatedUserData.description,
                                        val
                                    );

                                    // Add Input to Post Data -> Changes Desc
                                    setUpdatedUserData({
                                        ...updatedUserData,
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
                                    setUpdatedUserData(prev => {
                                        let desc = prev.description.split(" ");
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
                                                i == desc.length - 1 ? "" : " "
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

                    <View style={[style.allCenter, styles.button]}>
                        <EditProfileButton
                            title={getLangs("editprofile_save")}
                            checked={buttonChecked}
                            onPress={() => {
                                if (buttonChecked) overrideUserData();
                                else setUnfullfilledAlert();
                            }}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Description */}
            <AccessoryView
                onElementPress={l => {
                    setUpdatedUserData(prev => {
                        return {
                            ...prev,
                            description: prev.description + l,
                        };
                    });
                }}
                nativeID={"userprofileedit_Description_InputAccessoryViewID"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
        flexDirection: "column",
    },
    button: {
        marginVertical: style.defaultMlg,
    },

    imageOutlineContainer: {
        width: "80%",
        borderRadius: 500,
        aspectRatio: 1,
        marginTop: style.defaultMmd,
        alignSelf: "center",
        zIndex: 3,
        borderColor: style.colors.blue,
    },
    imageContainer: {
        width: "100%",
        borderRadius: 10,
    },
    image: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 500,
    },
    imageBorder: {
        borderRadius: 500,
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
});
