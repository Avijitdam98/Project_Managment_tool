import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';
import axios from 'axios';
import { Card, Spin, Alert, Statistic, Typography, Row, Col, Progress, Space } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title: AntTitle } = Typography;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const defaultAnalyticsData = {
  tasksByStatus: {
    todo: 0,
    inProgress: 0,
    done: 0,
    blocked: 0,
  },
  tasksByPriority: {
    high: 0,
    medium: 0,
    low: 0,
  },
  tasksByColumn: {},
  columnTitles: [],
  totalTasks: 0,
  activeUsers: 0,
  averageTaskCompletion: 0,
  tasksDueSoon: 0,
  tasksWithDependencies: 0,
  timeAccuracy: 0,
  recentActivity: {
    completed: 0,
    inProgress: 0,
    blocked: 0
  }
};

const getColumnColor = (columnTitle) => {
  const title = columnTitle.toLowerCase();
  if (title.includes('todo') || title.includes('backlog')) return 'rgba(255, 206, 86, 0.7)';
  if (title.includes('progress')) return 'rgba(54, 162, 235, 0.7)';
  if (title.includes('done') || title.includes('completed')) return 'rgba(75, 192, 192, 0.7)';
  if (title.includes('blocked')) return 'rgba(255, 99, 132, 0.7)';
  return 'rgba(153, 102, 255, 0.7)';
};

const ProjectAnalytics = ({ projectId }) => {
  const [analyticsData, setAnalyticsData] = useState(defaultAnalyticsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!projectId) {
        setLoading(false);
        setAnalyticsData(defaultAnalyticsData);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/boards/${projectId}/analytics`);
        const data = {
          ...defaultAnalyticsData,
          ...response.data,
          tasksByStatus: {
            ...defaultAnalyticsData.tasksByStatus,
            ...(response.data.tasksByStatus || {})
          },
          tasksByPriority: {
            ...defaultAnalyticsData.tasksByPriority,
            ...(response.data.tasksByPriority || {})
          },
          tasksByColumn: response.data.tasksByColumn || {},
          columnTitles: response.data.columnTitles || [],
          recentActivity: {
            ...defaultAnalyticsData.recentActivity,
            ...(response.data.recentActivity || {})
          }
        };
        setAnalyticsData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [projectId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" tip="Loading analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <AntTitle level={2} style={{ marginBottom: '24px' }}>Project Analytics</AntTitle>
      
      {/* Overview Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Tasks"
              value={analyticsData.totalTasks}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={analyticsData.activeUsers}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tasks Due Soon"
              value={analyticsData.tasksDueSoon}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: analyticsData.tasksDueSoon > 5 ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Statistic
                title="Time Accuracy"
                value={analyticsData.timeAccuracy}
                suffix="%"
              />
              <Progress percent={analyticsData.timeAccuracy} status="active" />
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Tasks by Status">
            <div style={{ height: '300px' }}>
              <Bar
                data={{
                  labels: Object.keys(analyticsData.tasksByStatus),
                  datasets: [{
                    data: Object.values(analyticsData.tasksByStatus),
                    backgroundColor: [
                      'rgba(255, 206, 86, 0.7)',
                      'rgba(54, 162, 235, 0.7)',
                      'rgba(75, 192, 192, 0.7)',
                      'rgba(255, 99, 132, 0.7)'
                    ]
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  }
                }}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Tasks by Priority">
            <div style={{ height: '300px' }}>
              <Pie
                data={{
                  labels: Object.keys(analyticsData.tasksByPriority),
                  datasets: [{
                    data: Object.values(analyticsData.tasksByPriority),
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.7)',
                      'rgba(54, 162, 235, 0.7)',
                      'rgba(75, 192, 192, 0.7)'
                    ]
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false
                }}
              />
            </div>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Recent Activity">
            <div style={{ height: '300px' }}>
              <Line
                data={{
                  labels: ['Completed', 'In Progress', 'Blocked'],
                  datasets: [{
                    label: 'Tasks',
                    data: [
                      analyticsData.recentActivity.completed,
                      analyticsData.recentActivity.inProgress,
                      analyticsData.recentActivity.blocked
                    ],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProjectAnalytics;