var dragBar0 = null;
var dragBar1 = null;
var dragBar2 = null;
var draggedPercent0 = 0;
var draggedPercent1 = 0;
var draggedPercent2 = 0;
var dragBars = null;
var isDraggingEnabled = true;

const MIN_DRAG_0_Y = 0;
const MIN_DRAG_1_X = 0;
const MIN_DRAG_2_X = 0;

const MAX_DRAG_0_Y = 255;
const MAX_DRAG_1_X = 231;
const MAX_DRAG_2_X = 280;

const PROFILE_ZP = 14;

var slider0 = null;
var slider1 = null;
var slider2 = null;

var selected0 = false;
var selected1 = false;
var selected2 = false;

var lastSelection;
var rotationState = 0;

var mini = false;
var selectedProfile = null;
var profileDataScroller = null;

var profileSelectorDisplayed = false;
var selectedProfileID = false;
var selectedProfileTab = -1;
var cubeRestoreValCount = 0;

function StoreCubeState() {
    //store cube state in session
    if (slider0 != null) SystemBridge.setSessionValue("slider0", slider0);
    if (slider1 != null) SystemBridge.setSessionValue("slider1", slider1);
    if (slider2 != null) SystemBridge.setSessionValue("slider2", slider2);
    SystemBridge.setSessionValue("rotationState", rotationState);
    SystemBridge.setSessionValue("profile_selector_displayed", (profileSelectorDisplayed ? "true" : "false"));
    SystemBridge.setSessionValue("selected_profile_id", selectedProfileID);
    SystemBridge.setSessionValue("selected_profile_tab", selectedProfileTab);
}

function checkFootnotesAndLaunch() {
    // reset footnotes/refs (to kill special case error)
    if ($("#references").hasClass("disabled"))
        SystemBridge.setSessionValue("activeCubeProfile", "");
    SystemBridge.launchPopUp('./popFootnoteCube.html');
}

function checkReferencesAndLaunch() {
    // reset footnotes/refs (to kill special case error)
    SystemBridge.setSessionValue("activeCubeProfile", "");
    SystemBridge.launchPopUp('./popReferenceCube.html');
}


// for PageCurl effect
document.addEventListener('DOMContentLoaded', initialize);

function initialize() { curlInit(); }

$(document).ready(function () {
    labelSelector();
    dragBar0 = new webkit_draggable("slider0box", {
        horizontal: false,
        onDrag: onPercentBar0Drag,
        onEnd: onDragEnd
    });
    dragBar0.element().style.top = MAX_DRAG_0_Y + "px";
    dragBar1 = new webkit_draggable("slider1box", {
        vertical: false,
        onDrag: onPercentBar1Drag,
        onEnd: onDragEnd
    });
    dragBar2 = new webkit_draggable("slider2box", {
        vertical: false,
        onDrag: onPercentBar2Drag,
        onEnd: onDragEnd
    });
    dragBars = [dragBar0, dragBar1, dragBar2];

    profileScroll = new iScroll('wrapper', {
        desktopCompatibility: true,
        vScrollbar: true,
        hideScrollbar: false,
        scrollbarClass: 'myScrollbar'
    });
    profileDataScroller = new iScroll('variable-data', {
        hScrollbar: false,
        vScrollbar: true,
        hideScrollbar: false
    });
    preload(['images/img-left-1-green.png',
        'images/img-left-1-pink.png',
        'images/img-left-1-purple.png',
        'images/img-left-1-yellow.png',
        'images/img-left-1-off-green.png',
        'images/img-left-1-off-pink.png',
        'images/img-left-1-off-purple.png',
        'images/img-left-1-off-yellow.png',
        'images/img-left-2-green.png',
        'images/img-left-2-pink.png',
        'images/img-left-2-purple.png',
        'images/img-left-2-yellow.png',
        'images/img-left-2-off-green.png',
        'images/img-left-2-off-pink.png',
        'images/img-left-2-off-purple.png',
        'images/img-left-2-off-yellow.png',
        'images/img-right-1-green.png',
        'images/img-right-1-pink.png',
        'images/img-right-1-purple.png',
        'images/img-right-1-yellow.png',
        'images/img-right-1-off-green.png',
        'images/img-right-1-off-pink.png',
        'images/img-right-1-off-purple.png',
        'images/img-right-1-off-yellow.png',
        'images/img-right-2-green.png',
        'images/img-right-2-pink.png',
        'images/img-right-2-purple.png',
        'images/img-right-2-yellow.png',
        'images/img-right-2-off-green.png',
        'images/img-right-2-off-pink.png',
        'images/img-right-2-off-purple.png',
        'images/img-right-2-off-yellow.png'
    ]);
    loadXML();

    /*
     * restore cube state if previous state exists
     */
    SystemBridge.requestSessionValue("slider0", "retrieveSlider0ValFromSession");
    SystemBridge.requestSessionValue("slider1", "retrieveSlider1ValFromSession");
    SystemBridge.requestSessionValue("slider2", "retrieveSlider2ValFromSession");
    SystemBridge.requestSessionValue("rotationState", "retrieveRotationState");
    SystemBridge.requestSessionValue("profile_selector_displayed", "retrieveProfileSelectorDisplayed");
    SystemBridge.requestSessionValue("selected_profile_id", "retrieveSelectedProfileID");
    SystemBridge.requestSessionValue("selected_profile_tab", "retrieveSelectedProfileTab");
});

