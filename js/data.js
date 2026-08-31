/* ============================================================
   临床用药指导 · 知识库
   面向无临床背景的成人（默认：成年人、既往体健）。
   内容为常见症状的自助用药参考，强调安全与就医红线。
   注意：任何用药信息在使用前都应经执业医师/药师复核。
   ============================================================ */

/* ------------------------------------------------------------
   一、身体部位
------------------------------------------------------------ */
const REGIONS = [
  { id: 'head',    name: '头部',        icon: '🧠' },
  { id: 'eye',     name: '眼睛',        icon: '👁️' },
  { id: 'ent',     name: '耳鼻喉',      icon: '👂' },
  { id: 'mouth',   name: '口腔',        icon: '👄' },
  { id: 'teeth',   name: '牙齿',        icon: '🦷' },
  { id: 'neck',    name: '颈部',        icon: '🧣' },
  { id: 'chest',   name: '胸部',        icon: '🫀' },
  { id: 'abdomen', name: '腹部/消化',   icon: '🍽️' },
  { id: 'back',    name: '腰背部',      icon: '🤸' },
  { id: 'limbs',   name: '四肢/关节',   icon: '🦵' },
  { id: 'skin',    name: '皮肤',        icon: '🩹' },
  { id: 'whole',   name: '全身/发热',   icon: '🌡️' },
];
/* ------------------------------------------------------------
   二、药物数据库
   form    = 用法用量（成人、常见 OTC 剂量，大白话）
   maxNote = 极限提醒
   contraindications = "别用的情况"（大白话）
   groups  = 用于相互作用判断的药理分组
------------------------------------------------------------ */
const MEDS = {
  paracetamol: {
    name: '对乙酰氨基酚',
    alias: '扑热息痛（商品名：泰诺林缓释片，每片 0.65g）',
    type: '退烧止痛',
    form: '成人和 12 岁以上：一次 1 片（0.65g），每 8 小时一次，24 小时内不超过 3 次。整片吞服，别碾碎。退烧连用不超过 3 天、止痛不超过 5 天。',
    maxNote: '24 小时最多 3 片。过量（8 小时内超过 7.5~10g）会严重伤肝，一旦过量，不管有没有不舒服都要立即就医。',
    contraindications: [
      '严重肝、肾不好的人不能用。',
      '对扑热息痛（对乙酰氨基酚）或成分过敏的人不能用。',
      '有肝不好、肝肾功能不太好的人，用之前先问医生。',
      '别和别的含对乙酰氨基酚的退烧/感冒药一起吃（会超量）。',
      '吃药这几天别喝酒；长期喝酒的人用之前先问医生。',
      '孕妇、喂奶期间慎用（先问医生）；对阿司匹林过敏的人慎用。',
      '正在吃华法林等防血栓的药、或氟氯西林（一种抗生素）的人，用之前先问医生。',
    ],
    groups: ['acetaminophen'],
  },

  ibuprofen: {
    name: '布洛芬',
    alias: '（商品名：芬必得缓释胶囊，每粒 0.3g）',
    type: '退烧止痛消炎药',
    form: '成人一次 1 粒（0.3g），一天 2 次（早晚各一次），饭后吃。止痛连用不超过 5 天、退烧不超过 3 天。',
    maxNote: '缓释胶囊必须整粒吞服，别嚼碎、别拆开。一天 2 粒。',
    contraindications: [
      '对布洛芬、阿司匹林或其他退烧止痛消炎药过敏的人不能用。',
      '孕妇及喂奶期间妇女不能用。',
      '一吃阿司匹林就哮喘的人不能用。',
      '有肝不好、肾不好、心脏不好的人不能用。',
      '正在吃其他布洛芬/退烧止痛消炎药的人不能用（除非医生让吃）。',
      '有胃溃疡（胃里烂了）、胃/肠道出血的人不能用。',
      '60 岁以上、有哮喘/鼻子里长息肉、血不容易凝固、高血压、心脏不好、炎症性肠病（肠子里长期发炎的病）的人慎用（先问医生）。',
      '吃药期间别喝酒。',
    ],
    groups: ['nsaid'],
  },

  aspirin: {
    name: '阿司匹林',
    alias: '（阿司匹林片，每片 0.3g）',
    type: '退烧止痛消炎药',
    form: '成人和 14 岁以上：一次 1~2 片（0.3~0.6g），若持续发热或疼痛，间隔 4~6 小时重复 1 次，24 小时内不超过 4 次。饭后吃，减少对胃的刺激。',
    maxNote: '止痛不超过 5 天、退烧不超过 3 天。它伤胃、影响血小板，一般不建议自己用它止痛，首选对乙酰氨基酚或布洛芬。',
    contraindications: [
      '孕妇、喂奶期间妇女不能用。',
      '有哮喘、鼻子里长息肉、或对阿司匹林等退烧止痛药过敏的人不能用。',
      '有容易出血的病（血友病）、血小板少、或胃/肠溃疡正在发作的人不能用。',
      '有胃溃疡/胃出血史的人别用。',
      '正在吃防血栓的药（华法林、肝素）或溶血栓的药的人别用。',
      '痛风、肝肾不好、心脏不好、鼻子容易出血、月经量过多、贫血的人慎用。',
      '吃药期间别喝酒。',
    ],
    groups: ['nsaid', 'salicylate'],
  },

  diclofenac_gel: {
    name: '双氯芬酸乳胶（外用药膏）',
    alias: '（常见商品名：扶他林软膏）',
    type: '外用退烧止痛消炎药（涂在皮肤上的）',
    form: '涂在疼痛的关节/肌肉上，轻轻按摩，每天 3~4 次；每次按说明挤出豌豆到 2 厘米大小即可。',
    maxNote: '只用于没有破皮的皮肤，避开伤口和眼睛；不要大面积长期涂。',
    contraindications: [
      '对退烧止痛消炎药过敏者别用。',
      '皮肤破损、湿疹、感染处别涂。',
      '孕妇、喂奶期间先问医生。',
    ],
    groups: ['nsaid_topical'],
  },

  loratadine: {
    name: '氯雷他定',
    alias: '（常见商品名：开瑞坦，每片 10mg）',
    type: '抗过敏药（第二代，不易犯困）',
    form: '成人及 12 岁以上：一次 1 片（10mg），一天 1 次。',
    maxNote: '和西替利嗪二选一即可，别叠吃。',
    contraindications: [
      '对氯雷他定过敏的人不能用。',
      '肝不好的人在医生指导下用。',
      '孕妇、喂奶期间用之前先问医生。',
      '做过敏皮试前约 48 小时要停用（否则会影响结果）。',
      '和酮康唑、某些抗生素、茶碱等一起吃，会升高药在血里的浓度，要慎用。',
    ],
    groups: ['antihistamine_2g'],
  },

  cetirizine: {
    name: '西替利嗪',
    alias: '（常见商品名：仙特明，每片 10mg）',
    type: '抗过敏药（第二代，有一定困倦可能）',
    form: '成人一次 1 片（10mg），一天 1 次（可晚餐时吃）；容易犯困的人可早晚各半片。',
    maxNote: '和氯雷他定二选一即可，别叠吃。',
    contraindications: [
      '对西替利嗪、羟嗪或同类药过敏的人不能用。',
      '肾不好到很严重的人不能用。',
      '喂奶期间妇女别用（会进入母乳）；怀孕前 3 个月不推荐。',
      '有排尿困难（前列腺肥大）、羊癫疯（癫痫）的人慎用。',
      '吃药期间别开车、别高空作业。',
      '和安眠药、茶碱一起吃要谨慎。',
    ],
    groups: ['antihistamine_2g'],
  },

  dimenhydrinate: {
    name: '茶苯海明',
    alias: '（常见商品名：乘晕宁，每片 25mg）',
    type: '抗晕动/止恶心（第一代，会犯困）',
    form: '成人一次 1~2 片（25~50mg）。防晕车/晕船：出发前 30 分钟吃；治晕动症时每 4 小时一次。一天最多 12 片。',
    maxNote: '会犯困，吃药后别开车、别操作机器。',
    contraindications: [
      '对其他同类晕车药过敏的人不能用。',
      '孕妇、新生儿、早产儿不能用。',
      '吃药期间别喝酒，别和安眠药、三环类抗抑郁药一起吃。',
      '老年人慎用。',
    ],
    groups: ['antihistamine_1g'],
  },

  omeprazole: {
    name: '奥美拉唑（抑酸药）',
    alias: '（常见商品名：洛赛克胶囊，10mg/20mg）',
    type: '抑酸药（减少胃酸）',
    form: '胃食管反流/胃溃疡/十二指肠溃疡：一次 20mg，一天 1~2 次，晨起或早晚整粒吞服（别嚼碎）。症状控制后可用 10mg。疗程听医生。',
    maxNote: '出现明显体重减轻、反复呕吐、吞咽困难、呕血/黑便等“报警信号”，要先去医院排查，别自己扛。',
    contraindications: [
      '对奥美拉唑或同类药过敏的人不能用。',
      '不能和奈非那韦、利匹韦林（某些抗病毒药）一起吃。',
      '避免和氯吡格雷（一种抗血栓药）、圣约翰草、利福平一起吃。',
      '长期（超过 1 年）用可能低镁、增加骨折风险，按医生建议用最低剂量、最短疗程。',
    ],
    groups: ['ppi'],
  },

  hydrotalcite: {
    name: '铝碳酸镁（抗酸剂）',
    alias: '（常见商品名：达喜咀嚼片，每片 0.5g）',
    type: '中和胃酸的药',
    form: '一次 1~2 片（0.5~1g），一天 3 次，嚼碎后吃。餐后 1~2 小时、睡前或胃不舒服时吃。连续用不超过 7 天。',
    maxNote: '和其他药错开 1~2 小时再吃。',
    contraindications: [
      '对本品过敏的人不能用。',
      '肾不好到很严重的人不能用。',
      '血里磷太低的人不能用。',
      '肾不太好、血里镁/钙太高、心脏功能很差的人慎用。',
      '怀孕前 3 个月慎用；怀孕 3 个月以上先问医生。',
      '持续、反复的胃痛可能是溃疡等大病，7 天不好要去医院。',
    ],
    groups: ['antacid'],
  },

  montmorillonite: {
    name: '蒙脱石散',
    alias: '（常见商品名：思密达，每袋 3g）',
    type: '止泻（物理吸附，保护肠道）',
    form: '成人一次 1 袋（3g），一天 3 次；急性腹泻第一次可加倍。倒进约 50ml 温水里搅匀，快速喝完。',
    maxNote: '它会把别的药“吸附”掉，和其他口服药错开 2 小时左右。',
    contraindications: [
      '对本品过敏的人不能用。',
      '治急性腹泻时要注意补液（配合口服补液盐）。',
      '便秘了就减量；有重度慢性便秘史的人慎用。',
      '过量会便秘，甚至胃（肠）石。',
    ],
    groups: ['adsorbent'],
  },

  ors: {
    name: '口服补液盐（ORS 冲剂）',
    type: '盐分补充（腹泻/呕吐脱水时用）',
    form: '把 1 袋溶到温水里（ORS Ⅰ/Ⅱ：1 袋对 500ml；ORS Ⅲ：1 袋对 250ml），少量多次喝，腹泻停止就停。别用牛奶/果汁代替水。',
    maxNote: '重度脱水（尿很少、没精神、休克）或严重腹泻吐到喝不进去，要打吊针，赶紧去医院。',
    contraindications: [
      '少尿/无尿、严重脱水需打吊针的人，别用口服。',
      '严重腹泻呕吐、糖吸收有问题、肠子堵了、肠子不动了、肠子破了的人不能用。',
      '心、肾、脑功能差及血里钾太高的人慎用。',
    ],
    groups: ['electrolyte'],
  },

  probiotics: {
    name: '益生菌（双歧杆菌四联活菌片等）',
    type: '调节肠道菌群',
    form: '一次 3 片，一天 3 次，饭后用温开水/温牛奶（低于 40℃）送服；重症可加倍。',
    maxNote: '开袋后尽早吃；要 2~8℃ 冷藏。',
    contraindications: [
      '别和氯霉素、头孢、红霉素、青霉素等抗生素一起吃（会把活菌杀光）。',
      '别和铋剂、鞣酸、药用炭、酊剂一起吃（会抑制/吸附活菌）。',
    ],
    groups: ['probiotic'],
  },

  lactulose: {
    name: '乳果糖（口服液）',
    alias: '（常见商品名：杜密克）',
    type: '温和通便（渗透性泻药）',
    form: '便秘：成人起始每天 15~30ml，早餐时一次喝；1~2 天起效，按效果调整。多喝水（每天 1.5~2 升）。',
    maxNote: '治疗前有不明原因腹痛，要先告诉医生。',
    contraindications: [
      '肠子堵了、急腹痛、消化道破了的人不能用。',
      '炎症性肠病（肠子里长期发炎的病）的人不能用。',
      '对乳糖/果糖消化不了（很罕见的遗传问题）的人不能用。',
      '对本品过敏的人不能用。',
    ],
    groups: ['laxative_osmotic'],
  },

  macrogol: {
    name: '聚乙二醇 4000（散）',
    alias: '（常见商品名：福松，每袋 10g）',
    type: '温和通便（渗透性泻药）',
    form: '成人和 8 岁以上：一次 1 袋（10g），每天 1~2 次；或每天 2 袋一次喝完。每袋溶约 50ml 水，24~48 小时起效。',
    maxNote: '开始前先排除器质性问题（不是单纯便秘）；儿童别连续用超过 3 个月。',
    contraindications: [
      '炎症性肠病（肠子里长期发炎的病）很严重、或肠子胀得很大的人不能用。',
      '消化道破了、肠子堵了、不明原因腹痛的人不能用。',
      '对聚乙二醇或成分过敏的人不能用。',
    ],
    groups: ['laxative_osmotic'],
  },

  dextromethorphan: {
    name: '右美沙芬',
    alias: '（常见商品名：氢溴酸右美沙芬片，每片 15mg）',
    type: '镇咳（干咳、无痰）',
    form: '成人一次 1~2 片（15~30mg），一天 3~4 次。适用于“干咳没痰”。',
    maxNote: '痰很多时别用镇咳药（要咳出来）；用药 7 天不缓解就去咨询。',
    contraindications: [
      '怀孕 3 个月内、有精神病史、喂奶期间妇女不能用。',
      '正在吃某种抗抑郁药（单胺氧化酶抑制剂）停药不满 2 周的人不能用。',
      '哮喘、痰多、肝肾不好的人慎用。',
      '别和抗抑郁药一起吃。',
      '别喝酒、别和安眠药等中枢抑制药一起吃。',
      '吃药期间别开车、别操作机器。',
    ],
    groups: ['antitussive'],
  },

  ambroxol: {
    name: '氨溴索',
    alias: '（常见商品名：沐舒坦，每片 30mg）',
    type: '祛痰（让痰变稀好咳）',
    form: '成人一次 1~2 片（30~60mg），一天 3 次，饭后吃。',
    maxNote: '别和镇咳药（右美沙芬）一起吃，痰会堵住。',
    contraindications: [
      '对氨溴索过敏的人不能用。',
      '怀孕前 3 个月不能用。',
      '孕妇、喂奶期间慎用（先问医生）。',
      '肾不好的人先问医生。',
      '用药 7 天不见好转，或出现新的皮疹/皮肤破了，要停药就医。',
    ],
    groups: ['mucolytic'],
  },

  artificial_tears: {
    name: '玻璃酸钠滴眼液（人工泪液）',
    alias: '（常见商品名：海露，不含防腐剂）',
    type: '眼部润滑',
    form: '一天 3 次，一次 1 滴，可按需增加；每天超过 10 次要在眼科医生指导下用。',
    maxNote: '只缓解干涩；眼红、眼痛、分泌物多、视力下降要去医院。',
    contraindications: [
      '对本品过敏的人不能用。',
      '别和其他眼药水同时用（要间隔 30 分钟）；眼膏在它之后用。',
      '症状一直不缓解就停用、去看医生。',
    ],
    groups: ['eye_lubricant'],
  },

  hydrocortisone_cream: {
    name: '丁酸氢化可的松乳膏（弱效激素药膏）',
    alias: '（常见商品名：来可得，0.1%）',
    type: '外用抗炎止痒（弱效激素）',
    form: '薄薄涂在患处，一天 2 次。',
    maxNote: '感染/破溃的皮肤别涂；别大面积、长期用；用 1 周不缓解就咨询医生。',
    contraindications: [
      '感染性皮肤病（破了、流脓、长脚气那种真菌）不能用。',
      '皮肤破溃处别涂。',
      '别接触眼睛、口、鼻。',
      '儿童、孕妇、喂奶期间在医生指导下用。',
      '长期用可能皮肤变薄、出红血丝、留印子、再次感染。',
    ],
    groups: ['topical_steroid_weak'],
  },

  calamine: {
    name: '炉甘石洗剂',
    type: '外用止痒收敛（常用）',
    form: '用时摇匀，涂在瘙痒/起疹处，一天 2~3 次。',
    maxNote: '有渗液、破溃的皮肤别用。',
    contraindications: [
      '对本品过敏的人不能用。',
      '别接触眼睛、口、鼻。',
      '皮肤有渗液时不用。',
    ],
    groups: ['topical_misc'],
  },

  vaseline: {
    name: '凡士林/保湿软膏',
    type: '皮肤保湿屏障',
    form: '涂在干燥、脱屑、皲裂处，一天多次；也可用于轻度晒伤后保湿。',
    maxNote: '它不抗菌，只保湿；明显红肿、水疱、破溃、感染须就医。',
    contraindications: [
      '破了、流脓的伤口不要只涂凡士林了事，应清洁并就医。',
    ],
    groups: ['emollient'],
  },

  vitamin_b6: {
    name: '维生素 B6',
    alias: '（维生素 B6 片，每片 10mg）',
    type: '维生素（缓解轻度恶心）',
    form: '成人一天 1~2 片（10~20mg），连用 3 周。',
    maxNote: '必须按推荐剂量，别超量；用 3 周后停药。',
    contraindications: [
      '对本品过敏的人不能用。',
      '别长期、超量吃（可能手脚麻木、步态不稳等神经问题）。',
      '孕妇、喂奶期间在医生指导下用。',
    ],
    groups: ['vitamin'],
  },
};

