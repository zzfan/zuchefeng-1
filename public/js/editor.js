$(function(){
  function initToolbarBootstrapBindings() {
    // 添加字体选项
    var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
    'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
    'Times New Roman', 'Verdana'],
    fontTarget = $('[en-title=Font]').siblings('.dropdown-menu');
    console.log(fonts);
    console.log(fontTarget);
    $.each(fonts, function (idx, fontName) {
      fontTarget.append($('<li><a data-edit="fontName ' + fontName +'" style="font-family:\''+ fontName +'\'">'+fontName + '</a></li>'));
    });
    console.log(fontTarget);
    // 把tooltip浮现出来
    $('a[title]').tooltip({container:'body'});
    // 下拉菜单 toggle
    $('.dropdown-menu input').click(function() {return false;})
    .change(function () {$(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');})
    .keydown('esc', function () {this.value='';$(this).change();});

    $('[data-role=magic-overlay]').each(function () {
      var overlay = $(this), target = $(overlay.data('target'));
      overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
    });
    if ("onwebkitspeechchange"  in document.createElement("input")) {
      var editorOffset = $('#editor').offset();
      $('#voiceBtn').css('position','absolute').offset({top: editorOffset.top, left: editorOffset.left+$('#editor').innerWidth()-35});
    } else {
      $('#voiceBtn').hide();
    }
  };
  // show 错误信息。目前没用到
  function showErrorAlert (reason, detail) {
    var msg='';
    if (reason==='unsupported-file-type') { msg = "Unsupported format " +detail; }
    else {
      console.log("error uploading file", reason, detail);
    }
    $('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>'+
    '<strong>File upload error</strong> '+msg+' </div>').prependTo('#alerts');
  };
  initToolbarBootstrapBindings();
  // 启动
  $('#editor').wysiwyg({ fileUploadError: showErrorAlert} );
  window.prettyPrint && prettyPrint();

  $('#editor-save').click(function(){
    var reg = /(?:cars\/)([a-zA-Z0-9]+)(?:\/detail)/;
    var url = '/cars/'+ reg.exec(document.URL)[1]+'/detail';
    var formData = new FormData();
    formData.append('html', $('#editor').html());
    formData.append('_csrf', $('#editor-save').data('csrf'));
    console.log(formData);
    $.ajax({
      url: url,
      type: 'PUT',
      data: formData,
      cache: false,
      // 没有这句话会出错。Uncaught TypeError: Illegal invocation
      processData: false, // Don't process the files
      // missing the code below, jquery will never send the file.
      // the csrf using formData will fail too.
      contentType: false,
      success: function(data) {
        alert(data);
      }
    });
  });

});
