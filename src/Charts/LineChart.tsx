import React from 'react';
import {Layer, Line} from 'react-konva';
import {useAtomValue} from "jotai";
import {CurrentChartWindow} from "../Data.tsx";

interface LineChartProps {
    data: number[];
    width: number;
    height: number;
    offset: number;
}

export const LineChart: React.FC<LineChartProps> = ({data, width, height, offset}) => {
    const chartView = useAtomValue(CurrentChartWindow);
    const minValue = 0;
    const maxValue = 1;
    const yAxisRange = maxValue - minValue;
    const spacing = width / chartView.length;

    const points = data.map((value, index) => {
        const x = (index - chartView.start) * spacing;
        const normalizedValue = (value - minValue) / yAxisRange;
        const y = height - normalizedValue * height;
        return [x, y + offset];
    }).flat();
    return (
        <Layer>
            <Line
                points={points}
                stroke="blue"
                strokeWidth={2}
                tension={0.0}
                lineCap="round"
                lineJoin="round"
            />
        </Layer>
    );
};