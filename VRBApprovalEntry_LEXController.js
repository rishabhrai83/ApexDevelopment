({
    doInit: function(component, event, helper) {
		/**
        var MainTabId = null;
        var taburl = null;
        var focusedTabId = null;
        var workspaceAPI = component.find("workspace");
        
        workspaceAPI.isConsoleNavigation().then(function(response) {
            console.log(response)
            if(response) 
            { 
                console.log('in VRB request console');
                workspaceAPI.getFocusedTabInfo().then(function(response) {
                    taburl = response.url;
                    MainTabId = response.tabId;
                    console.log('url' +taburl )
                    console.log('MainTabId' +MainTabId )
                    workspaceAPI.openSubtab({
                        parentTabId: component.get("v.ParentTab"),
                        url: taburl,
                        focus: true
                    }).then(function(response) {
                        var focusedTabId = response;
                        workspaceAPI.setTabIcon({
                            tabId: focusedTabId,
                            icon: "custom:custom16",
                            iconAlt: "VRB"
                        });
                        workspaceAPI.setTabLabel({
                            tabId: response,
                            label: "VRB Approval Entry"
                        });
                        helper.getvrbpicklistvals(component, event);
                        helper.ValidateDeal(component, event);
                    });
                    workspaceAPI.isSubtab({
                        tabId: response.tabId
                    }).then(function(response) {
                        if (response) {
                        }
                        else {
                            workspaceAPI.closeTab({tabId: MainTabId}); 
                        }
                    } );
                }) 
            }
            else{
                helper.getvrbpicklistvals(component, event);
                helper.ValidateDeal(component, event);  
            }
        })
        .catch(function(error) {
            console.log(error);
        });
        **/
        
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.setTabLabel({
                tabId: focusedTabId,
                label: "VRB Approval Entry"
            });
            
        })
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.setTabIcon({
                tabId: focusedTabId,
                icon: "custom:custom16",
                iconAlt: "VRB"
            });
        })
        .catch(function(error) {
            console.log(error);
        });     
        helper.getvrbpicklistvals(component, event);
        helper.ValidateDeal(component, event);  
        var timezone = $A.get("$Locale.timezone");
        console.log('Time Zone Preference in Salesforce ORG :'+timezone);
        var mydate = new Date().toLocaleString("en-US", {timeZone: timezone})
        console.log('Date Instance with Salesforce Locale timezone : '+mydate);
        var dateFormat = "MMM dd, yyyy";
        var dateString = $A.localizationService.formatDateTime(mydate, dateFormat);
        console.log('Date Instance with Salesforce Locale timezone : '+dateString);
        component.set('v.VRBDate',dateString);
        var newDate = new Date( dateString);
        component.set('v.VRBApproval.VRBDate__c',newDate);
        /* if(component.get("v.setFlags")===false)
        {
         helper.createObjectData(component, event);
          component.set("v.setFlags",true);   
        }  */ 
    },
    
    // function for save the Records 
    Save: function(component, event, helper) {
        // first call the helper function in if block which will return true or false.
        // this helper function check the "Approver Name" will not be blank on each row.
        if(component.get("v.accountOwnerFlag")===true || component.get("v.accountOwnerClientExecutiveFlag")===true || component.get("v.subverticalLeaderExist")===true)  {
            component.set("v.VRBApproverList",component.get("v.VRBApprovers"))  
        }
        console.log('In save')
        component.set("v.IsLoading", true);
        if (helper.validateRequired(component, event)) {
            var myvrbApproverRecordList = component.get("v.VRBApproverList");
            var myvrbApprovalRecord = component.get("v.VRBApproval");
            var myOpp = component.get("v.Oppty");
            var myFlags = component.get("v.EnableApproverSection");
            
            console.log('myFlags'+myFlags['usdTCVAmountLowerRange'])
            // call the apex class method for save the Contact List
            // with pass the contact List attribute to method param.  
            console.log('In save after validate')
            
            var action = component.get("c.saveVRBApprovers");
            action.setParams({
                "vrbApproverRecordList": myvrbApproverRecordList,
                "vrbApprovalMasterRecord": myvrbApprovalRecord,
                "Flags": myFlags,
                "Opp":myOpp
            });
            // set call back 
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    // if response if success then reset/blank the 'VRBApproverList' Attribute 
                    // and call the common helper method for create a default Object Data to Contact List 
                    var resultsToast = $A.get("e.force:showToast");
                    resultsToast.setParams({
                        "title": "VRB Request Saved",
                        "message": "The new VRB Request is created successfully.",
                        "type":"success"
                    });
                    
                    // Update the UI: close panel, show toast, refresh account page
                    //$A.get("e.force:closeQuickAction").fire();
                    helper.GoBacktoparent(component, event);
                    resultsToast.fire();
                    $A.get("e.force:refreshView").fire();
                    
                    var workspaceAPI = component.find("workspace");
                    workspaceAPI.getFocusedTabInfo().then(function(response) {
                        var focusedTabId = response.tabId;
                        workspaceAPI.closeTab({tabId: focusedTabId});
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
                    $A.get("e.force:refreshView").fire();
                }
                else if (state === "ERROR") {
                    component.set("v.IsLoading", false);
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
                    else {
                        component.set("v.IsLoading", false);
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
            });
            // enqueue the server side action  
            $A.enqueueAction(action);
        }
        else{
            component.set("v.IsLoading", false);
        }
    },
    
    // function for create new object Row in Contact List 
    addNewRow: function(component, event, helper) {
        // call the comman "createObjectData" helper method for add new Object Row to List  
        helper.createObjectData(component, event);
    },
    
    // function for delete the row 
    removeDeletedRow: function(component, event, helper) {
        // get the selected row Index for delete, from Lightning Event Attribute  
        var index = event.getParam("indexVar");
        console.log('index '+index);
        // get the all List (VRBApproverList attribute) and remove the Object Element Using splice method    
        var AllRowsList = component.get("v.VRBApproverList");
        console.log('AllRowsList before splice '+AllRowsList);
        AllRowsList.splice(index, 1);
        // set the VRBApproverList after remove selected row element 
        console.log('AllRowsList after splice'+AllRowsList.length);
        try{
            component.set("v.VRBApproverList", AllRowsList);
        }
        catch(e){
            console.log('Error '+e.message);    
        }
        console.log('AllRowsList '+AllRowsList.length);
    },
    handleCancel: function(component, event, helper) {
        // $A.get("e.force:closeQuickAction").fire();
        helper.GoBacktoparent(component, event);
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.closeTab({tabId: focusedTabId});
        })
        .catch(function(error) {
            console.log(error);
        });
    },
    onCheck: function(cmp, evt,helper) {
        var checkCmp = cmp.find("checkbox");
        
        if (checkCmp.get("v.checked") === false){
            cmp.set("v.VRBApproval.VRBApprovalExclusion__c", false);
            return;
        }
        else {
            cmp.set("v.VRBApproval.VRBApprovalExclusion__c", true);
        }  
    },
    
    saveAddApprover: function(component, event, helper) {
        if (helper.validateRequired(component, event)) {
            // call the apex class method for save the Contact List
            // with pass the contact List attribute to method param.  
            console.log("In Add Approver function");
            component.set("v.IsLoading", true);
            
            var action = component.get("c.addApprover");
            action.setParams({
                "vrbAddApproverRecordList": component.get("v.VRBApproverList"),
                "vrbApprovalRecordID": component.get("v.VRBPendingApprovals.Id"),
                "vrbApprovalExclusionFlag":component.get("v.VRBPendingApprovals.VRBApprovalExclusion__c")
            });
            // set call back 
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    // if response if success then reset/blank the 'VRBApproverList' Attribute 
                    // and call the common helper method for create a default Object Data to Contact List 
                    var resultsToast = $A.get("e.force:showToast");
                    resultsToast.setParams({
                        "title": "VRB Request Saved",
                        "message": "New Appover(s) Added Successfully",
                        "type":"success"
                    });
                    
                    // Update the UI: close panel, show toast, refresh account page
                    //$A.get("e.force:closeQuickAction").fire();
                    helper.GoBacktoparent(component, event);
                    resultsToast.fire();
                    $A.get("e.force:refreshView").fire();
                    
                    var workspaceAPI = component.find("workspace");
                    workspaceAPI.getFocusedTabInfo().then(function(response) {
                        var focusedTabId = response.tabId;
                        workspaceAPI.closeTab({tabId: focusedTabId});
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
                    $A.get("e.force:refreshView").fire();
                }
                else if (state === "ERROR") {
                    component.set("v.IsLoading", false);
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
                    else {
                        component.set("v.IsLoading", false);
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
            });
            // enqueue the server side action  
            $A.enqueueAction(action);
        }
        else{
            component.set("v.IsLoading", false);
        }
    },
    onChange:function(cmp, evt,helper) {
        var checkCmp = cmp.find("VRBDetails");
        console.log("checkCmp: " + 
                    checkCmp); 
        var val =  checkCmp.get("v.value") 
        console.log("val: " + 
                    val);
        cmp.set("v.VRBApproval.VRBDetails__c",val );
        
    },
    onDateChange:function(cmp, evt,helper) {
        var checkCmp = cmp.find("inputVRBDate");
        //var newValue = evt.getParam("VRBDate");
        var newValue = cmp.find("inputVRBDate").get("v.value");
        console.log("newValue: " + newValue);
        var newDate = new Date(newValue);
        cmp.set("v.VRBApproval.VRBDate__c",newDate );
    },
    VRBDateChanged : function(component, event, helper) {
        var newValue = event.getParam("value");
        var oldValue = event.getParam("oldValue");
        // alert("Expense name changed from '" + oldValue + "' to '" + newValue + "'");
    }
})