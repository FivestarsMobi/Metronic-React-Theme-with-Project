import React from "react";
import { connect } from "react-redux";
import * as builder from "../../ducks/builder";
import Brand from "../brand/Brand";
import PerfectScrollbar from "react-perfect-scrollbar";
import Menu from "./Menu";
import KTOffcanvas from "../../_assets/js/offcanvas";
import { toAbsoluteUrl } from "../../utils/utils";
import {Link} from "react-router-dom";

class AsideLeft extends React.Component {
  asideOffCanvasRef = React.createRef();
  
  componentDidMount() {
    // eslint-disable-next-line
    const ktoffConvas = new KTOffcanvas(
      this.asideOffCanvasRef.current,
      this.props.menuCanvasOptions
    );
  }

  render() {
    return (
      <>
        <div
          id="kt_aside"
          ref={this.asideOffCanvasRef}
          className={`kt-aside ${this.props.asideClassesFromConfig} kt-grid__item kt-grid kt-grid--desktop kt-grid--hor-desktop`}
        >
          <Brand />
          <div
            id="kt_aside_menu_wrapper"
            className="kt-aside-menu-wrapper kt-grid__item kt-grid__item--fluid"
          >
            {this.props.disableScroll && (
              <Menu htmlClassService={this.props.htmlClassService} />
            )}
            {!this.props.disableScroll && (
              <PerfectScrollbar
                options={{ wheelSpeed: 0.3 }}
              >            
              <Menu htmlClassService={this.props.htmlClassService} />
              </PerfectScrollbar>
            )}
            <div style={{'textAlign':'center'}}>
              <Link to="/support" variant="outlined" color="primary" style={{'width':'88%',  'left':'14px', 'bottom':'80px', color:'#5d78ff'}} className="btn btn-addevent">
                Support
              </Link>
              <img alt="IMCADO Admin Panel" src={toAbsoluteUrl("/media/logos/logo-4.png")} style={{'width':'90%', position:'absolute', 'bottom':'5px', 'left':'12px', 'height':'70px'}}/>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = store => ({
  disableAsideSelfDisplay:
    builder.selectors.getConfig(store, "aside.self.display") === false,
  disableScroll:
    builder.selectors.getConfig(store, "aside.menu.dropdown") === "true" ||
    false,
  asideClassesFromConfig: builder.selectors.getClasses(store, {
    path: "aside",
    toString: true
  }),
  menuCanvasOptions: {
    baseClass: "kt-aside",
    overlay: true,
    closeBy: "kt_aside_close_btn",
    toggleBy: {
      target: "kt_aside_mobile_toggler",
      state: "kt-header-mobile__toolbar-toggler--active"
    }
  },
  store
});

export default connect(mapStateToProps)(AsideLeft);
