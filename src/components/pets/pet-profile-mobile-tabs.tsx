import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TabItem {
  value: string
  label: string
  count?: number
}

interface PetProfileMobileTabsProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (value: string) => void
  className?: string
}

export function PetProfileMobileTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
}: PetProfileMobileTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const handleResize = () => checkScrollButtons()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  const scrollToActiveTab = () => {
    if (scrollContainerRef.current) {
      const activeButton = scrollContainerRef.current.querySelector(
        `[data-value="${activeTab}"]`
      ) as HTMLElement
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        })
      }
    }
  }

  useEffect(() => {
    scrollToActiveTab()
  }, [activeTab])

  return (
    <div className={cn('relative', className)}>
      {/* Left scroll button */}
      {showLeftArrow && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-background/80 backdrop-blur-sm border shadow-sm"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Scrollable tabs container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide gap-1 px-8 md:px-0"
        onScroll={checkScrollButtons}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            data-value={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={cn(
              'flex-shrink-0 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
              'hover:bg-muted/50',
              activeTab === tab.value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground'
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1 text-xs opacity-75">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Right scroll button */}
      {showRightArrow && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-background/80 backdrop-blur-sm border shadow-sm"
          onClick={scrollRight}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
