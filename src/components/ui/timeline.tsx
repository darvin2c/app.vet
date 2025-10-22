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

// Context for Timeline
interface TimelineContextValue {
  orientation?: 'vertical' | 'horizontal'
  size?: 'sm' | 'md' | 'lg'
  showConnector?: boolean
  dateFormat?: string
  locale?: Locale
}

const TimelineContext = React.createContext<TimelineContextValue>({})

// Types
export interface TimelineItemData {
  id: string
  timestamp: Date
  title: string
  description?: string
  content?: React.ReactNode
  icon?: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'muted'
  actions?: React.ReactNode
}

// New composition-based Timeline props
export interface TimelineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineVariants> {
  children?: React.ReactNode
  showConnector?: boolean
  dateFormat?: string
  locale?: Locale
  // Legacy support
  items?: TimelineItemData[]
}

// New TimelineItem props for composition
export interface TimelineItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  timestamp: Date
  title: string
  description?: string
  content?: React.ReactNode
  icon?: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'muted'
  actions?: React.ReactNode
  children?: React.ReactNode
  // Internal props (automatically handled)
  showConnector?: boolean
  isLast?: boolean
}

// Legacy TimelineItem props (for backward compatibility)
interface LegacyTimelineItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineItemVariants> {
  item: TimelineItemData
  showConnector?: boolean
  isLast?: boolean
  dateFormat?: string
  locale?: Locale
}

// Helper function to extract TimelineItem children and sort them
const extractAndSortTimelineItems = (children: React.ReactNode) => {
  const items: Array<{
    element: React.ReactElement<TimelineItemProps>
    timestamp: Date
  }> = []

  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement<TimelineItemProps>(child) &&
      child.type === TimelineItem
    ) {
      const timestamp = child.props.timestamp
      if (timestamp instanceof Date) {
        items.push({ element: child, timestamp })
      }
    }
  })

  // Sort by timestamp
  return items.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

// Timeline Components
const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  (
    {
      className,
      children,
      items, // Legacy support
      orientation = 'vertical',
      size = 'md',
      showConnector = true,
      dateFormat = 'dd/MM/yyyy HH:mm',
      locale = es,
      ...props
    },
    ref
  ) => {
    const contextValue: TimelineContextValue = {
      orientation: orientation || 'vertical',
      size: size || 'md',
      showConnector,
      dateFormat,
      locale,
    }

    // Legacy mode: render from items prop
    if (items && items.length > 0) {
      const sortedItems = React.useMemo(() => {
        return [...items].sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        )
      }, [items])

      return (
        <TimelineContext.Provider value={contextValue}>
          <div
            ref={ref}
            className={cn(timelineVariants({ orientation, size }), className)}
            role="list"
            aria-label="Timeline"
            {...props}
          >
            {sortedItems.map((item, index) => (
              <LegacyTimelineItem
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
        </TimelineContext.Provider>
      )
    }

    // New composition mode: render children
    const sortedItems = extractAndSortTimelineItems(children)

    return (
      <TimelineContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(timelineVariants({ orientation, size }), className)}
          role="list"
          aria-label="Timeline"
          {...props}
        >
          {sortedItems.map(({ element }, index) => {
            return React.cloneElement(element, {
              key: element.key || `timeline-item-${index}`,
              showConnector: showConnector && index < sortedItems.length - 1,
              isLast: index === sortedItems.length - 1,
            } as Partial<TimelineItemProps>)
          })}
        </div>
      </TimelineContext.Provider>
    )
  }
)
Timeline.displayName = 'Timeline'

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  (
    {
      className,
      timestamp,
      title,
      description,
      content,
      icon,
      variant = 'default',
      actions,
      children,
      showConnector = true,
      isLast = false,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(TimelineContext)
    const {
      orientation = 'vertical',
      size = 'md',
      dateFormat = 'dd/MM/yyyy HH:mm',
      locale = es,
    } = context

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
            className={cn(timelineDotVariants({ size, variant }))}
            aria-hidden="true"
          >
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col space-y-1">
            {/* Title, Timestamp and Actions */}
            <div
              className={cn(
                'flex items-start justify-between',
                orientation === 'horizontal' &&
                  'flex-col items-center text-center'
              )}
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium leading-none">{title}</h3>
                <time
                  className={cn(
                    'text-xs text-muted-foreground block mt-1',
                    orientation === 'horizontal' && 'mt-1'
                  )}
                  dateTime={timestamp.toISOString()}
                >
                  {format(timestamp, dateFormat, { locale })}
                </time>
              </div>

              {/* Actions */}
              {actions && (
                <div
                  className={cn(
                    'flex-shrink-0 ml-2',
                    orientation === 'horizontal' && 'ml-0 mt-2'
                  )}
                  role="group"
                  aria-label="Acciones del elemento"
                >
                  {actions}
                </div>
              )}
            </div>

            {/* Description */}
            {description && (
              <p
                className={cn(
                  'text-sm text-muted-foreground',
                  orientation === 'horizontal' && 'text-center'
                )}
              >
                {description}
              </p>
            )}

            {/* Custom Content */}
            {(content || children) && (
              <div
                className={cn(
                  'mt-2',
                  orientation === 'horizontal' && 'text-center'
                )}
              >
                {content || children}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)
TimelineItem.displayName = 'TimelineItem'

// Legacy TimelineItem component (for backward compatibility)
const LegacyTimelineItem = React.forwardRef<
  HTMLDivElement,
  LegacyTimelineItemProps
>(
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
            {/* Title, Timestamp and Actions */}
            <div
              className={cn(
                'flex items-start justify-between',
                orientation === 'horizontal' &&
                  'flex-col items-center text-center'
              )}
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium leading-none">
                  {item.title}
                </h3>
                <time
                  className={cn(
                    'text-xs text-muted-foreground block mt-1',
                    orientation === 'horizontal' && 'mt-1'
                  )}
                  dateTime={item.timestamp.toISOString()}
                >
                  {format(item.timestamp, dateFormat, { locale })}
                </time>
              </div>

              {/* Actions */}
              {item.actions && (
                <div
                  className={cn(
                    'flex-shrink-0 ml-2',
                    orientation === 'horizontal' && 'ml-0 mt-2'
                  )}
                  role="group"
                  aria-label="Acciones del elemento"
                >
                  {item.actions}
                </div>
              )}
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
LegacyTimelineItem.displayName = 'LegacyTimelineItem'

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
