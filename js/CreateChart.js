
var periods;
var period;
var nperiod;
var periodpres;
var stringperiod_page5;
var period_page5;
var orgUnit;
var orgUnitChildrens;
var orgUnitLevel;
var stt=0;
var load=0;
var list_district;
var list_province;
var order = 0;
var StringPeriods;
var StringPreviousPeriods;
var StringNextPeriods;
var StringRefPeriods;
var flag=0;
var orgUnitid;


function startloadreport(){

	//$("#showreport").hide();
	$("#printing_page2").hide();
	$("#printing_page3").hide();
	$("#printing_page4").hide();
	$("#legend_page2").hide();

	get_period_dialog();
	
}
function get_period_dialog(){
	$( "#dialog" ).dialog({
		title: "Select Parameter",
		resizable: false,
		width:400,
		height:680,
		modal: true,
		buttons: {
			"Get report": function() {				
				orgUnitid = $("#menu").find("a[select='yes']").parent().attr("id");
				orgUnitLevel = $("#menu").find("a[select='yes']").parent().attr("level");
		
				
				var sdperiod = $("#datepicker1").val().replace("-","");
				sdperiod = sdperiod.replace("-","");
				var edperiod = $("#datepicker2").val().replace("-","");
				edperiod = edperiod.replace("-","");
				var refsdperiod = $("#datepicker3").val().replace("-","");   
				refsdperiod = refsdperiod.replace("-","");
				var refedperiod = $("#datepicker4").val().replace("-","");
				refedperiod = refedperiod.replace("-","");
				$("#periodTitle1").html("<h1>Surveillance data by district, " + $("#datepicker1").val().substring(0,7) + " to " + $("#datepicker2").val().substring(0,7) + "</h1>");
			//$("#periodTitle2").html("<h2>Year-To-Date since " + $("#datepicker1").val() + " to " + $("#datepicker2").val()+ "</h2>");
				//$("#periodTitle3").html("<h1>Number of cases, deaths and intervention data - cumulative year-to-date, " + $("#datepicker1").val().substring(0,7) + " to " + $("#datepicker2").val().substring(0,7) + "</h1>");
				$("#periodTitle3").html("<h1>Reporting completeness - cumulative year-to-date, " + $("#datepicker1").val().substring(0,7) + " to " + $("#datepicker2").val().substring(0,7) + "</h1>");
				if(orgUnitLevel == 1){
					$("#p_pageone").html("<strong>National</strong>");
					$("#d_pageone").html("<strong>Province</strong>");
					$("#p_pagetwo").html("<strong>National</strong>");
					$("#d_pagetwo").html("<strong>Province</strong>");
				}else if(orgUnitLevel == 3){
					$("#d_pageone").parent().remove();
					$("#p_pageone").parent().attr("colspan",2);
					$("#p_pageone").text("District");
					$("#d_pagetwo").remove();
					$("#p_pagetwo").attr("colspan",2);
					$("#p_pagetwo").text("District");
				}
				if(sdperiod > edperiod || refsdperiod > refedperiod){
					$("#alert").text("");
					$("#alert").text("StartDate can not greater than EndDate!!");
				}else{
					if(sdperiod == "" || edperiod == "" || refsdperiod == "" || refedperiod == "" || orgUnitid == undefined){
						$("#alert").text("");
						$("#alert").text("StartDate or EndDate or Orgunit must not be empty!!");
					}else{
						$("#showreport").show();
						var array = getDates($("#datepicker1").val(), $("#datepicker2").val() ,sdperiod);
						array = unique(array);
						StringPeriods = stringPeriods(array);
						//console.log(StringPeriods);
						var presarray = getPreviousDates($("#datepicker1").val(), $("#datepicker2").val() ,sdperiod);
						presarray = unique(presarray);
						StringPreviousPeriods = stringPeriods(presarray);
						var nextarray = getNextDates($("#datepicker1").val(), $("#datepicker2").val() ,sdperiod);
						nextarray = unique(nextarray);
						StringNextPeriods = stringPeriods(nextarray);
						//StringRefPeriods
						var refarray = getDates($("#datepicker3").val(), $("#datepicker4").val() ,sdperiod);
						refarray = unique(refarray);
						StringRefPeriods = stringPeriods(refarray);
						console.log(StringRefPeriods);
						//debugger;
						var stringyear = StringPeriods.substring(StringPeriods.length - 6 , StringPeriods.length -2);
						var refstringyear = StringRefPeriods.substring(StringPeriods.length - 6 , StringPeriods.length -2);
						//console.log(stringyear);
						periods = stringyear;
						period = periods - 1;
						var refperiod = refstringyear;
						//debugger;
						nperiod= parseInt(periods)+1;
						console.log(nperiod);
						periodpres = [stringyear-3,stringyear-2,stringyear-1];
						period_page5 = [parseInt(stringyear)-1,parseInt(stringyear),parseInt(stringyear)+1,parseInt(stringyear)+2,parseInt(stringyear)+3,parseInt(stringyear)+4];
						//console.log(period_page5);
						stringperiod_page5 = parseInt(parseInt(stringyear)-1)+";"+parseInt(stringyear)+";"+parseInt(parseInt(stringyear)+1)+";"+parseInt(parseInt(stringyear)+2)+";"+parseInt(parseInt(stringyear)+3)+";"+parseInt(parseInt(stringyear)+4);
						//console.log(stringperiod_page5);									
						$("#periodIRSdata").append(" <strong>"+periods+"</strong>");
						$("#ytdtitle").append(" <strong>"+periods+"</strong>");
						$("#yeartodate").append(" <strong>"+periods+"</strong>");
						$("#reference_period").append(" <strong>"+refperiod+"</strong>");
						$("#cy-1").append(" <strong>"+period+"</strong>");
						$("#cy").append(" <strong>"+periods+"</strong>");
						$("#cy1").append(" <strong>"+nperiod+"</strong>");			
						$("#titleyear").append(" <strong>"+periods+"</strong>");				
						//loadscreenpage_5();
						
						Chart.createChart(orgUnitid);
						$.get("https://dhis2.asia/erar/api/organisationUnits/"+orgUnitid+".json?fields=name,id",function(json){
							orgUnit = json;
							console.log(orgUnit);
							loadsurveillancedata();
							loadReport_page2(period);
							//loadReport_page3(period);
							loadReport_page4(period);
							loadscreenpage_5();
							setTimeout(calculatepercent, 1000);
						});
						
						
						
						$( this ).dialog( "close" );
					}
				}
			},
			//Cancel: function() {
			  //$( this ).dialog( "close" );
			//}
			"Exit": function(){
				window.open("https://dhis2.asia/erar","_self");
			}
		}
	});
}



