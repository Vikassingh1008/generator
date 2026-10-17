import * as React from 'react';
import styles from '../Generator.module.scss';
import { ISubmissionItem } from '../../models/types';
import { MOCK_CONTRIBUTOR_SUBMISSIONS } from '../../services/mockData';
import { EditIcon, InfoIcon, RefreshIcon } from '../common/Icons';

interface ContributorSubmissionsViewProps {
  onEditAndResubmit?: (submission: ISubmissionItem) => void;
  onEditOnly?: (submission: ISubmissionItem) => void;
}

export const ContributorSubmissionsView: React.FC<ContributorSubmissionsViewProps> = ({
  onEditAndResubmit,
  onEditOnly
}) => {
  const [submissions] = React.useState<ISubmissionItem[]>(MOCK_CONTRIBUTOR_SUBMISSIONS);
  const [activeFilter, setActiveFilter] = React.useState<'All' | 'Pending' | 'Rejected' | 'Approved'>('All');
  const [selectedSubmissionId, setSelectedSubmissionId] = React.useState<string>(submissions[0]?.id || 'sub-1');
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string): void => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredItems = submissions.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.status === activeFilter;
  });

  const selectedItem = submissions.find((item) => item.id === selectedSubmissionId) || submissions[0];

  const rejectedCount = submissions.filter((s) => s.status === 'Rejected').length;

  return (
    <div className={styles.contributorSubmissionsContainer}>
      {toastMessage && (
        <div className={styles.toastNotification}>
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}

      {/* Main Page Title & Subtitle */}
      <h1 className={styles.pageMainTitle}>My Submissions</h1>
      <p className={styles.pageSubtitle}>Track everything you&apos;ve sent for approval.</p>

      {/* Filter Tabs Bar */}
      <div className={styles.submissionsFilterRow}>
        <button
          type="button"
          className={`${styles.submissionsFilterBtn} ${activeFilter === 'All' ? styles.submissionsFilterBtnActive : ''}`}
          onClick={() => setActiveFilter('All')}
        >
          All
        </button>
        <button
          type="button"
          className={`${styles.submissionsFilterBtn} ${activeFilter === 'Pending' ? styles.submissionsFilterBtnActive : ''}`}
          onClick={() => setActiveFilter('Pending')}
        >
          Pending
        </button>
        <button
          type="button"
          className={`${styles.submissionsFilterBtn} ${activeFilter === 'Rejected' ? styles.submissionsFilterBtnActive : ''}`}
          onClick={() => setActiveFilter('Rejected')}
        >
          Rejected {rejectedCount > 0 && <span className={styles.submissionsBadgeCount}>{rejectedCount}</span>}
        </button>
        <button
          type="button"
          className={`${styles.submissionsFilterBtn} ${activeFilter === 'Approved' ? styles.submissionsFilterBtnActive : ''}`}
          onClick={() => setActiveFilter('Approved')}
        >
          Approved
        </button>
      </div>

      {/* Split Grid: Left Submissions Table | Right Detail Card */}
      <div className={styles.submissionsSplitLayout}>
        {/* Left Side: Table */}
        <div className={styles.submissionsTableWrapper}>
          <table className={styles.customDataTable}>
            <thead>
              <tr>
                <th style={{ width: '40%' }}>ITEM</th>
                <th style={{ width: '30%' }}>PAGE</th>
                <th style={{ width: '15%' }}>SUBMITTED</th>
                <th style={{ width: '15%' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const isSelected = item.id === selectedItem?.id;
                return (
                  <tr
                    key={item.id}
                    className={`${styles.clickableRow} ${isSelected ? styles.rowSelectedActive : ''}`}
                    onClick={() => setSelectedSubmissionId(item.id)}
                  >
                    <td>
                      <span className={styles.itemTitleCell}>{item.item}</span>
                    </td>
                    <td>{item.page}</td>
                    <td>{item.submitted}</td>
                    <td>
                      {item.status === 'Rejected' && (
                        <span className={styles.badgeRejected}>Rejected</span>
                      )}
                      {item.status === 'Pending' && (
                        <span className={styles.badgePending}>Pending</span>
                      )}
                      {item.status === 'Approved' && (
                        <span className={styles.badgeApproved}>Approved</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right Side: Selected Submission Details Card (Screenshot 4) */}
        {selectedItem && (
          <div className={styles.submissionDetailCard}>
            <div className={styles.detailCardHeader}>
              <h2 className={styles.detailCardTitle}>{selectedItem.item}</h2>
              {selectedItem.status === 'Rejected' && (
                <span className={styles.badgeRejected}>Rejected</span>
              )}
              {selectedItem.status === 'Pending' && (
                <span className={styles.badgePending}>Pending</span>
              )}
              {selectedItem.status === 'Approved' && (
                <span className={styles.badgeApproved}>Approved</span>
              )}
            </div>

            {/* Rejection / Reviewer Alert Box */}
            {selectedItem.reason && (
              <div className={styles.rejectionReasonBox}>
                <div className={styles.rejectionHeaderRow}>
                  <InfoIcon size={16} color="#dc2626" />
                  <span className={styles.rejectionAuthor}>
                    Reason from {selectedItem.reason.by} - {selectedItem.reason.date}
                  </span>
                </div>
                <div className={styles.rejectionQuote}>
                  &ldquo;{selectedItem.reason.text}&rdquo;
                </div>
              </div>
            )}

            {/* Your Change Section */}
            <div className={styles.detailSectionWrapper}>
              <div className={styles.detailSectionLabel}>Your change</div>
              <p className={styles.detailSectionText}>{selectedItem.yourChange}</p>
            </div>

            {/* Action Buttons */}
            <div className={styles.detailActionsRow}>
              <button
                type="button"
                className={styles.btnDetailEdit}
                onClick={() => onEditOnly ? onEditOnly(selectedItem) : showToast(`Editing change for ${selectedItem.item}`)}
              >
                <EditIcon size={13} color="#334155" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                className={styles.btnDetailEditResubmit}
                onClick={() => onEditAndResubmit ? onEditAndResubmit(selectedItem) : showToast(`Resubmission opened for ${selectedItem.item}`)}
              >
                <RefreshIcon size={14} color="#ffffff" />
                <span>Edit &amp; resubmit</span>
              </button>
            </div>

            {/* Helper Caption */}
            <div className={styles.detailFooterNote}>
              Resubmitting opens 2.3 with your change and the admin&apos;s reason.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
