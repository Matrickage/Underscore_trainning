var htmlContent = "";
var prog;
var loc;
var symp;
var profileClass;

var profiles = new Array();
var patientArray = new Array();

function getHTML(selected, color, prog, loc, symp, profileClass) {
    var arg = "";
    $("#debug").html("Selected: " + selected + "  Color: " + color);
    profiles[selected].forEach(function(tmp) {
/*        arg += "<div class='profile-block' onclick='showHidePatientProfile(" + tmp.id + ")'>" +*/
		arg += "<div id='profile_" + tmp.id + "' class='" + profileClass + "' onclick='showHidePatientProfile(" + tmp.id + ")'>" +
        "<div class='colortab " + color + "tab'></div>" +
        "<div class='title'>" + tmp.title + "</div>" +
        "<div class='age'>Age " + tmp.age + "</div>" +
/*        "<div class='prog'><strong>Recurrence:</strong><br />" + tmp.prog + "</div>" +*/
		"<div class='prog'>" + tmp.prog + "</div>" +
        "<div class='loc'><strong>Site of Metastases:</strong><br />" + tmp.loc + "</div>" +
        "<div class='symp'><strong>Symptoms:</strong><br />" + tmp.symp + "</div>" +
        "</div>";
    });
    return arg;
}

function loadPopupData(selected) {
    var color;
    var index;
    index = selected.substr(0,1);
	switch (selected)
	{
	case "000":
			prog			= "<strong>Progression:</strong> &gt;12 Months<sup>*</sup>";
			loc 			= "Bone";
			symp 			= "Asymptomatic/Mild";
			color			= "purple";
			profileClass	= "profile-block D";
			break;
	case "100":
			prog			= "<strong>Recurrence:</strong> &le;12 Months<sup>*</sup>";
			loc 			= "Bone";
			symp 			= "Asymptomatic/Mild";
			color			= "purple";
			profileClass	= "profile-block C";
			break;
	case "010":
			prog			= "<strong>Progression:</strong> &gt;12 Months<sup>*</sup>";
			loc 			= "Visceral";
			symp 			= "Asymptomatic/Mild";
			color           = "pink";
			profileClass	= "profile-block D";
			break;
	case "110":
			prog			= "<strong>Recurrence:</strong> &le;12 Months<sup>*</sup>";
			loc 			= "Visceral";
			symp 			= "Asymptomatic/Mild";
			color           = "pink";
			profileClass	= "profile-block C";
			break;
	case "020":
			prog			= "<strong>Progression:</strong> &gt;12 Months<sup>*</sup>";
			loc 			= "Bone + Visceral";
			symp 			= "Asymptomatic/Mild";
			color           = "yellow";
			profileClass	= "profile-block D";
			break;
	case "120":
			prog			= "<strong>Recurrence:</strong> &le;12 Months<sup>*</sup>";
			loc 			= "Bone + Visceral";
			symp 			= "Asymptomatic/Mild";
			color           = "yellow";
			profileClass	= "profile-block C";
			break;
	case "030":
			prog			= "<strong>Progression:</strong> &gt;12 Months<sup>*</sup>";
			loc 			= "Other";
			symp 			= "Asymptomatic/Mild";
			color           = "green";
			profileClass	= "profile-block D";
			break;
	case "130":
			prog			= "<strong>Recurrence:</strong> &le;12 Months<sup>*</sup>";
			loc 			= "Other";
			symp 			= "Asymptomatic/Mild";
			color           = "green";
			profileClass	= "profile-block C";
			break;
	case "001":
			prog			= "<strong>Progression:</strong> &gt;12 Months<sup>*</sup>";
			loc 			= "Bone";
			symp 			= "Mild/Moderate";
			color			= "purple";
			profileClass	= "profile-block B";
			break;
	case "101":
			prog			= "<strong>Recurrence:</strong> &le;12 Months<sup>*</sup>";
			loc 			= "Bone";
			symp 			= "Mild/Moderate";
			color			= "purple";
			profileClass	= "profile-block A";
			break;
	case "011":
			prog			= "<strong>Progression:</strong> &gt;12 Months<sup>*</sup>";
			loc 			= "Visceral";
			symp 			= "Mild/Moderate";
			color           = "pink";
			profileClass	= "profile-block B";
			break;
	case "111":
			prog			= "<strong>Recurrence:</strong> &le;12 Months<sup>*</sup>";
			loc 			= "Visceral";
			symp 			= "Mild/Moderate";
			color           = "pink";
			profileClass	= "profile-block A";
			break;
	case "021":
			prog			= "<strong>Progression:</strong> &gt;12 Months<sup>*</sup>";
			loc 			= "Bone + Visceral";
			symp 			= "Mild/Moderate";
			color           = "yellow";
			profileClass	= "profile-block B";
			break;
	case "121":
			prog			= "<strong>Recurrence:</strong> &le;12 Months<sup>*</sup>";
			loc 			= "Bone + Visceral";
			symp 			= "Mild/Moderate";
			color           = "yellow";
			profileClass	= "profile-block A";
			break;
	case "031":
			prog			= "<strong>Progression:</strong> &gt;12 Months<sup>*</sup>";
			loc 			= "Other";
			symp 			= "Mild/Moderate";
			color           = "green";
			profileClass	= "profile-block B";
			break;
	case "131":
			prog			= "<strong>Recurrence:</strong> &le;12 Months<sup>*</sup>";
			loc 			= "Other";
			symp 			= "Mild/Moderate";
			color           = "green";
			profileClass	= "profile-block A";
			break;
	default:
			htmlContent = "";
	}
	
	document.getElementById('progression').innerHTML = prog;
	document.getElementById('location').innerHTML = loc;
	document.getElementById('symptoms').innerHTML = symp;
	var profileHTML = getHTML(selected, color, prog, loc, symp, profileClass);
	document.getElementById('profile-list').innerHTML = profileHTML + "<br>";
//	document.getElementById('profile-list').innerHTML = getHTML(selected, color, prog, loc, symp, profileClass);
	profileScroll.refresh();
	profileScroll.scrollTo(0, 0, 0);

    var description = prog + "|" + loc + "|" + symp;
    SystemBridge.trackEvent(description, 'cube_condition_selected','CUBE','');
}