function loadsurveillancedata()
{ 
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:UOuRbtMVkhI;A7EalUk0veQ;SXA2Xs1o7ct;bHbGbcbNNuc;sBjxPH05QJJ;YbO5j3XYABU;GI01FekPBoS;nTQOr93V3ac;qrPR2citBcl;todZ8BOrQJn;dqv9OGG0hzy;tgzppnN2DsG;GCbegvX9iGe;FbWnsHV5fRr;FRbgzTZ74Hh&dimension=ou:"+orgUnit.id+"&filter=pe:"+StringPeriods,function(json){
	   var string = "/api/analytics.json?dimension=dx:cOVhTyW8zN6;UOuRbtMVkhI;A7EalUk0veQ;SXA2Xs1o7ct;bHbGbcbNNuc;sBjxPH05QJJ;YbO5j3XYABU;GI01FekPBoS;nTQOr93V3ac;qrPR2citBcl;todZ8BOrQJn;dqv9OGG0hzy;tgzppnN2DsG;GCbegvX9iGe;FbWnsHV5fRr;FRbgzTZ74Hh&dimension=ou:"+orgUnit.id+"&filter=pe:"+StringPeriods;
	   console.log(string);
		json.rows.forEach(function(row){
		//debugger;	
			var idSingleElement = row[0];
			if(idSingleElement == "cOVhTyW8zN6"){
				$("#cOVhTyW8zN6-2").text(parseInt(row[2]));	
			}		
				if(idSingleElement == "dqv9OGG0hzy"){
				//debugger;
				$("#dqv9OGG0hzy-page5").text(parseInt(row[2]));	
			}	
				if(idSingleElement == "tgzppnN2DsG"){
				$("#tgzppnN2DsG-page5").text(parseInt(row[2]));	
			}	
				if(idSingleElement == "GCbegvX9iGe"){
				$("#GCbegvX9iGe-page5").text(parseInt(row[2]));	
			}	
			if($("#"+idSingleElement).length){
				$("#"+idSingleElement).text(parseInt(row[2]));			
			}			
			});
	});    
	
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:UOuRbtMVkhI;A7EalUk0veQ;dqv9OGG0hzy;tgzppnN2DsG;GCbegvX9iGe;FbWnsHV5fRr;FRbgzTZ74Hh&dimension=ou:"+orgUnit.id+"&filter=pe:"+StringPreviousPeriods,function(json){
	var string = "/api/analytics.json?dimension=dx:UOuRbtMVkhI;A7EalUk0veQ;SXA2Xs1o7ct;bHbGbcbNNuc;sBjxPH05QJJ;YbO5j3XYABU;GI01FekPBoS;dqv9OGG0hzy;tgzppnN2DsG;GCbegvX9iGe;FbWnsHV5fRr;FRbgzTZ74Hh&dimension=ou:"+orgUnit.id+"&filter=pe:"+StringPreviousPeriods;
	console.log(string);
		json.rows.forEach(function(row){
		
			var idSingleElement = row[0] +"-previous";
			if($("#"+idSingleElement).length){
				$("#"+idSingleElement).text(parseInt(row[2]));			
			}
			});
			//flag++;
	});
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:SXA2Xs1o7ct;YbO5j3XYABU;GI01FekPBoS;bHbGbcbNNuc;sBjxPH05QJJ&dimension=ou:"+orgUnit.id+"&filter=pe:"+StringRefPeriods,function(json){
	var string = "/api/analytics.json?dimension=dx:SXA2Xs1o7ct;YbO5j3XYABU;GI01FekPBoS;bHbGbcbNNuc;sBjxPH05QJJ&dimension=ou:"+orgUnit.id+"&filter=pe:"+StringRefPeriods;
	console.log(string);
		json.rows.forEach(function(row){
		
			var idSingleElement = row[0] +"-previous";
			if($("#"+idSingleElement).length){
				$("#"+idSingleElement).text(parseInt(row[2]));			
			}
			});
			//flag++;
	});
	//SXA2Xs1o7ct;YbO5j3XYABU;GI01FekPBoS;bHbGbcbNNuc;sBjxPH05QJJ
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:dqv9OGG0hzy;tgzppnN2DsG;GCbegvX9iGe;FbWnsHV5fRr;FRbgzTZ74Hh&dimension=ou:"+orgUnit.id+"&filter=pe:"+StringNextPeriods,function(json){
	
		json.rows.forEach(function(row){
		
			var idSingleElement = row[0] +"-next";
			if($("#"+idSingleElement).length){
				$("#"+idSingleElement).text(parseInt(row[2]));			
			}
			});
			
	});
	
		$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:cOVhTyW8zN6&dimension=ou:"+orgUnit.id+"&filter=pe:"+periods,function(json){
		var string = "/api/analytics.json?dimension=dx:cOVhTyW8zN6&dimension=ou:"+orgUnit.id+"&filter=pe:"+periods;
		console.log(string);
		json.rows.forEach(function(row){
		
			var idSingleElement = row[0];
				if(idSingleElement == "cOVhTyW8zN6"){
				$("#cOVhTyW8zN6-2").text(parseInt(row[2]));	
			}	
			if($("#"+idSingleElement).length){
				$("#"+idSingleElement).text(parseInt(row[2]));			
			}
			});
			//flag++;
	});
	
}

