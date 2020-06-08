import React from 'react';
import data from './data/type_count.json'
import chd_data from './data/chd_type_count.json'
import pattern from './data/pattern_count.json'
import chd_pattern from './data/pattern_count_chd.json'

// import downloaded packages
import { Grid, Segment, Message, Container } from 'semantic-ui-react';
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
            mode: "entity"
        }

        this.showInfo = this.showInfo.bind(this);
        this.entityUI = this.entityUI.bind(this);
        this.updateCorpus = this.updateCorpus.bind(this);
        this.updateConstrain = this.updateConstrain.bind(this)
    }

    componentDidMount() {
        // Set up screen size listener
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

        this.updateCorpus();

    }

    resize() {
        this.setState({isMobile: window.innerWidth <= 992});
    }

    showInfo(name){
        this.setState({"selected_entity": name});
    }

    updateConstrain(name) {
        this.setState({"constrain": name});
    }

    updateCorpus(){
        if (this.props.corpus === this.state.corpus) return;

        const entityType = new URLSearchParams(window.location.search).get('kw');
        let corpus = {};
        let valid = false;
        let mode;

        if (this.props.corpus === "covid-19") {
           if (data[entityType.toUpperCase()] != null) {
               valid = true;
               corpus = data;
               mode = "entity";
           }
           if (pattern[entityType.toUpperCase()] != null) {
               valid = true;
               corpus = pattern;
               mode = "pattern";
           }
        }
        if (this.props.corpus === "chd") {
            if (chd_data[entityType.toUpperCase()] != null) {
                valid = true;
                corpus = chd_data;
                mode = "entity";
            }
            if (chd_pattern[entityType.toUpperCase()] != null) {
                valid = true;
                corpus = chd_pattern;
                mode = "pattern";
            }
        }

        this.setState({
            valid_data: valid,
            entity_type: entityType,
            data: corpus[entityType.toUpperCase()],
            selected_entity: "default",
            corpus: this.props.corpus,
            mode: mode,
            constrain: "none"
        });
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
        const {isMobile, constrain, mode} = this.state;
        return (
            <div style={{padding: '1rem 1rem'}}>
                <Grid padded style={{ paddingTop: '2rem' }}>
                    <Grid.Column width={isMobile? 16 : 8}>
                        <Segment padded>
                            <h3>Meta Pattern Type: {this.state.entity_type.charAt(0).toUpperCase() + this.state.entity_type.slice(1).toLowerCase()}</h3>
                            <BarChart data={this.state.data} type={"doc"} action={this.showInfo} mode={this.state.mode} constrain={constrain}/>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={isMobile? 16 : 8}>
                        <Segment padded>
                            <h3>Meta Pattern Type: {this.state.entity_type.charAt(0).toUpperCase() + this.state.entity_type.slice(1).toLowerCase()}</h3>
                            <BarChart data={this.state.data} type={"sent"} action={this.showInfo} mode={mode} constrain={constrain}/>
                        </Segment>
                    </Grid.Column>
                </Grid>
                <Grid padded style={{ paddingTop: '2rem' }}>
                    <Grid.Column width={isMobile? 16 : 8}>
                        <Segment padded>
                            <CompareResult data={this.state.data} action={this.showInfo} constrain={constrain} mode={mode}/>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={isMobile? 16 : 8}>
                        <Segment padded>
                            <EntityInfo
                                name={this.state.selected_entity}
                                data={this.state.data}
                                corpus={this.state.corpus}
                                mode={this.state.mode}
                                constrain={this.state.constrain}
                                action = {this.updateConstrain}
                            />
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }

    render() {

        const {valid_data , mode } = this.state;
        this.updateCorpus();
        let toReturn;
        if (valid_data) {
            if (mode === "entity")
            toReturn = this.entityUI();
            else toReturn = this.patternUI();
        } else {
            toReturn = <Container style={{ backgroundColor: '', paddingTop: '2rem' }} textAlign='center'>
                <Message warning compact style={{ margin: '1rem' }}>
                    <Message.Header>No result in this Corpus</Message.Header>
                    <p>We can't find this metapattern or entity type in current corpus</p>
                    <p>please change the searching corpus or Re-Type in the Search bar and select from dropdown menu</p>
                </Message>
            </Container>
        }
        return (
            <div>
            {toReturn}
            </div>
        )
    }
}