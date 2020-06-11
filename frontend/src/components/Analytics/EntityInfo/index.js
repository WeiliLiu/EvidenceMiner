import React from 'react';


// import downloaded packages
import { Message, Container, Button } from 'semantic-ui-react';


export default class EntityInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getInfo = this.getInfo.bind(this);
        this.updateActive = this.updateActive.bind(this);
    }

    componentDidMount() {
        // Set up screen size listener
        window.addEventListener("resize", this.resize.bind(this));

        this.resize();
    }

    resize() {
        this.setState({isMobile: window.innerWidth <= 992});
    }

    getInfo(){

        let type = "default";
        let docCount = 0;
        let sentCount = 0;
        let docRank = 1;
        let sentRank = 1;

        const {data, name} = this.props;

        let byDocument = data["byDocument"];
        let bySentence = data["bySentence"];

        if (byDocument == null) {
            return {};
        }

        for (let i = 0; i < byDocument.length; i++) {
            if (byDocument[i]["name"].replace("&", " - ") === name) {
                type = byDocument[i]["type"];
                docCount = byDocument[i]["docCount"];
                sentCount = byDocument[i]["sentCount"];
            }
            if (bySentence[i]["name"].replace("&", " - ") === name) {
                type = bySentence[i]["type"];
                docCount = bySentence[i]["docCount"];
                sentCount = bySentence[i]["sentCount"];
            }
        }

        for (let i = 0; i < byDocument.length; i++) {
            if (byDocument[i]["docCount"] > docCount) {
                docRank++;
            }
            if (bySentence[i]["sentCount"] > sentCount) {
                sentRank++;
            }
        }

        return {
            "type": type,
            "docCount": docCount,
            "sentCount": sentCount,
            "docRank": docRank <= 20 ? docRank : ">20",
            "sentRank": sentRank <= 20 ? sentRank : ">20",
        }
    }

    updateActive(index) {
        this.setState({
            activeButton: index
        });
    }

    render() {

        const { name, corpus, mode} = this.props;
        const {isMobile, activeButton} = this.state;

        let toReturn;
        let entityInfo = this.getInfo();
        let documentNum, sentNum;
        let update = this.updateActive;

        if (corpus === "covid-19") {
            if (mode === "pattern") {
                documentNum = 26099;
                sentNum = 659678;
            } else {
                documentNum = 24993;
                sentNum = 2669659;
            }
        } else {
            if (mode === "pattern") {
                documentNum = 12516;
                sentNum = 33820;
            } else {
                documentNum = 59563;
                sentNum = 1720604;
            }
        }

        if (name !== "default") {

            toReturn =
                <div>
                    <h1 width={"100%"} style={{"textAlign": "center"}}>{name}</h1>
                    <div style={infoStyle}>Entity Type: <p style={dataStyle}>{entityInfo.type}</p></div>
                    <div style={infoStyle}>Document Count: <p style={dataStyle}>{entityInfo.docCount}</p>, appeared in <p style={dataStyle}>{parseFloat(entityInfo.docCount/documentNum*100).toFixed(4)}%</p> documents</div>
                    <div style={infoStyle}>Sentence Count: <p style={dataStyle}>{entityInfo.sentCount}</p>, appeared in <p style={dataStyle}>{parseFloat(entityInfo.sentCount/sentNum*100).toFixed(4)}%</p> sentences</div>
                    <div style={infoStyle}>Rank By DocCount: <p style={dataStyle}>{entityInfo.docRank}</p></div>
                    <div style={infoStyle}>Rank By SentCount: <p style={dataStyle}>{entityInfo.sentRank}</p></div>
                    {this.props.mode === "pattern" ?
                        <div>
                        <div style={infoStyle}>fixed Entity:</div>
                        <Button.Group vertical={isMobile ? true : false} style={{marginTop:"2rem"}}>
                            {name.split(" - ").map(function (value, index) {
                                return <Button toggle key={index} active={activeButton === index} onClick={function () {
                                    update(index);
                                    window.location.href = "/analytics?kw=" + encodeURIComponent(entityInfo.type)
                                        + "&corpus=" + encodeURIComponent(corpus)
                                        + "&constrain=" + encodeURIComponent(value);
                                }}>
                                    {value}
                                </Button>
                            })}
                        </Button.Group></div>: null
                    }
                </div>
        } else {
            toReturn = <Container style={{ backgroundColor: '', paddingTop: '2rem' }} textAlign='center'>
                <Message warning compact style={{ margin: '1rem' }}>
                    <Message.Header>No Entity Selected</Message.Header>
                    <p>Click Any Entity On the Graph To Show Its Information</p>
                </Message>
            </Container>
        }
        return (
            <div>
                {toReturn}
            </div>
        )
    }
}

const infoStyle = {
    fontSize: "1.5rem",
    marginTop: "1rem"
}

const dataStyle = {
    color: "#df7970",
    display: "inline"
}