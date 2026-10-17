import {
  IActivityItem,
  IApprovalItem,
  IContributorItem,
  IDepartmentItem,
  IFeedbackItem,
  IPageDetails,
  IPageSection,
  ISiteStructureNode,
  IStatItem
} from '../models/types';
import {
  CURRENT_USER,
  INITIAL_DEPARTMENT_SECTIONS,
  INITIAL_DEPARTMENTS,
  INITIAL_HOME_PAGE_DETAILS,
  INITIAL_HOME_PAGE_SECTIONS,
  MOCK_APPROVALS,
  MOCK_CONTRIBUTORS,
  MOCK_FEEDBACK,
  MOCK_RECENT_ACTIVITIES,
  MOCK_SITE_STRUCTURE,
  MOCK_STATS
} from './mockData';

/**
 * SharePointService provides a clean abstraction layer between the React UI
 * and data sources. Currently runs on static in-memory data, and is 100% prepared
 * to switch to live SharePoint Lists via SPHttpClient / PnPjs.
 */
export class SharePointService {
  private static _homePageDetails: IPageDetails = { ...INITIAL_HOME_PAGE_DETAILS };
  private static _homePageSections: IPageSection[] = [...INITIAL_HOME_PAGE_SECTIONS];
  private static _departments: IDepartmentItem[] = [...INITIAL_DEPARTMENTS];
  private static _departmentSections: IPageSection[] = [...INITIAL_DEPARTMENT_SECTIONS];
  private static _activities: IActivityItem[] = [...MOCK_RECENT_ACTIVITIES];
  private static _approvals: IApprovalItem[] = [...MOCK_APPROVALS];
  private static _feedback: IFeedbackItem[] = [...MOCK_FEEDBACK];
  private static _contributors: IContributorItem[] = [...MOCK_CONTRIBUTORS];
  private static _stats: IStatItem[] = [...MOCK_STATS];

  // ===================== DASHBOARD =====================

  public static async getDashboardStats(): Promise<IStatItem[]> {
    return Promise.resolve(this._stats);
  }

  public static async getRecentActivities(): Promise<IActivityItem[]> {
    return Promise.resolve(this._activities);
  }

  public static async getSiteStructure(): Promise<ISiteStructureNode> {
    return Promise.resolve(MOCK_SITE_STRUCTURE);
  }

  // ===================== HOME PAGE =====================

  public static async getHomePageDetails(): Promise<IPageDetails> {
    return Promise.resolve({ ...this._homePageDetails });
  }

  public static async saveHomePageDetails(details: IPageDetails): Promise<boolean> {
    this._homePageDetails = { ...details };
    // Future SharePoint REST call:
    // await this.spHttpClient.post(`${siteUrl}/_api/web/lists/getbytitle('PSEGLI_Pages')/items`, ...)
    return Promise.resolve(true);
  }

  public static async getHomePageSections(): Promise<IPageSection[]> {
    return Promise.resolve([...this._homePageSections]);
  }

  public static async saveHomePageSections(sections: IPageSection[]): Promise<boolean> {
    this._homePageSections = [...sections];
    return Promise.resolve(true);
  }

  // ===================== DEPARTMENT PAGES =====================

  public static async getDepartments(): Promise<IDepartmentItem[]> {
    return Promise.resolve([...this._departments]);
  }

  public static async addDepartment(dept: IDepartmentItem): Promise<boolean> {
    this._departments.push(dept);
    // Add to recent activity
    this._activities.unshift({
      id: `act-${Date.now()}`,
      page: dept.name,
      change: `Created new department page`,
      by: CURRENT_USER.name,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending'
    });
    return Promise.resolve(true);
  }

  public static async getDepartmentSections(): Promise<IPageSection[]> {
    return Promise.resolve([...this._departmentSections]);
  }

  public static async saveDepartmentSections(sections: IPageSection[]): Promise<boolean> {
    this._departmentSections = [...sections];
    return Promise.resolve(true);
  }

  // ===================== CONTRIBUTORS =====================

  public static async getContributors(): Promise<IContributorItem[]> {
    return Promise.resolve([...this._contributors]);
  }

  // ===================== APPROVALS & FEEDBACK =====================

  public static async getApprovals(): Promise<IApprovalItem[]> {
    return Promise.resolve([...this._approvals]);
  }

  public static async updateApprovalStatus(id: string, status: 'Approved' | 'Rejected'): Promise<boolean> {
    this._approvals = this._approvals.map(item => item.id === id ? { ...item, status } : item);
    return Promise.resolve(true);
  }

  public static async getFeedback(): Promise<IFeedbackItem[]> {
    return Promise.resolve([...this._feedback]);
  }

  // ===================== PUBLISH =====================

  public static async publishPage(pageTitle: string): Promise<{ success: boolean; url: string }> {
    // When connected to SharePoint, this will create or update the SitePage in "Site Pages" library:
    // using @pnp/sp/clientside-pages: const page = await CreateClientsidePage(web, pageTitle, ...);
    return Promise.resolve({
      success: true,
      url: `/sites/PSEGLI/${pageTitle.toLowerCase().replace(/\s+/g, '-')}.aspx`
    });
  }
}
