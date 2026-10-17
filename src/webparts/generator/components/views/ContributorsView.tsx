import * as React from 'react';
import styles from '../Generator.module.scss';
import { PlusIcon } from '../common/Icons';
import { IContributorItem } from '../../models/types';
import { SharePointService } from '../../services/sharepointService';

export const ContributorsView: React.FC = () => {
  const [contributors, setContributors] = React.useState<IContributorItem[]>([]);
  const [notification, setNotification] = React.useState<string>('');

  React.useEffect(() => {
    SharePointService.getContributors().then(setContributors).catch(() => {});
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageMainTitle}>Content Contributors</h1>

      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeBannerText}>
          <h2 className={styles.welcomeHeading}>Manage Contributors &amp; Permissions</h2>
          <p className={styles.welcomeSubtext}>
            Assign SharePoint page permissions, designate department owners, and track authoring rights.
          </p>
        </div>
        <button
          type="button"
          className={styles.primaryActionButton}
          onClick={() => {
            setNotification('Add contributor modal initialized');
            setTimeout(() => setNotification(''), 3000);
          }}
        >
          <PlusIcon size={14} color="#ffffff" />
          <span>Add Contributor</span>
        </button>
      </div>

      {notification && (
        <div className={styles.toastSuccess}>
          <span>✓ {notification}</span>
        </div>
      )}

      <div className={styles.activitySection}>
        <div className={styles.activityTableWrapper}>
          <table className={styles.activityTable}>
            <thead>
              <tr>
                <th>CONTRIBUTOR</th>
                <th>ROLE</th>
                <th>ASSIGNED PAGES</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {contributors.map((c) => (
                <tr key={c.id}>
                  <td className={styles.tableColPage}>
                    <div className={styles.contributorNameCell}>
                      <div className={styles.ownerAvatar}>{c.avatarInitials}</div>
                      <div>
                        <strong>{c.name}</strong>
                        <div className={styles.fieldHelperText}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.tableColChange}>
                    <span className={styles.roleBadge}>{c.role}</span>
                  </td>
                  <td className={styles.tableColBy}>
                    {c.assignedPages.map((p, i) => (
                      <span key={i} className={styles.pageTag}>
                        {p}
                      </span>
                    ))}
                  </td>
                  <td className={styles.tableColStatus}>
                    <button type="button" className={styles.outlineSmallBtn}>
                      Edit Permissions
                    </button>
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
