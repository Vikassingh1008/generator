import {
  IActivityItem,
  IApprovalItem,
  IContributorItem,
  IContributorSite,
  IDepartmentItem,
  IFeedbackItem,
  IPageDetails,
  IPageSection,
  IQuickAction,
  ISiteStructureNode,
  IStatItem,
  ISubmissionItem
} from '../models/types';

export const CURRENT_USER = {
  name: 'Sai Naik',
  avatarInitials: 'SN',
  role: 'Super Admin',
  email: 'sai.naik@psegli.com'
};

export const CONTRIBUTOR_USER = {
  name: 'Anushka R.',
  avatarInitials: 'AR',
  role: 'Content Contributor',
  email: 'anushka.r@psegli.com'
};

export const MOCK_STATS: IStatItem[] = [
  { id: '1', count: 24, label: 'Published pages', accentColor: '#eb5424' },
  { id: '2', count: 5, label: 'Changes awaiting approval', accentColor: '#eb5424' },
  { id: '3', count: 3, label: 'Open requests & feedback', accentColor: '#eb5424' },
  { id: '4', count: 18, label: 'Content contributors', accentColor: '#eb5424' }
];

export const MOCK_QUICK_ACTIONS: IQuickAction[] = [
  {
    id: '1',
    title: 'Create Home Page',
    description: 'Site landing page',
    code: '1.1',
    targetTab: 'home-page'
  },
  {
    id: '2',
    title: 'Create Department Page',
    description: 'New department',
    code: '1.2',
    targetTab: 'department-pages'
  },
  {
    id: '3',
    title: 'Create Sub-department',
    description: 'Nested under a department',
    code: '1.5',
    targetTab: 'sub-department-pages'
  },
  {
    id: '4',
    title: 'Assign Contributors',
    description: 'Who can edit what',
    code: '1.7',
    targetTab: 'contributors'
  }
];

export const MOCK_SITE_STRUCTURE: ISiteStructureNode = {
  id: 'root',
  title: 'PSEGLI Home',
  type: 'home',
  url: '/sites/PSEGLI/home.aspx',
  children: [
    {
      id: 'cust-ops',
      title: 'Customer Operations',
      type: 'department',
      url: '/sites/PSEGLI/customer-operations.aspx',
      children: [
        {
          id: 'billing',
          title: 'Billing',
          type: 'page',
          url: '/sites/PSEGLI/customer-operations/billing.aspx'
        },
        {
          id: 'call-center',
          title: 'Call Center',
          type: 'page',
          url: '/sites/PSEGLI/customer-operations/call-center.aspx'
        }
      ]
    },
    {
      id: 'it',
      title: 'Information Technology',
      type: 'department',
      url: '/sites/PSEGLI/it.aspx',
      children: [
        {
          id: 'copilot',
          title: 'CoPilot Enhanced',
          type: 'page',
          url: '/sites/PSEGLI/it/copilot-enhanced.aspx'
        }
      ]
    }
  ]
};

export const MOCK_RECENT_ACTIVITIES: IActivityItem[] = [
  {
    id: 'act-1',
    page: 'Billing',
    change: 'Updated article "Autopay FAQ"',
    by: 'Anushka R.',
    date: 'Oct 15, 2026',
    status: 'Pending'
  },
  {
    id: 'act-2',
    page: 'CoPilot Enhanced',
    change: 'Table row added: Forms',
    by: 'Harshit M.',
    date: 'Oct 14, 2026',
    status: 'Published'
  },
  {
    id: 'act-3',
    page: 'Call Center',
    change: 'Request: new sub-department page',
    by: 'Vikas S.',
    date: 'Oct 14, 2026',
    status: 'Request'
  }
];

export const INITIAL_HOME_PAGE_DETAILS: IPageDetails = {
  pageTitle: 'PSEGLI Home',
  siteUrlPrefix: '/sites/PSEGLI/',
  pageSlug: 'home',
  layout: 'Option 14 — Hero, intro, comparison, table',
  heroHeading: 'Welcome to PSEG Long Island',
  highlightText: 'Powering Long Island.',
  pageOwner: {
    name: 'Sai Naik',
    avatarInitials: 'SN',
    role: 'Super Admin'
  }
};

