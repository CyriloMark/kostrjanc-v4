import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";

import * as style from "../../styles";

export default function Tag(props) {
    return (
        <View style={props.style}>
            <Pressable
                style={[
                    style.allCenter,
                    style.border,
                    style.Psm,
                    styles.container,
                    {
                        borderColor: !props.selected
                            ? style.colors.blue
                            : style.colors.red,
                    },
                ]}
                onPress={props.onPress}>
                <Text
                    style={[
                        style.TsmRg,
                        {
                            textAlign: "center",
                            color: !props.selected
                                ? style.colors.blue
                                : style.colors.red,
                        },
                    ]}>
                    {props.title}
                </Text>
            </Pressable>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderRadius: 10,
    },
});
