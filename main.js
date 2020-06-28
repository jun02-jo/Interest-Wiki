var saveData = {};
// var contents = {};
var categoryList = [];
var sectionValue = 0;
var selected = undefined;


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
    var categories = [];
    categoryList = categories = JSON.parse(localStorage.getItem("categories"));
    var category_list = JSON.parse(JSON.stringify(categories)); // Array
    // var categoryList = JSON.parse(localStorage.getItem("categories"));
    var category = category_list.shift();

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
        span.setAttribute("class", "search-category");
        span.innerText = category;

        category_delete.appendChild(category_delete_icon);
        li.appendChild(category_delete);
        li.appendChild(span);
        show_categories.appendChild(li);

        // 글 작성 페이지에 있는 카테고리 선택 부분에 추가한다.
        var select_category = document.getElementById("select-category");

        var option = document.createElement("option");
        option.value = category;
        option.innerText = category;

        select_category.prepend(option);

        category = category_list.shift();
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
    var category_list = JSON.parse(JSON.stringify(categoryList));

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


/* 생성(글 작성) 부분 */

// 글 작성 시 새로고침, 탭 닫기 방지
window.onbeforeunload = function() {
    if (currentPage == pages["create"]) {
        if (confirm("작성하던 글이 저장되지 않습니다.\n정말 탭을 닫으시겠습니까?")) {
            event.returnValue = true;
        } else {
            event.returnValue = false;
        }
    }
}

// 글 작성 페이지 이동을 위한 부분
document.getElementById("create-button").addEventListener("click", function() {
    movePage('create');
})

loadCommandButtonFunc();
// 글 작성 버튼(굵게, 기울이기 등)을 눌렀을 때
// 목차 혹은 소목차일 경우 굵게, 기울이기 등을 막기 위한 함수
function loadCommandButtonFunc() {
    var commands = document.getElementsByClassName("create-command");
    [].forEach.call(commands, function(command) {
        command.addEventListener("click", function() {
            // bold일 경우 
            //  this.classList: ["create-command", "bold", value: "create-command bold"]
            // italic일 경우
            //  this.classList: ["create-command", "italic", value: "create-command italic"]
            var buttonType = this.classList[1];
            var selection = window.getSelection();
            var range = selection.getRangeAt(0);
            console.log(window.getSelection());
            if (selection.anchorNode) {
                selected = range;
                var selectedText = selected.toString();
                console.log(selectedText);
            }
        
            if (selectedText.indexOf("===") != -1 || selectedText.indexOf("==") != -1) {
                alert("목차나 소목차는 수정하실 수 없습니다.");
            } else {
                if (buttonType == "bold" || buttonType == "italic" || 
                buttonType == "strikeThrough" || buttonType == "underline")  {
                    document.execCommand(buttonType);
                } else if (buttonType == "link") {
                    console.log("링크 붙임");
                    // 선택한 부분 앞 뒤에 [[]]를 붙인다.
                    var node = document.createElement("span");
                    node.innerText = "[[" + selectedText + "]]";
                    
                    selected.deleteContents();
                    selected.insertNode(node);
                }
            }
        })
    })
}

// 카테고리 추가 버튼을 눌렀을 때
document.getElementById("create-category-button").addEventListener("click", function() {
    // 카테고리 추가 화면을 보이도록 설정한다.
    var create_category_dummy = document.getElementById("create-category-dummy");
    create_category_dummy.style.display = "block";

    var create_category = document.getElementById("create-category");
    create_category.style.display = "block";

    document.getElementById("create-category-name").focus();
});

// 카테고리 추가하는 함수
// 엔터키 누름
document.getElementById("create-category-name").onkeydown = function() {
    if (event.keyCode == 13) {
        addCategoryFunc();
    }
}

// 버튼 클릭
document.getElementById("create-new-category").addEventListener("click", addCategoryFunc);

