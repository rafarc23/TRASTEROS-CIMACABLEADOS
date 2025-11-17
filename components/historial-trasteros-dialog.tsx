"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { History, Search, Calendar, User, Clock } from "lucide-react"
import type { Inquilino } from "@/types"

interface HistorialTrasterosDialogProps {
  historial: Inquilino[]
}

function calcularDuracion(fechaAlta: string, fechaBaja?: string): string {
  const inicio = new Date(fechaAlta)
  const fin = fechaBaja ? new Date(fechaBaja) : new Date()
  const diffTime = Math.abs(fin.getTime() - inicio.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 30) {
    return `${diffDays} ${diffDays === 1 ? "día" : "días"}`
  }

  const meses = Math.floor(diffDays / 30)
  const dias = diffDays % 30

  if (dias === 0) {
    return `${meses} ${meses === 1 ? "mes" : "meses"}`
  }

  return `${meses} ${meses === 1 ? "mes" : "meses"} y ${dias} ${dias === 1 ? "día" : "días"}`
}

export function HistorialTrasterosDialog({ historial }: HistorialTrasterosDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredHistorial = historial.filter((inq) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      inq.trasteroNumero?.toString().includes(searchLower) ||
      inq.nombre.toLowerCase().includes(searchLower) ||
      inq.apellidos.toLowerCase().includes(searchLower)
    )
  })

  // Agrupar por trastero
  const historialPorTrastero = filteredHistorial.reduce(
    (acc, inq) => {
      const numero = inq.trasteroNumero || 0
      if (!acc[numero]) {
        acc[numero] = []
      }
      acc[numero].push(inq)
      return acc
    },
    {} as Record<number, Inquilino[]>,
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-2 border-slate-300 hover:border-slate-400 font-semibold shadow-sm bg-transparent"
        >
          <History className="h-4 w-4 mr-2" />
          Ver historial de trasteros
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Historial de Ocupación por Trastero</DialogTitle>
          <DialogDescription>Línea temporal completa de inquilinos desde el primer día</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por: Trastero 1, Nombre o Apellidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 font-medium"
            />
          </div>

          {Object.keys(historialPorTrastero).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay historial de inquilinos registrado</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(historialPorTrastero)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([numero, inquilinos]) => (
                  <Card key={numero} className="shadow-lg border-2">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-6 pb-4 border-b-2">
                        <div className="flex items-center gap-3">
                          <Badge variant="default" className="text-lg px-4 py-2 bg-slate-700">
                            Trastero #{numero}
                          </Badge>
                          <span className="text-sm text-muted-foreground font-medium">
                            {inquilinos.length} {inquilinos.length === 1 ? "inquilino" : "inquilinos"} en total
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Desde:{" "}
                          {new Date(
                            Math.min(...inquilinos.map((i) => new Date(i.fechaAlta).getTime())),
                          ).toLocaleDateString("es-ES")}
                        </div>
                      </div>

                      <div className="space-y-4 relative pl-6">
                        {/* Línea vertical de tiempo */}
                        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-red-500"></div>

                        {inquilinos
                          .sort((a, b) => new Date(a.fechaAlta).getTime() - new Date(b.fechaAlta).getTime())
                          .map((inq, index) => (
                            <div key={inq.id} className="relative">
                              {/* Punto en la línea temporal */}
                              <div className="absolute -left-[22px] top-6 w-3 h-3 rounded-full bg-red-600 border-2 border-white shadow-md"></div>

                              <div className="bg-gradient-to-r from-slate-50 to-white p-5 rounded-lg border-2 border-slate-200 shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                                        #{index + 1}
                                      </Badge>
                                      <div className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-slate-700" />
                                        <span className="font-bold text-lg text-slate-800">
                                          {inq.nombre} {inq.apellidos}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      {inq.email && (
                                        <p className="text-muted-foreground">
                                          <span className="font-semibold">Email:</span> {inq.email}
                                        </p>
                                      )}
                                      {inq.telefono && (
                                        <p className="text-muted-foreground">
                                          <span className="font-semibold">Teléfono:</span> {inq.telefono}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="text-right space-y-2 min-w-[200px]">
                                    <div className="flex items-center justify-end gap-2 text-sm bg-green-50 px-3 py-1.5 rounded-md border border-green-200">
                                      <Calendar className="h-4 w-4 text-green-600" />
                                      <span className="text-muted-foreground font-medium">Alta:</span>
                                      <span className="font-bold text-green-700">
                                        {new Date(inq.fechaAlta).toLocaleDateString("es-ES")}
                                      </span>
                                    </div>

                                    {inq.fechaBaja && (
                                      <div className="flex items-center justify-end gap-2 text-sm bg-red-50 px-3 py-1.5 rounded-md border border-red-200">
                                        <Calendar className="h-4 w-4 text-red-600" />
                                        <span className="text-muted-foreground font-medium">Baja:</span>
                                        <span className="font-bold text-red-700">
                                          {new Date(inq.fechaBaja).toLocaleDateString("es-ES")}
                                        </span>
                                      </div>
                                    )}

                                    <div className="flex items-center justify-end gap-2 text-sm bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200">
                                      <Clock className="h-4 w-4 text-blue-600" />
                                      <span className="text-muted-foreground font-medium">Duración:</span>
                                      <span className="font-bold text-blue-700">
                                        {calcularDuracion(inq.fechaAlta, inq.fechaBaja)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
