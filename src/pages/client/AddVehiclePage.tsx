import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { currentMockUser } from '@/data/mockData'
import { ArrowLeft, CheckCircle2, Car } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const fuelOptions = [
  { value: 'essence', label: 'Essence' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybride', label: 'Hybride' },
  { value: 'electrique', label: 'Électrique' },
  { value: 'gpl', label: 'GPL' },
  { value: 'autre', label: 'Autre' },
]

const transmissionOptions = [
  { value: 'automatique', label: 'Automatique' },
  { value: 'manuelle', label: 'Manuelle' },
  { value: 'semi-automatique', label: 'Semi-automatique' },
]

export function AddVehiclePage() {
  const user = currentMockUser
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setSaved(true)
    setLoading(false)
  }

  if (saved) {
    return (
      <AppLayout user={user} notificationCount={2}>
        <div className="max-w-md mx-auto py-20 text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Véhicule ajouté !</h2>
          <p className="text-[#B0B0B0] mb-8">Votre véhicule a été enregistré avec succès.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/client/vehicles"><Button>Voir mes véhicules</Button></Link>
            <Link to="/client"><Button variant="secondary">Tableau de bord</Button></Link>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout user={user} notificationCount={2}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to="/client/vehicles" className="flex items-center gap-2 text-[#B0B0B0] hover:text-white text-sm">
            <ArrowLeft size={16} /> Mes véhicules
          </Link>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FF7700]/10 border border-[#FF7700]/20 rounded-xl flex items-center justify-center">
            <Car size={24} className="text-[#FF7700]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Ajouter un véhicule</h1>
            <p className="text-[#B0B0B0] text-sm mt-0.5">Enregistrez votre véhicule dans votre espace CarCarry</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Informations générales</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Marque *" placeholder="BMW, Audi, Mercedes..." required />
                <Input label="Modèle *" placeholder="Série 3, Q5, Classe E..." required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Version" placeholder="320d xDrive, TDI quattro..." />
                <Input label="Année *" type="number" placeholder="2021" min="1950" max="2030" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Plaque d'immatriculation *" placeholder="FR 123 456" required />
                <Input label="Numéro VIN" placeholder="WBA12345..." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Caractéristiques techniques</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Select label="Carburant *" options={fuelOptions} placeholder="Sélectionner..." required />
                <Select label="Transmission" options={transmissionOptions} placeholder="Sélectionner..." />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Kilométrage actuel" type="number" placeholder="48000" />
                <Input label="Couleur" placeholder="Noir Saphir, Blanc Nacré..." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Entretien & MFK</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Date d'achat" type="date" />
                <Input label="Dernier service" type="date" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Prochain service" type="date" />
                <Input label="Dernière MFK" type="date" />
              </div>
              <Input label="Prochaine MFK" type="date" />
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Link to="/client/vehicles"><Button variant="secondary">Annuler</Button></Link>
            <Button type="submit" loading={loading}>Enregistrer le véhicule</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
