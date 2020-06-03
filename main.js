var saveData = {};
var getData = {};
var categories = [];
var sectionValue = 0;


window.onload = initData();

// 데이터들을 초기화 하는 함수이다.
function initData() {
    var value = localStorage.getItem("sectionValue");
    if (value == null) {
        localStorage.setItem("sectionValue", 0);
    }
    
    sectionValue = localStorage.getItem("sectionValue");
    getNewContents();
    getCategories();
}

function dataUpdate() {
    
}


/* 카테고리를 가져오는 함수 */
function getCategories() {
    // var category = JSON.parse(localStorage.getItem("categories"));

    // for (var i = 0; i < category.length; i++) {
    //     var show_categories = document.getElementById("show-categories");

    //     var category_list = document.createElement("li");
    //     category_list.setAttribute("class", "category-content");

    //     // 추후 변경
    //     var category_list_element = document.createElement("a");
    //     category_list_element.setAttribute("href", "#");
    //     category_list_element.innerHTML = category[i];

    //     category_list.appendChild(category_list_element);

    //     show_categories.appendChild(category_list);
    // }
}


/* 최근 글들을 가져오는 함수 */
function getNewContents() {
    /* 스토리지에 저장된 글 수만큼 가지고 온다. */
    for (var i = 0; i < sectionValue; i++) {
        // 브라우저에 저장되어 있는 데이터를 가져온다.
        var item = JSON.parse(localStorage.getItem(i));

        // 최상위 부모 요소 가져오기
        var new_contents = document.getElementById("new-contents");

        // 최근 글의 타이틀과 내용을 가지는 부모 요소
        var new_content = document.createElement("div");
        new_content.setAttribute("class", "new-content");
        new_content.setAttribute("onclick", "getContent(" + i + ")");
        // new_content.dataset.index = i;

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

        // 구분선 추가
        var hr = document.createElement("hr");
        new_contents.appendChild(hr);
    }
}

// 사이드 화면의 카테고리 부분을 업데이트하는 함수이다.
function setCategories() {
    // 추가할 카테고리의 부모 요소를 가지고 온다.
    var show_categories = document.getElementById("show-categories");

    // 리스트에 존재하는 카테고리들을 복사한다. (참조없이)
    var category_list = JSON.parse(JSON.stringify(categories));

    // 복사한 리스트를 하나씩 꺼내며(pop) 카테고리 요소에 추가한다.
    do {
        var categoryValue = category_list.pop();

        var list = document.createElement("li");
        list.setAttribute("class", "category-content");

        // 검색 기능이 추가되면 수정 필요
        var a = document.createElement("a");
        a.setAttribute("href", "home.html");
        a.innerText = categoryValue;

        list.appendChild(a);
        show_categories.appendChild(list);
    } while (categoryValue != undefined)
}


/* 생성 부분 */

// 카테고리 추가 버튼을 눌렀을 때
var create_category_button = document.getElementById("create-category-button");
create_category_button.addEventListener("click", function() {
    // 카테고리 추가 화면을 보이도록 설정한다.
    var create_category_dummy = document.getElementById("create-category-dummy");
    create_category_dummy.style.display = "block";

    var create_category = document.getElementById("create-category");
    create_category.style.display = "block";
});

// 카테고리 추가하는 함수
var create_new_category = document.getElementById("create-new-category");
create_new_category.addEventListener("click", function () {
    // 카테고리 추가 화면을 보이지 않도록 설정한다.
    var create_category_dummy = document.getElementById("create-category-dummy");
    create_category_dummy.style.display = "none";

    var create_category = document.getElementById("create-category");
    create_category.style.display = "none";

    // 입력된 값을 가져온다.
    var category_name = document.getElementById("create-category-name").value;

    // 리스트에 값이 존재하는지 검사한다.
    if (categories.indexOf(category_name) != -1) {
        // 리스트에 값이 있을 경우
        return;
    } else {
        // 리스트에 값이 없을 경우
        categories.push(category_name);
        localStorage.setItem("categories", JSON.stringify(categories));
        categorySelectUpdate(category_name);
        return;
    }
});

// 카테고리를 선택하는 부분의 데이터를 업데이트 하는 함수이다.
function categorySelectUpdate(categoryName) {
    // select 요소를 가지고 온다.
    var select_category = document.getElementById("select-category");

    // option을 만든다. (value값은 카테고리 이름으로 정한다.)
    var option = document.createElement("option");
    option.value = categoryName;
    option.innerText = categoryName;

    // select 요소에 option을 카테고리 없음 위에 추가한다.
    select_category.prepend(option);
}


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


