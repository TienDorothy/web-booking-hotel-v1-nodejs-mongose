import { useEffect, useState } from "react";
import axiosConfig from '../api/axiosConfig';

const useFetch = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // To track if component is still mounted
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await axiosConfig.get(endpoint);
        if (isMounted) {
          setData(result.data);
        }
      } catch (error) {
        if (isMounted) {
          setError(error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup function to set isMounted to false when component unmounts
    };
  }, [endpoint]);

  return { data, loading, error };
};

export default useFetch;
