import { isMobile } from 'react-device-detect';
import { XAxis, YAxis, Tooltip, AreaChart, Area, ResponsiveContainer, CartesianGrid, ComposedChart, Line, Legend } from 'recharts';
import moment from 'moment';
import '../styles/Home.module.css';
import React from 'react';
import { toolTipLabelFormatter } from './BarChart';

const average = 30;

export const formatUnixTimeToTickFormat = (unixTime, selectedFilter) => {
    if (selectedFilter === '1D') return moment(unixTime).format('HH:mm');
    else if (selectedFilter === '10D') return moment(unixTime).format(isMobile ? 'ddd' : 'ddd Do');
    else if (selectedFilter === 'Daily Max') return moment(unixTime).format("MMM YY");
    else if (selectedFilter === 'Daily Avg') return moment(unixTime).format("MMM YY");
    else if (selectedFilter === 'Monthly Avg') return moment(unixTime).format("MMM YY");
}

const showMA = (selectedFilter: string): boolean => {
    return selectedFilter.includes("Daily")
}

export const LineChart = ({ timeSeries, selectedFilter, isFetchingTimeSeries }) => {

    const CustomTooltip = ({ active, payload, label }) => {
        if (active) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: "white", margin: "0px", padding: "10px", border: "1px solid rgb(204, 204, 204)" }}>
                    <p className="label">{`${moment(label).format(toolTipLabelFormatter(selectedFilter))} `}</p>
                    <p>{`${selectedFilter.includes("Daily") ? selectedFilter : "players"}: ${payload[0].value}`} </p>
                    {showMA(selectedFilter) && <p>{`MA${average}: ${payload[0].payload.avg}`} </p>}
                </div>
            );
        }
        return null;
    };
    const averages = timeSeries.map((t, idx) => idx < average ?
        Math.round(timeSeries.slice(0, idx).reduce((acc, obj) => acc + obj.players, 0) / (idx)) :
        Math.round(timeSeries.slice(idx - average, idx).reduce((acc, obj) => acc + obj.players, 0) / average)
    )
    const formattedTimeSeries = timeSeries.map((t, idx) => ({ ...t, avg: averages[idx] }))

    return ((formattedTimeSeries.length > 0 && !isFetchingTimeSeries ? (
        <ResponsiveContainer width="96%" height={isMobile ? 400 : 450}>
            <ComposedChart data={formattedTimeSeries} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis
                    dataKey="timeStamp"
                    domain={['auto', 'auto']}
                    name="Time"
                    axisLine={false}
                    minTickGap={isMobile ? 16 : 100}
                    tickFormatter={unixTime => formatUnixTimeToTickFormat(unixTime, selectedFilter)}
                    type="number"
                    scale="time"
                />
                <CartesianGrid stroke="#2c3e50" vertical={false} strokeDasharray="6 6" />
                <YAxis
                    type="number"
                    axisLine={false}
                    orientation="left"
                    domain={[0, 'auto']}
                    tickFormatter={tick => {
                        return `${tick / 1000}k`;
                    }}
                />
                <defs>
                    <linearGradient id="evoblack" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="25%" stopColor="#1b2631" stopOpacity={0.8} />
                        <stop offset="99%" stopColor="#1b2631" stopOpacity={0} />
                    </linearGradient>
                </defs>

                <Legend formatter={(string) => {
                    if (string === "avg") return `MA${average}`
                    if (string === "players") return selectedFilter
                    return string;
                }} />
                <Tooltip viewBox={{ x: 1000, y: 0, width: 800, height: 400 }} content={CustomTooltip} labelFormatter={(time: Date) => `${moment(time).format(toolTipLabelFormatter(selectedFilter))}`} />

                <Area type="monotone" dataKey="players" stroke="black" fill="url(#evoblack)" />
                {showMA(selectedFilter) && <Line type="monotone" dataKey="avg" stroke="#ffa64d" dot={false} strokeWidth={3} />}
            </ComposedChart>
        </ResponsiveContainer >
    ) : <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px" }}>
        <p>Loading ..</p>
    </div>))
}