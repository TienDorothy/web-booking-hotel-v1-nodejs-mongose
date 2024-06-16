import { useEffect, useState } from "react";
import axiosConfig from "../api/axiosConfig";
const useFetch = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await axiosConfig.get(endpoint);
        setData(result.data);
      } catch (error) {
        setError(error);
      }

      setLoading(false);
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};

export default useFetch;
