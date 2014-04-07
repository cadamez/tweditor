var tweditor = (function() {
  var buffers = {};

  create_editor = function(textarea_selector) {
    var $textarea = $(textarea_selector);
    $(textarea_selector).wrap('<div class="tweditor view-mode"><div class="markdown"></div></div>');
    $('div.tweditor').prepend(_create_menu_buttons())
                     .append('<div class="html"></div>');

    $textarea.each(function() {
      _setup_editor($(this));
    });
  };

  _setup_editor = function(textarea) {
    var twContainer = textarea.parents('div.tweditor');
    var preview = twContainer.find('.html'); 
    var editor = CodeMirror(function(node) {
        textarea.parent().append(node);
        textarea.hide();
      }, {
      value: textarea.text(),
      lineNumbers: true,
      lineWrapping: true,
      mode: "markdown"
    });
    var width = textarea.width() || twContainer.width();
    var height =  textarea.is("textarea") ? textarea.height() : "auto";
    editor.setSize(width,height);

    var convert = function(cm) { 
      preview.html(marked(cm.getValue()));
    };
    editor.on("change", function(cm, changeObject) {
      convert(cm);
    });
    convert(editor);

    init_button_handlers(twContainer, editor);
  };
  //Create text editing menu
  _create_menu_buttons = function() {
    var editButton = '<li><button type="button" data-tw-action="edit"><i class="fa fa-edit"></i></button></li>';
    var viewButton = '<li><button type="button" data-tw-action="view"><i class="fa fa-eye"></i></li>';
    var boldButton = '<li><button type="button" data-tw-action="bold"><i class="fa fa-bold"></i></button></li>';
    var italicButton = '<li><button type="button" data-tw-action="italic"><i class="fa fa-italic"></i></li>';
    var splitScreenButton = '<li><button type="button" data-tw-action="splitScreen"><i class="fa fa-expand"></i></button></li>';

    var menu = $('<ul class="tweditorMenu"></ul>');
    menu.html($(splitScreenButton + editButton + viewButton +
                '<li class="seperator">|</li>' +
                boldButton + italicButton));

    menu.append(_create_header_dropdown());
    return menu;
  };

  // Creates a dropdown of header styles (H1, H2, etc) for the menu.
  // Possibly should just return a string that can be used for plain JS or jQuery insertion
  _create_header_dropdown = function() {
    var headerDropDown = $('<select class="headerDropDown">');
    // iterate over header levels
    for (var i=0;i<6;i++) {
      if (i===0) {
        var val = '';
      } else {
        var val = 'H'+i;
      }
      headerDropDown.append($('<option>').attr('value', i).text(val));
    }
    var headerButton = $('<li></li>');
    headerButton.append(headerDropDown);
    return headerButton;
  };

  /*
  buttonHandlers = {
    'bold': 
    'editMode'
    'viewMode'
    'italic':
    'splitScreen': 
  }
  */

  init_button_handlers = function(twContainer, editor) {
    twContainer.find('button[data-tw-action="splitScreen"]').click( function() {
      twContainer.addClass("fullscreen").removeClass("view-mode").removeClass("edit-mode");  
      editor.refresh();
    });
    twContainer.find('button[data-tw-action="edit"]').on("click", function() {
      twContainer.removeClass("fullscreen").removeClass("view-mode").addClass("edit-mode");  
      editor.refresh();
    });
    twContainer.find('button[data-tw-action="view"]').on("click", function() {
      twContainer.removeClass("fullscreen").addClass("view-mode").removeClass("edit-mode");  
      editor.refresh();
    });
     twContainer.find('button[data-tw-action="bold"]').on("click", function() {
      var newText = editor.getSelection().replace('*', '', 'g');
      editor.replaceSelection(' **'+newText+'** ', "end");
      editor.focus();
    });
   twContainer.find('button[data-tw-action="italic"]').on("click", function() {
      var newText = editor.getSelection().replace('*', '', 'g');
      editor.replaceSelection(' *'+newText+'* ', "end");
      editor.focus();
    });
    twContainer.find('.headerDropDown').on("change", function(e) {
      var headerDepth = parseInt(twContainer.find(e.target).val());
      console.log(headerDepth);
      var cursorStart = editor.getCursor("start");
      var cursorEnd = editor.getCursor("end"); 
      for (var i = cursorStart.line; i<=cursorEnd.line; i++) {
        var line = editor.getLine(i);
        var tokens = marked.lexer(line);
        var newLine = Array();
        var hasHeader = false;
        tokens.forEach(function(val, index) {
          if (val.type === "blockquote_start") {
            newLine.push('> ');
          } else if (val.type === "heading") {
            newLine.push(Array(headerDepth+1).join('#')+val.text);
            hasHeader = true;
          } else if (val.type === "paragraph") {
            if (!hasHeader) {
              newLine.push(Array(headerDepth+1).join('#')+val.text);
              hasHeader = true;
            } else {
              newLine.push(val.text);
            }
          } else {
            newLine.push(val.text);
          }
        });
        editor.setLine(i, newLine.join(''));
      }
      editor.setSelection(cursorStart, cursorEnd);
      editor.focus();
    }); 
  };


  return {
    init: function(selector) {
      create_editor(selector);
    }
  }

})();
