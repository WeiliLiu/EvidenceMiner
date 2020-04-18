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
            keyword: "",
            isMobile: false,
        }

        this.getSearchURL = this.getSearchURL.bind(this);
    }

    componentDidMount() {
        const searchParams = new URLSearchParams(window.location.search);
        var keyword = searchParams.get('kw');

        // Set up screen size listener
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

        this.setState({
            keyword: keyword,
        });

        this.getSearchURL = this.getSearchURL.bind(this);
    }

    resize() {
        this.setState({isMobile: window.innerWidth <= 992});
    }

    getSearchURL() {
        return config.frontUrl + '/analytics?' + this.state.keyword;
    }

    render() {
        const {isMobile} = this.state;

        return(
            <div>
                <NavigationBar history={this.props.history} type="search" />
                <div className="search-grid-container">
                    <Grid className="search-grid">
                        <Grid.Row className="search-grid-row">
                            <Grid.Column width={isMobile? 0 : 1} />
                            <Grid.Column width={isMobile? 16 : 10} className="menu-column">
                                <Menu pointing secondary className="search-menu">
                                    <Menu.Item
                                        name='Sentence'
                                        icon="archive"
                                        color="blue"
                                        active={true}
                                    />
                                    <Menu.Item
                                        name='Analytics'
                                        icon="chart line"
                                        active={false}
                                        onClick={() => window.location.href = this.getSearchURL()}
                                    />
                                </Menu>
                            </Grid.Column>
                            <Grid.Column width={isMobile? 0 : 5} />
                        </Grid.Row>
                    </Grid>
                </div>

                <ResultList history={this.props.history} />
            </div>
        )
    }
}

export default withRouter(SearchResult);
