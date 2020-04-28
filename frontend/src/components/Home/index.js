import React from 'react';

// import downloaded packages
import { Navbar, Nav, InputGroup, Form, FormControl, Button } from 'react-bootstrap';
import { Icon, Embed } from 'semantic-ui-react';

// import config
import config from '../../config';

// import css
import './styles.css';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            searchBarFocused: false,
            searchValue: '',
        }

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.getSearchURL = this.getSearchURL.bind(this);
    }

    handleButtonClick() {
        if(this.state.searchValue !== '') {
            window.location.href = this.getSearchURL();;
        }
    }

    getSearchURL() {
        return "/search?kw=" + this.state.searchValue + "&page=1"
    }

    handleKeyPress(target) {
        if(target.charCode === 13){
            target.preventDefault();
            this.setState({
                searchValue: ''
            })
            if(this.state.searchBarFocused === true && this.state.searchValue !== '') {
                window.location.href = this.getSearchURL();
            }
        }
    }

    handleTextChange = (e) => {
        this.setState({
            searchValue: e.target.value
        })
    };

    render() {
        return(
            <div className={'home-page-container'}>
                <Navbar bg="light" expand="lg" className={'home-page-navbar'}>
                    <Navbar.Brand style={{ color: 'white', fontWeight: 'bold' }} href="#home">EvidenceMiner</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#">Home</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div className={'home-search-bar-container'}>
                    <div className={'home-search-bar-container-left'}>
                        <div className={'home-search-bar-container-left-inner-container'}>
                            <h1 className={'welcome-title'}>
                                Welcome to <br /> EvidenceMiner
                            </h1>
                            <p>Find an article by entering a query statement</p>
                            <InputGroup>
                                <Form inline>
                                    <FormControl type="search" placeholder="Search article" className={'home-page-search-bar'}
                                                 onFocus={() => {this.setState({searchBarFocused: true})}}
                                                 onBlur={() => {this.setState({searchBarFocused: false})}}
                                                 value={this.state.searchValue} onChange={this.handleTextChange} onKeyPress={this.handleKeyPress}/>
                                </Form>
                                <InputGroup.Prepend className={'search-bar-right'}>
                                    <Button className={'home-search-button'} onClick={this.handleButtonClick}>
                                        <Icon name={'chevron right'}></Icon>
                                    </Button>
                                </InputGroup.Prepend>
                            </InputGroup>
                            <span>Example&nbsp;:&nbsp;<a href={config.frontUrl + "/search?kw=NSCLC is treated with nivolumab&page=1"}>NSCLC is treated with nivolumab</a>,&nbsp;
            <a href={config.frontUrl + "/search?kw=HCC is treated with sorafenib&page=1"}>HCC is treated with sorafenib</a>,&nbsp;
            <a href={config.frontUrl + "/search?kw=prostate cancer is treated with androgen&page=1"}>prostate cancer is treated with androgen</a></span>
                        </div>
                    </div>
                    <div className={'home-search-bar-container-right'}>
                        <div className='right-inner'>
                            <Embed
                                id='iYuQ6gsr--I'
                                defaultActive={true}
                                iframe={{
                                    allowFullScreen: true,
                                  }}
                                source='youtube'
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;