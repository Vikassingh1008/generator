import * as React from 'react';
import styles from '../Generator.module.scss';
import {
  ChevronRightIcon,
  DragGripIcon,
  EditIcon,
  EyeIcon,
  FolderIcon,
  HomeIcon,
  InfoIcon,
  PlusIcon
} from '../common/Icons';
import { LivePreviewCard } from '../common/LivePreviewCard';
import { StatusBadge } from '../common/StatusBadge';
import { Stepper } from '../common/Stepper';
import {
  IArticleSectionData,
  IDepartmentItem,
  IPageSection
} from '../../models/types';
import { SharePointService } from '../../services/sharepointService';

interface DepartmentPageWizardProps {
  onCancel: () => void;
  onPublishedSuccess?: (pageUrl: string) => void;
}

export const DepartmentPageWizard: React.FC<DepartmentPageWizardProps> = ({
  onCancel,
  onPublishedSuccess
}) => {
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [departments, setDepartments] = React.useState<IDepartmentItem[]>([]);
  const [departmentName, setDepartmentName] = React.useState<string>('Customer Operations');
  const [parentPage] = React.useState<string>('PSEGLI Home');
  const [pageSlug, setPageSlug] = React.useState<string>('customer-operations');
  const [shortDescription, setShortDescription] = React.useState<string>(
    'Team updates, processes and contacts for Customer Operations.'
  );
  const [layout, setLayout] = React.useState<string>('Option 14 — Department');
  const [departmentOwner] = React.useState<{ name: string; avatarInitials: string }>({
    name: 'Samuel Hardeman',
    avatarInitials: 'SH'
  });

  const [sections, setSections] = React.useState<IPageSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = React.useState<string>('dsec-4');
  const [statusNotification, setStatusNotification] = React.useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = React.useState<boolean>(false);

  // Article state for Screen 5
  const [articleData, setArticleData] = React.useState<IArticleSectionData>({
    title: 'Storm season readiness checklist',
    body: 'What every team needs to have in place before hurricane season begins: contact trees, outage scripts and escalation paths.',
    imageUrl: ''
  });

  React.useEffect(() => {
    SharePointService.getDepartments().then(setDepartments).catch(() => {});
    SharePointService.getDepartmentSections().then((secs) => {
      setSections(secs);
      const articleSec = secs.filter((s: IPageSection) => s.id === 'dsec-4')[0];
      if (articleSec && articleSec.data) {
        setArticleData(articleSec.data as IArticleSectionData);
      }
    }).catch(() => {});
  }, []);

  const handleNameChange = (val: string): void => {
    setDepartmentName(val);
    setPageSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  const handleSaveDraft = (): void => {
    setStatusNotification('Department draft saved successfully!');
    setTimeout(() => setStatusNotification(''), 3000);
  };

  const handleSaveArticle = async (): Promise<void> => {
    const updated: IPageSection[] = sections.map((sec) => {
      if (sec.id === selectedSectionId) {
        return {
          ...sec,
          status: 'Done' as const,
          data: articleData
        };
      }
      return sec;
    });
    setSections(updated);
    await SharePointService.saveDepartmentSections(updated);
    setStatusNotification('Article section saved successfully!');
    setTimeout(() => setStatusNotification(''), 3000);
  };

  const handlePublish = async (): Promise<void> => {
    const newDept: IDepartmentItem = {
      id: `dept-${Date.now()}`,
      name: departmentName,
      parentPage: parentPage,
      slug: pageSlug,
      description: shortDescription,
      layout: layout,
      owner: departmentOwner,
      subDepartments: []
    };

    await SharePointService.addDepartment(newDept);
    setStatusNotification(`Department "${departmentName}" published to SharePoint!`);
    if (onPublishedSuccess) {
      onPublishedSuccess(`/sites/PSEGLI/${pageSlug}.aspx`);
    }
  };

  return (
    <div className={styles.wizardContainer}>
      <h1 className={styles.pageMainTitle}>
        {currentStep === 1 ? 'Create Department Page' : 'Add Content — Department Page'}
      </h1>

      {/* Stepper */}
      <div className={styles.wizardStepperRow}>
        <Stepper currentStep={currentStep} onStepClick={setCurrentStep} />
      </div>

      {statusNotification && (
        <div className={styles.toastSuccess}>
          <span>✓ {statusNotification}</span>
        </div>
      )}

      {/* ===================== STEP 1: PAGE DETAILS ===================== */}
      {currentStep === 1 && (
        <div className={styles.wizardStepContent}>
          <div className={styles.wizardStepHeader}>
            <h2 className={styles.stepTitleHeading}>Create a Department Page</h2>
            <p className={styles.stepSubtitle}>
              Department pages sit under the Home Page. Each new department is added to the Department URL list.
            </p>
          </div>

          <div className={styles.wizardSplitLayout}>
            {/* Left Form */}
            <div className={styles.wizardFormColumn}>
              <div className={styles.formTwoColGrid}>
                {/* Department Name */}
                <div className={styles.formFieldGroup}>
                  <label className={styles.formLabel}>
                    Department name <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={departmentName}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                </div>

                {/* Parent Page */}
                <div className={styles.formFieldGroup}>
                  <label className={styles.formLabel}>Parent page</label>
                  <input
                    type="text"
                    className={`${styles.textInput} ${styles.inputDisabled}`}
                    value={parentPage}
                    disabled
                  />
                </div>
              </div>

              {/* Page URL */}
              <div className={styles.formFieldGroup}>
                <label className={styles.formLabel}>Page URL</label>
                <div className={styles.urlInputCompound}>
                  <span className={styles.urlPrefix}>/sites/PSEGLI/</span>
                  <input
                    type="text"
                    className={styles.urlSlugInput}
                    value={pageSlug}
                    onChange={(e) => setPageSlug(e.target.value)}
                  />
                  <span className={styles.urlSuffix}>.aspx</span>
                </div>
                <div className={styles.fieldHelperText}>
                  Added to the Department URL list on publish
                </div>
              </div>

              {/* Short Description */}
              <div className={styles.formFieldGroup}>
                <label className={styles.formLabel}>
                  Short description <span className={styles.requiredAsterisk}>*</span>
                </label>
                <textarea
                  rows={3}
                  className={styles.textareaInput}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
                <div className={styles.fieldHelperText}>
                  Shown on the department card on the Home Page
                </div>
              </div>

              {/* Layout & Department Owner */}
              <div className={styles.formTwoColGrid}>
                <div className={styles.formFieldGroup}>
                  <label className={styles.formLabel}>Layout</label>
                  <select
                    className={styles.selectInput}
                    value={layout}
                    onChange={(e) => setLayout(e.target.value)}
                  >
                    <option value="Option 14 — Department">Option 14 — Department</option>
                    <option value="Option 11 — Team Directory">Option 11 — Team Directory</option>
                    <option value="Option 16 — Knowledge Base">Option 16 — Knowledge Base</option>
                  </select>
                </div>

                <div className={styles.formFieldGroup}>
                  <label className={styles.formLabel}>
                    Department owner <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <div className={styles.pageOwnerCard}>
                    <div className={`${styles.ownerAvatar} ${styles.ownerAvatarGreen}`}>
                      {departmentOwner.avatarInitials}
                    </div>
                    <span className={styles.ownerName}>{departmentOwner.name}</span>
                  </div>
                </div>
              </div>

              {/* Hero Banner Image Box */}
              <div className={styles.formFieldGroup}>
                <label className={styles.formLabel}>Hero banner image</label>
                <div className={styles.bannerPlaceholderBox}>
                  <div className={styles.bannerGradientPreview} />
                  <button type="button" className={styles.replaceBannerBtn}>
                    Replace
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Existing Departments Tree & Preview */}
            <div className={styles.wizardPreviewColumn}>
              {/* Existing departments card */}
              <div className={styles.contentCardCompact}>
                <h4 className={styles.existingDeptTitle}>Existing departments</h4>
                <div className={styles.existingDeptTree}>
                  <div className={styles.treeHomeHeader}>
                    <HomeIcon size={14} color="#eb5424" />
                    <span>PSEGLI Home</span>
                  </div>
                  <div className={styles.deptTreeChildren}>
                    {departments
                      .filter((d) => d.name !== 'Customer Operations')
                      .map((d) => (
                        <div key={d.id} className={styles.deptTreeChildItem}>
                          <FolderIcon size={14} color="#64748b" />
                          <span>{d.name}</span>
                        </div>
                      ))}
                    <div className={styles.deptTreeNewHighlight}>
                      + {departmentName || 'Customer Operations'} (new)
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div style={{ marginTop: '16px' }}>
                <LivePreviewCard
                  pageTitle={departmentName}
                  heroHeading={`${departmentName} Portal`}
                  highlightText="Excellence in Service"
                  infoMessage="Team updates, processes and contacts for Customer Operations."
                  isDepartment={true}
                />
              </div>
            </div>
          </div>

          {/* Bottom Action Footer Bar */}
          <div className={styles.wizardBottomBar}>
            <div className={styles.bottomBarLeft}>Step 1 of 3</div>
            <div className={styles.bottomBarRight}>
              <button type="button" className={styles.ghostButton} onClick={onCancel}>
                Cancel
              </button>
              <button type="button" className={styles.outlineButton} onClick={handleSaveDraft}>
                Save draft
              </button>
              <button
                type="button"
                className={styles.primaryActionButton}
                onClick={() => setCurrentStep(2)}
              >
                <span>Next: Add content</span>
                <ChevronRightIcon size={14} color="#ffffff" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== STEP 2: ADD CONTENT (SCREEN 5) ===================== */}
      {currentStep === 2 && (
        <div className={styles.wizardStepContent}>
          <div className={styles.wizardStepHeader}>
            <h2 className={styles.stepTitleHeading}>Add Content &mdash; Department Page</h2>
            <p className={styles.stepSubtitle}>
              Choose a department, then add or edit its sections.
            </p>
          </div>

          {/* Page selector */}
          <div className={styles.pageSelectorRow}>
            <label className={styles.formLabelSmall}>Page</label>
            <select
              className={styles.selectInputInline}
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
            >
              <option value="Customer Operations">Customer Operations</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Human Resources">Human Resources</option>
            </select>
          </div>

          <div className={styles.addContentTwoColGrid}>
            {/* Left: Reorderable Sections */}
            <div className={styles.sectionsListColumn}>
              <div className={styles.columnSubtitle}>PAGE SECTIONS &bull; DRAG TO REORDER</div>
              <div className={styles.sectionsStack}>
                {sections.map((sec) => {
                  const isSelected = sec.id === selectedSectionId;
                  return (
                    <div
                      key={sec.id}
                      className={`${styles.sectionItemCard} ${isSelected ? styles.sectionItemActive : ''}`}
                      onClick={() => setSelectedSectionId(sec.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={styles.sectionItemLeft}>
                        <DragGripIcon size={14} />
                        <div>
                          <div className={styles.sectionTitle}>{sec.title}</div>
                          <div className={styles.sectionSubtitle}>{sec.subtitle}</div>
                        </div>
                      </div>

                      <div className={styles.sectionItemRight}>
                        <StatusBadge status={isSelected ? 'Editing' : sec.status} />
                        <button type="button" className={styles.sectionEditIconBtn}>
                          <EditIcon size={13} color="#475569" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  className={styles.addSectionDashedButton}
                  onClick={() => {
                    const newId = `dsec-${Date.now()}`;
                    setSections([
                      ...sections,
                      {
                        id: newId,
                        title: 'New Section',
                        subtitle: 'Custom block',
                        status: 'Editing',
                        type: 'articles'
                      }
                    ]);
                    setSelectedSectionId(newId);
                  }}
                >
                  <PlusIcon size={14} color="#64748b" />
                  <span>Add section</span>
                </button>

                {/* Sub-department notice */}
                <div className={styles.previewInfoNotice}>
                  <InfoIcon size={16} />
                  <span>
                    Sub-department cards update on their own when a sub-department is created (1.5).
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Article Section Editor */}
            <div className={styles.sectionEditorColumn}>
              <div className={styles.editorPanelCard}>
                <h3 className={styles.editorPanelHeading}>Article</h3>

                <div className={styles.formFieldGroup}>
                  <label className={styles.formLabelSmall}>
                    Title <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={articleData.title}
                    onChange={(e) => setArticleData({ ...articleData, title: e.target.value })}
                  />
                </div>

                {/* Rich Text Editor Toolbar */}
                <div className={styles.formFieldGroup}>
                  <label className={styles.formLabelSmall}>
                    Body <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <div className={styles.richTextEditorContainer}>
                    <div className={styles.richTextToolbar}>
                      <button type="button" className={styles.richBtn} title="Bold">
                        <strong>B</strong>
                      </button>
                      <button type="button" className={styles.richBtn} title="Italic">
                        <em>I</em>
                      </button>
                      <button type="button" className={styles.richBtn} title="Underline">
                        <u>U</u>
                      </button>
                      <span className={styles.richDivider} />
                      <button type="button" className={styles.richBtn} title="List">
                        &bull; List
                      </button>
                      <button type="button" className={styles.richBtn} title="Link">
                        Link
                      </button>
                    </div>

                    <textarea
                      rows={5}
                      className={styles.richTextarea}
                      value={articleData.body}
                      onChange={(e) => setArticleData({ ...articleData, body: e.target.value })}
                    />
                  </div>
                </div>

                {/* Image Placeholder */}
                <div className={styles.formFieldGroup}>
                  <label className={styles.formLabelSmall}>Image</label>
                  <div className={styles.bannerPlaceholderBox}>
                    <div className={styles.bannerGradientPreview} />
                    <button type="button" className={styles.replaceBannerBtn}>
                      Replace
                    </button>
                  </div>
                </div>

                {/* Editor Action Buttons */}
                <div className={styles.editorActionRow}>
                  <button
                    type="button"
                    className={styles.removeSectionBtn}
                    onClick={() => {
                      setSections(sections.filter((s) => s.id !== selectedSectionId));
                      if (sections.length > 1) {
                        setSelectedSectionId(sections[0].id);
                      }
                    }}
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    className={styles.saveSectionDarkBtn}
                    onClick={() => { handleSaveArticle().catch(() => {}); }}
                  >
                    Save article
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer Bar */}
          <div className={styles.wizardBottomBar}>
            <div className={styles.bottomBarLeft}>Step 2 of 3 &bull; Draft saved 2 min ago</div>
            <div className={styles.bottomBarRight}>
              <button
                type="button"
                className={styles.ghostButton}
                onClick={() => setCurrentStep(1)}
              >
                &larr; Back
              </button>
              <button
                type="button"
                className={styles.outlineButton}
                onClick={() => setIsPreviewOpen(true)}
              >
                <EyeIcon size={14} color="#374151" />
                <span>Preview</span>
              </button>
              <button
                type="button"
                className={styles.primaryActionButton}
                onClick={() => { handlePublish().catch(() => {}); }}
              >
                <span>Publish</span>
                <ChevronRightIcon size={14} color="#ffffff" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className={styles.previewModalOverlay}>
          <div className={styles.previewModalContent}>
            <div className={styles.previewModalHeader}>
              <h3>Department Live Preview: {departmentName}</h3>
              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={() => setIsPreviewOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className={styles.previewModalBody}>
              <div className={styles.previewHeroBlock}>
                <h1>{departmentName} Department</h1>
                <p>{shortDescription}</p>
              </div>

              <div className={styles.previewArticleCard}>
                <h3>{articleData.title}</h3>
                <p>{articleData.body}</p>
              </div>
            </div>
            <div className={styles.previewModalFooter}>
              <button
                type="button"
                className={styles.ghostButton}
                onClick={() => setIsPreviewOpen(false)}
              >
                Close Preview
              </button>
              <button
                type="button"
                className={styles.primaryActionButton}
                onClick={() => {
                  setIsPreviewOpen(false);
                  handlePublish().catch(() => {});
                }}
              >
                Publish Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
