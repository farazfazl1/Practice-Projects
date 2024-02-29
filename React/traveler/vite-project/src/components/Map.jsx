import styles from "./Map.module.css";

// MAp
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
  // useNavigate allows us to go to a new url automatically when we submit a form or click somehwere that we want to be clicked
  const navigate = useNavigate();

  const { cities } = useCities();
  const [mapPosition, setmapPosition] = useState([30, 0]);
  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useUrlPosition();

  useEffect(() => {
    // We want when the user clicks back to CityList for the map to not go back to its
    //defualt map position which is the one when map first loads in so we made an useEffect
    //hook to be able to say when user clicks back from the city they have chosen, the new
    //mapPosition will equal to the position of the city if those lat and lng exist in the url
    if (mapLat && mapLng) setmapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  // Using this useEffect in order to bring the map position to user's current position
  //If they decided to us the position they are currently in for their trip save
  useEffect(
    function () {
      if (geoLocationPosition)
        setmapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
    },
    [geoLocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "loading...." : "Use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        // center={[mapLat, mapLng]}
        zoom={8}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.fr/hot">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        <ChangeCenter position={mapPosition} />
        <DetectClick navigate={navigate} />
      </MapContainer>
    </div>
  );
}

// this component focuses on to change the view of the map
// when we click on a cityList item
function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

// now we want a componenet to make the user to capture a Lat and Lng
//when they click on somehting in the map and have a form show up for them
//to bring in their new memory and add them to our map

function DetectClick({ navigate }) {
  const map = useMapEvents({
    click: (e) => {
      console.log(e);
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
  return null;
}

export default Map;
