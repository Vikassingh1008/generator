import * as React from 'react';
import styles from '../Generator.module.scss';
import { IContributorSite } from '../../models/types';
import { MOCK_CONTRIBUTOR_SITES } from '../../services/mockData';
import { EditIcon, ExternalLinkIcon, InfoIcon, PageDocIcon } from '../common/Icons';

interface ContributorSitesViewProps {
  onEditPage?: (pageTitle: string) => void;
  onRequestNewPage?: () => void;
  onNavigateToRequests?: () => void;
  onGiveFeedback?: (pageTitle: string) => void;
}

export const ContributorSitesView: React.FC<ContributorSitesViewProps> = ({
  onEditPage,
  onRequestNewPage,
  onNavigateToRequests,
  onGiveFeedback
}) => {
  const [sites] = React.useState<IContributorSite[]>(MOCK_CONTRIBUTOR_SITES);
  const [activeNotification, setActiveNotification] = React.useState<string | null>(null);

  const showToast = (msg: string): void => {
    setActiveNotification(msg);
    setTimeout(() => setActiveNotification(null), 3500);
  };

  return (
    <div className={styles.contributorSitesContainer}>
      {activeNotification && (
        <div className={styles.toastNotification}>
          <span>{activeNotification}</span>
          <button type="button" onClick={() => setActiveNotification(null)}>✕</button>
        </div>
      )}

      {/* Top Header Row: Greeting + Request a new page button */}
      <div className={styles.contributorHeaderRow}>
        <div className={styles.contributorGreetingWrapper}>
          <h1 className={styles.contributorGreetingHeading}>
            Hi Anushka, you can contribute to {sites.length} pages
          </h1>
          <p className={styles.contributorGreetingSubtext}>
            Only pages an admin has assigned to you are shown here.
          </p>
        </div>

        <button
          type="button"
          className={styles.requestNewPageBtn}
          onClick={onRequestNewPage || (() => showToast('New page request modal opened'))}
        >
          <PageDocIcon size={14} color="#334155" />
          <span>Request a new page</span>
        </button>
      </div>

      {/* Cards Grid: 2 assigned sites */}
      <div className={styles.contributorCardsGrid}>
        {sites.map((site) => (
          <div key={site.id} className={styles.contributorSiteCard}>
            {/* Card Banner */}
            <div className={`${styles.siteCardBanner} ${site.bannerType === 'image' ? styles.siteCardBannerTech : styles.siteCardBannerWarm}`}>
              {site.bannerType === 'image' ? (
                <div className={styles.copilotBannerContent}>
                  <div className={styles.copilotBannerText}>
                    <div className={styles.copilotCongrats}>Congratulations!</div>
                    <div className={styles.copilotSubline}>
                      You have been selected for <strong>CoPilot Enhanced License</strong>.
                    </div>
                  </div>
                  <div className={styles.copilotMockGraphic}>
                    💻 🚀
                  </div>
                </div>
              ) : (
                <div className={styles.abstractWarmBanner} />
              )}
            </div>

            {/* Card Body */}
            <div className={styles.siteCardBody}>
              <div className={styles.siteCardTopRow}>
                <h3 className={styles.siteCardTitle}>{site.title}</h3>
                {site.statusType === 'pending' ? (
                  <span className={styles.badgePending}>
                    {site.statusText || '1 pending'}
                  </span>
                ) : (
                  <span className={styles.badgeUpToDate}>
                    {site.statusText || 'Up to date'}
                  </span>
                )}
              </div>

              <div className={styles.siteCardDepartment}>{site.department}</div>

              <div className={styles.siteCardMetaRow}>
                <span>Last updated {site.lastUpdated}</span>
                <span className={styles.metaDivider}>·</span>
                <span>Owner: {site.owner}</span>
              </div>

              {/* Action Buttons Row */}
              <div className={styles.siteCardActions}>
                <button
                  type="button"
                  className={styles.btnEditContent}
                  onClick={() => onEditPage ? onEditPage(site.title) : showToast(`Opening editor for ${site.title}`)}
                >
                  <EditIcon size={13} color="#ffffff" />
                  <span>Edit content</span>
                </button>

                <button
                  type="button"
                  className={styles.btnViewPage}
                  onClick={() => showToast(`Navigating to live SharePoint page: ${site.title}`)}
                >
                  <span>View page</span>
                  <ExternalLinkIcon size={11} color="#475569" />
                </button>

                <button
                  type="button"
                  className={styles.btnGiveFeedback}
                  onClick={() => onGiveFeedback ? onGiveFeedback(site.title) : showToast(`Opening feedback dialog for ${site.title}`)}
                >
                  Give feedback
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Information Notice Alert */}
      <div className={styles.contributorInfoBanner}>
        <div className={styles.infoBannerIcon}>
          <InfoIcon size={18} color="#0284c7" />
        </div>
        <div className={styles.infoBannerText}>
          Need to edit another page? Ask an admin to add you, or send a request from{' '}
          <button
            type="button"
            className={styles.infoBannerLink}
            onClick={onNavigateToRequests}
          >
            Requests &amp; Feedback
          </button>.
        </div>
      </div>
    </div>
  );
};
