<template>
  <div id="app">
    <div id="nav">
      <div class="home_area">
        <router-link to="/" class="home">Home</router-link>
        <router-link to="/play_specify" class="menu">播放頁  </router-link> 
        <router-link to="/storage" class="menu">收藏頁</router-link>
      </div>
      <div class="menu">
        <input type="text">
        <button>登入</button>
      </div>
      
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

  body{
    margin: 0;
  }

    #app{
    font-family: "微軟正黑體" , "Arial black",sans-serif;
    background-color: rgb(245, 245, 245);
  }


  #nav{
    display: flex;
    justify-content: space-between;
    align-items:flex-end;
    background-color: rgb(255, 255, 255);
    padding: 5px 20px;
    margin-bottom: 50px;
  }

  .menu {
    position: relative;
    top: -15px;
  }

  .home_area {
    display: flex;
    justify-content: space-between;
    align-items:flex-end;
    a{
      text-decoration: none;
      display: block;
      margin: 0 10px;
      // background-color: #fff;
    }
    .home{
      font-family: 'Pacifico', cursive;
      color: white;
      // background-color: rgb(255, 187, 0);
      color:  rgb(255, 187, 0);
      font-weight: bold;
      // padding: 0px 12px;
      font-size: 36px;
      font-style: italic;
    }
  }
  
  
</style>
