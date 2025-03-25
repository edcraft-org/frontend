import { useContext, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { supabase } from "../supabaseClient";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { AuthContext } from './context/Authcontext';
import { basePath } from './utils/api/Constants';

function App() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch(basePath)
      .catch((err) => console.error("Error pinging backend", err));
  }, []);

  if (!user) {
    return (
      <div className="auth-container">
        <h2 className="auth-title">Welcome to EdCraft!</h2>
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['google', 'azure']} />
      </div>
    );
  } else {
    return (
      <RouterProvider router={router} />
    );
  }
}

export default App;