"use client";

import { useState, useEffect } from "react";
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

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
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

  return (
    <div className={styles.usersContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Usuários</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancelar" : "Adicionar Usuário"}
        </Button>
      </div>
      
      {showAddForm && (
        <Card className={styles.formCard}>
          <UserForm 
            onSuccess={() => {
              setShowAddForm(false);
              loadUsers();
            }} 
          />
        </Card>
      )}
      
      {editingUser && (
        <Card className={styles.formCard}>
          <UserForm 
            initialData={editingUser}
            onSuccess={() => {
              setEditingUser(null);
              loadUsers();
            }} 
          />
        </Card>
      )}
      
      <Card className={styles.tableCard}>
        <div className={styles.tableContainer}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className={styles.loadingCell}>
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.nickname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <span className={user.isActive ? styles.statusActive : styles.statusInactive}>
                        {user.isActive ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <div className={styles.actions}>
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
                  <TableCell colSpan={6} className={styles.emptyCell}>
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
