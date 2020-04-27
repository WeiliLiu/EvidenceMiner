import React from 'react';

// import ui elements
import { List, Label } from 'semantic-ui-react';

// import css
import './styles.css';

// import components
import SecondaryList from '../SecondaryList';

class PrimaryList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {}

        this.handleListDisplay = this.handleListDisplay.bind(this);
        this.handleOnClickListItem = this.handleOnClickListItem.bind(this);
        this.sum = this.sum.bind(this);
    }

    sum = (obj) => {
        if (obj === {}) return 0;
        if (obj === parseInt(obj, 10)) return 1;

        let result = 0;
        for(var el in obj) {
          result += this.sum(obj[el])
        }
        return result;
    }

    handleOnClickListItem = (type) => {
        const { typeDict } = this.props;
        Object.keys(typeDict[type]).map(listId => this.setState({ [listId]: !this.state[listId] }));
        this.setState({ [type]: !this.state[type] })
    }

    handleListDisplay = (type) => {
        const { typeDict } = this.props;

        let table = [];
        // Put in the major type first
        table.push(
            <List.Item id={type} key={type} className="primary-list-item" onClick={() => this.handleOnClickListItem(type)}>
                <List.Icon name={this.state[type]? 'caret square up' : 'caret square down outline'} className="list-icon"/>
                <List.Content style={{ color: color[type] }}>
                    <List.Header>{type}&nbsp;&nbsp;&nbsp;&nbsp;<Label circular empty style={{ backgroundColor: color[type] }}/></List.Header>
                    <List.Description className="list-item-description">
                        {Object.keys(typeDict[type]).length}&nbsp;
                        {Object.keys(typeDict[type]).length === 1? 'subtype' : 'subtypes'},&nbsp;
                        {this.sum(typeDict[type])}&nbsp;
                        {this.sum(typeDict[type]) === 1? 'entity' : 'entities'}
                    </List.Description>
                </List.Content>
            </List.Item>
        )

        // Put in the minor types if expanded
        table.push(
            Object.keys(typeDict[type]).map(
                minorType => <SecondaryList key={minorType} 
                                            id={minorType} 
                                            type={minorType} 
                                            visible={this.state[minorType] || false}
                                            typeDict={typeDict[type][minorType]}
                                            />
            )
        )
                        
        // Horizontal divider for each major type only
        if(type !== Object.keys(typeDict)[Object.keys(typeDict).length - 1]) {
            table.push(<hr key={type + type}/>);
        }
        return table;
    }
    
    render() {
        const { typeDict } = this.props;

        return(
            <List>
                {
                    Object.keys(typeDict).map(type => this.handleListDisplay(type))
                }
            </List>
        )
    }
}

const color = {
    'SPACY TYPE': '#F44336',
    'NEW TYPE': '#3399ff',
    'PHYSICAL OBJECT': '#009688',
    'CONCEPTUAL ENTITY': '#8E24AA',
    'ACTIVITY': '#F3D250',
    'PHENOMENON OR PROCESS': '#374785',
};

export default PrimaryList;