import dayjs from 'dayjs';
import { systemSelector } from './systemSelector';

export const profileBasicInfoSelector = (state) => {
  const basicInfo = {};
  if(!state.profile || !state.profile.basicInfo) return basicInfo;
  const keys = ['profileCreatedBy', 'gender', 'maritalStatus', 'height', 'healthInfo', 'bodyType', 'skinTone', 'disability', 'bloodGroup'];
  const { data } = systemSelector(state, [], keys);
  const info = state.profile.basicInfo;
  keys.forEach(key => {
    if(data[key][info[key]]) //data['bodyType'][info.bodyType]
    basicInfo[key] = data[key][info[key]]['title']; //basicInfo.bodyType = data['bodyType'][info.bodyType]['title']
  });
  
  if(data['height'][info.height])
    basicInfo.height = data['height'][info.height]['labelUnit'];
  basicInfo.dateOfBirth = info.dateOfBirth;
  basicInfo.bodyWeight = info.bodyWeight;
  if(basicInfo.dateOfBirth)
  {
    let date = dayjs(basicInfo.dateOfBirth);
    basicInfo.dateOfBirth = date.format("DD MMM, YYYY");
  }
  basicInfo.healthInfo = basicInfo.healthInfo === 'Other' ? info.healthInfoText: basicInfo.healthInfo;
  basicInfo.firstName = info.firstName;
  basicInfo.lastName = info.lastName;
  return basicInfo;
}

export const profileLifestyleSelector = (state) => {
  const lifestyle = {};
  if(!state.profile || !state.profile.lifestyle) return lifestyle;
  const keys = ['diet', 'drink', 'smoke'];
  const { data } = systemSelector(state, [], keys);
  const info = state.profile.lifestyle;
  keys.forEach(key => {
    if(data[key][info[key]]) //data['diet'][info.diet]
    lifestyle[key] = data[key][info[key]]['title']; //lifestyle.diet = data['diet'][info.diet]['title']
  });
  return lifestyle;
}

export const profileReligionCasteSelector = (state) => {
  const religionCaste = {};
  if(!state.profile || !state.profile.religionCaste) return religionCaste;
  const keys = ['religions', 'communities', 'languages', 'namaaz', 'yesNo'];
  const { data } = systemSelector(state, [], keys);
  const info = state.profile.religionCaste;
  if(data['religions'][info.religion])
    religionCaste.religion = data['religions'][info.religion]['title'];
  if(data['communities'][info.community])
    religionCaste.community = data['communities'][info.community]['title'];
  if(data['languages'][info.motherTongue])
    religionCaste.motherTongue = data['languages'][info.motherTongue]['title'];
  religionCaste.caste = info.caste;
  if(data['namaaz'][info.namaaz])
    religionCaste.namaaz = data['namaaz'][info.namaaz]['title'];
  if(data['yesNo'][info.zakaat])
    religionCaste.zakaat = data['yesNo'][info.zakaat]['title'];
  if(data['yesNo'][info.fasting])
    religionCaste.fasting = data['yesNo'][info.fasting]['title'];
  return religionCaste;
}

export const profileFamilyInfoSelector = (state) => {
  let family = {};
  if(!state.profile || !state.profile.family) return family;
  const info = state.profile.family;
    family = {...info};
  const keys = ['fatherStatus', 'motherStatus', 'familyType', 'familyValues', 'familyAffluence'];
  const { data } = systemSelector(state, [], keys);
  keys.forEach(key => {
    if(data[key][info[key]]) //data['fatherStatus'][info.fatherStatus]
    family[key] = data[key][info[key]]['title']; //family.fatherStatus = data['fatherStatus'][info.fatherStatus]['title']
  });
  return family;
}

export const profileEducationCareerSelector = (state) => {
  let educationCareer = {};
  if(!state.profile || !state.profile.educationCareer) return educationCareer;
  const info = state.profile.educationCareer;
    educationCareer = {...info};
  const keys = ['educationLevel', 'educationField', 'workingWith', 'occupations', 'annualIncome'];
  const { data } = systemSelector(state, [], keys);
  keys.forEach(key => {
    if(data[key][info[key]]) //data['educationLevel'][info.educationLevel]
    educationCareer[key] = data[key][info[key]]['title']; //educationCareer.educationLevel = data['educationLevel'][info.educationLevel]['title']
  });
  if(data['occupations'][info.workingAs])
    educationCareer.workingAs = data['occupations'][info.workingAs]['title'];
  return educationCareer;
}

export const profileLocationSelector = (state) => {
  let location = {};
  if(!state.profile || !state.profile.location) return location;
  const info = state.profile.location;
    location = {...info};
  const keys = ['countries'];
  const { data } = systemSelector(state, [], keys);
  if(data['countries'][info.country])
    location.country = data['countries'][info.country]['title'];
  return location;
}

export const profileSelector = (state, profileId) => {
  if(!state.connections) return null;
  return state.connections[profileId] ? state.connections[profileId] : null;
}