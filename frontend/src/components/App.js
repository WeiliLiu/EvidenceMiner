import React from 'react';

// import components
import Article from './Article/ArticleContainer';
import Search from './Search/SearchContainer';
import Analytics from './Analytics/AnalyticsContainer';
import Home from './Home';

// import react-router
import { Switch, Route, BrowserRouter } from "react-router-dom";

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/" component={Home} exact/>
                    <Route path="/articles/:id" component={Article} />
                    <Route path="/search/:id" component={Search} />
                    <Route path="/analytics" component={Analytics} />
                </Switch>
            </BrowserRouter>
        )
    }
}
