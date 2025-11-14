// const express = require('express');
// const router = express.Router();
// router.post('/calculate', (req, res) => {
//     res.json({message: "Emissions route Working"});
// });
// module.exports = router;

const express = require("express");
const router = express.Router();

// Emission factors in kg CO2 per km per passenger (rough illustrative values)
const VEHICLE_FACTORS = {
  car: {
    petrol: 0.18,
    diesel: 0.20,
    cng: 0.14,
    electricity: 0.06
  },

  bus: {
    diesel: 0.08,
    petrol: 0.09,
    cng: 0.06,
    electricity: 0.04
  },

  train: {
    electricity: 0.02,
    diesel: 0.04
  },

  bike: {
    petrol: 0.03,
    diesel: 0.035,
    cng: 0.02,
    electricity: 0.01
  },

  // Flights: per passenger-km, very rough including non-CO2 effects
  flight_short: {
    default: 0.25
  },
  flight_long: {
    default: 0.15
  }
};

// Food emissions per person per year (kg CO2e), rough
const FOOD_FACTORS = {
  none: 0,  
  meat_heavy: 3500,
  average: 2500,
  vegetarian: 1700,
  vegan: 1400
};

// Household electricity
const ELECTRICITY_FACTOR = 0.82; // kg CO2 per kWh (example)

// Waste emissions
const WASTE_LANDFILL_FACTOR = 0.5; // kg CO2 per kg waste landfilled

router.post("/calculate", (req, res) => {
  console.log("Received /api/emissions/calculate request", req.body);

    const {
    carKm,
    vehicleType,
    fuelType,
    electricityUsage,
    dietType,
    wasteKgPerWeek,
    recyclingRate,
    waterLitersPerDay
  } = req.body;

  const km = Number(carKm) || 0;
  const electricity = Number(electricityUsage) || 0;
  const type = vehicleType || "car";

  // Transport emissions
  const vehicleFactors = VEHICLE_FACTORS[type] || {};
  const perKmFactor =
    vehicleFactors[fuelType] ??
    vehicleFactors.default ??
    0;

  const transportCO2 = km * perKmFactor;

  // Electricity emissions
  const electricityCO2 = electricity * ELECTRICITY_FACTOR;

  // Food emissions
  const diet = dietType || "average";
  let foodCO2;
  if (diet === "none") {
    foodCO2 = 0;
  }  else {
      foodCO2 = FOOD_FACTORS[diet] ?? FOOD_FACTORS.average;
  } 

  
  

 const WASTE_LANDFILL_FACTOR = 0.5; // kg CO2 per kg waste landfilled
  // Water emissions (supply + treatment), rough value
  // ~0.0003 kg CO2 per litre (0.3 kg per m³)
  const WATER_FACTOR_PER_LITRE = 0.0003;
  // Waste & recycling emissions
  const wasteKg = Number(wasteKgPerWeek) || 0;
  const recyclePct = Math.min(Math.max(Number(recyclingRate) || 0, 0), 100) / 100;
  const landfilledKgPerYear = wasteKg * 52 * (1 - recyclePct);
  const wasteCO2 = landfilledKgPerYear * WASTE_LANDFILL_FACTOR;
   const waterLitresPerDayNum = Number(waterLitersPerDay) || 0;
  const waterLitresPerYear = waterLitresPerDayNum * 365;
   const waterCO2 = waterLitresPerYear * WATER_FACTOR_PER_LITRE;

  const total = transportCO2 + electricityCO2 + foodCO2 + wasteCO2 + waterCO2;





  res.json({
    vehicleType: type,
    fuelType,
    transportCO2,
    electricityCO2,
    foodCO2,
    wasteCO2,
    waterCO2,
    total,
    message: "Carbon footprint calculated successfully"
  });
});

module.exports = router;