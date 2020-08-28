<template>
  <div class="home">
    <at-modal v-model="modal" :title="dlName" :maskClosable="false" :closeOnPressEsc="false" :showClose="canDl">
      <div>
        <div class="dl-info">
          <p>正在获取分卷信息……共 {{ divisionNum }} 卷</p>
          <p>正在获取章节信息……共 {{ chapterNum }} 章</p>
          <p>正在获取章节内容……{{ dlProgressText }}</p>
        </div>
      </div>
      <div slot="footer">
        <at-button type="primary" :disabled="!canDl" @click="dlBook">{{ dlButton }}</at-button>
      </div>
    </at-modal>
    <div class="nav-wrapper">
      <div class="title" @click="goGit">
        HBooker Extractor
      </div>
      <!-- <div class="avatar-wrapper" @click="goLogin">
        <img :src="avatarImage" />
      </div> -->
      <div class="need-login" v-if="!readInfo['reader_name']">
        未登录
      </div>
      <div class="shelves" v-else>
        xxx
      </div>
    </div>
    <div class="table-wrapper">
      <at-table :columns="columns" :data="booksData" stripe></at-table>
    </div>
    <!-- <div class="books-wrapper" ref="wrapper" v-if="books.length !== 0">
      <div class="book-wrapper" v-for="(book, index) in books" :key="index">
        <div class="book" @click="clickBook(book)" v-if="book.book_info != 0">
          <img :src="book.book_info.cover" alt="" />
          <div class="book-info">
            <div class="book-name">
              {{ book.book_info.book_name }}
            </div>
            <div class="book-author">作者：{{ book.book_info.author_name }}</div>
            <div class="chapter-nums">章节数：{{ book.book_info.last_chapter_info.chapter_index }} 章</div>
            <div class="last-time">上次更新时间：{{ book.book_info.last_chapter_info.uptime }}</div>
          </div>
        </div>
      </div>
    </div> -->
    <!-- <div class="no-books" v-else>
      空空如也呢……
    </div> -->
  </div>
</template>

<script>
// @ is an alias to /src
import GBWorker from 'worker-loader!../work/gb.work'

