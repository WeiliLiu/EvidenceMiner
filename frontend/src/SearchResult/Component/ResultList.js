// import react
import React from 'react';

// import packages
import { Image, List, Header, Pagination, Icon, Segment, Label, Divider, Grid, Ref, Rail, Sticky, Container, Menu, FormTextArea, Dropdown, TransitionablePortal, Button } from 'semantic-ui-react';

// import self-made components
import MajorTypeList from '../../Article/Component/MajorTypeList';
import Result from './Result';

// import api endpoints
import api from '../../api';

// import configurations
import config from '../../config';

// import css file
import '../Style/ResultList.css';

export default class ResultList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isMobile: false,
            showFloatingList: false,
            searchResults: [],
            totalPage: 1,
            currentPage: 1,
            resultLength: 0,
            keyword: "",
            responseTime: 0,
            typeDict: {},
        }

        this.showSearchResults = this.showSearchResults.bind(this);
        this.getSearchURL = this.getSearchURL.bind(this);
        // this.showWordList = this.showWordList.bind(this);
    }

    async componentDidMount() {
        // Get query from the url querystring
        const searchKeyword = new URLSearchParams(window.location.search).get('kw');

        // Get the total number of search results returned
        const numSearchResults = await api.getSearchResultCount(searchKeyword);

        // Calculate paging related numbers
        const totalPages = Math.ceil(numSearchResults / 10);
        const currPage = new URLSearchParams(window.location.search).get('page')

        // Call the api to query elasticsearch
        const resultSize = 10;
        const searchResult = await api.getSearchResult(searchKeyword, resultSize, currPage);

        // Set up screen size listener
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

        var typeDict = {};
        var entities = [];
        for (let i = 0; i < searchResult.hits.hits.length; i++) {
            for (let j = 0; j < searchResult.hits.hits[i]._source.entities.length; j++) {
                entities.push(searchResult.hits.hits[i]._source.entities[j]);
            }
        }
        
        for(let i = 0; i < entities.length; i++) {
            if(parent_type[entities[i].type] in typeDict === false) {
                typeDict[parent_type[entities[i].type]] = {}
            }
            if(entities[i].type in typeDict[parent_type[entities[i].type]] === false) {
                typeDict[parent_type[entities[i].type]][entities[i].type] = {}
            }
            if(entities[i].name in typeDict[parent_type[entities[i].type]][entities[i].type] === false) {
                typeDict[parent_type[entities[i].type]][entities[i].type][entities[i].name] = 0;
            }
            typeDict[parent_type[entities[i].type]][entities[i].type][entities[i].name] += 1;
        }

        var cleaned_type_dict = {};
        var major_types = Object.keys(typeDict);
        for(let i = 0; i < major_types.length; i++) {
            var minor_types = Object.keys(typeDict[major_types[i]])
            var should_include_major_type = false;
            for(let j = 0; j < minor_types.length; j++) {
                if(Object.keys(typeDict[major_types[i]][minor_types[j]]).length !== 0) {
                    should_include_major_type = true;
                    break;
                }
            }

            if(should_include_major_type === true) {
                cleaned_type_dict[major_types[i]] = {};
                for(let j = 0; j < minor_types.length; j++) {
                    if(Object.keys(typeDict[major_types[i]][minor_types[j]]).length !== 0) {
                        cleaned_type_dict[major_types[i]][minor_types[j]] = typeDict[major_types[i]][minor_types[j]]
                    } else {
                        continue;
                    }
                }
            }else {
                continue;
            }
        }

        // Modify states based on search results
        this.setState({
            responseTime: searchResult.took,
            searchResults: searchResult.hits.hits,
            totalPage: totalPages,
            currentPage: currPage,
            keyword: searchKeyword,
            resultLength: numSearchResults,
            typeDict: cleaned_type_dict,
        })
    }

    resize() {
        this.setState({isMobile: window.innerWidth < 992});
    }

    showSearchResults = () => {
        var table = [];

        this.state.searchResults.map(result => {
            const resultObj = result._source;
            table.push(<Result pmid={resultObj.pmid}
                sentence={resultObj.sentence}
                prevSentence={resultObj.prevSent}
                nextSentence={resultObj.nextSent}
                title={resultObj.title}
                sentID={resultObj.sentId}
                isTitle={resultObj.isTitle}
                abstract={resultObj.abstract}
                entities={resultObj.entities}
                authors={resultObj.author_list}
                date={resultObj.date}
                journal={resultObj.journal_name}
                documentId={resultObj.documentId}
                score={result._score}
                key={result._id} 
                ranking={this.state.searchResults.indexOf(result)} 
                page={this.state.currentPage} />)
        })

        return table;
    }

    showWordList() {
        var table = [];
        console.log(this.state.typeDict);
        var types = Object.keys(this.state.typeDict);
        for(let i = 0; i < types.length; i++) {
            table.push(<MajorTypeList Type={types[i]} List={this.state.typeDict[types[i]]} sortMode={'Frequency'}/>)
        }
        return table;
    }

    getSearchURL = (keyword, nextPage) => {
        return config.frontUrl + "/search" + '?kw=' + keyword + "&page=" + nextPage;
    }

    handleKeyPress = (keyword, nextPage) => {
        window.location.href = this.getSearchURL(keyword, nextPage);
    }

    showWordList() {
        var table = [];
        var types = Object.keys(this.state.typeDict);
        for(let i = 0; i < types.length; i++) {
            table.push(<MajorTypeList Type={types[i]} List={this.state.typeDict[types[i]]} sortMode={this.state.sortMode}/>)
        }
        return table;
    }

    handleOpen = () => this.setState({ showFloatingList: true })

    handleClose = () => this.setState({ showFloatingList: false })

    render() {
        const { isMobile, showFloatingList } = this.state;

        return(
            <div className="resultlist-container">
                <Grid className="search-meta-info">
                    <Grid.Row className="search-meta-info-row">
                        <Grid.Column only='computer' computer={1}/>
                        <Grid.Column mobile={16} tablet={11} computer={10} widescreen={6} className="search-meta-info-column">
                            <Container fluid className="search-meta-container">
                                <span> "{this.state.keyword}" </span>
                                <span>(Total: <strong>{this.state.resultLength}</strong>, Took: <strong>{this.state.responseTime}ms</strong>)</span>
                                <br />
                                <small>~ At most 10 results are shown per page ~</small>
                            </Container>
                        </Grid.Column>
                        <Grid.Column computer={5} widescreen={9}/>
                    </Grid.Row>
                    <Grid.Row className="search-meta-info-row">
                        <Grid.Column only='computer' computer={1} />
                        <Grid.Column mobile={16} tablet={16} computer={10} widescreen={6} className="segment-list">
                            <List divided verticalAlign='middle' size={'big'}>
                                {this.showSearchResults()}
                            </List>
                            <Segment basic textAlign={isMobile? "center" : ""} className="pagination-container">
                                <Pagination className={'result-list-pagination'}
                                    defaultActivePage={1}
                                    ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                                    firstItem={isMobile? null : { content: <Icon name='angle double left' />, icon: true }}
                                    lastItem={isMobile? null : { content: <Icon name='angle double right' />, icon: true }}
                                    prevItem={{ content: <Icon name='angle left' />, icon: true }}
                                    nextItem={{ content: <Icon name='angle right' />, icon: true }}
                                    totalPages={this.state.totalPage}
                                    activePage={this.state.currentPage}
                                    boundaryRange={isMobile? 0 : 1}
                                    onPageChange={(e, { activePage }) => this.handleKeyPress(this.state.keyword.replace(/=/g, '%3D').replace(/&/g, '%26'), activePage)}
                                />
                            </Segment>
                        </Grid.Column>
                        <Grid.Column hidden={isMobile} mobile={16} tablet={16} computer={4} widescreen={4} className="wordlist-column">
                            <Segment.Group className="resultlist-word-segment">
                                <Segment className="resultlist-word-segment-header">Label Coloring & Entity Counts</Segment>
                                <Segment className="sortmode-text">
                                    <Dropdown placeholder={'Sorted By: ' + this.state.sortMode} selection fluid className='icon'>
                                            <Dropdown.Menu>
                                                <Dropdown.Header icon='hand pointer' content={'Choose a method'} />
                                                <Dropdown.Divider />
                                                <Dropdown.Item label={{ color: 'red', empty: true, circular: true }} text='Frequency' onClick={() => this.setState({ sortMode: 'Frequency' })}/>
                                                <Dropdown.Item label={{ color: 'blue', empty: true, circular: true }} text='Alphabet' onClick={() => this.setState({ sortMode: 'Alphabet' })}/>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                </Segment>
                                <Segment className="resultlist-word-segment-list" >
                                    <List>
                                        {this.showWordList()}
                                    </List>
                                </Segment>
                            </Segment.Group>
                        </Grid.Column>
                        <Grid.Column computer={1} widescreen={5}/>
                    </Grid.Row>
                </Grid>

                <TransitionablePortal
                    closeOnTriggerClick
                    onOpen={this.handleOpen}
                    onClose={this.handleClose}
                    transition={{
                        animation: 'slide up',
                        duration: 400,
                    }}
                    openOnTriggerClick
                    trigger={
                        <Button hidden={!isMobile} size="huge" circular icon='list' className="word-list-open-button"/>
                    }
                >
                    <Segment.Group className="floating-resultlist-word-segment" style={{ backgroundColor: 'white' }}>
                        <Segment className="resultlist-word-segment-header">Label Coloring & Entity Counts</Segment>
                        <Segment className="sortmode-text">
                            <Dropdown placeholder={'Sorted By: ' + this.state.sortMode} selection fluid className='icon'>
                                <Dropdown.Menu>
                                    <Dropdown.Header icon='hand pointer' content={'Choose a method'} />
                                    <Dropdown.Divider />
                                    <Dropdown.Item label={{ color: 'red', empty: true, circular: true }} text='Frequency' onClick={() => this.setState({ sortMode: 'Frequency' })}/>
                                    <Dropdown.Item label={{ color: 'blue', empty: true, circular: true }} text='Alphabet' onClick={() => this.setState({ sortMode: 'Alphabet' })}/>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Segment>
                        <Segment className="floating-resultlist-word-segment-list" >
                            <List>
                                {this.showWordList()}
                            </List>
                        </Segment>
                    </Segment.Group>
                </TransitionablePortal>
            </div>
        )
    }
}

