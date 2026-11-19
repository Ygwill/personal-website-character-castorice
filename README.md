# 角色页模板（崩坏：星穹铁道）

一个角色一个仓库。页面结构参考 wiki 的角色页分栏习惯，**数据全部由官方解包索引生成**，
不在前端手抄文本、不采信百科类站点的内容。当前是初版：昔涟（1415）跑通，换角色按下面的清单走。

## 快速开始

```bash
git lfs install          # 一次性，本机开启 LFS
git clone <本仓库>
cd character-template
npm install
npm run dev              # http://127.0.0.1:5174
```

图片资源（技能/行迹/星魂图标、立绘、材料图标）走 **Git LFS**，构建产物 `dist/`、
依赖 `node_modules/`、取数中间产物 `tools/raw/` 都不入库。

## 数据流

```
tools/fetch-data.sh     抓 Mar-7th/StarRailRes 的 index_new/cn/ 共 11 个 JSON -> tools/raw/
tools/gen.py --id 1415  生成 src/data/character.js（全部文案与数值）+ src/data/snapshot.js（索引指纹）
tools/fetch-assets.py   按索引里的 icon 字段拉图 -> src/assets/（立绘缩到 1024 边长并转 WebP）
```

`src/data/character.js` **不要手改**，改逻辑改 `tools/gen.py`。
页面里每个数字都能回溯到某个索引的某个键，见站内「数据溯源」栏目。

## 换角色清单

1. `python3 tools/gen.py --id <角色 ID>`（ID 在 `tools/raw/characters.json` 里查，如 1413 长夜月）
2. 在 `tools/gen.py` 的 `LORE_IDS` 里补这个角色对应的 `descriptions.json` 条目 id
   （上游没有「角色→文案」的反向表，只能人工筛；筛不出来就留空）
3. `python3 tools/fetch-assets.py --id <角色 ID>` —— 图标会自动补齐，文件名沿用上游 basename，
   前端按 basename 匹配（`src/utils/assets.js`），缺图的位置自动留空不报错
4. 立绘/头像已由脚本按 `<tag>-portrait.webp` / `<tag>-avatar.png` 命名，`tag` 取自索引，无需改名
5. `src/data/site.js`：
   - `unknownFields` 换成这个角色自己「缺一手出处所以不写」的字段
   - `poemOwners`（献诗火种→角色）只在昔涟这类机制里需要，别的角色可清空
   - `charTags` / `characterRepos` 决定站内跳转，新仓库建成后补一行
6. `npm run check && npm run build` 都干净再提交

## 自检

```bash
npm run check    # SSR 逐个渲染每个栏目，出现 undefined / NaN / 缺字段会直接列出来
npm run build    # 静态构建，base 为相对路径，可直接丢进任意子路径托管
npx vite preview
```

`npm run check` 抓到过真问题（属性表把整个 tier 对象传进了取值函数，页面显示 NaN），
建议每次改完数据或组件都跑一遍。

## 部署

`dist/` 直接静态托管即可（`base: './'`，可放 `/cyrene/` 这类子目录）。
nginx 侧配法与主站一致，见 `personal-website/main` 的 README。

## 还没做的

- 语音文本（上游索引里没有现成的角色语音表）
- 皮肤（`spinner.json` 不在这个仓库里；wiki 提到的「昔涟·赴约」未采信）
- 技能晋阶材料的明细表、行迹解锁材料
- 称号 / 实装日期 / 卡池：解包不含，需官方公告，先挂在「尚未确认」里

## 声明

非粉丝站运营，仅作资料整理。游戏文本与美术素材版权归米哈游 / HoYoverse 所有。
