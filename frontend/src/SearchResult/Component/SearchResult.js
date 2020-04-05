import React from 'react';
import ResultList from '../Component/ResultList';
import NavigationBar from '../../NavigationBar/Component/NavigationBar';
import '../Style/SearchResult.css';
import { withRouter } from 'react-router-dom';
import { Grid, Menu } from 'semantic-ui-react';
import config from '../../config';

class SearchResult extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            keyword: ""
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
                <div className={"search-grid-container"}>
                <Grid style={{ paddingLeft: "1rem", borderBottom: "solid 1.2px rgb(239, 239, 239)" }}>
                    <Grid.Column width={1} />
                    <Grid.Column width={10} style={{ paddingBottom: "0", paddingTop: "0.7rem" }}>
                        <Menu pointing secondary style={{ paddingLeft: "0.5rem", border: "0" }}>
                            <Menu.Item
                                name='Sentence'
                                icon="archive"
                                color="blue"
                                active={true}
                                // onClick={this.handleItemClick}
                            />
                            <Menu.Item
                                name='Analytics'
                                icon="chart line"
                                active={false}
                                onClick={() => window.location.href = this.getSearchURL()}
                            />
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={5} />
                </Grid></div>

                <ResultList history={this.props.history} className="search-results-container"/>
            </div>
        )
    }
}

export default withRouter(SearchResult);
