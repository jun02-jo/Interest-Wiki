var saveData = {};
// var contents = {};
var categories = [];
var sectionValue = 0;


window.onload = initData();

// 데이터들을 초기화 하는 함수이다.
function initData() {
    // sectionValue가 존재하지 않을 시 sectionValue를 0으로 저장한다.
    if (localStorage.getItem("sectionValue") != null) {
        sectionValue = localStorage.getItem("sectionValue");
        getNewContents();
    }

    if (localStorage.getItem("categories") != null) {
        getCategories();
        loadCategories();
    }
}


/* 카테고리를 가져오는 함수 */
function getCategories() {
    categories = JSON.parse(localStorage.getItem("categories"));
    var categoryList = JSON.parse(JSON.stringify(categories)); // Array
    // var categoryList = JSON.parse(localStorage.getItem("categories"));
    var category = categoryList.shift();

    while (category != undefined) {
        // aside에 있는 show-categories 부분에 추가한다.
        var show_categories = document.getElementById("show-categories");
        
        var li = document.createElement("li");
        li.setAttribute("class", "category-content");
        li.dataset.category = category;

        // 삭제 버튼
        var category_delete = document.createElement("span");
        category_delete.setAttribute("class", "category-delete");

        // 삭제 버튼 아이콘
        var category_delete_icon = document.createElement("i");
        category_delete_icon.setAttribute("class", "fa fa-times");

        var span = document.createElement("span");
        span.innerText = category;

        category_delete.appendChild(category_delete_icon);
        li.appendChild(category_delete);
        li.appendChild(span);
        show_categories.appendChild(li);

        // 글 작성 페이지에 있는 카테고리 선택 부분에 추가한다.
        var select_category = document.getElementById("select-category");

        var update_category = document.getElementById("update-category");

        var option = document.createElement("option");
        option.value = category;
        option.innerText = category;

        select_category.prepend(option);

        update_category.prepend(option);

        category = categoryList.shift();
    }
}