function addCategoryFunc() {
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
    if (categoryList.indexOf(category_name) != -1 || category_name.length == 0) {
        // 리스트에 값이 있거나 입력 값이 비어있는 경우 경우
        return;
    } else {
        // 리스트에 값이 없을 경우
        categoryList.push(category_name);
        categorySelectUpdate(category_name);
        return;
    }
}

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

    // 타이틀의 글자 수를 검사한다.
    if (titleStrLengthCheck()) {
        return;
    }

    // 저장된 글 중 같은 제목이 있는지 검사한다.
    var titles = JSON.parse(localStorage.getItem("contents"));
    for (var i in titles) {
        console.log(titles[i]["title"]);
        // 만약 같은 제목이 있다면
        if (titles[i]["title"] == title.value) {
            // 경고창을 띄우고 제목 입력창을 비운다.
            alert("같은 제목의 글이 있습니다.");
            title.value = "";
            title.focus();
            return;
        }
    }

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
    saveData["content"] = convertContent(create_content);
    saveData["html"] = contentParsing(create_content_html);
    
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
        localStorage.setItem("categories", JSON.stringify(categoryList));
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
    span.setAttribute("class", "search-category");
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
    
    // 특정 키는 글자 수를 검사하는데 포함시키지 않는다.
    if (!(event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 16 ||
        event.keyCode == 17 || event.keyCode == 18 || event.keyCode == 20 ||
        event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
        event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 ||
        event.keyCode == 40 || event.keyCode == 36 || event.keyCode == 35 ||
        event.keyCode == 33 || event.keyCode == 34 || event.keyCode == 45 ||
        event.keyCode == 145 || event.keyCode == 19 || event.keyCode == 91 ||
        event.keyCode == 116 || event.keyCode == 123 ||
        (event.ctrlKey == true && event.keyCode == 'A'.charCodeAt())
        ))
    {
        titleStrLengthCheck();
    }
}

function titleStrLengthCheck() {
    var maxLength = 30;
    var str = document.getElementById("create-title").value;

    if (str.length >= maxLength) {
        alert("제목은 " + maxLength + "자 이상 작성하실 수 없습니다.");
        // document.getElementById("create-title").value = str.substring(0, maxLength - 1);
        document.getElementById("create-title").value = "";
        return true;
    }
}

window.addEventListener("mouseup", function() {
    if (this.event.button == 3) {
        prevPage();
    }
})

