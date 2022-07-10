var headingList = [];

function getScrollOffset() {
    if (mw.config.get('skin') === 'timeless' && $(window).width() > 850) {
        return 60;
    } else {
        return 10;
    }
}

function getAnchorOffset() {
    if (mw.config.get('skin') === 'timeless' && $(window).width() > 850) {
        return 70;
    } else {
        return 15;
    }
}

function scrollToAnchor(link) {
    var target = $(link.replace(/\./g, '\\.'));
	if (target.length > 0) {
        function doScroll() {
            var position = target.offset().top - getScrollOffset();

            $('html, body').animate({
                scrollTop: position,
            }, 500);
        }

        if (mw.config.get('skin') === 'minerva') { // 手机端主体，需要检测折叠状态
            var collapseBlock = target.parents('.collapsible-block');
            if (collapseBlock.length > 0 && !collapseBlock.hasClass('open-block')) {
                var h1Elem = collapseBlock.prev('.collapsible-heading');
                if (h1Elem.length > 0) {
                    // 展开目录
                    h1Elem.click();
                    var tid = setInterval(function() {
                        // 检测是否已经展开
                        if (collapseBlock.hasClass('open-block')) {
                            doScroll();
                            clearInterval(tid);
                        }
                    }, 100);
                    return false;
                }
            }
            doScroll();
        } else {
            doScroll();
        }
        return false;
	} else {
	    return true;
	}
}

function getScrollbarWidth() {
    if (window.innerWidth && document.body.clientWidth) {
        return window.innerWidth - document.body.clientWidth;
    } else {
        return 0;
    }
}

function updateActive() {
    var scrollTop = $(window).scrollTop() + getAnchorOffset();
    console.log('scroll top', scrollTop);
    $('#isekai-offcanvas-toc ul .list-item').removeClass('active');
    
    if (headingList.length > 0) {
        var activedId;
        for (var i = 0; i < headingList.length; i ++) {
            var headItem = headingList[i];
            var headPos = headItem.offset().top;
            if (i === 0 && scrollTop < headPos) { // 比第一个head位置靠上，则是简介
                activedId = 'bodyContent';
                break;
            } else if (scrollTop < headPos) { // 如果当前滚动条高度低于目前head，则是上一个
                activedId = headingList[i - 1].attr('id');
                break;
            }
        }
        if (!activedId) {
            activedId = [headingList.length - 1].attr('id');
        }
        $('#isekai-offcanvas-toc ul .list-item[data-id="' + activedId + '"]').addClass('active');
    }
}

function openOffcanvas() {
    let scrollbarWidth = getScrollbarWidth();
    $('body').addClass(['toc-offcanvas-show', 'toc-offcanvas-open'])
        .css('margin-right', scrollbarWidth);
    $('#iseai-offcanvas-btn').css('margin-right', scrollbarWidth);

    // 滚动到当前项目
    let activedItem = $('#isekai-offcanvas-toc ul .list-item.active');
    if (activedItem.length > 0) {
        let targetY = Math.max(activedItem.eq(0).prop('offsetTop') - 50, 0);
        $('#isekai-offcanvas-toc').scrollTop(targetY);
    }
}

function closeOffcanvas() {
    $('body').removeClass('toc-offcanvas-open');
    setTimeout(function() {
        $('body').removeClass('toc-offcanvas-show').css('margin-right', 0);
        $('#iseai-offcanvas-btn').css('margin-right', 0);
    }, 260);
}

// 生成目录
$(function() {
    var parserOutput = $('.mw-parser-output');
    var headings = parserOutput.find('h1,h2,h3,h4,h5,h6');

    var headNum = new Array(6).fill(0);
    var menuList = [{
        number: false,
        text: '简介',
        id: 'bodyContent'
    }];

    headings.each(function() {
        var headline = $(this).find('.mw-headline');
        if (headline.length > 0) {
            headingList.push(headline);
            var text = headline.text();
            var headId = headline.prop('id');
            var indentNum = parseInt(this.tagName.replace(/^H/, ''));
            // 计算折叠
            var menuNumStringBuilder = [];
            headNum[indentNum - 1] ++;
            for (var i = 0; i < indentNum; i ++) {
                menuNumStringBuilder.push(headNum[i]);
            }
            for (var i = indentNum; i < headNum.length; i ++) {
                headNum[i] = 0;
            }
            var menuNum = menuNumStringBuilder.join('.');
            menuList.push({
                number: menuNum,
                text: text,
                id: headId
            });
        }
    });

    // 生成dom
    var tocContainer = $('#isekai-offcanvas-toc ul');
    menuList.forEach(function(menuInfo) {
        var listItem = document.createElement('a');
        listItem.href = '#' + menuInfo.id;
        listItem.dataset.id = menuInfo.id;
        listItem.classList.add('list-item');

        var titleItem = document.createElement('span');
        titleItem.classList.add('title');
        titleItem.innerText = menuInfo.text;

        if (menuInfo.number) {
            var numberItem = document.createElement('span');
            numberItem.classList.add('number');
            numberItem.innerText = menuInfo.number;
            listItem.appendChild(numberItem);
        }
        
        listItem.appendChild(titleItem);

        tocContainer[0].appendChild(listItem);
    });

    // 事件
    $('#isekai-offcanvas-cover').on('click', function() {
        closeOffcanvas();
    });

    $('#iseai-offcanvas-btn').on('click', function() {
        updateActive();
        openOffcanvas();
    });

    $('#isekai-offcanvas-toc ul .list-item').on('click', function(e) {
        // 点击链接
        e.preventDefault();
        var target = $(this).data('id');
        if (target && target != '') {
            target = '#' + target;
            $('#isekai-offcanvas-toc ul .list-item').removeClass('active');
            $(this).addClass('active');
            scrollToAnchor(target);
            if ($(window).width() < 550) { // 手机端，关闭抽屉
                closeOffcanvas();
            }
        }
        return false;
    });
});