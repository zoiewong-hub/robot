# 零次方 · 合肥展厅

1000㎡展厅的交互式 WebGL 模型。模型、场景、导览和动作均由 app.js 在浏览器中生成，无需安装或后端。

## 浏览

GitHub Pages：<https://zoiewong-hub.github.io/robot/hefei-showroom/>

本地直接打开 index.html，或用静态服务器打开此目录。

## 文件

- index.html：页面结构
- style.css：顶部导航、右侧毛玻璃导览与空间光影
- app.js：完整模型、镜头、区域导览和机器人动画
- assets/：展厅参考图和影厅素材

## 操作

拖动旋转、滚轮缩放；顶部选择展区或平面图；右下角播放演示、切换站点。视图菜单可查看中央弧形影厅或切换环墙自动显隐。

## 尺寸

总面积1000㎡，机器人0.8×0.7×1.6m，小车5×3m；咖啡台高0.8m，墙高暂按3.6m。此文件为展示模型，不是施工图。

## 发布

仓库已有 GitHub Pages 工作流，推送 main 后自动部署。若 Pages 未开启：Settings → Pages → Source 选 GitHub Actions。
