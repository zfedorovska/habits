    // Next ID for adding a new habit
  var _nextId;
  _nextIdFromLocalStorage = localStorage.getItem("_nextId");	
  if (_nextIdFromLocalStorage){
	 _nextId = +_nextIdFromLocalStorage; 
  }
  else
  {
	 _nextId = 1;
	 localStorage.setItem(_nextId,"_nextId");	
  }
  // ID of habit currently editing
  var _activeId = 0;
 
  $(document).ready(function(){	  
	  habitsFromLocalStorage = JSON.parse(localStorage.getItem("habitsRows"));	
	  if (habitsFromLocalStorage)
	  {
		  if ($("#habitTable tbody").length == 0) {
			$("#habitTable").append("<tbody></tbody>");
		  }   
		  
		  habitBuildTableFromLocalStorage() ;
		  
		  if (habitsFromLocalStorage.length > 0){
			  habitsFromLocalStorage.forEach(function(item) {
					$("#habitTable tbody").append(item);
				});
		  }
	  }
	  
	  workText = localStorage.getItem("workText");	
	  if (workText){	
		work = JSON.parse(workText);
	    var workClass = "work_" + localStorage.getItem("habitId");
		$('.' + workClass).text(workText);	
		// Update habit in localStorage
		var i;
		for (i = 0; i < habitsFromLocalStorage.length; i++) {		
			if (habitsFromLocalStorage[i].id == work.habitId)
				{        
					habitsFromLocalStorage[i].work = workText;
				}
			}
		localStorage.setItem("habitsRows", JSON.stringify(habitsFromLocalStorage));
	  }

	   $("#habitTable td").each(function() {
		if ($(this).text() == 'Bad') {
		  $(this).parents("tr").css('color', 'red');
		}
		else if($(this).text() == 'Good')
		{
		  $(this).parents("tr").css('color', 'green');
		}
	   });
	
	  });
 
  function habitUpdate() {
	if ($("#updateButton").text() == "Update") {
		habitUpdateInTable(_activeId);
	}
	else {
		habitAddToTable();
	}
	// Clear form fields
	formClear();
	// Focus to habit name field
	$("#habitname").focus();
  }
  
  function formClear() {
  $("#quality").val("empty");
  $("#habitName").val("");
  $("#cue").val("");
  $("#craving").val("");
  $("#routine").val("");
  $("#work").val("");
  $("#days").val("");
}

function habitAddToTable() {
  // First check if a <tbody> tag exists, add one if not
  if ($("#habitTable tbody").length == 0) {
    $("#habitTable").append("<tbody></tbody>");
  } 
  // Append habit to table
  $("#habitTable tbody").append(
    habitBuildTableRow(_nextId));
  //add row to local storage
  if (localStorage.getItem("habitsRows") === null) 
	 var habitsRows = [];
  else
	  habitsRows = JSON.parse(localStorage.getItem("habitsRows"));	
   habitsRows.push(habitBuildLocalStorageTableRow(_nextId)); 
  localStorage.setItem("habitsRows", JSON.stringify(habitsRows));
  // Increment next ID to use
  _nextId += 1;
   localStorage.setItem("_nextId", _nextId);
}

function getIdFromCtl(ctl) {
	var row = $(ctl).parents("tr");
	var cols = row.children("td");
	var id = $($(cols[0]).children("button")[0]).data("id");	  
	return id;
}
 
function habitDelete(ctl) {
	$(ctl).parents("tr").remove();
	var id = getIdFromCtl(ctl);
	var habitsRows = $.grep(habitsFromLocalStorage, function(e){ 
     return e.id != id; 
	});
	localStorage.setItem("habitsRows", JSON.stringify(habitsRows));	
	var workText = localStorage.getItem("workText");	
	if (workText){	
		work = JSON.parse(workText);
		if (work.habitId == id)
		 {
			 localStorage.removeItem('workText');
		 }
	}
}

function openWizard(ctl) {
	habitId = getIdFromCtl(ctl);
	var row = $(ctl).parents("tr");
	var cols = row.children("td");
	var quality = $(cols[1]).text();
	var workInColumn = $(cols[7]).text();
	console.log(workInColumn);
	localStorage.setItem("habitId", habitId);
	localStorage.setItem("workInColumn", JSON.stringify(workInColumn));
	if (quality=="Good")
		window.location.href='myGoodWizard.html'
	else
		window.location.href='myWizard.html';
}

