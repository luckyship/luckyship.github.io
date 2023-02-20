const fs = require("fs");
const AV = require("leancloud-storage");
// const { Query, User } = AV;

AV.init({
  appId: "3d3mgdb7guWJsXLE6mWY3Cyn-gzGzoHsz",
  appKey: "fstd3ABXC89jc5VDSe6ANGV6",
  serverURL: "https://leancloud.cn",
});

const query = new AV.Query("TestObject");
query.limit(1000);
query.find().then((TestObject) => {
  if (TestObject.length === 0) {
    insert();
    return;
  }

  let object = [];
  TestObject.forEach((item) => {
    const todo = AV.Object.createWithoutData("TestObject", item.id);

    object.push(todo);
  });

  // 批量删除
  AV.Object.destroyAll(object).then(
    function (deletedObjects) {
      // 成功删除所有对象时进入此 resolve 函数，deletedObjects 是包含所有的 AV.Object 的数组
      insert();
    },
    function (error) {
      // 只要有一个对象删除错误就会进入此 reject 函数
      console.log(error);
    }
  );
});

function insert() {
  fs.readFile("./public/content.json", "utf-8", (err, data) => {
    const postList = JSON.parse(data);

    let objects = [];

    postList.forEach((item) => {
      const TestObject = AV.Object.extend("TestObject");
      const testObject = new TestObject();

      testObject.set(item);
      objects.push(testObject);
    });

    //批量构建和更新
    AV.Object.saveAll(objects).then(
      function (savedObjects) {
        // 成功保存所有对象时进入此 resolve 函数，savedObjects 是包含所有 AV.Object 的数组
      },
      function (error) {
        // 只要有一个对象保存错误就会进入此 reject 函数
      }
    );
  });
}
