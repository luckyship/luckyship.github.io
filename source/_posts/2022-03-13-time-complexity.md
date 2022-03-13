---
layout: post
title: 算法中的时间复杂度
tags: []
comments: true
date: 2022-03-13 14:50:11
---

### 如何计算时间复杂度

我们来看一道题目：

[力扣题目链接](https://leetcode-cn.com/problems/minimum-size-subarray-sum/)

给定一个含有  n  个正整数的数组和一个正整数  s ，找出该数组中满足其和 ≥ s 的长度最小的 连续 子数组，并返回其长度。如果不存在符合条件的子数组，返回 0。

示例：

输入：s = 7, nums = \[2,3,1,2,4,3\] 输出：2 解释：子数组  \[4,3\]  是该条件下的长度最小的子数组。

<!-- more -->

### 暴力破解

这道题目暴力解法当然是 两个 for 循环，然后不断的寻找符合条件的子序列，时间复杂度很明显是$O(n^2)$。

代码如下：

```js
class Solution {
public:
    int minSubArrayLen(int s, vector<int>& nums) {
        int result = INT32_MAX; // 最终的结果
        int sum = 0; // 子序列的数值之和
        int subLength = 0; // 子序列的长度
        for (int i = 0; i < nums.size(); i++) { // 设置子序列起点为i
            sum = 0;
            for (int j = i; j < nums.size(); j++) { // 设置子序列终止位置为j
                sum += nums[j];
                if (sum >= s) { // 一旦发现子序列和超过了s，更新result
                    subLength = j - i + 1; // 取子序列的长度
                    result = result < subLength ? result : subLength;
                    break; // 因为我们是找符合条件最短的子序列，所以一旦符合条件就break
                }
            }
        }
        // 如果result没有被赋值的话，就返回0，说明没有符合条件的子序列
        return result == INT32_MAX ? 0 : result;
    }
};
```

### 滑动窗口

接下来就开始介绍数组操作中另一个重要的方法：滑动窗口。

所谓滑动窗口，就是不断的调节子序列的起始位置和终止位置，从而得出我们要想的结果。

```js
var minSubArrayLen = function (target, nums) {
  // 长度计算一次
  const len = nums.length;
  let l = (r = sum = 0),
    res = len + 1; // 子数组最大不会超过自身
  while (r < len) {
    sum += nums[r++];
    // 窗口滑动
    while (sum >= target) {
      // r始终为开区间 [l, r)
      res = res < r - l ? res : r - l;
      sum -= nums[l++];
    }
  }
  return res > len ? 0 : res;
};
```

> 时间复杂度：$O(n)$ 空间复杂度：$O(1)$

### 为什么时间复杂度是$O(n)$。

不要以为 for 里放一个 while 就以为是$O(n^2)$啊， 主要是看每一个元素被操作的次数，每个元素在滑动窗后进来操作一次，出去操作一次，每个元素都是被被操作两次，所以时间复杂度是 2 × n 也就是$O(n)$。

而暴力破解，最坏的情况，最后一个元素每个循环都要被用到，所以是 $O(n^2)$
