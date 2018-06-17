import React from "react";
import { observer } from "mobx-react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Card, Divider, Icon, Button } from "react-native-elements";
import moment from "moment";

import postStore from "../../stores/PostStore";
import userStore from "../../stores/UserStore";
import nav from "../../helpers/NavigatorHelper";
import { colors } from "../../assets/styles/AppStyles";
import { Avatar, TextArea } from "../reusable";
import PostReactions from "./PostReactions";
import CommentTree from "./CommentTree";

@observer
export default class Post extends React.Component {
  state = {
    commentBody: "",
    isReplying: null
  };

  componentWillMount() {
    this.checkIfReplying(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkIfReplying(nextProps);
  }

  checkIfReplying = props => {
    if (props.isReplying && this.state.isReplying === null) {
      this.setState({ isReplying: props.isReplying, commentBody: "" });
    }
  };

  handleCommentChange = text => {
    this.setState({ commentBody: text });
  };

  onCommentSubmit = e => {
    console.log("comment submit");

    Keyboard.dismiss();
    e.preventDefault();

    this.setState({ commentBody: "", isReplying: false });
    postStore.addCommentToPost(
      this.state.commentBody.trim(),
      this.props.post.id
    );
    this.props.scrollToEnd &&
      setTimeout(() => {
        this.props.scrollToEnd();
      }, 300);
  };

  render() {
    const { post, displayComments } = this.props;
    if (!post) {
      return <View />;
    }
    const user = userStore.getUserById(post.createdBy);
    const date = moment(new Date(post.createdAt)).format("MMM Do h:mm A");
    const commentIds = post.comments ? Object.keys(post.comments) : [];
    const props = {
      post,
      user,
      date,
      commentIds,
      displayComments
    };

    return (
      <Card containerStyle={{ padding: 0, margin: 0 }}>
        <View style={styles.cardPadding}>
          <PostHeader {...props} />
          <Text style={{ fontSize: 18, marginTop: 8 }}>
            {post && post.body}
          </Text>
        </View>
        <Divider style={{ backgroundColor: "#efefef" }} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <PostReactions post={post} style={styles.cardPadding} />
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingRight: 15
            }}
            onPress={
              displayComments
                ? () => this.setState({ isReplying: !this.state.isReplying })
                : () =>
                    nav.navigate("PostView", {
                      id: post.id,
                      isReplying: true
                    })
            }
          >
            {displayComments &&
              (this.state.isReplying ? (
                <Text style={{ marginRight: 6, color: colors.warning }}>
                  CANCEL
                </Text>
              ) : (
                <Text style={{ marginRight: 6, color: "#1e87f0" }}>REPLY</Text>
              ))}

            {!displayComments && (
              <Icon name="ios-chatboxes-outline" type="ionicon" />
            )}
            {!displayComments && (
              <Text style={{ marginLeft: 4 }}>{commentIds.length}</Text>
            )}
          </TouchableOpacity>
        </View>
        {displayComments && (
          <View>
            <Divider style={{ backgroundColor: "#efefef" }} />
            {this.state.isReplying && (
              <View>
                <View style={styles.cardPadding}>
                  {userStore.user ? (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flex: 1
                      }}
                    >
                      <TextArea
                        style={{ flex: 9, paddingRight: 2 }}
                        autoFocus={true}
                        onChangeText={this.handleCommentChange}
                        onSubmitEditing={this.onCommentSubmit}
                        value={this.state.commentBody}
                        placeholder="Your reply..."
                        underlineColorAndroid="transparent"
                      />
                      <Icon
                        name={
                          Platform.OS === "ios" ? "ios-send-outline" : "md-send"
                        }
                        type="ionicon"
                        onPress={this.onCommentSubmit}
                        color="#1e87f0"
                      />
                    </View>
                  ) : (
                    <Button
                      title="login to reply"
                      onPress={() => nav.navigate("Login")}
                    />
                  )}
                </View>
                <Divider style={{ backgroundColor: "#efefef" }} />
              </View>
            )}
            <CommentTree commentIds={commentIds} />
          </View>
        )}
      </Card>
    );
  }
}

const PostHeader = ({ post, user, date, displayComments }) => (
  <View style={styles.header}>
    <View style={styles.postInfo}>
      <Avatar
        src={user && user.iconUrl}
        onPress={() => nav.navigate("Profile", { id: post.createdBy })}
      />
      <View style={styles.postDetails}>
        <Text style={{ fontSize: 14, fontWeight: "bold" }}>
          {user && user.displayName}
        </Text>
        <Text style={{ color: "grey", fontSize: 13 }}>{date.toString()}</Text>
      </View>
    </View>
    {post.parent &&
      displayComments && (
        <Button
          title="Parent"
          onPress={() => {
            nav.navigate("PostView", { id: post.parent });
          }}
        />
      )}
  </View>
);

const styles = StyleSheet.create({
  cardPadding: {
    padding: 15
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  postInfo: {
    flexDirection: "row"
  },
  postDetails: {
    marginLeft: 6
  }
});
