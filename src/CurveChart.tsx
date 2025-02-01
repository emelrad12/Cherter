import React, {useRef, useState} from "react";
import {Line} from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import {InputData, Segment} from "./Data.tsx";

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    annotationPlugin
);

interface CurveChartProps {
    data: InputData;
}

const generateColors = (count: number) => {
    return Array.from({length: count}, (_, i) =>
        `hsl(${(i * 360) / count}, 70%, 50%)`
    );
};

const CurveChart: React.FC<CurveChartProps> = ({data}) => {
    const chartRef = useRef(null);
    const [cursorX, setCursorX] = useState<number | null>(null);
    const [hoveredSegment, setHoveredSegment] = useState<Segment | null>(null);

    if (!data || !data.values || data.values.length === 0) {
        return <p>No data available</p>;
    }

    const colors = generateColors(data.values.length);

    const labels = Array.from({length: data.values[0].length}, (_, i) => i);

    const chartData = {
        labels,
        datasets: data.values.map((dataset: number[], index: number) => ({
            label: `Curve ${index + 1}`,
            data: dataset.map((y: number, x: number) => ({x, y})),
            borderColor: colors[index],
            backgroundColor: "transparent",
            tension: 0.4, // Smooth curve
            pointRadius: 3,
        })),
    };

    const hoveredSegmentOverlay = hoveredSegment
        ? {
            type: "box",
            xMin: hoveredSegment.start,
            xMax: hoveredSegment.end,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            drawTime: "beforeDraw",
        }
        : null;

    const annotations = data.segments.reduce((acc, segment: Segment, index: number) => {
        acc[`segment-start-${index}`] = {
            type: "line",
            mode: "vertical",
            scaleID: "x",
            value: segment.start,
            borderColor: "gray",
            borderWidth: 1,
            borderDash: [5, 5],
        };
        acc[`segment-end-${index}`] = {
            type: "line",
            mode: "vertical",
            scaleID: "x",
            value: segment.end,
            borderColor: "gray",
            borderWidth: 1,
            borderDash: [5, 5],
        };
        return acc;
    }, hoveredSegmentOverlay ? {"hovered-segment": hoveredSegmentOverlay} : {});

    if (cursorX !== null) {
        let cursor = Math.min(Math.max(cursorX, 0), labels.length - 1);
        annotations["cursor-line"] = {
            type: "line",
            mode: "vertical",
            scaleID: "x",
            value: cursor,
            borderColor: "red",
            borderWidth: 1,
        };
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {display: true},
            tooltip: {enabled: true, intersect: false},
            annotation: {annotations},
        },
        scales: {
            x: {type: "linear", position: "bottom", grid: {display: false}},
            y: {beginAtZero: false, grid: {display: false}},
        },
        animation: false,
        onHover: (event: any) => {
            if (chartRef.current) {
                const chart = chartRef.current;
                const xScale = chart.scales.x;
                const value = xScale.getValueForPixel(event.x);
                setCursorX(value);

                let largestSegment: Segment | null = null;
                for (const segment of data.segments) {
                    if (value >= segment.start && value <= segment.end) {
                        if (!largestSegment || (segment.end - segment.start) > (largestSegment.end - largestSegment.start)) {
                            largestSegment = segment;
                        }
                    }
                }
                setHoveredSegment(largestSegment);
            }
        },
    };

    return (
        <div style={{position: "relative", width: "600px", height: "400px"}}>
            <Line ref={chartRef} data={chartData} options={options}/>
        </div>
    );
};

export default CurveChart;
