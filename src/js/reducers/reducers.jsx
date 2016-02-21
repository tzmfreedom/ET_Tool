import ET_Client from 'fuelsdk-node';
import * as Actions from './../actions/actions';

export default function ETApp(state = {}, action) {
  switch (action.type) {
    case Actions.CHANGE_PROPERTY:
    case Actions.ET_SHOW_RESULTS:
    case Actions.ET_FETCH_RESOURCE_REQUEST:
    case Actions.ET_FETCH_RESOURCE_RESPONSE:
    case Actions.ET_COPY_REQUEST:
    case Actions.SET_AUTHENTICATION_DIALOG_STATE:
    case Actions.SET_COPY_DIALOG_STATE:
    case Actions.SET_SELECTED_INDEX:
    case Actions.ET_COPY_SUCCESSFUL:
    case Actions.CLEAR_MESSAGE:
      return Object.assign({}, state, {
        deploy: ETDeploy(state.deploy, action)
      });
    default:
      return Object.assign({}, state, {
        deploy: ETDeploy(state.deploy, action)
      });
  }
}

function ETDeploy(state = {
  clientId: '',
  clientSecret: '',
  dstClient: {},
  stack: '',
  error: getClearErrorState(),
  results: [],
  isFetch: false,
  isAuthenticationDialogOpen: false,
  isCopyDialogOpen: false,
  isLoading: false,
  dataextensions: [],
  selectedIndex: [],
  copyFlowState: 'authenticate',
}, action) {
  let error = getClearErrorState();
  switch(action.type) {
    case Actions.CHANGE_PROPERTY:
      return Object.assign({}, state, {
        [action.name]: action.value
      });
    case Actions.ET_LOGIN:
      error = validateAuthentication(action);
      if (error.clientId != '' || error.clientSecret != '' || error.stack != '') {
        return Object.assign({}, state, {
          error,
        });
      }
      let client = new ET_Client(action.clientId, action.clientSecret, action.stack);
      return Object.assign({}, state, {
        client,
        error,
        isAuthenticationDialogOpen: false,
      });
    case Actions.ET_SHOW_RESULTS:
      let results = [];
      if (action.results.res) {
        results = [{
          Message: action.results.res.message,
        }];
      } else if (action.results.results) {
        results = action.results.results;
      } else {
        results = action.results;
      }
      return Object.assign({}, state, {
        results,
        isLoading: false,
      });
    case Actions.SET_AUTHENTICATION_DIALOG_STATE:
      return Object.assign({}, state, {
        isAuthenticationDialogOpen: action.isDialogOpen,
        stack: '',
        error,
      });
    case Actions.SET_SELECTED_INDEX:
      return Object.assign({}, state, {
        selectedIndex: action.selectedIndex
      });
    case Actions.SET_COPY_DIALOG_STATE:
      return Object.assign({}, state, {
        copyFlowState: 'authenticate',
        isCopyDialogOpen: action.isDialogOpen,
        clientId: '',
        clientSecret: '',
        stack: '',
        error,
      });
    case Actions.SET_COPYFLOW_STATE:
      if (action.state == 'confirm') {
        error = validateAuthentication(action);
        if (error.clientId != '' || error.clientSecret != '' || error.stack != '') {
          return Object.assign({}, state, {
            error,
          });
        }
      }
      return Object.assign({}, state, {
        copyFlowState: action.state,
        error,
      });
    case Actions.ET_FETCH_RESOURCE_REQUEST:
      return Object.assign({}, state, {
        isLoading: true,
        dataextensions: [],
        selectedIndex: [],
      });
    case Actions.ET_FETCH_RESOURCE_RESPONSE:
      return Object.assign({}, state, {
        dataextensions: action.dataextensions,
        isFetch: true,
        isLoading: false,
      });
    case Actions.ET_COPY_REQUEST:
      return Object.assign({}, state, {
        isLoading: true,
        isCopyDialogOpen: false,
      });
    case Actions.ET_COPY_RESPONSE:
      return Object.assign({}, state, {
        dataextensions: action.dataextensions,
        isFetch: true,
        isLoading: false,
      });
    case Actions.ET_COPY_SUCCESSFUL:
      return Object.assign({}, state, {
        results: action.results,
        isLoading: false,
      });

    case Actions.CLEAR_MESSAGE:
      return Object.assign({}, state, {
        results: [],
      });

    default:
      return state;
  }
}

function validateAuthentication(action) {
  let error = getClearErrorState();
  if (action.clientId == '') {
    error.clientId = 'ClientID is required';
  }
  if (action.clientSecret == '') {
    error.clientSecret = 'ClientSecret is required';
  }
  if (action.stack == '') {
    error.stack = 'Stack is required';
  }
  return error;
}

function getClearErrorState() {
  return {
    messages: [],
    clientId: '',
    clientSecret: '',
    stack: '',
  }
}