var saveData = {};
var getData = {};
var sectionValue = 0;


window.onload = function() {
    var value = localStorage.getItem("sectionValue");
    if (value == null) {
        localStorage.setItem("sectionValue", 0);
    }
    
    sectionValue = localStorage.getItem("sectionValue");
    getNewContents();
}


/* 최근 글들을 가져오는 함수 */
function getNewContents() {
    /* 스토리지에 저장된 글 수만큼 가지고 온다. */
    for (var i = 0; i < sectionValue; i++) {
        var item = JSON.parse(localStorage.getItem(i));

        // 최상위 부모 요소 가져오기
        var new_contents = document.getElementById("new-contents");

        // 최근 글의 타이틀과 내용을 가지는 부모 요소
        var new_content = document.createElement("div");
        new_content.setAttribute("class", "new-content");
        new_content.setAttribute("onclick", "getContent(" + i + ")");

        // 최근 글의 타이틀 설정
        var new_content_title = document.createElement("div");
        new_content_title.setAttribute("class", "new-content-title");
        new_content_title.innerText = item["title"];
        new_content.appendChild(new_content_title);

        // 최근 글의 내용설정
        var new_content_content = document.createElement("p");
        new_content_content.setAttribute("class", "new-content-content");
        new_content_content.innerHTML = checkString(item["content"]);
        new_content.appendChild(new_content_content);

        // 최글 글 추가
        new_contents.appendChild(new_content);

        var hr = document.createElement("hr");
        new_contents.appendChild(hr);
    }
}


/* 생성 부분 */
// 글자 수 검사 함수
function checkString(string, length=160) {
    /* 글자 수를 검사하여 제한된 수 보다 작으면 앞에 글자만 강조한 뒤
    리턴하고 만약 글자 수를 넘으면 맨 뒤에 ...까지 넣어 리턴한다. */
    str = '<strong style="font-size: 2em;">' + string[0] + '</strong>' + string.substr(1, length);
    if (string.length > length) {
        return str + "...";
    } else {
        return str;
    }
}

// 저장
function saveContent() {
    // 제목, 카테고리, 내용 가져오기
    const title = document.querySelector("#create-title");

    const cartegory = document.querySelector("#create-cartegory");

    const content = document.querySelector("#create-content");

    /* 만약 비어있는 경우에 저장을 누르면 이상하게 작동하므로
    경고 문구를 띄워준다. */

    // 제목, 카테고리, 내용을 객체로 저장함
    saveData["title"] = title.value;
    saveData["cartegory"] = cartegory.value;
    saveData["content"] = content.innerText;
    saveData["html"] = content.innerHTML;
    
    // 객체 저장
    console.log(saveData);
    localStorage.setItem(sectionValue, JSON.stringify(saveData));

    /* new-content에 새로운 포스트 저장 */
    // 최근 글 부모 요소 가져오기
    var new_contents = document.getElementById("new-contents");

    // 새로운 콘텐츠의 부모 요소 가져오기
    var new_content = document.createElement("div");
    new_content.setAttribute("class", "new-content");
    new_content.setAttribute("onclick", "getContent(" + sectionValue + ")");

    // 최근 글 타이틀 설정
    var new_content_title = document.createElement("div");
    new_content_title.setAttribute("class", "new-content-title");
    new_content_title.innerText = saveData["title"];
    new_content.appendChild(new_content_title);

    // 최근 글 본문 설정
    var new_content_content = document.createElement("p");
    new_content_content.setAttribute("class", "new-content-content");

    // 첫 번째 글자는 강조를 하고 그 이후 160자 까지만 가져온다.
    // 글자수 검사
    new_content_content.innerHTML = checkString(saveData["content"]);

    // 최근 글 타이틀과 본문을 최근 글 자식 요소로 추가한다.
    new_content.appendChild(new_content_content);
    
    // 최근 글에 새롭게 작성된 글을 추가한다.
    new_contents.appendChild(new_content);

    // 구분선 추가
    var hr = document.createElement("hr");
    new_contents.appendChild(hr);

    // 현재까지 저장된 sectionValue 저장
    localStorage.setItem("sectionValue", ++sectionValue);
    
    /* 저장이 완료되면 최근 글 페이지로 돌아가고 제목, 카테고리, 내용 부분이 초기화 된다. */
    title.value = "";
    cartegory.value = "";
    content.innerHTML = "";
    content.innerText = "";
    prevPage();
}


/* 본문 페이지 */
function getContent(sectionValue) {

}
