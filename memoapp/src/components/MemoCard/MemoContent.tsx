import { memo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MemoContentProps {
  title: string
  content: string
}

export const MemoContent = memo(({ title, content }: MemoContentProps) => {
  
  return (
    <motion.div 
      className="w-full h-full overflow-hidden text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 drop-shadow-sm overflow-hidden text-ellipsis mx-auto text-center" 
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.4',
          maxHeight: '2.4em',
          wordBreak: 'break-word',
        }}
      >
        {title || '無題'}
      </h3>
      
      <p className="text-gray-700 dark:text-gray-200 leading-relaxed overflow-hidden text-left"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.6',
          maxHeight: '7.2em',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
      >
        {content}
      </p>
    </motion.div>
  )
})