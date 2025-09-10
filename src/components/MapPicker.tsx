"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface LocationData {
  lat: number;
  long: number;
  road: string;
  city: string;
  province: string;
  district?: string;
  subdistrict?: string;
}

interface MapPickerProps {
  onLocationSelect: (data: LocationData) => void;
  initialPosition?: [number, number];
}

// ✅ custom icon supaya marker muncul
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({
  onLocationSelect,
  initialPosition,
}: {
  onLocationSelect: (data: LocationData) => void;
  initialPosition?: [number, number];
}) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialPosition || null
  );

  // 🔄 Kalau ada initialPosition, langsung lakukan reverse geocoding biar field keisi
  useEffect(() => {
    if (initialPosition) {
      const [lat, lng] = initialPosition;
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      )
        .then((res) => res.json())
        .then((data) => {
          onLocationSelect({
            lat,
            long: lng,
            road: data.address.road || "",
            city:
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "",
            province: data.address.state || "",
            district: data.address.county || "",
            subdistrict:
              data.address.suburb ||
              data.address.village ||
              data.address.hamlet ||
              "",
          });
        });
    }
  }, [initialPosition, onLocationSelect]);

  // 🔄 Update kalau user klik map
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();

        onLocationSelect({
            lat,
            long: lng,
            road: data.address.road || "",
            city:
                data.address.city ||
                data.address.town ||
                data.address.village ||
                "",
            province: data.address.state || "",
            district: data.address.county || "",
            subdistrict:
                data.address.suburb ||
                data.address.village ||
                data.address.hamlet ||
                "",
        });
    },
  });

  return position ? <Marker position={position} icon={customIcon} /> : null;
}

export default function MapPicker({
    onLocationSelect,
    initialPosition,
}: MapPickerProps) {
    const defaultCenter: [number, number] = initialPosition || [-6.200000, 106.816666]; // default Jakarta

    return (
        <MapContainer
            center={defaultCenter}
            zoom={13}
            style={{ height: "200px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarker
                onLocationSelect={onLocationSelect}
                initialPosition={initialPosition}
            />
        </MapContainer>
    );
}
