$(function () {

  // 商品页面滑动初始化
  $('.mui-pull-right').on('tap', function () {
    mui('.mui-off-canvas-wrap').offCanvas('show');
  });
  // 初始化页面滚动
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  });

  // ajax 请求参数 设置成全局
  var data = {
    cid: goods_cid().cid,
    pagenum: 1,
    pagesize: 10
  };
  // 获取cid的值 location.search 获取url地址栏 ?和?后面的值 cid 就在? 后面
  // ? 后面的值有可能是 ?cid=12&name=jake
  function goods_cid() {
    let obj = {};
    // 获取?后的值
    let url = location.search.substring(1); // cid=12.....
    // 在 &处 打断 url
    var arr = url.split('&') // 返回一个数组 ["cid=12"]
    // 二次拆分 并把拆分出来的数据传入到 obj 这个对象中
    for (let i = 0; i < arr.length; i++) {
      obj[arr[i].split('=')[0]] = arr[i].split('=')[1]
    }
    return obj
  };
  // 发起ajax请求获取数据渲染页面
  function goods_list_ajax(callback) {
    $.ajax({
      type: 'get',
      url: 'goods/search',
      data: data,
      dataType: 'json',
      success: function (result) {
        callback(result)
      }
    })
  }
  // 下拉刷新业务
  mui.init({
    pullRefresh: {
      container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        height: 50, //可选,默认50.触发下拉刷新拖动距离,
        auto: true, //可选,默认false.首次加载自动下拉刷新一次
        contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
        contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
        contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        callback: function () { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          // 下拉结束
          // 业务需求: 下拉刷新,重新发送ajax请求,并渲染页面
          // 上拉加载更多时,也应该获取更换多数据渲染页面
          // 有2个函数需要运行 goods_list_ajax 这个函数,所以应传入一个回调函数,并且把result 作为参数传入这个函数
          goods_list_ajax(function (result) {
            // 渲染页面
            console.log(123);
            
            let html = template('goods_listTemp', result.data);
            $('.center ul').html(html)
            // 页面渲染完在 结束下拉效果
            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
            // 启用上拉效果
            mui('#pullup-container').pullRefresh().enablePullupToRefresh();
          });
        }
      }, // down
      up: {
        height: 50, //可选.默认50.触发上拉加载拖动距离
        auto: true, //可选,默认false.自动上拉加载一次
        contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
        contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
        callback: function () { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          // 上拉 加载更多,
          // 实际代码 改变 pagesize 的值,在重新渲染页面
          goods_list_ajax(function (result) {
            console.log(result.data.goods);
            if (result.data.goods.length > 0) {
              // 渲染页面
              let html = template('goods_listTemp', result.data);
              $('.center ul').html(html);
              // 页面渲染完在 结束下拉效果
              mui('#refreshContainer').pullRefresh().endPullupToRefresh();
            } else {
              // 当页面没有新数据的时候进制上拉操作 在重新加载页面的时候启用
              mui('#pullup-container').pullRefresh().disablePullupToRefresh();
            }
          })
        }
      }
    }
  });
})