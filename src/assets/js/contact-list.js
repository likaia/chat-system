
import lodash from 'lodash';

export default {
    name: "contact-list",
    data(){
        return{
            friendsList:[
                {
                    "groupName":"我",
                    "totalPeople":2,
                    "onlineUsers":2,
                    "friendsData": [
                        {
                            "username": "神奇的程序员",
                            "avatarSrc": "https://www.kaisir.cn/uploads/1ece3749801d4d45933ba8b31403c685touxiang.jpeg",
                            "signature":"今天的努力只为未来",
                            "onlineStatus":true,
                            "userId":"c04618bab36146e3a9d3b411e7f9eb8f"
                        },
                        {
                            "username": "admin",
                            "avatarSrc": "https://www.kaisir.cn/uploads/40ba319f75964c25a7370e3909d347c5admin.jpg",
                            "signature":"",
                            "onlineStatus":true,
                            "userId":"32ee06c8380e479b9cd4097e170a6193"
                        }
                    ]
                },
                {
                    "groupName": "我的朋友",
                    "totalPeople": 0,
                    "onlineUsers": 0,
                    "friendsData": [

                    ]
                },
                {
                    "groupName":"我的家人",
                    "totalPeople":0,
                    "onlineUsers":0,
                    "friendsData":[

                    ]
                },
                {
                    "groupName":"我的同事",
                    "totalPeople":0,
                    "onlineUsers":0,
                    "friendsData":[

                    ]
                }
            ]
        }
    },
    mounted:function(){

    },
    methods:{
        // 分组状态切换
        groupingStatus:function (index) {
            // 获取transform的值
            let transformVal = this.$refs.groupArrow[index].style.transform;
            if(lodash.isEmpty(transformVal)===false){
                // 截取rotate的值
                transformVal = transformVal.substring(7,9);
                // 判断是否展开
                if (parseInt(transformVal)===90){
                    this.$refs.groupArrow[index].style.transform = "rotate(0deg)";
                    this.$refs.buddyList[index].style.display = "none";
                }else{
                    this.$refs.groupArrow[index].style.transform = "rotate(90deg)";
                    this.$refs.buddyList[index].style.display = "block";
                }
            }else{
                // 第一次点击添加transform属性，旋转90度
                this.$refs.groupArrow[index].style.transform = "rotate(90deg)";
                this.$refs.buddyList[index].style.display = "block";
            }
        },
        // 获取列表好友信息
        getBuddyInfo:function (userId) {
            console.log(userId);
        }
    }
}