import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { DashboardPage } from './pages/DashboardPage'
import { MonitoringPage } from './pages/MonitoringPage'
import { TreatmentPage } from './pages/TreatmentPage'
import { AlertsPage } from './pages/AlertsPage'
import { RecordsPage } from './pages/RecordsPage'
import { DeviceHealthPage } from './pages/DeviceHealthPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/treatment" element={<TreatmentPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/device-health" element={<DeviceHealthPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  )
}
