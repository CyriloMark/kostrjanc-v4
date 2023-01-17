import React from "react";
import { StyleSheet, View } from "react-native";

import ContentHeader from "../../components/content/ContentHeader";

import * as style from "../../styles";

export default function Content({ navigation }) {
    return (
        <View style={[style.container, style.bgBlack]}>
            <ContentHeader />
        </View>
    );
}

const styles = StyleSheet.create({});
