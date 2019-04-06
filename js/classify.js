$(function () {

  // 页面数据全局变量 content
  var content;
  // 设置全局索引值
  var index = 0;
  renderer();

  // 获取页面数据
  function gainData() {
    // 因为数据结构的问题,接口只有一个,页面需要把接口里的全部数据显示到页面
    // 所以考虑,把数据存储到本地,用户在浏览的时候,从本地获取数据
    // 但是 不是每次都要发起ajax请求,用户第一次浏览页面之后获取数据储存到本地,
    // 在一定时间内,在次浏览时不需要发起ajax请求,直接通过本地存储的数据获取数据来渲染页面
    // 判断 
    // 通过接口获取数据
    $.get('categories', function (result) {
      if (result.meta.status == 200) {
        // 在写入本地储存时,把储存时间也同时储存到本地 Data.now()
        content = {
          'list': result,
          'time': Date.now()
        }
        //  console.log(content);
        localStorage.setItem('pyg_cateData', JSON.stringify(content));
      }
    }, 'json')
  };

  // 判断页面渲染
  function renderer() {
    // 判断是否需要发送ajax请求
    // 根据当前时间 与 本地储存数据的时间来判断 是否需要重新发起ajax请求
    // 获取本地储存数据
    content = JSON.parse(localStorage.getItem('pyg_cateData'))
    // 判断条件: 当content没值时,存储数据的时间与当前时间差一个小时时重新,获取
    // 不满足条件就不用获取,直接获取本地数据渲染页面
    if (content && Date.now() - content.time > 60 * 60 * 60) {
      // 满足条件直接渲染页面
      left_renderer();
      right_renderer();
    } else {
      // 超出时间重新获取
      console.log(123);
      gainData();
    }
  };

  // left 渲染
  function left_renderer() {
    let html = template('leftTemp', content.list)
    $('.left_list').html(html);
    // 页面滑动初始化代码
    var myScrollleft = new IScroll('.left');
    // 左边点击li使该元素到顶部
    $('.left').on('tap', 'li', function () {
      myScrollleft.scrollToElement(this, 300);
      // 获取当前点击的索引值
      index = $(this).index()
      // 通过 鼠标点击判断渲染右边数据结构
      right_renderer();
      // 点击的时候切换 active 的样式
      $(this).addClass('active').siblings().removeClass('active');
    });
  };
  // right 渲染
  function right_renderer() {
    let html = template('rightTemp', content.list.data[index]);
    $('.right_list').html(html);
    // 当页面全书图标加载完,在初始化滑动效果
    // 图片的总个数
    let imgLength = $('.right_list img').length;
    //  图片加载完都会触发一次 load 事件
    $('.right_list img').on('load', function () {
      // 当这个值为零的时候,初始化滑动效果
      imgLength--;
      if (imgLength == 0) {
        // 右侧滑动的初始化
        var myScrollright = new IScroll('.right');
      }
    })


    // 发现新问题,数据量太大,不可能一次全部渲染
    // 用户点击左侧栏时,才渲染该栏目下的数据
    // 用户点击左侧栏时候,获取索引值,根据索引值来渲染当前页面数据
    // 通过传过去渲染的数据出手,每次只传入当前用户点击栏目的数据
  };

})