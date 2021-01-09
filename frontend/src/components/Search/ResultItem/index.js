// import react
import React from 'react';

// import packages
import {Header, Label, Segment, Icon, Message, Popup, List, Transition} from "semantic-ui-react";
import PropTypes from 'prop-types';

// import util functions
import utils from '../../../utils';

// import css style
import './styles.css';

class ResultItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAllAuthors: false,
            isMobile: false,
        };

        this.showAuthors = this.showAuthors.bind(this);
        this.showSentence = this.showSentence.bind(this);
        this.decideScoreColor = this.decideScoreColor.bind(this);
        this.decideScoreSize = this.decideScoreSize.bind(this);
    }

    componentDidMount() {
        // Set up screen size listener
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    resize = () => {
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
        const { entities, sentence, archive } = this.props;
        const colors = utils.getColor(archive);
        const typeHierarchy = utils.getTypeHierarchy(archive);
        var start = 0;
        var end = 0;
        var table = [];

        entities.forEach((entity, index) => {
            end = entity.start;
            table.push(sentence.substring(start, end))
            table.push(
                <Popup key={index} className="result-popup"
                    inverted mouseEnterDelay={300} mouseLeaveDelay={300}
                    trigger={<strong style={{ color: colors[typeHierarchy[entity.type]] }}>
                                {sentence.substring(entity.start, entity.end)}
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

        end = sentence.length;
        table.push(sentence.substring(start, end));
        return table;
    }

    decideScoreColor = (ranking, page) => {
        if(ranking === 0 && page === 1) {
            return 'red';
        }else if (ranking === 1 && page === 1) {
            return 'orange';
        }else if (ranking === 2 && page === 1) {
            return 'yellow';
        }
    }

    decideScoreSize = (ranking, page) => {
        if(ranking === 0 && page === 1) {
            return 'small';
        }else if (ranking === 1 && page === 1) {
            return 'tiny';
        }else {
            return 'mini';
        }
    }

    render() {
        const { prevSentence, nextSentence, documentId, sentID, sentence, ranking, page, score, date, journal, pmid, authors, isTitle, title, pmcid, source, doi } = this.props;
        const { isMobile, showAllAuthors } = this.state;

        return(
            <Segment basic={!isMobile} raised={isMobile} className='search-segment'>
                <a className='result-header' href={`/articles/${documentId}?jt=${sentID}&archive=${this.props.archive}`} >{this.showSentence()}</a>
                <span className="popup-container">
                    <Popup className="result-popup" inverted mouseEnterDelay={300} mouseLeaveDelay={300}
                            trigger={isTitle === 1? 
                            <Label as='a' basic size='mini' color='green' className="context-label">Title</Label>
                            :
                            <Label as='a' basic size='mini' color='blue' className="context-label">Context</Label>}>
                        {isTitle === 1? 
                            'This is the title' 
                            : 
                            <p>
                                {prevSentence} 
                                <i><u>{sentence}</u></i> 
                                {nextSentence}
                            </p>}
                    </Popup>
                </span>
                <div className={'metadata-section'} style={{ marginTop: '1rem' }}>
                    <Popup content='Evidence score indicates the confidence of the retrieved sentence being a supporting evidence of the input query.' 
                        className="result-popup" inverted mouseEnterDelay={300} mouseLeaveDelay={300}
                        trigger={<Label as='a' size={this.decideScoreSize(ranking, page)} color={this.decideScoreColor(ranking, page)} image>
                        <Icon name='check'/>
                        Evidence Score
                        <Label.Detail>{score.toFixed(2)}</Label.Detail>
                        </Label>} />
                    <Label size="mini" className={'metadata-label'} hidden={date === '0'}>
                        <Icon name='calendar'/>{date}
                    </Label>
                    <Label size="mini" className={'metadata-label'} hidden={journal === 'No journal info'}>
                        <Icon name='book' />{journal}
                    </Label>
                    <Label size="mini" className={'metadata-label'} hidden={source === ""}>
                        <Icon name='linkify'/>Source: {source}
                    </Label>
                    <Label size="mini" className={'metadata-label'} hidden={pmid === ""}>
                        <Icon name='linkify'/>PMID: {pmid}
                    </Label>
                    <Label size="mini" className={'metadata-label'} hidden={pmcid === ""}>
                        <Icon name='linkify'/>PMCID: {pmcid}
                    </Label>
                    <Label size="mini" className={'metadata-label'} hidden={doi === ""}>
                        <Icon name='linkify'/>DOI: {doi}
                    </Label>
                    <Label size="mini" image className={showAllAuthors? 'invisible-label' : ''} hidden={authors.length === 0}>
                        <Icon name='user' />{authors[0]}
                        <Label.Detail as='a' onClick={() => this.setState({showAllAuthors: !showAllAuthors})}><Icon name='angle double down' fitted/></Label.Detail>
                    </Label>
                </div>
                <div className="small-title">{isTitle === 1? "":<small>Title: {title === ''? 'No Title' : title}</small>}</div>
                <Transition visible={showAllAuthors} animation='scale' duration={500}>
                    <Message className={'author-section'}  onDismiss={() => this.setState({showAllAuthors: !showAllAuthors})}>
                        <Message.Content>
                            <Header as='h6'>Authors</Header>
                            <List horizontal divided size="tiny">
                                {authors.map(author => 
                                <List.Item key={author}>
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

ResultItem.propTypes = {
    prevSentence: PropTypes.string, 
    nextSentence: PropTypes.string, 
    documentId: PropTypes.number, 
    sentID: PropTypes.string, 
    sentence: PropTypes.string, 
    ranking: PropTypes.number, 
    page: PropTypes.number, 
    score: PropTypes.number, 
    date: PropTypes.string, 
    journal: PropTypes.string, 
    pmid: PropTypes.string, 
    authors: PropTypes.array, 
    isTitle: PropTypes.number, 
    title: PropTypes.string
}

export default ResultItem;