import { apiClient } from "../../lib/api-client";

export const getHealthcheck = async () => {
  const response = await apiClient.healthcheck.$get();

  return await response.json();
};
