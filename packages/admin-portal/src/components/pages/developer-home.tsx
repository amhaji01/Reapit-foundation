import * as React from 'react'
import { useHistory } from 'react-router'
import { useSelector } from 'react-redux'
import { History } from 'history'
import { Loader, Pagination, Section, H3, Button } from '@reapit/elements'
import { selectDeveloper } from '@/selector'
import AppList from '@/components/ui/app-list'
import ErrorBoundary from '@/components/hocs/error-boundary'
import { SandboxPopUp } from '@/components/ui/sandbox-pop-up'
import { AppSummaryModel } from '@reapit/foundations-ts-definitions'
import { getParamValueFromPath } from '@/utils/client-url-params'
import Routes from '@/constants/routes'
import { SubmitAppWizardModal } from '../ui/submit-app-wizard'

export const handleOnCardClick = (history: History) => (app: AppSummaryModel) => {
  history.push(`${Routes.DEVELOPER_MY_APPS}/${app.id}`)
}

export const handleOnChange = (history: History) => (page: number) =>
  history.push(`${Routes.DEVELOPER_MY_APPS}?page=${page}`)

export const onShowSubmitAppModal = (setSubmitAppModalVisible: React.Dispatch<React.SetStateAction<boolean>>) => () =>
  setSubmitAppModalVisible(true)

export const onCloseSubmitAppModal = (setSubmitAppModalVisible: React.Dispatch<React.SetStateAction<boolean>>) => () =>
  setSubmitAppModalVisible(false)

export const DeveloperHome: React.FC = () => {
  const history = useHistory()
  const developerState = useSelector(selectDeveloper)
  const [submitAppModalVisible, setSubmitAppModalVisible] = React.useState<boolean>(false)

  let pageNumber = 1

  if (location && location.search) {
    const pageQueryString = getParamValueFromPath(location.search, 'page')
    if (pageQueryString) {
      pageNumber = Number(pageQueryString)
    }
  }

  const unfetched = !developerState.developerData
  const loading = developerState.loading
  const list = developerState?.developerData?.data?.data || []
  const { totalCount, pageSize } = developerState?.developerData?.data || {}

  if (unfetched || loading) {
    return <Loader />
  }

  return (
    <ErrorBoundary>
      <Section className="justify-between items-center" isFlex>
        <H3 className="mb-0">My Apps</H3>
        <Button onClick={onShowSubmitAppModal(setSubmitAppModalVisible)} type="button" variant="primary">
          Create new app
        </Button>
        <SubmitAppWizardModal
          visible={submitAppModalVisible}
          afterClose={onCloseSubmitAppModal(setSubmitAppModalVisible)}
        />
      </Section>
      <AppList list={list} loading={loading} onCardClick={handleOnCardClick(history)} infoType="DEVELOPER_APPS_EMPTY" />
      <Pagination
        totalCount={totalCount}
        pageSize={pageSize}
        pageNumber={pageNumber}
        onChange={handleOnChange(history)}
      ></Pagination>
      <SandboxPopUp loading={loading} />
    </ErrorBoundary>
  )
}

export default DeveloperHome