import React from "react";
import { observer } from "mobx-react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from "react-native";

import postStore from "../../stores/PostStore";
import userStore from "../../stores/UserStore";
import nav from "../../helpers/NavigatorHelper";
import { viewStyles } from "../../assets/styles/AppStyles";
import Header from "../reusable/Header";
import Post from "./Post";

export default (UserPosts = observer(props => {
  const user = props.user;
  if (!user) return <View />;
  const posts = postStore.getPostsByUserId(user.id);
  const postIds = Object.keys(posts);

  return (
    <ScrollView style={{ marginBottom: 0 }}>
      {postIds.length > 0 ? (
        postIds.reverse().map((postId, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => nav.navigate("Posts", { id: postId })}
          >
            <Post post={posts[postId]} />
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noPostsMsg}>This user has no posts yet</Text>
      )}
    </ScrollView>
  );
}));

const styles = StyleSheet.create({
  noPostsMsg: {
    fontSize: 20,
    paddingTop: 15,
    textAlign: "center"
  }
});
