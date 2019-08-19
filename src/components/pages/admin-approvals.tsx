import * as React from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '@/types/core'
import { AdminApprovalsState } from '@/reducers/admin-approvals'
import Loader from '@/components/ui/loader'
import ErrorBoundary from '@/components/hocs/error-boundary'
import { withRouter, RouteComponentProps } from 'react-router'
import { oc } from 'ts-optchain'
import Pagination from '@/components/ui/pagination'
import routes from '@/constants/routes'
import { AppDetailState } from '@/reducers/app-detail'
import bulma from '@/styles/vendor/bulma'
import { REVISIONS_PER_PAGE } from '@/constants/paginator'
import { revisionDetailRequestData, RevisionDetailRequestParams } from '@/actions/revision-detail'
import AdminApprovalModal from '../ui/admin-approval-modal'
import { appDetailRequestData } from '@/actions/app-detail'
import { RevisionDetailState } from '@/reducers/revision-detail'
import Modal from '../ui/modal'

export interface AdminApprovalsMappedActions {
  fetchRevisionDetail: (params: RevisionDetailRequestParams) => void
  fetchAppDetail: (id: string) => void
}

export interface AdminApprovalsMappedProps {
  approvalsState: AdminApprovalsState
  appDetail: AppDetailState
  revisionDetail: RevisionDetailState
}

export type AdminApprovalsProps = AdminApprovalsMappedActions &
  AdminApprovalsMappedProps &
  RouteComponentProps<{ page?: any }>

export const AdminApprovals: React.FunctionComponent<AdminApprovalsProps> = ({
  approvalsState,
  match,
  fetchRevisionDetail,
  fetchAppDetail,
  appDetail,
  revisionDetail
}) => {
  const pageNumber = match.params && !isNaN(match.params.page) ? Number(match.params.page) : 1
  const unfetched = !approvalsState.adminApprovalsData
  const loading = approvalsState.loading
  const list = oc<AdminApprovalsState>(approvalsState).adminApprovalsData.data.data([])
  const { totalCount, pageSize } = oc<AdminApprovalsState>(approvalsState).adminApprovalsData.data({})
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const pageNumberInState = oc<AdminApprovalsState>(approvalsState).adminApprovalsData.data.pageNumber(1)

  if (unfetched && loading) {
    return <Loader />
  }
  return (
    <ErrorBoundary>
      <div className={`${bulma.container} ${bulma.isRelative} py-8`} data-test="revision-list-container">
        {loading && (
          <div className="pin absolute flex items-center justify-center">
            <Loader />
          </div>
        )}
        <table className={`${bulma.table} ${bulma.isFullwidth}`} data-test="revision-list">
          <thead>
            <tr>
              <th>#</th>
              <th>AppId</th>
              <th>Type</th>
              <th>Description</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map((revision, index) => (
              <tr key={revision.appRevisionId} data-app-id={revision.appId}>
                <th>{(pageNumberInState - 1) * REVISIONS_PER_PAGE + index + 1}</th>
                <th>{revision.appId}</th>
                <th>{revision.type}</th>
                <th>{revision.description}</th>
                <th>
                  <button
                    data-test={`view-details-button_${revision.appId}`}
                    className={`${bulma.button} ${bulma.isPrimary}`}
                    onClick={() => {
                      const { appId, appRevisionId } = revision
                      if (appRevisionId && appId) {
                        const currentRevisionId = oc<RevisionDetailState>(revisionDetail).revisionDetailData.data.id(
                          undefined
                        )
                        const currentAppId = oc<AppDetailState>(appDetail).appDetailData.data.id(undefined)
                        if (currentRevisionId !== appRevisionId) {
                          fetchRevisionDetail({ appId, appRevisionId })
                        }
                        if (currentAppId !== appId) {
                          fetchAppDetail(appId)
                        }
                        setIsModalOpen(true)
                      }
                    }}
                  >
                    View details
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          baseUrl={routes.ADMIN_APPROVALS}
          totalCount={totalCount}
          pageSize={pageSize}
          pageNumber={pageNumber}
        />
      </div>
      <AdminApprovalModal visible={isModalOpen} afterClose={() => setIsModalOpen(false)} />
    </ErrorBoundary>
  )
}

const mapStateToProps = (state: ReduxState): AdminApprovalsMappedProps => ({
  approvalsState: state.adminApprovals,
  appDetail: state.appDetail,
  revisionDetail: state.revisionDetail
})

const mapDispatchToProps = (dispatch: any): AdminApprovalsMappedActions => ({
  fetchRevisionDetail: param => dispatch(revisionDetailRequestData(param)),
  fetchAppDetail: (id: string) => dispatch(appDetailRequestData({ id }))
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AdminApprovals)
)
