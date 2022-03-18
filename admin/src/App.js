import React from "react";
import Orders from "./Components/Orders";
import {BrowserRouter as Router , Routes , Route} from "react-router-dom"

export default function App(){
    return <Router>
        <Routes>
            <Route path="/" element={<Orders/>} />
        </Routes>
    </Router>
}