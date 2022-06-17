import axios from "axios";

const instance = axios.create({
  baseURL: "",
  // baseURL: "http://13.125.112.232",
  // headers: { "Content-Type": "application/json" },
});

const token = localStorage.getItem("token");

// instance.defaults.headers.common["Authorization"] = USER_TOKEN;
// instance.defaults.headers.common["Authorization"] = token? `Bearer ${token}` : null;
instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export default instance;
