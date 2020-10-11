<template>
    <div class="play_area">
        <div class="playwrapper">
            <iframe 
                :src="videoUrl" 
                frameborder="0" 
                allowfullscreen="allowfullscreen"
                class="videoplayer">
            </iframe>
        </div>
        <div 
            class="addToLike"
            @click="addToLike"
        >
            <span class="love_icon">♡</span>收藏
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            videoId: "",
            videoUrl: "",
        }
    },
    created(){
        this.videoId = this.$route.params.video_id;
        this.videoUrl = `https://www.youtube.com/embed/${this.videoId}`
        console.log(this.videoId);
    }
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

.play_area {
    max-width: 800px;
    margin: 50px auto 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    .playwrapper {
        position: relative;
        overflow: hidden;
        width: 100%;
        padding-top: 56.25%;
        .videoplayer {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
        }
    }

    .addToLike {
        padding: 10px;
        background-color:  rgb(46, 47, 63);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 6px 12px;
        margin-top: 10px;
        color: rgb(255, 255, 255);
        transition: 0.2s ease;
        cursor: pointer;
        font-weight: bold;
        // margin: 10px 0;
        .love_icon {
            font-size: 18px;
            margin-right: 5px;
        }
        &:hover{
            background-color:#ffc800;
        }
    }
}

</style>