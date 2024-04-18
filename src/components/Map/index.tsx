import React, { useState, memo } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvent,
  useMapEvents,
  Tooltip,
} from "react-leaflet";

const Map: React.FC<{
  setMapResult: Function;
  autoMap: boolean;
  setLoadingLocation: Function;
  setMapError: Function
}> = memo(({ setMapResult, autoMap, setLoadingLocation, setMapError }) => {
  const LocationMarker = () => {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
      click() {
        setLoadingLocation(true);
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
          // console.log(
          //   data.address.city || data.address.county || data.address.country
          // );
          setMapError("")
          setMapResult(
            data.address.city || data.address.county || `${data.address.country}領海`
          );
          setLoadingLocation(false);
        } catch (error) {
          setMapResult("")
          setMapError("偵測失效(請手動選擇)");
          setLoadingLocation(false);
          console.error("Error fetching location:", error);
        }
      },
    });

    return position === null ? null : (
      <>
        <Marker position={position}>
          <Tooltip>You are here</Tooltip>
        </Marker>
        {/* <Marker position={[25.0313004, 121.525793, 15.75]}>
          <Popup>You are here</Popup>
          <Tooltip>Tooltip for Marker</Tooltip>
        </Marker> */}
      </>
    );
  };

  const ManualLocation = () => {
    const [position, setPosition] = useState(null);
    const map = useMapEvent("click", async (e) => {
      setLoadingLocation(true);
      setPosition(e.latlng as any);
      map.flyTo(e.latlng, map.getZoom());
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // console.log(data);
        // console.log(
        //   data.address.city || data.address.county || data.address.country
        // );
        setMapError("")
        setMapResult(
          data.address.city || data.address.county || `${data.address.country}領海`
        );
        setLoadingLocation(false);
      } catch (error) {
        setMapResult("")
        setMapError("海洋");
        setLoadingLocation(false);
        console.error("Error fetching location:", error);
      }
    });
    return position === null ? null : (
      <>
        <Marker position={position}>
          <Tooltip>You select here</Tooltip>
        </Marker>
      </>
    );
  };

  return (
    <>
      {autoMap ? (
        <MapContainer
          center={[23.6408469, 121.0225183, 10]}
          zoom={6}
          // scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
      ) : (
        <MapContainer
          center={[23.6408469, 121.0225183, 10]}
          zoom={6}
          // scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ManualLocation />
        </MapContainer>
      )}
    </>
  );
});

export default Map;
