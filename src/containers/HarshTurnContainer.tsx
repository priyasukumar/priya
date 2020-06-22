import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IGroupedDashboard, IDriverCondition, ICollapsibleTableProps } from '../models/dashboard';
import { groupBy } from '../utils/database';
import { getWithSubModel } from './DashboardContainer';
import { IHarshTurnContainerProps, IHarshTurnComponentProps, IHarshTurnActionProps } from '../models/harshTurn';
import HarshTurnComponent from '../components/dashboard/HarshTurnComponent';
import { IDatePickerProps } from '../models/datePicker';
import { useState, useEffect } from 'react';
import { loadHarshTurn } from '../actions/HarshTurnActions';
import { sortBy } from '../utils/driver';
import { Driver } from '../constants/enum';
import { IBarComponentProps } from '../models/graph';

const HarshTurnContainer = (props: IHarshTurnContainerProps & IHarshTurnActionProps) => {
    const groupedDataByDriverId = groupBy(props.harshTurn, 'DriverVehicleId') as IGroupedDashboard;
    const harshTurn = getWithSubModel(groupedDataByDriverId).filter(c => c.HarshTurning > 0).filter(c => c.SubModel = c.SubModel.filter(d => d.HarshTurning > 0));
    const headers = [
        { columnName: 'DriverId', columnValue: 'Driver Id' },
        { columnName: 'DriverName', columnValue: 'Driver Name' },
        { columnName: 'DriverMobile', columnValue: 'Driver Mobile' },
        { columnName: 'VehicleName', columnValue: 'Vehicle Name' },
        { columnName: 'VehicleLicenseNo', columnValue: 'Vehicle License No' },
        { columnName: 'HarshTurning', columnValue: 'Harsh Turn Count' },
      ];
 
    const driverCondition = {
        includeHarshBrake: false,
        includeHarshTurn: true,
        includeOverSpeed: false
    } as IDriverCondition;

    const collapsibleTableProps = {
        data: harshTurn,
        headers: headers,
        driverCondition
    } as ICollapsibleTableProps;

    const datePickerFormat = 'dd/MM/yyyy';
    const currentDate = new Date();
    const initialToDate = new Date();
    initialToDate.setDate(initialToDate.getDate() - 10);
    const minDate = new Date();
    minDate.setMonth(currentDate.getMonth() - 3);
    const [fromDate, setFromDate] = useState<Date | null>(initialToDate);
    const [toDate, setToDate] = useState<Date | null>(currentDate);
    const handleFromDateChange = (date: Date | null) => {
        if (date && toDate) {
            setFromDate(date);
            props.loadData(date, toDate);
        }
    };
    const handleToDateChange = (date: Date | null) => {
        if (date && fromDate) {
            setToDate(date);
            props.loadData(fromDate, date);
        }
    };

    const datePickerProps = {
        datePickerDateFormat: datePickerFormat,
        datePickerMinDate: minDate,
        datePickerMaxDate: currentDate,
        datePickerFromDate: fromDate ? fromDate : initialToDate,
        datePickerToDate: toDate ? toDate : currentDate,
        handleFromDateChange: (date: Date) => handleFromDateChange(date),
        handleToDateChange: (date: Date) => handleToDateChange(date)
    } as IDatePickerProps;

    // const dashboardClone = JSON.parse(JSON.stringify(props.harshTurn)) as IDashboard[];
    // dashboardClone.forEach(c => c.PacketTime = isoToLocal(c.PacketTime, dateFormat));
    // const groupedDataByPacketTime = groupBy(dashboardClone, Driver.PacketTime) as IGroupedDashboard;
    // const barData = getBarData(groupedDataByPacketTime, fromDate, toDate, dateFormat, Driver.HarshBrake);
    
    const mostAppliedHarshTurn = {
        title: 'Top Most Applied',
        yaxisTitle: 'Harsh Turn Count',
        plot: sortBy(harshTurn, Driver.HarshTurn, 'desc'),
        barColor: '#1f77b4'
    } as IBarComponentProps;

    const leastAppliedHarshTurn = {
        title: 'Top Least Applied',
        yaxisTitle: 'Harsh Turn Count',
        plot: sortBy(harshTurn, Driver.HarshTurn),
        barColor: '#1f77b4'
    } as IBarComponentProps;

    const harshTurnComponentProps = {
        leastAppliedDrivers: leastAppliedHarshTurn,
        mostAppliedDrivers: mostAppliedHarshTurn,
        tableData: collapsibleTableProps,
        datePicker: datePickerProps
    } as IHarshTurnComponentProps;

    useEffect(
        () => {
            if (fromDate && toDate) {
                props.loadData(fromDate, toDate);
            }
        },
        [props.loadData]);

    return (
        <HarshTurnComponent {...harshTurnComponentProps} />
    );
};

const mapStateToProps = ({ harshTurn }: { harshTurn: IHarshTurnContainerProps }) => {
    return {
        harshTurn: harshTurn.harshTurn
    };
};

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            loadData: (fromDate: Date, toDate: Date) => loadHarshTurn(fromDate, toDate),
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HarshTurnContainer);
