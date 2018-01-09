import React from "react";
import { observer } from "mobx-react";

import postStore from "../../../stores/PostStore";

const supportedReactions = [{ title: "like", icon: "heart" }];

export default observer(({ post }) => {
  return (
    <span className="PostReactions">
      {supportedReactions.map(reaction => {
        const { title, icon } = reaction;
        const userReacted = postStore.userDidReactToPost(title, post.id);
        const numReactions = postStore.getNumReactions(title, post.id);
        const capitalizedTitle =
          title && title.charAt(0).toUpperCase() + title.substring(1);

        return (
          <span className="uk-margin-small-right">
            <Icon
              className={
                "uk-icon " + (userReacted ? "uk-text-primary uk-text-bold" : "")
              }
              type={icon}
              title={
                userReacted ? "Undo " + capitalizedTitle : capitalizedTitle
              }
              uk-tooltip="pos:top"
              onClick={e => {
                postStore[userReacted ? "removeReactionOnPost" : "reactToPost"](
                  post.id,
                  title
                );
              }}
            />
            {numReactions > 0 && (
              <span
                className={
                  "uk-margin-small-left" +
                  (userReacted ? " uk-text-primary" : "")
                }
              >
                {numReactions}
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
});

const Icon = props => {
  //eslint-disable-next-line
  return <a uk-icon={"icon: " + props.type} {...props} />;
};
