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

import { Event_Placeholder } from "../../constants/content/PlaceholderData";
import { getData } from "../../constants/storage";
import { arraySplitter, splitArrayIntoNEqualy } from "../../constants";
import { initialRegion } from "../../constants/event";
import {
    convertTextIntoTimestamp,
    convertTimestampToString,
} from "../../constants/time";
import { Event_Types, mapTypes, Event_Tags } from "../../constants/event";

import SVG_Pencil from "../../assets/svg/Pencil";
import SVG_Post from "../../assets/svg/Post";
import SVG_Flag from "../../assets/svg/Flag";
import SVG_Recent from "../../assets/svg/Search";
import SVG_Cash from "../../assets/svg/Cash";
import SVG_Web from "../../assets/svg/Web";

import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import {
    launchImageLibraryAsync,
    requestMediaLibraryPermissionsAsync,
    MediaTypeOptions,
    UIImagePickerPresentationStyle,
} from "expo-image-picker";

import MapView, { Marker } from "react-native-maps";

import BackHeader from "../../components/BackHeader";
import EnterButton from "../../components/auth/EnterButton";
import InputField from "../../components/InputField";
import Tag from "../../components/event/Tag";
import Check from "../../components/Check";
import SelectableButton from "../../components/event/SelectableButton";
import TextField from "../../components/TextField";
import AccessoryView from "../../components/AccessoryView";

const userUploadMetadata = {
    contentType: "image/jpeg",
};

const tagLineAmt = 5;

