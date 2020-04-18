// import react
import React from 'react';

// import packages
import { Image, List, Header, Pagination, Icon, Segment, Label, Divider, Grid, Ref, Rail, Sticky, Container, Menu, FormTextArea } from 'semantic-ui-react'

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

        // Modify states based on search results
        this.setState({
            responseTime: searchResult.took,
            searchResults: searchResult.hits.hits,
            totalPage: totalPages,
            currentPage: currPage,
            keyword: searchKeyword,
            resultLength: numSearchResults,
            // typeDict: cleaned_type_dict,
        })

        // const searchParams = new URLSearchParams(window.location.search);
        // var keyword = searchParams.get('kw');
        // var should_array = [];
        // var curr_obj = {
        //     "match": {
        //         "searchKey": keyword
        //     }
        // }
        // should_array.push(curr_obj)
        // var query = {"query":{"bool":{"must":[],"must_not":[],"should":should_array}},"from":0,"size":15,"sort":[],"aggs":{}};
        // console.log(query)

        // axios.get(config.searchUrl + '/_search', {
        //     params: {
        //         source: JSON.stringify(query),
        //         source_content_type: 'application/json'
        //     }
        // })
        //     .then(response => {
        //         console.log(response.data.hits.hits)
                // var typeDict = {
                //     'Organism': {
                //         'Archeon': {},
                //         'Bacterium': {},
                //         'Eukaryote': {},
                //         'Virus': {},
                //     },
                //     'Fully Formed Anatomical Structure': {
                //         'Body Part, Organ, or Organ Component': {},
                //         'Tissue': {},
                //         'Cell': {},
                //         'Cell Component': {},
                //         'Gene or Genome': {},
                //     },
                //     'Chemical': {
                //         'Chemical': {},
                //     },
                //     'Physiologic Function': {
                //         'Organism Function': {},
                //         'Organ or Tissue Function': {},
                //         'Cell Function': {},
                //         'Molecular Function': {},
                //     },
                //     'Pathologic Function': {
                //         'Disease or Syndrome': {},
                //         'Cell or Molecular Dysfunction': {},
                //         'Experimental Model of Disease': {},
                //     }
                // };
        //         var entities = [];
        //         for (let i = 0; i < response.data.hits.hits.length; i++) {
        //             for (let j = 0; j < response.data.hits.hits[i]._source.entities.length; j++) {
        //                 entities.push(response.data.hits.hits[i]._source.entities[j]);
        //             }
        //         }
        //         console.log(entities)
        //         for(let i = 0; i < entities.length; i++) {
        //             if(parent_type[entities[i].type] in typeDict === false) {
        //                 typeDict[parent_type[entities[i].type]] = {}
        //             }
        //             if(entities[i].type in typeDict[parent_type[entities[i].type]] === false) {
        //                 typeDict[parent_type[entities[i].type]][entities[i].type] = {}
        //             }
        //             if(entities[i].name in typeDict[parent_type[entities[i].type]][entities[i].type] === false) {
        //                 typeDict[parent_type[entities[i].type]][entities[i].type][entities[i].name] = 0;
        //             }
        //             typeDict[parent_type[entities[i].type]][entities[i].type][entities[i].name] += 1;
        //         }

        //         var cleaned_type_dict = {};
        //         var major_types = Object.keys(typeDict);
        //         for(let i = 0; i < major_types.length; i++) {
        //             var minor_types = Object.keys(typeDict[major_types[i]])
        //             var should_include_major_type = false;
        //             for(let j = 0; j < minor_types.length; j++) {
        //                 if(Object.keys(typeDict[major_types[i]][minor_types[j]]).length !== 0) {
        //                     should_include_major_type = true;
        //                     break;
        //                 }
        //             }

        //             if(should_include_major_type === true) {
        //                 cleaned_type_dict[major_types[i]] = {};
        //                 for(let j = 0; j < minor_types.length; j++) {
        //                     if(Object.keys(typeDict[major_types[i]][minor_types[j]]).length !== 0) {
        //                         cleaned_type_dict[major_types[i]][minor_types[j]] = typeDict[major_types[i]][minor_types[j]]
        //                     } else {
        //                         continue;
        //                     }
        //                 }
        //             }else {
        //                 continue;
        //             }
        //         }
        //         console.log(cleaned_type_dict);

        //         var result_list = response.data.hits.hits;
        //         var num_results = Object.keys(response.data.hits.hits).length;
        //         var total_pages = Math.ceil(num_results / 10);
        //         const searchParams = new URLSearchParams(window.location.search);
        //         var curr_page = searchParams.get('page')
        //         this.setState({
        //             responseTime: response.data.took,
        //             searchResults: result_list,
        //             resultLength: Object.keys(result_list).length,
        //             totalPage: total_pages,
        //             currentPage: curr_page,
        //             keyword: keyword,
        //             typeDict: cleaned_type_dict,
        //         })
        //     })
    }

    resize() {
        this.setState({isMobile: window.innerWidth <= 992});
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

    // showWordList() {
    //     var table = [];
    //     console.log(this.state.typeDict);
    //     var types = Object.keys(this.state.typeDict);
    //     for(let i = 0; i < types.length; i++) {
    //         table.push(<MajorTypeList Type={types[i]} List={this.state.typeDict[types[i]]} sortMode={'Frequency'}/>)
    //     }
    //     return table;
    // }

    getSearchURL = (keyword, nextPage) => {
        return config.frontUrl + "/search" + '?kw=' + keyword + "&page=" + nextPage;
    }

    handleKeyPress = (keyword, nextPage) => {
        window.location.href = this.getSearchURL(keyword, nextPage);
    }

    render() {
        const { isMobile } = this.state;

        return(
            <div className="resultlist-container">
                <Grid stretched className="search-meta-info">
                    <Grid.Row className="search-meta-info-row">
                        <Grid.Column width={isMobile? 0 : 1}/>
                        <Grid.Column width={isMobile? 16 : 10} >
                            <Container fluid className="search-meta-container">
                                <span> "{this.state.keyword}" </span>
                                <span>(Total: <strong>{this.state.resultLength}</strong>, Took: <strong>{this.state.responseTime}ms</strong>)</span>
                                <br />
                                <small>~ At most 10 results are shown per page ~</small>
                            </Container>
                        </Grid.Column>
                        <Grid.Column width={isMobile? 0 : 5} />
                    </Grid.Row>
                    <Grid.Row className="search-meta-info-row">
                        <Grid.Column width={this.state.isMobile? 0 : 1} />
                        <Grid.Column width={this.state.isMobile? 16 : 10} className="segment-list">
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
                        {/* <Grid.Column width={4} style={{ backgroundColor: '', height: 'auto' }}>
                            <div style={{ color: 'black', padding: '1rem', borderLeft: "1px solid rgb(225, 225, 225)" }}>
                                <Header as='h6'>Label Coloring & Frequent Associated Entities</Header>
                                <Segment basic className='resultlist-word-list'>
                                    <List>
                                        {this.showWordList()}
                                    </List>
                                </Segment>
                            </div>
                        </Grid.Column> */}
                        <Grid.Column width={1} />
                    </Grid.Row>
                </Grid>
                
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
    "PERSON": "SPACY_TYPE",
    "NORP": "SPACY_TYPE",
    "FAC": "SPACY_TYPE",
    "ORG": "SPACY_TYPE",
    "GPE": "SPACY_TYPE",
    "LOC": "SPACY_TYPE",
    "PRODUCT": "SPACY_TYPE",
    "EVENT": "SPACY_TYPE",
    "WORK_OF_ART": "SPACY_TYPE",
    "LAW": "SPACY_TYPE",
    "LANGUAGE": "SPACY_TYPE",
    "DATE": "SPACY_TYPE",
    "TIME": "SPACY_TYPE",
    "PERCENT": "SPACY_TYPE",
    "MONEY": "SPACY_TYPE",
    "QUANTITY": "SPACY_TYPE",
    "ORDINAL": "SPACY_TYPE",
    "CARDINAL": "SPACY_TYPE"
}
