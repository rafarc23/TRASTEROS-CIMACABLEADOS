"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Trastero, Inquilino, Pago } from "@/types"

interface RegistrarPagoDialogProps {
  trastero: Trastero | null
  inquilino: Inquilino | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRegistrar: (pago: Omit<Pago, "id">) => void
}

export function RegistrarPagoDialog({
  trastero,
  inquilino,
  open,
  onOpenChange,
  onRegistrar,
}: RegistrarPagoDialogProps) {
  const hoy = new Date()
  const [formData, setFormData] = useState({
    monto: trastero?.precioMensual || 0,
    metodoPago: "transferencia",
    concepto: "",
    mesPago: hoy.getMonth() + 1,
    anioPago: hoy.getFullYear(),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trastero || !inquilino) return

    onRegistrar({
      trasteroId: trastero.id,
      inquilinoId: inquilino.id,
      fecha: new Date().toISOString().split("T")[0],
      monto: formData.monto,
      metodoPago: formData.metodoPago,
      concepto: formData.concepto || `Pago mensual trastero #${trastero.numero}`,
      mesPago: formData.mesPago,
      anioPago: formData.anioPago,
    })

    setFormData({
      monto: trastero.precioMensual,
      metodoPago: "transferencia",
      concepto: "",
      mesPago: hoy.getMonth() + 1,
      anioPago: hoy.getFullYear(),
    })
    onOpenChange(false)
  }

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar pago</DialogTitle>
          <DialogDescription>
            {trastero && inquilino && (
              <>
                Trastero #{trastero.numero} - {inquilino.nombre} {inquilino.apellidos}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mes">Mes del pago *</Label>
              <Select
                value={formData.mesPago.toString()}
                onValueChange={(value) => setFormData({ ...formData, mesPago: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {meses.map((mes, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                      {mes}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="anio">Año *</Label>
              <Select
                value={formData.anioPago.toString()}
                onValueChange={(value) => setFormData({ ...formData, anioPago: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[hoy.getFullYear() - 1, hoy.getFullYear(), hoy.getFullYear() + 1].map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monto">Monto (€) *</Label>
            <Input
              id="monto"
              type="number"
              step="0.01"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: Number.parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metodo">Método de pago *</Label>
            <Select
              value={formData.metodoPago}
              onValueChange={(value) => setFormData({ ...formData, metodoPago: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transferencia">Transferencia</SelectItem>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="tarjeta">Tarjeta</SelectItem>
                <SelectItem value="domiciliacion">Domiciliación</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="concepto">Concepto</Label>
            <Input
              id="concepto"
              value={formData.concepto}
              onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
              placeholder={`Pago mensual trastero #${trastero?.numero}`}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Registrar pago</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
