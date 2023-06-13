import { View, Text, StyleSheet } from "react-native";
import "react-native-gesture-handler";
import { Button } from "react-native-paper";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const mapStateToProps = (state) => ({
  userType: state.userType,
});

export default function StaffView() {
	return (
		<SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <Link href="/Staffhome" style={styles.link}>
          <Button style ={styles.button}
          textColor="black"
          >
            <Text style={{ fontSize: 20 }}>Staff Home</Text>
          </Button>
        </Link>
      </View>


			<View style={styles.bottomContainer}>
				<View style={styles.buttonContainer}>
					<Link href="/NewIncidentReps" style={styles.link}>
						<Button
								mode="elevated"
								style={styles.button}
								buttonColor="powderblue"
								textColor="black"
								labelStyle={styles.buttonContent}
								contentStyle={{ width: 350, height: 100 }}
								//icon={reports} //get reports image
						>
						  <Text style={{ fontSize: 20 }}>View new incident reports</Text>
						</Button>
					</Link>
				</View>

        <View style={styles.buttonContainer}>
					<Link href="/StaffView" style={styles.link}>
						<Button
								mode="elevated"
								style={styles.button}
								buttonColor="orange"
								textColor="black"
								labelStyle={styles.buttonContent}
								contentStyle={{ width: 350, height: 100 }}
								//icon={reports} //get reports image
						>
						  <Text style={{ fontSize: 20 }}>View new infrastructure reports</Text>
						</Button>
					</Link>
				</View>

			</View>

		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    // alignItems: "stretch",
    backgroundColor: "white",
  },
  bottomContainer: {
    flex: 5,
    alignItems: "center",
  },
  buttonContainer: {
    marginBottom: 35,
  },
  header: {
    fontSize: 35,
    fontWeight: "bold",
  },
  subheader: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    width: 350,
    height: 100,
    zIndex: 2,
  },
  button: {
    width: 350,
    height: 100,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    zIndex: 1,
  },
  buttonContent: {
    fontWeight: "bold",
    fontSize: 25,
  },
  topContainer: {
    flex: 1,
    padding: 10,
    marginLeft: 5,
    backgroundColor: "white",
    justifyContent: "center",
  },
});