/* 将某种药所“针对”的症状/场景说明，供结果文案展示 */
const MED_INTENT = {
  paracetamol: '常用退烧、止痛（头痛、牙痛、关节肌肉痛、发热）',
  ibuprofen: '止痛+抗炎（肌肉酸胀、关节痛、牙痛、头痛、痛经），退烧',
  aspirin: '普通止痛退烧（因副作用大，一般不优先推荐）',
  diclofenac_gel: '外用缓解局部肌肉/关节酸痛、扭伤（不伤胃）',
  loratadine: '用于鼻子过敏、流鼻涕、风疙瘩、皮肤过敏瘙痒',
  cetirizine: '同氯雷他定：鼻子过敏、风疙瘩、过敏瘙痒',
  dimenhydrinate: '晕车晕船、轻度恶心',
  omeprazole: '烧心、反酸、胃酸过多',
  hydrotalcite: '烧心、反酸（快速中和胃酸）',
  montmorillonite: '急性腹泻（物理吸附止泻）',
  ors: '腹泻、呕吐、大量出汗后的水分+盐分补充',
  probiotics: '腹泻后/肠道紊乱，帮助恢复肠道菌群',
  lactulose: '便秘（温和通便，不易依赖）',
  macrogol: '便秘（温和通便，不易依赖）',
  dextromethorphan: '干咳（无痰或痰很少）',
  ambroxol: '咳嗽但痰多、咳不出来',
  artificial_tears: '眼干涩、用眼过度',
  hydrocortisone_cream: '皮肤轻度瘙痒、小面积湿疹',
  calamine: '皮肤瘙痒、蚊虫叮咬、轻度皮疹',
  vaseline: '皮肤干裂、保湿、轻度晒伤保湿',
  vitamin_b6: '轻度恶心、孕吐（医生指导下）',
};

