import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Shield, Users } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">EventConnect</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-white hover:bg-white/10 rounded-lg transition-colors font-medium"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate('/registro')}
              className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-bold"
            >
              Registrarse Gratis
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="text-yellow-300 font-semibold">PLATAFORMA TODO-EN-UNO</span>
              </div>
              <h2 className="text-5xl font-bold leading-tight mb-6">
                Gestiona tu Negocio de Eventos con EventConnect
              </h2>
              <p className="text-lg text-blue-100 leading-relaxed">
                La plataforma completa para empresas de alquiler y gestión de eventos. Desde la reserva hasta la entrega, todo en un solo lugar.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/registro')}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg"
              >
                Comenzar Gratis →
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-bold text-lg"
              >
                Ver Demo
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl p-8 border border-white/10 backdrop-blur">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <p className="text-xl font-semibold">Gestión de Eventos Inteligente</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h3 className="text-3xl font-bold text-white text-center mb-16">
            Todo lo que necesitas para gestionar tu negocio de eventos en un solo lugar
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Gestión Rápida',
                description: 'Crea, modifica y gestiona tus eventos en segundos',
              },
              {
                icon: Shield,
                title: 'Seguro y Confiable',
                description: 'Protege tus datos con nuestro sistema de seguridad avanzado',
              },
              {
                icon: Users,
                title: 'Colaboración',
                description: 'Trabaja con tu equipo de forma sincronizada y organizada',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-colors"
                >
                  <Icon className="w-10 h-10 text-yellow-300 mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-blue-100">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
          <h3 className="text-4xl font-bold text-white">
            ¿Listo para transformar tu negocio?
          </h3>
          <p className="text-xl text-blue-100">
            Únete a miles de empresas que ya confían en EventConnect
          </p>
          <button
            onClick={() => navigate('/registro')}
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg"
          >
            Crear Cuenta Gratis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-blue-900/20 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-blue-100 text-sm">
            <p>&copy; 2026 EventConnect. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">
                Privacidad
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Términos
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
