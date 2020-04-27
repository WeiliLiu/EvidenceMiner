import React from 'react';

import { ResponsivePieCanvas } from '@nivo/pie'

class EntitiesVis extends React.Component {
    render() {
        const { graphData, graphColors } = this.props;

        return(
            <ResponsivePieCanvas
                data={graphData}
                pixelRatio={1}
                innerRadius={0.6}
                padAngle={0.7}
                cornerRadius={3}
                colors={graphColors}
                enableRadialLabels={false}
                slicesLabelsSkipAngle={10}
                slicesLabelsTextColor="white"
            />
        )
    }
}

export default EntitiesVis;