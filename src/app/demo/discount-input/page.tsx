'use client'

import * as React from 'react'

import { DiscountInput } from '@/components/ui/discount-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function DiscountInputDemo() {
  const [totalAmount, setTotalAmount] = React.useState(200)
  const [discountValue, setDiscountValue] = React.useState(0)

  // Example 2 state
  const [totalAmount2, setTotalAmount2] = React.useState(1000)
  const [discountValue2, setDiscountValue2] = React.useState(100)

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Discount Input Demo</h1>
        <p className="text-muted-foreground">
          A component to handle discounts in both fixed amount and percentage,
          always returning the fixed monetary value.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Total Amount</Label>
              <Input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Discount</Label>
              <DiscountInput
                totalAmount={totalAmount}
                value={discountValue}
                onChange={setDiscountValue}
              />
            </div>

            <Separator />

            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-mono">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Discount Value (Raw):
                </span>
                <span className="font-mono">${discountValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Final Price:</span>
                <span>${(totalAmount - discountValue).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Effective Percentage:</span>
                <span>
                  {totalAmount > 0
                    ? ((discountValue / totalAmount) * 100).toFixed(2)
                    : '0.00'}
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pre-filled Value</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Total Amount</Label>
              <Input
                type="number"
                value={totalAmount2}
                onChange={(e) => setTotalAmount2(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Discount (Starts at $100)</Label>
              <DiscountInput
                totalAmount={totalAmount2}
                value={discountValue2}
                onChange={setDiscountValue2}
              />
            </div>

            <div className="bg-muted p-4 rounded-md text-sm">
              <p>
                Try switching to % mode. It should show <strong>10.00%</strong>{' '}
                (100/1000).
              </p>
              <p>
                Then change Total Amount to 2000. The discount value stays $100,
                so % should become <strong>5.00%</strong>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
