import { useEffect } from "react";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { viewMarkers } from "../../lib/supabase";

export default function Map() {
  const [region, setRegion] = useState({
    latitude: 1.2966,
    longitude: 103.7764,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  const [ markers, setMarkers ] = useState([]);
  const [ refresh, setRefresh ] = useState(false);

  const fetchMarkers = async () => {
    let data = await viewMarkers('verifiedincidents');
    setMarkers(data);
    setRefresh(false);
    console.log("fetched data");
  }
  
    useEffect(() => {
      fetchMarkers();
    }, []);
  
    useEffect(() => {
      if (refresh) {
        fetchMarkers();
      }
    }, [refresh]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChange={setRegion}
      >
        {markers.map((marker) => (
          <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.type}
          description={marker.details}
          />
        ))}
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
