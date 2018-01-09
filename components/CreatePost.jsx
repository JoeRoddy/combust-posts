import React, { Component } from "react";
import { observer } from "mobx-react";

import postStore from "../../../stores/PostStore";

@observer
export default class CreatePost extends Component {
  state = {
    body: ""
  };

  submit = e => {
    e.preventDefault();
    let submitObject = {
      body: this.state.body
    };
    this.setState({ body: "" });
    postStore.createPost(submitObject);
  };

  handleChange = e => {
    this.setState({ body: e.target.value });
  };

  render() {
    return (
      <div className="CreatePost uk-card uk-card-default uk-width-1@m uk-margin-bottom uk-flex uk-flex-center uk-padding">
        <form className="uk-width-large">
          <legend className="uk-legend">Create Post</legend>
          <div className="uk-margin">
            <textarea
              className="uk-textarea uk-form-width-large"
              onChange={e => {
                this.handleChange(e);
              }}
              value={this.state.body != null ? this.state.body : null}
              placeholder={"Write your new post!"}
            />
          </div>
          <button className="uk-button uk-button-primary" onClick={this.submit}>
            Save Post
          </button>
        </form>
      </div>
    );
  }
}
