import { motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

export default function ParallaxCard({ image, title, children }){
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const prefersReduced = useReducedMotion()

  const rotateX = useTransform(y, [-0.5, 0.5], [6, -6])
  const rotateY = useTransform(x, [-0.5, 0.5], [-6, 6])

  const onMouseMove = (e) => {
    if (prefersReduced) return
    const el = ref.current
    if(!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    x.set(px); y.set(py)
  }

  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onLeave}
      initial={{ y: 8, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true }}
      style={{ perspective: 600, transformStyle: 'preserve-3d' }}
      className="card p-0 overflow-hidden"
    >
      <motion.div
        style={{ rotateX: prefersReduced ? 0 : rotateX, rotateY: prefersReduced ? 0 : rotateY, transformStyle: 'preserve-3d' }}
        transition={{ type: 'spring', stiffness: 180, damping: 16 }}
      >
        <div className="relative">
          <img src={image} alt={title || 'card'} className="h-44 sm:h-56 w-full object-cover" />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="p-4 sm:p-6" style={{ transform: 'translateZ(24px)' }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}
