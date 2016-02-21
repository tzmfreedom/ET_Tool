'use strict';

//import polyfill from 'babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {
  etLogin,
  etFetchResource,
  setAuthenticationDialogState,
  setCopyToOtherDialogState,
  setSelectedIndex,
  setCopyFlowState,
  clearMessage,
} from './actions/actions';

import ETDataExtensionTable from './components/ETDataExtensionTable';
import ETDialog from './components/ETDialog';

import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import CircularProgress from 'material-ui/lib/circular-progress';
import Divider from 'material-ui/lib/divider';
import Snackbar from 'material-ui/lib/snackbar';
import { Grid, Row, Col } from 'react-bootstrap';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

@connect(state => ({
  deploy: state.deploy,
}))
class App extends React.Component {

  constructor() {
    super();
  }


  openAuthenticationDialog() {
    this.props.dispatch(setAuthenticationDialogState(true, 'authenticate'));
  }

  openCopyToOtherDialog() {
    this.props.dispatch(setCopyToOtherDialogState(true));
  }

  filteredSelectedResource() {
    return this.props.deploy.selectedIndex.map((index) => {
      return this.props.deploy.dataextensions[index];
    }, this)
  }

  fetchDataExtension() {
    this.props.dispatch(etFetchResource(this.props.deploy.client));
  }

  setSelectedIndex(targets) {
    this.props.dispatch(setSelectedIndex(targets));
  }

  get styleForOverlay() {
    return {
      background: 'rgba(0, 0, 0, 0.2)',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 10,
      display: 'block'
    };
  }

  render() {
    return (
      <Grid>
        <Row className="m20">
          <Col md={12}>
            <RaisedButton
              label="Config"
              onClick={this.openAuthenticationDialog.bind(this)} />
            <RaisedButton
              label="Fetch DataExtension"
              style={{marginLeft:"20px"}}
              onClick={this.fetchDataExtension.bind(this)}
              disabled={!this.props.deploy.client} />
            <RaisedButton
              label="Copy To Other Org/BU"
              style={{marginLeft:"20px"}}
              onClick={this.openCopyToOtherDialog.bind(this)}
              disabled={this.filteredSelectedResource().length == 0} />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Divider />
          </Col>
        </Row>
        <Row className="m20">
          <Col md={12} mdOffset={this.props.deploy.isLoading ? 5 : 0}>
            {this.props.deploy.isLoading ?
              <div style={this.styleForOverlay}>
                <CircularProgress style={{top:'40%',left:'45%', zIndex: 11}}/>
              </div> : null }
            {this.props.deploy.isFetch && !(this.props.deploy.isLoading) ?
              <ETDataExtensionTable dataextensions={this.props.deploy.dataextensions}
                                    onRowSelection={this.setSelectedIndex.bind(this)}
                                    selectedIndex={this.props.deploy.selectedIndex}/> : null }
          </Col>
        </Row>
        <ETDialog filteredResources={this.filteredSelectedResource()}/>
      </Grid>
    );
  }
}

export default App;