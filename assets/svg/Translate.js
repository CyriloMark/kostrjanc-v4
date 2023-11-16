import Svg, { Path, G, Rect } from "react-native-svg";

import { Alert } from "react-native";

import * as style from "../../styles";

import { getLangs } from "../../constants/langs";

export default function Translate(props) {
    return (
        <Svg
            onPress={() =>
                Alert.alert(
                    getLangs("translation_title"),
                    getLangs("translation_sub"),
                    [
                        {
                            isPreferred: true,
                            style: "default",
                            text: "Ok",
                        },
                    ]
                )
            }
            style={[
                props.style,
                style.boxShadow,
                {
                    shadowColor: style.colors.white,
                    shadowOpacity: 0.2,
                    shadowRadius: 5,
                    elevation: 5,
                },
            ]}
            viewBox="0 0 500 416.67">
            <G>
                <Path
                    fill={"#000000"}
                    d="m25,0h350C388.8,0,400,11.2,400,25v58.33H0V25C0,11.2,11.2,0,25,0Z"
                />
                <Rect
                    fill={"#dd0b15"}
                    x="0"
                    y="83.33"
                    width="400"
                    height="83.33"
                />
                <Path
                    fill={"#ffcf02"}
                    d="m0,166.67h400v58.33c0,13.8-11.2,25-25,25H25C11.2,250,0,238.8,0,225v-58.33H0Z"
                />
            </G>

            <G data-name="DE">
                <Path
                    fill={"#174194"}
                    d="m125,166.67h350c13.8,0,25,11.2,25,25v58.33H100v-58.33c0-13.8,11.2-25,25-25Z"
                />
                <Rect
                    fill={"#cf1323"}
                    x="100"
                    y="250"
                    width="400"
                    height="83.33"
                />
                <Path
                    fill={"#ffffff"}
                    d="m100,333.33h400v58.33c0,13.8-11.2,25-25,25H125c-13.8,0-25-11.2-25-25v-58.33h0Z"
                />
            </G>
        </Svg>
    );
}
