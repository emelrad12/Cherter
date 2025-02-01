import './App.css'
import CurveChart, {InputData} from "./CurveChart";

const App = () => {
    const testData: InputData = {
        values: [
            [1, 2, 3, 4, 5, 6, 7, 8, 9], // First dataset
            [2, 4, 6, 8, 1, 6, 3, 2, 5], // Second dataset
        ],
        segments: [
            {start: 1, end: 3},
            {start: 2, end: 6},
            {start: 7, end: 8},
        ],
    };

    return (
        <div>
            <CurveChart data={testData}/>
        </div>
    );
};

export default App;
