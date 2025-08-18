import Navbar from '../ui/Navbar'
import Footer from '../ui/Footer'

export default function Layout({ children }){
  return (
    <div className="min-h-screen bg-bg bg-grid text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 pb-20 pt-6 sm:pt-10">
        {children}
      </main>
      <Footer />
    </div>
  )
}
