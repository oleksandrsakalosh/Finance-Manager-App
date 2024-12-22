import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SignIn from "./components/auth/SignIn";
import Dashboard from "./components/dashboard/Dashboard";
import IncomesExpenses from "./components/inc-exp/IncomesExpenses";
import GoalsLimits from "./components/goal-lim/GoalsLimits";
import Header from "./components/header/Header";
import WelcomePage from "./components/welcome-page/WelcomePage";
import Settings from "./components/settings/Settings";
import PrivateRoute from "./components/PrivateRoute";
import SignUp from "./components/auth/SignUp";
function App() {
    const onChange = () => {};

    return (
        <div>
            <Header/>
            <Router>
                <Routes>
                    <Route
                    path="/"
                    element={<WelcomePage/>}
                    />
                    <Route
                        path="/signin"
                        element={<SignIn/>}
                    />
                    <Route
                        path="/signup"
                        element={<SignUp/>}
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/incomes-expenses"
                        element={
                            <PrivateRoute>
                                <IncomesExpenses onChange={onChange}/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/goals-limits"
                        element={
                            <PrivateRoute>
                                <GoalsLimits/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <PrivateRoute>
                                <Settings/>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
