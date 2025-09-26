import React from "react";
import TComment from "./TComment";
import { View } from "react-native";
import PComment from "./PComment";

export default function Comment({
    navigation,
    style,
    commentData,
    showDate,
    onRemove,
    onPress,
    onCommentUserPress,
}) {
    return (
        <View style={style}>
            {commentData.type === "p" ? (
                <PComment
                    commentData={commentData}
                    showDate={showDate}
                    onCommentUserPress={onCommentUserPress}
                    onPress={() =>
                        navigation.navigate("postView", {
                            id: commentData.content,
                        })
                    }
                    onRemove={() => {}}
                />
            ) : (
                <TComment
                    commentData={commentData}
                    showDate={showDate}
                    onCommentUserPress={onCommentUserPress}
                    onPress={onPress}
                    onRemove={onRemove}
                />
            )}
        </View>
    );
}