function retrieveSlider0ValFromSession(val) {
    restoreCubeFromSession(1, val);
}

function retrieveSlider1ValFromSession(val) {
    restoreCubeFromSession(2, val);
}

function retrieveSlider2ValFromSession(val) {
    restoreCubeFromSession(3, val);
}

function retrieveRotationState(val) {
    restoreCubeFromSession(4, val);
}

function retrieveProfileSelectorDisplayed(val) {
    restoreCubeFromSession(5, val);
}

function retrieveSelectedProfileID(val) {
    restoreCubeFromSession(6, val);
}

function retrieveSelectedProfileTab(val) {
    restoreCubeFromSession(7, val);
}

function restoreCubeFromSession(varToSet, val) {
    if (val != "nil") {
        switch (varToSet) {
        case 1:
            slider0 = parseInt(val, 10);
            break;
        case 2:
            slider1 = parseInt(val, 10);
            break;
        case 3:
            slider2 = parseInt(val, 10);
            break;
        case 4:
            rotationState = parseInt(val, 10);
            break;
        case 5:
            profileSelectorDisplayed = val == "true";
            break;
        case 6:
            selectedProfileID = parseInt(val, 10);
            break;
        case 7:
            selectedProfileTab = parseInt(val, 10);
            break;
        } //end switch
    } //end if
    ++cubeRestoreValCount;

    if (cubeRestoreValCount == 7) {
        //set cube sliders
        rotateCube(rotationState);

        if (slider0 != null && !isNaN(slider0)) {
            updateSelect0();
        }
        if (slider1 != null && !isNaN(slider1)) {
            updateSelect1();
        }
        if (slider2 != null && !isNaN(slider2)) {
            updateSelect2();
        }

        updateLabels();
        setTimeout(onDragEnd, 200);

        //display profile info if necessary
        if (profileSelectorDisplayed) {
            showHidePatientProfile(selectedProfileID, true);
        }

    } //end if
} //end function restoreCubeFromSession

var loadedImgCnt = 0;
var numberOfImagesToLoad = 0;
var isXMLLoaded = false;

function preload(arrayOfImages) {
    numberOfImagesToLoad = arrayOfImages.length;

    $(arrayOfImages).each(function () {
        var img = $('<img/>')[0];
        img.src = this;
        $(img).load(function () {
            ++loadedImgCnt;
            if (isCubeReady())
                hidePreviewImage();
        });
    });
}

function isCubeReady() {
    return loadedImgCnt == numberOfImagesToLoad && isXMLLoaded;
} //end function checkCubeReady

function hidePreviewImage() {

} //end function hidePreviewImage


function onPercentBar0Drag() {
    var barPosY = dragBar0.getPosition().y;
    if (barPosY <= 0) barPosY = 0;
    else if (barPosY >= MAX_DRAG_0_Y) barPosY = MAX_DRAG_0_Y;
    dragBar0.element().style.top = barPosY + "px";
    draggedPercent0 = (100 - Math.round((barPosY / MAX_DRAG_0_Y) * 100));
    slider0 = Math.floor(draggedPercent0 / 50);
    if (slider0 == 2) slider0 = 1;
    if (draggedPercent0) updateSelect0();
    updateLabels();
}

function onPercentBar1Drag() {
    var barPosX = dragBar1.getPosition().x;
    if (barPosX <= 0) barPosX = 0;
    else if (barPosX >= MAX_DRAG_1_X) barPosX = MAX_DRAG_1_X;
    dragBar1.element().style.left = barPosX + "px";

    if (rotationState == 0) {
        draggedPercent1 = (Math.round((barPosX / MAX_DRAG_1_X) * 100));
        slider1 = Math.floor(draggedPercent1 / 25);
        if (slider1 == 4) slider1 = 3;
        if (draggedPercent1) updateSelect1();
    } else {
        draggedPercent2 = (Math.round((barPosX / MAX_DRAG_1_X) * 100));
        slider2 = Math.floor(draggedPercent2 / 50);
        slider2 = slider2 > 1 ? 1 : slider2;
        if (draggedPercent2) updateSelect1();
    }
    updateLabels();
}

