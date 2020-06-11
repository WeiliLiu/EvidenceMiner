import React from 'react';
import { Button } from 'semantic-ui-react'
import CanvasJSReact from '../../canvasjs-2.3.2/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


class CompareResult extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.onlyDocClick = this.onlyDocClick.bind(this);
        this.onlySentClick = this.onlySentClick.bind(this);
        this.overlapClick = this.overlapClick.bind(this);
        this.getOption = this.getOption.bind(this);
        this.onclick = this.onclick.bind(this);
    }

    resize() {
        this.setState({isMobile: window.innerWidth <= 992});
    }

    overlapClick(){
        this.setState({"activeButton":1,"type": "overlap"})
    }

    onlyDocClick(){
        this.setState({"activeButton":2,"type": "doc"})
    }

    onlySentClick(){
        this.setState({"activeButton":3,"type": "sent"})
    }

    componentDidMount() {
        this.setState({"activeButton":1, "type": "overlap"})
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    onclick(e){
        this.props.action(e.dataPoint.label);
    }

    getOption(){
        const {data, mode} = this.props;
        const {type} = this.state;
        let sent_data = data["bySentence"];
        let doc_data = data["byDocument"];
        if (sent_data == null) {
            return;
        }
        let documentDataPoints = [];
        let sentenceDataPoints = [];
        let title = "Overlapped entities in both count";
        if (type === "doc") title = "Entities only in document Count";
        if (type === "sent") title = "Entities only in Sentence Count"


        if (type === "overlap") {
            for (let i = 0; i < sent_data.length; i++) {
                let curr_name = sent_data[i]["name"];
                for (let j = 0; j < doc_data.length; j++) {
                    if (doc_data[j]["name"] === curr_name) {
                        documentDataPoints.push({"y":sent_data[i]["docCount"], "label": curr_name.replace("&", " - "), "click": this.onclick})
                        sentenceDataPoints.push({"y":sent_data[i]["sentCount"], "label": curr_name.replace("&", " - "), "click": this.onclick})
                        break;
                    }
                }
            }
        }
        if (type === "sent") {
            for (let i = 0; i < sent_data.length; i++) {
                let curr_name = sent_data[i]["name"];
                let add = true;
                for (let j = 0; j < doc_data.length; j++) {
                    if (doc_data[j]["name"] === curr_name) {
                        add = false;
                    }
                }
                if (add) {
                    documentDataPoints.push({"y":sent_data[i]["docCount"], "label": curr_name.replace("&", " - "), "click": this.onclick})
                    sentenceDataPoints.push({"y":sent_data[i]["sentCount"], "label": curr_name.replace("&", " - "), "click": this.onclick})
                }
            }
        }

        if (type === "doc") {
            for (let i = 0; i < doc_data.length; i++) {
                let curr_name = doc_data[i]["name"];
                let add = true;
                for (let j = 0; j < sent_data.length; j++) {
                    if (sent_data[j]["name"] === curr_name) {
                        add = false;
                    }
                }
                if (add) {
                    documentDataPoints.push({"y":doc_data[i]["docCount"], "label": curr_name.replace("&", " - "), "click": this.onclick})
                    sentenceDataPoints.push({"y":doc_data[i]["sentCount"], "label": curr_name.replace("&", " - "), "click": this.onclick})
                }
            }
        }
        const option = {
            animationEnabled: true,
            theme: "light2",
            title:{
                text: title
            },
            axisX: {
                title: "Entities",
                reversed: true,
                interval: 1
            },
            axisY: {
                title: "Sentence Counts",
                labelFormatter: this.addSymbols
            },
            axisY2: {
                title: "Document Count",
                labelFormatter: this.addSymbols
            },
            data: [{
                type: "column",
                name: "Sentence Count",
                showInLegend: true,
                dataPoints: sentenceDataPoints
            },
                {
                    type: "column",
                    name: "Document Count",
                    axisYType: "secondary",
                    showInLegend: true,
                    dataPoints: documentDataPoints
                }],
        };

        return option;
    }


    addSymbols(e){
        var suffixes = ["", "K", "M", "B"];
        var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
        if(order > suffixes.length - 1)
            order = suffixes.length - 1;
        var suffix = suffixes[order];
        return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
    }

    render() {
        const { activeButton,isMobile } = this.state
        let option = this.getOption();
        return(
            <div>
                <Button.Group vertical={isMobile ? true : false} style={{marginBottom:"2rem"}}>
                    <Button toggle active={activeButton === 1 ? true : false} onClick={this.overlapClick}>
                        Overlapped
                    </Button>
                    <Button toggle active={activeButton === 2 ? true : false} onClick={this.onlyDocClick}>
                        Only by DocCount
                    </Button>
                    <Button toggle active={activeButton === 3 ? true : false} onClick={this.onlySentClick}>
                        Only by SentCount
                    </Button>
                </Button.Group>
                <CanvasJSChart options = {option}/>
            </div>
        )
    }
}

export default CompareResult;