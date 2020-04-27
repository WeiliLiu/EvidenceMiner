import React from 'react';
import {List, Label, Button, Image} from "semantic-ui-react";

export default class MinorTypeList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            listExpanded: false,
        }

        this.listWordForEachMinorType = this.listWordForEachMinorType.bind(this);
        this.decideHeaderColor = this.decideHeaderColor.bind(this);
    }

    listWordForEachMinorType(list) {
        var words = Object.keys(list);
        var table = [];
        if(this.props.sortMode === 'Frequency') {
            var listSortedByValue = Object.keys(list).sort(function(a,b){return list[b]-list[a]})
            for(let i = 0; i < words.length; i++) {
                table.push(<List.Item style={{ color: 'black' }}>
                    {listSortedByValue[i]}
                    <span><Label style={{ marginLeft: '0.3rem' }} circular size={'mini'}>{list[listSortedByValue[i]]}</Label></span>
                </List.Item>)
            }
        }else if(this.props.sortMode === 'Alphabet') {
            var ordered = Object.keys(list).sort(function(a, b) {
                var textA = a.toUpperCase();
                var textB = b.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            })
            for(let i = 0; i < words.length; i++) {
                table.push(<List.Item>
                    {ordered[i]}
                    <span><Label style={{ marginLeft: '0.3rem' }} circular size={'mini'}>{list[ordered[i]]}</Label></span>
                </List.Item>)
            }
        }else {
            for(let i = 0; i < words.length; i++) {
                table.push(
                    <List.Item style={{ color: 'black' }}>
                        {words[i]}
                        <span><Label style={{ marginLeft: '0.3rem' }} circular size={'mini'}>{list[words[i]]}</Label></span>
                    </List.Item>
                )
            }
        }
        return table;   
    }

    decideHeaderColor() {
        if(this.props.Type === 'Gene or Genome') {
            return {color: '#374785'}
        }else if(this.props.Type === 'Disease or Syndrome') {
            return {color: '#f7941d'}
        }else {
            return {color: 'black'}
        }
    }

    render() {
        if(this.props.Type !== 'Chemical') {
            if(this.state.listExpanded === false) {
                return(
                    <List.Item as='a'>
                        <List.Icon name='angle down' style={{ float: 'right' }} />
                        <List.Content>
                            <List.Header style={this.decideHeaderColor()}
                                        onClick={() => {this.setState({listExpanded: !this.state.listExpanded,})}}>
                                {this.props.Type}
                            </List.Header>
                        </List.Content>
                    </List.Item>
                )
            }else {
                return(
                    <List.Item as='a'>
                        <List.Icon name='angle up' style={{ float: 'left' }} />
                        <List.Content>
                            <List.Header style={this.decideHeaderColor()}
                                        onClick={() => {this.setState({listExpanded: !this.state.listExpanded,})}}>
                                {this.props.Type}
                            </List.Header>
                            <List.List>
                                {this.listWordForEachMinorType(this.props.List)}
                            </List.List>
                        </List.Content>
                    </List.Item>
                )
            }
        } else {
            return(
                <List.List>
                    {this.listWordForEachMinorType(this.props.List)}
                </List.List>
            )
        }
    }

}