import { useEffect, useRef } from 'react'

interface GestureHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinch?: (scale: number) => void
  onRotate?: (angle: number) => void
  onDoubleTap?: () => void
  onLongPress?: () => void
}

export const useGestures = (elementRef: React.RefObject<HTMLElement>, handlers: GestureHandlers) => {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const touchesRef = useRef<Touch[]>([])
  const longPressTimerRef = useRef<NodeJS.Timeout>()
  const lastTapRef = useRef<number>(0)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      }

      // 長押し検出
      if (handlers.onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          handlers.onLongPress?.()
        }, 500)
      }

      // マルチタッチ記録
      touchesRef.current = Array.from(e.touches)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }

      // ピンチとローテーション検出
      if (e.touches.length === 2 && touchesRef.current.length === 2) {
        const [touch1, touch2] = Array.from(e.touches)
        const [prevTouch1, prevTouch2] = touchesRef.current

        // ピンチ検出
        const prevDistance = Math.hypot(
          prevTouch2.clientX - prevTouch1.clientX,
          prevTouch2.clientY - prevTouch1.clientY
        )
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        )
        const scale = currentDistance / prevDistance

        if (handlers.onPinch && Math.abs(scale - 1) > 0.01) {
          handlers.onPinch(scale)
        }

        // ローテーション検出
        const prevAngle = Math.atan2(
          prevTouch2.clientY - prevTouch1.clientY,
          prevTouch2.clientX - prevTouch1.clientX
        )
        const currentAngle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        )
        const rotation = (currentAngle - prevAngle) * (180 / Math.PI)

        if (handlers.onRotate && Math.abs(rotation) > 1) {
          handlers.onRotate(rotation)
        }
      }

      touchesRef.current = Array.from(e.touches)
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }

      if (!touchStartRef.current || e.touches.length > 0) return

      const touchEnd = e.changedTouches[0]
      const deltaX = touchEnd.clientX - touchStartRef.current.x
      const deltaY = touchEnd.clientY - touchStartRef.current.y
      const deltaTime = Date.now() - touchStartRef.current.time

      // スワイプ検出
      const minSwipeDistance = 50
      const maxSwipeTime = 300

      if (deltaTime < maxSwipeTime) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > minSwipeDistance && handlers.onSwipeRight) {
            handlers.onSwipeRight()
          } else if (deltaX < -minSwipeDistance && handlers.onSwipeLeft) {
            handlers.onSwipeLeft()
          }
        } else {
          if (deltaY > minSwipeDistance && handlers.onSwipeDown) {
            handlers.onSwipeDown()
          } else if (deltaY < -minSwipeDistance && handlers.onSwipeUp) {
            handlers.onSwipeUp()
          }
        }
      }

      // ダブルタップ検出
      const now = Date.now()
      if (now - lastTapRef.current < 300 && handlers.onDoubleTap) {
        handlers.onDoubleTap()
      }
      lastTapRef.current = now

      touchStartRef.current = null
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }
    }
  }, [elementRef, handlers])
}