function loadXML() {
    // load the XML document
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET","patients/patients.xml",false);
    xmlhttp.send();
    xmlDoc=xmlhttp.responseXML;
    var locations = xmlDoc.getElementsByTagName("location");
    var patients = xmlDoc.getElementsByTagName("patient");
    for (i=0;i<patients.length;i++)
    { 
        var id = patients[i].getAttribute("id");
        var title = patients[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
        var age = patients[i].getElementsByTagName("age")[0].childNodes[0].nodeValue;
        var file = patients[i].getElementsByTagName("file")[0].childNodes[0].nodeValue;
        var prog = patients[i].getElementsByTagName("prog")[0].childNodes[0].nodeValue;
        var loc = patients[i].getElementsByTagName("loc")[0].childNodes[0].nodeValue;
        var symp = patients[i].getElementsByTagName("symp")[0].childNodes[0].nodeValue;
        var patient = new Object();
        patient.id = id;
        patient.title = title;
        patient.age = age;
        patient.file = file;
        patient.prog = prog;
        patient.loc = loc;
        patient.symp = symp;
        patientArray[id] = patient;
    }
    
    if (profiles == null)
        profiles = new Array();
    
    for (i=0;i<locations.length;i++)
    { 
        var id = locations[i].getAttribute("id");
        var patientIds = locations[i].getElementsByTagName("patientID");
        for (n=0;n< patientIds.length; n++)
        {
            var patientId = patientIds[n].childNodes[0].nodeValue;
            if (profiles[id] == null)
                profiles[id] = new Array();
            if (patientArray[patientId] != null)
                profiles[id].push(patientArray[patientId]);
        }
    }
	
	//if the cube is ready, hide the preview image being displayed in the background
	//NOTE: isXMLLoaded, isCubeReady, and hidePreviewImage are defined in cube.js
	isXMLLoaded = true;
	if(isCubeReady())
		hidePreviewImage();
}

function loadProfile(filename) {
    // load the XML document
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET","patients/" + filename,false);
    xmlhttp.send();
    xmlDoc=xmlhttp.responseXML;
    if (xmlDoc == null)
        return "";
    
    var imageNode = xmlDoc.getElementsByTagName("image")[0];
    var summaryNode = xmlDoc.getElementsByTagName("summary")[0];
    var statusNode = xmlDoc.getElementsByTagName("status")[0];
    var imagingNode = xmlDoc.getElementsByTagName("imaging")[0];
    var testingNode = xmlDoc.getElementsByTagName("testing")[0];
    var footnotesNode = xmlDoc.getElementsByTagName("footnotes")[0];
    var referencesNode = xmlDoc.getElementsByTagName("references")[0];
	var bannerNode = xmlDoc.getElementsByTagName("banner")[0];

    var rows = statusNode.getElementsByTagName("row");
    var statusHTML = "<ul class='rows_list'>";
    for (i=0;i<rows.length;i++)
    { 
        statusHTML = statusHTML + "<li>" + rows[i].textContent + "</li>";
    }
    statusHTML = statusHTML + "</ul>";

    rows = imagingNode.getElementsByTagName("row");
    var imagingHTML = "<ul class='rows_list'>";
    for (i=0;i<rows.length;i++)
    { 
        imagingHTML = imagingHTML + "<li>" + rows[i].textContent + "</li>";
    }
    imagingHTML = imagingHTML + "</ul>";
    
    rows = testingNode.getElementsByTagName("row");
    var testingHTML = "<ul class='rows_list'>";
    for (i=0;i<rows.length;i++)
    { 
        testingHTML = testingHTML + "<li>" + rows[i].textContent + "</li>";
    }
    testingHTML = testingHTML + "</ul>";
    
    rows = footnotesNode.getElementsByTagName("row");
    var footnotesCount = rows.length;
    var footnotesHTML = "";//"<ul style='list-style:none;'>";
    for (i=0;i<rows.length;i++)
    { 
        footnotesHTML = footnotesHTML + rows[i].textContent + "<br>";
    }
    footnotesHTML = footnotesHTML + "</ul>";

    rows = referencesNode.getElementsByTagName("row");
    var referencesCount = rows.length;
    var referencesHTML = "<ol>";
    for (i=0;i<rows.length;i++)
    { 
        referencesHTML = referencesHTML + "<li><span>" + rows[i].textContent + "</span></li>";
    }
    referencesHTML = referencesHTML + "</ol>";
    
    var html = new Array();
    html["status"] = statusHTML;
    html["imaging"] = imagingHTML;
    html["testing"] = testingHTML;
    html["footnotes"] = footnotesHTML;
    html["references"] = referencesHTML;
    html["summary"] = summaryNode.textContent;
    html["image"] = imageNode.getAttribute("src");
    html["footnotes_count"] = footnotesCount;
    html["references_count"] = referencesCount;
	html["banner"] = bannerNode.textContent;
    
    return html;
    
}
