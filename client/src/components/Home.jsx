import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const apiKey = import.meta.env.VITE_API_KEY;
  const handleLogout = async () => {
    await axios
      .get(`${apiKey}/auth/logout`)
      .then((res) => {
        if (res.data.status) {
          navigate("/login");
          console.log("Logout Sucessfull");
        }
      })
      .catch((err) => {
        console.error(err);
        console.log("Error in Logout");
      });
  };
  return (
    <div>
      <h1 className="bg-red-500 ">HomePage</h1>
      <br />
      <div className="flex flex-col space-y-2">
        <button>
          <Link to={"/dashboard"}>Dashboard</Link>
        </button>
        <button onClick={handleLogout}>
          <Link>Logout</Link>
        </button>
      </div>
    </div>
  );
};

export default Home;
