"use client";
import { useState, useEffect } from "react";

export type DashboardNavRoute = {
  label: string;
  value: string;
};

const defaultRoutes: DashboardNavRoute[] = [
  { label: "Usuários", value: "/dashboard/users" },
  { label: "Aulas", value: "/dashboard/lessons" },
  { label: "Categorias", value: "/dashboard/categories" },
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
    <select
      className={`bg-card border border-border rounded-lg px-4 py-2 text-lg font-semibold text-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 ${className}`}
      value={selectedRoute}
      onChange={e => setSelectedRoute(e.target.value)}
    >
      {routes.map(route => (
        <option key={route.value} value={route.value}>{route.label}</option>
      ))}
    </select>
  );
}
