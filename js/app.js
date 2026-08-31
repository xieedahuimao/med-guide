/* ============================================================
   UI 逻辑：移动端分步问答 → 生成建议
   ============================================================ */

const state = {
  gender: 'default',      // 'default' | 'female' | 'male'
  regionIds: [],          // 选中的部位（可多选）
  symptomIds: [],         // 选中的症状（可多选、可叠加）
  answers: {},            // symptomId -> { questionId -> value(s) }
};

/* ---------- 进度保存（刷新不丢） ---------- */
const STATE_KEY = 'med-guide-state-v1';
function persist() {
  try {
    const data = { gender: state.gender, regionIds: state.regionIds, symptomIds: state.symptomIds, answers: state.answers, view: viewName };
    localStorage.setItem(STATE_KEY, JSON.stringify(data));
  } catch (e) {}
}
function restoreState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return 'intro';
    const d = JSON.parse(raw);
    if (d.gender) state.gender = d.gender;
    if (Array.isArray(d.regionIds)) state.regionIds = d.regionIds;
    if (Array.isArray(d.symptomIds)) state.symptomIds = d.symptomIds;
    if (d.answers && typeof d.answers === 'object') state.answers = d.answers;
    return (d.view && ['intro','region','symptom','detail','result'].indexOf(d.view) >= 0) ? d.view : 'intro';
  } catch (e) { return 'intro'; }
}

const $ = id => document.getElementById(id);

/* ---------- 进度 ---------- */
function updateProgress() {
  const steps = [
    { key: 'region', label: '选部位' },
    { key: 'symptom', label: '选症状' },
    { key: 'detail', label: '补充细节' },
    { key: 'result', label: '看建议' },
  ];
  let active = 0;
  if (viewName === 'region') active = 0;
  if (viewName === 'symptom') active = 1;
  if (viewName === 'detail') active = 2;
  if (viewName === 'result') active = 3;
  const dots = steps.map((s, i) =>
    `<div class="pstep ${i === active ? 'on' : (i < active ? 'done' : '')}">${i < active ? '✓' : i + 1}</div>`).join('');
  $('progressBar').innerHTML =
    `<div class="ptrack"><div class="psteps">${dots}</div><div class="plabels">${steps.map(s=>`<span>${s.label}</span>`).join('')}</div></div>`;
}

/* ---------- 视图切换 ---------- */
let viewName = 'region';
function showView(name) {
  viewName = name;
  ['intro','region','symptom','detail','result'].forEach(v => {
    $(v).style.display = (v === name) ? 'block' : 'none';
  });
  // 顶部操作栏（选部位/症状/细节时显示进度）
  $('topbar').style.display = (name === 'intro') ? 'none' : 'block';
  $('progressBar').style.display = (name === 'intro') ? 'none' : 'block';
  // 底部主操作栏（仅 3 个中间步骤显示）
  $('bottomBar').style.display = (name === 'region' || name === 'symptom' || name === 'detail') ? 'block' : 'none';
  document.body.dataset.view = name;
  updateProgress();
  persist();
}

/* ---------- 0. 首页 ---------- */
function renderIntro() {
  const gender = state.gender;
  const opts = [
    { v:'female', l:'女性', d:'部分腹部情况会特别提醒' },
    { v:'male', l:'男性' },
    { v:'default', l:'不方便说', d:'按普通成人处理' },
  ];
  $('genderBox').innerHTML = opts.map(o => `
    <button class="chip ${gender===o.v?'sel':''}" data-g="${o.v}">
      ${o.l}<span class="chip-d">${o.d||''}</span>
    </button>`).join('');
  document.querySelectorAll('#genderBox .chip').forEach(btn => {
    btn.onclick = () => { state.gender = btn.dataset.g; renderIntro(); persist(); };
  });
}

/* ---------- 1. 选部位 ---------- */
function renderRegion() {
  $('regionGrid').innerHTML = REGIONS.map(r => `
    <button class="region-card ${state.regionIds.includes(r.id)?'sel':''}" data-id="${r.id}">
      <div class="r-icon">${r.icon}</div>
      <div class="r-name">${r.name}</div>
    </button>`).join('');
  document.querySelectorAll('#regionGrid .region-card').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      if (state.regionIds.includes(id)) {
        state.regionIds = state.regionIds.filter(x => x !== id);
        // 也移除该部位下已选症状，避免冲突
        const removed = state.symptomIds.filter(sid => SYMPTOMS[sid].region === id);
        state.symptomIds = state.symptomIds.filter(sid => SYMPTOMS[sid].region !== id);
        removed.forEach(sid => delete state.answers[sid]);
      } else {
        state.regionIds.push(id);
      }
      renderRegion();
      renderSymptoms();      // 部位变化后，立即刷新症状列表
      updateNextBtn();
      persist();
    };
  });
  updateNextBtn();
}

