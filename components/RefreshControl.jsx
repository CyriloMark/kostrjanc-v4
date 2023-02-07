import React from "react";

import { RefreshControl } from "react-native";

import * as style from "../styles";

export default function Refresh({ refreshing, onRefresh }) {
    return (
        <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            title=""
            tintColor={style.colors.blue}
            colors={[style.colors.blue]}
        />
    );
}
