import { h, init } from "snabbdom";
import style from "snabbdom/modules/style";
import eventlisteners from "snabbdom/modules/eventlisteners";
import originalData from "./originData";
//获取数据
let patch = init([style, eventlisteners]);
let data = [...originalData];

let vnode;
//新建新条目时起始
let newKey = 11;
//样式
let margin = 8;
let sortBy = "rank";
let totalHeight = 0;

//每条数据的信息
function movieView(movie) {
  return h(
    "div.row",
    {
      key: movie.rank,
      style: {
        opacity: "0",
        transform: "translate(-200px)",
        delayed: { transform: `translateY(${movie.offset}px)`, opacity: "1" },
        remove: {
          opacity: "0",
          transform: `translateY(${movie.offset}px) translateX(200px)`,
        },
      },
      hook: {
        insert: (vnode) => {
          movie.elmHeight = vnode.elm.offsetHeight;
        },
      },
    },
    [
      h("div", { style: { fontWeight: "bold" } }, movie.rank),
      h("div", movie.title),
      h("div", movie.desc),
      h("div.btn.rm-btn", { on: { click: [removeMoive, movie] } }, "x"),
    ]
  );
}
//总体的信息
function view(data) {
  return h("div", [
    h("h1", "Top 10 movies"),
    h("div", [
      h("a.btn.add", { on: { click: addMovie } }, "Add"),
      "Sort by: ",
      h("span.btn-group", [
        h(
          "a.btn.rank",
          {
            class: { active: sortBy === "rank" },
            on: { click: [changeSort, "rank"] },
          },
          "Rank"
        ),
        h(
          "a.btn.title",
          {
            class: { active: sortBy === "title" },
            on: { click: [changeSort, "title"] },
          },
          "Title"
        ),
        h(
          "a.btn.desc",
          {
            class: { active: sortBy === "desc" },
            on: { click: [changeSort, "desc"] },
          },
          "Description"
        ),
      ]),
    ]),
    h(
      "div.list",
      { style: { height: totalHeight + "px" } },
      data.map(movieView)
    ),
  ]);
}
//渲染函数
function render() {
  data = data.reduce((acc, m) => {
    let last = acc[acc.length - 1];
    //设置每一个之间的间距和位置
    m.offset = last ? last.offset + last.elmHeight + margin : margin;
    return acc.concat(m);
  }, []);
  totalHeight = data[data.length - 1].offset + data[data.length - 1].elmHeight;
  vnode = patch(vnode, view(data));
}
//改变顺序
function changeSort(prop) {
  sortBy = prop;
  //利用传入的数据来确定排序
  data.sort((a, b) => {
    if (a[prop] > b[prop]) {
      return 1;
    }
    if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  });
  render();
}
//添加新的电影
function addMovie() {
  let n = originalData[Math.floor(Math.random() * 10)];
  data = [
    { rank: newKey++, title: n.title, desc: n.desc, elmHeight: 0 },
  ].concat(data);
//调用两次才能顺利添加
  render();
  render();
}

//移除列表里面的数据
function removeMoive(movie) {
  data = data.filter((m) => {
    return m !== movie;
  });
  render();
}

//初始化，用异步方式加载
window.addEventListener("DOMContentLoaded", () => {
  let container = document.getElementById("container");
  vnode = patch(container, view(data));
  render();
});