function onPercentBar2Drag() {
    var barPosX = dragBar2.getPosition().x;
    if (barPosX <= 0) barPosX = 0;
    else if (barPosX >= MAX_DRAG_2_X) barPosX = MAX_DRAG_2_X;
    dragBar2.element().style.left = barPosX + "px";

    if (rotationState == 0) {
        draggedPercent2 = (Math.round((barPosX / MAX_DRAG_2_X) * 100));
        slider2 = Math.floor(draggedPercent2 / 50);
        slider2 = slider2 > 1 ? 1 : slider2;
        if (draggedPercent2) updateSelect2();
    } else {
        barPosX = (barPosX * -1) + MAX_DRAG_2_X;
        draggedPercent1 = (Math.round((barPosX / MAX_DRAG_2_X) * 100));
        slider1 = Math.floor(draggedPercent1 / 25);
        if (slider1 == 4) slider1 = 3;
        if (draggedPercent1) updateSelect2();
    }
    updateLabels();
}

function onDragEnd() {
    snapSliders();

    if (slider0 != null && slider1 != null)
        showSelectedProfile();

    //Tracking
    var description = "";
    $('.selectedTag').each(function (index) {
        if (index > 0)
            description = description + "|" + $(this).text();
        else
            description = $(this).text();
    });
    SystemBridge.trackEvent(description, 'cube_slider_changed', 'CUBE', '');

    /*
	// uncomment this chunk if we want the cube to work the way it really should
	// rotate cube to show current profile if it's facing away from us
	if (((rotationState == 0) && (slider2 == 1))
		|| ((rotationState == 1) && (slider2 == 0)))
		rotateCubeFromButton();
	*/
} //end function onDragEnd

function snapSliders() {
    var snapState = rotationState;

    if (slider0 != null) {
        switch (slider0) {
        case 0:
            dragBar0.setPosition('top', MAX_DRAG_0_Y - (MAX_DRAG_0_Y / 6));
            break;
        case 1:
            dragBar0.setPosition('top', MIN_DRAG_0_Y + (MAX_DRAG_0_Y / 6));
            break;
        }
    } else
        dragBar0.setPosition('top', MAX_DRAG_0_Y);

    if (snapState == 0) {
        if (slider2 != null) {
            switch (slider2) {
            case 0:
                dragBar2.setPosition('left', MIN_DRAG_2_X + (MAX_DRAG_2_X / 6));
                break;
            case 1:
                dragBar2.setPosition('left', MAX_DRAG_2_X - (MAX_DRAG_2_X / 6));
                break;
            }
        } else
            dragBar2.setPosition('left', MIN_DRAG_2_X);

        if (slider1 != null) {
            switch (slider1) {
            case 0:
                dragBar1.setPosition('left', MIN_DRAG_1_X + 15);
                break;
            case 1:
                dragBar1.setPosition('left', (MAX_DRAG_1_X / 3) * 1);
                break;
            case 2:
                dragBar1.setPosition('left', (MAX_DRAG_1_X / 3) * 2);
                break;
            case 3:
                dragBar1.setPosition('left', MAX_DRAG_1_X - 15);
                break;
            }
        } else
            dragBar1.setPosition('left', MIN_DRAG_1_X);
    } else {
        if (slider2 != null) {
            switch (slider2) {
            case 0:
                dragBar1.setPosition('left', MIN_DRAG_1_X + (MAX_DRAG_1_X / 6));
                break;
            case 1:
                dragBar1.setPosition('left', MAX_DRAG_1_X - (MAX_DRAG_1_X / 6));
                break;
            }
        } else
            dragBar1.setPosition('left', MIN_DRAG_1_X);

        if (slider1 != null) {
            switch (slider1) {
            case 0:
                dragBar2.setPosition('left', MAX_DRAG_2_X - 15);
                break;
            case 1:
                dragBar2.setPosition('left', (MAX_DRAG_2_X / 3) * 2);
                break;
            case 2:
                dragBar2.setPosition('left', (MAX_DRAG_2_X / 3) * 1);
                break;
            case 3:
                dragBar2.setPosition('left', MIN_DRAG_2_X + 15);
                break;
            }
        } else
            dragBar2.setPosition('left', MIN_DRAG_2_X);
    }

}

function updateLabels() {
    // Remove selected tags
    $('.tag').removeClass('selectedTag');

    switch (slider0) {
    case 0:
        $(".tagtwo").addClass('selectedTag');
        break;
    case 1:
        $(".tagone").addClass('selectedTag');
        break;
    }

    switch (slider1) {
    case 0:
        $(".tagthree").addClass('selectedTag');
        break;
    case 1:
        $(".tagfour").addClass('selectedTag');
        break;
    case 2:
        $(".tagfive").addClass('selectedTag');
        break;
    case 3:
        $(".tagsix").addClass('selectedTag');
        break;
    }

    switch (slider2) {
    case 0:
        $(".tagseven").addClass('selectedTag');
        break;
    case 1:
        $(".tageight").addClass('selectedTag');
        break;
    }
}


var lastHighlight = "";

