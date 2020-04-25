import React from 'react';
import {Container, Header, Divider, Popup, List, Message, Label, Icon, Transition, Grid, Menu, Segment, Dropdown} from "semantic-ui-react";
import '../Style/ArticleBody.css';
import PatternTable from '../Component/PatternTable.js';
import {Animated} from "react-animated-css";
import {Link} from "react-router-dom";
import Footer from '../../Footer/Component/Footer';

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
        let retries = 0;
        const scroll = () => {
            retries += 0;
            if (retries > 50) return;
            const element = document.getElementById(this.props.jumpTarget);
            if (element) {
              setTimeout(() => element.scrollIntoView(), 0);
            } else {
              setTimeout(scroll, 100);
            }
        };
        scroll();
    }

    showAuthors() {
        var table = [];
        for(let i = 0; i < Object.keys(this.props.authors).length; i++) {
            table.push(this.props.authors[i])
            table.push('; ')
        }
        return table;
    }

    highlightText(isTitle) {
        if (this.props.sentences[0] !== undefined) {
            var table = [];

            var titleSentences = this.props.sentences.filter(function(x) {
                return x.isTitle === isTitle;
            })

            if (titleSentences.length === 0) {
                return "No text for this section."
            }

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

                var abstractSentences = this.props.sentences.filter(function(x) {
                    return x.isTitle === 0;
                })
                if (isTitle === 0) {
                    if (this.props.jumpTarget === 'abstract' + j) {
                        table.push(
                            <Animated style={{ border: "1px solid black", padding: '0.5rem', paddingRight: '2rem' }} animationIn="rubberBand" animationInDelay={300}>
                                <span id={'abstract' + j} style={{ paddingTop: "50vh", marginTop: "-50vh" }} />
                                <Icon name="search" corner="top right"/>
                                <span style={{ backgroundColor: this.props.sentColors['abstract' + j] }} >{curr_table}</span>
                            </Animated>
                        )
                    } else {
                        table.push(<span style={{ paddingTop: "50vh", marginTop: "-50vh" }} id={'abstract' + j}></span>)
                        table.push(<span style={{ backgroundColor: this.props.sentColors['abstract' + j] }}>{curr_table}</span>)
                    }
                } else if (isTitle === 1) {
                    if (this.props.jumpTarget === 'title' + j) {
                        table.push(
                            <Animated style={{ border: "1px solid black", padding: '0.5rem', paddingRight: '2rem' }} animationIn="rubberBand" animationInDelay={300}>
                                <span id={'title' + j} style={{ paddingTop: "50vh", marginTop: "-50vh" }} />
                                <Icon name="search" />
                                <span style={{ backgroundColor: this.props.sentColors['title' + j] }}>{curr_table}</span>
                            </Animated>
                        )
                    } else {
                        table.push(<span id={'title' + j} style={{ backgroundColor: this.props.sentColors['title' + j] }}>{curr_table}</span>)
                    }
                } else {
                    if (this.props.jumpTarget === String('body' + j)) {
                        table.push(
                            <Animated style={{ border: "1px solid black", padding: '0.5rem', paddingRight: '2rem' }} animationIn="rubberBand" animationInDelay={300}>
                                <span id={'body' + j} style={{ paddingTop: "50vh", marginTop: "-50vh" }} />
                                <Icon name="search" />
                                <span style={{ backgroundColor: this.props.sentColors['body' + j] }}>{curr_table}</span>
                            </Animated>
                        )
                    } else {
                        table.push(<span style={{ paddingTop: "50vh", marginTop: "-50vh" }} id={'body' + j}></span>)
                        table.push(<span style={{ backgroundColor: this.props.sentColors['body' + j] }}>{curr_table}</span>)
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
            <div>
                <Grid className="article-container">
                    <Grid.Row className="article-container-row">
                        <Grid.Column only='computer' computer={1}/>
                        <Grid.Column mobile={16} tablet={16} computer={14} widescreen={10} className="article-container-column">
                            <h1 className="title-text">{this.highlightText(1)}</h1>
                            <div className={'author-names'}>{this.showAuthors()}</div>
                            <div className='meta-info'>
                                {this.props.journal? <span><strong>Journal: </strong><i>{this.props.journal}</i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> : ""}
                                <strong>Published: </strong>{this.props.date}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {this.props.pmid? <span><strong>PMID: </strong><a href={`https://www.ncbi.nlm.nih.gov/pubmed/?term=${this.props.pmid}`}>{this.props.pmid}</a></span> : ""}
                            </div>
                        </Grid.Column>
                        <Grid.Column computer={1} widescreen={5}/>
                    </Grid.Row>
                    <Grid.Row style={{ padding: '0', margin: '0' }}>
                        <Grid.Column only='computer' computer={1}/>
                        <Grid.Column mobile={16} tablet={16} computer={10} widescreen={7} className="article-content-column">
                            <div className="abstract-container">
                                <h4>Abstract</h4>
                                <p>
                                    {this.highlightText(0)}
                                </p>
                            </div>

                            <div className="body-container">
                                <p>{this.highlightText(2)}</p>
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={16} computer={4} widescreen={3} style={{ margin: '0', padding: '0' }}>
                            <div className="word-segment-container">
                                <Segment.Group className="word-segment">
                                    <Segment className="word-segment-header">Label Coloring & Entity Counts</Segment>
                                    <Segment>
                                    <Dropdown placeholder={'Sorted By: ' + this.state.sortMode} selection fluid className='icon'>
                                            <Dropdown.Menu>
                                                <Dropdown.Header icon='hand pointer' content={'Choose a method'} />
                                                <Dropdown.Divider />
                                                <Dropdown.Item label={{ color: 'red', empty: true, circular: true }} text='Frequency' onClick={() => this.setState({ sortMode: 'Frequency' })}/>
                                                <Dropdown.Item label={{ color: 'blue', empty: true, circular: true }} text='Alphabet' onClick={() => this.setState({ sortMode: 'Alphabet' })}/>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        </Segment>
                                    <Segment className="word-segment-list">
                                        <List>
                                            {this.props.showWordList()}
                                        </List>
                                    </Segment>
                                </Segment.Group>

                                <Menu.Item className="pattern-segment">
                                    <PatternTable patterns={this.props.patterns} changeSentColor={this.props.changeSentColor}
                                        scrollToAnchor={this.props.scrollToAnchor} />
                                </Menu.Item>
                            </div>
                        </Grid.Column>
                        <Grid.Column computer={1} widescreen={5}/>
                    </Grid.Row>
                </Grid>
                <Grid className="article-footer-container" >
                    <Grid.Row className="article-footer-row">
                        <Grid.Column only='computer' computer={1}/>
                        <Grid.Column mobile={16} tablet={16} computer={10} widescreen={7} className="article-content-column" >
                            <Footer />
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={16} computer={4} widescreen={3} style={{ margin: '0', padding: '0' }}/>
                        <Grid.Column computer={1} widescreen={5}/>
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
    'SPACY TYPE': '#F44336',
    'NEW TYPE': '#3399ff',
    'PHYSICAL OBJECT': '#009688',
    'CONCEPTUAL ENTITY': '#8E24AA',
    'ACTIVITY': '#F3D250',
    'PHENOMENON OR PROCESS': '#374785',
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
}
