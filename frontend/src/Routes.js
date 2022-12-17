import "./App.css";
import React from "react";
import { BrowserRouter, Routes as Switch, Route } from "react-router-dom";
import Home from "./core/Home";
import ProsumerDashboard from "./prosumer/ProsumerDashboard";
import ConsumerDashboard from "./prosumer/ConsumerDashboard";
import EscrowDashboard from "./prosumer/EscrowDashboard";
import Signin from "./prosumer/Signin";
import Signup from "./prosumer/Signup";
import AddProsumer from "./admin/AddProsumer";
import ExecuteTransaction from "./admin/ExecuteTransaction";
import About from "./core/About";
import Card from "./core/Card";
import ViewAllPendingTxns from "./admin/ViewAllPendingTxns";
import ViewAllTransactions from "./core/ViewAllTransactions";

/*---Admin Routes & Private Routes----*/
import AdminRoutes from "./auth/helper/AdminRoutes";
import PrivateRoutes from "./auth/helper/PrivateRoutes";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/about" element={<About />} />
        <Route path="/card" element={<Card />} />
        <Route path="/transactions" element={<ViewAllTransactions />} />

        <Route exact path="/prosumer/dashboard" element={<PrivateRoutes />}>
          <Route
            exact
            path="/prosumer/dashboard"
            element={<ProsumerDashboard />}
          />
        </Route>
        <Route exact path="/consumer/dashboard" element={<PrivateRoutes />}>
          <Route
            exact
            path="/consumer/dashboard"
            element={<ConsumerDashboard />}
          />
        </Route>
        <Route exact path="/escrow/dashboard" element={<AdminRoutes />}>
          <Route exact path="/escrow/dashboard" element={<EscrowDashboard />} />
        </Route>
        <Route
          exact
          path="/escrow/pendingtransactions"
          element={<AdminRoutes />}
        >
          <Route
            exact
            path="/escrow/pendingtransactions"
            element={<ViewAllPendingTxns />}
          />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
