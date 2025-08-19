import { Github } from "lucide-react"

export default function Footer(){
  return (
    <footer className="border-t border-white/10 bg-black/20">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-6 text-sm text-white/60">
        <p>© {new Date().getFullYear()} DreamInCode</p>
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/DreamInCode-CR" 
            aria-label="GitHub" 
            className="hover:text-white"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}