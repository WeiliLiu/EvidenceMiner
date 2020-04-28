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

        this.getSearchURL = this.getSearchURL.bind(this);
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

    getSearchURL() {
        return '/search?kw=' + this.state.keyword.replace(/=/g, '%3D').replace(/&/g, '%26') + '&page=1';
    }

	render() {
        const { isMobile } = this.state;

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
                                        name='Sentence'
                                        icon="archive"
                                        color="blue"
                                        active={false}
                                        onClick={() => window.location.href = this.getSearchURL()}
                                    />
                                    <Menu.Item
                                        name='Analytics'
                                        icon="chart line"
                                        color="blue"
                                        active={true}
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