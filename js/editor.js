function prepareEditor() {
    var md = window.markdownit({
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(lang, str).value;
                } catch (__) {}
            }
      
            return ''; // use external default escaping
        }
    });
    var editor = document.getElementById('editor');
    var input = editor.getElementsByClassName('aq-input')[0];
    var output = editor.getElementsByClassName('aq-output')[0];
    
    function updateOutput() {
        var html = md.render(input.value);
        output.innerHTML = html;
    }
    
    input.addEventListener('keyup', updateOutput);
    input.addEventListener('keydown', function(event) {
        if (event.keyCode == 9) { // tab
            event.preventDefault();

            var start = this.selectionStart;
            var end = this.selectionEnd;

            var target = event.target;
            target.value = target.value.substring(0, start) + '\t' + target.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 1;
        } else if (event.keyCode == 13) { // enter
            event.preventDefault();

            var start = this.selectionStart;
            var end = this.selectionEnd;

            var target = event.target;
            var value = target.value;

            var indentation = '';
            for (var i = start - 1; i >= 0 && value.charAt(i) != '\n'; i--) {
                if (value.charAt(i) == ' ' || value.charAt(i) == '\t') {
                    indentation += value.charAt(i);
                } else {
                    indentation = '';
                }
            }

            target.value = value.substring(0, start) + `\n` + indentation + value.substring(end);
            this.selectionStart = this.selectionEnd = start + 1 + indentation.length;
        }
    });
    
    updateOutput();
}