function updateNextBtn() {
  $('nextBtn').disabled = state.regionIds.length === 0;
  $('nextBtn').textContent = state.regionIds.length
    ? `下一步：选症状 (${state.regionIds.length} 个部位)` : '下一步：选症状';
}

/* ---------- 2. 选症状 ---------- */
function renderSymptoms() {
  const pool = [];
  state.regionIds.forEach(rid => {
    symptomsOfRegion(rid).forEach(([id, s]) => pool.push({ id, s }));
  });
  $('symptomBox').innerHTML = pool.length ? pool.map(({ id, s }) => `
    <button class="sym-chip ${state.symptomIds.includes(id)?'sel':''}" data-id="${id}">
      <span>${s.icon}</span><span>${s.name}</span>
    </button>`).join('') : '<p class="hint">请先在上一页选择疼痛/不适的部位。</p>';
  document.querySelectorAll('#symptomBox .sym-chip').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      if (state.symptomIds.includes(id)) state.symptomIds = state.symptomIds.filter(x => x !== id);
      else state.symptomIds.push(id);
      renderSymptoms(); updateSymBtn(); persist();
    };
  });
  updateSymBtn();
}

function updateSymBtn() {
  $('symNext').disabled = state.symptomIds.length === 0;
  $('symNext').textContent = state.symptomIds.length
    ? `下一步：补充细节 (${state.symptomIds.length} 个症状)` : '下一步：补充细节';
}

/* ---------- 3. 细节问答 ---------- */
const NONE_OPT = '无';
function renderDetail() {
  const syms = state.symptomIds.map(id => Object.assign({ id: id }, SYMPTOMS[id]));
  $('detailBox').innerHTML = syms.map(sym => {
    const ans = state.answers[sym.id] || {};
    const qHtml = sym.questions.map(q => {
      const cur = ans[q.id];
      const options = q.options.concat(NONE_OPT); // 每个问题末尾都加“无”
      let optsHtml;
      if (q.type === 'choice') {
        optsHtml = options.map(o => `
          <button class="opt ${cur===o?'sel':''}" data-q="${q.id}" data-o="${o}">${o}</button>`).join('');
      } else {
        const arr = Array.isArray(cur) ? cur : [];
        optsHtml = options.map(o => `
          <button class="opt multi ${arr.includes(o)?'sel':''}" data-q="${q.id}" data-o="${o}">${o}</button>`).join('');
      }
      return `<div class="qblock">
        <div class="qlabel">${q.label}</div>
        <div class="opts">${optsHtml}</div>
      </div>`;
    }).join('');
    return `<div class="sym-card">
      <div class="sym-title">${sym.icon} ${sym.name}</div>
      ${qHtml}
    </div>`;
  }).join('') || '<p class="hint">未选择症状。</p>';

  // 绑定事件（原位更新，避免整页重绘导致滚动跳动）
  document.querySelectorAll('#detailBox .opt').forEach(btn => {
    btn.onclick = () => {
      const q = btn.dataset.q, o = btn.dataset.o;
      const { symId, question } = currentQuestionContext(syms, q);
      if (!question) return;
      if (!state.answers[symId]) state.answers[symId] = {};
      const group = btn.closest('.opts');
      if (question.type === 'multi') {
        let arr = state.answers[symId][q] || [];
        if (o === NONE_OPT) {
          arr = [NONE_OPT];            // 选“无”时清空其它选项
        } else {
          arr = arr.filter(x => x !== NONE_OPT); // 选具体项时去掉“无”
          arr = arr.includes(o) ? arr.filter(x => x !== o) : arr.concat(o);
        }
        state.answers[symId][q] = arr;
        group.querySelectorAll('.opt').forEach(b => {
          b.classList.toggle('sel', arr.includes(b.dataset.o));
        });
      } else {
        // 单选：再次点击已选中项 → 取消选中
        if (state.answers[symId][q] === o) {
          delete state.answers[symId][q];
          group.querySelectorAll('.opt').forEach(b => b.classList.remove('sel'));
        } else {
          state.answers[symId][q] = o;
          group.querySelectorAll('.opt').forEach(b => b.classList.remove('sel'));
          btn.classList.add('sel');
        }
      }
      persist();
    };
  });
}