function highlightCube() {
    if (rotationState == 0) {
        if (selected0 && !selected1 && !selected2)
            lastHighlight = "horiz-highlight";
        if (selected0 && selected1 && !selected2)
            lastHighlight = "row-highlight";
        if (selected0 && !selected1 && selected2)
            lastHighlight = "horiz-row-highlight";
        if (!selected0 && selected1 && !selected2)
            lastHighlight = "column-highlight";
        if (!selected0 && selected1 && selected2)
            lastHighlight = "vert-column-highlight";
        if (!selected0 && !selected1 && selected2)
            lastHighlight = "vert-highlight";
        if (selected0 && selected1 && selected2)
            lastHighlight = "single-highlight";
    } else {
        if (selected0 && !selected1 && !selected2)
            lastHighlight = "horiz-highlight";
        if (selected0 && selected1 && !selected2)
            lastHighlight = "row-highlight";
        if (selected0 && !selected1 && selected2)
            lastHighlight = "horiz-row-highlight";
        if (!selected0 && selected1 && !selected2)
            lastHighlight = "vert-highlight";
        if (!selected0 && selected1 && selected2)
            lastHighlight = "vert-column-highlight";
        if (!selected0 && !selected1 && selected2)
            lastHighlight = "column-highlight";
        if (selected0 && selected1 && selected2)
            lastHighlight = "single-highlight";
    }
}

function highlightProfiles() {
    if (lastHighlight == "")
        return;

    $('.selectedPane').removeClass('selectedPane');
    $('.selectedBox').removeClass('selectedBox');

    if (lastHighlight == 'horiz-highlight') {
        $('#profile-' + slider0 + '00 .profile').addClass('selectedPane');
        $('#profile-' + slider0 + '01 .profile').addClass('selectedPane');
        $('#profile-' + slider0 + '10 .profile').addClass('selectedPane');
        $('#profile-' + slider0 + '11 .profile').addClass('selectedPane');
        $('#profile-' + slider0 + '20 .profile').addClass('selectedPane');
        $('#profile-' + slider0 + '21 .profile').addClass('selectedPane');
        $('#profile-' + slider0 + '30 .profile').addClass('selectedPane');
        $('#profile-' + slider0 + '31 .profile').addClass('selectedPane');

        $('#profile-' + slider0 + '00 .highlightBox').addClass('selectedBox');
        $('#profile-' + slider0 + '01 .highlightBox').addClass('selectedBox');
        $('#profile-' + slider0 + '10 .highlightBox').addClass('selectedBox');
        $('#profile-' + slider0 + '11 .highlightBox').addClass('selectedBox');
        $('#profile-' + slider0 + '20 .highlightBox').addClass('selectedBox');
        $('#profile-' + slider0 + '21 .highlightBox').addClass('selectedBox');
        $('#profile-' + slider0 + '30 .highlightBox').addClass('selectedBox');
        $('#profile-' + slider0 + '31 .highlightBox').addClass('selectedBox');
    } else if (lastHighlight == 'vert-highlight') {
        $('#profile-00' + slider2 + ' .profile').addClass('selectedPane');
        $('#profile-01' + slider2 + ' .profile').addClass('selectedPane');
        $('#profile-02' + slider2 + ' .profile').addClass('selectedPane');
        $('#profile-03' + slider2 + ' .profile').addClass('selectedPane');
        $('#profile-10' + slider2 + ' .profile').addClass('selectedPane');
        $('#profile-11' + slider2 + ' .profile').addClass('selectedPane');
        $('#profile-12' + slider2 + ' .profile').addClass('selectedPane');
        $('#profile-13' + slider2 + ' .profile').addClass('selectedPane');

        $('#profile-00' + slider2 + ' .highlightBox').addClass('selectedBox');
        $('#profile-01' + slider2 + ' .highlightBox').addClass('selectedBox');
        $('#profile-02' + slider2 + ' .highlightBox').addClass('selectedBox');
        $('#profile-03' + slider2 + ' .highlightBox').addClass('selectedBox');
        $('#profile-10' + slider2 + ' .highlightBox').addClass('selectedBox');
        $('#profile-11' + slider2 + ' .highlightBox').addClass('selectedBox');
        $('#profile-12' + slider2 + ' .highlightBox').addClass('selectedBox');
        $('#profile-13' + slider2 + ' .highlightBox').addClass('selectedBox');
    } else if (lastHighlight == 'column-highlight') {
        $('#profile-0' + slider1 + '0 .profile').addClass('selectedPane');
        $('#profile-0' + slider1 + '1 .profile').addClass('selectedPane');
        $('#profile-1' + slider1 + '0 .profile').addClass('selectedPane');
        $('#profile-1' + slider1 + '1 .profile').addClass('selectedPane');

        $('#profile-0' + slider1 + '0 .highlightBox').addClass('selectedBox');
        $('#profile-0' + slider1 + '1 .highlightBox').addClass('selectedBox');
        $('#profile-1' + slider1 + '0 .highlightBox').addClass('selectedBox');
        $('#profile-1' + slider1 + '1 .highlightBox').addClass('selectedBox');
    } else if (lastHighlight == 'horiz-row-highlight') {
        $('#profile-' + slider0 + '0' + slider2 + ' .profile').addClass('selectedPane');
        $('#profile-' + slider0 + '1' + slider2 + ' .profile').addClass('selectedPane');
        $('#profile-' + slider0 + '2' + slider2 + ' .profile').addClass('selectedPane');
        $('#profile-' + slider0 + '3' + slider2 + ' .profile').addClass('selectedPane');

        $('#profile-' + slider0 + '0' + slider2 + ' .highlightBox').addClass('selectedBox');
        $('#profile-' + slider0 + '1' + slider2 + ' .highlightBox').addClass('selectedBox');
        $('#profile-' + slider0 + '2' + slider2 + ' .highlightBox').addClass('selectedBox');
        $('#profile-' + slider0 + '3' + slider2 + ' .highlightBox').addClass('selectedBox');
    } else if (lastHighlight == 'row-highlight') {
        $('#profile-' + slider0 + slider1 + '0 .profile').addClass('selectedPane');
        $('#profile-' + slider0 + slider1 + '1 .profile').addClass('selectedPane');

        $('#profile-' + slider0 + slider1 + '0 .highlightBox').addClass('selectedBox');
        $('#profile-' + slider0 + slider1 + '1 .highlightBox').addClass('selectedBox');
    } else if (lastHighlight == 'single-highlight') {
        $('#profile-' + slider0 + slider1 + slider2 + ' .profile').addClass('selectedPane');

        $('#profile-' + slider0 + slider1 + slider2 + ' .highlightBox').addClass('selectedBox');
    } else if (lastHighlight == 'vert-column-highlight') {
        $('#profile-0' + slider1 + slider2 + ' .profile').addClass('selectedPane');
        $('#profile-1' + slider1 + slider2 + ' .profile').addClass('selectedPane');

        $('#profile-0' + slider1 + slider2 + ' .highlightBox').addClass('selectedBox');
        $('#profile-1' + slider1 + slider2 + ' .highlightBox').addClass('selectedBox');
    }
}

