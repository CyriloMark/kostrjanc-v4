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
} from "react-native";

import * as style from "../styles";

import { LinearGradient } from "expo-linear-gradient";

import { child, get, getDatabase, ref } from "firebase/database";

import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

import {
    LINKING_TYPES,
    LINK_SIGN,
    LINK_SPLIT,
    checkForLinkings,
    getLinkingsFromPlainText,
} from "../constants/content/linking";
import { getLangs } from "../constants/langs";
import { getData } from "../constants/storage";

import BackHeader from "../components/BackHeader";
import EnterButton from "../components/auth/EnterButton";
import InputField from "../components/InputField";

import SVG_Add from "../assets/svg/Add";
import SVG_Pencil from "../assets/svg/Pencil";
import SVG_Basket from "../assets/svg/Basket";

let UsersData = null;

export default function LinkingPage({ navigation, route }) {
    const { content, type, origin } = route.params;

    const [buttonVisible, setButtonVisible] = useState(false);

    const [userSelection, setUserSelection] = useState({
        visible: false,
        index: [-1, 0],
    });
    const [currentUsernameInput, setCurrentUsernameInput] = useState("");
    const [currentUserSearchResult, setCurrentUserResult] = useState([]);

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
        getLinkings();
    }, []);

    const getLinkings = () => {
        let output = [];
        switch (type) {
            case LINKING_TYPES.Post:
                if (checkForLinkings(content.title))
                    output.push(
                        getLinkingsFromPlainText(content.title, {
                            section: getLangs("postcreate_info_title"),
                        })
                    );
                else output.push([]);
                if (checkForLinkings(content.description))
                    output.push(
                        getLinkingsFromPlainText(content.description, {
                            section: getLangs("postcreate_info_description"),
                        })
                    );
                else output.push([]);
                setUsersList(output);
                break;
            case LINKING_TYPES.Event:
                if (checkForLinkings(content.title))
                    output.push(
                        getLinkingsFromPlainText(content.title, {
                            section: getLangs("eventcreate_info_title"),
                        })
                    );
                else output.push([]);
                if (checkForLinkings(content.description))
                    output.push(
                        getLinkingsFromPlainText(content.description, {
                            section: getLangs("eventcreate_info_description"),
                        })
                    );
                else output.push([]);
                setUsersList(output);
                break;
            case LINKING_TYPES.Comment:
                output.push(
                    getLinkingsFromPlainText(content, {
                        section: getLangs("content_comments_title"),
                    })
                );
                setUsersList(output);
                break;
            default:
                break;
        }
    };

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
        let confirm = true;
        if (usersList === null) confirm = false;
        else
            for (let i = 0; i < usersList.length; i++)
                for (let j = 1; j < usersList[i].length; j++)
                    if (usersList[i][j].user === null) confirm = false;

        setButtonVisible(confirm);
    }, [usersList]);

    let removeUnnötigEmpties = input => {
        console.log("input", `[${input}]`);
        let output = input
            .split(" ")
            .filter(el => el.length !== 0)
            .join(" ");
        console.log("output", `[${output}]`);
        return output;
    };

    let confirmLinkings = () => {
        if (!buttonVisible) {
            setUnfullfilledAlert();
            return;
        }

        let updatedContent = content;
        // console.log("usersList", usersList);
        switch (type) {
            //#region POST
            case LINKING_TYPES.Post:
                // POST Title
                if (usersList[0].length !== 0) {
                    let post_outputElementsTitle = [];
                    for (let i = 0; i < usersList[0].length; i++) {
                        let start = i === 0 ? 0 : usersList[0][i].start;
                        let end =
                            i !== usersList[0].length - 1
                                ? usersList[0][i + 1].start
                                : content.title.length;

                        let a = content.title.substring(start, end);
                        post_outputElementsTitle.push(a);
                    }

                    let finalTextParts = [];

                    let sortedLinkings = 0;
                    for (let i = 0; i < post_outputElementsTitle.length; i++)
                        if (post_outputElementsTitle[i].includes("@")) {
                            let splittedElements =
                                post_outputElementsTitle[i].split(" ");
                            for (let j = 0; j < splittedElements.length; j++)
                                if (splittedElements[j].includes("@")) {
                                    const currentLink =
                                        usersList[0][sortedLinkings + 1];
                                    sortedLinkings++;
                                    const replacingElement = `${LINK_SIGN}${currentLink.user.id}${LINK_SPLIT}${currentLink.text}${LINK_SPLIT}`;
                                    finalTextParts.push(replacingElement);
                                } else
                                    finalTextParts.push(
                                        removeUnnötigEmpties(
                                            splittedElements[j]
                                        )
                                    );
                        } else
                            finalTextParts.push(
                                removeUnnötigEmpties(
                                    post_outputElementsTitle[i]
                                )
                            );

                    const reducedTextParts = finalTextParts.filter(
                        el => el[0] != [""][0].length
                    );
                    const finalText = reducedTextParts.join(" ");
                    updatedContent.title = finalText;
                }

                // POST Description
                if (usersList[1].length !== 0) {
                    let post_outputElementsDescription = [];
                    for (let i = 0; i < usersList[1].length; i++) {
                        let start = i === 0 ? 0 : usersList[1][i].start;
                        let end =
                            i !== usersList[1].length - 1
                                ? usersList[1][i + 1].start
                                : content.description.length;

                        let a = content.description.substring(start, end);
                        post_outputElementsDescription.push(a);
                    }

                    let finalTextParts = [];

                    let sortedLinkings = 0;
                    for (
                        let i = 0;
                        i < post_outputElementsDescription.length;
                        i++
                    )
                        if (post_outputElementsDescription[i].includes("@")) {
                            let splittedElements =
                                post_outputElementsDescription[i].split(" ");
                            for (let j = 0; j < splittedElements.length; j++)
                                if (splittedElements[j].includes("@")) {
                                    const currentLink =
                                        usersList[1][sortedLinkings + 1];
                                    sortedLinkings++;
                                    const replacingElement = `${LINK_SIGN}${currentLink.user.id}${LINK_SPLIT}${currentLink.text}${LINK_SPLIT}`;
                                    finalTextParts.push(replacingElement);
                                } else
                                    finalTextParts.push(
                                        removeUnnötigEmpties(
                                            splittedElements[j]
                                        )
                                    );
                        } else
                            finalTextParts.push(
                                removeUnnötigEmpties(
                                    post_outputElementsDescription[i]
                                )
                            );

                    console.log(finalTextParts);
                    const reducedTextParts = finalTextParts.filter(
                        el => el[0] != [""][0].length
                    );
                    const finalText = reducedTextParts.join(" ");
                    console.log(finalText);
                    updatedContent.description = finalText;
                }
                break;
            //#endregion
            //#region EVENT
            case LINKING_TYPES.Event:
                // EVENT Title
                if (usersList[0].length !== 0) {
                    let event_outputElementsTitle = [];
                    for (let i = 0; i < usersList[0].length; i++) {
                        let start = i === 0 ? 0 : usersList[0][i].start;
                        let end =
                            i !== usersList[0].length - 1
                                ? usersList[0][i + 1].start
                                : content.title.length;

                        let a = content.title.substring(start, end);
                        event_outputElementsTitle.push(a);
                    }

                    let finalTextParts = [];

                    let sortedLinkings = 0;
                    for (let i = 0; i < event_outputElementsTitle.length; i++)
                        if (event_outputElementsTitle[i].includes("@")) {
                            let splittedElements =
                                event_outputElementsTitle[i].split(" ");
                            for (let j = 0; j < splittedElements.length; j++)
                                if (splittedElements[j].includes("@")) {
                                    const currentLink =
                                        usersList[0][sortedLinkings + 1];
                                    sortedLinkings++;
                                    const replacingElement = `${LINK_SIGN}${currentLink.user.id}${LINK_SPLIT}${currentLink.text}${LINK_SPLIT}`;
                                    finalTextParts.push(replacingElement);
                                } else
                                    finalTextParts.push(
                                        removeUnnötigEmpties(
                                            splittedElements[j]
                                        )
                                    );
                        } else
                            finalTextParts.push(
                                removeUnnötigEmpties(
                                    event_outputElementsTitle[i]
                                )
                            );

                    const reducedTextParts = finalTextParts.filter(
                        el => el[0] != [""][0].length
                    );
                    const finalText = reducedTextParts.join(" ");
                    updatedContent.title = finalText;
                }

                // EVENT Description
                if (usersList[1].length !== 0) {
                    let event_outputElementsDescription = [];
                    for (let i = 0; i < usersList[1].length; i++) {
                        let start = i === 0 ? 0 : usersList[1][i].start;
                        let end =
                            i !== usersList[1].length - 1
                                ? usersList[1][i + 1].start
                                : content.description.length;

                        let a = content.description.substring(start, end);
                        event_outputElementsDescription.push(a);
                    }

                    let finalTextParts = [];

                    let sortedLinkings = 0;
                    for (
                        let i = 0;
                        i < event_outputElementsDescription.length;
                        i++
                    )
                        if (event_outputElementsDescription[i].includes("@")) {
                            let splittedElements =
                                event_outputElementsDescription[i].split(" ");
                            for (let j = 0; j < splittedElements.length; j++)
                                if (splittedElements[j].includes("@")) {
                                    const currentLink =
                                        usersList[1][sortedLinkings + 1];
                                    sortedLinkings++;
                                    const replacingElement = `${LINK_SIGN}${currentLink.user.id}${LINK_SPLIT}${currentLink.text}${LINK_SPLIT}`;
                                    finalTextParts.push(replacingElement);
                                } else
                                    finalTextParts.push(
                                        removeUnnötigEmpties(
                                            splittedElements[j]
                                        )
                                    );
                        } else
                            finalTextParts.push(
                                removeUnnötigEmpties(
                                    event_outputElementsDescription[i]
                                )
                            );

                    const reducedTextParts = finalTextParts.filter(
                        el => el[0] != [""][0].length
                    );
                    const finalText = reducedTextParts.join(" ");
                    updatedContent.description = finalText;
                }
                break;
            //#endregion
            //#region COMMENT
            case LINKING_TYPES.Comment:
                // POST Title
                if (usersList[0].length !== 0) {
                    let comment_outputElementsTitle = [];
                    for (let i = 0; i < usersList[0].length; i++) {
                        let start = i === 0 ? 0 : usersList[0][i].start;
                        let end =
                            i !== usersList[0].length - 1
                                ? usersList[0][i + 1].start
                                : content.length;

                        let a = content.substring(start, end);
                        comment_outputElementsTitle.push(a);
                    }

                    let finalTextParts = [];

                    let sortedLinkings = 0;
                    for (let i = 0; i < comment_outputElementsTitle.length; i++)
                        if (comment_outputElementsTitle[i].includes("@")) {
                            let splittedElements =
                                comment_outputElementsTitle[i].split(" ");
                            for (let j = 0; j < splittedElements.length; j++)
                                if (splittedElements[j].includes("@")) {
                                    const currentLink =
                                        usersList[0][sortedLinkings + 1];
                                    sortedLinkings++;
                                    const replacingElement = `${LINK_SIGN}${currentLink.user.id}${LINK_SPLIT}${currentLink.text}${LINK_SPLIT}`;
                                    finalTextParts.push(replacingElement);
                                } else
                                    finalTextParts.push(
                                        removeUnnötigEmpties(
                                            splittedElements[j]
                                        )
                                    );
                        } else
                            finalTextParts.push(
                                removeUnnötigEmpties(
                                    comment_outputElementsTitle[i]
                                )
                            );

                    const reducedTextParts = finalTextParts.filter(
                        el => el[0] != [""][0].length
                    );
                    const finalText = reducedTextParts.join(" ");
                    updatedContent = finalText;
                }
                break;
            //#endregion
        }

        // Navigate Back
        navigation.navigate(origin, {
            fromLinking: true,
            linkingData: updatedContent,
        });
    };

    let setUnfullfilledAlert = () => {
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
        fetchUsers(input);
    };

    let getSearchResult = text => {
        let output = [];
        let searchQuery = text.toLowerCase();
        for (const key in UsersData) {
            let user = UsersData[key].name.toLowerCase();
            if (user.slice(0, searchQuery.length).indexOf(searchQuery) !== -1) {
                if (currentUsernameInput.length <= 5) {
                    if (!UsersData[key].isBanned) {
                        output.push(UsersData[key]);
                    }
                }
            }
        }
        setCurrentUserResult(output);
    };

    const fetchUsers = text => {
        if (text.length <= 0 || text.length > 64) {
            setCurrentUserResult([]);
            return;
        }

        if (!UsersData) {
            const db = getDatabase();
            getData("userData").then(data => {
                if (data === null) return;
                let users = [];
                if (data.follower) users.push(...data.follower);
                if (data.following) users.push(...data.following);

                const usersFiltered = users.filter(function (item, pos) {
                    return users.indexOf(item) == pos;
                });

                for (let i = 0; i < usersFiltered.length; i++) {
                    get(child(ref(db), `users/${usersFiltered[i]}`))
                        .then(userSnap => {
                            if (userSnap.exists()) {
                                const userData = userSnap.val();
                                if (!userData.isBanned) {
                                    if (UsersData === null)
                                        UsersData = [
                                            {
                                                name: userData.name,
                                                pbUri: userData.pbUri,
                                                id: usersFiltered[i],
                                            },
                                        ];
                                    else
                                        UsersData.push({
                                            name: userData.name,
                                            pbUri: userData.pbUri,
                                            id: usersFiltered[i],
                                        });
                                }
                            }
                        })
                        .finally(() => {
                            if (i === usersFiltered.length - 1)
                                getSearchResult(text);
                        })
                        .catch(error =>
                            console.log(
                                "error pages/create/PostCreate.jsx",
                                "fetchUsers get user",
                                error.code
                            )
                        );
                }
            });
        } else getSearchResult(text);
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
    //#endregion

    return (
        <View style={[style.allMax, style.bgBlack]}>
            <KeyboardAvoidingView
                style={style.allMax}
                behavior={Platform.OS === "ios" ? "padding" : "height"}>
                {/* Header */}
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
                    {/* Name */}
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
                                                  {/* No. */}
                                                  <Text
                                                      style={[
                                                          style.TsmLt,
                                                          style.tWhite,
                                                      ]}>
                                                      {key}.
                                                  </Text>

                                                  {/* Link Content */}
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

                                                  {/* User */}
                                                  {user.user === null ? (
                                                      // No User
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
                                                      // User Card
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

                    {/* User Selection */}
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

                            {/* Mjeno */}
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

                    {/* Button */}
                    <View style={[style.allCenter, styles.button]}>
                        <EnterButton
                            onPress={confirmLinkings}
                            checked={buttonVisible}
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
});
