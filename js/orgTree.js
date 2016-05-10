// -- Organisation Unit Tree ------------------------------------
function orgTree(){}


// set Event for all orgUnit in Tree
orgTree.loadTree = function(orgID){
	$.get("https://dhis2.asia/erar/api/organisationUnits/"+orgID+".json?fields=id,name,level,children[id,name,level,children[id,name,level,children[id,name,level]]]",function(json){
		console.log("start");
		$("#menu").html(orgTree.generateHTML(json));
		
		//Event when click the 'colapse' button, it will expand child organisation units of selected orgUnit
		$("#menu").find("img.colapse").click(function(){
			$(this).hide();
			var divTag = $( this ).parent();
			var id = divTag.attr("id");
			$("#"+id+"Child").show();
			$("#"+id+"Expand").show();
		});
		
		//Event when click the 'expand' button, it will hide child organisation units of selected orgUnit
		$("#menu").find("img.expand").click(function(){
			$(this).hide();
			var divTag = $( this ).parent();
			var id = divTag.attr("id");
			$("#"+id+"Child").hide();
			$("#"+id+"Colapse").show();
		});
		
		//Event when click on orgUnit, it changes color of selected orgUnit.
		$("#menu").find("a").click(function(){
			var select = $(this).attr("select");
			if(select == 'no'){
				//remove color and change 'select' status of ougUnit that selected before
				$("#menu").find("a[select='yes']").removeAttr("style");
				$("#menu").find("a[select='yes']").attr("select","no");
			
				//add color and change 'select' status of selected orgUnit
				$(this).css({"color": "orange"});
				$(this).attr("select","yes");
				
				//var divTag = $( this ).parent();
				//var id = divTag.attr("id");
				
				//orgUnit = id;
				//Sent OUID to generate chart
				//Chart.createChart(id);
			}else{
				$(this).removeAttr("style");
				$(this).attr("select","no");
			}
		});
		
	});
}

// generate HTML of orgUnit tree
orgTree.generateHTML = function(json){
	var generateDivTag = "<div id='"+json.id+"' level='"+json.level+"'>";
	if(json.level != 4 && json.children.length > 0){
		generateDivTag += "<img id='"+json.id+"Colapse' src='https://dhis2.asia/erar/api/documents/cBmlYJbEFWH/data' class='colapse'>";
		generateDivTag += "<img id='"+json.id+"Expand' src='https://dhis2.asia/erar/api/documents/oHAsCkouZGS/data' class='expand' style='display:none;'>";
	}
	generateDivTag += "<a select='no'>"+json.name+"</a>";
	generateDivTag += "<div id='"+json.id+"Child' style='display:none;margin-left:10px;'>";
	
	if(json.level != 4 && json.children.length > 0){
		json.children.forEach(function(orgChild){
			generateDivTag += orgTree.generateHTML(orgChild);
		});
	}
	
	generateDivTag += "</div></div>";
	return generateDivTag;
}

// --------------------------------------------------------------