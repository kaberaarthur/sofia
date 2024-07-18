import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import NoSidebarLayout from './layout/NoSidebarLayout';

// Ops Pages
import OpsDashboard from './pages/OpsDashboard/OpsDashboard';
import OpsSignIn from './pages/Authentication/OpsSignIn';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      <Route
        path="/sofia/opsdashboard"
        element={
          <DefaultLayout>
            <PageTitle title="Ops Dashboard" />
            <OpsDashboard />
          </DefaultLayout>
        }
      />
      <Route
        path="/sofia/opssignin"
        element={
          <NoSidebarLayout>
            <PageTitle title="Ops Sign In" />
            <OpsSignIn />
          </NoSidebarLayout>
        }
      />
      <Route
        index
        element={
          <DefaultLayout>
            <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <ECommerce />
          </DefaultLayout>
        }
      />
      <Route
        path="/sofia/calendaroo"
        element={
          <DefaultLayout>
            <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <Calendar />
          </DefaultLayout>
        }
      />
      <Route
        path="/sofia/profile"
        element={
          <DefaultLayout>
            <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <Profile />
          </DefaultLayout>
        }
      />
      <Route
        path="/forms/form-elements"
        element={
          <DefaultLayout>
            <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <FormElements />
          </DefaultLayout>
        }
      />
      <Route
        path="/forms/form-layout"
        element={
          <DefaultLayout>
            <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <FormLayout />
          </DefaultLayout>
        }
      />
      <Route
        path="/tables"
        element={
          <DefaultLayout>
            <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <Tables />
          </DefaultLayout>
        }
      />
      <Route
        path="/sofia/settings"
        element={
          <DefaultLayout>
            <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <Settings />
          </DefaultLayout>
        }
      />
      <Route
        path="/chart"
        element={
          <DefaultLayout>
            <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <Chart />
          </DefaultLayout>
        }
      />
      <Route
        path="/ui/alerts"
        element={
          <DefaultLayout>
            <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <Alerts />
          </DefaultLayout>
        }
      />
      <Route
        path="/ui/buttons"
        element={
          <DefaultLayout>
            <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <Buttons />
          </DefaultLayout>
        }
      />
      <Route
        path="/sofia/auth/signin"
        element={
          <NoSidebarLayout>
            <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <SignIn />
          </NoSidebarLayout>
        }
      />
      <Route
        path="/sofia/auth/signup"
        element={
          <NoSidebarLayout>
            <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <SignUp />
          </NoSidebarLayout>
        }
      />
    </Routes>
  );
}

export default App;
