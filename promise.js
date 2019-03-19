const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

function MyPromise(fn) {
  const that = this; // 代码可能会异步执行，用于获取正确的 this 对象
  this.state = PENDING; // 一开始 Promise 的状态应该是 pending
  that.value = null; // value 变量用于保存 resolve 或者 reject 中传入的值
  // 用于保存then中的回调
  that.resolevdCallbacks = [];
  that.rejectedCallbacks = [];
  // resolve函数
  function resolve(value) {
    if (that.state == PENDING) {
      that.state = RESOLVED;
      that.value = value;
      that.resolevdCallbacks.map(cb => cb(that.value));
    }
  }
  // reject函数
  function reject(value) {
    if (that.state == PENDING) {
      that.state = RESOLVED;
      that.value = value;
      that.rejectedCallbacks.map(cb => cb(that.value));
    }
  }

  try {
    fn(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
  const that = this;
  // 首先判断两个参数是否为函数类型，因为这两个参数是可选参数
  onFulfilled = typeof onFulfilled == "function" ? onFulfilled : v => v;
  onRejected =
    typeof onRejected == "function"
      ? onFulfilled
      : r => {
          throw r;
        };
  if (that.state === PENDING) {
    that.resolevdCallbacks.push(onFulfilled);
    that.rejectedCallbacks.push(onRejected);
  }
  if (that.state === RESOLVED) {
    onFulfilled(that.value);
  }
  if (that.state === REJECTED) {
    onRejected(that.value);
  }
};

new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 0);
}).then(value => {
  console.log(value);
});
