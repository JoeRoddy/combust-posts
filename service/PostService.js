import firebase from "firebase";
import notificationService from "./NotificationService";

class PostService {
  createPost(post, userId) {
    if (!post || !post.body || !userId) {
      return console.error("bad args @ PostService.createPost()");
    }

    let defaultFields = {};
    post.createdAt = new Date().getTime();
    post.createdBy = userId;
    post = Object.assign(defaultFields, post);
    let db = firebase.database();
    let postRef = db.ref("posts/postObjects").push();
    let postId = postRef.key;
    postRef.set(post);
    db.ref(`posts/postIdsByUser/${userId}/${postId}`).set(true);
  }

  updatePost(postId, newData) {
    if (!postId || !newData) {
      return;
    }
    delete newData.id;
    firebase
      .database()
      .ref("posts/postObjects")
      .child(postId)
      .update(newData);
  }

  togglePostReaction(postId, userId, reaction, isEnabled, notification) {
    if (!postId || !userId || !reaction) {
      return console.error("bad args @ postService.reactToPost()");
    }
    firebase
      .database()
      .ref("posts/postObjects")
      .child(postId)
      .child("reactions")
      .child(reaction)
      .update({
        [userId]: isEnabled || null
      });

    isEnabled &&
      notification &&
      notificationService.createNotification(notification, notification.userId);
  }

  deletePost(postId, userId) {
    let db = firebase.database();
    let idRef = db
      .ref("posts/postIdsByUser")
      .child(userId)
      .child(postId);
    let postRef = db.ref("posts/postObjects").child(postId);
    idRef.set(null);
    postRef.set(null);
  }

  addCommentToPost(comment, postId, notification) {
    if (!postId || !comment || !comment.createdBy) {
      return console.error("bad comment object @addCommentToPost()");
    }
    let db = firebase.database();
    comment.createdAt = new Date().getTime();
    comment.type = "comment";
    comment.parent = postId;
    const postRef = db.ref("posts/postObjects").push();
    const commentId = postRef.key;

    postRef.set(comment);
    db
      .ref("posts/postObjects/")
      .child(postId)
      .child("comments")
      .update({ [commentId]: true });

    notification &&
      notificationService.createNotification(notification, notification.userId);
  }

  listenToPostsByUser(userId, callback) {
    _listenToPostIdsByUser(userId, (err, postId) => {
      if (err) return callback(err);
      this.listenToPost(postId, callback);
    });
  }

  loadPostsOnceByUser(userId, callback) {
    _loadPostIdsByUser(userId, (err, postId) => {
      if (err) return callback(err);
      _loadPostOnce(postId, callback);
    });
  }

  listenToPost(postId, callback) {
    firebase
      .database()
      .ref("posts/postObjects")
      .child(postId)
      .on("value", snapshot => {
        let post = snapshot.val();
        if (!post) {
          return callback("no userdata found for post w/id: " + postId);
        }
        post.id = postId;
        callback(null, post);
      });
  }
}

const _loadPostIdsByUser = function(userId, callback) {
  firebase
    .database()
    .ref("posts/postIdsByUser")
    .child(userId)
    .once("child_added")
    .then(snap => {
      callback(null, snap.key);
    });
};

const _loadPostOnce = function(postId, callback) {
  firebase
    .database()
    .ref("posts/postObjects")
    .child(postId)
    .once("value")
    .then(snapshot => {
      let post = snapshot.val();
      if (!post) {
        return callback("no userdata found for post w/id: " + postId);
      }
      post.id = postId;
      callback(null, post);
    });
};

const _listenToPostIdsByUser = function(userId, callback) {
  firebase
    .database()
    .ref("posts/postIdsByUser")
    .child(userId)
    .on("child_added", snap => {
      callback(null, snap.key);
    });
};

const postService = new PostService();

export default postService;
