import React from "react";
import { observer } from "mobx-react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";

import postStore from "../../stores/PostStore";
import nav from "../../helpers/NavigatorHelper";
import { viewStyles } from "../../assets/styles/AppStyles";
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
