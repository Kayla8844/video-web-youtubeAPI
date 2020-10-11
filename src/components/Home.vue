<template>
    <div>
        <!-- 播放清單 -->
        <div class="playlists">
            <div class="playlist" v-for="(video) in pagePlaylist" :key="video.id" >
                <div class="thumbnail_area">
                    <a @click="gotoPlay(video.id)" >
                        <div class="thumbnail_overlay">
                            ▷
                        </div>
                        <img :src="video.img" class="thumbnail" alt="無法顯示">
                        <span class="howlong">{{ video.formatDuration }}</span>
                    </a>
                </div>
                
                <router-link to="/play" :title="video.title" class="video_title">
                    {{ video.title }}
                </router-link>

                <!-- <p class="description">{{ video.description }}</p> -->
            </div>
        </div>

        <div class="pagination" v-if="pages.page_display">
            <div class="page_area">
                <a 
                    class="page_btn firstPage" 
                    :class="{'disabled': this.pages.currentPage == 1}" 
                    @click="gotoPage(1)">
                    First
                </a>
                <a 
                    class="page_btn previous_page"
                    v-if="this.pages.currentPage > 1"
                    @click="previouspage()">
                    &lt;&lt;
                </a>
                <a
                    class="page_btn gotopage"
                    v-for="page in pages.totalPage" 
                    :class="{'active': page == pages.currentPage}"
                    :key="page"
                    @click="gotoPage(page)">
                    {{ page }}
                </a>
                <a 
                    class="page_btn nextPage" 
                    v-if="this.pages.currentPage < this.finalTotalPage"
                    @click="gotoNextpage(pages.nextPageToken)">
                    >>
                </a>
                <a 
                    class="page_btn lastPage" 
                    :class="{'disabled': this.pages.currentPage == this.finalTotalPage}" 
                    @click="gotoPage(pages.totalPage)">
                    Last
                </a>
            </div>
            
            <div class="page_explain">
                <p>按下一頁會產生新的一頁<br>
                    參數 nextPageToken<br>
                    每次拿12筆，共 100 筆
                </p>
            </div>
        </div>
    </div>
</template>

<script>
// import $ from 'jquery';

export default {
    data() {
        return {
            videos:[],  // 所有影片
            pagePlaylist: [],  // 當下頁數撥放清單
            nowPlayStartIndex: 0,
            totalResults: 100,
            
            pages:{
                currentPage: 1,
                nextPageToken: "",
                perPage_num: 12,

                totalPage: 1, 
                // 按了下一頁才會產生新的總頁數 第 12/1 頁, 24/2,36/3..

                page_display: false,
            }
        }
    },

    created() {
        console.log("created")
        this.getFirstVideos();
    },

    computed: {
        // 總頁數 = 100筆資料 / 一頁 12筆 = 9
        finalTotalPage(){
            return Math.ceil(this.totalResults / this.pages.perPage_num)
        }
        
    },

    methods: {
        gotoPlay(id){
            this.$router.push(`/play/${id}`)
        },

        slicePagelist(){
            // 每頁取 12 筆
            this.pagePlaylist = this.videos.slice(this.nowPlayStartIndex, this.nowPlayStartIndex+12)
        },

        getPlaylist(playlist){
            // 取回來的資料存到 playlist 傳入
            // 制定格式
            // 裝進總數陣列裡
            
            playlist.forEach((el,i,arr) => {
                let id = el.id;
                let img = el.snippet.thumbnails.high.url;
                let title = el.snippet.title;
                let description = el.snippet.description;
                let duration = el.contentDetails.duration;

                // 轉時間格式
                let formatDuration = this.durationHandler(duration);

                let video = {
                    id,
                    img,
                    title,
                    cut_title: title.substr(0,10)+"...",
                    description: description.substr(0,20)+"...",
                    formatDuration
                }

                this.videos.push(video)

                this.slicePagelist();
            });
        },

        // 取得第一次 12筆資料，
        // 第二次之後，因為要傳入 nextPageToken，
        // 所以在 gotoNextpage() 串接不同 API
        getFirstVideos(){
            const api = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&part=snippet&chart=mostPopular&maxResults=12&regionCode=TW&key=AIzaSyAEHw6lAxMOQ4YcogbbAkeWza_hxARrk4k'

            this.$http.get(api).then((res)=>{
                console.log(res);

                if(res.status == 200){
                    let playlist = res.data.items;
                    let pageInfo = res.data.pageInfo;

                    // 存下一頁提供 nextPage() 使用
                    this.pages.nextPageToken = res.data.nextPageToken;  
                    this.pages.currentPage = 1;
                    this.getPlaylist(playlist);  // 取得波放清單
                    this.pages.page_display = true;
                    // $(".pagination").css("display","flex");  // 取完資料再顯示
                }
            })
        },

        gotoPage(page){
            this.pages.currentPage = page;
            console.log("pages.currentPage: " + this.pages.currentPage)
            console.log("totalPage: "+this.pages.totalPage)

            this.nowPlayStartIndex = (this.pages.currentPage-1)*this.pages.perPage_num;
            console.log(this.nowPlayStartIndex)

            // 取得當下第幾頁  (12*0,12*1)
            this.slicePagelist();
        },

        gotoNextpage(nextPageToken){
            // finalTotalPage=
            // 總頁數 = 100筆資料 / 一頁 12筆 = 9

            if(this.pages.currentPage == this.finalTotalPage){
                return
            }

            // 如果已經有下一頁，就不用向後端取得新的一批 12 筆資料
            // 目前資料數 > 當前頁 * 一頁 12 筆
            if(this.videos.length > this.pages.currentPage*this.pages.perPage_num){
                this.pages.currentPage ++;
                this.nowPlayStartIndex +=12;
                this.pages.totalPage = Math.ceil(this.videos.length / this.pages.perPage_num)

                this.slicePagelist();         

            } else {
                // 如果超過100筆資料，就最多取  100 - 當下資料數 筆資料
                let maxResults = 12;
                if(this.videos.length + maxResults > 100){
                    maxResults = 100 - this.videos.length
                }

                let nextPageApi=`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&part=snippet&chart=mostPopular&maxResults=${maxResults}&pageToken=${nextPageToken}&regionCode=TW&key=AIzaSyAEHw6lAxMOQ4YcogbbAkeWza_hxARrk4k`

                this.$http.get(nextPageApi).then((res)=>{
                    // console.log(res)
                    if(res.status == 200){

                        this.pages.currentPage ++;
                        this.nowPlayStartIndex +=12;  // 往後 12 筆開始裝下一頁資料

                        let playlist = res.data.items;
                        this.getPlaylist(playlist);

                        // 下一頁資料的頁數 id
                        this.pages.nextPageToken = res.data.nextPageToken;

                        this.pages.totalPage = Math.ceil(this.videos.length / this.pages.perPage_num)
                    } 
                })
            }
        },

        previouspage(){
            this.pages.currentPage --;
            this.nowPlayStartIndex -=12;
            this.slicePagelist();
        },

        // 轉時間的格式 "PT1H45M15S" => "1:45:15"
        durationHandler(duration){
            let hours = 0;
            let minutes = 0;
            let seconds = 0;

            duration = duration.replace('PT','')

            if(duration.indexOf("H")>-1){
                let hours_split = duration.split('H');
                hours = hours_split[0]
                duration = hours_split[1];
            } else{
                hours = 0
            }

            if(duration.indexOf("M")>-1){
                let minutes_split = duration.split('M');
                minutes = minutes_split[0]
                duration = minutes_split[1]
            }

            if(duration.indexOf("S")>-1){
                let seconds_split = duration.split('S');
                seconds = seconds_split[0]
            }

            duration = `${hours}:${minutes}:${seconds}`
            return duration
        },
    },
}
</script>

