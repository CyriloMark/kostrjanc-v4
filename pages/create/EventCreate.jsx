import React, { useState, useEffect, useRef } from "react";
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

import { Event_Placeholder } from "../../constants/content/PlaceholderData";
import { getData, storeData } from "../../constants/storage";
import { arraySplitter, splitArrayIntoNEqualy } from "../../constants";
import {
    convertTimestampToDate,
    convertTimestampToString,
    convertTimestampToTime,
} from "../../constants/time";
import {
    Event_Types,
    mapTypes,
    Event_Tags,
    initialRegion,
    mapStyles,
    mapStylesDefault,
} from "../../constants/event";
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
import getStatusCodeText from "../../components/content/status";
import { getImageData, insertCharacterOnCursor } from "../../constants/content";
import { sendContentUploadPushNotification } from "../../constants/notifications/content";

import SVG_Pencil from "../../assets/svg/Pencil";
import SVG_Post from "../../assets/svg/Post";
import SVG_Flag from "../../assets/svg/Flag";
import SVG_Time from "../../assets/svg/Time";
import SVG_Cash from "../../assets/svg/Cash";
import SVG_Web from "../../assets/svg/Web";
import SVG_Pin from "../../assets/svg/Pin3.0";
import SVG_Kamera from "../../assets/svg/Kamera";

import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import {
    launchImageLibraryAsync,
    requestMediaLibraryPermissionsAsync,
    MediaTypeOptions,
    UIImagePickerPresentationStyle,
    launchCameraAsync,
    requestCameraPermissionsAsync,
} from "expo-image-picker";

// import MapView from "../../components/beta/MapView";
import MapView, {
    PROVIDER_DEFAULT,
    PROVIDER_GOOGLE,
    Marker,
} from "react-native-maps";

import BackHeader from "../../components/BackHeader";
import EnterButton from "../../components/auth/EnterButton";
import InputField from "../../components/InputField";
import Tag from "../../components/event/Tag";
import Check from "../../components/Check";
import SelectableButton from "../../components/event/SelectableButton";
import TextField from "../../components/TextField";
import AccessoryView from "../../components/AccessoryView";
import Map from "../../components/event/Map";

import * as FileSystem from "expo-file-system";

