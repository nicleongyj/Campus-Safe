import { View, Text, StyleSheet } from "react-native";
// import { useState } from "react";
import "react-native-gesture-handler";
// import { Button } from "react-native-paper";
// import { Link } from "expo-router";


import { connect } from "react-redux";

function Homepage() {

  return (
    <View style={styles.container}>
        <Text style={styles.header}>Welcome back!</Text>
        <Text style={styles.header}>What would you like to do today?</Text>
    </View>
  );
}

const mapStateToProps = (state) => ({
  userType: state.userType,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
    backgroundColor: "azure",
  },
  header: {
    fontSize:20,
    fontWeight: 'bold',
  }

});

export default connect(mapStateToProps)(Homepage);
