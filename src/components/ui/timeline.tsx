'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { format, type Locale } from 'date-fns'
import { es } from 'date-fns/locale'

// Timeline Variants
const timelineVariants = cva('relative', {
  variants: {
    orientation: {
      vertical: 'flex flex-col',
      horizontal: 'flex flex-row overflow-x-auto pb-4',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
    size: 'md',
  },
})

const timelineItemVariants = cva('relative flex', {
  variants: {
    orientation: {
      vertical: 'flex-row pb-8 last:pb-0',
      horizontal: 'flex-col items-center min-w-[200px] pr-8 last:pr-0',
    },
    size: {
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
    size: 'md',
  },
})

const timelineConnectorVariants = cva('absolute bg-border', {
  variants: {
    orientation: {
      vertical: 'left-4 top-8 w-px h-full',
      horizontal: 'top-4 left-8 h-px w-full',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
    size: 'md',
  },
})

const timelineDotVariants = cva(
  'relative z-10 flex items-center justify-center rounded-full border-2 bg-background',
  {
    variants: {
      size: {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-10 w-10',
      },
      variant: {
        default: 'border-border',
        primary: 'border-primary bg-primary text-primary-foreground',
        success: 'border-green-500 bg-green-500 text-white',
        warning: 'border-yellow-500 bg-yellow-500 text-white',
        error: 'border-red-500 bg-red-500 text-white',
        muted: 'border-muted bg-muted',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
)

// Types
export interface TimelineItemData {
  id: string
  timestamp: Date
  title: string
  description?: string
  content?: React.ReactNode
  icon?: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'muted'
}

export interface TimelineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineVariants> {
  items: TimelineItemData[]
  showConnector?: boolean
  dateFormat?: string
  locale?: Locale
}

export interface TimelineItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineItemVariants> {
  item: TimelineItemData
  showConnector?: boolean
  isLast?: boolean
  dateFormat?: string
  locale?: Locale
}

// Timeline Components
const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  (
    {
      className,
      items,
      orientation,
      size,
      showConnector = true,
      dateFormat = 'dd/MM/yyyy HH:mm',
      locale = es,
      ...props
    },
    ref
  ) => {
    // Sort items by timestamp
    const sortedItems = React.useMemo(() => {
      return [...items].sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
      )
    }, [items])

    return (
      <div
        ref={ref}
        className={cn(timelineVariants({ orientation, size }), className)}
        role="list"
        aria-label="Timeline"
        {...props}
      >
        {sortedItems.map((item, index) => (
          <TimelineItem
            key={item.id}
            item={item}
            orientation={orientation}
            size={size}
            showConnector={showConnector && index < sortedItems.length - 1}
            isLast={index === sortedItems.length - 1}
            dateFormat={dateFormat}
            locale={locale}
          />
        ))}
      </div>
    )
  }
)
Timeline.displayName = 'Timeline'

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  (
    {
      className,
      item,
      orientation,
      size,
      showConnector = true,
      isLast = false,
      dateFormat = 'dd/MM/yyyy HH:mm',
      locale = es,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(timelineItemVariants({ orientation, size }), className)}
        role="listitem"
        {...props}
      >
        {/* Connector Line */}
        {showConnector && !isLast && (
          <div
            className={cn(timelineConnectorVariants({ orientation, size }))}
            aria-hidden="true"
          />
        )}

        {/* Timeline Dot */}
        <div className="relative flex-shrink-0">
          <div
            className={cn(timelineDotVariants({ size, variant: item.variant }))}
            aria-hidden="true"
          >
            {item.icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col space-y-1">
            {/* Title and Timestamp */}
            <div
              className={cn(
                'flex items-start justify-between',
                orientation === 'horizontal' &&
                  'flex-col items-center text-center'
              )}
            >
              <h3 className="text-sm font-medium leading-none">{item.title}</h3>
              <time
                className={cn(
                  'text-xs text-muted-foreground',
                  orientation === 'horizontal' && 'mt-1'
                )}
                dateTime={item.timestamp.toISOString()}
              >
                {format(item.timestamp, dateFormat, { locale })}
              </time>
            </div>

            {/* Description */}
            {item.description && (
              <p
                className={cn(
                  'text-sm text-muted-foreground',
                  orientation === 'horizontal' && 'text-center'
                )}
              >
                {item.description}
              </p>
            )}

            {/* Custom Content */}
            {item.content && (
              <div
                className={cn(
                  'mt-2',
                  orientation === 'horizontal' && 'text-center'
                )}
              >
                {item.content}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)
TimelineItem.displayName = 'TimelineItem'

// Timeline Dot component for custom usage
const TimelineDot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof timelineDotVariants>
>(({ className, size, variant, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(timelineDotVariants({ size, variant }), className)}
    {...props}
  >
    {children}
  </div>
))
TimelineDot.displayName = 'TimelineDot'

export {
  Timeline,
  TimelineItem,
  TimelineDot,
  timelineVariants,
  timelineItemVariants,
  timelineDotVariants,
}
