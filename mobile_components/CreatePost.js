import React, { Component } from "react";
import { TextInput, Keyboard, StyleSheet } from "react-native";

import nav from "../../helpers/NavigatorHelper";
import postStore from "../../stores/PostStore";
import userStore from "../../stores/UserStore";
import { Form, Screen, TextArea } from "../reusable";

MAX_INPUT_HEIGHT = 200;

export default class CreatePost extends Component {
  state = {
    body: "",
    inputHeight: 100
  };

  handleSubmit = () => {
    const { body } = this.state;
    if (!body) return;
    postStore.createPost({ body });
    nav.goBack();
  };

  render() {
    return (
      <Screen title="New Post">
        <TextArea
          onChangeText={body => this.setState({ body })}
          value={this.state.body}
          placeholder="Say something.."
        />
        <Button title="Save Post" onPress={this.handleSubmit} />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({});
