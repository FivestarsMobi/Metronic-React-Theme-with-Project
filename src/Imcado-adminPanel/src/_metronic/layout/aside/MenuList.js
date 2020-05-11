import React from "react";
import MenuSection from "./MenuSection";
import MenuItemSeparator from "./MenuItemSeparator";
import MenuItem from "./MenuItem";
import { connect } from 'react-redux';
import * as builder from "../../ducks/builder";

class MenuList extends React.Component {
  
  async componentDidMount() {
    const {store, dispatch} = this.props;

    var layoutConfig = store.builder.layoutConfig;
    layoutConfig.loadingCSS = {
      display : 'block',
      opacity:'0.5',
      pointerEvents:'none'
    };
    dispatch(builder.actions.setLayoutConfigs(layoutConfig));
    
    const response = await fetch(`https://dev.imcado.app/events`,
      {
        method : 'GET',
        mode: 'cors',
        headers:{
          'Content-Type': 'application/json',
          'x-zumo-auth' : store.auth.user.xZumoAuth
        }
      });
    var data = await response.json();
    let _menuConfig = store.builder.menuConfig;
    data.Items = data.Items.sort(function(a, b){
      return new Date(a.StartDateTime) - new Date(b.StartDateTime);
    })
    if (data.Items && data.Items.length > 0 ){
      for (var i in data.Items){
        var item = {
          title: data.Items[i].Name,
          root: true,
          submenu: [
            {
              title: "Details",
              translate: "MENU.DETAILS",
              icon: "flaticon2-information",
              page: "eventdetail/" + data.Items[i].EventId
            },
            {
              title: "Participants",
              translate: "MENU.PARTICIPANTS",
              icon: "flaticon-users",
              page: "participantsdetail/" + data.Items[i].EventId
            },{
              title: "Photos",
              translate: "MENU.PHOTOS",
              icon: "flaticon2-photograph",
              page: "photosdetail/" + data.Items[i].EventId
            }
          ]
        }
        _menuConfig.aside.items.push(item);
        //dispatch(builder.actions.setMenuConfig(_menuConfig));
        layoutConfig.loadingCSS = {
          display : 'none',
          opacity:'1',
          pointerEvents:'all'
        };
        dispatch(builder.actions.setLayoutConfigs(layoutConfig));
      }
    }
  }

  render() {
    const { currentUrl, store } = this.props;
    var menuConfig = store.builder.menuConfig;
    var layoutConfig = store.builder.layoutConfig;
    return menuConfig.aside.items.map((child, index) => {
      return (
          <React.Fragment key={`menuList${index}`}>
            {child.section && <MenuSection item={child} />}
            {child.separator && <MenuItemSeparator item={child} />}
            {child.title && (
                <MenuItem
                    item={child}
                    currentUrl={currentUrl}
                    layoutConfig={layoutConfig}
                />
            )}
          </React.Fragment>
      );
    });
  }
}

const mapStateToProps = store => ({
  store
});

export default connect(mapStateToProps)(MenuList);
