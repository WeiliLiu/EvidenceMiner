import React from 'react';

// import downloaded packges
import { Popup, List, Icon, Grid, Menu } from "semantic-ui-react";
import { Animated } from "react-animated-css";
import PropTypes from 'prop-types';

// import components
import PatternTable from '../../PatternTable';
import Footer from '../../Footer';
import TypeList from '../../TypeList/ListContainer';

// import util functions
import utils from '../../../utils';

// import css
import './styles.css';

class ArticleBody extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sentColors: [],
        };

        this.showAuthors = this.showAuthors.bind(this);
        this.highlightText = this.highlightText.bind(this);
        this.scrollToLocation = this.scrollToLocation.bind(this);
        this.showSentence = this.showSentence.bind(this);
    }

    componentDidMount() {
        this.scrollToLocation();
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

    showAuthors = () => {
        var table = [];
        for(let i = 0; i < Object.keys(this.props.authors).length; i++) {
            table.push(this.props.authors[i])
            table.push('; ')
        }
        return table;
    }

    showSentence = (entities, sentence) => {
        const { archive } = this.props;
        const colors = utils.getColor(archive);
        const typeHierarchy = utils.getTypeHierarchy(archive);
        const content = sentence.sentence;
        var start = 0;
        var end = 0;
        var table = [];

        entities.forEach((entity, index) => {
            end = entity.start;
            table.push(content.substring(start, end))
            table.push(
                <Popup key={index} className="result-popup"
                    inverted mouseEnterDelay={300} mouseLeaveDelay={300}
                    trigger={<strong style={{ color: colors[typeHierarchy[entity.type]] }}>
                                {content.substring(entity.start, entity.end)}
                            </strong>}
                >
                    <List>
                        <div><span className="popup-header">Type:</span> <span>{typeHierarchy[entity.type]} - {entity.type}</span></div>
                        <div><span className="popup-header">Source:</span> <span>{entity.source === '' || !entity.source? 'Unknown' : entity.source}</span></div>
                    </List>
                </Popup>
            );
            start = entity.end
        })

        end = content.length;
        table.push(content.substring(start, end));
        return table;
    }

    highlightText = (isTitle, secName) => {
        const { sentences, jumpTarget } = this.props;

        if (sentences[0] !== undefined) {
            var table = [];

            var currSentences = sentences.filter(function(x) {
                return x.isTitle === isTitle;
            })

            if (currSentences.length === 0) {
                return "No text for this section."
            }

            currSentences.forEach((sentence, index) => {
                if (jumpTarget === String(secName + index)) {
                    table.push(
                        <Animated key={secName + index} className="animated-sentence" animationIn="rubberBand" animationInDelay={300}>
                            <span id={secName + index} style={{ paddingTop: "50vh", marginTop: "-50vh" }} />
                            <Icon name="search" />
                            <span style={{ backgroundColor: this.props.sentColors[secName + index] }}>{this.showSentence(sentence.entities, sentence)}</span>
                        </Animated>
                    );
                } else {
                    table.push(<span key={secName + index} style={{ paddingTop: "50vh", marginTop: "-50vh" }} id={secName + index}></span>);
                    table.push(<span key={secName + index + secName + index} style={{ backgroundColor: this.props.sentColors[secName + index] }}>{this.showSentence(sentence.entities, sentence)}</span>);
                }
                table.push(' ');
            });
                
            return table;
        }
    }

    render() {
        const {
            journal, 
            date, 
            pmid, 
            pmcid,
            doi,
            source,
            typeDict,
            patterns,
            changeSentColor,
            scrollToAnchor,
            graphData,
            graphColors,
            archive,
            secOrder
        } = this.props;

        return(
            <div className="article-body-outer-container">
                <Grid className="article-container">
                    <Grid.Row className="article-container-row">
                        <Grid.Column only='computer' computer={1}/>
                        <Grid.Column mobile={16} tablet={16} computer={14} widescreen={10} className="article-container-column">
                            <h1 className="title-text">{this.highlightText(1, 'title')}</h1>
                            <div className={'author-names'}>{this.showAuthors()}</div>
                            <div className='meta-info'>
                                {journal? <span><strong>Journal: </strong><i>{journal}</i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> : ""}
                                <strong>Published: </strong>{date}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {pmid? <span><strong>PMID: </strong><a href={`https://www.ncbi.nlm.nih.gov/pubmed/?term=${pmid}`}>{pmid}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></span> : ""}
                                {pmcid? <span><strong>PMCID: </strong>{pmcid}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> : ""}
                                {source? <span><strong>Source: </strong>{source}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> : ""}
                                {doi !== ''? <span><strong>DOI: </strong>{doi}</span> : ""}
                            </div>
                        </Grid.Column>
                        <Grid.Column computer={1} widescreen={5}/>
                    </Grid.Row>
                    <Grid.Row style={{ padding: '0', margin: '0' }}>
                        <Grid.Column only='computer' computer={1}/>
                        <Grid.Column mobile={16} tablet={16} computer={10} widescreen={7} className="article-content-column">
                            <div className="abstract-container">
                                <h4>Abstract</h4>
                                {this.highlightText(0, 'abstract')}
                            </div>
                            {
                                secOrder? 
                                secOrder.map((sec, index) => {
                                    return (
                                        <div key={index} className="body-container">
                                            <h4>{sec}</h4>
                                            {this.highlightText(index + 2, sec)}
                                        </div>
                                    )
                                })
                                :
                                <div className="body-container">
                                    {this.highlightText(2, 'body')}
                                </div>
                            }
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={16} computer={4} widescreen={3} style={{ margin: '0', padding: '0' }}>
                            <div className="word-segment-container">
                                <TypeList typeDict={typeDict} graphData={graphData} graphColors={graphColors} archive={archive}/>
                                <div className="empty-div" hidden={typeDict === {}}/>
                                <Menu.Item className="pattern-segment">
                                    <PatternTable patterns={patterns} changeSentColor={changeSentColor}
                                        scrollToAnchor={scrollToAnchor} />
                                </Menu.Item>
                            </div>
                        </Grid.Column>
                        <Grid.Column computer={1} widescreen={5}/>
                    </Grid.Row>
                </Grid>
                <Grid className="article-footer-container">
                    <hr style={{ padding: '0', margin: '0', width: '100%' }}/>
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

ArticleBody.propTypes = {
    journal: PropTypes.string, 
    date: PropTypes.string, 
    pmid: PropTypes.string, 
    typeDict: PropTypes.object,
    patterns: PropTypes.array,
    changeSentColor: PropTypes.func,
    scrollToAnchor: PropTypes.func,
    graphData: PropTypes.array,
    graphColors: PropTypes.array
}

export default ArticleBody;