function currentQuestionContext(syms, qid) {
  for (const sym of syms) {
    const question = sym.questions.find(x => x.id === qid);
    if (question) return { symId: sym.id, question };
  }
  return { symId: null, question: null };
}

/* ---------- 4. 结果 ---------- */
function goResult() {
  const res = buildResult(state);
  renderResult(res);
  showView('result');
  window.scrollTo(0, 0);
}

function renderResult(res) {
  // 紧急提示区
  const urgent = res.redFlags.filter(f => f.level === 'urgent');
  const doctor = res.redFlags.filter(f => f.level === 'doctor');
  const femaleU = res.female.filter(f => f.level === 'urgent');
  const femaleD = res.female.filter(f => f.level === 'doctor');
  const femaleI = res.female.filter(f => f.level === 'info');

  let html = '';

  html += `<div class="disc">本内容仅作科普参考，<b>不能替代医生诊断</b>。用药前请确认药品说明并咨询医师/药师；出现紧急情况立即拨打 120。</div>`;

  if (urgent.length || doctor.length) {
    html += `<div class="warn-box ${urgent.length?'red':'amber'}">`;
    html += `<div class="warn-title">${urgent.length?'⚠️ 建议立即就医 / 急诊':'建议预约就医'}</div>`;
    [...urgent, ...doctor].forEach(f => {
      html += `<div class="warn-item"><b>${f.title}</b>：${f.text}</div>`;
    });
    html += `</div>`;
  }

  if (femaleU.length || femaleD.length || femaleI.length) {
    html += `<div class="warn-box female">`;
    html += `<div class="warn-title">👩 女性特别注意（与生殖系统相关）</div>`;
    const ordered = [...femaleU, ...femaleD, ...femaleI];
    ordered.forEach(f => {
      const tag = f.level==='urgent'?'⚠️' : f.level==='doctor'?'🏥' : 'ℹ️';
      html += `<div class="warn-item"><b>${tag} ${f.title}</b>：${f.text}</div>`;
    });
    html += `</div>`;
  }

  // 严重程度 & 就医建议（含医院等级）
  const allFlags = [...res.redFlags, ...res.female];
  const tier = severityTier(allFlags);
  const adv = SEVERITY_ADVICE[tier];
  html += `<div class="section"><div class="sec-title">📶 严不严重？什么时候去医院？</div>
    <div class="sev-box ${tier}">
      <div class="sev-title">${adv.title}</div>
      <div class="sev-paint">${adv.paint}</div>
      <div class="sev-row"><span class="sev-k">什么时候去：</span>${adv.when}</div>
      <div class="sev-row"><span class="sev-k">去哪家：</span>${adv.where}</div>
    </div>
    <div class="sevn">${HOSPITAL_LEVEL_NOTE}</div>
  </div>`;

  // 药物
  html += `<div class="section"><div class="sec-title">💊 可以参考的用药（常见 OTC）</div>`;
  if (urgent.length) {
    html += `<div class="empty" style="margin-bottom:10px">⚠️ 上面出现了<b>需要尽快就医</b>的信号。请不要只靠吃药硬扛，先往医院或急诊；若医生判断可居家观察，下面为常见参考。</div>`;
  }
  if (res.meds.length === 0) {
    html += `<div class="empty">这类情况通常以观察和就医为主，暂不推荐自行服用药物。<br>${careText(res)}</div>`;
  } else {
    res.meds.forEach(m => {
      const kw = medKeyword(m.name);
      const shopUrl = 'https://www.meituan.com/s/' + encodeURIComponent(kw);
      html += `<div class="med-card">
        <div class="med-head"><a class="med-name" href="${shopUrl}" target="_blank" rel="noopener">${m.name} <span class="buy">去买 ↗</span></a><span class="med-type">${MEDS[m.id].type}</span></div>
        <div class="med-intent">用于：${m.intent}</div>
        <div class="med-form"><b>用法用量：</b>详细见说明书</div>
        <div class="med-ct"><b>别用的情况：</b></div>
        <ul class="ct-list">${m.contraindications.map(c=>`<li>${c}</li>`).join('')}</ul>
      </div>`;
    });
  }
  html += `</div>`;

  // 用药顺序/注意事项
  const timedNotes = res.notes.filter(n => n.type === 'info');
  const removedNotes = res.notes.filter(n => n.type === 'warn');
  if (removedNotes.length) {
    html += `<div class="section"><div class="sec-title">🚫 不能一起吃的药</div>`;
    removedNotes.forEach(n => html += `<div class="note remove"><b>🚫 ${n.med} 不能一起吃</b><br>${n.text}</div>`);
    html += `</div>`;
  }
  if (timedNotes.length) {
    html += `<div class="section"><div class="sec-title">⏱️ 用药顺序与注意</div>`;
    timedNotes.forEach(n => html += `<div class="note">🔹 <b>${n.a||''}</b>${n.b?' 与 <b>'+n.b+'</b>':''}：${n.text}</div>`);
    html += `</div>`;
  }

  // 生活护理
  html += `<div class="section"><div class="sec-title">🧘 生活方式建议</div>
    <div class="care">${careText(res)}</div></div>`;

  // 通用紧急提示
  html += `<div class="section"><div class="sec-title">🚨 出现这些情况，别自己处理</div>
    <ul class="ct-list">${GENERAL_URGENT_TIPS.map(t=>`<li>${t}</li>`).join('')}</ul>
    <div class="callout">有疑问就去看医生，或拨打 120 / 当地急救电话。</div></div>`;

  // 医院参考
  const depts = recommendedDepts();
  html += `<div class="section"><div class="sec-title">🏥 想去看医生？查查当地三甲医院</div>
    <div class="hint">选一个省份，看看当地擅长你这块病情的三甲医院（仅供参考）。</div>
    <select id="provSel" class="prov-sel"></select>
    <div id="provResult"></div>
  </div>`;

  $('resultBox').innerHTML = html;

  // 绑定省份下拉
  const sel = $('provSel');
  sel.innerHTML = `<option value="">— 请选择省份 —</option>` +
    PROVINCES.map(p => `<option value="${p}">${p}</option>`).join('');
  sel.onchange = () => renderHospitals(sel.value, depts);
  $('provResult').innerHTML = `<div class="hint">选择省份后，这里会显示推荐的医院。</div>`;
}

