import React from "react";
import { observer } from "mobx-react";

import postStore from "../../stores/postStore";
import Post from "./Post";

const PostView = props => {
  const postId = props.match.params.postId;
  const post = postStore.getPostById(postId);

  return (
    <div className="PostView uk-padding uk-flex uk-flex-center">
      <span className="uk-width-3-4">
        <Post post={post} />
      </span>
    </div>
  );
};

export default observer(PostView);
