import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    Pressable,
    Alert,
    ScrollView,
    Image,
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

import SVG_Post from "../../assets/svg/Post";
import SVG_Pencil from "../../assets/svg/Pencil";

const userUploadMetadata = {
    contentType: "image/jpeg",
};

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

    const setAlert = error => {
        Alert.alert("Zmylk w přizjewjenju", error, [
            {
                text: "Ok",
                isPreferred: true,
                style: "cancel",
            },
        ]);
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
                sendEmailVerification(userCredential.user).catch(error =>
                    console.log(
                        "error auth/Register.jsx",
                        "register() sendEmailVerification",
                        error.code
                    )
                );

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
                                        follower: [],
                                        following: [],
                                        posts: [],
                                        events: [],
                                        isMod: false,
                                        isBanned: false,
                                        isBuisness: false,
                                        isAdmin: false,
                                    }
                                ).catch(error =>
                                    console.log(
                                        "error auth/Register.jsx",
                                        "register() set user",
                                        error.code
                                    )
                                );
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
            .catch(error =>
                console.log(
                    "error auth/Register.jsx",
                    "register() createUserWithEmailAndPassword",
                    error.code
                )
            );
    };

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

        setRegisterData({
            ...registerData,
            pbUri: croppedPicker.uri,
        });
        setPbImageUri(pickerResult.assets[0].uri);
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
                    snapToEnd
                    style={[style.container, style.pH, style.oVisible]}>
                    <View style={styles.titleContainer}>
                        <Text style={[style.Ttitle, style.tWhite]}>
                            Wutwor sej nowy konto:
                        </Text>
                        <Text
                            style={[
                                style.tWhite,
                                style.Tmd,
                                { marginTop: style.defaultMmd },
                            ]}>
                            Předźał kroki, zo bych swójski konto wutrowił a
                            tutón hnydom personalizował.
                        </Text>
                    </View>

                    <View
                        style={[style.line, { marginTop: style.defaultMlg }]}
                    />

                    <View style={styles.sectionContainer}>
                        <Text style={[style.Ttitle, style.tWhite]}>
                            Witaj pola{" "}
                            <Text style={style.tBlue}>kostrjanc</Text>!
                        </Text>

                        <Text
                            style={[
                                style.tWhite,
                                style.Tmd,
                                { marginTop: style.defaultMmd },
                            ]}>
                            Wupytaj sej wužiwarske mjeno, tute njedyrbi twoje
                            prawe mjeno być. Z tutym dyrbja přećeljo tebje zaso
                            namakać móc.
                        </Text>

                        {/* Name input */}
                        <View
                            style={[style.pH, { marginTop: style.defaultMmd }]}>
                            <InputField
                                editable={currentRegisterState === 0}
                                placeholder="Wužiwarske mjeno"
                                keyboardType="default"
                                textContentType="username"
                                icon={<SVG_Pencil fill={style.colors.sec} />}
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
                            <Text style={[style.Ttitle, style.tWhite]}>
                                Hallo{" "}
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
                                Wuzwol sej profilny wobraz. Tutón a twoje mjeno
                                stej markantej symbolaj twojeho profila.
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
                                                Tłoć, zo wobrazy přepytać móžeš
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
                                Nětko dodaj hišće por informacijow wo tebi, zo
                                tež wužiwarjo, kiž će hišće njeznaja, kusk
                                zarjadować móža.
                            </Text>

                            <View
                                style={[
                                    style.pH,
                                    { marginTop: style.defaultMmd },
                                ]}>
                                <TextField
                                    editable={currentRegisterState === 2}
                                    placeholder="Dodaj informacije..."
                                    onChangeText={val => {
                                        setRegisterData({
                                            ...registerData,
                                            description: val,
                                        });
                                    }}
                                />
                            </View>
                        </View>
                    ) : null}

                    {currentRegisterState >= 3 ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.Tmd, style.tWhite]}>
                                Zo móžeš so z kontom wšudźe přizjewić dodaj
                                přizjewjenske informacije.
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
                                        Email zapodać:
                                    </Text>
                                    <InputField
                                        editable={currentRegisterState === 3}
                                        placeholder="Email"
                                        keyboardType="email-address"
                                        autoComplete="email"
                                        textContentType="email"
                                        icon={
                                            <Text
                                                style={[style.tSec, style.Tmd]}>
                                                @
                                            </Text>
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
                                        Hesło zapodać:
                                    </Text>
                                    <InputField
                                        editable={currentRegisterState === 3}
                                        placeholder="Hesło"
                                        keyboardType="default"
                                        textContentType="newPassword"
                                        secureTextEntry
                                        passwordRules={
                                            "minlength: 8; required: lower; required: upper; required: digit; required: special;"
                                        }
                                        icon={
                                            <SVG_Pencil
                                                fill={style.colors.sec}
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
                                        Hesło wospjetować:
                                    </Text>
                                    <InputField
                                        editable={currentRegisterState === 3}
                                        placeholder="Hesło"
                                        keyboardType="default"
                                        textContentType="newPassword"
                                        secureTextEntry
                                        icon={
                                            <SVG_Pencil
                                                fill={style.colors.sec}
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
                                Na kóncu prosymy tebje naše powšitkowne
                                wobchodne wuměnjenja a regule za wužiwanje wot
                                kostrjanc sej přečitać a akceptować.
                            </Text>

                            <View
                                style={[
                                    style.pH,
                                    { marginTop: style.defaultMmd },
                                ]}>
                                <View
                                    style={[styles.agbContainer, style.border]}>
                                    <ScrollView style={[style.Psm]}>
                                        <Text
                                            style={[style.tWhite, style.TsmRg]}>
                                            Eiusmod labore laborum fugiat esse
                                            proident eu aute anim eiusmod anim
                                            minim nulla. Reprehenderit
                                            reprehenderit sint veniam irure ea
                                            culpa minim mollit reprehenderit
                                            aute. Pariatur non eiusmod
                                            exercitation dolore anim proident
                                            nostrud aliqua. Laboris nisi
                                            voluptate id labore anim
                                            exercitation laboris laboris nulla.
                                            Labore velit magna voluptate do ut
                                            cillum consequat consectetur duis.
                                            Eiusmod labore laborum fugiat esse
                                            proident eu aute anim eiusmod anim
                                            minim nulla. Reprehenderit
                                            reprehenderit sint veniam irure ea
                                            culpa minim mollit reprehenderit
                                            aute. Pariatur non eiusmod
                                            exercitation dolore anim proident
                                            nostrud aliqua. Laboris nisi
                                            voluptate id labore anim
                                            exercitation laboris laboris nulla.
                                            Labore velit magna voluptate do ut
                                            cillum consequat consectetur duis.
                                            Eiusmod labore laborum fugiat esse
                                            proident eu aute anim eiusmod anim
                                            minim nulla. Reprehenderit
                                            reprehenderit sint veniam irure ea
                                            culpa minim mollit reprehenderit
                                            aute. Pariatur non eiusmod
                                            exercitation dolore anim proident
                                            nostrud aliqua. Laboris nisi
                                            voluptate id labore anim
                                            exercitation laboris laboris nulla.
                                            Labore velit magna voluptate do ut
                                            cillum consequat consectetur duis.
                                            Eiusmod labore laborum fugiat esse
                                            proident eu aute anim eiusmod anim
                                            minim nulla. Reprehenderit
                                            reprehenderit sint veniam irure ea
                                            culpa minim mollit reprehenderit
                                            aute. Pariatur non eiusmod
                                            exercitation dolore anim proident
                                            nostrud aliqua. Laboris nisi
                                            voluptate id labore anim
                                            exercitation laboris laboris nulla.
                                            Labore velit magna voluptate do ut
                                            cillum consequat consectetur duis.
                                            Eiusmod labore laborum fugiat esse
                                            proident eu aute anim eiusmod anim
                                            minim nulla. Reprehenderit
                                            reprehenderit sint veniam irure ea
                                            culpa minim mollit reprehenderit
                                            aute. Pariatur non eiusmod
                                            exercitation dolore anim proident
                                            nostrud aliqua. Laboris nisi
                                            voluptate id labore anim
                                            exercitation laboris laboris nulla.
                                            Labore velit magna voluptate do ut
                                            cillum consequat consectetur duis.
                                            Eiusmod labore laborum fugiat esse
                                            proident eu aute anim eiusmod anim
                                            minim nulla. Reprehenderit
                                            reprehenderit sint veniam irure ea
                                            culpa minim mollit reprehenderit
                                            aute. Pariatur non eiusmod
                                            exercitation dolore anim proident
                                            nostrud aliqua. Laboris nisi
                                            voluptate id labore anim
                                            exercitation laboris laboris nulla.
                                            Labore velit magna voluptate do ut
                                            cillum consequat consectetur duis.
                                        </Text>
                                    </ScrollView>
                                </View>
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
                                        Ja akceptuju powšitkowne wobchodne
                                        wuměnjenja a regule za wužiwanje wot
                                        kostrjanc.
                                    </Text>
                                </View>

                                {registerData.agbChecked ? (
                                    <View style={styles.sectionContainer}>
                                        <Text
                                            style={[style.TlgRg, style.tWhite]}>
                                            Sy přezjedny ze swojimi
                                            zastajenjemi?
                                            {"\n"}
                                            Potom wozwjeł tute a přistup do
                                            kostrjanc!
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
                                }
                            }}
                            checked={buttonChecked}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
