import React from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import NavigationBar from '../../NavigationBar/Component/NavigationBar';
import AnalyticsGraph from '../Component/AnalyticsGraph';

export default class Analytics extends React.Component {
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
        console.log(keyword)

        this.setState({
            keyword: decodeURI(window.location.search.substring(1, window.location.search.length)),
        });
    }

    getSearchURL() {
        // console.log(window.location.search.replace(/=/g, '%3D'))
        return '/search?kw=' + this.state.keyword.replace(/=/g, '%3D').replace(/&/g, '%26') + '&page=1';
    }

	render() {
		return (
		<div>
            {/* {this.getSearchURL()} */}
            <NavigationBar history={this.props.history} type="analytics" />
                <div className={"search-grid-container"}>
                    <Grid style={{ paddingLeft: "1rem", borderBottom: "solid 1.2px rgb(239, 239, 239)" }}>
                        <Grid.Column width={1} />
                        <Grid.Column width={10} style={{ paddingBottom: "0", paddingTop: "0.7rem" }}>
                            <Menu pointing secondary style={{ paddingLeft: "0.5rem", border: "0" }}>
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
                        <Grid.Column width={5} />
                    </Grid>
                    <AnalyticsGraph keyword={this.state.keyword}/>
                </div>
		    </div>
        );
    }

}