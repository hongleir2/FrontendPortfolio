import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import _ from "lodash";
import Papa from "papaparse";

// Main component for performance visualization
const PerformanceAnalysis = () => {
  const [recordingData, setRecordingData] = useState([]);
  const [generalData, setGeneralData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("data/Performance_2025-04-28.csv");
        const csvContent = await response.text();
        processData(csvContent);
      } catch (err) {
        console.error("Error loading CSV:", err);
        setError("Failed to load performance data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const processData = (csvContent) => {
    // Parse CSV
    const parseResult = Papa.parse(csvContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    const data = parseResult.data;

    // Filter and prepare data
    const recordingRows = data.filter(
      (row) => row.title && row.title.includes("Recording")
    );
    const generalRows = data.filter(
      (row) => row.title && row.title.includes("General")
    );

    // Format data with real elapsed time
    const formattedRecordingData = prepareDataWithRealTime(recordingRows, 5);
    const formattedGeneralData = prepareDataWithRealTime(generalRows, 30);

    setRecordingData(formattedRecordingData);
    setGeneralData(formattedGeneralData);
  };

  // Function to format data with real time intervals
  const prepareDataWithRealTime = (dataArr, intervalMinutes) => {
    if (!dataArr || dataArr.length === 0) return [];

    // Sort by timestamp
    const sortedData = [...dataArr].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Get the start time
    const startTime = new Date(sortedData[0].timestamp);

    // Add real time information
    return sortedData.map((entry, index) => {
      const currentTime = new Date(entry.timestamp);
      const realElapsedMinutes = index * intervalMinutes;
      const hours = Math.floor(realElapsedMinutes / 60);
      const minutes = realElapsedMinutes % 60;

      return {
        ...entry,
        realElapsedMinutes,
        timeLabel: `${hours}h${minutes.toString().padStart(2, "0")}`,
      };
    });
  };

  // Component for comparing process performance between recording and idle
  const ProcessComparison = ({ recordingData, generalData }) => {
    // Calculate averages for each process and metric
    const calculateAverage = (data, field) => {
      if (!data || data.length === 0) return 0;
      const values = data
        .map((item) => item[field])
        .filter((v) => v !== null && v !== undefined);
      return values.length > 0
        ? values.reduce((sum, val) => sum + val, 0) / values.length
        : 0;
    };

    // Prepare comparison data for CPU
    const cpuComparisonData = [
      {
        name: "Total",
        Recording: calculateAverage(recordingData, "performance.cpuTotal"),
        Idle: calculateAverage(generalData, "performance.cpuTotal"),
      },
      {
        name: "Main Process",
        Recording: calculateAverage(recordingData, "performance.cpuMain"),
        Idle: calculateAverage(generalData, "performance.cpuMain"),
      },
      {
        name: "Render Process",
        Recording: calculateAverage(recordingData, "performance.cpuRender"),
        Idle: calculateAverage(generalData, "performance.cpuRender"),
      },
      {
        name: "Swift Process",
        Recording: calculateAverage(recordingData, "performance.cpuSwift"),
        Idle: calculateAverage(generalData, "performance.cpuSwift"),
      },
    ];

    // Prepare comparison data for Memory
    const memComparisonData = [
      {
        name: "Total",
        Recording: calculateAverage(recordingData, "performance.memTotalGB"),
        Idle: calculateAverage(generalData, "performance.memTotalGB"),
      },
      {
        name: "Main Process",
        Recording: calculateAverage(recordingData, "performance.memMainGB"),
        Idle: calculateAverage(generalData, "performance.memMainGB"),
      },
      {
        name: "Render Process",
        Recording: calculateAverage(recordingData, "performance.memRenderGB"),
        Idle: calculateAverage(generalData, "performance.memRenderGB"),
      },
      {
        name: "Swift Process",
        Recording: calculateAverage(recordingData, "performance.memSwiftGB"),
        Idle: calculateAverage(generalData, "performance.memSwiftGB"),
      },
    ];

    return (
      <>
        {/* CPU Usage Comparison */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">
            CPU Usage: Recording vs Idle by Process
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cpuComparisonData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  label={{
                    value: "CPU Usage (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="Recording"
                  name="Recording"
                  fill="#ff7300"
                  barSize={40}
                />
                <Bar dataKey="Idle" name="Idle" fill="#0088fe" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Memory Usage Comparison */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">
            Memory Usage: Recording vs Idle by Process
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={memComparisonData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  label={{
                    value: "Memory Usage (GB)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip formatter={(value) => `${value.toFixed(2)} GB`} />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="Recording"
                  name="Recording"
                  fill="#ff7300"
                  barSize={40}
                />
                <Bar dataKey="Idle" name="Idle" fill="#0088fe" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </>
    );
  };

  if (isLoading)
    return <div className="text-center p-6">Loading performance data...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-6">
        Performance Monitoring Analysis
      </h1>

      {/* CPU Usage During Recording Sessions */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4">
          CPU Usage During Recording Sessions (5 min intervals)
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={recordingData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timeLabel"
                label={{
                  value: "Time Elapsed (h:mm)",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                label={{
                  value: "CPU Usage (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="performance.cpuTotal"
                name="Total CPU"
                stroke="#8884d8"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="performance.cpuMain"
                name="Main Process"
                stroke="#82ca9d"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="performance.cpuRender"
                name="Render Process"
                stroke="#ff7300"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="performance.cpuSwift"
                name="Swift Process"
                stroke="#0088fe"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Memory Usage During Recording Sessions */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4">
          Memory Usage During Recording Sessions (5 min intervals)
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={recordingData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timeLabel"
                label={{
                  value: "Time Elapsed (h:mm)",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                label={{
                  value: "Memory Usage (GB)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip formatter={(value) => `${value.toFixed(2)} GB`} />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="performance.memTotalGB"
                name="Total Memory"
                stroke="#8884d8"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="performance.memMainGB"
                name="Main Process"
                stroke="#82ca9d"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="performance.memRenderGB"
                name="Render Process"
                stroke="#ff7300"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="performance.memSwiftGB"
                name="Swift Process"
                stroke="#0088fe"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CPU Usage During General Monitoring */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4">
          CPU Usage During General Monitoring (30 min intervals)
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={generalData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timeLabel"
                label={{
                  value: "Time Elapsed (h:mm)",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                label={{
                  value: "CPU Usage (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="performance.cpuTotal"
                name="Total CPU"
                stroke="#8884d8"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="performance.cpuMain"
                name="Main Process"
                stroke="#82ca9d"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="performance.cpuRender"
                name="Render Process"
                stroke="#ff7300"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="performance.cpuSwift"
                name="Swift Process"
                stroke="#0088fe"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Memory Usage During General Monitoring */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4">
          Memory Usage During General Monitoring (30 min intervals)
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={generalData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timeLabel"
                label={{
                  value: "Time Elapsed (h:mm)",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                label={{
                  value: "Memory Usage (GB)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip formatter={(value) => `${value.toFixed(2)} GB`} />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="performance.memTotalGB"
                name="Total Memory"
                stroke="#8884d8"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="performance.memMainGB"
                name="Main Process"
                stroke="#82ca9d"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="performance.memRenderGB"
                name="Render Process"
                stroke="#ff7300"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="performance.memSwiftGB"
                name="Swift Process"
                stroke="#0088fe"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Process Comparison Charts */}
      <h2 className="text-lg font-semibold mb-4">
        Recording vs Idle Comparison by Process
      </h2>
      <ProcessComparison
        recordingData={recordingData}
        generalData={generalData}
      />

      {/* Summary and Insights */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Key Insights:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Recording sessions show higher average CPU usage (24.03%) compared
            to idle monitoring (19.68%)
          </li>
          <li>
            The render process (Angular webapp) is the most resource-intensive
            component in both modes
          </li>
          <li>
            Memory usage is relatively stable across recording and general
            monitoring
          </li>
          <li>
            Swift app shows consistent low memory usage (0.07GB avg during
            recording)
          </li>
          <li>CPU usage spikes are more common during recording sessions</li>
          <li>
            Main process CPU usage is slightly higher during idle time (3.22%)
            than recording (2.43%)
          </li>
          <li>
            Render process memory consumption is notably higher during idle time
            (1.19GB) than recording (0.88GB)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceAnalysis;
