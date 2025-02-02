import React from 'react';
import {Stage} from 'react-konva';
import {CurrentChartWindow, CurrentNumberMousePosition, InputData} from "../Data.tsx";
import {LineChart} from "./LineChart.tsx";
import {VerticalDashedLines} from "./VerticalDashedLines.tsx";
import {useAtom, useSetAtom} from "jotai/index";
import {SegmentShadow} from "./CurrentlySelectedSegment.tsx";

interface CanvasComponentProps {
    data: InputData
    width: number;
    height: number;
}

export const CanvasComponent = ({data, width, height}: CanvasComponentProps) => {
    const [chartWindow] = useAtom(CurrentChartWindow);
    const {start, length} = chartWindow;
    const setMousePosition = useSetAtom(CurrentNumberMousePosition);
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


    return (
        <Stage onMouseMove={handleMouseMove} width={width} height={height}>
            <LineChart data={data.values[0]} width={width} height={height * 0.4} offset={0}/>
            <LineChart data={data.values[1]} width={width} height={height * 0.2} offset={height*0.4}/>
            <LineChart data={data.values[2]} width={width} height={height * 0.2} offset={height*0.6}/>
            <VerticalDashedLines width={width} height={height} lines={data.segments.map(segment => [segment.start, segment.end]).flat()}/>
            <SegmentShadow width={width} height={height} segment={{start: 5, end: 10}}/>
        </Stage>
    );
};