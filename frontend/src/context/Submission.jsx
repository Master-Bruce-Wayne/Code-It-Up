import { createContext, useContext, useState, useEffect } from "react";

export const SubmissionContext = createContext(null);

export const SubmissionProvider = ({ children }) => {
  const [submissionData, setSubmissionData] = useState(null);

  useEffect(() => {
    const savedSubmissions = localStorage.getItem("submissionData");
    if (savedSubmissions) {
      setSubmissionData(JSON.parse(savedSubmissions));
    }
  }, []);

  return (
    <SubmissionContext.Provider value={{ submissionData, setSubmissionData }}>
      {children}
    </SubmissionContext.Provider>
  );
};

export const useSubmissions = () => useContext(SubmissionContext);
