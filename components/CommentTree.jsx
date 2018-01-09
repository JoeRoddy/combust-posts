import { Link } from "react-router-dom";
import React, { Component } from "react";
import { observer } from "mobx-react";
import moment from "moment";

import postStore from "../../../stores/PostStore";
import usersStore from "../../../stores/UsersStore";
import PostReactions from "./PostReactions";

const display = "nestedDisplayed_";
const respond = "nestedResponse_";

@observer
export default class CommentTree extends Component {
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

  handleNestedResponseChange = (e, postId) => {
    this.setState({ [respond + postId]: e.target.value });
  };

  handleCommentKeyPress = (e, postId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      postStore.addCommentToPost(this.state[respond + postId], postId);
      this.openNestedComments(postId);
      this.setState({ [respond + postId]: null });
    }
  };

  showMoreComments = () => {
    const totalCommentsDisplayed = this.state.totalCommentsDisplayed + 10;
    this.setState({ totalCommentsDisplayed });
  };

  openNestedComments = commentId => {
    this.setState({ [display + commentId]: true });
  };

  render() {
    const { commentIds, isNested } = this.props;

    const displayedComments =
      this.state.totalCommentsDisplayed > commentIds.length
        ? commentIds
        : commentIds.slice(
            commentIds.length - this.state.totalCommentsDisplayed,
            commentIds.length
          );

    return (
      <div className="uk-margin-small-top">
        {displayedComments.length < commentIds.length && (
          <button
            className="uk-button uk-button-link uk-margin-small-bottom"
            onClick={this.showMoreComments}
          >
            View more comments
          </button>
        )}
        {displayedComments &&
          displayedComments.map((id, i) => {
            return (
              <Comment
                id={id}
                key={i}
                isNested={isNested}
                showNestedComments={this.state[display + id]}
                openNestedComments={this.openNestedComments}
                handleCommentKeyPress={this.handleCommentKeyPress}
                handleNestedResponseChange={this.handleNestedResponseChange}
                currentReply={this.state[respond + id]}
              />
            );
          })}
      </div>
    );
  }
}

const Comment = observer(props => {
  const comment = postStore.getPostById(props.id);
  if (!comment) {
    return <span />;
  }
  const author = usersStore.getUserById(comment.createdBy);
  const isReplying = props.currentReply === "" || props.currentReply;
  const nestedCommentIds = comment.comments
    ? Object.keys(comment.comments)
    : [];
  const date = moment(new Date(comment.createdAt)).format("MMM Do h:mm A");

  return (
    <div className="uk-grid-small uk-flex-top" uk-grid="true">
      <div className="uk-width-auto">
        {author &&
          author.iconUrl && (
            <img
              src={author.iconUrl}
              className="uk-border-circle uk-"
              width="40"
              height="40"
              alt="User Avatar"
            />
          )}
      </div>
      <div className="uk-width-expand">
        {author && (
          <Link to={`/profile/${comment.createdBy}`}>{author.displayName}</Link>
        )}{" "}
        {comment && <span className="uk-text-break">{comment.body}</span>}
        <br />
        <span
          className="uk-text-meta uk-margin-small-right"
          title={date.toString()}
          uk-tooltip="pos:top"
        >
          {moment(comment.createdAt).fromNow()}
        </span>
        {!props.isNested && (
          <span>
            <a
              onClick={e =>
                props.handleNestedResponseChange(
                  { target: { value: isReplying ? null : "" } },
                  props.id
                )
              }
              className="uk-link"
            >
              {isReplying ? "cancel" : "reply"}
            </a>

            {nestedCommentIds.length > 0 &&
              (props.showNestedComments || isReplying ? (
                <CommentTree
                  commentIds={nestedCommentIds}
                  isNested={true} //nested comments can't be responded to
                />
              ) : (
                <a
                  className="uk-margin-small-left"
                  onClick={e => {
                    props.openNestedComments(props.id);
                  }}
                >
                  {nestedCommentIds.length}{" "}
                  {nestedCommentIds.length > 1 ? "replies" : "reply"}
                </a>
              ))}
            {isReplying && (
              <textarea
                className="uk-textarea uk-width-1-1 uk-margin-small-top"
                onChange={e => props.handleNestedResponseChange(e, props.id)}
                onKeyPress={e => props.handleCommentKeyPress(e, props.id)}
                value={props.currentReply}
                placeholder="Your reply..."
                autoFocus={true}
              />
            )}
          </span>
        )}
        {props.isNested &&
          nestedCommentIds.length > 0 && (
            <Link to={"/posts/" + props.id}>view conversation</Link>
          )}
      </div>
      {!props.isNested && <PostReactions post={comment} />}
    </div>
  );
});
