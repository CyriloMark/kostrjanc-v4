import React from "react";

import { Pressable, View } from "react-native";

import MapView, { Marker } from "react-native-maps";
import WebView from "react-native-webview";

import { getUnsignedTranslationText } from "../../constants/content/translation";

/* Crostwitz Center coods:
[
    [51.235, 14.235],
    [51.2425, 14.2525],
];
*/

const MAP_TYPE = 1;

const PIN_URL =
    "https://firebasestorage.googleapis.com/v0/b/kostrjanc.appspot.com/o/pin.png?alt=media&token=6f3538eb-2808-434b-9650-60b400de9637";
const PIN_SHADOW_URL =
    "https://firebasestorage.googleapis.com/v0/b/kostrjanc.appspot.com/o/pin-shadow.png?alt=media&token=1185c69a-fefa-48a3-ae33-4c18152b0064";

export default function Map({
    style,
    title,
    initialRegion,
    accessible,
    onPress,
    onLongPress,
    mapRef,
    marker,
    onMessage,
}) {
    const htmlContent = `
            <html>
            <head>
                <meta name="viewport" content="user-scalable=0">
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
                <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
                <style>
                    body {
                        -ms-touch-action: ${accessible};
                        touch-action: ${accessible};
                    }

                    .leaflet-container {
  touch-action: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
                </style>
            </head>
            <body style="margin:0;padding:0;">
                <div id="map" style="width:100%;height:100%;"></div>

                <script>
                    var icon = L.icon({
                        iconUrl: '${PIN_URL}',
                        shadowUrl: '${PIN_SHADOW_URL}',
                        iconSize: [250/4, 425/4],
                        iconAnchor: [125/4, 425/4],
                        // popupAnchor: [-3, -76],
                        shadowSize:   [250/4*1.2, 425/4*1.2],
                        shadowAnchor: [125/4+5, 425/4+7]
                    });

                    var center = L.latLng(-10.5, -50.5);
                    var map = L.map('map', {
                        zoom: 12,
                        zoomControl: false,
                        zoomSnap: 0.1,
                        dragging: ${accessible},
                        touchZoom: ${accessible},
                        scrollWheelZoom: ${accessible},
                        doubleClickZoom: false,
                        boxZoom: ${accessible},
                        keyboard: ${accessible},
                    }).fitBounds([
                        [${
                            initialRegion.latitude - initialRegion.latitudeDelta
                        }, ${
        initialRegion.longitude - initialRegion.longitudeDelta
    }],
                        [${
                            initialRegion.latitude + initialRegion.latitudeDelta
                        }, ${
        initialRegion.longitude + initialRegion.longitudeDelta
    }]
                    ]);
                    L.tileLayer('https://tile.openstreetmap.de/tiles/osmhrb/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors 2025'
                    }).addTo(map);

                    function animateToPosition(lat, latD, lng, lngD, duration) {
                        map.fitBounds([[lat - latD, lng - lngD], [lat + latD, lng + lngD]], {
                            animate: true,
                            duration: duration // Animation duration in seconds
                        });
                    }
                
                    // Event listener for messages from React Native
                    window.addEventListener('message', function(event) {
                        const data = JSON.parse(event.data);
                        if (data.action === 'animate') {
                            animateToPosition(data.latitude, data.latitudeDelta, data.longitude, data.longitudeDelta, data.duration);
                        }
                    });
                    
                    // Marker
                    if (${marker} == true)
                        L.marker([${initialRegion.latitude}, ${
        initialRegion.longitude
    }], {
                        icon: icon,
                        draggable: false
                    }).addTo(map).bindPopup("${getUnsignedTranslationText(
                        title
                    )}")

                    if (!${accessible}) {
                        map.dragging.disable();
                        map.touchZoom.disable();
                        map.doubleClickZoom.disable();
                        map.scrollWheelZoom.disable();
                        map.boxZoom.disable();
                        map.keyboard.disable();
                        if (map.tap) map.tap.disable();
                    }

                    // Map Bounds Change
                    map.on('moveend', function() {
                        var bounds = map.getBounds();
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                        action: 'boundsChanged',
                        bounds: {
                            north: bounds.getNorth(),
                            south: bounds.getSouth(),
                            east: bounds.getEast(),
                            west: bounds.getWest()
                        }
                        }));
                    });
                </script>
            </body>
            </html>
        `;

    if (MAP_TYPE == 1)
        return (
            <Pressable
                style={style}
                onPress={onPress}
                onLongPress={onLongPress}>
                <WebView
                    ref={mapRef}
                    source={{ html: htmlContent }}
                    style={{ flex: 1, width: "100%" }}
                    bounces={false}
                    scrollEnabled={false}
                    onMessage={onMessage}
                />
            </Pressable>
        );
    else if (MAP_TYPE == 0)
        return (
            <Pressable
                style={style}
                onPress={onPress}
                onLongPress={onLongPress}>
                <MapView
                    ref={mapRef}
                    style={{ flex: 1, width: "100%" }}
                    userInterfaceStyle="dark"
                    accessible={accessible}
                    focusable={accessible}
                    rotateEnabled={accessible}
                    zoomEnabled={accessible}
                    scrollEnabled={accessible}
                    pitchEnabled={accessible}
                    initialRegion={initialRegion}>
                    {marker ? (
                        <Marker
                            draggable={false}
                            tappable={false}
                            accessible={accessible}
                            focusable={accessible}
                            coordinate={initialRegion}
                        />
                    ) : null}
                </MapView>
            </Pressable>
        );
    // return null;
}
