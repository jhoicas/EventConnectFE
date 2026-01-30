import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { ServiciosGrid } from '@/components/ServiciosGrid';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    'Control total de inventario',
    'Calendario de reservas integrado',
    'Gestión de entregas y devoluciones',
    'Facturación automática',
    'Reportes en tiempo real',
    'Acceso desde cualquier dispositivo',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Logo 
            textClassName="text-gray-900"
            iconClassName="text-indigo-600"
            onClick={() => navigate('/inicio')}
          />
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 text-gray-700 hover:text-gray-900 rounded-lg transition-colors font-medium"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate('/registro')}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Registrarse Gratis
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Gestiona tu Negocio de Eventos
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              La plataforma completa para empresas de alquiler y gestión de eventos. 
              Controla inventario, reservas, clientes y facturación en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/registro')}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg"
              >
                Comenzar Gratis
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors font-semibold text-lg"
              >
                Ver Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Dinámico desde BD */}
      <ServiciosGrid />

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Una plataforma completa para tu negocio
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                EventConnect te permite administrar todos los aspectos de tu negocio 
                de eventos desde una sola plataforma intuitiva y fácil de usar.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 font-medium">Vista previa del sistema</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Únete a cientos de empresas que ya confían en EventConnect
          </p>
          <button
            onClick={() => navigate('/registro')}
            className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
          >
            Crear Cuenta Gratis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <Logo 
                textClassName="text-white"
                iconClassName="text-indigo-400"
              />
              <p className="mt-4 text-sm">
                La plataforma todo-en-uno para gestión de eventos y alquiler.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">
                    Iniciar Sesión
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/registro')} className="hover:text-white transition-colors">
                    Registrarse
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => navigate('/terminos')} className="hover:text-white transition-colors">
                    Términos de Servicio
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/politica-privacidad')} className="hover:text-white transition-colors">
                    Política de Privacidad
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} EventConnect. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
