
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useRef, use } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Input } from '@mui/material';
import { signIn, useSession } from "next-auth/react";

export interface AuthProvider {
  loggedIn: boolean
}

const AuthContext = createContext<AuthProvider>({
  loggedIn: false
} as AuthProvider);

const AuthProvider = ({ children }: {  children: React.ReactNode }) : JSX.Element => {
  const { data: session, status } = useSession()


  // State to hold the authentication token
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [pa, setPa] = useState<string>('');
  /** Utils */
  const logout =  useCallback(async () => {
  },[]);
  
  const handleOnchange = (e: any) => {
    setPa(e.target.value);
  } 
  useEffect(() => {
    if (status === "authenticated") {
      setLoggedIn(true);
    }

  }, [status]);
  
  
  
  useEffect(() => {
    console.log("sessions",status);
    const nextDay = localStorage.getItem('nextDay');
    if (nextDay) {
      const nextDayDate = new Date(nextDay);
      if (nextDayDate < new Date()) {
        localStorage.removeItem('nextDay');
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
    }
  }, []);

  useEffect(() => { 
    console.log(status)
    async function fetchMyAPI(pass) {
      const response: any = await signIn("credentials", {
        user: "doug",
        password: pass,
        redirect: false,
      });
      if (response.error) {
        return setLoggedIn(false);
      } else {
        return setLoggedIn(true);
      }
    }

    if (pa.length === 5) {
      const passed = fetchMyAPI(pa);
    }
  } ,[pa]);



  const modal = () => {
    return (      
      <Dialog open={true} onClose={()=> {}}  maxWidth="sm">
        <DialogContent>
          <Input placeholder="Passcode" value={pa} onChange={handleOnchange}/>
      </DialogContent>
    </Dialog>
    )
  }

   // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      loggedIn: false}),
    [loggedIn]
  );


  /** FamAuth Step 1 is a redirect to Fam to get an AuthCode */
  /** FamAuth Step 2 return from FamAuth with auth code then bounce to our api to get access_token */

  console.log("loggedIn",loggedIn);
  return (
    loggedIn ? ( <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider> )
    : modal()
  );
};

export function useAuth () {
  return useContext(AuthContext);
};

export default AuthProvider;


