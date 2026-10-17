import * as React from 'react';
import styles from '../Generator.module.scss';
import {
  ChevronRightIcon,
  DragGripIcon,
  EditIcon,
  EyeIcon,
  PlusIcon,
  UploadIcon
} from '../common/Icons';
import { LivePreviewCard } from '../common/LivePreviewCard';
import { StatusBadge } from '../common/StatusBadge';
import { Stepper } from '../common/Stepper';
import { IComparisonSectionData, IPageDetails, IPageSection } from '../../models/types';
import { SharePointService } from '../../services/sharepointService';

interface HomePageWizardProps {
  onCancel: () => void;
  onPublishedSuccess?: (pageUrl: string) => void;
}

export const HomePageWizard: React.FC<HomePageWizardProps> = ({
  onCancel,
  onPublishedSuccess
}) => {
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [pageDetails, setPageDetails] = React.useState<IPageDetails | null>(null);
  const [sections, setSections] = React.useState<IPageSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = React.useState<string>('sec-4');
  const [statusNotification, setStatusNotification] = React.useState<string>('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = React.useState<boolean>(false);

  // Editable comparison section data
  const [comparisonData, setComparisonData] = React.useState<IComparisonSectionData>({
    columnA: {
      label: 'OUT OF THE BOX LICENSE',
      title: 'Basic',
      description: 'Text drafting, summarization, outlining, formulas, suggestions, and lookup help.'
    },
    columnB: {
      label: 'ENHANCED LICENSE',
      title: 'Add-on / Paid',
      description: 'Document creation, presentation design, data analysis, email and calendar intelligence, and priority access to state-of-the-art models.'
    }
  });

  React.useEffect(() => {
    SharePointService.getHomePageDetails().then(setPageDetails).catch(() => {});
    SharePointService.getHomePageSections().then((secs) => {
      setSections(secs);
      const comparisonSec = secs.filter((s: IPageSection) => s.id === 'sec-4')[0];
      if (comparisonSec && comparisonSec.data) {
        setComparisonData(comparisonSec.data as IComparisonSectionData);
      }
    }).catch(() => {});
  }, []);

  const handleDetailsChange = (field: keyof IPageDetails, value: string): void => {
    if (!pageDetails) return;
    const updated = { ...pageDetails, [field]: value };
    if (field === 'pageTitle') {
      updated.pageSlug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    setPageDetails(updated);
  };

  const handleSaveDraft = async (): Promise<void> => {
    if (pageDetails) {
      await SharePointService.saveHomePageDetails(pageDetails);
      setStatusNotification('Draft saved successfully to SharePoint state!');
      setTimeout(() => setStatusNotification(''), 3000);
    }
  };

  const handleSaveSection = async (): Promise<void> => {
    const updatedSections: IPageSection[] = sections.map((sec) => {
      if (sec.id === selectedSectionId) {
        return {
          ...sec,
          status: 'Done' as const,
          data: comparisonData
        };
      }
      return sec;
    });
    setSections(updatedSections);
    await SharePointService.saveHomePageSections(updatedSections);
    setStatusNotification('Section saved successfully!');
    setTimeout(() => setStatusNotification(''), 3000);
  };

  const handlePublish = async (): Promise<void> => {
    if (!pageDetails) return;
    const result = await SharePointService.publishPage(pageDetails.pageTitle);
    if (result.success) {
      setStatusNotification(`Page published successfully! Live at: ${result.url}`);
      if (onPublishedSuccess) {
        onPublishedSuccess(result.url);
      }
    }
  };

  if (!pageDetails) {
    return <div className={styles.loadingSpinner}>Loading page details...</div>;
  }

  const selectedSection = sections.filter((s: IPageSection) => s.id === selectedSectionId)[0];

  return (
    <div className={styles.wizardContainer}>
      {/* Step Heading */}
      <h1 className={styles.pageMainTitle}>
        {currentStep === 1 ? 'Create Home Page' : 'Add Content — Home Page'}
      </h1>

      {/* Wizard Stepper */}
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
            <h2 className={styles.stepTitleHeading}>Create the Home Page</h2>
            <p className={styles.stepSubtitle}>
              Fill in the page details. The generator writes them to the SharePoint list and provisions the page URL.
            </p>
          </div>

          <div className={styles.wizardSplitLayout}>
            {/* Left Form */}
            <div className={styles.wizardFormColumn}>
              {/* Page Title */}
              <div className={styles.formFieldGroup}>
                <label className={styles.formLabel}>
                  Page title <span className={styles.requiredAsterisk}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={pageDetails.pageTitle}
                  onChange={(e) => handleDetailsChange('pageTitle', e.target.value)}
                  placeholder="e.g. PSEGLI Home"
                />
              </div>

              {/* Page URL */}
              <div className={styles.formFieldGroup}>
                <label className={styles.formLabel}>Page URL</label>
                <div className={styles.urlInputCompound}>
                  <span className={styles.urlPrefix}>{pageDetails.siteUrlPrefix}</span>
                  <input
                    type="text"
                    className={styles.urlSlugInput}
                    value={pageDetails.pageSlug}
                    onChange={(e) => handleDetailsChange('pageSlug', e.target.value)}
                  />
                  <span className={styles.urlSuffix}>.aspx</span>
                </div>
                <div className={styles.fieldHelperText}>
                  Generated automatically from the title
                </div>
              </div>

              {/* Layout Dropdown */}
              <div className={styles.formFieldGroup}>
                <label className={styles.formLabel}>Layout</label>
                <select
                  className={styles.selectInput}
                  value={pageDetails.layout}
                  onChange={(e) => handleDetailsChange('layout', e.target.value)}
                >
                  <option value="Option 14 — Hero, intro, comparison, table">
                    Option 14 — Hero, intro, comparison, table
                  </option>
                  <option value="Option 10 — Standard Intranet Landing">
                    Option 10 — Standard Intranet Landing
                  </option>
                  <option value="Option 12 — Modern Grid & Feeds">
                    Option 12 — Modern Grid & Feeds
                  </option>
                </select>
              </div>

              {/* Hero Banner Upload */}
              <div className={styles.formFieldGroup}>
                <label className={styles.formLabel}>
                  Hero banner image <span className={styles.requiredAsterisk}>*</span>
                </label>
                <div className={styles.imageDropZone}>
                  <UploadIcon size={26} color="#eb5424" />
                  <div className={styles.dropZonePrompt}>
                    Drag an image here or <span className={styles.browseLink}>browse</span>
                  </div>
                  <div className={styles.dropZoneSubtext}>
                    PNG or JPG &bull; 1200 &times; 280 px recommended
                  </div>
                </div>
              </div>

              {/* Hero Heading & Highlight */}
              <div className={styles.formTwoColGrid}>
                <div className={styles.formFieldGroup}>
                  <label className={styles.formLabel}>
                    Hero heading <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={pageDetails.heroHeading}
                    onChange={(e) => handleDetailsChange('heroHeading', e.target.value)}
                  />
                </div>

                <div className={styles.formFieldGroup}>
                  <label className={styles.formLabel}>Highlight text</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={pageDetails.highlightText}
                    onChange={(e) => handleDetailsChange('highlightText', e.target.value)}
                  />
                  <div className={styles.fieldHelperText}>
                    Shown in orange under the heading
                  </div>
                </div>
              </div>

              {/* Page Owner */}
              <div className={styles.formFieldGroup}>
                <label className={styles.formLabel}>Page owner</label>
                <div className={styles.pageOwnerCard}>
                  <div className={styles.ownerAvatar}>
                    {pageDetails.pageOwner.avatarInitials}
                  </div>
                  <span className={styles.ownerName}>
                    {pageDetails.pageOwner.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Live Preview Column */}
            <div className={styles.wizardPreviewColumn}>
              <LivePreviewCard
                pageTitle={pageDetails.pageTitle}
                heroHeading={pageDetails.heroHeading}
                highlightText={pageDetails.highlightText}
                infoMessage="This is the top-level page. Department pages will be created under it."
              />
            </div>
          </div>

          {/* Bottom Action Footer Bar */}
          <div className={styles.wizardBottomBar}>
            <div className={styles.bottomBarLeft}>Step 1 of 3</div>
            <div className={styles.bottomBarRight}>
              <button
                type="button"
                className={styles.ghostButton}
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.outlineButton}
                onClick={() => { handleSaveDraft().catch(() => {}); }}
              >
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

      {/* ===================== STEP 2: ADD CONTENT ===================== */}
      {currentStep === 2 && (
        <div className={styles.wizardStepContent}>
          <div className={styles.wizardStepHeader}>
            <h2 className={styles.stepTitleHeading}>Add Content &mdash; Home Page</h2>
            <p className={styles.stepSubtitle}>
              Build the page from sections. Each section maps to fields in the SharePoint list.
            </p>
          </div>

          {/* Page Selector dropdown */}
          <div className={styles.pageSelectorRow}>
            <label className={styles.formLabelSmall}>Page</label>
            <select className={styles.selectInputInline} value={pageDetails.pageTitle} onChange={() => {}}>
              <option value="PSEGLI Home">PSEGLI Home</option>
            </select>
          </div>

          <div className={styles.addContentTwoColGrid}>
            {/* Left: Reorderable Sections List */}
            <div className={styles.sectionsListColumn}>
              <div className={styles.columnSubtitle}>PAGE SECTIONS &bull; DRAG TO REORDER</div>
              <div className={styles.sectionsStack}>
                {sections.map((section) => {
                  const isSelected = section.id === selectedSectionId;
                  return (
                    <div
                      key={section.id}
                      className={`${styles.sectionItemCard} ${isSelected ? styles.sectionItemActive : ''}`}
                      onClick={() => setSelectedSectionId(section.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={styles.sectionItemLeft}>
                        <DragGripIcon size={14} />
                        <div>
                          <div className={styles.sectionTitle}>{section.title}</div>
                          <div className={styles.sectionSubtitle}>{section.subtitle}</div>
                        </div>
                      </div>

                      <div className={styles.sectionItemRight}>
                        <StatusBadge status={isSelected ? 'Editing' : section.status} />
                        <button
                          type="button"
                          className={styles.sectionEditIconBtn}
                          title="Edit section"
                        >
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
                    const newId = `sec-${Date.now()}`;
                    setSections([
                      ...sections,
                      {
                        id: newId,
                        title: 'New Section',
                        subtitle: 'Custom content block',
                        status: 'Editing',
                        type: 'intro'
                      }
                    ]);
                    setSelectedSectionId(newId);
                  }}
                >
                  <PlusIcon size={14} color="#64748b" />
                  <span>Add section</span>
                </button>
              </div>
            </div>

            {/* Right: Section Editor (Screen 3) */}
            <div className={styles.sectionEditorColumn}>
              <div className={styles.editorPanelCard}>
                <h3 className={styles.editorPanelHeading}>
                  {selectedSection ? selectedSection.title : 'Two-column comparison'}
                </h3>

                {selectedSection && selectedSection.type === 'comparison' ? (
                  <div className={styles.comparisonFormGrid}>
                    {/* Column A */}
                    <div className={styles.columnFormBox}>
                      <div className={styles.columnFormTag}>COLUMN A</div>

                      <div className={styles.formFieldGroup}>
                        <label className={styles.formLabelSmall}>Label</label>
                        <input
                          type="text"
                          className={styles.textInput}
                          value={comparisonData.columnA.label}
                          onChange={(e) =>
                            setComparisonData({
                              ...comparisonData,
                              columnA: { ...comparisonData.columnA, label: e.target.value }
                            })
                          }
                        />
                      </div>

                      <div className={styles.formFieldGroup}>
                        <label className={styles.formLabelSmall}>Title</label>
                        <input
                          type="text"
                          className={styles.textInput}
                          value={comparisonData.columnA.title}
                          onChange={(e) =>
                            setComparisonData({
                              ...comparisonData,
                              columnA: { ...comparisonData.columnA, title: e.target.value }
                            })
                          }
                        />
                      </div>

                      <div className={styles.formFieldGroup}>
                        <label className={styles.formLabelSmall}>Description</label>
                        <textarea
                          rows={4}
                          className={styles.textareaInput}
                          value={comparisonData.columnA.description}
                          onChange={(e) =>
                            setComparisonData({
                              ...comparisonData,
                              columnA: { ...comparisonData.columnA, description: e.target.value }
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Column B */}
                    <div className={styles.columnFormBox}>
                      <div className={styles.columnFormTag}>COLUMN B</div>

                      <div className={styles.formFieldGroup}>
                        <label className={styles.formLabelSmall}>Label</label>
                        <input
                          type="text"
                          className={styles.textInput}
                          value={comparisonData.columnB.label}
                          onChange={(e) =>
                            setComparisonData({
                              ...comparisonData,
                              columnB: { ...comparisonData.columnB, label: e.target.value }
                            })
                          }
                        />
                      </div>

                      <div className={styles.formFieldGroup}>
                        <label className={styles.formLabelSmall}>Title</label>
                        <input
                          type="text"
                          className={styles.textInput}
                          value={comparisonData.columnB.title}
                          onChange={(e) =>
                            setComparisonData({
                              ...comparisonData,
                              columnB: { ...comparisonData.columnB, title: e.target.value }
                            })
                          }
                        />
                      </div>

                      <div className={styles.formFieldGroup}>
                        <label className={styles.formLabelSmall}>Description</label>
                        <textarea
                          rows={4}
                          className={styles.textareaInput}
                          value={comparisonData.columnB.description}
                          onChange={(e) =>
                            setComparisonData({
                              ...comparisonData,
                              columnB: { ...comparisonData.columnB, description: e.target.value }
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.genericSectionEditor}>
                    <p className={styles.genericEditorNotice}>
                      Editing section: <strong>{selectedSection?.title}</strong>
                    </p>
                    <div className={styles.formFieldGroup}>
                      <label className={styles.formLabelSmall}>Section Title</label>
                      <input
                        type="text"
                        className={styles.textInput}
                        value={selectedSection?.title || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSections(sections.map(s => s.id === selectedSectionId ? { ...s, title: val } : s));
                        }}
                      />
                    </div>
                    <div className={styles.formFieldGroup}>
                      <label className={styles.formLabelSmall}>Subtitle / Description</label>
                      <input
                        type="text"
                        className={styles.textInput}
                        value={selectedSection?.subtitle || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSections(sections.map(s => s.id === selectedSectionId ? { ...s, subtitle: val } : s));
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Editor Action Buttons */}
                <div className={styles.editorActionRow}>
                  <button
                    type="button"
                    className={styles.removeSectionBtn}
                    onClick={() => {
                      setSections(sections.filter(s => s.id !== selectedSectionId));
                      if (sections.length > 1) {
                        setSelectedSectionId(sections[0].id);
                      }
                    }}
                  >
                    Remove section
                  </button>
                  <button
                    type="button"
                    className={styles.saveSectionDarkBtn}
                    onClick={() => { handleSaveSection().catch(() => {}); }}
                  >
                    Save section
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
                onClick={() => setIsPreviewModalOpen(true)}
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

      {/* ===================== PREVIEW MODAL ===================== */}
      {isPreviewModalOpen && (
        <div className={styles.previewModalOverlay}>
          <div className={styles.previewModalContent}>
            <div className={styles.previewModalHeader}>
              <h3>Page Live Preview: {pageDetails.pageTitle}</h3>
              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={() => setIsPreviewModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className={styles.previewModalBody}>
              <div className={styles.previewHeroBlock}>
                <h1>{pageDetails.heroHeading}</h1>
                <div className={styles.previewHighlightText}>{pageDetails.highlightText}</div>
              </div>

              <div className={styles.previewComparisonColumns}>
                <div className={styles.previewColumnBox}>
                  <div className={styles.previewColTag}>{comparisonData.columnA.label}</div>
                  <h4>{comparisonData.columnA.title}</h4>
                  <p>{comparisonData.columnA.description}</p>
                </div>
                <div className={styles.previewColumnBox}>
                  <div className={styles.previewColTag}>{comparisonData.columnB.label}</div>
                  <h4>{comparisonData.columnB.title}</h4>
                  <p>{comparisonData.columnB.description}</p>
                </div>
              </div>
            </div>
            <div className={styles.previewModalFooter}>
              <button
                type="button"
                className={styles.ghostButton}
                onClick={() => setIsPreviewModalOpen(false)}
              >
                Close Preview
              </button>
              <button
                type="button"
                className={styles.primaryActionButton}
                onClick={() => {
                  setIsPreviewModalOpen(false);
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
