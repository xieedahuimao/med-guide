/* ============================================================
   医院参考库
   —— 用于“查看推荐的三甲医院”功能。
   说明：本数据为人工整理的知名三级甲等医院参考名单，
   “擅长科室”为该院相对优势的科室，仅供参考。
   实际就诊请以官方渠道/挂号平台信息为准。
   医院等级约定（大白话）：三甲＝大医院；其它＝小医院。
   ============================================================ */

/* 科室（与症状对应的关键科室） */
const DEPARTMENTS = {
  cardio:    { name: '心血管内科' },
  neuro:     { name: '神经内科' },
  resp:      { name: '呼吸内科' },
  ent:       { name: '耳鼻喉科' },
  ophthalm:  { name: '眼科' },
  dental:    { name: '口腔科' },
  ortho:     { name: '骨科' },
  gastro:    { name: '消化内科' },
  derm:      { name: '皮肤科' },
  vascular:  { name: '血管外科' },
  obgyn:     { name: '妇产科' },
  infect:    { name: '感染科/发热门诊' },
  general:   { name: '综合内科' },
  rheum:     { name: '风湿免疫科' },
  onc:       { name: '肿瘤科' },
  uro:       { name: '泌尿外科' },
  endo:      { name: '内分泌科' },
};

/* 每个症状对应的科室（用于匹配医院） */
const SYMPTOM_DEPT = {
  head_pain:['neuro'], head_dizziness:['neuro'],
  eye_dry:['ophthalm'], eye_red:['ophthalm'], eye_stye:['ophthalm'], eye_foreign:['ophthalm'],
  sore_throat:['ent','resp'], runny_nose:['ent'], cough_dry:['resp'], cough_wet:['resp'], ear_pain:['ent'],
  sneeze_rhinitis:['ent'], epistaxis:['ent'], tinnitus:['ent'], hoarseness:['ent'],
  toothache:['dental'], teeth_sensitive:['dental'], gum_bleed:['dental'], wisdom_tooth:['dental'],
  mouth_ulcer:['dental'], mouth_dry:['endo'], mouth_halitosis:['dental'], mouth_angular:['dental'],
  neck_pain:['ortho'], neck_lump:['general'],
  back_pain:['ortho'], back_strain:['ortho'],
  muscle_pain:['ortho'], joint_pain:['ortho'], sprain:['ortho'], leg_swelling:['vascular'], hand_numb:['ortho','neuro'], heel_pain:['ortho'],
  chest_pain:['cardio'], palpitation:['cardio'],
  abdomen_pain:['gastro','obgyn'], nausea_vomit:['gastro'], diarrhea:['gastro'], constipation:['gastro'], heartburn:['gastro'], bloating:['gastro'], belching:['gastro'],
  skin_itch:['derm'], rash:['derm'], sunburn:['derm'], insect_bite:['derm'], dry_skin:['derm'], acne:['derm'], chilblain:['derm'],
  fever:['infect'], fatigue:['general'], insomnia:['neuro'], poor_appetite:['gastro'], night_sweat:['infect','general'],
};

/* 女性 + 腹痛额外优先妇产科 */
const FEMALE_DEPT = 'obgyn';

