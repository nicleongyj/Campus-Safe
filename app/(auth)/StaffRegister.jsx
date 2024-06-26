import { useState } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { Button, TextInput, Checkbox } from "react-native-paper";

import { connect } from "react-redux";
import { setUserType } from "../../redux/store";

import background from "../../assets/background.png";

import { supabase, upgradeUserRole } from "../../lib/supabase";

function StaffRegister({ setUserType }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secondaryPassword, setSecondaryPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const STAFFCODE = "0000";

  const handleSubmit = async () => {
    // Handle login errors
    if (email === "") {
      setErrMsg("Email cannot be empty!");
      return;
    }
    if (password === "") {
      setErrMsg("Please input a password!");
      return;
    }
    if (password !== secondaryPassword) {
      setErrMsg("Passwords do not match");
      return;
    }
    if (code === "" ) {
      setErrMsg("Staff code cannot be empty!");
      return;
    }
    if (code !== STAFFCODE) {
      setErrMsg("Invalid Staff code!");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setErrMsg(error.message);
      return;
    }

    const roleUpdateError = await upgradeUserRole();

    if (roleUpdateError) {
      setErrMsg(roleUpdateError.message);
    }

    setUserType("staff");

    return;

  };

  //show password
  const handlePassword = () => {
    setShowPassword(!showPassword);
  };
  //show staff code
  const handleCode = () => {
    setShowCode(!showCode);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={background}
        resizeMode="stretch"
        style={{ flex: 1 }}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Register as staff</Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "red",
              marginBottom: 10,
            }}
          >
            {" "}
            {errMsg !== "" && <Text testID="ErrMsg">{errMsg}</Text>}
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

          <View style={styles.textContainer}>
            <Text style={styles.text}>Staff Code</Text>
            <TextInput
              autoCapitalize="none"
              secureTextEntry={!showCode}
              mode="flat"
              style={styles.textBox}
              textColor="black"
              value={code}
              onChangeText={setCode}
              testID="codeInput"
            ></TextInput>
          </View>

          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Button
                onPress={handleCode}
                textColor="black"
                style={{ marginRight: -15 }}
              >
                Show staff code
              </Button>
              <Checkbox.Android
                status={showCode ? "checked" : "unchecked"}
                onPress={handleCode}
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            onPress={handleSubmit}
            mode="elevated"
            style={styles.button}
            buttonColor="gold"
            loading={loading}
            textColor="black"
            labelStyle={{fontWeight:'bold'}}
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
    justifyContent: "flex-end",
    alignItems: "center",
  },
  inputContainer: {
    flex: 3,
    padding: "5%",
    alignItems: "center",
    justifyContent:'center',
  },
  textContainer: {
    marginBottom: "2%",
  },
  buttonContainer: {
    flex: 2,
    alignItems: "center",

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
    borderWidth: 1,
    width: "70%",
  },
  textBox: {
    backgroundColor: "rgba(0,0,0,0)",
    height: 30,
    width: 300,
    fontSize: 15,
  },
});

export default connect(null, { setUserType })(StaffRegister);