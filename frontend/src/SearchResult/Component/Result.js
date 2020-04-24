// import react
import React from 'react';

// import packages
import {Header, Label, Segment, Button, Icon, Message, ontainer, Divider, Popup, List, Transition} from "semantic-ui-react";
import {Link} from "react-router-dom";

// import css style
import '../Style/Result.css';

// import utils functions
import utils from '../../utils';

export default class Result extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAllAuthors: false,
            isMobile: false,
        };

        this.showAuthors = this.showAuthors.bind(this);
        this.showSentence = this.showSentence.bind(this);
        this.addAnchor = this.addAnchor.bind(this);
        this.decideScoreColor = this.decideScoreColor.bind(this);
        this.decideScoreSize = this.decideScoreSize.bind(this);
    }

    componentDidMount() {
        // Set up screen size listener
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    resize() {
        this.setState({isMobile: window.innerWidth < 992});
    }

    showAuthors = () => {
        var table = [];
        for(let i = 0; i < 1; i++) {
            table.push(<Label className={'author-label'} as='a'>
                {this.props.authors[i]}
            </Label>)
        }
        return table;
    }

    showSentence = () => {
        var entities = this.props.entities;
        var sentence = this.props.sentence;
        var start = 0;
        var end = 0;
        var table = [];
        for (let i = 0; i < entities.length; i++) {
            end = entities[i].start;
            table.push(sentence.substring(start, end))
            table.push(
                <Popup
                    style={style} inverted mouseEnterDelay={300}
                    mouseLeaveDelay={300}
                    trigger={<strong style={{ color: entities[i].type === 'Gene or Genome' || entities[i].type === 'Disease or Syndrome'? color[entities[i].type] : color[parent_type[entities[i].type]] }}>
                        {this.props.sentence.substring(entities[i].start, entities[i].end)}
                        </strong>}
                    content='Way off to the left'
                >
                    <List>
                        <div className={'author-names'}><a style={{ color: '#7e7e7e' }}>Type:</a> <a>{parent_type[entities[i].type]} {entities[i].type === "Chemical" ? '' : '- ' + entities[i].type}</a></div>
                        <div className={'author-names'}><a style={{ color: '#7e7e7e' }}>Source:</a> <a>{entities[i].source === '' || !entities[i].source? 'Unknown':entities[i].source}</a></div>
                    </List>
                </Popup>
            );
            start = entities[i].end   
        }
        end = sentence.length;
        table.push(sentence.substring(start, end));
        return table;
    }

    addAnchor = (sentID, pmid) => {
        if(this.props.isTitle === 1) {
            return "/articles/" + pmid + "#title";
        } else if(this.props.isTitle === 0) {
            return "/articles/" + pmid + "#sent" + sentID;
        } else {
            return "/articles/" + pmid + "#body" + sentID;
        }
    }

    decideScoreColor = (ranking, page) => {
        if(ranking === 0 && page === '1') {
            return 'red';
        }else if (ranking === 1 && page === '1') {
            return 'orange';
        }else if (ranking === 2 && page === '1') {
            return 'yellow';
        }else {
            return '';
        }
    }

    decideScoreSize = (ranking, page) => {
        if(ranking === 0 && page === '1') {
            return 'small';
        }else if (ranking === 1 && page === '1') {
            return 'tiny';
        }else {
            return 'mini';
        }
    }

    render() {
        const { isMobile } = this.state;

        return(
            <Segment basic={!isMobile} raised={isMobile} className={'search-segment'}>
                <a className={'result-header'} href={`/articles/${this.props.documentId}?jt=${this.props.sentID}`} >{this.showSentence()}</a>
                <span style={{ color: 'rgb(33, 133, 208)', fontSize: "0.8rem", marginLeft: '0.3rem' }}>
                    <Popup style={style} inverted mouseEnterDelay={300}
                            mouseLeaveDelay={300} content='context' 
                            trigger={this.props.isTitle === 1? <Label as='a' basic size='mini' color='green' className="context-label">Title</Label>:<Label as='a' basic size='mini' color='blue' className="context-label">Context</Label>}>
                        {this.props.isTitle === 1? 'This is the title' : <p>{this.props.prevSentence} <i style={{ textDecoration: "underline" }}>{this.props.sentence}</i> {this.props.nextSentence}</p>}
                    </Popup>
                </span>
                <div className={'metadata-section'} style={{ marginTop: '1rem' }}>
                    <Popup content='Evidence score indicates the confidence of the retrieved sentence being a supporting evidence of the input query.' 
                        style={style} inverted mouseEnterDelay={300} mouseLeaveDelay={300}
                        trigger={<Label as='a' size={this.decideScoreSize(this.props.ranking, this.props.page)} color={this.decideScoreColor(this.props.ranking, this.props.page)} image>
                        <Icon name='check'/>
                        Evidence Score
                        <Label.Detail>{this.props.score.toFixed(2)}</Label.Detail>
                        </Label>} />
                    <Label size="mini" className={'metadata-label'}>
                        <Icon name='calendar'/>{this.props.date}
                    </Label>
                    <Label size="mini" className={'metadata-label'}>
                        <Icon name='book' />{this.props.journal}
                    </Label>
                    <Label size="mini" className={'metadata-label'} hidden={this.props.pmid === ""}>
                        <Icon name='linkify'/>PMID{this.props.pmid}
                    </Label>
                    <Label size="mini" className={'metadata-label'} image className={this.state.showAllAuthors? 'invisible-label' : ''} hidden={this.props.authors.length === 0}>
                        <Icon name='user' />{this.props.authors[0]}
                        <Label.Detail as='a' onClick={() => this.setState({showAllAuthors: !this.state.showAllAuthors})}><Icon name='angle double down' fitted/></Label.Detail>
                    </Label>
                </div>
                <div className="small-title">{this.props.isTitle === 1? "":<small>Title: {this.props.title}</small>}</div>
                <Transition visible={this.state.showAllAuthors} animation='scale' duration={500}>
                    <Message className={'author-section'}  onDismiss={() => this.setState({showAllAuthors: !this.state.showAllAuthors})}>
                        <Message.Content>
                            <Header as='h6'>Authors</Header>
                            <List horizontal divided size="tiny">
                                {this.props.authors.map(author => 
                                <List.Item>
                                    <List.Content>
                                        {author}
                                    </List.Content>
                                </List.Item>)}
                            </List>
                        </Message.Content>
                    </Message>
                </Transition>
            </Segment>
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

const style = {
    borderRadius: 0,
    fontSize: '0.8rem',
    opacity: 0.9,
    // padding: '2em',
  }