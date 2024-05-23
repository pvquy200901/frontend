import React, { useEffect, useState } from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'
import ListShop from '../components/ListShop'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const Home = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    timestamp: null,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const timestamp = new Date(position.timestamp).toLocaleTimeString();
          setLocation({ latitude, longitude, timestamp });
        },
        (error) => {
          setError(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      // Cleanup khi component bị unmount
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  // Configuring default Leaflet icon
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  return (
    <div>
      <div style={{ paddingTop: "30px" }}></div>
      <BannerProduct />
      <ListShop heading={"Danh sách các cửa hàng"} />
      <HorizontalCardProduct category={"airpodes"} heading={"Những sản phẩm được mua nhiều nhất"} />
      {/* <HorizontalCardProduct category={"watches"} heading={"Popular's Watches"}/> */}
      {/* <VerticalCardProduct category={"mobiles"} heading={"Cửa hàng nổi bật"}/> */}

      <div>
        <h1>Theo dõi vị trí của bạn</h1>
        {error ? (
          <p>{error}</p>
        ) : (
          <div id="location">
            Latitude: <span id="latitude">{location.latitude}</span><br />
            Longitude: <span id="longitude">{location.longitude}</span><br />
            Timestamp: <span id="timestamp">{location.timestamp}</span>
          </div>
        )}
      </div>
      
      {location.latitude && location.longitude && (
        <MapContainer center={[location.latitude, location.longitude]} zoom={15} style={{ height: '100vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>
              Vị trí hiện tại: <br /> Latitude: {location.latitude}, Longitude: {location.longitude}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}

export default Home