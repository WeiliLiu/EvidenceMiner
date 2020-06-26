import React from 'react';

import api from '../../../api';
// import downloaded packages

import { Grid, Segment, Message, Container, Loader } from 'semantic-ui-react';
import BarChart from "../BarChart";
import CompareResult from "../CompareResult";
import EntityInfo from "../EntityInfo";

export default class AnalyticsGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            entity_type: "",
            valid_data: true,
            data:{},
            mode: "entity",
            loaded: false
        }

        this.showInfo = this.showInfo.bind(this);
        this.entityUI = this.entityUI.bind(this);
        this.updateCorpus = this.updateCorpus.bind(this);
    }

    async componentDidMount() {
        // Set up screen size listener
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

        await this.updateCorpus();

    }

    resize() {
        this.setState({isMobile: window.innerWidth <= 992});
    }

    showInfo(name){
        this.setState({"selected_entity": name});
    }

    async updateCorpus(){
        const entityType = new URLSearchParams(window.location.search).get('kw');
        const corpus = new URLSearchParams(window.location.search).get('corpus');
        const constrain = new URLSearchParams(window.location.search).get('constrain');

        if (constrain != null) {
            const result = await api.getPatternFilteredByDocCount(corpus, entityType, constrain);
            const result2 = await api.getPatternFilteredBysentCount(corpus, entityType, constrain);

            const valid = result.hits.total.value !== 0;

            const dataByDoc = result.hits.hits;
            const dataBySent = result2.hits.hits;

            const data = {};
            data["byDocument"] = [];
            for (let i = 0; i < dataByDoc.length; i++) {
                data["byDocument"].push(dataByDoc[i]._source);
            }

            data["bySentence"] = [];
            for (let i = 0; i < dataBySent.length; i++) {
                data["bySentence"].push(dataBySent[i]._source);
            }

            this.setState({
                valid_data: valid,
                entity_type: entityType,
                data: valid ? data : {},
                selected_entity: "default",
                corpus: corpus,
                mode: valid ? "pattern" : "default",
                loaded: true
            });
        } else {
            const data = await api.getTopRecord(corpus, entityType);

            if (data.hits.total.value === 1) {
                data.hits.hits[0]._source.byDocument.sort(function (a,b) {
                    return b.docCount - a.docCount
                });
                data.hits.hits[0]._source.bySentence.sort(function (a,b) {
                    return b.sentCount - a.sentCount
                });
            }

            this.setState({
                valid_data: data.hits.total.value === 1,
                entity_type: entityType,
                data: data.hits.total.value === 1 ? data.hits.hits[0]._source : {},
                selected_entity: "default",
                corpus: corpus,
                mode: data.hits.total.value === 1 ? data.hits.hits[0]._source.group : "default",
                loaded: true
            });
        }
    }

    entityUI(){
        const {isMobile} = this.state;
        return (
            <div style={{paddingLeft: '1rem'}}>
                <Grid padded style={{ paddingTop: '0.5rem' }}>
                    <Grid.Column width={isMobile? 16 : 8}>
                        <Segment padded>
                            <h3>Entity Type: {this.state.entity_type.charAt(0).toUpperCase() + this.state.entity_type.slice(1)}</h3>
                            <BarChart data={this.state.data} type={"doc"} action={this.showInfo} />
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={isMobile? 16 : 8}>
                        <Segment padded>
                            <h3>Entity Type: {this.state.entity_type.charAt(0).toUpperCase() + this.state.entity_type.slice(1)}</h3>
                            <BarChart data={this.state.data} type={"sent"} action={this.showInfo}/>
                        </Segment>
                    </Grid.Column>
                </Grid>
                <Grid padded style={{ paddingTop: '2rem' }}>
                    <Grid.Column width={isMobile? 16 : 8}>
                        <Segment padded>
                            <CompareResult data={this.state.data} action={this.showInfo}/>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={isMobile? 16 : 8}>
                        <Segment padded>
                            <EntityInfo name={this.state.selected_entity} data={this.state.data} corpus={this.state.corpus}/>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }

    patternUI(){
        const {isMobile, mode} = this.state;
        return (
            <div style={{padding: '1rem 1rem'}}>
                <Grid padded style={{ paddingTop: '2rem' }}>
                    <Grid.Column width={isMobile? 16 : 8}>
                        <Segment padded>
                            <h3>Meta Pattern Type: {this.state.entity_type.charAt(0).toUpperCase() + this.state.entity_type.slice(1).toLowerCase()}</h3>
                            <BarChart data={this.state.data} type={"doc"} action={this.showInfo} mode={this.state.mode}/>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={isMobile? 16 : 8}>
                        <Segment padded>
                            <h3>Meta Pattern Type: {this.state.entity_type.charAt(0).toUpperCase() + this.state.entity_type.slice(1).toLowerCase()}</h3>
                            <BarChart data={this.state.data} type={"sent"} action={this.showInfo} mode={mode}/>
                        </Segment>
                    </Grid.Column>
                </Grid>
                <Grid padded style={{ paddingTop: '2rem' }}>
                    <Grid.Column width={isMobile? 16 : 8}>
                        <Segment padded>
                            <CompareResult data={this.state.data} action={this.showInfo} mode={mode}/>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={isMobile? 16 : 8}>
                        <Segment padded>
                            <EntityInfo
                                name={this.state.selected_entity}
                                data={this.state.data}
                                corpus={this.state.corpus}
                                mode={this.state.mode}
                            />
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }

    render() {

        const {valid_data , mode, loaded } = this.state;

        let toReturn;

        if (valid_data && loaded) {
            if (mode === "entity")
            toReturn = this.entityUI();
            else toReturn = this.patternUI();
        } else {
            toReturn = loaded? <Container style={{ backgroundColor: '', paddingTop: '2rem' }} textAlign='center'>
                <Message warning compact style={{ margin: '1rem' }}>
                    <Message.Header>No result in this Corpus</Message.Header>
                    <p>We can't find this metapattern or entity type in current corpus</p>
                    <p>please change the searching corpus or Re-Type in the Search bar and select from dropdown menu</p>
                </Message>
            </Container> : 
            <Segment className="search-loading-screen">
                <Loader active={!loaded} size='huge'>Loading</Loader>
            </Segment>
        }
        return (
            <div>
            {toReturn}
            </div>
        )
    }
}