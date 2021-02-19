Page({

  onShareAppMessage() {
    return {
      title: '小程序官方组件展示',
      path: 'page/component/index'
    }
  },
  data: {
    list: [],
    theme: 'light'
  },
  bindNavigateToWebPage(event) {
    let url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: '../webpage/webpage?url=' + escape(url)
    })
  },
  onLoad() {
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    })
    if (wx.onThemeChange) {
      wx.onThemeChange(({
        theme
      }) => {
        this.setData({
          theme
        })
      })
    }
    //加载新闻
    const apiHost = 'https://api.dzurl.top';
    this.loadNews('微博', 'weibo', true, apiHost + '/news/weibo', 'https://s.weibo.com/weibo?Refer=new_time&q=')
      .then(() => {
        return this.loadNews('百度', 'baidu', false, apiHost + '/news/baidu', 'https://wap.baidu.com/s?word=');
      })
      .then(() => {
        return this.loadNews('知乎', 'zhihu', false, apiHost + '/news/zhihu', 'https://www.zhihu.com/search?type=content&q=');
      })
      .then(() => {
        return this.loadNews('搜狗', 'sougou', false, apiHost + '/news/sogou', 'https://wap.sogou.com/web/searchList.jsp?keyword=');
      })


  },
  loadNews(itemName, itemId, open, url, page) {
    let me = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: url, //仅为示例，并非真实的接口地址
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success(res) {

          //项
          let item = {
            id: itemId,
            name: itemName,
            open: open,
            pages: []
          }

          //子项
          res.data.ret.forEach(element => {
            item.pages.push({
              title: element.title,
              url: page + encodeURI(element.title),
              hot: element.hot ? element.hot : ''
            })
          });

          let list = me.data.list;
          list.push(item)

          //更新数据源
          me.setData({
            list: list
          })
          resolve()
        },
        fail(res) {
          reject()
        }
      })

    });
  },
  kindToggle(e) {
    const id = e.currentTarget.id
    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list
    })
  }
})