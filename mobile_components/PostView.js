import React from "react";
import { observer } from "mobx-react";
import { KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";

import postStore from "../../stores/postStore";
import nav from "../../helpers/navigatorHelper";
import Header from "../reusable/Header";
import Post from "./Post";

@observer
export default class PostView extends React.Component {
  state = {};

  render() {
    const routeInfo = nav.getCurrentRoute();
    const postId = routeInfo && routeInfo.params && routeInfo.params.id;
    const isReplying =
      routeInfo && routeInfo.params ? routeInfo.params.isReplying : false;
    const post = postStore.getPostById(postId);

    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <Header title="Post" />
        <ScrollView
          ref={ref => (this.scrollView = ref)}
          keyboardShouldPersistTaps="handled"
        >
          <Post
            post={post}
            displayComments={true}
            isReplying={isReplying}
            scrollToEnd={() => {
              this.scrollView.scrollToEnd({ animated: true });
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({});
