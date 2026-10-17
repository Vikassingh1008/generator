import * as React from 'react';
import styles from '../Generator.module.scss';

interface StatusBadgeProps {
  status: 'Pending' | 'Published' | 'Request' | 'Done' | 'Editing' | 'Dynamic';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeClass = (): string => {
    switch (status) {
      case 'Pending':
        return styles.badgePending;
      case 'Published':
        return styles.badgePublished;
      case 'Request':
        return styles.badgeRequest;
      case 'Editing':
        return styles.badgeEditing;
      case 'Dynamic':
        return styles.badgeDynamic;
      case 'Done':
      default:
        return styles.badgeDone;
    }
  };

  return (
    <span className={`${styles.statusBadge} ${getBadgeClass()}`}>
      {status}
    </span>
  );
};
