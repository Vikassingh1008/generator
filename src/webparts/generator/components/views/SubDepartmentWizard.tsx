import * as React from 'react';
import styles from '../Generator.module.scss';
import { ChevronRightIcon, FolderIcon } from '../common/Icons';
import { SharePointService } from '../../services/sharepointService';
import { IDepartmentItem } from '../../models/types';

interface SubDepartmentWizardProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export const SubDepartmentWizard: React.FC<SubDepartmentWizardProps> = ({
  onCancel,
  onSuccess
}) => {
  const [departments, setDepartments] = React.useState<IDepartmentItem[]>([]);
  const [selectedDept, setSelectedDept] = React.useState<string>('Customer Operations');
  const [subDeptName, setSubDeptName] = React.useState<string>('Billing & Collections');
  const [description, setDescription] = React.useState<string>('Customer account billing, payment arrangements and meter reading.');
  const [notification, setNotification] = React.useState<string>('');

  React.useEffect(() => {
    SharePointService.getDepartments().then(setDepartments).catch(() => {});
  }, []);

  const handleCreate = (): void => {
    setNotification(`Sub-department "${subDeptName}" created under ${selectedDept}!`);
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  return (
    <div className={styles.wizardContainer}>
      <h1 className={styles.pageMainTitle}>Create Sub-department</h1>
      <div className={styles.wizardStepHeader}>
        <h2 className={styles.stepTitleHeading}>Nested under a department (1.5)</h2>
        <p className={styles.stepSubtitle}>
          Sub-departments inherit department navigation and appear dynamically on the parent department page.
        </p>
      </div>

      {notification && (
        <div className={styles.toastSuccess}>
          <span>✓ {notification}</span>
        </div>
      )}

      <div className={styles.wizardSplitLayout}>
        <div className={styles.wizardFormColumn}>
          <div className={styles.formFieldGroup}>
            <label className={styles.formLabel}>
              Parent Department <span className={styles.requiredAsterisk}>*</span>
            </label>
            <select
              className={styles.selectInput}
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formFieldGroup}>
            <label className={styles.formLabel}>
              Sub-department Name <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input
              type="text"
              className={styles.textInput}
              value={subDeptName}
              onChange={(e) => setSubDeptName(e.target.value)}
            />
          </div>

          <div className={styles.formFieldGroup}>
            <label className={styles.formLabel}>Short Description</label>
            <textarea
              rows={3}
              className={styles.textareaInput}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className={styles.formFieldGroup}>
            <label className={styles.formLabel}>Sub-department URL</label>
            <div className={styles.urlInputCompound}>
              <span className={styles.urlPrefix}>/sites/PSEGLI/{selectedDept.toLowerCase().replace(/\s+/g, '-')}/</span>
              <input
                type="text"
                className={styles.urlSlugInput}
                value={subDeptName.toLowerCase().replace(/\s+/g, '-')}
                readOnly
              />
              <span className={styles.urlSuffix}>.aspx</span>
            </div>
          </div>
        </div>

        <div className={styles.wizardPreviewColumn}>
          <div className={styles.contentCardCompact}>
            <h4 className={styles.existingDeptTitle}>Department Hierarchy</h4>
            <div className={styles.existingDeptTree}>
              <div className={styles.treeHomeHeader}>
                <FolderIcon size={16} color="#eb5424" />
                <span>{selectedDept}</span>
              </div>
              <div className={styles.deptTreeChildren}>
                <div className={styles.deptTreeNewHighlight}>
                  + {subDeptName} (new sub-department)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.wizardBottomBar}>
        <div className={styles.bottomBarLeft}>Sub-department Generator</div>
        <div className={styles.bottomBarRight}>
          <button type="button" className={styles.ghostButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className={styles.primaryActionButton} onClick={handleCreate}>
            <span>Create Sub-department</span>
            <ChevronRightIcon size={14} color="#ffffff" />
          </button>
        </div>
      </div>
    </div>
  );
};