/* ------------------------------------------------------------
   三、相互作用规则
   rule: 'avoid'=不要同用 | 'timed'=间隔/错开 | 'compatible'=可用
   b:'*' 表示与任意口服药都适用（如蒙脱石散的吸附作用）
------------------------------------------------------------ */
const INTERACTIONS = [
  { a: 'ibuprofen', b: 'aspirin', rule: 'avoid', note: '布洛芬和阿司匹林属于同一类药，一起吃会明显增加胃出血风险。' },
  { a: 'paracetamol', b: 'aspirin', rule: 'avoid', note: '对乙酰氨基酚+阿司匹林：避免和含阿司匹林的复方感冒药同吃，增加肝/出血风险。' },
  { a: 'paracetamol', b: 'ibuprofen', rule: 'timed', note: '这两种都能退烧止痛，不要同时吃。可以选一种用；如果发热/疼痛需要交替，就间隔 4~6 小时，别吃两种撞在一起。' },
  { a: 'ibuprofen', b: 'diclofenac_gel', rule: 'timed', note: '口服布洛芬 + 外用双氯芬酸凝胶都属于退烧止痛消炎药。外用吸收很少，短期可以；但别长期一起大剂量用，尽量分开使用。' },

  { a: 'loratadine', b: 'cetirizine', rule: 'avoid', note: '氯雷他定和西替利嗪是同类抗过敏药，二选一即可，别叠加吃。' },
  { a: 'loratadine', b: 'dimenhydrinate', rule: 'avoid', note: '抗过敏药不要叠加，选一种；茶苯海明本身会犯困，别再加别的同类药。' },
  { a: 'cetirizine', b: 'dimenhydrinate', rule: 'avoid', note: '抗过敏药不要叠加，选一种。' },

  { a: 'dextromethorphan', b: 'dimenhydrinate', rule: 'timed', note: '右美沙芬和茶苯海明都可能让人犯困，别长时间同时用；明显困倦就减量或只用一种。' },

  { a: 'montmorillonite', b: '*', rule: 'interval', note: '蒙脱石散会把别的药“吸附”掉，一定要和其他口服药间隔 2 小时以上再吃。' },
  { a: 'probiotics', b: 'montmorillonite', rule: 'interval', note: '益生菌和蒙脱石散要间隔 2 小时，否则益生菌会被吸走。' },
  { a: 'hydrotalcite', b: 'omeprazole', rule: 'timed', note: '抗酸剂（铝碳酸镁）和抑酸药（奥美拉唑）一般不用同时用；如果一起用，先吃奥美拉唑，间隔 1~2 小时再吃抗酸剂。' },

  { a: 'dextromethorphan', b: 'ambroxol', rule: 'avoid', note: '说明书明确：氨溴索应避免与镇咳药（右美沙芬）同用，以免稀化的痰液堵住气道。' },
];

