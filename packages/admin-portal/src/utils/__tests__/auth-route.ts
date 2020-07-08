import {
  getAuthRouteByLoginType,
  getLoginTypeByPath,
  getDefaultRouteByLoginType,
  getDefaultPathByLoginType,
} from '../auth-route'
import Routes from '../../constants/routes'
import { match } from 'react-router'

const mockRouteMatch: match<{}> = {
  isExact: true,
  params: '',
  path: '',
  url: '',
}

describe('getAuthRouteByLoginType', () => {
  it('should return correct route', () => {
    expect(getAuthRouteByLoginType('ADMIN')).toEqual(Routes.ADMIN_LOGIN)
    expect(getAuthRouteByLoginType('DEVELOPER')).toEqual(Routes.DEVELOPER_LOGIN)
    expect(getAuthRouteByLoginType('CLIENT')).toEqual(Routes.CLIENT_LOGIN)
  })
})

describe('getLoginTypeByPath', () => {
  it('should return correct login type', () => {
    expect(getLoginTypeByPath(Routes.ADMIN_LOGIN)).toEqual('ADMIN')
    expect(getLoginTypeByPath(Routes.DEVELOPER_LOGIN)).toEqual('DEVELOPER')
    expect(getLoginTypeByPath(Routes.CLIENT_LOGIN)).toEqual('CLIENT')
  })
})

describe('getDefaultRouteByLoginType', () => {
  it('should return origin url + Routes.ADMIN_APPROVALS if loginType = ADMIN ', () => {
    expect(
      getDefaultRouteByLoginType({
        loginType: 'ADMIN',
      }),
    ).toEqual(`${window.location.origin}${Routes.ADMIN_APPROVALS}`)
  })

  /* eslint-disable max-len */
  it('should return origin url + Routes.DEVELOPER_MY_APPS if loginType = DEVELOPER and isDeveloperFirstTimeLoginComplete is true', () => {
    expect(
      getDefaultRouteByLoginType({
        loginType: 'DEVELOPER',
        isDeveloperFirstTimeLoginComplete: true,
      }),
    ).toEqual(`${window.location.origin}${Routes.DEVELOPER_MY_APPS}`)
  })

  it('should return origin url + Routes.DEVELOPER_WELCOME if loginType = DEVELOPER and isDeveloperFirstTimeLoginComplete is false', () => {
    expect(
      getDefaultRouteByLoginType({
        loginType: 'DEVELOPER',
      }),
    ).toEqual(`${window.location.origin}${Routes.DEVELOPER_WELCOME}`)
  })

  it('should return origin url + Routes.INSTALLED_APPS if loginType = CLIENT and isClientFirstTimeLoginComplete is true', () => {
    expect(
      getDefaultRouteByLoginType({
        loginType: 'CLIENT',
        isClientFirstTimeLoginComplete: true,
      }),
    ).toEqual(`${window.location.origin}${Routes.INSTALLED_APPS}`)
  })

  it('should return origin url + Routes.CLIENT_WELCOME if loginType = CLIENT and isClientFirstTimeLoginComplete is false', () => {
    expect(
      getDefaultRouteByLoginType({
        loginType: 'CLIENT',
      }),
    ).toEqual(`${window.location.origin}${Routes.CLIENT_WELCOME}`)
  })
  /* eslint-enable*/
})

describe('getDefaultPathByLoginType', () => {
  it('should return Routes.ADMIN_APPROVALS if loginType = ADMIN ', () => {
    expect(
      getDefaultPathByLoginType({
        loginType: 'ADMIN',
        developerLoginRouteMatch: null,
        clientLoginRouteMatch: null,
      }),
    ).toEqual(Routes.ADMIN_APPROVALS)
  })

  /* eslint-disable max-len */
  it('should return Routes.DEVELOPER_MY_APPS if loginType = DEVELOPER and isDeveloperFirstTimeLoginComplete is true', () => {
    expect(
      getDefaultPathByLoginType({
        loginType: 'DEVELOPER',
        developerLoginRouteMatch: null,
        clientLoginRouteMatch: null,
        isDeveloperFirstTimeLoginComplete: true,
      }),
    ).toEqual(Routes.DEVELOPER_MY_APPS)
  })

  it('should return Routes.DEVELOPER_WELCOME if loginType = DEVELOPER and isDeveloperFirstTimeLoginComplete is false', () => {
    expect(
      getDefaultPathByLoginType({
        loginType: 'DEVELOPER',
        developerLoginRouteMatch: null,
        clientLoginRouteMatch: null,
      }),
    ).toEqual(Routes.DEVELOPER_WELCOME)
  })

  it('should return Routes.INSTALLED_APPS if loginType = CLIENT and isClientFirstTimeLoginComplete is true', () => {
    expect(
      getDefaultPathByLoginType({
        loginType: 'CLIENT',
        developerLoginRouteMatch: null,
        clientLoginRouteMatch: null,
        isClientFirstTimeLoginComplete: true,
      }),
    ).toEqual(Routes.INSTALLED_APPS)
  })

  it('should return Routes.CLIENT_WELCOME if loginType = CLIENT and isClientFirstTimeLoginComplete is false', () => {
    expect(
      getDefaultPathByLoginType({
        loginType: 'CLIENT',
        developerLoginRouteMatch: null,
        clientLoginRouteMatch: null,
      }),
    ).toEqual(Routes.CLIENT_WELCOME)
  })

  it('should return Routes.CLIENT_WELCOME if loginType = DEVELOPER and clientLoginRouteMatch is existed and isClientFirstTimeLoginComplete is false', () => {
    expect(
      getDefaultPathByLoginType({
        loginType: 'DEVELOPER',
        clientLoginRouteMatch: mockRouteMatch,
        developerLoginRouteMatch: null,
        isClientFirstTimeLoginComplete: false,
      }),
    ).toEqual(Routes.CLIENT_WELCOME)
  })
  it('should return Routes.INSTALLED_APPS if loginType = DEVELOPER and clientLoginRouteMatch is existed and isClientFirstTimeLoginComplete is true', () => {
    expect(
      getDefaultPathByLoginType({
        loginType: 'DEVELOPER',
        clientLoginRouteMatch: mockRouteMatch,
        developerLoginRouteMatch: null,
        isClientFirstTimeLoginComplete: true,
      }),
    ).toEqual(Routes.INSTALLED_APPS)
  })
  //----
  it('should return Routes.DEVELOPER_WELCOME if loginType = CLIENT and developerLoginRouteMatch is existed and isDeveloperFirstTimeLoginComplete is false', () => {
    expect(
      getDefaultPathByLoginType({
        loginType: 'CLIENT',
        clientLoginRouteMatch: null,
        developerLoginRouteMatch: mockRouteMatch,
        isDeveloperFirstTimeLoginComplete: false,
      }),
    ).toEqual(Routes.DEVELOPER_WELCOME)
  })
  it('should return Routes.DEVELOPER_MY_APPS if loginType = DEVELOPER and developerLoginRouteMatch is existed and isDeveloperFirstTimeLoginComplete is true', () => {
    expect(
      getDefaultPathByLoginType({
        loginType: 'CLIENT',
        clientLoginRouteMatch: null,
        developerLoginRouteMatch: mockRouteMatch,
        isDeveloperFirstTimeLoginComplete: true,
      }),
    ).toEqual(Routes.DEVELOPER_MY_APPS)
  })
  /* eslint-enable*/
})