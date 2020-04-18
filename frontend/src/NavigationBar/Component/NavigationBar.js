import React from 'react';
import _ from 'lodash';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { Search, Grid, Header, Segment, Label, Input, Icon, Container, Menu } from 'semantic-ui-react'
import '../Style/NavigationBar.css';
import 'semantic-ui-css/semantic.min.css';
import {Redirect, Link} from "react-router-dom";
import axios from "axios";
import config from '../../config';

const resultRenderer = ({ title }) => {
    console.log(title)
    return(
        <div style={{ 'font-size': '0.9rem' }}>{title}</div>
    )
}

export default class NavigationBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchBarFocused: false,
            isMobile: false,
            searchValue: '',
            shouldRedirect: false,
            isFlushed: false,
            isLoading: false, results: [], value: new URLSearchParams(window.location.search).get('kw'),
            source: [],
        }

        this.decideSearchBarStyle = this.decideSearchBarStyle.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.getSearchURL = this.getSearchURL.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.showExample = this.showExample.bind(this);
    }

    componentDidMount() {
        const searchParams = new URLSearchParams(window.location.search);
        var keyword = searchParams.get('kw')

        // Set up screen size listener
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

        if (this.props.type === "analytics") {
            this.setState({
                value: decodeURI(window.location.search.substring(1, window.location.search.length)),
            })
        } else {
            this.setState({
                value: keyword,
            })
        }
    }

    resize() {
        this.setState({isMobile: window.innerWidth <= 992});
    }

    handleScroll =(e)=>{
        const { isMobile } = this.state;
        if (!isMobile) {
            var header = document.getElementById('header');
            if(window.pageYOffset > 5){
                header.classList.add('shadow-sm');
            } else {
                header.classList.remove('shadow-sm');
            }
        }    
    }

    componentWillMount(){
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount(){
        window.removeEventListener('scroll',this.handleScroll);
    }

    decideSearchBarStyle() {
        if(this.state.searchBarFocused === true) {
            return 'mr-sm-2 searchbar-focused';
        }else {
            return 'mr-sm-2 searchbar-unfocused';
        }
    }

    handleKeyPress(target) {
        if(target.charCode==13){
            target.preventDefault();
            // console.log(this.state.value)
            if(this.state.searchBarFocused && this.state.value !== '') {
                window.location.href = this.getSearchURL();
            }
        }
    }

    getSearchURL() {
        if (this.props.type === "analytics") {
            return "/" + this.props.type + '?' + this.state.value;
        } else {
            return "/" + this.props.type + '?kw=' + this.state.value + "&page=1"
        }
    }

    handleResultSelect = (e, { result }) => {
        // console.log(result.title)
        // console.log(this.state.value)
        let value = this.state.value.split(',')
        value[value.length - 1] = value.length > 1? ' ' + result.title : result.title;
        // console.log(value[value.length - 1])
        this.setState({ value: value.join(',') })
    }

    handleSearchChange = (e, { value }) => {
        console.log(this.state.searchBarFocused)
        this.setState({ isLoading: true, value })

        var query = {
            "query": {
                "multi_match": {
                    "query": this.state.value,
                    "type": "bool_prefix",
                    "fields": [
                        "metaPattern",
                        "metaPattern._2gram",
                        "metaPattern._3gram"
                    ]
                }
            }
        };

        axios.get(config.searchUrl + '/pubmed/_search', {
            params: {
                source: JSON.stringify(query),
                source_content_type: 'application/json'
            }
        }).then(response => {
            var data = response.data.hits.hits;

            var results = [];
            var results_obj = [];
            for (let i = 0; i < data.length; i++) {
                if (!results.includes(data[i]._source.metaPattern)) {
                    results.push(data[i]._source.metaPattern);
                    results_obj.push({"title": data[i]._source.metaPattern});
                }
                if(i >= 5) {
                    break;
                }
            }

            this.setState({
                isLoading: false,
                results: results_obj,
            })
        })
    }

    showExample = (type) => {
        if (type === "analytics") {
            return <div>
            Example&nbsp;:&nbsp;
            <a href={config.frontUrl + "/analytics?entity_type=DISEASEORSYNDROME"}>
                entity_type=DISEASEORSYNDROME</a>,&nbsp;
            <a href={config.frontUrl + "/analytics?pattern=DISEASEORSYNDROME treat with CHEMICAL"}>pattern=DISEASEORSYNDROME treat with CHEMICAL</a>,&nbsp;
            <a href={config.frontUrl + "/analytics?entity=nivolumab&pattern=DISEASEORSYNDROME treat with CHEMICAL"}>entity=nivolumab&pattern=DISEASEORSYNDROME treat with CHEMICAL</a>
          </div>
        } else {
            return <div>
            Example : &nbsp;
            <a href={config.frontUrl + "/search?kw=NSCLC is treated with nivolumab&page=1"}>NSCLC is treated with nivolumab</a>,&nbsp;
            <a href={config.frontUrl + "/search?kw=HCC is treated with sorafenib&page=1"}>HCC is treated with sorafenib</a>,&nbsp;
            <a href={config.frontUrl + "/search?kw=prostate cancer is treated with androgen&page=1"}>prostate cancer is treated with androgen</a>
          </div>
        }
    }

    render() {
        const { isLoading, value, results, isMobile } = this.state

        return(
            <Navbar id="header" bg="light" expand="lg" style={{ padding: '0px', backgroundColor: 'red' }} className={'main-navbar'}>
                <Grid style={{ width: '100%', maxWidth: "2000px" }} padded stretched>
                    <Grid.Column width={isMobile? 16 : 0} className="logo-column" textAlign="middle" verticalAlign="middle">
                        <Link to={{
                            pathname: `/`
                        }} >
                            <Container fluid text content="EM" textAlign='center'
                                       style={{ backgroundColor: '', fontSize: "2.5rem", padding: "0" }}
                            />
                        </Link>
                    </Grid.Column>
                    <Grid.Column width={isMobile? 16 : 6} className={'searchbar-grid'}>
                        <Search
                            fluid
                            loading={false}
                            input={<Input fluid icon='search' placeholder='Search...' />}
                            onResultSelect={this.handleResultSelect}
                            onSearchChange={_.debounce(this.handleSearchChange, 500, {
                            leading: true,
                            })}
                            results={results}
                            value={value}
                            resultRenderer={resultRenderer}
                            noResultsMessage={"No meta patterns found!"}
                            onKeyPress={this.handleKeyPress}
                            onFocus={() => {this.setState({searchBarFocused: true})}}
                            onBlur={() => {this.setState({searchBarFocused: false})}}
                            {...this.props}
                        />
                    </Grid.Column>
                    {/* <Grid.Column width={9} verticalAlign='middle' style={{ padding: '0' }}>
                      {this.showExample(this.props.type)}
                    </Grid.Column> */}
                </Grid>
            </Navbar>
        )
    }
}