/* ------------------------------------------------------------
   四、症状库
   每个症状：
   region       所属部位
   name/icon    名称
   questions    附加问题（choice=单选, multi=多选）答案即为选项文字
   meds         推荐药物id列表
   care         非药物的生活护理（大白话）
   redFlags     触发就医红线的规则（detail 用 {a:答案值, k:文字} 说明）
------------------------------------------------------------ */
const SYMPTOMS = {
  /* ---------------- 头部 ---------------- */
  head_pain: {
    region: 'head', name: '头痛', icon: '🤯',
    questions: [
      { id: 'duration', label: '头痛持续多久了？', type: 'choice', options: ['几小时以内', '1~3 天', '超过 3 天'] },
      { id: 'side', label: '一般是在哪一侧？', type: 'choice', options: ['单侧（左边或右边）', '两侧都有', '说不清'] },
      { id: 'radiate', label: '疼痛会放射/牵拉到别处吗？', type: 'choice', options: ['不放射', '放射到眼眶/后颈', '放射到肩背'] },
      { id: 'relief', label: '什么情况下会好一些？（可多选）', type: 'multi', options: ['休息后减轻', '吃止痛药能缓解', '冷敷/热敷有用', '几乎无法缓解'] },
      { id: 'assoc', label: '有没有伴随症状？（可多选）', type: 'multi', options: ['恶心/呕吐', '发烧', '视力模糊或看东西发花', '头晕', '颈子僵硬发烫', '眼睛胀、怕光'] },
    ],
    meds: ['paracetamol', 'ibuprofen'],
    care: '多休息、少熬夜、少看屏幕，喝点温水，轻柔按摩太阳穴和颈后。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('颈子僵硬发烫') || a.includes('发烧'), level: 'doctor',
        tip: '头痛伴发烧、脖子僵硬、怕光、恶心，可能是感染/脑膜炎信号，请尽快去急诊。' },
      { key: 'assoc', test: a => a.includes('视力模糊或看东西发花') || a.includes('眼睛胀、怕光'), level: 'doctor',
        tip: '头痛伴视力异常或眼胀，建议尽快看眼科/神经科。' },
      { key: 'relief', test: a => a.includes('几乎无法缓解'), level: 'doctor',
        tip: '持续加重的剧烈头痛、止痛药也压不住，建议尽快就医。' },
    ],
  },

  head_dizziness: {
    region: 'head', name: '头晕', icon: '💫',
    questions: [
      { id: 'kind', label: '头晕的感觉是？', type: 'choice', options: ['头晕目眩（天旋地转）', '头重脚轻/发飘', '昏沉沉的'] },
      { id: 'during', label: '多在什么时候发生？', type: 'choice', options: ['突然起身时', '躺着翻身时', '持续存在'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['恶心', '耳鸣/听力下降', '心慌胸闷', '头痛'] },
    ],
    meds: ['dimenhydrinate'],
    care: '起身、翻身慢一点，头晕时先坐下/躺下，避免突然改变体位；补充水分，规律作息。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('耳鸣/听力下降') && a.includes('天旋地转'), level: 'doctor',
        tip: '反复发作的天旋地转 + 耳鸣 + 听力下降，可能是梅尼埃病等，去耳鼻喉科规范诊治。' },
      { key: 'assoc', test: a => a.includes('心慌胸闷'), level: 'doctor',
        tip: '头晕伴心慌、胸闷，需排除心脏问题，尽快就医。' },
      { key: 'during', test: a => a === '持续存在', level: 'doctor',
        tip: '头晕持续不缓解，建议就诊查找原因。' },
    ],
  },

  /* ---------------- 眼睛 ---------------- */
  eye_dry: {
    region: 'eye', name: '眼干涩/用眼过度', icon: '👁️',
    questions: [
      { id: 'scene', label: '什么时候容易干？', type: 'choice', options: ['看手机/电脑久了', '待在空调房', '一直都有'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['眼睛发红', '有异物感', '看东西模糊', '眼痛'] },
    ],
    meds: ['artificial_tears'],
    care: '每用眼 30~50 分钟休息一下，看点远处；多眨眼；人工泪液按需滴。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('眼痛') || a.includes('看东西模糊'), level: 'doctor',
        tip: '眼部不适伴明显眼痛或视力下降，别自行处理，尽快看眼科。' },
    ],
  },

  eye_red: {
    region: 'eye', name: '眼红/眼痒', icon: '🔴',
    questions: [
      { id: 'kind', label: '主要是？', type: 'choice', options: ['痒为主（像过敏）', '红、有分泌物（粘/脓）', '红伴疼痛/怕光'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['打喷嚏/流鼻涕（过敏）', '眼屎多', '视力下降', '眼痛'] },
    ],
    meds: ['artificial_tears'],
    care: '先洗手，不要揉眼；疑似过敏（痒 + 喷嚏）可考虑口服抗过敏药，但需医生确认。',
    redFlags: [
      { key: 'kind', test: a => a.includes('红伴疼痛/怕光') || a.includes('红、有分泌物'), level: 'doctor',
        tip: '眼红伴疼痛、怕光或分泌物多，可能是感染或炎症，请尽快看眼科，别乱滴眼药水。' },
      { key: 'assoc', test: a => a.includes('视力下降') || a.includes('眼痛'), level: 'doctor',
        tip: '眼红伴视力下降或明显眼痛，尽快就医。' },
    ],
  },

  eye_stye: {
    region: 'eye', name: '麦粒肿/眼皮红肿', icon: '👁️‍🗨️',
    questions: [
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['眼皮有硬结/脓点', '眼痛', '发烧', '肿得睁不开'] },
    ],
    meds: [],
    care: '温热毛巾敷眼（每次 10~15 分钟，一天 3~4 次），别用手挤；注意手和眼部卫生。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('肿得睁不开') || a.includes('发烧'), level: 'doctor',
        tip: '红肿明显、肿得睁不开眼、伴发烧或向周围扩散，尽快看眼科。' },
    ],
  },

  eye_foreign: {
    region: 'eye', name: '眼睛异物感/进东西', icon: '👁️',
    questions: [
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['明显眼痛', '怕光流泪', '视力下降', '异物可能嵌在眼上'] },
    ],
    meds: ['artificial_tears'],
    care: '别揉；先闭眼让泪把东西冲出来，或用干净水/生理盐水冲眼；出来后人工泪液润滑。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('视力下降') || a.includes('异物可能嵌在眼上') || a.includes('明显眼痛'), level: 'doctor',
        tip: '异物嵌在眼球上、明显眼痛或视力下降，别自己抠，马上去眼科。' },
    ],
  },

  /* ---------------- 耳鼻喉 ---------------- */
  sore_throat: {
    region: 'ent', name: '咽喉痛', icon: '👄',
    questions: [
      { id: 'during', label: '痛了多久？', type: 'choice', options: ['1~2 天', '3~7 天', '超过一周'] },
      { id: 'swallow', label: '吞咽时？', type: 'choice', options: ['痛但不影响喝水', '喝水都明显痛', '几乎咽不下'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['发烧', '咳嗽', '扁桃体肿大/脓点', '声音嘶哑'] },
    ],
    meds: ['paracetamol'],
    care: '用温盐水（一杯温水+半勺盐）漱口，每天几次；多喝温水、吃点润喉的；一般 3~7 天会好。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('扁桃体肿大/脓点') && a.includes('发烧'), level: 'doctor',
        tip: '明显化脓 + 发烧，可能是细菌性咽扁桃体炎，需要医生判断是否用抗生素，别自己扛。' },
      { key: 'during', test: a => a === '超过一周', level: 'doctor',
        tip: '嗓子痛超过一周或反复发作，建议就诊。' },
      { key: 'swallow', test: a => a === '几乎咽不下', level: 'doctor',
        tip: '痛得咽不下、甚至呼吸/张口困难，尽快就医。' },
    ],
  },

  runny_nose: {
    region: 'ent', name: '流鼻涕/鼻塞', icon: '🤧',
    questions: [
      { id: 'kind', label: '鼻涕是？', type: 'choice', options: ['清稀的（水一样的）', '粘稠/黄绿色', '不确定'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['打喷嚏/眼睛痒（像过敏）', '发烧', '头痛/面部胀痛', '咳嗽'] },
    ],
    meds: ['loratadine', 'cetirizine'],
    care: '洗热水澡、用生理盐水/海盐水喷鼻，多喝水；如果明显是过敏（喷嚏+眼痒+清涕）再考虑抗过敏药。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('发烧') && a.includes('面部胀痛'), level: 'doctor',
        tip: '鼻塞 + 发烧 + 面部胀痛，可能是鼻窦炎，建议就诊。' },
      { key: 'kind', test: a => a.includes('粘稠/黄绿色') && a.includes('超过一周'), level: 'doctor',
        tip: '黄绿鼻涕 + 头痛 + 持续时间长，建议就诊排查感染。' },
    ],
  },

  cough_dry: {
    region: 'ent', name: '干咳（无痰）', icon: '😮‍💨',
    questions: [
      { id: 'during', label: '咳了多久？', type: 'choice', options: ['1~2 天', '3~7 天', '超过两周'] },
      { id: 'night', label: '晚上咳得更厉害吗？', type: 'choice', options: ['是', '不是', '差不多'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['发烧', '胸口痛', '喘/气短', '痰很多'] },
    ],
    meds: ['dextromethorphan'],
    care: '多喝温水、蜂蜜水（1 岁以上可用），用加湿器；避免烟尘。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('喘/气短') || a.includes('胸口痛') || a.includes('发烧'), level: 'doctor',
        tip: '咳嗽伴气喘、胸痛或发烧，可能不是普通感冒，请尽快就医。' },
      { key: 'during', test: a => a === '超过两周', level: 'doctor',
        tip: '咳嗽超过 2 周不缓解，建议就诊明确原因。' },
    ],
  },

  cough_wet: {
    region: 'ent', name: '咳嗽（有痰）', icon: '🫁',
    questions: [
      { id: 'color', label: '痰是什么颜色？', type: 'choice', options: ['白色/透明', '黄绿色', '带血丝'] },
      { id: 'during', label: '咳了多久？', type: 'choice', options: ['1~2 天', '3~7 天', '超过两周'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['发烧', '胸口痛', '喘/气短', '呼吸困难'] },
    ],
    meds: ['ambroxol'],
    care: '多喝水，把痰咳出来更重要；用加湿器；必要时拍背帮助排痰。',
    redFlags: [
      { key: 'color', test: a => a.includes('带血丝'), level: 'doctor',
        tip: '痰里带血丝，务必尽快就医检查。' },
      { key: 'assoc', test: a => a.includes('呼吸困难') || a.includes('喘/气短') || a.includes('胸口痛') || a.includes('发烧'), level: 'doctor',
        tip: '有痰咳嗽伴发烧、胸痛、喘/气短，尽快就医。' },
    ],
  },

  ear_pain: {
    region: 'ent', name: '耳朵痛', icon: '👂',
    questions: [
      { id: 'during', label: '痛了多久？', type: 'choice', options: ['几小时', '1~2 天', '超过 3 天'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['发烧', '耳朵流液/流脓', '听力下降', '耳朵堵塞感'] },
    ],
    meds: ['paracetamol'],
    care: '先止痛，别往耳朵里乱滴东西或掏；用温毛巾外敷。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('耳朵流液/流脓') || a.includes('听力下降') || a.includes('发烧'), level: 'doctor',
        tip: '耳痛伴流脓、听力下降或发烧，可能是中耳炎，尽快看耳鼻喉。' },
      { key: 'during', test: a => a === '超过 3 天', level: 'doctor',
        tip: '耳痛持续超过 3 天，建议就诊。' },
    ],
  },

  sneeze_rhinitis: {
    region: 'ent', name: '打喷嚏/鼻子过敏', icon: '🤧',
    questions: [
      { id: 'trigger', label: '多在什么情况下发作？', type: 'choice', options: ['接触花粉/灰尘/猫狗', '换季时', '常年都有'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['流清鼻涕', '鼻塞', '眼睛痒/流泪', '咳嗽'] },
    ],
    meds: ['loratadine', 'cetirizine'],
    care: '尽量避开过敏原；用生理盐水/海盐水洗鼻；戴口罩减少接触。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('眼睛痒/流泪') && a.includes('流清鼻涕'), level: 'doctor',
        tip: '症状反复影响生活，可到耳鼻喉/变态反应科规范治疗。' },
    ],
  },

  epistaxis: {
    region: 'ent', name: '鼻出血', icon: '🩸',
    questions: [
      { id: 'during', label: '流血多久？', type: 'choice', options: ['很快止住（几分钟）', '断断续续', '一直止不住'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['鼻子干燥', '经常出血', '头晕/出冷汗', '正在吃防血栓的药'] },
    ],
    meds: [],
    care: '头稍前倾，用拇指食指捏住鼻翼 5~10 分钟，冷敷鼻梁；别仰头（血会咽下去）。',
    redFlags: [
      { key: 'during', test: a => a === '一直止不住', level: 'urgent',
        tip: '按压 15 分钟仍不止、出血量大或伴头晕/出冷汗，立即去急诊。' },
      { key: 'assoc', test: a => a.includes('经常出血') || a.includes('正在吃防血栓的药'), level: 'doctor',
        tip: '反复鼻出血或正在吃防血栓的药，建议就医。' },
    ],
  },

  tinnitus: {
    region: 'ent', name: '耳鸣', icon: '🔔',
    questions: [
      { id: 'kind', label: '什么样的声音？', type: 'choice', options: ['嗡嗡声', '尖细的鸣叫', '搏动感（和心跳一致）'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['听力下降', '突然听力下降/耳闷', '头晕', '单侧耳朵'] },
    ],
    meds: [],
    care: '避免长时间大噪音、少戴耳机；注意休息。持续的恼人耳鸣，可到耳鼻喉科规范处理（认知行为疗法等有帮助，别自行吃银杏、褪黑素、锌之类——指南不推荐）。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('突然听力下降/耳闷'), level: 'urgent',
        tip: '突然听力下降/耳闷伴耳鸣，可能是突发性耳聋，是耳鼻喉急症，尽快就诊（越早治越好，别拖）。' },
      { key: 'assoc', test: a => a.includes('单侧耳朵') && a.includes('听力下降'), level: 'doctor',
        tip: '单侧耳鸣伴听力下降，尽快看耳鼻喉（排查听神经瘤等严重疾病）。' },
      { key: 'kind', test: a => a.includes('搏动感'), level: 'doctor',
        tip: '和心跳一致的搏动性耳鸣，建议就医排查血管问题。' },
    ],
  },

  hoarseness: {
    region: 'ent', name: '声音嘶哑', icon: '🗣️',
    questions: [
      { id: 'during', label: '哑了多久？', type: 'choice', options: ['1~2 天', '几天~两周', '超过两周'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['咽喉痛', '咳嗽', '长期吸烟', '用嗓多'] },
    ],
    meds: [],
    care: '少说话、别喊叫，多喝温水，避免烟酒和辛辣。',
    redFlags: [
      { key: 'during', test: a => a === '超过两周', level: 'doctor',
        tip: '声音嘶哑超过 2 周不缓解，建议做喉镜排查声带问题。' },
      { key: 'assoc', test: a => a.includes('长期吸烟'), level: 'doctor',
        tip: '长期吸烟者声音嘶哑，务必就医排查。' },
    ],
  },

  /* ---------------- 牙齿 ---------------- */
  toothache: {
    region: 'teeth', name: '牙痛', icon: '🦷',
    questions: [
      { id: 'kind', label: '痛的感觉？', type: 'choice', options: ['一阵阵跳痛', '冷热刺激痛', '持续胀痛/咬合痛'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['牙龈肿', '脸肿', '发烧', '嘴巴张不开'] },
    ],
    meds: ['paracetamol', 'ibuprofen'],
    care: '用淡盐水漱口，避免过冷过热和甜的东西；牙痛多半要尽快看牙医，止痛药只是暂时的。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('脸肿') || a.includes('嘴巴张不开') || a.includes('发烧'), level: 'doctor',
        tip: '牙痛伴脸肿、发烧、嘴张不开，可能是严重感染，尽快就医。' },
    ],
  },

  teeth_sensitive: {
    region: 'teeth', name: '牙酸/敏感', icon: '🧊',
    questions: [
      { id: 'kind', label: '什么时候酸？', type: 'choice', options: ['吃冷/热/甜的东西时', '刷牙时', '一直发酸'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['牙龈萎缩', '有蛀牙/缺损', '一阵阵痛'] },
    ],
    meds: [],
    care: '用抗敏感牙膏，刷牙轻一点，少吃酸性/过冷过热的东西；必要时看牙医（可能是牙釉质磨损或蛀牙）。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('有蛀牙/缺损') || a.includes('一阵阵痛'), level: 'doctor',
        tip: '牙齿明显酸痛、有蛀牙/缺损，尽早就医。' },
    ],
  },

  gum_bleed: {
    region: 'teeth', name: '牙龈出血/肿', icon: '🩸',
    questions: [
      { id: 'kind', label: '什么时候出血？', type: 'choice', options: ['刷牙时', '咬硬东西时', '轻轻一碰就流血'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['牙龈红肿', '口臭', '牙齿松动', '容易淤青/流血不止'] },
    ],
    meds: [],
    care: '用软毛牙刷正确刷牙、用牙线，注意牙周；大多是牙周炎，越早看越好。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('牙齿松动') || a.includes('容易淤青/流血不止'), level: 'doctor',
        tip: '牙龈出血伴牙齿松动、或很容易流血不止，尽快就医（排查牙周或血液问题）。' },
    ],
  },

  wisdom_tooth: {
    region: 'teeth', name: '智齿发炎/肿痛', icon: '😖',
    questions: [
      { id: 'during', label: '痛了多久？', type: 'choice', options: ['1~2 天', '3~7 天', '反复发作'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['牙龈肿', '脸肿', '发烧', '嘴巴张不开'] },
    ],
    meds: ['paracetamol', 'ibuprofen'],
    care: '用温盐水漱口、保持口腔清洁，先止痛；常需要看牙医，反复发炎的一般建议拔掉。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('脸肿') || a.includes('嘴巴张不开') || a.includes('发烧'), level: 'doctor',
        tip: '智齿发炎伴脸肿、发烧、嘴张不开，尽快就医，别拖。' },
    ],
  },

  /* ---------------- 口腔 ---------------- */
  mouth_ulcer: {
    region: 'mouth', name: '口腔溃疡', icon: '🤕',
    questions: [
      { id: 'num', label: '有几个？', type: 'choice', options: ['1~2 个', '3 个以上', '反复发作'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['发烧', '很疼影响吃饭', '口腔溃疡很大'] },
    ],
    meds: [],
    care: '保持口腔清洁，少吃辛辣刺激，多吃新鲜蔬果，一般 1~2 周自愈；可用无酒精漱口水或局部口腔溃疡贴。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('发烧') || a.includes('口腔溃疡很大') || a.includes('反复发作'), level: 'doctor',
        tip: '溃疡大、反复或伴发烧，建议就医。（注：溃疡处可使用市售“口腔溃疡贴/凝胶”，此处不推荐内服止痛药。）' },
    ],
  },

  mouth_dry: {
    region: 'mouth', name: '口干', icon: '👅',
    questions: [
      { id: 'when', label: '什么时候干？', type: 'choice', options: ['早起时', '整天都干', '说话/吃饭时干'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['喝水多', '尿多', '眼干', '体重下降'] },
    ],
    meds: [],
    care: '少量多次喝水，嚼无糖口香糖或含润喉糖刺激唾液；避免咖啡、烟酒。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('尿多') || a.includes('体重下降') || a.includes('眼干'), level: 'doctor',
        tip: '口干伴多饮多尿、体重下降或眼干，建议就医排查血糖/免疫等问题。' },
    ],
  },

  mouth_halitosis: {
    region: 'mouth', name: '口臭', icon: '😷',
    questions: [
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['牙龈出血/肿', '牙垢多', '舌苔厚', '反酸/胃不舒服'] },
    ],
    meds: [],
    care: '认真刷牙、用牙线、刷舌苔；多喝水；有牙周病要去看牙医。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('反酸/胃不舒服'), level: 'doctor',
        tip: '口臭伴反酸胃不适，建议看看消化科。' },
    ],
  },

  mouth_angular: {
    region: 'mouth', name: '口角炎/嘴角裂', icon: '💋',
    questions: [
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['嘴角干裂出血', '嘴角红肿', '反复发作'] },
    ],
    meds: ['vaseline'],
    care: '嘴角涂凡士林保湿，别舔嘴角；补充新鲜蔬果（B 族维生素）。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('反复发作') || a.includes('嘴角红肿'), level: 'doctor',
        tip: '反复发作、红肿明显或有脓，建议就医（可能是真菌/细菌感染或营养缺乏）。' },
    ],
  },

  /* ---------------- 颈部 ---------------- */
  neck_pain: {
    region: 'neck', name: '颈肩痛/落枕', icon: '🧣',
    questions: [
      { id: 'during', label: '痛了多久？', type: 'choice', options: ['1~2 天', '3~7 天', '超过一周'] },
      { id: 'kind', label: '怎么痛？', type: 'choice', options: ['酸痛紧绷', '突然卡住/转动受限', '刺痛'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['手臂/手麻', '头痛', '头晕', '发烧'] },
    ],
    meds: ['paracetamol', 'ibuprofen', 'diclofenac_gel'],
    care: '注意坐姿、少低头，热敷或轻柔拉伸；睡觉用低枕。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('手臂/手麻'), level: 'doctor',
        tip: '颈痛伴手臂或手麻，可能是颈椎/神经问题，建议就诊。' },
      { key: 'assoc', test: a => a.includes('发烧') && a.includes('颈子僵硬'), level: 'doctor',
        tip: '颈痛伴发烧、脖子僵硬，尽快就医。' },
    ],
  },

  neck_lump: {
    region: 'neck', name: '颈部肿块/淋巴结肿大', icon: '🫘',
    questions: [
      { id: 'kind', label: '肿块什么样？', type: 'choice', options: ['软、能滑动', '硬、推不动', '说不清'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['咽喉痛', '发烧', '越来越大', '体重下降'] },
    ],
    meds: [],
    care: '先别反复按压；多数是咽炎、牙病等引起的反应性肿大，会自己消。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('越来越大') || a.includes('体重下降') || a.includes('硬'), level: 'doctor',
        tip: '肿块硬、推不动、越来越大或伴体重下降，尽快就医排查。' },
    ],
  },

  /* ---------------- 胸部 ---------------- */
  chest_pain: {
    region: 'chest', name: '胸口痛/闷', icon: '🫀',
    questions: [
      { id: 'kind', label: '痛的感觉（可多选）？', type: 'multi', options: ['压榨感/被压住', '撕裂样剧痛', '刺痛', '烧灼感', '隐隐作痛'] },
      { id: 'radiate', label: '会不会放射到别处？', type: 'choice', options: ['不放射', '放射到左臂/肩', '放射到下巴/脖子', '放射到后背'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['出冷汗', '喘/气短', '恶心', '心慌', '头晕', '面色苍白/四肢发冷', '神志模糊/意识不清'] },
    ],
    meds: [],
    care: '胸痛原因可轻可重，先停下活动，静坐休息。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('神志模糊/意识不清') || a.includes('面色苍白/四肢发冷') || a.includes('出冷汗') || a.includes('喘/气短'), level: 'urgent',
        tip: '胸痛伴神志模糊、面色苍白、大汗、四肢发冷、气短/呼吸困难，属高危胸痛，立即拨 120 / 去急诊。' },
      { key: 'kind', test: a => a.includes('撕裂样剧痛'), level: 'urgent',
        tip: '突然的撕裂样剧烈胸背痛（可向颈部/腹部放射）要警惕主动脉夹层，病死率很高，立即急诊。' },
      { key: 'radiate', test: a => a.includes('左臂') || a.includes('下巴') || a.includes('后背'), level: 'urgent',
        tip: '胸痛放射到左臂、下巴或后背，极可能是心梗前兆，立刻拨 120 或去急诊。' },
      { key: 'kind', test: a => a.includes('压榨感'), level: 'urgent',
        tip: '压榨样胸痛是高危信号，立即就医，不要自行处理。' },
    ],
  },

  palpitation: {
    region: 'chest', name: '心慌/心跳快', icon: '💓',
    questions: [
      { id: 'during', label: '持续多久？', type: 'choice', options: ['几秒~几分钟', '十几分钟', '持续很久'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['胸痛', '头晕', '气短', '出冷汗', '平时压力大/熬夜'] },
    ],
    meds: [],
    care: '先坐下或半躺，深呼吸，避免咖啡浓茶和熬夜；紧张情绪也会引起心慌。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('胸痛') || a.includes('头晕') || a.includes('气短') || a.includes('出冷汗'), level: 'urgent',
        tip: '心慌伴胸痛/头晕/气短/出冷汗，请立即就医或拨 120。' },
      { key: 'during', test: a => a === '持续很久', level: 'doctor',
        tip: '心跳快持续不缓解，建议就诊做心电图。' },
    ],
  },

  /* ---------------- 腹部/消化 ---------------- */
  abdomen_pain: {
    region: 'abdomen', name: '腹痛', icon: '🤢',
    questions: [
      { id: 'location', label: '主要在肚子哪里？', type: 'choice', options: ['上腹（心口）', '肚脐周围', '右下腹', '左下腹', '下腹正中/小腹', '整个肚子'] },
      { id: 'kind', label: '痛的感觉（可多选）？', type: 'multi', options: ['持续隐痛', '一阵阵绞痛', '刺痛/胀痛', '一按就痛'] },
      { id: 'relief', label: '什么情况会好/加重？（可多选）', type: 'multi', options: ['进食后加重', '排便排气后缓解', '吃得太油腻时', '和月经周期有关'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['恶心/呕吐', '腹泻', '发烧', '排便排气停止', '血便/黑便', '头晕/乏力', '异常阴道出血'] },
    ],
    meds: [],
    care: '腹痛原因很多，先别急着吃止痛药（会掩盖病情）。记录清楚哪里痛、怎么痛、有没有发热/呕吐/腹泻；清淡饮食，持续不缓解或加重请就医。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('血便/黑便'), level: 'urgent',
        tip: '腹痛 + 血便/黑便，提示消化道出血，立即就医。' },
      { key: 'assoc', test: a => a.includes('排便排气停止') && a.includes('一阵阵绞痛'), level: 'urgent',
        tip: '腹痛 + 停止排气排便 + 阵发绞痛，警惕肠子堵了，立即就医。' },
      { key: 'kind', test: a => a.includes('一按就痛') && a.includes('发烧'), level: 'urgent',
        tip: '肚子按着痛 + 发烧，警惕急腹症（如阑尾炎、腹膜炎），尽快急诊。' },
      { key: 'assoc', test: a => a.includes('异常阴道出血') && a.includes('下腹正中'), level: 'urgent',
        tip: '（女性）下腹痛 + 异常出血，需排除宫外孕等妇产科急症，立即就医。' },
      { key: 'assoc', test: a => a.includes('头晕/乏力'), level: 'doctor',
        tip: '腹痛伴头晕、乏力，可能出血/脱水，建议尽快就医。' },
    ],
  },

  nausea_vomit: {
    region: 'abdomen', name: '恶心/呕吐', icon: '🤮',
    questions: [
      { id: 'during', label: '吐了多久？', type: 'choice', options: ['几次而已', '半天~1 天', '超过 1 天'] },
      { id: 'content', label: '吐出的东西？', type: 'choice', options: ['食物/胃液', '咖啡色/像血', '胆汁（黄绿色苦的）'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['腹泻', '发烧', '腹痛', '头晕', '怀孕可能'] },
    ],
    meds: ['ors', 'vitamin_b6'],
    care: '少量多次喝温水和口服补液盐，别一次喝太多；吃清淡易消化的东西。',
    redFlags: [
      { key: 'content', test: a => a.includes('咖啡色/像血'), level: 'urgent',
        tip: '吐咖啡色/带血的东西，可能是上消化道出血，立即就医。' },
      { key: 'during', test: a => a === '超过 1 天', level: 'doctor',
        tip: '呕吐超过 1 天、或完全不能进水、尿少、头晕，尽快就医防脱水。' },
      { key: 'assoc', test: a => a.includes('腹痛') && a.includes('发烧'), level: 'doctor',
        tip: '呕吐伴腹痛、发烧，尽快就诊。' },
    ],
  },

  diarrhea: {
    region: 'abdomen', name: '腹泻/拉肚子', icon: '💩',
    questions: [
      { id: 'during', label: '拉了多久？', type: 'choice', options: ['1~2 次', '半天~1 天', '超过 2 天'] },
      { id: 'kind', label: '大便样子？', type: 'choice', options: ['水样/稀糊', '带血/像果酱', '带脓/黏液'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['发烧', '腹痛/绞痛', '恶心呕吐', '明显脱水（尿少、口干）'] },
    ],
    meds: ['ors', 'montmorillonite', 'probiotics'],
    care: '关键不是“马上止泻”，而是补水补盐；吃白粥、面条、香蕉等清淡食物，避免油腻辛辣。',
    redFlags: [
      { key: 'kind', test: a => a.includes('带血/像果酱'), level: 'urgent',
        tip: '腹泻带血/果酱样，可能是感染性肠炎，别乱用止泻药，尽快就医。' },
      { key: 'assoc', test: a => a.includes('明显脱水（尿少、口干）'), level: 'urgent',
        tip: '明显脱水（尿少、口干、没精神）或高烧，尽快就医补液。' },
      { key: 'during', test: a => a === '超过 2 天', level: 'doctor',
        tip: '腹泻持续超过 2 天不缓解，建议就医。' },
    ],
  },

  constipation: {
    region: 'abdomen', name: '便秘', icon: '🚽',
    questions: [
      { id: 'during', label: '多久没解了？', type: 'choice', options: ['1~2 天', '3~5 天', '超过一周'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['腹胀', '腹痛', '便血', '经常靠泻药'] },
    ],
    meds: ['lactulose', 'macrogol'],
    care: '多吃膳食纤维（蔬菜、粗粮）、多喝水、适当活动、养成定时排便习惯；别长期靠刺激性泻药。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('便血'), level: 'doctor',
        tip: '便秘伴便血，建议尽快就诊检查。' },
      { key: 'during', test: a => a === '超过一周', level: 'doctor',
        tip: '超过 1 周没排便并伴明显腹胀/腹痛，尽快就医。' },
    ],
  },

  heartburn: {
    region: 'abdomen', name: '烧心/反酸', icon: '🔥',
    questions: [
      { id: 'when', label: '多在什么时候？', type: 'choice', options: ['饭后', '躺下/弯腰时', '饿的时候', '一直都有'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['胸口烧灼感', '反酸/打嗝', '咳嗽/声音嘶哑', '吞咽困难', '体重下降'] },
    ],
    meds: ['hydrotalcite', 'omeprazole'],
    care: '饭后别马上躺下，睡觉垫高上半身，少吃过饱、油腻、辛辣和咖啡；戒酒。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('吞咽困难') || a.includes('体重下降'), level: 'doctor',
        tip: '反酸伴吞咽困难或体重下降，需尽早就医排查。' },
      { key: 'when', test: a => a === '一直都有', level: 'doctor',
        tip: '持续明显的烧心反酸，建议就诊规范治疗。' },
    ],
  },

  bloating: {
    region: 'abdomen', name: '腹胀/胀气', icon: '🎈',
    questions: [
      { id: 'when', label: '多在什么时候？', type: 'choice', options: ['饭后', '吃豆类/高纤维后', '一直胀'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['打嗝/放屁多', '便秘', '腹痛', '停止排气排便'] },
    ],
    meds: ['hydrotalcite'],
    care: '细嚼慢咽、少喝碳酸饮料、少吃易产气食物（豆类、洋葱等）；饭后散散步。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('停止排气排便') && a.includes('腹痛'), level: 'urgent',
        tip: '腹胀 + 腹痛 + 停止排气排便，警惕肠子堵了，立即就医。' },
      { key: 'assoc', test: a => a.includes('便秘'), level: 'doctor',
        tip: '长期腹胀伴便秘，建议就医排查原因。' },
    ],
  },

  belching: {
    region: 'abdomen', name: '打嗝/嗳气', icon: '💨',
    questions: [
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['反酸/烧心', '胃胀', '饭后明显', '吞咽困难'] },
    ],
    meds: ['hydrotalcite'],
    care: '细嚼慢咽、别吃太撑、少喝碳酸饮料；吃饭别边说边吃。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('吞咽困难') || a.includes('反酸/烧心'), level: 'doctor',
        tip: '打嗝伴吞咽困难或持续反酸烧心，建议就诊。' },
    ],
  },

  /* ---------------- 腰背部 ---------------- */
  back_pain: {
    region: 'back', name: '腰背痛', icon: '🤕',
    questions: [
      { id: 'during', label: '痛了多久？', type: 'choice', options: ['1~2 天', '3~7 天', '超过一个月'] },
      { id: 'down', label: '会不会酸麻到腿上？', type: 'choice', options: ['不会', '会（往下串）'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['发烧', '夜间痛醒', '大小便异常/控制不住', '受伤后痛'] },
    ],
    meds: ['paracetamol', 'ibuprofen', 'diclofenac_gel'],
    care: '先休息、热敷，注意避免久坐和搬重东西；多数腰背痛几天~几周会缓解。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('大小便异常/控制不住'), level: 'urgent',
        tip: '腰背痛伴大小便控制不住、或会阴部麻木，警惕马尾综合征，立即急诊。' },
      { key: 'assoc', test: a => a.includes('受伤后痛') || a.includes('发烧'), level: 'doctor',
        tip: '外伤后腰痛或伴发烧，建议尽快就诊。' },
      { key: 'during', test: a => a === '超过一个月', level: 'doctor',
        tip: '腰痛持续超过 1 个月，建议就诊排查。' },
    ],
  },

  back_strain: {
    region: 'back', name: '后背僵硬/肌肉劳损', icon: '🧍',
    questions: [
      { id: 'cause', label: '和什么有关？', type: 'choice', options: ['久坐/久站', '搬重物/运动', '睡觉姿势', '说不清'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['僵硬感', '酸痛', '活动后减轻', '休息后仍痛'] },
    ],
    meds: ['paracetamol', 'ibuprofen', 'diclofenac_gel'],
    care: '热敷、轻柔拉伸，改掉久坐；外用双氯芬酸乳胶或吃止痛药缓解。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('休息后仍痛'), level: 'doctor',
        tip: '休息后仍持续疼痛、或夜间痛醒，建议就诊排查。' },
    ],
  },

  /* ---------------- 四肢/关节 ---------------- */
  muscle_pain: {
    region: 'limbs', name: '肌肉酸痛', icon: '💪',
    questions: [
      { id: 'cause', label: '可能与什么有关？', type: 'choice', options: ['运动后/劳累', '久坐久站', '突然用力/扭伤', '说不清'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['发烧', '局部红/肿/热', '明显肿胀', '活动受限'] },
    ],
    meds: ['paracetamol', 'ibuprofen', 'diclofenac_gel'],
    care: '先冷敷（48 小时内）再热敷，休息抬高；拉伸、按摩；运动要循序渐进。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('明显肿胀') || a.includes('局部红/肿/热') && a.includes('发烧'), level: 'doctor',
        tip: '肌肉酸痛伴明显肿、发红发热或发烧，可能是感染/炎症，建议就诊。' },
    ],
  },

  joint_pain: {
    region: 'limbs', name: '关节痛', icon: '🦴',
    questions: [
      { id: 'kind', label: '怎么痛？', type: 'choice', options: ['只在一侧关节', '多个关节', '不动也痛/晨僵'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['局部红/肿/热', '发烧', '晨起僵硬', '活动受限'] },
    ],
    meds: ['paracetamol', 'ibuprofen', 'diclofenac_gel'],
    care: '减少承重、冷敷/热敷、避免剧烈运动；如伴明显红肿发热尽早就诊。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('局部红/肿/热') && a.includes('发烧'), level: 'doctor',
        tip: '关节红、肿、热 + 发烧，警惕感染性关节炎，尽快就医。' },
      { key: 'assoc', test: a => a.includes('晨起僵硬') && a.includes('不动也痛/晨僵'), level: 'doctor',
        tip: '多个关节晨僵、疼痛，建议到风湿免疫科就诊。' },
    ],
  },

  sprain: {
    region: 'limbs', name: '扭伤/崴脚', icon: '🦶',
    questions: [
      { id: 'time', label: '受伤多久了？', type: 'choice', options: ['刚发生', '几小时~1 天', '超过 1 天'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['明显肿胀', '淤青', '完全不能着地/动不了', '畸形/骨擦感'] },
    ],
    meds: ['paracetamol', 'diclofenac_gel'],
    care: '急性期（48 小时内）冰敷、抬高、休息；之后可热敷。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('畸形/骨擦感') || a.includes('完全不能着地/动不了'), level: 'doctor',
        tip: '受伤后骨头明显变形、完全不能受力/活动，可能骨折，尽快就医拍片。' },
    ],
  },

  leg_swelling: {
    region: 'limbs', name: '腿部肿胀/疼痛', icon: '🦵',
    questions: [
      { id: 'side', label: '是哪条腿？', type: 'choice', options: ['单侧一条腿肿', '两条都肿'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['胀痛', '发热/发红', '胸闷气短', '有血栓/久坐史'] },
    ],
    meds: [],
    care: '如果是单侧腿突然肿痛，先别按摩/热敷，抬高观察。',
    redFlags: [
      { key: 'side', test: a => a.includes('单侧一条腿肿') && a.includes('胀痛'), level: 'urgent',
        tip: '单侧腿突然肿痛伴发热发红，警惕深静脉血栓；如伴胸闷气短，立即急诊（可能肺栓塞）。' },
    ],
  },

  hand_numb: {
    region: 'limbs', name: '手麻/手腕酸麻', icon: '✋',
    questions: [
      { id: 'when', label: '什么时候麻？', type: 'choice', options: ['睡觉/久压后', '用电脑/手机后', '一直麻'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['手指发麻', '手腕痛', '颈肩酸', '说话不清/半边身子麻'] },
    ],
    meds: [],
    care: '多活动手腕、减少重复动作，睡觉别压到手臂；必要时戴护腕。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('说话不清/半边身子麻'), level: 'urgent',
        tip: '手麻伴说话不清或半边身子麻，警惕脑卒中，立即急诊。' },
      { key: 'when', test: a => a === '一直麻', level: 'doctor',
        tip: '持续手麻或伴颈肩酸，建议就医排查颈椎/神经。' },
    ],
  },

  heel_pain: {
    region: 'limbs', name: '足跟痛/足底痛', icon: '🦶',
    questions: [
      { id: 'when', label: '什么时候痛？', type: 'choice', options: ['早上第一步最痛', '久站/走路后', '一直痛'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['脚跟有硬块', '肿胀', '晨起僵硬'] },
    ],
    meds: ['paracetamol', 'diclofenac_gel'],
    care: '换软底有支撑的鞋、减少久站，做足底拉伸，控制体重。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('肿胀'), level: 'doctor',
        tip: '足跟肿痛明显或外伤后疼痛，建议就诊。' },
    ],
  },

  /* ---------------- 皮肤 ---------------- */
  skin_itch: {
    region: 'skin', name: '皮肤瘙痒', icon: '🦟',
    questions: [
      { id: 'kind', label: '哪里痒？', type: 'choice', options: ['局部一小块', '全身大面积', '一抓就更痒/起疙瘩'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['皮疹/红疹', '水疱', '眼周/口周肿', '发烧', '压下去不褪'] },
    ],
    meds: ['loratadine', 'cetirizine', 'calamine', 'hydrocortisone_cream'],
    care: '别抓，用凉水湿敷、保湿；穿宽松棉质衣服，避免刺激物。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('压下去不褪') || a.includes('眼周/口周肿'), level: 'urgent',
        tip: '皮疹“压下去不褪色”或伴口唇/眼周肿胀，可能是严重过敏反应，立即急诊。' },
      { key: 'assoc', test: a => a.includes('发烧') && a.includes('水疱'), level: 'doctor',
        tip: '瘙痒伴发烧/水疱，尽快就诊。' },
    ],
  },

  rash: {
    region: 'skin', name: '皮疹/红疹', icon: '🔴',
    questions: [
      { id: 'kind', label: '疹子样子？', type: 'multi', options: ['凸起的红色丘疹', '一片片发红', '水疱', '脱皮/干裂'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['瘙痒', '发烧', '眼睛/口腔溃疡', '压下去不褪色'] },
    ],
    meds: ['calamine', 'hydrocortisone_cream', 'loratadine'],
    care: '别抓、别用热水烫，保湿；如果和发烧或口腔/眼部症状一起出现要当心。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('压下去不褪色') || a.includes('发烧') && a.includes('眼睛/口腔溃疡'), level: 'urgent',
        tip: '皮疹伴发热、或眼/口腔长溃疡、压之不褪色，可能是重症药疹/过敏，立即就医。' },
    ],
  },

  sunburn: {
    region: 'skin', name: '晒伤', icon: '☀️',
    questions: [
      { id: 'degree', label: '晒伤程度？', type: 'choice', options: ['发红、发热', '明显红肿痛', '起水疱/破皮'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['发烧', '头晕/恶心', '大面积起疱'] },
    ],
    meds: ['vaseline', 'calamine'],
    care: '先冷敷降温，喝足水，涂温和保湿；避免再暴晒。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('大面积起疱') || a.includes('发烧') || a.includes('头晕/恶心'), level: 'doctor',
        tip: '大面积起疱、发烧或头晕恶心，可能是重度晒伤/中暑，尽快就医。' },
    ],
  },

  insect_bite: {
    region: 'skin', name: '蚊虫叮咬/虫咬', icon: '🦟',
    questions: [
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['红肿瘙痒', '水疱', '抓破/流脓', '胸闷/喘/起大片风疙瘩'] },
    ],
    meds: ['calamine', 'loratadine'],
    care: '冷敷止痒，涂炉甘石；别抓，破了要注意防感染。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('胸闷/喘/起大片风疙瘩'), level: 'urgent',
        tip: '被咬后胸闷、喘不上气、起大片风疙瘩或脸肿，警惕严重过敏，立即急诊。' },
      { key: 'assoc', test: a => a.includes('抓破/流脓'), level: 'doctor',
        tip: '抓破后红肿流脓、发热，可能是继发感染，尽快就医。' },
    ],
  },

  dry_skin: {
    region: 'skin', name: '皮肤干燥脱屑', icon: '🧴',
    questions: [
      { id: 'when', label: '多在什么时候？', type: 'choice', options: ['秋冬/干燥时', '洗澡后', '一直干'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['瘙痒', '脱屑/起皮', '开裂'] },
    ],
    meds: ['vaseline'],
    care: '洗澡别用太热的水、少用香皂；洗完趁湿涂凡士林/润肤乳。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('开裂') && a.includes('瘙痒'), level: 'doctor',
        tip: '干燥伴明显红斑、渗液或长期不缓解，建议到皮肤科看看。' },
    ],
  },

  acne: {
    region: 'skin', name: '痤疮/青春痘', icon: '🫤',
    questions: [
      { id: 'kind', label: '痘痘什么样？', type: 'choice', options: ['粉刺/黑头', '红色丘疹/脓疱', '大结节/囊肿'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['反复发作', '油腻皮肤', '留痘印'] },
    ],
    meds: [],
    care: '用温和洗面奶清洁，别用手挤；少吃高糖高油，作息规律。轻度（以粉刺为主、少量小痘）可先在家护理；外用维A酸（阿达帕林）、过氧化苯甲酰、抗生素等治疗药多为处方药，需皮肤科开。',
    redFlags: [
      { key: 'kind', test: a => a.includes('大结节/囊肿'), level: 'doctor',
        tip: '重度痤疮（结节/囊肿、成片炎症）建议到皮肤科规范治疗，别自己乱挤乱抹，以免留疤。' },
      { key: 'assoc', test: a => a.includes('反复发作') || a.includes('留痘印'), level: 'doctor',
        tip: '反复发作、想防留疤，可到皮肤科制定方案。' },
    ],
  },

  chilblain: {
    region: 'skin', name: '冻疮', icon: '🧤',
    questions: [
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['红肿痒', '水疱', '破溃/流脓'] },
    ],
    meds: ['vaseline'],
    care: '保暖、避免骤冷骤热，涂凡士林保湿；别用热水直接烫。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('破溃/流脓'), level: 'doctor',
        tip: '冻疮破溃、流脓，需就医处理防感染。' },
    ],
  },

  /* ---------------- 全身/发热 ---------------- */
  fever: {
    region: 'whole', name: '发烧', icon: '🌡️',
    questions: [
      { id: 'degree', label: '体温大概多少？', type: 'choice', options: ['37.3~38 度（低烧）', '38.1~39 度', '超过 39 度'] },
      { id: 'during', label: '烧了多久？', type: 'choice', options: ['1 天之内', '1~3 天', '超过 3 天'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['寒战/发抖', '咳嗽/咽喉痛', '腹痛/腹泻', '皮疹', '呼吸困难', '精神很差、迷糊', '颈部僵硬'] },
    ],
    meds: ['paracetamol', 'ibuprofen'],
    care: '多喝水、多休息、物理降温（温水擦身）；测温并记录。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('精神很差、迷糊') || a.includes('呼吸困难') || a.includes('颈部僵硬'), level: 'urgent',
        tip: '发热伴精神差、神志模糊、呼吸困难或脖子僵硬，立即急诊。' },
      { key: 'during', test: a => a === '超过 3 天', level: 'doctor',
        tip: '发烧超过 3 天不退，建议就诊检查原因。' },
      { key: 'degree', test: a => a === '超过 39 度', level: 'doctor',
        tip: '高烧超过 39 度且物理/药物降温效果差，建议尽快就医。' },
    ],
  },

  fatigue: {
    region: 'whole', name: '乏力/总觉得累', icon: '😪',
    questions: [
      { id: 'during', label: '持续多久？', type: 'choice', options: ['几天', '几周', '几个月'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['睡眠差', '压力大/焦虑', '头晕', '体重下降', '发烧', '脸色苍白'] },
    ],
    meds: [],
    care: '规律作息、适度运动、保证睡眠；注意饮食均衡，别靠咖啡硬撑。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('体重下降') || a.includes('脸色苍白') || a.includes('发烧'), level: 'doctor',
        tip: '乏力伴体重下降、脸色苍白或发烧，尽快就诊。' },
      { key: 'during', test: a => a === '几个月', level: 'doctor',
        tip: '持续性乏力超过几周/几个月，建议就诊评估。' },
    ],
  },

  insomnia: {
    region: 'whole', name: '睡眠差/难入睡', icon: '😴',
    questions: [
      { id: 'kind', label: '主要是？', type: 'choice', options: ['难入睡', '半夜易醒', '早醒'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['压力大/焦虑', '睡前玩手机', '咖啡/浓茶喝得多', '打鼾/憋醒'] },
    ],
    meds: [],
    care: '睡前少看手机、别喝咖啡浓茶，规律作息；白天适度运动、晒晒太阳。失眠的一线治疗是“认知行为疗法（CBT-I，调整睡眠习惯和想法）”；安眠药多为处方药，别自己乱买乱吃。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('打鼾/憋醒'), level: 'doctor',
        tip: '打鼾伴憋醒、白天嗜睡，警惕睡眠呼吸暂停，建议就诊。' },
      { key: 'kind', test: a => a === '早醒', level: 'doctor',
        tip: '长期早醒伴情绪低落，建议看心理/精神科。' },
    ],
  },

  poor_appetite: {
    region: 'whole', name: '食欲不振', icon: '🍚',
    questions: [
      { id: 'during', label: '持续多久？', type: 'choice', options: ['一两天', '一周左右', '较长时间'] },
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['恶心', '体重下降', '乏力', '腹胀'] },
    ],
    meds: [],
    care: '少量多餐、吃清淡易消化的；别硬塞，先喝点汤水。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('体重下降') || a.includes('乏力'), level: 'doctor',
        tip: '食欲不振伴体重下降、乏力，建议就医排查。' },
    ],
  },

  night_sweat: {
    region: 'whole', name: '夜间盗汗', icon: '💧',
    questions: [
      { id: 'assoc', label: '伴随？（可多选）', type: 'multi', options: ['发烧/午后低热', '体重下降', '咳嗽', '乏力'] },
    ],
    meds: [],
    care: '保持卧室通风、被子别太厚；注意观察是否反复。',
    redFlags: [
      { key: 'assoc', test: a => a.includes('发烧/午后低热') || a.includes('体重下降') || a.includes('咳嗽'), level: 'doctor',
        tip: '盗汗伴低热、体重下降、咳嗽，建议就医排查（结核等）。' },
    ],
  },
};

