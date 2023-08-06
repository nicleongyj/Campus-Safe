import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ImageBackground, Alert } from "react-native";
import { Button, Checkbox, TextInput } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import { useToast } from "react-native-toast-notifications";

import background from "../../assets/background.png";
import campusSafe from "../../assets/CampusSafe.png";
import emailIcon from "../../assets/emailIcon.png";
import keyIcon from "../../assets/key.png";

import { supabase } from "../../lib/supabase";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMsg, setLoginMsg] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (loginMsg) {
      toast.show("Logged in.");
      setLoginMsg(false);
    }
  }, [loginMsg]);

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
      Alert.alert("Error", "Please try again!", [
        { text: "OK" },
      ]);
      return;
    }

    setLoginMsg(true);
  };

  const handlePassword = () => {
    setShowPassword(!showPassword);
  };

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={background}
        resizeMode="stretch"
        style={{ flex: 1 }}
      >
        <View style={styles.logoContainer}>
          <Image source={campusSafe} style={styles.logo} testID="logoImage" />
          <Text style={styles.cs}>CampusSafe</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.header}>Welcome back!</Text>
          <Text style={styles.subHeader}>Sign in to start reporting!</Text>

          <View style={styles.inputContainer}>
            <Image source={emailIcon} style={styles.emailIcon} />
            <TextInput
              autoCapitalize="none"
              mode="flat"
              textColor="black"
              style={styles.textBox}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={"gray"}
            />
          </View>

          <View style={styles.inputContainer}>
            <Image source={keyIcon} style={styles.emailIcon} />
            <TextInput
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              mode="flat"
              color="azure"
              style={styles.textBox}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={"grey"}
            ></TextInput>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Button
              onPress={handlePassword}
              textColor="black"
              style={{ marginRight: -15 }}
            >
              Show password
            </Button>
            <Checkbox.Android
              status={showPassword ? "checked" : "unchecked"}
              onPress={handlePassword}
            />
          </View>
          <Text style={styles.error}>
            {" "}
            {errMsg != "" && <Text testID="errMsg">{errMsg}</Text>}
          </Text>
        </View>

        <View style={styles.bottomContainer}>
          <Button
            onPress={handleSubmit}
            mode="elevated"
            style={styles.button}
            buttonColor="gold"
            loading={loading}
            textColor="black"
            testID="signInButton"
            labelStyle={{ fontWeight:"bold"}}
          >
            Sign In
          </Button>

          <View style={{ marginTop: 30 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ color: "dimgrey", fontWeight: "bold" }}>
                Don&#39;t have an account?{" "}
              </Text>
              <Button
                onPress={() => navigation.navigate("Register")}
                textColor="orangered"
                testID="registerButton"
              >
                Register an account
              </Button>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ marginTop: 10, color: "dimgrey", fontWeight: "bold" }}
              >
                New staff member?{" "}
              </Text>
              <Button
                onPress={() => navigation.navigate("StaffRegister")}
                textColor="orangered"
                testID="staffRegisterButton"
              >
                Register as staff
              </Button>
            </View>
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
    backgroundColor: "azure",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: "15%",
    marginBottom: "10%",
    paddingRight: "5%",
  },
  textContainer: {
    flex: 3,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    flex: 4,
    alignItems: "center",
  },
  logo: {
    width: 110,
    height: 110,
    resizeMode: "contain",
  },
  error: {
    fontSize: 15,
    fontWeight: "bold",
    color: "red",
    marginTop: "2%",
    marginBottom: "2%",
  },
  cs: {
    fontSize: 35,
    fontStyle: "normal",
    // fontFamily: "Futura",
    color: "darkblue",
    fontWeight: "bold",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: "2%",
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
  },
  inputContainer: {
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
    backgroundColor: "rgba(0,0,0,0)",
    height: 30,
    width: 300,
    fontSize: 15,
    // fontFamily: "Arial",
  },
  button: {
    borderColor: "black",
    borderWidth: 1,
    width: "70%",
  },
  staffButton: {
    borderWidth: 1,
    borderColor: "black",
  },
});
