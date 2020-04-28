import React, {createRef} from 'react';

// import downloaded packages
import { Loader, Segment } from 'semantic-ui-react'

// import components
import ArticleBody from '../ArticleBody';
import NavigationBar from "../../NavigationBar";

// import api endpoints
import api from '../../../api';

// import util functions
import utils from '../../../utils';

// import css
import './styles.css';

class ArticleContainer extends React.Component {
    contextRef = createRef();

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            abstract: '',
            authors: [],
            journal: '',
            pmid: '',
            doi: '',
            pmcid: '',
            publish_date: '',
            entities: [],
            patterns: [],
            typeDict: {},
            sentences: [],
            sentColors: {},
            jumpTarget: '',
            graphData: [],
            graphColors: [],
            isLoading: true,
        };

        this.componentDidMount = this.componentDidMount.bind(this);
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

        // Get color and type hierarchy information
        const colors = utils.getColor();

        // Process the returned results for display
        let paperData = utils.compilePaperData(docSentences);
        let entities = paperData[0];
        let sentences = paperData[1];
        let patterns = paperData[2];
        let sentColors = paperData[3];

        // Counting word frequencies for each entity
        var typeDict = utils.compileEntityFrequency(entities);

        // Prepare graph data
        var graphData = [];
        var graphColors = [];
        for(var el in typeDict) {
            graphData.push(
                {
                    "id": el,
                    "label": el,
                    "value": utils.sum(typeDict[el]),
                }
            );
            graphColors.push(colors[el]);
        }

        this.setState({
            sentences: sentences,
            pmid: sentences[0].pmid,
            doi: sentences[0].doi,
            pmcid: sentences[0].pmcid,
            source: sentences[0].source,
            authors: sentences[0].author_list,
            journal: sentences[0].journal_name,
            publish_date: sentences[0].date,
            entities: entities,
            patterns: patterns,
            typeDict: typeDict,
            sentColors: sentColors,
            jumpTarget: jumpTarget,
            graphData: graphData,
            graphColors: graphColors,
            isLoading: false,
        });
    }

    scrollToAnchor = (anchorName) => {
        if (anchorName) {
            let anchorElement = document.getElementById(String(anchorName));
            if(anchorElement) { anchorElement.scrollIntoView({behavior: 'smooth'}); }
        }
    }

    clearSentColor = () => {
        const { sentColors, sentences } = this.state;
        sentences.forEach(sentence => {
            sentColors[sentence.sentId] = '';
        })
        this.setState({
            sentColors: sentColors,
        })
    }

    changeSentColor = (sentId) => {
        const { sentColors, sentences } = this.state;
        sentences.forEach(sentence => {
            if (sentence.sentId === sentId) {
                sentColors[sentence.sentId] = 'rgb(252, 242, 171)';
            } else {
                sentColors[sentence.sentId] = '';
            }
        })
        this.setState({
            sentColors: sentColors,
        })
    }

    render() {
        const { 
            title, 
            abstract, 
            authors, 
            journal, 
            pmid,
            pmcid,
            doi,
            source,
            publish_date,
            entities,
            patterns,
            typeDict,
            sentences,
            sentColors,
            jumpTarget,
            graphData,
            graphColors,
            isLoading 
        } = this.state;

        const { 
            changeSentColor,
            clearSentColor,
            scrollToAnchor
        } = this;

        console.log(pmcid)

        return (
            <div>
                <NavigationBar type="search"/>

                {isLoading? <Segment className="loading-screen">
                                <Loader active size='huge'>Setting Up Article</Loader>
                            </Segment> 
                            : 
                            <ArticleBody sentences={sentences} title={title}  abstract={abstract} authors={authors}
                                        date={publish_date} pmid={pmid} journal={journal} graphData={graphData} graphColors={graphColors}
                                        entities={entities} typeDict={typeDict} patterns={patterns} doi={doi} pmcid={pmcid}
                                        sentColors={sentColors} changeSentColor={changeSentColor} source={source}
                                        clearSentColor={clearSentColor} scrollToAnchor={scrollToAnchor} jumpTarget={jumpTarget} />}
            </div>
        )
    }
}

export default ArticleContainer;