<!--分享弹框-->
<template lang="pug">
  div.share__bounced
    div.mask(@click="$emit('close')")
    div.content
      ul.list
        li.list__item(@click="$emit('friendShare')")
          i.icon.friend
          p 朋友圈分享
        li.list__item(@click="$emit('posterShare')")
          i.icon.posters
          p 海报分享
        li.list__item(@click="$emit('linkShare')")
          i.icon.link
          p 链接分享
</template>

<script>
  export default {
    name: 'SharePopup'
  }
</script>

<style scoped lang="less">
  .share__bounced {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 11;

    .mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .5);
    }

    .content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #fff;
      border-top-left-radius: .22rem;
      border-top-right-radius: .22rem;
    }

    .list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 .4rem;

      &__item {
        flex: 1;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        color: #333;
        height: 3.6rem;
        font-size: .26rem;
        font-weight: bold;

        &:active {
          transform: scale(1.02);
        }

        .icon {
          width: 1.2rem;
          height: 1.2rem;
          background-color: #f6f5f5;
          border-radius: 1rem;
          margin-bottom: .1rem;
          background-repeat: no-repeat;
          background-position: center;
          background-size: .7rem;
        }

        .friend {
          background-image: url("~@icon/community/circle-friends.png");
        }

        .posters {
          background-image: url("~@icon/community/share-posters.png");
        }

        .link {
          background-image: url("~@icon/community/share-link.png");
        }
      }
    }
  }
</style>
