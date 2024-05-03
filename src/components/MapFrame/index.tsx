import { useState } from "react";
import Switch from "react-switch";
import mapFrame from "@/css/MapFrame.module.css"
import Map from "@/components/Map";

const MapFrame: React.FC<{
  setLocation: Function;
  setMapWindow: Function;
  mapResult: string | undefined;
  setMapResult: Function;
}> = ({ setLocation, setMapWindow, mapResult, setMapResult }) => {
  const [autoMap, setAutoMap] = useState<boolean>(true);
  const [mapError, setMapError] = useState<string | undefined>("");
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);

  const handleChange = (nextChecked: boolean) => {
    setAutoMap(nextChecked);
  };

  const handleLocation = () => {
    // setMapResult(location)
    setLocation(mapResult);
    setMapWindow(false);
  };

  return (
    <>
      <div onClick={() => setMapWindow(false)} className={mapFrame.cross}>
        <i className="fa-solid fa-xmark"></i>
      </div>
      <div className={mapFrame.selectMap}>
        <div
          className={`${mapFrame.autoButton} ${autoMap ? mapFrame.autoMapOn : ""}`}
        >
          自動偵測
        </div>
        <Switch onChange={handleChange} checked={autoMap} />
      </div>
      {autoMap ? (
        <div className={mapFrame.hint}>
          點選地圖會<b style={{ color: "lightgreen" }}>偵測您目前的位置</b>
        </div>
      ) : (
        <div className={mapFrame.hint}>
          點選地圖會<b style={{ color: "yellow" }}>顯示您選擇的位置</b>
        </div>
      )}
      <Map
        setMapResult={setMapResult}
        autoMap={autoMap}
        setLoadingLocation={setLoadingLocation}
        setMapError={setMapError}
      />
      <div className={mapFrame.mapResult}>
        {mapResult || mapError ? (
          <p style={mapResult ? { backgroundColor: "rgb(189,218,177)" } : {}}>
            您的位置：
            <b>
              {mapResult}
              {mapError}
            </b>
          </p>
        ) : (
          <p>您尚未選擇地區</p>
        )}
      </div>
      <div className={mapFrame.mapButton}>
        {loadingLocation ? (
          <img src="loading.gif" alt="loading" />
        ) : mapError ? (
          "請選擇陸地或國家領海"
        ) : mapResult ? (
          <button onClick={handleLocation}>確定</button>
        ) : (
          "選完地區，會出現確定按鈕"
        )}
      </div>
    </>
  );
};

export default MapFrame;