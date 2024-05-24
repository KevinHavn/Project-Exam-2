/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const Fetch = ({ endpoint, render }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseUrl = "https://v2.api.noroff.dev/holidaze/";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(baseUrl + endpoint);
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint]); 

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return render(data);
};

export default Fetch;
