'use strict';

//import polyfill from 'babel/polyfill';
import React from 'react';
import {connect} from 'react-redux';

import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';

import ETAuthenticationForm from './ETAuthentication';
import ETCopyConfirm from './ETCopyConfirm';
import {
  changeProperty,
  etLogin,
  etFetchResource,
  etCopy,
  setAuthenticationDialogState,
  setCopyToOtherDialogState,
  setSelectedIndex,
  setCopyFlowState,
  clearMessage,
} from '../actions/actions';

@connect(state => ({
  deploy: state.deploy,
}))
export default class ETDialog extends React.Component {

  constructor () {
    super();
  }

  authenticate() {
    this.props.dispatch(etLogin(this.props.deploy.clientId, this.props.deploy.clientSecret, this.props.deploy.stack));
  }

  onChangeProperty(name, event, index, value) {
    this.props.dispatch(changeProperty(name, value ? value : event.target.value));
  }

  backToAuthentication() {
    this.props.dispatch(setCopyFlowState('authenticate', this.props.deploy));
  }

  copyToOtherBU() {
    this.props.dispatch(etCopy(
      this.props.deploy.client,
      this.props.deploy.clientId,
      this.props.deploy.clientSecret,
      this.props.deploy.stack,
      this.props.filteredResources
    ));
  }

  closeAuthenticationDialog() {
    this.props.dispatch(setAuthenticationDialogState(false));
  }

  closeCopyDialog() {
    this.props.dispatch(setCopyToOtherDialogState(false));
  }


  goCopyConfirm() {
    this.props.dispatch(setCopyFlowState('confirm', this.props.deploy));
  }

  filteredSelectedResource() {
    return this.props.deploy.selectedIndex.map((index) => {
      return this.props.deploy.dataextensions[index];
    }, this)
  }

  get copyDialogProps() {
    return {
      'authenticate': {
        'title': 'Input your application credentials to copy DataExtensions',
        'back': {
          'label':'Cancel',
          'function': this.closeCopyDialog.bind(this),
        },
        'next': {
          'label': 'Next',
          'function': this.goCopyConfirm.bind(this),
        },
        'content': (
          <ETAuthenticationForm
            onChangeClientID={this.onChangeProperty.bind(this, 'clientId')}
            onChangeClientSecret={this.onChangeProperty.bind(this, 'clientSecret')}
            onChangeStack={this.onChangeProperty.bind(this, 'stack')}
          />
        ),
      },
      'confirm': {
        'title': 'Please check target DataExtensions',
        'back': {
          'label': 'Back',
          'function': this.backToAuthentication.bind(this),
        },
        'next': {
          'label': 'Finish',
          'function': this.copyToOtherBU.bind(this),
        },
        'content': (
          <ETCopyConfirm
            dataextensions = {
                      this.props.deploy.selectedIndex.map((index) => {
                        return this.props.deploy.dataextensions[index];
                      }, this)
                    }/>
        ),
      }
    };
  }

  render() {
    return (
      <div>
        <Dialog
          title="Input your application credentials to extract DataExtensions"
          actions={[
            <FlatButton
              label="Cancel"
              secondary={true}
              onClick={this.closeAuthenticationDialog.bind(this)}
            />,
            <FlatButton
              label='OK'
              primary={true}
              onClick={this.authenticate.bind(this)}
            />,
          ]}
          modal={true}
          open={this.props.deploy.isAuthenticationDialogOpen}
          autoScrollBodyContent={false}
          onRequestClose={this.closeAuthenticationDialog.bind(this)}>
          <ETAuthenticationForm
            onChangeClientID={this.onChangeProperty.bind(this, 'clientId')}
            onChangeClientSecret={this.onChangeProperty.bind(this, 'clientSecret')}
            onChangeStack={this.onChangeProperty.bind(this, 'stack')} />
        </Dialog>
        <Dialog
          title={this.copyDialogProps[this.props.deploy.copyFlowState].title}
          actions={[
            <FlatButton
              label={this.copyDialogProps[this.props.deploy.copyFlowState].back.label}
              secondary={true}
              onClick={this.copyDialogProps[this.props.deploy.copyFlowState].back.function}
            />,
            <FlatButton
              label={this.copyDialogProps[this.props.deploy.copyFlowState].next.label}
              primary={true}
              onClick={this.copyDialogProps[this.props.deploy.copyFlowState].next.function}
            />,
          ]}
          modal={true}
          open={this.props.deploy.isCopyDialogOpen}
          autoScrollBodyContent={false}
          onRequestClose={this.closeCopyDialog.bind(this)}>
          {this.copyDialogProps[this.props.deploy.copyFlowState].content}
        </Dialog>
        <Dialog
          title="Result"
          actions={[
            <FlatButton
              label="OK"
              primary={true}
              onClick={ ()=>{ this.props.dispatch(clearMessage()); }}
            />,
          ]}
          modal={true}
          open={this.props.deploy.results.length > 0}
          autoScrollBodyContent={false}
          onRequestClose={ ()=> { this.props.dispatch(clearMessage()); }} >
          <ul>
            {
              this.props.deploy.results.map((result, i) => {
                return <li key={i}>{result.Message ? result.Message : `[${result.StatusCode}] ${result.Object.Name}: ${result.StatusMessage}`}</li>;
              })
            }
          </ul>
        </Dialog>
      </div>
    );
  }
}
