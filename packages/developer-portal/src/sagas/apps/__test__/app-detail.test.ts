import { integrationTypesReceiveData } from '@/actions/app-integration-types'
import { fetchAppDetailSaga } from '../app-detail'
import { fetchDesktopIntegrationTypes } from '@/services/apps'
import { put, call } from '@redux-saga/core/effects'
import { Action } from '@/types/core'
import { cloneableGenerator } from '@redux-saga/testing-utils'
import { errorThrownServer } from '@/actions/error'
import errorMessages from '@/constants/error-messages'
import { FetchAppByIdParams, fetchAppById } from '@/services/apps'
import { fetchApiKeyInstallationById } from '@/services/installations'
import { appDetailDataStub } from '@/sagas/__stubs__/app-detail'
import { integrationTypesStub } from '@/sagas/__stubs__/integration-types'
import { fetchAppDetailSuccess } from '@/actions/apps'

jest.mock('@reapit/elements')

const paramsClientId: Action<FetchAppByIdParams> = {
  data: { id: '9b6fd5f7-2c15-483d-b925-01b650538e52', clientId: 'DAC' },
  type: 'FETCH_APP_DETAIL',
}

const params: Action<FetchAppByIdParams> = {
  data: { id: '9b6fd5f7-2c15-483d-b925-01b650538e52' },
  type: 'FETCH_APP_DETAIL',
}

describe('fetch developer app detail with clientId', () => {
  const gen = cloneableGenerator(fetchAppDetailSaga)(paramsClientId)
  expect(gen.next().value).toEqual(
    call(fetchAppById, { id: paramsClientId.data.id, clientId: paramsClientId.data.clientId }),
  )

  test('api call success', () => {
    const clone = gen.clone()
    expect(clone.next(appDetailDataStub.data).value).toEqual(call(fetchDesktopIntegrationTypes))
    expect(clone.next(integrationTypesStub).value).toEqual(put(integrationTypesReceiveData(integrationTypesStub)))
    expect(clone.next().value).toEqual(put(fetchAppDetailSuccess(appDetailDataStub.data)))
  })

  test('api call error', () => {
    const clone = gen.clone()
    // @ts-ignore
    expect(clone.throw('error').value).toEqual(
      put(
        errorThrownServer({
          type: 'SERVER',
          message: errorMessages.DEFAULT_SERVER_ERROR,
        }),
      ),
    )
  })
})

describe('fetch developer app detail without clientId', () => {
  const gen = cloneableGenerator(fetchAppDetailSaga)(params)
  expect(gen.next().value).toEqual(call(fetchAppById, { id: paramsClientId.data.id, clientId: undefined }))

  test('api call success', () => {
    const clone = gen.clone()
    expect(clone.next(appDetailDataStub.data).value).toEqual(call(fetchDesktopIntegrationTypes))
    expect(clone.next(integrationTypesStub).value).toEqual(put(integrationTypesReceiveData(integrationTypesStub)))
    expect(clone.next().value).toEqual(put(fetchAppDetailSuccess(appDetailDataStub.data)))
  })

  test('api call error', () => {
    const clone = gen.clone()
    // @ts-ignore
    expect(clone.throw('error').value).toEqual(
      put(
        errorThrownServer({
          type: 'SERVER',
          message: errorMessages.DEFAULT_SERVER_ERROR,
        }),
      ),
    )
  })
})

describe('client app detail fetch data and fetch apiKey', () => {
  const gen = cloneableGenerator(fetchAppDetailSaga)(params)
  expect(gen.next().value).toEqual(call(fetchAppById, { id: params.data.id, clientId: undefined }))

  test('api call success', () => {
    const clone = gen.clone()
    const installationId = '09682122-0811-4f36-9bfa-05e337de3065'
    const isWebComponent = true
    const apiKey = 'mockApiKey'
    // keep getting "serialize the same string here - jest bug"
    expect(
      JSON.stringify(
        clone.next({
          ...appDetailDataStub.data,
          isWebComponent,
          installationId,
        }).value,
      ),
    ).toBe(JSON.stringify(call(fetchApiKeyInstallationById, { installationId })))
    expect(clone.next({ apiKey }).value).toEqual(call(fetchDesktopIntegrationTypes))
    expect(clone.next(integrationTypesStub).value).toEqual(put(integrationTypesReceiveData(integrationTypesStub)))
    expect(clone.next().value).toEqual(
      put(fetchAppDetailSuccess({ ...appDetailDataStub.data, isWebComponent, installationId, apiKey })),
    )
  })

  test('api call error', () => {
    const clone = gen.clone()
    // @ts-ignore
    expect(clone.throw('error').value).toEqual(
      put(
        errorThrownServer({
          type: 'SERVER',
          message: errorMessages.DEFAULT_SERVER_ERROR,
        }),
      ),
    )
  })
})