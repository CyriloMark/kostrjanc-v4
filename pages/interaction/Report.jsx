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
    ActivityIndicator,
} from "react-native";

import * as style from "../../styles";

import { Report_Placeholder } from "../../constants/content/PlaceholderData";
import { Report_Types } from "../../constants/content/report";
import { getLangs } from "../../constants/langs";
import { getUnsignedTranslationText } from "../../constants/content/translation";
import makeRequest from "../../constants/request";
import checkForAutoCorrectInside, {
    getCursorPosition,
} from "../../constants/content/autoCorrect";
import { insertCharacterOnCursor } from "../../constants/content";

import BackHeader from "../../components/BackHeader";
import EnterButton from "../../components/auth/EnterButton";
import TextField from "../../components/TextField";
import SelectableButton from "../../components/event/SelectableButton";
import AccessoryView from "../../components/AccessoryView";

let reporting = false;
let cursorPos = -1;

export default function Report({ navigation, route }) {
    const { item, type } = route.params;

    const [reportData, setReportData] = useState(Report_Placeholder);
    const [buttonChecked, setButtonChecked] = useState(false);

    const [loading, setLoading] = useState(false);

    const [autoCorrect, setAutoCorrect] = useState({
        status: 100,
        content: [],
    });

    useEffect(() => {
        cursorPos = -1;
        reporting = false;
    }, []);

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

        if (response.code == 290)
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
                            setLoading(false);
                        },
                    },
                ]
            );
        else {
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
                            onSelectionChange={async e => {
                                cursorPos = e.nativeEvent.selection.start;

                                const autoC = await checkForAutoCorrectInside(
                                    reportData.description,
                                    cursorPos
                                );
                                setAutoCorrect(autoC);
                            }}
                            onChangeText={async val => {
                                // Check Selection
                                cursorPos = getCursorPosition(
                                    reportData.description,
                                    val
                                );

                                // Add Input to Post Data -> Changes Desc
                                setReportData({
                                    ...reportData,
                                    description: val,
                                });

                                // Auto Correct
                                const autoC = await checkForAutoCorrectInside(
                                    val,
                                    cursorPos
                                );
                                setAutoCorrect(autoC);
                            }}
                            autoCorrection={autoCorrect}
                            applyAutoCorrection={word => {
                                setReportData(prev => {
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
                            description: insertCharacterOnCursor(
                                prev.description,
                                cursorPos,
                                l
                            ),
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
    },

    button: {
        marginVertical: style.defaultMlg,
    },
});
