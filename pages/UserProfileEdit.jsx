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
} from "react-native";

import * as style from "../styles";

import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import {
    launchImageLibraryAsync,
    requestMediaLibraryPermissionsAsync,
    MediaTypeOptions,
} from "expo-image-picker";

import { getAuth } from "firebase/auth";
import { getDatabase, ref, child, get, set } from "firebase/database";
import * as Storage from "firebase/storage";

import BackHeader from "../components/BackHeader";
import EditProfileButton from "../components/profile/EditProfileButton";
import InputField from "../components/InputField";
import TextField from "../components/TextField";

import SVG_Post from "../assets/svg/Post";
import { getData } from "../constants/storage";

const userUploadMetadata = {
    contentType: "image/jpeg",
};

export default function UserProfileEdit({ navigation, route }) {
    const { userData } = route.params;

    const [updatedUserData, setUpdatedUserData] = useState(userData);
    const [buttonChecked, setButtonChecked] = useState(false);
    const [pbImageUri, setPbImageUri] = useState(userData.pbUri);

    let pbChanged = false;

    // IMG Load + Compress
    const openImagePickerAsync = async () => {
        let permissionResult = await requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) return;

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
        setPbImageUri(pickerResult.assets[0].uri);
    };

    const checkButton = () => {
        let inputValid = false;
        if (updatedUserData.description != userData.description)
            inputValid = true;

        if (
            !(
                updatedUserData.description.length > 0 &&
                updatedUserData.description.length <= 512
            )
        )
            inputValid = false;
        if (!pbImageUri) inputValid = false;

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
                                    set(ref(db, `users/${uid}/pbUri`), url)
                                        .finally(() => {
                                            if (processDone[1])
                                                navigation.goBack();
                                            else processDone[0] = true;
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
        set(ref(db, `users/${uid}/description`), updatedUserData.description)
            .finally(() => {
                if (!pbChanged) navigation.goBack();
                else if (processDone[0]) navigation.goBack();
                else processDone[1] = true;
            })
            .catch(error =>
                console.log(
                    "error pages/UserProfileEdit",
                    "overrideUserData set description",
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
                        title={`Wobdźěłać: ${userData.name}`}
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
                    snapToEnd
                    style={[style.container, style.pH, style.oVisible]}>
                    {/* Name */}
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            Moje mjeno:
                        </Text>
                        <Text style={[style.tBlue, style.Ttitle]}>
                            {userData.name}
                        </Text>
                        <Text
                            style={[
                                style.tWhite,
                                style.TsmRg,
                                { marginTop: style.defaultMsm },
                            ]}>
                            Mjeno njeda so změnić, jenož na priwatne
                            naprašowanje.
                        </Text>
                    </View>

                    {/* PB Image */}
                    <View style={[styles.sectionContainer]}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            Profilny wobraz:
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
                                            Tłoć, zo wobrazy přepytać móžeš
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </Pressable>
                    </View>
                    {/* Description */}
                    <View style={[styles.sectionContainer]}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            Wopisowanje konta:
                        </Text>
                        <View
                            style={[style.pH, { marginTop: style.defaultMmd }]}>
                            <TextField
                                placeholder="Dodaj informacije..."
                                defaultValue={userData.description}
                                onChangeText={val => {
                                    setUpdatedUserData({
                                        ...updatedUserData,
                                        description: val,
                                    });
                                }}
                            />
                        </View>
                    </View>

                    <View style={[style.allCenter, styles.button]}>
                        <EditProfileButton
                            title={"Składować"}
                            checked={buttonChecked}
                            onPress={overrideUserData}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
