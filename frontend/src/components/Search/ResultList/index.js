// import react
import React from 'react';

// import packages
import { Loader, List, Pagination, Icon, Segment, Grid, Container, Menu, Checkbox } from 'semantic-ui-react';
import PropTypes from 'prop-types';

// import self-made components
import TypeList from '../../TypeList/ListContainer';
import ResultItem from '../ResultItem';
import Footer from '../../Footer';

// import api endpoints
import api from '../../../api';

// import util functions
import utils from '../../../utils';

// import css file
import './styles.css';


class ResultList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isMobile: false,
            showFloatingList: false,
            searchResults: [],
            totalPage: 1,
            currentPage: 1,
            resultLength: 0,
            keyword: "",
            responseTime: 0,
            typeDict: {},
            graphData: [],
            graphColors: [],
            colors: {},
            isLoading: true
        }

        this.showSearchResults = this.showSearchResults.bind(this);
    }

    async componentDidMount() {
        // Get query from the url querystring
        const searchKeyword = new URLSearchParams(window.location.search).get('kw');
        const includePreprint = new URLSearchParams(window.location.search).get('ipp') === 'true'? true : false;

        // Get which archive to search from
        const { archive } = this.props;

        // Get the total number of search results returned
        const numSearchResults = await api.getSearchResultCount(searchKeyword, archive, includePreprint);

        // Calculate paging related numbers
        const totalPages = Math.ceil(numSearchResults / 10);
        const currPage = parseInt(new URLSearchParams(window.location.search).get('page'));

        // Call the api to query elasticsearch
        const resultSize = 10;
        const searchResult = await api.getSearchResult(searchKeyword, resultSize, currPage, archive, includePreprint);

        // Set up screen size listener
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

        // Get color inforamtions
        var colors = utils.getColor(archive);
        
        // Calculate entities information for current page
        var entities = utils.compileEntities(searchResult);
        
        // Counting word frequencies for each entity
        var typeDict = utils.compileEntityFrequency(entities, archive);

        // Prepare graph data
        var graphData = [];
        var graphColors = [];
        for(var el in typeDict) {
            graphData.push(
                {
                    "id": el,
                    "label": el,
                    "value": utils.sum(typeDict[el]),
                }
            );
            graphColors.push(colors[el]);
        }

        // Modify states based on search results
        this.setState({
            responseTime: searchResult.took,
            searchResults: searchResult.hits.hits,
            totalPage: totalPages,
            currentPage: currPage,
            keyword: searchKeyword,
            resultLength: numSearchResults,
            typeDict: typeDict,
            graphData: graphData,
            graphColors: graphColors,
            colors: colors,
            isLoading: false,
        })
    }

    resize() {
        this.setState({isMobile: window.innerWidth < 992});
    }

    showSearchResults = () => {
        var table = [];
        const { searchResults, currentPage } = this.state;
        const { archive } = this.props;

        searchResults.forEach((result, index) => {
            const resultObj = result._source;
            table.push(<ResultItem pmid={resultObj.pmid}
                pmcid={resultObj.pmid}
                source={resultObj.source}
                doi={resultObj.doi}
                sentence={resultObj.sentence}
                prevSentence={resultObj.prevSent}
                nextSentence={resultObj.nextSent}
                title={resultObj.title}
                sentID={resultObj.sentId}
                isTitle={resultObj.isTitle}
                abstract={resultObj.abstract}
                entities={resultObj.entities}
                authors={resultObj.author_list}
                date={String(resultObj.date)}
                journal={resultObj.journal_name}
                documentId={resultObj.documentId}
                score={result._score}
                key={result._id} 
                ranking={index} 
                page={currentPage}
                archive={archive} />)
        })

        return table;
    }

    render() {
        const { isMobile, isLoading, typeDict, graphData, graphColors, keyword, responseTime, resultLength, totalPage, currentPage } = this.state;
        const { archive } = this.props;
        const includePreprint = new URLSearchParams(window.location.search).get('ipp') === 'false'? false : true;

        return(
            <div>
                <div className={isLoading? "loading-style search-grid-container" : "search-grid-container"}>
                    <Grid className="search-grid">
                        <Grid.Row className="search-grid-row">
                            <Grid.Column only='computer' computer={1} />
                            <Grid.Column mobile={16} tablet={16} computer={10} widescreen={6} className="menu-column">
                                <Menu pointing secondary className="search-menu">
                                    <Menu.Item
                                        name='COVID-19'
                                        icon="archive"
                                        color="blue"
                                        active={archive === 'covid-19'}
                                        onClick={() => window.location.href = `/search/covid-19?kw=` + encodeURIComponent(keyword) + `&ipp=${includePreprint}&page=1`}
                                    />
                                    <Menu.Item
                                        name='Cancer and Heart Disease'
                                        icon="archive"
                                        color="orange"
                                        active={archive === 'chd'}
                                        onClick={() => window.location.href = '/search/chd?kw=' + encodeURIComponent(keyword) + `&ipp=${includePreprint}&page=1`}
                                    />
                                   <Menu.Item
                                        name='Analytics'
                                        icon="chart line"
                                        active={false}
                                        onClick={() => window.location.href = '/analytics?kw=' + keyword + "&corpus=" + encodeURIComponent(archive)}
                                    />
                                </Menu>
                            </Grid.Column>
                            <Grid.Column computer={5} widescreen={9} />
                        </Grid.Row>
                    </Grid>
                </div>
                {isLoading? 
                    <Segment className="search-loading-screen">
                        <Loader active={isLoading} size='huge'>Loading</Loader>
                    </Segment> :
                    <div>
                        <Grid className="search-meta-info">
                            <Grid.Row className="search-meta-info-row">
                                <Grid.Column only='computer' computer={1}/>
                                <Grid.Column mobile={16} tablet={11} computer={10} widescreen={6} className="search-meta-info-column">
                                    <Container fluid className="search-meta-container">
                                        <Checkbox 
                                                checked={!includePreprint} 
                                                label='Exclude bioRxiv/medRxiv' 
                                                onChange={() => window.location.href = `/search/${archive}?kw=` + encodeURIComponent(keyword) + `&ipp=${!includePreprint}&page=${currentPage}`}
                                                className="include-preprint-checkbox"
                                        />
                                        <span> "{keyword}" </span>
                                        <span>(Total: <strong>{resultLength}</strong>, Took: <strong>{responseTime}ms</strong>)</span>
                                        <br />
                                        <small>~ At most 10 results are shown per page ~</small>
                                    </Container>
                                </Grid.Column>
                                <Grid.Column computer={5} widescreen={9}/>
                            </Grid.Row>
                            <Grid.Row className="search-meta-info-row">
                                <Grid.Column only='computer' computer={1} />
                                <Grid.Column mobile={16} tablet={16} computer={10} widescreen={6} className="segment-list">
                                    <List divided verticalAlign='middle' size={'big'}>
                                        {this.showSearchResults()}
                                    </List>
                                    <Segment basic textAlign={isMobile? "center" : "left"} className="pagination-container">
                                        <Pagination className={'result-list-pagination'} hidden={resultLength === 0}
                                            ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                                            firstItem={isMobile? null : { content: <Icon name='angle double left' />, icon: true }}
                                            lastItem={isMobile? null : { content: <Icon name='angle double right' />, icon: true }}
                                            prevItem={{ content: <Icon name='angle left' />, icon: true }}
                                            nextItem={{ content: <Icon name='angle right' />, icon: true }}
                                            totalPages={totalPage}
                                            activePage={currentPage}
                                            boundaryRange={isMobile? 0 : 1}
                                            onPageChange={(e, { activePage }) => window.location.href = `/search/${archive}?kw=` + encodeURIComponent(keyword) + `&ipp=${includePreprint}&page=${activePage}`}
                                        />
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={16} computer={4} widescreen={4} className="wordlist-column" hidden={resultLength === 0}>
                                    <TypeList typeDict={typeDict} graphColors={graphColors} graphData={graphData} archive={archive}/>
                                </Grid.Column>
                                <Grid.Column computer={1} widescreen={5}/>
                            </Grid.Row>
                        </Grid>
                        <Grid className="resultlist-footer-container" style={resultLength === 0?{ position: 'absolute', bottom: '0', width: '100%' } : {}}>
                            <hr />
                            <Grid.Row className="resultlist-footer-row">
                                <Grid.Column only='computer' computer={1}/>
                                <Grid.Column mobile={16} tablet={11} computer={10} widescreen={6} className="footer-column">
                                    <Footer />
                                </Grid.Column>
                                <Grid.Column computer={5} widescreen={9}/>
                            </Grid.Row>
                        </Grid>
                    </div>
                }
            </div>
        )
    }
}

ResultItem.propTypes = {
    archive: PropTypes.string
}

export default ResultList;