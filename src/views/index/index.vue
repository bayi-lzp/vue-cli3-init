<template>
<div class="com">
    <!--<h1 class="com-item">首页</h1>-->
    <mt-header title="标题过长会隐藏后面的内容啊哈哈哈哈">
        <router-link to="/" slot="left">
            <mt-button icon="back">返回</mt-button>
        </router-link>
        <mt-button icon="more" slot="right"></mt-button>
    </mt-header>
    <mt-swipe :auto="4000" >
        <mt-swipe-item>1</mt-swipe-item>
        <mt-swipe-item>2</mt-swipe-item>
        <mt-swipe-item>3</mt-swipe-item>
    </mt-swipe>
</div>
</template>

<script>
    export default {
        name: "index",
        data(){
            return{

            }
        },
        created(){
            console.log(1111);
        }
    }
</script>

<style lang="scss" scoped>
.com{
    /*font-size: px2rem(12);*/
    height: 20%;
    // color: $red;
    // background-color: #222222;
    //@include flex();
    .com-item{
        padding: px2rem(12);
        color: red;
    }
}
</style>
