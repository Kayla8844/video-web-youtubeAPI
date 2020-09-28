# 用 youtube API 做影音網站

1. 到 google apis console 申請⼀個api⾦鑰<br>
https://console.developers.google.com/apis/dashboard

1. 串接 youtube videos api<br>
https://developers.google.com/youtube/v3/docs/videos/list


## 分頁
每按下一頁就取得新的一批 12 筆資料

每一輪：
```
第1頁 0~11
            +=12
  2  12~23
            +=12
  3  24~35
  ... 
  9  96~100
```

<br>
<br>

1. 設定從哪筆開始擷取
2. 對總數擷取 12 筆資料

```javascript

// 前往某頁()，從第幾筆開始擷取 0*12 1*12 2*12 ...
this.nowPlayStartIndex = (this.pages.currentPage-1)*this.pages.perPage_num;

// 下一頁() 和上一頁()
this.nowPlayStartIndex += 12
this.nowPlayStartIndex -= 12

// pagePlaylist: 每頁播放的 12 筆清單
// 往後擷取 12 筆資料
this.pagePlaylist = this.videos.slice(this.nowPlayStartIndex, this.nowPlayStartIndex+12)
```

<br>
<br>

如果已經有下一頁，就不用向後端取得新的一批 12 筆資料

```javascript
// 目前資料數 > 當前頁 * 一頁 12 筆
if(this.videos.length > this.pages.currentPage*this.pages.perPage_num){
    ...
} else {
    let nextPageApi=`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&part=snippet&chart=mostPopular&maxResults=${maxResults}&pageToken=${nextPageToken}&regionCode=TW&key=AIzaSyAEHw6lAxMOQ4YcogbbAkeWza_hxARrk4k`

    this.$http.get(nextPageApi).then((res)=>{...}
}
```
            

## 提問
* nextPageToken<br>
https://drive.google.com/file/d/13b3zgL88kexDKNG3XmU5NvKfi6Mr1Fok/view?usp=sharing

