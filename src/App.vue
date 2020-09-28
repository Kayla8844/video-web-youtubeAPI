<template>
  <div id="app">
    <div id="nav">
      <div class="home_area">
        <router-link to="/" class="home">
          <span class="home_txt">Home</span>
          <font-awesome-icon icon="film" id="film_logo"/>
        </router-link>
        <!-- <router-link to="/play_specify" class="menu">播放頁</router-link>  -->
        
      </div>
      <div class="search_area">
        <input type="text" class="search_bar">
        <font-awesome-icon icon="search" id="search_icon"/>
        <router-link to="/storage" class="like">收藏</router-link>
      </div>
      
    </div>

    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>

    <router-view v-if="!$route.meta.keepAlive"/>
  </div>
</template>

<script>
import Home from './components/Home'
export default {
  components:{Home}
}
</script>


<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

  html, body{
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    color: white;
    background-color: rgb(27, 27, 27);
    font-size: 14px;
  }


  * {
    box-sizing: border-box;
  }
  
    #app{
    font-family: "微軟正黑體" , "Arial black",sans-serif;
    height: 100%;
    
  }

  a{
    text-decoration: none;
    display: block;
    color: white;
  }


  #nav{
    display: flex;
    justify-content: space-between;
    align-items:center;
    background-color: rgb(46, 47, 63);
    padding: 5px 20px;
    // margin-bottom: 50px;
  }

  .home_area {
    display: flex;
    justify-content: space-between;
    align-items:center;

    a{
      margin: 0 15px 0 0;
    }

    .home{
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Pacifico', cursive;
      color:  rgb(255, 255, 255);
      font-size: 28px;
      margin: 0 15px 0 0;
      #film_logo {
        display: block;
        color: rgb(0, 230, 238);
        font-size: 16px;
        margin-left: 5px;
        position: relative;
        top:-10px;
        left: -5px;
      }
      .home_txt{
        display: block;
        font-style: italic;
      }
    }
  }

  .search_area {
    display: flex;
    
    .search_bar {
      width: 20vw;
      height: 28px;
      background-color: transparent;
      border: 1px solid   rgb(0, 230, 238);
      padding: 10px 7px;
    }
    #search_icon{
      width: 30px;
      height: 28px;
      padding: 7px;
      display: block;
      background-color: rgb(58, 248, 255);
    }
    .like{
      height: 28px;
      margin-left: 20px;
      background-color: rgb(250, 200, 0);
      padding: 5px 10px;
      font-weight: bold;
    }
  }

</style>
