import * as React from 'react';
import styles from '../Generator.module.scss';
import {
  ApprovalsIcon,
  ContributorsIcon,
  DashboardIcon,
  DepartmentIcon,
  FeedbackIcon,
  HomeIcon,
  MailIcon,
  RefreshIcon,
  SubDepartmentIcon
} from '../common/Icons';
import { NavigationTab, UserRole } from '../../models/types';
import { CONTRIBUTOR_USER, CURRENT_USER } from '../../services/mockData';

interface SidebarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  approvalsCount?: number;
  feedbackCount?: number;
  userRole?: UserRole;
  onSwitchRole?: (role: UserRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  approvalsCount = 5,
  feedbackCount = 2,
  userRole = 'admin',
  onSwitchRole
}) => {
  const adminNavItems: Array<{
    id: NavigationTab;
    label: string;
    icon: React.ReactNode;
    badgeCount?: number;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon size={17} />
    },
    {
      id: 'home-page',
      label: 'Home Page',
      icon: <HomeIcon size={17} />
    },
    {
      id: 'department-pages',
      label: 'Department Pages',
      icon: <DepartmentIcon size={17} />
    },
    {
      id: 'sub-department-pages',
      label: 'Sub-department Pages',
      icon: <SubDepartmentIcon size={17} />
    },
    {
      id: 'contributors',
      label: 'Contributors',
      icon: <ContributorsIcon size={17} />
    },
    {
      id: 'requests',
      label: 'Requests & Feedback',
      icon: <FeedbackIcon size={17} />,
      badgeCount: feedbackCount
    },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: <ApprovalsIcon size={17} />,
      badgeCount: approvalsCount
    }
  ];

  const contributorNavItems: Array<{
    id: NavigationTab;
    label: string;
    icon: React.ReactNode;
    badgeCount?: number;
  }> = [
    {
      id: 'my-sites',
      label: 'My Sites',
      icon: <DashboardIcon size={17} />
    },
    {
      id: 'requests',
      label: 'Requests & Feedback',
      icon: <FeedbackIcon size={17} />
    },
    {
      id: 'my-submissions',
      label: 'My Submissions',
      icon: <MailIcon size={17} />,
      badgeCount: 1
    }
  ];

  const isContributor = userRole === 'contributor';
  const navItems = isContributor ? contributorNavItems : adminNavItems;
  const activeUser = isContributor ? CONTRIBUTOR_USER : CURRENT_USER;

  return (
    <aside className={styles.globalSidebar}>
      <div className={styles.sidebarSectionTitle}>
        {isContributor ? 'PAGE GENERATOR · CONTRIBUTOR' : 'PAGE GENERATOR · ADMIN'}
      </div>

      <nav className={styles.sidebarNav}>
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.sidebarNavItem} ${isActive ? styles.sidebarNavItemActive : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className={styles.sidebarNavIcon}>{item.icon}</span>
              <span className={styles.sidebarNavLabel}>{item.label}</span>
              {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                <span className={styles.sidebarNavBadge}>{item.badgeCount}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Role Switcher Pill for quick demo / switching */}
      {onSwitchRole && (
        <div className={styles.sidebarRoleSwitcher}>
          <button
            type="button"
            className={styles.roleSwitchBtn}
            onClick={() => onSwitchRole(isContributor ? 'admin' : 'contributor')}
            title="Switch preview mode between Admin and Contributor"
          >
            <RefreshIcon size={12} color="#eb5424" />
            <span>Switch to {isContributor ? 'Admin' : 'Contributor'}</span>
          </button>
        </div>
      )}

      {/* Profile Footer */}
      <div className={styles.sidebarUserProfile}>
        <div className={`${styles.userAvatarCircle} ${isContributor ? styles.userAvatarContributor : ''}`}>
          {activeUser.avatarInitials}
        </div>
        <div className={styles.userInfoText}>
          <div className={styles.userName}>{activeUser.name}</div>
          <div className={styles.userRole}>{activeUser.role}</div>
        </div>
      </div>
    </aside>
  );
};
