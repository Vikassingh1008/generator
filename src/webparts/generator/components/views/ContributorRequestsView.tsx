import * as React from 'react';
import styles from '../Generator.module.scss';
import { ChatBubbleIcon, CheckIcon } from '../common/Icons';

export const ContributorRequestsView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState<'add-content' | 'give-feedback'>('add-content');
  const [targetPage, setTargetPage] = React.useState('Information Technology');
  const [description, setDescription] = React.useState('');
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string): void => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenModal = (type: 'add-content' | 'give-feedback'): void => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setIsModalOpen(false);
    showToast(modalType === 'add-content' 
      ? 'Content addition request sent to administrator for review!' 
      : 'Feedback submitted successfully! Thank you.');
    setDescription('');
  };

  return (
    <div className={styles.contributorRequestsContainer}>
      {toastMessage && (
        <div className={styles.toastNotification}>
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}

      <h1 className={styles.pageMainTitle}>Requests &amp; Feedback</h1>

      {/* Navy Feedback Action Banner (Screenshot 3) */}
      <div className={styles.contributorFeedbackBanner}>
        <div className={styles.feedbackBannerLeft}>
          <div className={styles.feedbackBannerIconCircle}>
            <ChatBubbleIcon size={22} color="#ffffff" />
          </div>
          <div className={styles.feedbackBannerTextCol}>
            <h2 className={styles.feedbackBannerTitle}>Give Us Feedback</h2>
            <p className={styles.feedbackBannerDesc}>
              Spotted something out of date? Suggest a change or add content.
            </p>
          </div>
        </div>

        <div className={styles.feedbackBannerActions}>
          <button
            type="button"
            className={styles.feedbackAddContentBtn}
            onClick={() => handleOpenModal('add-content')}
          >
            <span>Add Content</span>
          </button>

          <button
            type="button"
            className={styles.feedbackGiveBtn}
            onClick={() => handleOpenModal('give-feedback')}
          >
            <span>Give Feedback</span>
          </button>
        </div>
      </div>

      {/* Dialog Modal for Add Content & Give Feedback */}
      {isModalOpen && (
        <div className={styles.previewModalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.contributorModalDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.previewModalHeader}>
              <h3 className={styles.modalTitle}>
                {modalType === 'add-content' ? 'Request to Add Content' : 'Submit Feedback to Page Owner'}
              </h3>
              <button 
                type="button" 
                className={styles.closeModalBtn} 
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.contributorModalBody}>
              <div className={styles.formFieldGroup}>
                <label className={styles.fieldLabel}>Target Page</label>
                <select
                  className={styles.fieldSelect}
                  value={targetPage}
                  onChange={(e) => setTargetPage(e.target.value)}
                >
                  <option value="Billing">Billing (Customer Operations)</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="CoPilot Enhanced">CoPilot Enhanced</option>
                  <option value="Human Resources">Human Resources</option>
                </select>
              </div>

              <div className={styles.formFieldGroup}>
                <label className={styles.fieldLabel}>
                  {modalType === 'add-content' ? 'Proposed Content / Changes' : 'Feedback Notes'}
                </label>
                <textarea
                  className={styles.fieldTextarea}
                  rows={4}
                  placeholder={modalType === 'add-content' 
                    ? 'Describe the new section, text update, or document to add...' 
                    : 'What looks out of date or needs improvement?'}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className={styles.modalFooterActions}>
                <button
                  type="button"
                  className={styles.wizardCancelBtn}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.wizardNextBtn}
                >
                  <CheckIcon size={14} color="#ffffff" />
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
