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
  const [datasets, setDatasets] = useState([]);
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(true);

  // Fetch available datasets from the data directory
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setIsLoadingDatasets(true);
        // In a real application, you would have an API endpoint to list available datasets
        // For now, we'll use a hardcoded list or you could create a JSON file with the list
        const datasetList = [
          "M4-Pro-24G-RAM-4h-Recording.csv",
          "Intel-I7-4h-Recording.csv",
          "M4-16G-RAM-4h-Recording.csv",
        ];
        setDatasets(datasetList);
        setIsLoadingDatasets(false);
      } catch (err) {
        console.error("Error fetching datasets:", err);
        setIsLoadingDatasets(false);
      }
    };

    fetchDatasets();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Performance Monitoring Comparison Dashboard
      </h1>

      {isLoadingDatasets ? (
        <div className="text-center p-6">Loading available datasets...</div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          <DatasetAnalysis
            datasets={datasets}
            initialDataset={datasets[0] || ""}
            columnId="left"
          />
          <DatasetAnalysis
            datasets={datasets}
            initialDataset={datasets[1] || datasets[0] || ""}
            columnId="right"
          />
        </div>
      )}
    </div>
  );
};

// Component for a single dataset analysis column
const DatasetAnalysis = ({ datasets, initialDataset, columnId }) => {
  const [recordingData, setRecordingData] = useState([]);
  const [generalData, setGeneralData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDataset, setSelectedDataset] = useState(initialDataset);
  const [insights, setInsights] = useState([]);

  // Load the selected dataset
  useEffect(() => {
    if (!selectedDataset) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`data/${selectedDataset}`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch CSV: ${response.status} ${response.statusText}`
          );
        }

        const csvContent = await response.text();
        processData(csvContent);
      } catch (err) {
        console.error("Error loading CSV:", err);
        setError(`Failed to load performance data: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedDataset]);

  // Process CSV data
  const processData = (csvContent) => {
    // Parse CSV
    const parseResult = Papa.parse(csvContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    const data = parseResult.data;

    // Filter and prepare data
    const recordingRows = data.filter((row) =>
      row.title?.includes("Recording")
    );
    const generalRows = data.filter((row) => row.title?.includes("General"));

    // Format data with real elapsed time
    const formattedRecordingData = prepareDataWithRealTime(recordingRows, 5);
    const formattedGeneralData = prepareDataWithRealTime(generalRows, 30);

    setRecordingData(formattedRecordingData);
    setGeneralData(formattedGeneralData);

    // Generate insights based on the data
    generateInsights(formattedRecordingData, formattedGeneralData);
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

  // Generate dynamic insights based on the data
  const generateInsights = (recordingData, generalData) => {
    const calculateAverage = (data, field) => {
      if (!data || data.length === 0) return 0;
      const values = data
        .map((item) => item[field])
        .filter((v) => v !== null && v !== undefined);
      return values.length > 0
        ? values.reduce((sum, val) => sum + val, 0) / values.length
        : 0;
    };

    // Calculate key metrics
    const avgRecordingCPU = calculateAverage(
      recordingData,
      "performance.cpuTotal"
    ).toFixed(2);
    const avgIdleCPU = calculateAverage(
      generalData,
      "performance.cpuTotal"
    ).toFixed(2);
    const avgRenderRecordingCPU = calculateAverage(
      recordingData,
      "performance.cpuRender"
    ).toFixed(2);
    const avgRenderIdleCPU = calculateAverage(
      generalData,
      "performance.cpuRender"
    ).toFixed(2);
    const avgMainRecordingCPU = calculateAverage(
      recordingData,
      "performance.cpuMain"
    ).toFixed(2);
    const avgMainIdleCPU = calculateAverage(
      generalData,
      "performance.cpuMain"
    ).toFixed(2);
    const avgSwiftRecordingMem = calculateAverage(
      recordingData,
      "performance.memSwiftGB"
    ).toFixed(2);
    const avgRenderRecordingMem = calculateAverage(
      recordingData,
      "performance.memRenderGB"
    ).toFixed(2);
    const avgRenderIdleMem = calculateAverage(
      generalData,
      "performance.memRenderGB"
    ).toFixed(2);

    // Generate dynamic insights
    const dynamicInsights = [
      `Recording sessions show ${
        avgRecordingCPU > avgIdleCPU ? "higher" : "lower"
      } average CPU usage (${avgRecordingCPU}%) compared to idle monitoring (${avgIdleCPU}%)`,
      "The render process (Angular webapp) is the most resource-intensive component in both modes",
      `Memory usage is ${
        Math.abs(avgRenderRecordingMem - avgRenderIdleMem) < 0.2
          ? "relatively stable"
          : "variable"
      } across recording and general monitoring`,
      `Swift app shows ${
        avgSwiftRecordingMem < 0.1 ? "consistent low" : "moderate"
      } memory usage (${avgSwiftRecordingMem}GB avg during recording)`,
      `Main process CPU usage is ${
        avgMainIdleCPU > avgMainRecordingCPU ? "higher" : "lower"
      } during idle time (${avgMainIdleCPU}%) than recording (${avgMainRecordingCPU}%)`,
      `Render process memory consumption is ${
        avgRenderIdleMem > avgRenderRecordingMem ? "higher" : "lower"
      } during idle time (${avgRenderIdleMem}GB) than recording (${avgRenderRecordingMem}GB)`,
    ];

    setInsights(dynamicInsights);
  };

  // Dataset selector component
  const DatasetSelector = () => {
    const handleChange = (e) => {
      setSelectedDataset(e.target.value);
    };

    return (
      <div className="mb-6">
        <label
          htmlFor={`dataset-select-${columnId}`}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Performance Dataset:
        </label>
        <select
          id={`dataset-select-${columnId}`}
          value={selectedDataset}
          onChange={handleChange}
          className="block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {datasets.map((dataset) => (
            <option key={dataset} value={dataset}>
              {dataset}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Reusable chart component for CPU & Memory time-series
  const PerformanceChart = ({
    data,
    title,
    yAxisLabel,
    valueFormatter,
    metricType,
    height = "h-52",
  }) => {
    return (
      <div className="mb-6">
        <h3 className="text-base font-semibold mb-2">{title}</h3>
        <div className={height}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timeLabel"
                tick={{ fontSize: 10 }}
                label={{
                  value: "Time Elapsed",
                  position: "insideBottom",
                  offset: -5,
                  fontSize: 10,
                }}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                label={{
                  value: yAxisLabel,
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 10,
                }}
              />
              <Tooltip formatter={(value) => valueFormatter(value)} />
              <Legend
                verticalAlign="top"
                height={20}
                wrapperStyle={{ fontSize: 10 }}
              />
              <Line
                type="monotone"
                dataKey={
                  metricType === "cpu"
                    ? "performance.cpuTotal"
                    : "performance.memTotalGB"
                }
                name="Total"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey={
                  metricType === "cpu"
                    ? "performance.cpuMain"
                    : "performance.memMainGB"
                }
                name="Main Process"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey={
                  metricType === "cpu"
                    ? "performance.cpuRender"
                    : "performance.memRenderGB"
                }
                name="Render Process"
                stroke="#ff7300"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey={
                  metricType === "cpu"
                    ? "performance.cpuSwift"
                    : "performance.memSwiftGB"
                }
                name="Swift Process"
                stroke="#0088fe"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Reusable component for comparison bar charts
  const ComparisonChart = ({
    data,
    title,
    yAxisLabel,
    valueFormatter,
    height = "h-52",
  }) => {
    return (
      <div className="mb-6">
        <h3 className="text-base font-semibold mb-2">{title}</h3>
        <div className={height}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis
                tick={{ fontSize: 10 }}
                label={{
                  value: yAxisLabel,
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 10,
                }}
              />
              <Tooltip formatter={(value) => valueFormatter(value)} />
              <Legend
                verticalAlign="top"
                height={20}
                wrapperStyle={{ fontSize: 10 }}
              />
              <Bar
                dataKey="Recording"
                name="Recording"
                fill="#ff7300"
                barSize={20}
              />
              <Bar dataKey="Idle" name="Idle" fill="#0088fe" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Calculate averages for comparison data
  const calculateAverage = (data, field) => {
    if (!data || data.length === 0) return 0;
    const values = data
      .map((item) => item[field])
      .filter((v) => v !== null && v !== undefined);
    return values.length > 0
      ? values.reduce((sum, val) => sum + val, 0) / values.length
      : 0;
  };

  // Prepare CPU comparison data
  const cpuComparisonData = [
    {
      name: "Total",
      Recording: calculateAverage(recordingData, "performance.cpuTotal"),
      Idle: calculateAverage(generalData, "performance.cpuTotal"),
    },
    {
      name: "Main",
      Recording: calculateAverage(recordingData, "performance.cpuMain"),
      Idle: calculateAverage(generalData, "performance.cpuMain"),
    },
    {
      name: "Render",
      Recording: calculateAverage(recordingData, "performance.cpuRender"),
      Idle: calculateAverage(generalData, "performance.cpuRender"),
    },
    {
      name: "Swift",
      Recording: calculateAverage(recordingData, "performance.cpuSwift"),
      Idle: calculateAverage(generalData, "performance.cpuSwift"),
    },
  ];

  // Prepare Memory comparison data
  const memComparisonData = [
    {
      name: "Total",
      Recording: calculateAverage(recordingData, "performance.memTotalGB"),
      Idle: calculateAverage(generalData, "performance.memTotalGB"),
    },
    {
      name: "Main",
      Recording: calculateAverage(recordingData, "performance.memMainGB"),
      Idle: calculateAverage(generalData, "performance.memMainGB"),
    },
    {
      name: "Render",
      Recording: calculateAverage(recordingData, "performance.memRenderGB"),
      Idle: calculateAverage(generalData, "performance.memRenderGB"),
    },
    {
      name: "Swift",
      Recording: calculateAverage(recordingData, "performance.memSwiftGB"),
      Idle: calculateAverage(generalData, "performance.memSwiftGB"),
    },
  ];

  if (isLoading && !recordingData.length)
    return (
      <div className="w-full md:w-1/2 p-4 border rounded-lg bg-white">
        <DatasetSelector />
        <div className="text-center p-6">Loading performance data...</div>
      </div>
    );

  return (
    <div className="w-full md:w-1/2 p-4 border rounded-lg bg-white shadow">
      <DatasetSelector />

      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
          <div className="p-2 rounded-lg">Loading dataset...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      )}

      <h2 className="text-lg font-semibold mb-4 text-center">
        {selectedDataset}
      </h2>

      {/* CPU Usage Charts */}
      <PerformanceChart
        data={recordingData}
        title="CPU Usage - Recording (5 min intervals)"
        yAxisLabel="CPU Usage (%)"
        valueFormatter={(value) => `${value.toFixed(2)}%`}
        metricType="cpu"
      />

      <PerformanceChart
        data={generalData}
        title="CPU Usage - Idle (30 min intervals)"
        yAxisLabel="CPU Usage (%)"
        valueFormatter={(value) => `${value.toFixed(2)}%`}
        metricType="cpu"
      />

      {/* Memory Usage Charts */}
      <PerformanceChart
        data={recordingData}
        title="Memory Usage - Recording (5 min intervals)"
        yAxisLabel="Memory (GB)"
        valueFormatter={(value) => `${value.toFixed(2)} GB`}
        metricType="memory"
      />

      <PerformanceChart
        data={generalData}
        title="Memory Usage - Idle (30 min intervals)"
        yAxisLabel="Memory (GB)"
        valueFormatter={(value) => `${value.toFixed(2)} GB`}
        metricType="memory"
      />

      {/* Comparison Charts */}
      <ComparisonChart
        data={cpuComparisonData}
        title="CPU Usage: Recording vs Idle"
        yAxisLabel="CPU Usage (%)"
        valueFormatter={(value) => `${value.toFixed(2)}%`}
      />

      <ComparisonChart
        data={memComparisonData}
        title="Memory Usage: Recording vs Idle"
        yAxisLabel="Memory (GB)"
        valueFormatter={(value) => `${value.toFixed(2)} GB`}
      />

      {/* Summary and Insights */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="text-base font-semibold mb-2">Key Insights:</h3>
        <ul className="list-disc pl-4 text-sm space-y-1">
          {insights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PerformanceAnalysis;
