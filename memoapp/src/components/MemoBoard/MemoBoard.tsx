import { useEffect, useState, useCallback } from 'react'
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
import type { Session } from '@supabase/supabase-js'
interface Memo {
  id: string
  user_id: string
  title: string
  content: string
  color: string
  position: number
  created_at: string
  updated_at: string
  is_deleted?: boolean
}

type SortBy = 'created_at' | 'color' | 'position'
type FilterColor = string | null
type MemoUpdate = Partial<Memo>

interface AppState {
  memos: Memo[]
  trashedMemos: Memo[]
  sortBy: SortBy
  filterColor: FilterColor
  darkMode: boolean
  showTrash: boolean
  isLoading: boolean
}
import { DEFAULT_MEMO_COLOR, LAYOUT_CONFIG } from '../../constants'
import { processMemosForDisplay } from '../../utils/memoUtils'
import { useMemoOperations } from '../../hooks/useMemoOperations'
import { useRealtimeSync } from '../../hooks/useRealtimeSync'
import { MemoEditProvider } from '../../contexts'
import { MemoCard } from '../MemoCard/MemoCard'
import { Header } from '../Header/Header'
import { MemoForm } from '../MemoForm'
import { TrashZone } from '../TrashZone'
import { ParticleBackground } from '../ParticleBackground'
import { FloatingActionButton } from '../FloatingActionButton'

interface MemoBoardProps {
  session: Session
}

