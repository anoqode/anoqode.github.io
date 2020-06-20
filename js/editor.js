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
    var sendButton = editor.getElementsByClassName('aq-send-button')[0];
    
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

    sendButton.addEventListener('click', function(event) {
        input.disabled = true;
        sendButton.disabled = true;
        var question = input.value;
        var xhr = new XMLHttpRequest();
        var data = 'question=' + encodeURIComponent(question);
        
        // Success
        xhr.onload = function() {
            var response = JSON.parse(xhr.response);
            if (response.success) {
                window.location.href = './question?id=' + response.id;
            } else {
                alert('⛔ 投稿に失敗しました。');
                input.disabled = false;
                sendButton.disabled = false;
            }
        };

        // Failure
        xhr.onerror = function(event) {
            alert('⛔ 投稿に失敗しました。');
            input.disabled = false;
            sendButton.disabled = false;
        };

        xhr.open('POST', 'https://asia-northeast1-anoqode.cloudfunctions.net/add-question');
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(data);
    });
    
    updateOutput();
}