function calculatepercent(){   
	var confirmcasesreduction = ConvertToNumber($("#SXA2Xs1o7ct-previous").text()) - ConvertToNumber($("#SXA2Xs1o7ct").text());
	//debugger;
	$("#SXA2Xs1o7ct-reduction").text(parseFloat(ConvertToNumber(ConvertToNumber(confirmcasesreduction) / ConvertToNumber($("#SXA2Xs1o7ct-previous").text()))* 100).toFixed(2));
	
		var annualparasiteapireduction = ConvertToNumber($("#YbO5j3XYABU-previous").text()) - ConvertToNumber($("#YbO5j3XYABU").text());
	$("#YbO5j3XYABU-reduction").text(parseFloat(ConvertToNumber(ConvertToNumber(annualparasiteapireduction) / ConvertToNumber($("#YbO5j3XYABU-previous").text()))* 100).toFixed(2));
	
	var tprreduction = ConvertToNumber($("#GI01FekPBoS-previous").text()) - ConvertToNumber($("#GI01FekPBoS").text());
	$("#GI01FekPBoS-reduction").text(parseFloat(ConvertToNumber(ConvertToNumber(tprreduction) / ConvertToNumber($("#GI01FekPBoS-previous").text()))* 100).toFixed(2));
	
	var inpatientmalariacasesreduction = ConvertToNumber($("#bHbGbcbNNuc-previous").text()) - ConvertToNumber($("#bHbGbcbNNuc").text());
	$("#bHbGbcbNNuc-reduction").text(parseFloat(ConvertToNumber(ConvertToNumber(inpatientmalariacasesreduction) / ConvertToNumber($("#bHbGbcbNNuc-previous").text()))* 100).toFixed(2));
	
	var inpatientmalariadeathsreduction = ConvertToNumber($("#sBjxPH05QJJ-previous").text()) - ConvertToNumber($("#sBjxPH05QJJ").text());
	$("#sBjxPH05QJJ-reduction").text(parseFloat(ConvertToNumber(ConvertToNumber(inpatientmalariadeathsreduction) / ConvertToNumber($("#sBjxPH05QJJ-previous").text()))* 100).toFixed(2));
	
	legend_1($("#SXA2Xs1o7ct-reduction"));
	legend_1($("#YbO5j3XYABU-reduction"));
	legend_1($("#GI01FekPBoS-reduction"));
	legend_1($("#bHbGbcbNNuc-reduction"));
	legend_1($("#sBjxPH05QJJ-reduction"));
	runlegend();
}
//   
function ConvertToNumber(Object){
	if(Object=="" || isNaN(Object) == true){
		return 0;
	}else return parseFloat(Object,2);
}

function runlegend(){
	legend_2($("#dqv9OGG0hzy"));
	legend_2($("#dqv9OGG0hzy-previous"));
	legend_2($("#dqv9OGG0hzy-next"));
	legend_2($("#dqv9OGG0hzy-page5"));
	legend_3($("#tgzppnN2DsG"));
	legend_3($("#tgzppnN2DsG-previous"));
	legend_3($("#tgzppnN2DsG-next"));
	legend_3($("#tgzppnN2DsG-page5"));
	legend_4($("#GCbegvX9iGe"));
	legend_4($("#GCbegvX9iGe-previous"));
	legend_4($("#GCbegvX9iGe-next"));
	legend_4($("#GCbegvX9iGe-page5"));
}
//         
function legend_1(tdTag){
	var value = parseInt(tdTag.text());
	if(!isNaN(value)){
		if( value < 0 ) tdTag.css('background-color', 'red');
		else if( ( value >= 0 ) && ( value < 50 ) ) tdTag.css('background-color', 'yellow');
		else tdTag.css('background-color', '#00CC33');
	}
}
function legend_2(tdTag){
	var value = parseInt(tdTag.text());
	if(!isNaN(value)){
		if( value < 30 ) tdTag.css('background-color', 'red');
		else if( ( value >= 30 ) && ( value < 50 ) ) tdTag.css('background-color', 'yellow');
		else tdTag.css('background-color', '#00CC33');
	}
}
function legend_3(tdTag){
	var value = parseInt(tdTag.text());
	if(!isNaN(value)){
		if( value < 30 ) tdTag.css('background-color', '#00CC33');
		else if( ( value >= 30 ) && ( value < 50 ) ) tdTag.css('background-color', 'yellow');
		else tdTag.css('background-color', 'red');
	}
}
function legend_4(tdTag){
	var value = parseInt(tdTag.text());
	if(!isNaN(value)){
		if( value < 20 ) tdTag.css('background-color', '#00CC33');
		else if( ( value >= 20 ) && ( value < 50 ) ) tdTag.css('background-color', 'yellow');
		else tdTag.css('background-color', 'red');
	}
}

function getDates(startDate, stopDate,sdperiod) {
	var dateArray = new Array();
	var start = new Date(startDate);
	var end = new Date(stopDate);
	dateArray.push(sdperiod.substring(0,6));
	while(start < end){
		//alert(start);           
		var newDate = start.setDate(start.getDate() + 1);
		start = new Date(newDate);
		var datestring = start.getFullYear() + "" + ("0"+(start.getMonth()+1)).slice(-2);

		dateArray.push(datestring);
	}
	console.log(dateArray);
	return dateArray;
}

function getPreviousDates(startDate, stopDate,sdperiod) {
	var dateArray = new Array();
	var start = new Date(startDate);
	var end = new Date(stopDate);
	// dateArray.push(sdperiod.substring(0,6));
	while(start < end){
		//alert(start);           
		var newDate = start.setDate(start.getDate() + 1);
		start = new Date(newDate);
		var datestring = (start.getFullYear()-1) + "" + ("0"+(start.getMonth()+1)).slice(-2);

		dateArray.push(datestring);
	}
	return dateArray;
}

function getNextDates(startDate, stopDate,sdperiod) {
	var dateArray = new Array();
	var start = new Date(startDate);
	var end = new Date(stopDate);
	// dateArray.push(sdperiod.substring(0,6));
	while(start < end){
		//alert(start);           
		var newDate = start.setDate(start.getDate() + 1);
		start = new Date(newDate);
		var datestring = (start.getFullYear()+1) + "" + ("0"+(start.getMonth()+1)).slice(-2);

		dateArray.push(datestring);
	}
	return dateArray;
}

