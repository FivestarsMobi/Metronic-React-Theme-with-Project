import React from "react";
import { connect } from "react-redux";
import objectPath from "object-path";
import Header from "./header/Header";
import HeaderMobile from "./header/HeaderMobile";
import AsideLeft from "./aside/AsideLeft";
import Footer from "./footer/Footer";
import ScrollTop from "../../app/partials/layout/ScrollTop";
import HTMLClassService from "./HTMLClassService";
import LayoutConfig from "./LayoutConfig";
import MenuConfig from "./MenuConfig";
import LayoutInitializer from "./LayoutInitializer";
import QuickPanel from "../../app/partials/layout/QuickPanel";
import KtContent from "./KtContent";
import { CircularProgress } from "@material-ui/core";
import("./assets/Base.scss");



const htmlClassService = new HTMLClassService();
function Layout({
  children,
  asideDisplay,
  subheaderDisplay,
  selfLayout,
  layoutConfig,
  contentContainerClasses,
  auth,
  store
}) {
  htmlClassService.setConfig(layoutConfig);
  
  // scroll to top after location changes
  // window.scrollTo(0, 0);
  //console.log(htmlClassService);

  const contentCssClasses = htmlClassService.classes.content.join(" ");

  return selfLayout !== "blank" ? (
    <LayoutInitializer
      menuConfig={MenuConfig}
      layoutConfig={LayoutConfig}
      htmlClassService={htmlClassService}
    >
      {/* <!-- begin:: Header Mobile --> */}
      <HeaderMobile />
      {/* <!-- end:: Header Mobile --> */}
      <CircularProgress className="kt-splash-screen__spinner" style={{position: 'absolute','zIndex': '1','top': '45%','left': '50%', display:store.builder.layoutConfig.loadingCSS.display}} />
      <div className="kt-grid kt-grid--hor kt-grid--root" style={{opacity:store.builder.layoutConfig.loadingCSS.opacity, pointerEvents:store.builder.layoutConfig.loadingCSS.pointerEvents}}>
        {/* <!-- begin::Body --> */}
        <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">
          {/* <!-- begin:: Aside Left --> */}
          {asideDisplay && (
            <>
              <AsideLeft />
            </>
          )}
          {/* <!-- end:: Aside Left --> */}
          <div
            className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper"
            id="kt_wrapper"
          >
            {/* <!-- begin:: Header READY --> */}

            <Header />
            {/* <!-- end:: Header --> */}

            {/* <!-- begin:: Content --> */}
            <div
              id="kt_content"
              className={`kt-content ${contentCssClasses} kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor`}
            >
              {/* <!-- begin:: Content Head --> */}
              
              {/* <!-- end:: Content Head --> */}

              {/* <!-- begin:: Content Body --> */}
              {/* TODO: add class to animate  kt-grid--animateContent-finished */}
              <KtContent>
                {children}
              </KtContent>
              {/*<!-- end:: Content Body -->*/}
            </div>
            {/* <!-- end:: Content --> */}
            <Footer />
          </div>
        </div>
        {/* <!-- end:: Body --> */}
      </div>
      <QuickPanel />
      <ScrollTop />
    </LayoutInitializer>
  ) : (
    // BLANK LAYOUT
    <div className="kt-grid kt-grid--ver kt-grid--root">
      <KtContent>
        {children}
      </KtContent>
    </div>
  );
}

const mapStateToProps = store => ({
  layoutConfig:store.builder.layoutConfig,
  selfLayout: objectPath.get(store.builder.layoutConfig, "self.layout"),
  asideDisplay: objectPath.get(store.builder.layoutConfig, "aside.self.display"),
  subheaderDisplay: objectPath.get(store.builder.layoutConfig, "subheader.display"),
  desktopHeaderDisplay: objectPath.get(
    store.builder.layoutConfig,
    "header.self.fixed.desktop"
  ),
  contentContainerClasses: "",
  auth:store.auth,
  store
  // contentContainerClasses: builder.selectors.getClasses(store, {
  //   path: "content_container",
  //   toString: true
  // })
});

export default connect(mapStateToProps)(Layout);
