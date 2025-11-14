'use client'

import { Pie, PieChart, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'

export function GenderDonut({
  male = 52,
  female = 48,
}: {
  male?: number
  female?: number
}) {
  const data = [
    { name: 'Hembra', value: female, fill: 'var(--color-female)' },
    { name: 'Macho', value: male, fill: 'var(--color-male)' },
  ]

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Pacientes por sexo</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            female: { label: 'Hembra', color: 'hsl(var(--secondary))' },
            male: { label: 'Macho', color: 'hsl(var(--primary))' },
          }}
          className="aspect-[3/2]"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
            >
              {data.map((entry, index) => (
                <Cell key={`c-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
