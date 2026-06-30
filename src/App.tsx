import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Auth
import { LoginPage } from '@/pages/auth/LoginPage'

// Client
import { ClientDashboard } from '@/pages/client/ClientDashboard'
import { VehiclesPage } from '@/pages/client/VehiclesPage'
import { AddVehiclePage } from '@/pages/client/AddVehiclePage'
import { VehicleDetailPage } from '@/pages/client/VehicleDetailPage'
import { RequestsPage } from '@/pages/client/RequestsPage'
import { NewRequestPage } from '@/pages/client/NewRequestPage'
import { RequestDetailPage } from '@/pages/client/RequestDetailPage'
import { ProfilePage } from '@/pages/client/ProfilePage'
import { HistoryPage } from '@/pages/client/HistoryPage'

// Internal
import { InternalDashboard } from '@/pages/internal/InternalDashboard'
import { InternalRequestsPage } from '@/pages/internal/InternalRequestsPage'
import { InternalRequestDetailPage } from '@/pages/internal/InternalRequestDetailPage'
import { KanbanPage } from '@/pages/internal/KanbanPage'
import { ClientsPage } from '@/pages/internal/ClientsPage'
import { InternalClientDetailPage } from '@/pages/internal/InternalClientDetailPage'
import { InternalVehiclesPage } from '@/pages/internal/InternalVehiclesPage'
import { VehicleDetailPage as InternalVehicleDetailPage } from '@/pages/client/VehicleDetailPage'
import { PartnersPage } from '@/pages/internal/PartnersPage'
import { InternalPartnerDetailPage } from '@/pages/internal/InternalPartnerDetailPage'
import { InternalInterventionsPage } from '@/pages/internal/InternalInterventionsPage'
import { InternalDocumentsPage } from '@/pages/internal/InternalDocumentsPage'
import { ActivityPage } from '@/pages/internal/ActivityPage'
import { AnalyticsPage } from '@/pages/internal/AnalyticsPage'

// Partner
import { PartnerDashboard } from '@/pages/partner/PartnerDashboard'
import { PartnerMissionDetailPage } from '@/pages/partner/PartnerMissionDetailPage'
import { PartnerDocumentsPage } from '@/pages/partner/PartnerDocumentsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<LoginPage />} />

        {/* ── CLIENT ── */}
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/client/vehicles" element={<VehiclesPage />} />
        <Route path="/client/vehicles/new" element={<AddVehiclePage />} />
        <Route path="/client/vehicles/:id" element={<VehicleDetailPage />} />
        <Route path="/client/requests" element={<RequestsPage />} />
        <Route path="/client/requests/new" element={<NewRequestPage />} />
        <Route path="/client/requests/:id" element={<RequestDetailPage />} />
        <Route path="/client/history" element={<HistoryPage />} />
        <Route path="/client/profile" element={<ProfilePage />} />

        {/* ── INTERNAL ── */}
        <Route path="/internal" element={<InternalDashboard />} />
        <Route path="/internal/requests" element={<InternalRequestsPage />} />
        <Route path="/internal/requests/:id" element={<InternalRequestDetailPage />} />
        <Route path="/internal/kanban" element={<KanbanPage />} />
        <Route path="/internal/clients" element={<ClientsPage />} />
        <Route path="/internal/clients/:id" element={<InternalClientDetailPage />} />
        <Route path="/internal/vehicles" element={<InternalVehiclesPage />} />
        <Route path="/internal/vehicles/:id" element={<InternalVehicleDetailPage />} />
        <Route path="/internal/partners" element={<PartnersPage />} />
        <Route path="/internal/partners/:id" element={<InternalPartnerDetailPage />} />
        <Route path="/internal/interventions" element={<InternalInterventionsPage />} />
        <Route path="/internal/documents" element={<InternalDocumentsPage />} />
        <Route path="/internal/activity" element={<ActivityPage />} />
        <Route path="/internal/analytics" element={<AnalyticsPage />} />

        {/* ── PARTNER ── */}
        <Route path="/partner" element={<PartnerDashboard />} />
        <Route path="/partner/missions/:id" element={<PartnerMissionDetailPage />} />
        <Route path="/partner/documents" element={<PartnerDocumentsPage />} />

        {/* Default */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
