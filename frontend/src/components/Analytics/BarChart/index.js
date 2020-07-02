import React from 'react';
import CanvasJSReact from '../../canvasjs-2.3.2/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class BarChart extends React.Component {
    constructor(props) {
        super(props);
        this.onclick = this.onclick.bind(this);
        this.sentOption = this.sentOption.bind(this);
        this.docOption = this.docOption.bind(this);
    }

    componentDidMount() {

    }

    addSymbols(e){
        var suffixes = ["", "K", "M", "B"];
        var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
        if(order > suffixes.length - 1)
            order = suffixes.length - 1;
        var suffix = suffixes[order];
        return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
    }

    onclick(e){
        this.props.action(e.dataPoint.indexLabel);
    }

    getDataPoint() {
        const {data, type} = this.props;
        if (data["byDocument"] == null) {
            alert(1);
            return [];
        }
        let dataPoints = [];
        let source = type === "doc" ? data["byDocument"] : data["bySentence"];
        let field = type === "doc" ? "docCount" : "sentCount";
        for (let i = 0; i < source.length; i++) {
            dataPoints.push({
                "y":source[i][field],
                "label":source[i]["name"].replace("&"," - "),
                "indexLabel": source[i]["name"].replace("&"," - "),
                "click": this.onclick});

        }
        return dataPoints
    }

    docOption(){
        const {mode} = this.props;
        const option = {
            animationEnabled: true,
            zoomEnabled: true,
            theme: "light2",
            title:{
                text: mode === "pattern" ?
                    "Top entity pairs Based on Document Counts"
                    : "Top Entities Based on Document Counts"
            },
            axisX: {
                title: mode === "pattern" ? "entity pairs" : "Entities",
                reversed: true,
                labelFontSize: 0,
                labelMaxWidth: 0,
            },
            axisY: {
                title: "Document Counts",
                labelFormatter: this.addSymbols
            },
            data: [{
                type: "bar",
                indexLabelPlacement: "outside",
                indexLabelFontSize:15,
                indexLabelWrap : false,
                dataPoints: this.getDataPoint()
            }],
            height: 600
        }
        return option;
    }

    sentOption() {
        const {mode} = this.props;
        const option = {
            animationEnabled: true,
            theme: "light2",
            title:{
                text: mode === "pattern" ?
                    "Top entity pairs Based on Sentence Counts"
                    : "Top Entities Based on Sentence Counts"
            },
            axisX: {
                title: mode === "pattern" ? "entity pairs" : "Entities",
                reversed: true,
                interval: 40,
                labelFontSize: 0,
                labelMaxWidth: 0,
            },
            axisY: {
                title: "Sentence Counts",
                labelFormatter: this.addSymbols
            },
            data: [{
                type: "bar",
                indexLabelPlacement: "outside",
                indexLabelWrap : false,
                indexLabelFontSize:15,
                dataPoints: this.getDataPoint()
            }],
            height: 600
        };
        return option;
    }

    render() {
        let option;
        if (this.props.type === "doc") {
            option = this.docOption();
        } else {
            option = this.sentOption();
        }
        return <CanvasJSChart options = {option}/>
    }
}

export default BarChart;