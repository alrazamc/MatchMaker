import axios from 'axios';
export const actionTypes = {
  SYSTEM_VALUES_UPDATED: 'systemValuesUpdated'
}

export const loadSystemValues = (names = []) => {
  return (dispatch, getState) => {
    const namesToLoad = [];
    const system = getState().system;
    let systemValues = {}
    let inStorage = false;
    let refresh = localStorage && localStorage.getItem('systemV') ? false : true;
    names.forEach(itemName => {
      if(!system[itemName]) //not is store
      {
        if(localStorage && !refresh) // lookup in cache
        {
          let storageItem = localStorage.getItem(itemName);
          if(storageItem)
          {
            systemValues[itemName] = JSON.parse(storageItem);
            inStorage = true;
          }else
          {
            namesToLoad.push(itemName)
          }
        }else
        {
          namesToLoad.push(itemName)
        }
      }
    });
    if(inStorage)
      dispatch({ type: actionTypes.SYSTEM_VALUES_UPDATED, values: systemValues });
    if(!namesToLoad.length) return null;
    axios.post('/api/system', {names: namesToLoad}).then(({data}) => {
      if(localStorage)
        localStorage.setItem('systemV', data.version);
      const systemValues = {};
      data.results.forEach(item => {
        if(localStorage)
          localStorage.setItem(item.name, JSON.stringify(item)); // store in cache
        systemValues[item.name] = item
      });
      dispatch({
        type: actionTypes.SYSTEM_VALUES_UPDATED,
        values: systemValues
      });
    }).catch(err => {

    })
  }
}