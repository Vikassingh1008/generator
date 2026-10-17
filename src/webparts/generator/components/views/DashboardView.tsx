import * as React from 'react';
import styles from '../Generator.module.scss';
import {
  DepartmentIcon,
  FolderIcon,
  HomeIcon,
  PageDocIcon,
  PlusIcon,
  SubDepartmentIcon
} from '../common/Icons';
import { StatusBadge } from '../common/StatusBadge';
import {
  IActivityItem,
  IQuickAction,
  ISiteStructureNode,
  IStatItem,
  NavigationTab
} from '../../models/types';
import { SharePointService } from '../../services/sharepointService';
import { CURRENT_USER } from '../../services/mockData';

interface DashboardViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onCreatePageClick: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onCreatePageClick
}) => {
  const [stats, setStats] = React.useState<IStatItem[]>([]);
  const [activities, setActivities] = React.useState<IActivityItem[]>([]);
  const [siteStructure, setSiteStructure] = React.useState<ISiteStructureNode | null>(null);

  React.useEffect(() => {
    SharePointService.getDashboardStats().then(setStats).catch(() => {});
    SharePointService.getRecentActivities().then(setActivities).catch(() => {});
    SharePointService.getSiteStructure().then(setSiteStructure).catch(() => {});
  }, []);

  const quickActions: IQuickAction[] = [
    {
      id: '1',
      title: 'Create Home Page',
      description: 'Site landing page',
      code: '1.1',
      targetTab: 'home-page'
    },
    {
      id: '2',
      title: 'Create Department Page',
      description: 'New department',
      code: '1.2',
      targetTab: 'department-pages'
    },
    {
      id: '3',
      title: 'Create Sub-department',
      description: 'Nested under a department',
      code: '1.5',
      targetTab: 'sub-department-pages'
    },
    {
      id: '4',
      title: 'Assign Contributors',
      description: 'Who can edit what',
      code: '1.7',
      targetTab: 'contributors'
    }
  ];

  const getQuickActionIcon = (id: string): React.ReactNode => {
    switch (id) {
      case '1':
        return <HomeIcon size={18} color="#eb5424" />;
      case '2':
        return <FolderIcon size={18} color="#eb5424" />;
      case '3':
        return <SubDepartmentIcon size={18} color="#eb5424" />;
      case '4':
      default:
        return <DepartmentIcon size={18} color="#eb5424" />;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Top Page Title */}
      <h1 className={styles.pageMainTitle}>Page Generator</h1>

      {/* Welcome Banner */}
      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeBannerText}>
          <h2 className={styles.welcomeHeading}>Welcome back, {CURRENT_USER.name.split(' ')[0]}</h2>
          <p className={styles.welcomeSubtext}>
            Create and manage PSEGLI pages, assign contributors and review changes.
          </p>
        </div>
        <button
          type="button"
          className={styles.primaryActionButton}
          onClick={onCreatePageClick}
        >
          <PlusIcon size={14} color="#ffffff" />
          <span>Create Page</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.id} className={styles.statCard}>
            <div className={styles.statNumber}>{stat.count}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Middle Row: Quick Actions & Site Structure */}
      <div className={styles.middleRowGrid}>
        {/* Quick Actions Card */}
        <div className={styles.contentCard}>
          <h3 className={styles.cardHeaderTitle}>Quick actions</h3>
          <div className={styles.quickActionsGrid}>
            {quickActions.map((qa) => (
              <div
                key={qa.id}
                className={styles.quickActionTile}
                onClick={() => onNavigate(qa.targetTab)}
                role="button"
                tabIndex={0}
              >
                <div className={styles.quickActionLeft}>
                  <div className={styles.quickActionIconWrapper}>
                    {getQuickActionIcon(qa.id)}
                  </div>
                  <div>
                    <div className={styles.quickActionTitle}>{qa.title}</div>
                    <div className={styles.quickActionDesc}>{qa.description}</div>
                  </div>
                </div>
                <span className={styles.quickActionCode}>{qa.code}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Site Structure Card */}
        <div className={styles.contentCard}>
          <h3 className={styles.cardHeaderTitle}>Site structure</h3>
          <div className={styles.siteStructureTree}>
            {siteStructure && (
              <div className={styles.treeNodeHome}>
                <div className={styles.treeHomeHeader}>
                  <HomeIcon size={16} color="#eb5424" />
                  <span className={styles.treeHomeTitle}>{siteStructure.title}</span>
                </div>
                {siteStructure.children && (
                  <div className={styles.treeDepartmentGroup}>
                    {siteStructure.children.map((dept) => (
                      <div key={dept.id} className={styles.treeDeptItem}>
                        <div className={styles.treeDeptHeader}>
                          <FolderIcon size={15} color="#475569" />
                          <span>{dept.title}</span>
                        </div>
                        {dept.children && (
                          <div className={styles.treePageGroup}>
                            {dept.children.map((page) => (
                              <div key={page.id} className={styles.treePageItem}>
                                <PageDocIcon size={14} color="#64748b" />
                                <span>{page.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className={styles.activitySection}>
        <h3 className={styles.sectionHeaderTitle}>Recent activity</h3>
        <div className={styles.activityTableWrapper}>
          <table className={styles.activityTable}>
            <thead>
              <tr>
                <th>PAGE</th>
                <th>CHANGE</th>
                <th>BY</th>
                <th>DATE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act) => (
                <tr key={act.id}>
                  <td className={styles.tableColPage}>{act.page}</td>
                  <td className={styles.tableColChange}>{act.change}</td>
                  <td className={styles.tableColBy}>{act.by}</td>
                  <td className={styles.tableColDate}>{act.date}</td>
                  <td className={styles.tableColStatus}>
                    <StatusBadge status={act.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
