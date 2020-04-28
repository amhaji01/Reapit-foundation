import React from 'react'
import {
  SelectBox,
  SelectBoxOptions,
  H3,
  FlexContainerBasic,
  FormSection,
  FormSubHeading,
  FlexContainerResponsive,
  LevelRight,
  Button,
  Table,
  Loader,
  Section,
} from '@reapit/elements'
import { ReduxState } from '@/types/core'
import { compose, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Form, Formik } from 'formik'
import { webhookTopicsRequestData } from '@/actions/webhook-subscriptions'
import { WebhookModel, TopicModel } from '@/reducers/webhook-subscriptions'
import {
  selectSubscriptionsData,
  selectSubscriptionsLoading,
  selectTopicsData,
  selectTopicsLoading,
} from '@/selector/wehooks'
import FormikAutoSave from '@/components/hocs/formik-auto-save'

export const columns = [
  {
    Header: 'URL',
    accessor: 'url',
  },
  {
    Header: 'Topics',
    accessor: 'topics',
  },
  {
    Header: 'Customer',
    accessor: 'customer',
  },
  {
    Header: 'Test Webhook',
    accessor: 'test',
  },
  {
    Header: 'Edit',
    accessor: 'edit',
  },
]

export const handleSubscriptionChange = fetchTopics => values => {
  fetchTopics(values.subscriptions)
}

export const getTableTopicsData = topics => {
  return topics.map((topic: TopicModel) => ({
    url: topic.url,
    topics: topic.associatedScope,
    customer: 'All Customers (*)',
    test: 'Ping',
    edit: (
      <Button dataTest="edit-btn" variant="primary" type="button" onClick={() => {}}>
        Edit
      </Button>
    ),
  }))
}

export type StateProps = {
  subscriptions: WebhookModel[]
  subscriptionsLoading: boolean
  topics: TopicModel[]
  topicsLoading: boolean
}

export type DeveloperWebhooksProps = StateProps & DispatchProps

export const DeveloperWebhooks = ({
  fetchTopics,
  subscriptions,
  subscriptionsLoading,
  topics,
  topicsLoading,
}: DeveloperWebhooksProps) => {
  if (subscriptionsLoading) {
    return <Loader />
  }

  const selectBoxOptions: SelectBoxOptions[] = subscriptions.map((subscription: WebhookModel) => ({
    label: subscription.applicationId,
    value: subscription.applicationId,
  }))

  return (
    <FlexContainerBasic hasPadding>
      <FlexContainerResponsive flexColumn hasBackground hasPadding>
        <H3>Manage Webhook Subscriptions</H3>
        <FormSection>
          <FormSubHeading>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore excepturi aliquam dolor, dolore placeat
            molestias illum quod quasi nihil. Modi consectetur praesentium sint quod qui quos soluta repellat porro
            minus.
          </FormSubHeading>
          <Formik initialValues={{ subscriptions: '' }} enableReinitialize={true} onSubmit={() => {}}>
            {() => (
              <Form>
                <SelectBox
                  helpText="Please select an App from the list below to view the associated Webhooks:"
                  name="subscriptions"
                  options={selectBoxOptions}
                  labelText="App"
                  id="subscription"
                />
                <FormikAutoSave onSave={handleSubscriptionChange(fetchTopics)} />
              </Form>
            )}
          </Formik>
          <Section>
            <LevelRight>
              <Button dataTest="logout-btn" variant="primary" type="button" onClick={() => {}}>
                Add New Webhook
              </Button>
            </LevelRight>
          </Section>
          {topicsLoading ? (
            <Loader />
          ) : (
            <Table scrollable columns={columns} data={getTableTopicsData(topics)} loading={false} />
          )}
        </FormSection>
      </FlexContainerResponsive>
    </FlexContainerBasic>
  )
}

export type DispatchProps = {
  fetchTopics: (applicationId: string) => void
}

export const mapStateToProps = (state: ReduxState): StateProps => ({
  subscriptions: selectSubscriptionsData(state),
  subscriptionsLoading: selectSubscriptionsLoading(state),
  topics: selectTopicsData(state),
  topicsLoading: selectTopicsLoading(state),
})

export const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    fetchTopics: (applicationId: string) => dispatch(webhookTopicsRequestData(applicationId)),
  }
}

export const withRedux = connect(mapStateToProps, mapDispatchToProps)

export const EnhanceSettingPage = compose<React.FC<DeveloperWebhooksProps>>(withRedux)(DeveloperWebhooks)
EnhanceSettingPage.displayName = 'EnhanceSettingPage'

export default EnhanceSettingPage as React.LazyExoticComponent<any>