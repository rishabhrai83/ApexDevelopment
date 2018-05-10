({
    AddNewRow : function(component, event, helper){
       // fire the AddNewRowEvt Lightning Event 
       
        component.getEvent("AddRowEvt").fire(); 
        
    },
    
    removeRow : function(component, event, helper){
     // fire the DeleteRowEvt Lightning Event and pass the deleted Row Index to Event parameter/attribute
       component.getEvent("DeleteRowEvt").setParams({"indexVar" : component.get("v.rowIndex") }).fire();
    },
    
    doInit :function(component, event, helper){
     console.log('BusinessFunctionval: coming here'+component.get("v.UserDetails.Id"));
     console.log('in Helper VRBApproversInstance '+component.get("v.VRBApproversInstance.ApproverName__c"));
     helper.setEnableSecVal(component, event, helper);
     helper.setpicklistval(component, event, helper);   
    
    },
    addError : function(component, event, helper){
        console.log('Event add error got fired')
        
        var index = event.getParam("indexVar");
        var indexval = [];
        component.set("v.myError",indexval);
        console.log('Event add error fired '+index.length )
        for(var i =0;i<index.length;i++){
            console.log('inside the loop '+i ) ;
            var num = index[i].value;
            indexval.push({value:num})
        }
        component.set("v.myError",indexval);
      
    }
  
})