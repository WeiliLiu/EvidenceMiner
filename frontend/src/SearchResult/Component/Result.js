import React from 'react';
import {Header, Label, Segment, Button, Icon, Message, ontainer, Divider, Popup, List, Transition} from "semantic-ui-react";
import {Link} from "react-router-dom";
import '../Style/Result.css';

export default class Result extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAllAuthors: false,
        };

        this.showAbstract = this.showAbstract.bind(this);
        this.showButtonContent = this.showButtonContent.bind(this);
        this.showAuthors = this.showAuthors.bind(this);
        this.showSentence = this.showSentence.bind(this);
        this.addAnchor = this.addAnchor.bind(this);
        this.decideScoreColor = this.decideScoreColor.bind(this);
        this.decideScoreSize = this.decideScoreSize.bind(this);
    }

    showAbstract() {
        if(this.props.abstract !== undefined) {
            if(this.props.abstract.length > 300) {
                if (this.state.truncated === false) {
                    return this.props.abstract.substring(0, 300) + '...';
                } else {
                    return this.props.abstract;
                }
            }else {
                if(this.props.abstract.length === 0) {
                    return <Message warning className={'result-error-message'}>
                        <Message.Header>We're sorry we can't find the abstract for this message</Message.Header>
                        <p>Try again later</p>
                    </Message>
                }
                return this.props.abstract;
            }
        }
    }

    showButtonContent() {
        if(this.state.truncated === false) {
            return 'Show more';
        } else {
            return 'Show less';
        }
    }

    showButtonIcon() {
        if(this.state.truncated === false) {
            return 'down arrow';
        } else {
            return 'up arrow';
        }
    }

    showButton() {
        if(this.props.abstract !== undefined) {
            if(this.props.abstract.length > 300) {
                return <Button compact content={this.showButtonContent()} icon={this.showButtonIcon()} labelPosition='right'
                        className={'read-more-button'}
                        onClick={() => this.setState({
                            truncated: !this.state.truncated,
                        })}/>
            }
        }
    }

    showAuthors() {
        var table = [];
        // for(let i = 0; i < Object.keys(this.props.authors).length; i++) {
        for(let i = 0; i < 1; i++) {
            table.push(<Label className={'author-label'} as='a'>
                {/*<Icon name='male' />*/}
                {this.props.authors[i]}
            </Label>)
        }
        return table;
    }

    showSentence() {
        // console.log(this.props.title)
        // console.log(this.props.entities)
        var entities = this.props.entities;
        var sentence = this.props.sentence;
        var start = 0;
        var end = 0;
        var table = [];
        for (let i = 0; i < entities.length; i++) {
            // console.log(i)
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
                        <div className={'author-names'}><a style={{ color: '#7e7e7e' }}>Source:</a> <a>{entities[i].source === '' ? 'Unknown':entities[i].source}</a></div>
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

    decideScoreColor = (ranking) => {
        // console.log(ranking)
        if(ranking === '0') {
            return 'red';
        }else if (ranking === '1') {
            return 'orange';
        }else if (ranking === '2') {
            return 'yellow';
        }else {
            return '';
        }
    }

    decideScoreSize = (ranking) => {
        if(ranking === '0') {
            return 'small';
        }else if (ranking === '1') {
            return 'tiny';
        }else {
            return 'mini';
        }
    }

    render() {
        return(
            <Segment basic className={'search-segment'}>
                <Link to={{
                    pathname: this.addAnchor(this.props.sentID, this.props.pmid),
                    state: {
                        sentence: this.props.sentID,
                        isTitle: this.props.isTitle,
                    }
                }} ><a className={'result-header'}>{this.showSentence()}</a></Link>
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
                        trigger={<Label as='a' size={this.decideScoreSize(this.props.ranking)} color={this.decideScoreColor(this.props.ranking)} image>
                        {/* <img src='https://react.semantic-ui.com/images/avatar/small/jenny.jpg' /> */}
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
                    <Label size="mini" className={'metadata-label'}>
                        <Icon name='linkify'/>PMID{this.props.pmid}
                    </Label>
                    <Label size="mini" className={'metadata-label'} image className={this.state.showAllAuthors? 'invisible-label' : ''}>
                        <Icon name='user' />{this.props.authors[0]}
                        <Label.Detail as='a' onClick={() => this.setState({showAllAuthors: !this.state.showAllAuthors})}><Icon name='angle double down' fitted/></Label.Detail>
                    </Label>
                </div>
                {this.props.isTitle? "":<small style={{ color: 'green' }}>Title: {this.props.title}</small>}
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

const style = {
    borderRadius: 0,
    fontSize: '0.8rem',
    opacity: 0.9,
    // padding: '2em',
  }