/* ============================================================
   数据加载模块 data.js
   - 优先通过 fetch 读取 data/spots.json（在线/本地服务器环境）
   - fetch 失败（如 file:// 双击打开）时自动回退到内置兜底数据，
     保证双击 index.html 也能完整运行。
   ============================================================ */

/* 内置兜底数据（与 data/spots.json 一致） */
const QZ_FALLBACK = [{"id":"kaiyuan","name":"开元寺","category":"spot","typeLabel":"景点","cover":"assets/images/kaiyuan.jpg","summary":"千年古刹，泉州世遗核心，东西双塔是古城地标。","intro":"开元寺始建于唐垂拱二年（686年），是泉州规模最大的佛教寺院，也是“泉州：宋元中国的世界海洋商贸中心”世遗点之一。寺内东西双塔为八角五层楼阁式石塔，高约40余米，历经千年仍巍然屹立，是泉州古城最具代表性的地标。寺中古树参天，气势庄严，漫步其间能感受到深厚的海丝文化与佛教文化底蕴。","tags":["世遗","千年古刹","东西塔"],"tips":"建议清晨或傍晚前往，人少光线好；塔下广场适合拍全景。","location":"泉州市鲤城区西街","recommendation":"必打卡"},{"id":"luoyang","name":"洛阳桥","category":"spot","typeLabel":"景点","cover":"assets/images/luoyang.jpg","summary":"中国现存最早的跨海石桥，宋代“筏形基础”造桥典范。","intro":"洛阳桥（万安桥）始建于北宋皇祐五年（1053年），是中国现存最早的跨海梁式石桥，与赵州桥、卢沟桥等同列为中国古代名桥。造桥者首创“筏形基础”“种蛎固基”“浮运架梁”等先进工艺，展现了宋代的科技与智慧。桥畔碑刻与石将军像诉说着千年海丝故事，是泉州世遗的又一重要见证。","tags":["古桥","世遗","海丝","宋代"],"tips":"傍晚时分桥下江面开阔，日落景色优美，适合散步拍照。","location":"泉州市洛江区与台商投资区交界（洛阳江入海口）","recommendation":"历史爱好者必去"},{"id":"qingyuan","name":"清源山","category":"spot","typeLabel":"景点","cover":"assets/images/qingyuan.jpg","summary":"老君岩所在的闽南名山，登山揽胜、访古论道皆宜。","intro":"清源山是泉州的名胜名山，以老君岩最为著名——那尊宋代石刻老君造像历经千年风吹日晒，依然神态安详，是中国现存最大的道教石雕造像。山中林木葱郁、层峦叠翠，历代摩崖石刻众多，登高可俯瞰泉州古城与晋江入海，是访古、登高、感受闽南山水的绝佳去处。","tags":["名山","老君岩","登高","道教"],"tips":"路径较长，建议穿舒适的鞋；登顶视野开阔，宜备水。","location":"泉州市丰泽区","recommendation":"登山观景"},{"id":"weststreet","name":"西街","category":"spot","typeLabel":"景点","cover":"assets/images/weststreet.jpg","summary":"泉州保存最完整的古街区，烟火气与文艺气息并存。","intro":"西街是泉州最早开发的街道和区域之一，也是保存最完整的古街区。红砖古厝、骑楼老街、庙宇相邻，市井烟火与历史底蕴交织。这里汇聚了众多老字号小吃与文创小店，是体验“半城烟火半城仙”的泉州生活气息、感受古城烟火与人文的最佳窗口。","tags":["古街","烟火气","打卡","文创"],"tips":"傍晚和周末最热闹；附近的开元寺、钟楼、清净寺可串联游览。","location":"泉州市鲤城区","recommendation":"最推荐体验"},{"id":"chongwu","name":"崇武古城","category":"spot","typeLabel":"景点","cover":"assets/images/chongwu.jpg","summary":"明代海防石城，“石雕之乡”与壮阔海景相映。","intro":"崇武古城建于明洪武二十年（1387年），是中国现存最完整的明代石砌海防古城之一。城墙以花岗岩砌筑，依海而建，气势雄伟。古城所在的崇武镇素有“中国石雕之乡”美誉，城内石雕艺术随处可见；城墙外的沙滩海景辽阔壮美，山海相依，是感受海防历史与滨海风光的融合之地。","tags":["古城","海防","石雕","海景"],"tips":"可登上城墙俯瞰大海；出发前留意天气，风大时注意安全。","location":"泉州市惠安县崇武镇","recommendation":"滨海打卡"},{"id":"mianxianhu","name":"面线糊","category":"food","typeLabel":"美食","cover":"assets/images/mianxianhu.jpg","summary":"泉州人早餐的灵魂，细如发丝、汤鲜爽滑。","intro":"面线糊是泉州最具代表性的早餐小吃。选用细如发丝的面线，以猪骨汤、海鲜等熬成的汤底勾芡而成，口感爽滑、鲜香浓郁。一碗热腾腾的面线糊，常配上油条、醋肉、大肠、猪血等油炸或卤煮配料，再撒上葱花与胡椒粉，暖胃又抚慰人心，是泉州人一天元气满满的开始。","tags":["早餐","特色小吃","暖胃"],"tips":"加醋肉和油条最是地道；入口滑嫩，记得趁热吃。","location":"泉州街头老店","recommendation":"本地人最爱"},{"id":"oyster","name":"海蛎煎（蚵仔煎）","category":"food","typeLabel":"美食","cover":"assets/images/oyster.jpg","summary":"鲜甜海蛎裹蛋液煎至金黄，外焦里嫩，闽南味十足。","intro":"海蛎煎（闽南话称蚵仔煎）是闽南地区风靡的经典小吃。选用肥美鲜甜的海蛎，与地瓜粉、蒜苗、蛋液一同煎制，外皮金黄微焦、内里软嫩多汁，海蛎的鲜甜与蛋香交织。煎好后再淋上一匙甜辣酱或黄芥末，滋味层次丰富，是一吃难忘的家乡味道。","tags":["海产","小吃","闽南味"],"tips":"热锅现煎最香；配有甜辣酱更地道。","location":"泉州街头/闽南菜馆","recommendation":"必吃小吃"},{"id":"tuscundong","name":"土笋冻","category":"food","typeLabel":"美食","cover":"assets/images/tuscundong.jpg","summary":"富含胶质的传统凉菜，爽滑Q弹，闽南特色。","intro":"土笋冻是闽南地区的特色冷盘美食，以本地滩涂上的“土笋”（星虫）经熬煮冷却凝结而成。成品晶莹剔透、爽滑Q弹，佐以蒜蓉、酱油、醋、芥末等蘸料，冰凉爽口、鲜美独特。它承载着沿海渔家的饮食智慧，是闽南宴席与街头都极具代表性的风味小吃。","tags":["传统","小吃","特色","海鲜"],"tips":"配蒜蓉醋汁最对味；冰凉口感更佳。","location":"泉港/晋江等地","recommendation":"特色尝鲜"},{"id":"gingerduck","name":"姜母鸭","category":"food","typeLabel":"美食","cover":"assets/images/gingerduck.jpg","summary":"老姜与鸭同炖，温补驱寒，香气浓郁闽南炖品。","intro":"姜母鸭是闽南秋冬进补的名菜。以大量老姜与正番鸭一同焖炖，汤汁醇厚、姜香扑鼻，鸭肉酥烂入味，辛香温暖、驱寒滋补。一锅热气腾腾的姜母鸭，既能暖身，也是亲友围桌共享的温情美味，尤其在微凉的季节里格外受欢迎。","tags":["温补","炖品","老字号"],"tips":"老姜炖得越久越香；配米饭或面线都很合适。","location":"闽南菜馆","recommendation":"秋冬进补"},{"id":"rouzong","name":"烧肉粽","category":"food","typeLabel":"美食","cover":"assets/images/rouzong.jpg","summary":"闽南咸香肉粽，料足酱香，节日与日常皆宜。","intro":"泉州烧肉粽是闽南粽子中的代表。糯米经卤汁浸透，包入五花肉、香菇、虾米、栗子、咸蛋黄等丰富馅料，蒸制后油润咸香、软糯入味。剥开粽叶，酱香四溢，佐以甜辣酱或花生酱，是端午佳节与日常街巷都备受喜爱的浓香美味。","tags":["粽子","咸香","节令"],"tips":"慢火久蒸更糯；搭配甜辣酱风味更佳。","location":"端午/老字号","recommendation":"节日必吃"},{"id":"anxi","name":"安溪铁观音","category":"food","typeLabel":"美食","cover":"assets/images/anxi.jpg","summary":"乌龙茶之极品，兰花香馥郁，回甘持久。","intro":"安溪铁观音产自“中国乌龙茶之乡”安溪，是中国十大名茶之一。其制作工艺繁复，成品条索紧结、色泽砂绿，冲泡后汤色金黄明亮，兰花香馥郁持久，入口醇厚甘鲜、回甘悠长。一杯铁观音，既是舌尖的享受，也是闽南茶文化与待客之道的生动体现。","tags":["茶","非遗","安溪","乌龙茶"],"tips":"用沸水高冲、快出汤更能激发香气；可多次冲泡。","location":"泉州市安溪县","recommendation":"伴手礼首选"},{"id":"nanyin","name":"南音","category":"culture","typeLabel":"文化","cover":"assets/images/nanyin.jpg","summary":"“中国音乐活化石”，闽南古乐千年流韵。","intro":"南音（南管）是流行于闽南地区的古老乐种，被称为“中国音乐史上的活化石”。它以琵琶、洞箫、三弦、二弦等乐器为主，唱腔婉转细腻、古朴典雅，曲目多承唐宋遗音，2006年被列入国家级非物质文化遗产，2009年入选联合国教科文组织人类非物质文化遗产代表作名录。聆听南音，如穿越千年，感受闽南人的乡愁与雅致。","tags":["非遗","古乐","世界遗产"],"tips":"可在南音馆或文化剧场欣赏现场演出，体验原汁原味。","location":"泉州（闽南地区）","recommendation":"非遗体验"},{"id":"puppet","name":"提线木偶戏","category":"culture","typeLabel":"文化","cover":"assets/images/puppet.jpg","summary":"泉州提线木偶，技艺精湛，享誉海内外。","intro":"泉州提线木偶戏（悬丝傀儡）历史悠久，表演者以细线操纵木偶，数十根丝线在指尖翻飞，木偶眉眼传神、动作细腻，能演出唱、念、做、打等丰富剧情。泉州提线木偶戏被列入首批国家级非物质文化遗产，多次赴海内外展演，是闽南民间艺术的一颗璀璨明珠。","tags":["非遗","木偶","戏曲"],"tips":"观看演出时留意操纵者灵巧的“牵丝”技艺。","location":"泉州市","recommendation":"民间艺术"},{"id":"cihua","name":"德化白瓷","category":"culture","typeLabel":"文化","cover":"assets/images/cihua.jpg","summary":"“中国白”德化瓷，千年瓷都的温润之美。","intro":"德化是中国三大古瓷都之一，其白瓷因胎釉洁白细腻、如脂似玉，被誉为“中国白”“象牙白”。德化白瓷以何朝宗等瓷雕名家经典传世，观音、达摩等人物塑像神态逼真、衣纹流畅。德化陶瓷烧制技艺被列入国家级非物质文化遗产，是泉州“海丝”文化中一张闪耀的陶瓷名片。","tags":["陶瓷","非遗","德化","工艺"],"tips":"瓷都德化有瓷厂与博物馆可参观，也可选购心仪瓷器。","location":"泉州市德化县","recommendation":"工艺收藏"},{"id":"jianzhu","name":"闽南红砖建筑","category":"culture","typeLabel":"文化","cover":"assets/images/jianzhu.jpg","summary":"红砖古厝、燕尾脊，闽南建筑美学的典范。","intro":"闽南传统红砖建筑以红砖红瓦、燕尾脊、出砖入石、砖雕石雕等为鲜明特色，红砖古厝与骑楼交相辉映，是闽南人对家园与宗族的情感寄托。泉州古城及晋江五店市、龙湖等地的红砖厝群，保留了完整的闽南建筑风貌，红墙燕脊在夕阳下格外温暖，是闽南建筑美学与乡愁的集中呈现。","tags":["建筑","古厝","美学","红砖"],"tips":"五店市、西街等古城街区皆可欣赏红砖古厝与燕尾脊。","location":"泉州（闽南地区）","recommendation":"建筑美学"}];
const QZ_CAROUSEL_FALLBACK = [{"id":"hero1","name":"泉州古城","caption":"千年海丝名城 · 泉州"},{"id":"hero2","name":"西街","caption":"半城烟火半城仙 · 西街"},{"id":"hero3","name":"洛阳桥","caption":"跨海古桥 · 洛阳桥"}];

const QZ = {
  data: [],
  carousel: [],
  /* 加载数据：优先 fetch，失败用兜底 */
  async load() {
    try {
      const res = await fetch('data/spots.json');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json) && json.length) this.data = json;
      }
      const rc = await fetch('data/carousel.json');
      if (rc.ok) {
        const jc = await rc.json();
        if (Array.isArray(jc) && jc.length) this.carousel = jc;
      }
    } catch (e) { /* file:// 下 fetch 会被拦截，忽略并回退 */ }

    if (!this.data.length) this.data = QZ_FALLBACK;
    if (!this.carousel.length) this.carousel = QZ_CAROUSEL_FALLBACK;
    return this.data;
  },
  /* 按 id 查找单条 */
  find(id) { return this.data.find(function (it) { return it.id === id; }); },
  /* 分类中文名映射 */
  typeLabel(cat) {
    const map = { spot: '景点', food: '美食', culture: '文化' };
    return map[cat] || cat;
  }
};

window.QZ = QZ;
