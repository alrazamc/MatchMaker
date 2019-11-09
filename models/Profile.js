const mongoose = require('mongoose');

const basicInfoSchema = new mongoose.Schema({
  firstName:String,
  lastName: String,
  profileCreatedBy: Number,
  gender: Number,
  dateOfBirth: Date,
  maritalStatus: Number,
  height: Number,
  bodyType: Number,
  bodyWeight: Number,
  healthInfo: Number,
  healthInfoText: String,
  skinTone: Number,
  disability: Number,
  bloodGroup: Number
});

const religionCasteSchema = new mongoose.Schema({
  religion:Number,
  community: Number,
  motherTongue: Number,
  caste: String,
  namaaz: Number,
  zakaat: Number,
  fasting: Number
});

const familySchema = new mongoose.Schema({
  fatherStatus:Number,
  fatherCompanyName: String,
  fatherCompanyPosition: String,
  fatherBusinessNature: String,
  motherStatus: Number,
  motherCompanyName: String,
  motherCompanyPosition: String,
  motherBusinessNature: String,
  familyLocation: String,
  familyNativePlace: String,
  notMarriedBrothers: Number,
  marriedBrothers: Number,
  notMarriedSisters: Number,
  marriedSisters: Number,
  familyType: Number,
  familyValues: Number,
  familyAffluence: Number
});

const educationCareerSchema = new mongoose.Schema({
  educationLevel:Number,
  educationField: Number,
  college1: String,
  college2: String,
  workingWith: Number,
  employerName: String,
  workingAs: Number,
  annualIncome: Number,
  hideIncome: Boolean
});

const lifestyleSchema = new mongoose.Schema({
  diet:Number,
  drink: Number,
  smoke: Number
});
const locationSchema = new mongoose.Schema({
  country:Number,
  state: {
    id: Number,
    name: String
  },
  city: {
    id: Number,
    name: String
  },
  zipCode: String
});

const photosSchema = new mongoose.Schema({
  visibility:Number,
  profilePictureIndex: Number,
  images:[{
    fileName: String,
    approved: Boolean
  }]
});

const partnerPreferenceSchema = new mongoose.Schema({
  age: [Number],
  height: [Number],
  maritalStatus: mongoose.Schema.Types.Mixed,
  religion: mongoose.Schema.Types.Mixed,
  community: mongoose.Schema.Types.Mixed,
  motherTongue: mongoose.Schema.Types.Mixed,
  country: mongoose.Schema.Types.Mixed,
  state: mongoose.Schema.Types.Mixed,
  city: mongoose.Schema.Types.Mixed,
  educationLevel: mongoose.Schema.Types.Mixed,
  workingWith: mongoose.Schema.Types.Mixed,
  workingAs: mongoose.Schema.Types.Mixed,
  annualIncome: mongoose.Schema.Types.Mixed,
  noIncomeProfiles: Boolean,
  profileCreatedBy: mongoose.Schema.Types.Mixed,
  diet: mongoose.Schema.Types.Mixed
})

const searchSchema = new mongoose.Schema({
  searchType: String,
  searchName: String,
  age: [Number],
  height: [Number],
  maritalStatus: mongoose.Schema.Types.Mixed,
  religion: mongoose.Schema.Types.Mixed,
  community: mongoose.Schema.Types.Mixed,
  motherTongue: mongoose.Schema.Types.Mixed,
  country: mongoose.Schema.Types.Mixed,
  state: mongoose.Schema.Types.Mixed,
  city: mongoose.Schema.Types.Mixed,
  educationLevel: mongoose.Schema.Types.Mixed,
  educationField: mongoose.Schema.Types.Mixed,
  workingWith: mongoose.Schema.Types.Mixed,
  workingAs: mongoose.Schema.Types.Mixed,
  annualIncome: mongoose.Schema.Types.Mixed,
  noIncomeProfiles: Boolean,
  profileCreatedBy: mongoose.Schema.Types.Mixed,
  diet: mongoose.Schema.Types.Mixed,
  drink: mongoose.Schema.Types.Mixed,
  smoke: mongoose.Schema.Types.Mixed,
  bodyType: mongoose.Schema.Types.Mixed,
  skinTone: mongoose.Schema.Types.Mixed,
  visibility: mongoose.Schema.Types.Mixed,
  availableForChat: Boolean,
  notFilteredMe: Boolean,
  notViewedOnly: Boolean,
})

const peopleListSchema = {
  type: [mongoose.Schema.Types.ObjectId],
  default: []
};

const profileSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Profile userId is required"]
  },
  active:{
    type: Boolean,
    default: true
  },
  profileDescription: String,
  basicInfo: basicInfoSchema,
  religionCaste: religionCasteSchema,
  family: familySchema,
  educationCareer: educationCareerSchema,
  lifestyle: lifestyleSchema,
  location: locationSchema,
  partnerPreference: partnerPreferenceSchema,
  photos: photosSchema,
  searches: [searchSchema],
  shortlisted:peopleListSchema,
  filtered:peopleListSchema,
  blocked:peopleListSchema,
  viewed:peopleListSchema,
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  joinedOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('profiles', profileSchema);