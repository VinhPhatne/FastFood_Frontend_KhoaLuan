import { useState } from "react";
import axios from "axios";

const useFetch = (config) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (endpoint, pathParams = {}, requestData = null) => {
    try {
      let endpointConfig = config[endpoint];

      // Nếu endpointConfig là một hàm, cần gọi nó với pathParams để lấy config đúng
      if (typeof endpointConfig === "function") {
        endpointConfig = endpointConfig(pathParams.id);
      }

      if (!endpointConfig) {
        throw new Error(`Endpoint ${endpoint} not found in config`);
      }

      const response = await axios({
        url: endpointConfig.url,
        method: endpointConfig.method,
        headers: endpointConfig.headers,
        data: requestData,
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    data,
    error,
    fetchData,
  };
};

export default useFetch;
