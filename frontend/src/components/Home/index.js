import React from 'react';

// import downloaded packages
import { Navbar, Nav } from 'react-bootstrap';
import { Search, Grid, Input, Dropdown, Button, Embed, Card, Icon, Image } from 'semantic-ui-react';
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
        }

        this.getSearchURL = this.getSearchURL.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    getSearchURL() {
        const { value } = this.state;
        const { archive } = this.state;
        return "/search/" + archive + '?kw=' + encodeURIComponent(value) + "&page=1"
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
        const { value } = this.state;

        return(
            <div className={'home-page-container'}>
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
                            </div>
                            <Button inverted size="large" href="https://arxiv.org/abs/2004.12563">Read Our Paper</Button>
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

                        {
                            QAs.map((QA, index) => {
                                return (
                                    <Grid.Row className="QA" key={index}>
                                        <Grid.Column tablet={16} computer={10} widescreen={8}>
                                            <div className="question">Q. {QA.q}</div>
                                            <div className="answer">A. Answer</div>
                                        </Grid.Column>
                                    </Grid.Row>
                                )
                            })
                        }
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
                                        <Grid.Column mobile={16} tablet={8} computer={4} widescreen={3} key={index}>
                                            <Card className="horizontal-center">
                                                <Image src={require(`../../assets/images/${teamMember.image}`)} wrapped ui={false} />
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
        "name": "Xuan Wang",
        "role": "Team Lead",
        "description": "Xuan is a phD student at the Department of CS in UIUC",
        "email": "xwang174@illinois.edu",
        "image": 'female.png'
    },
    {
        "name": "Yingjun Guan",
        "role": "Joined in 2019",
        "description": "Yingjun is a phD student at the School of IS in UIUC",
        "email": "yingjun2@illinois.edu",
        "image": "male.png"
    },
    {
        "name": "Aabhas Chauhan",
        "role": "Joined in 2020",
        "description": "Aabhas is a MS student at the Department of CS in UIUC",
        "email": "aabhasc2@illinois.edu",
        "image": "male.png"
    },
    {
        "name": "Weili Liu",
        "role": "Joined in 2019",
        "description": "Weili is a BS student at the Department of CS in UIUC",
        "email": "weilil2@illinois.edu",
        "image": "male.png"
    }
]

const QAs = [
    {
        "q": "Question",
        "a": "Answer",
    },
    {
        "q": "Question",
        "a": "Answer",
    },
    {
        "q": "Question",
        "a": "Answer",
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