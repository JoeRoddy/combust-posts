import React, { Component } from "react";
import { observer } from "mobx-react";
import moment from "moment";
import { Link } from "react-router-dom";

import postStore from "../../../stores/PostStore";
import CommentTree from "./CommentTree";
import PostReactions from "./PostReactions";

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
    const { post, user } = this.props;
    if (!post) {
      return <span />;
    }

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
              {user &&
                user.iconUrl && (
                  <img
                    src={user.iconUrl}
                    className="uk-border-circle"
                    width="40"
                    height="40"
                    alt="User Avatar"
                  />
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
          <textarea
            className="uk-textarea uk-margin-small"
            onChange={this.handleCommentChange}
            onKeyPress={this.handleCommentKeyPress}
            value={this.state.commentBody}
            placeholder="Your reply..."
          />
          <CommentTree commentIds={commentIds} />
        </div>
      </div>
    );
  }
}
