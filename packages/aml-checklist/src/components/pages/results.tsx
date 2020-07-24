import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import ErrorBoundary from '@/components/hocs/error-boundary'
import { ReduxState } from '@/types/core'
import { ResultState } from '@/reducers/result'
import { Pagination, Table, Button, H3, Info, H6, Section } from '@reapit/elements'
import { resultRequestData, ContactsParams, SearchParams } from '@/actions/result'
import Routes from '@/constants/routes'

export interface ResultMappedActions {
  fetchContacts: (params: ContactsParams) => void
}

export interface ResultMappedProps {
  resultState: ResultState
}

export type ResultProps = ResultMappedActions & ResultMappedProps & RouteComponentProps

export const generateColumns = history => () => {
  const PostCodeCell = ({ row }) => {
    const postcode = row.original.primaryAddress?.postcode
    return <span>{postcode}</span>
  }
  const AddressCell = ({ row }) => {
    const primaryAddress = row.original.primaryAddress || {}
    const addressKeys = ['buildingName', 'buildingNumber', 'line1', 'line2']
    const filteredAddressEntries = Object.entries(primaryAddress)
      .filter(([key, value]) => addressKeys.includes(key) && value)
      .map(([, value]) => value)
      .join(', ')

    return <span>{filteredAddressEntries}</span>
  }
  const StatusCell = ({ row }) => {
    return <span className="capitalize">{row.original.identityCheck}</span>
  }
  const ButtonCell = ({ row }) => {
    return (
      <Button type="button" variant="info" onClick={() => history.push(`/checklist-detail/${row.original.id}`)}>
        Edit
      </Button>
    )
  }
  return [
    {
      Header: 'Name',
      id: 'name',
      accessor: d => `${d.forename} ${d.surname}`,
    },
    {
      Header: 'Address',
      id: 'primaryAddress',
      accessor: 'primaryAddress',
      Cell: AddressCell,
    },
    {
      Header: 'Postcode',
      id: 'postcode',
      accessor: 'postcode',
      Cell: PostCodeCell,
    },
    {
      Header: 'Status',
      id: 'identityCheck',
      accessor: 'identityCheck',
      Cell: StatusCell,
    },
    {
      Header: '',
      id: 'action',
      Cell: ButtonCell,
    },
  ]
}

export const generateSearchTitle = (search: SearchParams | null) => () => {
  if (search) {
    return Object.values(search)
      .filter(value => value)
      .join(', ')
  }
}

export const fnChangePage = (setPageNumber: (page: number) => void) => (page: number) => {
  setPageNumber(page)
}

export const fnFetchContacts = (
  search: SearchParams | null,
  pageNumber: number,
  fetchContacts: (params: ContactsParams) => void,
) => () => {
  if (search) {
    fetchContacts({ ...search, pageNumber })
  }
}

export const renderEmptyResult = () => (
  <Section hasPadding={false} hasMargin={false} isCentered>
    <Info infoType="">
      <H6>No Results found</H6>
    </Info>
    <Link to={Routes.HOME} className="inline-block">
      <Button variant="info" type="button">
        New Search
      </Button>
    </Link>
  </Section>
)

export const Result: React.FunctionComponent<ResultProps> = ({ resultState, fetchContacts, history }) => {
  const { search, loading } = resultState
  const { totalCount, pageSize, _embedded = [] } = resultState?.contacts || {}
  const [pageNumber, setPageNumber] = React.useState<number>(1)

  const columns = React.useMemo(generateColumns(history), [_embedded])

  const searchTitle = React.useMemo(generateSearchTitle(search), [search])

  const handleChangePage = React.useCallback(fnChangePage(setPageNumber), [pageNumber])

  React.useEffect(fnFetchContacts(search, pageNumber, fetchContacts), [search, pageNumber])

  return (
    <ErrorBoundary>
      {!search || Number(totalCount) === 0 ? (
        renderEmptyResult()
      ) : (
        <Section hasPadding>
          {search && <H3>Showing Results for &lsquo;{searchTitle}&rsquo;</H3>}
          <Table scrollable data={_embedded} columns={columns} loading={loading} />
          <Section>
            <Pagination
              pageNumber={pageNumber}
              pageSize={pageSize}
              totalCount={totalCount}
              onChange={handleChangePage}
            />
          </Section>
        </Section>
      )}
    </ErrorBoundary>
  )
}

export const mapStateToProps = (state: ReduxState): ResultMappedProps => ({
  resultState: state.result,
})

export const mapDispatchToProps = (dispatch: any): ResultMappedActions => ({
  fetchContacts: (params: ContactsParams) => dispatch(resultRequestData(params)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Result))