function habitDisplay(ctl) {
  _activeId = getIdFromCtl(ctl);
  var row = $(ctl).parents("tr");
  var cols = row.children("td");
  $("#quality").val($(cols[1]).text());
  $("#habitName").val($(cols[2]).text());
  $("#cue").val($(cols[3]).text());
  $("#craving").val($(cols[4]).text());
  $("#routine").val($(cols[5]).text());
  $("#work").val($(cols[7]).text());
  $("#days").val($(cols[8]).find("input[type='text']").val());
  // Change Update Button Text
  $("#updateButton").text("Update");
  // Display fields available only for edit
  $(".updateVisible").show();
}

function habitUpdateInTable(id) {
// Find habit in <table>
  var row =
     $("#habitTable button[data-id='"
     + id + "']")
    .parents("tr")[0];
  // Add changed habit to table
  $(row).after(habitBuildTableRow(id));
  var newRow = habitBuildTableRow(id);
  var textId ="data-id='"+ id + "'";
  // Remove original habit
  $(row).remove();   
  // Update habit in localStorage
  var i;
  for (i = 0; i < habitsFromLocalStorage.length; i++) {
	  if(habitsFromLocalStorage[i].id == id)
		  {
			 habitsFromLocalStorage[i] = habitBuildLocalStorageTableRow(id);
		  }
	}	
  localStorage.setItem("habitsRows", JSON.stringify(habitsFromLocalStorage));
  // Clear form fields
  formClear();
  // Change Update Button Text
  $("#updateButton").text("Add");
}
  
function habitBuildTableRow(id) {
  var ret =
  "<tr>" +
    "<td>" +
      "<button type='button' " +
              "onclick='habitDisplay(this);' " +
              "class='btn btn-default' " +
              "data-id='" + id + "'>" +
              "<span class='glyphicon glyphicon-edit' />" +
      "</button>" +
    "</td>" +
    "<td>" + $("#quality").find(":selected").text() + "</td>" +
    "<td>" + $("#habitName").val() + "</td>" +
    "<td>" + $("#cue").val() + "</td>" +
    "<td>" + $("#craving").val() + "</td>" +
    "<td>" + $("#routine").val() + "</td>" +
	"<td>" +
      "<button type='button' " +
              "onclick='openWizard(this);' " +
              "class='btn btn-default' " +
              "data-id='" + id + "'>" +
              "<span class='glyphicon glyphicon-asterisk' />" +
      "</button>" +
    "</td>" +
    "<td>" + 
		"<span class='work_" + id + "'>" + $("#work").val() +
		"</span>" +
	"</td>" +
	"<td>"+
		"<span class='containerNumbers' id='containerNumbers'" +
			"data-id='" + id + "'>" +
			"<button type='button'" +
			"onclick='changeDays(this);' " +
			"class='plus btn' value='-1'>-</button>" +
			"<span class='resultsBoard'>" +				
				"<input type='text' class='result' value='"+$("#days").val()+"'>" +
			"</span>" +
			"<button type='button'" +
			"onclick='changeDays(this);' " +
			"class='plus btn' value='1'>+</button>" +
		  "</span>" +
	"</td>"+	 
    "<td>" +
      "<button type='button' " +
              "onclick='habitDelete(this);' " +
              "class='btn btn-default' " +
              "data-id='" + id + "'>" +
              "<span class='glyphicon glyphicon-remove' />" +
      "</button>" +
    "</td>" +
  "</tr>"
      
  return ret;
}

