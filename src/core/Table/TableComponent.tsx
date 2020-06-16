import React from 'react';
import { makeStyles, withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { ICollapsibleTableProps, IRowProps, IHeaderProps, IDashboardModel, IDashboardSubModel } from '../../models/dashboard';
import { IDriverServiceTimeModel, IDriverServiceTimeSubModel } from '../../models/driverServiceTime';
import { isDashboard } from '../../containers/DashboardContainer';
import { isoToLocal } from '../../utils/date';
import { TablePagination, TableSortLabel } from '@material-ui/core';

const dateFormat = 'DD/MM/YYYY hh:mm:ss A';
const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: '#1976d2',
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

const Header = (props: IHeaderProps) => {
  const { headers, order, orderBy, onRequestSort } = props;

  const createSortHandler = (property: any) => (event: unknown) => {
    onRequestSort(event, property);
  };

  function sortingOrder(columnName: string){
    if(orderBy === columnName)
      return order;
    else
      return 'asc'
  };

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell />
        {
          headers.map((header, index) => <StyledTableCell key={index} align="left"><TableSortLabel active={orderBy === header.columnName}
          direction= {sortingOrder(header.columnName) == 'asc'? 'asc':'desc'} //{orderBy === header.columnName ? orderBy : 'asc'}
          onClick={createSortHandler(header.columnName)}>{header.columnValue}
              </TableSortLabel></StyledTableCell>)
        }
      </TableRow>
    </TableHead>
  );
};

