import { View, StyleSheet } from "react-native";
import { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { Button } from "react-native-paper";
import { Link } from "expo-router";

export default function SelectMap() {
  const [region, setRegion] = useState({
    latitude: 1.2966,
    longitude: 103.7764,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });
  const [long, setLong] = useState(1.29);
  const [lat, setLat] = useState(103.77);

  const handleMapSelect = (event) => {
    const { coordinate } = event.nativeEvent;
    setLat(coordinate.latitude);
    setLong(coordinate.longitude);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        pitchEnabled={false}
        onPress={(e) => handleMapSelect(e)}
      >
        <Marker
          coordinate={{ latitude: lat, longitude: long }}
          title="Place this pin at incident location"
        />
      </MapView>

      <View style={styles.submit}>
        <Link href={{
          pathname:"/verifyForm",
          params: {latitude: lat, longitude: long,}
        }} style={styles.link} >
          <Button mode="contained" style={styles.button} buttonColor="black">
            Next
          </Button>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  submit: {
    position: "absolute",
    bottom: 30,
    justifyContent: "center",
    right: 20,
  },
  link: {
    zIndex: 2,
    // backgroundColor:'black',
  },
  button: {
    height: 50,
    width: 100,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
