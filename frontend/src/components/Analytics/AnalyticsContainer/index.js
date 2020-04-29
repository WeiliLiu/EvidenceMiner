import React from 'react';

// import downloaded package
import { Grid, Menu } from 'semantic-ui-react';

// import components
import NavigationBar from '../../NavigationBar';
import AnalyticsGraph from '../AnalyticsGraph';

export default class Analytics extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            keyword: ""
        }

        this.resize = this.resize.bind(this);
    }

    componentDidMount() {
        // Set up screen size listener
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

        this.setState({
            keyword: decodeURI(window.location.search.substring(1, window.location.search.length)),
        });
    }

    resize() {
        this.setState({isMobile: window.innerWidth <= 992});
    }

	render() {
        const { isMobile, keyword } = this.state;

		return (
		<div>
            <NavigationBar history={this.props.history} type="analytics" />
                <div className="search-grid-container">
                    <Grid className="search-grid">
                        <Grid.Row className="search-grid-row">
                            <Grid.Column width={isMobile? 0 : 1} />
                            <Grid.Column width={isMobile? 16 : 10} className="menu-column">
                                <Menu pointing secondary className="search-menu">
                                    <Menu.Item
                                        name='COVID-19'
                                        icon="archive"
                                        color="blue"
                                        active={false}
                                        onClick={() => window.location.href = `/search/covid-19?kw=${encodeURIComponent(keyword)}&page=1`}
                                    />
                                    <Menu.Item
                                        name='Cancer and Heart Disease'
                                        icon="archive"
                                        color="orange"
                                        active={false}
                                        onClick={() => window.location.href = `/search/chd?kw=${encodeURIComponent(keyword)}&page=1`}
                                    />
                                    <Menu.Item
                                        name='Analytics'
                                        icon="chart line"
                                        active={true}
                                        color='red'
                                        onClick={() => window.location.href = '/analytics?' + keyword}
                                    />
                                </Menu>
                            </Grid.Column>
                            <Grid.Column width={isMobile? 0 : 5} />
                        </Grid.Row>
                    </Grid>
                    <AnalyticsGraph keyword={this.state.keyword}/>
                </div>
		    </div>
        );
    }

}