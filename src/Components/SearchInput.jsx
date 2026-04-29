import { useRef, useState } from "react";
import { Autocomplete, Loader } from "@mantine/core";

export function SearchInput({ onSelect }) {
  const timeoutRef = useRef(-1);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleChange = (val) => {
    window.clearTimeout(timeoutRef.current);
    setValue(val);
    setData([]);

    if (val.trim().length < 3) {
      setLoading(false);
      return;
    }

    setLoading(true);
    timeoutRef.current = window.setTimeout(async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=5&countrycodes=se`,
      );
      const results = await res.json();
      setLoading(false);
      setData(
        results.map((r) => ({ value: r.display_name, lat: r.lat, lon: r.lon })),
      );
    }, 500);
  };

  return (
    <Autocomplete
      value={value}
      data={data.map((r) => r.value)}
      onChange={handleChange}
      onOptionSubmit={(val) => {
        const found = data.find((r) => r.value === val);
        if (found)
          onSelect({
            name: val,
            lat: parseFloat(found.lat),
            lon: parseFloat(found.lon),
          });
      }}
      rightSection={loading ? <Loader size={16} /> : null}
      label="Sök plats"
      placeholder="T.ex. Stockholm, Göteborg..."
    />
  );
}
