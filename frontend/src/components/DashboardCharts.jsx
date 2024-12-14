import React, { useContext } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale
);

const DashboardCharts = ({ boards, isDark }) => {
    // Chart theme colors
    const theme = {
        text: isDark ? '#E5E7EB' : '#1F2937',
        grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        background: isDark ? '#111827' : '#FFFFFF',
        chartBackground: isDark ? '#1F2937' : '#FFFFFF',
        primary: {
            main: isDark ? 'rgba(59, 130, 246, 0.9)' : 'rgba(37, 99, 235, 0.8)',
            light: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.2)'
        },
        secondary: {
            main: isDark ? 'rgba(139, 92, 246, 0.9)' : 'rgba(124, 58, 237, 0.8)',
            light: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(124, 58, 237, 0.2)'
        },
        success: {
            main: isDark ? 'rgba(34, 197, 94, 0.9)' : 'rgba(16, 185, 129, 0.8)',
            light: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)'
        },
        warning: {
            main: isDark ? 'rgba(245, 158, 11, 0.9)' : 'rgba(245, 158, 11, 0.8)',
            light: isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.2)'
        }
    };

    // Calculate task completion data
    const taskCompletionData = boards.map(board => {
        const totalTasks = board.columns?.reduce((sum, col) => sum + (col.tasks?.length || 0), 0) || 0;
        const completedTasks = board.columns?.find(col => 
            col.title.toLowerCase().includes('done'))?.tasks?.length || 0;
        return {
            boardName: board.title,
            completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
        };
    });

    // Task distribution by status
    const tasksByStatus = boards.reduce((acc, board) => {
        board.columns?.forEach(column => {
            acc[column.title] = (acc[column.title] || 0) + (column.tasks?.length || 0);
        });
        return acc;
    }, {});

    // Task progress line chart data
    const lineChartData = {
        labels: taskCompletionData.map(item => item.boardName),
        datasets: [
            {
                label: 'Task Completion Rate (%)',
                data: taskCompletionData.map(item => item.completionRate),
                borderColor: theme.primary.main,
                backgroundColor: theme.primary.light,
                tension: 0.4,
                fill: true
            }
        ]
    };

    // Task distribution bar chart data
    const barChartData = {
        labels: Object.keys(tasksByStatus),
        datasets: [
            {
                label: 'Tasks by Status',
                data: Object.values(tasksByStatus),
                backgroundColor: [
                    theme.primary.main,
                    theme.secondary.main,
                    theme.success.main,
                    theme.warning.main
                ],
                borderColor: [
                    theme.primary.main,
                    theme.secondary.main,
                    theme.success.main,
                    theme.warning.main
                ],
                borderWidth: 1
            }
        ]
    };

    // Project health radar chart data
    const radarChartData = {
        labels: ['Task Progress', 'Team Activity', 'Deadline Adherence', 'Documentation', 'Code Quality'],
        datasets: [
            {
                label: 'Project Health Metrics',
                data: [85, 75, 90, 70, 80],
                backgroundColor: theme.secondary.light,
                borderColor: theme.secondary.main,
                pointBackgroundColor: theme.secondary.main,
                pointBorderColor: theme.background,
                pointHoverBackgroundColor: theme.background,
                pointHoverBorderColor: theme.secondary.main
            }
        ]
    };

    // Task priority distribution doughnut chart data
    const doughnutChartData = {
        labels: ['High', 'Medium', 'Low'],
        datasets: [
            {
                data: [30, 50, 20],
                backgroundColor: [
                    theme.warning.main,
                    theme.primary.main,
                    theme.success.main
                ],
                borderColor: [
                    theme.warning.main,
                    theme.primary.main,
                    theme.success.main
                ],
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: theme.text,
                    font: {
                        family: "'Inter', sans-serif",
                        weight: 500
                    },
                    padding: 20,
                    usePointStyle: true
                }
            },
            title: {
                display: false
            },
            tooltip: {
                backgroundColor: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                titleColor: isDark ? '#E5E7EB' : '#1F2937',
                bodyColor: isDark ? '#E5E7EB' : '#1F2937',
                borderColor: isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.3)',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += context.parsed.y || context.parsed || 0;
                        return ' ' + label;
                    }
                }
            }
        },
        scales: {
            r: {
                grid: {
                    color: isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.5)'
                },
                angleLines: {
                    color: isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.5)'
                },
                pointLabels: {
                    color: theme.text,
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12
                    }
                },
                ticks: {
                    color: theme.text,
                    backdropColor: 'transparent'
                }
            },
            x: {
                grid: {
                    color: isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.5)',
                    drawBorder: false
                },
                ticks: {
                    color: theme.text,
                    padding: 8,
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12
                    }
                }
            },
            y: {
                grid: {
                    color: isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.5)',
                    drawBorder: false
                },
                ticks: {
                    color: theme.text,
                    padding: 8,
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12
                    }
                }
            }
        },
        maintainAspectRatio: false,
        elements: {
            line: {
                tension: 0.4,
                borderWidth: 2,
                fill: true
            },
            point: {
                radius: 4,
                borderWidth: 2,
                hoverRadius: 6
            },
            bar: {
                borderWidth: 0,
                borderRadius: 4
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Task Progress Line Chart */}
            <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} p-6 rounded-xl shadow-lg border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    Task Completion Progress
                </h3>
                <div className="h-[300px]">
                    <Line data={lineChartData} options={chartOptions} />
                </div>
            </div>

            {/* Task Distribution Bar Chart */}
            <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} p-6 rounded-xl shadow-lg border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    Task Distribution
                </h3>
                <div className="h-[300px]">
                    <Bar data={barChartData} options={chartOptions} />
                </div>
            </div>

            {/* Project Health Radar Chart */}
            <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} p-6 rounded-xl shadow-lg border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    Project Health Overview
                </h3>
                <div className="h-[300px]">
                    <Radar data={radarChartData} options={chartOptions} />
                </div>
            </div>

            {/* Task Priority Doughnut Chart */}
            <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} p-6 rounded-xl shadow-lg border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    Task Priority Distribution
                </h3>
                <div className="h-[300px]">
                    <Doughnut data={doughnutChartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
