import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import firebase from "firebase/compat";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

type AuthProviderProps = {
  children: ReactNode;
};

export type IUser = {
  user: firebase.User | null,
  superUser: boolean;
};

const superUsers = ['bpvanzalk@hotmail.com'];

type AuthContextTypes = {
  currentUser: IUser;
  signUp: (email: string, password: string) => Promise<any>;
  logOut: () => void;
  signIn: (email: string, password: string) => Promise<any>; 
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

const AuthContext = createContext({} as AuthContextTypes);

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [stateChange, setStateChange] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<IUser>({
    user: null,
    superUser: false,
  });
  const navigate = useNavigate();

  function signUp(email: string, password: string) {
    setStateChange(false);
    return new Promise((resolve, reject) => {
      const res = auth.createUserWithEmailAndPassword(email, password);
      if (res) {
        setStateChange(true);
        resolve(res)
      } else {
        reject('error')
      }      
    })        
  }

  function logOut() {
    setCurrentUser({
      user: null,
      superUser: false,
    });
    navigate("/");
  }

  function signIn(email: string, password: string) {
    setStateChange(false);
    return new Promise((resolve, reject) => {
      const res = auth.signInWithEmailAndPassword(email, password);
      if (res) {
        setStateChange(true)
        console.log({res})
        resolve(res)
      } else {
        reject('error')
      }      
    })
  }
console.log('outside')
  useEffect(() => {
    if (stateChange) {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        console.log('inside', user)
        if (user) {
          setCurrentUser({
            user,
            superUser: superUsers.includes(user?.email?.toLowerCase() ?? ''),
          });
        }
      });
      console.log('useEffect in AuthContext', { currentUser });
  
      return unsubscribe;
    }
  }, [stateChange]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signUp,
        logOut,
        signIn,        
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
