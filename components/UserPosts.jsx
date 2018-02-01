import React, { Component } from "react";
import { observer } from "mobx-react";

import postStore from "../../stores/PostStore";
import Post from "./Post";
import "./styles/Posts.css";

@observer
export default class UserPosts extends Component {
  render() {
    const user = this.props.user;
    if (!user) {
      return <span />;
    }
    const userId = user.id;
    const posts = postStore.getPostsByUserId(userId);

    return (
      <div className="ActivityPosts uk-flex uk-flex-top uk-flex-wrap">
        {Object.keys(posts).length > 0 ? (
          Object.keys(posts)
            .reverse()
            .map((postId, i) => (
              <Post key={i} post={posts[postId]} user={user} />
            ))
        ) : (
          <h3>This user has no posts yet</h3>
        )}
      </div>
    );
  }
}
