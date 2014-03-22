
//------------------------------
//  MARK: interaction
//------------------------------

/**
 * Home button
 */
function homeButtonClickHandler() {
    closeCube();
    SystemBridge.goToSlide("Home");
    SystemBridge.setViewProperties([{
        "name": "homeButton",
        "properties": {
            "Highlighted": true
        }
    }]);
	SystemBridge.setViewFrame("thumbMap2", 0, 0, 1024, 630, true);
	SystemBridge.setViewFrame("bottomContainerView", 0, 500, 1024, 270, true);
}

/**
 * ISI Button
 */
function isiButtonClickHandler() {
	SystemBridge.requestCurrentSlideInfo('isiSlideInfoHandler');
}

function isiSlideInfoHandler(pageInfo) {
    switch (pageInfo.Title) {
    /*case "Home":
        SystemBridge.launchPopUp('package://US_FAS_P_4_0_Presentation/Presentation/html/US_FAS_3_1_S_ISI_Home/popISI.html');
        break;*/
    case "Hormonal Therapy":
    case "FASLODEX History":
        SystemBridge.launchPopUp('package://US_FAS_P_4_0_Presentation/Presentation/html/US_FAS_3_1_S_ISI_Combo/popISI.html');
        break;
    case "Progression-Free Survival":
    case "Forest Plot":
    case "Overall Survival":
    case "Safety":
    case "Summary":
        SystemBridge.launchPopUp('package://US_FAS_P_4_0_Presentation/Presentation/html/US_FAS_3_1_S_ISI_Tag/popISI.html');
        break;
    default:
        SystemBridge.launchPopUp('package://US_FAS_P_4_0_Presentation/Presentation/html/US_FAS_3_1_S_ISI/popISI.html');
        break;
    }
}

/**
 * Cube Button
 */
function cubeButtonClickHandler() {
	closeCube();
	SystemBridge.requestCurrentSlideInfo('cubeSlideInfoHandler');
}

function cubeSlideInfoHandler(pageInfo) {
	// home button highlighted if on the home screen
    SystemBridge.setViewProperties([{
        "name": "homeButton",
        "properties": {
            "Highlighted": (pageInfo.Title == "Home")
        }
    }]);

	// if on the home screen, return bottom container view to original position
    switch (pageInfo.Title) {
    case "Home":
        SystemBridge.setViewFrame("thumbMap2", 0, 0, 1024, 630, true);
        SystemBridge.setViewFrame("bottomContainerView", 0, 500, 1024, 270, true);
        break;
    }
}

/**
 * PI Button
 */
function piButtonClickHandler() {
	SystemBridge.launchPDFViewer('package://US_FAS_D_3_0_PDFs/faslodexPI.pdf', 'Prescribing Information');
}

/**
 * Exit Button
 */
function exitButtonClickHandler() {
	closeCube();
	SystemBridge.requestCurrentSlideInfo('exitSlideInfoHandler');
}

function exitSlideInfoHandler(pageInfo) {
	// home button highlighted if on the home screen
    SystemBridge.setViewProperties([{
        "name": "homeButton",
        "properties": {
            "Highlighted": (pageInfo.Title == "Home")
        }
    }]);

	// if on the home screen, return bottom container view to original position
    switch (pageInfo.Title) {
    case "Home":
        SystemBridge.setViewFrame("thumbMap2", 0, 0, 1024, 630, true);
        SystemBridge.setViewFrame("bottomContainerView", 0, 500, 1024, 270, true);
        break;
    }
}

/**
 * Summary Button
 */
function summaryButtonClickHandler() {
	closeCube();
    SystemBridge.goToSlide("Summary");
}


//------------------------------
//  MARK: utility
//------------------------------

function closeCube() {
    saveProfileState();
    SystemBridge.closeTopPopUp();
    SystemBridge.setViewProperties([{
        "name": "cubeButton",
        "properties": {
            "Highlighted": false
        }
    }]);
}
