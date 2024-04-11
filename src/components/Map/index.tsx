import React from "react";
import { useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
  Tooltip,
} from "react-leaflet";

const Map: React.FC<{ setLocation: Function }> = ({ setLocation }) => {
  const LocationMarker = () => {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
      click() {
        map.locate();
      },
      async locationfound(e) {
        setPosition(e.latlng as any);
        map.flyTo(e.latlng, map.getZoom());
        console.log(e.latlng);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log(data.address.city || data.address.county);
          setLocation(data.address.city || data.address.county)
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      },
    });

    return position === null ? null : (
      <>
        <Marker position={position}>
          <Popup>You are here</Popup>
          <Tooltip>Tooltip for Marker</Tooltip>
        </Marker>
        {/* <Marker position={[25.0313004, 121.525793, 15.75]}>
                    <Popup>You are here</Popup>
                    <Tooltip>Tooltip for Marker</Tooltip>
                </Marker> */}
      </>
    );
  };

  return (
    <MapContainer
      center={[23.6408469, 121.0225183, 10]}
      zoom={7}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default Map;
