"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export function Configuracion() {
  const [config, setConfig] = useState(() => {
    const savedConfig = localStorage.getItem("config");
    return savedConfig
      ? JSON.parse(savedConfig)
      : {
          alertaNomina: 5000,
          alertaVentasBajasSemanal: 7000,
        };
  });

  const [tiposInsumo, setTiposInsumo] = useState(() => {
    const savedTipos = localStorage.getItem("tiposInsumo");
    return savedTipos ? JSON.parse(savedTipos) : [];
  });

  const [tiposInsumoEliminados, setTiposInsumoEliminados] = useState(() => {
    const savedTiposEliminados = localStorage.getItem("tiposInsumoEliminados");
    return savedTiposEliminados ? JSON.parse(savedTiposEliminados) : [];
  });

  const [nuevoTipo, setNuevoTipo] = useState({
    nombre: "",
    unidad: "",
    alertaBajo: "",
  });

  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  const [tipoAEliminar, setTipoAEliminar] = useState(null);
  const [tipoARecuperar, setTipoARecuperar] = useState(null);

  useEffect(() => {
    localStorage.setItem("config", JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem("tiposInsumo", JSON.stringify(tiposInsumo));
  }, [tiposInsumo]);

  useEffect(() => {
    localStorage.setItem(
      "tiposInsumoEliminados",
      JSON.stringify(tiposInsumoEliminados)
    );
  }, [tiposInsumoEliminados]);

  useEffect(() => {
    const interval = setInterval(() => {
      const cincoDiasAtras = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      setTiposInsumoEliminados(
        tiposInsumoEliminados.filter(
          (tipo) => new Date(tipo.fechaEliminacion) > cincoDiasAtras
        )
      );
    }, 24 * 60 * 60 * 1000); // Ejecutar cada 24 horas

    return () => clearInterval(interval);
  }, [tiposInsumoEliminados]);

  const handleConfigChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: Number.parseFloat(value) }));
  };

  const handleTipoChange = (field, value) => {
    setNuevoTipo((prev) => ({ ...prev, [field]: value }));
  };

  const agregarTipo = () => {
    if (nuevoTipo.nombre && nuevoTipo.unidad && nuevoTipo.alertaBajo) {
      setTiposInsumo([...tiposInsumo, { ...nuevoTipo, id: Date.now() }]);
      setNuevoTipo({ nombre: "", unidad: "", alertaBajo: "" });
    }
  };

  const eliminarTipo = (id) => {
    const tipo = tiposInsumo.find((t) => t.id === id);
    if (tipo) {
      setTipoAEliminar(tipo);
    }
  };

  const confirmarEliminacion = () => {
    if (tipoAEliminar) {
      const tipoEliminado = {
        ...tipoAEliminar,
        fechaEliminacion: new Date().toISOString(),
      };
      setTiposInsumoEliminados([...tiposInsumoEliminados, tipoEliminado]);
      setTiposInsumo(
        tiposInsumo.filter((tipo) => tipo.id !== tipoAEliminar.id)
      );
      setMensaje({
        texto: "Tipo de insumo eliminado correctamente",
        tipo: "exito",
      });
      setTipoAEliminar(null);
    }
  };

  const recuperarTipoInsumo = (id) => {
    const tipo = tiposInsumoEliminados.find((t) => t.id === id);
    if (tipo) {
      setTipoARecuperar(tipo);
    }
  };

  const confirmarRecuperacion = () => {
    if (tipoARecuperar) {
      setTiposInsumo([...tiposInsumo, { ...tipoARecuperar, id: Date.now() }]);
      setTiposInsumoEliminados(
        tiposInsumoEliminados.filter((tipo) => tipo.id !== tipoARecuperar.id)
      );
      setMensaje({
        texto: "Tipo de insumo recuperado correctamente",
        tipo: "exito",
      });
      setTipoARecuperar(null);
    }
  };

  const guardarConfiguracion = () => {
    try {
      // Aquí iría la lógica para guardar la configuración en el backend
      console.log("Configuración guardada:", config);
      console.log("Tipos de insumo guardados:", tiposInsumo);
      setMensaje({
        texto: "Configuración guardada correctamente",
        tipo: "exito",
      });
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
      setMensaje({ texto: "Error al guardar la configuración", tipo: "error" });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Configuración</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="alertaNomina">Alerta de nómina alta (monto)</Label>
          <Input
            id="alertaNomina"
            type="number"
            value={config.alertaNomina}
            onChange={(e) => handleConfigChange("alertaNomina", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="alertaVentasBajasSemanal">
            Alerta de ventas bajas semanal (monto)
          </Label>
          <Input
            id="alertaVentasBajasSemanal"
            type="number"
            value={config.alertaVentasBajasSemanal}
            onChange={(e) =>
              handleConfigChange("alertaVentasBajasSemanal", e.target.value)
            }
          />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Tipos de Insumos</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Nombre del insumo"
            value={nuevoTipo.nombre}
            onChange={(e) => handleTipoChange("nombre", e.target.value)}
          />
          <Input
            placeholder="Unidad"
            value={nuevoTipo.unidad}
            onChange={(e) => handleTipoChange("unidad", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Alerta de bajo stock"
            value={nuevoTipo.alertaBajo}
            onChange={(e) => handleTipoChange("alertaBajo", e.target.value)}
          />
          <Button onClick={agregarTipo}>Agregar Tipo</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead>Alerta de bajo stock</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiposInsumo.map((tipo) => (
              <TableRow key={tipo.id}>
                <TableCell>{tipo.nombre}</TableCell>
                <TableCell>{tipo.unidad}</TableCell>
                <TableCell>{tipo.alertaBajo}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => eliminarTipo(tipo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {tiposInsumoEliminados.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">
            Tipos de Insumo Eliminados (Recuperables)
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Alerta de bajo stock</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiposInsumoEliminados.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell>{tipo.nombre}</TableCell>
                  <TableCell>{tipo.unidad}</TableCell>
                  <TableCell>{tipo.alertaBajo}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => recuperarTipoInsumo(tipo.id)}
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
      <Button onClick={guardarConfiguracion}>Guardar Configuración</Button>
      {mensaje.texto && (
        <div
          className={`mt-4 p-2 rounded ${
            mensaje.tipo === "exito"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {mensaje.texto}
        </div>
      )}
      <AlertDialog
        open={!!tipoAEliminar}
        onOpenChange={() => setTipoAEliminar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás seguro de que quieres eliminar este tipo de insumo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el tipo de insumo. Podrás recuperarlo dentro
              de los próximos 5 días.
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

      <AlertDialog
        open={!!tipoARecuperar}
        onOpenChange={() => setTipoARecuperar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás seguro de que quieres recuperar este tipo de insumo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción recuperará el tipo de insumo eliminado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarRecuperacion}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
