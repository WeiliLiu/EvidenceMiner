import React from 'react';

// import ui elements
import { List, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';

// import components
import SecondaryList from '../SecondaryList';

// import util functions
import utils from '../../../utils';

// import css
import './styles.css';

class PrimaryList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {}

        this.handleListDisplay = this.handleListDisplay.bind(this);
        this.handleOnClickListItem = this.handleOnClickListItem.bind(this);
    }

    handleOnClickListItem = (type) => {
        const { typeDict } = this.props;
        Object.keys(typeDict[type]).map(listId => this.setState({ [listId]: !this.state[listId] }));
        this.setState({ [type]: !this.state[type] })
    }

    handleListDisplay = (type, index) => {
        const { typeDict } = this.props;

        let table = [];
        // Put in the major type first
        table.push(
            <List.Item id={type} key={type} className="primary-list-item" onClick={() => this.handleOnClickListItem(type)}>
                <List.Icon name={this.state[type]? 'caret square up' : 'caret square down outline'} className="list-icon"/>
                <List.Content style={{ color: utils.getColor()[type] }}>
                    <List.Header>
                        {index === 0? <Label color="red">{index + 1}</Label> : <Label>{index + 1}</Label>}
                        &nbsp;&nbsp;&nbsp;&nbsp;{type}&nbsp;&nbsp;&nbsp;&nbsp;
                        <Label circular empty style={{ backgroundColor: utils.getColor()[type] }}/>
                    </List.Header>
                    <List.Description className="list-item-description">
                        {Object.keys(typeDict[type]).length}&nbsp;
                        {Object.keys(typeDict[type]).length === 1? 'subtype' : 'subtypes'},&nbsp;
                        {utils.sum(typeDict[type])}&nbsp;
                        {utils.sum(typeDict[type]) === 1? 'entity' : 'entities'}
                    </List.Description>
                </List.Content>
            </List.Item>
        )

        // Put in the minor types if expanded
        table.push(
            utils.sortByEntityCount(typeDict[type]).map(
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
                    utils.sortByEntityCount(typeDict).map((type, index) => this.handleListDisplay(type, index))
                }
            </List>
        )
    }
}

PrimaryList.propTypes = {
    typeDict: PropTypes.object
}

export default PrimaryList;