/* ------------------------------------------------------------
   医院数据：省份 -> 医院列表
   dept: 科室 -> 'strong'(优势) | 'yes'(可看)
------------------------------------------------------------ */
const HOSPITALS = {
  '北京': [
    {name:'中国医学科学院北京协和医院', city:'北京', dept:{cardio:'strong',neuro:'strong',resp:'strong',gastro:'strong',derm:'strong',rheum:'strong',infect:'strong',general:'strong'}},
    {name:'首都医科大学附属北京天坛医院', city:'北京', dept:{neuro:'strong'}},
    {name:'中国医学科学院阜外医院', city:'北京', dept:{cardio:'strong'}},
    {name:'首都医科大学附属北京同仁医院', city:'北京', dept:{ent:'strong',ophthalm:'strong'}},
    {name:'北京大学口腔医院', city:'北京', dept:{dental:'strong'}},
    {name:'北京积水潭医院', city:'北京', dept:{ortho:'strong'}},
    {name:'中国人民解放军总医院(301)', city:'北京', dept:{cardio:'strong',neuro:'strong',resp:'strong',gastro:'strong',ortho:'strong',infect:'strong',general:'strong'}},
  ],
  '上海': [
    {name:'复旦大学附属华山医院', city:'上海', dept:{neuro:'strong',derm:'strong',infect:'strong'}},
    {name:'上海交通大学医学院附属瑞金医院', city:'上海', dept:{cardio:'strong',gastro:'strong',resp:'strong',endocrine:'strong',general:'strong'}},
    {name:'复旦大学附属中山医院', city:'上海', dept:{cardio:'strong',gastro:'strong',resp:'strong'}},
    {name:'上海交通大学医学院附属第九人民医院', city:'上海', dept:{dental:'strong',ortho:'strong'}},
    {name:'复旦大学附属眼耳鼻喉科医院', city:'上海', dept:{ophthalm:'strong',ent:'strong'}},
    {name:'上海市第六人民医院', city:'上海', dept:{ortho:'strong'}},
  ],
  '天津': [
    {name:'天津医科大学总医院', city:'天津', dept:{cardio:'strong',neuro:'strong',gastro:'strong',general:'strong'}},
    {name:'天津市肿瘤医院', city:'天津', dept:{onc:'strong'}},
    {name:'天津医科大学口腔医院', city:'天津', dept:{dental:'strong'}},
  ],
  '重庆': [
    {name:'重庆医科大学附属第一医院', city:'重庆', dept:{cardio:'strong',neuro:'strong',gastro:'strong',general:'strong'}},
    {name:'重庆医科大学附属儿童医院', city:'重庆', dept:{resp:'strong',infect:'strong'}},
    {name:'重庆市人民医院', city:'重庆', dept:{cardio:'yes',gastro:'yes',ortho:'yes'}},
  ],
  '河北': [
    {name:'河北医科大学第二医院', city:'石家庄', dept:{cardio:'strong',neuro:'strong',gastro:'strong'}},
    {name:'河北医科大学第三医院', city:'石家庄', dept:{ortho:'strong'}},
    {name:'河北省人民医院', city:'石家庄', dept:{cardio:'yes',resp:'yes',general:'yes'}},
  ],
  '山西': [
    {name:'山西医科大学第一医院', city:'太原', dept:{cardio:'strong',neuro:'strong',gastro:'strong',general:'strong'}},
    {name:'山西白求恩医院', city:'太原', dept:{ortho:'yes',gastro:'yes'}},
    {name:'山西省人民医院', city:'太原', dept:{cardio:'yes',resp:'yes'}},
  ],
  '内蒙古': [
    {name:'内蒙古医科大学附属医院', city:'呼和浩特', dept:{cardio:'yes',gastro:'yes',general:'yes'}},
    {name:'内蒙古自治区人民医院', city:'呼和浩特', dept:{cardio:'yes',neuro:'yes',general:'yes'}},
  ],
  '辽宁': [
    {name:'中国医科大学附属第一医院', city:'沈阳', dept:{cardio:'strong',neuro:'strong',gastro:'strong',resp:'strong',general:'strong'}},
    {name:'中国医科大学附属盛京医院', city:'沈阳', dept:{obgyn:'strong',gastro:'yes'}},
    {name:'大连医科大学附属第一医院', city:'大连', dept:{cardio:'yes',neuro:'yes'}},
  ],
  '吉林': [
    {name:'吉林大学第一医院', city:'长春', dept:{cardio:'strong',neuro:'strong',gastro:'strong',general:'strong'}},
    {name:'吉林大学第二医院', city:'长春', dept:{obgyn:'yes',dental:'yes'}},
  ],
  '黑龙江': [
    {name:'哈尔滨医科大学附属第一医院', city:'哈尔滨', dept:{cardio:'strong',neuro:'strong',gastro:'strong',general:'strong'}},
    {name:'哈尔滨医科大学附属第二医院', city:'哈尔滨', dept:{cardio:'yes',resp:'yes'}},
  ],
  '江苏': [
    {name:'江苏省人民医院(南京医科大学第一附属医院)', city:'南京', dept:{cardio:'strong',gastro:'strong',resp:'strong',general:'strong'}},
    {name:'南京鼓楼医院', city:'南京', dept:{cardio:'strong',gastro:'strong',ortho:'strong'}},
    {name:'东南大学附属中大医院', city:'南京', dept:{neuro:'yes',gastro:'yes'}},
    {name:'南京医科大学附属口腔医院', city:'南京', dept:{dental:'strong'}},
    {name:'苏州大学附属第一医院', city:'苏州', dept:{cardio:'yes',gastro:'yes'}},
  ],
  '浙江': [
    {name:'浙江大学医学院附属第一医院', city:'杭州', dept:{cardio:'strong',gastro:'strong',infect:'strong',general:'strong'}},
    {name:'浙江大学医学院附属第二医院', city:'杭州', dept:{cardio:'strong',neuro:'strong',ortho:'strong'}},
    {name:'浙江大学医学院附属邵逸夫医院', city:'杭州', dept:{cardio:'yes',gastro:'yes',resp:'yes'}},
    {name:'温州医科大学附属第一医院', city:'温州', dept:{cardio:'yes',gastro:'yes'}},
  ],
  '安徽': [
    {name:'安徽医科大学第一附属医院', city:'合肥', dept:{cardio:'strong',gastro:'strong',general:'strong'}},
    {name:'安徽省立医院(中国科学技术大学附属第一医院)', city:'合肥', dept:{cardio:'strong',neuro:'strong',gastro:'strong'}},
  ],
  '福建': [
    {name:'福建医科大学附属协和医院', city:'福州', dept:{cardio:'strong',gastro:'strong',general:'strong'}},
    {name:'福建医科大学附属第一医院', city:'福州', dept:{neuro:'strong',gastro:'yes'}},
    {name:'厦门大学附属第一医院', city:'厦门', dept:{cardio:'yes',gastro:'yes',ortho:'yes'}},
  ],
  '江西': [
    {name:'南昌大学第一附属医院', city:'南昌', dept:{cardio:'strong',gastro:'strong',general:'strong'}},
    {name:'南昌大学第二附属医院', city:'南昌', dept:{cardio:'yes',neuro:'yes'}},
  ],
  '山东': [
    {name:'山东大学齐鲁医院', city:'济南', dept:{cardio:'strong',neuro:'strong',gastro:'strong',general:'strong'}},
    {name:'山东省立医院', city:'济南', dept:{cardio:'strong',gastro:'strong',ortho:'strong'}},
    {name:'青岛大学附属医院', city:'青岛', dept:{cardio:'yes',gastro:'yes'}},
  ],
  '河南': [
    {name:'郑州大学第一附属医院', city:'郑州', dept:{cardio:'strong',gastro:'strong',neuro:'strong',general:'strong'}},
    {name:'河南省人民医院', city:'郑州', dept:{cardio:'strong',gastro:'strong',resp:'strong'}},
    {name:'河南省肿瘤医院', city:'郑州', dept:{onc:'strong'}},
  ],
  '湖北': [
    {name:'华中科技大学同济医学院附属同济医院', city:'武汉', dept:{cardio:'strong',gastro:'strong',resp:'strong',obgyn:'strong',general:'strong'}},
    {name:'华中科技大学同济医学院附属协和医院', city:'武汉', dept:{cardio:'strong',gastro:'strong',ortho:'strong',general:'strong'}},
    {name:'武汉大学人民医院(湖北省人民医院)', city:'武汉', dept:{cardio:'yes',neuro:'yes',gastro:'yes'}},
  ],
  '湖南': [
    {name:'中南大学湘雅医院', city:'长沙', dept:{cardio:'strong',neuro:'strong',gastro:'strong',general:'strong'}},
    {name:'中南大学湘雅二医院', city:'长沙', dept:{cardio:'strong',resp:'strong',gastro:'strong'}},
    {name:'中南大学湘雅三医院', city:'长沙', dept:{cardio:'yes',gastro:'yes',ortho:'yes'}},
  ],
  '广东': [
    {name:'中山大学附属第一医院', city:'广州', dept:{cardio:'strong',gastro:'strong',neuro:'strong',general:'strong'}},
    {name:'南方医科大学南方医院', city:'广州', dept:{gastro:'strong',cardio:'strong',general:'strong'}},
    {name:'广东省人民医院', city:'广州', dept:{cardio:'strong'}},
    {name:'中山大学孙逸仙纪念医院', city:'广州', dept:{obgyn:'strong',gastro:'yes'}},
    {name:'中山大学附属口腔医院', city:'广州', dept:{dental:'strong'}},
    {name:'深圳市人民医院', city:'深圳', dept:{cardio:'yes',gastro:'yes'}},
    {name:'中山大学附属肿瘤医院', city:'广州', dept:{onc:'strong'}},
  ],
  '广西': [
    {name:'广西医科大学第一附属医院', city:'南宁', dept:{cardio:'strong',gastro:'strong',general:'strong'}},
    {name:'广西壮族自治区人民医院', city:'南宁', dept:{cardio:'yes',neuro:'yes'}},
  ],
  '海南': [
    {name:'海南省人民医院', city:'海口', dept:{cardio:'yes',gastro:'yes',general:'yes'}},
    {name:'海南医学院第一附属医院', city:'海口', dept:{cardio:'yes',neuro:'yes'}},
  ],
  '四川': [
    {name:'四川大学华西医院', city:'成都', dept:{cardio:'strong',neuro:'strong',gastro:'strong',resp:'strong',derm:'strong',ortho:'strong',obgyn:'strong',general:'strong'}},
    {name:'四川省人民医院', city:'成都', dept:{cardio:'strong',gastro:'strong'}},
    {name:'成都中医药大学附属医院', city:'成都', dept:{general:'yes'}},
  ],
  '贵州': [
    {name:'贵州医科大学附属医院', city:'贵阳', dept:{cardio:'yes',gastro:'yes',general:'yes'}},
    {name:'贵州省人民医院', city:'贵阳', dept:{cardio:'yes',neuro:'yes'}},
  ],
  '云南': [
    {name:'昆明医科大学第一附属医院', city:'昆明', dept:{cardio:'strong',gastro:'strong',general:'strong'}},
    {name:'云南省第一人民医院', city:'昆明', dept:{cardio:'yes',neuro:'yes'}},
  ],
  '西藏': [
    {name:'西藏自治区人民医院', city:'拉萨', dept:{general:'yes',resp:'yes',cardio:'yes'}},
  ],
  '陕西': [
    {name:'西安交通大学第一附属医院', city:'西安', dept:{cardio:'strong',gastro:'strong',general:'strong'}},
    {name:'西安交通大学第二附属医院', city:'西安', dept:{cardio:'yes',neuro:'yes',ortho:'yes'}},
    {name:'西京医院(空军军医大学)', city:'西安', dept:{cardio:'strong',gastro:'strong',ortho:'strong',general:'strong'}},
  ],
  '甘肃': [
    {name:'兰州大学第一医院', city:'兰州', dept:{cardio:'yes',gastro:'yes',general:'yes'}},
    {name:'兰州大学第二医院', city:'兰州', dept:{neuro:'yes',ortho:'yes'}},
  ],
  '青海': [
    {name:'青海省人民医院', city:'西宁', dept:{cardio:'yes',gastro:'yes',general:'yes'}},
  ],
  '宁夏': [
    {name:'宁夏医科大学总医院', city:'银川', dept:{cardio:'yes',gastro:'yes',general:'yes'}},
  ],
  '新疆': [
    {name:'新疆医科大学第一附属医院', city:'乌鲁木齐', dept:{cardio:'yes',gastro:'yes',general:'yes'}},
    {name:'新疆维吾尔自治区人民医院', city:'乌鲁木齐', dept:{cardio:'yes',neuro:'yes'}},
  ],
  '香港': [
    {name:'香港大学深圳医院', city:'深圳(港大)', dept:{cardio:'yes',gastro:'yes',general:'yes',obgyn:'yes'}},
  ],
  '澳门': [
    {name:'澳门镜湖医院', city:'澳门', dept:{general:'yes',obgyn:'yes'}},
  ],
  '台湾': [
    {name:'台北荣民总医院', city:'台北', dept:{cardio:'yes',gastro:'yes',general:'yes'}},
  ],
};

