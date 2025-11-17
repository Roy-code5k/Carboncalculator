


const axios = require("axios");

const API_URL = "https://beta3.api.climatiq.io/estimate";

async function calculateTravelEmissions({ distance_km, fuelType }) {
try {
const response = await axios.post(
API_URL,
{
model: "cm_91C1YjSmxJdnMJnQHQx5y8", // Official car emissions model
parameters: {
distance: distance_km,
distance_unit: "km",
fuel_type: fuelType
}
},
{
headers: {
Authorization: `Bearer ${process.env.CLIMATIQ_API_KEY}`,
"Content-Type": "application/json"
}
}
);

return response.data.co2e;
} catch (err) {
console.error("Climatiq API Error:", err.response?.data || err.message);
return 0;
}
}

module.exports = { calculateTravelEmissions };