import axios from "axios";

const BASE_URL = "https://rickandmortyapi.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const fetchFromAPI = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) throw new Error("Resource not found");
      throw new Error(`HTTP error! status: ${error.response.status}`);
    } else if (error.request) throw new Error("No response from server");
    else throw new Error(`Error: ${error.message}`);
  }
};

//character
export const getCharacters = async (page = 1) => {
  return await fetchFromAPI(`/character/?page=${page}`);
};

export const getCharacterById = async (id) => {
  return await fetchFromAPI(`/character/${id}`);
};

export const getMultipleCharacters = async (ids) => {
  if (!ids || ids.length === 0) return [];
  const idsString = ids.join(",");
  return await fetchFromAPI(`/character/${idsString}`);
};

//location
export const getLocations = async (page = 1) => {
  return await fetchFromAPI(`/location/?page=${page}`);
};

export const getLocationById = async (id) => {
  return await fetchFromAPI(`/location/${id}`);
};

//episode
export const getEpisodes = async (page = 1) => {
  return await fetchFromAPI(`/episode/?page=${page}`);
};

export const getEpisodeById = async (id) => {
  return await fetchFromAPI(`/episode/${id}`);
};

export const getMultipleEpisodes = async (ids) => {
  if (!ids || ids.length === 0) return [];
  const idsString = ids.join(",");
  return await fetchFromAPI(`/episode/${idsString}`);
};

//Filter & Search
export const filterCharacters = async (filters = {}, page = 1) => {
  try {
    const response = await api.get("/character/", {
      params: { page, ...filters },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Resource not found");
    }
    throw error;
  }
};

export const filterLocations = async (filters = {}, page = 1) => {
  try {
    const response = await api.get("/location/", {
      params: { page, ...filters },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Resource not found");
    }
    throw error;
  }
};

export const filterEpisodes = async (filters = {}, page = 1) => {
  try {
    const response = await api.get("/episode/", {
      params: { page, ...filters },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Resource not found");
    }
    throw error;
  }
};

export default api;
