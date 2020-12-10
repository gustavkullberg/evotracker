import { isMobile } from 'react-device-detect';
import { XAxis, YAxis, Tooltip, Bar, BarChart, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import moment from 'moment';
import '../styles/Home.module.css';
import React from 'react';

export const Bars = ({ timeSeries, selectedFilter, isFetchingTimeSeries }): JSX.Element => {
    const [focusBar, setFocusBar] = React.useState(null);

    return ((timeSeries.length > 0 && !isFetchingTimeSeries ? (
        <ResponsiveContainer width="96%" height={isMobile ? 400 : 450}>
            <BarChart data={timeSeries} onMouseMove={state => {
                if (state.isTooltipActive) {
                    setFocusBar(state.activeTooltipIndex);
                } else {
                    setFocusBar(null);
                }
            }}>
                <XAxis
                    dataKey="timeStamp"
                    axisLine={false}
                    domain={['auto', 'auto']}
                    name="Time"
                    minTickGap={isMobile ? 16 : 100}
                    padding={{ left: isMobile ? 0 : 20, right: isMobile ? 0 : 20 }}
                    tickFormatter={unixTime => {
                        if (selectedFilter === '1D') return moment(unixTime).format('HH:mm');
                        else if (selectedFilter === '10D') return moment(unixTime).format(isMobile ? 'ddd' : 'ddd Do');
                        else if (selectedFilter === 'Daily Max') return moment(unixTime).format("MMM Do");
                        else if (selectedFilter === 'Daily Avg') return moment(unixTime).format("MMM Do");
                    }}
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

                <Tooltip viewBox={{ x: 1000, y: 0, width: 800, height: 400 }} labelFormatter={(time: Date) => `${moment(time).format(selectedFilter.includes("Daily") ? 'ddd Do MMM' : 'HH:mm,  Do MMM')}`} />
                <Bar stackId="1" type="monotone" dataKey="players" stroke="black" fill="url(#evoblack)" >
                    {timeSeries.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={isSameDayAsMarked(focusBar, index) ? '#1b2631' : "url(#evoblack)"} />
                    ))}
                </Bar>



            </BarChart>
        </ResponsiveContainer >
    ) : <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px" }}>
            <p>Loading ..</p>
        </div>))
}

const isSameDayAsMarked = (focusIndex: number, index: number): boolean => {
    const focusIndexRest = focusIndex % 7;
    const indexRest = index % 7;
    if (focusIndexRest === indexRest) {
        return true
    } else {
        return false
    }
}