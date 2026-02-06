import { useState } from 'react';
import { Plus, BarChart3 } from 'lucide-react';
import { DanioForm } from '@/features/danios/components/DanioForm';
import { DanioList } from '@/features/danios/components/DanioList';
import { DanioEstadisticas } from '@/features/danios/components/DanioEstadisticas';

type Tab = 'reportar' | 'listar' | 'estadisticas';

export default function DaniosPage() {
  const [activeTab, setActiveTab] = useState<Tab>('listar');
  // Simplified admin check - in production use proper auth store
  const isAdmin = true;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Gestión de Daños</h1>
        <p className="text-slate-600 mt-2">Reporta, gestiona y resuelve daños en activos</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('reportar')}
          className={`px-4 py-3 font-medium transition border-b-2 ${
            activeTab === 'reportar'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Plus className="w-4 h-4 inline-block mr-2" />
          Reportar Daño
        </button>

        <button
          onClick={() => setActiveTab('listar')}
          className={`px-4 py-3 font-medium transition border-b-2 ${
            activeTab === 'listar'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Gestión
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveTab('estadisticas')}
            className={`px-4 py-3 font-medium transition border-b-2 ${
              activeTab === 'estadisticas'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline-block mr-2" />
            Estadísticas
          </button>
        )}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'reportar' && (
          <DanioForm onSuccess={() => setActiveTab('listar')} />
        )}

        {activeTab === 'listar' && (
          <DanioList />
        )}

        {activeTab === 'estadisticas' && isAdmin && (
          <DanioEstadisticas />
        )}
      </div>
    </div>
  );
}