function habitBuildTableFromLocalStorage() {
	habitsRows = JSON.parse(localStorage.getItem("habitsRows"));	

	for (var habit of habitsRows) {
		var ret =
				"<tr>" +
					"<td>" +
						"<button type='button' " +
						"onclick='habitDisplay(this);' " +
						"class='btn btn-default' " +
						"data-id='" + habit.id + "'>" +
						"<span class='glyphicon glyphicon-edit' />" +
						  "</button>" +
					"</td>" +
					"<td>" + habit.habitQuality + "</td>" +
					"<td>" + habit.habitName + "</td>" +
					"<td>" + habit.cue + "</td>" +
					"<td>" + habit.craving + "</td>" +
					"<td>" + habit.routine + "</td>" +
					"<td>" +
						"<button type='button' " +
						"onclick='openWizard(this);' " +
						"class='btn btn-default' " +
						"data-id='" + habit.id + "'>" +
						"<span class='glyphicon glyphicon-asterisk' />" +
						 "</button>" +
					"</td>" +
					"<td>" + 
						"<span class='work_" + habit.id + "'>" + habit.work +
						"</span>" +
					"</td>" +
					"<td>"+
						"<span class='containerNumbers' id='containerNumbers'" +
						"data-id='" + habit.id + "'>" +
						"<button type='button'" +
						"onclick='changeDays(this);' " +
						"class='plus btn' value='-1'>-</button>" +
						"<span class='resultsBoard'>" +				
						"<input type='text' class='result' value='"+ habit.days +"'>" +
						"</span>" +
						"<button type='button'" +
						"onclick='changeDays(this);' " +
						"class='plus btn' value='1'>+</button>" +
						"</span>" +
					"</td>"+	 
					"<td>" +
						"<button type='button' " +
					    "onclick='habitDelete(this);' " +
						"class='btn btn-default' " +
						"data-id='" + habit.id + "'>" +
						"<span class='glyphicon glyphicon-remove' />" +
						"</button>" +
					"</td>" +
				"</tr>"
					
		$("#habitTable tbody").append(ret);
	}
};
		  
function habitBuildLocalStorageTableRow(id) {	
    var habitsLocalStorageRow  = 
	 {
		      id: id,
			  habitQuality:$("#quality").val(),
			  habitName:$("#habitName").val(),
			  cue:$("#cue").val(),
			  craving:$("#craving").val(),
			  routine:$("#routine").val(),
			  work:$("#work").val(),
			  days:$("#days").val()
	}   
  return habitsLocalStorageRow;
}

function saveToJson()
{
    var habitsJson = JSON.stringify(makeJsonFromTable('habitTable'));
	saveToFileAsDownload(habitsJson,"habits.json");	
}

function saveToFileAsDownload(text, name)
{ 
	var a = document.createElement("a");
	var file = new Blob([text], {type: "text/plain"}); 
	a.href = URL.createObjectURL(file); 
	a.download = name; 
	a.style.display = 'none';
	document.body.appendChild(a); 
	a.click(); 
	document.body.removeChild(a);
}

function changeDays(ctl){
		var step = + ctl.value;
		var containerNumbers = $(ctl).parents("span");
        var inputField = containerNumbers.find(".result");
		var currentTextfieldVal	= + inputField.val();	
		var currentQty = + currentTextfieldVal + step;
		
		//habitsFromLocalStorage = JSON.parse(localStorage.getItem("habitsRows"));	
		var row = $(ctl).parents("tr");
		var cols = row.children("td");
		var id = $($(cols[0]).children("button")[0]).data("id");	  
		
			if(currentQty >= 0){
				containerNumbers.find(".result").val(currentQty);
				
				 // Update habit in localStorage
				  var i;
				  for (i = 0; i < habitsFromLocalStorage.length; i++) {
					  if(habitsFromLocalStorage[i].id == id)
						  {
							 habitsFromLocalStorage[i].days = currentQty;
						  }
					}	
				  localStorage.setItem("habitsRows", JSON.stringify(habitsFromLocalStorage));
				
			}
			else{
				alert("Days count can not be less than 0");
			}
	}

function readSelectedFile()
{
    var inputFileElement=document.getElementById('inputFileSelector');
    var reader = new FileReader();
    reader.onload=function(e)
    {
        var result = reader.result;
		localStorage.setItem("habitsRows",result);
		localStorage.setItem("workText","");
    };
    reader.readAsText(inputFileElement.files[0]);
}

function saveHabitRowsToFile(){
	var habitsFromLocalStorage = localStorage.getItem("habitsRows");	
	saveToFileAsDownload(habitsFromLocalStorage,"habits.json");	
}
	





	


	



	
	


