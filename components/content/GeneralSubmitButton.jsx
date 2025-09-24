import { View, StyleSheet, Pressable, Text, Image } from "react-native";

import * as s from "../../styles";

import { LinearGradient } from "expo-linear-gradient";

import { General_Group } from "../../constants/content/GroupData";
import { getLangs } from "../../constants/langs";

export default function GeneralSubmitButton({ style, onPress }) {
    return (
        <View style={[style, styles.shadow, s.oVisible]}>
            <Pressable style={[styles.container, s.oHidden]} onPress={onPress}>
                <Image
                    style={styles.image}
                    source={{ uri: General_Group.imgUri }}
                    resizeMode="cover"
                    resizeMethod="resize"
                />

                <View style={[s.allMax, styles.contentContainer]}>
                    <LinearGradient
                        colors={["transparent", s.colors.black]}
                        style={[styles.contentInnerContainer, s.pH]}>
                        <Text
                            style={[
                                s.tWhite,
                                s.Tmd,
                                {
                                    fontFamily: "Barlow_Bold",
                                    textAlign: "center",
                                },
                            ]}>
                            {getLangs("destselect_generalbutton_title")}
                        </Text>
                        <Text
                            style={[
                                s.tWhite,
                                s.TsmRg,
                                {
                                    marginVertical: s.defaultMsm,
                                    textAlign: "center",
                                },
                            ]}>
                            {getLangs("destselect_generalbutton_sub")}
                        </Text>
                    </LinearGradient>
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    shadow: {
        alignSelf: "center",
        width: "75%",

        // Shadow
        shadowRadius: 25,
        shadowOpacity: 0.66,
        shadowColor: s.colors.blue,
        shadowOffset: {
            width: 0,
            height: -2,
        },
        borderRadius: 10,
        backgroundColor: s.colors.black,

        borderColor: s.colors.blue,
        borderWidth: 1,
    },
    container: {
        width: "100%",
        zIndex: 3,
        borderRadius: 10,
        flexDirection: "column",
        aspectRatio: 2,
    },
    innerContainer: {
        ...s.allMax,
    },
    image: {
        width: "100%",
        height: "100%",
    },

    contentContainer: {
        position: "relative",
        flex: 1,
        justifyContent: "flex-end",
    },
    contentInnerContainer: {
        width: "100%",
        aspectRatio: 3 / 2,
        justifyContent: "flex-end",
        paddingVertical: s.Pmd.paddingVertical,
    },
});
