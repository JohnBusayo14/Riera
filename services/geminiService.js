export const getLogisticsRecommendation = async (data) => {
  const { 
    produceType, 
    isInternational = false, 
    weight = 0, 
    transportMode,
    pickup,
    dropoff
  } = data;

  // Simulate a small delay so the loading spinners still look natural
  await new Promise(resolve => setTimeout(resolve, 800));

  try {
    const numWeight = parseFloat(weight) || 0;

    if (isInternational) {
      // Logic for Global Export
      const ratePerKg = transportMode === 'Air' ? 8500 : 2500;
      const basePrice = numWeight * ratePerKg;
      const promotionalPrice = Math.max(basePrice * 0.1, 50000); // 10x lower promotional rate

      return {
        estimatedPrice: Math.round(promotionalPrice),
        recommendedVehicle: transportMode === 'Air' ? "Cargo Aircraft" : "20ft Container",
        specialAdvice: "Promotional export rate applied. HS Code validation required for Nigerian Customs.",
        estimatedTime: transportMode === 'Air' ? "3-5 Days" : "21-30 Days",
        hsCodeHint: "0701.90 (Vegetables/General)",
        documentRequirements: [
          "NEPC Export Certificate",
          "Phytosanitary Certificate",
          "NXP Form",
          "Commercial Invoice"
        ]
      };
    } else {
      // Logic for Local Logistics (Promotional Phase)
      // Fixed rates between ₦1,000 and ₦5,000 as requested in your prompt
      const localBase = 1500;
      const weightBonus = numWeight * 50;
      const promotionalPrice = Math.min(localBase + weightBonus, 5000);

      return {
        estimatedPrice: Math.round(promotionalPrice),
        recommendedVehicle: numWeight > 500 ? "5-Ton Truck" : "Small Delivery Van",
        specialAdvice: "Promotional local rate active. Valid for same-day delivery.",
        estimatedTime: "2-5 Hours",
        documentRequirements: ["Goods Waybill"]
      };
    }
  } catch (error) {
    console.error("Local Calculation Error:", error);
    // Fallback if math fails
    return {
      estimatedPrice: isInternational ? 50000 : 2500,
      recommendedVehicle: "Standard Carrier",
      specialAdvice: "Rate calculated based on standard base fees.",
      estimatedTime: "Check with agent",
      documentRequirements: []
    };
  }
};