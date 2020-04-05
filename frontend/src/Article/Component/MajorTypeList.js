import React from 'react';
import {List} from "semantic-ui-react";
import MinorTypeList from '../Component/MinorTypeList';
import '../Style/MajorTypeList.css';

export default class MajorTypeList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            listExpanded: true,
        }

        this.listWordForEachMajorType = this.listWordForEachMajorType.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        if(this.props.Type === 'Chemical') {
            this.setState({
                listExpanded: false
            })
        }
    }

    listWordForEachMajorType(list) {
        var table = [];
        var types = Object.keys(list);
        console.log(types);
        for(let i = 0; i < types.length; i++) {
            table.push(<MinorTypeList Type={types[i]} List={list[types[i]]} sortMode={this.props.sortMode}/>)
        }
        return table;
    }

    render() {
        if(this.state.listExpanded === false) {
            return(
                <List.Item as='a'>
                    <List.Icon name='angle down' style={{ float: 'left' }} />
                    <List.Content>
                        <List.Header style={{ color: color[this.props.Type] }} 
                                    onClick={() => {this.setState({listExpanded: !this.state.listExpanded,})}}>
                            {this.props.Type}
                        </List.Header>
                    </List.Content>
                </List.Item>
            )
        }else {
            if(this.props.Type !== 'Chemical') {
                return(
                    <List.Item as='a'>
                        <List.Icon name='angle up' style={{ float: 'left' }} />
                        <List.Content>
                            <List.Header style={{ color: color[this.props.Type] }}
                                        onClick={() => {this.setState({listExpanded: !this.state.listExpanded,})}}>
                                {this.props.Type}
                            </List.Header>
                            <List.List>
                                {this.listWordForEachMajorType(this.props.List)}
                            </List.List>
                        </List.Content>
                    </List.Item>
                )
            } else {
                return(
                    <List.Item as='a'>
                        <List.Icon name='angle up' style={{ float: 'left' }} />
                        <List.Content>
                            <List.Header style={{ color: color[this.props.Type] }}
                                        onClick={() => {this.setState({listExpanded: !this.state.listExpanded,})}}>
                                {this.props.Type}
                            </List.Header>
                            {this.listWordForEachMajorType(this.props.List)}
                        </List.Content>
                    </List.Item>
                )
            }
        }
    }
}

const color = {
    'Chemical': '#F44336',
    'Organism': '#3399ff',
    'Fully Formed Anatomical Structure': '#009688',
    'Physiologic Function': '#8E24AA',
    'Pathologic Function': '#FFCC00',
};