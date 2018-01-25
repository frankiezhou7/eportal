module.exports = {
  getShipRestrictions: function(restrictions){
    let datas ={};
    datas.deadWeight = restrictions.maxDWT;
    datas.loa = restrictions.maxLOA;
    datas.beam = restrictions.maxBeam;
    datas.airDraft = restrictions.maxAirDraft;
    datas.berthDraft = restrictions.berthDraft;
    datas.channelDraft = restrictions.channelDraft;
    datas.maxArriveDraft = restrictions.maxArriveDraft;
    return datas;
  },
}
