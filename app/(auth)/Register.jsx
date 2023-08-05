import { useState } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { Button, TextInput, Checkbox } from "react-native-paper";

import background from "../../assets/background.png";

import { supabase } from "../../lib/supabase";


export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secondaryPassword, setSecondaryPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (email == "") {
      setErrMsg("Please fill up email");
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
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setErrMsg(error.message);
      return;
    }
  };

  const handlePassword = () => {
    setShowPassword(!showPassword);
  }

  return (
    <View style={styles.container} testID="hello">
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
              position:'absolute',
              bottom:10,
            }}
          >
            {" "}
            {errMsg !== "" && <Text testID="ErrMsg">{errMsg}</Text>}
          </Text>
        </View>

        {/*INPUT CONTAINER*/}
        <View style={styles.inputContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Email:</Text>
            <TextInput
              autoCapitalize="none"
              mode="flat"
              style={styles.textBox}
              textColor="black"
              value={email}
              onChangeText={setEmail}
              testID="emailInput"
            ></TextInput>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.text}>Password:</Text>
            <TextInput
              autoCapitalize="none"
              secureTextEntry={!showPassword}
              mode="flat"
              style={styles.textBox}
              textColor="black"
              value={password}
              onChangeText={setPassword}
              testID="passwordInput"
            ></TextInput>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.text}>Confirm Password:</Text>
            <TextInput
              autoCapitalize="none"
              secureTextEntry={!showPassword}
              mode="flat"
              style={styles.textBox}
              textColor="black"
              value={secondaryPassword}
              onChangeText={setSecondaryPassword}
              testID="secondaryPasswordInput"
            ></TextInput>
          </View>
          <View style={{ flexDirection: "row", alignItems:'center'}}>
           
           <Button onPress={handlePassword} textColor="black" style={{marginRight:-15,}}>
             Show passwords
           </Button>
           <Checkbox.Android
             status= {showPassword? "checked" : "unchecked"}
             onPress={handlePassword}
           />
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
            testID="submitRegister"
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
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flex: 3,
    padding: "5%",
    alignItems: "center",
    justifyContent:'center',
  },
  textContainer: {
    marginBottom:"2%",
  },
  buttonContainer: {
    alignItems: 'center',
    flex: 2,
  },
  header: {
    justifyContent: "center",
    alignContent: "center",
    fontSize: 35,
    fontWeight: "bold",
  },
  error: {
    position:'absolute',
    bottom:10,
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
    fontSize: 15,
    // fontFamily: "Arial",
  },
});
