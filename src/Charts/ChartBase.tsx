import React from 'react';
import {Stage} from 'react-konva';
import {CurrentChartWindow, CurrentNumberMousePosition, InputData} from "../Data.tsx";
import {LineChart} from "./LineChart.tsx";
import {VerticalDashedLines} from "./VerticalDashedLines.tsx";
import {useAtom, useSetAtom} from "jotai/index";
import {SegmentShadow} from "./CurrentlySelectedSegment.tsx";
import {useAtomValue} from "jotai";
import {AnimateTo} from "./ChartViewManipulator.tsx";

interface CanvasComponentProps {
    data: InputData
    width: number;
    height: number;
}

export const CanvasComponent = ({data, width, height}: CanvasComponentProps) => {
    const [chartWindow, setChartWindow] = useAtom(CurrentChartWindow);
    const {start, length} = chartWindow;
    const setMousePosition = useSetAtom(CurrentNumberMousePosition);
    const mousePosition = useAtomValue(CurrentNumberMousePosition);
    const getChartX = (x: number): number => {
        return start + (x / width) * length;
    };

    const getChartY = (y: number): number => {
        return y;
    }

    const handleMouseMove = (e: any) => {
        const stage = e.target.getStage();
        const pointerPos = stage.getPointerPosition();
        if (pointerPos) {
            const {x, y} = pointerPos;
            const chartX = getChartX(x);
            const chartY = getChartY(y);//Todo fix y
            setMousePosition(chartX);
        }
    };

    const dashedLines = data.segments.map(segment => [segment.start, segment.end]).flat();
    dashedLines.push(mousePosition);

    const charts = [];
    let currentOffset = 0;
    const HEIGHT_MULTIPLIER = 0.1;

    for (let i = 0; i < data.values.length; i++) {
        const chartHeight = i === 0 ? height * HEIGHT_MULTIPLIER * 2 : height * HEIGHT_MULTIPLIER;

        charts.push(
            <LineChart
                key={i}
                data={data.values[i]}
                width={width}
                height={chartHeight}
                offset={currentOffset}
            />
        );

        currentOffset += chartHeight;
    }

    const currenlySelectedSegment = data.segments.find(segment => {
        return segment.start <= mousePosition && segment.end >= mousePosition;
    });

    return (
        <Stage onMouseMove={handleMouseMove} onClick={() => {
            AnimateTo(chartWindow, {start: currenlySelectedSegment.start, length: currenlySelectedSegment.end - currenlySelectedSegment.start}, setChartWindow);
        }} width={width} height={height}>
            {charts}
            <VerticalDashedLines width={width} height={height} lines={dashedLines}/>
            <SegmentShadow width={width} height={height} segment={currenlySelectedSegment}/>
        </Stage>
    );
};