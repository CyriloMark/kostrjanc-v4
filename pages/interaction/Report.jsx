import React, { useEffect, useState } from "react";
import {
    View,
    KeyboardAvoidingView,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    Platform,
    Alert,
} from "react-native";

import * as style from "../../styles";

import { getAuth } from "firebase/auth";
import { ref, set, getDatabase } from "firebase/database";

import { Report_Placeholder } from "../../constants/content/PlaceholderData";
import { Report_Types } from "../../constants/content/report";
import { getData } from "../../constants/storage";

import BackHeader from "../../components/BackHeader";
import EnterButton from "../../components/auth/EnterButton";
import TextField from "../../components/TextField";
import SelectableButton from "../../components/event/SelectableButton";
import AccessoryView from "../../components/AccessoryView";

let reporting = false;

export default function Report({ navigation, route }) {
    const { item, type } = route.params;

    const [reportData, setReportData] = useState(Report_Placeholder);
    const [buttonChecked, setButtonChecked] = useState(false);

    const itemType = () => {
        switch (type) {
            case 0:
                return "post";
            case 1:
                return "ewent";
            case 2:
                return "wužiwar";
            default:
                return "";
        }
    };

    let checkButton = () => {
        let inputValid = false;
        if (reportData.description.length !== 0 && item && reportData.type > -1)
            inputValid = true;
        setButtonChecked(inputValid);
    };

    useEffect(() => {
        checkButton();
    }, [reportData]);

    const report = async () => {
        if (reporting) return;
        reporting = true;

        const db = getDatabase();
        const id = Date.now();
        const uid = await getData("userId").catch(() => {
            return getAuth().currentUser.uid;
        });
        set(ref(db, `reports/${id}`), {
            ...reportData,
            id: id,
            creator: uid,
            item: item,
        })
            .catch(error =>
                console.log(
                    "error pages/interaction/Report.jsx",
                    "report set reports",
                    error.code
                )
            )
            .finally(() =>
                Alert.alert(
                    "Wuspěšnje přizjewjenje problema",
                    `${post.title} (${itemType()}) je so wuspěšnje přizjewił`,
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
    };

    return (
        <View style={[style.container, style.bgBlack]}>
            <KeyboardAvoidingView
                style={style.allMax}
                behavior={Platform.OS === "ios" ? "padding" : "height"}>
                {/* Header */}
                <Pressable style={{ zIndex: 10 }}>
                    <BackHeader
                        title="Problem přizjewić"
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
                    <Text style={[style.Ttitle, style.tWhite]}>
                        Problem z "{type === 2 ? item.name : item.title}"{"\n"}(
                        {itemType()})
                    </Text>
                    {/* Type */}
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            Typ problema:
                        </Text>

                        <View style={{ marginTop: style.defaultMsm }}>
                            {Report_Types.map((item, key) => (
                                <SelectableButton
                                    key={key}
                                    style={styles.typeItem}
                                    checked={
                                        reportData.type ===
                                        Report_Types.indexOf(item)
                                    }
                                    onPress={() =>
                                        setReportData(prev => {
                                            return {
                                                ...prev,
                                                type: Report_Types.indexOf(
                                                    item
                                                ),
                                            };
                                        })
                                    }
                                    title={item}
                                />
                            ))}
                        </View>
                    </View>
                    {/* Description */}
                    <View style={[styles.sectionContainer, style.pH]}>
                        <Text
                            style={[
                                style.Tmd,
                                style.tWhite,
                                { marginBottom: style.defaultMsm },
                            ]}>
                            Přidatne informacije zapodać:
                        </Text>
                        <TextField
                            placeholder="Dodaj informacije..."
                            value={reportData.description}
                            inputAccessoryViewID={
                                "report_Description_InputAccessoryViewID"
                            }
                            onChangeText={val => {
                                setReportData({
                                    ...reportData,
                                    description: val,
                                });
                            }}
                        />
                    </View>

                    <View style={[style.allCenter, styles.button]}>
                        <EnterButton onPress={report} checked={buttonChecked} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <AccessoryView
                onElementPress={l => {
                    setReportData(prev => {
                        return {
                            ...prev,
                            description: prev.description + l,
                        };
                    });
                }}
                nativeID={"report_Description_InputAccessoryViewID"}
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
    typeItem: {
        marginVertical: style.defaultMsm,
        flex: 1,
    },

    button: {
        marginTop: style.defaultMlg,
    },
});
