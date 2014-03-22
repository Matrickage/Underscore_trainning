var parent;
var p1;

function curlInit(){
    parent = document.getElementById('r1');
    
    var curl = document.getElementById('page-curl');
    curl.onclick = addPeel;
    
    var refs = document.getElementById('refs');
    refs.onclick = removePeel;
}

function addPeel() {
  document.getElementById('p1').style.display = 'none';
  document.getElementById('p2').style.display = 'block';

    SystemBridge.trackEvent('OPEN_REFERENCES', 'open_references','CUBE','');
    
    parent.addEventListener('webkitTransitionEnd', function() {
        this.removeEventListener('webkitTransitionEnd', arguments.callee);
    }, false);
}

function removePeel() {
  document.getElementById('p1').style.display = 'block';
  document.getElementById('p2').style.display = 'none';

    SystemBridge.trackEvent('CLOSE_REFERENCES', 'close_references','CUBE','');

    parent.addEventListener('webkitTransitionEnd', function() {
        document.getElementById('peel').style.zIndex = '-1';
        this.removeEventListener('webkitTransitionEnd', arguments.callee);
    }, false);
}
