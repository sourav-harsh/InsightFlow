import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./utils/AppLayout";
import { ProtectedRoute, PublicOnlyRoute } from "./utils/ProtectedRoute";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Upload from "./pages/Upload/Upload";
import Datasets from "./pages/Datasets/Datasets";
import DatasetDetail from "./pages/DatasetDetail/DatasetDetail";
import ColumnDetail from "./pages/ColumnDetail/ColumnDetail";
import Settings from "./pages/Settings/Settings";
import NotFound from "./pages/NotFound/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Public — only visible when signed out */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Private — requires a valid access token */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/datasets" element={<Datasets />} />
          <Route path="/datasets/:datasetId" element={<DatasetDetail />} />
          <Route path="/datasets/:datasetId/columns/:columnName" element={<ColumnDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
