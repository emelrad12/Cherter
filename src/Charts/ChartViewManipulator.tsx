import React, {useRef} from 'react';
import {useAtom} from 'jotai';
import {CurrentChartWindow, EnableDataRandomization} from "../Data.tsx";

const Lerp = (start: number, end: number, t: number) => {
    return start + (end - start) * t;
}

export function AnimateTo(current, desired, setChartWindow){
        let currentTick = 0;
        const totalTicks = 25;
        const animate = () => {
            currentTick++;
            setChartWindow({
                start: Lerp(current.start, desired.start, currentTick / totalTicks),
                length: Lerp(current.length, desired.length, currentTick / totalTicks),
            });
            if (currentTick < totalTicks) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
}

export const ChartWindowManipulator = () => {
    const [chartWindow, setChartWindow] = useAtom(CurrentChartWindow);
    const [enableRandomization, setEnableRandomization] = useAtom(EnableDataRandomization);
    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStart = Number(e.target.value);
        setChartWindow({...chartWindow, start: newStart});
    };

    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newLength = Number(e.target.value);
        setChartWindow({...chartWindow, length: newLength});
    };

    const StartAuto = () => {
        let currentTick = 0;
        const animate = () => {
            currentTick++;
            setChartWindow({
                start: Math.sin(currentTick / 120) * 10,
                length: chartWindow.length,
            });
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    };


    const AnimateToRandomPosition = () => {
        const randomLength = Math.random() * 20;
        let randomStart = Math.random() * 20;
        randomStart = Math.min(randomStart, 20 - randomLength);
        const current = chartWindow
        AnimateTo(current, {start: randomStart, length: randomLength}, setChartWindow);
    }

    const ToggleDataRandomization = () => {
        setEnableRandomization(!enableRandomization);
    }

    return (
        <div>
            <div>
                <label>
                    Start:
                    <input
                        type="number"
                        value={chartWindow.start}
                        onChange={handleStartChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Length:
                    <input
                        type="number"
                        value={chartWindow.length}
                        onChange={handleEndChange}
                    />
                </label>
            </div>
            <button onClick={StartAuto}>Auto</button>
            <button onClick={AnimateToRandomPosition}>Animate to random position</button>
            <button onClick={ToggleDataRandomization}>Toggle data randomization</button>
        </div>
    );
};