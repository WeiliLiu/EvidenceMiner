import React from 'react';
import ResultList from '../Component/ResultList';
import NavigationBar from '../../NavigationBar/Component/NavigationBar';
import { withRouter } from 'react-router-dom';
import config from '../../config';

class SearchResult extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            keyword: "",
        }

        this.getSearchURL = this.getSearchURL.bind(this);
    }

    componentDidMount() {
        const searchParams = new URLSearchParams(window.location.search);
        var keyword = searchParams.get('kw');

        this.setState({
            keyword: keyword,
        });

        this.getSearchURL = this.getSearchURL.bind(this);
    }

    getSearchURL() {
        return config.frontUrl + '/analytics?' + this.state.keyword;
    }

    render() {
        return(
            <div>
                <NavigationBar history={this.props.history} type="search" />

                <ResultList history={this.props.history} />
            </div>
        )
    }
}

export default withRouter(SearchResult);
