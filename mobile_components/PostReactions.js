import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Icon } from "react-native-elements";

import postStore from "../../stores/PostStore";
import userStore from "../../stores/UserStore";
import nav from "../../helpers/NavigatorHelper";
import { viewStyles } from "../../assets/styles/AppStyles";
import Header from "../reusable/Header";

const supportedReactions = [
  { title: "like", icon: "md-heart-outline", type: "ionicon" }
];

export default observer(({ post, style }) => {
  return (
    <View className="PostReactions">
      {supportedReactions.map((reaction, i) => {
        const { title, icon, type } = reaction;
        const userReacted = postStore.userDidReactToPost(title, post.id);
        const numReactions = postStore.getNumReactions(title, post.id);
        const capitalizedTitle =
          title && title.charAt(0).toUpperCase() + title.substring(1);

        return (
          <View style={[{ flexDirection: "row" }, style]} key={i}>
            <Icon
              color={userReacted ? "#1e87f0" : "gray"}
              name={icon}
              type={type}
              onPress={() => {
                return userStore.user
                  ? postStore[
                      userReacted ? "removeReactionOnPost" : "reactToPost"
                    ](post.id, title)
                  : alert("You must login first");
              }}
            />
            {numReactions > 0 && (
              <Text
                style={{
                  marginLeft: 3,
                  color: userReacted ? "#1e87f0" : "gray"
                }}
              >
                {numReactions}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({});
