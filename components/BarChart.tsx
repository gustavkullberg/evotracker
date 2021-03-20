import { isMobile } from 'react-device-detect';
import { XAxis, YAxis, Tooltip, Bar, BarChart, ResponsiveContainer, CartesianGrid, Cell, LabelList } from 'recharts';
import moment from 'moment';
import '../styles/Home.module.css';
import React from 'react';


const renderCustomizedLabel = (props, selectedGameShow) => {
    const { x, y, width, index } = props;
    const radius = 8;
    return index === 32 && selectedGameShow === "All Shows" ? (
        <g>
            <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#1b2631" />
            <text x={x + width / 2} y={y - radius} fill="#fff" textAnchor="middle" dominantBaseline="middle">
                !
            </text>
        </g>
    ) : undefined;
};

export const Bars = ({ timeSeries, selectedFilter, isFetchingTimeSeries, selectedGameShow }): JSX.Element => {
    const [focusBar, setFocusBar] = React.useState(null);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: "white", margin: "0px", padding: "10px", border: "1px solid rgb(204, 204, 204)" }}>
                    <p className="label">{`${moment(label).format(selectedFilter.includes("Daily") ? 'ddd Do MMM' : 'HH:mm,  Do MMM')} `}</p>
                    <p>{`Players: ${payload[0].value}`} </p>
                    {new Date(label).toISOString().split("T")[0] === "2020-12-14" ?
                        <p style={{ color: "red" }} className="desc">More games tracked</p>
                        : undefined}
                </div>
            );
        }
        return null;
    };


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

                <Tooltip viewBox={{ x: 1000, y: 0, width: 800, height: 400 }} content={CustomTooltip} labelFormatter={(time: Date) => `${moment(time).format(selectedFilter.includes("Daily") ? 'ddd Do MMM' : 'HH:mm,  Do MMM')}`} />
                <Bar stackId="1" type="monotone" dataKey="players" stroke="black" fill="url(#evoblack)" >
                    {timeSeries.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={focusBar === index ? '#1b2631' : "url(#evoblack)"} />
                    ))}
                    <LabelList dataKey="hasMajorDataChange" position="top" content={(c) => renderCustomizedLabel(c, selectedGameShow)} />
                </Bar>



            </BarChart>
        </ResponsiveContainer >
    ) : <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px" }}>
            <p>Loading ..</p>
        </div>))
}