import {atom} from "jotai";

export interface Segment {
    start: number;
    end: number;
}

export interface InputData {
    values: number[][];
    segments: Segment[];
}

export const CurrentNumberMousePosition = atom<number | null>();

export interface ChartWindow {
    start: number;
    length: number;
}

export const CurrentChartWindow = atom<ChartWindow>({start: 0, length: 20});
