import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import { PATHS } from './paths';
import Dashboard from '../pages/Dashboard/Dashboard';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';

export default function AppRouter() {
  return (
    <Routes>
      <Route path={PATHS.HOME} element={<Home />} />
      <Route path={PATHS.LOGIN} element={<Login />} />
      <Route path={PATHS.REGISTER} element={<Register />} />

      <Route
        path={PATHS.DASHBOARD}
        element={(
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      />

      <Route element={<MainLayout />}>
        <Route path={PATHS.NOT_FOUND} element={<Navigate to={PATHS.HOME} replace />} />
      </Route>
    </Routes>
  );
}