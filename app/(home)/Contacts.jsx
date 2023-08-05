import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  Linking,
  TouchableOpacity,
} from "react-native";

import loginBackground from "../../assets/loginBackground.jpg";

export default function Contact() {
  const handlePhoneNumberClick = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={loginBackground}
        resizeMode="stretch"
        style={{ flex: 1 }}
      >
        <View style={styles.topContainer}>
          <Text style={styles.header}>Emergency contact list</Text>
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.subHeader}>Campus Emergency & Security</Text>

          <View style={styles.textContainer}>
            <TouchableOpacity
              onPress={() => handlePhoneNumberClick("68741616")}
            >
              <Text style={styles.text}>+65 6874 1616</Text>
            </TouchableOpacity>
            <Text style={styles.normalText}>(Kent Ridge Campus)</Text>
          </View>

          <View style={styles.textContainer}>
            <TouchableOpacity
              onPress={() => handlePhoneNumberClick("65163636")}
            >
              <Text style={styles.text}>+65 6516 3636</Text>
            </TouchableOpacity>
            <Text style={styles.normalText}>(Bukit Timah Campus)</Text>
          </View>

          <View style={styles.textContainer}>
            <TouchableOpacity
              onPress={() => handlePhoneNumberClick("65165568")}
            >
              <Text style={styles.text}>+65 6516 5568</Text>
            </TouchableOpacity>
            <Text style={styles.normalText}>(Outram Campus)</Text>
          </View>
        </View>
        <View style={{ flex: 2, alignItems: "center" }}>
          <Text style={styles.subHeader}>Lifeline NUS (24-HR)</Text>
          <View style={styles.textContainer}>
            <TouchableOpacity
              onPress={() => handlePhoneNumberClick("65167777")}
            >
              <Text style={styles.text}>+65 6516 7777 </Text>
            </TouchableOpacity>
            <Text style={styles.normalText}>(All campuses)</Text>
          </View>
        </View>
        <View style={styles.subContainer}>
          <Text style={styles.subHeader}>24-HR Hotlines</Text>
          <View style={styles.bottomSubContainer}>
            <Text style={styles.normalText}>SCDF Fire & Ambulance - </Text>
            <TouchableOpacity
              onPress={() => handlePhoneNumberClick("995")}
            >
              <Text style={styles.text}> 995</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomSubContainer}>
            <Text style={styles.normalText}>Simgapore Police Force - </Text>
            <TouchableOpacity
              onPress={() => handlePhoneNumberClick("999")}
            >
              <Text style={styles.text}>999</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomSubContainer}>
            <Text style={styles.normalText}>Non-emergenency Ambulance - </Text>
            <TouchableOpacity
              onPress={() => handlePhoneNumberClick("1777")}
            >
              <Text style={styles.text}>1777</Text>
            </TouchableOpacity>
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
  },
  topContainer: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    marginTop: 100,
  },
  header: {
    fontSize: 30,
  },
  subContainer: {
    flex: 5,
    alignItems: "center",
  },
  subHeader: {
    fontSize: 20,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  textContainer: {
    flex: 1,
    padding: "4%",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    textDecorationColor: "blue",
    textDecorationLine: "underline",
    color: "blue",
  },
  bottomSubContainer: {
    flex: 1,
    padding: "4%",
    alignItems: "center",
    flexDirection: "row",
  },
  normalText:{
    fontSize:16
  }
});
