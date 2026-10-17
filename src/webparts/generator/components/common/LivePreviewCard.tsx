import * as React from 'react';
import styles from '../Generator.module.scss';
import { InfoIcon, PsegLogo } from './Icons';

interface LivePreviewCardProps {
  pageTitle: string;
  heroHeading: string;
  highlightText?: string;
  infoMessage?: string;
  isDepartment?: boolean;
}

export const LivePreviewCard: React.FC<LivePreviewCardProps> = ({
  pageTitle,
  heroHeading,
  highlightText,
  infoMessage = 'This is the top-level page. Department pages will be created under it.',
  isDepartment = false
}) => {
  return (
    <div className={styles.livePreviewWrapper}>
      <div className={styles.livePreviewHeader}>
        <span>LIVE PREVIEW</span>
      </div>

      <div className={styles.miniBrowserFrame}>
        <div className={styles.miniBrowserTopAccent} />
        
        <div className={styles.miniBrowserBar}>
          <PsegLogo size={14} />
          <span className={styles.miniBreadcrumbs}>
            PSEGLI Home &gt; {pageTitle || 'Home'}
          </span>
        </div>

        {/* Hero banner mock */}
        <div className={styles.miniHeroBanner}>
          <div className={styles.miniHeroText}>
            <div className={styles.miniHeroHeading}>{heroHeading || 'Welcome to PSEG Long Island'}</div>
            {highlightText && <div className={styles.miniHeroHighlight}>{highlightText}</div>}
            <div className={styles.miniHeroSubtext}>
              {isDepartment ? 'Departmental portals, workflows & articles.' : 'Powering our community with safe, reliable energy.'}
            </div>
          </div>
          <div className={styles.miniHeroGraphic}>
            <div className={styles.miniGraphicBox}>
              <div className={styles.miniGraphicBadge}>AI Ready</div>
              <div className={styles.miniGraphicIcon}>⚡</div>
            </div>
          </div>
        </div>

        {/* Content sections mock */}
        <div className={styles.miniContentGrid}>
          <div className={styles.miniContentCard}>
            <div className={styles.miniCardLineShort} />
            <div className={styles.miniCardLineLong} />
          </div>
          <div className={styles.miniContentCard}>
            <div className={styles.miniCardLineShort} />
            <div className={styles.miniCardLineLong} />
          </div>
        </div>

        <div className={styles.miniFooterDivider} />
      </div>

      {infoMessage && (
        <div className={styles.previewInfoNotice}>
          <InfoIcon size={16} />
          <span>{infoMessage}</span>
        </div>
      )}
    </div>
  );
};
