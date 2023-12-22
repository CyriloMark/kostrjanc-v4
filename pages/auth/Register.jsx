import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    Pressable,
    Alert,
    ScrollView,
    Image,
    Platform,
    KeyboardAvoidingView,
} from "react-native";

import * as style from "../../styles";

import {
    getAuth,
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import * as Storage from "firebase/storage";

import { getAuthErrorMsg } from "../../constants/error/auth";
import { getLangs } from "../../constants/langs";
import { openLink } from "../../constants";
import makeRequest from "../../constants/request";
import checkForAutoCorrectInside, {
    getCursorPosition,
} from "../../constants/content/autoCorrect";

import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import {
    launchImageLibraryAsync,
    requestMediaLibraryPermissionsAsync,
    MediaTypeOptions,
} from "expo-image-picker";

import BackHeader from "../../components/BackHeader";
import InputField from "../../components/InputField";
import TextField from "../../components/TextField";
import EnterButton from "../../components/auth/EnterButton";
import Check from "../../components/Check";
import AccessoryView from "../../components/AccessoryView";
import OptionButton from "../../components/OptionButton";

import SVG_Post from "../../assets/svg/Post";
import SVG_Pencil from "../../assets/svg/Pencil";
import SVG_Email from "../../assets/svg/Email";
import SVG_Web from "../../assets/svg/Web";

const userUploadMetadata = {
    contentType: "image/jpeg",
};
let cursorPos = -1;

export default function Register({ navigation }) {
    const savePasswordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        description: "",
        pbUri: null,
        agbChecked: false,
    });
    const [buttonChecked, setButtonChecked] = useState(false);
    const [currentRegisterState, setCurrentRegisterState] = useState(0);
    const [pbImageUri, setPbImageUri] = useState(null);

    const [registering, setRegistering] = useState(false);

    const [autoCorrect, setAutoCorrect] = useState({
        status: 100,
        content: [],
    });

    useEffect(() => {
        cursorPos = -1;
    }, []);

    const setAlert = error => {
        Alert.alert(
            getLangs("auth_register_errorregister"),
            getAuthErrorMsg(error),
            [
                {
                    text: "Ok",
                    isPreferred: true,
                    style: "cancel",
                },
            ]
        );
    };

    useEffect(() => {
        checkButton();
    }, [registerData]);

    let checkButton = () => {
        let inputValid = false;
        switch (currentRegisterState) {
            case 0:
                if (
                    registerData.name.length > 2 &&
                    registerData.name.length <= 32
                )
                    inputValid = true;
                break;
            case 1:
                if (registerData.pbUri) inputValid = true;
                break;
            case 2:
                if (
                    registerData.description.length > 0 &&
                    registerData.description.length <= 512
                )
                    inputValid = true;
                break;
            case 3:
                if (
                    registerData.email.match(emailRegex) &&
                    registerData.password === registerData.passwordConfirm &&
                    registerData.password.match(savePasswordRegex)
                )
                    inputValid = true;
                break;
            case 4:
                if (registerData.agbChecked) inputValid = true;
                break;
        }

        if (inputValid) setButtonChecked(true);
        else setButtonChecked(false);
    };

    const register = async () => {
        setButtonChecked(false);
        setRegistering(true);

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError("Network request failed!"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", registerData.pbUri, true);
            xhr.send(null);
        });

        const auth = getAuth();
        const storage = Storage.getStorage();
        const db = getDatabase();
        createUserWithEmailAndPassword(
            auth,
            registerData.email,
            registerData.password
        )
            .then(userCredential => {
                sendEmailVerification(userCredential.user).catch(error => {
                    setAlert(error.code);
                    console.log(
                        "error auth/Register.jsx",
                        "register() sendEmailVerification",
                        error.code
                    );
                });

                const pbImgRef = Storage.ref(
                    storage,
                    `profile_pics/${userCredential.user.uid}`
                );

                Storage.uploadBytes(pbImgRef, blob, userUploadMetadata)
                    .finally(() => {
                        Storage.getDownloadURL(pbImgRef)
                            .then(url => {
                                set(
                                    ref(db, `users/${userCredential.user.uid}`),
                                    {
                                        name: registerData.name,
                                        description: registerData.description,
                                        pbUri: url,
                                        follower: [
                                            "Co2jZnyLZaf04HihTPtrzDNzaBG2",
                                        ],
                                        following: [],
                                        posts: [],
                                        events: [],
                                        isMod: false,
                                        isBanned: false,
                                        isAdmin: false,
                                    }
                                )
                                    .catch(error =>
                                        console.log(
                                            "error auth/Register.jsx",
                                            "register() set user",
                                            error.code
                                        )
                                    )
                                    .then(() => {
                                        makeRequest("/user/add_to_index", {});
                                    });
                            })
                            .catch(error =>
                                console.log(
                                    "error auth/Register.jsx",
                                    "register() Storage.getDownloadURL",
                                    error.code
                                )
                            );
                    })
                    .catch(error =>
                        console.log(
                            "error auth/Register.jsx",
                            "register() Storage.uploadBytes",
                            error.code
                        )
                    );
            })
            .catch(error => {
                setAlert(error.code);
                console.log(
                    "error auth/Register.jsx",
                    "register() createUserWithEmailAndPassword",
                    error.code
                );
            });
    };

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

        setRegisterData({
            ...registerData,
            pbUri: croppedPicker.uri,
        });
        setPbImageUri(pickerResult.assets[0].uri);
    };

    const setUnfullfilledAlert = () => {
        let missing = "";

        switch (currentRegisterState) {
            case 0:
                missing += `\n${getLangs("missing_name")} [3 - 32]`;
                break;
            case 1:
                missing += `\n${getLangs("missing_pbimg")}`;
                break;
            case 2:
                missing += `\n${getLangs("missing_description")}`;
                break;
            case 3:
                if (!registerData.email.match(emailRegex))
                    missing += `\n${getLangs("missing_email")}`;
                if (!registerData.password.match(savePasswordRegex))
                    missing += `\n${getLangs("missing_goodpassword")}`;
                if (registerData.password !== registerData.passwordConfirm)
                    missing += `\n${getLangs("missing_equalpassword")}`;
                break;
            case 4:
                missing += `\n${getLangs("missing_agb")}`;
                break;
        }

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
                <BackHeader
                    onBack={() => navigation.goBack()}
                    showReload={false}
                />

                <ScrollView
                    scrollEnabled
                    automaticallyAdjustKeyboardInsets
                    keyboardDismissMode="interactive"
                    automaticallyAdjustContentInsets
                    snapToAlignment="center"
                    keyboardShouldPersistTaps="handled"
                    snapToEnd
                    style={[style.container, style.pH, style.oVisible]}>
                    <View style={styles.titleContainer}>
                        <Text style={[style.Ttitle2, style.tWhite]}>
                            {getLangs("auth_register_title")}
                        </Text>
                        <Text
                            style={[
                                style.tWhite,
                                style.Tmd,
                                { marginTop: style.defaultMmd },
                            ]}>
                            {getLangs("auth_register_0_intro")}
                        </Text>
                    </View>

                    <View
                        style={[style.line, { marginTop: style.defaultMlg }]}
                    />

                    <View style={styles.sectionContainer}>
                        <Text style={[style.Ttitle2, style.tWhite]}>
                            {getLangs("auth_register_0_welcome")}{" "}
                            <Text style={style.tBlue}>kostrjanc</Text>!
                        </Text>

                        <Text
                            style={[
                                style.tWhite,
                                style.Tmd,
                                { marginTop: style.defaultMmd },
                            ]}>
                            {getLangs("auth_register_0_usernametext")}
                        </Text>

                        {/* Name input */}
                        <View
                            style={[style.pH, { marginTop: style.defaultMmd }]}>
                            <InputField
                                editable={currentRegisterState === 0}
                                placeholder={getLangs(
                                    "input_placeholder_username"
                                )}
                                maxLength={32}
                                keyboardType="default"
                                value={registerData.name}
                                inputAccessoryViewID="register_name_InputAccessoryViewID"
                                textContentType="username"
                                icon={<SVG_Pencil fill={style.colors.blue} />}
                                onChangeText={val => {
                                    setRegisterData(data => {
                                        return {
                                            ...data,
                                            name: val,
                                        };
                                    });
                                }}
                            />
                        </View>
                    </View>

                    {currentRegisterState >= 1 ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.Ttitle2, style.tWhite]}>
                                {getLangs("auth_register_1_intro")}{" "}
                                <Text style={style.tBlue}>
                                    {registerData.name}
                                </Text>
                                !
                            </Text>
                            <Text
                                style={[
                                    style.Tmd,
                                    style.tWhite,
                                    { marginTop: style.defaultMmd },
                                ]}>
                                {getLangs("auth_register_1_pbtext")}
                            </Text>
                            <Pressable
                                onPress={() => {
                                    if (currentRegisterState === 1)
                                        openImagePickerAsync();
                                }}
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
                                                {getLangs(
                                                    "auth_register_1_pbhint"
                                                )}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </Pressable>
                        </View>
                    ) : null}

                    {currentRegisterState >= 2 ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.Tmd, style.tWhite]}>
                                {getLangs("auth_register_2_descriptiontext")}
                            </Text>

                            <View
                                style={[
                                    style.pH,
                                    { marginTop: style.defaultMmd },
                                ]}>
                                <TextField
                                    editable={currentRegisterState === 2}
                                    placeholder={getLangs(
                                        "input_placeholder_description"
                                    )}
                                    maxLength={512}
                                    value={registerData.description}
                                    inputAccessoryViewID="register_description_InputAccessoryViewID"
                                    supportsAutoCorrect
                                    onSelectionChange={async e => {
                                        cursorPos =
                                            e.nativeEvent.selection.start;

                                        const autoC =
                                            await checkForAutoCorrectInside(
                                                registerData.description,
                                                cursorPos
                                            );
                                        setAutoCorrect(autoC);
                                    }}
                                    onChangeText={async val => {
                                        // Check Selection
                                        cursorPos = getCursorPosition(
                                            registerData.description,
                                            val
                                        );

                                        // Add Input to Post Data -> Changes Desc
                                        setRegisterData({
                                            ...registerData,
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
                                        setRegisterData(prev => {
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
                    ) : null}

                    {currentRegisterState >= 3 ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.Tmd, style.tWhite]}>
                                {getLangs("auth_register_3_accounttext")}
                            </Text>
                            <View
                                style={[
                                    style.pH,
                                    { marginTop: style.defaultMmd },
                                ]}>
                                {/* Email */}
                                <View>
                                    <Text
                                        style={[
                                            style.Tmd,
                                            style.tWhite,
                                            { marginBottom: style.defaultMsm },
                                        ]}>
                                        {getLangs("input_entertitle_email")}
                                    </Text>
                                    <InputField
                                        editable={currentRegisterState === 3}
                                        placeholder={getLangs(
                                            "input_placeholder_email"
                                        )}
                                        maxLength={128}
                                        keyboardType="email-address"
                                        autoComplete="email"
                                        autoCapitalize="none"
                                        textContentType="emailAddress"
                                        icon={
                                            <SVG_Email
                                                fill={style.colors.blue}
                                            />
                                        }
                                        onChangeText={val => {
                                            setRegisterData({
                                                ...registerData,
                                                email: val,
                                            });
                                        }}
                                    />
                                </View>

                                {/* PW */}
                                <View style={{ marginTop: style.defaultMmd }}>
                                    <Text
                                        style={[
                                            style.Tmd,
                                            style.tWhite,
                                            { marginBottom: style.defaultMsm },
                                        ]}>
                                        {getLangs("input_entertitle_password")}
                                    </Text>
                                    <InputField
                                        editable={currentRegisterState === 3}
                                        placeholder={getLangs(
                                            "input_placeholder_password"
                                        )}
                                        maxLength={128}
                                        keyboardType="default"
                                        textContentType="newPassword"
                                        autoCapitalize="none"
                                        secureTextEntry
                                        passwordRules={
                                            "minlength: 8; required: lower; required: upper; required: digit; required: special;"
                                        }
                                        icon={
                                            <SVG_Pencil
                                                fill={style.colors.blue}
                                            />
                                        }
                                        onChangeText={val => {
                                            setRegisterData({
                                                ...registerData,
                                                password: val,
                                            });
                                        }}
                                    />
                                </View>
                                {/* PW Confirm */}
                                <View style={{ marginTop: style.defaultMmd }}>
                                    <Text
                                        style={[
                                            style.Tmd,
                                            style.tWhite,
                                            { marginBottom: style.defaultMsm },
                                        ]}>
                                        {getLangs(
                                            "input_entertitle_passwordconfirm"
                                        )}
                                    </Text>
                                    <InputField
                                        editable={currentRegisterState === 3}
                                        placeholder={getLangs(
                                            "input_placeholder_password"
                                        )}
                                        maxLength={128}
                                        keyboardType="default"
                                        autoCapitalize="none"
                                        textContentType="newPassword"
                                        secureTextEntry
                                        icon={
                                            <SVG_Pencil
                                                fill={style.colors.blue}
                                            />
                                        }
                                        onChangeText={val => {
                                            setRegisterData({
                                                ...registerData,
                                                passwordConfirm: val,
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    ) : null}

                    {currentRegisterState >= 4 ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.Tmd, style.tWhite]}>
                                {getLangs("auth_register_4_agbtext")}
                            </Text>

                            <View
                                style={[
                                    style.pH,
                                    { marginTop: style.defaultMmd },
                                ]}>
                                <OptionButton
                                    icon={<SVG_Web fill={style.colors.red} />}
                                    red
                                    style={{ marginVertical: style.defaultMlg }}
                                    title={
                                        "Naše powšitkowne wobchodne wuměnjenja"
                                    }
                                    onPress={() =>
                                        openLink(
                                            "https://firebasestorage.googleapis.com/v0/b/kostrjanc.appspot.com/o/Pow%C5%A1itkowne%20Wobchodne%20Wum%C4%9Bnjenja%20kostrjanc.pdf?alt=media&token=da26f289-a03b-4c02-a2bb-e03184932b75"
                                        )
                                    }
                                />
                                <View style={styles.checkContainer}>
                                    <Check
                                        color={1}
                                        checked={registerData.agbChecked}
                                        onPress={() => {
                                            if (currentRegisterState === 4)
                                                setRegisterData(prev => {
                                                    return {
                                                        ...prev,
                                                        agbChecked:
                                                            !prev.agbChecked,
                                                    };
                                                });
                                        }}
                                    />
                                    <Text
                                        style={[
                                            style.tWhite,
                                            style.Tmd,
                                            style.pH,
                                        ]}>
                                        {getLangs("auth_register_4_agbcheck")}
                                    </Text>
                                </View>

                                {registerData.agbChecked ? (
                                    <View style={styles.sectionContainer}>
                                        <Text
                                            style={[style.TlgRg, style.tWhite]}>
                                            {getLangs(
                                                "auth_register_4_checksettingstext"
                                            )}
                                            {"\n"}
                                            {getLangs(
                                                "auth_register_4_publishtext"
                                            )}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                        </View>
                    ) : null}

                    {/* Button */}
                    <View style={[style.allCenter, styles.button]}>
                        <EnterButton
                            onPress={() => {
                                if (buttonChecked) {
                                    if (
                                        currentRegisterState === 4 &&
                                        !registering
                                    ) {
                                        register();
                                    } else if (currentRegisterState < 4) {
                                        setButtonChecked(false);
                                        setCurrentRegisterState(val => {
                                            return val + 1;
                                        });
                                    }
                                } else setUnfullfilledAlert();
                            }}
                            checked={buttonChecked}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Name */}
            <AccessoryView
                onElementPress={l =>
                    setRegisterData(prev => {
                        return {
                            ...prev,
                            name: prev.name + l,
                        };
                    })
                }
                nativeID={"register_name_InputAccessoryViewID"}
            />
            {/* Description */}
            <AccessoryView
                onElementPress={l =>
                    setRegisterData(prev => {
                        return {
                            ...prev,
                            description: prev.description + l,
                        };
                    })
                }
                nativeID={"register_description_InputAccessoryViewID"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "column",
        width: "100%",
        zIndex: 1,
    },
    inputContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
        zIndex: 10,
    },
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
        marginTop: style.defaultMlg,
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

    agbContainer: {
        width: "100%",
        aspectRatio: 1,
        alignSelf: "center",
        borderRadius: 10,
        borderColor: style.colors.sec,
    },
    checkContainer: {
        width: "100%",
        marginTop: style.defaultMmd,
        flexDirection: "row",
        alignItems: "center",
    },
});
