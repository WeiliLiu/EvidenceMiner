import React from 'react';

// import components
import PrimaryList from '../../TypeList/PrimaryList';
import EntitesVis from '../../EntitiesVis';

// import css
import './styles.css';

class ListContainer extends React.Component {
    

    render() {
        const { typeDict, graphData, graphColors, archive } = this.props

        return(
            <div className="word-container shadow-sm" hidden={typeDict === {}}>
                <div className="resultlist-word-segment-header" style={{ borderColor: archive === 'covid-19'? 'rgb(33, 133, 208)' : 'rgb(242, 113 ,28)' }}>
                    <h4>Label Coloring & Entity Counts</h4>
                </div>
                <div className="resultlist-word-segment-vis">
                    <EntitesVis graphData={graphData} graphColors={graphColors}/>
                </div>
                <div className="resultlist-word-segment-list">
                    <PrimaryList typeDict={typeDict} archive={archive}/>
                </div>
            </div>
        )
    }
}

export default ListContainer;