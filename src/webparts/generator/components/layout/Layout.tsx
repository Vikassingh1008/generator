import * as React from 'react';
import styles from '../Generator.module.scss';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { NavigationTab, UserRole } from '../../models/types';

interface LayoutProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  approvalsCount: number;
  feedbackCount: number;
  userRole?: UserRole;
  onSwitchRole?: (role: UserRole) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentTab,
  onNavigate,
  approvalsCount,
  feedbackCount,
  userRole = 'admin',
  onSwitchRole,
  children
}) => {
  return (
    <div className={styles.appRoot}>
      {/* 1. Global Header at top */}
      <Header currentTab={currentTab} onNavigate={onNavigate} userRole={userRole} />

      {/* 2. Global Body layout: Left Sidebar + Center/Right Content */}
      <div className={styles.appBodyWrapper}>
        <Sidebar
          currentTab={currentTab}
          onNavigate={onNavigate}
          approvalsCount={approvalsCount}
          feedbackCount={feedbackCount}
          userRole={userRole}
          onSwitchRole={onSwitchRole}
        />

        <main className={styles.mainContentArea}>
          {children}
        </main>
      </div>
    </div>
  );
};
