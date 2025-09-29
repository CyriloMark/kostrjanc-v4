import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Pressable,
    Image,
    KeyboardAvoidingView,
    Alert,
    ActivityIndicator,
    Platform,
} from "react-native";

import * as style from "../styles";

import { LinearGradient } from "expo-linear-gradient";

//#region import Reanimated
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

//#region import Constants
import {
    checkLinkingSubmitButton,
    confirmLinkings,
    fetchUsers,
    publishLinkedContent,
    readLinkings,
} from "../constants/content/linking";
import { getLangs } from "../constants/langs";

//#region import Components
import BackHeader from "../components/BackHeader";
import EnterButton from "../components/auth/EnterButton";
import InputField from "../components/InputField";

//#region import SVGs
import SVG_Add from "../assets/svg/Add";
import SVG_Pencil from "../assets/svg/Pencil";
import SVG_Basket from "../assets/svg/Basket";

export default function LinkingPage({ navigation, route }) {
    const { content, type, fromEdit, furtherEventData } = route.params;

    let btnPressed = false;
    const [uploading, setUploading] = useState(btnPressed);
    const [buttonChecked, setButtonChecked] = useState(false);

    const [userSelection, setUserSelection] = useState({
        visible: false,
        index: [-1, 0],
    });
    const [currentUsernameInput, setCurrentUsernameInput] = useState("");
    const [currentUserSearchResult, setCurrentUserResult] = useState([]);

    //#region Form of Linking Data
    /*
        usersList = [
            [
                { section: "title" }
                {
                    id: xyz,
                    text: "@content"
                },
                { ... }
            ],
            [ ... ]
        ]
    */
    const [usersList, setUsersList] = useState(false);

    useEffect(() => {
        setUsersList(readLinkings(type, content));
    }, []);

    //#region Animation Opacity
    const userCardOpacity = useSharedValue(1);
    const userCardStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(userCardOpacity.value, {
                duration: 250,
                easing: Easing.linear,
            }),
        };
    });

    const searchViewOpacity = useSharedValue(1);
    const searchViewStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(searchViewOpacity.value, {
                duration: 250,
                easing: Easing.linear,
            }),
        };
    });
    //#endregion

    useEffect(() => {
        setButtonChecked(checkLinkingSubmitButton(usersList));
    }, [usersList]);

    //#region Fkt: Submit
    const handleSubmit = async () => {
        if (!buttonChecked) {
            setUnfullfilledAlert();
            return;
        }

        if (btnPressed) return;
        setButtonChecked(false);
        btnPressed = true;
        setUploading(true);

        const updatedContent = confirmLinkings(type, usersList, content);
        const rsp = await publishLinkedContent(
            updatedContent,
            type,
            fromEdit,
            furtherEventData
        );

        console.log(rsp);

        if (rsp) navigation.navigate("landingCreate");
        else {
            btnPressed = false;
            setUploading(false);
            checkButton();
        }
    };

    const setUnfullfilledAlert = () => {
        Alert.alert(
            "Wuzwol wužiwarjow!",
            "Njejsy hišće za wšitke zapřijenja přisłušaceho wužiwarja wuzwolił.",
            [
                {
                    text: "Ok",
                    style: "cancel",
                    isPreferred: true,
                },
            ]
        );
    };

    //#region UserLinkSelect
    const onChange = input => {
        if (input.length === 0) {
            setCurrentUserResult([]);
            return;
        }

        fetchUsers(input)
            .then(rsp => setCurrentUserResult(rsp))
            .catch(error =>
                console.log(
                    "error onChange rsp",
                    "pages/LinkingPage.jsx",
                    error
                )
            );
    };

    const cancelInput = () => {
        setCurrentUsernameInput("");
        setCurrentUserResult([]);
        setUserSelection({
            visible: false,
            index: [-1, 0],
        });
        userCardOpacity.value = 1;
        searchViewOpacity.value = 0;
    };

    const overrideUserLink = user => {
        setUsersList(prev => {
            prev[userSelection.index[0]][userSelection.index[1]].user = user;
            return [...prev];
        });
        setCurrentUsernameInput("");
        setCurrentUserResult([]);
        setUserSelection({
            visible: false,
            index: [-1, 0],
        });
        userCardOpacity.value = 1;
        searchViewOpacity.value = 0;
    };

    return (
        <View style={[style.allMax, style.bgBlack]}>
            {uploading ? (
                <Pressable
                    onPress={() => {}}
                    style={[
                        styles.loadingContainer,
                        style.allCenter,
                        style.allMax,
                    ]}>
                    <ActivityIndicator
                        size={"large"}
                        color={style.colors.blue}
                    />
                </Pressable>
            ) : null}
            <KeyboardAvoidingView
                style={style.allMax}
                behavior={Platform.OS === "ios" ? "padding" : "height"}>
                {
                    //#region Header
                }
                <Pressable style={{ zIndex: 10 }}>
                    <BackHeader
                        onBack={() => navigation.goBack()}
                        showReload={false}
                    />
                </Pressable>

                <ScrollView
                    style={[
                        style.container,
                        style.pH,
                        style.oVisible,
                        { marginTop: style.defaultMsm },
                    ]}
                    scrollEnabled
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    automaticallyAdjustKeyboardInsets
                    automaticallyAdjustContentInsets
                    snapToAlignment="center"
                    snapToEnd>
                    {
                        //#region Page Title
                    }
                    <View>
                        <Text style={[style.tWhite, style.Ttitle2]}>
                            Linking wot wužiwarjow:
                        </Text>
                    </View>

                    {usersList.length
                        ? usersList.map((list, listKey) =>
                              list.length !== 0 ? (
                                  <View
                                      key={listKey}
                                      style={styles.sectionContainer}>
                                      <Text style={[style.tWhite, style.TlgBd]}>
                                          {list[0].section}
                                      </Text>
                                      {list.map((user, key) =>
                                          key === 0 ? null : (
                                              <View
                                                  style={[
                                                      styles.linkingsElement,
                                                      style.pH,
                                                  ]}
                                                  key={key}>
                                                  {
                                                      //#region List: No.
                                                  }
                                                  <Text
                                                      style={[
                                                          style.TsmLt,
                                                          style.tWhite,
                                                      ]}>
                                                      {key}.
                                                  </Text>

                                                  {
                                                      //#region List: Link Content
                                                  }
                                                  <Text
                                                      style={[
                                                          style.Tmd,
                                                          style.tBlue,
                                                          {
                                                              marginLeft:
                                                                  style.defaultMsm,
                                                          },
                                                      ]}>
                                                      {user.text}
                                                  </Text>

                                                  {
                                                      //#region List: Add User
                                                  }
                                                  {user.user === null ? (
                                                      //#region List: No User
                                                      <Animated.View
                                                          style={[
                                                              styles.selectUserContainer,
                                                              style.oHidden,
                                                              userCardStyle,
                                                          ]}>
                                                          <Pressable
                                                              onPress={() => {
                                                                  if (
                                                                      !userSelection.visible
                                                                  ) {
                                                                      userCardOpacity.value = 0.5;
                                                                      searchViewOpacity.value = 1;
                                                                      setUserSelection(
                                                                          {
                                                                              visible: true,
                                                                              index: [
                                                                                  listKey,
                                                                                  key,
                                                                              ],
                                                                          }
                                                                      );
                                                                  }
                                                              }}>
                                                              <LinearGradient
                                                                  style={[
                                                                      style.Pmd,
                                                                      style.allCenter,
                                                                      styles.selectUserInner,
                                                                  ]}
                                                                  colors={[
                                                                      style
                                                                          .colors
                                                                          .blue,
                                                                      style
                                                                          .colors
                                                                          .sec,
                                                                  ]}
                                                                  end={{
                                                                      x: -0.5,
                                                                      y: 0.5,
                                                                  }}
                                                                  locations={[
                                                                      0, 0.75,
                                                                  ]}>
                                                                  <View
                                                                      style={
                                                                          styles.selectUserIcon
                                                                      }>
                                                                      <SVG_Add
                                                                          style={[
                                                                              style.boxShadow,
                                                                              style.oVisible,
                                                                              styles.selectUserIcon,
                                                                          ]}
                                                                          fill={
                                                                              style
                                                                                  .colors
                                                                                  .white
                                                                          }
                                                                      />
                                                                  </View>
                                                                  <Text
                                                                      style={[
                                                                          style.tWhite,
                                                                          style.Tmd,
                                                                          {
                                                                              marginLeft:
                                                                                  style.defaultMmd,
                                                                          },
                                                                      ]}>
                                                                      Wužiwarja
                                                                      wuwolić
                                                                  </Text>
                                                              </LinearGradient>
                                                          </Pressable>
                                                      </Animated.View>
                                                  ) : (
                                                      //#region List: User Card
                                                      <Animated.View
                                                          style={[
                                                              styles.userContainer,
                                                              userCardStyle,
                                                          ]}>
                                                          <Pressable
                                                              style={[
                                                                  styles.userInner,
                                                                  style.Psm,
                                                              ]}
                                                              onPress={() => {
                                                                  if (
                                                                      !userSelection.visible
                                                                  ) {
                                                                      setUserSelection(
                                                                          {
                                                                              visible: true,
                                                                              index: [
                                                                                  listKey,
                                                                                  key,
                                                                              ],
                                                                          }
                                                                      );
                                                                      userCardOpacity.value = 0.5;
                                                                      searchViewOpacity.value = 1;
                                                                  }
                                                              }}>
                                                              <View
                                                                  style={
                                                                      styles.userPbContainer
                                                                  }>
                                                                  <Image
                                                                      source={{
                                                                          uri: user
                                                                              .user
                                                                              .pbUri,
                                                                      }}
                                                                      style={
                                                                          styles.userPb
                                                                      }
                                                                      resizeMode="cover"
                                                                      resizeMethod="auto"
                                                                  />
                                                              </View>
                                                              <Text
                                                                  style={[
                                                                      style.Tmd,
                                                                      style.tWhite,
                                                                      {
                                                                          marginLeft:
                                                                              style.defaultMmd,
                                                                      },
                                                                  ]}>
                                                                  {
                                                                      user.user
                                                                          .name
                                                                  }
                                                              </Text>
                                                          </Pressable>
                                                      </Animated.View>
                                                  )}
                                              </View>
                                          )
                                      )}
                                  </View>
                              ) : null
                          )
                        : null}

                    {
                        //#region User Selection
                    }
                    {userSelection.visible ? (
                        <Animated.View
                            style={[styles.sectionContainer, searchViewStyle]}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                Wuzwolenje wužiwarja za{" "}
                                <Text style={style.tBlue}>
                                    {
                                        usersList[userSelection.index[0]][
                                            userSelection.index[1]
                                        ].text
                                    }
                                </Text>
                            </Text>

                            {
                                //#region Username Entry
                            }
                            <View style={{ marginTop: style.defaultMmd }}>
                                <Text
                                    style={[
                                        style.Tmd,
                                        style.tWhite,
                                        { marginBottom: style.defaultMsm },
                                    ]}>
                                    Mjeno wužiwarja zapodać:
                                </Text>
                                <View style={[styles.userInputContainer]}>
                                    <View style={styles.userInput}>
                                        <InputField
                                            maxLength={32}
                                            keyboardType="default"
                                            textContentType="username"
                                            placeholder={getLangs(
                                                "input_placeholder_username"
                                            )}
                                            value={currentUsernameInput}
                                            inputAccessoryViewID="user_name_InputAccessoryViewID"
                                            icon={
                                                <SVG_Pencil
                                                    fill={style.colors.blue}
                                                />
                                            }
                                            onChangeText={val => {
                                                setCurrentUsernameInput(val);
                                                onChange(val);
                                            }}
                                        />
                                    </View>

                                    <Pressable
                                        onPress={cancelInput}
                                        style={[
                                            styles.cancelContainer,
                                            style.allCenter,
                                        ]}>
                                        <SVG_Basket
                                            fill={style.colors.blue}
                                            style={style.allMax}
                                        />
                                    </Pressable>
                                </View>
                            </View>

                            {
                                //#region User Cards
                            }
                            <View style={{ marginTop: style.defaultMmd }}>
                                {currentUserSearchResult.length !== 0 ? (
                                    currentUserSearchResult.map((user, key) => (
                                        <Pressable
                                            onPress={() =>
                                                overrideUserLink(user)
                                            }
                                            key={key}
                                            style={[
                                                {
                                                    marginTop:
                                                        key > 0
                                                            ? style.defaultMsm
                                                            : 0,
                                                },
                                                styles.userInner,
                                                style.Psm,
                                            ]}>
                                            <View
                                                style={styles.userPbContainer}>
                                                <Image
                                                    source={{
                                                        uri: user.pbUri,
                                                    }}
                                                    style={styles.userPb}
                                                    resizeMode="cover"
                                                    resizeMethod="auto"
                                                />
                                            </View>
                                            <Text
                                                style={[
                                                    style.Tmd,
                                                    style.tWhite,
                                                    {
                                                        marginLeft:
                                                            style.defaultMmd,
                                                    },
                                                ]}>
                                                {user.name}
                                            </Text>
                                        </Pressable>
                                    ))
                                ) : (
                                    <ActivityIndicator
                                        style={{
                                            marginTop: style.defaultMsm,
                                        }}
                                        color={style.colors.blue}
                                        animating
                                    />
                                )}
                            </View>
                        </Animated.View>
                    ) : null}

                    {
                        //#region Submit
                    }
                    <View style={[style.allCenter, styles.button]}>
                        <EnterButton
                            onPress={handleSubmit}
                            checked={buttonChecked}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
        flexDirection: "column",
    },
    button: {
        marginVertical: style.defaultMlg,
    },

    linkingsElement: {
        width: "100%",
        marginTop: style.defaultMmd,
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        // maxHeight: 24,
    },
    userContainer: {
        marginLeft: style.defaultMmd,
    },
    userInner: {
        flexDirection: "row",
        alignItems: "center",
    },
    userPbContainer: {
        aspectRatio: 1,
        width: 32,
        height: 32,
        borderRadius: 100,
        overflow: "hidden",
        justifyContent: "center",
    },
    userPb: {
        width: "100%",
        height: "100%",
    },

    selectUserContainer: {
        // marginTop: style.defaultMsm,
        // maxWidth: Dimensions.get("screen").width,
        maxWidth: "100%",
        borderRadius: 25,
        marginLeft: style.defaultMlg,
    },
    selectUserInner: {
        flexDirection: "row",
        justifyContent: "center",
    },
    selectUserIcon: {
        aspectRatio: 1,
        maxWidth: 12,
        maxHeight: 12,
    },

    userInputContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    userInput: {
        flex: 0.8,
    },
    cancelContainer: {
        aspectRatio: 1,
        maxHeight: 32,
        maxWidth: 58,
        marginLeft: style.defaultMsm,
        flex: 0.2,
    },

    loadingContainer: {
        position: "absolute",
    },
});