function updateSelect0() {
    $("#slider0box-image").attr("src", "images/slider0_box.png");
    $("#slider0box").removeClass("inactive");
    selected0 = true;
    highlightCube();
    highlightProfiles();
};

function updateSelect1() {
    $("#slider1box-image").attr("src", "images/slider1_box.png");
    $("#slider1box").removeClass("inactive");
    selected1 = true;
    highlightCube();
    highlightProfiles();
};

function updateSelect2() {
    $("#slider2box-image").attr("src", "images/slider2_box.png");
    $("#slider2box").removeClass("inactive");
    selected2 = true;
    highlightCube();
    highlightProfiles();
};

function rotateCubeFromButton() {
    updateLabels();
    highlightProfiles();

    if (rotationState == 1)
        rotateCube(0);
    else
        rotateCube(1);
}

function rotateCube(toPosition) {

    SystemBridge.trackEvent('To Position ' + toPosition, 'cube_rotated', 'CUBE', '');
    if (toPosition == 1) {
        document.getElementById('cube').style.webkitTransform = "rotateY(-45deg)";
        document.getElementById('tags-state-1').style.display = "none";
        document.getElementById('tags-state-2').style.display = "block";
        $('p.face3text').html("Site of Metastases");
        $('p.face4text').html("");
        $('p.face5text').html("Progression/Recurrence");
        $('p.face5text').addClass('face5text2');
        $('#sliderLine1').attr("src", "images/slider1_line_state2.png");
        $('#sliderLine2').attr("src", "images/slider2_line_state2.png");


        rotationState = 1;

        // hide the bottom sliders
        document.getElementById('slider1').style.display = "none";
        document.getElementById('slider2').style.display = "none";
        document.querySelector('#tags-state-2 .tagthree').style.display = "none";
        document.querySelector('#tags-state-2 .tagfour').style.display = "none";
        document.querySelector('#tags-state-2 .tagfive').style.display = "none";
        document.querySelector('#tags-state-2 .tagsix').style.display = "none";
        document.querySelector('#tags-state-2 .tagseven').style.display = "none";
        document.querySelector('#tags-state-2 .tageight').style.display = "none";

        // redisplay sliders after rotation
        document.getElementById('slider1').style.display = "block";
        document.getElementById('slider2').style.display = "block";
        document.querySelector('#tags-state-2 .tagthree').style.display = "block";
        document.querySelector('#tags-state-2 .tagfour').style.display = "block";
        document.querySelector('#tags-state-2 .tagfive').style.display = "block";
        document.querySelector('#tags-state-2 .tagsix').style.display = "block";
        document.querySelector('#tags-state-2 .tagseven').style.display = "block";
        document.querySelector('#tags-state-2 .tageight').style.display = "block";

        dragBar2.setPosition('top', 2);
    } else {
        document.getElementById('cube').style.webkitTransform = "rotateY(45deg)";
        document.getElementById('tags-state-1').style.display = "block";
        document.getElementById('tags-state-2').style.display = "none";
        $('p.face3text').html("");
        $('p.face4text').html("Progression/Recurrence");
        $('p.face5text').removeClass('face5text2');
        $('p.face5text').html("Site of Metastases");
        $('#sliderLine1').attr("src", "images/slider1_line.png");
        $('#sliderLine2').attr("src", "images/slider2_line.png");

        rotationState = 0;

        // hide the bottom sliders
        document.getElementById('slider1').style.display = "none";
        document.getElementById('slider2').style.display = "none";
        document.querySelector('#tags-state-1 .tagthree').style.display = "none";
        document.querySelector('#tags-state-1 .tagfour').style.display = "none";
        document.querySelector('#tags-state-1 .tagfive').style.display = "none";
        document.querySelector('#tags-state-1 .tagsix').style.display = "none";
        document.querySelector('#tags-state-1 .tagseven').style.display = "none";
        document.querySelector('#tags-state-1 .tageight').style.display = "none";

        // redisplay sliders after rotation
        snapSliders();
        document.getElementById('slider1').style.display = "block";
        document.getElementById('slider2').style.display = "block";
        document.querySelector('#tags-state-1 .tagthree').style.display = "block";
        document.querySelector('#tags-state-1 .tagfour').style.display = "block";
        document.querySelector('#tags-state-1 .tagfive').style.display = "block";
        document.querySelector('#tags-state-1 .tagsix').style.display = "block";
        document.querySelector('#tags-state-1 .tagseven').style.display = "block";
        document.querySelector('#tags-state-1 .tageight').style.display = "block";
        dragBar2.setPosition('top', 0);

    }
}


