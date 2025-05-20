import React from "react";
import MapView from "../components/MapView";

const LiveLocation = () => (
  <div>
    <h1 className="text-2xl font-heading text-trippiko-accent mb-4">Live Location</h1>
    <MapView />
    <button className="mt-4 bg-trippiko-accent text-trippiko-dark px-4 py-2 rounded">Share Location</button>
    {/* TODO: Implement share via WhatsApp or other apps */}
  </div>
);

export default LiveLocation;
