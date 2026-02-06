import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ManageSICTransport from "./Pages/ManageSICTransport";
// Import your pages
import BranchSelection from "./Pages/BranchSelection";
import Dashboard from "./Pages/Dashboard";
import TravelBooking from "./Pages/TravelBooking";
import ManageHotels from "./Pages/ManageHotels";
import ManageActivities from "./Pages/ManageActivities";
import ManageTransport from "./Pages/ManageTransport";
import ManageVisas from "./Pages/ManageVisas";
import { ADMIN_USERS } from "@/utils/constants";
// Create a client for Data Fetching
const queryClient = new QueryClient();

// Admin list define kari chhe
// const adminUsers = ADMIN_USERS;

// Helper component to protect Admin routes
const AdminRoute = ({ children }) => {
  const userName = localStorage.getItem("userName");
  
  // બદલાવેલી લાઈન:
  if (!ADMIN_USERS.includes(userName)) {
    return <Navigate to="/Dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Main Landing / Login */}
          <Route path="/" element={<BranchSelection />} />
          <Route path="/BranchSelection" element={<BranchSelection />} />

          {/* Main App Pages */}
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/TravelBooking" element={<TravelBooking />} />

          {/* Management Pages - Only for PPnikunj and bbb */}
          <Route
            path="/ManageSICTransport"
            element={
              <AdminRoute>
                <ManageSICTransport />
              </AdminRoute>
            }
          />
          <Route
            path="/ManageHotels"
            element={
              <AdminRoute>
                <ManageHotels />
              </AdminRoute>
            }
          />
          <Route
            path="/ManageActivities"
            element={
              <AdminRoute>
                <ManageActivities />
              </AdminRoute>
            }
          />
          <Route
            path="/ManageTransport"
            element={
              <AdminRoute>
                <ManageTransport />
              </AdminRoute>
            }
          />
          <Route
            path="/ManageVisas"
            element={
              <AdminRoute>
                <ManageVisas />
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