function showSelectedProfile() {
    var selectedDiv = "#profile-" + slider0.toString() + slider1.toString() + slider2.toString() + " .profile";

    if (lastSelection != null) {
        $(lastSelection).removeClass(function (index, css) {
            return (css.match(/\bprofile-selected-\S+/g) || []).join(' ');
        });
    }

    var color = "";
    switch (slider1) {
    case 0:
        color = "purple";
        break;
    case 1:
        color = "pink";
        break;
    case 2:
        color = "orange";
        break;
    case 3:
        color = "green";
        break;
    }

    if (slider2 == 0) {
        if (slider0 == 0)
            $(selectedDiv).addClass("profile-selected-left-" + color);
        else
            $(selectedDiv).addClass("profile-selected-left-top-" + color);
    } else {
        if (slider0 == 0)
            $(selectedDiv).addClass("profile-selected-right-" + color);
        else
            $(selectedDiv).addClass("profile-selected-right-top-" + color);
    }

    lastSelection = selectedDiv;
}

function showHidePop() {
    var pop = document.getElementById('popup');

    function changeIndex() {
        pop.style.zIndex = "1";
        pop.removeEventListener('webkitTransitionEnd', changeIndex, false);
    }

    if (pop.className != "show") {
      SystemBridge.setSessionValue("popSlider0", slider0);
    }
    else{
      SystemBridge.setSessionValue("popSlider0", null);
    }

    if (!isDraggingEnabled) {
        isDraggingEnabled = true;
        //enable drag bars
        for (var i = 0; i < dragBars.length; ++i)
            dragBars[i].bindEvents();
    } //end if

    if (mini) {
        $("#close_popup").show();
        //        resetCube();
        pop.className = "";
        pop.onclick = "";
        pop.addEventListener('webkitTransitionEnd', changeIndex, false);

        showHidePatientProfile(-1);
    }

    if (isNaN(slider0) || isNaN(slider1) || isNaN(slider2)) {
        return;
    }

    if (pop.className != "show") {
        $("#close_popup").hide();

        //disable drag bars
        for (var i = 0; i < dragBars.length; ++i)
            dragBars[i].destroy();
        isDraggingEnabled = false;

        pop.style.zIndex = "102";
        pop.className = "show";
        var selectedData = slider0.toString() + slider1.toString() + slider2.toString();
        loadPopupData(selectedData);
        //profileSelectorDisplayed = true;
    } else {
        $("#close_popup").show();

        pop.className = "";
        pop.onclick = "";
        pop.addEventListener('webkitTransitionEnd', changeIndex, false);
        //profileSelectorDisplayed = false;
        showHidePatientProfile(-1);
    }

}