/* 본문 페이지 */
function getContent(value) {
    var toc = {
        big: "toc-big",
        small: "toc-small",
        line: "toc-line"
    };
    movePage('content');
    // 해당 내용을 가지고 온다.
    var content = JSON.parse(localStorage.getItem("contents"))[value];

    // 목차를 설정하는 함수
    function setToc() {
        var parent = document.getElementById("content-toc-nav");
        if (parent != null) {
            parent.remove();
        }

        var tocContent = JSON.parse(content["html"]);
        var tocBig = 0;
        var tocSmall = 0;

        var content_nav = document.getElementById("content-nav");
        // 목차를 추가할 부모 요소
        var content_toc_nav = document.createElement("ul");
        content_toc_nav.setAttribute("id", "content-toc-nav");

        // toc[i]: [class, name, content]
        for (var i = 0; i < tocContent.length; i++) {
            if (tocContent[i][0] != toc.line) {
                var value_class = tocContent[i][0];
                var value_name = tocContent[i][1];
                var value_content = tocContent[i][2];

                // 목차나 소목차일 경우에만 목차에 추가한다.
                // li 요소 추가
                var toc_li = document.createElement("li");
                var toc_a = document.createElement("a");

                if (value_class == toc.big) {
                    toc_li.setAttribute("class", value_class + " " + ++tocBig);
                    tocSmall = 0;

                    var span = document.createElement("span");
                    span.setAttribute("class", value_class + "-number");
                    span.innerText = tocBig + ".";

                    toc_a.setAttribute("href", "#" + value_name);
                    toc_a.setAttribute("name", "toc-" + value_name);

                    toc_a.appendChild(span);
                    toc_a.innerHTML += " " + value_content;
                } else if (value_class == toc.small){
                    toc_li.setAttribute("class", value_class + " " + ++tocSmall);

                    var span = document.createElement("span");
                    span.setAttribute("class", value_class + "-number");
                    span.innerText = tocBig + "." + tocSmall;

                    toc_a.setAttribute("href", "#" + value_name);
                    toc_a.setAttribute("name", "toc-" + value_name);
                    
                    toc_a.appendChild(span);
                    toc_a.innerHTML += " " + value_content;
                }

                toc_li.appendChild(toc_a);
                content_toc_nav.appendChild(toc_li);
            }
        }
        content_nav.appendChild(content_toc_nav);
    }
    setToc();

    var content_head = document.getElementById("content-head");
    content_head.dataset.index = value;

    // 본문 페이지의 타이틀, 본문 요소를 가지고 온다.
    var content_title = document.getElementById("content-title");
    var content_body = document.getElementById("content-body");

    content_title.innerText = content["title"];
    // content_content.innerHTML = content["html"];
    // html을 검사하여 목차를 어떻게 잘 만든다.
    setContent();
    function setContent() {
        var parent = document.getElementById("content-content");
        if (parent != null) {
            parent.remove();
        }

        var contentList = JSON.parse(content["html"]);
        var contentLine = 1;
        var tocBig = 0;
        var tocSmall = 0;

        // 전체 내용의 부모요소
        var content_content = document.createElement("div");
        content_content.setAttribute("id", "content-content");

        for (var i = 0; i < contentList.length; i++) {
            var value_class = contentList[i][0];
            var value_name = contentList[i][1];
            var value_content = contentList[i][2];

            if (value_class == toc.line) {
                var content_div = document.createElement("div");
                content_div.setAttribute("class", value_class + " " + contentLine++);
                content_div.innerHTML = value_content;
                
                content_content.appendChild(content_div);
            } else if (value_class == toc.big) {
                var content_a = document.createElement("a");
                content_a.setAttribute("class", value_class + " " + ++tocBig);
                content_a.setAttribute("href", "#" + "container");
                content_a.setAttribute("id", value_name);
                //ex) <div class="toc-big 1"></div>

                var span = document.createElement("span");
                span.setAttribute("class", value_class + "-number");
                span.innerText = tocBig + ".";
                /*ex) <div class="toc-big 1">
                    <span class="toc-big-number">1.</span>
                </div> */

                content_a.appendChild(span);
                content_a.innerHTML += " " + value_content;
                /*ex) <div class="toc-big 1">
                    <span class="toc-big-number">1.</span> 내용
                </div> */
                tocSmall = 0;                   

                content_content.appendChild(content_a);             
            } else if (value_class == toc.small) {
                var content_a = document.createElement("a");
                content_a.setAttribute("class", value_class + " " + ++tocSmall);
                content_a.setAttribute("href", "#" + "container");
                content_a.setAttribute("id", value_name);
                //ex) <div class="toc-small 1"></div>

                var span = document.createElement("span");
                span.setAttribute("class", value_class + "-number");
                span.innerText = tocBig + "." + tocSmall;
                /*ex) <div class="toc-small 1">
                    <span class="toc-small-number">1.1</span>
                </div> */

                content_a.appendChild(span);
                content_a.innerHTML += " " + value_content;
                /*ex) <div class="toc-small 1">
                    <span class="toc-small-number">1.1</span> 내용
                </div> */

                content_content.appendChild(content_a);
            }
        }
        content_body.appendChild(content_content);
    }
}


/* 검색 기능 */
document.getElementById("search-text").onkeydown = function() {
    // 엔터 키를 누를 시
    if (event.keyCode == 13) {
        search();
    }
}

document.getElementById("search-button").addEventListener("click", search);

function search() {
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
}

