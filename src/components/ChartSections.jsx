import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ChartSection = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('12M'); // UI state only

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/projects`);
                const projects = response.data;

                const months = [];
                const currentDate = new Date();
                
                // Generate last 12 months data skeleton
                for (let i = 11; i >= 0; i--) {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                    months.push({
                        name: date.toLocaleString('en-US', { month: 'short' }),
                        Planned: 0,
                        Ongoing: 0,
                        'On Hold': 0,
                        Completed: 0,
                    });
                }

                // Populate data
                projects.forEach(project => {
                    if (!project.startDate) return;
                    const startDate = new Date(project.startDate);
                    const monthYear = startDate.toLocaleString('en-US', { month: 'short' });
                    const monthIndex = months.findIndex(m => m.name === monthYear);

                    if (monthIndex !== -1) {
                        months[monthIndex][project.status] = (months[monthIndex][project.status] || 0) + 1;
                    }
                });

                setChartData(months);
            } catch (err) {
                // Fallback to empty data rather than crashing if API fails significantly
                console.error('Error fetching projects:', err);
                setError('Unable to load project trends.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) return (
        <div className="h-[400px] w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-[#4A90E2] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-400">Loading analytics...</span>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="h-[400px] w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-center">
             <div className="text-sm text-red-400 flex items-center gap-2">
                <span className="block w-2 h-2 bg-red-400 rounded-full"></span>
                {error}
             </div>
        </div>
    );

    // Custom Tooltip for ERP feel
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg ring-1 ring-black ring-opacity-5">
                    <p className="text-xs font-bold text-gray-900 mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-gray-500 min-w-[60px]">{entry.name}:</span>
                            <span className="font-mono font-medium text-gray-900">{entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Project Trends Analysis</h2>
                    <p className="text-xs text-gray-500 mt-1">Project initiation volume over time</p>
                </div>
                
                <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
                    {['6M', '12M', 'YTD'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                                timeRange === range 
                                    ? 'bg-white text-[#4A90E2] shadow-sm ring-1 ring-black ring-opacity-5' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorOngoing" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorHold" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#9ca3af', fontSize: 11 }} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#9ca3af', fontSize: 11 }} 
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }} />
                        <Legend 
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="circle"
                            formatter={(value) => <span className="text-xs font-medium text-gray-600 ml-1">{value}</span>}
                        />
                        
                        <Area type="monotone" dataKey="Planned" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#colorPlanned)" activeDot={{ r: 4, strokeWidth: 0 }} />
                        <Area type="monotone" dataKey="Ongoing" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorOngoing)" activeDot={{ r: 4, strokeWidth: 0 }} />
                        <Area type="monotone" dataKey="On Hold" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorHold)" activeDot={{ r: 4, strokeWidth: 0 }} />
                        <Area type="monotone" dataKey="Completed" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" activeDot={{ r: 4, strokeWidth: 0 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChartSection;