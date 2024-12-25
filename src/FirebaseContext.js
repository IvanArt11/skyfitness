import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

//Использование контекста для управления состоянием Firebase
const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  const [status, setStatus] = useState({
    isChecking: true,
    isWorking: false,
    error: null,
    details: null,
  });

  const value = {
    status,
    setStatus,
  };

  return (
    //Использование FirebaseProvider
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

//Добавление типов
FirebaseProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};
