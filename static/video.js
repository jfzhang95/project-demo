
var arr = ['画眼妆','涂口红','吹头发','吹蜡烛','深蹲','刷牙','头部按摩','跳绳','打太极','打字','写板书'];

function thTime() {
    t = setTimeout("thTime()", 100);

    $.get('/label', function (data) {
        $('#doing').text(data);
        if(arr[$('#actionLabel').text()] == data){
            $('#audio').html('<audio autoplay><source src="/static/CrystalRing.mp3"></audio>');
            $('#result').html('<span>我知道了！你在'+arr[$('#actionLabel').text()]+'</span>');
            // var path = '<source autoplay="autoplay" src="{{ url_for(\'static\',filename=\'CrystalRing.mp3\') }}">'
            // $('#MyAudio').html(path);
            // alert($('#MyAudio'))
            clearTimeout(t);
            // $('#MyAudio').get(0).play();

            $('#doing').text(arr[$('#actionLabel').text()]);
            setTimeout("success()", 5000);
        }else{

        }
    })
}

$(document).ready(function () {
    thTime();
    // alert($('#actionLabel').text())
});

function success() {
    window.location.href = "/success"
}