function showHidePatientProfile(id) {
    if (id == -1) {
        profileSelectorDisplayed = false;
        selectedProfileID = -1;
        StoreCubeState();
    } else {
        profileSelectorDisplayed = true;
        selectedProfileID = id;
        StoreCubeState();
    }

    var popList = document.getElementById('popup');
    if (popList.className == "show") {
        removePeel();
    }

    var patientProfile = document.getElementById('page-flip');
    if ((patientProfile.className != "show" || (!$("#profile_" + id).hasClass('active') && profileSelectorDisplayed)) && (popList.className == "show")) {
        $("#profile-list div").removeClass('active');
        $("#profile_" + id).addClass('active');

        $("#variable-data-content").html("");
        profileDataScroller.refresh();

        selectedProfile = patientArray[id];
        selectedProfile.details = loadProfile(selectedProfile.file);
        SystemBridge.setSessionValue("activeCubeProfile", selectedProfile.file);
        $("#variable-data-content").html(selectedProfile.details["status"]);
        $(".patient-summary").html(selectedProfile.details["summary"]);
        $(".middle-banner").html('<div onclick="goToConfirm();"' + selectedProfile.details["banner"] + '</div>');
        $(".patient-name").html(selectedProfile.title + " could be considered a candidate for FASLODEX 500 mg.");
        var image = selectedProfile.details["image"];
        var patientInfoDivs = document.querySelectorAll(".patient-info > div");
        var middleBanner = document.querySelector(".middle-banner");
        if (image != "") {
            for (var i = 0; i < patientInfoDivs.length; ++i)
                patientInfoDivs[i].className = patientInfoDivs[i].className.replace(/\s+noimg/g, "");
            middleBanner.className = middleBanner.className.replace(/\s+noimg/g, "");

            var pImg = document.querySelector('.patient-image');
            pImg.style.backgroundImage = "url(images/" + image + ")";
            //$('.patient-image').css("background-image", "url(images/" + image + ")");
        } //end if
        else {
            for (var i = 0; i < patientInfoDivs.length; ++i)
                patientInfoDivs[i].className += " noimg";
            middleBanner.className += " noimg";
        } //end else

        patientProfile.style.zIndex = "100";
        patientProfile.className = "show";
        moveCube();
        $("#footnotes").removeClass("disabled");
        $("#references").removeClass("disabled");

        var description = "patient-" + id;
        SystemBridge.trackEvent(description, 'cube_profile_selected', 'CUBE', '');
        if (!arguments[1])
            pressedTab(0);
        profileDataScroller.refresh();
        selectedProfileID = id;
    } else {
        $("#profile-list div").removeClass('active');
        var description = "patient-" + id;
        SystemBridge.trackEvent(description, 'cube_profile_closed', 'CUBE', '');

        patientProfile.className = "";
        patientProfile.onclick = "";
        patientProfile.addEventListener('webkitTransitionEnd', changeIndex, false);
        selectedProfile = null;
        if (mini) {
            //resetCube();
            restoreCube();
            return;
        }
        selectedProfileID = -1;
    }

    function changeIndex() {
        patientProfile.style.zIndex = "1";
        patientProfile.removeEventListener('webkitTransitionEnd', changeIndex, false);
    }

}

function moveCube() {
    document.getElementById('experiment').className = "miniMe";
    //	document.getElementById('patient-profile-message').style.display = "block";
    document.getElementById('tags-state-1').style.display = "none";
    document.getElementById('tags-state-2').style.display = "none";
    document.getElementById('sliders').style.display = "none";
    $('p.face2text').css("display", "none");
    $('p.face3text').css("display", "none");
    $('p.face4text').css("display", "none");
    $('p.face5text').css("display", "none");
    $("#rotate-button").css("display", "none");
    mini = true;
}

function restoreCube() {
    document.getElementById('experiment').className = "";
    //	document.getElementById('patient-profile-message').style.display = "none";
    if (rotationState == 0)
        document.getElementById('tags-state-1').style.display = "block";
    else
        document.getElementById('tags-state-2').style.display = "block";
    document.getElementById('sliders').style.display = "block";
    $('p.face2text').css("display", "block");
    $('p.face3text').css("display", "block");
    $('p.face4text').css("display", "block");
    $('p.face5text').css("display", "block");
    $("#rotate-button").css("display", "block");
    mini = false;

    $("#references").addClass("disabled");

    //Tracking
    var description = "patient-" + selectedProfile.id;
    SystemBridge.trackEvent(description, 'cube_profile_closed', 'CUBE', '');
    SystemBridge.setSessionValue("activeCubeProfile", "");
}

function resetCube() {
    slider0 = null;
    slider1 = null;
    slider2 = null;

    selected0 = false;
    selected1 = false;
    selected2 = false;

    highlightCube();
    highlightProfiles();

    $('.selected').removeClass('selected');
    $('.profile-selected-left').removeClass('profile-selected-left');
    $('.profile-selected-right').removeClass('profile-selected-right');
    $('.tag').removeClass('selectedTag');

    if (lastSelection != null) {
        $(lastSelection).removeClass(function (index, css) {
            return (css.match(/\bprofile-selected-\S+/g) || []).join(' ');
        });
        lastSelection = null;
    }

    $('.selectedPane').removeClass('selectedPane');
    document.getElementById(lastHighlight).style.visibility = "hidden";

    resetSliders();
    restoreCube();
    showHidePatientProfile(-1);
}

