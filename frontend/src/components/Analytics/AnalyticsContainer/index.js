import React from 'react';

// import downloaded package
import { Grid, Menu, Button, Message } from 'semantic-ui-react';

// import components
import NavigationBar from '../../NavigationBar';
import AnalyticsGraph from '../AnalyticsGraph';

export default class Analytics extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            keyword: "",
            corpus: "covid-19"
        }

        this.resize = this.resize.bind(this);
    }

    componentDidMount() {
        // Set up screen size listener
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

        const keyword = new URLSearchParams(window.location.search).get('kw');
        const corpus = new URLSearchParams(window.location.search).get('corpus');
        const constrain = new URLSearchParams(window.location.search).get('constrain');
        this.setState({
            keyword: keyword,
            corpus: corpus,
            constrain: constrain
        });
    }

    resize() {
        this.setState({isMobile: window.innerWidth <= 992});
    }

	render() {
        const { isMobile, keyword, corpus, constrain } = this.state;
        const constrainString = constrain === null ? "" : "&constrain=" + constrain;
		return (
		<div>
            <NavigationBar history={this.props.history} type="analytics" corpus={corpus}/>
            <div className="search-grid-container">
                <Grid className="search-grid">
                    <Grid.Row className="search-grid-row">
                        <Grid.Column width={isMobile? 0 : 1} />
                        <Grid.Column width={isMobile? 16 : 10}  className="menu-column">
                            <Menu fluid={true} pointing secondary className="search-menu">
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
                                    onClick={() => window.location.href = '/analytics?kw=' + keyword + "&corpus=" + corpus}
                                />
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={isMobile? 0 : 5} />
                    </Grid.Row>
                </Grid>
                <Grid padded style={{"paddingLeft":"1rem","paddingTop":"1rem"}}>
                    <div>Try:</div>

                    <a href={"/analytics?kw=CORONAVIRUS&corpus=covid-19"}>CORONAVIRUS</a>
                    |
                    <a href={"/analytics?kw=CORONAVIRUS cause DISEASEORSYNDROME&corpus=covid-19"}>CORONAVIRUS cause DISEASEORSYNDROME</a>
                    |
                    <a href={"/analytics?kw=CORONAVIRUS cause DISEASEORSYNDROME&corpus=covid-19&constrain=covid-19"}>CORONAVIRUS cause DISEASEORSYNDROME+covid-19</a>
                </Grid>
                <Grid padded style={{ paddingTop: '0.5rem' }}>
                    <Grid.Column width={isMobile? 16 : 8}>
                        <Button.Group vertical={isMobile ? true : false} style={{paddingLeft:"1rem"}}>
                            <Button toggle active={corpus === "chd"}
                                onClick={() => window.location.href = '/analytics?kw='
                                    + keyword + "&corpus=chd" + constrainString}>
                            Cancer&Heart Disease Analytics
                            </Button>
                            <Button toggle active={corpus === "covid-19"}
                                onClick={() => window.location.href = '/analytics?kw='
                                    + keyword + "&corpus=covid-19" + constrainString}>
                                    Covid-19 Analytics
                            </Button>
                        </Button.Group>
                    </Grid.Column>
                </Grid>
                <AnalyticsGraph keyword={this.state.keyword}/>
            </div>
		</div>
        );
    }

}
