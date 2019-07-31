import React from "react";
import { observer } from "mobx-react";

import postStore from "../../stores/postStore";
import Post from "./Post";
import "./styles/Posts.scss";

const UserPosts = observer(({ user }) => {
  if (!user) {
    return <span />;
  }
  const posts = postStore.getPostsByUserId(user.id);

  return (
    <div className="ActivityPosts uk-flex uk-flex-top uk-flex-wrap">
      {Object.keys(posts).length > 0 ? (
        Object.keys(posts)
          .reverse()
          .map((postId, i) => <Post key={i} post={posts[postId]} />)
      ) : (
        <h3>This user has no posts yet</h3>
      )}
    </div>
  );
});

export default UserPosts;
