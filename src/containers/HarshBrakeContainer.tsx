import * as React from 'react';
import { connect, useSelector} from 'react-redux';
import { bindActionCreators } from 'redux';
import { IGroupedDashboard, IDriverCondition, ICollapsibleTableProps, IRangeFilterModelProps } from '../models/dashboard';
import HarshBrakeComponent from '../components/dashboard/HarshBrakeComponent';
import { groupBy } from '../utils/database';
import { getWithSubModel } from './DashboardContainer';
import { IHarshBrakeContainerProps, IHarshBrakeComponentProps, IHarshBrakeActionProps } from '../models/harshBrake';
import { IDatePickerProps } from '../models/datePicker';
import { useState, useEffect } from 'react';
import { loadHarshBrake } from '../actions/HarshBrakeActions';
import { sortBy } from '../utils/driver';
import { IBarComponentProps } from '../models/graph';
import { Driver } from '../constants/enum';

const HarshBrakeContainer = (props: IHarshBrakeContainerProps & IHarshBrakeActionProps) => {
        const rangeFilter = {
            rangeFilter: [
                { id: 0, displayText: 'Select Range', from: 0, to: 'Reset'},
                { id: 1, displayText: '0 - 10', from: 0, to: 10},
                { id: 2, displayText: '11 - 20', from: 11, to: 20},
                { id: 3, displayText: '21 - 30', from: 21, to: 30},
                { id: 4, displayText: '31 - 40', from: 31, to: 40},
                { id: 5, displayText: '41 - 50', from: 41, to: 50},
                { id: 5, displayText: '51 - 60', from: 21, to: 60},
                { id: 6, displayText: '61 - 70', from: 61, to: 70},
                { id: 6, displayText: '71 - 80', from: 71, to: 80},
                { id: 7, displayText: '81 - 90', from: 81, to: 90},
                { id: 8, displayText: '91 - 100', from: 91, to: 100},
                { id: 8, displayText: '101 - 110', from: 101, to: 110},
                { id: 8, displayText: '111 - 120', from: 111, to: 120},
          ],
          handleRangeFilterChange: onRangeChange,
        } as IRangeFilterModelProps;
    
        function onRangeChange(e: any) {
            if(e.target.value === 'Reset')
            {
                setRangeFilterApplied(false);
                onRangeFilterChange(120);
            }
            else
            {
                onRangeFilterChange(e.target.value);
                setRangeFilterApplied(true);
            }
        }
    const [harshBrakeLimit, onRangeFilterChange] = useState(200);
    const [rangeFilterApplied, setRangeFilterApplied] = useState(false);
    let fromharshBrakeLimit = 0;
    if(harshBrakeLimit !== 200)
    {
        fromharshBrakeLimit = harshBrakeLimit-9;
    }

    const groupedDataByDriverId = groupBy(props.harshBrake, 'DriverVehicleId') as IGroupedDashboard;
    const harshBrake = getWithSubModel(groupedDataByDriverId).filter(c => c.HarshBraking > 0 && ( c.HarshBraking >= (rangeFilterApplied? fromharshBrakeLimit:0) && c.HarshBraking <= harshBrakeLimit)).filter(c => c.SubModel = c.SubModel.filter(d => d.HarshBraking > 0));
    const harshBrakeWithLeastData = getWithSubModel(groupedDataByDriverId)
    const headers = [
        { columnName: 'DriverId', columnValue: 'Driver Id' },
        { columnName: 'DriverName', columnValue: 'Driver Name' },
        { columnName: 'DriverMobile', columnValue: 'Driver Mobile' },
        { columnName: 'VehicleName', columnValue: 'Vehicle Name' },
        { columnName: 'VehicleLicenseNo', columnValue: 'Vehicle License No' },
        { columnName: 'HarshBraking', columnValue: 'Harsh Brake Count' },
      ];

    const driverCondition = {
        includeHarshBrake: true,
        includeHarshTurn: false,
        includeOverSpeed: false
    } as IDriverCondition;

    const collapsibleTableProps = {
        data: harshBrake,
        headers: headers,
        driverCondition,
        rangeFilter: rangeFilter
    } as ICollapsibleTableProps;

    const datePickerFormat = 'dd/MM/yyyy';
    const dates = useSelector((store:any) => store.date) 
    const currentDateFromState = dates.currentDate
    const initialToDateFromState = dates.initialToDate;
    const minDate = new Date();
    const currentDate = new Date();
    minDate.setMonth(currentDate.getMonth() - 3);
    const [fromDate, setFromDate] = useState<Date | null>(initialToDateFromState);
    const [toDate, setToDate] = useState<Date | null>(currentDateFromState);
    
    const handleDateChange = (fromDate: Date | null, toDate: Date | null) => {
        if (toDate && fromDate) {
            setToDate(toDate);
            setFromDate(fromDate);
            props.loadData(fromDate, toDate);
        }
    };

    const datePickerProps = {
        datePickerDateFormat: datePickerFormat,
        datePickerMinDate: minDate,
        datePickerMaxDate: currentDate,
        datePickerFromDate: fromDate ? fromDate : initialToDateFromState,
        datePickerToDate: toDate ? toDate : currentDateFromState,
        handleDateChange: (fromDate: Date, toDate: Date) => handleDateChange(fromDate, toDate)
    } as IDatePickerProps;

    // const dashboardClone = JSON.parse(JSON.stringify(props.harshBrake)) as IDashboard[];
    // dashboardClone.forEach(c => c.PacketTime = isoToLocal(c.PacketTime, dateFormat));
    // const groupedDataByPacketTime = groupBy(dashboardClone, Driver.PacketTime) as IGroupedDashboard;
    // const barData = getBarData(groupedDataByPacketTime, fromDate, toDate, dateFormat, Driver.HarshBrake);

    const mostAppliedHarshBrake = {
        title: 'Top Most Applied',
        xaxisTitle: 'Driver Name',
        yaxisTitle: 'Harsh Brake Count',
        plot: sortBy(harshBrakeWithLeastData, Driver.HarshBrake, 'desc'),
        barColor: '#aec7e8'
    } as IBarComponentProps;

    const leastAppliedHarshBrake = {
        title: 'Top Least Applied',
        xaxisTitle: 'Driver Name',
        yaxisTitle: 'Top Harsh Brake Count',
        plot: sortBy(harshBrakeWithLeastData, Driver.HarshBrake),
        barColor: '#aec7e8'
    } as IBarComponentProps;

    const harshBrakeComponentProps = {
        leastAppliedDrivers: leastAppliedHarshBrake,
        mostAppliedDrivers: mostAppliedHarshBrake,
        tableData: collapsibleTableProps,
        datePicker: datePickerProps
    } as IHarshBrakeComponentProps;

    useEffect(
        () => {
            if (fromDate && toDate) {
                props.loadData(fromDate, toDate);
            }
        },
        [props.loadData]);

    return (
        <HarshBrakeComponent {...harshBrakeComponentProps} />
    );
};

const mapStateToProps = ({ harshBrake }: { harshBrake: IHarshBrakeContainerProps }) => {
    return {
        harshBrake: harshBrake.harshBrake
    };
};

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            loadData: (fromDate: Date, toDate: Date) => loadHarshBrake(fromDate, toDate),
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HarshBrakeContainer);
