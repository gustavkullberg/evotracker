import { isMobile } from 'react-device-detect';
import { XAxis, YAxis, Bar, ComposedChart, ResponsiveContainer } from 'recharts';

const intToDay = (int) => {
    switch (int) {
        case "1": return "Monday";
        case "2": return "Tuesday";
        case "3": return "Wednesday";
        case "4": return "Thursday";
        case "5": return "Friday";
        case "6": return "Saturday";
        case "0": return "Sunday";
    }
}

export const WeekChart = ({ data, game }) => {
    const formattedData = data?.map(d => ({ day: intToDay(d.day), value: d.value })) || [];
    const sunday = formattedData?.shift();
    formattedData?.push(sunday);

    return <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "50px", marginBottom: "20px" }}>
        <h4>DAYS OF THE WEEK ANALYSIS</h4>
        <p>Average players, 6 Months</p>
        <p>{game}</p>
        {data && data.length > 0 ? <ResponsiveContainer width="100%" height={225}>
            <ComposedChart margin={{ left: 48, right: isMobile ? 30 : 80, top: 10, bottom: 10 }} data={formattedData} layout="vertical">
                <XAxis type="number" axisLine={false} hide={true} domain={[0, 'dataMax']} margin={{ left: 50 }} />
                <YAxis dataKey="day" type="category" />
                <Bar isAnimationActive={false} dataKey="value" stroke="black" fill="#1b2631" label={{ position: 'insideRight', fill: "white" }} />
            </ComposedChart>
        </ResponsiveContainer > : <div></div>}
    </div>
}