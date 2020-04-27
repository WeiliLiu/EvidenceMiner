import React from 'react';

// import components
import ResultList from '../ResultList';
import NavigationBar from '../../../NavigationBar/Component/NavigationBar';

// import packages
import { withRouter } from 'react-router-dom';

class SearchResult extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            keyword: "",
        }
    }

    componentDidMount() {
        const keyword = new URLSearchParams(window.location.search).get('kw');
        this.setState({ keyword: keyword });
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
