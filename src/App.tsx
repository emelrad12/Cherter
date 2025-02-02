import './App.css'
import {EnableDataRandomization, InputData} from "./Data.tsx";
import {useEffect, useState} from "react";
import {CanvasComponent} from "./Charts/ChartBase.tsx";
import {ChartWindowManipulator} from "./Charts/ChartViewManipulator.tsx";
import {useAtomValue} from "jotai";

function GenerateInitialRandomArr(size: number, sinOffset: number) {
    return Array.from({length: size}, (v, i) => ((Math.sin((i + sinOffset) / 3) + 1) / 2) * 0.90 + Math.random() / 10);
}

function GenerateRandomSegment() {
    const start = Math.floor(Math.random() * 20);
    const end = Math.floor(Math.random() * 20);
    return {start: Math.min(start, end), end: Math.max(start, end)};
}

function GenerateRandomTestData(tick: number) {
    const arrSize = 20;
    const testData: InputData = {
        values: Array.from({length: 10}, (v, i) => GenerateInitialRandomArr(arrSize, tick / 10 + Math.random() * 10)),
        segments: Array.from({length: 10}, () => GenerateRandomSegment()),
    };
    return testData;
}

const App = () => {
    const [tick, setTick] = useState(0);
    const [testData, setTestData] = useState(GenerateRandomTestData(tick));
    const enableRandomization = useAtomValue(EnableDataRandomization);
    useEffect(() => {
        const interval = setInterval(() => {
            if (!enableRandomization) return;
            setTick(tick + 1);
            setTestData(GenerateRandomTestData(tick));
        }, 50);
        return () => {
            clearInterval(interval);
        };
    }, [enableRandomization, tick]);
    return (
        <div>
            <ChartWindowManipulator/>
            <CanvasComponent data={testData} width={1000} height={1000}/>
        </div>
    );
};

export default App;