function loadscreenpage_5(){
		//period_page5
		//var html_Report= "<table width='100%' border='1'><tr bgcolor='#999999' ><td colspan='2'><strong>Funding(USD)</strong></td><td align='center'><strong>"+period_page5[0]+"</strong></td><td align='center'><strong>"+period_page5[1]+"</strong></td><td align='center'><strong>"+period_page5[2]+"</strong></td><td align='center'><strong>"+period_page5[3]+"</strong></td><td align='center'><strong>"+period_page5[4]+"</strong></td><td align='center'><strong>"+period_page5[5]+"</strong></td><td align='center'><strong>% in current year</strong></td></tr><tr><td colspan='2'><strong>Total needs </strong></td><td id='" + period_page5[0] + "-FRbgzTZ74Hh' align='center'></td><td id='" + period_page5[1] + "-FRbgzTZ74Hh' align='center'></td><td id='" + period_page5[2] + "-FRbgzTZ74Hh' align='center'></td><td id='" + period_page5[3] + "-FRbgzTZ74Hh' align='center'></td><td id='" + period_page5[4] + "-FRbgzTZ74Hh' align='center'></td><td id='" + period_page5[5] + "-FRbgzTZ74Hh' align='center'></td><td></td></tr><tr><td rowspan='2'><strong>Available</strong></td><td><strong>Domestic funding </strong></td><td id='" + period_page5[0] + "-EpyvZBsqMmM'align='center'></td><td id='" + period_page5[1] + "-EpyvZBsqMmM' align='center'></td><td id='" + period_page5[2] + "-EpyvZBsqMmM' align='center'></td><td id='" + period_page5[3] + "-EpyvZBsqMmM' align='center'></td><td id='" + period_page5[4] + "-EpyvZBsqMmM' align='center'></td><td id='" + period_page5[5] + "-EpyvZBsqMmM' align='center'></td><td id='dqv9OGG0hzy-page5' align='center'></td></tr><tr><td><strong>External funding </strong></td><td id='" + period_page5[0] + "-tpz77FcntKx' align='center'></td><td id='" + period_page5[1] + "-tpz77FcntKx' align='center'></td><td id='" + period_page5[2] + "-tpz77FcntKx' align='center'></td><td id='" + period_page5[3] + "-tpz77FcntKx' align='center'></td><td id='" + period_page5[4] + "-tpz77FcntKx' align='center'></td><td id='" + period_page5[5] + "-tpz77FcntKx' align='center'></td><td id='tgzppnN2DsG-page5' align='center'></td></tr><tr><td colspan='2'><strong>Net Gap </strong></td><td id='" + period_page5[0] + "-FbWnsHV5fRr' align='center'></td><td id='" + period_page5[1] + "-FbWnsHV5fRr' align='center'></td><td id='" + period_page5[2] + "-FbWnsHV5fRr' align='center'></td><td id='" + period_page5[3] + "-FbWnsHV5fRr' align='center'></td><td id='" + period_page5[4] + "-FbWnsHV5fRr' align='center'></td><td id='" + period_page5[5] + "-FbWnsHV5fRr' align='center'></td><td id='GCbegvX9iGe-page5' align='center'></td></tr><tr><td rowspan='3'><strong>External Source </strong></td><td><strong>Global fund </strong></td><td id='" + period_page5[0] + "-tpz77FcntKx-uziFeCsVwc3' align='center'></td><td id='" + period_page5[1] + "-tpz77FcntKx-uziFeCsVwc3' align='center'></td><td id='" + period_page5[2] + "-tpz77FcntKx-uziFeCsVwc3' align='center'></td><td id='" + period_page5[3] + "-tpz77FcntKx-uziFeCsVwc3' align='center'></td><td id='" + period_page5[4] + "-tpz77FcntKx-uziFeCsVwc3' align='center'></td><td id='" + period_page5[5] + "-tpz77FcntKx-uziFeCsVwc3' align='center'></td><td></td></tr><tr><td><strong>PMI/USAID</strong></td><td id='" + period_page5[0] + "-tpz77FcntKx-w5tUeLi87qA' align='center'></td><td id='" + period_page5[1] + "-tpz77FcntKx-w5tUeLi87qA' align='center'></td><td id='" + period_page5[2] + "-tpz77FcntKx-w5tUeLi87qA' align='center'></td><td id='" + period_page5[3] + "-tpz77FcntKx-w5tUeLi87qA' align='center'></td><td id='" + period_page5[4] + "-tpz77FcntKx-w5tUeLi87qA' align='center'></td><td id='" + period_page5[5] + "-tpz77FcntKx-w5tUeLi87qA' align='center'></td><td></td></tr><tr><td><strong>Other</strong></td><td id='" + period_page5[0] + "-tpz77FcntKx-cNxbx5BoZlE' align='center'></td><td id='" + period_page5[1] + "-tpz77FcntKx-cNxbx5BoZlE' align='center'></td><td id='" + period_page5[2] + "-tpz77FcntKx-cNxbx5BoZlE' align='center'></td><td id='" + period_page5[3] + "-tpz77FcntKx-cNxbx5BoZlE' align='center'></td><td id='" + period_page5[4] + "-tpz77FcntKx-cNxbx5BoZlE' align='center'></td><td id='" + period_page5[5] + "-tpz77FcntKx-cNxbx5BoZlE' align='center'></td><td></td></tr></table>";
		//debugger;
		//$("#printing_page4").append(html_Report);
		loaddata_page5();
}

function loaddata_page5(){
	
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:FRbgzTZ74Hh;EpyvZBsqMmM;tpz77FcntKx;FbWnsHV5fRr&dimension=ou:"+orgUnit.id+"&dimension=pe:"+stringperiod_page5,function(json){
	var string ="https://dhis2.asia/erar/api/analytics.json?dimension=dx:FRbgzTZ74Hh;EpyvZBsqMmM;tpz77FcntKx;FbWnsHV5fRr&dimension=ou:"+orgUnit.id+"&dimension=pe:"+stringperiod_page5;
	console.log(string);
		json.rows.forEach(function(row){
		
			var idSingleElement = row[2] +"-" +row[0];
			if($("#"+idSingleElement).length){
				$("#"+idSingleElement).text(parseInt(row[3]));			
			}
			});
	});
	
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=co&dimension=dx:tpz77FcntKx&dimension=ou:"+orgUnit.id+"&dimension=pe:"+stringperiod_page5,function(json){
		var string = "https://dhis2.asia/erar/api/analytics.json?dimension=co&dimension=dx:tpz77FcntKx&dimension=ou:"+orgUnit.id+"&dimension=pe:"+stringperiod_page5;
		console.log(string);
		json.rows.forEach(function(row){
		
			var idSingleElement = row[3] +"-" + row[0] + "-" +row[1];
			if($("#"+idSingleElement).length){
				$("#"+idSingleElement).text(parseInt(row[4]));			
			}
			});
	});
	
}


function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

function stringPeriods(DEs){
	var result="";
	var temp=0;
	DEs.forEach(function(DE){
		if(temp==0){
			result+=DE;
		}else{
			result+=";"+DE;
		}
		temp++;
	});
	return result;
}

function loadReport_page2(period){
	$.get("https://dhis2.asia/erar/api/organisationUnits/"+orgUnitid+".json?fields=children[id,name,level]",function(json){
			orgUnitChildrens = json;			
				orgUnitChildrens.children.forEach(function(child){
					loadScreen_page2(child,period);
				});
		});
}

