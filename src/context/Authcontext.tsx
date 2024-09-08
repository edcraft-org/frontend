import { createContext, useEffect, useReducer, ReactNode, Dispatch } from "react";

// Define a type for the user object
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Define types for the state and actions
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "SUCCESS"; payload: User }
  | { type: "FAILURE"; payload: string }
  | { type: "LOGOUT" };

const DEFAULT_USER: User = {
  id: "66dd222448be1d6689fb2822",
  email: "john.doe@example.com",
  name: "John Doe",
  role: "educator",
};

const INITIAL_STATE: AuthState = {
  user: JSON.parse(localStorage.getItem("user") as string) || DEFAULT_USER,
  loading: false,
  error: null,
};

export const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  error: string | null;
  dispatch: Dispatch<AuthAction>;
}>({
  user: INITIAL_STATE.user,
  loading: INITIAL_STATE.loading,
  error: INITIAL_STATE.error,
  dispatch: () => null,
});

const AuthReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case "SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case "FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};