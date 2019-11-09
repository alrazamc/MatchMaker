//insert cities

// const City = require('./models/City');
// const cities = require('./cities.json');
// console.log(cities.length);
// const ops = cities.map(item => ({
//   insertOne:{
//     document: {
//       id: parseInt(item.id),
//       title: item.name,
//       state_id: parseInt(item.state_id)
//     }
//   }
// }))
// City.collection.bulkWrite(ops, (res) => {
//   console.log("inserted");
// })

//insert states

// const State = require('./models/State');
// const states = require('./states.json');
// console.log(states.length);
// const ops = states.map(item => ({
//   insertOne:{
//     document: {
//       id: parseInt(item.id),
//       title: item.name,
//       country_id: parseInt(item.country_id)
//     }
//   }
// }))
// State.collection.bulkWrite(ops, (res) => {
//   console.log("inserted");
// })



//Height generation code

//const JWS = require('./system.json');
// const system = JWS[0].system;
//const SystemModel = require('./models/System');

// const  getHeight = (id, symbol, unit, value) => {
//   return {
//     id: id,
//     labelCm: '',
//     labelSymbol: symbol,
//     labelUnit: unit,
//     value: value 
//   }
// }
// const choices = [];
// choices.push(
//   getHeight(1, 'Less than 4\'', 'Less than 4ft', 1)
// )
// const ft = 4;
// const inch = 1;
// let id = 2;
// for(let ft=4; ft<=6; ft++)
// {
//   for(let inch=1; inch<=12; inch++)
//   {
//     if(inch === 12)
//       choices.push(
//         getHeight(id, (ft + 1) + '\'', (ft + 1)+'ft', id)
//       );
//     else
//       choices.push(
//         getHeight(id, `${ft}' ${inch}"`, `${ft}ft ${inch}in`, id)
//       ); 
//     id++;
//   }
// }
// choices.push(
//   getHeight(choices.length + 1, 'Greater than 7\'', 'Greater than 7ft', choices.length + 1)
// )
// console.log(choices);

// SystemModel.findOne({name : "height"}).then(result => {
//   result.choices = choices;
//   result.save().then(res => console.log("updated"));
//   //console.log();
// })
// console.log("Database connected")