// const color = {
//     'Chemical': '#F44336',
//     'Organism': '#3399ff',
//     'Fully Formed Anatomical Structure': '#009688',
//     'Physiologic Function': '#8E24AA',
//     'Pathologic Function': '#F3D250',
//     'Gene or Genome': '#374785',
//     'Disease or Syndrome': '#f7941d',
// };

const color = {
    'SPACY_TYPE': '#F44336',
    'NEW_TYPE': '#3399ff',
    'PHYSICAL_OBJECT': '#009688',
    'CONCEPTUAL_ENTITY': '#8E24AA',
    'ACTIVITY': '#F3D250',
    'PHENOMENON_OR_PROCESS': '#374785',
    'OTHERS': '#f7941d'
};

// const parent_type = {
//     'Chemical': 'Chemical',
//     'Archaeon': 'Organism',
//     'Bacterium': 'Organism',
//     'Eukaryote': 'Organism',
//     'Virus': 'Organism',
//     'Body Part, Organ, or Organ Component': 'Fully Formed Anatomical Structure',
//     'Tissue': 'Fully Formed Anatomical Structure',
//     'Cell': 'Fully Formed Anatomical Structure',
//     'Cell Component': 'Fully Formed Anatomical Structure',
//     'Gene or Genome': 'Fully Formed Anatomical Structure',
//     'Organism Function': 'Physiologic Function',
//     'Organ or Tissue Function': 'Physiologic Function',
//     'Cell Function': 'Physiologic Function',
//     'Molecular Function': 'Physiologic Function',
//     'Disease or Syndrome': 'Pathologic Function',
//     'Cell or Molecular Dysfunction': 'Pathologic Function',
//     'Experimental Model of Disease': 'Pathologic Function',
// }

