import { useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AppLayout } from '@/components/layout/AppLayout'
import { UrgencyBadge } from '@/components/ui/Badge'
import { mockProfiles, mockVehicles, mockServiceRequests } from '@/data/mockData'
import { formatDate, getCategoryConfig } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Calendar, User, MoreHorizontal, Plus, GripVertical } from 'lucide-react'
import type { ServiceRequest, RequestStatus } from '@/types'
import { useToast } from '@/components/ui/Toast'

const COLUMNS: { status: RequestStatus; label: string }[] = [
  { status: 'nouveau', label: 'Nouveau' },
  { status: 'analyse', label: 'Analyse' },
  { status: 'devis_en_cours', label: 'Devis en cours' },
  { status: 'en_attente_client', label: 'Attente client' },
  { status: 'planifie', label: 'Planifié' },
  { status: 'intervention_en_cours', label: 'En cours' },
  { status: 'termine', label: 'Terminé' },
]

const COL_ACCENT: Record<string, string> = {
  nouveau: '#60a5fa',
  analyse: '#a78bfa',
  devis_en_cours: '#fb923c',
  en_attente_client: '#fbbf24',
  planifie: '#34d399',
  intervention_en_cours: '#FF7700',
  termine: '#6ee7b7',
}

// ─── Draggable card ───────────────────────────────────────────────────────────

interface CardProps {
  req: ServiceRequest
  accent: string
  isDragging?: boolean
  overlay?: boolean
}

function KanbanCard({ req, accent, isDragging, overlay }: CardProps) {
  const client = mockProfiles.find(p => p.id === req.client_id)
  const vehicle = mockVehicles.find(v => v.id === req.vehicle_id)
  const cat = getCategoryConfig(req.category)
  const assignee = mockProfiles.find(p => p.id === req.assigned_team_member)
  const isUrgent = req.urgency === 'urgente'

  return (
    <Link
      to={`/internal/requests/${req.id}`}
      className="group relative block rounded-xl p-3.5 transition-all duration-150"
      style={{
        background: overlay ? '#1E1E1E' : '#161616',
        border: isUrgent ? '1px solid rgba(251,191,36,0.15)' : '1px solid rgba(255,255,255,0.05)',
        opacity: isDragging ? 0.4 : 1,
        boxShadow: overlay ? `0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px ${accent}30` : 'none',
        cursor: overlay ? 'grabbing' : 'grab',
      }}
      onClick={overlay ? e => e.preventDefault() : undefined}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full"
        style={{ background: accent, opacity: overlay ? 0.9 : 0.4 }}
      />

      <div className="pl-3">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{cat.icon}</span>
            <span className="text-[#444] text-[10px] font-semibold uppercase tracking-wide">{cat.label}</span>
          </div>
          <UrgencyBadge urgency={req.urgency} />
        </div>

        <p className="text-[#ccc] text-[13px] font-semibold leading-snug mb-3 group-hover:text-white transition-colors line-clamp-2">
          {req.title}
        </p>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <User size={9} className="text-[#444]" />
            </div>
            <p className="text-[#555] text-xs truncate">{client ? `${client.first_name} ${client.last_name}` : '—'}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[9px]" style={{ background: 'rgba(255,255,255,0.04)' }}>🚗</div>
            <p className="text-[#555] text-xs truncate">{vehicle ? `${vehicle.make} ${vehicle.model}` : '—'}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex items-center gap-1">
            <Calendar size={10} className="text-[#333]" />
            <p className="text-[#333] text-[10px]">{formatDate(req.created_at)}</p>
          </div>
          {assignee ? (
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF7700, #CC5500)', boxShadow: '0 1px 4px rgba(255,119,0,0.3)' }}>
              <span className="text-white text-[9px] font-black">{assignee.first_name[0]}{assignee.last_name[0]}</span>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)' }}>
              <User size={8} className="text-[#333]" />
            </div>
          )}
        </div>
      </div>

      {/* Drag handle (visible on hover) */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.preventDefault()}>
        <GripVertical size={13} className="text-[#444]" />
      </div>
    </Link>
  )
}

// ─── Sortable wrapper ─────────────────────────────────────────────────────────

function SortableCard({ req, accent }: { req: ServiceRequest; accent: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: req.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
    >
      <KanbanCard req={req} accent={accent} isDragging={isDragging} />
    </div>
  )
}

// ─── Drop zone column ─────────────────────────────────────────────────────────

