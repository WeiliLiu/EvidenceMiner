module.exports = {
    sum: sum,
    getColor: function(archive) {
        return color[archive];
    },
    getTypeHierarchy: function(archive) {
        return parent_type[archive];
    },
    sortByEntityCount: function(obj) {
        return Object.keys(obj).sort(function(a, b) {
            return sum(obj[b]) - sum(obj[a]);
        })
    },
    sortByWordFrequency: function(obj) {
        return Object.keys(obj).sort(function(a, b) {
            return obj[b] - obj[a];
        })
    },
    compileEntities: function(searchResult) {
        var entities = [];
        for (let i = 0; i < searchResult.hits.hits.length; i++) {
            for (let j = 0; j < searchResult.hits.hits[i]._source.entities.length; j++) {
                entities.push(searchResult.hits.hits[i]._source.entities[j]);
            }
        }
        return entities;
    },
    compileEntityFrequency: function(entities, archive) {
        var typeDict = {};

        entities.forEach(entity => {
            if(parent_type[archive][entity.type] in typeDict === false) {
                typeDict[parent_type[archive][entity.type]] = {}
            }
            if(entity.type in typeDict[parent_type[archive][entity.type]] === false) {
                typeDict[parent_type[archive][entity.type]][entity.type] = {}
            }
            if(entity.name.toLowerCase() in typeDict[parent_type[archive][entity.type]][entity.type] === false) {
                typeDict[parent_type[archive][entity.type]][entity.type][entity.name.toLowerCase()] = 0;
            }
            typeDict[parent_type[archive][entity.type]][entity.type][entity.name.toLowerCase()] += 1;
        });

        return typeDict;
    },
    compilePaperData: function(docSentences) {
        let sentences = []; 
        let patterns = []; 
        let entities = [];
        let sentColors = {};
        docSentences.hits.hits.forEach(sentence => {
            sentColors[sentence._source.sentId] = '';
            sentences.push(sentence._source);
            sentence._source.entities.forEach(entity => {
                entities.push(entity);
            });
            sentence._source.patterns.forEach(pattern => {
                patterns.push(pattern);
            });
        })
        console.log(1)
        console.log(docSentences.hits.hits)
        return [entities, sentences, patterns, sentColors];
    }
}

function sum(obj) {
    if (obj === {}) return 0;
    if (obj === parseInt(obj, 10)) return 1;

    let result = 0;
    for(var el in obj) {
        result += sum(obj[el])
    }
    return result;
}

const color = {
    'covid-19': {
        'SPACY TYPE': '#F44336',
        'NEW TYPE': '#3399ff',
        'PHYSICAL OBJECT': '#009688',
        'CONCEPTUAL ENTITY': '#8E24AA',
        'ACTIVITY': '#F3D250',
        'PHENOMENON OR PROCESS': '#374785',
    },
    'chd': {
        'Chemical': '#F44336',
        'Organism': '#3399ff',
        'Fully Formed Anatomical Structure': '#009688',
        'Physiologic Function': '#8E24AA',
        'Pathologic Function': '#F3D250',
        'Gene or Genome': '#374785',
        'Disease or Syndrome': '#f7941d',
    },
    'covidseptember': {
        'SPACY TYPE': '#F44336',
        'NEW TYPE': '#3399ff',
        'PHYSICAL OBJECT': '#009688',
        'CONCEPTUAL ENTITY': '#8E24AA',
        'ACTIVITY': '#F3D250',
        'PHENOMENON OR PROCESS': '#374785',
    }
};

const parent_type = {
    'covid-19': {
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
        "BODY SUBSTANCE": "PHYSICAL OBJECT",
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
    },
    'chd': {
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
    },
    'covidseptember': {
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
        "BODY SUBSTANCE": "PHYSICAL OBJECT",
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
}