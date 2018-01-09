import { observable, computed } from "mobx";
import postService from "../service/PostService";
import usersStore from "./UsersStore";

class PostStore {
  subscribeToEvents() {
    //must be inline functions, or use .bind(this)
    usersStore.onLogin(this.loadPostsForUser.bind(this));
    usersStore.onLogout(this.onUserLogout.bind(this));
  }

  @observable postMap = new Map();
  @observable postIdsByUserMap = new Map();

  loadPostsForUser(user) {
    const userId = user.id;
    if (!userId || this.postIdsByUserMap.has(user.id)) {
      return;
    }
    this.postIdsByUserMap.set(userId, []);
    postService.listenToPostsByUser(user.id, (err, post) => {
      err ? console.log(err) : this.storePost(post, userId);
    });
  }

  storePost(post, userId) {
    this.postMap.set(post.id, post);
    let idsForUser = this.postIdsByUserMap.get(userId) || [];
    idsForUser.push(post.id);
    this.postIdsByUserMap.set(userId, idsForUser);
  }

  @computed
  get postsOfClientUser() {
    return this.getPostsByUserId(usersStore.userId);
  }

  getPostsByUserId(userId) {
    this.loadPostsForUser({ id: userId });
    let posts = {};
    let postIds = this.postIdsByUserMap.get(userId) || [];
    postIds.reverse();
    postIds &&
      postIds.forEach(postId => {
        posts[postId] = this.getPostById(postId);
      });
    return posts;
  }

  getPostById(postId) {
    if (!this.postMap.has(postId)) {
      this.postMap.set(postId, null); //avoid multiple listeners
      postService.listenToPost(postId, (err, post) => {
        err ? console.log(err) : this.postMap.set(postId, post);
      });
    }
    return this.postMap.get(postId);
  }

  createPost(post) {
    const userId = usersStore.userId;
    if (!post || !post.body || !userId) {
      return;
    }
    postService.createPost(post, userId);
  }

  deletePost(postId) {
    let usersPosts = this.postIdsByUserMap.get(usersStore.userId) || [];
    usersPosts = usersPosts.filter(id => id !== postId);
    this.postIdsByUserMap.set(usersStore.userId, usersPosts);
    this.postMap.delete(postId);
    postService.deletePost(postId, usersStore.userId);
  }

  addCommentToPost(commentBody, postId) {
    const post = this.getPostById(postId);
    if (!post) return;

    const comment = {
      body: commentBody,
      createdBy: usersStore.userId
    };

    const notification =
      post.createdBy === usersStore.userId
        ? null
        : {
            userId: post.createdBy,
            createdBy: usersStore.userId,
            type: "post_comment",
            link: "/posts/" + postId,
            body: "Comment reply from " + usersStore.user.email
          };

    postService.addCommentToPost(comment, postId, notification);
  }

  updatePost(post) {
    if (!post) return;
    const postId = post.id;
    delete post.id;
    postService.updatePost(postId, post);
  }

  reactToPost(postId, reaction) {
    const userId = usersStore.userId;
    const post = this.getPostById(postId);
    if (!post || !userId) return;

    const notification =
      post.createdBy === userId
        ? null
        : {
            userId: post.createdBy,
            createdBy: usersStore.userId,
            type: "post_reaction",
            link: "/posts/" + (post.parent || postId),
            body: `${usersStore.user.email} gave your post a ${reaction}`
          };

    postService.togglePostReaction(
      postId,
      userId,
      reaction,
      true,
      notification
    );
  }

  removeReactionOnPost(postId, reaction) {
    const userId = usersStore.userId;
    postService.togglePostReaction(postId, userId, reaction, false);
  }

  getNumReactions(reactionType, postId) {
    const post = this.postMap.get(postId);
    const reactions = post && post.reactions ? post.reactions[reactionType] : {};
    return reactions ? Object.keys(reactions).length : 0;
  }

  userDidReactToPost(reactionType, postId) {
    const post = this.postMap.get(postId);

    try {
      return post.reactions[reactionType][usersStore.userId];
    } catch (nullPointer) {
      return false;
    }
  }

  onUserLogout() {
    this.postIdsByUserMap.clear();
  }
}

const postStore = new PostStore();
export default postStore;