export default function EventCreate({ navigation }) {
    let btnPressed = false;

    const [event, setEvent] = useState(Event_Placeholder);
    const [pin, setPin] = useState(initialRegion);
    const [currentMapType, setCurrentMapType] = useState(0);
    const [checkedCategories, setCheckedCategories] = useState({
        type: false,
        entrance_fee: false,
        website: false,
        adBanner: false,
        tags: false,
    });

    const [buttonChecked, setButtonChecked] = useState(false);

    // IMG Load + Compress
    const openImagePickerAsync = async () => {
        let permissionResult = await requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) return;

        let pickerResult = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
            allowsMultipleSelection: false,
            presentationStyle: UIImagePickerPresentationStyle.PAGE_SHEET,
        });
        if (pickerResult.canceled) return;

        let aspect =
            pickerResult.assets[0].width / pickerResult.assets[0].width;

        const croppedPicker = await manipulateAsync(
            pickerResult.assets[0].uri,
            [
                {
                    resize: {
                        width: 512 * aspect,
                        height: 512,
                    },
                },
            ],
            {
                compress: 0.5,
                format: SaveFormat.JPEG,
            }
        );

        setEvent(prev => {
            return {
                ...prev,
                eventOptions: {
                    ...prev.eventOptions,
                    adBanner: {
                        uri: croppedPicker.uri,
                        aspect: aspect,
                    },
                },
            };
        });
    };

    const checkButton = () => {
        let inputValid = false;
        if (
            event.title.length !== 0 &&
            event.description.length !== 0 &&
            event.starting &&
            event.ending
        )
            inputValid = true;
        setButtonChecked(inputValid);
    };

    useEffect(() => {
        checkButton();
    }, [event]);

    const publishEvent = async () => {
        if (!buttonChecked) return;
        if (btnPressed) return;
        btnPressed = true;

        const uid = await getData("userId").catch(() => {
            return getAuth().currentUser.uid;
        });

        const id = Date.now();
        const db = getDatabase();

        let eventOptions = {};
        if (event.eventOptions !== undefined) {
            if (event.eventOptions.type !== undefined && checkedCategories.type)
                eventOptions = {
                    ...eventOptions,
                    type: event.eventOptions.type,
                };
            if (
                event.eventOptions.entrance_fee !== undefined &&
                checkedCategories.entrance_fee
            )
                eventOptions = {
                    ...eventOptions,
                    entrance_fee: event.eventOptions.entrance_fee,
                };
            if (event.eventOptions.website && checkedCategories.website)
                eventOptions = {
                    ...eventOptions,
                    website: event.eventOptions.website,
                };
            if (event.eventOptions.tags && checkedCategories.tags)
                eventOptions = {
                    ...eventOptions,
                    tags: event.eventOptions.tags,
                };
        }

        set(ref(db, `events/${id}`), {
            id: id,
            type: 1,
            title: event.title,
            description: event.description,
            starting: event.starting,
            ending: event.ending,
            eventOptions: eventOptions,
            created: id,
            creator: uid,
            geoCords: pin,
            isBanned: false,
        }).finally(() => {
            get(child(ref(db), `users/${uid}/events`))
                .then(eventsSnap => {
                    let events = [];
                    if (eventsSnap.exists()) events = eventsSnap.val();
                    events.push(id);

                    set(ref(db, `users/${uid}/events`), events).catch(error =>
                        console.log(
                            "error pages/create/EventCreate.jsx",
                            "publishEvent set user events",
                            error.code
                        )
                    );
                })
                .catch(error =>
                    console.log(
                        "error pages/create/EventCreate.jsx",
                        "publishEvent get users events",
                        error.code
                    )
                )
                .finally(async () => {
                    if (
                        !(
                            checkedCategories.adBanner &&
                            event.eventOptions.adBanner
                        )
                    )
                        return;

                    const storage = Storage.getStorage();

                    const blob = await new Promise((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            resolve(xhr.response);
                        };
                        xhr.onerror = function () {
                            reject(new TypeError("Network request failed!"));
                        };
                        xhr.responseType = "blob";
                        xhr.open("GET", event.eventOptions.adBanner.uri, true);
                        xhr.send(null);
                    });

                    const adImgRef = Storage.ref(storage, `event_pics/${id}`);
                    Storage.uploadBytes(adImgRef, blob, userUploadMetadata)
                        .then(() => {
                            Storage.getDownloadURL(adImgRef)
                                .then(url => {
                                    set(
                                        ref(
                                            db,
                                            `events/${id}/eventOptions/adBanner`
                                        ),
                                        {
                                            uri: url,
                                            aspect: event.eventOptions.adBanner
                                                .aspect,
                                        }
                                    )
                                        .catch(error =>
                                            console.log(
                                                "error pages/create/EventCreate.jsx",
                                                "publishEvent set adBanner",
                                                error.code
                                            )
                                        )
                                        .finally(() =>
                                            Alert.alert(
                                                "Wuspěšnje wozjewjeny ewent",
                                                `Ewent ${post.title} je so wuspěšnje wozjewił`,
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
                                            )
                                        );
                                })
                                .catch(error =>
                                    console.log(
                                        "error pages/create/EventCreate.jsx",
                                        "publishEvent Storage.getDownloadURL",
                                        error.code
                                    )
                                );
                        })
                        .catch(error =>
                            console.log(
                                "error pages/create/EventCreate.jsx",
                                "publishEvent Storage.uploadBytes",
                                error.code
                            )
                        );
                });
        });
    };

    return (
        <View style={[style.container, style.bgBlack]}>
            <KeyboardAvoidingView
                style={style.allMax}
                behavior={Platform.OS === "ios" ? "padding" : "height"}>
                {/* Header */}
                <Pressable style={{ zIndex: 10 }}>
                    <BackHeader
                        title={"Nowy post wozjewić"}
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
                    {/* Map Container */}
                    <View>
                        {/* Title */}
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {event.title.length === 0
                                ? "Mjeno ewenta"
                                : event.title}
                        </Text>

                        {/* Map */}
                        <View
                            style={[
                                styles.mapContainer,
                                style.allCenter,
                                style.oHidden,
                            ]}>
                            <MapView
                                style={style.allMax}
                                userInterfaceStyle="dark"
                                showsUserLocation
                                showsScale
                                mapType={mapTypes[currentMapType]}
                                accessible={false}
                                focusable={false}
                                onLongPress={() => {
                                    setCurrentMapType(cur => {
                                        return cur === 0 ? 1 : 0;
                                    });
                                }}
                                onRegionChange={result => setPin(result)}
                                initialRegion={event.geoCords}>
                                <Marker
                                    focusable
                                    title={event.title}
                                    coordinate={pin}
                                />
                            </MapView>
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={[style.Tmd, style.tWhite]}>
                                {event.description.length === 0
                                    ? "Wopisowanje ewenta"
                                    : event.description}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            Přez ewent:
                        </Text>

                        {/* Time Start-End */}
                        <View
                            style={[
                                styles.underSectionContainer,
                                styles.rowContainer,
                            ]}>
                            <Text style={[style.tWhite, style.Tmd]}>
                                {convertTimestampToString(event.starting)} -{" "}
                                {convertTimestampToString(event.ending)}
                            </Text>
                        </View>

                        {/* Type */}
                        {event.eventOptions.type !== undefined &&
                        checkedCategories.type ? (
                            <View
                                style={[
                                    styles.underSectionContainer,
                                    styles.rowContainer,
                                ]}>
                                <Text style={[style.Tmd, style.tWhite]}>
                                    Družina:{" "}
                                    {Event_Types[event.eventOptions.type]}
                                </Text>
                            </View>
                        ) : null}

                        {/* Entrance Fee */}
                        {event.eventOptions.entrance_fee !== undefined &&
                        checkedCategories.entrance_fee ? (
                            <View
                                style={[
                                    styles.underSectionContainer,
                                    styles.rowContainer,
                                ]}>
                                <Text style={[style.Tmd, style.tWhite]}>
                                    Zastup: {event.eventOptions.entrance_fee}€
                                </Text>
                            </View>
                        ) : null}

                        {/* Website */}
                        {event.eventOptions.website &&
                        checkedCategories.website ? (
                            <Pressable
                                style={styles.underSectionContainer}
                                onPress={() =>
                                    openLink(event.eventOptions.website)
                                }>
                                <Text style={[style.Tmd, style.tWhite]}>
                                    Webstrona: {event.eventOptions.website}
                                </Text>
                            </Pressable>
                        ) : null}

                        {/* Ad Banner */}
                        {event.eventOptions.adBanner &&
                        checkedCategories.adBanner ? (
                            <Pressable
                                onPress={() =>
                                    navigation.navigate("imgFull", {
                                        uri: event.eventOptions.adBanner.uri,
                                    })
                                }
                                style={[
                                    styles.underSectionContainer,
                                    styles.rowContainer,
                                ]}>
                                <Image
                                    style={[
                                        styles.adBanner,
                                        {
                                            aspectRatio:
                                                event.eventOptions.adBanner
                                                    .aspect,
                                        },
                                    ]}
                                    source={{
                                        uri: event.eventOptions.adBanner.uri,
                                    }}
                                    resizeMode="cover"
                                />
                            </Pressable>
                        ) : null}

                        {/* Tags */}
                        {event.eventOptions.tags && checkedCategories.tags ? (
                            <View
                                style={[
                                    styles.underSectionContainer,
                                    styles.rowContainer,
                                    { flexWrap: "wrap" },
                                ]}>
                                {event.eventOptions.tags.map((tag, key) => (
                                    <Tag
                                        key={key}
                                        style={{ margin: style.defaultMsm }}
                                        title={Event_Tags[tag]}
                                    />
                                ))}
                            </View>
                        ) : null}
                    </View>

                    {/* Info Edit */}
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            Wobdźěłanje informacijow:
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
                                    Mjeno ewenta zapodać:
                                </Text>
                                <InputField
                                    placeholder="Mjeno"
                                    keyboardType="default"
                                    value={event.title}
                                    inputAccessoryViewID="event_title_InputAccessoryViewID"
                                    icon={
                                        <SVG_Pencil fill={style.colors.sec} />
                                    }
                                    onChangeText={val => {
                                        setEvent({
                                            ...event,
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
                                    Wopisowanje ewenta zapodać:
                                </Text>
                                <TextField
                                    placeholder="Wopisownje ewenta dodać..."
                                    value={event.description}
                                    inputAccessoryViewID="event_description_InputAccessoryViewID"
                                    onChangeText={val => {
                                        setEvent({
                                            ...event,
                                            description: val,
                                        });
                                    }}
                                />
                            </View>

                            {/* Times */}
                            <View style={{ marginTop: style.defaultMmd }}>
                                <Text
                                    style={[
                                        style.Tmd,
                                        style.tWhite,
                                        { marginBottom: style.defaultMsm },
                                    ]}>
                                    Časy ewenta:
                                </Text>
                                <InputField
                                    placeholder="Spočatk"
                                    keyboardType="default"
                                    icon={
                                        <SVG_Recent fill={style.colors.sec} />
                                    }
                                    onChangeText={val => {
                                        setEvent({
                                            ...event,
                                            starting:
                                                convertTextIntoTimestamp(val),
                                        });
                                    }}
                                />

                                <View style={{ marginTop: style.defaultMsm }}>
                                    <InputField
                                        placeholder="Kónc"
                                        keyboardType="default"
                                        icon={
                                            <SVG_Flag fill={style.colors.sec} />
                                        }
                                        onChangeText={val => {
                                            setEvent({
                                                ...event,
                                                ending: convertTextIntoTimestamp(
                                                    val
                                                ),
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Add Data */}
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            Přidatne podaća:
                            <Text style={style.tBlue}>*</Text>
                        </Text>
                        {/* Checkable Items */}
                        <View style={styles.underSectionContainer}>
                            <Text style={[style.Tmd, style.tWhite]}>
                                Wuzwol sej informacije kiž chceš přidatnje
                                dodać:
                            </Text>
                            {/* Type */}
                            <View
                                style={[
                                    styles.underSectionContainer,
                                    styles.checkContainer,
                                ]}>
                                <Check
                                    color={1}
                                    checked={checkedCategories.type}
                                    onPress={() => {
                                        setCheckedCategories(prev => {
                                            return {
                                                ...prev,
                                                type: !prev.type,
                                            };
                                        });
                                    }}
                                />
                                <Text
                                    style={[style.tWhite, style.Tmd, style.pH]}>
                                    Typ ewenta
                                </Text>
                            </View>
                            {/* Entrance fee */}
                            <View
                                style={[
                                    styles.underSectionContainer,
                                    styles.checkContainer,
                                ]}>
                                <Check
                                    color={1}
                                    checked={checkedCategories.entrance_fee}
                                    onPress={() => {
                                        setCheckedCategories(prev => {
                                            return {
                                                ...prev,
                                                entrance_fee:
                                                    !prev.entrance_fee,
                                            };
                                        });
                                    }}
                                />
                                <Text
                                    style={[style.tWhite, style.Tmd, style.pH]}>
                                    Zastupne košty
                                </Text>
                            </View>
                            {/* Website */}
                            <View
                                style={[
                                    styles.underSectionContainer,
                                    styles.checkContainer,
                                ]}>
                                <Check
                                    color={1}
                                    checked={checkedCategories.website}
                                    onPress={() => {
                                        setCheckedCategories(prev => {
                                            return {
                                                ...prev,
                                                website: !prev.website,
                                            };
                                        });
                                    }}
                                />
                                <Text
                                    style={[style.tWhite, style.Tmd, style.pH]}>
                                    Webstrona k ewenće
                                </Text>
                            </View>
                            {/* Type */}
                            <View
                                style={[
                                    styles.underSectionContainer,
                                    styles.checkContainer,
                                ]}>
                                <Check
                                    color={1}
                                    checked={checkedCategories.adBanner}
                                    onPress={() => {
                                        setCheckedCategories(prev => {
                                            return {
                                                ...prev,
                                                adBanner: !prev.adBanner,
                                            };
                                        });
                                    }}
                                />
                                <Text
                                    style={[style.tWhite, style.Tmd, style.pH]}>
                                    Wabjenski wobraz / plakat
                                </Text>
                            </View>
                            {/* Tags */}
                            <View
                                style={[
                                    styles.underSectionContainer,
                                    styles.checkContainer,
                                ]}>
                                <Check
                                    color={1}
                                    checked={checkedCategories.tags}
                                    onPress={() => {
                                        setCheckedCategories(prev => {
                                            return {
                                                ...prev,
                                                tags: !prev.tags,
                                            };
                                        });
                                    }}
                                />
                                <Text
                                    style={[style.tWhite, style.Tmd, style.pH]}>
                                    Přidatne Tags
                                </Text>
                            </View>
                        </View>
                        <Text
                            style={[
                                style.TsmRg,
                                style.tWhite,
                                { marginTop: style.defaultMmd },
                            ]}>
                            <Text style={style.tBlue}>*</Text> Wšitke podaća pod
                            tutej kategoriji su opcionalne a njedyrbja so podać.
                        </Text>
                    </View>

                    {/* Type */}
                    {checkedCategories.type ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                Typ ewenta:
                            </Text>
                            <View style={{ marginTop: style.defaultMsm }}>
                                {arraySplitter(Event_Types, 2).map(
                                    (list, listKey) => (
                                        <View
                                            key={listKey}
                                            style={
                                                styles.typeItemListContainer
                                            }>
                                            {list.map((type, key) => (
                                                <SelectableButton
                                                    key={key}
                                                    title={type}
                                                    checked={
                                                        event.eventOptions
                                                            .type !== undefined
                                                            ? event.eventOptions
                                                                  .type ===
                                                              Event_Types.indexOf(
                                                                  type
                                                              )
                                                            : false
                                                    }
                                                    style={styles.typeItem}
                                                    onPress={() => {
                                                        setEvent(prev => {
                                                            return {
                                                                ...prev,
                                                                eventOptions: {
                                                                    ...prev.eventOptions,
                                                                    type: Event_Types.indexOf(
                                                                        type
                                                                    ),
                                                                },
                                                            };
                                                        });
                                                    }}
                                                />
                                            ))}
                                        </View>
                                    )
                                )}
                            </View>
                        </View>
                    ) : null}

                    {/* Entrance fee */}
                    {checkedCategories.entrance_fee ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                Zastupna płaćizna:
                            </Text>

                            <View
                                style={[
                                    style.pH,
                                    { marginTop: style.defaultMmd },
                                ]}>
                                <Text
                                    style={[
                                        style.Tmd,
                                        style.tWhite,
                                        { marginBottom: style.defaultMsm },
                                    ]}>
                                    Zastupnu płaćiznu zapodać:
                                </Text>
                                <InputField
                                    placeholder="Zastupna płaćizna w Euro"
                                    keyboardType="numeric"
                                    icon={<SVG_Cash fill={style.colors.sec} />}
                                    onChangeText={val => {
                                        setEvent(prev => {
                                            return {
                                                ...prev,
                                                eventOptions: {
                                                    ...prev.eventOptions,
                                                    entrance_fee: val,
                                                },
                                            };
                                        });
                                    }}
                                />
                            </View>
                        </View>
                    ) : null}

                    {/* Website */}
                    {checkedCategories.website ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                Webstrona k ewenće:
                            </Text>

                            <View
                                style={[
                                    style.pH,
                                    { marginTop: style.defaultMmd },
                                ]}>
                                <Text
                                    style={[
                                        style.Tmd,
                                        style.tWhite,
                                        { marginBottom: style.defaultMsm },
                                    ]}>
                                    Webstronu zapodać:
                                </Text>
                                <InputField
                                    placeholder="Webstrona / URL"
                                    keyboardType="url"
                                    icon={<SVG_Web fill={style.colors.sec} />}
                                    onChangeText={val => {
                                        setEvent(prev => {
                                            return {
                                                ...prev,
                                                eventOptions: {
                                                    ...prev.eventOptions,
                                                    website: val,
                                                },
                                            };
                                        });
                                    }}
                                />
                            </View>
                        </View>
                    ) : null}

                    {/* Ad Banner */}
                    {checkedCategories.adBanner ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                Wabjenski plakat / wobraz:
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
                                    {event.eventOptions.adBanner !==
                                    undefined ? (
                                        <Image
                                            source={{
                                                uri: event.eventOptions.adBanner
                                                    .uri,
                                            }}
                                            style={[
                                                styles.image,
                                                {
                                                    aspectRatio:
                                                        event.eventOptions
                                                            .adBanner.aspect,
                                                },
                                            ]}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View
                                            style={[
                                                styles.image,
                                                style.allCenter,
                                                styles.imageBorder,
                                                { aspectRatio: 1 },
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

                    {/* Tags */}
                    {checkedCategories.tags ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                Tags:
                            </Text>

                            <View style={{ marginTop: style.defaultMmd }}>
                                <ScrollView
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    horizontal
                                    bounces
                                    keyboardDismissMode="interactive"
                                    style={{ width: "100%" }}
                                    contentContainerStyle={{
                                        flexDirection: "column",
                                    }}>
                                    {splitArrayIntoNEqualy(
                                        Event_Tags,
                                        tagLineAmt
                                    ).map((line, lineKey) => (
                                        <View
                                            key={lineKey}
                                            style={styles.tagLineContainer}>
                                            {line.map((tag, key) => (
                                                <Tag
                                                    key={key}
                                                    checked={
                                                        event.eventOptions
                                                            .tags !== undefined
                                                            ? event.eventOptions.tags.includes(
                                                                  Event_Tags.indexOf(
                                                                      tag
                                                                  )
                                                              )
                                                            : false
                                                    }
                                                    title={tag}
                                                    style={styles.typeItem}
                                                    onPress={() => {
                                                        let t = [].concat(
                                                            event.eventOptions
                                                                .tags
                                                                ? event
                                                                      .eventOptions
                                                                      .tags
                                                                : []
                                                        );
                                                        if (
                                                            !t.includes(
                                                                Event_Tags.indexOf(
                                                                    tag
                                                                )
                                                            )
                                                        )
                                                            t.push(
                                                                Event_Tags.indexOf(
                                                                    tag
                                                                )
                                                            );
                                                        else
                                                            t.splice(
                                                                t.indexOf(
                                                                    Event_Tags.indexOf(
                                                                        tag
                                                                    )
                                                                ),
                                                                1
                                                            );

                                                        setEvent(prev => {
                                                            return {
                                                                ...prev,
                                                                eventOptions: {
                                                                    ...prev.eventOptions,
                                                                    tags: t,
                                                                },
                                                            };
                                                        });
                                                    }}
                                                />
                                            ))}
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    ) : null}

                    {/* Button */}
                    <View style={[style.allCenter, styles.button]}>
                        <EnterButton
                            onPress={publishEvent}
                            checked={buttonChecked}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Title */}
            <AccessoryView
                onElementPress={l => {
                    setEvent(prev => {
                        return {
                            ...prev,
                            title: prev.title + l,
                        };
                    });
                }}
                nativeID={"event_title_InputAccessoryViewID"}
            />
            {/* Description */}
            <AccessoryView
                onElementPress={l => {
                    setEvent(prev => {
                        return {
                            ...prev,
                            description: prev.description + l,
                        };
                    });
                }}
                nativeID={"event_description_InputAccessoryViewID"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        marginVertical: style.defaultMlg,
    },
    mapContainer: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 10,
        marginTop: style.defaultMmd,
    },
    textContainer: {
        // paddingHorizontal: style.Psm.paddingHorizontal,
        width: "100%",
        marginTop: style.defaultMmd,
    },

    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
    },
    underSectionContainer: {
        width: "100%",
        marginTop: style.defaultMmd,
    },

    timesContainer: {
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
    },
    timeIcon: {
        aspectRatio: 1,
        maxHeight: 24,
        maxWidth: 24,
        width: "100%",
    },
    timeLine: {
        width: 1,
        height: "100%",
    },

    rowContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },

    adBanner: {
        width: "100%",
        borderRadius: 10,
    },

    checkContainer: {
        width: "100%",
        marginTop: style.defaultMmd,
        flexDirection: "row",
        alignItems: "center",
    },

    typeItemListContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    typeItem: {
        margin: style.defaultMsm,
        flex: 1,
    },

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

    tagLineContainer: {
        flex: 1,
        flexDirection: "row",
    },
});
