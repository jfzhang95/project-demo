
var arr = ['画眼妆','涂口红','吹头发','吹蜡烛','深蹲','刷牙','头部按摩','跳绳','打太极','打字','写板书'];
var index = Math.floor(Math.random() * 11.8);
$('#actionType').text(arr[index]);

function thTime(){
    var _time = $('#timeSkip');
    if(_time.text() != 0){
        _time.text(_time.text() - 1);
        setTimeout("thTime()", 1000);
        if(_time.text()==2){
            $('#ready').html('<audio autoplay><source src="/static/readygo.mp3"></audio>');
        }
        if(_time.text() == 0){
            window.location.href = "/videoLabel/"+index+"/";
        }
    }
}
thTime();