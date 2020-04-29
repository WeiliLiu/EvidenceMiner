import React from 'react';

// import downloaded packages
import _ from 'lodash';
import { Navbar } from 'react-bootstrap';
import { Search, Grid, Input, Container } from 'semantic-ui-react'
import axios from "axios";

// import config
import config from '../../config';

// import css
import './styles.css';

const resultRenderer = ({ title }) => {
    return(
        <div style={{ 'fontSize': '0.9rem' }}>{title}</div>
    )
}

export default class NavigationBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchBarFocused: false,
            isTablet: false,
            searchValue: '',
            shouldRedirect: false,
            isFlushed: false,
            isLoading: false, results: [], 
            value: new URLSearchParams(window.location.search).get('kw'),
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
        this.setState({isTablet: window.innerWidth < 992});
    }

    handleScroll =(e)=>{
        const { isTablet } = this.state;
        if (!isTablet) {
            var header = document.getElementById('header');
            if(window.pageYOffset > 5){
                header.classList.add('shadow-sm');
            } else {
                header.classList.remove('shadow-sm');
            }
        }    
    }

    UNSAFE_componentWillMount(){
        window.addEventListener('scroll', this.handleScroll);
    }

    UNSAFE_componentWillUnmount(){
        window.removeEventListener('scroll',this.handleScroll);
    }

    decideSearchBarStyle() {
        if(this.state.searchBarFocused === true) {
            return 'mr-sm-2 searchbar-focused';
        }else {
            return 'mr-sm-2 searchbar-unfocused';
        }
    }

    handleKeyPress = (target) => {
        if(target.charCode === 13){
            target.preventDefault();
            if(this.state.searchBarFocused && this.state.value !== '') {
                window.location.href = this.getSearchURL();
            }
        }
    }

    getSearchURL() {
        const { value } = this.state;
        const { type } = this.props;
        if (this.props.type === "analytics") {
            return "/" + type + '?' + value;
        } else {
            return "/search/" + type + '?kw=' + encodeURIComponent(value) + "&page=1"
        }
    }

    handleResultSelect = (e, { result }) => {
        let value = this.state.value.split(',')
        value[value.length - 1] = value.length > 1? ' ' + result.title : result.title;
        this.setState({ value: value.join(',') })
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })
        const { type } = this.props;

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

        axios.get(config.searchUrl + type + '/_search', {
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
        const { value, results } = this.state;
        const { type } = this.props;

        return(
            <div>
                <Navbar id="header" bg="light" expand="lg" style={{ padding: '0px', backgroundColor: 'red' }} className={'main-navbar'}>
                    <Grid style={{ width: '100%', margin: '0' }} padded stretched>
                        <Grid.Column mobile={16} tablet={16} computer={1} className="logo-column" textAlign="center" verticalAlign="middle">
                            <Container fluid text textAlign='center' style={{ backgroundColor: '', fontSize: "2.5rem", padding: "0" }}>
                                <a href="/" style={{ color: titleColor[type] }}>EM</a>
                            </Container>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={16} computer={7} className={'searchbar-grid'}>
                            <Search
                                fluid
                                loading={false}
                                input={<Input className="input-search-bar" fluid icon='search' iconPosition='left' placeholder='Search...' value={value || ''} />}
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
                        <Grid.Column width={8} verticalAlign='middle' style={{ padding: '0' }}>
                            {/* {this.showExample(this.props.type)} */}
                        </Grid.Column>
                    </Grid>
                </Navbar>
            </div>
        )
    }
}

const titleColor = {
    'covid-19': 'rgb(33, 133, 208)',
    'chd': 'rgb(242, 113 ,28)',
    'analytics': '#db2828'
}