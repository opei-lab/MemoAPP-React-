import { useDroppable } from '@dnd-kit/core'
import { motion } from 'framer-motion'

interface TrashZoneProps {
  isActive: boolean
  children?: React.ReactNode
}

export const TrashZone = ({ isActive, children }: TrashZoneProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'trash-zone',
  })

  return (
    <motion.div
      ref={setNodeRef}
      animate={{
        scale: isOver ? 1.1 : 1,
        backgroundColor: isOver ? '#ef4444' : '#f87171',
      }}
      className={`fixed bottom-8 right-8 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all ${
        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
      }`}
      style={{ zIndex: 100 }}
    >
      <span className="text-3xl">🗑️</span>
      {children}
    </motion.div>
  )
}