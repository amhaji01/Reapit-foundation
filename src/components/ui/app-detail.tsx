import * as React from 'react'
import bulma from '@/styles/vendor/bulma'
import { ReduxState } from '@/types/core'
import Slider, { Settings } from 'react-slick'
import carouselStyles from '../../styles/elements/carousel.scss?mod'
import ChevronLeftIcon from '@/components/svg/chevron-left'
import '@/styles/vendor/slick.scss'
import { connect } from 'react-redux'
import { setAppDetailModalStatePermission } from '@/actions/app-detail-modal'
import { appPermissionRequestData } from '@/actions/app-permission'
import { AppDetailModel } from '@/types/marketplace-api-schema'
import { withRouter } from 'react-router'

const { useState } = React

export interface AppDetailModalInnerProps {
  data: AppDetailModel
}

export interface AppDetailModalMappedProps {
  isCurrentLoggedUserClient: boolean
}

export interface AppDetailModalMappedActions {
  setAppDetailModalStatePermission: () => void
  fetchAppPermission: (id: string) => void
}

export type AppDetailProps = AppDetailModalMappedActions & AppDetailModalMappedProps & AppDetailModalInnerProps

const SlickButtonNav = ({ currentSlide, setAppDetailModalStatePermission, slideCount, children, ...props }) => (
  <button {...props}>{children}</button>
)

export const AppDetail: React.FunctionComponent<AppDetailProps> = ({
  data,
  setAppDetailModalStatePermission,
  fetchAppPermission
}) => {
  if (!data) {
    return null
  }

  const { id, media = [], description, name, summary, developer, installedOn } = data
  const icon = media.filter(({ type }) => type === 'icon')[0]
  const carouselImages = media.filter(({ type }) => type === 'image')

  const settings: Settings = {
    dots: false,
    speed: 500,
    variableWidth: true,
    prevArrow: (
      // @ts-ignore
      <SlickButtonNav>
        <ChevronLeftIcon />
      </SlickButtonNav>
    ),
    nextArrow: (
      // @ts-ignore
      <SlickButtonNav>
        <ChevronLeftIcon />
      </SlickButtonNav>
    )
  }

  return (
    <>
      <div className={bulma.media}>
        <div className={bulma.mediaLeft}>
          <figure className={bulma.image + ' ' + bulma.is128x128}>{icon && <img src={icon.uri} />}</figure>
        </div>
        <div className={bulma.mediaContent}>
          <div className={bulma.content}>
            <div>
              <h3 className={bulma.is3} style={{ marginBottom: 0 }}>
                {name}
              </h3>
              <p>
                <small className={bulma.hasTextLink}>{developer}</small>
              </p>
            </div>
            <p>{summary}</p>
            {!installedOn && (
              <a
                onClick={() => {
                  if (!id) {
                    return
                  }
                  fetchAppPermission(id)
                  setAppDetailModalStatePermission()
                }}
              >
                Install App
              </a>
            )}
          </div>
        </div>
      </div>
      {carouselImages.length > 0 && (
        <div className={carouselStyles.container}>
          <Slider {...settings}>
            {carouselImages.map(({ uri }, index) => (
              <div key={index} className={carouselStyles.slide}>
                <img src={uri} />
              </div>
            ))}
          </Slider>
        </div>
      )}
      <br />
      <p>{description}</p>
    </>
  )
}

const mapStateToProps = (state: ReduxState): AppDetailModalMappedProps => {
  return {
    isCurrentLoggedUserClient: state.auth.loginType === 'CLIENT'
  }
}

const mapDispatchToProps = (dispatch: any): AppDetailModalMappedActions => ({
  setAppDetailModalStatePermission: () => dispatch(setAppDetailModalStatePermission()),
  fetchAppPermission: appId => dispatch(appPermissionRequestData(appId))
})

const AppDetailWithConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppDetail)

export default AppDetailWithConnect
