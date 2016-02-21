'use strict';

import React from 'react';
import {connect} from 'react-redux';

import TextField from '../../../node_modules/material-ui/lib/text-field';
import RaisedButton from '../../../node_modules/material-ui/lib/raised-button';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

@connect(state => ({
  deploy: state.deploy,
}))
export default class ETAuthentication extends React.Component {
  constructor () {
    super();
  }

  render() {
    return (
      <div>
        <TextField
          value={this.props.deploy.clientId}
          floatingLabelText="ClientID"
          onChange={this.props.onChangeClientID}
          errorText={this.props.deploy.error.clientId}
        /><br/>
        <TextField
          value={this.props.deploy.clientSecret}
          floatingLabelText="ClientSecret"
          type="password"
          onChange={this.props.onChangeClientSecret}
          errorText={this.props.deploy.error.clientSecret}
        /><br/>
        <SelectField
          value={this.props.deploy.stack}
          floatingLabelText="Stack"
          onChange={this.props.onChangeStack}
          errorText={this.props.deploy.error.stack}
        >
          <MenuItem value="s1" primaryText="s1"/>
          <MenuItem value="s4" primaryText="s4"/>
          <MenuItem value="s6" primaryText="s6"/>
          <MenuItem value="s7" primaryText="s7"/>
        </SelectField>
      </div>
    );
  }
}
