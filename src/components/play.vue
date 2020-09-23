<template>
    <div class="play">
        <iframe 
            :src="videoUrl" 
            width="840" 
            height="473" 
            frameborder="0" 
            allowfullscreen="allowfullscreen">
        </iframe>
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

<style lang="scss">
.play {
    display: flex;
    justify-content: center;
    align-items: center;
}
    
</style>