const parent_type = {
    "PERSON": "SPACY TYPE",
    "NORP": "SPACY TYPE",
    "FAC": "SPACY TYPE",
    "ORG": "SPACY TYPE",
    "GPE": "SPACY TYPE",
    "LOC": "SPACY TYPE",
    "PRODUCT": "SPACY TYPE",
    "EVENT": "SPACY TYPE",
    "WORK OF ART": "SPACY TYPE",
    "LAW": "SPACY TYPE",
    "LANGUAGE": "SPACY TYPE",
    "DATE": "SPACY TYPE",
    "TIME": "SPACY TYPE",
    "PERCENT": "SPACY TYPE",
    "MONEY": "SPACY TYPE",
    "QUANTITY": "SPACY TYPE",
    "ORDINAL": "SPACY TYPE",
    "CARDINAL": "SPACY TYPE",
    "CORONAVIRUS": "NEW TYPE",
    "VIRAL PROTEIN": "NEW TYPE",
    "LIVESTOCK": "NEW TYPE",
    "WILDLIFE": "NEW TYPE",
    "EVOLUTION": "NEW TYPE",
    "PHYSICAL SCIENCE": "NEW TYPE",
    "SUBSTRATE": "NEW TYPE",
    "MATERIAL": "NEW TYPE",
    "IMMUNE RESPONSE": "NEW TYPE",
    "ORGANISM": "PHYSICAL OBJECT",
    "ARCHAEON": "PHYSICAL OBJECT",
    "BACTERIUM": "PHYSICAL OBJECT",
    "EUKARYOTE": "PHYSICAL OBJECT",
    "VIRUS": "PHYSICAL OBJECT",
    "ANATOMICAL STRUCTURE": "PHYSICAL OBJECT",
    "BODY PART ORGAN OR ORGAN COMPONENT": "PHYSICAL OBJECT",
    "TISSUE": "PHYSICAL OBJECT",
    "CELL": "PHYSICAL OBJECT",
    "CELL COMPONENT": "PHYSICAL OBJECT",
    "GENE OR GENOME": "PHYSICAL OBJECT",
    "MANUFACTURED_OBJECT": "PHYSICAL OBJECT",
    "CHEMICAL": "PHYSICAL OBJECT",
    "BODY_SUBSTANCE": "PHYSICAL OBJECT",
    "FOOD": "PHYSICAL OBJECT",
    "TEMPORAL CONCEPT": "CONCEPTUAL ENTITY",
    "QUALITATIVE CONCEPT": "CONCEPTUAL ENTITY",
    "QUANTITATIVE CONCEPT": "CONCEPTUAL ENTITY",
    "FUNCTIONAL CONCEPT": "CONCEPTUAL ENTITY",
    "SPATIAL CONCEPT": "CONCEPTUAL ENTITY",
    "LABORATORY OR TEST RESULT": "CONCEPTUAL ENTITY",
    "SIGN OR SYMPTOM": "CONCEPTUAL ENTITY",
    "ORGANISM ATTRIBUTE": "CONCEPTUAL ENTITY",
    "INTELLECTUAL PRODUCT": "CONCEPTUAL ENTITY",
    "LANGUAGE": "CONCEPTUAL ENTITY",
    "OCCUPATION OR DISCIPLINE": "CONCEPTUAL ENTITY",
    "ORGANIZATION": "CONCEPTUAL ENTITY",
    "GROUP ATTRIBUTE": "CONCEPTUAL ENTITY",
    "GROUP": "CONCEPTUAL ENTITY",
    "SOCIAL BEHAVIOR": "ACTIVITY",
    "INDIVIDUAL BEHAVIOR": "ACTIVITY",
    "DAILY OR RECREATIONAL ACTIVITY": "ACTIVITY",
    "LABORATORY PROCEDURE": "ACTIVITY",
    "DIAGNOSTIC PROCEDURE": "ACTIVITY",
    "THERAPEUTIC OR PREVENTIVE PROCEDURE": "ACTIVITY",
    "RESEARCH ACTIVITY": "ACTIVITY",
    "GOVERNMENTAL OR REGULATORY ACTIVITY": "ACTIVITY",
    "EDUCATIONAL ACTIVITY": "ACTIVITY",
    "MACHINE ACTIVITY": "ACTIVITY",
    "HUMAN-CAUSED PHENOMENON OR PROCESS": "PHENOMENON OR PROCESS",
    "ORGANISM FUNCTION": "PHENOMENON OR PROCESS",
    "ORGAN OR TISSUE FUNCTION": "PHENOMENON OR PROCESS",
    "CELL FUNCTION": "PHENOMENON OR PROCESS",
    "MOLECULAR FUNCTION": "PHENOMENON OR PROCESS",
    "DISEASE OR SYNDROME": "PHENOMENON OR PROCESS",
    "CELL OR MOLECULAR DYSFUNCTION": "PHENOMENON OR PROCESS",
    "EXPERIMENTAL MODEL OF DISEASE": "PHENOMENON OR PROCESS",
    "INJURY OR POISONING": "PHENOMENON OR PROCESS",
    "BODY SUBSTANCE": "OTHERS"
}