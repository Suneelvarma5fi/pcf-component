import * as React from "react";
import { ICheckpoint } from "./types";

export interface ITimelineSvgProps {
    startDate: string;
    endDate: string;
    checkpoints: ICheckpoint[];
}

const SVG_WIDTH = 800;
const SVG_HEIGHT = 140;
const TRACK_Y = 70;
const TRACK_LEFT = 60;
const TRACK_RIGHT = SVG_WIDTH - 60;
const TRACK_WIDTH = TRACK_RIGHT - TRACK_LEFT;
const DOT_RADIUS = 7;
const TICK_HEIGHT = 8;

function parseDate(dateStr: string): Date {
    return new Date(dateStr);
}

function formatShortDate(dateStr: string): string {
    const d = parseDate(dateStr);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatMonthYear(d: Date): string {
    return d.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}

function getMonthTicks(start: Date, end: Date): Date[] {
    const ticks: Date[] = [];
    const current = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    while (current < end) {
        ticks.push(new Date(current));
        current.setMonth(current.getMonth() + 1);
    }
    return ticks;
}

function dateToX(date: Date, start: Date, end: Date): number {
    const totalMs = end.getTime() - start.getTime();
    if (totalMs <= 0) return TRACK_LEFT;
    const fraction = (date.getTime() - start.getTime()) / totalMs;
    return TRACK_LEFT + fraction * TRACK_WIDTH;
}

export const TimelineSvg: React.FC<ITimelineSvgProps> = ({ startDate, endDate, checkpoints }) => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    const monthTicks = getMonthTicks(start, end);

    return (
        <svg
            width="100%"
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            style={{ maxWidth: SVG_WIDTH, display: "block", margin: "8px 0" }}
        >
            {/* Track line */}
            <line
                x1={TRACK_LEFT}
                y1={TRACK_Y}
                x2={TRACK_RIGHT}
                y2={TRACK_Y}
                stroke="#B0B0B0"
                strokeWidth={2}
            />

            {/* Start date dot */}
            <circle cx={TRACK_LEFT} cy={TRACK_Y} r={DOT_RADIUS} fill="#4CAF50" />
            <text
                x={TRACK_LEFT}
                y={TRACK_Y + 24}
                textAnchor="middle"
                fontSize={10}
                fill="#333"
            >
                {formatShortDate(startDate)}
            </text>

            {/* End date dot */}
            <circle cx={TRACK_RIGHT} cy={TRACK_Y} r={DOT_RADIUS} fill="#4CAF50" />
            <text
                x={TRACK_RIGHT}
                y={TRACK_Y + 24}
                textAnchor="middle"
                fontSize={10}
                fill="#333"
            >
                {formatShortDate(endDate)}
            </text>

            {/* Month tick marks */}
            {monthTicks.map((tick, i) => {
                const x = dateToX(tick, start, end);
                return (
                    <g key={`tick-${i}`}>
                        <line
                            x1={x}
                            y1={TRACK_Y - TICK_HEIGHT / 2}
                            x2={x}
                            y2={TRACK_Y + TICK_HEIGHT / 2}
                            stroke="#999"
                            strokeWidth={1}
                        />
                        <text
                            x={x}
                            y={TRACK_Y + 36}
                            textAnchor="middle"
                            fontSize={8}
                            fill="#888"
                        >
                            {formatMonthYear(tick)}
                        </text>
                    </g>
                );
            })}

            {/* Checkpoints */}
            {checkpoints.map((cp, i) => {
                const cpDate = parseDate(cp.p6662_date);
                const x = dateToX(cpDate, start, end);
                // Alternate above/below track to avoid label overlap
                const isAbove = i % 2 === 0;
                const labelY = isAbove ? TRACK_Y - 20 : TRACK_Y + 50;
                const dateY = isAbove ? TRACK_Y - 10 : TRACK_Y + 60;
                const connectorY1 = isAbove ? TRACK_Y - 12 : TRACK_Y + DOT_RADIUS;
                const connectorY2 = isAbove ? TRACK_Y - DOT_RADIUS : TRACK_Y + 12;

                return (
                    <g key={cp.p6662_checkpointsid ?? `cp-${i}`}>
                        {/* Connector line */}
                        <line
                            x1={x}
                            y1={connectorY1}
                            x2={x}
                            y2={connectorY2}
                            stroke="#2196F3"
                            strokeWidth={1}
                            strokeDasharray="2,2"
                        />
                        {/* Hollow blue dot */}
                        <circle
                            cx={x}
                            cy={TRACK_Y}
                            r={DOT_RADIUS - 1}
                            fill="white"
                            stroke="#2196F3"
                            strokeWidth={2}
                        />
                        {/* Label */}
                        <text
                            x={x}
                            y={labelY}
                            textAnchor="middle"
                            fontSize={10}
                            fontWeight="600"
                            fill="#2196F3"
                        >
                            {cp.p6662_name}
                        </text>
                        {/* Date */}
                        <text
                            x={x}
                            y={dateY}
                            textAnchor="middle"
                            fontSize={8}
                            fill="#666"
                        >
                            {formatShortDate(cp.p6662_date)}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};
