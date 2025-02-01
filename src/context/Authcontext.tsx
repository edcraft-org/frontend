import { createContext, useEffect, useReducer, ReactNode, Dispatch } from "react";
import { supabase } from "../../supabaseClient";
import { User as SupabaseUser } from "@supabase/supabase-js";

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

const INITIAL_STATE: AuthState = {
  user: JSON.parse(localStorage.getItem("user") as string) || null,
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
    const getUser = async () => {
      dispatch({ type: "LOGIN_START" });
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        dispatch({ type: "FAILURE", payload: error.message });
      } else if (session) {
        const user = mapSupabaseUserToUser(session.user);
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const user = mapSupabaseUserToUser(session.user);
        dispatch({ type: "SUCCESS", payload: user });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  const mapSupabaseUserToUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name: supabaseUser.user_metadata.full_name || "",
      role: supabaseUser.user_metadata.role || "user",
    };
  };

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