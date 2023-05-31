import { useState } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { Link } from "expo-router";

import background from "../../assets/background.png";
import toolIcon from "../../assets/tools.png";

// import { useNavigation } from "expo-router";

export default function StaffLogin() {
  // const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [code, setCode] = useState("");

  const STAFFCODE = "0000";

  // const goNavigate = () => {
  //   navigation.navigate("RegisterPage");
  // }

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

    if (code === "" || code !== STAFFCODE) {
      setErrMsg("Invalid staff code!");
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
    console.log("pass");
    return;
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={background}
        resizeMode="stretch"
        style={{ flex: 1 }}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Log in as staff</Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "red",
              marginBottom: 10,
            }}
          >
            {" "}
            {errMsg !== "" && <Text>{errMsg}</Text>}
            {/* {loading && <ActivityIndicator />} */}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Staff email:</Text>
            <TextInput
              autoCapitalize="none"
              mode="flat"
              style={styles.textBox}
              textColor="black"
              value={email}
              onChangeText={setEmail}
            ></TextInput>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.text}>Password:</Text>
            <TextInput
              autoCapitalize="none"
              secureTextEntry
              mode="flat"
              style={styles.textBox}
              textColor="black"
              value={password}
              onChangeText={setPassword}
            ></TextInput>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.text}>Staff Code</Text>
            <TextInput
              autoCapitalize="none"
              secureTextEntry
              mode="flat"
              style={styles.textBox}
              textColor="black"
              value={code}
              onChangeText={setCode}
            ></TextInput>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            onPress={handleSubmit}
            mode="elevated"
            style={styles.button}
            buttonColor="black"
            loading={loading}
            textColor="white"
            icon={toolIcon}
          >
            Log in
          </Button>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  headerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    padding: "5%",
    alignItems: "center",
  },
  textContainer: {
    marginBottom: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    flex: 1,
  },
  header: {
    justifyContent: "center",
    alignContent: "center",
    marginBottom: 50,
    fontSize: 40,
    fontWeight: "bold",
  },
  text: {
    fontSize: 15,
    fontWeight: "bold",
    color: "dimgray",
  },
  button: {
    borderColor: "black",
    borderWidth: 0,
    width: "70%",
    fontWeight: "bold",
  },
  textBox: {
    backgroundColor: "rgba(0,0,0,0)",
    height: 30,
    width: 300,
    fontSize: "15%",
    fontFamily: "Arial",
  },
});
