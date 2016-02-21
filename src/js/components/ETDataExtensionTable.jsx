'use strict';

//import polyfill from 'babel/polyfill';
import React from 'react';
import Table from '../../../node_modules/material-ui/lib/table/table';
import TableBody from '../../../node_modules/material-ui/lib/table/table-body';
import TableFooter from '../../../node_modules/material-ui/lib/table/table-footer';
import TableHeader from '../../../node_modules/material-ui/lib/table/table-header';
import TableHeaderColumn from '../../../node_modules/material-ui/lib/table/table-header-column';
import TableRow from '../../../node_modules/material-ui/lib/table/table-row';
import TableRowColumn from '../../../node_modules/material-ui/lib/table/table-row-column';

export default class ETDataExtensionTable extends React.Component {

  constructor () {
    super();
  }

  renderDataExtensionRow() {
    let rowsView = [];
    this.props.dataextensions.map(function(dataextension, i){
      rowsView.push(
        <TableRow key={i} selected={this.props.selectedIndex.indexOf(i) != -1}>
          <TableRowColumn>{dataextension.Name}</TableRowColumn>
          <TableRowColumn>{dataextension.CustomerKey}</TableRowColumn>
        </TableRow>
      );
    }, this);
    return rowsView;
  }

  render() {
    return (
      <Table
        height={'300px'}
        fixedHeader={true}
        fixedFooter={true}
        selectable={true}
        multiSelectable={true}
        onRowSelection={this.props.onRowSelection}
        deselectOnClickaway={false}>
        <TableHeader enableSelectAll={false}>
          <TableRow>
            <TableHeaderColumn >Name</TableHeaderColumn>)
            <TableHeaderColumn >CustomerKey</TableHeaderColumn>)
          </TableRow>
        </TableHeader>
        <TableBody
          deselectOnClickaway={false}
          showRowHover={false}
          stripedRows={false}>
          {this.renderDataExtensionRow()}
        </TableBody>
      </Table>
    );
  }
}
