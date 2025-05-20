import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

// TODO: Replace with your Google Maps API key
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

const containerStyle = {
  width: "100%",
  height: "400px"
};

const center = {
  lat: 19.0760, // Example: Mumbai
  lng: 72.8777
};

const MapView = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
      <Marker position={center} />
      {/* TODO: Show user's real live location */}
    </GoogleMap>
  ) : <div>Loading Map...</div>;
};

export default MapView;
