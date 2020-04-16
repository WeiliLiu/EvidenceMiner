import React from 'react';
import {Container, Header, Divider, Popup, List, Message, Label, Icon, Transition, Grid, Menu, Segment, Dropdown} from "semantic-ui-react";
import '../Style/ArticleBody.css';
import PatternTable from '../Component/PatternTable.js';
import {Animated} from "react-animated-css";
import {Link} from "react-router-dom";

export default class ArticleBody extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sentColors: [],
        };

        this.showAuthors = this.showAuthors.bind(this);
        this.highlightText = this.highlightText.bind(this);
        this.showSentence = this.showSentence.bind(this);
        this.scrollToLocation = this.scrollToLocation.bind(this);
        this.scrollToAnchor = this.scrollToAnchor.bind(this);
    }

    componentDidMount() {
        this.scrollToLocation();
    }

    scrollToAnchor = (anchorName) => {
        if (anchorName) {
            let anchorElement = document.getElementById(anchorName);
            if(anchorElement) { anchorElement.scrollIntoView({behavior: 'smooth'}); }
        }
      }

    scrollToLocation = () => {
        const { hash } = window.location;
        if (hash !== '' && hash !== '#title') {
          let retries = 0;
          const id = hash.replace('#', '');
          console.log(id)
          const scroll = () => {
            retries += 0;
            if (retries > 50) return;
            const element = document.getElementById(id);
            if (element) {
              setTimeout(() => element.scrollIntoView(), 0);
            } else {
              setTimeout(scroll, 100);
            }
          };
          scroll();
        }
      }

    showAuthors() {
        var table = [];
        for(let i = 0; i < Object.keys(this.props.authors).length; i++) {
            table.push(<Label className={'author-label'}>
                {this.props.authors[i]}
            </Label>)
        }
        return table;
    }

    highlightText(isTitle) {
        if (this.props.sentences[0] !== undefined) {
            var table = [];
            console.log(this.props.sentences)
            var titleSentences = this.props.sentences.filter(function(x) {
                return x.isTitle === isTitle;
            })
            console.log(isTitle)
            console.log(titleSentences.length)
            for (let j = 0; j < titleSentences.length; j++) {
                var entities = titleSentences[j].entities;
                var sentence = titleSentences[j].sentence;
                var start = 0;
                var end = 0;
                var curr_table = [];
                for (let i = 0; i < entities.length; i++) {
                    end = entities[i].start;
                    curr_table.push(sentence.substring(start, end))
                    curr_table.push(<Popup inverted style={{ borderRadius: 0,
                        fontSize: '0.8rem',
                        opacity: 0.9, }}
                        trigger={<strong style={{ color: entities[i].type === 'Gene or Genome' || entities[i].type === 'Disease or Syndrome'? color[entities[i].type] : color[parent_type[entities[i].type]] }}>
                            {entities[i].name}
                        </strong>}
                        content='Way off to the left'
                    >
                        <List>
                            <div className={'author-names'}><a style={{ color: '#7e7e7e' }}>Type:</a> <a>{parent_type[entities[i].type]} {entities[i].type === "Chemical" ? '' : '- ' + entities[i].type}</a></div>
                            <div className={'author-names'}><a style={{ color: '#7e7e7e' }}>Source:</a> <a>{entities[i].source === '' ? 'Unknown':entities[i].source}</a></div>
                        </List></Popup>)
                    start = entities[i].end   
                }
                end = sentence.length;
                curr_table.push(sentence.substring(start, end));
                console.log(this.props.state.sentence)
                var abstractSentences = this.props.sentences.filter(function(x) {
                    return x.isTitle === 0;
                })
                if (isTitle === 0) {
                    if (this.props.state.sentence === j && this.props.state.isTitle === isTitle) {
                        // table.push(<span style={{ paddingTop: "50vh", marginTop: "-50vh" }} id={'sent' + j}></span>)
                        table.push(
                            <Animated style={{ border: "1px solid black", padding: '0.5rem', paddingRight: '2rem' }} animationIn="rubberBand" animationInDelay={300}>
                                <span id={'sent' + j} style={{ paddingTop: "50vh", marginTop: "-50vh" }} />
                                {/* <Label corner='right' size='mini' color='black' icon='search' className="corner-search"/> */}
                                <Icon name="search" corner="top right"/>
                                <span style={{ backgroundColor: this.props.sentColors[j] }} >{curr_table}</span>
                            </Animated>
                        )
                    } else {
                        table.push(<span style={{ paddingTop: "50vh", marginTop: "-50vh" }} id={'sent' + j}></span>)
                        table.push(<span style={{ backgroundColor: this.props.sentColors[j] }}>{curr_table}</span>)
                    }
                } else if (isTitle === 1) {
                    if (this.props.state.sentence === j && this.props.state.isTitle === isTitle) {
                        table.push(
                            <Animated style={{ border: "1px solid black", padding: '0.5rem', paddingRight: '2rem' }} animationIn="rubberBand" animationInDelay={300}>
                                {/* <Label corner='right' size='mini' color='black' icon='search' className="corner-search"/> */}
                                <Icon name="search" />
                                <span id={"title"}>{curr_table}</span>
                            </Animated>
                        )
                    } else {
                        table.push(<span id={"title"} >{curr_table}</span>)
                    }
                } else {
                    if (this.props.state.sentence === j && this.props.state.isTitle === isTitle) {
                        table.push(
                            <Animated style={{ border: "1px solid black", padding: '0.5rem', paddingRight: '2rem' }} animationIn="rubberBand" animationInDelay={300}>
                                <span id={'body' + j} style={{ paddingTop: "50vh", marginTop: "-50vh" }} />
                                <Icon name="search" />
                                <span style={{ backgroundColor: this.props.sentColors[j + abstractSentences.length] }}>{curr_table}</span>
                            </Animated>
                        )
                    } else {
                        table.push(<span style={{ paddingTop: "50vh", marginTop: "-50vh" }} id={'body' + j}></span>)
                        table.push(<span style={{ backgroundColor: this.props.sentColors[j + abstractSentences.length] }}>{curr_table}</span>)
                    }
                }
                table.push(' ');
            }
            return table;
        }
    }

    showSentence() {
        return this.props.state.sentence;
    }

    render() {
        return(
            <Container className={'article-body-container'} fluid style={{ backgroundColor: "" }}>
                <h1>{this.highlightText(1)}</h1>
                {/* <div className={'author-names'}><a style={{ color: '#7e7e7e' }}>PMID:</a> <a href={'#'}>{this.props.pmid}</a></div>
                <div className={'author-names'}><a style={{ color: '#7e7e7e' }}>Authors:</a> {this.showAuthors()}</div>
                <div className={'author-names'}><a style={{ color: '#7e7e7e' }}>Journal:</a> <i>{this.props.journal}</i></div>
                <div className={'author-names'}><a style={{ color: '#7e7e7e' }}>Publish Year:</a> {this.props.date}</div> */}
                
                <Segment className="word-segment">
                    <Header as='h4' style={{ backgroundColor: 'red' }}>Label Coloring & Entity Counts</Header>
                    {/* <Divider/> */}
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
                            {this.props.showWordList()}
                        </List>
                    </div>
                </Segment>

                <div className="abstract-container">
                    <h4>Abstract</h4>
                    <p>
                        {this.highlightText(0)}
                    </p>
                </div>
                <div className="body-container">
                    <p>{this.highlightText(2)}</p>
                </div>
            </Container>
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
