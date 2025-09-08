import { useState, useEffect } from "react";
import axios from "axios";

export interface Wilayah {
    id: string;
    name: string;
}

interface Props {
  provinceId?: string;
  cityId?: string;
  districtId?: string;
}

export default function useWilayah({ provinceId, cityId, districtId }: Props) {
  const [provinces, setProvinces] = useState<Wilayah[]>([]);
  const [cities, setCities] = useState<Wilayah[]>([]);
  const [districts, setDistricts] = useState<Wilayah[]>([]);
  const [postalCodes, setPostalCodes] = useState<string[]>([]);

  useEffect(() => {
    axios
        .get<Wilayah[]>("https://rifkyr990.github.io/api-wilayah-indonesia/api/provinces.json")
        .then((res) => setProvinces(res.data));
  }, []);

  useEffect(() => {
    if (provinceId) {
      axios
        .get<Wilayah[]>(`https://rifkyr990.github.io/api-wilayah-indonesia/api/regencies/${provinceId}.json`)
        .then((res) => setCities(res.data));
      setDistricts([]);
      setPostalCodes([]);
    }
  }, [provinceId]);

  useEffect(() => {
    if (cityId) {
      axios
        .get<Wilayah[]>(`https://rifkyr990.github.io/api-wilayah-indonesia/api/districts/${cityId}.json`)
        .then((res) => setDistricts(res.data));
      setPostalCodes([]);
    }
  }, [cityId]);

  useEffect(() => {
    if (districtId) {
      // Hardcode sementara
      setPostalCodes(["40111", "40112", "40113"]);
    }
  }, [districtId]);

  return { provinces, cities, districts, postalCodes };
}
