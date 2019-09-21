export const systemSelector = (state, options = []) => {
  const system = {};
  options.forEach(key => {
    let path = `system/${key}/options`;
    system[key] = state.firestore.ordered[path] ? state.firestore.ordered[path] : []
  });
  return system;
}