({
	setpicklistval: function(component, event, helper) {
        console.log('BusinessFunctionval: coming here in helper'+component.get("v.VRBApproversPicklist"));
     var inputsel = component.find("Dec");
    var opts=[];
    var inputsel1 = component.find("BusinessFunc");
    var opts1=[];  
        
         console.log('before getting values '+(component.get("v.VRBApproversPicklist")===null ||$A.util.isEmpty(component.get("v.VRBApproversPicklist"))||$A.util.isUndefined(component.get("v.VRBApproversPicklist"))));
        if(!(component.get("v.VRBApproversPicklist")===null ||$A.util.isEmpty(component.get("v.VRBApproversPicklist"))||$A.util.isUndefined(component.get("v.VRBApproversPicklist"))))
         {    console.log('in getting values ');
            var mapvrbvals = component.get("v.VRBApproversPicklist");
        var BusinessFunctionval = mapvrbvals['BusinessFunction'];
         console.log('BusinessFunctionval: '+BusinessFunctionval);
        var Decisionval = mapvrbvals['Decision'];
         console.log('Decisionval: '+Decisionval);
        for(var i=0;i< BusinessFunctionval.length;i++){
            opts.push({"class": "optionClass", label: BusinessFunctionval[i], value: BusinessFunctionval[i]});
        }
       if(!$A.util.isUndefined(inputsel1))
             {
                 inputsel1.set("v.options", opts);
             }
         for(var i=0;i< Decisionval.length;i++){
            opts1.push({"class": "optionClass", label: Decisionval[i], value: Decisionval[i]});
        }
         if(!$A.util.isUndefined(inputsel))
             {
                  inputsel.set("v.options", opts1);
             }
       
        } 
},
    setEnableSecVal:function(component, event, helper){
       var mapBooleanvals = component.get("v.EnableApproverSection");
      /* component.set("v.subverticalLeaderExist",mapBooleanvals['subverticalLeaderExist']);
        component.set("v.accountOwnerFlag",mapBooleanvals['accountOwnerFlag']);
        component.set("v.accountOwnerNotClientExecutiveFlag",mapBooleanvals['accountOwnerNotClientExecutiveFlag']);
        component.set("v.accountOwnerClientExecutiveFlag",mapBooleanvals['accountOwnerClientExecutiveFlag']);
        component.set("v.subverticalLeaderNotExist",mapBooleanvals['subverticalLeaderNotExist']);
        component.set("v.vrbPendingApprovalFlag",mapBooleanvals['vrbPendingApprovalFlag']);*/
        component.set("v.largeDealEligibility",mapBooleanvals['largeDealEligibility']);
        console.log('largeDealEligibility: '+mapBooleanvals['largeDealEligibility']);
        
    },
    
   
})