function loadScreen_page2(orgUnit,period){
	var htmlRow = "<tr class='subTotal'><td>" + orgUnit.name + "</td><td align='center' id='" + orgUnit.id + "-pop'>-</td><td align='center' id='" + orgUnit.id + "-OPDconfRef'>-</td><td align='center' id='" + orgUnit.id + "-OPDconfCur'>-</td><td align='center' id='" + orgUnit.id + "-OPDconfDecl'>-</td><td align='center' id='" + orgUnit.id + "-incRef'>-</td><td align='center' id='" + orgUnit.id + "-incCur'>-</td><td align='center' id='" + orgUnit.id + "-incDecl'>-</td><td align='center' id='" + orgUnit.id + "-tprRef'>-</td><td align='center' id='" + orgUnit.id + "-tprCur'>-</td><td align='center' id='" + orgUnit.id + "-tprDecl'>-</td><td align='center' id='" + orgUnit.id + "-ABER'>-</td><td align='center' id='" + orgUnit.id + "-TestedSuspected'>-</td><td align='center' id='" + orgUnit.id + "-IPDconfRef'>-</td><td align='center' id='" + orgUnit.id + "-IPDconfCur'>-</td><td align='center' id='" + orgUnit.id + "-IPDconfDecl'>-</td><td align='center' id='" + orgUnit.id + "-deathRef'>-</td><td align='center' id='" + orgUnit.id + "-deathCur'>-</td><td align='center' id='" + orgUnit.id + "-deathDecl'>-</td></tr>";
	var orgUnitID = orgUnit.id;
	$.get("https://dhis2.asia/erar/api/organisationUnits/" + orgUnit.id + ".json?fields=children[id,name]", function(json){
		sortAfbe(json.children);
		json.children.forEach(function(childOrg){
			htmlRow += "<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;" + childOrg.name + "</td><td align='center' id='" + childOrg.id + "-pop'>-</td><td align='center' id='" + childOrg.id + "-OPDconfRef'>-</td><td align='center' id='" + childOrg.id + "-OPDconfCur'>-</td><td align='center' id='" + childOrg.id + "-OPDconfDecl'>-</td><td align='center' id='" + childOrg.id + "-incRef'>-</td><td align='center' id='" + childOrg.id + "-incCur'>-</td><td align='center' id='" + childOrg.id + "-incDecl'>-</td><td align='center' id='" + childOrg.id + "-tprRef'>-</td><td align='center' id='" + childOrg.id + "-tprCur'>-</td><td align='center' id='" + childOrg.id + "-tprDecl'>-</td><td align='center' id='" + childOrg.id + "-ABER'>-</td><td align='center' id='" + childOrg.id + "-TestedSuspected'>-</td><td align='center' id='" + childOrg.id + "-IPDconfRef'>-</td><td align='center' id='" + childOrg.id + "-IPDconfCur'>-</td><td align='center' id='" + childOrg.id + "-IPDconfDecl'>-</td><td align='center' id='" + childOrg.id + "-deathRef'>-</td><td align='center' id='" + childOrg.id + "-deathCur'>-</td><td align='center' id='" + childOrg.id + "-deathDecl'>-</td></tr>";
			orgUnitID += ";" + childOrg.id;
		});
		//debugger;
		$("#printing_page2 table").append(htmlRow);
		loadValue_page2(orgUnitID,period);
	});
}

function loadValue_page2(orgUnitID,period){
	/*
	cOVhTyW8zN6 Population at risk
	SXA2Xs1o7ct Malaria confirmed cases
	B5SRtq4eQPC Malaria tested cases
	HP4ut265Jhp Suspected cases
	bHbGbcbNNuc Inpatient malaria cases
	sBjxPH05QJJ Inpatient malaria deaths
	*/
	
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:SXA2Xs1o7ct;bHbGbcbNNuc;sBjxPH05QJJ&dimension=ou:" + orgUnitID + "&filter=pe:" + StringRefPeriods,function(json){
	//var string = "/api/analytics.json?dimension=dx:SXA2Xs1o7ct;bHbGbcbNNuc;sBjxPH05QJJ&dimension=ou:" + orgUnitID + "&filter=pe:" + period[1] ;
	//console.log(string);
		json.rows.forEach(function(row){
			if(row[0] == 'SXA2Xs1o7ct') $("#" + row[1] + "-OPDconfRef").text(parseInt(row[2]));
			if(row[0] == 'bHbGbcbNNuc') $("#" + row[1] + "-IPDconfRef").text(parseInt(row[2]));
			if(row[0] == 'sBjxPH05QJJ') $("#" + row[1] + "-deathRef").text(parseInt(row[2]));
		});
		calDecline(json.metaData.ou);
	});
	
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:cOVhTyW8zN6;SXA2Xs1o7ct;B5SRtq4eQPC;HP4ut265Jhp;bHbGbcbNNuc;sBjxPH05QJJ&dimension=ou:" + orgUnitID + "&filter=pe:" + StringPeriods,function(json){
	//var string = "/api/analytics.json?dimension=dx:cOVhTyW8zN6;SXA2Xs1o7ct;B5SRtq4eQPC;HP4ut265Jhp;bHbGbcbNNuc;sBjxPH05QJJ&dimension=ou:" + orgUnitID + "&filter=pe:" + period[0] ;
	//console.log(string);
		json.rows.forEach(function(row){
			if(row[0] == 'cOVhTyW8zN6') $("#" + row[1] + "-pop").text(parseInt(row[2]));
			if(row[0] == 'SXA2Xs1o7ct') $("#" + row[1] + "-OPDconfCur").text(parseInt(row[2]));
			//if(row[0] == 'B5SRtq4eQPC') $("#" + row[1] + "-pop").text(row[2]);
			if(row[0] == 'HP4ut265Jhp') calTestedSuspected(row,json.rows);
			if(row[0] == 'bHbGbcbNNuc') $("#" + row[1] + "-IPDconfCur").text(parseInt(row[2]));
			if(row[0] == 'sBjxPH05QJJ') $("#" + row[1] + "-deathCur").text(parseInt(row[2]));
		});
		calDecline(json.metaData.ou);
	});
}

