import React from 'react';
import {List} from "semantic-ui-react";
import MinorTypeList from '../Component/MinorTypeList';
import '../Style/MajorTypeList.css';

export default class MajorTypeList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            listExpanded: true,
        }

        this.listWordForEachMajorType = this.listWordForEachMajorType.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        if(this.props.Type === 'Chemical') {
            this.setState({
                listExpanded: false
            })
        }
    }

    listWordForEachMajorType(list) {
        var table = [];
        var types = Object.keys(list);
        console.log(types);
        for(let i = 0; i < types.length; i++) {
            table.push(<MinorTypeList Type={types[i]} List={list[types[i]]} sortMode={this.props.sortMode}/>)
        }
        return table;
    }

    render() {
        if(this.state.listExpanded === false) {
            return(
                <List.Item as='a'>
                    <List.Icon name='angle down' style={{ float: 'left' }} />
                    <List.Content>
                        <List.Header style={{ color: color[this.props.Type] }} 
                                    onClick={() => {this.setState({listExpanded: !this.state.listExpanded,})}}>
                            {this.props.Type}
                        </List.Header>
                    </List.Content>
                </List.Item>
            )
        }else {
            if(this.props.Type !== 'Chemical') {
                return(
                    <List.Item as='a'>
                        <List.Icon name='angle up' style={{ float: 'left' }} />
                        <List.Content>
                            <List.Header style={{ color: color[this.props.Type] }}
                                        onClick={() => {this.setState({listExpanded: !this.state.listExpanded,})}}>
                                {this.props.Type}
                            </List.Header>
                            <List.List>
                                {this.listWordForEachMajorType(this.props.List)}
                            </List.List>
                        </List.Content>
                    </List.Item>
                )
            } else {
                return(
                    <List.Item as='a'>
                        <List.Icon name='angle up' style={{ float: 'left' }} />
                        <List.Content>
                            <List.Header style={{ color: color[this.props.Type] }}
                                        onClick={() => {this.setState({listExpanded: !this.state.listExpanded,})}}>
                                {this.props.Type}
                            </List.Header>
                            {this.listWordForEachMajorType(this.props.List)}
                        </List.Content>
                    </List.Item>
                )
            }
        }
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