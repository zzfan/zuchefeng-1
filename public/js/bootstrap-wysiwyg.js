/* http://github.com/mindmup/bootstrap-wysiwyg */
/*global jQuery, $, FileReader*/
/*jslint browser:true*/
(function ($) {
  'use strict';
  // 把图片读成base64
  var readFileIntoDataUrl = function (fileInfo) {
    var loader = $.Deferred(),
    fReader = new FileReader();
    fReader.onload = function (e) {
      loader.resolve(e.target.result);
    };
    fReader.onerror = loader.reject;
    fReader.onprogress = loader.notify;
    fReader.readAsDataURL(fileInfo);
    return loader.promise();
  };
  $.fn.cleanHtml = function () {
    var html = $(this).html();
    return html && html.replace(/(<br>|\s|<div><br><\/div>|&nbsp;)*$/, '');
  };
  $.fn.wysiwyg = function (userOptions) {
    var editor = this,
    selectedRange,
    options,
    toolbarBtnSelector,
    updateToolbar = function () {
      if (options.activeToolbarClass) {
        $(options.toolbarSelector).find(toolbarBtnSelector).each(function () {
          var command = $(this).data(options.commandRole);
          if (document.queryCommandState(command)) {
            $(this).addClass(options.activeToolbarClass);
          } else {
            $(this).removeClass(options.activeToolbarClass);
          }
        });
      }
    },
    // 把传入的字符串，翻译document的方法，然后执行 document.execCommand
    execCommand = function (commandWithArgs, valueArg) {
      var commandArr = commandWithArgs.split(' '),
      command = commandArr.shift(),
      args = commandArr.join(' ') + (valueArg || '');
      document.execCommand(command, 0, args);
      updateToolbar();
    },
    bindHotkeys = function (hotKeys) {
      $.each(hotKeys, function (hotkey, command) {
        editor.keydown(hotkey, function (e) {
          if (editor.attr('contenteditable') && editor.is(':visible')) {
            e.preventDefault();
            e.stopPropagation();
            execCommand(command);
          }
        }).keyup(hotkey, function (e) {
          if (editor.attr('contenteditable') && editor.is(':visible')) {
            e.preventDefault();
            e.stopPropagation();
          }
        });
      });
    },
    getCurrentRange = function () {
      var sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      }
    },
    saveSelection = function () {
      selectedRange = getCurrentRange();
    },
    restoreSelection = function () {
      var selection = window.getSelection();
      if (selectedRange) {
        try {
          selection.removeAllRanges();
        } catch (ex) {
          document.body.createTextRange().select();
          document.selection.empty();
        }

        selection.addRange(selectedRange);
      }
    },
    // 插入文件
    insertFiles = function (files) {
      editor.focus();
      $.each(files, function (idx, fileInfo) {
        if (/^image\//.test(fileInfo.type)) {
          $.when(readFileIntoDataUrl(fileInfo)).done(function (dataUrl) {
            execCommand('insertimage', dataUrl);
          }).fail(function (e) {
            options.fileUploadError("file-reader", e);
          });
        } else {
          options.fileUploadError("unsupported-file-type", fileInfo.type);
        }
      });
    },
    markSelection = function (input, color) {
      restoreSelection();
      if (document.queryCommandSupported('hiliteColor')) {
        document.execCommand('hiliteColor', 0, color || 'transparent');
      }
      saveSelection();
      input.data(options.selectionMarker, color);
    },
    bindToolbar = function (toolbar, options) {
      toolbar.find(toolbarBtnSelector).click(function () {
        restoreSelection();
        editor.focus();
        execCommand($(this).data(options.commandRole));
        saveSelection();
      });
      toolbar.find('[data-toggle=dropdown]').click(restoreSelection);

      toolbar.find('input[type=text][data-' + options.commandRole + ']').on('webkitspeechchange change', function () {
        var newValue = this.value; /* ugly but prevents fake double-calls due to selection restoration */
        this.value = '';
        restoreSelection();
        if (newValue) {
          editor.focus();
          execCommand($(this).data(options.commandRole), newValue);
        }
        saveSelection();
      }).on('focus', function () {
        var input = $(this);
        if (!input.data(options.selectionMarker)) {
          markSelection(input, options.selectionColor);
          input.focus();
        }
      }).on('blur', function () {
        var input = $(this);
        if (input.data(options.selectionMarker)) {
          markSelection(input, false);
        }
      });
      // options.commandRole 是控制 data-xxx 的元凶
      toolbar.find('input[type=file][data-' + options.commandRole + ']').change(function () {
        restoreSelection();
        console.log(this);
        if (this.type === 'file' && this.files && this.files.length > 0) {
          insertFiles(this.files);
        }
        saveSelection();
        this.value = '';
      });
      // 自定义上传
      toolbar.find('#aliyun').change(function() {
        restoreSelection();
        var self = this;
        if (this.type === 'file' && this.files && this.files.length > 0) {
          $.ajax('/aliyun', {
            method: 'GET',
            success: function(url) {
              // now get the authed url
              console.log(url);
              $('#f1 input').files = self.files;
              $('#f1').attr('action', url);
              $('#f1').trigger('submit');
              /*
              var formData = new FormData();
              $.each(self.files, function(idx, file) {
                formData.append(idx, file)
              })
              */
              //$.get('http://zuchefeng.oss-cn-hangzhou.aliyuncs.com/ZCFzuchefeng2014-04-21-13-00-00-0001', function(){});
              /*
              $.ajax(url, {
                method: 'GET',
                data: formData,
                cache: false,
                //TODO dataType:
                processData: false, // Don't process the files
                contentType: false, // or jquery will never send the file
                success: function(data) {
                  alert(data);
                }
              })
              */
              document.execCommand('insertImage', 0, 'dfdsdl');
              saveSelection();
            }
          })
        }
      })
    },
    // 拖拽上传
    initFileDrops = function () {
      editor.on('dragenter dragover', false)
      .on('drop', function (e) {
        var dataTransfer = e.originalEvent.dataTransfer;
        e.stopPropagation();
        e.preventDefault();
        if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
          insertFiles(dataTransfer.files);
        }
      });
    };
    options = $.extend({}, $.fn.wysiwyg.defaults, userOptions);
    toolbarBtnSelector = 'a[data-' + options.commandRole + '],button[data-' + options.commandRole + '],input[type=button][data-' + options.commandRole + ']';
    bindHotkeys(options.hotKeys);
    if (options.dragAndDropImages) {
      initFileDrops();
    }
    bindToolbar($(options.toolbarSelector), options);
    editor.attr('contenteditable', true)
    .on('mouseup keyup mouseout', function () {
      saveSelection();
      updateToolbar();
    });
    $(window).bind('touchend', function (e) {
      var isInside = (editor.is(e.target) || editor.has(e.target).length > 0),
      currentRange = getCurrentRange(),
      clear = currentRange && (currentRange.startContainer === currentRange.endContainer && currentRange.startOffset === currentRange.endOffset);
      if (!clear || isInside) {
        saveSelection();
        updateToolbar();
      }
    });
    return this;
  };
  $.fn.wysiwyg.defaults = {
    hotKeys: {
      'ctrl+b meta+b': 'bold',
      'ctrl+i meta+i': 'italic',
      'ctrl+u meta+u': 'underline',
      'ctrl+z meta+z': 'undo',
      'ctrl+y meta+y meta+shift+z': 'redo',
      'ctrl+l meta+l': 'justifyleft',
      'ctrl+r meta+r': 'justifyright',
      'ctrl+e meta+e': 'justifycenter',
      'ctrl+j meta+j': 'justifyfull',
      'shift+tab': 'outdent',
      'tab': 'indent'
    },
    toolbarSelector: '[data-role=editor-toolbar]',
    commandRole: 'edit',
    activeToolbarClass: 'btn-info',
    selectionMarker: 'edit-focus-marker',
    selectionColor: 'darkgrey',
    dragAndDropImages: true,
    fileUploadError: function (reason, detail) { console.log("File upload error", reason, detail); }
  };
}(window.jQuery));
