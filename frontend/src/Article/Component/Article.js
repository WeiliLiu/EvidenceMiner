import React, {createRef} from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'
import ArticleBody from '../Component/ArticleBody';
import '../Style/Article.css';
import NavigationBar from "../../NavigationBar/Component/NavigationBar";
import TypeList from '../../components/TypeList/PrimaryList';

// import api endpoints
import api from '../../api';

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
            sentColors: {},
            sortMode: 'None',
            jumpTarget: '',
            isLoading: true,
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.currentSortMode = this.currentSortMode.bind(this);
        this.changeSentColor = this.changeSentColor.bind(this);
        this.clearSentColor = this.clearSentColor.bind(this);
        this.scrollToAnchor = this.scrollToAnchor.bind(this);
    }

    async componentDidMount() {
        // Get query from the url querystring
        const jumpTarget = new URLSearchParams(window.location.search).get('jt');

        // Get the total number of sentences in this article
        const docSentencesCount = await api.getDocSentencesCount(this.props.match.params.id);

        // Get all the sentences for this article
        const docSentences = await api.getDocSentences(this.props.match.params.id, docSentencesCount);

        // Process the returned results for display
        let sentences = [];
        let entities = [];
        let patterns = [];
        let sentColors = {};
        for(let i = 0; i < docSentencesCount; i++) {
            sentColors[docSentences.hits.hits[i]._source.sentId] = ''
            sentences.push(docSentences.hits.hits[i]._source);
            for (let j = 0; j < docSentences.hits.hits[i]._source.entities.length; j++) {
                entities.push(docSentences.hits.hits[i]._source.entities[j]);
            }
            for (let j = 0; j < docSentences.hits.hits[i]._source.patterns.length; j++) {
                patterns.push(docSentences.hits.hits[i]._source.patterns[j]);
            }
        }

        var typeDict = {};
        
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
            jumpTarget: jumpTarget,
            isLoading: false,
        });
    }

    scrollToAnchor = (anchorName) => {
        console.log(anchorName)
        if (anchorName) {
            let anchorElement = document.getElementById(String(anchorName));
            if(anchorElement) { anchorElement.scrollIntoView({behavior: 'smooth'}); }
        }
      }

    clearSentColor = () => {
        var sentColors = this.state.sentColors;
        for (let i = 0; i < this.state.sentences.length; i++) {
            sentColors[this.state.sentences[i].sentId] = '';
        }
        this.setState({
            sentColors: sentColors,
        })
    }

    changeSentColor = (sentId) => {
        var sentColors = this.state.sentColors;
        for (let i = 0; i < this.state.sentences.length; i++) {
            if (this.state.sentences[i].sentId === sentId) {
                sentColors[this.state.sentences[i].sentId] = 'rgb(252, 242, 171)';
            } else {
                sentColors[this.state.sentences[i].sentId] = '';
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

    // showWordList() {
    //     var table = [];
    //     var types = Object.keys(this.state.typeDict);
    //     for(let i = 0; i < types.length; i++) {
    //         table.push(<MajorTypeList Type={types[i]} List={this.state.typeDict[types[i]]} sortMode={this.state.sortMode}/>)
    //     }
    //     return table;
    // }

    render() {
        const { isLoading } = this.state;

        return (
            <div>
                <NavigationBar history={this.props.history} type="search"/>

                {isLoading? <Segment className="loading-screen">
                                <Loader active size='huge'>Setting Up Article</Loader>
                            </Segment> : <ArticleBody sentences={this.state.sentences}
                            title={this.state.title}  abstract={this.state.abstract} authors={this.state.authors}
                            date={this.state.publish_date} pmid={this.state.pmid} journal={this.state.journal}
                            entities={this.state.entities} typeDict={this.state.typeDict} patterns={this.state.patterns}
                            state={this.props.location.state === undefined? "None": this.props.location.state}
                            sentColors={this.state.sentColors} changeSentColor={this.changeSentColor}
                            clearSentColor={this.clearSentColor} scrollToAnchor={this.scrollToAnchor} jumpTarget={this.state.jumpTarget} />}
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