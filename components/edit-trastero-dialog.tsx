"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Trastero, Inquilino } from "@/types"

interface EditTrasteroDialogProps {
  trastero: Trastero | null
  inquilinos: Inquilino[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (trastero: Trastero, inquilino?: Inquilino) => void
}

export function EditTrasteroDialog({ trastero, inquilinos, open, onOpenChange, onSave }: EditTrasteroDialogProps) {
  const [formData, setFormData] = useState<Trastero | null>(null)
  const [fechaAlta, setFechaAlta] = useState<string>("")

  useEffect(() => {
    if (trastero) {
      setFormData({ ...trastero })
      const inquilino = inquilinos.find((i) => i.id === trastero.inquilinoId)
      if (inquilino?.fechaAlta) {
        setFechaAlta(inquilino.fechaAlta)
      } else {
        setFechaAlta("")
      }
    }
  }, [trastero, inquilinos])

  if (!formData) return null

  const handleSave = () => {
    const inquilino = inquilinos.find((i) => i.id === formData.inquilinoId)
    if (inquilino && fechaAlta && fechaAlta !== inquilino.fechaAlta) {
      const updatedInquilino = { ...inquilino, fechaAlta }
      onSave(formData, updatedInquilino)
    } else {
      onSave(formData)
    }
    onOpenChange(false)
  }

  const inquilinoActual = inquilinos.find((i) => i.id === formData.inquilinoId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Trastero #{formData.numero}</DialogTitle>
          <DialogDescription>Modifica la información del trastero</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="inquilino">Inquilino</Label>
            <Select
              value={formData.inquilinoId || "none"}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  inquilinoId: value === "none" ? null : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar inquilino" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin inquilino</SelectItem>
                {inquilinos.map((inq) => (
                  <SelectItem key={inq.id} value={inq.id}>
                    {inq.nombre} {inq.apellidos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.inquilinoId && inquilinoActual && (
            <div className="space-y-2">
              <Label htmlFor="fecha-alta">Fecha de alta</Label>
              <Input id="fecha-alta" type="date" value={fechaAlta} onChange={(e) => setFechaAlta(e.target.value)} />
              <p className="text-xs text-muted-foreground">
                Fecha desde la que el inquilino está dado de alta en el trastero
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="pago">Al corriente de pago</Label>
            <Switch
              id="pago"
              checked={formData.alCorrientePago}
              onCheckedChange={(checked) => setFormData({ ...formData, alCorrientePago: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="precio">Precio mensual (€)</Label>
            <Input
              id="precio"
              type="number"
              value={formData.precioMensual}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  precioMensual: Number.parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="llaves-cantidad">Cantidad de llaves</Label>
              <Input
                id="llaves-cantidad"
                type="number"
                value={formData.llaves.cantidad}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    llaves: {
                      ...formData.llaves,
                      cantidad: Number.parseInt(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="llaves-tipo">Tipo de llaves</Label>
              <Select
                value={formData.llaves.tipo}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    llaves: { ...formData.llaves, tipo: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Estándar">Estándar</SelectItem>
                  <SelectItem value="Reforzada">Reforzada</SelectItem>
                  <SelectItem value="Electrónica">Electrónica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="codigo">Código de alarma</Label>
            <Input
              id="codigo"
              value={formData.codigoAlarma || ""}
              onChange={(e) => setFormData({ ...formData, codigoAlarma: e.target.value })}
              placeholder="1234"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              value={formData.notas || ""}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              placeholder="Información adicional..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar cambios</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