var save = document.getElementById("content-save");
save.addEventListener("click", saveContent);

// 저장
function saveContent() {
    // 제목, 카테고리, 내용 가져오기
    create_title = document.querySelector("#create-title").value;
    create_category = document.querySelector("#select-category").value;
    create_content = document.querySelector("#create-content").innerText;
    create_content_html = document.querySelector("#create-content").innerHTML;

    /* 만약 비어있는 경우에 저장을 누르면 이상하게 작동하므로
    경고 문구를 띄워준다. */

    // 제목, 카테고리, 내용을 객체로 저장함
    saveData["title"] = create_title;
    saveData["category"] = create_category;
    saveData["content"] = create_content;
    saveData["html"] = create_content_html;
    
    // 객체 저장
    localStorage.setItem(sectionValue, JSON.stringify(saveData));

    /* new-content에 새로운 포스트 저장 */
    // 최근 글 부모 요소 가져오기
    var new_contents = document.getElementById("new-contents");

    // 새로운 콘텐츠의 부모 요소 가져오기
    var new_content = document.createElement("div");
    new_content.setAttribute("class", "new-content");
    new_content.setAttribute("onclick", "getContent(" + sectionValue + ")");
    // new_content.dataset.index = sectionValue;

    // 최근 글 타이틀 설정
    var new_content_title = document.createElement("div");
    new_content_title.setAttribute("class", "new-content-title");
    new_content_title.innerText = saveData["title"];
    new_content.appendChild(new_content_title);


    /* 카테고리 설정 */
    addCategory(create_category);

    /* 최근 글 본문 설정 */
    var new_content_content = document.createElement("p");
    new_content_content.setAttribute("class", "new-content-content");

    // 첫 번째 글자는 강조를 하고 그 이후 160자 까지만 가져온다.
    // 글자수 검사
    new_content_content.innerHTML = checkString(saveData["content"]);

    // 최근 글 타이틀과 본문을 최근 글 자식 요소로 추가한다.
    new_content.appendChild(new_content_content);
    
    // 최근 글에 새롭게 작성된 글을 추가한다.
    new_contents.appendChild(new_content);


    /* 구분선 추가 */
    var hr = document.createElement("hr");
    new_contents.appendChild(hr);

    // 현재까지 저장된 sectionValue 저장
    localStorage.setItem("sectionValue", ++sectionValue);
    

    /* 저장이 완료되면 최근 글 페이지로 돌아가고 제목, 카테고리, 내용 부분이 초기화 된다. */
    create_title = "";
    create_category = "";
    create_content = "";
    create_content_html = "";
    prevPage();
}

// 왼쪽에 있는 카테고리에 요소를 추가하는 함수이다.
function addCategory(categoryName) {
    // 요소가 추가될 부모 카테고리를 가지고 온다.
    var show_categories = document.getElementById("show-categories");

    // 가져온 부모 요소의 자식 요소들을 가지고 온다.
    var category_lists = show_categories.getElementsByTagName("li");
    if (category_lists.length == 0) {
        // 자식 요소가 없을 경우 카테고리를 추가한다.
        createCategory(show_categories, categoryName);
    } else {

        // 자식 요소들의 데이터를 가지고 온다.
        var get_categories = null;

        for (var i = 0; i < category_lists.length; i++) {
            get_categories.push(category_lists[i].dataset.category);
        }

        // 가지고온 데이터 안에 카테고리가 없을 경우 카테고리를 추가한다.
        if (get_categories.indexOf(categoryName) == -1) {
            createCategory(show_categories, categoryName);
        }
    }
}

function createCategory(parent, categoryName) {
    // li 요소를 만든다.
    var li = document.createElement("li");
    li.setAttribute("class", "category-content");
    // li 요소의 데이터를 추가할 카테고리의 이름으로 저장한다.
    li.dataset.category = categoryName;

    // 검색 기능을 만들면 수정 필요
    var a = document.createElement("a");
    a.setAttribute("href", "home.html");
    a.innerText = categoryName;

    li.appendChild(a);
    parent.appendChild(li);
}


/* 본문 페이지 */
function getContent(value) {
    console.log(value);
}
