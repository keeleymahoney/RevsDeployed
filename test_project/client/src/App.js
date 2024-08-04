/**
 * @module App
 */

import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Landing';
import Settings from './Settings';
import Employees from './Employees';
import Trends from './Trends';
import MenuManager from './MenuManager';
import Suppliers from './Suppliers';
import CashierOrders from './CashierOrders';
import CashierSubmit from "./CashierSubmit";
import CustomerOrders from "./CustomerOrders";
import CustomerSubmit from "./CustomerSubmit";
import MenuBoardSettings from "./MenuBoardSettings";
import MenuBoard from "./MenuBoard";
import MenuBoard2 from "./MenuBoard2"
import MenuBoardImages from "./MenuBoardImages"
import Ingredients from './Ingredients';
import HandleOAuth from './HandleOAuth';
import OrderDisplays from './OrderDisplays';
import Kitchen from './Kitchen';
import RegularKitchen from './RegularKitchen';
import ManagerOrders from "./ManagerOrders";
import ManagerSubmit from "./ManagerSubmit";

/**
 * The App function sets up routing for different components in a React application using React Router.
 * @returns The App component is being returned, which contains a Router component wrapping multiple
 * @function App
 * Route components. Each Route component specifies a different path and renders a corresponding
 * component when that path is matched.
 */
function App() {

    return(
        <Router>
            <div className="App">
                <Routes className="routes-container">
                    <Route exact path="/" element={<Landing/>}/>
                    <Route exact path="/employees" element={<Employees/>} />
                    {/* Pass navigate function to Ingredients component */}
                    <Route exact path="/ingredients" element={<Ingredients />}/>
                    <Route exact path="/trends" element={<Trends/>}/>
                    <Route exact path="/menuManager" element={<MenuManager/>}/>
                    <Route exact path="/suppliers" element={<Suppliers />} />
                    <Route exact path="/cashierOrders" element={<CashierOrders/>}/>
                    <Route exact path="/cashierSubmit" element={<CashierSubmit/>}/>
                    <Route exact path="/suppliers/:ingredientName/:quantityDifference" element={<Suppliers />}/>
                    <Route exact path="/customerOrders" element={<CustomerOrders/>}/>
                    <Route exact path="/customerSubmit" element={<CustomerSubmit/>}/>
                    <Route exact path="/managerOrders" element={<ManagerOrders/>}/>
                    <Route exact path="/managerSubmit" element={<ManagerSubmit/>}/>
                    <Route exact path="/menuBoard" element={<MenuBoard/>}/>
                    <Route exact path="/menuBoard2" element={<MenuBoard2/>}/>
                    <Route exact path="/menuBoardImages" element={<MenuBoardImages/>}/>
                    <Route exact path="/menuBoardSettings" element={<MenuBoardSettings/>}/>
                    <Route exact path="/settings" element={<Settings/>}/>
                    <Route exact path="/handleOAuth" element={<HandleOAuth/>}/>
                    <Route exact path="/orderDisplays" element={<OrderDisplays/>}/>
                    <Route exact path="/Kitchen" element={<Kitchen/>}/>
                    <Route exact path="/RegularKitchen" element={<RegularKitchen/>}/>
                </Routes>
            </div>
        </Router>
    )
}

export default App;