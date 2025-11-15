"use client";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type DashboardNavRoute = {
  label: string;
  value: string;
};

const defaultRoutes: DashboardNavRoute[] = [
  { label: "Usuários", value: "/dashboard/users" },
  { label: "Aulas", value: "/dashboard/lessons" },
  { label: "Categorias", value: "/dashboard/categories" },
  { label: "Dashboard", value: "/dashboard" },
];

export function DashboardNavSelect({
  routes = defaultRoutes,
  currentRoute,
  className = "",
}: {
  routes?: DashboardNavRoute[];
  currentRoute: string;
  className?: string;
}) {
  const [selectedRoute, setSelectedRoute] = useState(currentRoute);

  useEffect(() => {
    if (selectedRoute !== currentRoute) {
      window.location.href = selectedRoute;
    }
  }, [selectedRoute, currentRoute]);

  return (
    <Select
      value={selectedRoute}
      onValueChange={(value: string) => setSelectedRoute(value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecione uma rota" />
      </SelectTrigger>
      <SelectContent>
        {routes.map((route) => (
          <SelectItem key={route.value} value={route.value}>
            {route.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
