// 최근 글 페이지, 글 작성 페이지, 검색 페이지, 수정 페이지, 본문 페이지를 보여주는 코드들입니다.

// 페이지에 관련된 데이터들
var pages = {
    new: "main-new-content",
    create: "main-create-screen",
    search: "main-search-screen",
    content: "main-content",
};
var pagesData = [pages["new"]];
var currentPage = pagesData[0];

// 페이지 이동 함수
function movePage(nextPageKey) {
    /* keys: new, create, search, content */
    // 다음 페이지에 맞는 값을 가져온다.
    if (pages[nextPageKey] != currentPage) {
        var nextPage = pages[nextPageKey];
        // 현재 페이지는 보이지 않도록 설정
        var cur = document.getElementById(currentPage);
        cur.style.display = "none";

        // 페이지 리스트에 다음 페이지 추가
        pageClear(nextPage);
        pagesData.push(nextPage);
        var next = document.getElementById(nextPage);
        if (nextPageKey == 'create') {
            next.style.display = "flex";
        } else {
            next.style.display = "block";
        }
        currentPage = nextPage;
    }
}

// 이전 페이지로 돌아가는 함수
function prevPage(isContentRemove=false) {
    /* pagesData의 맨 뒤의 값(현재 페이지)을 가져와 페이지가 보이지 않도록 설정한다. */
    if (pagesData.length > 1) {
        var page = pagesData.pop()
        if (page == [pages['search']]) {
            var cur = document.getElementById(pageClear(page, false));
        } else {
            var cur = document.getElementById(pageClear(page));
        }
        cur.style.display = "none";

        /* pagesData에 있는 마지막 값(이전 페이지)을 가져와 페이지가 보이도록 설정한다. */
        prev_page = pagesData[pagesData.length - 1];
        var prev = document.getElementById(prev_page);
        prev.style.display = "block";
        loadPage(page);
        if (isContentRemove) {
            loadPage(pages["new"]);
        }
        currentPage = prev_page;
    }
}

// 페이지 이동 시 페이지 내에서 비워야 할 부분이 있으면 지우는 함수
function pageClear(page, isClear=true) {
    if (isClear) {
        if (page == pages['create']) {
            // 이동 전 페이지가 생성(글 작성) 페이지 였을경우
            var title = document.getElementById("create-title");
            var category = document.getElementById("select-category");
            var content = document.getElementById("create-content");

            title.value = "";
            category.value = "none";
            content.innerText = "";
        } else if(page == pages['search']) {
            // 더이상 검색 페이지가 없을 경우
            // 페이지를 비운다.
            var main_search_screen = document.getElementById("main-search-screen");

            // 검색된 글들을 담고있는 부모 요소를 없앤다.
            var searched = document.getElementById("searched");
            searched.remove();

            // 삭제한 부모요소를 다시 만든 뒤 
            // main-search-screen에 추가한다.
            searched = document.createElement("ul");
            searched.setAttribute("id", "searched");
            main_search_screen.appendChild(searched);
        }
    }

    return page;
}

function loadPage(page) {
    if (page == pages['new']) {
        // contents를 가지고 온다.
        var contents = JSON.parse(localStorage.getItem("contents"));
        
        var main = document.getElementById(page);

        // new-contents를 삭제하고 다시 추가한다.
        var new_contents = document.getElementById("new-contents");
        new_contents.remove();

        new_contents = document.createElement("div");
        new_contents.setAttribute("id", "new-contents");

        main.appendChild(new_contents);

        /* 스토리지에 저장된 글 수만큼 가지고 온다. */
        for (var i = 0; i < sectionValue; i++) {
            if (contents[i] == undefined) {
                continue;
            } else {
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

                // 최근 글 추가
                new_contents.prepend(new_content);
            }
        }
    }
}