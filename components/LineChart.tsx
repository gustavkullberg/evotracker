import { isMobile } from 'react-device-detect';
import { XAxis, YAxis, Tooltip, AreaChart, Area, ResponsiveContainer, CartesianGrid } from 'recharts';
import moment from 'moment';
import '../styles/Home.module.css';
import React from 'react';
import { toolTipLabelFormatter } from './BarChart';

export const formatUnixTimeToTickFormat = (unixTime, selectedFilter) => {
    if (selectedFilter === '1D') return moment(unixTime).format('HH:mm');
    else if (selectedFilter === '10D') return moment(unixTime).format(isMobile ? 'ddd' : 'ddd Do');
    else if (selectedFilter === 'Daily Max') return moment(unixTime).format("MMM Do");
    else if (selectedFilter === 'Daily Avg') return moment(unixTime).format("MMM Do");
    else if (selectedFilter === 'Monthly Avg') return moment(unixTime).format("MMM YY");
}

export const LineChart = ({ timeSeries, selectedFilter, isFetchingTimeSeries }) => {
    return ((timeSeries.length > 0 && !isFetchingTimeSeries ? (
        <ResponsiveContainer width="96%" height={isMobile ? 400 : 450}>
            <AreaChart data={timeSeries} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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

                <Tooltip labelFormatter={(time: Date) => `${moment(time).format(toolTipLabelFormatter(selectedFilter))}`} />
                <Area type="monotone" dataKey="players" stroke="black" fill="url(#evoblack)" />
            </AreaChart>
        </ResponsiveContainer >
    ) : <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px" }}>
        <p>Loading ..</p>
    </div>))
}