function resetSliders() {
    dragBar0.setPosition('top', MAX_DRAG_0_Y);
    dragBar1.setPosition('left', MIN_DRAG_1_X);
    dragBar2.setPosition('left', MIN_DRAG_2_X);

    $("#slider0box-image").attr("src", "images/slider0_box_off.png");
    $("#slider0box").addClass("inactive");

    $("#slider1box-image").attr("src", "images/slider1_box_off.png");
    $("#slider1box").addClass("inactive");

    $("#slider2box-image").attr("src", "images/slider2_box_off.png");
    $("#slider2box").addClass("inactive");
}

function goToConfirm() {
    saveProfileState();
    SystemBridge.closeTopPopUp();
    if (selectedProfileID != PROFILE_ZP) {
        SystemBridge.setSessionValue('navigationSource', 'cube');
        SystemBridge.goToSlide('CONFIRM Trial::Trial Design');
    } else {
        SystemBridge.setSessionValue('navigationSource', 'none');
        SystemBridge.goToSlide('CONFIRM Trial::Trial Design');
    }
    SystemBridge.setViewProperties([{
        "name": "cubeButton",
        "properties": {
            "Highlighted": false
        }
    }]);
    showHidePop();
}

function saveProfileState(){
  SystemBridge.setSessionValue("cube_selected_profile_id", selectedProfileID);
  SystemBridge.setSessionValue("cube_selected_tab_id", selectedProfileTab);
  SystemBridge.setSessionValue("popSlider0", null);
}

function labelSelector() {
    var pop = document.getElementById('popup');
    var tags = document.getElementsByClassName('tag');

    for (var i = 0; i < tags.length; i++) {
        tags[i].style.zIndex = "101";
    }
}

function setSliderToPositionWithHighlighting(slider, position) {
    if (slider == 0) {
        slider0 = position
        if (position = 1) {
            snapSliders();
            updateLabels();
            updateSelect0();
        } else {
            position = 0;
            snapSliders();
            updateLabels();
            updateSelect0();
        }
    } else if (slider == 1) {
        slider1 = position
        if (position = 0) {
            snapSliders();
            updateLabels();
            if (rotationState == 0) {
                updateSelect1();
            } else {
                updateSelect2();
            }
        } else if (position = 1) {
            snapSliders();
            updateLabels();
            if (rotationState == 0) {
                updateSelect1();
            } else {
                updateSelect2();
            }
        } else if (position = 2) {
            snapSliders();
            updateLabels();
            if (rotationState == 0) {
                updateSelect1();
            } else {
                updateSelect2();
            }
        } else {
            position = 3;
            snapSliders();
            updateLabels();
            if (rotationState == 0) {
                updateSelect1();
            } else {
                updateSelect2();
            }
        }
    } else {
        slider2 = position;
        if (position = 0) {
            snapSliders();
            updateLabels();
            if (rotationState == 0) {
                updateSelect2();
            } else {
                updateSelect1();
            }
        } else {
            position = 1;
            snapSliders();
            updateLabels();
            if (rotationState == 0) {
                updateSelect2();
            } else {
                updateSelect1();
            }
        }
    }
    showSelectedProfile();
}

function pressedTab(index) {
    document.getElementById('tab1').className = "";
    document.getElementById('tab2').className = "";
    document.getElementById('tab3').className = "";
    selectedProfileTab = index;

    var tab;
    var content;
    var description;
    if (index == 0) {
        description = "patient-" + selectedProfile.id + " - Status";
        tab = document.getElementById('tab1');
        content = selectedProfile.details["status"];
    } else if (index == 1) {
        description = "patient-" + selectedProfile.id + " - Imaging";
        tab = document.getElementById('tab2');
        content = selectedProfile.details["imaging"];
    } else if (index == 2) {
        description = "patient-" + selectedProfile.id + " - Testing";
        tab = document.getElementById('tab3');
        content = selectedProfile.details["testing"];
    }

    $("#variable-data-content").html(content);
    document.getElementById('variable-data-content').innerHTML = content;

    $("ul.rows_list").css("padding-bottom", "25px");
    if (content.indexOf("no_bottom_padding") >= 0)
        $("ul.rows_list").css("padding-bottom", "0px");

    profileDataScroller.refresh();
    tab.className = "active";

    profileDataScroller.refresh();
    profileDataScroller.scrollTo(0, 0, 1, true);

    //Tracking
    SystemBridge.trackEvent(description, 'cube_change_tab', 'CUBE', '');
}