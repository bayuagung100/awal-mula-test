import React from "react";
import './style.scss';
import Home from "./Home/Home";
import ProductDetail from "./ProductDetail/ProductDetail";
import { Route, Switch } from "react-router-dom";

const Index = () => {
    return (
        <>
            <div className="app">
                <Switch>
                    <Route path="/product/:id" render={props => <ProductDetail {...props} />} />
                    <Route path="/" render={props => <Home {...props} />} />
                </Switch>
            </div>
        </>
    )
}
export default Index;