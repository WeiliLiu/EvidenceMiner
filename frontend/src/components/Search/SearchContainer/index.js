import React from 'react';

// import components
import ResultList from '../ResultList';
import NavigationBar from '../../NavigationBar';

// import packages
import { Helmet } from 'react-helmet'

// import css
import './styles.css';

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
        const { keyword } = this.state;

        return(
            <div className="search-page-container">
                <Helmet>
                    <title>EvidenceMiner Search - { keyword }</title>
                </Helmet>

                <NavigationBar type={this.props.match.params.id} />

                <ResultList archive={this.props.match.params.id}/>
            </div>
        )
    }
}

export default SearchResult;
