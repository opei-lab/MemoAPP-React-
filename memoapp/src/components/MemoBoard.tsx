import { useEffect, useState } from 'react'
import { supabase, Memo, Session } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { BasicMemoCard } from './BasicMemoCard'
import { MemoForm } from './MemoForm'
import { Header } from './Header'
import { TrashZone } from './TrashZone'

interface MemoBoardProps {
  session: Session
}

export const MemoBoard = ({ session }: MemoBoardProps) => {
  const [memos, setMemos] = useState<Memo[]>([])
  const [trashedMemos, setTrashedMemos] = useState<Memo[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'created_at' | 'color'>('created_at')
  const [filterColor, setFilterColor] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [showTrash, setShowTrash] = useState(false)
  const [showMemoForm, setShowMemoForm] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchMemos()
  }, [session.user.id])

  const fetchMemos = async () => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('user_id', session.user.id)
        .order('position', { ascending: true })

      if (error) {
        console.error('Error fetching memos:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }
      setMemos(data || [])
    } catch (error: any) {
      console.error('Error in fetchMemos:', error)
      alert(`Error loading memos: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag started:', event.active.id)
    setIsDragging(true)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    console.log('Drag ended:', { activeId: active.id, overId: over?.id })
    setIsDragging(false)

    // Check if dropped on trash
    if (over?.id === 'trash-zone') {
      moveToTrash(active.id as string)
      return
    }

    if (active.id !== over?.id && over?.id) {
      setMemos((currentMemos) => {
        const oldIndex = currentMemos.findIndex((memo) => memo.id === active.id)
        const newIndex = currentMemos.findIndex((memo) => memo.id === over.id)
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newMemos = arrayMove(currentMemos, oldIndex, newIndex)
          
          // Update positions in database asynchronously
          Promise.all(
            newMemos.map((memo, index) =>
              supabase
                .from('memos')
                .update({ position: index })
                .eq('id', memo.id)
            )
          ).catch(console.error)
          
          return newMemos
        }
        return currentMemos
      })
    }
  }

  const addMemo = async (title: string, content: string, color: string = '#FFE4B5') => {
    try {
      const newMemo = {
        user_id: session.user.id,
        title,
        content,
        color,
        position: memos.length,
      }

      const { data, error } = await supabase
        .from('memos')
        .insert([newMemo])
        .select()
        .single()

      if (error) {
        console.error('Error adding memo:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }
      if (data) {
        setMemos([...memos, data])
        setShowMemoForm(false)
      }
    } catch (error: any) {
      console.error('Error in addMemo:', error)
      alert(`Error creating memo: ${error.message || 'Unknown error'}`)
    }
  }

  const updateMemo = async (id: string, updates: Partial<Memo>) => {
    try {
      const { error } = await supabase
        .from('memos')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      
      setMemos(memos.map(memo => 
        memo.id === id ? { ...memo, ...updates } : memo
      ))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteMemo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMemos(memos.filter(memo => memo.id !== id))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const moveToTrash = (id: string) => {
    const memo = memos.find(m => m.id === id)
    if (memo) {
      setMemos(memos.filter(m => m.id !== id))
      setTrashedMemos([...trashedMemos, memo])
    }
  }

  const restoreFromTrash = (id: string) => {
    const memo = trashedMemos.find(m => m.id === id)
    if (memo) {
      setTrashedMemos(trashedMemos.filter(m => m.id !== id))
      setMemos([...memos, memo])
    }
  }

  const emptyTrash = async () => {
    if (window.confirm(`${trashedMemos.length}件のメモを完全に削除しますか？`)) {
      try {
        for (const memo of trashedMemos) {
          await supabase.from('memos').delete().eq('id', memo.id)
        }
        setTrashedMemos([])
        alert('ゴミ箱を空にしました')
      } catch (error) {
        console.error('Error emptying trash:', error)
        alert('エラーが発生しました')
      }
    }
  }

  const sortedAndFilteredMemos = memos
    .filter(memo => !filterColor || memo.color === filterColor)
    .sort((a, b) => {
      if (sortBy === 'color') {
        return (a.color || '').localeCompare(b.color || '')
      }
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-2xl text-gray-600 dark:text-gray-400">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
        <Header 
            session={session}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterColor={filterColor}
            setFilterColor={setFilterColor}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            showTrash={showTrash}
            setShowTrash={setShowTrash}
            trashCount={trashedMemos.length}
            onEmptyTrash={emptyTrash}
            onNewMemo={() => setShowMemoForm(true)}
          />
        
        <div className="flex-1 container mx-auto px-4" style={{ paddingTop: '120px', paddingBottom: '32px' }}>
          <MemoForm 
            onSubmit={addMemo} 
            isOpen={showMemoForm}
            onClose={() => setShowMemoForm(false)}
          />
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedAndFilteredMemos.map(memo => memo.id)}
              strategy={rectSortingStrategy}
            >
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8"
                layout
              >
                <AnimatePresence>
                  {showTrash ? (
                    trashedMemos.length === 0 ? (
                      <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                        <div className="text-6xl mb-4">🗑️</div>
                        <p className="text-xl">ゴミ箱は空です</p>
                      </div>
                    ) : (
                    trashedMemos.map((memo) => (
                      <div key={memo.id} className="relative">
                        <div className="absolute top-2 left-2 z-20">
                          <button
                            onClick={() => restoreFromTrash(memo.id)}
                            className="px-3 py-1 bg-green-500 text-white text-sm rounded-full shadow-lg hover:bg-green-600 transition-colors"
                          >
                            復元
                          </button>
                        </div>
                        <div className="opacity-60">
                          <BasicMemoCard
                            memo={memo}
                            onUpdate={() => {}}
                            onDelete={deleteMemo}
                          />
                        </div>
                      </div>
                    )))
                  ) : (
                    sortedAndFilteredMemos.map((memo) => (
                      <BasicMemoCard
                        key={memo.id}
                        memo={memo}
                        onUpdate={updateMemo}
                        onDelete={moveToTrash}
                      />
                    ))
                  )}
                </AnimatePresence>
              </motion.div>
            </SortableContext>
            
            <TrashZone isActive={isDragging} />
          </DndContext>
        </div>
      </div>
    </div>
  )
}