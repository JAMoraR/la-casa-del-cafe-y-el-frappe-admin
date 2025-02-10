"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function NominaDiaria() {
  const [nomina, setNomina] = useState(() => {
    const savedNomina = localStorage.getItem("nomina");
    return savedNomina ? JSON.parse(savedNomina) : [];
  });
  const [nuevoRegistro, setNuevoRegistro] = useState({
    fecha: "",
    empleado: "",
    horasSemanales: "",
    tarifa: "",
  });
  const [editando, setEditando] = useState(null);
  const [eliminando, setEliminando] = useState(null);

  useEffect(() => {
    localStorage.setItem("nomina", JSON.stringify(nomina));
  }, [nomina]);

  const handleChange = (field, value) => {
    if (editando) {
      setNomina(
        nomina.map((registro) =>
          registro.id === editando ? { ...registro, [field]: value } : registro
        )
      );
    } else {
      setNuevoRegistro((prev) => ({ ...prev, [field]: value }));
    }
  };

  const agregarRegistro = () => {
    if (editando) {
      setNomina(
        nomina.map((registro) =>
          registro.id === editando
            ? {
                ...registro,
                fecha: nuevoRegistro.fecha || registro.fecha,
                empleado: nuevoRegistro.empleado || registro.empleado,
                horasSemanales:
                  Number.parseFloat(nuevoRegistro.horasSemanales) ||
                  registro.horasSemanales,
                tarifa:
                  Number.parseFloat(nuevoRegistro.tarifa) || registro.tarifa,
              }
            : registro
        )
      );
      setEditando(null);
    } else {
      setNomina([
        ...nomina,
        {
          id: Date.now(),
          ...nuevoRegistro,
          horasSemanales: Number.parseFloat(nuevoRegistro.horasSemanales),
          tarifa: Number.parseFloat(nuevoRegistro.tarifa),
        },
      ]);
    }
    setNuevoRegistro({
      fecha: "",
      empleado: "",
      horasSemanales: "",
      tarifa: "",
    });
  };

  const editarRegistro = (id) => {
    const registro = nomina.find((r) => r.id === id);
    setNuevoRegistro(registro);
    setEditando(id);
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setNuevoRegistro({
      fecha: "",
      empleado: "",
      horasSemanales: "",
      tarifa: "",
    });
  };

  const confirmarEliminacion = () => {
    if (eliminando) {
      setNomina(nomina.filter((registro) => registro.id !== eliminando));
      setEliminando(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Registro de Nómina Semanal</h2>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">
          {editando ? "Editar registro" : "Agregar nuevo registro"}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            value={nuevoRegistro.fecha}
            onChange={(e) => handleChange("fecha", e.target.value)}
          />
          <Input
            placeholder="Nombre del empleado"
            value={nuevoRegistro.empleado}
            onChange={(e) => handleChange("empleado", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Horas semanales"
            value={nuevoRegistro.horasSemanales}
            onChange={(e) => handleChange("horasSemanales", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Tarifa por hora"
            value={nuevoRegistro.tarifa}
            onChange={(e) => handleChange("tarifa", e.target.value)}
          />
          <Button onClick={agregarRegistro} className="col-span-2">
            {editando ? "Guardar Cambios" : "Agregar Registro"}
          </Button>
          {editando && (
            <Button
              onClick={cancelarEdicion}
              className="col-span-2"
              variant="outline"
            >
              Cancelar Edición
            </Button>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Registros de nómina</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Empleado</TableHead>
              <TableHead>Horas Semanales</TableHead>
              <TableHead>Tarifa</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nomina.map((registro) => (
              <TableRow key={registro.id}>
                <TableCell>{registro.fecha}</TableCell>
                <TableCell>{registro.empleado}</TableCell>
                <TableCell>{registro.horasSemanales}</TableCell>
                <TableCell>${registro.tarifa.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editarRegistro(registro.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEliminando(registro.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={!!eliminando} onOpenChange={() => setEliminando(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás seguro de que quieres eliminar este registro?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarEliminacion}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