function calDecline(orgs){
	orgs.forEach(function(org){
		var OPDconfRef = parseInt($("#" + org + "-OPDconfRef").text());
		var OPDconfCur = parseInt($("#" + org + "-OPDconfCur").text());
		var IPDconfRef = parseInt($("#" + org + "-IPDconfRef").text());
		var IPDconfCur = parseInt($("#" + org + "-IPDconfCur").text());
		var deathRef = parseInt($("#" + org + "-deathRef").text());
		var deathCur = parseInt($("#" + org + "-deathCur").text());
		
		if( isNaN(OPDconfRef) || isNaN(OPDconfCur) ) $("#" + org + "-OPDconfDecl").text("-");
		else if ( OPDconfRef == 0 || OPDconfRef < OPDconfCur ) $("#" + org + "-OPDconfDecl").text("-");
		else $("#" + org + "-OPDconfDecl").text(parseInt(((OPDconfRef-OPDconfCur)/OPDconfRef)*100));
		
		if( isNaN(IPDconfRef) || isNaN(IPDconfCur) ) $("#" + org + "-IPDconfDecl").text("-");
		else if ( IPDconfRef == 0 || IPDconfRef < IPDconfCur ) $("#" + org + "-IPDconfDecl").text("-");
		else $("#" + org + "-IPDconfDecl").text(parseInt(((IPDconfRef-IPDconfCur)/IPDconfRef)*100));
		
		if( isNaN(deathRef) || isNaN(deathCur) ) $("#" + org + "-deathDecl").text("-");
		else if ( deathRef == 0 || deathRef < deathCur ) $("#" + org + "-deathDecl").text("-");
		else $("#" + org + "-deathDecl").text(parseInt(((deathRef-deathCur)/deathRef)*100));
		
		legend_Decline($("#" + org + "-OPDconfDecl"));
		legend_Decline($("#" + org + "-IPDconfDecl"));
		legend_Decline($("#" + org + "-deathDecl"));
	});
}

function calTestedSuspected(row,rows){
	rows.forEach(function(record){
		if(record[0] == 'B5SRtq4eQPC' && record[1] == row[1]){
			var result = parseInt((parseInt(record[2])/parseInt(row[2]))*100);
			$("#" + row[1] + "-TestedSuspected").text(result + "%");
			legend_TestedSuspected($("#" + row[1] + "-TestedSuspected"));
		}
	});
}

function legend_Decline(tdTag){
	var value = parseInt(tdTag.text());
	if(!isNaN(value)){
		if( value < 0 ) tdTag.css('background-color', 'red');
		else if( ( value >= 0 ) && ( value < 50 ) ) tdTag.css('background-color', 'yellow');
		else tdTag.css('background-color', '#00CC33');
	}
}

function legend_TestedSuspected(tdTag){
	var value = parseInt(tdTag.text());
	if(!isNaN(value)){
		if( value < 50 ) tdTag.css('background-color', 'red');
		else if( ( value >= 50 ) && ( value < 80 ) ) tdTag.css('background-color', 'yellow');
		else tdTag.css('background-color', '#00CC33');
	}
}

function sortAfbe(list){
	list.sort(function(a, b){
		if(a.name < b.name) return -1;
		if(a.name > b.name) return 1;
		return 0;
	})
}

function loadReport_page3(period){
	$.get("https://dhis2.asia/erar/api/organisationUnits/"+orgUnitid+".json?fields=children[id,name,level]",function(json){
			orgUnitChildrens = json;			
				orgUnitChildrens.children.forEach(function(child){
					loadScreen_page3(child,period);
				});
		});
}

function loadScreen_page3(orgUnit,period){
	var htmlRow = "<tr class='subTotal'>" +
		"<td>" + orgUnit.name + "</td>" +
		"<td align='center' id='" + orgUnit.id + "-cOVhTyW8zN6'>-</td>" +
		"<td align='center' id='" + orgUnit.id + "-Bniurudiguf'>-</td>" +
		"<td align='center' id='" + orgUnit.id + "-YuxTSTCNiIF'>-</td>" +
		"<td align='center' id='" + orgUnit.id + "-S58UYwieXhw'>-</td>" +
		"<td align='center' id='" + orgUnit.id + "-mDrc8J4WbnF'>-</td>" +
		"<td align='center'>-</td>" +
		"<td align='center'>-</td>" +
		"<td align='center'>-</td>" +
		"<td align='center'>-</td>" +
		"<td align='center' id='" + orgUnit.id + "-VxAkjvBMvfp'>-</td>" +
		"<td align='center' id='" + orgUnit.id + "-o0fGSq0Sebd'>-</td>" +
		"<td align='center' id='" + orgUnit.id + "-M91K9z70dl4'>-</td>" +
		"<td align='center' id='" + orgUnit.id + "-xiHTf2TK2G5'>-</td>" +
		"<td align='center' id='" + orgUnit.id + "-QUk2XwhVL7n'>-</td>" +
		"<td align='center' id='" + orgUnit.id + "-h9DNhuHHgkH'>-</td>" +
		"<td align='center' id='" + orgUnit.id + "-UOuRbtMVkhI'>-</td>" +
		"<td align='center' id='" + orgUnit.id + "-H2UGZrTyijj'>-</td>" +
		"<td align='center' id='" + orgUnit.id + "-A1o8U4zmzvA'>-</td>" +
		"<td align='center' id='" + orgUnit.id + "-svCTfSjAiZy'>-</td>" +
		"<td align='center' id='" + orgUnit.id + "-IGVgCwUaaVz'>-</td>" +
	"</tr>";
	var orgUnitID = orgUnit.id;
	$.get("https://dhis2.asia/erar/api/organisationUnits/" + orgUnit.id + ".json?fields=children[id,name]", function(json){
		sortAfbe(json.children);
		json.children.forEach(function(childOrg){
			htmlRow += "<tr>" +
				"<td>&nbsp;&nbsp;&nbsp;&nbsp;" + childOrg.name + "</td>" +
				"<td align='center' id='" + childOrg.id + "-cOVhTyW8zN6'>-</td>" +
				"<td align='center' id='" + childOrg.id + "-Bniurudiguf'>-</td>" +
				"<td align='center' id='" + childOrg.id + "-YuxTSTCNiIF'>-</td>" +
				"<td align='center' id='" + childOrg.id + "-S58UYwieXhw'>-</td>" +
				"<td align='center' id='" + childOrg.id + "-mDrc8J4WbnF'>-</td>" +
				"<td align='center'>-</td>" +
				"<td align='center'>-</td>" +
				"<td align='center'>-</td>" +
				"<td align='center'>-</td>" +
				"<td align='center' id='" + childOrg.id + "-VxAkjvBMvfp'>-</td>" +
				"<td align='center' id='" + childOrg.id + "-o0fGSq0Sebd'>-</td>" +
				"<td align='center' id='" + childOrg.id + "-M91K9z70dl4'>-</td>" +
				"<td align='center' id='" + childOrg.id + "-xiHTf2TK2G5'>-</td>" +
				"<td align='center' id='" + childOrg.id + "-QUk2XwhVL7n'>-</td>" +
				"<td align='center' id='" + childOrg.id + "-h9DNhuHHgkH'>-</td>" +
				"<td align='center' id='" + childOrg.id + "-UOuRbtMVkhI'>-</td>" +
				"<td align='center' id='" + childOrg.id + "-H2UGZrTyijj'>-</td>" +
				"<td align='center' id='" + childOrg.id + "-A1o8U4zmzvA'>-</td>" +
				"<td align='center' id='" + childOrg.id + "-svCTfSjAiZy'>-</td>" +
				"<td align='center' id='" + childOrg.id + "-IGVgCwUaaVz'>-</td>" +
			"</tr>";
			orgUnitID += ";" + childOrg.id;
		});
		$("#printing_page3 table").append(htmlRow);
		loadDEValue_page3(orgUnitID,period);
	});
}