export const INITIAL_HOME_PAGE_SECTIONS: IPageSection[] = [
  {
    id: 'sec-1',
    title: 'Hero banner',
    subtitle: 'Heading, highlight text, image',
    status: 'Done',
    type: 'hero',
    data: {
      heading: 'Welcome to PSEG Long Island',
      highlight: 'Powering Long Island.',
      subText: 'Providing safe, reliable and resilient electric service to 1.1 million customers.'
    }
  },
  {
    id: 'sec-2',
    title: 'Intro text',
    subtitle: 'Rich text + link',
    status: 'Done',
    type: 'intro',
    data: {
      introHtml: 'Explore our latest operational updates, key resources, and portal links.',
      buttonText: 'Learn More',
      buttonUrl: '#'
    }
  },
  {
    id: 'sec-3',
    title: 'Callout question',
    subtitle: 'Links to a detail page',
    status: 'Done',
    type: 'callout',
    data: {
      question: 'Looking for emergency response guidelines or reporting an outage?',
      linkText: 'Access Storm Center',
      linkUrl: '#'
    }
  },
  {
    id: 'sec-4',
    title: 'Two-column comparison',
    subtitle: 'Column A / Column B',
    status: 'Editing',
    type: 'comparison',
    data: {
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
    }
  },
  {
    id: 'sec-5',
    title: 'Table',
    subtitle: 'Rows from SharePoint list',
    status: 'Done',
    type: 'table',
    data: {
      sourceList: 'Company Directory Resources',
      rowCount: 5
    }
  }
];

export const INITIAL_DEPARTMENTS: IDepartmentItem[] = [
  {
    id: 'dept-1',
    name: 'Customer Operations',
    parentPage: 'PSEGLI Home',
    slug: 'customer-operations',
    description: 'Team updates, processes and contacts for Customer Operations.',
    layout: 'Option 14 — Department',
    owner: {
      name: 'Samuel Hardeman',
      avatarInitials: 'SH'
    },
    subDepartments: ['Billing', 'Call Center', 'Field Services']
  },
  {
    id: 'dept-2',
    name: 'Information Technology',
    parentPage: 'PSEGLI Home',
    slug: 'information-technology',
    description: 'IT infrastructure, systems, tools, and digital workplace initiatives.',
    layout: 'Option 14 — Department',
    owner: {
      name: 'Harshit M.',
      avatarInitials: 'HM'
    },
    subDepartments: ['CoPilot Enhanced', 'Cloud Infrastructure', 'Cybersecurity']
  },
  {
    id: 'dept-3',
    name: 'Human Resources',
    parentPage: 'PSEGLI Home',
    slug: 'human-resources',
    description: 'Employee benefits, training, recruitment and leadership development.',
    layout: 'Option 14 — Department',
    owner: {
      name: 'Anushka R.',
      avatarInitials: 'AR'
    },
    subDepartments: ['Talent Acquisition', 'Benefits & Payroll', 'Training Center']
  }
];

export const INITIAL_DEPARTMENT_SECTIONS: IPageSection[] = [
  {
    id: 'dsec-1',
    title: 'Hero banner',
    subtitle: 'Heading, highlight text, image',
    status: 'Done',
    type: 'hero',
    data: {
      heading: 'Customer Operations Department',
      highlight: 'Excellence in customer care and rapid incident resolution.'
    }
  },
  {
    id: 'dsec-2',
    title: 'Intro text',
    subtitle: 'Rich text + link',
    status: 'Done',
    type: 'intro',
    data: {
      introHtml: 'Serving our community 24/7 with dedicated customer agents and digital services.'
    }
  },
  {
    id: 'dsec-3',
    title: 'Sub-department cards',
    subtitle: 'Auto-generated from the Department URL list',
    status: 'Dynamic',
    type: 'sub-departments',
    data: {
      note: 'Sub-department cards update on their own when a sub-department is created (1.5).'
    }
  },
  {
    id: 'dsec-4',
    title: 'Articles',
    subtitle: 'Title, body, image',
    status: 'Editing',
    type: 'articles',
    data: {
      title: 'Storm season readiness checklist',
      body: 'What every team needs to have in place before hurricane season begins: contact trees, outage scripts and escalation paths.',
      imageUrl: ''
    }
  }
];

export const MOCK_CONTRIBUTORS: IContributorItem[] = [
  {
    id: 'c-1',
    name: 'Sai Naik',
    email: 'sai.naik@psegli.com',
    avatarInitials: 'SN',
    role: 'Super Admin',
    assignedPages: ['PSEGLI Home', 'All Departments']
  },
  {
    id: 'c-2',
    name: 'Samuel Hardeman',
    email: 'samuel.hardeman@psegli.com',
    avatarInitials: 'SH',
    role: 'Department Admin',
    assignedPages: ['Customer Operations', 'Billing']
  },
  {
    id: 'c-3',
    name: 'Anushka R.',
    email: 'anushka.r@psegli.com',
    avatarInitials: 'AR',
    role: 'Content Editor',
    assignedPages: ['Billing', 'Human Resources']
  },
  {
    id: 'c-4',
    name: 'Harshit M.',
    email: 'harshit.m@psegli.com',
    avatarInitials: 'HM',
    role: 'Technical Lead',
    assignedPages: ['Information Technology', 'CoPilot Enhanced']
  },
  {
    id: 'c-5',
    name: 'Vikas S.',
    email: 'vikas.s@psegli.com',
    avatarInitials: 'VS',
    role: 'Content Editor',
    assignedPages: ['Call Center']
  }
];

