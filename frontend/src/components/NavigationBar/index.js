import React from 'react';

// import downloaded packages
import _ from 'lodash';
import { Navbar } from 'react-bootstrap';
import { Search, Grid, Input, Container } from 'semantic-ui-react'

// import api
import api from '../../api';

// import css
import './styles.css';

const resultRenderer = ({ title, type }) => {
    if (type != null) {
        return (
            <div className="auto-complete-result">{title + " (Entity)"}</div>
        )
    }
    return(
        <div className="auto-complete-result">{title}</div>
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

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.getSearchURL = this.getSearchURL.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        const keyword = new URLSearchParams(window.location.search).get('kw');

        // Set up screen size listener
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

        this.setState({
            value: keyword,
        })
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

    handleKeyPress = (target) => {
        const { searchBarFocused, value } = this.state;

        if(target.charCode === 13){
            target.preventDefault();
            if(searchBarFocused && value !== '') {
                window.location.href = this.getSearchURL();
            }
        }
    }

    getSearchURL() {
        const { value } = this.state;
        const { type,corpus } = this.props;
        const includePreprint = new URLSearchParams(window.location.search).get('ipp') === 'false'? false : true;
        if (this.props.type === "analytics") {
            if (value.indexOf("+") != -1) {
                let arr = value.split("+");
                return "/" + type + '?kw=' + encodeURIComponent(arr[0].trim()) + '&corpus=' + corpus + '&constrain=' + encodeURIComponent(arr[1].trim());
            }
            return "/" + type + '?kw=' + encodeURIComponent(value) + '&corpus=' + corpus;
        } else {
            return "/search/" + type + '?kw=' + encodeURIComponent(value) + `&ipp=${includePreprint}&page=1`    
        }
    }

    handleResultSelect = (e, { result }) => {
        let value = this.state.value.split(',')
        value[value.length - 1] = value.length > 1? ' ' + result.title : result.title;
        this.setState({ value: value.join(',') })
    }

    handleSearchChange = async (e, { value }) => {

        this.setState({ isLoading: true, value })
        const {corpus} = this.props;
        var EntityResultsObj = [];
        if (this.props.type === "analytics") {
            let entityTypeList = chdEntityType;
            if (corpus === 'covid-19') entityTypeList = entityTypes;
            for (let i = 0; i < entityTypeList.length; i++) {
                if (entityTypeList[i].toLocaleLowerCase().startsWith(value.toLowerCase())) {
                    EntityResultsObj.push({"title": entityTypeList[i], "type": 1});
                    continue;
                }
                if (entityTypeList[i].toLocaleLowerCase().indexOf(" " + value.toLowerCase()) !== -1) {
                    EntityResultsObj.push({"title": entityTypeList[i], "type": 2});
                    continue;
                }
                if (entityTypeList[i].toLocaleLowerCase().indexOf(value.toLowerCase()) !== -1) {
                    EntityResultsObj.push({"title": entityTypeList[i], "type": 3});
                    continue;
                }
            }

            EntityResultsObj = EntityResultsObj.sort(function(a,b) {
                return a.type - b.type;
            })
        }


        const { type } = this.props;
        var results = [];
        var resultsObj = [];
        var counter = 0;

        let autoCompletionResults;
        if (type === "analytics") {
            resultsObj = resultsObj.concat(EntityResultsObj);
            autoCompletionResults = await api.getAutoComplete(value, corpus);
        } else {
            autoCompletionResults = await api.getAutoComplete(value, type);
        }

        autoCompletionResults.some(result => {
            const metaPattern = result._source.metaPattern;
            if (!results.includes(metaPattern)) {
                results.push(metaPattern);
                resultsObj.push({ "title": metaPattern });
                counter += 1;
            }
            return counter === 5;
        })

        this.setState({
            isLoading: false,
            results: resultsObj,
        })
    }

    render() {
        const { value, results } = this.state;
        const { type } = this.props;

        return(
            <div>
                <Navbar id="header" bg="light" expand="lg" className={'main-navbar'}>
                    <Grid className="searchbar-grid" padded stretched>
                        <Grid.Column mobile={16} tablet={16} computer={1} className="logo-column" textAlign="center" verticalAlign="middle">
                            <Container fluid text textAlign='center' className="searchbar-title">
                                <a href="/" style={{ color: titleColor[type] }}>EM</a>
                            </Container>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={16} computer={7} className={'searchbar-grid-column'}>
                            <Search
                                fluid
                                loading={false}
                                input={<Input className="input-search-bar" fluid icon='search' iconPosition='left' placeholder='Search...' value={value || ''} />}
                                onResultSelect={this.handleResultSelect}
                                onSearchChange={_.debounce(this.handleSearchChange, 500, {
                                    leading: true,
                                })}
                                results={results}
                                value={value || ''}
                                resultRenderer={resultRenderer}
                                noResultsMessage={this.props.type === "analytics" ? "No entity types find" : "No meta patterns found!"}
                                onKeyPress={this.handleKeyPress}
                                onFocus={() => {this.setState({searchBarFocused: true})}}
                                onBlur={() => {this.setState({searchBarFocused: false})}}
                            />
                        </Grid.Column>
                        <Grid.Column width={8} verticalAlign='middle' className="no-padding"></Grid.Column>
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

const chdEntityType = ["TISSUE", "CELL", "ORGANISM FUNCTION", "BODY PART, ORGAN, OR ORGAN COMPONENT", "MOLECULAR FUNCTION", "CELL COMPONENT", "VIRUS", "EUKARYOTE", "ORGAN OR TISSUE FUNCTION", "CHEMICAL", "CELL FUNCTION", "CELL OR MOLECULAR DYSFUNCTION", "DISEASE OR SYNDROME", "EXPERIMENTAL MODEL OF DISEASE", "GENE OR GENOME"];
const entityTypes = ["TIME","CORONAVIRUS","EVOLUTION","FAC","ORGAN OR TISSUE FUNCTION","MACHINE ACTIVITY","SOCIAL BEHAVIOR","GROUP","CELL OR MOLECULAR DYSFUNCTION","EVENT","CELL FUNCTION","MONEY","INJURY OR POISONING","ORGANISM","CELL COMPONENT","VIRUS","HUMAN-CAUSED PHENOMENON OR PROCESS","CELL","ANATOMICAL STRUCTURE","MOLECULAR FUNCTION","GROUP ATTRIBUTE","BODY SUBSTANCE","RESEARCH ACTIVITY","EXPERIMENTAL MODEL OF DISEASE","VIRAL PROTEIN","FOOD","DIAGNOSTIC PROCEDURE","QUANTITY","PERCENT","LOC","SIGN OR SYMPTOM","LAW","DATE","WILDLIFE","WORK OF ART","TISSUE","INDIVIDUAL BEHAVIOR","CARDINAL","IMMUNE RESPONSE","PHYSICAL SCIENCE","BACTERIUM","NORP","SUBSTRATE","LABORATORY OR TEST RESULT","ORDINAL","LABORATORY PROCEDURE","MATERIAL","GENE OR GENOME","ARCHAEON","GPE","ORG","DISEASE OR SYNDROME","EDUCATIONAL ACTIVITY","LIVESTOCK","EUKARYOTE","DAILY OR RECREATIONAL ACTIVITY","LANGUAGE","GOVERNMENTAL OR REGULATORY ACTIVITY","CHEMICAL","THERAPEUTIC OR PREVENTIVE PROCEDURE","PERSON","BODY PART ORGAN OR ORGAN COMPONENT","PRODUCT"]