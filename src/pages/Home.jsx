import { Link } from 'react-router-dom'
import FeatureCard from '../ui/FeatureCard'
import ParallaxCard from '../ui/ParallaxCard'

export default function Home(){
  return (
    <section className="grid items-start gap-6 sm:gap-8 md:grid-cols-2">
      <div className="space-y-4 sm:space-y-6">
        <ParallaxCard image="/images/home-card.png">
          <h2 className="mb-2 text-xl sm:text-2xl font-semibold">Contexto</h2>
          <p className="text-white/80 text-sm sm:text-base text-justify">
            Con el envejecimiento progresivo de la población, existe una necesidad creciente de soluciones tecnológicas accesibles que les brinden autonomía,
            seguridad y compañía. Nuestro proyecto busca responder a esta necesidad mediante un asistente de voz basado en microcontrolador, que interactúe con los
            usuarios en lenguaje natural y se adapte a las características de cada persona.
          </p>
        </ParallaxCard>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FeatureCard title="Iniciar sesión">
            <p>
              Al iniciar sesión puedes ingresar todos los datos del usuario a asistir.
            </p>
            <div className="mt-4">
              <Link to="/login" className="btn-primary w-full sm:w-auto text-center">
                Iniciar Sesión
              </Link>
            </div>
          </FeatureCard>

          <FeatureCard title="¿Aún no tienes cuenta?">
            <p>
              Ve a registrarte para crear una nueva cuenta y comenzar.
            </p>
            <div className="mt-4">
              <Link to="/register" className="btn-accent w-full sm:w-auto text-center">
                Registrarse
              </Link>
            </div>
          </FeatureCard>
        </div>
      </div>

      <div className="flex flex-col items-center justify-start gap-4 sm:gap-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-center md:text-left">
          Bienvenidos.
        </h1>

        <div className="grid place-items-center rounded-full bg-card p-6 sm:p-8 shadow-soft">
          <div className="rounded-full bg-bg p-4 sm:p-6">
            <img src="/images/logo.png" alt="DCODE" className="h-16 w-16 sm:h-24 sm:w-24 rounded-full" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto">
          <Link to="/login" className="btn-primary w-full sm:w-auto text-center">Iniciar Sesión</Link>
          <Link to="/register" className="btn-accent w-full sm:w-auto text-center">Registrarse</Link>
        </div>
      </div>
    </section>
  )
}
