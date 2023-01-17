import React from "react";
import { StyleSheet, View } from "react-native";

import * as style from "../../styles";

import AppHeader from "../../components/landing/AppHeader";

export default function Landing({ navigation }) {
    return (
        <View style={[style.container, style.bgBlack]}>
            <AppHeader
                pb={"https://www.sorbisches-gymnasium.de/images/Logo/logo.jpg"}
                onContentPress={() => navigation.navigate("content")}
            />
        </View>
    );
}

const styles = StyleSheet.create({});
