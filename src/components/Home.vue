<template>
    <div>
        <!-- 播放清單 -->
        <div class="playlists">
            <div class="playlist" v-for="video in pagePlaylist" :key="video.id" >
                <div class="thumbnail_and_howlong_area">
                    <a @click="gotoPlay(video.id)">
                        <img :src="video.img" class="thumbnail" alt="無法顯示">
                        <span class="howlong">{{ video.formatDuration }}</span>
                    </a>
                </div>
                
                <router-link to="/play" :title="video.title" class="title">
                    {{ video.cut_title }}
                </router-link>

                <p class="description">{{ video.description }}</p>
            </div>
        </div>

        <div class="pagination">
            <a 
                class="page_btn firstPage" 
                @click="gotoPage(1)">
                First
            </a>
            <a class="page_btn previous_page">&lt;&lt;</a>
            <a
                class="page_btn gotopage"
                v-for="num in temp_total_page" 
                :key="num"
                @click="gotoPage(num)">
                {{ num }}
            </a>
            <a 
                class="page_btn nextPage" 
                :class="{disabled: this.temp_total_page == 9}" @click="gotoNextpage(nextPageToken)">
                >>
            </a>
            <a 
                class="page_btn lastPage" 
                @click="gotoPage(temp_total_page)">
                Last
            </a>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';

export default {
    data() {
        return {
            videos:[],  // 所有影片
            pagePlaylist: [],  // 當下頁數撥放清單
            playStartIndex: 0,
            
            currentPage: 1,
            nextPageToken: "",
            perPage_num: 12,
            total_page: 0,

            temp_total_page: 1, 
            // 按了下一頁才會產生新的總頁數 第 12/1 頁, 24/2,36/3..
        }
    },
    computed: {
    },

    methods: {
        gotoPlay(id){
            this.$router.push(`/play/${id}`)
        },
        gotoPage(page){
            this.currentPage = page;
            console.log("currentPage: " + this.currentPage)
            
            // 取得當下第幾頁  (12*0,12*1)
            this.pagePlaylist = this.videos.slice(this.perPage_num*(this.currentPage-1), this.perPage_num*this.currentPage)
        },

        gotoNextpage(nextPageToken){
            if(this.temp_total_page == 9){
                let nextPageBtn = document.querySelector(".nextPage");
                return
            }

            this.currentPage ++;
            console.log(this.currentPage)

            this.playStartIndex +=12;

            let nextPageApi=`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&part=snippet&chart=mostPopular&maxResults=12&pageToken=${nextPageToken}&regionCode=TW&key=AIzaSyAEHw6lAxMOQ4YcogbbAkeWza_hxARrk4k`

            this.$http.get(nextPageApi).then((res)=>{
                // console.log(res)

                // 按了下一頁才會產生新的總頁數 第 12/1 頁, 24/2,36/3..
                this.temp_total_page = this.currentPage
                console.log(this.temp_total_page)

                let playlist = res.data.items;

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
                        cut_title: title.substr(1,10)+"...",
                        description: description.substr(1,20)+"...",
                        formatDuration
                    }

                    this.videos.push(video)
                    
                    // 如: 第二頁: slice(12,23)
                    this.pagePlaylist = this.videos.slice(this.playStartIndex,this.playStartIndex+12)

                    this.nextPageToken = res.data.nextPageToken;
                });
                // console.log(this.playStartIndex)
                console.log(this.pagePlaylist)
            })
        },

        getVideos(){
            const api = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&part=snippet&chart=mostPopular&maxResults=12&regionCode=TW&key=AIzaSyAEHw6lAxMOQ4YcogbbAkeWza_hxARrk4k'

            this.$http.get(api).then((res)=>{
                console.log(res);

                let playlist = res.data.items;
                let pageInfo = res.data.pageInfo;

                this.nextPageToken = res.data.nextPageToken;
                this.total_page = Math.ceil(pageInfo.totalResults / pageInfo.resultsPerPage)

                // console.log("total_page: "+this.total_page)

                this.currentPage = 1

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
                        cut_title: title.substr(1,10)+"...",
                        description: description.substr(1,20)+"...",
                        formatDuration
                    }

                    this.videos.push(video)
                    this.pagePlaylist = this.videos.slice(this.playStartIndex, this.playStartIndex+12)
                });

                $(".pagination").css("display","flex")

                // console.log(this.playStartIndex)
                // console.log(this.pagePlaylist)           
            })

        },

        // 把要的屬性整理成一個影片一個物件
        // 每種屬性都一個陣列
        setResponseCountry(country){
            country.forEach((el,i,arr) => {
                let id = el.id;
                let img = el.snippet.thumbnails.high.url;
                let title = el.snippet.title;
                let description = el.snippet.description;
                let duration = el.contentDetails.duration;

                // 轉時間格式
                let formatDuration = this.durationHandler(duration);

                this.videos.push({
                    id,
                    img,
                    title,
                    cut_title: title.substr(1,20)+"...",
                    description: description.substr(1,30)+"...",
                    formatDuration
                })
            });

        },

        // 轉時間的格式
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
        }
    },
    created() {
        console.log("created")

        this.getVideos();
    },
    mounted() {
        if(this.temp_total_page == 2){
            let nextPageBtn = document.querySelector(".nextPage");
            nextPageBtn.classList.add("disabled");
            return
        }
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

    // *{
    //     border: 1px solid red;
    // }

    .pagination {
        // display: none;
        display: none;
        justify-content: center;
        
        .page_btn{
            display: block;
            cursor: pointer;
            padding: 3px 7px;
            margin: 0 3px;
            // border: 1px solid black;
            background-color:  rgb(101, 115, 138);
            transition: 0.2s;
            color: white;
            &:hover{
                background-color: rgb(138, 151, 173);
            }
        }

        .disabled{
            background-color:  rgb(212, 212, 212);
            &:hover{
                background-color:  rgb(212, 212, 212);
            }
        }
        
    }
    
    .playlists{
        display: flex;
        flex-wrap: wrap;
        // flex-grow: 1 1 1;
        justify-content: space-evenly;
        
        width: 80vw;
        margin: 0 auto;
        // position: relative;

        @include pad() {
            width: 90vw;
        }

        .playlist{
            width:22%;
            position: relative;
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
            
            .thumbnail_and_howlong_area{
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
            
            .description {
                text-align: left;
            }
        }
    }
    
</style>