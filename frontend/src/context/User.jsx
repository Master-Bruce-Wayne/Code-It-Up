import { createContext, useContext, useState } from "react";
import axios from 'axios';

export const UserContext = createContext(null);

export const UserProvider = (props) => {
    const [userData,setUserData] = useState(null);
    return (
        <UserContext.Provider value={{userData,setUserData}} >
            {props.children}
        </UserContext.Provider>
    )
}

export const useAuth = () => {
    const user = useContext(UserContext);
    return user;
}