/* 症状 → 所属部位 的便捷映射（供 UI 过滤） */
function symptomsOfRegion(regionId) {
  return Object.entries(SYMPTOMS).filter(([, s]) => s.region === regionId);
}

/* ------------------------------------------------------------
   五、女性 + 腹部/生殖系统 的特别提醒（宫外孕等急症筛查）
   仅在"用户选择女性"且选择了腹部/下腹相关症状时展示。
------------------------------------------------------------ */
const FEMALE_ABDOMEN_WARNINGS = [
  {
    name: '宫外孕', level: 'urgent',
    symptom: '肚子痛（尤其小肚子一边）、月经不来或推迟、下面出血（可带血块），还可有头晕、昏倒、肩膀痛；约 1/3 的人平时没有任何危险因素。',
    tip: '有性生活的女性，只要有单侧小腹痛、月经推迟或出血、头晕/肩痛，就要当心；若伴心跳快（>100 次/分）、血压低（<100/60 mmHg）、脸色发白、出冷汗，立即去急诊（破裂出血会要命）。',
  },
  {
    name: '怀孕期间腹痛的危险信号', level: 'urgent',
    symptom: '中-重度、持续钝痛或短暂撕裂样痛、无法忍受，休息后不缓解或伴其他症状。',
    tip: '可能是流产、胎盘提前剥离、子宫破裂、卵巢/输卵管扭转或破裂等；若疼痛往胸背扩散，要想到主动脉血管撕裂（很危险），立即去急诊。',
  },
  {
    name: '卵巢囊肿扭转 / 黄体破裂', level: 'urgent',
    symptom: '突然的、剧烈的一侧下腹痛，伴恶心呕吐。',
    tip: '突发剧烈单侧下腹痛，尽快去急诊。',
  },
  {
    name: '急性盆腔炎', level: 'doctor',
    symptom: '下腹坠痛 + 发热 + 下面分泌物异常，劳累或同房后加重。',
    tip: '尽快就诊；常需规范抗感染治疗，不要自己乱吃所谓消炎药。',
  },
  {
    name: '其它“下腹痛+出血”也要排查', level: 'doctor',
    symptom: '下腹痛伴下面不规律出血，或伴头晕、乏力、出冷汗。',
    tip: '请就医排查，不要拖延。',
  },
  {
    name: '痛经（来月经时肚子痛）', level: 'info',
    symptom: '每个月来月经时小腹坠痛，常在第一二天，可伴腰酸。',
    tip: '属常见；可休息、热敷、必要时用布洛芬。但若疼痛异常剧烈、一次比一次重、或非经期也痛，需就医。',
  },
];

