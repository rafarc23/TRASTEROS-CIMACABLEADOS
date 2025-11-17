"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Gasto } from "@/types"

interface AddGastoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (gasto: Omit<Gasto, "id">) => void
}

export function AddGastoDialog({ open, onOpenChange, onAdd }: AddGastoDialogProps) {
  const [concepto, setConcepto] = useState("")
  const [monto, setMonto] = useState("")
  const [categoria, setCategoria] = useState<Gasto["categoria"]>("mantenimiento")
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0])
  const [notas, setNotas] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!concepto || !monto) return

    onAdd({
      concepto,
      monto: Number.parseFloat(monto),
      categoria,
      fecha,
      notas: notas || undefined,
    })

    // Reset form
    setConcepto("")
    setMonto("")
    setCategoria("mantenimiento")
    setFecha(new Date().toISOString().split("T")[0])
    setNotas("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar gasto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="concepto">Concepto</Label>
              <Input
                id="concepto"
                placeholder="Ej: Reparación puerta trastero 5"
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monto">Monto (€)</Label>
                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input id="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Select value={categoria} onValueChange={(value) => setCategoria(value as Gasto["categoria"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="reparacion">Reparación</SelectItem>
                  <SelectItem value="limpieza">Limpieza</SelectItem>
                  <SelectItem value="seguridad">Seguridad</SelectItem>
                  <SelectItem value="impuestos">Impuestos</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas">Notas (opcional)</Label>
              <Textarea
                id="notas"
                placeholder="Información adicional sobre el gasto..."
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Registrar gasto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