export default {
  name: 'home',
  components: {},
  created() {
    //获取本地用户信息
    var accountInfo = localStorage.getItem('accountInfo')
    if (accountInfo == null) {
      this.$router.push('/login')
      return
    }
    var accountJson = JSON.parse(accountInfo)
    var readInfo = accountJson.reader_info
    console.log(readInfo)
    this.readInfo = readInfo
    var avatarImage = readInfo.avatar_url
    this.loginToken = accountJson.login_token
    this.account = readInfo.account
    this.avatarImage = avatarImage
    //获取书架
    this.$get({
      url: '/bookshelf/get_shelf_list',
      para: {
        login_token: this.loginToken,
        account: this.account
      }
    }).then(res => {
      let shelfId = res.shelf_list[0].shelf_id
      this.$get({
        url: '/bookshelf/get_shelf_book_list_new',
        para: {
          login_token: this.loginToken,
          account: this.account,
          count: 999,
          shelf_id: shelfId,
          page: 0,
          order: 'last_read_time'
        }
      }).then(res => {
        let books = res.book_list
        this.books = books
        let arr = []
        books.forEach(book => {
          let obj = {
            name: book.book_info.book_name,
            author: book.book_info.author_name,
            date: book.book_info.last_chapter_info.uptime
          }
          arr.push(obj)
        })
        this.booksData = arr
      })
    })
  },
  data() {
    return {
      loginToken: '',
      account: '',
      modal: false,
      avatarImage: '',
      shelfs: [],
      books: [],
      dlName: '',
      dlprogress: '',
      divisionNum: 0,
      chapterNum: 0,
      dlProgressText: '',
      dlButton: '',
      canDl: false,
      dlUrl: '',
      columns: [
        {
          title: '书名',
          key: 'name'
        },
        {
          title: '作者',
          key: 'author'
        },
        {
          title: '更新日期',
          key: 'date'
        },
        {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h(
                'div',
                {
                  class: 'option-download',
                  // style: {
                  //   marginRight: '8px'
                  // },
                  on: {
                    click: () => this.clickBook(this.books[params['index']])
                  }
                },
                '下载'
              )
            ])
          }
        }
      ],
      booksData: [],
      readInfo: {}
    }
  },
  methods: {
    goLogin() {
      this.$router.push('/login')
    },
    goGit() {
      window.open('https://github.com/zsakvo/hbooker-extractor')
    },
    async clickBook(book) {
      let that = this
      that.canDl = false
      that.dlButton = '请稍后'
      this.chapterNum = 0
      this.dlName = book.book_info.book_name
      that.chapterNum = 0
      that.dlProgressText = ''
      this.modal = true
      //获取书籍 ID
      let bid = book.book_info.book_id
      //获取分卷 ID （全部）
      let divisionData = await this.getDivision(bid)
      this.divisionNum = divisionData.length
      //循环分卷，取出全部章节
      let allCahpters = []
      for (var division of divisionData) {
        let divisionID = division.division_id
        let chapters = await this.getChapter(divisionID)
        allCahpters.push(...chapters)
      }
      that.chapterNum = allCahpters.length
      var worker = new GBWorker()
      worker.postMessage({
        cmd: 'begin',
        loginToken: this.loginToken,
        account: this.account,
        para: allCahpters
      })
      worker.onmessage = function(evt) {
        let msg = evt.data.msg
        let content = evt.data.content
        switch (msg) {
          case 'chapter_complete':
            that.dlProgressText = `${content}/${that.chapterNum}`
            break
          case 'all_complete':
            var blob = new Blob([content])
            that.dlUrl = URL.createObjectURL(blob)
            that.canDl = true
            that.dlButton = '下载到本地'
            that.dlBook()
            worker.terminate()
            break
        }
      }
    },
    async getDivision(bid) {
      return await this.$get({
        url: '/book/get_division_list',
        para: {
          login_token: this.loginToken,
          account: this.account,
          book_id: bid
        }
      }).then(res => {
        let divisionData = res.division_list
        return divisionData
      })
    },
    async getChapter(did) {
      var params = new URLSearchParams()
      params.append('last_update_time', 0)
      params.append('login_token', this.loginToken)
      params.append('account', this.account)
      params.append('division_id', did)
      params.append('app_version', '2.3.020')
      params.append('device_token', 'ciweimao_powered_by_zsakvo_with_vue')
      return await this.$post({
        url: '/chapter/get_updated_chapter_by_division_id',
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        para: params
      }).then(res => {
        let chaptersData = res.chapter_list
        return chaptersData
      })
    },
    dlBook() {
      var eleLink = document.createElement('a')
      eleLink.download = this.dlName + '.txt'
      eleLink.style.display = 'none'
      eleLink.href = this.dlUrl
      document.body.appendChild(eleLink)
      eleLink.click()
      document.body.removeChild(eleLink)
    }
  }
}
</script>

<style lang="stylus" scoped>
.home{
  display flex
  flex-direction column
  .dl-info{
    white-space: pre-wrap;
  }
  .nav-wrapper{
    display flex
    height 64px
    justify-content space-between
    align-items center
    font-size 16px
    font-weight 600
    padding 0 36px
    position: fixed;
    background: #fff;
    width: 100%;
    .title{
      cursor pointer
    }
    .avatar-wrapper{
      width 50px
      height 50px
      img{
        width 100%
        height 100%
        border-radius:50%
      }
    }
  }
  .books-wrapper{
    user-select none
    padding 100px 48px 48px 48px
    display: flex;
    flex-wrap wrap
    width 100%
    .book-wrapper{
      height 120px
      width 100%
      margin-bottom 32px
      display flex
      align-items center
      .book{
        display flex
        height fit-content
        width fit-content
        align-items center
        img{
          width 90px
          height 120px
        }
        .book-info{
          height 120px
          margin-left 16px
          display flex
          flex-direction column
          justify-content space-between
          .book-name{
            font-size 15px
            font-weight 500
            line-height 2.0
          }
          .book-author{

          }
          .chapter-nums{

          }
        }
      }
    }
    // .book-wrapper:nth-child(n){
    //   justify-content flex-end
    //   padding-right 96px
    // }
    // .book-wrapper:nth-child(2n){
    //   justify-content flex-start
    //   padding-left 96px
    // }
  }

  .no-books{
    padding-top 120px
    margin-left 48px
    font-size 14px
  }

  .table-wrapper{
    padding: 64px 32px 0 32px;
    >>>.option-download{
      cursor pointer
    }
  }
}
</style>