/* 최근 글들을 가져오는 함수 */
function getNewContents() {
    // contents를 가지고 온다.
    var contents = JSON.parse(localStorage.getItem("contents"));
    

    /* 스토리지에 저장된 글 수만큼 가지고 온다. */
    for (var i = 0; i < sectionValue; i++) {
        if (contents[i] == undefined) {
            continue;
        }
        // 최상위 부모 요소 가져오기
        var new_contents = document.getElementById("new-contents");

        // 최근 글의 타이틀과 내용을 가지는 부모 요소
        var new_content = document.createElement("div");
        new_content.setAttribute("class", "new-content");
        new_content.setAttribute("onclick", "getContent(" + i + ")");
        new_content.dataset.index = i;

        // 최근 글의 타이틀 설정
        var new_content_title = document.createElement("div");
        new_content_title.setAttribute("class", "new-content-title");
        new_content_title.innerText = checkString(contents[i]["title"], 15, "title");
        new_content.appendChild(new_content_title);

        // 최근 글의 내용설정
        var new_content_content = document.createElement("p");
        new_content_content.setAttribute("class", "new-content-content");
        new_content_content.innerHTML = "&emsp;" + checkString(contents[i]["content"]);
        new_content.appendChild(new_content_content);

        // 구분선 추가
        var hr = document.createElement("hr");
        new_content.appendChild(hr);
        
        // 최글 글 추가
        new_contents.prepend(new_content);
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
        li.dataset.category = categoryValue;

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
document.getElementById("create-category-button").addEventListener("click", function() {
    // 카테고리 추가 화면을 보이도록 설정한다.
    var create_category_dummy = document.getElementById("create-category-dummy");
    create_category_dummy.style.display = "block";

    var create_category = document.getElementById("create-category");
    create_category.style.display = "block";
});

// 카테고리 추가하는 함수
document.getElementById("create-new-category").addEventListener("click", function () {
    // 카테고리 추가 화면을 보이지 않도록 설정한다.
    var create_category_dummy = document.getElementById("create-category-dummy");
    create_category_dummy.style.display = "none";

    var create_category = document.getElementById("create-category");
    create_category.style.display = "none";

    // 입력된 값을 가져온다.
    var input_category = document.getElementById("create-category-name");
    var category_name = input_category.value;

    // 카테고리 추가에 있는 input태그의 값을 비운다.
    input_category.value = "";

    // 리스트에 값이 존재하거나 입력 값이 비어있는지 검사한다.
    if (categories.indexOf(category_name) != -1 || category_name.length == 0) {
        // 리스트에 값이 있거나 입력 값이 비어있는 경우 경우
        return;
    } else {
        // 리스트에 값이 없을 경우
        categories.push(category_name);
        categorySelectUpdate(category_name);
        return;
    }
});

// 카테고리를 선택하는 부분의 데이터를 업데이트 하는 함수이다.
function categorySelectUpdate(categoryName) {
    // select 요소를 가지고 온다.
    var select_category = document.getElementById("select-category");
    // update 요소를 가지고 온다.
    var update_category = document.getElementById("update-category");

    // option을 만든다. (value값은 카테고리 이름으로 정한다.)
    var option = document.createElement("option");
    option.value = categoryName;
    option.innerText = categoryName;

    // select 요소에 option을 카테고리 없음 위에 추가한다.
    select_category.prepend(option);

    update_category.prepend(option);
}

// 카테고리 추가 화면을 끄는 기능
document.getElementById("close-create-category-button").addEventListener("click", function() {
    var create_category_dummy = document.getElementById("create-category-dummy");
    create_category_dummy.style.display = "none";

    var create_category = document.getElementById("create-category");
    create_category.style.display = "none";
    
    var input_category = document.getElementById("create-category-name");
    input_category.value = "";
})

// 글자 수 검사 함수
function checkString(string="", length=160, type="content") {
    /* 글자 수를 검사하여 제한된 수 보다 작으면 앞에 글자만 강조한 뒤
    리턴하고 만약 글자 수를 넘으면 맨 뒤에 ...까지 넣어 리턴한다. */
    if (type == "content") {
        str = '<strong style="font-size: 2em;">' + string[0] + '</strong>' + string.substr(1, length);

        if (string.length > length) {
            return str + "...";
        } else {
            return str;
        }
    } else {
        if (string.length > length) {
            return string.substr(0, length) + "...";
        } else {
            return string;
        }
    }
}

// 작성한 글 저장 버튼
document.getElementById("content-save").addEventListener("click", saveContent);

// 저장
function saveContent() {
    // 제목, 카테고리, 내용 가져오기
    var title = document.getElementById("create-title");
    var category = document.getElementById("select-category");
    var content = document.getElementById("create-content");

    // 각 요소의 값들만 가져온다.
    var create_title = title.value;
    var create_category = category.value;
    var create_content = content.innerText;
    var create_content_html = content.innerHTML;

    /* 만약 비어있는 경우에 저장을 누르면 이상하게 작동하므로
    경고 문구를 띄워준다. */
    if (create_title == "") {
        // 제목이 비어있을 경우
        alert("제목이 입력되지 않았습니다.\n제목을 입력해주세요.");
        return;
    }

    if (create_content == "") {
        // 내용이 비어있을 경우
        alert("내용이 입력되지 않았습니다.\n내용을 입력해주세요.");
        return;
    }

    // 제목, 카테고리, 내용을 객체로 저장함
    saveData["title"] = create_title;
    saveData["category"] = create_category;
    saveData["content"] = create_content;
    saveData["html"] = create_content_html;
    
    // 객체 저장
    saveContentData()

    /* new-content에 새로운 포스트 저장 */
    //최근 글 부모 요소 가져오기
    var new_contents = document.getElementById("new-contents");

    // 새로운 콘텐츠의 부모 요소 가져오기
    var new_content = document.createElement("div");
    new_content.setAttribute("class", "new-content");
    new_content.setAttribute("onclick", "getContent(" + sectionValue + ")");
    new_content.dataset.index = sectionValue;

    // 최근 글 타이틀 설정
    var new_content_title = document.createElement("div");
    new_content_title.setAttribute("class", "new-content-title");
    new_content_title.innerText = checkString(saveData["title"], 15, "title");
    new_content.appendChild(new_content_title);


    /* 카테고리 설정 */
    if (create_category != "none"){
        addCategory(create_category);

        // 저장된 카테고리 스토리지에 저장
        localStorage.setItem("categories", JSON.stringify(categories));
    }

    /* 최근 글 본문 설정 */
    var new_content_content = document.createElement("p");
    new_content_content.setAttribute("class", "new-content-content");

    // 첫 번째 글자는 강조를 하고 그 이후 160자 까지만 가져온다.
    // 글자수 검사
    new_content_content.innerHTML = "&emsp;" + checkString(saveData["content"]);

    // 최근 글 타이틀과 본문을 최근 글 자식 요소로 추가한다.
    new_content.appendChild(new_content_content);
    
    /* 구분선 추가 */
    var hr = document.createElement("hr");
    new_content.appendChild(hr);

    // 최근 글에 새롭게 작성된 글을 추가한다.
    new_contents.prepend(new_content);

    // 현재까지 저장된 sectionValue 저장
    localStorage.setItem("sectionValue", ++sectionValue);

    loadCategories();
    /* 저장이 완료되면 최근 글 페이지로 돌아가고 제목, 카테고리, 내용 부분이 초기화 되며
    이전 페이지로 돌아가게 된다. */
    prevPage();
}

// 왼쪽에 있는 카테고리에 요소를 추가하는 함수이다.
function addCategory(categoryName) {
    // 요소가 추가될 부모 카테고리를 가지고 온다.
    var show_categories = document.getElementById("show-categories");
    
    // 가져온 부모 요소의 자식 요소들을 가지고 온다.
    var category_lists = show_categories.getElementsByTagName("li");

    /* 왼쪽에 있는 카테고리에 중복되는 값이 있는지 검사 */
    if (category_lists.length == 0) {
        createCategory(show_categories, categoryName);
    } else {

        /* 카테고리의 중복을 방지하는 코드 */
        // 자식 요소들의 데이터를 가지고 온다.
        var get_categories = [];
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

    // 삭제 버튼
    var category_delete = document.createElement("span");
    category_delete.setAttribute("class", "category-delete");

    // 삭제 버튼 아이콘
    var category_delete_icon = document.createElement("i");
    category_delete_icon.setAttribute("class", "fa fa-times");

    // 검색 기능을 만들면 수정 필요
    var span = document.createElement("span");
    span.innerText = categoryName;

    category_delete.appendChild(category_delete_icon);
    li.appendChild(category_delete);
    li.appendChild(span);
    parent.appendChild(li);
}

function saveContentData() {
    /* 내용 저장 */
    if (localStorage.getItem("contents") != null) {
        var tempContent = JSON.parse(localStorage.getItem("contents"));
        tempContent[sectionValue] = saveData;
        localStorage.removeItem("contents");
        localStorage.setItem("contents", JSON.stringify(tempContent));
    } else {
        var tempContent = {};
        tempContent[sectionValue] = saveData;
        localStorage.removeItem("contents");
        localStorage.setItem("contents", JSON.stringify(tempContent));
    }
}

// 글 작성 시 제목의 글자 수가 30자를 넘어가지 않도록 한다.
document.getElementById("create-title").onkeydown = function() {
    // 입력받을 최대 글자 수(30자)를 넘어갈 경우 경고창을 내보낸다
    // console.log(event);
    // console.log(event.keyCode);
    var str = document.getElementById("create-title").value;
    var maxLength = 30;
    var strCheck = false;

    // 특정 키는 글자 수를 검사하는데 포함시키지 않는다.
    if ((event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 16 ||
        event.keyCode == 17 || event.keyCode == 18 || event.keyCode == 20 ||
        event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
        event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 ||
        event.keyCode == 40 || event.keyCode == 36 || event.keyCode == 35 ||
        event.keyCode == 33 || event.keyCode == 34 || event.keyCode == 45 ||
        event.keyCode == 145 || event.keyCode == 19 || event.keyCode == 91 ||
        event.keyCode == 116 || 
        (event.ctrlKey == true && event.key == 'a') ||
        (event.ctrlKey == true && event.keyCode == 'w')))
    {
        strCheck = false;
    } else {
        strCheck = true;
    }

    if (strCheck && (str.length >= maxLength)) {
        alert("제목은 30자 이상 작성하실 수 없습니다.");
        document.getElementById("create-title").value = str.substring(0, maxLength);
    }
}

window.addEventListener("mouseup", function() {
    if (this.event.button == 3) {
        prevPage();
    }
})

/* 본문 페이지 */
function getContent(value) {
    movePage('content');
    var content = JSON.parse(localStorage.getItem("contents"))[value];

    var content_head = document.getElementById("content-head");
    content_head.dataset.index = value;

    // 본문 페이지의 타이틀, 본문 요소를 가지고 온다.
    var content_title = document.getElementById("content-title");
    var content_content = document.getElementById("content-content");

    content_title.innerText = content["title"];
    content_content.innerHTML = content["html"];

    document.getElementById("content-update-button").addEventListener("click", function(){
        updatePage(content_head.dataset.index);
    });
}


/* 검색 기능 */
document.getElementById("search-button").addEventListener("click", function() {
    var search_text = document.getElementById("search-text");
    var value = search_text.value;
    if (value == "") {
        // 입력칸이 비어있을 경우 알려준다.
        search_text.focus();
        search_text.setAttribute("class", "wrong");
        search_text.placeholder = "제목을 입력하세요!";
        setTimeout(function() {
            search_text.removeAttribute("class");
            search_text.placeholder = "제목 입력";
        }, 650);
    } else {
        searchContent(value, "title");
    }
});

// 각 카테고리에 이벤트를 추가한다.
function loadCategories() {
    var search_category = document.getElementsByClassName("category-content");
    [].forEach.call(search_category, function(category) {
        category.addEventListener("click", function() {
            searchContent(category.dataset.category, "category");
        })
    })
}

function searchContent(value, whatSearch) {
    // 페이지 이동
    pageClear(pages['search']);
    movePage('search');

    // 검색 값을 알려준다.
    var search_title = document.getElementById("search-title");
    search_title.innerHTML = "<span id='result'>검색결과</span>"

    if (whatSearch == "title") {
        search_title.innerHTML += " 제목" + " - " + value;
    } else if (whatSearch == "category") {
        search_title.innerHTML += " 카테고리" + " - " + value;
    }

    // 저장된 글들을 가지고 온다.
    var contents = JSON.parse(localStorage.getItem("contents"));
    // 검색할 값과 일치하는 값들을 가지고 온다.
    if(whatSearch == "title") {
        for (var content in contents) {
            if (contents[content]["title"].indexOf(value) != -1) {
                addSearchedContent(contents[content], content);
            }
        }
    } else  if(whatSearch == "category") {
        for (var content in contents) {
            if (contents[content]["category"] == value) {
                addSearchedContent(contents[content], content);
            }
        }
    }

    document.getElementById("search-text").value = "";
}

function addSearchedContent(content, index) {
    // 부모 요소
    var searched = document.getElementById("searched");

    // 요소 추가

    var li = document.createElement("li");
    li.setAttribute("class", "searched-content");
    li.setAttribute("onclick", "getContent(" + index + ")");

    // 검색된 내용의 제목 설정
    var searched_content_title = document.createElement("div");
    searched_content_title.setAttribute("class", "searched-content-title");
    searched_content_title.innerText = content["title"] + " ";

    // 제목과 카테고리 중간의 붙임표
    var searched_dash = document.createElement("span")
    searched_dash.setAttribute("class", "searched-dash");
    searched_dash.innerText = "-";

    // 검색된 내용의 카테고리 설정
    var searched_content_category = document.createElement("span");
    searched_content_category.setAttribute("class", "searched-content-category");
    if (content["category"] == "none") {
        searched_content_category.innerText = " " + "카테고리 없음";
    } else {
        searched_content_category.innerText = " " + content["category"];
    }
    

    // 검색된 내용의 내용 설정
    var searched_content_content = document.createElement("div");
    searched_content_content.setAttribute("class", "searched-content-content");
    searched_content_content.innerHTML = "&emsp;&emsp;" + checkString(content["content"], 100, "searched-content");
    
    searched_content_title.appendChild(searched_dash);
    searched_content_title.appendChild(searched_content_category);
    li.appendChild(searched_content_title);
    li.appendChild(searched_content_content);
    searched.appendChild(li);
}

function updatePage(value) {
    movePage('update');

    var content = JSON.parse(localStorage.getItem("contents"))[value];

    var update_head = document.getElementById("update-head");
    update_head.dataset.content = value;

    var update_content = document.getElementById("update-content");
    var update_title = document.getElementById("update-title");

    update_content.innerHTML = content["html"];
    update_title.innerText = content["title"];

    document.getElementById("cancel").addEventListener("click", function(){
        if(confirm("변경된 내용은 저장되지 않습니다.\n취소하시겠습니까?")){
        prevPage();
    } 

    });

    document.getElementById("content-update").addEventListener("click", function(){
        if(confirm("저장하시겠습니까?")){
        updateContent(update_head.dataset.content);
    } 

    });
}


// 저장
function updateContent(value) {

    // 제목, 카테고리, 내용 가져오기
    var title = document.getElementById("update-title");
    var category = document.getElementById("update-category");
    var content = document.getElementById("update-content");

    // 각 요소의 값들만 가져온다.
    var update_title = title.innerText;
    var update_category = category.value;
    var update_content = content.innerText;
    var update_content_html = content.innerHTML;

    /* 만약 비어있는 경우에 저장을 누르면 이상하게 작동하므로
    경고 문구를 띄워준다. */
    if (update_title == "") {
        // 제목이 비어있을 경우
        alert("제목이 입력되지 않았습니다.\n제목을 입력해주세요.");
        return;
    }

    if (update_content == "") {
        // 내용이 비어있을 경우
        alert("내용이 입력되지 않았습니다.\n내용을 입력해주세요.");
        return;
    }

    // 제목, 카테고리, 내용을 객체로 저장함
    saveData["title"] = update_title;
    saveData["category"] = update_category;
    saveData["content"] = update_content;
    saveData["html"] = update_content_html;
    
    var update_head = document.getElementById("update-head");
    update_head.dataset.content = value;

    // 객체 저장
    if (localStorage.getItem("contents") != null) {
        var tempContent = JSON.parse(localStorage.getItem("contents"));
        localStorage.removeItem("contents");
        delete tempContent[update_head.dataset.content];
        tempContent[update_head.dataset.content] = saveData;
        localStorage.setItem("contents", JSON.stringify(tempContent));
    } else {
        var tempContent = {};
        tempContent[update_head.dataset.content] = saveData;
        localStorage.removeItem("contents");
        delete tempContent[update_head.dataset.index]
        localStorage.setItem("contents", JSON.stringify(tempContent));
    }

    /* new-content에 새로운 포스트 저장 */
    //최근 글 부모 요소 가져오기
    var new_contents = document.getElementById("new-contents");

    // 새로운 콘텐츠의 부모 요소 가져오기
    var new_content = document.createElement("div");
    new_content.setAttribute("class", "new-content");
    new_content.setAttribute("onclick", "getContent(" + sectionValue + ")");
    new_content.dataset.index = sectionValue;

    // 최근 글 타이틀 설정
    var new_content_title = document.createElement("div");
    new_content_title.setAttribute("class", "new-content-title");
    new_content_title.innerText = checkString(saveData["title"], 15, "title");
    new_content.appendChild(new_content_title);


    /* 카테고리 설정 */
    if (update_category != "none"){
        addCategory(update_category);

        // 저장된 카테고리 스토리지에 저장
        localStorage.setItem("categories", JSON.stringify(categories));
    }

    /* 최근 글 본문 설정 */
    var new_content_content = document.createElement("p");
    new_content_content.setAttribute("class", "new-content-content");

    // 첫 번째 글자는 강조를 하고 그 이후 160자 까지만 가져온다.
    // 글자수 검사
    new_content_content.innerHTML = "&emsp;" + checkString(saveData["content"]);

    // 최근 글 타이틀과 본문을 최근 글 자식 요소로 추가한다.
    new_content.appendChild(new_content_content);
    
    /* 구분선 추가 */
    var hr = document.createElement("hr");
    new_content.appendChild(hr);

    // 최근 글에 새롭게 작성된 글을 추가한다.
    new_contents.prepend(new_content);

    // 현재까지 저장된 sectionValue 저장
    localStorage.setItem("sectionValue", ++sectionValue);

    loadCategories();
    /* 저장이 완료되면 최근 글 페이지로 돌아가고 제목, 카테고리, 내용 부분이 초기화 되며
    이전 페이지로 돌아가게 된다. */
    window.location.reload(true);
}
