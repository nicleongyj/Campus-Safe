import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "expo-router";

import background from "../../assets/background.png"
import campusSafe from "../../assets/CampusSafe.png"
import emailIcon from "../../assets/emailIcon.png"
import keyIcon from "../../assets/key.png"
import toolIcon from "../../assets/tools.png"


export default function newHome() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async () => {
    setLoading(true);

    // Handle login errors
    if (email === "") {
      setErrMsg("Email cannot be empty!");
      setLoading(false);
      return;
    }
    if (password === "") {
      setErrMsg("Please input a password!");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      setErrMsg(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={background}
        resizeMode="stretch"
        style={{flex: 1, }}
      >
        <View style={styles.logoContainer}>
          <Image
            source={campusSafe}
            style={styles.logo}
          />
          <Text style={styles.cs}>CampusSafe</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.header}>Welcome back!</Text>
          <Text style={styles.subHeader}>Sign in to start reporting!</Text>

          <View style={styles.emailContainer}>
            <Image
              source={emailIcon}
              style={styles.emailIcon}
            />
            <TextInput
              autoCapitalize="none"
              mode="flat"
              color="azure"
              style={styles.textBox}
              value={email}
              onChangeText={setEmail}
              placeholder="email"
              placeholderTextColor={"gray"}
            />
          </View>

          <View style={styles.emailContainer}>
            <Image
              source={keyIcon}
              style={styles.emailIcon}
            />
            <TextInput
              secureTextEntry
              autoCapitalize="none"
              mode="flat"
              color="azure"
              style={styles.textBox}
              value={password}
              onChangeText={setPassword}
              placeholder="password"
              placeholderTextColor={"grey"}
            ></TextInput>
          </View>
          {errMsg !== "" && <Text style={styles.error}>{errMsg}</Text>}
        </View>

        <View style={styles.bottomContainer}>
          <Button
            onPress={handleSubmit}
            mode="elevated"
            style={styles.button}
            buttonColor="black"
            loading={loading}
            textColor="white"
          >
            Sign In
          </Button>
          <Link
            href="/Stafflogin"
            style={{
              marginTop: 10,
            }}
          >
            <Button
              style={styles.staffButton}
              mode="elevated"
              buttonColor="white"
              textColor="black"
              icon={toolIcon}
            >
              Log in as staff
            </Button>
          </Link>

          <View style={{ marginTop: 30, flexDirection: "row" }}>
            <Text style={{ color: "dimgrey", fontWeight: "bold" }}>
              Don't have an account?
            </Text>
            <Link
              href="/register"
              style={{
                color: "orangered",
                fontWeight: "bold",
                textDecorationLine: "underline",
              }}
            >
              Register an account
            </Link>
          </View>
        </View>
      </ImageBackground>
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingTop: "25%",
  },
  textContainer: {
    flex: 3,
    // marginTop: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    flex: 4,
    // justifyContent: 'center',
    alignItems: "center",
  },
  logo: {
    width: 130,
    height: 130,
  },
  error: {
    fontSize: 15,
    fontWeight: "bold",
    color: "red",
    marginTop: "3%",
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
    fontSize: "20%",
    fontWeight: "bold",
  },
  emailContainer: {
    marginTop: "5%",
    flexDirection: "row",
    alignItems: "center",
  },
  emailIcon: {
    height: 30,
    width: 30,
    marginRight: "3%",
  },
  textBox: {
    backgroundColor: "white",
    height: 30,
    width: "65%",
    fontSize: "20%",
    fontWeight: "bold",
    fontFamily: "Futura",
    borderWidth: 1,
  },
  button: {
    borderColor: "black",
    borderWidth: 0,
    width: "70%",
    fontWeight: 'bold',
  },
  staffButton: {
    borderWidth: 1,
    borderColor: "black",
  },
});