<style lang="scss" scoped>
    @mixin pc() {
        @media (min-width: 1200px) {
            @content;
        }
    }

    @mixin pc-s() {
        @media (max-width: 1199.98px) {
            @content;
        }
    }

    @mixin pad() {
        @media (max-width: 992px) {
            @content;
        }
    }

    @mixin pad-s() {
        @media (max-width: 768px) {
            @content;
        }
    }

    @mixin mobile() {
        @media (max-width: 575.98px) {
            @content;
        }
    }

    @mixin mobile-s() {
        @media (max-width: 376px) {
            @content;
        }
    }

    // =================================

    .pagination{
        .page_area {
            display: flex;
            justify-content: center;
            margin: 40px 0 10px 0;
            
            .page_btn{
                display: block;
                cursor: pointer;
                padding: 3px 7px;
                margin: 0 3px;
                background-color: rgb(61, 63, 95);
                transition: 0.2s;
                color: white;
                &:hover{
                    background-color:  rgb(0, 189, 226);
                }
            }

            .active {
                background-color:  rgb(0, 189, 226);
            }

            .disabled{
                background-color:  rgb(0, 189, 226);
                cursor: auto;
                &:hover{
                    background-color:   rgb(0, 189, 226);
                }
            }
            
        }

        .page_explain {
            text-align: center;
            margin: 20px 0;
            p{
                margin: 0;
            }
        }
    }
    
    
    .playlists{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        width: 80vw;
        margin: 50px auto 0 auto;

        @include pad() {
            width: 90vw;
        }

        .playlist{
            width:22%;
            position: relative;
            cursor: pointer;
            margin: 10px 0 20px  0;
            @include pad() {
                width: 30%;
            }
            @include pad-s() {
                width: 45%;
            }
            @include mobile-s() {
                width: 100%;
            }

            a{
                display: block;
                position: relative;
            }
            
            .thumbnail_area{
                position: relative;

                .display{
                    display: block;
                    transition: all 2s;
                }

                .thumbnail_overlay{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 36px;
                    color: rgb(0, 189, 226);
                    opacity: 0;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    transition: 0.2s ease;
                    // position: relative;
                    &:hover{
                        opacity: 1;
                    }

                    
                }

                .thumbnail {
                    display: block;
                    width: 100%;
                    background-size: cover;
                    background-repeat: no-repeat;
                    margin: 0 auto;
                }

                .howlong {
                    color:white;
                    // background-color: black;
                    font-size: 12px;
                    position: absolute;
                    bottom: 5px;
                    right: 7px;
                }
            }
            
            .video_title{
                margin-top: 15px;
                color: rgb(235, 235, 235);
            }
        }
    }
    
</style>