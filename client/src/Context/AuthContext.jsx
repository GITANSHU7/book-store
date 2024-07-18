// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/checkAuth', { withCredentials: true })
      .then(response => {
        setAuthenticated(response.data.authenticated);
      })
      .catch(() => {
        setAuthenticated(false);
      });
  }, []);

  
  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// // AuthContext.js
// import React, { createContext, useState, useContext, useEffect } from "react";

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [authenticated, setAuthenticated] = useState(true);

//   useEffect(() => {
//     const store = JSON.parse(localStorage.getItem("userData") || "{}");
//     const apiToken = store?.data?.token;
//     console.log(apiToken, "DSfdf")
//     if (!apiToken) {
//          setAuthenticated(false);

//     } else {
//       setAuthenticated(true);
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
