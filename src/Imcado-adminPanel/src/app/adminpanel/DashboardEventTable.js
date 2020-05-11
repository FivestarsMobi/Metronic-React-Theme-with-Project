import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import * as builder from "../../_metronic/ducks/builder";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { CircularProgress } from "@material-ui/core";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  TextField,
  Switch
} from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

function createData(name, startDate, endDate, isPublic, SlideshowUri, index) {
  return { name, startDate, endDate, isPublic, SlideshowUri, index};
}

function stableSort(array, order, orderBy) {
  array.sort(function(a,b){
    if (order === 'asc'){
      if (orderBy === "name"){
        if(a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
        if(a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
        return 0;
      }
      if (orderBy === "startDate"){
        if(new Date(a.startDate) < new Date(b.startDate)) { return -1; }
        if(new Date(a.startDate) > new Date(b.startDate)) { return 1; }
        return 0;
      }
      if (orderBy === "endDate"){
        if(new Date(a.endDate) < new Date(b.endDate)) { return -1; }
        if(new Date(a.endDate) > new Date(b.endDate)) { return 1; }
        return 0;
      }
      if (orderBy === "isPublic"){
        if(a.isPublic < b.isPublic) { return -1; }
        if(a.isPublic > b.isPublic) { return 1; }
        return 0;
      }
    }
    else {
      if (orderBy === "name"){
        if(a.name.toLowerCase() < b.name.toLowerCase()) { return 1; }
        if(a.name.toLowerCase() > b.name.toLowerCase()) { return -1; }
        return 0;
      }
      if (orderBy === "startDate"){
        if(new Date(a.startDate) < new Date(b.startDate)) { return 1; }
        if(new Date(a.startDate) > new Date(b.startDate)) { return -1; }
        return 0;
      }
      if (orderBy === "endDate"){
        if(new Date(a.endDate) < new Date(b.endDate)) { return 1; }
        if(new Date(a.endDate) > new Date(b.endDate)) { return -1; }
        return 0;
      }
      if (orderBy === "isPublic"){
        if(a.isPublic < b.isPublic) { return 1; }
        if(a.isPublic > b.isPublic) { return -1; }
        return 0;
      }
    }
    return 0;
  });
  return array;
}

const headRows = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name', translate:'MENU.NAME' },
  { id: 'startDate', numeric: false, disablePadding: false, label: 'Start Date', translate:'MENU.START_DATE' },
  { id: 'endDate', numeric: false, disablePadding: false, label: 'End Date', translate:'MENU.END_DATE' },
  { id: 'isPublic', numeric: false, disablePadding: false, label: 'Public', translate:'MENU.PUBLIC' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions', translate:'MENU.ACTIONS' },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headRows.map(row => (
          <TableCell
            key={row.id}
            align={'center'}
            padding={row.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === row.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
            >
              <FormattedMessage id={row.translate}  defaultMessage={row.label} />
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  eventHandlerBtn:{
    textDecoration:'underline !important',
    border: '0px',
    background: 'none',
    paddingRight:'10px',
    "&:hover":{
      textDecoration:'underline !important',
      color:'#232bd1'
    }
  }
}));

function DashboardEventTable({store, dispatch}) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // edit event
  const [editdialogopen, setEditdialogopen] = React.useState(false);
  const [editdialogload, setEditdialogload] = React.useState({
    background: '#fff',
    pointerEvents: 'all',
    display:'none'
  });
  const [editindex, setEditindex] = React.useState(0);

  const getTodayDate = () => {
    let tempDate = new Date();
    let date = tempDate.getFullYear() + '-' + (tempDate.getMonth()+1) + '-' + tempDate.getDate();
    return date;
  }
  const getTomorrowDate = () => {
    let tempDate = new Date();
    let date = tempDate.getFullYear() + '-' + (tempDate.getMonth()+1) + '-' + ( tempDate.getDate() + 1 );
    return date;
  }
  const[eventname, setEventname] = React.useState("");
  const [startDate, setStartDate] = React.useState({getTodayDate:getTodayDate()});
  const [endDate, setEndDate] = React.useState({getTomorrowDate:getTomorrowDate()});
  const [isPublic, setIsPublic] = React.useState(true);

  //delete event
  const [deleteDlgOpen, setDeleteDlgOpen] = React.useState(false);

  



  const events = store.builder.dashboardConfig !== undefined && store.builder.dashboardConfig.events ? store.builder.dashboardConfig.events.Items : [];
  const rows = [];
  var openedEvents = [];
  if (events && events.length > 0){
    for (var i in events){
      var StartDateTime = ((new Date(events[i].StartDateTime)).getMonth()+1) + '-' + ((new Date(events[i].StartDateTime)).getDate()) + "-" +  ((new Date(events[i].StartDateTime)).getFullYear());
      var EndDateTime = ((new Date(events[i].EndDateTime)).getMonth()+1) + '-' + ((new Date(events[i].EndDateTime)).getDate()) + "-" +  ((new Date(events[i].EndDateTime)).getFullYear());
      var item = createData(events[i].Name, StartDateTime, EndDateTime, events[i].IsOpen, events[i].SlideshowUri , i);
      rows.push(item);
      openedEvents.push({isPublic : events[i].IsOpen});
    }
  }
  console.log(rows);
  
  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  
  async function isPublicCheckHandler(event, index) {
    var layoutConfig = store.builder.layoutConfig;
    layoutConfig.loadingCSS = {
      display : 'block',
      opacity:'0.5',
      pointerEvents:'none'
    };
    dispatch(builder.actions.setLayoutConfigs(layoutConfig));

    const response_event = await fetch(`https://dev.imcado.app/event/` + events[index].EventId,
    {
      method : 'PUT',
      mode: 'cors',
      headers:{
        'Content-Type': 'application/json',
        'x-zumo-auth' : store.auth.user.xZumoAuth
      },
      body: JSON.stringify({
        "IsOpen" : !events[index].IsOpen,
        "Name" : events[index].Name,
        "StartDateTime" : events[index].StartDateTime,
        "EndDateTime" : events[index].EndDateTime
       })
    });
    
    var response = await response_event;
    if (response.status === 202){
      var dashboardConfig = store.builder.dashboardConfig;
      dashboardConfig.events.Items[index].IsOpen = !dashboardConfig.events.Items[index].IsOpen;
      dispatch(builder.actions.setDashboardConfig(dashboardConfig));
      
      layoutConfig.loadingCSS = {
        display : 'none',
        opacity:'1',
        pointerEvents:'all'
      };
      dispatch(builder.actions.setLayoutConfigs(layoutConfig));
    }
  }
  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }

  function editclick(index){
    setEditindex(index);
    var item = store.builder.dashboardConfig.events.Items[index];
    setEventname(item.Name);
    setStartDate({
      getTodayDate:formatDateToString(item.StartDateTime)
    });
    setEndDate({
      getTomorrowDate :formatDateToString(item.EndDateTime)
    });
    setIsPublic(item.IsOpen);
    setEditdialogopen(true);
  }

  function formatDateToString(date){
    date = new Date(date);
    // 01, 02, 03, ... 29, 30, 31
    var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
    // 01, 02, 03, ... 10, 11, 12
    var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
    // 1970, 1971, ... 2015, 2016, ...
    var yyyy = date.getFullYear();
    // create the format you want
    return (yyyy + '-' + MM + '-' + dd);
 }

  const switchValueChangeHandler = () =>{
    setIsPublic(!isPublic);
  }

  const handleClose = () => {
    setEditdialogopen(false);
  };

  const newFindClosest = (data) => {
    var testDate = new Date();
    var after = [];
    var max = data.Items.length;
    for(var i = 0; i < max; i++) {
        var tar = data.Items[i].StartDateTime;
        var arrDate = new Date(tar);
        // 3600 * 24 * 1000 = calculating milliseconds to days, for clarity.
        var diff = (arrDate - testDate) / (3600 * 24 * 1000);
        if(diff > 0) {
          after.push({diff: diff, index: i});
        }
    }

    after.sort(function(a, b) {
        if(a.diff > b.diff) {
            return 1;
        }
        if(a.diff < b.diff) {
            return -1;
        }
        return 0;
    });
    return after[0].index;
  }

  const handleDelete = () => {
    setEditdialogload({
      background: '#ddd',
      pointerEvents: 'none',
      display:'block'
    });
    fetch(`https://dev.imcado.app/event/` + store.builder.dashboardConfig.events.Items[editindex].EventId + '/delete',
    {
      method : 'POST',
      mode: 'cors',
      headers:{
        'Content-Type': 'application/json',
        'x-zumo-auth' : store.auth.user.xZumoAuth
      }
    })
    .then(response =>{
      if (response.status === 202) return 'success';
      else return null;
    })
    .then(result =>{
      if (result === null){
        console.log("error");
        return;
      }
      else {
        fetch(`https://dev.imcado.app/events`,
          {
          method : 'GET',
          mode: 'cors',
          headers:{
            'Content-Type': 'application/json',
            'x-zumo-auth' : store.auth.user.xZumoAuth
          }
        })
        .then(response => response.json())
        .then(data=>{
          data.Items = data.Items.sort(function(a, b){
            return new Date(a.StartDateTime) - new Date(b.StartDateTime);
          });
          let _menuConfig = {
            header: {
              self: {},
              items: [
              ]
            },
            aside: {
              self: {},
              items: [
                {
                  title: "Dashboard",
                  root: true,
                  icon: "flaticon2-architecture-and-city",
                  page: "dashboard",
                  translate: "MENU.DASHBOARD",
                  bullet: "dot"
                },
                { section: "Events" }
              ]
            }
          };

          for (var i in data.Items){
            var item = {
              title: data.Items[i].Name,
              root: true,
              submenu: [
                {
                  title: "Details",
                  icon: "flaticon2-information",
                  page: "eventdetail/" + data.Items[i].EventId
                },
                {
                  title: "Participants",
                  icon: "flaticon-users",
                  page: "participantsdetail/" + data.Items[i].EventId
                },{
                  title: "Photos",
                  icon: "flaticon2-photograph",
                  page: "photosdetail/" + data.Items[i].EventId
                }
              ]
            }
            _menuConfig.aside.items.push(item);
          }
          dispatch(builder.actions.setMenuConfig(_menuConfig));
          var idx = newFindClosest(data);
          return {idx:idx, data:data};
        })
        .then(res => {
          fetch(`https://dev.imcado.app/event/` + res.data.Items[res.idx].EventId,
          {
            method : 'GET',
            mode: 'cors',
            headers:{
              'Content-Type': 'application/json',
              'x-zumo-auth' : store.auth.user.xZumoAuth
            }
          })
          .then(response => response.json())
          .then(res1 => {
            var nearData = res1;
            dispatch(builder.actions.setDashboardConfig({
              nearData : nearData,
              events : res.data
            }));
            setDeleteDlgOpen(false);
            setEditdialogload({
              background: '#fff',
              pointerEvents: 'all',
              display:'none'
            });
          })
        })
      }
    });
  }

  const handleDeleteClose = () => {
    setDeleteDlgOpen(false);
  }

  function deleteclick(index){
    var item = store.builder.dashboardConfig.events.Items[index];
    setEventname(item.Name);
    setEditindex(index);
    setDeleteDlgOpen(true);
  }

  const handleSave = () => {
    setEditdialogload({
      background: '#ddd',
      pointerEvents: 'none',
      display:'block'
    });
    
    fetch(`https://dev.imcado.app/event/` + store.builder.dashboardConfig.events.Items[editindex].EventId,
    {
      method : 'PUT',
      mode: 'cors',
      headers:{
        'Content-Type': 'application/json',
        'x-zumo-auth' : store.auth.user.xZumoAuth
      },
      body: JSON.stringify({
        "IsOpen" : isPublic,
        "Name" : eventname,
        "StartDateTime" : startDate.getTodayDate,
        "EndDateTime" : endDate.getTomorrowDate
       })
    })
    .then(response =>{
      if (response.status === 202) return response.json();
      else return null;
    })
    .then(result =>{
      if (result === null){
        console.log("error");
        return;
      }
      else {
        fetch(`https://dev.imcado.app/events`,
          {
          method : 'GET',
          mode: 'cors',
          headers:{
            'Content-Type': 'application/json',
            'x-zumo-auth' : store.auth.user.xZumoAuth
          }
        })
        .then(response => response.json())
        .then(data=>{
          data.Items = data.Items.sort(function(a, b){
            return new Date(a.StartDateTime) - new Date(b.StartDateTime);
          });
          let _menuConfig = {
            header: {
              self: {},
              items: [
              ]
            },
            aside: {
              self: {},
              items: [
                {
                  title: "Dashboard",
                  root: true,
                  icon: "flaticon2-architecture-and-city",
                  page: "dashboard",
                  translate: "MENU.DASHBOARD",
                  bullet: "dot"
                },
                { section: "Events" }
              ]
            }
          };

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
          }
          dispatch(builder.actions.setMenuConfig(_menuConfig));
          var idx = newFindClosest(data);
          return {idx:idx, data:data};
        })
        .then(res => {
          fetch(`https://dev.imcado.app/event/` + res.data.Items[res.idx].EventId,
          {
            method : 'GET',
            mode: 'cors',
            headers:{
              'Content-Type': 'application/json',
              'x-zumo-auth' : store.auth.user.xZumoAuth
            }
          })
          .then(response => response.json())
          .then(res1 => {
            var nearData = res1;
            dispatch(builder.actions.setDashboardConfig({
              nearData : nearData,
              events : res.data
            }));
            setEditdialogopen(false);
            setEditdialogload({
              background: '#fff',
              pointerEvents: 'all',
              display:'none'
            });
          })
        })
      }
    })
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={editdialogopen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div style={{background:editdialogload.background, pointerEvents:editdialogload.pointerEvents}}>
            <CircularProgress className="kt-splash-screen__spinner" style={{position: 'absolute','zIndex': '1','top': '45%','left': '48%', display:editdialogload.display}} />
            <DialogTitle id="alert-dialog-title">{"Add Event"}</DialogTitle>
            <DialogContent style={{"marginTop":"0px"}}>
            <TextField
                id="filled-name"
                label="New Event Name"
                margin="normal"
                style={{"marginTop":"0px"}}
                value={eventname}
                onChange={(e) => setEventname(e.target.value)}
              />
              <TextField
                id="startDate"
                label="Start Date"
                type="date"
                InputLabelProps={{
                  shrink: true
                }}
                style={{"width":"50%", "paddingRight":"10px"}}
                value={startDate.getTodayDate}
                onChange={(e) => setStartDate({getTodayDate:e.target.value})}
              />
              <TextField
                id="endDate"
                label="End Date"
                type="date"
                InputLabelProps={{
                  shrink: true
                }}
                style={{"width":"50%", "paddingLeft":"10px"}}
                value={endDate.getTomorrowDate}
                onChange={(e) => setEndDate({getTomorrowDate:e.target.value})}
              />
              <div style={{"marginTop":"10px"}}>
                Public:
                <Switch
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={switchValueChangeHandler}
                  value={isPublic}
                  checked={isPublic}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSave} color="primary" autoFocus>
                Save
              </Button>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </div>
      </Dialog>
      <Dialog
        open={deleteDlgOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div style={{background:editdialogload.background, pointerEvents:editdialogload.pointerEvents}}>
            <CircularProgress className="kt-splash-screen__spinner" style={{position: 'absolute','zIndex': '1','top': '45%','left': '48%', display:editdialogload.display}} />
            <DialogTitle id="alert-dialog-title">{"Add Event"}</DialogTitle>
            <DialogContent style={{"marginTop":"0px"}}>
              Do you want  to delete '{eventname}' event? All photos will be lost.
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDelete} color="primary">
                Yes
              </Button>
              <Button onClick={handleDeleteClose} color="primary" autoFocus>
                No
              </Button>
            </DialogActions>
        </div>
      </Dialog>
      <Paper className={classes.paper}>
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size='medium'
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, order, orderBy)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.index}
                    >
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.startDate}</TableCell>
                      <TableCell align="center">{row.endDate}</TableCell>
                      <TableCell padding="checkbox" align="center" >
                        <Checkbox style={{marginRight:"30px"}}
                          onClick={event => isPublicCheckHandler(event, row.index)}
                          inputProps={{ 'aria-labelledby': labelId }}
                          checked={store.builder.dashboardConfig && row.isPublic}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {
                          row.isPublic && <Link to={`/${row.SlideshowUri !== undefined ? row.SlideshowUri : "" }`} className={classes.eventHandlerBtn}>
                          Open Slideshow
                          </Link>
                        }
                        <button onClick={event => editclick(row.index)} className={classes.eventHandlerBtn}>
                          Download Photos
                        </button>
                        <button onClick={event => editclick(row.index)} className={classes.eventHandlerBtn}>
                        edit
                        </button>
                        <button onClick={event => deleteclick(row.index)} className={classes.eventHandlerBtn}>
                        delete
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

const mapStateToProps = store => ({
  store
});

export default connect(mapStateToProps)(DashboardEventTable);