/* 省份列表（用于下拉） */
const PROVINCES = Object.keys(HOSPITALS);

/* ------------------------------------------------------------
   推荐医院
   depts: 需要的科室集合（数组）
   返回按匹配度排序的医院列表
------------------------------------------------------------ */
function recommendHospitals(depts) {
  const need = new Set(depts);
  if (!need.size) return [];
  const score = h => {
    let s = 0;
    for (const d of need) {
      if (h.dept[d] === 'strong') s += 3;
      else if (h.dept[d] === 'yes') s += 1;
    }
    return s;
  };
  // 全局推荐（不分省）：按总分排序，取最匹配的前几家
  const all = [];
  for (const prov of PROVINCES) {
    for (const h of HOSPITALS[prov]) {
      const s = score(h);
      if (s > 0) all.push({ ...h, prov, score: s });
    }
  }
  all.sort((a, b) => b.score - a.score);
  const best = all.slice(0, 10); // 全国最匹配的前 10 家

  // 按省推荐：该省有匹配的列出
  const byProv = {};
  for (const prov of PROVINCES) {
    const list = HOSPITALS[prov].map(h => ({ ...h, prov, score: score(h) })).filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score);
    if (list.length) byProv[prov] = list;
  }
  return { best, byProv };
}

/* 统计某医院“擅长科室”的显示文案 */
function strongDeptsText(h) {
  const names = [];
  for (const k in h.dept) {
    if (h.dept[k] === 'strong' && DEPARTMENTS[k]) names.push(DEPARTMENTS[k].name);
  }
  return names.slice(0, 4).join('、') || '';
}
