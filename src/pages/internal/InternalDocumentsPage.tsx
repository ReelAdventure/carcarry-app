import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { mockProfiles } from '@/data/mockData'
import { FileText, Upload, Search, Download, Eye } from 'lucide-react'

const mockDocs = [
  { id: '1', name: 'Rapport intervention BMW 530d.pdf', type: 'Rapport', vehicle: 'BMW Série 5 · FR 123 456', date: '2024-11-25', size: '1.2 Mo', category: 'intervention' },
  { id: '2', name: 'Devis pneus Tesla Model 3.pdf', type: 'Devis', vehicle: 'Tesla Model 3 · FR 789 012', date: '2024-12-11', size: '340 Ko', category: 'devis' },
  { id: '3', name: 'Carte grise BMW 530d.pdf', type: 'Carte grise', vehicle: 'BMW Série 5 · FR 123 456', date: '2024-01-15', size: '520 Ko', category: 'vehicule' },
  { id: '4', name: 'Certificat MFK Audi Q5.pdf', type: 'MFK', vehicle: 'Audi Q5 · FR 345 678', date: '2022-08-10', size: '890 Ko', category: 'mfk' },
  { id: '5', name: 'Contrat assurance Mercedes.pdf', type: 'Assurance', vehicle: 'Mercedes Classe E · BE 456 789', date: '2024-02-14', size: '1.8 Mo', category: 'assurance' },
]

const catColors: Record<string, string> = {
  intervention: 'text-[#FF7700] bg-[#FF7700]/10 border-[#FF7700]/20',
  devis: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  vehicule: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  mfk: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  assurance: 'text-green-400 bg-green-500/10 border-green-500/20',
}

export function InternalDocumentsPage() {
  const adminUser = mockProfiles.find(p => p.role === 'carcarry_admin')!

  return (
    <AppLayout user={adminUser} notificationCount={3}>
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Documents</h1>
          <p className="text-[#B0B0B0] text-sm mt-1">{mockDocs.length} document{mockDocs.length > 1 ? 's' : ''} enregistré{mockDocs.length > 1 ? 's' : ''}</p>
        </div>
        <Button><Upload size={16} /> Importer un document</Button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A5A]" />
        <input
          type="text"
          placeholder="Rechercher un document..."
          className="w-full bg-[#1C1C1C] border border-[#2E2E2E] text-white placeholder-[#5A5A5A] rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7700]/50"
        />
      </div>

      {/* Drop zone */}
      <div className="border-2 border-dashed border-[#2E2E2E] hover:border-[#FF7700]/40 rounded-xl p-8 mb-6 text-center transition-colors cursor-pointer group">
        <Upload size={28} className="text-[#3A3A3A] group-hover:text-[#FF7700] mx-auto mb-2 transition-colors" />
        <p className="text-[#5A5A5A] group-hover:text-white text-sm transition-colors">Glissez vos fichiers ici</p>
        <p className="text-[#3A3A3A] text-xs mt-1">PDF, JPG, PNG · Max 20 Mo</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-[#1E1E1E]">
            {mockDocs.map(doc => (
              <div key={doc.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#1E1E1E] transition-colors group">
                <div className="w-10 h-10 bg-[#141414] rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-[#FF7700]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-[#5A5A5A] text-xs mt-0.5">{doc.vehicle} · {doc.date} · {doc.size}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${catColors[doc.category] ?? 'text-gray-400 bg-gray-500/10 border-gray-500/20'}`}>
                    {doc.type}
                  </span>
                  <button className="p-1.5 rounded-lg hover:bg-[#272727] text-[#5A5A5A] hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                    <Eye size={14} />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-[#272727] text-[#5A5A5A] hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
