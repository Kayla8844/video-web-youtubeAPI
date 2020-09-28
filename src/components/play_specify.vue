<template>
    <div class="video_specify">
        <video 
            controls="controls" 
            autoplay
            id="myVideo"
            @pause="pause()"
            :class="{opacity: opacity_control}"
        >
            <source src="https://player.vimeo.com/external/194837908.sd.mp4?s=c350076905b78c67f74d7ee39fdb4fef01d12420&profile_id=164">
        </video>

        <!-- <div class="overlay_area"> -->
        <div class="overlay_area" v-if="overlay_display">
            <div id="overlay"></div>
            <img id="ads" src="https://media.giphy.com/media/3ohs8789j3HGAg5vSo/giphy.gif" alt="無法顯示">
            <button class="close" @click="closeAds()">x</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            overlay_display: false,
            opacity_control: false,
        }
    },
    created(){
    },
    methods: {
        pause(){
            this.overlay_display = true;
            let video = document.getElementById("myVideo")
            video.webkitExitFullscreen()
        },
        closeAds(){
            let video = document.getElementById("myVideo")
            this.overlay_display = false;
            video.play();
        }
    },
}
</script>

<style lang="scss">
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

    // ================================

    .opacity{
        opacity: 0;
    }

    .video_specify {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        video{
            position: fixed;
            top: 55%;
            transform: translate(0,-55%);
            @include pad() {
                width: 100vw;

            }
        }

        .overlay_area {
            z-index: 100;
            // display: none;
            #overlay {
                background-color: rgb(0, 0, 0);
                opacity: 70%;
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                
            }
            #ads{
                // display: none;
                width: 20%;
                position: fixed;
                top: 55%;
                left: 50%;
                transform: translate(-50%,-55%);
                @include pad() {
                    width: 40%;
                }
            }
            .close {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 40px;
                height: 40px;
                font-size: 25px ;
                padding: 10px;
                position: fixed;
                top: 15px;
                right: 30px;
                cursor: pointer;
                color: white;
                border: 1px solid white;
                background-color: transparent;
                border-radius: 50% 50%;
                transition: all ease 0.2s;
                &:hover{
                    background-color: rgb(255, 255, 255, 0.5)
                }
            }

        
        }
        
    }
</style>