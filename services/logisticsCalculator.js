// src/services/logisticsCalculator.js

const BASE_RATES = {
  LOCAL: 500, // Base fee per KM
  INTERNATIONAL_SEA: 2500, // Base fee per KG
  INTERNATIONAL_AIR: 8500, // Base fee per KG
};

export const calculateLogistics = (form, isInternational = false) => {
  const weight = parseFloat(form.weight) || 0;
  
  if (isInternational) {
    // Basic International Calculation
    const rate = form.transport === 'Air' ? BASE_RATES.INTERNATIONAL_AIR : BASE_RATES.INTERNATIONAL_SEA;
    const price = weight * rate + 50000; // + Fixed customs/clearing fee
    
    return {
      estimatedPrice: price,
      estimatedTime: form.transport === 'Air' ? "3-5 Days" : "21-30 Days",
      recommendedVehicle: form.transport === 'Air' ? "Cargo Aircraft" : "20ft/40ft Container",
      specialAdvice: "Ensure all phytosanitary certificates and export manifests are attached."
    };
  }

  // Basic Local Calculation (Distance estimate logic)
  const basePrice = 5000;
  const weightSurcharge = weight * 200;
  const estimatedDistance = 50; // In a real app, use Google Maps API distance here
  
  return {
    estimatedPrice: basePrice + weightSurcharge + (estimatedDistance * 100),
    estimatedTime: "2-6 Hours",
    recommendedVehicle: weight > 500 ? "7-Ton Truck" : "Delivery Van",
    specialAdvice: "Pack perishables in crates to avoid bruising during transit."
  };
};