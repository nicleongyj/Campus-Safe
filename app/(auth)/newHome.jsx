import { View, Text, StyleSheet, Image } from "react-native";
import { TextInput } from "react-native-paper";
import { useState } from 'react';

export default function newHome() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/CampusSafe.png")}
          style={styles.logo}
        />
        <Text style={styles.cs}>CampusSafe</Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.header}>Welcome back!</Text>
        <Text style={styles.subHeader}>Sign in to start reporting!</Text>

        <View style={styles.emailContainer}>
          <Image
            source={require("../../assets/emailIcon.png")}
            style={styles.emailIcon}
          />
          <TextInput
            autoCapitalize="none"
            mode="flat"
            color='azure'
            style={styles.textBox}
            value={email}
            onChangeText={setEmail}
          />
        </View>
      </View>

      <View style={styles.bottomContainer}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
    backgroundColor: "azure",
  },
  logoContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingTop: "9%",
  },
  textContainer: {
    // backgroundColor: "grey",
    flex: 3,
    padding: "5%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  bottomContainer: {
    flex: 3,
    backgroundColor: "red",
  },
  logo: {
    width: 100,
    height: 100,
  },
  cs: {
    fontSize: "30%",
    fontStyle: "normal",
    fontFamily: "Futura",
    color: "darkblue",
    fontWeight: "bold",
  },
  header: {
    fontSize: "30%",
    fontWeight: "bold",
    marginBottom: "2%",
  },
  subHeader: {
    fontSize: '20%',
    fontWeight: "bold",
  },
  emailContainer:{
    marginTop: '10%',
    flexDirection: 'row',
    alignItems: 'center',
  },    
  emailIcon: {
    height: 20,
    width: 20,
    marginRight: '3%',
  },
  textBox: {
    backgroundColor: 'azure',
    height: '10%',
    width: '50%',
    fontSize: '20%',
    fontWeight: 'bold',
    fontFamily: 'Futura',
    
  },
});
