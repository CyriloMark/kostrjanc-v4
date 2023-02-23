import Svg, { Path } from "react-native-svg";

export default function Return(props) {
    return (
        <Svg
            style={[
                props.style,
                props.rotation
                    ? {
                          transform: [
                              {
                                  rotate: `${props.rotation}deg`,
                              },
                          ],
                      }
                    : null,
            ]}
            viewBox="0 0 500 420">
            <Path
                d="m25,184h389.14S279.93,44.39,279.93,44.39c-9.76-10.16-9.76-26.62,0-36.78h0c9.76-10.16,25.59-10.16,35.35,0l174.2,181.2c6.36,4.71,10.51,12.44,10.51,21.19h0c0,8.74-4.15,16.47-10.51,21.19l-174.2,181.2c-9.76,10.16-25.59,10.16-35.35,0h0c-9.76-10.16-9.76-26.62,0-36.78l134.21-139.6H25c-13.81,0-25-11.64-25-26h0c0-14.36,11.19-26,25-26Z"
                fill={props.fill}
            />
        </Svg>
    );
}