// 각 카테고리에 이벤트를 추가한다.
function loadCategories() {
    var search_category = document.getElementsByClassName("search-category");
    [].forEach.call(search_category, function(category) {
        category.addEventListener("click", function() {
            searchContent(this.parentNode.dataset.category, "category");
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

/* 목차 등을 나타내는 특수 문자들을 제외한 글자들을 반환한다.*/
function convertContent(convertingStr="") {
    console.log(convertingStr);
    console.log("변환 시작");
    // 목차, 소목차를 나타내는 =를 없앤다.
    var convertStr = convertingStr.replace(/=/gi, "");
    var str = "";
    var linkStr = "";

    // 링크 관련된 부분 중 불필요한 부분을 없앤다.
    // [[, ]], |, 외부 링크 등
    // convertStr이 빌 때 까지 반복
    while (!(convertStr == "")) {
        try {
            if (convertStr.indexOf("[[") == -1) {
                // 만약 링크가 없다면
                throw new Error("변환할 부분이 없습니다.");
            } else {
                // 일단 [[ 전까지의 문자열을 저장한다.
                str += convertStr.slice(0, convertStr.indexOf("[["));

                // [[의 뒷부분을 가지고 온다.
                convertStr = convertStr.slice(convertStr.indexOf("[[") + 2);

                // 링크에 관련된 문자열을 가지고 온다.
                linkStr = convertStr.slice(0, convertStr.indexOf("]]"));
                if (linkStr.indexOf("|") == -1) {
                    // 외부 링크가 없다면 그냥 저장한다.
                    str += linkStr;
                } else {
                    // 외부 링크가 있다면 글자 부분만 가지고 온다.
                    var showStr = linkStr.slice(linkStr.indexOf("|") + 1);
                    str += showStr;
                }

                // 남은 부분을 저장한다.
                convertStr = convertStr.slice(convertStr.indexOf("]]") + 2);
            }
        } catch (e) {
            str += convertStr;
            convertStr = "";
        }
    }

    console.log("변환 후");
    console.log(str);
    console.log(typeof str);
    return str;
}

document.getElementById("create-content").onkeydown = function() {
    // 탭 키를 눌렀을 때
    if (event.keyCode == 9) {
        document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
        event.preventDefault();
    }

    if (this.innerText == "===") {
        alert("내용의 첫 글자에는 ===를 사용하실 수 없습니다.\n == 또는 글자를 입력해주세요.");
        this.innerText = "";
    } else if (this.innerText == "<") {
        alert("내용의 첫 글자에는 <를 사용하실 수 없습니다.\n역슬래쉬(\\)를 붙이시거나 다른 글자를 입력해주세요.");
        this.innerText = "";
    }
}

/* 작성한 글을 구문 분석(파싱)을 통해 html을 반환한다. */
function contentParsing(parsingString="") {
    console.log("들어온 문자열: ", parsingString);
    // 인자로 들어온 문자열을 복사한다.
    var parseStr = parsingString;

    // 나누어진 문자열을 담을 리스트 변수
    var strs = [];
    // strs의 인덱스를 나타내는 변수
    var index = 0;

    // indexOf로 찾은 인덱스 번호를 나타내는 변수
    var findIndex = 0;

    // [elementClass, elementname, elementContent]
    // 반환할 변수
    var parsedContent = [];

    // 목차, 소목차, 그냥 문장을 나타내는 객체
    var toc = {
        big: "toc-big",
        small: "toc-small",
        line: "toc-line"
    };

    console.log("start while");
    // 맨 먼저 각 문장 별로 나누어 리스트에 담는다.
    while (parseStr != "") {
        console.log(strs);
        try {
            if (parseStr.substr(0, 5) === "<div>") {
                console.log("<div> 시작");
                // 붙여넣기를 했을 경우 맨 처음은 <div>로 시작한다.
                // 첫 번째줄이 스타일을 변형한 경우에는 무시한다.
                // 즉, <div>로만 나눈다.

                // <div>를 제외한 시작 인덱스
                var startIndex = 5;
                // 끝 부분을 찾는다.
                findIndex = parseStr.indexOf("</div>", startIndex);

                strs[index] = parseStr.substring(startIndex, findIndex);

                // 시작 인덱스 이후로 나타나는 <div>를 찾는다.
                if (parseStr.indexOf("<div>", startIndex) == -1) {
                    throw new Error("더이상 찾을 문자열이 없습니다.");
                }
                findIndex = parseStr.indexOf("<div>", startIndex);
                parseStr = parseStr.slice(findIndex);
                index++;
            } else {
                console.log("시작");
                // 붙여넣기를 하지 않을 경우 처음은 <div>로 시작하지 않는다.
                // 단, 스타일을 변형했을 경우에는 <~>로 시작한다.

                // <div>를 찾는다.
                if (parseStr.indexOf("<div>") == -1) {
                    strs[index] = parseStr;
                    throw new Error("더이상 찾을 문자열이 없습니다.");
                }
                findIndex = parseStr.indexOf("<div>");

                // 리스트 변수안에 문자열을 추가한다.
                strs[index] = parseStr.substring(0, findIndex);

                // 찾은 문자열을 제외하고 남은 문자열을 저장한다.
                parseStr = parseStr.slice(findIndex);
                index++;
            }
        } catch (e) {
            console.log(e);
            parseStr = "";
        }
            
    }
    console.log("end while");

    for (var i = 0; i <= index; i++) {
        // strParsing의 반환값은 리스트이다.
        parsedContent[i] = extractFromStr(strs[i]);
    }

    // 반환
    console.log(parsedContent);
    return JSON.stringify(parsedContent);

    // 문자열에서 필요한 정보만 추출한다.
    function extractFromStr(eStr="") {
        console.log("extractFromStr");
        console.log(eStr);
        var element = [];
    
        strParsing(eStr);

        // [[class, name, content]]의 형태
        // extractFromStr의 return이다.
        return element;


        // 문자열을 분석한다.
        function strParsing(str="") {
            console.log("strParsing");
            str.replace(/^ /gi, "");
            if (str[0] == "*") {
                console.log("리스트");
                str = str.replace("*", "<span class='content_list'>●</span>");
                console.log(str);
            }
            console.log("str: " + str);

            var elementClass = "";
            var elementName = "";
            var elementContent = ""; // html형태로 저장된다.
            var inputText = "";
    
            if (str.substr(0, 3) == "===") {
                // 소목차
                inputText = str.substring(3, str.indexOf("=", 3));

                elementClass = toc.small;
                elementName = inputText;
                elementContent = inputText;
            } else if (str.substr(0, 2) == "==") {
                // 목차
                inputText = str.substring(2, str.indexOf("=", 2));

                elementClass = toc.big;
                elementName = inputText;
                elementContent = inputText;
            } else {
                elementClass = toc.line;
                elementName = "";

                // 문장 안에 링크가 있나 없나 검사해야 함
                if (str.indexOf("[[") == -1) {
                    // 링크가 없으면 바로 저장
                    elementContent = str;
                } else {
                    var linkStr = "";

                    // 만약 링크가 있다면 여러개가 있을 수 있으므로
                    // 반복해서 검사한다.
                    while (str != "") {
                        // str이 빌 때 까지 검사한다.
                        try {
                            if (str.indexOf("[[") == -1) {
                                // 만약 링크가 더 없으면 남은 문자열을 다 더한다.
                                elementContent += str;
                                throw new Error("더이상 분석할 문자열이 없습니다.");
                            } else {
                                console.log("분석 중..");
                                // [[ 앞에 있는 문자열을 먼저 담는다.
                                // TODO 에러 발생
                                elementContent += str.substring(0, str.indexOf("[["));

                                // [[ 앞에 있는 문자열을 잘라낸다.
                                // [[ 뒤에 있는 문자열을 가져옴
                                str = str.slice(str.indexOf("[["));

                                // 링크에 관련된 문자열을 가지고 온다.
                                linkStr = str.substring(2, str.indexOf("]]"));
                                console.log("linkStr: " + linkStr);

                                // 링크가 외부 링크인지(|가 있는지)
                                // 내부 링크인지 (|가 없는지) 검사한다.
                                if (linkStr.indexOf("|") != -1) {
                                    // 외부 링크 (|가 있다)
                                    console.log("외부 링크 거는 중..");
                                    if (linkStr.substr(0, 2) == "</") {
                                        linkStr = linkStr.slice(linkStr.indexOf("<", 2));
                                    }

                                    var link = linkStr.slice(0, linkStr.indexOf("|")); // 링크 부분
                                    if (link.substr(0, 2) == "<a") {
                                        link = link.slice(link.indexOf(">") + 1, link.indexOf("<", 3));
                                    }

                                    var showStr = linkStr.slice(linkStr.indexOf("|") + 1); // 글자 부분
                                    
                                    // <a class='content=link' href='link'>showStr</a>
                                    elementContent += "<a class='content_link' href='" + link + "' target='_blank'>" + showStr + "</a>";
                                    console.log("link: " + link);

                                } else {
                                    console.log("내부 링크 거는 중..");
                                    // 내부 링크 (|가 없다)
                                    // 입력한 값과 일치하는 제목이 있을 경우
                                    // 해당 글로 링크를 건다. (getContent)
                                    var findContent = function() {
                                        var contents = JSON.parse(localStorage.getItem("contents"));
                                        for (var i = 0; i < sectionValue; i++) {
                                            if (contents[i] != null) {
                                                if (contents[i]["title"] === linkStr) {
                                                    // 만약 타이틀이 일치하다면 해당 글로 링크를 건다.
                                                    // ex) <span class='content_link' onclick='getContent(0)'>ABC</span>
                                                    elementContent += "<span class='content_link' onclick='getContent(" + i + ")'>" + linkStr + "</span>";
                                                    return true;
                                                }
                                            }
                                        }
                                    }
                                    if (!findContent()) {
                                        // 만약 해당되는 글이 없을 경우
                                        elementContent += "<span class='havent_content_link'>" + linkStr + "</span>";
                                    }
                                } // if (linkStr.indexOf("|"))

                                // 다시 검사하기 위해 ]] 뒤에 있는 문자열을 가지고 온다.
                                str = str.slice(str.indexOf("]]") + 2);
                            } //if (str.indexOf("[[") == -1)
                            console.log(elementContent);
                        } catch (e) {
                            console.log(e);
                            str = "";
                        }
                    } // while(str != "")
                } //if (str.indexOf("[[") == -1)
            }

            element.push(elementClass, elementName, elementContent);
        }
    }
}

// 카테고리 삭제
var category_delete_buttons = document.getElementsByClassName("category-delete");
[].forEach.call(category_delete_buttons, function(category_delete) {
    category_delete.addEventListener("click", function() {
        var category = this.parentNode.dataset.category;

        // 저장된 콘텐츠 중 해당되는 카테고리를 없앤다.
        var categories = JSON.parse(localStorage.getItem("categories"));
        localStorage.removeItem("categories");
        categories.splice(categories.indexOf(category), 1);
        localStorage.setItem("categories", JSON.stringify(categories));

        // 저장된 콘텐츠 중 해당되는 카테고리와 동일한 글의 카테고리를 없앤다.
        var contents = JSON.parse(localStorage.getItem("contents"));
        localStorage.removeItem("contents");
        for (var i in contents) {
            if(contents[i]["category"] === category) {
                contents[i]["category"] = "none";
            }
        }
        localStorage.setItem("contents", JSON.stringify(contents));
        
        this.parentNode.remove();
    })
})

// 본문 삭제
document.getElementById("content-delete-button").addEventListener("click", function() {
    var contentValue = this.parentNode.parentNode.dataset.index;
    var contents = JSON.parse(localStorage.getItem("contents"));
    localStorage.removeItem("contents");
    delete contents[contentValue];
    localStorage.setItem("contents", JSON.stringify(contents));

    prevPage(true);
})