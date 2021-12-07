window.onload = function () {
    function animate(obj, target, callbak) {
        // 动画函数
        clearInterval(obj.timer);
        obj.timer = setInterval(function () {
            var step = (target - obj.offsetLeft) / 10;
            step = step > 0 ? Math.ceil(step) : Math.floor(step);
            if (obj.offsetLeft === target) {
                clearInterval(obj.timer);
                if (callbak) callbak();
            }
            obj.style.left = obj.offsetLeft + step + 'px';
        }, 10)
    }
    const viewport = document.querySelector('.viewport');
    const btn_lt = viewport.children[0], // 左侧箭头
        btn_rt = viewport.children[1], // 右侧箭头
        ul = viewport.children[2], // 轮播大盒子
        ol = viewport.children[3]; // 小圆圈
    let num = 0,
        circle = 0, // 把右侧按钮和小圆圈关联起来
        flag = true; //节流阀
    // 鼠标经过箭头显示，离开隐藏
    viewport.addEventListener('mouseenter', () => {
        btn_lt.style.display = 'block';
        btn_rt.style.display = 'block';
        clearInterval(timer); //关闭自动轮播
        timer = null;

    })
    viewport.addEventListener('mouseleave', () => {
        btn_lt.style.display = 'none';
        btn_rt.style.display = 'none';
        timer = setInterval(() => {
            btn_rt.click();  //开启
        }, 2000);
    })

    // 动态生成小圆圈
    for (let i = 0; i < ul.children.length; i++) {
        let li = document.createElement('li');
        li.index = i; //给li加索引号 这里也可以加自定义属性 setAttribute
        ol.appendChild(li);
    }
    ol.children[0].className = 'current'; // 给第一个注册current

    // 点击谁给谁注册current,其余排除
    for (let i = 0; i < ol.children.length; i++) {
        ol.children[i].addEventListener('mouseenter', function () {
            // 因为异步问题，所以这里可以用i
            for (let i = 0; i < ol.children.length; i++) {
                ol.children[i].className = '';
            }
            this.className = 'current';
            circle = num = this.index; //把圆圈和右侧箭头关联起来

            // 点击小圆圈图片滑动
            let target = -this.index * viewport.offsetWidth;
            animate(ul, target)
        })
    }

    // 右侧按钮无缝滑动
    // 需要克隆第一张图片实现无缝滚动
    const first = ul.children[0].cloneNode(true);
    ul.appendChild(first);

    btn_rt.addEventListener('click', function () {
        if (flag) {
            flag = false;
            if (num === ul.children.length - 1) {
                ul.style.left = 0;
                num = 0;
            }
            num++;
            animate(ul, -num * viewport.offsetWidth, function () {
                flag = true;
            });
            circle++;
            if (circle === ol.children.length) {
                circle = 0;
            }
            circleChange();
        }
    })
    btn_lt.addEventListener('click', function () {
        if (flag) {
            flag = false;
            if (num == 0) {
                num = ul.children.length - 1;
                ul.style.left = -num * viewport.offsetWidth + 'px';

            }
            num--;
            animate(ul, -num * viewport.offsetWidth, function () {
                flag = true;
            });
            // 点击左侧按钮，小圆圈跟随一起变化 可以再声明一个变量控制小圆圈的播放
            circle--;
            // 如果circle < 0  说明第一张图片，则小圆圈要改为第4个小圆圈（3）
            // if (circle < 0) {
            //     circle = ol.children.length - 1;
            // }
            circle = circle < 0 ? ol.children.length - 1 : circle;
            // 调用函数
            circleChange();
        }
    });
    function circleChange() {
        // 先清除其余小圆圈的current类名
        for (var i = 0; i < ol.children.length; i++) {
            ol.children[i].className = '';
        }
        // 留下当前的小圆圈的current类名
        ol.children[circle].className = 'current';
    }
    // 自动轮播

    let timer = setInterval(() => {
        btn_rt.click();
    }, 2000);


}
