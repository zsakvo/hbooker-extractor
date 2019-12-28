<template>
  <div class="home">
    <div class="nav-wrapper">
      <div class="title">
        HBooker Extractor
      </div>
      <div class="avatar-wrapper">
        <img :src="avatarImage" />
      </div>
    </div>
    <div class="books-wrapper">
      <div class="book-wrapper" v-for="(book, index) in books" :key="index">
        <div class="book">
          <img :src="book.book_info.cover" alt="" />
          <div class="book-info">
            <div class="book-name">
              {{ book.book_info.book_name }}
            </div>
            <div class="book-author">
              作者：{{ book.book_info.author_name }}
            </div>
            <div class="chapter-nums">
              章节数：{{ book.book_info.last_chapter_info.chapter_index }} 章
            </div>
            <div class="last-time">
              上次更新时间：{{ book.book_info.last_chapter_info.uptime }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "home",
  components: {},
  created() {
    //获取本地用户信息
    var accountInfo = localStorage.getItem("accountInfo");
    var accountJson = JSON.parse(accountInfo);
    var readInfo = accountJson.reader_info;
    var avatarImage = readInfo.avatar_url;
    var loginToken = accountJson.login_token;
    var account = readInfo.account;
    this.avatarImage = avatarImage;
    //获取书架
    this.$get({
      url: "/bookshelf/get_shelf_list",
      para: {
        login_token: loginToken,
        account: account
      }
    }).then(res => {
      let shelfId = res.shelf_list[0].shelf_id;
      this.$get({
        url: "/bookshelf/get_shelf_book_list_new",
        para: {
          login_token: loginToken,
          account: account,
          count: 100,
          shelf_id: shelfId,
          page: 0,
          order: "last_read_time"
        }
      }).then(res => {
        this.books = res.book_list;
      });
    });
  },
  data() {
    return {
      avatarImage: "",
      shelfs: [],
      books: []
    };
  }
};
</script>

<style lang="stylus" scoped>
.home{
  display flex
  flex-direction column
  .nav-wrapper{
    display flex
    justify-content space-between
    align-items center
    font-size 18px
    font-weight 600
    padding 24px 48px
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
    padding 0 96px
    display: grid;
    width 100%
    grid-template-columns: 50% 50%
    .book-wrapper{
      height 200px
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
    .book-wrapper:nth-child(n){
      justify-content flex-start
    }
    .book-wrapper:nth-child(2n){
      justify-content flex-end
    }
  }
}
</style>
