/**
 * Please follow the <<STATE>>_<<ACTION_TYPE>> pattern and group actions by STATE
 */
const ActionTypes = {
  // Auth actions
  AUTH_LOGIN: 'AUTH_LOGIN',
  AUTH_LOGIN_SUCCESS: 'AUTH_LOGIN_SUCCESS',
  AUTH_LOGIN_FAILURE: 'AUTH_LOGIN_FAILURE',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_LOGOUT_SUCCESS: 'AUTH_LOGOUT_SUCCESS',
  AUTH_CHANGE_LOGIN_TYPE: 'AUTH_CHANGE_LOGIN_TYPE',
  AUTH_SET_DESKTOP_SESSION: 'AUTH_SET_DESKTOP_SESSION',

  // Error actions
  ERROR_THROWN_COMPONENT: 'ERROR_THROWN_COMPONENT',
  ERROR_THROWN_SERVER: 'ERROR_THROWN_SERVER',
  ERROR_CLEARED_COMPONENT: 'ERROR_CLEARED_COMPONENT',
  ERROR_CLEARED_SERVER: 'ERROR_CLEARED_SERVER',

  HOME_REQUEST_DATA: 'HOME_REQUEST_DATA',
  HOME_REQUEST_FAILURE: 'HOME_REQUEST_FAILURE',
  HOME_LOADING: 'HOME_LOADING',
  HOME_RECEIVE_DATA: 'HOME_RECEIVE_DATA',
  HOME_CLEAR_DATA: 'HOME_CLEAR_DATA'
}

export default ActionTypes
