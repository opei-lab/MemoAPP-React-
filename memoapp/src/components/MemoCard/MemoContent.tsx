import { memo } from 'react'

import type { MemoContentProps } from '../../types'

export const MemoContent = memo(({ title, content }: MemoContentProps) => {
  
  return (
    <div 
      className="w-full h-full overflow-hidden flex flex-col"
      style={{
        alignItems: 'stretch',
      }}
    >
      {/* タイトル部分 - ダークモード対応 */}
      <h3 
        className="text-xl font-bold text-gray-800 dark:text-gray-100"
        style={{
          marginBottom: '0.5rem',
          textAlign: 'center',
          width: '100%',
          display: 'block',
          textShadow: 'none',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {title || '無題'}
      </h3>
      
      <p 
        className="text-gray-700 dark:text-gray-200 leading-relaxed"
        style={{
          textAlign: 'left',
          width: '100%',
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {content}
      </p>
    </div>
  )
})