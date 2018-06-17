import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-elements";

import postStore from "../../stores/PostStore";
import nav from "../../helpers/NavigatorHelper";
import { colors } from "../../assets/styles/AppStyles";
import Post from "./Post";

const display = "nestedDisplayed_";
const respond = "nestedResponse_";

@observer
export default class CommentTree extends React.Component {
  state = {
    totalCommentsDisplayed: 4
  };

  componentWillUpdate = (nextProps, nextState) => {
    if (this.props.commentIds.length < nextProps.commentIds.length) {
      //when a new comment becomes available, increase number shown
      this.setState({
        totalCommentsDisplayed: this.state.totalCommentsDisplayed + 1
      });
    }
  };

  handleNestedResponseChange = (text, postId) => {
    this.setState({ [respond + postId]: text });
  };

  onCommentSubmit = postId => {
    postStore.addCommentToPost(this.state[respond + postId], postId);
    this.openNestedComments(postId);
    this.setState({ [respond + postId]: null });
  };

  showMoreComments = () => {
    const totalCommentsDisplayed = this.state.totalCommentsDisplayed + 10;
    this.setState({ totalCommentsDisplayed });
  };

  openNestedComments = commentId => {
    this.setState({ [display + commentId]: true });
  };

  render() {
    const { commentIds } = this.props;

    const displayedComments =
      this.state.totalCommentsDisplayed > commentIds.length
        ? commentIds
        : commentIds.slice(
            commentIds.length - this.state.totalCommentsDisplayed,
            commentIds.length
          );

    return (
      <View style={{ paddingTop: 10 }}>
        {displayedComments.length < commentIds.length && (
          <Button
            backgroundColor={colors.primary}
            onPress={this.showMoreComments}
            title="Older Comments"
          />
        )}
        <View style={{ margin: 10, marginBottom: 10 }}>
          {displayedComments &&
            displayedComments.map((id, i) => {
              return <Comment id={id} key={i} />;
            })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  commentBubble: {
    backgroundColor: "#efefef",
    borderRadius: 5,
    padding: 5,
    paddingLeft: 8,
    paddingRight: 8,
    marginLeft: 5
  }
});

const Comment = observer(props => {
  const comment = postStore.getPostById(props.id);
  if (!comment) {
    return <View />;
  }
  return (
    <TouchableOpacity onPress={() => nav.navigate("Posts", { id: comment.id })}>
      <Post post={comment} />
    </TouchableOpacity>
  );
});
