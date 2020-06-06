// 최근 글 페이지, 글 작성 페이지, 검색 페이지, 수정 페이지, 본문 페이지를 보여주는 코드들입니다.

// 페이지에 관련된 데이터들
var pages = {
    new: "main-new-content",
    create: "main-create-screen",
    search: "main-search-screen",
    content: "main-content"
};
var pagesData = [pages["new"]];
var currentPage = pagesData[0];

// 페이지 이동 함수
function movePage(nextPageKey) {
    // 다음 페이지에 맞는 값을 가져온다.
    var nextPage = pages[nextPageKey];

    // 현재 페이지는 보이지 않도록 설정
    var cur = document.getElementById(currentPage);
    cur.style.display = "none";

    // 페이지 리스트에 다음 페이지 추가
    pagesData.push(nextPage);
    var next = document.getElementById(nextPage);
    if (nextPageKey == 'create') {
        next.style.display = "flex";
    } else {
        next.style.display = "block";
    }
}

// 이전 페이지로 돌아가는 함수
function prevPage() {
    /* pagesData의 맨 뒤의 값(현재 페이지)을 가져와 페이지가 보이지 않도록 설정한다. */
    var cur = document.getElementById(pageClear(pagesData.pop()));
    cur.style.display = "none";

    /* pagesData에 있는 마지막 값(이전 페이지)을 가져와 페이지가 보이도록 설정한다. */
    PrevPage = pagesData[pagesData.length - 1];
    var prev = document.getElementById(PrevPage);
    prev.style.display = "block";

}

// 페이지 이동 시 페이지 내에서 비워야 할 부분이 있으면 지우는 함수
function pageClear(page) {
    if (page == pages['create']) {
        // 이동 전 페이지가 생성(글 작성) 페이지 였을경우
        var title = document.getElementById("create-title");
        var category = document.getElementById("select-category");
        var content = document.getElementById("create-content");

        title.value = "";
        category.value = "none";
        content.innerText = "";
    }

    return page;
}