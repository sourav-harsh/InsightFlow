export const mockUpload = {
  data: {
    datasetId: "95b87d4e-9961-4343-959b-0086b080f027",
    filename: "employees.csv",
    jobId: "b3736da6-d428-4951-814e-7b38bfba369c",
    status: "UPLOADED",
    totalColumns: 6,
    totalRows: 10000,
  },
  error: null,
  timeStamp: "2026-08-11T12:17:01.535132262",
};

export const mockJob = {
  data: {
    jobId: "b3736da6-d428-4951-814e-7b38bfba369c",
    datasetId: "95b87d4e-9961-4343-959b-0086b080f027",
    status: "COMPLETED",
    retryCount: 1,
    startedAt: "2026-08-11T12:17:02.654237Z",
    completedAt: "2026-08-11T12:17:02.795061Z",
    failedAt: null,
    errorMessage: null,
    createdAt: "2026-08-11T12:17:01.505254Z",
  },
  error: null,
  timeStamp: "2026-08-11T12:17:17.950989338",
};

export const mockAnalytics = {
  data: {
    datasetId: "95b87d4e-9961-4343-959b-0086b080f027",
    rowCount: 10000,
    columnCount: 6,
    missingValueCount: 5969,
    invalidValueCount: 8195,
    qualityScore: 76.39,
    statistics: {
      dob: { type: "DATE", missingCount: 953, invalidCount: 0, qualityScore: 90.47, min: null, max: null, average: null },
      name: { type: "STRING", missingCount: 1017, invalidCount: 0, qualityScore: 89.83, min: null, max: null, average: null },
      email: { type: "EMAIL", missingCount: 939, invalidCount: 0, qualityScore: 90.61, min: null, max: null, average: null },
      salary: { type: "DECIMAL", missingCount: 976, invalidCount: 0, qualityScore: 90.24, min: 30013.0, max: 150000.0, average: 89994.34330673759 },
      contact: { type: "PHONE", missingCount: 1046, invalidCount: 8195, qualityScore: 7.59, min: null, max: null, average: null },
      designation: { type: "STRING", missingCount: 1038, invalidCount: 0, qualityScore: 89.62, min: null, max: null, average: null },
    },
    createdAt: "2026-08-11T12:17:02.771131",
  },
  error: null,
  timeStamp: "2026-08-11T12:18:25.928481634",
};

export const mockSummary = {
  data: {
    datasetId: "95b87d4e-9961-4343-959b-0086b080f027",
    rowCount: 10000,
    columnCount: 6,
    missingValueCount: 5969,
    qualityScore: 76.39,
    columnTypeDistribution: { DATE: 1, PHONE: 1, DECIMAL: 1, STRING: 2, EMAIL: 1 },
    healthyColumns: 5,
    problematicColumns: 1,
  },
  error: null,
  timeStamp: "2026-08-11T13:05:13.673060503",
};

export const mockColumn = (columnName) => {
  const s = mockAnalytics.data.statistics[columnName] || mockAnalytics.data.statistics.salary;
  return {
    data: { columnName, ...s },
    error: null,
    timeStamp: "2026-08-11T13:06:01.495513345",
  };
};

export const mockDatasets = [
  {
    datasetId: "95b87d4e-9961-4343-959b-0086b080f027",
    filename: "employees.csv",
    jobId: "b3736da6-d428-4951-814e-7b38bfba369c",
    status: "COMPLETED",
    totalColumns: 6,
    totalRows: 10000,
    qualityScore: 76.39,
    createdAt: "2026-08-11T12:17:01.505254Z",
  },
  {
    datasetId: "d5fdb1bb-de7e-4480-aea4-c61deb643bc6",
    filename: "customers_q3.csv",
    jobId: "0a52a1f1-1a1f-4d1a-9b0e-4a2c8f0f7a11",
    status: "COMPLETED",
    totalColumns: 9,
    totalRows: 42350,
    qualityScore: 91.2,
    createdAt: "2026-08-10T09:41:11.505254Z",
  },
  {
    datasetId: "7c1a4b1a-0a1c-4a4b-9d5e-2b7d3c9a1f22",
    filename: "transactions.csv",
    jobId: "9d2b7a10-77bf-4a1e-8b7d-1d0f2a3c4b55",
    status: "PROCESSING",
    totalColumns: 12,
    totalRows: 250000,
    qualityScore: null,
    createdAt: "2026-08-11T13:02:00.505254Z",
  },
];
