const _ = require('eplodash');
const Base = require('./Base');

class Config extends Base {
  invitationLettersFiles = null;
  passportsFiles = null;
  eTicketsFiles = null;
  persons = null;
  flightsInfos = null;
  counterSproFiles= null;
  authLetterFiles= null;
  sludgeFiles= null;
  lastCargoName= null;
  parties= null;
  note= null;
  noteOneHundred= null;
  noteFifty= null;
  noteTwenty= null;
  noteTen= null;
  noteFive= null;
  noteTwo= null;
  noteOne= null;
  orderFiftyLessKg= null;
  orderOneHundredKg= null;
  orderTwoHundredKg= null;
  orderFiveHundredKg= null;
  orderFiveHundredMoreKg= null;
  permitFiles= null;
  supplyQuantity= null;
  articles= null;
  files= null;
  oldHealthCertificate= null;
  oldYellowCertificate= null;
  shipments= null;
  certifications= null;
  transferTime= null;
  amount= null;
  currency= null;
  empty= null;
  visitFiles= null;
  sechdule= null;
  destiation= null;
  isNeedIssueTicket= null;
  inviLetterDesc= null;
  isNeedInvitationLetter= null;
  visaFiles= null;
  seaManPaperFiles= null;
  idPhotos= null;
  shipCertificate= null;
  goodsFiles= null;
  shipmentsFiles= null;
  invoicesFiles= null;
  issueTicket= null;
  calibrationCertificateFiles= null;
  recordApplicationFiles= null;
  laboratoryCertificateFiles= null;
  priceFiles =null;
  sludgeQuantity=null;
  sludgeCertificateFiles=null;
  garbageCertificateFiles=null;
  magneticCompassModel=null;
  signingFiles=null;
  companyInfos=null;
  hasLumpsum = null;
  adviseAmount = null;
  note = null;
  inspectionFiles =null;
  feedbackFiles =null;
  agmCertificateFiles =null;
  portCallListFiles =null;
  nextPort =null;
  orders = null;
  orderId = null;
  ordersCount=null;
  receiptAdddress = null;
  hasChecked = null;
  visaExpiry = null;
  entriesNumber = null;
  longestStay = null;
  visaApplyPlace = null;
  entryDate = null;
  details = null;
  remark = null;
  invitationLetters = null;
  ticketServices = null;
  constructor() {
    super();
  }
}
Config.modelName = 'Config';
Config.fromJS = function(obj) {
  if (!obj) {
    return obj;
  }
  obj = this.domain.fromJS(obj);
  let Type = this;
  return new Type(obj, true);
}

module.exports = Config;