/* 严重程度分级：urgent > doctor > self */
function severityTier(flags) {
  if (flags.some(f => f.level === 'urgent')) return 'urgent';
  if (flags.some(f => f.level === 'doctor')) return 'doctor';
  return 'self';
}

/* 根据所选症状 + 性别，得到匹配的科室集合 */
function recommendedDepts() {
  const set = new Set();
  state.symptomIds.forEach(id => (SYMPTOM_DEPT[id] || []).forEach(d => set.add(d)));
  if (state.gender === 'female') set.add(FEMALE_DEPT);
  return Array.from(set);
}

/* 渲染某省份推荐医院 */
function renderHospitals(province, depts) {
  const { best, byProv } = recommendHospitals(depts);
  const list = (byProv[province] || []);
  let h = '';
  if (!province) {
    h = `<div class="hint">请先选择省份。</div>`;
  } else if (list.length) {
    h += `<div class="hh">${province} 推荐（按擅长匹配）：</div>`;
    list.slice(0, 5).forEach(hosp => h += hospCard(hosp, depts));
    h += `<div class="hint">本地能查到的就这些；如果都不合适，可参考下面全国知名医院。</div>`;
  } else {
    h += `<div class="hint">这个省份暂时没匹配到熟悉该科室的三甲医院，建议查看全国推荐，或去本省省会三甲咨询。</div>`;
  }
  if (best.length) {
    h += `<div class="hh">全国知名（跨地区参考）：</div>`;
    best.slice(0, 4).forEach(hosp => h += hospCard(hosp, depts));
  }
  $('provResult').innerHTML = h;
}

function hospCard(hosp, depts) {
  const matched = depts.filter(d => hosp.dept[d]).map(d => DEPARTMENTS[d].name);
  const strong = strongDeptsText(hosp);
  return `<div class="h-card">
    <div class="h-name">${hosp.name}</div>
    <div class="h-city">📍 ${hosp.city}（${hosp.prov}）</div>
    ${matched.length ? `<div class="h-dept">匹配科室：${matched.join('、')}</div>` : ''}
    ${strong ? `<div class="h-strong">重点科室：${strong}</div>` : ''}
  </div>`;
}

/* 药品名去掉括号后缀，作为美团搜索关键词 */
function medKeyword(name) {
  return name.replace(/[（(][^）)]*[）)]/g, '').trim();
}

