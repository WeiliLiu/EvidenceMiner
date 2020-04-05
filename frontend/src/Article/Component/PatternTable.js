import React from 'react';
import { List, Table } from 'semantic-ui-react';
import '../Style/patternTable.css';

export default class PatternTable extends React.Component {
  constructor(props) {
    super(props);

    this.listPatterns = this.listPatterns.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick = (sentID) => {
    console.log(sentID)
    this.props.changeSentColor(sentID);
    this.props.scrollToAnchor(sentID);
  }

  listPatterns() {
    let table = [];
    console.log(this.props.patterns.length)
    for(let i = 0; i < this.props.patterns.length; i++) {
      let metaPatternList = this.props.patterns[i].metaPattern.split(' ');
      let metaPatternElement = [];
      let sentenceExtractionList = this.props.patterns[i].sentenceExtraction.split(' ');
      let sentenceExtractionElement = [];
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

      for (let j = 0; j < sentenceExtractionList.length; j++) {
        if(this.props.patterns[i].instances.includes(sentenceExtractionList[j].replace(/{/g, "").replace(/}/g, "").replace(/\n/, ""))) {
          sentenceExtractionElement.push(<strong>{sentenceExtractionList[j].replace(/{/g, "").replace(/}/g, "").replace(/\n/, "")}</strong>);
          let outstandingChar = sentenceExtractionList[j].match(/}/g);
          sentenceExtractionElement.push(outstandingChar);
        } else {
          sentenceExtractionElement.push(sentenceExtractionList[j]);
        }

        if(j != sentenceExtractionList.length - 1) {
          sentenceExtractionElement.push(' ');
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
      <Table celled compact selectable collapsing className='pattern-table'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Instances</Table.HeaderCell>
            <Table.HeaderCell>Meta Pattern</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.listPatterns()}
        </Table.Body>
      </Table>
    )
  }
}