function DroppableColumn({
  col,
  requests,
  isOver,
}: {
  col: { status: RequestStatus; label: string }
  requests: ServiceRequest[]
  isOver: boolean
}) {
  const accent = COL_ACCENT[col.status] ?? '#FF7700'
  const ids = requests.map(r => r.id)

  return (
    <div className="w-[268px] flex-shrink-0 flex flex-col">
      {/* Header */}
      <div
        className="rounded-2xl px-4 py-3 mb-3 flex items-center justify-between"
        style={{
          background: '#0D0D0D',
          border: '1px solid rgba(255,255,255,0.05)',
          borderTop: `2px solid ${accent}`,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full" style={{ background: accent, boxShadow: `0 0 6px ${accent}` }} />
          <span className="text-sm font-bold text-white">{col.label}</span>
        </div>
        <span
          className="text-xs font-black px-2 py-0.5 rounded-full min-w-[22px] text-center"
          style={{
            background: requests.length > 0 ? `${accent}20` : 'rgba(255,255,255,0.04)',
            color: requests.length > 0 ? accent : '#333',
          }}
        >
          {requests.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        className="flex-1 rounded-2xl p-2 min-h-[460px] transition-colors duration-150"
        style={{
          background: isOver ? `${accent}08` : '#0A0A0A',
          border: `1px solid ${isOver ? `${accent}30` : 'rgba(255,255,255,0.03)'}`,
        }}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {requests.map(req => (
              <SortableCard key={req.id} req={req} accent={accent} />
            ))}
            {requests.length === 0 && (
              <div
                className="m-1 rounded-xl p-6 text-center border-2 border-dashed transition-colors duration-150"
                style={{ borderColor: isOver ? `${accent}30` : 'rgba(255,255,255,0.04)' }}
              >
                <p className="text-[#252525] text-xs">Glisser une demande ici</p>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function KanbanPage() {
  const adminUser = mockProfiles.find(p => p.role === 'carcarry_admin')!
  const { success } = useToast()

  // Local state — indexed by request id → current status
  const [statusMap, setStatusMap] = useState<Record<string, RequestStatus>>(() =>
    Object.fromEntries(mockServiceRequests.map(r => [r.id, r.status]))
  )
  // Order within each column
  const [orderMap, setOrderMap] = useState<Record<RequestStatus, string[]>>(() => {
    const map: Record<string, string[]> = {}
    for (const col of COLUMNS) map[col.status] = []
    for (const r of mockServiceRequests) {
      if (!map[r.status]) map[r.status] = []
      map[r.status].push(r.id)
    }
    return map as Record<RequestStatus, string[]>
  })

  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const getColOfId = useCallback((id: string): RequestStatus | null => {
    for (const [status, ids] of Object.entries(orderMap)) {
      if (ids.includes(id)) return status as RequestStatus
    }
    return null
  }, [orderMap])

  const onDragStart = ({ active }: DragStartEvent) => setActiveId(active.id as string)

  const onDragOver = ({ over }: DragOverEvent) => setOverId(over?.id as string ?? null)

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null)
    setOverId(null)
    if (!over) return

    const activeReqId = active.id as string
    const overId = over.id as string

    const fromCol = getColOfId(activeReqId)
    // over.id could be a column status or another card id
    const toCol = (COLUMNS.find(c => c.status === overId)?.status ?? getColOfId(overId)) as RequestStatus | null

    if (!fromCol || !toCol) return

    if (fromCol === toCol) {
      // Reorder within same column
      const ids = orderMap[fromCol]
      const oldIdx = ids.indexOf(activeReqId)
      const newIdx = ids.indexOf(overId)
      if (oldIdx === newIdx) return
      setOrderMap(prev => ({
        ...prev,
        [fromCol]: arrayMove(ids, oldIdx, newIdx),
      }))
    } else {
      // Move to different column
      setStatusMap(prev => ({ ...prev, [activeReqId]: toCol }))
      setOrderMap(prev => {
        const from = prev[fromCol].filter(id => id !== activeReqId)
        const toIds = [...prev[toCol]]
        const insertIdx = toIds.indexOf(overId)
        toIds.splice(insertIdx >= 0 ? insertIdx : toIds.length, 0, activeReqId)
        return { ...prev, [fromCol]: from, [toCol]: toIds }
      })
      const colLabel = COLUMNS.find(c => c.status === toCol)?.label ?? toCol
      const req = mockServiceRequests.find(r => r.id === activeReqId)
      success(`"${req?.title?.slice(0, 30)}…" → ${colLabel}`)
    }
  }

  const activeReq = activeId ? mockServiceRequests.find(r => r.id === activeId) : null
  const activeAccent = activeReq ? COL_ACCENT[statusMap[activeReq.id]] ?? '#FF7700' : '#FF7700'

  return (
    <AppLayout user={adminUser} notificationCount={3}>
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Kanban des demandes
          </h1>
          <p className="text-[#444] text-sm">
            {mockServiceRequests.length} demandes · glisser-déposer pour changer le statut
          </p>
        </div>
        <Link to="/internal/requests/new">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #FF7700 0%, #CC5F00 100%)',
              boxShadow: '0 2px 12px rgba(255,119,0,0.25)',
            }}
          >
            <Plus size={15} />
            Nouvelle demande
          </button>
        </Link>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="overflow-x-auto pb-6 scrollbar-thin -mx-1 px-1">
          <div className="flex gap-3 min-w-max">
            {COLUMNS.map(col => {
              const ids = orderMap[col.status] ?? []
              const requests = ids
                .map(id => mockServiceRequests.find(r => r.id === id))
                .filter((r): r is ServiceRequest => !!r && statusMap[r.id] === col.status)
              const isOver = overId !== null && (
                overId === col.status || requests.some(r => r.id === overId)
              ) && activeId !== null && statusMap[activeId] !== col.status

              return (
                <DroppableColumn
                  key={col.status}
                  col={col}
                  requests={requests}
                  isOver={isOver}
                />
              )
            })}
          </div>
        </div>

        <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
          {activeReq && <KanbanCard req={activeReq} accent={activeAccent} overlay />}
        </DragOverlay>
      </DndContext>
    </AppLayout>
  )
}
