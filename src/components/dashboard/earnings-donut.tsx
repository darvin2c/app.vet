'use client'

import { Pie, PieChart, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const data = [
  { name: 'Consultas', value: 4500, fill: 'var(--color-consultas)' },
  { name: 'Farmacia', value: 3200, fill: 'var(--color-farmacia)' },
  { name: 'Cirugía', value: 2100, fill: 'var(--color-cirugia)' },
  { name: 'Baños', value: 1500, fill: 'var(--color-banos)' },
]

export function EarningsDonut() {
  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Ingresos por Servicio
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{
            consultas: { label: 'Consultas', color: 'hsl(var(--chart-1))' },
            farmacia: { label: 'Farmacia', color: 'hsl(var(--chart-2))' },
            cirugia: { label: 'Cirugía', color: 'hsl(var(--chart-3))' },
            banos: { label: 'Baños', color: 'hsl(var(--chart-4))' },
          }}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <defs>
              <linearGradient
                id="gradient-consultas"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={1}
                />
              </linearGradient>
              <linearGradient
                id="gradient-farmacia"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={1}
                />
              </linearGradient>
              <linearGradient id="gradient-cirugia" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--chart-3))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--chart-3))"
                  stopOpacity={1}
                />
              </linearGradient>
              <linearGradient id="gradient-banos" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--chart-4))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--chart-4))"
                  stopOpacity={1}
                />
              </linearGradient>
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={5}
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#gradient-${entry.name
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')})`}
                />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              verticalAlign="bottom"
              height={36}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
