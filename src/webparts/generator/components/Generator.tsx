import * as React from 'react';
import type { IGeneratorProps } from './IGeneratorProps';
import { ISubmissionItem, NavigationTab, UserRole } from '../models/types';
import { Layout } from './layout/Layout';
import { DashboardView } from './views/DashboardView';
import { HomePageWizard } from './views/HomePageWizard';
import { DepartmentPageWizard } from './views/DepartmentPageWizard';
import { SubDepartmentWizard } from './views/SubDepartmentWizard';
import { ContributorsView } from './views/ContributorsView';
import { ApprovalsView } from './views/ApprovalsView';
import { RequestsFeedbackView } from './views/RequestsFeedbackView';
import { ContributorSitesView } from './views/ContributorSitesView';
import { ContributorRequestsView } from './views/ContributorRequestsView';
import { ContributorSubmissionsView } from './views/ContributorSubmissionsView';

interface IGeneratorState {
  userRole: UserRole;
  currentTab: NavigationTab;
  approvalsCount: number;
  feedbackCount: number;
  editingDepartment?: string;
  resubmitSubmission?: ISubmissionItem;
}

export default class Generator extends React.Component<IGeneratorProps, IGeneratorState> {
  constructor(props: IGeneratorProps) {
    super(props);

    const initialRole = this._determineInitialRole(props);
    const initialTab: NavigationTab = initialRole === 'contributor' ? 'my-sites' : 'dashboard';

    this.state = {
      userRole: initialRole,
      currentTab: initialTab,
      approvalsCount: 5,
      feedbackCount: 2
    };
  }

  public componentDidUpdate(prevProps: IGeneratorProps): void {
    if (this.props.userRole !== prevProps.userRole) {
      const newRole = this._determineInitialRole(this.props);
      if (newRole !== this.state.userRole) {
        this.setState({
          userRole: newRole,
          currentTab: newRole === 'contributor' ? 'my-sites' : 'dashboard'
        });
      }
    }
  }

  private _determineInitialRole(props: IGeneratorProps): UserRole {
    if (props.userRole === 'contributor') return 'contributor';
    if (props.userRole === 'admin') return 'admin';

    // Auto-detect from logged in user display name or email if role is 'auto'
    const name = (props.userDisplayName || '').toLowerCase();
    if (
      name.indexOf('anushka') !== -1 ||
      name.indexOf('contributor') !== -1 ||
      name.indexOf('cordinator') !== -1 ||
      name.indexOf('coordinator') !== -1
    ) {
      return 'contributor';
    }

    return 'admin';
  }

  private handleNavigate = (tab: NavigationTab): void => {
    this.setState({ currentTab: tab });
  };

  private handleSwitchRole = (newRole: UserRole): void => {
    this.setState({
      userRole: newRole,
      currentTab: newRole === 'contributor' ? 'my-sites' : 'dashboard'
    });
  };

  private handleCreatePage = (): void => {
    this.setState({ currentTab: 'home-page' });
  };

  public render(): React.ReactElement<IGeneratorProps> {
    const { userRole, currentTab, approvalsCount, feedbackCount } = this.state;
    const isContributor = userRole === 'contributor';

    return (
      <Layout
        currentTab={currentTab}
        onNavigate={this.handleNavigate}
        approvalsCount={approvalsCount}
        feedbackCount={feedbackCount}
        userRole={userRole}
        onSwitchRole={this.handleSwitchRole}
      >
        {/* ========================================== */}
        {/* CONTRIBUTOR / COORDINATOR VIEWS (Screenshots 1-4) */}
        {/* ========================================== */}
        {isContributor && (
          <>
            {currentTab === 'my-sites' && (
              <ContributorSitesView
                onEditPage={(pageTitle) => {
                  this.setState({ editingDepartment: pageTitle, currentTab: 'department-pages' });
                }}
                onRequestNewPage={() => this.handleNavigate('requests')}
                onNavigateToRequests={() => this.handleNavigate('requests')}
                onGiveFeedback={() => this.handleNavigate('requests')}
              />
            )}

            {currentTab === 'requests' && <ContributorRequestsView />}

            {currentTab === 'my-submissions' && (
              <ContributorSubmissionsView
                onEditAndResubmit={(submission) => {
                  this.setState({ resubmitSubmission: submission, currentTab: 'department-pages' });
                }}
                onEditOnly={(submission) => {
                  this.setState({ resubmitSubmission: submission, currentTab: 'department-pages' });
                }}
              />
            )}

            {/* When contributor edits content from card or resubmission */}
            {currentTab === 'department-pages' && (
              <DepartmentPageWizard
                onCancel={() => this.handleNavigate('my-sites')}
                onPublishedSuccess={() => this.handleNavigate('my-submissions')}
              />
            )}
          </>
        )}

        {/* ========================================== */}
        {/* ADMIN VIEWS (COMPLETELY UNCHANGED & PRESERVED) */}
        {/* ========================================== */}
        {!isContributor && (
          <>
            {currentTab === 'dashboard' && (
              <DashboardView
                onNavigate={this.handleNavigate}
                onCreatePageClick={this.handleCreatePage}
              />
            )}

            {currentTab === 'home-page' && (
              <HomePageWizard
                onCancel={() => this.handleNavigate('dashboard')}
                onPublishedSuccess={() => this.handleNavigate('dashboard')}
              />
            )}

            {currentTab === 'department-pages' && (
              <DepartmentPageWizard
                onCancel={() => this.handleNavigate('dashboard')}
                onPublishedSuccess={() => this.handleNavigate('dashboard')}
              />
            )}

            {currentTab === 'sub-department-pages' && (
              <SubDepartmentWizard
                onCancel={() => this.handleNavigate('dashboard')}
                onSuccess={() => this.handleNavigate('department-pages')}
              />
            )}

            {currentTab === 'contributors' && <ContributorsView />}

            {currentTab === 'requests' && <RequestsFeedbackView />}

            {currentTab === 'approvals' && (
              <ApprovalsView
                onApprovalCountChange={(count) => this.setState({ approvalsCount: count })}
              />
            )}
          </>
        )}
      </Layout>
    );
  }
}
