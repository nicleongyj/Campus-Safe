import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { Link } from "expo-router";

import { useNavigation } from "expo-router";

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

    if (code === "" || code !== STAFFCODE) {
      setErrMsg("Invalid staff code!");
      setLoading(false);
      return;
    }

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
    console.log("pass");
    return;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Log in as Staff</Text>
      {errMsg !== "" && <Text style={styles.error}>{errMsg}</Text>}

      <Text style={styles.smallText}>Staff email:</Text>
      <TextInput
        autoCapitalize="none"
        style={styles.textBox}
        mode="outlined"
        value={email}
        onChangeText={setEmail}
      ></TextInput>

      <Text style={styles.smallText}>Password:</Text>
      <TextInput
        secureTextEntry
        autoCapitalize="none"
        style={styles.textBox}
        mode="outlined"
        value={password}
        onChangeText={setPassword}
      ></TextInput>

      <Text style={styles.smallText}>Staff code: </Text>
      <TextInput
        autoCapitalize="none"
        style={styles.textBox}
        mode="outlined"
        value={code}
        onChangeText={setCode}
      ></TextInput>
      <Link href="../(staffhome)/staffhome" style={{ marginTop: 15 }}>
        <Button
          mode="contained"
          style={styles.button}
          buttonColor="powderblue"
          textColor="black"
          loading={loading}
          onPress={handleSubmit}
        >
          Login
        </Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "azure",
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 40,
  },
  smallText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "bold",
  },
  textBox: {
    marginTop: 5,
    width: 300,
    height: 40,
    backgroundColor: "cornsilk",
  },
  button: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: "black",
  },
  error: {
    fontSize: 15,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
  },
});
