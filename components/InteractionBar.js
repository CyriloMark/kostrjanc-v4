import React from "react";
import { Pressable, View, StyleSheet, Text, ScrollView } from "react-native";

import * as s from "../styles/index";

import { LinearGradient } from "expo-linear-gradient";

//#region import SVGs
import SVG_Basket from "../assets/svg/Basket";
import SVG_Share from "../assets/svg/Share";
import SVG_Warn from "../assets/svg/Warn";
import SVG_Ban from "../assets/svg/Ban";
import SVG_Pencil from "../assets/svg/Pencil_Fill";
import SVG_Event from "../assets/svg/Event";

//#region InteractionBar
/**
 *
 * @param {Object} param0
 * @param {*} param0.style
 * @param {boolean} param0.edit
 * @param {boolean} param0.delete
 * @param {boolean} param0.share
 * @param {boolean} param0.warn
 * @param {boolean} param0.ban
 * @param {boolean} param0.calendar
 * @param {function} param0.onEdit
 * @param {function} param0.onDelete
 * @param {function} param0.onShare
 * @param {function} param0.onWarn
 * @param {function} param0.onBan
 * @param {function} param0.onCalendar
 * @returns
 */
export default function InteractionBar({
    style,

    edit,
    calendar,
    del,
    share,
    warn,
    ban,
    onDelete,
    onEdit,
    onShare,
    onWarn,
    onBan,
    onCalendar,
}) {
    return (
        <View style={style}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal
                style={[s.oVisible]}
                contentContainerStyle={[styles.container]}>
                {
                    //#region Share
                }
                <InteractionButton
                    active={share}
                    onPress={onShare}
                    style={{
                        marginRight: s.defaultMsm,
                    }}
                    icon={<SVG_Share style={s.allMax} fill={s.colors.white} />}
                    text={"Dźělić"}
                />

                {
                    //#region Calendar
                }
                <InteractionButton
                    active={calendar}
                    onPress={onCalendar}
                    style={{
                        marginRight: s.defaultMsm,
                    }}
                    icon={<SVG_Event style={s.allMax} fill={s.colors.white} />}
                    text={"Do kalendera přewzać"}
                />

                {
                    //#region Warn
                }
                <InteractionButton
                    active={warn}
                    onPress={onWarn}
                    style={{
                        marginRight: s.defaultMsm,
                    }}
                    icon={
                        <SVG_Warn old style={s.allMax} fill={s.colors.white} />
                    }
                    text={"Přizjewić"}
                />

                {
                    //#region Ban
                }
                <InteractionButton
                    active={ban}
                    onPress={onBan}
                    style={{
                        marginRight: s.defaultMsm,
                    }}
                    icon={<SVG_Ban style={s.allMax} fill={s.colors.white} />}
                    text={"Banować"}
                />

                {
                    //#region Edit
                }
                <InteractionButton
                    active={edit}
                    onPress={onEdit}
                    style={{
                        marginRight: s.defaultMsm,
                    }}
                    icon={<SVG_Pencil style={s.allMax} fill={s.colors.white} />}
                    text={"Wobdźěłać"}
                />

                {
                    //#region Delete
                }
                <InteractionButton
                    active={del}
                    onPress={onDelete}
                    style={{
                        marginRight: s.defaultMsm,
                    }}
                    icon={<SVG_Basket style={s.allMax} fill={s.colors.white} />}
                    text={"Wotstronić"}
                />
            </ScrollView>
        </View>
    );
}
//#endregion

//#region InteractionButton
function InteractionButton({ style, active, icon, text, onPress }) {
    if (!active) return null;

    return (
        <View style={[style, s.shadowSec, { borderRadius: 25 }]}>
            <Pressable
                style={[styles.buttonContainer, s.oHidden]}
                onPress={onPress}>
                <LinearGradient
                    style={[s.Pmd, s.allCenter, styles.inner]}
                    colors={[s.colors.blue, s.colors.sec]}
                    end={{ x: -0.5, y: 0.5 }}
                    locations={[0, 0.75]}>
                    {/*
                        //#region Icon
                    */}
                    <View style={styles.iconContainer}>{icon}</View>
                    <Text
                        style={[
                            s.Tmd,
                            s.tWhite,
                            {
                                fontFamily: "Barlow_Bold",
                                marginLeft: s.defaultMmd,
                            },
                        ]}>
                        {text}
                    </Text>
                </LinearGradient>
            </Pressable>
        </View>
    );
}
//#endregion

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },

    buttonContainer: {
        borderRadius: 25,
        // height: 34,
    },
    inner: {
        flexDirection: "row",
        // height: "100%",
    },
    iconContainer: {
        width: 16,
        height: 16,
    },
    icon: {
        aspectRatio: 1,
        width: "100%",
    },
});
