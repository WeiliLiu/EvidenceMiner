import React from 'react';
import { Image, List, Header, Pagination, Icon, Segment, Label, Divider, Grid, Ref, Rail, Sticky, Container, Menu } from 'semantic-ui-react'
import '../Style/ResultList.css';
import axios from 'axios';
import {Link} from "react-router-dom";
import {withRouter} from 'react-router-dom';
import MajorTypeList from '../../Article/Component/MajorTypeList';
import Result from './Result';
import config from '../../config';

export default class ResultList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchResults: [],
            totalPage: 1,
            currentPage: 1,
            resultLength: 0,
            keyword: "",
            responseTime: 0,
            isFlushed: false,
            typeDict: {},
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.showSearchResults = this.showSearchResults.bind(this);
        this.getSearchURL = this.getSearchURL.bind(this);
        this.showWordList = this.showWordList.bind(this);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        // console.log('at resultlist')
        this.setState({
            isFlushed: !this.state.isFlushed
        });
        // window.location.reload();
        this.forceUpdate();
    }

    componentDidMount() {
        const searchParams = new URLSearchParams(window.location.search);
        var keyword = searchParams.get('kw');
        var should_array = [];
        var curr_obj = {
            "match": {
                "searchKey": keyword
            }
        }
        should_array.push(curr_obj)
        var query = {"query":{"bool":{"must":[],"must_not":[],"should":should_array}},"from":0,"size":2000,"sort":[],"aggs":{}};
        console.log(query)

        axios.get(config.searchUrl + '/pubmed/_search', {
            params: {
                source: JSON.stringify(query),
                source_content_type: 'application/json'
            }
        })
            .then(response => {
                console.log(response.data.hits.hits)
                var typeDict = {
                    'Organism': {
                        'Archeon': {},
                        'Bacterium': {},
                        'Eukaryote': {},
                        'Virus': {},
                    },
                    'Fully Formed Anatomical Structure': {
                        'Body Part, Organ, or Organ Component': {},
                        'Tissue': {},
                        'Cell': {},
                        'Cell Component': {},
                        'Gene or Genome': {},
                    },
                    'Chemical': {
                        'Chemical': {},
                    },
                    'Physiologic Function': {
                        'Organism Function': {},
                        'Organ or Tissue Function': {},
                        'Cell Function': {},
                        'Molecular Function': {},
                    },
                    'Pathologic Function': {
                        'Disease or Syndrome': {},
                        'Cell or Molecular Dysfunction': {},
                        'Experimental Model of Disease': {},
                    }
                };
                var entities = [];
                for (let i = 0; i < response.data.hits.hits.length; i++) {
                    for (let j = 0; j < response.data.hits.hits[i]._source.entities.length; j++) {
                        entities.push(response.data.hits.hits[i]._source.entities[j]);
                    }
                }
                console.log(entities)
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
                console.log(cleaned_type_dict);

                var result_list = response.data.hits.hits;
                var num_results = Object.keys(response.data.hits.hits).length;
                var total_pages = Math.ceil(num_results / 10);
                const searchParams = new URLSearchParams(window.location.search);
                var curr_page = searchParams.get('page')
                this.setState({
                    responseTime: response.data.took,
                    searchResults: result_list,
                    resultLength: Object.keys(result_list).length,
                    totalPage: total_pages,
                    currentPage: curr_page,
                    keyword: keyword,
                    typeDict: cleaned_type_dict,
                })
            })
    }

    showSearchResults() {
        var table = [];
        var result_length = Object.keys(this.state.searchResults).length;
        var start_index = (this.state.currentPage - 1) * 10;
        var end_index = start_index + 10;
        if(end_index > result_length) {
            end_index = result_length;
        }
        for(let i = start_index; i < end_index; i++) {
            // console.log(this.state.searchResults[i]._source.title)
            table.push(<Result pmid={this.state.searchResults[i]._source.pmid}
                                sentence={this.state.searchResults[i]._source.sentence}
                                prevSentence={this.state.searchResults[i]._source.prevSent}
                                nextSentence={this.state.searchResults[i]._source.nextSent}
                                title={this.state.searchResults[i]._source.title}
                                sentID={this.state.searchResults[i]._source.sentId}
                                isTitle={this.state.searchResults[i]._source.isTitle}
                                abstract={this.state.searchResults[i]._source.abstract} key={i}
                                entities={this.state.searchResults[i]._source.entities}
                                authors={this.state.searchResults[i]._source.author_list}
                                date={this.state.searchResults[i]._source.date}
                                journal={this.state.searchResults[i]._source.journal_name}
                                score={this.state.searchResults[i]._score}
                                key={i} ranking={String(i)}/>)
        }
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

    render() {
        return(
            <div style={{ paddingTop: "2rem" }}>
                <Grid stretched style={{ paddingLeft: "1rem" }}>
                    <Grid.Column width={1}/>
                    <Grid.Column width={10}>
                        <Container fluid style={{ color: 'grey', paddingLeft: '0.5rem' }}>
                            <span> "{this.state.keyword}" </span>
                            <span>(Total: <strong>{this.state.resultLength}</strong>, Took: <strong>{this.state.responseTime}ms</strong>)</span>
                            <br />
                            <small>~ At most 10 results are shown per page ~</small>
                        </Container>
                    </Grid.Column>
                    <Grid.Column width={5} />
                </Grid>
                <Grid padded>
                    <Grid.Column width={1} />
                    <Grid.Column width={10}>
                        {/* <Header><Icon name='search' />Search Results for:  </Header> */}
                        <List divided verticalAlign='middle' size={'big'}>
                            {this.showSearchResults()}
                        </List>
                        <Segment basic>
                            <Pagination className={'result-list-pagination'}
                                defaultActivePage={1}
                                ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                                firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                                lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                                prevItem={{ content: <Icon name='angle left' />, icon: true }}
                                nextItem={{ content: <Icon name='angle right' />, icon: true }}
                                totalPages={this.state.totalPage}
                                activePage={this.state.currentPage}
                                onPageChange={(e, { activePage }) => this.handleKeyPress(this.state.keyword.replace(/=/g, '%3D').replace(/&/g, '%26'), activePage)}
                            />
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={4} style={{ backgroundColor: '', height: 'auto' }}>
                        <div style={{ color: 'black', padding: '1rem', borderLeft: "1px solid rgb(225, 225, 225)" }}>
                            <Header as='h6'>Label Coloring & Frequent Associated Entities</Header>
                            <Segment basic className='resultlist-word-list'>
                                <List>
                                    {this.showWordList()}
                                </List>
                            </Segment>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={1} />
                </Grid>
            </div>
        )
    }
}

const color = {
    'Chemical': '#F44336',
    'Organism': '#3399ff',
    'Fully Formed Anatomical Structure': '#009688',
    'Physiologic Function': '#8E24AA',
    'Pathologic Function': '#F3D250',
    'Gene or Genome': '#374785',
    'Disease or Syndrome': '#f7941d',
};

const parent_type = {
    'Chemical': 'Chemical',
    'Archaeon': 'Organism',
    'Bacterium': 'Organism',
    'Eukaryote': 'Organism',
    'Virus': 'Organism',
    'Body Part, Organ, or Organ Component': 'Fully Formed Anatomical Structure',
    'Tissue': 'Fully Formed Anatomical Structure',
    'Cell': 'Fully Formed Anatomical Structure',
    'Cell Component': 'Fully Formed Anatomical Structure',
    'Gene or Genome': 'Fully Formed Anatomical Structure',
    'Organism Function': 'Physiologic Function',
    'Organ or Tissue Function': 'Physiologic Function',
    'Cell Function': 'Physiologic Function',
    'Molecular Function': 'Physiologic Function',
    'Disease or Syndrome': 'Pathologic Function',
    'Cell or Molecular Dysfunction': 'Pathologic Function',
    'Experimental Model of Disease': 'Pathologic Function',
}