function careText(res) {
  const cares = new Set();
  state.symptomIds.forEach(id => {
    const s = SYMPTOMS[id];
    if (s && s.care) cares.add(s.care);
  });
  return cares.size ? [...cares].map(c => `<div class="care">· ${c}</div>`).join('') : '<div class="care">· 注意休息、多喝水、清淡饮食，观察变化。</div>';
}

/* ---------- 导航绑定 ---------- */
function bindNav() {
  $('startBtn').onclick = () => { showView('region'); window.scrollTo(0,0); };
  $('nextBtn').onclick = () => { renderSymptoms(); showView('symptom'); window.scrollTo(0,0); };
  $('symNext').onclick = () => { renderDetail(); showView('detail'); window.scrollTo(0,0); };
  $('detailNext').onclick = () => { goResult(); };
  $('resultBack').onclick = () => { renderDetail(); showView('detail'); window.scrollTo(0,0); };
  $('resultRestart').onclick = () => { resetAll(); };
  $('addMore').onclick = () => { renderSymptoms(); showView('symptom'); window.scrollTo(0,0); };
  $('topBack').onclick = () => {
    if (viewName === 'symptom') showView('region');
    else if (viewName === 'detail') showView('symptom');
    else if (viewName === 'result') { renderDetail(); showView('detail'); }
    else if (viewName === 'region') { showView('intro'); }
    window.scrollTo(0,0);
  };
}

function resetAll() {
  state.regionIds = [];
  state.symptomIds = [];
  state.answers = {};
  state.gender = 'default';
  try { localStorage.removeItem(STATE_KEY); } catch (e) {}
  renderIntro();
  renderRegion();
  showView('intro');
  window.scrollTo(0,0);
}

/* ---------- 安装到手机 ---------- */
let deferredPrompt = null;
function isStandalone() {
  return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || (window.navigator && window.navigator.standalone === true);
}
function updateInstallBtn() {
  const btn = $('installBtn');
  if (!btn) return;
  btn.style.display = isStandalone() ? 'none' : 'block';
}
function bindInstall() {
  const ua = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua) || (window.innerWidth < 800 && !isIOS);
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    updateInstallBtn();
  });
  window.addEventListener('appinstalled', () => { updateInstallBtn(); });
  $('installBtn').onclick = async () => {
    if (deferredPrompt) {
      // 支持的浏览器（多为 Chrome/Edge）：直接弹系统安装框
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      updateInstallBtn();
    } else if (isIOS) {
      $('installGuideText').innerHTML =
        '<b>iPhone 安装步骤：</b><br>1. 点 Safari 底部中间的「<b>分享</b>」按钮（方框带向上箭头）；<br>2. 菜单里选「<b>添加到主屏幕</b>」；<br>3. 点右上角「<b>添加</b>」。<br><br>（苹果规定只能这样装，任何网页都不能直接弹安装框。）';
      $('installGuide').style.display = 'flex';
    } else if (isAndroid) {
      $('installGuideText').innerHTML =
        '<b>安卓手机安装步骤：</b><br>1. 点你浏览器里的「<b>菜单</b>」按钮（一般在右下角或右上角，图标是三个点 / 三条横线）；<br>2. 在菜单里选「<b>添加到主屏幕</b>」或「<b>添加到桌面</b>」；<br>3. 按提示确认，桌面就有图标了。';
      $('installGuide').style.display = 'flex';
    } else {
      $('installGuideText').innerHTML =
        '<b>请用手机打开这个网址</b>，再用手机浏览器添加到主屏幕。<br><br>网址：<br><b>https://xieedahuimao.github.io/med-guide/</b>';
      $('installGuide').style.display = 'flex';
    }
  };
  $('installGuideClose').onclick = () => { $('installGuide').style.display = 'none'; };
  updateInstallBtn();
}

/* ---------- 启动 ---------- */
window.addEventListener('DOMContentLoaded', () => {
  const savedView = restoreState();
  renderIntro();
  renderRegion();
  renderSymptoms();
  if (state.symptomIds.length) renderDetail();
  bindNav();
  bindInstall();
  if (savedView === 'result' && state.symptomIds.length) {
    goResult();
  } else {
    showView(savedView);
  }
  if (savedView === 'intro') window.scrollTo(0,0);
});

/* 注册 Service Worker（PWA 离线可用 + 自动更新到最新版） */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      reg.update();
    }).catch(() => {});
    // 新版 Service Worker 接管时自动刷新，确保用户看到的总是最新版
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  });
}