import DateTimePicker, {
    DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

const userUploadMetadata = {
    contentType: "image/jpeg",
};

const tagLineAmt = 5;

let cursorPos = -1;
export default function EventCreate({ navigation, route }) {
    let btnPressed = false;
    const [uploading, setUploading] = useState(btnPressed);

    const [scrollable, setScrollable] = useState(true);

    const mapRef = useRef();

    const [event, setEvent] = useState(Event_Placeholder);
    const [pin, setPin] = useState(initialRegion);
    const [groups, setGroups] = useState([]);

    const [currentMapType, setCurrentMapType] = useState(0);
    const [checkedCategories, setCheckedCategories] = useState({
        type: false,
        entrance_fee: false,
        website: false,
        adBanner: false,
        tags: false,
    });

    const [autoCorrect, setAutoCorrect] = useState({
        status: 100,
        content: [],
    });

    // From linking → when comes back fromLinking = true || = false
    const { fromLinking, linkingData, fromEdit, editData } = route.params;

    useEffect(() => {
        cursorPos = -1;
        getGroups();

        if (fromEdit) {
            setEvent({
                ...editData,
                title: getClearedLinkedText(editData.title),
                description: getClearedLinkedText(editData.description),
            });
            setPin(editData.geoCords);
            if (editData.eventOptions)
                setCheckedCategories({
                    type:
                        editData.eventOptions.type != undefined ? true : false,
                    entrance_fee:
                        editData.eventOptions.entrance_fee != undefined
                            ? true
                            : false,
                    website:
                        editData.eventOptions.website != undefined
                            ? true
                            : false,
                    adBanner:
                        editData.eventOptions.adBanner != undefined
                            ? true
                            : false,
                    tags:
                        editData.eventOptions.tags != undefined ? true : false,
                });
        }
    }, []);

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

    const [buttonChecked, setButtonChecked] = useState(false);

    const openDatePickerAndroid = options => {
        if (Platform.OS !== "android") return;
        DateTimePickerAndroid.open(options);
    };

    //#region IMG Load + Compress
    const openImagePickerAsync = async () => {
        let permissionResult = await requestMediaLibraryPermissionsAsync();
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
            allowsMultipleSelection: false,
            presentationStyle: UIImagePickerPresentationStyle.PAGE_SHEET,
            base64: true,
        });
        if (pickerResult.canceled) return;

        let aspect =
            pickerResult.assets[0].width / pickerResult.assets[0].width;

        try {
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
                    base64: true,
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
                            base64: croppedPicker.base64,
                        },
                    },
                };
            });
        } catch (e) {
            setEvent(prev => {
                return {
                    ...prev,
                    eventOptions: {
                        ...prev.eventOptions,
                        adBanner: {
                            uri: pickerResult.assets[0].uri,
                            aspect: aspect,
                            base64: pickerResult.assets[0].uri,
                        },
                    },
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
            base64: true,
        });

        if (camResult.canceled) return;

        let aspect = camResult.assets[0].width / camResult.assets[0].width;

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
            setEvent(prev => {
                return {
                    ...prev,
                    eventOptions: {
                        ...prev.eventOptions,
                        adBanner: {
                            uri: croppedPicker.uri,
                            aspect: aspect,
                            base64: croppedPicker.base64,
                        },
                    },
                };
            });
        } catch (e) {
            setEvent(prev => {
                return {
                    ...prev,
                    eventOptions: {
                        ...prev.eventOptions,
                        adBanner: {
                            uri: camResult.assets[0].uri,
                            base64: camResult.assets[0].base64,
                            aspect: aspect,
                        },
                    },
                };
            });
        }
    };
    //#endregion

    const checkButton = () => {
        let inputValid = true;

        if (
            event.title.length === 0 ||
            event.description.length === 0 ||
            !event.starting ||
            !event.ending
        )
            inputValid = false;

        if (
            fromEdit &&
            event.title == editData.title &&
            event.description == getClearedLinkedText(editData.description) &&
            event.starting == editData.starting &&
            event.ending == editData.ending &&
            event.eventOptions == editData.eventOptions
        )
            inputValid = false;

        setButtonChecked(inputValid);
    };

    useEffect(() => {
        if (!fromLinking) checkButton();
        else {
            setButtonChecked(true);
            publishEvent();
        }
    }, [event]);

    const setUnfullfilledAlert = () => {
        let missing = "";

        if (event.title.length === 0)
            missing += `\n${getLangs("missing_title")}`;
        if (event.description.length === 0)
            missing += `\n${getLangs("missing_description")}`;
        if (!event.starting) missing += `\n${getLangs("missing_start")}`;
        if (!event.ending) missing += `\n${getLangs("missing_end")}`;

        if (
            fromEdit &&
            event.title == getClearedLinkedText(editData.title) &&
            event.description == getClearedLinkedText(editData.description) &&
            event.starting == editData.starting &&
            event.ending == editData.ending &&
            event.eventOptions == editData.eventOptions
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

    const publishEvent = async () => {
        if (!buttonChecked) {
            setUnfullfilledAlert();
            return;
        }

        if (
            !fromLinking &&
            !(
                !checkForLinkings(event.title) &&
                !checkForLinkings(event.description)
            )
        ) {
            navigation.navigate("linkingScreen", {
                content: event,
                type: LINKING_TYPES.Event,
                origin: "eventCreate",
                fromEdit: fromEdit,
            });
            return;
        }

        if (btnPressed) return;
        setButtonChecked(false);
        setUploading(true);
        btnPressed = true;

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
            if (
                event.eventOptions.website !== undefined &&
                checkedCategories.website
            )
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

        if (!fromEdit) publishEventNew(eventOptions);
        else publishEventEdit(eventOptions);
    };

    const publishEventNew = async eventOptions => {
        let params = {
            type: "event",
            title: event.title,
            description: event.description,
            starting: event.starting,
            ending: event.ending,
            geoCords: pin,
            eventOptions: eventOptions,
            group: event.group,
        };

        if (
            event.eventOptions.adBanner !== undefined &&
            checkedCategories.adBanner
        ) {
            console.log("detected image");

            let img_url = event.eventOptions.adBanner.base64;
            const base64 = img_url;
            if (!base64) {
                Alert.alert(
                    "Fehler",
                    "Kein Bild ausgewählt oder Base64-Daten fehlen."
                );
                params = {
                    ...params,
                    img: base64,
                };
            }
        }

        const response = await makeRequest("/post_event/publish", params);

        if (response.code < 400) {
            addToLocalStorage(response.id);
            sendContentUploadPushNotification(1);

            Alert.alert(
                getLangs("eventcreate_publishsuccessful_title"),
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
                getLangs("eventcreate_publishrejected_title"),
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

    const publishEventEdit = async eventOptions => {
        let params = {
            id: event.id,
            type: "event",
            title: event.title,
            description: event.description,
            starting: event.starting,
            ending: event.ending,
            geoCords: pin,
            eventOptions: eventOptions,
        };

        const response = await makeRequest("/post_event/edit", params);

        if (response.code < 400)
            Alert.alert(
                getLangs("eventcreate_editsuccessful_title"),
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
                getLangs("eventcreate_publishrejected_title"),
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
            let events = [];
            if (userData["events"]) events = userData["events"];
            events.push(id);

            storeData("userData", {
                ...userData,
                events: events,
            }).finally(() => console.log("complete"));
        });
    };

    const overridePin = event => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.action === "boundsChanged") {
            let latiduteDelta = (data.bounds.north - data.bounds.south) / 2;
            let longitudeDelta = (data.bounds.east - data.bounds.west) / 2;
            let latidute = data.bounds.south + latiduteDelta;
            let longitude = data.bounds.west + longitudeDelta;

            setPin({
                latitude: latidute,
                latitudeDelta: latiduteDelta,
                longitude: longitude,
                longitudeDelta: longitudeDelta,
            });
        }
    };

    return (
        <View style={[style.container, style.bgBlack]}>
            {uploading ? (
                <Pressable
                    onPress={() => {}}
                    style={[
                        { position: "absolute" },
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
                <Pressable
                    style={{ zIndex: 10 }}
                    onPress={openDatePickerAndroid}>
                    <BackHeader
                        title={getLangs("eventcreate_headertitle")}
                        onBack={() => navigation.goBack()}
                        showReload={false}
                    />
                </Pressable>

                <ScrollView
                    style={[style.container, style.pH, style.oVisible]}
                    keyboardDismissMode="interactive"
                    scrollEnabled={scrollable}
                    keyboardShouldPersistTaps="handled"
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
                        <Text style={[style.tWhite, style.Ttitle2]}>
                            {event.title.length === 0
                                ? getLangs("eventcreate_eventtitle")
                                : event.title}
                        </Text>

                        {/* Map */}
                        <View
                            onTouchStart={() => setScrollable(false)}
                            onTouchEnd={() => setScrollable(true)}
                            style={[
                                styles.mapContainer,
                                style.allCenter,
                                style.oHidden,
                            ]}>
                            <Map
                                mapRef={mapRef}
                                style={style.allMax}
                                accessible={true}
                                initialRegion={event.geoCords}
                                marker={false}
                                title={""}
                                onMessage={overridePin}
                                onRegionChange={res => setPin(res)}
                            />
                            {false ? (
                                <MapView
                                    ref={mapRef}
                                    style={style.allMax}
                                    userInterfaceStyle="dark"
                                    showsUserLocation
                                    customMapStyle={mapStylesDefault}
                                    provider={PROVIDER_DEFAULT}
                                    showsScale
                                    accessible={false}
                                    focusable={false}
                                    // mapType={mapTypes[currentMapType]}
                                    // onLongPress={() => {
                                    //     setCurrentMapType(cur => {
                                    //         return cur === 0 ? 1 : 0;
                                    //     });
                                    // }}
                                    // onPress={ev =>
                                    //     mapRef.current.animateToRegion(
                                    //         ev.nativeEvent.coordinate,
                                    //         250
                                    //     )
                                    // }
                                    onRegionChange={result => setPin(result)}
                                    initialRegion={event.geoCords}>
                                    {/* <Marker
                                    focusable
                                    title={event.title}
                                    coordinate={pin}>
                                    <SVG_Pin
                                        fill={style.colors.red}
                                        style={styles.marker}
                                    />
                                </Marker> */}
                                </MapView>
                            ) : null}
                            <SVG_Pin
                                fill={style.colors.red}
                                style={styles.mapPin}
                            />
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={[style.Tmd, style.tWhite]}>
                                {event.description.length === 0
                                    ? getLangs("eventcreate_eventdescription")
                                    : event.description}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("hint_title")}
                        </Text>
                        <View style={styles.textContainer}>
                            <Text style={[style.Tmd, style.tWhite]}>
                                {getLangs("eventcreate_maphint")}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("event_about_title")}
                        </Text>

                        {/* Time Start-End */}
                        <View
                            style={[
                                styles.underSectionContainer,
                                styles.rowContainer,
                            ]}>
                            <Text style={[style.tWhite, style.Tmd]}>
                                {event.starting === null
                                    ? getLangs("eventcreate_nostart")
                                    : convertTimestampToString(event.starting)}
                                {" - "}
                                {event.ending === null
                                    ? getLangs("eventcreate_noend")
                                    : convertTimestampToString(event.ending)}
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
                                    {getLangs("event_about_type")}{" "}
                                    {getLangs(
                                        Event_Types[event.eventOptions.type]
                                    )}
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
                                    {getLangs("event_about_entranefee")}{" "}
                                    {event.eventOptions.entrance_fee}€
                                </Text>
                            </View>
                        ) : null}

                        {/* Website */}
                        {event.eventOptions.website &&
                        checkedCategories.website ? (
                            <Pressable style={styles.underSectionContainer}>
                                <Text style={[style.Tmd, style.tWhite]}>
                                    {getLangs("event_about_website")}{" "}
                                    <Text
                                        style={[
                                            style.tBlue,
                                            {
                                                textDecorationStyle: "solid",
                                                textDecorationLine: "underline",
                                                textDecorationColor:
                                                    style.colors.blue,
                                            },
                                        ]}>
                                        {event.eventOptions.website}
                                    </Text>
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
                                        title={getLangs(Event_Tags[tag])}
                                    />
                                ))}
                            </View>
                        ) : null}
                    </View>

                    {/* Info Edit */}
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("eventcreate_addinformation")}
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
                                    {getLangs("eventcreate_info_title")}
                                </Text>
                                <InputField
                                    placeholder={getLangs(
                                        "input_placeholder_contentname"
                                    )}
                                    autoCapitalize="sentences"
                                    keyboardType="default"
                                    value={event.title}
                                    inputAccessoryViewID="event_title_InputAccessoryViewID"
                                    maxLength={32}
                                    icon={
                                        <SVG_Pencil fill={style.colors.blue} />
                                    }
                                    supportsAutoCorrect
                                    onSelectionChange={async e => {
                                        cursorPos =
                                            e.nativeEvent.selection.start;

                                        const autoC =
                                            await checkForAutoCorrectInside(
                                                event.title,
                                                cursorPos
                                            );
                                        setAutoCorrect(autoC);
                                    }}
                                    onChangeText={async val => {
                                        // Check Selection
                                        cursorPos = getCursorPosition(
                                            event.title,
                                            val
                                        );

                                        // Add Input to Post Data -> Changes Title
                                        setEvent({
                                            ...event,
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
                                        setEvent(prev => {
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
                                    {getLangs("eventcreate_info_description")}
                                </Text>
                                <TextField
                                    placeholder={getLangs(
                                        "input_placeholder_description"
                                    )}
                                    userLinkable
                                    value={event.description}
                                    maxLength={512}
                                    inputAccessoryViewID="event_description_InputAccessoryViewID"
                                    supportsAutoCorrect
                                    onSelectionChange={async e => {
                                        cursorPos =
                                            e.nativeEvent.selection.start;

                                        const autoC =
                                            await checkForAutoCorrectInside(
                                                event.description,
                                                cursorPos
                                            );
                                        setAutoCorrect(autoC);
                                    }}
                                    onChangeText={async val => {
                                        // Check Selection
                                        cursorPos = getCursorPosition(
                                            event.description,
                                            val
                                        );

                                        // Add Input to Post Data -> Changes Desc
                                        setEvent({
                                            ...event,
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
                                        setEvent(prev => {
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

                            {/* Times */}
                            <View style={{ marginTop: style.defaultMmd }}>
                                <Text
                                    style={[
                                        style.Tmd,
                                        style.tWhite,
                                        { marginBottom: style.defaultMsm },
                                    ]}>
                                    {getLangs("eventcreate_info_times")} (
                                    {getLangs("eventcreate_info_times_hint")})
                                </Text>

                                <View style={{ maxHeight: 58 }}>
                                    <View
                                        style={[
                                            styles.timesInputContainer,
                                            style.border,
                                            style.oHidden,
                                            style.allMax,
                                            style.Pmd,
                                        ]}>
                                        <View
                                            style={[
                                                styles.timesIcon,
                                                style.allCenter,
                                            ]}>
                                            <SVG_Time
                                                fill={style.colors.blue}
                                            />
                                        </View>
                                        <View
                                            style={[
                                                styles.timesInnerContainer,
                                                style.tWhite,
                                                style.Tmd,
                                                style.pH,
                                            ]}>
                                            {Platform.OS === "ios" ? (
                                                <DateTimePicker
                                                    value={
                                                        new Date(event.starting)
                                                    }
                                                    mode="datetime"
                                                    firstDayOfWeek={1}
                                                    display="default"
                                                    locale="de-DE"
                                                    onChange={(
                                                        ev,
                                                        selectedDate
                                                    ) =>
                                                        setEvent(cur => {
                                                            return {
                                                                ...cur,
                                                                starting:
                                                                    selectedDate.getTime(),
                                                            };
                                                        })
                                                    }
                                                    minimumDate={
                                                        new Date(Date.now())
                                                    }
                                                    maximumDate={
                                                        new Date(
                                                            2100,
                                                            0,
                                                            0,
                                                            0,
                                                            0,
                                                            0
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <>
                                                    <Pressable
                                                        style={[
                                                            styles.timesContainerAndroid,
                                                            style.Psm,
                                                            style.bgBlue,
                                                        ]}
                                                        onPress={() => {
                                                            openDatePickerAndroid(
                                                                {
                                                                    value: new Date(
                                                                        event.starting
                                                                    ),
                                                                    is24Hour: true,
                                                                    mode: "date",
                                                                    locale: "de-DE",
                                                                    minimumDate:
                                                                        new Date(
                                                                            Date.now()
                                                                        ),
                                                                    maximumDate:
                                                                        new Date(
                                                                            2100,
                                                                            0,
                                                                            0,
                                                                            0,
                                                                            0,
                                                                            0
                                                                        ),
                                                                    onChange: (
                                                                        ev,
                                                                        selectedDate
                                                                    ) =>
                                                                        setEvent(
                                                                            cur => {
                                                                                return {
                                                                                    ...cur,
                                                                                    starting:
                                                                                        selectedDate.getTime(),
                                                                                };
                                                                            }
                                                                        ),
                                                                }
                                                            );
                                                        }}>
                                                        <Text
                                                            style={[
                                                                style.Tmd,
                                                                style.tWhite,
                                                            ]}>
                                                            {event.starting
                                                                ? convertTimestampToDate(
                                                                      event.starting
                                                                  )
                                                                : getLangs(
                                                                      "eventcreate_date"
                                                                  )}
                                                        </Text>
                                                    </Pressable>
                                                    <Pressable
                                                        style={[
                                                            styles.timesContainerAndroid,
                                                            style.Psm,
                                                            style.bgBlue,
                                                            {
                                                                marginLeft:
                                                                    style.defaultMsm,
                                                            },
                                                        ]}
                                                        onPress={() => {
                                                            openDatePickerAndroid(
                                                                {
                                                                    value: new Date(
                                                                        event.starting
                                                                    ),

                                                                    is24Hour: true,
                                                                    mode: "time",
                                                                    locale: "de-DE",
                                                                    style: {
                                                                        marginLeft:
                                                                            style.defaultMsm,
                                                                    },
                                                                    minimumDate:
                                                                        new Date(
                                                                            Date.now()
                                                                        ),
                                                                    maximumDate:
                                                                        new Date(
                                                                            2100,
                                                                            0,
                                                                            0,
                                                                            0,
                                                                            0,
                                                                            0
                                                                        ),
                                                                    onChange: (
                                                                        ev,
                                                                        selectedDate
                                                                    ) =>
                                                                        setEvent(
                                                                            cur => {
                                                                                return {
                                                                                    ...cur,
                                                                                    starting:
                                                                                        selectedDate.getTime(),
                                                                                };
                                                                            }
                                                                        ),
                                                                }
                                                            );
                                                        }}>
                                                        <Text
                                                            style={[
                                                                style.Tmd,
                                                                style.tWhite,
                                                            ]}>
                                                            {event.starting
                                                                ? convertTimestampToTime(
                                                                      event.starting
                                                                  )
                                                                : getLangs(
                                                                      "eventcreate_time"
                                                                  )}
                                                        </Text>
                                                    </Pressable>
                                                </>
                                            )}
                                        </View>
                                    </View>
                                </View>

                                <View style={{ marginTop: style.defaultMsm }}>
                                    <View style={{ maxHeight: 58 }}>
                                        <View
                                            style={[
                                                styles.timesInputContainer,
                                                style.border,
                                                style.oHidden,
                                                style.allMax,
                                                style.Pmd,
                                            ]}>
                                            <View
                                                style={[
                                                    styles.timesIcon,
                                                    style.allCenter,
                                                ]}>
                                                <SVG_Flag
                                                    fill={style.colors.blue}
                                                />
                                            </View>
                                            <View
                                                style={[
                                                    styles.timesInnerContainer,
                                                    style.tWhite,
                                                    style.Tmd,
                                                    style.pH,
                                                ]}>
                                                {Platform.OS === "ios" ? (
                                                    <DateTimePicker
                                                        value={
                                                            new Date(
                                                                event.ending
                                                            )
                                                        }
                                                        mode="datetime"
                                                        firstDayOfWeek={1}
                                                        locale="de-DE"
                                                        onChange={(
                                                            ev,
                                                            selectedDate
                                                        ) =>
                                                            setEvent(cur => {
                                                                return {
                                                                    ...cur,
                                                                    ending: selectedDate.getTime(),
                                                                };
                                                            })
                                                        }
                                                        minimumDate={
                                                            new Date(
                                                                event.starting
                                                                    ? event.starting
                                                                    : Date.now()
                                                            )
                                                        }
                                                        maximumDate={
                                                            new Date(
                                                                2100,
                                                                0,
                                                                0,
                                                                0,
                                                                0,
                                                                0
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <>
                                                        <Pressable
                                                            style={[
                                                                styles.timesContainerAndroid,
                                                                style.Psm,
                                                                style.bgBlue,
                                                            ]}
                                                            onPress={() => {
                                                                openDatePickerAndroid(
                                                                    {
                                                                        value: new Date(
                                                                            event.ending
                                                                        ),

                                                                        is24Hour: true,
                                                                        mode: "date",
                                                                        locale: "de-DE",
                                                                        minimumDate:
                                                                            new Date(
                                                                                event.starting
                                                                                    ? event.starting
                                                                                    : Date.now()
                                                                            ),
                                                                        maximumDate:
                                                                            new Date(
                                                                                2100,
                                                                                0,
                                                                                0,
                                                                                0,
                                                                                0,
                                                                                0
                                                                            ),
                                                                        onChange:
                                                                            (
                                                                                ev,
                                                                                selectedDate
                                                                            ) =>
                                                                                setEvent(
                                                                                    cur => {
                                                                                        return {
                                                                                            ...cur,
                                                                                            ending: selectedDate.getTime(),
                                                                                        };
                                                                                    }
                                                                                ),
                                                                    }
                                                                );
                                                            }}>
                                                            <Text
                                                                style={[
                                                                    style.Tmd,
                                                                    style.tWhite,
                                                                ]}>
                                                                {event.ending
                                                                    ? convertTimestampToDate(
                                                                          event.ending
                                                                      )
                                                                    : getLangs(
                                                                          "eventcreate_date"
                                                                      )}
                                                            </Text>
                                                        </Pressable>
                                                        <Pressable
                                                            style={[
                                                                styles.timesContainerAndroid,
                                                                style.Psm,
                                                                style.bgBlue,
                                                                {
                                                                    marginLeft:
                                                                        style.defaultMsm,
                                                                },
                                                            ]}
                                                            onPress={() => {
                                                                openDatePickerAndroid(
                                                                    {
                                                                        value: new Date(
                                                                            event.ending
                                                                        ),
                                                                        is24Hour: true,
                                                                        mode: "time",
                                                                        locale: "de-DE",
                                                                        style: {
                                                                            marginLeft:
                                                                                style.defaultMsm,
                                                                        },
                                                                        minimumDate:
                                                                            new Date(
                                                                                event.starting
                                                                                    ? event.starting
                                                                                    : Date.now()
                                                                            ),

                                                                        maximumDate:
                                                                            new Date(
                                                                                2100,
                                                                                0,
                                                                                0,
                                                                                0,
                                                                                0,
                                                                                0
                                                                            ),
                                                                        onChange:
                                                                            (
                                                                                ev,
                                                                                selectedDate
                                                                            ) =>
                                                                                setEvent(
                                                                                    cur => {
                                                                                        return {
                                                                                            ...cur,
                                                                                            ending: selectedDate.getTime(),
                                                                                        };
                                                                                    }
                                                                                ),
                                                                    }
                                                                );
                                                            }}>
                                                            <Text
                                                                style={[
                                                                    style.Tmd,
                                                                    style.tWhite,
                                                                ]}>
                                                                {event.ending
                                                                    ? convertTimestampToTime(
                                                                          event.ending
                                                                      )
                                                                    : getLangs(
                                                                          "eventcreate_time"
                                                                      )}
                                                            </Text>
                                                        </Pressable>
                                                    </>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Times Manual */}
                            {/* <View style={{ marginTop: style.defaultMmd }}>
                                <Text
                                    style={[
                                        style.Tmd,
                                        style.tWhite,
                                        { marginBottom: style.defaultMsm },
                                    ]}>
                                    {getLangs("eventcreate_info_times")} (
                                    {getLangs("eventcreate_info_times_hint")}{" "}
                                    DD.MM.YYYY hh:mm)
                                </Text>
                                <InputField
                                    placeholder={getLangs(
                                        "eventcreate_info_times_start"
                                    )}
                                    keyboardType="default"
                                    icon={<SVG_Time fill={style.colors.sec} />}
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
                                        placeholder={getLangs(
                                            "eventcreate_info_times_end"
                                        )}
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
                            </View> */}
                        </View>
                    </View>

                    {/* Add Data */}
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("eventcreate_eventdata_title")}
                            <Text style={style.tBlue}>*</Text>
                        </Text>
                        {/* Checkable Items */}
                        <View style={styles.underSectionContainer}>
                            <Text style={[style.Tmd, style.tWhite]}>
                                {getLangs("eventcreate_eventdata_sub")}
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
                                    {getLangs("eventcreate_eventdata_type")}
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
                                    {getLangs(
                                        "eventcreate_eventdata_entrancefee"
                                    )}
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
                                    {getLangs("eventcreate_eventdata_website")}
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
                                    {getLangs("eventcreate_eventdata_adbanner")}
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
                                    {getLangs("eventcreate_eventdata_tags")}
                                </Text>
                            </View>
                        </View>
                        <Text
                            style={[
                                style.TsmRg,
                                style.tWhite,
                                { marginTop: style.defaultMmd },
                            ]}>
                            <Text style={style.tBlue}>*</Text>{" "}
                            {getLangs("eventcreate_eventdata_hint")}
                        </Text>
                    </View>

                    {/* Type */}
                    {checkedCategories.type ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                {getLangs("eventcreate_type_title")}
                            </Text>
                            <View style={{ marginTop: style.defaultMsm }}>
                                {arraySplitter(Event_Types, 1).map(
                                    (list, listKey) => (
                                        <View
                                            key={listKey}
                                            style={
                                                styles.typeItemListContainer
                                            }>
                                            {list.map((type, key) =>
                                                type !== null ? (
                                                    <SelectableButton
                                                        key={key}
                                                        title={getLangs(type)}
                                                        checked={
                                                            event.eventOptions
                                                                .type !==
                                                            undefined
                                                                ? event
                                                                      .eventOptions
                                                                      .type ===
                                                                  Event_Types.indexOf(
                                                                      type
                                                                  )
                                                                : false
                                                        }
                                                        style={[
                                                            styles.typeItem,
                                                            { flex: 1 },
                                                        ]}
                                                        onPress={() => {
                                                            setEvent(prev => {
                                                                return {
                                                                    ...prev,
                                                                    eventOptions:
                                                                        {
                                                                            ...prev.eventOptions,
                                                                            type: Event_Types.indexOf(
                                                                                type
                                                                            ),
                                                                        },
                                                                };
                                                            });
                                                        }}
                                                    />
                                                ) : (
                                                    <View
                                                        key={key}
                                                        style={[
                                                            styles.typeItem,
                                                            { flex: 1 },
                                                        ]}
                                                    />
                                                )
                                            )}
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
                                {getLangs("eventcreate_entrancefee_title")}
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
                                    {getLangs("eventcreate_entrancefee_sub")}
                                </Text>
                                <InputField
                                    placeholder={getLangs(
                                        "eventcreate_entrancefee_inputplaceholder"
                                    )}
                                    keyboardType="numeric"
                                    icon={<SVG_Cash fill={style.colors.blue} />}
                                    maxLength={8}
                                    value={event.eventOptions.entrance_fee}
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
                                {getLangs("eventcreate_website_title")}
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
                                    {getLangs("eventcreate_website_sub")}
                                </Text>
                                <InputField
                                    placeholder={getLangs(
                                        "eventcreate_website_inputplaceholder"
                                    )}
                                    keyboardType="url"
                                    maxLength={128}
                                    icon={<SVG_Web fill={style.colors.blue} />}
                                    value={event.eventOptions.website}
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
                    {fromEdit ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                {getLangs("eventcreate_adbanner_title")}
                            </Text>
                            <Text
                                style={[
                                    style.Tmd,
                                    style.tWhite,
                                    { marginTop: style.defaultMmd },
                                ]}>
                                {getLangs("eventcreate_adbanner_edithint")}
                            </Text>
                        </View>
                    ) : checkedCategories.adBanner ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                {getLangs("eventcreate_adbanner_title")}
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
                                                {getLangs(
                                                    "eventcreate_adbanner_imghint"
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
                        </View>
                    ) : null}

                    {/* Tags */}
                    {checkedCategories.tags ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                {getLangs("eventcreate_tags_title")}
                            </Text>

                            {Platform.OS === "ios" ? (
                                <View style={{ marginTop: style.defaultMmd }}>
                                    <ScrollView
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        horizontal
                                        scrollEnabled
                                        automaticallyAdjustKeyboardInsets
                                        automaticallyAdjustContentInsets
                                        hitSlop={25}
                                        bounces
                                        nestedScrollEnabled
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
                                                                .tags !==
                                                            undefined
                                                                ? event.eventOptions.tags.includes(
                                                                      Event_Tags.indexOf(
                                                                          tag
                                                                      )
                                                                  )
                                                                : false
                                                        }
                                                        title={getLangs(tag)}
                                                        style={[
                                                            styles.typeItem,
                                                            { flex: 1 },
                                                        ]}
                                                        onPress={() => {
                                                            let t = [].concat(
                                                                event
                                                                    .eventOptions
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
                                                                    eventOptions:
                                                                        {
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
                            ) : (
                                <View style={styles.androidTagsView}>
                                    {Event_Tags.map((tag, key) => (
                                        <Tag
                                            key={key}
                                            checked={
                                                event.eventOptions.tags !==
                                                undefined
                                                    ? event.eventOptions.tags.includes(
                                                          Event_Tags.indexOf(
                                                              tag
                                                          )
                                                      )
                                                    : false
                                            }
                                            title={getLangs(tag)}
                                            style={styles.typeItem}
                                            onPress={() => {
                                                let t = [].concat(
                                                    event.eventOptions.tags
                                                        ? event.eventOptions
                                                              .tags
                                                        : []
                                                );
                                                if (
                                                    !t.includes(
                                                        Event_Tags.indexOf(tag)
                                                    )
                                                )
                                                    t.push(
                                                        Event_Tags.indexOf(tag)
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
                                            setEvent(prev => {
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
                                                event.group == group.id
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
                                                event.group == group.id
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
                    {/* #endregion */}

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
                            title: insertCharacterOnCursor(
                                event.title,
                                cursorPos,
                                l
                            ),
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
                            description: insertCharacterOnCursor(
                                event.description,
                                cursorPos,
                                l
                            ),
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
    mapPin: {
        width: 32,
        height: 32,
        zIndex: 99,
        position: "absolute",
        transform: [
            {
                translateY: -16,
            },
        ],
        ...style.boxShadow,
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

    tagLineContainer: {
        flexDirection: "row",
    },
    androidTagsView: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: style.defaultMmd,
    },

    timesInputContainer: {
        flexDirection: "row",
        borderRadius: 10,
        zIndex: 10,
        borderColor: style.colors.blue,
        alignItems: "center",
        maxHeight: 58,
    },
    timesInnerContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    timesIcon: {
        aspectRatio: 1,
        height: "100%",
        maxHeight: 24,
        maxWidth: 24,
        marginRight: style.defaultMsm,
    },
    timesContainerAndroid: {
        borderRadius: 10,
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
});
