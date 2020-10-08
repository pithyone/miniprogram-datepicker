# miniprogram-datepicker

<p>
  <a href="https://github.com/pithyone/miniprogram-datepicker/actions?query=workflow%3A%22Node.js+CI%22">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/pithyone/miniprogram-datepicker/Node.js%20CI?style=flat-square"></a>
  <a href="https://codecov.io/gh/pithyone/miniprogram-datepicker">
    <img alt="Codecov" src="https://img.shields.io/codecov/c/github/pithyone/miniprogram-datepicker?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/miniprogram-datepicker">
    <img alt="npm" src="https://img.shields.io/npm/v/miniprogram-datepicker?style=flat-square"></a>
</p>

小程序日期选择器，使用 `picker` 组件（多列选择器）实现，支持农历

## 使用效果
![Screenshot](https://wx1.sinaimg.cn/mw690/8f1f41a9ly1gjhswfi6anj20u00ymabo.jpg)

## 使用方法

1. 安装

```
npm install --save miniprogram-datepicker
```

2. JSON 组件声明

```
{
  "usingComponents": {
    "datepicker": "miniprogram-datepicker"
  }
}
```

3. wxml 引入组件

```
<datepicker bindchange="bindDateChange" value="{{value}}">
    <view>{{valueOfString}}</view>
</datepicker>
```

## 属性列表

| 属性名 | 类型 | 默认值 | 说明 |
|-|-|-|-|
| value | Object | 当天 | 表示选中的日期 |
| bindchange | eventhandle | | value 改变时触发 change 事件，event.detail = {value} |

## value 的结构

| 属性 | 类型 | 说明 |
|-|-|-|
| year | number | 年 |
| month | number | 月 |
| day | number | 日 |
| isLeapMonth | boolean | 是否闰月 |
| isLunarCalendar | boolean | 是否农历 |

## 示例代码

参考 :point_right: [demo](https://github.com/pithyone/miniprogram-datepicker/tree/master/tools/demo)

## 应用案例

<div>
    <img src="https://wx3.sinaimg.cn/mw690/8f1f41a9ly1gjhy3jqkepj2076076wfc.jpg" width="100" title="倒数时光"/>
</div>
