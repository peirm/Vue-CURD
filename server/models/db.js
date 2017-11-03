/**
 * Created by MM on 2017/11/2.
 */
// 连接数据库
var mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/vue-curd',{
    useMongoClient: true,
});

mongoose.connection.on("connected", function () {
    console.log("数据库连接成功")
});

mongoose.connection.on("error", function () {
    console.log("数据库连接失败")
});

mongoose.connection.on("disconnected", function () {
    console.log("未开启数据库")
});
