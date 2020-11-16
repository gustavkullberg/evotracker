import { isMobile } from 'react-device-detect';
import { XAxis, YAxis, Tooltip, AreaChart, Area, Text, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import moment from 'moment';
import '../styles/Home.module.css';

export const Chart = ({ timeSeries, selectedGameShow, selectedFilter }) => {
    return ((timeSeries.length > 0 ? (
        <ResponsiveContainer width="96%" height={isMobile ? 400 : 450}>
            <AreaChart data={timeSeries} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis
                    dataKey="timeStamp"
                    domain={['auto', 'auto']}
                    name="Time"
                    tickFormatter={unixTime => {
                        if (selectedFilter === '1D') return moment(unixTime).format('HH:mm');
                        else if (selectedFilter === '7D') return moment(unixTime).format('Do MMM');
                        else if (selectedFilter === 'Daily') return moment(unixTime).format("MMM'YY");
                    }}
                    type="number"
                    scale="time"
                />
                <CartesianGrid stroke="#2c3e50" vertical={false} strokeDasharray="6 6" />
                <YAxis
                    type="number"
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
                <Tooltip labelFormatter={time => `${moment(time).format('HH:mm, Do MMM')}`} />
                {selectedGameShow === 'ALL_SHOWS' && (
                    <Legend iconType="square" height={36} />
                )}
                {selectedGameShow === 'ALL_SHOWS' && (
                    <Area type="monotone" dataKey="Crazy Time" stackId="1" stroke="brown" fill="brown" name="Crazy Time" />
                )}
                {selectedGameShow === 'ALL_SHOWS' && (
                    <Area
                        type="monotone"
                        dataKey="Lightning Roulette"
                        stackId="1"
                        stroke="#cc9900"
                        fill="#cc9900"
                        name="Roulette"
                    />
                )}
                {selectedGameShow === 'ALL_SHOWS' && (
                    <Area
                        type="monotone"
                        dataKey="MONOPOLY Live"
                        stackId="1"
                        stroke="#18bc9c"
                        fill="#18bc9c"
                        name="Monopoly"
                    />
                )}
                {selectedGameShow === 'ALL_SHOWS' && (
                    <Area
                        type="monotone"
                        dataKey="Mega Ball"
                        stackId="1"
                        stroke="#a991d4"
                        fill="#a991d4"
                        name="Mega Ball"
                    />
                )}
                {selectedGameShow === 'ALL_SHOWS' && (
                    <Area
                        type="monotone"
                        dataKey="Dream Catcher"
                        stackId="1"
                        stroke="#3498db"
                        fill="#3498db"
                        name="Dream Catcher"
                    />
                )}
                {selectedGameShow === 'ALL_SHOWS' && (
                    <Area
                        type="monotone"
                        dataKey="Speed Baccarat A"
                        stackId="1"
                        stroke="#000000"
                        fill="#000000"
                        name="Speed Baccarat A"
                    />
                )}
                {selectedGameShow === 'ALL_SHOWS' && (
                    <Area
                        type="monotone"
                        dataKey="Speed Baccarat B"
                        stackId="1"
                        stroke="#1a1a1a"
                        fill="#1a1a1a"
                        name="Speed Baccarat B"
                    />
                )}
                {selectedGameShow === 'ALL_SHOWS' && (
                    <Area
                        type="monotone"
                        dataKey="Lightning Baccarat"
                        stackId="1"
                        stroke="#333333"
                        fill="#333333"
                        name="Lightning Baccarat"
                    />
                )}
                {selectedGameShow === 'ALL_SHOWS' && (
                    <Area
                        type="monotone"
                        dataKey="Super Sic Bo"
                        stackId="1"
                        stroke="#4d4d4d"
                        fill="#4d4d4d"
                        name="Super Sic Bo"
                    />
                )}
                {selectedGameShow !== 'ALL_SHOWS' && (
                    <Area type="monotone" dataKey="players" stroke="black" fill="url(#evoblack)" />
                )}
            </AreaChart>
        </ResponsiveContainer >
    ) : <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px" }}>
            <p>Loading ..</p>
        </div>))
}