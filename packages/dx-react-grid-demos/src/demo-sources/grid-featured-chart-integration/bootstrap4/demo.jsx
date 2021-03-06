import * as React from 'react';
import {
  RowDetailState,
  DataTypeProvider,
} from '@devexpress/dx-react-grid';
import {
  scaleBand,
} from '@devexpress/dx-chart-core';
import {
  ArgumentScale,
  Stack,
} from '@devexpress/dx-react-chart';
import {
  Chart,
  BarSeries,
  ArgumentAxis,
  ValueAxis,
  Legend,
} from '@devexpress/dx-react-chart-bootstrap4';
import {
  Grid, Table, TableBandHeader, TableHeaderRow,
  TableRowDetail,
} from '@devexpress/dx-react-grid-bootstrap4';
import { citiesCount, regionsCount } from '../../../demo-data/chart-data';

const currencyFormatter = ({ value }) => `$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
const AxisLabel = ({ text, ...restProps }) => (
  <ValueAxis.Label text={currencyFormatter({ value: text })} {...restProps} />
);

const CurrencyTypeProvider = props => (
  <DataTypeProvider
    {...props}
    formatterComponent={currencyFormatter}
  />
);

const LegendRoot = props => (
  <Legend.Root
    {...props}
    className="m-auto flex-row"
  />
);

const barSeriesForCity = regionCities => Object
  .keys(regionCities[0])
  .reduce((acc, item, index) => {
    if (item !== 'year') {
      acc.push(
        <BarSeries
          key={index.toString()}
          valueField={item}
          argumentField="year"
          name={item}
        />,
      );
    }
    return acc;
  }, []);

const gridDetailContainer = data => ({ row }) => {
  const regionCities = data.reduce((acc, item) => {
    const currentCities = item.cities.reduce((current, itemCity) => {
      let currentObj = {};
      if (itemCity.region === row.region) {
        currentObj = { [itemCity.cityName]: itemCity.count };
      }
      return { ...current, ...currentObj };
    }, []);
    return [...acc, { year: item.year, ...currentCities }];
  }, []);

  return (
    <div className="m-3">
      <h5>
        {`Economics of ${row.region}`}
      </h5>
      <div className="card pt-4">
        <Chart
          data={regionCities}
          height={300}
        >
          <ArgumentScale
            factory={scaleBand}
          />
          <ArgumentAxis
            showTicks={false}
          />
          <ValueAxis
            labelComponent={AxisLabel}
          />
          {barSeriesForCity(regionCities)}
          <Stack />
          <Legend
            rootComponent={LegendRoot}
            position="bottom"
          />
        </Chart>
      </div>
    </div>
  );
};

export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'region', title: 'Region' },
        { name: 'count2013', title: '2013' },
        { name: 'count2014', title: '2014' },
        { name: 'count2015', title: '2015' },
      ],
      rows: regionsCount,
      data: citiesCount,
      columnBands: [
        {
          title: 'Year',
          children: [
            { columnName: 'count2013' },
            { columnName: 'count2014' },
            { columnName: 'count2015' },
          ],
        },
      ],
      currencyColumns: ['count2013', 'count2014', 'count2015'],
    };
  }

  render() {
    const {
      columns, columnBands, currencyColumns, rows, data,
    } = this.state;
    return (

      <div className="card">
        <Grid
          rows={rows}
          columns={columns}
        >
          <CurrencyTypeProvider
            for={currencyColumns}
          />
          <RowDetailState
            defaultExpandedRowIds={[1]}
          />
          <Table />
          <TableHeaderRow />
          <TableRowDetail
            contentComponent={gridDetailContainer(data)}
          />
          <TableBandHeader
            columnBands={columnBands}
          />
        </Grid>
      </div>
    );
  }
}
