import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_API_KEY;
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get(`${apiKey}/auth/verify`)
      .then((res) => {
        if (res.data.status) {
          console.log("Status Ok");
        } else {
          navigate("/");
        }
        console.log(res.data.status);
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
        navigate("/");
      });
  }, []);
  return (
    <div>
      <h1 className="bg-green-500 p-5">Dashboard</h1>
    </div>
  );
};

export default Dashboard;