export const MOCK_APPROVALS: IApprovalItem[] = [
  {
    id: 'app-1',
    page: 'Billing',
    changeDescription: 'Updated article "Autopay FAQ" with new credit card processing rules',
    requestedBy: 'Anushka R.',
    date: 'Oct 15, 2026',
    status: 'Pending'
  },
  {
    id: 'app-2',
    page: 'Call Center',
    changeDescription: 'New sub-department page creation request for "Tier 2 Escalations"',
    requestedBy: 'Vikas S.',
    date: 'Oct 14, 2026',
    status: 'Pending'
  },
  {
    id: 'app-3',
    page: 'Information Technology',
    changeDescription: 'Added MFA onboarding guide to IT department resources',
    requestedBy: 'Harshit M.',
    date: 'Oct 13, 2026',
    status: 'Pending'
  },
  {
    id: 'app-4',
    page: 'Human Resources',
    changeDescription: 'Updated annual benefits enrollment banner and deadline dates',
    requestedBy: 'Anushka R.',
    date: 'Oct 12, 2026',
    status: 'Pending'
  },
  {
    id: 'app-5',
    page: 'Customer Operations',
    changeDescription: 'Modified team leadership roster and emergency contact table',
    requestedBy: 'Samuel Hardeman',
    date: 'Oct 11, 2026',
    status: 'Pending'
  }
];

export const MOCK_FEEDBACK: IFeedbackItem[] = [
  {
    id: 'fb-1',
    page: 'Billing',
    submittedBy: 'David Miller',
    date: 'Oct 15, 2026',
    feedback: 'Please clarify if customers on payment assistance can enroll in paperless billing.',
    status: 'Open'
  },
  {
    id: 'fb-2',
    page: 'PSEGLI Home',
    submittedBy: 'Sarah Jenkins',
    date: 'Oct 14, 2026',
    feedback: 'The hero image on mobile screens cuts off the emergency contact helpline.',
    status: 'Open'
  },
  {
    id: 'fb-3',
    page: 'CoPilot Enhanced',
    submittedBy: 'Brian Fox',
    date: 'Oct 13, 2026',
    feedback: 'Request to add a video tutorial link on how to prompt CoPilot for Excel data analysis.',
    status: 'Open'
  }
];

export const MOCK_CONTRIBUTOR_SITES: IContributorSite[] = [
  {
    id: 'site-1',
    title: 'Billing',
    department: 'Customer Operations · Billing',
    pendingCount: 1,
    statusText: '1 pending',
    statusType: 'pending',
    lastUpdated: 'Oct 15',
    owner: 'Harshit M.',
    bannerType: 'gradient'
  },
  {
    id: 'site-2',
    title: 'CoPilot Enhanced',
    department: 'Information Technology · CoPilot Enhanced',
    statusText: 'Up to date',
    statusType: 'uptodate',
    lastUpdated: 'Oct 14',
    owner: 'Sai Naik',
    bannerType: 'image',
    bannerImageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80'
  }
];

export const MOCK_CONTRIBUTOR_SUBMISSIONS: ISubmissionItem[] = [
  {
    id: 'sub-1',
    item: 'Autopay FAQ',
    page: 'Billing',
    submitted: 'Oct 15',
    status: 'Rejected',
    reason: {
      by: 'Sai Naik',
      date: 'Oct 15, 5:40 PM',
      text: 'Please confirm the go-live date with Billing before publishing. The portal launch moved to Oct 20.'
    },
    yourChange: 'Enrollment now takes effect on the next bill, and customers can set up paperless billing in the same step.'
  },
  {
    id: 'sub-2',
    item: 'Request: Copilot Training page',
    page: 'Information Technology',
    submitted: 'Oct 15',
    status: 'Pending',
    yourChange: 'Added overview and training schedule for Copilot rollout across departments.'
  },
  {
    id: 'sub-3',
    item: 'Table row: Forms',
    page: 'CoPilot Enhanced',
    submitted: 'Oct 12',
    status: 'Approved',
    yourChange: 'Updated internal request forms link to modern SharePoint list.'
  }
];
