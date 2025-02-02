import React from 'react';
import {Layer, Rect} from 'react-konva';
import {useAtom} from 'jotai';
import {CurrentChartWindow, Segment} from "../Data.tsx";

type SegmentShadowProps = {
    segment?: Segment;
    width: number;
    height: number;
};

export const SegmentShadow: React.FC<SegmentShadowProps> = ({segment, width, height}) => {
    const [chartWindow] = useAtom(CurrentChartWindow);
    const {start, length} = chartWindow;

    if (segment == null) return null;
    const getCanvasX = (value: number): number => {
        return ((value - start) / length) * width;
    };

    const xStart = getCanvasX(segment.start);
    const xEnd = getCanvasX(segment.end);
    const rectWidth = xEnd - xStart;

    return (
        <Layer>
            <Rect
                x={xStart}
                y={0}
                width={rectWidth}
                height={height}
                fill="black"
                opacity={0.2}
            />
        </Layer>
    );
};