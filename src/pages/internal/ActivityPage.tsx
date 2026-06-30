import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { mockProfiles, mockActivityLogs } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import { Activity } from 'lucide-react'

export function ActivityPage() {
  const adminUser = mockProfiles.find(p => p.role === 'carcarry_admin')!

  const actionLabels: Record<string, string> = {
    status_changed: 'Statut modifié',
    partner_assigned: 'Partenaire assigné',
    created: 'Créé',
    completed: 'Terminé',
    updated: 'Mis à jour',
  }

  return (
    <AppLayout user={adminUser} notificationCount={3}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Journal d'activité</h1>
        <p className="text-[#B0B0B0] text-sm mt-1">Toutes les actions effectuées sur la plateforme</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-[#1E1E1E]">
            {[...mockActivityLogs].reverse().map(log => {
              const actor = mockProfiles.find(p => p.id === log.user_id)
              return (
                <div key={log.id} className="flex items-start gap-4 px-6 py-4">
                  <div className="flex-shrink-0 mt-0.5">
                    {actor ? (
                      <Avatar firstName={actor.first_name} lastName={actor.last_name} size="sm" />
                    ) : (
                      <div className="w-7 h-7 bg-[#272727] rounded-full flex items-center justify-center">
                        <Activity size={12} className="text-[#5A5A5A]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white text-sm font-medium">
                        {actor ? `${actor.first_name} ${actor.last_name}` : 'Système'}
                      </p>
                      <span className="bg-[#272727] text-[#B0B0B0] text-xs px-2 py-0.5 rounded-full border border-[#3A3A3A]">
                        {actionLabels[log.action] ?? log.action}
                      </span>
                    </div>
                    <p className="text-[#B0B0B0] text-sm mt-1">{log.details}</p>
                    <p className="text-[#3A3A3A] text-xs mt-1">{formatDate(log.created_at)}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-[#3A3A3A] text-xs capitalize">{log.entity_type.replace('_', ' ')}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
