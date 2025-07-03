import { memo } from 'react'

interface MemoContentProps {
  title: string
  content: string
}

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
          marginBottom: '1rem',
          textAlign: 'center',
          width: '100%',
          display: 'block',
          textShadow: 'none', // drop-shadowを削除
        }}
      >
        {title || '無題'}
      </h3>
      
      <p 
        className="text-gray-700 dark:text-gray-200 leading-relaxed line-clamp-3"
        style={{
          textAlign: 'left',
          width: '100%',
          whiteSpace: 'pre-wrap',
        }}
      >
        {content}
      </p>
    </div>
  )
})