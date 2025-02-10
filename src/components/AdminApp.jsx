"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InsumosDiarios } from "./InsumosDiarios";
import { VentasDiarias } from "./VentasDiarias";
import { NominaDiaria } from "./NominaDiaria";
import { Reportes } from "./Reportes";
import { Configuracion } from "./Configuracion";
import { BandejaNotificaciones } from "./BandejaNotificaciones";

export function AdminApp() {
  const [activeTab, setActiveTab] = useState("reportes");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <BandejaNotificaciones />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
          <TabsTrigger value="insumos">Insumos</TabsTrigger>
          <TabsTrigger value="ventas">Ventas</TabsTrigger>
          <TabsTrigger value="nomina">Nómina</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>
        <TabsContent value="reportes">
          <Reportes />
        </TabsContent>
        <TabsContent value="insumos">
          <InsumosDiarios />
        </TabsContent>
        <TabsContent value="ventas">
          <VentasDiarias />
        </TabsContent>
        <TabsContent value="nomina">
          <NominaDiaria />
        </TabsContent>
        <TabsContent value="configuracion">
          <Configuracion />
        </TabsContent>
      </Tabs>
    </div>
  );
}
