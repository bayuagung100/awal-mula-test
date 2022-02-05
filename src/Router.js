import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Index from './components/index';

function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Index} />
                <Route path="/product/:id" component={Index} />
            </Switch>
        </BrowserRouter>

    )
}

export default Router;