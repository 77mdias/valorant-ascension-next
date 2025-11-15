"use client";

import { useState, useEffect } from "react";
import { DashboardNavSelect } from "@/components/dashboard/DashboardNavSelect";
import { listUsers, deleteUser } from "@/server/userActions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import UserForm from "@/components/forms/UserForm";
import styles from "./scss/UsersPage.module.scss";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { user as PrismaUser } from "@prisma/client";

export default function UsersPage() {
  const [users, setUsers] = useState<PrismaUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<PrismaUser | null>(null);
  const router = useRouter();
  
  // Carregar usuários
  const loadUsers = async () => {
    setLoading(true);
    try {
      const { success, data } = await listUsers();
      if (success && data) {
        setUsers(data);
      } else {
        toast({
          title: "Erro",
          description: "Falha ao carregar usuários",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Manipular exclusão de usuário
  const handleDeleteUser = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) {
      return;
    }
    
    try {
      await deleteUser(id);
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
      });
      loadUsers(); // Recarregar lista
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast({
        title: "Erro",
        description: "Falha ao excluir usuário",
        variant: "destructive",
      });
    }
  };

  // Formatação de data
  const formatDate = (date: string | Date) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  // Rotas do dashboard para navegação

  return (
    <div className="w-full max-w-7xl mx-auto p-2 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <DashboardNavSelect currentRoute="/dashboard/users" />
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancelar" : "Adicionar Usuário"}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-4">
          <UserForm 
            onSuccess={() => {
              setShowAddForm(false);
              loadUsers();
            }} 
          />
        </Card>
      )}

      {editingUser && (
        <Card className="mb-4">
          <UserForm 
            initialData={editingUser}
            onSuccess={() => {
              setEditingUser(null);
              loadUsers();
            }} 
          />
        </Card>
      )}

      <Card className="overflow-x-auto shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[160px] text-lg">Nome</TableHead>
              <TableHead className="min-w-[200px] text-lg">Email</TableHead>
              <TableHead className="min-w-[120px] text-lg">Função</TableHead>
              <TableHead className="min-w-[100px] text-lg">Status</TableHead>
              <TableHead className="min-w-[160px] text-lg">Cadastro</TableHead>
              <TableHead className="min-w-[120px] text-lg">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Carregando...</TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/40">
                  <TableCell className="font-semibold">{user.nickname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.isActive ? "bg-green-500/20 text-green-600" : "bg-muted/30 text-muted-foreground"}`}>
                      {user.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingUser(user)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhum usuário encontrado</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
