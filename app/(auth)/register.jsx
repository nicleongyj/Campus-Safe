import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { supabase } from "../../lib/supabase";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async () => {
    if (email == "") {
      setErrMsg("Please fill up username");
      return;
    }
    if (password == "") {
      setErrMsg("Please fill up password");
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
      <View style={{ flex: 1, marginTop: 180 }}>
        <Text style={styles.header1}>Register your account</Text>
        <Text style={{ fontSize: 15, fontWeight: "bold", color: "red", marginBottom: 10}}>
          {" "}
          {errMsg !== "" && <Text>{errMsg}</Text>}
          {/* {loading && <ActivityIndicator />} */}
        </Text>
      </View>
      <View style={{ flex: 5, marginTop: 10 }}>
        <Text style={styles.text}>Enter Email</Text>
        <TextInput
          autoCapitalize="none"
          mode="outlined"
          style={styles.textBox}
          textColor="black"
          value={email}
          onChangeText={setEmail}
        ></TextInput>
        <Text style={styles.text}>Enter Password</Text>
        <TextInput
          autoCapitalize="none"
          secureTextEntry
          mode="outlined"
          style={styles.textBox}
          textColor="black"
          value={password}
          onChangeText={setPassword}
        ></TextInput>
        <Button
          onPress={() => handleSubmit()}
          mode="contained"
          style={styles.button}
          buttonColor="powderblue"
          loading={loading}
          ActivityIndicator
          textColor="black"
        >
          Register
        </Button>
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
  text: {
    fontSize: 15,
  },

  button: {
    marginTop: 13,
    borderColor: "black",
    borderWidth: 1,
  },
  header1: {
    justifyContent: "center",
    alignContent: "center",
    marginBottom: 50,
    fontSize: 40,
    fontWeight: "bold",
  },
  input: {
    width: 400,
    height: 40,
  },
  textBox: {
    height: 40,
    backgroundColor: "cornsilk",
    width: 300,
    marginTop: 5,
    marginBottom: 5,
  },
});
