<template>
    <!-- <div id="comment">
        <div class="publish">
            <h3>发表评论 <edit-two theme="outline" size="18" /></h3>
            <div class="publish-main">
                <div class="left"><el-avatar :size="50" src="src/assets/avatar.jpg" /></div>
                <div class="right">
                    <div class="content">
                        <el-input v-model="textarea" :rows="3" type="textarea" placeholder="Please input" />
                    </div>
                    <div class="button-bar"><el-button type="primary">发 表</el-button></div>
                </div>
            </div>
        </div>
        <el-divider />
        <div class="list">
            <h3>评论列表({{total}})</h3>
            <div class="list-main" v-for="item in data">
                <div class="left"><el-avatar :size="50" :src="item.avatar" /></div>
                <div class="right">
                    <h4>{{ item.name }}</h4>
                    <p>{{ item.comment }}</p>
                    <div class="menu">
                        <div class="date">{{ item.date }}</div>
                        <div class="icon">
                            <span class="icon-item" @click="openReply(item)"><comment theme="outline" size="18" fill="#333" />{{ item.isShowInput ? "取消" : "回复" }}</span>
                            <span class="icon-item"><thumbs-up theme="outline" size="18" fill="#333" />{{ item.like }}</span>
                        </div>
                    </div>
                    <el-collapse-transition>
                        <div class="content" v-show="item.isShowInput">
                            <el-input v-model="item.inputVal" :rows="3" type="textarea" placeholder="Please input" />
                            <div class="button-bar"><el-button type="primary">发 表</el-button></div>
                        </div>
                    </el-collapse-transition>
                    <el-collapse-transition v-for="(child, index) in item.children" v-show="index < (item.showAll ? item.children.length : 2)">
                        <div class="list-main">
                            <div class="left left2"><el-avatar :size="40" :src="child.avatar" /></div>
                            <div class="right">
                                <h4>{{ child.name }}</h4>
                                <p>
                                    <span class="answer">回复{{ child.replyObject }}：</span>{{ child.comment }}
                                </p>
                                <div class="menu">
                                    <div class="date">{{ child.date }}</div>
                                    <div class="icon">
                                        <span class="icon-item" @click="openReply(child)"><comment theme="outline" size="18" fill="#333" />{{ child.isShowInput ? "取消" : "回复" }}</span>
                                        <span class="icon-item"><thumbs-up theme="outline" size="18" fill="#333" />{{ child.like }}</span>
                                    </div>
                                </div>
                                <el-collapse-transition>
                                    <div class="content" v-show="child.isShowInput">
                                        <el-input v-model="textarea" :rows="3" type="textarea" placeholder="Please input" />
                                        <div class="button-bar"><el-button type="primary">发 表</el-button></div>
                                    </div>
                                </el-collapse-transition>
                            </div>
                        </div>
                    </el-collapse-transition>
                    <div class="all-comment" v-show="!item.showAll && item.children.length > 2" @click="item.showAll = true">全部{{ item.children.length }}条回复 <down theme="outline" size="15" fill="#666" /></div>
                    <div class="all-comment" v-show="item.showAll" @click="item.showAll = false">收起 <up theme="outline" size="15" fill="#666" /></div>
                </div>
            </div>
        </div>
    </div> -->
</template>

<script setup lang="ts">
import { Comment, ThumbsUp, Down, Up, EditTwo } from "@icon-park/vue-next"
interface DataProps {
    isShowInput: boolean
    [propName: string]: any
}
const textarea = ref("")
defineProps({
    data: {
        type: String,
        default: {},
    },
    total: {
        type: Number,
        default: 0,
    },
})

