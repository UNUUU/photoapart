const DEFAULT_IMAGE = "/images/logo.jpg";
var updated_time;

function paddingZero(num) {
    if (num < 10) {
        return "0" + num;
    }
    return num;
}

function getPhotoUrl(photo) {
    if (photo['image_url']) {
        return photo['image_url'];
    }
    return DEFAULT_IMAGE;
}

function formattedTime(hour, min, splitString) {
    if (!splitString) {
        splitString = '';
    }
    return paddingZero(hour) + splitString + paddingZero(min);
}

function updatePhoto() {
    var today = new Date();
    var time = formattedTime(today.getHours(), today.getMinutes());

    if (updated_time === time) return;
    updated_time = time;

    /* XX 毎回DOMを見てます */
    $('#loading:visible').hide();
    $('#time:hidden').show();

    $('#time').html(formattedTime(today.getHours(), today.getMinutes(), ' : '));

    $('#link1').toggleClass('display_none');
    $('#link2').toggleClass('display_none');
    $('#image1').toggleClass('display_none');
    $('#image2').toggleClass('display_none');
    if ($('#taken1').hasClass('display_none') && $('#taken2').hasClass('display_none')) {
        $('#taken2').toggleClass('display_none');
    } else {
        $('#taken1').toggleClass('display_none');
        $('#taken2').toggleClass('display_none');
    }

    /* 1分先の画像を検索 */
    var next_today = new Date(today.getTime() + 60000);
    var next_time = formattedTime(next_today.getHours(), next_today.getMinutes());
    $.get('/get_photo.json', {time: next_time}, function(photo) {
              if ($('#image1').hasClass('display_none')) {
                  $('#image1').attr('src', getPhotoUrl(photo));
                  var url = photo['meta_url'];
                  if (url) {
                      $('#link1').attr('href', url).attr('target', '_blank');
                  } else {
                      $('#link1').attr('href', '/').attr('target', '_self');
                  }
                  if (photo['user_name']) {
                      $('#taken1').html('taken by ' + photo['user_name']);
                      $('#taken1').attr('href', photo['user_url']).attr('target', '_blank');
                  } else {
                      $('#taken1').html('UNUUU FOUNDATION');
                      $('#taken1').attr('href', '/').attr('target', '_self');
                  }
              } else {
                  $('#image2').attr('src', getPhotoUrl(photo));
                  var url = photo['meta_url'];
                  if (url) {
                      $('#link2').attr('href', url).attr('target', '_blank');
                  } else {
                      $('#link2').attr('href', '/').attr('target', '_self');
                  }
                  if (photo['user_name']) {
                      $('#taken2').html('taken by ' + photo['user_name']);
                      $('#taken2').attr('href', photo['user_url']).attr('target', '_blank');
                  } else {
                      $('#taken2').html('UNUUU FOUNDATION');
                      $('#taken2').attr('href', '/').attr('target', '_self');
                  }
              }
          });
};

function init() {
    var today = new Date();
    var time = paddingZero(today.getHours()) + '' + paddingZero(today.getMinutes());
    $.get('/get_photo.json', {time: time}, function(photo) {
              $('#image2').attr('src', getPhotoUrl(photo));
              var url = photo['meta_url'];
              if (url) {
                  $('#link2').attr('href', url).attr('target', '_blank');
              } else {
                  $('#link2').attr('href', '/').attr('target', '_self');
              }
              if (photo['user_name']) {
                  $('#taken2').html('taken by ' + photo['user_name']);
                  $('#taken2').attr('href', photo['user_url']).attr('target', '_blank');
              } else {
                  $('#taken2').html('UNUUU FOUNDATION');
                  $('#taken2').attr('href', '/').attr('target', '_self');
              }

              /* 三秒待って開始 */
              setTimeout(function() {
                  setInterval(updatePhoto, 1000);
              }, 1000);

          });
}

window.addEventListener('load', init);
