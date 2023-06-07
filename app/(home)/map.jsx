import { useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function Map() {
  const [region, setRegion] = useState({
    latitude: 1.2966,
    longitude: 103.7764,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChange={setRegion}
      >
        <Marker
          coordinate={{ latitude: 1.299086, longitude: 103.774476 }}
          title="Car crash"
          description="Beside Yusof Ishak House. Avoid this area!"
        />
        <Marker
          coordinate={{ latitude: 1.297788, longitude: 103.777567 }}
          title="Fallen tree"
          description="Beside RVRC. Road blocked!"
        />
        <Marker
          coordinate={{ latitude: 1.295268, longitude: 103.771125 }}
          title="Faulty lift"
          description="AS3 lift. Use lift at AS4."
        />
      </MapView>
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
});
