export type UserRole = 'admin' | 'contributor';

export type NavigationTab = 
  | 'dashboard' 
  | 'home-page' 
  | 'department-pages' 
  | 'sub-department-pages' 
  | 'contributors' 
  | 'requests' 
  | 'approvals'
  | 'my-sites'
  | 'my-submissions';

export type ActivityStatus = 'Pending' | 'Published' | 'Request';

export interface IActivityItem {
  id: string;
  page: string;
  change: string;
  by: string;
  date: string;
  status: ActivityStatus;
}

export interface IStatItem {
  id: string;
  count: number;
  label: string;
  accentColor?: string;
}

export interface IQuickAction {
  id: string;
  title: string;
  description: string;
  code: string;
  targetTab: NavigationTab;
}

export interface ISiteStructureNode {
  id: string;
  title: string;
  type: 'home' | 'department' | 'sub-department' | 'page';
  url?: string;
  children?: ISiteStructureNode[];
}

export type SectionStatus = 'Done' | 'Editing' | 'Dynamic';

export interface IComparisonColumn {
  label: string;
  title: string;
  description: string;
}

export interface IComparisonSectionData {
  [key: string]: unknown;
  columnA: IComparisonColumn;
  columnB: IComparisonColumn;
}

export interface IArticleSectionData {
  [key: string]: unknown;
  title: string;
  body: string;
  imageUrl?: string;
}

export type SectionData = IComparisonSectionData | IArticleSectionData | Record<string, unknown>;

export interface IPageSection {
  id: string;
  title: string;
  subtitle: string;
  status: SectionStatus;
  type: 'hero' | 'intro' | 'callout' | 'comparison' | 'table' | 'sub-departments' | 'articles';
  data?: SectionData;
}

export interface IPageDetails {
  pageTitle: string;
  siteUrlPrefix: string;
  pageSlug: string;
  layout: string;
  heroHeading: string;
  highlightText: string;
  pageOwner: {
    name: string;
    avatarInitials: string;
    role?: string;
  };
  shortDescription?: string;
  parentPage?: string;
  heroImageUrl?: string;
}

export interface IDepartmentItem {
  id: string;
  name: string;
  parentPage: string;
  slug: string;
  description: string;
  layout: string;
  owner: {
    name: string;
    avatarInitials: string;
  };
  heroImageUrl?: string;
  subDepartments?: string[];
}

export interface IContributorItem {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  role: string;
  assignedPages: string[];
}

export interface IApprovalItem {
  id: string;
  page: string;
  changeDescription: string;
  requestedBy: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface IFeedbackItem {
  id: string;
  page: string;
  submittedBy: string;
  date: string;
  feedback: string;
  status: 'Open' | 'Resolved';
}

export interface IContributorSite {
  id: string;
  title: string;
  department: string;
  pendingCount?: number;
  statusText?: string;
  statusType: 'pending' | 'uptodate';
  lastUpdated: string;
  owner: string;
  bannerType?: 'gradient' | 'image';
  bannerImageUrl?: string;
}

export interface ISubmissionItem {
  id: string;
  item: string;
  page: string;
  submitted: string;
  status: 'Pending' | 'Rejected' | 'Approved';
  reason?: {
    by: string;
    date: string;
    text: string;
  };
  yourChange: string;
}
