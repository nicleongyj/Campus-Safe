import { useState } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { supabase } from "../../lib/supabase";

import background from "../../assets/background.png";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secondaryPassword, setSecondaryPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async () => {
    if (name == "") {
      setErrMsg("Please fill up your name");
      return;
    }
    if (email == "") {
      setErrMsg("Please fill up username");
      return;
    }
    if (password == "") {
      setErrMsg("Please fill up password");
      return;
    }
    if (password !== secondaryPassword) {
      setErrMsg("Passwords do not match");
      return;
    }

    setLoading(true);
    console.log({ email });
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setErrMsg(error.message);
      return;
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={background}
        resizeMode="stretch"
        style={{ flex: 1 }}
      >
        {/*HEADER CONTAINER*/}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Register your account</Text>
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

        {/*INPUT CONTAINER*/}
        <View style={styles.inputContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Name:</Text>
            <TextInput
              autoCapitalize="none"
              mode="flat"
              style={styles.textBox}
              textColor="black"
              value={name}
              onChangeText={setName}
            ></TextInput>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.text}>Email:</Text>
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
            <Text style={styles.text}>Confirm Password:</Text>
            <TextInput
              autoCapitalize="none"
              secureTextEntry
              mode="flat"
              style={styles.textBox}
              textColor="black"
              value={secondaryPassword}
              onChangeText={setSecondaryPassword}
            ></TextInput>
          </View>
        </View>

        {/*BUTTON CONTAINER*/}
        <View style={styles.buttonContainer}>
          <Button
            onPress={handleSubmit}
            style={styles.button}
            mode="elevated"
            buttonColor="black"
            loading={loading}
            textColor="white"
          >
            Register
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
