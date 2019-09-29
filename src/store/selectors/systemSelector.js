export const systemSelector = (state, ordered = [], data=[]) => {
  const system = { data: {}};
  ordered.forEach(key => {
    system[key] = state.firestore.data['system'] && state.firestore.data['system'][key] ? state.firestore.data['system'][key].choices : []
  });
  data.forEach(key => {
    let choices = state.firestore.data['system'] && state.firestore.data['system'][key] ? state.firestore.data['system'][key].choices : [];
    system['data'][key] = {};
    choices.forEach(item => {
      system['data'][key][item.id] = item;
    });
  });
  return system;
}