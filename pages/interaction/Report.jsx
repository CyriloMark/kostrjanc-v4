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

import { Report_Placeholder } from "../../constants/content/PlaceholderData";
import { Report_Types } from "../../constants/content/report";
import { getLangs } from "../../constants/langs";
import { getUnsignedTranslationText } from "../../constants/content/translation";

import BackHeader from "../../components/BackHeader";
import EnterButton from "../../components/auth/EnterButton";
import TextField from "../../components/TextField";
import SelectableButton from "../../components/event/SelectableButton";
import AccessoryView from "../../components/AccessoryView";
import makeRequest from "../../constants/request";
import { ActivityIndicator } from "react-native-paper";
import checkForAutoCorrect from "../../constants/content/autoCorrect";

let reporting = false;

export default function Report({ navigation, route }) {
    const { item, type } = route.params;

    const [reportData, setReportData] = useState(Report_Placeholder);
    const [buttonChecked, setButtonChecked] = useState(false);

    const [loading, setLoading] = useState(false);

    const [autoCorrect, setAutoCorrect] = useState({
        status: 100,
        content: [],
    });

    const itemType = () => {
        switch (type) {
            case 0:
                return getLangs("report_post");
            case 1:
                return getLangs("report_event");
            case 2:
                return getLangs("report_user");
            default:
                return "";
        }
    };

    let checkButton = () => {
        let inputValid = false;
        if (
            reportData.description.length !== 0 &&
            item &&
            reportData.type !== -1
        )
            inputValid = true;
        setButtonChecked(inputValid);
    };

    const setUnfullfilledAlert = () => {
        let missing = "";
        if (reportData.type === -1) missing += `\n${getLangs("missing_type")}`;
        if (
            !(
                reportData.description.length > 0 &&
                reportData.description.length <= 512
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

    useEffect(() => {
        reporting = false;
        checkButton();
    }, [reportData]);

    const report = async () => {
        if (reporting) return;
        reporting = true;

        setLoading(true);

        let response = await makeRequest("/mod/report", {
            reason: `přičina: ${
                reportData.description
            } typ problema: ${getLangs(
                `report_reporttypes_${reportData.type}`
            )}`,
            type: type == 0 ? "post" : "event",
            id: item.id,
        });

        if (response == "content has already been reported!") {
            Alert.alert(
                getLangs("report_successful_title"),
                `${item.title} (${itemType()}) ${getLangs(
                    "report_successful_sub"
                )}`,
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
            );
        } else if (response == "reported succesfully") {
            Alert.alert(
                getLangs("report_successful_title"),
                `${item.title} (${itemType()}) ${getLangs(
                    "report_successful_sub"
                )}`,
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
            );
        } else {
            Alert.alert(
                getLangs("report_unsuccessful_title"),
                getLangs("report_unsuccessful_sub"),
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
            );
        }

        setLoading(false);
    };

    return (
        <View style={[style.container, style.bgBlack]}>
            <KeyboardAvoidingView
                style={style.allMax}
                behavior={Platform.OS === "ios" ? "padding" : "height"}>
                {/* Header */}
                <Pressable style={{ zIndex: 10 }}>
                    <BackHeader
                        title={getLangs("report_title")}
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
                    keyboardShouldPersistTaps="handled"
                    automaticallyAdjustKeyboardInsets
                    automaticallyAdjustContentInsets
                    snapToAlignment="center"
                    snapToEnd>
                    <Text style={[style.Ttitle2, style.tWhite]}>
                        {getLangs("report_sub")} "
                        {type === 2
                            ? item.name
                            : getUnsignedTranslationText(item.title)}
                        " ({itemType()})
                    </Text>
                    {/* Type */}
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("report_typetitle")}
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
                                    title={getLangs(item)}
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
                            {getLangs("report_additionalinfomation")}
                        </Text>
                        <TextField
                            placeholder={getLangs(
                                "input_placeholder_description"
                            )}
                            value={reportData.description}
                            inputAccessoryViewID={
                                "report_Description_InputAccessoryViewID"
                            }
                            maxLength={512}
                            supportsAutoCorrect
                            onChangeText={async val => {
                                setReportData({
                                    ...reportData,
                                    description: val,
                                });

                                const autoC = await checkForAutoCorrect(val);
                                setAutoCorrect(autoC);
                            }}
                            autoCorrection={autoCorrect}
                            applyAutoCorrection={word => {
                                setReportData(prev => {
                                    let desc = prev.description.split(" ");
                                    desc.pop();
                                    desc.push(word);
                                    let newDesc = "";
                                    desc.forEach(el => (newDesc += `${el} `));

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

                    <View style={[style.allCenter, styles.button]}>
                        {loading ? (
                            <ActivityIndicator color={style.colors.white} />
                        ) : (
                            <EnterButton
                                onPress={() => {
                                    if (buttonChecked) report();
                                    else setUnfullfilledAlert();
                                }}
                                checked={buttonChecked}
                            />
                        )}
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
        marginVertical: style.defaultMlg,
    },
});
