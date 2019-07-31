import React, { Component } from "react";
import { observer } from "mobx-react";
import moment from "moment";
import { Link } from "react-router-dom";

import userStore from "../../stores/UserStore";
import postStore from "../../stores/postStore";
import CommentTree from "./CommentTree";
import PostReactions from "./PostReactions";
import Avatar from "../reusable/Avatar";

@observer
export default class Post extends Component {
  state = {
    commentBody: ""
  };

  handleCommentChange = e => {
    this.setState({ commentBody: e.target.value });
  };

  handleCommentKeyPress = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.onCommentSubmit();
    }
  };

  onCommentSubmit = () => {
    this.setState({ commentBody: "" });
    postStore.addCommentToPost(this.state.commentBody, this.props.post.id);
  };

  render() {
    const { post } = this.props;
    if (!post) {
      return <span />;
    }
    const user = userStore.getUserById(post.createdBy);
    const date = moment(new Date(post.createdAt)).format("MMM Do h:mm A");
    const commentIds = post.comments ? Object.keys(post.comments) : [];

    return (
      <div
        key={post.id}
        className="ActivityPost uk-card uk-card-default uk-width-1@m uk-margin-bottom"
      >
        <div className="uk-card-header">
          <div className="uk-grid-small uk-flex-middle" uk-grid="true">
            <div className="uk-width-auto">
              {user && user.iconUrl && (
                <Avatar src={user.iconUrl} height={40} />
              )}
            </div>
            <div className="uk-width-expand">
              <h3 className="uk-card-title uk-margin-remove-bottom">
                {user && user.displayName}
              </h3>
              <p className="uk-text-meta uk-margin-remove-top uk-flex uk-flex-between">
                <time>{date.toString()}</time>
                {post.parent && (
                  <Link to={post.parent}>View parent conversation</Link>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="uk-card-body">
          <p>{post && post.body}</p>
        </div>
        <div className="uk-card-footer">
          <PostReactions post={post} />
          {userStore.user ? (
            <textarea
              className="uk-textarea uk-margin-small"
              onChange={this.handleCommentChange}
              onKeyPress={this.handleCommentKeyPress}
              value={this.state.commentBody}
              placeholder="Your reply..."
            />
          ) : (
            <span>
              <Link to={"/login"}>
                <span className="uk-padding-small">login to reply</span>
              </Link>
            </span>
          )}
          <CommentTree commentIds={commentIds} />
        </div>
      </div>
    );
  }
}
