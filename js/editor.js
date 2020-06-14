function prepareEditor() {
    var md = window.markdownit();
    var input = document.getElementById('input');
    var output = document.getElementById('output');
    
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
            target.value = target.value.substring(0, start) + "\t" + target.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 1;
        }
    });
    
    updateOutput();
}
