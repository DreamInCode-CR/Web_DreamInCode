export default function Footer(){
  return (
    <footer className="border-t border-white/10 bg-black/20">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-6 text-sm text-white/60">
        <p>© {new Date().getFullYear()} DreamInCode</p>
        <div className="flex items-center gap-4">
          <a href="#" aria-label="twitter" className="hover:text-white">𝕏</a>
          <a href="#" aria-label="facebook" className="hover:text-white">f</a>
          <a href="#" aria-label="instagram" className="hover:text-white">ig</a>
        </div>
      </div>
    </footer>
  )
}
