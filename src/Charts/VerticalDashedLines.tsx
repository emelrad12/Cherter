import React from 'react';
import {Stage, Layer, Line} from 'react-konva';
import {useAtom} from 'jotai';
import {CurrentChartWindow} from "../Data.tsx";

type VerticalDashedLinesProps = {
    width: number;
    height: number;
    lines: number[];
};

export const VerticalDashedLines: React.FC<VerticalDashedLinesProps> = ({width, height, lines}) => {
    const [chartWindow] = useAtom(CurrentChartWindow);
    const {start, length} = chartWindow;

    const getCanvasX = (value: number): number => {
        return ((value - start) / length) * width;
    };

    return (
        <Layer>
            {lines.map((value, index) => {
                const canvasX = getCanvasX(value);
                return (
                    <Line
                        key={index}
                        points={[canvasX, 0, canvasX, height]}
                        stroke="black"
                        strokeWidth={1}
                        dash={[5, 5]}
                    />
                );
            })}
        </Layer>
    );
};
