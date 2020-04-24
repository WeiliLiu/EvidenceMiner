import React from 'react';
import { List, Table, Header } from 'semantic-ui-react';
import '../Style/patternTable.css';

export default class PatternTable extends React.Component {
  constructor(props) {
    super(props);

    this.listPatterns = this.listPatterns.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick = (sentID) => {
    this.props.changeSentColor(sentID);
    this.props.scrollToAnchor(sentID);
  }

  listPatterns() {
    let table = [];
    for(let i = 0; i < this.props.patterns.length; i++) {
      let metaPatternList = this.props.patterns[i].metaPattern.split(' ');
      let metaPatternElement = [];
      for(let j = 0; j < metaPatternList.length; j++) {
        if (metaPatternList[j] == metaPatternList[j].toUpperCase()) {
          metaPatternElement.push(metaPatternList[j])
        } else {
          metaPatternElement.push(<u>{metaPatternList[j]}</u>);
        }

        if(j != metaPatternList.length - 1) {
          metaPatternElement.push(' ');
        }
      }

      table.push(
        <Table.Row onClick={() => this.handleOnClick(this.props.patterns[i].sentID)}>
          <Table.Cell>
            <List as='ul'>
              {this.props.patterns[i].instances.map((d) => <List.Item as='li' key={d}>{d.split('_').join(' ')}</List.Item>)}
            </List>
          </Table.Cell>
          <Table.Cell>
            {metaPatternElement}
          </Table.Cell>
        </Table.Row>
      )
    }
    return table;
  }

  render() {
    return(
      <div className="table-container">
        <Table celled selectable fixed role="grid" aria-labelledby="header">
          <Table.Header className="table-row">
            <Table.Row>
              <Table.HeaderCell colSpan="2" id="header">
                Meta-pattern Extractions
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.HeaderCell className="column-header">Instances</Table.HeaderCell>
              <Table.HeaderCell className="column-header">Meta Pattern</Table.HeaderCell>
            </Table.Row>
            {this.listPatterns()}
          </Table.Body>
        </Table>
      </div>
    )
  }
}
