import React from "react";
import { observer } from "mobx-react";
import { StyleSheet, Text, View } from "react-native";

import postStore from "../../stores/PostStore";
import nav from "../../helpers/NavigatorHelper";
import { viewStyles } from "../../assets/styles/AppStyles";
import Header from "../reusable/Header";

@observer
export default class Post extends React.Component {
  state = {};

  render() {
    return (
      <View>
        <Header title="Posts" />
        <View style={viewStyles.padding}>
          <Text>lolok</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
