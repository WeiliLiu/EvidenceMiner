import React, {createRef} from 'react';
import Article from '../src/Article/Component/Article';
import SearchResult from '../src/SearchResult/Component/SearchResult';
import Analytics from '../src/Analytics/Component/Analytics';
import Home from '../src/Home/Component/Home';
import { Router, Switch, Route, BrowserRouter } from "react-router-dom";

export default class App extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/" component={Home} exact/>
                    <Route path="/articles/:id" component={Article} />
                    <Route path="/search" component={SearchResult} />
                    <Route path="/analytics" component={Analytics} />
                </Switch>
            </BrowserRouter>
        )
    }
}
