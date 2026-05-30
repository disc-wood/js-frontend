import { BrowserRouter, Route, Routes } from 'react-router-dom';

import {
  PrivateRoute,
  PublicOnlyRoute,
  ProgramRoute,
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
import NotFound from '@/pages/not-found/NotFound';
import IhtuIntake from '@/pages/ihtu-intake/ihtu-intake';
import OaktonIntake from '@/pages/oakton-intake/oakton-intake';
import ManageAccess from '@/pages/manage-access/ManageAccess';
import ManageOakton from '@/pages/manage-oakton/ManageOakton';
import ManageIhtu from '@/pages/manage-ihtu/ManageIhtu';
import InviteAccept from '@/pages/invite/InviteAccept';
import Forms from '@/pages/forms/Forms';
import SubmissionSuccess from '@/pages/submission-success/SubmissionSuccess';

import './App.css';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Forms (public, no NavLayout) */}
          <Route path='/apply/oakton' element={<OaktonIntake />} />
          <Route path='/apply/ihtu' element={<IhtuIntake />} />
          <Route path='/apply/success' element={<SubmissionSuccess />} />

          {/* Internal pages (inside NavLayout) */}
          <Route path='/' element={<NavLayout />}>
            <Route index element={<Dashboard />} />

            {/* Empty PrivateRoute wrapper for future protected pages */}
            <Route element={<PrivateRoute />}>
              {/* Dashboard will go here later */}
            </Route>

            <Route path='communications' element={<Communications />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='database' element={<Database />} />
            <Route path='forms' element={<Forms />} />
            <Route path='manage-access' element={<ManageAccess />} />
            <Route element={<ProgramRoute programId='oakton' />}>
              <Route path='manage/oakton' element={<ManageOakton />} />
            </Route>
            <Route element={<ProgramRoute programId='ihtu' />}>
              <Route path='manage/ihtu' element={<ManageIhtu />} />
            </Route>
            <Route path='invite' element={<InviteAccept />} />

            <Route element={<PublicOnlyRoute />}>
              <Route path='login' element={<Login />} />
              <Route path='signup' element={<SignUp />} />
              <Route path='forgot-password' element={<RequestPasswordReset />} />
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