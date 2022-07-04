var
    back = document.getElementById('back'),
    path = '/',
    backLink = document.createElement('a'),
    backBtn = document.createElement('img');

backLink.onclick = function() {
	if (window.history.length > 1 && document.referrer.startsWith(window.location.origin)){
            if (window.location.href.endsWith('?download') && sessionStorage.getItem('prevUrl') === window.location.href.replace('?download', '')) window.history.go(-2);
            else window.history.back();
        }
	else window.location.href = "../../";
};

backBtn.src = `${path}assets/back.png`;
backLink.appendChild(backBtn);
back.appendChild(backLink);