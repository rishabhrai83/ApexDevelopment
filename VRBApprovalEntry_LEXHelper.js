({
	 createObjectData: function(component, event) {
        // get the VRBApproverList from component and add(push) New Object to List  
        var RowItemList = component.get("v.VRBApproverList");
         console.log('in createObjectData');
       RowItemList.push({
            'sobjectType': 'VRB_Approvers__c',
            'ApproverName__c': '',
            'BusinessFunction__c': '',
            'Comments__c': '',
            'Decision__c': ''
       });
        // set the updated list to attribute (VRBApproverList) again    
        component.set("v.VRBApproverList", RowItemList);
    },
    
     createVRBApproversInstance: function(component, event,Subvertical,userdata,vrbDecision,userid,username) {
        // get the contactList from component and add(push) New Object to List  
        var RowItemList = component.get("v.VRBApprovers");
         console.log('RowItemList userdata '+userdata);
         console.log('RowItemList Subvertical '+Subvertical);
         console.log('RowItemList vrbDecision '+vrbDecision);
        console.log('RowItemList userid '+userid);
       if(Subvertical===null && userdata===null && vrbDecision===null)
       { 
          console.log('VRBApproversInstance '+RowItemList.VRB_Approvers__c);       
       }
         else{
             if(username!=null){
                 component.set("v.ApproverName", username);
             }
             if(vrbDecision!=null)
             { 
           
             RowItemList.ApproverName__c = userid;
              RowItemList.BusinessFunction__c= userdata;
                 RowItemList.Comments__c= '';
                 RowItemList.Decision__c= vrbDecision;
                 
         }
             else
              { console.log('RowItemList UserFunction__c '+userdata);
               console.log('RowItemList userdata '+userid);
               RowItemList.ApproverName__c = userid;
               RowItemList.BusinessFunction__c= userdata;
                 RowItemList.Comments__c= '';
                 RowItemList.Decision__c= '';
         }    
         if(Subvertical!=null)
             { 
           
                 RowItemList.ApproverName__c = userid;
                RowItemList.BusinessFunction__c= Subvertical;
                 RowItemList.Comments__c= '';
                 RowItemList.Decision__c= '';   
             }   
        // set the updated list to attribute (VRBApproverList) again    
        component.set("v.VRBApprovers", RowItemList);
        console.log('RowItemList VRBApproversInstance '+component.get("v.VRBApproversInstance.ApproverName__c"));
         } 
    },
    
    
    // helper function for check if first Name is not null/blank on save  
    validateRequired: function(component, event) {
        console.log('in Validate')
        var isValid = true;
        var newlst =[];
        var indexval = [];
        var allContactRows = component.get("v.VRBApproverList");
        for (var indexVar = 0; indexVar < allContactRows.length; indexVar++) {
          var  BusinessFuncNull = true;
            if (allContactRows[indexVar].ApproverName__c == '') {
                isValid = false;
                component.set("v.hasErrors", true);
                newlst.push("Approver Name: You must enter a value");
                
            }
            if (allContactRows[indexVar].BusinessFunction__c == '--None--') {
                isValid = false;
                BusinessFuncNull = false;
               	component.set("v.hasErrors", true);
                newlst.push("Business Function: You must enter a value ");
				
            }
            if(BusinessFuncNull == false)
              {indexval.push({value:indexVar})}
        }
         if(indexval.length >0)
             { 
                var applicationEvent = $A.get("e.c:addDynamicErrorEvt").setParams({"indexVar" : indexval });
                applicationEvent.fire();
             }
        if((component.get("v.vrbPendingApprovalLargeDeal")===false && component.get("v.largeDealEligibility")===true))
        {
            var Vrbgateval = component.find('VRBGate');
            var VrbLevelval = component.find('VRBLevel');
            var VRBApprovalObj = component.get("v.VRBApproval");   
         if(component.find('VRBGate').get('v.value') === "--None--")
            {  var err = 'VRB Gate: You must enter a value';
               component.set("v.hasErrors", true);
               Vrbgateval.set("v.errors", [{message:'You must enter a value'}]);
               newlst.push(err);
              
			   isValid = false;
            }
            else
              {
                  Vrbgateval.set("v.errors", null); 
              }
             if(component.find('VRBLevel').get('v.value') === "--None--")
            {  var err = 'VRB Level: You must enter a value';
               component.set("v.hasErrors", true);
               VrbLevelval.set("v.errors", [{message:'You must enter a value'}]);
               newlst.push(err);
              
			   isValid = false;
            }
            else
              {
                  VrbLevelval.set("v.errors", null); 
              }
        }
         component.set("v.errormsg",newlst);
        return isValid;
    },
  getvrbpicklistvals : function(component) {
    var action = component.get("c.getVRBpicklistval");
     var checkboxmap =  component.get("v.VRBApproversPicklist");
         console.log('action: '+action);
         action.setCallback(this, function(a) {
        var mapvrbvals = a.getReturnValue();
        var vrbgateval = mapvrbvals['VRBGate'];
        console.log('vrbgateval: '+vrbgateval);
        var vrbLevelval = mapvrbvals['VRBLevel'];
        console.log('vrbLevelval: '+vrbLevelval);
       
      
        var BusinessFunctionval = mapvrbvals['BusinessFunction'];
         console.log('BusinessFunctionval: '+BusinessFunctionval);
        var Decisionval = mapvrbvals['Decision'];
         console.log('Decisionval: '+Decisionval);
        
        checkboxmap['BusinessFunction'] = BusinessFunctionval;
        checkboxmap['Decision'] = Decisionval;
        checkboxmap['VRBGate'] = vrbgateval;
        checkboxmap['VRBLevel'] = vrbLevelval;
               
        component.set("v.VRBApproversPicklist",checkboxmap);
        console.log('v.VRBApproversPicklist: '+component.get("v.VRBApproversPicklist")); 
      
    });
    $A.enqueueAction(action); 
     
    },
    
    setvrbpicklistvals : function(component) {
    //var action = component.get("c.getVRBpicklistval");
    var inputsel = component.find("VRBGate");
    var opts=[];
    var inputsel1 = component.find("VRBLevel");
    var opts1=[];  
    var opts2=[];
    var opts3=[];
     var checkboxmap =  component.get("v.VRBApproversPicklist");
         console.log('checkboxmap: '+checkboxmap);
           var mapvrbvals = checkboxmap;
        var vrbgateval = mapvrbvals['VRBGate'];
        console.log('vrbgateval: '+vrbgateval);
        var vrbLevelval = mapvrbvals['VRBLevel'];
        console.log('vrbLevelval: '+vrbLevelval);
       
        for(var i=0;i< vrbgateval.length;i++){
            opts.push({"class": "optionClass", label: vrbgateval[i], value: vrbgateval[i]});
        }
             if(!$A.util.isUndefined(inputsel))
             { inputsel.set("v.options", opts);}
        for(var i=0;i< vrbLevelval.length;i++){
            opts1.push({"class": "optionClass", label: vrbLevelval[i], value: vrbLevelval[i]});
        }
             if(!$A.util.isUndefined(inputsel1))
             {
                 inputsel1.set("v.options", opts1);
             }
         
    },
    
    
    ValidateDeal : function(component, event, helper) {

        // Prepare the action to load account record
        var action = component.get("c.getoppty");
        action.setParams({"oppId": component.get("v.recordId")});
        var callSetFal = false;
        // Configure response handler
        action.setCallback(this, function(response) {
            var state = response.getState();
            
            if(component.isValid() && state === "SUCCESS") {
                var oppresult = response.getReturnValue();
                component.set("v.Oppty", response.getReturnValue());
                var usdTCVAmount = component.get("v.Oppty.USDTCV__c")
                console.log('usdTCVAmount : '+usdTCVAmount);
				var opportunityType = component.get("v.Oppty.Type")
                 console.log('opportunityType : '+opportunityType);
                var accSubvertical = component.get("v.Oppty.Account.Subvertical__c")
                console.log('accSubvertical : '+accSubvertical);
                var userID = $A.get("$SObjectType.CurrentUser.Id");
               
                console.log('userID : '+userID);
                
                var uID = component.get("v.Oppty.Account.OwnerId")
                 var accOwnerID = uID.substring(0,15);
                console.log('uID : '+uID);
                console.log('accOwnerID : '+accOwnerID);
                if(usdTCVAmount < 200000){
                    component.set("v.vrbApprovalNotRequired", true);
					component.set("v.SmallDeal", $A.get("$Label.c.VRBApprovalEligibility"));
                    }
                else
                {
                    component.set("v.vrbApprovalNotRequired", false);
                }
               
                
                if((!$A.util.isEmpty(component.get("v.Oppty.VRB_Approvals__r"))) && (!((usdTCVAmount >= 1000000) || ((opportunityType==='New') && (usdTCVAmount >= 200000)))))
                {  console.log('&&**** ');
                 var c = oppresult.VRB_Approvals__r[0];
                    component.set("v.vrbPendingApprovalFlag", true);
                    component.set("v.ErrorMessage", $A.get("$Label.c.VRBPendingApprovalMessage"));
                    component.set("v.VRBPendingApprovals", c);
                   component.set("v.approvalMsg", $A.get("$Label.c.VRBApprovalRequestMessage"));
                }
                /*else
                {
                    component.set("v.vrbApprovalNotRequired", true);
                    
                }*/
               if ((!$A.util.isEmpty(component.get("v.Oppty.VRB_Approvals__r"))) && ((usdTCVAmount >= 1000000) || (opportunityType==='New') && (usdTCVAmount >= 200000))) {
                  console.log('&&**** vrbPendingApprovalLargeDeal');
                   var c = oppresult.VRB_Approvals__r[0];
				component.set("v.vrbPendingApprovalLargeDeal", true);
                component.set("v.vrbApprovalNotRequired", false);
                component.set("v.VRBPendingApprovals", c);
                component.set("v.approvalMsg", $A.get("$Label.c.VRBApprovalPendingRequestMessage"));
                 
                 }/*else{
                     component.set("v.vrbPendingApprovalLargeDeal", false);
                     component.set("v.vrbApprovalNotRequired", false);
                     
                     
                  }*/
                if (((usdTCVAmount >= 1000000) || (opportunityType === 'New') && (usdTCVAmount >= 200000))){
                    this.permissionsetcode(component, event, helper);
                    callSetFal = true;
                    if(!component.get("v.vrbPendingApprovalLargeDeal")=== true)
                    {component.set("v.approvalMsg", $A.get("$Label.c.VRBApprovalRequestMessage"));}
                }
                else
                {
                 //component.set("v.vrbApprovalNotRequired", false);
                 component.set("v.largeDealEligibility", false);
                 
                }
                if ((usdTCVAmount < 1000000) && (opportunityType !='New')){
                  console.log("In Small deals section " );  
                    if((usdTCVAmount >= 200000) && (usdTCVAmount < 500000)){
                         console.log('in lower deal section');
                       component.set("v.usdTCVAmountLowerRange", true); 
                        component.set("v.VRBApproval.VRBLevel__c", 'Account'); 
                        component.set("v.VRBApproval.VRBGate__c", 'Sign');
                        console.log('in lower deal section   ' + component.get("v.VRBApproval"));
                        if(userID === accOwnerID){
                            this.userdetails(component, event, helper,userID,null,'Same')
                            callSetFal = true;
                        }
                        if(userID != accOwnerID){
                           this.userdetails(component, event, helper,accOwnerID,null,'Different')
                           callSetFal = true;
                        }
                    }
                    else{
                        component.set("v.usdTCVAmountLowerRange", false); 
                    }
                    if((usdTCVAmount >= 500000) && (usdTCVAmount < 1000000)){
                       component.set("v.usdTCVAmountHigherRange", true);  
                        console.log('in Higher deal section');
                       component.set("v.VRBApproval.VRBLevel__c", 'Subvertical'); 
                       component.set("v.VRBApproval.VRBGate__c", 'Sign');
                        if(accSubvertical != null && !$A.util.isUndefined(accSubvertical)){
                            this.userdetails(component, event, helper,null,accSubvertical,null)
                            callSetFal = true;
                        }
                     if(accSubvertical === null || $A.util.isUndefined(accSubvertical)){
                    component.set("v.subverticalLeaderNotExist", true); 
                         component.set("v.approvalMsg", $A.get("$Label.c.VRBApprovalSmallDealMessage"));
                         
                    }
                    else{
                        component.set("v.usdTCVAmountHigherRange", false); 
                    }
                }
               }
            }
            else if (state === "ERROR") {
               var errors = response.getError();
                component.set("v.hasErrors", true);
                if (errors) {
                    if (errors && Array.isArray(errors) && errors.length > 0) {
                           for(var i;i<errors.length;i++)
                     {
                        console.log("Error message: " + 
                                    errors[i].message);
                     }
                       component.set("v.errormsg", errors[0].message);}
                    } 
            }
                    else{
                        
                        var errors = response.getError();
                component.set("v.hasErrors", true);
                if (errors) {
                    if (errors && Array.isArray(errors) && errors.length > 0) {
                           for(var i;i<errors.length;i++)
                     {
                        console.log("Error message: " + 
                                    errors[i].message);
                     }
                       component.set("v.errormsg", errors[0].message);}
                    } 
                    }
                    
            console.log('in side enque action validting deal type : '+callSetFal)
           
         if(callSetFal === false)
         { this.setFlags(component, event, helper);}
        });
        $A.enqueueAction(action);
         
        
       },
    
    permissionsetcode: function(component, event, helper){
      var action = component.get("c.getpermissionsetcode");
        
        // Configure response handler
        action.setCallback(this, function(response) {
            var state = response.getState();
            
            if(component.isValid() && state === "SUCCESS") {
             var mapvrbvals = response.getReturnValue();
             var largeDealEl = mapvrbvals['largeDealEligibility'];   
             var vrbPer = mapvrbvals['vrbPermissionAccess'];
             component.set("v.largeDealEligibility", largeDealEl);
             component.set("v.vrbPermissionSetAccess", vrbPer);
           }this.setFlags(component, event, helper);
           
            });
        $A.enqueueAction(action);
         
    },
    
    userdetails: function(component, event, helper,userid,subvertical,approver){
       var action = component.get("c.getusers"); 
        action.setParams({"userid": userid,"accSubvertical":subvertical});

        // Configure response handler
        action.setCallback(this, function(response) {
            var state = response.getState();
            
            if(component.isValid() && state === "SUCCESS") {
                var userval = response.getReturnValue();
                component.set("v.UserDetails", userval);
                
                if(subvertical!=null)
                {
                    if(component.get("v.UserDetails")===null ||$A.util.isEmpty(component.get("v.UserDetails"))){
                               component.set("v.subverticalLeaderNotExist", true); 
                                
                                component.set("v.approvalMsg", $A.get("$Label.c.VRBApprovalSmallDealMessage"));
                               component.set("v.subverticalLeaderExist", false);
                            }
                            else{
                                component.set("v.subverticalLeaderNotExist",false);
                                component.set("v.approvalMsg", $A.get("$Label.c.VRBApprovalSmallDealMessage"));
                               component.set("v.subverticalLeaderExist", true);
                                
                            }
                }
                else if(userid!=null){
                    if(approver === 'Same'){
                        if(component.get("v.UserDetails.UserFunction__c") === 'Client Executive') {
                                component.set("v.accountOwnerFlag", true); 
                                component.set("v.approvalMsg", $A.get("$Label.c.VRBApprovalSmallDealMessage")); 
                            }
                            else 
                            {
                             component.set("v.accountOwnerFlag", false);   
                             component.set("v.approvalMsg", $A.get("$Label.c.VRBApprovalSmallDealMessage"));
                             component.set("v.accountOwnerNotClientExecutiveFlag", true);
                            }
                    }
                    else if(approver === 'Different'){
                        console.log('in lUserDetails different section   ' + component.get("v.UserDetails.UserFunction__c"));
                            if(component.get("v.UserDetails.UserFunction__c") === 'Client Executive') 
                            {   console.log('in lUserDetails different section');
                                component.set("v.accountOwnerClientExecutiveFlag", true);
                                component.set("v.approvalMsg", $A.get("$Label.c.VRBApprovalSmallDealMessage"));
                                
                            }
                            else{
                                component.set("v.accountOwnerClientExecutiveFlag", false);
                            }
                            if(component.get("v.UserDetails.UserFunction__c") != 'Client Executive') {
                                component.set("v.accountOwnerNotClientExecutiveFlag", true);
                                component.set("v.approvalMsg", $A.get("$Label.c.VRBApprovalSmallDealMessage"));
                               
                            }
                            else{
                                component.set("v.accountOwnerNotClientExecutiveFlag", false);
                                
                            }
                    }
                }
          } this.setFlags(component, event, helper);
           
        }); 
        $A.enqueueAction(action);
    },
    
    setFlags: function(component, event, helper){
        console.log(' setFlags: '+component.get("v.setFlags"))
          var checkboxmap =  component.get("v.EnableApproverSection");
       if((component.get("v.largeDealEligibility")===true)||(component.get("v.accountOwnerNotClientExecutiveFlag")===true)||(component.get("v.subverticalLeaderNotExist")===true))
         {
            this.setvrbpicklistvals(component, event);
            }
         if(component.get("v.largeDealEligibility")===true && component.get("v.vrbPendingApprovalLargeDeal") === false)
             {  component.find('inputVRBDate').set('v.value', component.get("v.VRBDate"));
            }
    
         //manipulating flags to handle different sections and values on the component
        console.log(' vrbPendingApprovalFlag: '+component.get("v.accountOwnerNotClientExecutiveFlag")+component.get("v.vrbPendingApprovalLargeDeal"))
        console.log('accountOwnerClientExecutiveFlag '+component.get("v.accountOwnerClientExecutiveFlag")+component.get("v.largeDealEligibility")+component.get("v.vrbPendingApprovalFlag"))
        console.log('vrbPermissionSetAccess ==> '+component.get("v.vrbPermissionSetAccess"));
         
         if((component.get("v.vrbPermissionSetAccess")===true && component.get("v.largeDealEligibility") !=true)||component.get("v.vrbPendingApprovalFlag")===true ){
                      component.set("v.disableSubmitButton",true)
             }

             if(component.get("v.vrbPermissionSetAccess")===false && component.get("v.vrbPendingApprovalLargeDeal")===true){
                   component.set("v.enableAddApprover",true)
                }
         
          if(component.get("v.vrbPermissionSetAccess")===true && component.get("v.largeDealEligibility") !=true){
                   component.set("v.ErrorMessage", $A.get("$Label.c.VRBFullApprovalPermission"));
                }
           if(component.get("v.usdTCVAmountLowerRange")===true || component.get("v.usdTCVAmountHigherRange")===true){
               console.log('in enable small deal : '+component.get("v.usdTCVAmountLowerRange")+component.get("v.usdTCVAmountHigherRange"))
                   component.set("v.enableSmallDealSection", true);
                }
        
         if(component.get("v.vrbPendingApprovalFlag")===false && component.get("v.accountOwnerFlag")===true )
        {
            this.createVRBApproversInstance(component, event,null,component.get("v.UserDetails.UserFunction__c"),'Approved',component.get("v.UserDetails.Id"),component.get("v.UserDetails.Name")) ;
        }
        else if(component.get("v.vrbPendingApprovalFlag")===false && component.get("v.subverticalLeaderExist")===true )
        {
            this.createVRBApproversInstance(component, event,'Subvertical Leader',component.get("v.UserDetails.UserFunction__c"),null,component.get("v.UserDetails.Id"),component.get("v.UserDetails.Name")) ;
        }
        else if(component.get("v.vrbPendingApprovalFlag")===true && component.get("v.subverticalLeaderExist")===true )
        {
            this.createVRBApproversInstance(component, event,'Subvertical Leader',component.get("v.UserDetails.UserFunction__c"),null,component.get("v.UserDetails.Id"),component.get("v.UserDetails.Name")) ;
        }
        else if(component.get("v.vrbPendingApprovalFlag")===true || component.get("v.accountOwnerClientExecutiveFlag")===true)
        {
            this.createVRBApproversInstance(component, event,null,component.get("v.UserDetails.UserFunction__c"),null,component.get("v.UserDetails.Id"),component.get("v.UserDetails.Name")) ;
        }
        
         if(component.get("v.accountOwnerFlag")===true ) {
            checkboxmap['accountOwnerFlag'] = true;
             checkboxmap['accountOwnerClientExecutiveFlag'] = false;
             checkboxmap['accountOwnerNotClientExecutiveFlag'] = false;
             checkboxmap['subverticalLeaderNotExist'] = false;
             checkboxmap['subverticalLeaderExist'] = false;
             
         }
         else if(component.get("v.accountOwnerClientExecutiveFlag")===true ) {
            checkboxmap['accountOwnerClientExecutiveFlag'] = true;
             checkboxmap['accountOwnerFlag'] = false;
             checkboxmap['accountOwnerNotClientExecutiveFlag'] = false;
             checkboxmap['subverticalLeaderNotExist'] = false;
             checkboxmap['subverticalLeaderExist'] = false;
			 
         }
         else if(component.get("v.accountOwnerNotClientExecutiveFlag")===true ) {
             checkboxmap['accountOwnerNotClientExecutiveFlag'] = true;
             checkboxmap['accountOwnerClientExecutiveFlag'] = false;
             checkboxmap['subverticalLeaderNotExist'] = false;
             checkboxmap['subverticalLeaderExist'] = false;
             checkboxmap['accountOwnerFlag'] = false;
         }
         else if(component.get("v.subverticalLeaderNotExist")===true ) {
            checkboxmap['subverticalLeaderNotExist'] = true;
             checkboxmap['subverticalLeaderExist'] = false;
             checkboxmap['accountOwnerFlag'] = false;
             checkboxmap['accountOwnerNotClientExecutiveFlag'] = false;
             checkboxmap['accountOwnerClientExecutiveFlag'] = false;
         }
         else if(component.get("v.subverticalLeaderExist")===true ) {
            checkboxmap['subverticalLeaderExist'] = true;
             checkboxmap['accountOwnerFlag'] = false;
             checkboxmap['accountOwnerNotClientExecutiveFlag'] = false;
             checkboxmap['accountOwnerClientExecutiveFlag'] = false;
             checkboxmap['subverticalLeaderNotExist'] = false;
             
         }
         else
         {
             checkboxmap['subverticalLeaderExist'] = false;
             checkboxmap['accountOwnerFlag'] = false;
             checkboxmap['accountOwnerNotClientExecutiveFlag'] = false;
             checkboxmap['accountOwnerClientExecutiveFlag'] = false;
             checkboxmap['subverticalLeaderNotExist'] = false;  
         }
         checkboxmap['usdTCVAmountLowerRange'] = component.get("v.usdTCVAmountLowerRange");
         checkboxmap['usdTCVAmountHigherRange'] = component.get("v.usdTCVAmountHigherRange");
         checkboxmap['vrbPendingApprovalFlag'] = component.get("v.vrbPendingApprovalFlag");
         checkboxmap['largeDealEligibility'] = component.get("v.largeDealEligibility");
         component.set("v.EnableApproverSection",checkboxmap);
		 if(component.get("v.setFlags")===false)
        {
		this.createObjectData(component,event);
        component.set("v.setFlags",true);
    }
},
     GoBacktoparent: function(component, event) {
	    var evt =  $A.get("e.force:navigateToSObject");
    evt.setParams({
        "recordId": component.get("v.recordId"),
        });
    evt.fire();
    },
})