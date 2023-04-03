import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../hooks/useFirebase";
import { useToast } from "../hooks/useToast";
import { useMutation } from "@tanstack/react-query";

type AuthProviderProps = {
  children: ReactNode;
};

export interface IUser {
  user: User | null;
  superUser: boolean;
};

export interface IAuthSignIn {
  email: string;
  password: string;
};

export interface IAuthSignUp {
  email: string;
  password: string;
  passwordConfirmation: string;
  firstName: string;
  lastName: string;
  postcode: string;
  addressLine1: string;
  addressLine2: string;
  town: string;
};

export interface IUserDetails {
  uid: string;
  firstName: string;
  lastName: string;
  postcode: string;
  addressLine1: string;
  addressLine2: string;
  town: string;
}

export const superUsers = ["bpvanzalk@hotmail.com"];

export const defaultNoUser = {
  user: null,
  superUser: false,
}

type AuthContextTypes = {
  currentUser: IUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<IUser>>;
  signUp: (email: string, password: string, firstName: string, lastName: string, postcode: string, addressLine1: string, addressLine2: string, town: string) => Promise<any>;
  logOut: () => void;
  signIn: (email: string, password: string) => Promise<any>;
  error: string | undefined;
  loading: boolean;
};

const AuthContext = createContext({} as AuthContextTypes);

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<IUser>(defaultNoUser);
  const navigate = useNavigate();
  const { addUserDetails } = useFirebase();
  const {
    mutateAsync,
    isLoading,
    isError
  } = useMutation((user: IUserDetails) => addUserDetails(user));
  const toast = useToast();

  async function signUp(
    email: string, 
    password: string, 
    firstName: string,
    lastName: string,
    postcode: string, 
    addressLine1: string, 
    addressLine2: string, 
    town: string
  ) {
    setLoading(true)
    setError(undefined)
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      const uid = user?.uid;
      if (!uid) throw new Error(`No uid returned for ${user}`)
      await mutateAsync({uid, firstName, lastName, postcode, addressLine1, addressLine2, town});
    } catch (err) {
      setError(`Sign up credentials are not correct.`)
      console.error(`Error signing in : ${err}`)
    } finally {
      setLoading(false)
    }
  }

  async function logOut() {
    setLoading(true)
    setError(undefined)
    try {
      await auth.signOut()
      setCurrentUser({
        user: null,
        superUser: false,
      });
      toast.info('You have successfully logged out!')
      navigate("/");
    } catch (err) {
      console.error('Error with signing out')
      setError(`Error signing out`)
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    setLoading(true)
    setError(undefined)
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log({user})
      setCurrentUser({
        user,
        superUser: superUsers.includes(user?.email?.toLowerCase() ?? "")
      })
    } catch (err) {
      setError(`Sign up credentials are not correct.`)
      console.error(`Error signing in : ${err}`)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    if (!loading) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log("inside", user);
        if (user) {
          setCurrentUser({
            user,
            superUser: superUsers.includes(user?.email?.toLowerCase() ?? ""),
          });
        }
      });
      console.log("useEffect in AuthContext", { currentUser });

      return unsubscribe;
    }
  }, [loading]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        signUp,
        logOut,
        signIn,
        loading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
