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

function createData(name, email, isOwner, index) {
  return { name, email, isOwner, index};
}

function stableSort(array, order, orderBy) {
  array.sort(function(a,b){
    if (order === 'asc'){
      if (orderBy === "name"){
        if(a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
        if(a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
        return 0;
      }
      if (orderBy === "email"){
        if(a.email.toLowerCase() < b.email.toLowerCase()) { return -1; }
        if(a.email.toLowerCase() > b.email.toLowerCase()) { return 1; }
        return 0;
      }
      if (orderBy === "isOwner"){
        if(a.isOwner < b.isOwner) { return -1; }
        if(a.isOwner > b.isOwner) { return 1; }
        return 0;
      }
    }
    else {
      if (orderBy === "name"){
        if(a.name.toLowerCase() < b.name.toLowerCase()) { return 1; }
        if(a.name.toLowerCase() > b.name.toLowerCase()) { return -1; }
        return 0;
      }
      if (orderBy === "email"){
        if(a.email.toLowerCase() < b.email.toLowerCase()) { return 1; }
        if(a.email.toLowerCase() > b.email.toLowerCase()) { return -1; }
        return 0;
      }
      if (orderBy === "isOwner"){
        if(a.isOwner < b.isOwner) { return 1; }
        if(a.isOwner > b.isOwner) { return -1; }
        return 0;
      }
    }
    return 0;
  });
  return array;
}

const headRows = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'isOwner', numeric: false, disablePadding: false, label: 'Owner' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
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
              {row.label}
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

function ParticipantsDetailTable({store, dispatch,items, newParticipantDlgOpen, newParticipantDlgHandler, eventId, refreshList}) {
  
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // edit event
  const [editdialogopen, setEditdialogopen] = React.useState(false);
  const [editdialogload, setEditdialogload] = React.useState({
    background: '#fff',
    pointerEvents: 'all',
    display:'none'
  });
  
  const [editindex, setEditindex] = React.useState(0);
  const [isOwner, setIsOwner] = React.useState(false);
  const [email, setEmail] = React.useState("");
  

  //delete event
  const [deleteDlgOpen, setDeleteDlgOpen] = React.useState(false);

  const events = items !== undefined ? items : [];
  const rows = [];
  if (events && events.length > 0){
    for (var i in events){
      var item = createData(events[i].Name, events[i].Email ,events[i].IsOwner,  i);
      rows.push(item);
    }
  }
  
  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  async function isOwnerCheckHandler(event, index) {
    var layoutConfig = store.builder.layoutConfig;
    layoutConfig.loadingCSS = {
      display : 'block',
      opacity:'0.5',
      pointerEvents:'none'
    };
    dispatch(builder.actions.setLayoutConfigs(layoutConfig));

    fetch(`https://dev.imcado.app/event/` + eventId + '/participant/' + items[index].Email,
    {
      method : 'PUT',
      mode: 'cors',
      headers:{
        'Content-Type': 'application/json',
        'x-zumo-auth' : store.auth.user.xZumoAuth
      },
      body: JSON.stringify({
        "IsOwner" : !items[index].IsOwner
       })
    })
    .then(response =>{
      if (response.status === 202) {
        setTimeout(function() {
          refreshList();
          setTimeout(() => {
            layoutConfig.loadingCSS = {
              display : 'none',
              opacity:'1',
              pointerEvents:'all'
            };
            dispatch(builder.actions.setLayoutConfigs(layoutConfig));
          }, 1000)
        }, 1500);
        
      }
      else return null;
    });
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }

  function editclick(index){
    setEditindex(index);
    var item = items[index];
    setEmail(item.Email);
    setIsOwner(item.IsOwner);
    setEditdialogopen(true);
  }

  const switchValueChangeHandler = () =>{
    setIsOwner(!isOwner);
  }

  const handleClose = () => {
    setEditdialogopen(false);
  };

  const handleDelete = async () => {
    console.log(items);
    console.log(items[editindex]);
    setEditdialogload({
      background: '#ddd',
      pointerEvents: 'none',
      display:'block'
    });
    fetch(`https://dev.imcado.app/event/` + eventId + '/participant/' + items[editindex].Email,
    {
      method : 'DELETE',
      mode: 'cors',
      headers:{
        'Content-Type': 'application/json',
        'x-zumo-auth' : store.auth.user.xZumoAuth
      }
    })
    .then(response =>{
      if (response.status === 202) {
        setTimeout(()=> {
          refreshList();
          setDeleteDlgOpen(false);
          setEditdialogload({
            background: '#fff',
            pointerEvents: 'all',
            display:'none'
          });
        }, 1000);
      }
      else return null;
    });
  }

  const handleDeleteClose = () => {
    setDeleteDlgOpen(false);
  }

  function deleteclick(index){
    setEditindex(index);
    setDeleteDlgOpen(true);
  }

  const handleNew = () => {
    setEmail(email.trim());
    if (email === ''){
      return;
    }
    var mailformat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(mailformat)){
      setEditdialogload({
        background: '#ddd',
        pointerEvents: 'none',
        display:'block'
      });
      fetch(`https://dev.imcado.app/event/` + eventId + '/participant/' + email,
      {
        method : 'PUT',
        mode: 'cors',
        headers:{
          'Content-Type': 'application/json',
          'x-zumo-auth' : store.auth.user.xZumoAuth
        },
        body: JSON.stringify({
          "IsOwner" : isOwner
         })
      })
      .then(response =>{
        if (response.status === 202) {
          setTimeout(function() {
            refreshList();
            newParticipantDlgHandler();
            setEditdialogload({
              background: '#fff',
              pointerEvents: 'all',
              display:'none'
            });
          }, 1000);
        }
        else return null;
      });
    }
    else {
      console.log('email validation error')
      return;
    }
  }

  const handleSave = async () => {
    setEditdialogload({
      background: '#ddd',
      pointerEvents: 'none',
      display:'block'
    });
    fetch(`https://dev.imcado.app/event/` + eventId + '/participant/' + email,
    {
      method : 'PUT',
      mode: 'cors',
      headers:{
        'Content-Type': 'application/json',
        'x-zumo-auth' : store.auth.user.xZumoAuth
      },
      body: JSON.stringify({
        "IsOwner" : isOwner
       })
    })
    .then(response =>{
      if (response.status === 202) {
        setTimeout(function() {
          refreshList();
          setEditdialogopen(false);
          setEditdialogload({
            background: '#fff',
            pointerEvents: 'all',
            display:'none'
          });
        }, 1000);
        
      }
      else return null;
    });
  };

  return (
    <div className='col-md-12'>
      <Dialog
        open={newParticipantDlgOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div style={{background:editdialogload.background, pointerEvents:editdialogload.pointerEvents, width:'400px'}}>
            <CircularProgress className="kt-splash-screen__spinner" style={{position: 'absolute','zIndex': '1','top': '45%','left': '48%', display:editdialogload.display}} />
            <DialogTitle id="alert-dialog-title">{"Add Participant"}</DialogTitle>
            <DialogContent style={{"marginTop":"0px"}}>
              <TextField
                label="Email"
                margin="normal"
                style={{"marginTop":"0px"}}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div style={{"marginTop":"10px"}}>
                Owner:
                <Switch
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={switchValueChangeHandler}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleNew} color="primary" autoFocus>
                Save
              </Button>
              <Button onClick={() => newParticipantDlgHandler()} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </div>
      </Dialog>

      <Dialog
        open={editdialogopen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div style={{background:editdialogload.background, pointerEvents:editdialogload.pointerEvents, width:'400px'}}>
            <CircularProgress className="kt-splash-screen__spinner" style={{position: 'absolute','zIndex': '1','top': '45%','left': '48%', display:editdialogload.display}} />
            <DialogTitle id="alert-dialog-title">{"Edit Participant"}</DialogTitle>
            <DialogContent style={{"marginTop":"0px"}}>
              <TextField
                label="Email"
                margin="normal"
                style={{"marginTop":"0px"}}
                value={email}
              />
              <div style={{"marginTop":"10px"}}>
                Owner:
                <Switch
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={switchValueChangeHandler}
                  value={isOwner}
                  checked={isOwner}
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
        <div style={{background:editdialogload.background, pointerEvents:editdialogload.pointerEvents, width:'400px'}}>
            <CircularProgress className="kt-splash-screen__spinner" style={{position: 'absolute','zIndex': '1','top': '45%','left': '48%', display:editdialogload.display}} />
            <DialogTitle id="alert-dialog-title">{"Delete Confirmation"}</DialogTitle>
            <DialogContent style={{"marginTop":"0px"}}>
              Do you want to remove '{email}' from the event? He will not be able to access photos.
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
                      <TableCell align="center">{row.email}</TableCell>
                      <TableCell padding="checkbox" align="center" >
                        <Checkbox style={{marginRight:"30px"}}
                          onClick={event => isOwnerCheckHandler(event, row.index)}
                          inputProps={{ 'aria-labelledby': labelId }}
                          checked={row.isOwner}
                        />
                      </TableCell>
                      <TableCell align="center">
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

export default connect(mapStateToProps)(ParticipantsDetailTable);
