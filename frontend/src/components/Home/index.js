import React from 'react';

// import downloaded packages
import { Navbar, Nav } from 'react-bootstrap';
import { Search, Grid, Input, Dropdown, Button, Embed, Card, Icon, Image } from 'semantic-ui-react';
import FindInPageSharpIcon from '@material-ui/icons/FindInPageSharp';
import ColorizeSharpIcon from '@material-ui/icons/ColorizeSharp';
import AssessmentSharpIcon from '@material-ui/icons/AssessmentSharp';

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
                            <h3 style={{ margin: '0', padding: '0', lineHeight: '1.5rem', fontSize: '1.7rem' }}>Welcome to EvidenceMiner</h3>
                            <h1>Automatic Textual Evidence Mining in COVID-19 Literature</h1>
                            <div style={{ height: '1rem' }} />
                            <Search
                                input={<Input className="overlay-input" iconPosition='left' placeholder={'Search by keywords, entities, meta patterns...'}/>}
                                onSearchChange={this.handleSearchChange}
                                value={value}
                                open={false}
                                onKeyPress={this.handleKeyPress}
                                onFocus={() => {this.setState({searchBarFocused: true})}}
                                onBlur={() => {this.setState({searchBarFocused: false})}}
                            />
                            <div style={{ padding: '1rem 0 2rem 0' }}>
                                Search through archive{' '}
                                <Dropdown upward={false} floating inline options={options} onChange={(e, data) => this.setState({archive: data.value})} defaultValue='covid-19' />{' '}
                            </div>
                            <Button inverted size="large" href="https://arxiv.org/abs/2004.12563">Read Our Paper</Button>
                        </div>
                    </div>
                </div>
                <div id="learn-more">
                    <Grid style={{ padding: '4rem 0', margin: '0' }} textAlign="center">
                        <Grid.Row style={{ padding: '0', margin: '0'}}>
                            <Grid.Column tablet={16} computer={4} widescreen={3} textAlign="left" style={{ padding: '3rem 2rem' }}>
                                <FindInPageSharpIcon className="intro-icons"/>
                                <h1>Query</h1>
                                <p>EvidenceMiner lets users query a natural language statement 
                                    and automatically retrieves textual evidence from a background corpora for life sciences.</p>
                            </Grid.Column>
                            <Grid.Column tablet={16} computer={4} widescreen={3} textAlign="left" style={{ padding: '3rem 2rem' }}>
                                <ColorizeSharpIcon className="intro-icons"/>
                                <h1>Annotate</h1>
                                <p> The named entities and meta-patterns in EvidenceMiner are pre-computed and indexed offline to 
                                    support fast online evidence retrieval. The annotation results are also highlighted in the 
                                    original document for better visualization.</p>
                            </Grid.Column>
                            <Grid.Column tablet={16} computer={4} widescreen={3} textAlign="left" style={{ padding: '3rem 2rem' }}>
                                <AssessmentSharpIcon className="intro-icons" />
                                <h1>Analyze</h1>
                                <p>EvidenceMiner includes analytic functionalities such as the most frequent entity and relation summarization.</p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <div style={{ backgroundColor: 'rgb(247, 247, 247)', padding: '5rem 0' }}>
                    <Grid style={{ padding: '0', margin: '0' }} textAlign="center">
                        <Grid.Row style={{ padding: '0', margin: '0'}}>
                            <Grid.Column tablet={16} computer={5} widescreen={4} textAlign="left" style={{ padding: '3rem 2rem' }}>
                                <h1>Not sure how to use Evidenceminer?</h1>
                                <p>Don't worry, we've prepared a tutorial to get you started!</p>
                            </Grid.Column>
                            <Grid.Column tablet={16} computer={5} widescreen={4} textAlign="left" style={{ padding: '3rem 2rem' }}>
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
                <div style={{ textAlign: 'center', padding: '3rem 0 8rem 0' }}>
                    <Grid style={{ padding: '0', margin: '0' }} textAlign="center">
                        <Grid.Row style={{ padding: '1rem 0', margin: '0'}}>
                            <Grid.Column tablet={16} computer={10} widescreen={8} style={{ padding: '0 0 2rem 0' }}>
                                <h1>Frequently Asked Questions (FAQ)</h1>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={{ padding: '0', margin: '0'}}>
                            <Grid.Column tablet={16} computer={10} widescreen={8}>
                                <div style={{borderLeft: 'solid 3px black', padding: '1rem 2rem', textAlign: 'left', backgroundColor: 'rgb(247, 247, 247)'}}>Q. Question</div>
                                <div style={{borderLeft: 'solid 3px rgb(230, 230, 230)', padding: '1rem 2rem', textAlign: 'left', backgroundColor: 'rgb(255, 255, 255)'}}>A. Answer</div>
                            </Grid.Column>
                        </Grid.Row>
                        <div style={{ height: '2rem' }}/>
                        <Grid.Row style={{ padding: '0', margin: '0'}}>
                            <Grid.Column tablet={16} computer={10} widescreen={8}>
                                <div style={{borderLeft: 'solid 3px black', padding: '1rem 2rem', textAlign: 'left', backgroundColor: 'rgb(247, 247, 247)'}}>Q. Question</div>
                                <div style={{borderLeft: 'solid 3px rgb(230, 230, 230)', padding: '1rem 2rem', textAlign: 'left', backgroundColor: 'rgb(255, 255, 255)'}}>A. Answer</div>
                            </Grid.Column>
                        </Grid.Row>
                        <div style={{ height: '2rem' }}/>
                        <Grid.Row style={{ padding: '0', margin: '0'}}>
                            <Grid.Column tablet={16} computer={10} widescreen={8}>
                                <div style={{borderLeft: 'solid 3px black', padding: '1rem 2rem', textAlign: 'left', backgroundColor: 'rgb(247, 247, 247)'}}>Q. Question</div>
                                <div style={{borderLeft: 'solid 3px rgb(230, 230, 230)', padding: '1rem 2rem', textAlign: 'left', backgroundColor: 'rgb(255, 255, 255)'}}>A. Answer</div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <div style={{ backgroundColor: 'rgb(44, 42, 45)', padding: '5rem 0', color: 'white' }}>
                    <Grid style={{ padding: '0', margin: '0' }} textAlign="center">
                        <Grid.Row style={{ padding: '0 0 3rem 0', margin: '0'}}>
                            <Grid.Column tablet={16} computer={8} style={{ padding: '0 0 2rem 0' }}>
                                <h1>Meet the team behind EvidenceMiner</h1>
                                <p>We are a group of passionate students from Professor Jiawei Han's Data Mining Group at
                                     the University of Illinois at Urbana-Champaign</p>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={{ padding: '0 0 3rem 0', margin: '0'}}>
                            <Grid.Column tablet={16} computer={4} widescreen={3}>
                                <Card style={{ margin: '0 auto' }}>
                                    <Image src={require('../../assets/images/female.png')} wrapped ui={false} />
                                    <Card.Content>
                                    <Card.Header>Xuan Wang</Card.Header>
                                    <Card.Meta>
                                        <span className='date'>Team Lead</span>
                                    </Card.Meta>
                                    <Card.Description>
                                        Xuan is a phD student at the Department of CS in UIUC
                                    </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                    <span>
                                        <Icon name='mail' />
                                        xwang174@illinois.edu
                                    </span>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                            <Grid.Column tablet={16} computer={4} widescreen={3}>
                                <Card style={{ margin: '0 auto' }}>
                                    <Image src={require('../../assets/images/male.png')} wrapped ui={false} />
                                    <Card.Content>
                                    <Card.Header>Yingjun Guan</Card.Header>
                                    <Card.Meta>
                                        <span className='date'>Joined in 2019</span>
                                    </Card.Meta>
                                    <Card.Description>
                                        Yingjun is a phD student at the School of IS in UIUC
                                    </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                    <span>
                                        <Icon name='mail' />
                                        yingjun2@illinois.edu
                                    </span>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                            <Grid.Column tablet={16} computer={4} widescreen={3}>
                                <Card style={{ margin: '0 auto' }}>
                                    <Image src={require('../../assets/images/male.png')} wrapped ui={false} />
                                    <Card.Content>
                                    <Card.Header>Aabhas Chauhan</Card.Header>
                                    <Card.Meta>
                                        <span className='date'>Joined in 2020</span>
                                    </Card.Meta>
                                    <Card.Description>
                                        Aabhas is a MS student at the Department of CS in UIUC
                                    </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                    <span>
                                        <Icon name='mail' />
                                        aabhasc2@illinois.edu
                                    </span>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                            <Grid.Column tablet={16} computer={4} widescreen={3}>
                                <Card style={{ margin: '0 auto' }}>
                                    <Image src={require('../../assets/images/male.png')} wrapped ui={false} />
                                    <Card.Content>
                                    <Card.Header>Weili Liu</Card.Header>
                                    <Card.Meta>
                                        <span className='date'>Joined in 2019</span>
                                    </Card.Meta>
                                    <Card.Description>
                                        Weili is a BS student at the Department of CS in UIUC
                                    </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                    <span>
                                        <Icon name='mail' />
                                        weilil2@illinois.edu
                                    </span>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={{ padding: '0', margin: '0'}}>
                            <Grid.Column tablet={16} computer={8} style={{ padding: '0 0 2rem 0' }}>
                                <h3>Please contact us if you have any questions or suggestions for this system.</h3>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <div className="home-footer">
                    Copyright &copy; 2019-2020, <a href="/">EvidenceMiner</a>, <a href="http://dm1.cs.uiuc.edu/">Data Mining Group(DMG)@UIUC</a>
                </div>
            </div>
        )
    }
}

export default Home;

const options = [
    { key: 'covid-19', text: 'covid-19', value: 'covid-19' },
    { key: 'chd', text: 'cancer & heart disease', value: 'chd' },
]