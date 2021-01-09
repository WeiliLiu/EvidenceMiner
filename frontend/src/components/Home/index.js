import React from 'react';

// import downloaded packages
import { Navbar, Nav } from 'react-bootstrap';
import { Search, Grid, Input, Dropdown, Button, Embed, Card, Icon, Image, Accordion } from 'semantic-ui-react';
import FindInPageSharpIcon from '@material-ui/icons/FindInPageSharp';
import ColorizeSharpIcon from '@material-ui/icons/ColorizeSharp';
import AssessmentSharpIcon from '@material-ui/icons/AssessmentSharp';

// import components
import Footer from '../Footer';

// import css
import './styles.css';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchBarFocused: false,
            value: '',
            archive: 'covid-19',
            activeIndex: 0,
        }

        this.getSearchURL = this.getSearchURL.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ activeIndex: newIndex })
    }

    getSearchURL() {
        const { value } = this.state;
        const { archive } = this.state;
        return "/search/" + archive + '?kw=' + encodeURIComponent(value) + "&ipp=true&page=1"
    }

    handleKeyPress = (target) => {
        if(target.charCode === 13){
            target.preventDefault();
            if(this.state.searchBarFocused && this.state.value !== '') {
                window.location.href = this.getSearchURL();
            }
        }
    }

    handleTextChange = (e) => {
        this.setState({
            searchValue: e.target.value
        })
    };

    handleSearchChange = (e, { value }) => {
        this.setState({ value })
    }

    render() {
        const { value, activeIndex } = this.state;

        return(
            <div className={'home-page-container'}>
                <div className="notice">
                    <strong>Notice: </strong>
                    The current corpus contains all publications until 3/13/2020 from the&nbsp;
                    <a href="https://www.kaggle.com/allen-institute-for-ai/CORD-19-research-challenge">CORD-19 dataset</a>. 
                    We will constantly update the backend corpus of EvidenceMiner based on the updates of the CORD-19 corpus.
                </div>
                <Navbar bg="light" expand="lg" className={'home-page-navbar'}>
                    <Navbar.Brand href="/" className="navbar-title" >EvidenceMiner</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div className="search-section">
                    <div className="search-overlay">
                        <div className="overlay-content">
                            <h3>Welcome to EvidenceMiner</h3>
                            <h1>Automatic Textual Evidence Mining in COVID-19 Literature</h1>
                            <div className="home-empty-div" />
                            <Search
                                input={<Input className="overlay-input" iconPosition='left' placeholder={'Search by keywords, entities, meta patterns...'}/>}
                                onSearchChange={this.handleSearchChange}
                                value={value}
                                open={false}
                                onKeyPress={this.handleKeyPress}
                                onFocus={() => {this.setState({searchBarFocused: true})}}
                                onBlur={() => {this.setState({searchBarFocused: false})}}
                            />
                            <div className="overlay-dropdown">
                                Search through archive{' '}
                                <Dropdown upward={false} floating inline options={options} onChange={(e, data) => this.setState({archive: data.value})} defaultValue='covid-19' />{' '}
                            </div >
                            <div className="overlay-dropdown">
                                Try:&nbsp;&nbsp;
                                <a href="/search/covid-19?kw=UV%2C%20Ultraviolet%2C%20kill%2C%20SARS-COV-2&ipp=true&page=1">UV, Ultraviolet, kill, SARS-COV-2</a>
                                &nbsp;&nbsp;|&nbsp;&nbsp;
                                <a href="/search/covid-19?kw=COVID-19%2C%20Remdesivir&ipp=true&page=1">COVID-19, Remdesivir</a>
                                &nbsp;&nbsp;|<br />
                                <a href="/search/covid-19?kw=SARS-COV-2%2C%20Amodiaquine&ipp=true&page=1">SARS-COV-2, Amodiaquine</a>
                                &nbsp;&nbsp;|&nbsp;&nbsp;
                                <a href="/search/covid-19?kw=COVID-19%2C%20masks&ipp=true&page=1">COVID-19, masks</a>
                                &nbsp;&nbsp;|<br />
                                <a href="/search/covid-19?kw=CORONAVIRUS%20cause%20DISEASEORSYNDROME&ipp=true&page=1">CORONAVIRUS cause DISEASEORSYNDROME</a>
                            </div>
                            <Button inverted size="large" href="https://arxiv.org/abs/2004.12563" className="paper-button">Read Our Paper</Button>
                        </div>
                    </div>
                </div>
                <div id="learn-more">
                    <Grid className="learn-more-grid" textAlign="center">
                        <Grid.Row className="no-padding-margin">
                            <Grid.Column mobile={16} tablet={8} computer={4} widescreen={3} textAlign="left" className="grid-column">
                                <FindInPageSharpIcon className="intro-icons"/>
                                <h1>Query</h1>
                                <p>EvidenceMiner lets users query a natural language statement 
                                    and automatically retrieves textual evidence from a background corpora for life sciences.</p>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={8} computer={4} widescreen={3} textAlign="left" className="grid-column">
                                <ColorizeSharpIcon className="intro-icons"/>
                                <h1>Annotate</h1>
                                <p> The named entities and meta-patterns in EvidenceMiner are pre-computed and indexed offline to 
                                    support fast online evidence retrieval. The annotation results are also highlighted in the 
                                    original document for better visualization.</p>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={8} computer={4} widescreen={3} textAlign="left" className="grid-column">
                                <AssessmentSharpIcon className="intro-icons" />
                                <h1>Analyze</h1>
                                <p>EvidenceMiner includes analytic functionalities such as the most frequent entity and relation summarization.</p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <div className="tutorial-section">
                    <Grid className="no-padding-margin" textAlign="center">
                        <Grid.Row className="no-padding-margin">
                            <Grid.Column tablet={16} computer={5} widescreen={4} textAlign="left" className="grid-column">
                                <h1>Not sure how to use Evidenceminer?</h1>
                                <p>Don't worry, we've prepared a tutorial to get you started!</p>
                            </Grid.Column>
                            <Grid.Column tablet={16} computer={5} widescreen={4} textAlign="left" className="grid-column">
                                <Embed
                                    id='iYuQ6gsr--I'
                                    defaultActive={true}
                                    iframe={{
                                        allowFullScreen: true,
                                    }}
                                    source='youtube'
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <div className="FAQ-section">
                    <Grid className="no-padding-margin" textAlign="center">
                        <Grid.Row className="FAQ-section-row">
                            <Grid.Column tablet={16} computer={10} widescreen={8} className="section-header">
                                <h1>Frequently Asked Questions (FAQ)</h1>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row className="QA">
                            <Grid.Column tablet={16} computer={10} widescreen={8}>
                                <Accordion className="QA-accordian">
                                    <Accordion.Title className="question"
                                        active={activeIndex === 0}
                                        index={0}
                                        onClick={this.handleClick}
                                        >
                                        <Icon name='dropdown' />
                                        What is the source of the backend corpus of EvidenceMiner?
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 0} className="answer">
                                        <p>
                                            The backend corpus is CORD-19, the&nbsp;
                                            <a href="https://www.kaggle.com/allen-institute-for-ai/CORD-19-research-challenge">COVID-19 Open Research Dataset</a>. 
                                            CORD-19 is created by  researchers from the Allen Institute for AI, Chan Zuckerberg Initiative (CZI), 
                                            Georgetown University’s Center for Security and Emerging Technology (CSET), Microsoft, and the 
                                            National Library of Medicine (NLM) at NIH (the National Institutes of Health). CORD-19 contains 
                                            publications about COVID-19 and the coronavirus family of viruses from various sources including 
                                            PubMed’s PMC open access corpus, bioRxiv and medRxiv pre-prints and a corpus maintained by the WHO.
                                        </p>
                                    </Accordion.Content>
                                    <Accordion.Title className="question"
                                        active={activeIndex === 1}
                                        index={1}
                                        onClick={this.handleClick}
                                        >
                                        <Icon name='dropdown' />
                                        How are the fine-grained entity types annotated?
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 1} className="answer">
                                        <p>
                                            EvidenceMiner uses the 75 fine-grained entity types automatically 
                                            annotated by <a href="https://arxiv.org/abs/2003.12218">CORD-NER</a>. CORD-NER covers many new entity 
                                            types specifically related to the COVID-19 studies (e.g., coronaviruses, viral proteins, 
                                            evolution, materials, substrates and immune responses), which may benefit research on COVID-19 
                                            related virus, spreading mechanisms, and potential vaccines. CORD-NER relies on distantly- 
                                            and weakly-supervised NER methods, with no need of expensive human annotation on any articles 
                                            or subcorpus. Its entity annotation quality surpasses SciSpacy (over 10% higher on the F1 score 
                                            based on a sample set of documents), a fully supervised BioNER tool. More details of CORD-NER 
                                            can be found in the <a href="https://arxiv.org/abs/2003.12218">arXiv paper</a>.
                                        </p>
                                    </Accordion.Content>
                                    <Accordion.Title className="question"
                                        active={activeIndex === 2}
                                        index={2}
                                        onClick={this.handleClick}
                                        >
                                        <Icon name='dropdown' />
                                        How is the evidence score calculated?
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 2} className="answer">
                                        <p>
                                            The evidence score ranks the retrieved sentences by a confidence score of each being
                                            textual evidence for the input query. The confidence score is a weighted combination of three scores: 
                                            a word score, an entity score and a pattern score. The three scores are calculated following three 
                                            criteria: (1) word score: candidate evidence sentences covering more query-related words will be ranked 
                                            higher, (2) entity score: candidate evidence sentences covering more query-related entities will be ranked 
                                            higher, and (3) pattern score: candidate evidence sentences covering more query-matched meta-patterns will 
                                            be ranked higher. More details of EvidenceMiner can be found in the <a href="https://arxiv.org/abs/2004.12563"> arXiv paper</a>.
                                        </p>
                                    </Accordion.Content>
                                </Accordion>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <div className="team-member-section">
                    <Grid className="no-padding-margin" textAlign="center">
                        <Grid.Row className="team-member-section-header">
                            <Grid.Column tablet={16} computer={8} className="section-header">
                                <h1>Meet the team behind EvidenceMiner</h1>
                                <p>We are a group of passionate students from Professor Jiawei Han's Data Mining Group at
                                     the University of Illinois at Urbana-Champaign</p>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="team-member-section-header">
                            {
                                teamMembers.map((teamMember, index) => {
                                    return(
                                        <Grid.Column mobile={16} tablet={8} computer={4} widescreen={3} key={index} style={{ marginTop: '3rem' }}>
                                            <Card className="horizontal-center">
                                                <Image src={require(`../../assets/images/${teamMember.image}`)} wrapped ui={false} style={{ overflow: 'hidden', maxHeight: '300px' }}/>
                                                <Card.Content>
                                                <Card.Header>{teamMember.name}</Card.Header>
                                                <Card.Meta>
                                                    <span className='date'>{teamMember.role}</span>
                                                </Card.Meta>
                                                <Card.Description>
                                                    {teamMember.description}
                                                </Card.Description>
                                                </Card.Content>
                                                <Card.Content extra>
                                                <span>
                                                    <Icon name='mail' />
                                                    {teamMember.email}
                                                </span>
                                                </Card.Content>
                                            </Card>
                                        </Grid.Column>
                                    )
                                })
                            }
                        </Grid.Row>
                        <Grid.Row className="no-padding-margin">
                            <Grid.Column tablet={16} computer={8} className="section-header">
                                <h3>Please contact us if you have any questions or suggestions for this system.</h3>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <Footer style={footerStyle} linkStyle={linkStyle}/>
            </div>
        )
    }
}