const Row = (rowProps: IRowProps) => {
  const { data, driverCondition } = rowProps;
  let dashboardModel = data as IDashboardModel;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <StyledTableRow>
        <StyledTableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        </StyledTableCell>

        <StyledTableCell component="th" scope="row">{dashboardModel.DriverId}</StyledTableCell>
        <StyledTableCell align="left">{dashboardModel.DriverName}</StyledTableCell>
        <StyledTableCell align="left">{dashboardModel.DriverMobile}</StyledTableCell>
        <StyledTableCell align="left">{dashboardModel.VehicleName}</StyledTableCell>
        <StyledTableCell align="left">{dashboardModel.VehicleLicenseNo}</StyledTableCell>
        {
          driverCondition.includeOverSpeed && <StyledTableCell align="center">{dashboardModel.OverSpeed}</StyledTableCell>
        }
        {
          driverCondition.includeHarshBrake && <StyledTableCell align="center">{dashboardModel.HarshBreaking}</StyledTableCell>
        }
        {
          driverCondition.includeHarshTurn && <StyledTableCell align="center">{dashboardModel.HarshTurning}</StyledTableCell>
        }
      </StyledTableRow >
      <StyledTableRow >
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit={true}>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom={true} component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <StyledTableRow >
                    {
                      driverCondition.includeHarshBrake && <StyledTableCell align="center">Harsh Breaking</StyledTableCell>
                    }
                    {
                      driverCondition.includeHarshTurn && <StyledTableCell align="center">Harsh Turning</StyledTableCell>
                    }
                    {
                      driverCondition.includeOverSpeed && <StyledTableCell align="center">Vehicle Speed</StyledTableCell>
                    }
                    <StyledTableCell align="center">Packet Time</StyledTableCell>
                  </StyledTableRow >
                </TableHead>
                <TableBody>
                  {(dashboardModel.SubModel as Array<IDashboardSubModel>).map((subRow, index) => (
                    <StyledTableRow key={index}>
                      {
                        driverCondition.includeHarshBrake && <StyledTableCell align="center">{subRow.HarshBreaking}</StyledTableCell>
                      }
                      {
                        driverCondition.includeHarshTurn && <StyledTableCell align="center">{subRow.HarshTurning}</StyledTableCell>
                      }
                      {
                        driverCondition.includeOverSpeed && <StyledTableCell align="center">{subRow.VehicleSpeed}</StyledTableCell>
                      }
                      <StyledTableCell align="center">{isoToLocal(subRow.PacketTime, dateFormat)}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow >
    </>
  );
};

const SRow = (rowProps: IRowProps) => {
  const data = rowProps.data as IDriverServiceTimeModel;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <StyledTableRow className={classes.root}>
        <StyledTableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        </StyledTableCell>

        <StyledTableCell component="th" scope="row">
          {data.DriverId}
        </StyledTableCell>
        <StyledTableCell align="left">{data.DriverName}</StyledTableCell>
        <StyledTableCell align="left">{data.DriverMobile}</StyledTableCell>
        <StyledTableCell align="left">{data.VehicleName}</StyledTableCell>
        <StyledTableCell align="left">{data.VehicleLicenseNo}</StyledTableCell>
        <StyledTableCell align="left">{data.DrivingTimeHours}</StyledTableCell>
        <StyledTableCell align="left">{data.RestTimeHours}</StyledTableCell>
      </StyledTableRow>
      <StyledTableRow>
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit={true}>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom={true} component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell align="center">Resting StartTime</StyledTableCell>
                    <StyledTableCell align="center">Resting EndTime</StyledTableCell>
                    <StyledTableCell align="center">Vehicle StartTime</StyledTableCell>
                    <StyledTableCell align="center">Vehicle EndTime</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {
                    (data.SubModel as Array<IDriverServiceTimeSubModel>).map((subRow, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="center">{isoToLocal(subRow.RestingStartTime, dateFormat)}</StyledTableCell>
                        <StyledTableCell align="center">{isoToLocal(subRow.RestingEndTime, dateFormat)}</StyledTableCell>
                        <StyledTableCell align="center">{isoToLocal(subRow.VehicleStartTime, dateFormat)}</StyledTableCell>
                        <StyledTableCell align="center">{isoToLocal(subRow.VehicleEndTime, dateFormat)}</StyledTableCell>
                      </StyledTableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </React.Fragment>
  );
};

const CollapsibleTable = (props: ICollapsibleTableProps) => {
  const { driverCondition, headers, barData } = props;
  const classes = useRowStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('DriverId');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (event: unknown, property: any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  function getComparator(order: string, orderBy: string) {
    return order === 'desc'
      ? (a: any, b: any) => descendingComparator(a, b, orderBy)
      : (a: any, b: any) => -descendingComparator(a, b, orderBy);
  }
  
  function descendingComparator(a: any, b: any, orderBy: string) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function stableSort(array: any[], comparator: any) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a: any, b: any) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <Header headers={headers} onRequestSort={handleRequestSort} orderBy={orderBy} order={order} />
          <TableBody>
          {
              (isDashboard(props.data[0])) &&
              (stableSort(props.data as Array<IDashboardModel>, getComparator(order, orderBy)))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((driver: IDashboardModel, index: number): JSX.Element => {
                const rowProps = {
                  data: driver as IDashboardModel,
                  driverCondition,
                  barData
                } as IRowProps;
                return (<Row key={driver.DriverId} {...rowProps} />);
              })
            }
            {
              (!isDashboard(props.data[0])) &&
              (stableSort(props.data as  Array<IDriverServiceTimeModel>, getComparator(order, orderBy)))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((driverService: IDriverServiceTimeModel, index: number) => {
                const rowProps = {
                  data: driverService,
                  driverCondition
                } as IRowProps;
                return (<SRow key={driverService.DriverId} {...rowProps} />);
              })
            }       
            {
              props.data.length === 0 &&
              <StyledTableRow className={classes.root}>
                <StyledTableCell component="th" scope="row" style={{ textAlign: 'center' }} colSpan={10}>No Data Available</StyledTableCell>
              </StyledTableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
      {props.data.length > 0 &&
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={props.data.length}
          labelRowsPerPage="Records per page"
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      }
    </>
  );
};

export default CollapsibleTable;
