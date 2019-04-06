$(function () {
  // 轮播图动态渲染
  $.ajax({
    type: 'get',
    url: 'home/swiperdata',
    dataType: 'json',
    success: function (result) {
      if (result.meta.status == 200) {
        // 生成dom结构代码
        let html = template('pyg_sliderTemp', result);
        $('.pyg_slide_image').html(html);
        // 生成小圆点结构代码
        let dat = template('pyg_datTemp', result);
        $('.pyg_dat').html(dat);
        //MUI中动态生成的结构需要手动初始化
        var gallery = mui('.mui-slider');
        gallery.slider({
          interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
      }else {
        console.log('数据获取失败');
      }
    }
  })
  // 产品部分动态渲染
  $.ajax({
    type: 'get',
    url: 'home/goodslist',
    dataType: 'json',
    success: function (result) {
      if (result.meta.status == 200) {
        let html = template('pyg_dataTemp', result);
        $('.pyg_data').html(html)
      } else {
        console.log('数据获取失败');
      }

    }
  })
})