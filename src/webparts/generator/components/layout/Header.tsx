import * as React from 'react';
import styles from '../Generator.module.scss';
import { ChevronDownIcon, EditIcon, PsegLogo, SearchIcon } from '../common/Icons';
import { NavigationTab, UserRole } from '../../models/types';

interface HeaderProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  userRole?: UserRole;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate, userRole = 'admin' }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const isContributor = userRole === 'contributor';

  const defaultHomeTab: NavigationTab = isContributor ? 'my-sites' : 'dashboard';

  const getBreadcrumbTitle = (): string => {
    switch (currentTab) {
      case 'home-page':
        return 'Home Page';
      case 'department-pages':
        return 'Department Pages';
      case 'sub-department-pages':
        return 'Sub-department Pages';
      case 'contributors':
        return 'Contributors';
      case 'requests':
        return 'Requests & Feedback';
      case 'approvals':
        return 'Approvals';
      case 'my-sites':
        return 'My Sites';
      case 'my-submissions':
        return 'My Submissions';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className={styles.globalHeader}>
      <div className={styles.headerLeft}>
        {/* Brand Logo */}
        <div 
          className={styles.brandLogoContainer} 
          onClick={() => onNavigate(defaultHomeTab)} 
          role="button" 
          tabIndex={0}
        >
          <PsegLogo size={28} />
          <div className={styles.brandTextWrapper}>
            <span className={styles.brandMain}>PSEG</span>
            <span className={styles.brandSub}>LONG ISLAND</span>
          </div>
        </div>

        <div className={styles.brandDivider} />

        {/* Breadcrumbs Navigation */}
        <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
          <span 
            className={styles.breadcrumbLink} 
            onClick={() => onNavigate(defaultHomeTab)}
          >
            PSEGLI Home
          </span>
          <span className={styles.breadcrumbSeparator}>&gt;</span>

          {isContributor && currentTab === 'requests' ? (
            <span className={styles.breadcrumbCurrent}>
              Information Technology
            </span>
          ) : (
            <>
              <span 
                className={styles.breadcrumbLink} 
                onClick={() => onNavigate(defaultHomeTab)}
              >
                Page Generator
              </span>
              {currentTab !== 'dashboard' && (
                <>
                  <span className={styles.breadcrumbSeparator}>&gt;</span>
                  <span className={styles.breadcrumbCurrent}>
                    {getBreadcrumbTitle()}
                  </span>
                </>
              )}
            </>
          )}

          <button 
            className={styles.editLinksButton} 
            type="button" 
            title="Edit navigation links"
          >
            <EditIcon size={12} color="#475569" />
            <span>EDIT LINKS</span>
          </button>
        </nav>
      </div>

      {/* Header Right: Global Site Search */}
      <div className={styles.headerRight}>
        <div className={styles.searchBarWrapper}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search this site"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={styles.searchDropdownBtn} type="button" title="Search scope">
            <ChevronDownIcon size={12} color="#64748b" />
          </button>
          <button className={styles.searchSubmitBtn} type="button" title="Search">
            <SearchIcon size={14} color="#64748b" />
          </button>
        </div>
      </div>
    </header>
  );
};
