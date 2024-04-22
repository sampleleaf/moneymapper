import React, { useState, memo } from "react";
import { toast } from "react-toastify";
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
    // const [geoResult, setGeoResult] = useState(null)

    // useEffect(() => {
    //   console.log(geoResult)
    //   setGeoResult(null)
    // }, [position])

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
          // const dataAdress = data.address.city || data.address.county || data.address.country
          // const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${encodeURIComponent(dataAdress)}`);
          // const geoData = await geoResponse.json();
          // if (geoData.length > 0 && geoData[0].geojson) {
          //     setGeoResult(geoData[0].geojson);
          // } else {
          //     console.error('無法找到指定縣市的邊界數據');
          // }
          setMapError("")
          setMapResult(
            data.address.city || data.address.county || `${data.address.country}領海`
          );
          setLoadingLocation(false);
        } catch (error) {
          toast.error("偵測失敗，請改用手動選擇 !", {
            theme: "dark",
            position: "top-center"
          });
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
          {/* {geoResult && <GeoJSON data={geoResult} style={{ color: 'red' }} />} */}
        </Marker>
      </>
    );
  };

  const ManualLocation = () => {
    const [position, setPosition] = useState(null);
    // const [geoResult, setGeoResult] = useState(null)

    // useEffect(() => {
    //   console.log(geoResult)
    //   setGeoResult(null)
    // }, [position])

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
        // const dataAdress = data.address.city || data.address.county || data.address.country
        // const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${encodeURIComponent(dataAdress)}`);
        // const geoData = await geoResponse.json();
        // if (geoData.length > 0 && geoData[0].geojson) {
        //     setGeoResult(geoData[0].geojson);
        // } else {
        //     console.error('無法找到指定縣市的邊界數據');
        // }
        setMapError("")
        setMapResult(
          data.address.city || data.address.county || `${data.address.country}領海`
        );
        setLoadingLocation(false);
      } catch (error) {
        toast.warn("請選擇陸地或國家領海 !", {
          theme: "dark",
          position: "top-center"
        });
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
          {/* {geoResult && <GeoJSON data={geoResult} style={{ color: 'red' }} />} */}
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
