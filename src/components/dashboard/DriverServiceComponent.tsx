import * as React from 'react';
import { IDriverServiceTimeComponentProps } from '../../models/driverServiceTime';
import CollapsibleTable from '../../core/Table/TableComponent';
import DatePicker from '../../core/DatePicker';

const DriverServiceComponent = (props: IDriverServiceTimeComponentProps) => {
    const { tableData } = props;

    return (
        <>
            <DatePicker />
            <CollapsibleTable {...tableData} />
        </>
    );
};

export default DriverServiceComponent;