export const MemoBoard = ({ session }: MemoBoardProps) => {
  const [state, setState] = useState<AppState>({
    memos: [],
    trashedMemos: [],
    sortBy: 'position',
    filterColor: null,
    darkMode: localStorage.getItem('darkMode') === 'true',
    showTrash: false,
    isLoading: true,
  })

  const [showMemoForm, setShowMemoForm] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const memoOps = useMemoOperations(session.user.id)
  
  // リアルタイム同期のハンドラー
  const handleRealtimeUpdate = useCallback((updatedMemo: Memo) => {
    setState(prev => ({
      ...prev,
      memos: prev.memos.map(memo => 
        memo.id === updatedMemo.id ? updatedMemo : memo
      )
    }))
  }, [])
  
  const handleRealtimeCreate = useCallback((newMemo: Memo) => {
    setState(prev => {
      // 既に存在する場合はスキップ
      if (prev.memos.some(m => m.id === newMemo.id)) {
        return prev
      }
      return {
        ...prev,
        memos: [...prev.memos, newMemo]
      }
    })
  }, [])
  
  const handleRealtimeDelete = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      memos: prev.memos.filter(memo => memo.id !== id)
    }))
  }, [])
  
  // リアルタイム同期を有効化
  useRealtimeSync({
    userId: session.user.id,
    onMemoUpdate: handleRealtimeUpdate,
    onMemoCreate: handleRealtimeCreate,
    onMemoDelete: handleRealtimeDelete,
  })

  // DnD センサー設定
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

  // 状態更新用のヘルパー関数（ヘルパー関数として削除、直接setStateを使用）

  // メモの取得
  const loadMemos = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))
      const allMemos = await memoOps.fetchMemos()
      
      // is_deletedフラグが存在する場合は使用、存在しない場合は全てactiveとして扱う
      const activeMemos = allMemos.filter(m => !m.is_deleted)
      const deletedMemos = allMemos.filter(m => m.is_deleted === true)
      
      setState(prev => ({ 
        ...prev, 
        memos: activeMemos,
        trashedMemos: deletedMemos,
        isLoading: false 
      }))
    } catch (error) {
      console.error('Failed to load memos:', error)
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [memoOps])

  useEffect(() => {
    loadMemos()
  }, [])

  // メモの作成
  const handleCreateMemo = useCallback(async (
    title: string, 
    content: string, 
    color = DEFAULT_MEMO_COLOR
  ) => {
    try {
      const position = state.memos.length
      const newMemo = await memoOps.createMemo(title, content, color, position)
      setState(prev => ({ 
        ...prev,
        memos: [...prev.memos, newMemo] 
      }))
      setShowMemoForm(false)
    } catch (error) {
      console.error('Failed to create memo:', error)
    }
  }, [memoOps])

  // メモの更新
  const handleUpdateMemo = useCallback(async (
    id: string, 
    updates: MemoUpdate
  ) => {
    try {
      await memoOps.updateMemo(id, updates)
      setState(prev => ({
        ...prev,
        memos: prev.memos.map(memo => 
          memo.id === id ? { ...memo, ...updates } : memo
        )
      }))
    } catch (error) {
      console.error('Failed to update memo:', error)
    }
  }, [memoOps])

  // ゴミ箱への移動
  const handleMoveToTrash = useCallback(async (id: string) => {
    // まずUIを即座に更新
    setState(prev => {
      const memo = prev.memos.find(m => m.id === id)
      if (memo) {
        return {
          ...prev,
          memos: prev.memos.filter(m => m.id !== id),
          trashedMemos: [...prev.trashedMemos, { ...memo, is_deleted: true }]
        }
      }
      return prev
    })
    
    // その後、データベースの更新を試みる（is_deletedカラムがない場合はエラーになるが継続）
    try {
      await memoOps.updateMemo(id, { is_deleted: true })
    } catch (error) {
      console.warn('Note: is_deleted column may not exist in database. Trash state is only in memory.', error)
    }
  }, [memoOps])

  // ゴミ箱からの復元
  const handleRestoreFromTrash = useCallback(async (id: string) => {
    // まずUIを即座に更新
    setState(prev => {
      const memo = prev.trashedMemos.find(m => m.id === id)
      if (memo) {
        return {
          ...prev,
          trashedMemos: prev.trashedMemos.filter(m => m.id !== id),
          memos: [...prev.memos, { ...memo, is_deleted: false }]
        }
      }
      return prev
    })
    
    // その後、データベースの更新を試みる
    try {
      await memoOps.updateMemo(id, { is_deleted: false })
    } catch (error) {
      console.warn('Note: is_deleted column may not exist in database. Trash state is only in memory.', error)
    }
  }, [memoOps])

  // ゴミ箱を空にする
  const handleEmptyTrash = useCallback(async () => {
    setState(prev => {
      if (!window.confirm(`${prev.trashedMemos.length}件のメモを完全に削除しますか？`)) {
        return prev
      }
      
      // 非同期処理を実行
      Promise.all(
        prev.trashedMemos.map(memo => memoOps.deleteMemo(memo.id))
      ).catch(error => {
        console.error('Failed to empty trash:', error)
      })
      
      return { ...prev, trashedMemos: [] }
    })
  }, [memoOps])

  // ドラッグ開始
  const handleDragStart = useCallback((event: DragStartEvent) => {
    console.log('Drag started:', event.active.id)
    setIsDragging(true)
  }, [])

  // 表示用のメモリスト（検索フィルター追加）
  const displayedMemos = processMemosForDisplay(state.memos, {
    sortBy: state.sortBy,
    filterColor: state.filterColor
  }).filter(memo => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      memo.title.toLowerCase().includes(query) ||
      memo.content.toLowerCase().includes(query)
    )
  })

  // ドラッグ終了
  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event
    setIsDragging(false)

    if (!over) return

    // ゴミ箱へのドロップ
    if (over.id === 'trash-zone') {
      handleMoveToTrash(active.id as string)
      return
    }

    // メモの並び替え（position順でのみ有効）
    if (state.sortBy === 'position' && active.id !== over.id) {
      // 現在表示されているメモリストでのインデックスを取得
      const displayedMemoIds = displayedMemos.map(m => m.id)
      const oldDisplayIndex = displayedMemoIds.indexOf(active.id as string)
      const newDisplayIndex = displayedMemoIds.indexOf(over.id as string)
      
      if (oldDisplayIndex !== -1 && newDisplayIndex !== -1) {
        // 表示順を変更
        const newDisplayOrder = arrayMove(displayedMemoIds, oldDisplayIndex, newDisplayIndex)
        
        // 全メモリストを新しい順序で再構築
        setState(prev => {
          // 新しい順序に基づいてメモを並び替え
          const reorderedMemos = newDisplayOrder.map(id => 
            prev.memos.find(m => m.id === id)!
          ).concat(
            // 表示されていないメモも保持
            prev.memos.filter(m => !displayedMemoIds.includes(m.id))
          )
          
          // ポジションを更新
          const memosWithNewPositions = reorderedMemos.map((memo, index) => ({
            ...memo,
            position: index
          }))
          
          // データベースのポジション更新
          const positionUpdates = memosWithNewPositions.map((memo, index) => ({
            id: memo.id,
            position: index
          }))
          
          memoOps.updatePositions(positionUpdates).catch(error => {
            console.error('Failed to update positions:', error)
            loadMemos()
          })
          
          return { ...prev, memos: memosWithNewPositions }
        })
      }
    }
  }, [displayedMemos, handleMoveToTrash, memoOps, state.sortBy, loadMemos])

  // ダークモードの切り替え時にhtml要素にもクラスを適用
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
    // デバッグ用
    console.log('Dark mode changed:', state.darkMode)
    console.log('HTML classes:', document.documentElement.classList.toString())
    console.log('Body classes:', document.body.classList.toString())
  }, [state.darkMode])

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-4 text-lg text-gray-600 dark:text-gray-400">読み込み中...</span>
      </div>
    )
  }

  return (
    <MemoEditProvider>
      <div className={`min-h-screen transition-all duration-500 ${state.darkMode ? 'dark' : ''}`}>
        <ParticleBackground />
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50/80 to-indigo-100/80 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm relative z-10">
        <Header 
          session={session}
          sortBy={state.sortBy}
          setSortBy={(sortBy: SortBy) => setState(prev => ({ ...prev, sortBy }))}
          filterColor={state.filterColor}
          setFilterColor={(filterColor: FilterColor) => setState(prev => ({ ...prev, filterColor }))}
          darkMode={state.darkMode}
          setDarkMode={(darkMode: boolean) => {
            localStorage.setItem('darkMode', darkMode.toString())
            setState(prev => ({ ...prev, darkMode }))
          }}
          showTrash={state.showTrash}
          setShowTrash={(showTrash: boolean) => setState(prev => ({ ...prev, showTrash }))}
          trashCount={state.trashedMemos.length}
          onEmptyTrash={handleEmptyTrash}
          onNewMemo={() => setShowMemoForm(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResultCount={displayedMemos.length}
        />
        
        <div 
          className="flex-1 w-full"
          style={{ 
            paddingTop: `${LAYOUT_CONFIG.headerHeight}px`, 
            paddingBottom: '48px',
            paddingLeft: '2rem',
            paddingRight: '2rem'
          }}
        >
          <div style={{ marginTop: '2rem' }}>
            <MemoForm 
              onSubmit={handleCreateMemo} 
              isOpen={showMemoForm}
              onClose={() => setShowMemoForm(false)}
            />
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={displayedMemos.map(memo => memo.id)}
              strategy={rectSortingStrategy}
            >
              <div
                className="grid mt-8"
                style={{
                  gridTemplateColumns: `repeat(auto-fill, minmax(320px, 1fr))`,
                  gap: '2rem'
                }}
              >
                {state.showTrash ? (
                  state.trashedMemos.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                      <div className="text-6xl mb-4">🗑️</div>
                      <p className="text-xl text-gray-500 dark:text-gray-400">ゴミ箱は空です</p>
                    </div>
                  ) : (
                    state.trashedMemos.map((memo, index) => (
                      <div key={memo.id} className="relative opacity-60">
                        <div className="absolute top-2 left-2 z-20 flex gap-2">
                          <button
                            onClick={() => handleRestoreFromTrash(memo.id)}
                            className="px-3 py-1 bg-green-500 text-white text-sm rounded shadow hover:bg-green-600 transition-colors"
                          >
                            復元
                          </button>
                          <button
                            onClick={() => {
                              memoOps.deleteMemo(memo.id).then(() => {
                                setState(prev => ({
                                  ...prev,
                                  trashedMemos: prev.trashedMemos.filter(m => m.id !== memo.id)
                                }))
                              }).catch(error => {
                                console.error('Failed to delete memo:', error)
                              })
                            }}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded shadow hover:bg-red-600 transition-colors"
                          >
                            完全削除
                          </button>
                        </div>
                        <MemoCard
                          memo={memo}
                          onUpdate={() => {}}
                          onDelete={() => {}}
                          index={index}
                        />
                      </div>
                    ))
                  )
                ) : (
                  displayedMemos.map((memo, index) => (
                    <MemoCard
                      key={memo.id}
                      memo={memo}
                      onUpdate={handleUpdateMemo}
                      onDelete={handleMoveToTrash}
                      index={index}
                    />
                  ))
                )}
              </div>
            </SortableContext>
            
            <TrashZone isActive={isDragging} />
          </DndContext>
        </div>
        
        {/* フローティングアクションボタンを削除 */}
        </div>
      </div>
    </MemoEditProvider>
  )
}