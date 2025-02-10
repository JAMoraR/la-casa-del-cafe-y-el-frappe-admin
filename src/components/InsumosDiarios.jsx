"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
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

export function InsumosDiarios() {
  const [insumos, setInsumos] = useState(() => {
    const savedInsumos = localStorage.getItem("insumos");
    return savedInsumos ? JSON.parse(savedInsumos) : [];
  });
  const [insumosEliminados, setInsumosEliminados] = useState(() => {
    const savedInsumosEliminados = localStorage.getItem("insumosEliminados");
    return savedInsumosEliminados ? JSON.parse(savedInsumosEliminados) : [];
  });
  const [nuevoInsumo, setNuevoInsumo] = useState({
    nombre: "",
    cantidad: "",
    precio: "",
    tipo: "unitario",
  });
  const [tiposInsumo, setTiposInsumo] = useState(() => {
    const savedTipos = localStorage.getItem("tiposInsumo");
    return savedTipos ? JSON.parse(savedTipos) : [];
  });
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [insumoAEliminar, setInsumoAEliminar] = useState(null);

  useEffect(() => {
    localStorage.setItem("insumos", JSON.stringify(insumos));
  }, [insumos]);

  useEffect(() => {
    localStorage.setItem(
      "insumosEliminados",
      JSON.stringify(insumosEliminados)
    );
  }, [insumosEliminados]);

  const handleChange = (field, value) => {
    setNuevoInsumo((prev) => {
      const updatedInsumo = { ...prev, [field]: value };
      if (field === "nombre") {
        setValue(value);
        const tipoSeleccionado = tiposInsumo.find(
          (tipo) => tipo.nombre.toLowerCase() === value.toLowerCase()
        );
        if (tipoSeleccionado) {
          updatedInsumo.unidad = tipoSeleccionado.unidad;
        }
      }
      return updatedInsumo;
    });
  };

  const normalizarTexto = (texto) => {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const agregarInsumo = () => {
    const precio =
      nuevoInsumo.tipo === "unitario"
        ? Number.parseFloat(nuevoInsumo.precio)
        : Number.parseFloat(nuevoInsumo.precio) /
          Number.parseFloat(nuevoInsumo.cantidad);

    const nombreNormalizado = normalizarTexto(nuevoInsumo.nombre);

    const insumoExistente = insumos.find(
      (insumo) => normalizarTexto(insumo.nombre) === nombreNormalizado
    );

    if (insumoExistente) {
      setInsumos(
        insumos.map((insumo) =>
          normalizarTexto(insumo.nombre) === nombreNormalizado
            ? {
                ...insumo,
                cantidad:
                  insumo.cantidad + Number.parseFloat(nuevoInsumo.cantidad),
                precios: [...insumo.precios, precio].sort((a, b) => a - b),
              }
            : insumo
        )
      );
    } else {
      const tipoInsumo = tiposInsumo.find(
        (tipo) => tipo.nombre === nuevoInsumo.nombre
      );
      const nuevoInsumoProcesado = {
        id: Date.now(),
        nombre: nuevoInsumo.nombre,
        cantidad: Number.parseFloat(nuevoInsumo.cantidad),
        precios: [precio],
        unidad: tipoInsumo ? tipoInsumo.unidad : "",
        alertaBajo: tipoInsumo ? tipoInsumo.alertaBajo : 0,
      };
      setInsumos([...insumos, nuevoInsumoProcesado]);
    }

    setNuevoInsumo({ nombre: "", cantidad: "", precio: "", tipo: "unitario" });
    setValue("");
  };

  const eliminarInsumo = (insumo) => {
    setInsumoAEliminar(insumo);
  };

  const confirmarEliminacion = () => {
    if (insumoAEliminar) {
      const insumoEliminado = {
        ...insumoAEliminar,
        fechaEliminacion: new Date().toISOString(),
      };
      setInsumosEliminados([...insumosEliminados, insumoEliminado]);
      setInsumos(insumos.filter((i) => i.id !== insumoAEliminar.id));
      setInsumoAEliminar(null);
    }
  };

  const recuperarInsumo = (insumoEliminado) => {
    const insumoExistente = insumos.find(
      (i) => i.nombre === insumoEliminado.nombre
    );
    if (insumoExistente) {
      setInsumos(
        insumos.map((i) =>
          i.nombre === insumoEliminado.nombre
            ? {
                ...i,
                cantidad: i.cantidad + insumoEliminado.cantidad,
                precios: [...i.precios, ...insumoEliminado.precios].sort(
                  (a, b) => a - b
                ),
              }
            : i
        )
      );
    } else {
      setInsumos([
        ...insumos,
        {
          ...insumoEliminado,
          id: Date.now(),
        },
      ]);
    }
    setInsumosEliminados(
      insumosEliminados.filter((i) => i.id !== insumoEliminado.id)
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const cincoDiasAtras = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      setInsumosEliminados(
        insumosEliminados.filter(
          (i) => new Date(i.fechaEliminacion) > cincoDiasAtras
        )
      );
    }, 24 * 60 * 60 * 1000); // Ejecutar cada 24 horas

    return () => clearInterval(interval);
  }, [insumosEliminados]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Gestión de Insumos</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          <Label htmlFor="nombre">Nombre del insumo</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {value
                  ? tiposInsumo.find(
                      (tipo) => tipo.nombre.toLowerCase() === value
                    )?.nombre
                  : "Seleccionar insumo..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Buscar insumo..." />
                <CommandList>
                  <CommandEmpty>No se encontró el insumo.</CommandEmpty>
                  <CommandGroup>
                    {tiposInsumo.map((tipo) => (
                      <CommandItem
                        key={tipo.id}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          handleChange("nombre", currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === tipo.nombre.toLowerCase()
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {tipo.nombre}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="cantidad">Cantidad</Label>
          <Input
            id="cantidad"
            type="number"
            value={nuevoInsumo.cantidad}
            onChange={(e) => handleChange("cantidad", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="precio">Precio</Label>
          <Input
            id="precio"
            type="number"
            value={nuevoInsumo.precio}
            onChange={(e) => handleChange("precio", e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="tipo">Tipo de precio</Label>
          <Select
            value={nuevoInsumo.tipo}
            onValueChange={(value) => handleChange("tipo", value)}
          >
            <SelectTrigger id="tipo">
              <SelectValue placeholder="Tipo de precio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unitario">Precio unitario</SelectItem>
              <SelectItem value="total">Precio total</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={agregarInsumo} className="col-span-2">
          Agregar Insumo
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Precio Unitario</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {insumos.map((insumo) => (
            <TableRow key={insumo.id}>
              <TableCell>{insumo.nombre}</TableCell>
              <TableCell>{insumo.cantidad}</TableCell>
              <TableCell>
                {insumo.precios.length === 1
                  ? `$${insumo.precios[0].toFixed(2)}`
                  : `$${insumo.precios[0].toFixed(2)} - $${insumo.precios[
                      insumo.precios.length - 1
                    ].toFixed(2)}`}
              </TableCell>
              <TableCell>{insumo.unidad}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => eliminarInsumo(insumo)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AlertDialog
        open={!!insumoAEliminar}
        onOpenChange={() => setInsumoAEliminar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás seguro de que quieres eliminar este insumo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el insumo. Podrás recuperarlo dentro de los
              próximos 5 días.
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
      {insumosEliminados.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">
            Insumos Eliminados (Recuperables)
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {insumosEliminados.map((insumo) => (
                <TableRow key={insumo.id}>
                  <TableCell>{insumo.nombre}</TableCell>
                  <TableCell>{insumo.cantidad}</TableCell>
                  <TableCell>{insumo.unidad}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => recuperarInsumo(insumo)}
                    >
                      Recuperar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
