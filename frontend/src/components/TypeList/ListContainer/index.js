import React from 'react';

// import components
import PrimaryList from '../../TypeList/PrimaryList';
import EntitesVis from '../../EntitiesVis';

// import css
import './styles.css';

class ListContainer extends React.Component {
    

    render() {
        const { typeDict, graphData, graphColors } = this.props

        return(
            <div className="word-container shadow-sm">
                <div className="resultlist-word-segment-header">
                    <h4>Label Coloring & Entity Counts</h4>
                </div>
                <div className="resultlist-word-segment-vis">
                    <EntitesVis graphData={graphData} graphColors={graphColors}/>
                </div>
                <div className="resultlist-word-segment-list">
                    <PrimaryList typeDict={typeDict}/>
                </div>
            </div>
        )
    }
}

export default ListContainer;