import './App.css'
import {InputData} from "./Data.tsx";
import {useState} from "react";
import {CanvasComponent} from "./Charts/ChartBase.tsx";
import {ChartWindowManipulator} from "./Charts/ChartViewManipulator.tsx";

function GenerateInitialRandomArr(size: number) {
    return Array.from({length: size}, (v, i) => ((Math.sin(i / 3) + 1) / 2) * 0.95 + Math.random() / 20);
}

function GenerateRandomSegment() {
    const start = Math.floor(Math.random() * 20);
    const end = Math.floor(Math.random() * 20);
    return {start: Math.min(start, end), end: Math.max(start, end)};
}

function GenerateRandomTestData(tick: number,) {
    const arrSize = 20;
    const testData: InputData = {
        values: Array.from({ length: 10 }, () => GenerateInitialRandomArr(arrSize)),
        segments: Array.from({ length: 10 }, () => GenerateRandomSegment()),
    };
    for (let i = 0; i < testData.values.length; i++) {
        for (let j = 0; j < testData.values[i].length; j++) {
            testData.values[i][j] += (tick % 100) / 10;
        }
    }
    return testData;
}

const App = () => {
    const [tick, setTick] = useState(0);
    const [testData, setTestData] = useState(GenerateRandomTestData(tick));
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setTick(tick + 1);
    //         setTestData(GenerateRandomTestData(tick));
    //     }, 50);
    //     return () => {
    //         clearInterval(interval);
    //     };
    // }, [tick]);
    return (
        <div>
            <ChartWindowManipulator/>
            <CanvasComponent data={testData} width={1000} height={1000}/>
        </div>
    );
};

export default App;
