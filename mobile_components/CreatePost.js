import React, { Component } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";

import nav from "../../helpers/navigatorHelper";
import postStore from "../../stores/postStore";
import userStore from "../../stores/UserStore";
import { Avatar, Screen, TextArea } from "../reusable";

export default class CreatePost extends Component {
  state = {
    body: ""
  };

  handleSubmit = () => {
    const { body } = this.state;
    if (!body) return;
    postStore.createPost({ body });
    nav.goBack();
  };

  render() {
    const user = userStore.user;
    return (
      <Screen title="New Post">
        <View style={styles.postContainer}>
          <Avatar src={user.iconUrl} />
          <TextArea
            onChangeText={body => this.setState({ body })}
            value={this.state.body}
            placeholder="Say something.."
            autoFocus
            underlineColorAndroid="transparent"
            style={{
              flex: 2,
              paddingHorizontal: 5
            }}
            maxHeight={220}
          />
          <Icon
            name={Platform.OS === "ios" ? "ios-send-outline" : "md-send"}
            type="ionicon"
            onPress={this.handleSubmit}
            color="#1e87f0"
          />
        </View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  postContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  }
});
