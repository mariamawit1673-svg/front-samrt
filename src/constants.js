export const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:10000/api";

export const emptyProfile = {
  location: "",
  farmSize: "",
  soilType: "loam",
  preferredCrops: "",
  irrigationAvailable: false,
};

export const emptyRecommendation = {
  soilType: "loam",
  season: "rainy",
  rainfall: "medium",
  temperature: "warm",
  location: "",
  irrigationAvailable: false,
};

export const emptyCrop = {
  name: "",
  soilTypes: "loam",
  seasons: "rainy",
  rainfall: "medium",
  temperature: "warm",
  waterRequirement: "medium",
  fertilizerAdvice: "",
  pestAdvice: "",
  harvestPeriod: "",
  description: "",
};

export const soilOptions = ["loam", "clay", "sandy", "black"];
export const seasonOptions = ["rainy", "dry"];
export const rainfallOptions = ["low", "medium", "high"];
export const temperatureOptions = ["moderate", "warm", "hot"];
export const waterOptions = ["low", "medium", "high"];