function loadDEValue_page3(orgUnitID,period){

	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:cOVhTyW8zN6;Bniurudiguf;YuxTSTCNiIF;S58UYwieXhw;mDrc8J4WbnF;o0fGSq0Sebd;M91K9z70dl4;QUk2XwhVL7n;h9DNhuHHgkH;UOuRbtMVkhI;H2UGZrTyijj;svCTfSjAiZy;VxAkjvBMvfp;xiHTf2TK2G5;A1o8U4zmzvA;IGVgCwUaaVz&dimension=ou:" + orgUnitID + "&filter=pe:" + StringPeriods,function(json){
		json.rows.forEach(function(row){
			$("#"+row[1]+"-"+row[0]).text(row[2]);
			legend($("#"+row[1]+"-"+row[0]));
		});
	});
}

function legend(tdTag){
	var value = parseInt(tdTag.text());
	if(!isNaN(value)){
		if( value < 0 ) tdTag.css('background-color', 'red');
		else if( ( value >= 0 ) && ( value < 50 ) ) tdTag.css('background-color', 'yellow');
		else tdTag.css('background-color', '#00CC33');
	}
}

function loadReport_page4(period){
	$.get("https://dhis2.asia/erar/api/organisationUnits/"+orgUnitid+".json?fields=children[id,name,level]",function(json){
			orgUnitChildrens = json;			
				orgUnitChildrens.children.forEach(function(child){
					loadScreen_page4(child,period);
				});
		});
}

function loadScreen_page4(orgUnit,period){
	var htmlRow = "<tr class='subTotal'><td>" + orgUnit.name + "</td><td align='center' id='" + orgUnit.id + "-IVf0LfRTMw7-AKjxxgkRszX'>-</td><td align='center' id='" + orgUnit.id + "-cEKPBNNMixF-AKjxxgkRszX'>-</td><td align='center' id='" + orgUnit.id + "-jTaNUBlNKno'>-</td><td align='center' id='" + orgUnit.id + "-IVf0LfRTMw7-IeidctLwvlG'>-</td><td align='center' id='" + orgUnit.id + "-cEKPBNNMixF-IeidctLwvlG'>-</td><td align='center' id='" + orgUnit.id + "-oxchlsKmCsw'>-</td><td align='center' id='" + orgUnit.id + "-IVf0LfRTMw7-xxetaGJsy2G'>-</td><td align='center' id='" + orgUnit.id + "-cEKPBNNMixF-xxetaGJsy2G'>-</td><td align='center' id='" + orgUnit.id + "-Mrrq4nvR3eI'>-</td><td align='center' id='" + orgUnit.id + "-IVf0LfRTMw7-AAHlcRlwnGN'>-</td><td align='center' id='" + orgUnit.id + "-cEKPBNNMixF-AAHlcRlwnGN'>-</td><td align='center' id='" + orgUnit.id + "-FhHSklU7riQ'>-</td></tr>";
	var orgUnitID = orgUnit.id;
	$.get("https://dhis2.asia/erar/api/organisationUnits/" + orgUnit.id + ".json?fields=children[id,name]", function(json){
		sortAfbe(json.children);
		json.children.forEach(function(childOrg){
			htmlRow += "<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;" + childOrg.name + "</td><td align='center' id='" + childOrg.id + "-IVf0LfRTMw7-AKjxxgkRszX'>-</td><td align='center' id='" + childOrg.id + "-cEKPBNNMixF-AKjxxgkRszX'>-</td><td align='center' id='" + childOrg.id + "-jTaNUBlNKno'>-</td><td align='center' id='" + childOrg.id + "-IVf0LfRTMw7-IeidctLwvlG'>-</td><td align='center' id='" + childOrg.id + "-cEKPBNNMixF-IeidctLwvlG'>-</td><td align='center' id='" + childOrg.id + "-oxchlsKmCsw'>-</td><td align='center' id='" + childOrg.id + "-IVf0LfRTMw7-xxetaGJsy2G'>-</td><td align='center' id='" + childOrg.id + "-cEKPBNNMixF-xxetaGJsy2G'>-</td><td align='center' id='" + childOrg.id + "-Mrrq4nvR3eI'>-</td><td align='center' id='" + childOrg.id + "-IVf0LfRTMw7-AAHlcRlwnGN'>-</td><td align='center' id='" + childOrg.id + "-cEKPBNNMixF-AAHlcRlwnGN'>-</td><td align='center' id='" + childOrg.id + "-FhHSklU7riQ'>-</td></tr>";
			orgUnitID += ";" + childOrg.id;
		});
		$("#printing_page4 table").append(htmlRow);
		loadDEValue_page4(orgUnitID,period);
	});
}

