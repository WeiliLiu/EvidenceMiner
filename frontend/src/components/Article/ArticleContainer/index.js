import React, {createRef} from 'react';

// import downloaded packages
import { Loader, Segment } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';

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
            secOrder: [],
            jumpTarget: '',
            graphData: [],
            graphColors: [],
            archive: '',
            isLoading: true,
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.changeSentColor = this.changeSentColor.bind(this);
        this.clearSentColor = this.clearSentColor.bind(this);
        this.scrollToAnchor = this.scrollToAnchor.bind(this);
    }

    async componentDidMount() {
        // Determine which archive this article belongs to
        const article_id = this.props.match.params.id;
        var archive = article_id > 29499? 'chd' : 'covid-19';

        // Get query from the url querystring
        const jumpTarget = new URLSearchParams(window.location.search).get('jt');

        // Get the total number of sentences in this article
        const docSentencesCount = await api.getDocSentencesCount(this.props.match.params.id, archive);

        // Get all the sentences for this article
        const docSentences = await api.getDocSentences(this.props.match.params.id, docSentencesCount, archive);

        // Get color and type hierarchy information
        const colors = utils.getColor(archive);

        // Process the returned results for display
        let paperData = utils.compilePaperData(docSentences);
        let entities = paperData[0];
        let sentences = paperData[1];
        let patterns = paperData[2];
        let sentColors = paperData[3];

        // Counting word frequencies for each entity
        var typeDict = utils.compileEntityFrequency(entities, archive);

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
            title: sentences[0].title === ""? 'No Title' : sentences[0].title,
            pmid: sentences[0].pmid,
            doi: sentences[0].doi,
            pmcid: sentences[0].pmcid,
            source: sentences[0].source,
            authors: sentences[0].author_list,
            journal: sentences[0].journal_name,
            publish_date: sentences[0].date,
            secOrder: sentences[0].sec_order,
            entities: entities,
            patterns: patterns,
            typeDict: typeDict,
            sentColors: sentColors,
            jumpTarget: jumpTarget,
            graphData: graphData,
            graphColors: graphColors,
            archive: archive,
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
            archive,
            secOrder,
            isLoading 
        } = this.state;

        const { 
            changeSentColor,
            clearSentColor,
            scrollToAnchor
        } = this;

        return (
            <div>
                <Helmet>
                    <title>EvidenceMiner Articles - { title }</title>
                </Helmet>

                <NavigationBar type={this.props.match.params.id > 29499? 'chd' : 'covid-19'}/>

                {isLoading? <Segment className="loading-screen">
                                <Loader active size='huge'>Setting Up Article</Loader>
                            </Segment> 
                            : 
                            <ArticleBody sentences={sentences} authors={authors} date={String(publish_date)} pmid={pmid} journal={journal} 
                                        graphData={graphData} graphColors={graphColors} entities={entities} typeDict={typeDict} 
                                        patterns={patterns} doi={doi} pmcid={pmcid} secOrder={secOrder}
                                        sentColors={sentColors} changeSentColor={changeSentColor} source={source} archive={archive}
                                        clearSentColor={clearSentColor} scrollToAnchor={scrollToAnchor} jumpTarget={jumpTarget} />}
            </div>
        )
    }
}

export default ArticleContainer;