/* 通用紧急提示（任何情况下都展示） */
const GENERAL_URGENT_TIPS = [
  '意识不清、昏倒、抽搐、剧烈头痛伴脖子僵硬。',
  '胸痛伴面色苍白、大汗及四肢发冷、血压低（<90/60 mmHg）、呼吸急促/困难、血氧<90%。',
  '体温过低（<35℃）或高热伴寒战；心率休息时>110 次/分或≤50 次/分；呼吸>24 次/分或<10 次/分。',
  '大出血、呕血/咯血、黑便。',
  '明显脱水：尿很少、口干、眼窝凹陷、没精神。',
  '任何“突然出现、让你非常难受”的症状，都别硬扛，尽快就医或打 120。',
];

/* ------------------------------------------------------------
   六、严重程度 & 就医建议（含医院等级，大白话）
   医院等级约定：
     三级甲等 = 大医院（专家多、设备全，能处理急症重症）
     其它医院 = 小医院（社区/二级/普通医院，看常见病足够）
------------------------------------------------------------ */
const SEVERITY_ADVICE = {
  urgent: {
    title: '情况可能比较严重',
    paint: '从你选的情况看，可能有较紧急的问题，别硬扛。',
    when: '现在 / 今天就过去，别等。',
    where: '直接去<b>三甲医院</b>的急诊，或打 120。社区医院一般处理不了这种急症，别耽误时间。',
  },
  doctor: {
    title: '需要去看看医生，但不用太慌',
    paint: '多半是需要“查一查”的程度，早点去排查比较稳妥。',
    when: '这几天（1~3 天内）去挂个号。',
    where: '先去附近的<b>社区医院</b>看就行；如果反复发作、越来越重，或医生建议转诊，再上<b>三甲医院</b>。',
  },
  self: {
    title: '可以先在家观察',
    paint: '多半是常见的小问题，在家护理 + 按需用药一般能自己缓过来。',
    when: '用药/护理 2~3 天不见好、症状加重、或冒出新的不舒服，再去医院。',
    where: '先到<b>社区医院</b>就行；社区医院看不了或没把握的，再上<b>三甲医院</b>。',
  },
};

/* 医院叫法说明 */
const HOSPITAL_LEVEL_NOTE = '医院叫法：<b>三甲医院</b>＝专家多、设备全的大医院；<b>社区医院</b>＝家附近的小医院、普通医院。';
