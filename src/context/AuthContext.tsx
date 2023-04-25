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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "../hooks/useLocalStorage";

type AuthProviderProps = {
  children: ReactNode;
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

export interface IUser {
  user: User | null;
  superUser: boolean;
  userDetails: IUserDetails[];
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

export const superUsers = ["bpvanzalk@hotmail.com"];

const defaultUserDetails = [{
  uid: '',
  firstName: '',
  lastName: '',
  postcode: '',
  addressLine1: '',
  addressLine2: '',
  town: '',
}];

export const defaultNoUser = {
  user: null,
  superUser: false,
  userDetails: defaultUserDetails,
}

type AuthContextTypes = {
  currentUser: IUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<IUser>>;
  signUp: (email: string, password: string, firstName: string, lastName: string, postcode: string, addressLine1: string, addressLine2: string, town: string) => Promise<any>;
  logOut: () => void;
  signIn: (email: string, password: string) => Promise<any>;
  error: string | undefined;
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
  loading: boolean;
  userDetails: IUserDetails[] | undefined;
};

const AuthContext = createContext({} as AuthContextTypes);

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useLocalStorage<IUser>(
    "user",
    defaultNoUser
  );;
  const navigate = useNavigate();
  const { addUserDetails, getUserDetails } = useFirebase();

  const {
    mutateAsync: mutateAsyncAddUser,
  } = useMutation((user: IUserDetails) => addUserDetails(user));

  const { 
    data: userDetails,
  } = useQuery<IUserDetails[]>(
    ["userDetails", currentUser?.user?.uid],
    getUserDetails,
    {
      enabled: !!currentUser.user,
    }
  ); 

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
      await mutateAsyncAddUser({uid, firstName, lastName, postcode, addressLine1, addressLine2, town});
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
        userDetails: [],
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
      setCurrentUser(prevUser => ({
        ...prevUser,
        user,
        superUser: superUsers.includes(user?.email?.toLowerCase() ?? "")
      }))
    } catch (err) {
      if (err && typeof err === 'object' && 'code' in err) {
        console.error(`Error signing in : ${err.code}`)
        setError(err.code as string)
      }      
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    console.log(1)
    if (!loading) {
      console.log(2)
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log(3, user, auth, userDetails, currentUser.user)
        if (user) {
          console.log(4, userDetails)
          setCurrentUser({
            user,
            superUser: superUsers.includes(user?.email?.toLowerCase() ?? ""),
            userDetails: userDetails ?? defaultUserDetails,
          });
        }
      });

      return unsubscribe;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, userDetails]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        signUp,
        logOut,
        signIn,
        loading,
        error,
        setError,
        userDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
