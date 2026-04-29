# :house_with_garden: GreenHouse

> Check air pollution, water quality before buying a home in Sweden.

Built for the **[Icons Of Hackathon 2026](https://www.iconsof.se)**

---

## :earth_africa: What It Does

GreenHouse helps home buyers make smarter decisions by showing environmental data for any address in Sweden:

- :wind_blowing_face: **Air quality** — air pollutant releases near the property
- :droplet: **Water quality** — water pollutant releases near the property

---

## :rocket: Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## :tools: Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite |
| Map | Leaflet / React-Leaflet |
| Data | F1/F2 Nordic Releases (CSV), Open-Meteo Air Quality API |
| Styling | CSS Modules / Mantine |

---

## :file_folder: Data Sources

### :wind_blowing_face: F1 — Air Releases from Facilities (Nordics) and open-meteo.com/air-quality-api
**File:** `F1_4_Air_Releases_Facilities_Nordics.csv`  
**Key fields:** facility name, coordinates, pollutant type, release amount (kg/year), industrial sector, reporting year

---

### :droplet: F2 — Water Releases from Facilities (Nordics)
**File:** `F2_4_Water_Releases_Facilities_Nordics.csv`  
**Key fields:** facility name, coordinates, pollutant type, discharge amount (kg/year), target (water/sea), reporting year


---

## :trophy: Hackathon

This project was built at the **Icons Of Hackathon 2026**.

> Built with :heart: for [Icons Of](https://www.linkedin.com/company/iconsof)

---

## :woman_technologist: Team

- Codezilla
