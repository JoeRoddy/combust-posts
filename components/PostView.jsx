import React from "react";
import { observer } from "mobx-react";

import postStore from "../../../stores/PostStore";
import usersStore from "../../../stores/UsersStore";
import Post from "./Post";

const PostView = props => {
  const postId = props.match.params.postId;
  const post = postStore.getPostById(postId);
  const user = post && usersStore.getUserById(post.createdBy);

  return (
    <div className="PostView uk-padding uk-flex uk-flex-center">
      <span className="uk-width-3-4">
        <Post post={post} user={user} />
      </span>
    </div>
  );
};

export default observer(PostView);
