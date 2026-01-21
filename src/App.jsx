import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ManageSICTransport from "./Pages/ManageSICTransport";
// Import your pages
import BranchSelection from './Pages/BranchSelection';
import Dashboard from './Pages/Dashboard';
import TravelBooking from './Pages/TravelBooking';
import ManageHotels from './Pages/ManageHotels';
import ManageActivities from './Pages/ManageActivities';
import ManageTransport from './Pages/ManageTransport';
import ManageVisas from './Pages/ManageVisas';

// Create a client for Data Fetching
const queryClient = new QueryClient();

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
          <Route path="/ManageSICTransport" element={<ManageSICTransport />} />
          {/* Management Pages */}
          <Route path="/ManageHotels" element={<ManageHotels />} />
          <Route path="/ManageActivities" element={<ManageActivities />} />
          <Route path="/ManageTransport" element={<ManageTransport />} />
          <Route path="/ManageVisas" element={<ManageVisas />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;