import React, {createRef} from 'react';
import 'semantic-ui-css/semantic.min.css';
import {
    Divider, Image,
    Grid, Header, Rail,
    Ref, Input, Container, Search,
    Segment, Sticky, Dropdown, List, Label, Message, Sidebar, Menu, Icon
} from 'semantic-ui-react'
import { Button } from 'react-bootstrap';
import axios from 'axios';
import ArticleBody from '../Component/ArticleBody';
import '../Style/Article.css';
import NavigationBar from "../../NavigationBar/Component/NavigationBar";
import MajorTypeList from '../Component/MajorTypeList';
import MinorTypeList from "./MinorTypeList";
import {Link} from "react-router-dom";
import PatternTable from '../Component/PatternTable.js';
import config from '../../config';

export default class Article extends React.Component {
    contextRef = createRef();

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            abstract: '',
            authors: [],
            journal: '',
            pmid: '',
            publish_date: '',
            entities: [],
            patterns: [],
            typeDict: {},
            sentences: [],
            sentColors: [],
            sortMode: 'None',
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.currentSortMode = this.currentSortMode.bind(this);
        this.showWordList = this.showWordList.bind(this);
        this.changeSentColor = this.changeSentColor.bind(this);
        this.clearSentColor = this.clearSentColor.bind(this);
        this.scrollToAnchor = this.scrollToAnchor.bind(this);
    }

    componentDidMount() {
        var query = {"query":{"bool":{"must":[{"match":{"pmid":this.props.match.params.id.replace('#', ' ').split(' ')[0]}}],"must_not":[],"should":[]}},"from":0,"size":250,"sort":[],"aggs":{}};

        axios.get(config.searchUrl + '/pubmed/_search', {
            params: {
                source: JSON.stringify(query),
                source_content_type: 'application/json'
            }
        })
            .then(response => {
                var sentences = [];
                var entities = [];
                var patterns = [];
                var sentColors = [];
                for (let i = 0; i < response.data.hits.hits.length; i++) {
                    sentColors.push('');
                    sentences.push(response.data.hits.hits[i]._source);
                    for (let j = 0; j < response.data.hits.hits[i]._source.entities.length; j++) {
                        entities.push(response.data.hits.hits[i]._source.entities[j]);
                    }
                    for (let j = 0; j < response.data.hits.hits[i]._source.patterns.length; j++) {
                        patterns.push(response.data.hits.hits[i]._source.patterns[j]);
                    }
                }
                console.log(patterns);
                var entities_length = entities.length;
                var type_dict = {
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
                for(let i = 0; i < entities_length; i++) {
                    if(parent_type[entities[i].type] in type_dict === false) {
                        type_dict[parent_type[entities[i].type]] = {}
                    }
                    if(entities[i].type in type_dict[parent_type[entities[i].type]] === false) {
                        type_dict[parent_type[entities[i].type]][entities[i].type] = {}
                    }
                    if(entities[i].name in type_dict[parent_type[entities[i].type]][entities[i].type] === false) {
                        type_dict[parent_type[entities[i].type]][entities[i].type][entities[i].name] = 0;
                    }
                    type_dict[parent_type[entities[i].type]][entities[i].type][entities[i].name] += 1;
                }

                var cleaned_type_dict = {};
                var major_types = Object.keys(type_dict);
                for(let i = 0; i < major_types.length; i++) {
                    var minor_types = Object.keys(type_dict[major_types[i]])
                    var should_include_major_type = false;
                    for(let j = 0; j < minor_types.length; j++) {
                        if(Object.keys(type_dict[major_types[i]][minor_types[j]]).length !== 0) {
                            should_include_major_type = true;
                            break;
                        }
                    }

                    if(should_include_major_type === true) {
                        cleaned_type_dict[major_types[i]] = {};
                        for(let j = 0; j < minor_types.length; j++) {
                            if(Object.keys(type_dict[major_types[i]][minor_types[j]]).length !== 0) {
                                cleaned_type_dict[major_types[i]][minor_types[j]] = type_dict[major_types[i]][minor_types[j]]
                            } else {
                                continue;
                            }
                        }
                    }else {
                        continue;
                    }
                }

                this.setState({
                    sentences: sentences,
                    pmid: sentences[0].pmid,
                    authors: sentences[0].author_list,
                    journal: sentences[0].journal_name,
                    publish_date: sentences[0].date,
                    entities: entities,
                    patterns: patterns,
                    typeDict: cleaned_type_dict,
                    sentColors: sentColors,
                });
            })
            .catch(error => {
                console.log(error);
            })
    }

    scrollToAnchor = (anchorName) => {
        console.log(anchorName)
        if (anchorName) {
            var abstractSentences = this.state.sentences.filter(function(x) {
                return x.isTitle === 0;
            })
            if (anchorName >= abstractSentences.length) {
                let anchorElement = document.getElementById('body' + String(anchorName - abstractSentences.length));
                if(anchorElement) { anchorElement.scrollIntoView({behavior: 'smooth'}); }
            } else {
                let anchorElement = document.getElementById('sent' + String(anchorName));
                if(anchorElement) { anchorElement.scrollIntoView({behavior: 'smooth'}); }
            }

            
        }
      }

    clearSentColor = () => {
        var sentColors = this.state.sentColors;
        for (let i = 0; i < sentColors.length; i++) {
            sentColors[i] = '';
        }
        this.setState({
            sentColors: sentColors,
        })
    }

    changeSentColor = (sentId) => {
        console.log(sentId)
        var sentColors = this.state.sentColors;
        for (let i = 0; i < sentColors.length; i++) {
            if (String(i) === sentId) {
                sentColors[i] = 'rgb(252, 242, 171)';
            } else {
                sentColors[i] = '';
            }
        }
        this.setState({
            sentColors: sentColors,
        })
    }

    currentSortMode() {
        var ret_string = 'selected: ' + this.state.sortMode;
        return ret_string;
    }

    showWordList() {
        var table = [];
        console.log(this.state.typeDict);
        var types = Object.keys(this.state.typeDict);
        for(let i = 0; i < types.length; i++) {
            table.push(<MajorTypeList Type={types[i]} List={this.state.typeDict[types[i]]} sortMode={this.state.sortMode}/>)
        }
        return table;
    }

    render() {
        return (
            <div>
                <Menu vertical fixed="left" size="big" className="article-left-segment">
                    <Menu.Item>
                        <Link to={{
                                pathname: `/`
                            }} >
                                <Container fluid content="EvidenceMiner" textAlign='center'
                                        style={{ backgroundColor: '', fontSize: "1.5rem", padding: "0" }}
                                />
                        </Link>
                    </Menu.Item>
                    {/* <Menu.Item>
                        <Search
                                fluid
                                loading={false}
                                input={<Input fluid icon='search' placeholder='Search...' />}
                                // onResultSelect={this.handleResultSelect}
                                // onSearchChange={_.debounce(this.handleSearchChange, 500, {
                                // leading: true,
                                // })}
                                // results={results}
                                // value={value}
                                // resultRenderer={resultRenderer}
                                // noResultsMessage={"No meta patterns found!"}
                                // onKeyPress={this.handleKeyPress}
                                // onFocus={() => {this.setState({searchBarFocused: true})}}
                                // onBlur={() => {this.setState({searchBarFocused: false})}}
                                {...this.props}
                            />
                    </Menu.Item> */}
                    <Menu.Item>
                        <Segment >
                            <Header as='h4'>Label Coloring & Entity Counts</Header>
                            <Divider/>
                            <div>
                                <Dropdown placeholder={'Sorted By: ' + this.state.sortMode} selection fluid className='icon'>
                                    <Dropdown.Menu>
                                        <Dropdown.Header icon='hand pointer' content={'Choose a method'} />
                                        <Dropdown.Divider />
                                        <Dropdown.Item label={{ color: 'red', empty: true, circular: true }} text='Frequency' onClick={() => this.setState({ sortMode: 'Frequency' })}/>
                                        <Dropdown.Item label={{ color: 'blue', empty: true, circular: true }} text='Alphabet' onClick={() => this.setState({ sortMode: 'Alphabet' })}/>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <List>
                                    {this.showWordList()}
                                </List>
                            </div>
                        </Segment>
                    </Menu.Item>
                </Menu>

                <ArticleBody sentences={this.state.sentences}
                            title={this.state.title}  abstract={this.state.abstract} authors={this.state.authors}
                            date={this.state.publish_date} pmid={this.state.pmid} journal={this.state.journal}
                            entities={this.state.entities} typeDict={this.state.typeDict} patterns={this.state.patterns}
                            state={this.props.location.state === undefined? "None": this.props.location.state}
                            sentColors={this.state.sentColors} changeSentColor={this.changeSentColor}
                            clearSentColor={this.clearSentColor}/>

                <Menu vertical fixed="right" size="big" className="article-left-segment">
                    <Menu.Item>
                        <Header as='h4'>Meta-pattern Extractions </Header>
                        <PatternTable patterns={this.state.patterns} changeSentColor={this.changeSentColor}
                            scrollToAnchor={this.scrollToAnchor}/>
                    </Menu.Item>
                </Menu>
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
