import Link from 'next/link';
import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// Import icons or components needed
import styles from './scss/Dashboard.module.scss';

// Dashboard layout with sidebar and main content
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Check for authentication (can be moved to middleware)
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  // Verificar se o usuário é ADMIN
  const user = session.user as any;
  if (user?.role !== UserRole.ADMIN) {
    redirect('/auth/signin?error=AccessDenied');
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <Link href="/dashboard">
            <div className={styles.logo}>
              <h2>Valorant Academy</h2>
            </div>
          </Link>
        </div>
        
        <nav className={styles.navigation}>
          <div className={styles.navSection}>
            <h3 className={styles.navTitle}>Principal</h3>
            <ul>
              <li>
                <Link href="/dashboard" className={styles.navLink}>
                  <span className={styles.navIcon}>📊</span>
                  <span>Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className={styles.navSection}>
            <h3 className={styles.navTitle}>Gerenciamento</h3>
            <ul>
              <li>
                <Link href="/dashboard/users" className={styles.navLink}>
                  <span className={styles.navIcon}>👤</span>
                  <span>Usuários</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/lessons" className={styles.navLink}>
                  <span className={styles.navIcon}>📝</span>
                  <span>Aulas</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/categories" className={styles.navLink}>
                  <span className={styles.navIcon}>📁</span>
                  <span>Categorias</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className={styles.navSection}>
            <h3 className={styles.navTitle}>Conta</h3>
            <ul>
              <li>
                <Link href="/api/auth/signout" className={styles.navLink}>
                  <span className={styles.navIcon}>🚪</span>
                  <span>Sair</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
      
      {/* Main content */}
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.pageTitle}>
            <h1>Dashboard</h1>
          </div>
          <div className={styles.profileSection}>
            <div className={styles.userInfo}>
              <span>{session.user?.name || 'Usuário'}</span>
              <span className={styles.userEmail}>{session.user?.email}</span>
            </div>
            <div className={styles.avatar}>
              {session.user?.image ? (
                <img src={session.user.image} alt="User avatar" />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {(session.user?.name || 'U')[0]}
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <div className={styles.pageContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
