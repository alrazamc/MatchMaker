export const systemSelector = (state, ordered = [], data=[]) => {
  const system = { data: {}};
  ordered.forEach(key => {
    system[key] = state.system && state.system[key] ? state.system[key].choices : []
  });
  data.forEach(key => {
    let choices = state.system && state.system[key] ? state.system[key].choices : [];
    system['data'][key] = {};
    choices.forEach(item => {
      system['data'][key][item.id] = item;
    });
  });
  return system;
}