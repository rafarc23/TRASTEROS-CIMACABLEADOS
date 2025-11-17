"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Pago, Gasto } from "@/types"

interface BeneficiosChartProps {
  pagos: Pago[]
  gastos: Gasto[]
  ingresosEsperadosPorMes: { mes: number; anio: number; monto: number }[]
}

export function BeneficiosChart({ pagos, gastos, ingresosEsperadosPorMes }: BeneficiosChartProps) {
  // Obtener los últimos 6 meses
  const hoy = new Date()
  const meses = []
  for (let i = 5; i >= 0; i--) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)
    meses.push({
      mes: fecha.getMonth() + 1,
      anio: fecha.getFullYear(),
      nombre: fecha.toLocaleDateString("es-ES", { month: "short", year: "numeric" }),
    })
  }

  // Calcular datos para cada mes
  const data = meses.map((periodo) => {
    // Ingresos esperados (basado en trasteros ocupados)
    const ingresosEsperados =
      ingresosEsperadosPorMes.find((i) => i.mes === periodo.mes && i.anio === periodo.anio)?.monto || 0

    // Ingresos registrados
    const ingresosRegistrados = pagos
      .filter((p) => p.mesPago === periodo.mes && p.anioPago === periodo.anio)
      .reduce((sum, p) => sum + p.monto, 0)

    // Gastos del mes
    const gastosDelMes = gastos
      .filter((g) => {
        const fecha = new Date(g.fecha)
        return fecha.getMonth() + 1 === periodo.mes && fecha.getFullYear() === periodo.anio
      })
      .reduce((sum, g) => sum + g.monto, 0)

    // Beneficio neto
    const beneficio = ingresosEsperados - gastosDelMes

    return {
      nombre: periodo.nombre,
      ingresos: Number(ingresosEsperados.toFixed(2)),
      gastos: Number(gastosDelMes.toFixed(2)),
      beneficio: Number(beneficio.toFixed(2)),
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución de Beneficios</CardTitle>
        <CardDescription>Ingresos, gastos y beneficio neto de los últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(2)}€`}
              contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
            />
            <Legend />
            <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" />
            <Bar dataKey="gastos" fill="#ef4444" name="Gastos" />
            <Bar dataKey="beneficio" fill="#3b82f6" name="Beneficio" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
