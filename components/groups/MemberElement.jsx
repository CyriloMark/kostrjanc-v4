import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";

import * as s from "../../styles";

// import Firebase
import { get, child, ref, getDatabase } from "firebase/database";

// import SVGs
import SVG_Close from "../../assets/svg/Basket";

// import Constants
import { User_Placeholder } from "../../constants/content/PlaceholderData";

export default function MemberElement({ style, id, onPress, selectable }) {
    const [name, setName] = useState(User_Placeholder.name);

    const loadData = () => {
        get(child(ref(getDatabase()), `users/${id}/name`))
            .then(nameSnap => {
                if (nameSnap.exists()) setName(nameSnap.val());
            })
            .catch(error =>
                console.log(
                    "error in components/groups/MemberElement.jsx",
                    "loadData",
                    error.code
                )
            );
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <View style={style}>
            <Pressable
                style={[
                    s.allCenter,
                    s.border,
                    s.Psm,
                    styles.container,
                    {
                        borderColor: s.colors.red,
                        opacity: selectable ? 1 : 0.5,
                    },
                ]}
                onPress={selectable ? onPress : null}>
                {selectable ? (
                    <View style={styles.iconContainer}>
                        <SVG_Close style={s.allMax} fill={s.colors.red} />
                    </View>
                ) : null}
                <Text
                    style={[
                        s.TsmRg,
                        {
                            textAlign: "center",
                            color: s.colors.red,
                        },
                    ]}>
                    {name}
                </Text>
            </Pressable>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        // width: "100%",
        borderRadius: 10,
        flexDirection: "row",
    },

    iconContainer: {
        width: 12,
        height: 12,
        marginRight: s.defaultMsm,
    },
});
