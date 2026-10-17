import * as React from 'react';
import styles from '../Generator.module.scss';
import { IFeedbackItem } from '../../models/types';
import { SharePointService } from '../../services/sharepointService';

export const RequestsFeedbackView: React.FC = () => {
  const [feedback, setFeedback] = React.useState<IFeedbackItem[]>([]);
  const [notification, setNotification] = React.useState<string>('');

  React.useEffect(() => {
    SharePointService.getFeedback().then(setFeedback).catch(() => {});
  }, []);

  const handleResolve = (id: string): void => {
    setFeedback(feedback.map((f) => (f.id === id ? { ...f, status: 'Resolved' } : f)));
    setNotification('Feedback marked as resolved!');
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageMainTitle}>Requests &amp; Feedback</h1>

      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeBannerText}>
          <h2 className={styles.welcomeHeading}>User Requests &amp; Feedback</h2>
          <p className={styles.welcomeSubtext}>
            Inquiries, design suggestions, and content improvement notes submitted by staff.
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
                <th>TARGET PAGE</th>
                <th>FEEDBACK &amp; DETAILS</th>
                <th>SUBMITTED BY</th>
                <th>DATE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((item) => (
                <tr key={item.id}>
                  <td className={styles.tableColPage}>
                    <strong>{item.page}</strong>
                  </td>
                  <td className={styles.tableColChange}>{item.feedback}</td>
                  <td className={styles.tableColBy}>{item.submittedBy}</td>
                  <td className={styles.tableColDate}>{item.date}</td>
                  <td className={styles.tableColStatus}>
                    {item.status === 'Open' ? (
                      <button
                        type="button"
                        className={styles.outlineSmallBtn}
                        onClick={() => handleResolve(item.id)}
                      >
                        Mark Resolved
                      </button>
                    ) : (
                      <span className={styles.badgePublished}>Resolved</span>
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