const teamMembers = [
    {
        "name": "Jiawei Han",
        "role": "Advisor",
        "description": "Michael Aiken Chair Professor at UIUC",
        "email": "hanj@illinois.edu",
        "image": 'hanj_tour.jpg'
    },
    {
        "name": "Xuan Wang",
        "role": "Team Lead",
        "description": "Xuan is a phD student at the Department of CS in UIUC",
        "email": "xwang174@illinois.edu",
        "image": 'xuan.jpeg'
    },
    {
        "name": "Yingjun Guan",
        "role": "Joined in 2019",
        "description": "Yingjun is a phD student at the School of IS in UIUC",
        "email": "yingjun2@illinois.edu",
        "image": "Yingjun.jpg"
    },
    {
        "name": "Aabhas Chauhan",
        "role": "Joined in 2020",
        "description": "Aabhas is a MS student at the Department of CS in UIUC",
        "email": "aabhasc2@illinois.edu",
        "image": "aabhas.jpeg"
    },
    {
        "name": "Weili Liu",
        "role": "Joined in 2019",
        "description": "Weili is a BS student at the Department of CS in UIUC",
        "email": "weilil2@illinois.edu",
        "image": "Weili.jpg"
    },
    {
        "name": "Ruisong Li",
        "role": "Joined in 2020",
        "description": "Ruisong is a BS student at the Department of CS in UIUC",
        "email": "ruisong4@illinois.edu",
        "image": "ruisong.jpg"
    },
    {
        "name": "Xiangchen Song",
        "role": "Joined in 2019",
        "description": "Xiangchen is a BS student at the Department of CS in UIUC",
        "email": "xs22@illinois.edu",
        "image": "xiangchen.jpg"
    },
    {
        "name": "Bangzheng Li",
        "role": "Joined in 2019",
        "description": "Bangzheng is a BS student at the Department of CS in UIUC",
        "email": "bl17@illinois.edu",
        "image": "BangzhengLi.JPG"
    },
    {
        "name": "Vivian Hu",
        "role": "Joined in 2020",
        "description": "Vivian is a MS student at the Department of CS in UIUC",
        "email": "vivianh2@illinois.edu",
        "image": "vivian.jpg"
    }
]

const footerStyle = {
    backgroundColor: 'rgb(44, 42, 45)',
    textAlign: "center",
    padding: '3rem 5rem',
    borderTop: 'solid 1px white',
    color: 'white'
}

const linkStyle = {
    color: 'white'
}

export default Home;

const options = [
    { key: 'covid-19', text: 'covid-19', value: 'covid-19' },
    { key: 'chd', text: 'cancer & heart disease', value: 'chd' },
]