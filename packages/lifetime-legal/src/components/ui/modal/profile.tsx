import React from 'react'
import { Button, Input, DatePicker, Formik, Form } from '@reapit/elements'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { ReduxState } from '@/types/core'
// @ts-ignore #49 Breaking changes to API
import { ContactCommunicationModel, ContactModel } from '@reapit/foundations-ts-definitions'
import { checkListDetailUpdateData } from '@/actions/checklist-detail'

export const renderForm = ({ isSubmitting }) => () => {
  return (
    <Form>
      <Input type="text" labelText="Title" id="title" name="title" />
      <Input type="text" labelText="Forename" id="forename" name="forename" />
      <Input type="text" labelText="Surname" id="surname" name="surname" />
      <DatePicker labelText="Date Of Birth" id="dateOfBirth" name="dateOfBirth" />
      <Input type="text" labelText="Home" id="home" name="home" />
      <Input type="text" labelText="Mobile" id="mobile" name="mobile" />
      <Input type="text" labelText="Work" id="work" name="work" />
      <Input type="email" labelText="Email" id="email" name="email" />
      <div className="flex justify-end">
        <Button loading={isSubmitting} type="submit" className="mr-2" variant="primary">
          Save
        </Button>
      </div>
    </Form>
  )
}

export const filterCommunication = (
  communications: ContactCommunicationModel[] | undefined,
  type: 'Home' | 'Mobile' | 'Work' | 'E-Mail',
) => {
  if (!communications) {
    return null
  }
  const newCommunication: ContactCommunicationModel | undefined = communications.find(
    (communication: ContactCommunicationModel) => {
      return communication.label === type
    },
  )
  if (newCommunication) {
    return newCommunication.detail
  }
  return null
}

export type ProfileProps = StateProps & DispatchProps

export const Profile: React.FC<ProfileProps> = ({ contact, onSubmitHandler, isSubmitting }: ProfileProps) => {
  return (
    <div>
      <Formik
        initialValues={{
          title: contact.title,
          forename: contact.forename,
          surname: contact.surname,
          dateOfBirth: contact.dateOfBirth ? new Date(contact.dateOfBirth) : null,
          // @ts-ignore #49 Breaking changes to API
          home: filterCommunication(contact.communications, 'Home'),
          // @ts-ignore #49 Breaking changes to API
          work: filterCommunication(contact.communications, 'Work'),
          // @ts-ignore #49 Breaking changes to API
          mobile: filterCommunication(contact.communications, 'Mobile'),
          // @ts-ignore #49 Breaking changes to API
          email: filterCommunication(contact.communications, 'E-Mail'),
        }}
        onSubmit={onSubmitHandler}
      >
        {renderForm({ isSubmitting })}
      </Formik>
    </div>
  )
}

export type StateProps = {
  contact: ContactModel
  isSubmitting: boolean
}

export const mapStateToProps = (state: ReduxState): StateProps => {
  return {
    isSubmitting: state?.checklistDetail?.isSubmitting || false,
    contact: state?.checklistDetail?.checklistDetailData?.contact || {},
  }
}

export type DispatchProps = {
  onSubmitHandler: (values) => void
}

export const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    onSubmitHandler: values => {
      const newValues: ContactModel = {
        ...values,
        communications: [
          { label: 'Home', detail: values.home },
          { label: 'Mobile', detail: values.mobile },
          { label: 'Work', detail: values.work },
          { label: 'E-Mail', detail: values.email },
        ],
      }
      dispatch(checkListDetailUpdateData(newValues))
    },
  }
}

export const ProfileInformationWithRedux = connect(mapStateToProps, mapDispatchToProps)(Profile)

ProfileInformationWithRedux.displayName = 'ProfileInformationWithRedux'

export default ProfileInformationWithRedux