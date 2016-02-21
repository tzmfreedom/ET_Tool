import ET_Client from 'fuelsdk-node';
import Q from 'q';

export const SET_AUTHENTICATION_DIALOG_STATE = 'SET_AUTHENTICATION_DIALOG_STATE';
export const ET_LOGIN = 'ET_LOGIN';

export const SET_SELECTED_INDEX = 'SET_SELECTED_INDEX';

export const SET_COPY_DIALOG_STATE = 'SET_COPY_DIALOG_STATE';
export const SET_COPYFLOW_STATE = 'SET_COPYFLOW_STATE';
export const ET_COPY_REQUEST = 'ET_COPY_REQUEST';
export const ET_COPY_SUCCESSFUL = 'ET_COPY_SUCCESSFUL';
export const ET_FETCH_RESOURCE_REQUEST = 'ET_FETCH_RESOURCE_REQUEST';
export const ET_FETCH_RESOURCE_RESPONSE = 'ET_FETCH_RESOURCE_RESPONSE';

export const CHANGE_PROPERTY = 'CHANGE_PROPERTY';
export const ET_SHOW_RESULTS = 'ET_SHOW_RESULTS';
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';

function etCopyRequest() {
  return {
    type: ET_COPY_REQUEST,
  }
}
export function etCopy(client, clientId, clientSecret, stack, resources) {
  let dstClient = new ET_Client(clientId, clientSecret, stack);

  function fetchDataExtensionField(resource) {
    let d = Q.defer();
    let deColumn = client.dataExtensionColumn({
      props: [
        'ObjectID',
        'PartnerKey',
        'Name',
        'DefaultValue',
        'MaxLength',
        'IsRequired',
        'Ordinal',
        'IsPrimaryKey',
        'FieldType',
        'CreatedDate',
        'ModifiedDate',
        'Scale',
        'Client.ID',
        'CustomerKey'
      ]
      ,filter: {
        leftOperand: 'DataExtension.CustomerKey',
        operator: 'equals',
        rightOperand: resource.CustomerKey
      }
    });

    deColumn.get(function(err, response) {
      if (err) {
        d.reject(err);
      } else {
        d.resolve(response.body.Results);
      }
    });
    return d.promise;
  }

  function createDataExtensions(dataextension) {

    let d = Q.defer();
    let de = dstClient.dataExtension({
      props: dataextension
    });

    de.post(function(err,response) {
      if (err) {
        d.reject(err);
      } else {
        d.resolve(response.body.Results);
      }
    });
    return d.promise;
  }

  return (dispatch) => {
    dispatch(etCopyRequest());
    Q.all(resources.map(fetchDataExtensionField))
      .then((fields) => {
        let resourcesWithFields = resources.map((resource, index) => {
          resource.Fields = {Field: fields[index]};
          if (resource.SendableSubscriberField && resource.SendableSubscriberField.Name == '_SubscriberKey') {
            resource.SendableSubscriberField.Name = 'Subscriber Key';
          }
          return resource;
        });
        console.log(resourcesWithFields);
        //dispatch();
        return Q.all(resourcesWithFields.map(createDataExtensions))
      }).then((results) => {
        console.log(results);
        dispatch(etShowResults(results));
      }).fail((error) => {
        console.log(error);
        dispatch(etShowResults(error));
      });
  };
}

function etShowResults(results) {
  return {
    type: ET_SHOW_RESULTS,
    results,
  }
}

function etFetchResourceRequest() {
  return {
    type: ET_FETCH_RESOURCE_REQUEST,
  }
}

function etFetchResourceResponse(dataextensions) {
  return {
    type: ET_FETCH_RESOURCE_RESPONSE,
    dataextensions
  }
}

export function etFetchResource(client) {
  return (dispatch) => {
    dispatch(etFetchResourceRequest(client));
    let de = client.dataExtension({
      props: [
        'Name',
        'CustomerKey',
        'IsSendable',
        'SendableSubscriberField.Name',
        'SendableDataExtensionField.Name',
        'IsPlatformObject',
        'Description',
        'IsTestable',
        'RowBasedRetention',
        'RetainUntil',
        'ResetRetentionPeriodOnImport',
        'DeleteAtEndOfRetentionPeriod',
        'DataRetentionPeriodUnitOfMeasure',
        'DataRetentionPeriodLength',
      ]
    });

    de.get((err, response) => {
      if (err) {
        dispatch(etShowResults(err));
      } else {
        dispatch(etFetchResourceResponse(response.body.Results))
      }
    });
  }
}

export function etLogin(clientId, clientSecret, stack) {
  return {
    type: ET_LOGIN,
    clientId,
    clientSecret,
    stack,
  };
}

export function setAuthenticationDialogState(isDialogOpen) {
  return {
    type: SET_AUTHENTICATION_DIALOG_STATE,
    isDialogOpen,
  }
}

export function setSelectedIndex(selectedIndex) {
  return {
    type: SET_SELECTED_INDEX,
    selectedIndex,
  }
}

export function setCopyFlowState(state, props) {
  return {
    type: SET_COPYFLOW_STATE,
    state,
    clientId: props.clientId,
    clientSecret: props.clientSecret,
    stack: props.stack,
  }
}

export function setCopyToOtherDialogState(isDialogOpen) {
  return {
    type: SET_COPY_DIALOG_STATE,
    isDialogOpen
  }
}

export function clearMessage() {
  return {
    type: CLEAR_MESSAGE,
  };
}

export function changeProperty(name, value) {
  return {
    type: CHANGE_PROPERTY,
    name,
    value,
  }
}