import { BrowserRouter, Route, Routes } from 'react-router-dom';

import {
  PrivateRoute,
  PublicOnlyRoute,
} from '@/common/components/routes/ProtectedRoutes';
import { UserProvider } from '@/common/contexts/UserContext';
import NavLayout from '@/common/layouts/NavLayout';
import AuthCallback from '@/pages/account/AuthCallback';
import Login from '@/pages/account/Login';
import RequestPasswordReset from '@/pages/account/RequestPasswordReset';
import ResetPassword from '@/pages/account/ResetPassword';
import SignUp from '@/pages/account/SignUp';
import Communications from '@/pages/communications/Communications';
import Dashboard from '@/pages/dashboard/Dashboard';
import Database from '@/pages/database/Database';
import Home from '@/pages/home/Home';
import NotFound from '@/pages/not-found/NotFound';
import OaktonIntake from '@/pages/oakton-intake/oakton-intake';

import './App.css';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Forms */}
          <Route path='/apply/oakton' element={<OaktonIntake />} />

          {/* Internal Page */}
          <Route path='/' element={<NavLayout />}>
            <Route index element={<Home />} />
            {/* 2. Keep the empty PrivateRoute wrapper for future protected pages */}
            <Route element={<PrivateRoute />}>
               {/* Dashboard will go here later */}
            </Route>
            <Route path='communications' element={<Communications />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='database' element={<Database />} />
            <Route element={<PublicOnlyRoute />}>
              <Route path='login' element={<Login />} />
              <Route path='signup' element={<SignUp />} />
              <Route
                path='forgot-password'
                element={<RequestPasswordReset />}
              />
            </Route>
            <Route path='auth/callback' element={<AuthCallback />} />
            <Route path='auth/reset-password' element={<ResetPassword />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
