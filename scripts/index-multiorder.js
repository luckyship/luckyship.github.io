"use strict";

hexo.extend.generator.register("index_multiorder", function (locals) {
  const config = hexo.config;

  console.log(Object.keys(locals.posts.data[0]));
  locals.posts.data = locals.posts.data.sort((a, b) => {
    return multiFieldSort(a, b, parseOrderBy(config.order_by));
  });
  const posts = locals.posts;

  const paginationDir = config.pagination_dir || "page";
  const perPage = config.per_page || 10;
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / perPage);

  const result = [];

  for (let i = 1; i <= totalPages; i++) {
    const pagePosts = posts.slice(perPage * (i - 1), perPage * i);

    result.push({
      path: i === 1 ? "/" : `/${paginationDir}/${i}/`,
      layout: ["index"],
      data: {
        posts: pagePosts,
        current_page: i,
        total_pages: totalPages,
        prev_link: i > 1 ? (i === 2 ? "/" : `/${paginationDir}/${i - 1}/`) : null,
        next_link: i < totalPages ? `/${paginationDir}/${i + 1}/` : null,
      },
    });
  }

  //   console.log(result);

  return result;

  // 解析 order_by 配置为排序规则数组
  function parseOrderBy(orderBy) {
    if (!orderBy) return [{ field: "date", order: "desc" }];

    return orderBy.split(",").map((item) => {
      const [field, order = "asc"] = item.trim().split(/\s+/);
      return { field, order: order.toLowerCase() };
    });
  }

  // 多字段排序比较函数
  function multiFieldSort(a, b, orders) {
    for (const { field, order } of orders) {
      let av = a[field];
      let bv = b[field];

      // 兼容 moment 对象转换为时间戳
      if (av && typeof av.toDate === "function") av = av.toDate().getTime();
      if (bv && typeof bv.toDate === "function") bv = bv.toDate().getTime();

      // 兼容日期字符串转时间戳
      if (typeof av === "string" && Date.parse(av)) av = Date.parse(av);
      if (typeof bv === "string" && Date.parse(bv)) bv = Date.parse(bv);

      if (av < bv) return order === "asc" ? -1 : 1;
      if (av > bv) return order === "asc" ? 1 : -1;
      // 如果相等，继续比较下一字段
    }
    return 0;
  }
});
