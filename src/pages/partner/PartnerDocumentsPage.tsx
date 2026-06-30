import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { Profile } from '@/types'
import {
  FileText, Upload, Download, Eye, ChevronRight, FolderOpen, Shield
} from 'lucide-react'

const partnerUser: Profile = {
  id: 'partner-1',
  role: 'partner',
  first_name: 'Pierre',
  last_name: 'Dupuis',
  phone: '+41 26 123 45 67',
  email: 'contact@dupuis-garage.ch',
  city: 'Fribourg',
  postal_code: '1700',
  canton: 'FR',
  created_at: '2023-12-01T08:00:00Z',
}

type DocStatus = 'valide' | 'en_attente' | 'expire'

interface PartnerDoc {
  id: string
  name: string
  category: string
  size: string
  date: string
  status: DocStatus
  expiry?: string
}

const MOCK_DOCS: PartnerDoc[] = [
  {
    id: 'doc-1',
    name: 'Contrat partenariat CarCarry 2024',
    category: 'Contrat',
    size: '420Ko',
    date: '2024-01-10',
    status: 'valide',
    expiry: '2025-12-31',
  },
  {
    id: 'doc-2',
    name: 'Certificat RC professionnelle',
    category: 'Assurance',
    size: '285Ko',
    date: '2024-03-01',
    status: 'valide',
    expiry: '2025-03-01',
  },
  {
    id: 'doc-3',
    name: 'Extrait RCS entreprise',
    category: 'Légal',
    size: '190Ko',
    date: '2023-12-15',
    status: 'valide',
  },
  {
    id: 'doc-4',
    name: 'Tarifs & prestations 2024',
    category: 'Commercial',
    size: '540Ko',
    date: '2024-01-05',
    status: 'valide',
  },
  {
    id: 'doc-5',
    name: 'Procédure qualité CarCarry',
    category: 'Procédure',
    size: '820Ko',
    date: '2024-02-20',
    status: 'valide',
  },
]

const MISSION_DOCS: Array<{ id: string; name: string; mission: string; type: string; date: string; size: string }> = [
  {
    id: 'mdoc-1',
    name: 'Rapport d\'intervention — BMW 530d',
    mission: 'Remplacement disques/plaquettes de frein',
    type: 'Rapport',
    date: '2024-11-25',
    size: '320Ko',
  },
  {
    id: 'mdoc-2',
    name: 'Facture finale #F-2024-089',
    mission: 'Remplacement disques/plaquettes de frein',
    type: 'Facture',
    date: '2024-11-25',
    size: '180Ko',
  },
  {
    id: 'mdoc-3',
    name: 'Devis révision annuelle #D-2025-002',
    mission: 'Révision annuelle BMW 530d',
    type: 'Devis',
    date: '2025-01-08',
    size: '215Ko',
  },
]

const statusConfig: Record<DocStatus, { label: string; color: string; bg: string }> = {
  valide: { label: 'Valide', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  en_attente: { label: 'En attente', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  expire: { label: 'Expiré', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
}

export function PartnerDocumentsPage() {
  return (
    <AppLayout user={partnerUser} notificationCount={1}>
      <div className="mb-8">
        <p className="text-[#B0B0B0] text-sm mb-1">Espace partenaire</p>
        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Documents
        </h1>
        <p className="text-[#5A5A5A] text-sm">Gérez vos documents contractuels et vos dossiers de missions.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Partner documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-[#FF7700]" />
                  <CardTitle>Documents contractuels</CardTitle>
                </div>
                <Button variant="secondary"  className="gap-2">
                  <Upload size={14} />
                  Déposer
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#1E1E1E]">
                {MOCK_DOCS.map(doc => {
                  const scfg = statusConfig[doc.status]
                  return (
                    <div key={doc.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#1E1E1E] transition-colors group">
                      <div className="w-9 h-9 bg-[#272727] rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-[#5A5A5A]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="gray" >{doc.category}</Badge>
                          <span className="text-[#3A3A3A] text-xs">{doc.size}</span>
                          <span className="text-[#3A3A3A] text-xs">·</span>
                          <span className="text-[#3A3A3A] text-xs">{doc.date}</span>
                        </div>
                        {doc.expiry && (
                          <p className="text-[#3A3A3A] text-xs mt-0.5">Expire le {doc.expiry}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${scfg.bg} ${scfg.color}`}>
                          {scfg.label}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 hover:bg-[#2E2E2E] rounded text-[#B0B0B0] hover:text-white transition-colors">
                            <Eye size={14} />
                          </button>
                          <button className="p-1.5 hover:bg-[#2E2E2E] rounded text-[#B0B0B0] hover:text-white transition-colors">
                            <Download size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Mission documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FolderOpen size={16} className="text-[#FF7700]" />
                <CardTitle>Documents de missions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#1E1E1E]">
                {MISSION_DOCS.map(doc => (
                  <div key={doc.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#1E1E1E] transition-colors group">
                    <div className="w-9 h-9 bg-[#272727] rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={16} className="text-[#FF7700]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-[#5A5A5A] text-xs mt-0.5 truncate">{doc.mission}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="orange" >{doc.type}</Badge>
                        <span className="text-[#3A3A3A] text-xs">{doc.size}</span>
                        <span className="text-[#3A3A3A] text-xs">·</span>
                        <span className="text-[#3A3A3A] text-xs">{doc.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-[#2E2E2E] rounded text-[#B0B0B0] hover:text-white transition-colors">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 hover:bg-[#2E2E2E] rounded text-[#B0B0B0] hover:text-white transition-colors">
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Upload zone */}
          <Card>
            <CardContent className="pt-6">
              <div className="border-2 border-dashed border-[#2E2E2E] hover:border-[#FF7700]/30 rounded-xl p-6 text-center transition-colors cursor-pointer group">
                <Upload size={28} className="mx-auto text-[#3A3A3A] group-hover:text-[#FF7700] mb-3 transition-colors" />
                <p className="text-[#B0B0B0] text-sm font-medium group-hover:text-white transition-colors">
                  Déposer un document
                </p>
                <p className="text-[#3A3A3A] text-xs mt-1">PDF, JPG, PNG — max 10Mo</p>
              </div>
            </CardContent>
          </Card>

          {/* Document categories needed */}
          <Card>
            <CardHeader><CardTitle>Documents requis</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { name: 'Contrat partenariat', done: true },
                { name: 'Assurance RC pro', done: true },
                { name: 'Extrait RCS', done: true },
                { name: 'Tarifs actualisés', done: true },
                { name: 'Charte qualité signée', done: false },
              ].map(item => (
                <div key={item.name} className="flex items-center gap-3 py-1.5">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.done ? 'bg-green-500/15 border border-green-500/30' : 'bg-[#272727] border border-[#2E2E2E]'
                  }`}>
                    {item.done && <span className="text-green-400 text-xs">✓</span>}
                  </div>
                  <p className={`text-xs ${item.done ? 'text-[#B0B0B0]' : 'text-[#5A5A5A]'}`}>{item.name}</p>
                  {!item.done && <ChevronRight size={12} className="text-[#FF7700] ml-auto" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="p-5">
            <p className="text-[#B0B0B0] text-xs uppercase tracking-wider mb-4">Résumé</p>
            <div className="space-y-3">
              {[
                { label: 'Documents valides', value: '4', color: 'text-green-400' },
                { label: 'En attente', value: '1', color: 'text-yellow-400' },
                { label: 'Docs de missions', value: '3', color: 'text-[#FF7700]' },
                { label: 'Total documents', value: '8', color: 'text-white' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <p className="text-[#5A5A5A] text-xs">{s.label}</p>
                  <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
