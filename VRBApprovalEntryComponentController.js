({
	doInit : function(component, event, helper) {

        // Prepare the action to load account record
         var evt = $A.get("e.force:navigateToComponent");
    evt.setParams({
        componentDef : "c:VRBApprovalEntry_LEX",
        componentAttributes: {
        recordId : component.get("v.recordId")
        }
    });
    evt.fire();
}
})