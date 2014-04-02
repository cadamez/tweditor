var tweditor = (function() {

  var root = this;

  var textarea,
      editarea;
 
  //Build Editor and Preview
  build_editor = function(textarea_selector) {
    textarea = $(textarea_selector);
    textarea.wrap('<div class="markdown"></div>');
    editarea = textarea.parent();
    editarea.wrap('<div class="tweditor view-mode"></div>');
    var viewer = editarea.parent();
    var preview = $('<div class="html"></div>');

    editarea.before(_create_menu_buttons());
    //editarea.after(preview);
  };

  //Create menu
  _create_menu_buttons = function() {
    var editButton = '<li class="editModeButton"><i class="fa fa-edit"></i></li>';
    var viewButton = '<li class="viewModeButton"><i class="fa fa-eye"></i></li>';
    var boldButton = '<li><i class="fa fa-bold"></i></li>';
    var italicButton = '<li><i class="fa fa-italic"></i></li>';
    var splitScreenButton = '<li class="splitScreenButton"><i class="fa fa-expand"></i></li>';

    menu = $('<ul class="tweditorMenu"></ul>');
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
  populate_editor = function() {
    editor = CodeMirror.fromTextArea(textarea.get(0), {
      lineNumbers: true,
      lineWrapping: true,
      mode: "markdown"
    });
    viewer.width(textarea.width());
    editor.setSize(textarea.width(),textarea.height());
    var convert = function(cm) { 
      preview.html(marked(cm.getValue()));
    };
    return editor;
  };

  setup_handlers = function() {
    editor.on("change", function(cm, changeObject) {
      convert(cm);
    });
    convert(editor);
    splitScreenButton.on("click", function() {
      viewer.addClass("fullscreen").removeClass("view-mode").removeClass("edit-mode");  
      editor.refresh(); //not documented
    });
    editButton.on("click", function() {
      viewer.removeClass("fullscreen").removeClass("view-mode").addClass("edit-mode");  
      editor.refresh();
    });
    viewButton.on("click", function() {
      viewer.removeClass("fullscreen").addClass("view-mode").removeClass("edit-mode");  
      editor.refresh();
    });
    boldButton.on("click", function() {
      var newText = editor.getSelection().replace('*', '', 'g');
      editor.replaceSelection(' **'+newText+'** ', "end");
      editor.focus();
    });
    italicButton.on("click", function() {
      var newText = editor.getSelection().replace('*', '', 'g');
      editor.replaceSelection(' *'+newText+'* ', "end");
      editor.focus();
    });
    headerDropDown.on("change", function(e) {
      var headerDepth = parseInt($(e.target).val());
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
*/

  return {
    init: function() {
      build_editor('textarea#markdown');
    }
  }

})();
