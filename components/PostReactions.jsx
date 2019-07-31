import React from "react";
import { observer } from "mobx-react";

import userStore from "../../stores/UserStore";
import postStore from "../../stores/postStore";
import Icon from "../reusable/Icon";

const supportedReactions = [{ title: "like", icon: "heart" }];

export default observer(({ post }) => {
  return (
    <span className="PostReactions">
      {supportedReactions.map((reaction, i) => {
        const { title, icon } = reaction;
        const userReacted = postStore.userDidReactToPost(title, post.id);
        const numReactions = postStore.getNumReactions(title, post.id);
        const capitalizedTitle =
          title && title.charAt(0).toUpperCase() + title.substring(1);

        return (
          <span className="uk-margin-small-right" key={i}>
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
                return userStore.user
                  ? postStore[
                      userReacted ? "removeReactionOnPost" : "reactToPost"
                    ](post.id, title)
                  : alert("You must login first");
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
