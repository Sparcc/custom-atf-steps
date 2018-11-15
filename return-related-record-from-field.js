function generateDescription() {
    // the global variable 'step' represents the current glide record
    var description = 'This is used for getting new record from field';
}
 generateDescription();

(function executeStep(inputs, outputs, stepResult, timeout) {
	
	//Check that inputs are set
	if (gs.nil(inputs.u_table) && gs.nil(inputs.u_related_table) && gs.nil(inputs.u_record_name)) {
		stepResult.setOutputMessage(gs.getMessage("No input variables set"));
		stepResult.setFailed();
		return;
	}
	
	// Get record from table
	var gr = new GlideRecord(inputs.u_table);
	gr.addQuery('sys_id',inputs.u_record_id);
	gr.setLimit(1);
	gr.query();
	
	// Use found record for another query
	if(!gr.next()){
		stepResult.setOutputMessage(gs.getMessage("Cannot find input record or table"));
		stepResult.setFailed();
		return;
    } else{
		
		// From table get record id, uses id from above as query
		var gr2 = new GlideRecord(inputs.u_related_table);
		gr2.addQuery('sys_id',gr.getValue(inputs.u_field_name));
		gr2.setLimit(1);
		gr2.query();
		
		// Return record as output
		if (!gr2.next()){
			stepResult.setOutputMessage(gs.getMessage("Cannot find record on related table or related table does not exist"));
			stepResult.setFailed();
		}else{
			stepResult.setSuccess();
			stepResult.setOutputMessage(gs.getMessage("Successfully retrieved record from field: {0}", inputs.u_field_name));
			outputs.u_record_id = gr2.sys_id;
		}	
	}
}(inputs, outputs, stepResult, timeout));
