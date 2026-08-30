/* ============================================================
   安全引擎：药物推荐 + 禁忌 + 相互作用 + 就医红线评估
   ============================================================ */

/* ---------- 1. 综合症状收集药物 ----------
   返回有序数组 [{ medId, source: [症状名] }] */
function collectMedCandidates(state) {
  const list = [];
  const order = []; // medId 出现顺序
  const sourceMap = {}; // medId -> [symptomName]

  for (const symId of state.symptomIds) {
    const sym = SYMPTOMS[symId];
    if (!sym) continue;
    for (const medId of sym.meds) {
      if (!sourceMap[medId]) { sourceMap[medId] = []; order.push(medId); }
      if (!sourceMap[medId].includes(sym.name)) sourceMap[medId].push(sym.name);
    }
  }
  for (const medId of order) {
    list.push({ medId, source: sourceMap[medId] });
  }
  return list;
}

/* ---------- 2. 相互作用检查 ----------
   rules: [
     完全冲突(avoid)   -> 移除后加入的药，并给出原因
     需错开(timed)      -> 保留，但加入间隔说明
     与任意药(interval) -> 蒙脱石散，全局间隔 2 小时
   ] */
function resolveInteractions(candidates) {
  const notes = [];
  let accepted = candidates.slice();

  // 先把可交互的命中收集起来
  const pairs = [];
  for (let i = 0; i < accepted.length; i++) {
    for (let j = i + 1; j < accepted.length; j++) {
      const a = accepted[i].medId, b = accepted[j].medId;
      const rule = findInteraction(a, b);
      if (rule) pairs.push({ i, j, a, b, rule });
    }
  }

  // 逐个处理，若 avoid 则移除靠后的药（adjudicate 在副本上进行）
  const removed = new Set();
  for (const p of pairs) {
    if (p.rule.rule === 'avoid') {
      removed.add(p.b);
      notes.push({ type: 'warn', med: MEDS[p.b].name, text: p.rule.note });
    }
  }

  accepted = accepted.filter(c => !removed.has(c.medId));

  // 对保留的、需要错开的组合写说明（去重）
  const kept = [];
  const done = new Set();
  for (let i = 0; i < accepted.length; i++) {
    for (let j = i + 1; j < accepted.length; j++) {
      const a = accepted[i].medId, b = accepted[j].medId;
      const rule = findInteraction(a, b);
      if (rule && (rule.rule === 'timed' || rule.rule === 'compatible' || rule.rule === 'interval')) {
        const key = rule.note;
        if (!done.has(key)) {
          done.add(key);
          kept.push({ type: 'info', a: MEDS[a].name, b: MEDS[b].name, text: rule.note });
        }
      }
    }
  }
  return { accepted, notes: notes.concat(kept) };
}

/* 蒙脱石散为特殊"与任意口服药间隔" */
function findInteraction(a, b) {
  if (a === 'montmorillonite' || b === 'montmorillonite') {
    const other = a === 'montmorillonite' ? b : a;
    if (other !== 'montmorillonite') {
      const idx = INTERACTIONS.findIndex(r =>
        (r.a === 'montmorillonite' && r.b === '*') ||
        (r.b === 'montmorillonite' && r.a === '*'));
      if (idx >= 0) {
        return { rule: 'interval', note: INTERACTIONS[idx].note };
      }
    }
  }
  const hit = INTERACTIONS.find(r =>
    (r.a === a && r.b === b) || (r.a === b && r.b === a));
  return hit || null;
}

/* ---------- 3. 就医红线评估 ----------
   返回 [{ level:'urgent'|'doctor'|'info', title, text }] */
function evalRedFlags(state) {
  const flags = [];
  for (const symId of state.symptomIds) {
    const sym = SYMPTOMS[symId];
    if (!sym || !sym.redFlags) continue;
    const ans = state.answers[symId] || {};
    for (const rf of sym.redFlags) {
      const val = ans[rf.key];
      if (!val) continue;
      let match = false;
      if (Array.isArray(val)) match = rf.test(val);
      else match = rf.test([val]);
      if (match) {
        flags.push({ level: rf.level, title: sym.name, text: rf.tip });
      }
    }
  }
  return flags;
}

/* ---------- 4. 女性 + 腹部/生殖系统 特别提醒 ---------- */
function evalFemaleWarnings(state) {
  if (state.gender !== 'female') return [];
  // 只在“女性 + 腹痛/下腹痛”这类需要排查生殖系统急症时提醒；
  // 若只是腹泻、烧心、便秘等，则按普通情况处理，不触发。
  const hasAbdominalPain = state.symptomIds.some(id => id === 'abdomen_pain');
  if (!hasAbdominalPain) return [];
  return FEMALE_ABDOMEN_WARNINGS.map(w => ({ level: w.level, title: w.name, text: w.symptom + ' ' + w.tip }));
}

/* ---------- 5. 组装最终结果 ---------- */
function buildResult(state) {
  const redFlags = evalRedFlags(state);
  const female = evalFemaleWarnings(state);

  const candidates = collectMedCandidates(state);
  const { accepted, notes } = resolveInteractions(candidates);

  const meds = accepted.map(m => {
    const med = MEDS[m.medId];
    return {
      id: m.medId,
      name: med.name,
      alias: med.alias,
      intent: MED_INTENT[m.medId] || '',
      form: med.form,
      maxNote: med.maxNote,
      contraindications: med.contraindications,
      source: m.source,
    };
  });

  return { redFlags, female, meds, notes };
}
