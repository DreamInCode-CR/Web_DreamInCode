import { motion } from 'framer-motion'

export default function FeatureCard({ title, children, cta, onClick }){
  return (
    <motion.div
      initial={{ y: 6, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,.45)' }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 120, damping: 12 }}
      className="card max-w-md"
    >
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="mb-4 text-white/80">{children}</p>
      {cta && (
        <button onClick={onClick} className="btn-primary">{cta}</button>
      )}
    </motion.div>
  )
}