const data = reactive([
    {
        id: 1,
        name: "candy",
        avatar: "src/assets/avatar.jpg",
        comment: "巴啦啦能量巴啦啦能量巴啦啦能量巴啦啦能量巴啦啦能量巴啦啦能量巴啦啦能量巴啦啦能量",
        date: "2020-06-18 18:00",
        replyCount: 3,
        like: 666,
        isShowInput: false,
        showAll: false,
        inputVal: "",
        children: [
            {
                name: "candy",
                replyObject: "xxxxx",
                avatar: "src/assets/avatar.jpg",
                comment: "巴啦啦能量巴啦啦能量巴啦啦能量啦啦能量巴啦啦能量巴啦啦能量巴啦啦能量",
                date: "2020-06-18 18:00",
                isShowInput: false,
                inputVal: "",
                like: 88,
            },
            {
                name: "xxx",
                replyObject: "candy",
                avatar: "src/assets/avatar.jpg",
                comment: "巴啦啦能量巴啦啦能量巴啦啦能量巴啦啦能量巴啦啦啦能量",
                date: "2020-06-18 18:00",
                isShowInput: false,
                inputVal: "",
                like: 18,
            },
            {
                name: "xxx",
                replyObject: "candy",
                avatar: "src/assets/avatar.jpg",
                comment: "巴啦啦能量巴啦啦能量巴啦啦能量巴啦啦能量巴啦啦啦能量",
                date: "2020-06-18 18:00",
                isShowInput: false,
                inputVal: "",
                like: 18,
            },
        ],
    },
    {
        id: 2,
        name: "candy",
        avatar: "src/assets/avatar.jpg",
        comment: "巴啦啦能量巴啦啦能量巴啦啦能量巴啦啦能量巴啦啦能量巴啦啦能量巴啦啦能量巴啦啦能量",
        date: "2020-06-18 18:00",
        replyCount: 3,
        like: 666,
        isShowInput: false,
        showAll: false,
        inputVal: "",
        children: [
            {
                name: "candy",
                replyObject: "xxxxx",
                avatar: "src/assets/avatar.jpg",
                comment: "巴啦啦能量巴啦啦能量巴啦啦能量啦啦能量巴啦啦能量巴啦啦能量巴啦啦能量",
                date: "2020-06-18 18:00",
                isShowInput: false,
                inputVal: "",
                like: 88,
            },
            {
                name: "xxx",
                replyObject: "candy",
                avatar: "src/assets/avatar.jpg",
                comment: "巴啦啦能量巴啦啦能量巴啦啦能量巴啦啦能量巴啦啦啦能量",
                date: "2020-06-18 18:00",
                isShowInput: false,
                inputVal: "",
                like: 18,
            },
            {
                name: "xxx",
                replyObject: "candy",
                avatar: "src/assets/avatar.jpg",
                comment: "巴啦啦能量巴啦啦能量巴啦啦能量巴啦啦能量巴啦啦啦能量",
                date: "2020-06-18 18:00",
                isShowInput: false,
                inputVal: "",
                like: 18,
            },
        ],
    },
])
const openReply = (item: DataProps) => {
    item.isShowInput = !item.isShowInput
}
</script>

<style lang="scss" scoped>
.publish-main {
    display: flex;
    padding-top: 20px;
    .left {
        width: 64px;
        padding-top: 10px;
    }
    .right {
        flex: 1;
    }
}
.button-bar {
    margin-top: 15px;
    text-align: right;
}
.list-main {
    display: flex;
    padding-top: 20px;
    .left {
        width: 64px;
    }
    .left2 {
        width: 54px;
    }
    .right {
        flex: 1;
        p {
            padding-top: 10px;
            font-size: 14px;
            @include textEllipsis(3);
            line-height: 22px;
            .answer {
                color: #aaa;
            }
        }
        .menu {
            display: flex;
            justify-content: space-between;
            padding-top: 10px;
            font-size: 13px;
            .date {
                color: #9195a3;
            }
            .icon {
                width: 140px;
                display: flex;
                .icon-item {
                    vertical-align: middle;
                    cursor: pointer;
                    span {
                        margin: 0 5px 0 15px;
                    }
                    &:hover {
                        color: #409eff;
                    }
                }
            }
        }
        .content {
            padding-top: 10px;
        }
    }
    .all-comment {
        margin-left: 54px;
        font-size: 13px;
        color: #666;
        margin-top: 10px;
        cursor: pointer;
    }
}
</style>
