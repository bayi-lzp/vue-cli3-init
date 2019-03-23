<template>
<div class="com">
    <h1 class="com-item">首页</h1>
</div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style lang="scss" scoped>
.com{
    font-size: px2rem(12);
    width: px2rem(1920);
    height: 20%;
    color: $red;
    background-color: #222222;
    @include flex();
    .com-item{
        padding: px2rem(12);
        color: red;
    }
}
</style>
