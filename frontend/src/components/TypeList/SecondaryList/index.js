import React from 'react';

// import UI elements
import { List, Transition, Label, Button } from 'semantic-ui-react';

// import css
import './styles.css';

class SecondaryList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpanded: false,
        }
    }

    render() {
        const { type, visible, typeDict } = this.props;
        const { isExpanded } = this.state;

        return(
            <Transition visible={visible} animation='scale' duration={500} unmountOnHide>
                <List.Item className="secondary-list-item" style={{backgroundColor: isExpanded? 'rgb(247, 247, 247)' : 'white'}} onClick={() => this.setState({ isExpanded: !isExpanded })}>
                    <List.Icon name={isExpanded? 'caret square up' : 'caret square down outline'} className="list-icon" />
                    <List.Content>
                        {type}
                        <List.Description className="list-item-description">
                            {Object.keys(typeDict).length} {Object.keys(typeDict).length === 1? 'entity' : 'entities'}
                        </List.Description>
                    </List.Content>
                    <Transition visible={isExpanded} animation='scale' duration={500} unmountOnHide>
                        <List verticalAlign='middle'>
                            {Object.keys(typeDict).map(word => 
                                <List.Item key={word} className="tertiary-list-item">
                                    <List.Content floated='right'>
                                        <Label>{typeDict[word]}</Label>
                                    </List.Content>
                                    <List.Content className="vertical-center">
                                        {word}
                                    </List.Content>
                                </List.Item>
                            )}
                        </List>
                    </Transition>
                </List.Item>
            </Transition>
        )
    }
}

export default SecondaryList;