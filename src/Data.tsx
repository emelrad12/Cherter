export interface Segment {
    start: number;
    end: number;
}

export interface InputData {
    values: number[][];
    segments: Segment[];
}