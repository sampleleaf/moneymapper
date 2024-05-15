import React, { useState, memo, useEffect } from "react";
import { toast } from "react-toastify";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvent,
  useMapEvents,
  Tooltip,
  GeoJSON,
} from "react-leaflet";
import { geo } from "@/taiwanGeo";
import { LatLng } from "leaflet";

interface TaiwanGeoType {
  type: string;
  coordinates: number[][][] | number[][][][];
}

const Map: React.FC<{
  setMapResult: React.Dispatch<React.SetStateAction<string>>;
  autoMap: boolean;
  setLoadingLocation: React.Dispatch<React.SetStateAction<boolean>>;
  setMapError: React.Dispatch<React.SetStateAction<string>>;
}> = memo(({ setMapResult, autoMap, setLoadingLocation, setMapError }) => {
  const LocationMarker = () => {
    const [position, setPosition] = useState<LatLng | null>(null);
    const [geoResult, setGeoResult] = useState<
      GeoJSON.GeoJsonObject | null | TaiwanGeoType
    >(null);

    useEffect(() => {
      setGeoResult(null);
    }, [position]);

    const map = useMapEvents({
      click() {
        setLoadingLocation(true);
        map.locate();
      },
      async locationfound(e) {
        setPosition(e.latlng);
        const center: [number, number] = [e.latlng.lat, e.latlng.lng];
        const zoomLevel = 9;
        map.setView(center, zoomLevel);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          const dataAdress =
            data.address.city || data.address.county || data.address.country;
          setMapError("");
          setMapResult(
            data.address.city ||
              data.address.county ||
              `${data.address.country}領海`
          );
          setGeoResult(geo[dataAdress]);
          setLoadingLocation(false);
        } catch (error) {
          toast.error("偵測失敗，請改用手動選擇 !", {
            position: "top-center",
          });
          setMapResult("");
          setMapError("偵測失效(請手動選擇)");
          setLoadingLocation(false);
        }
      },
    });

    return position === null ? null : (
      <>
        <Marker position={position}>
          <Tooltip>You are here</Tooltip>
          {geoResult && (
            <GeoJSON
              data={geoResult as GeoJSON.GeoJsonObject}
              style={{ color: "blue" }}
            />
          )}
        </Marker>
      </>
    );
  };

  const ManualLocation = () => {
    const [position, setPosition] = useState<LatLng | null>(null);
    const [geoResult, setGeoResult] = useState<
      GeoJSON.GeoJsonObject | null | TaiwanGeoType
    >(null);

    useEffect(() => {
      setGeoResult(null);
    }, [position]);

    const map = useMapEvent("click", async (e) => {
      setLoadingLocation(true);
      setPosition(e.latlng);
      const center: [number, number] = [e.latlng.lat, e.latlng.lng];
      const zoomLevel = 9;
      map.setView(center, zoomLevel);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const dataAdress: string =
          data.address.city || data.address.county || data.address.country;
        setMapError("");
        setMapResult(
          data.address.city ||
            data.address.county ||
            `${data.address.country}領海`
        );
        setGeoResult(geo[dataAdress]);
        setLoadingLocation(false);
      } catch (error) {
        toast.warn("請選國家領地 !", {
          position: "top-center",
        });
        setMapResult("");
        setMapError("海洋");
        setLoadingLocation(false);
      }
    });
    return position === null ? null : (
      <>
        <Marker position={position}>
          <Tooltip>You select here</Tooltip>
          {geoResult && <GeoJSON data={geoResult as GeoJSON.GeoJsonObject} style={{ color: "blue" }} />}
        </Marker>
      </>
    );
  };

  return (
    <>
      {autoMap ? (
        <MapContainer
          center={[23.6408469, 121.0225183, 10]}
          zoom={7}
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
          zoom={7}
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
