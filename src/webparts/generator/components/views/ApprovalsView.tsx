import * as React from 'react';
import styles from '../Generator.module.scss';
import { IApprovalItem } from '../../models/types';
import { SharePointService } from '../../services/sharepointService';

interface ApprovalsViewProps {
  onApprovalCountChange?: (count: number) => void;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({ onApprovalCountChange }) => {
  const [approvals, setApprovals] = React.useState<IApprovalItem[]>([]);
  const [notification, setNotification] = React.useState<string>('');

  React.useEffect(() => {
    SharePointService.getApprovals().then(setApprovals).catch(() => {});
  }, []);

  const handleAction = async (id: string, status: 'Approved' | 'Rejected'): Promise<void> => {
    await SharePointService.updateApprovalStatus(id, status);
    const updated = approvals.map((a) => (a.id === id ? { ...a, status } : a));
    setApprovals(updated);
    const pendingCount = updated.filter((a) => a.status === 'Pending').length;
    if (onApprovalCountChange) {
      onApprovalCountChange(pendingCount);
    }
    setNotification(`Change request ${status.toLowerCase()} successfully!`);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageMainTitle}>Changes Awaiting Approval</h1>

      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeBannerText}>
          <h2 className={styles.welcomeHeading}>Review &amp; Approve Changes</h2>
          <p className={styles.welcomeSubtext}>
            Review requested modifications from content editors before they are committed to SharePoint pages.
          </p>
        </div>
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
                <th>PAGE</th>
                <th>CHANGE REQUEST</th>
                <th>REQUESTED BY</th>
                <th>DATE</th>
                <th>STATUS / ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((app) => (
                <tr key={app.id}>
                  <td className={styles.tableColPage}>
                    <strong>{app.page}</strong>
                  </td>
                  <td className={styles.tableColChange}>{app.changeDescription}</td>
                  <td className={styles.tableColBy}>{app.requestedBy}</td>
                  <td className={styles.tableColDate}>{app.date}</td>
                  <td className={styles.tableColStatus}>
                    {app.status === 'Pending' ? (
                      <div className={styles.actionButtonGroup}>
                        <button
                          type="button"
                          className={styles.approveBtn}
                          onClick={() => { handleAction(app.id, 'Approved').catch(() => {}); }}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className={styles.rejectBtn}
                          onClick={() => { handleAction(app.id, 'Rejected').catch(() => {}); }}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span
                        className={
                          app.status === 'Approved'
                            ? styles.badgePublished
                            : styles.badgePending
                        }
                      >
                        {app.status}
                      </span>
                    )}
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