function loadDEValue_page4(orgUnitID,period){
	
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:cEKPBNNMixF;IVf0LfRTMw7&dimension=co&dimension=ou:" + orgUnitID + "&filter=pe:" + StringPeriods,function(json){
		json.rows.forEach(function(row){
			$("#"+row[2]+"-"+row[0]+"-"+row[1]).text(row[3]);
			//legend_page4($("#"+row[2]+"-"+row[0]+"-"+row[1]));
		});
	});
	
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:FhHSklU7riQ;Mrrq4nvR3eI;oxchlsKmCsw;jTaNUBlNKno&dimension=ou:" + orgUnitID + "&filter=pe:" + StringPeriods,function(json){
		json.rows.forEach(function(row){
			$("#"+row[1]+"-"+row[0]).text(row[2]);
			legend_page4($("#"+row[1]+"-"+row[0]));
		});
	});
}

function legend_page4(tdTag){
	var value = parseInt(tdTag.text());
	if(!isNaN(value)){
		if( value < 0 ) tdTag.css('background-color', 'red');
		else if( ( value >= 0 ) && ( value < 50 ) ) tdTag.css('background-color', 'yellow');
		else tdTag.css('background-color', '#00CC33');
	}
}

function page1open(){
	$("#printing").show();
	$("#printing_page2").hide();
	$("#printing_page3").hide();
	$("#printing_page4").hide();
	$("#legend_page2").hide();
}

function page2open(){
	$("#printing").hide();
	$("#printing_page2").show();
	$("#printing_page3").hide();
	$("#printing_page4").hide();
	$("#legend_page2").show();
}

function page3open(){
	$("#printing").hide();
	$("#printing_page2").hide();
	$("#printing_page3").show();
	$("#printing_page4").hide();
	$("#legend_page2").hide();
}

function page4open(){
	$("#printing").hide();
	$("#printing_page2").hide();
	$("#printing_page3").hide();
	$("#printing_page4").show();
	$("#legend_page2").hide();
}

function openallpage(){
	$("#printing").show();
	$("#printing_page2").show();
	$("#printing_page3").show();
	$("#printing_page4").show();
	$("#legend_page2").show();
}

//-- Make Chart ------------------------------------
function Chart(){}


// load all charts
Chart.createChart = function(OUID){

$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:J06o672aumY;kRasaq1REFp&dimension=pe:201201;201205;201209;201301;201305;201309;201401;201405;201409;201501;201505;201509&filter=ou:"+OUID,function(json){
		Chart.lineChart("chart1","Opd and Non-OPD Malaria",json.metaData.pe,Chart.getValueChart(json));
	});
	
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:lL9BxL5FSNv;v0WZQQ6gKAX&dimension=pe:201201;201204;201207;201210;201301;201304;201307;201310;201401;201404;201407;201410;201501;201504;201507;201510&filter=ou:"+OUID,function(json){
		Chart.lineChart("chart4","Malaria and Non-Malaria IPD",json.metaData.pe,Chart.getValueChart(json));
	});
	
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:FHm610XVh02;GxlrIgMyEf4&dimension=pe:201201;201204;201207;201210;201301;201304;201307;201310;201401;201404;201407;201410;201501;201504;201507;201510&filter=ou:"+OUID,function(json){
		Chart.lineChart("chart3","Malaria and Non-Malaria Deaths",json.metaData.pe,Chart.getValueChart(json));
	});
	
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:enVf9I39FRZ;DPNsg3wjxGm&dimension=pe:201202;201205;201208;201211;201302;201305;201308;201311;201402;201405;201408;201411;201502;201505;201508;201511&filter=ou:"+OUID,function(json){
		Chart.lineChart("chart2","Microscopy tested and positive",json.metaData.pe,Chart.getValueChart(json));
	});
	
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:EiWBxnS9wmk;AF99VXqV5Fe;wWgVrEeKPiR&dimension=pe:201201;201204;201207;201210;201301;201304;201307;201310;201401;201404;201407;201410;201501;201504;201507;201510&filter=ou:"+OUID,function(json){
		Chart.columnChart("chart5","Malaria as proportion of OPD, IPD and Deaths",json.metaData.pe,Chart.getValueChart(json));
	});
	
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:aGUbtKliYp7;jggDrQqlUut&dimension=pe:201201;201204;201207;201210;201301;201304;201307;201310;201401;201404;201407;201410;201501;201504;201507;201510&filter=ou:"+OUID,function(json){
		Chart.lineChart("chart6","TPR Mic and TPR RDT",json.metaData.pe,Chart.getValueChart(json));
	});
}
// make value object
Chart.getValueChart = function(json){
	var data = [];
	json.metaData.dx.forEach(function(de){
		var nameDE = json.metaData.names[de];
		var val = [];
		json.metaData.pe.forEach(function(peVal){
			json.rows.forEach(function(row){
				if(row[0]==de&&row[1]==peVal) val.push(parseFloat(row[2]));
				else val.push[0];
			});
		});
		var line = {
			"name": nameDE,
			"data": val
		}
		data.push(line);
	});
	return data;
}


Chart.lineChart = function(chartID,title,x,data){
	$('#'+chartID).highcharts({
       chart: {
           type: 'line'
       },
	title: {
           text: title,
       },
       subtitle: {
           text: ''
       },
       xAxis: {
           categories: x
       },
       yAxis: {
           title: {
               text: ''
           }
       },
       plotOptions: {
           line: {
               dataLabels: {
                   enabled: false
               },
               enableMouseTracking: false
           }
       },
       series: data
   });
   $("text[style='cursor:pointer;color:#909090;font-size:9px;fill:#909090;']").remove();
}

Chart.columnChart = function(chartID,title,x,data){
	$('#'+chartID).highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: x,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: data
    });
	$("text[style='cursor:pointer;color:#909090;font-size:9px;fill:#909090;']").remove();
}

/*
Chart.DualAxes = function(chartID,title,x,data){
	$('#'+chartID).highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: title
        },
        subtitle: {
            text: ''
        },
        xAxis: [{
            categories: x,
            crosshair: true
        }],
        yAxis: [
		{ // Primary yAxis
            labels: {
                format: '{value}°C',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Temperature',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, 
		{ // Secondary yAxis
            title: {
                text: 'Rainfall',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value} mm',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 100,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [{
            name: 'Rainfall',
            type: 'spline',
            yAxis: 1,
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            tooltip: {
                valueSuffix: ' mm'
            }

        }, {
            name: 'Temperature',
            type: 'spline',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
            tooltip: {
                valueSuffix: '°C'
            }
        }]
    });
}
*/
//--------------------------------------------------

function printpage(){
	window.print();
}

function reloadPage(){
    location.reload();
}

function Backtomainpage(){
	window.open("https://dhis2.asia/erar","_self");
}

