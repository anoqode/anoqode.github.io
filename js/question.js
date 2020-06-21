function findGetParameter(name) {
    var result = null;
    location
        .search
        .substr(1)
        .split("&")
        .forEach(function(item) {
            var parts = item.split("=");
            if (parts[0] === name) {
                result = decodeURIComponent(parts[1]);
            }
        });
    return result;
}

function twoDigits(value) {
    if (value < 10) {
        return '0' + value.toString();
    } else {
        return value.toString();
    }
}

window.addEventListener('load', function() {
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

    var id = findGetParameter('id');
    if (!id) { return; }

    var xhr = new XMLHttpRequest();
    
    // Success
    xhr.onload = function() {
        var response = JSON.parse(xhr.response);
        if (response.success) {
            var main = document.getElementsByTagName('main')[0];
            
            var question = document.getElementsByClassName('aq-question')[0];
            var html = md.render(response.body);
            var date = new Date();
            date.setTime(response.time);
            question.innerHTML = '<div class="aq-time"><time>'
                + date.getFullYear()
                + '-'
                + twoDigits(date.getMonth() + 1)
                + '-'
                + twoDigits(date.getDate())
                + ' '
                + twoDigits(date.getHours())
                + ':'
                + twoDigits(date.getMinutes())
                + '</time></div>'
                + html;

            main.appendChild(question);
        } else {
            alert('⛔ データを取得できません。');
        }
    };

    // Failure
    xhr.onerror = function(event) {
        alert('⛔ データを取得できません。');
    };

    xhr.open(
        'GET',
        'https://asia-northeast1-anoqode.cloudfunctions.net/question?id='
            + encodeURIComponent(id)
    );
    xhr.send();
});
