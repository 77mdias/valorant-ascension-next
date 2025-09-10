"use client";

import { useState } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import styles from "./DataTable.module.scss";

export interface DataTableColumn<T> {
  key: Extract<keyof T, string> | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: DataTableColumn<T>[];
  title: string;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => Promise<void>;
  addButtonText?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  title,
  onAdd,
  onEdit,
  onDelete,
  addButtonText = "Adicionar"
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Filter data based on search term (across all fields)
  const filteredData = data.filter((item) => {
    return Object.entries(item).some(([_, value]) => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle delete with confirmation
  const handleDelete = async (item: T) => {
    if (!onDelete) return;
    
    try {
      setIsDeleting(item.id);
      await onDelete(item);
      toast({
        title: "Sucesso",
        description: "Item excluído com sucesso",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o item",
        variant: "destructive",
      });
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(null);
    }
  };
  
  return (
    <Card className={styles.dataTableCard}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.actions}>
          <div className={styles.searchContainer}>
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          {onAdd && (
            <Button onClick={onAdd} className={styles.addButton}>
              {addButtonText}
            </Button>
          )}
        </div>
      </div>
      
      <div className={styles.tableContainer}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key.toString()}>
                  {column.header}
                </TableHead>
              ))}
              {(onEdit || onDelete) && <TableHead>Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={`${item.id}-${column.key}`}>
                      {column.render ? column.render(item) : 
                        // Acesso seguro aos valores dinâmicos
                        (() => {
                          const value = typeof column.key === 'string' && column.key in item 
                            ? item[column.key as keyof T] 
                            : undefined;
                          
                          if (value === null || value === undefined) {
                            return "-";
                          }
                          
                          if (typeof value === 'boolean') {
                            return value ? 'Sim' : 'Não';
                          }
                          
                          if (value instanceof Date) {
                            return value.toLocaleDateString('pt-BR');
                          }
                          
                          return String(value);
                        })()}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell>
                      <div className={styles.rowActions}>
                        {onEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(item)}
                          >
                            Editar
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item)}
                            disabled={isDeleting === item.id}
                          >
                            {isDeleting === item.id ? "Excluindo..." : "Excluir"}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} 
                  className={styles.emptyState}
                >
                  {searchTerm ? "Nenhum resultado encontrado" : "Nenhum dado disponível"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
