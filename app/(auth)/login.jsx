import { useState } from "react";
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import { Link } from "expo-router";
import { supabase } from "../../lib/supabase";
import Index from "../(home)/index";

export default function LoginPage() {
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
    return <Index />;
  };

  return (
    <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/CampusSafe.png")}
            style={styles.logo}
          />
          <Text style={styles.cs}>CampusSafe</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.welcome}>Welcome back!</Text>
          <Text style={styles.signIn}>Sign in to start reporting!</Text>
          {errMsg !== "" && <Text style={styles.error}>{errMsg}</Text>}
          {loading && <ActivityIndicator />}
          <Text style={{ fontWeight: "bold" }}>Email:</Text>
          <TextInput
            autoCapitalize="none"
            mode="outlined"
            style={styles.textBox}
            value={email}
            onChangeText={setEmail}
          />
          <Text style={{ marginTop: 10, fontWeight: "bold" }}>Password:</Text>
          <TextInput
            secureTextEntry // Sets password type
            autoCapitalize="none"
            mode="outlined"
            style={styles.textBox}
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.buttonContainer}>
            <Link href="/register" style={{ marginTop: 15 }}>
              <Button style={styles.registerButton}>Go to register</Button>
            </Link>

            <Button
              onPress={handleSubmit}
              mode="contained"
              style={styles.button}
              buttonColor="powderblue"
              loading={loading}
              textColor="black"
            >
              Sign In
            </Button>
          </View>

          <View style={styles.resetContainer}>
            <Link href="/Stafflogin" style={{ marginTop: 15 }}>
              <Button
                mode="contained"
                style={styles.reset}
                buttonColor="white"
                textColor="black"
              >
                Log in as staff
              </Button>
            </Link>

            
            <Link href="/newHome" style={{ marginTop: 15 }}>
              <Button
                mode="contained"
                style={styles.reset}
                buttonColor="white"
                textColor="black"
              >
                test
              </Button>
            </Link>




          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "azure",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 30,
  },
  logo: {
    height: 130,
    width: 130,
  },
  cs: {
    fontSize: 50,
    fontStyle: "normal",
    fontFamily: "Futura",
    color: "darkblue",
    fontWeight: "bold",
  },
  formContainer: {
    flex: 3,
    alignItems: "center",
  },
  welcome: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: "bold",
  },
  signIn: {
    marginBottom: 15,
    fontSize: 20,
    fontWeight: "bold",
  },
  error: {
    fontSize: 15,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
  },
  textBox: {
    height: 40,
    backgroundColor: "cornsilk",
    width: 300,
    marginTop: 5,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  registerButton: {
    borderColor: "black",
    borderWidth: 1,
  },
  button: {
    marginTop: 13,
    marginLeft: 25,
    borderColor: "black",
    borderWidth: 1,
  },
  resetContainer: {
    marginTop: 10,
  },
  reset: {
    borderWidth: 1,
    borderColor: "black",
  },
});
