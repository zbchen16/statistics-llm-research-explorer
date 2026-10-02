'use strict';
const DATA=JSON.parse(document.getElementById('atlas-data').textContent);
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeURL=u=>/^https:\/\//.test(u||'')?esc(u):'#';
const labels={home:'Research Overview',map:'Research Map',papers:'Paper Explorer',roadmap:'First-Stage Reading Plan',directions:'Candidate Research Questions',industry:'Industry Signals',tools:'Theoretical Tool Box',watchlist:'Watchlist',tutorial:'教程导读'};
const statusLabels={'unread':'未读','reading':'在读','read':'已读','revisit':'待重读'};
const state={scope:'core',filters:{},query:''};
const prefix='stats-llm:v2:paper:';
const memory={};
let saveFailed=false;
function notify(message){$('message').textContent=message;}
function getRecord(id){
 if(memory[id])return memory[id];
 try{const r=JSON.parse(localStorage.getItem(prefix+id)||'null');if(r&&typeof r==='object')return memory[id]=r;}catch(e){saveFailed=true;}
 return memory[id]={notes:'',status:'unread'};
}
function saveRecord(id,patch){
 const r={...getRecord(id),...patch,updatedAt:new Date().toISOString()};memory[id]=r;
 try{localStorage.setItem(prefix+id,JSON.stringify(r));saveFailed=false;notify('已保存在本机浏览器。建议定期导出备份。');}
 catch(e){saveFailed=true;notify('浏览器存储不可用或已满；本次修改仍在当前页面内，请立即导出备份。');}
 updateProgress();
}
function migrateLegacy(){
 // Read known legacy keys only; never remove or rewrite any legacy key.
 const existing=new Set(DATA.papers.filter(p=>{try{return localStorage.getItem(prefix+p.id)!==null;}catch(e){return false;}}).map(p=>p.id));
 const keys=['llm-statistics-notes','llm-statistics-reading-status','paperNotes','readingStatus','llm-statistics-explorer-notes','llm-statistics-explorer-status'];
 for(const key of keys){try{const raw=JSON.parse(localStorage.getItem(key)||'null');if(!raw||typeof raw!=='object')continue;
  for(const p of DATA.papers){if(existing.has(p.id))continue;const v=raw[p.id]??raw[p.arxiv]??raw[p.title];if(v===undefined)continue;const r=getRecord(p.id);
   if(/status/i.test(key)){const st=typeof v==='string'?v:v.status;if(statusLabels[st])saveRecord(p.id,{status:st});}
   else if(typeof v==='string'&&v)saveRecord(p.id,{notes:r.notes?`${r.notes}\n\n[旧笔记 ${key}]\n${v}`:v});
   else if(v&&typeof v==='object')saveRecord(p.id,{notes:typeof v.notes==='string'?v.notes:r.notes,status:statusLabels[v.status]?v.status:r.status});
  }
 }catch(e){/* Unknown or malformed legacy records remain untouched. */}}
}
function download(name,text,type='application/json'){const blob=new Blob([text],{type});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
function exportNotes(){download('statistics-llm-notes-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify({schema:'stats-llm-notes',version:2,exportedAt:new Date().toISOString(),papers:Object.fromEntries(DATA.papers.map(p=>[p.id,{...getRecord(p.id),title:p.title}]))},null,2));}
function mergeImport(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('需要 JSON 对象。');
 const records=raw.papers||raw.notes||raw; if(!records||typeof records!=='object'||Array.isArray(records))throw Error('无法识别笔记结构。');
 let count=0;const unknown={};
 for(const [key,value] of Object.entries(records)){
  const p=DATA.papers.find(p=>p.id===key||p.title===key||p.arxiv===key||p.url===key);
  if(!p){unknown[key]=value;continue;}
  const incoming=typeof value==='string'?{notes:value}:value;
  if(!incoming||typeof incoming!=='object')continue;
  const current=getRecord(p.id);const note=typeof incoming.notes==='string'?incoming.notes:'';
  const merged=note&&!current.notes?note:note&&note!==current.notes&&!current.notes.includes(note)?current.notes+'\n\n[导入备份，保留两版]\n'+note:current.notes;
  // Do not reset existing progress when merging a less informative backup.
  const rank={unread:0,reading:1,revisit:2,read:3};
  const status=statusLabels[incoming.status]&&rank[incoming.status]>rank[current.status]?incoming.status:current.status;
  saveRecord(p.id,{notes:merged,status});count++;
 }
 if(Object.keys(unknown).length){try{localStorage.setItem('stats-llm:v2:unmatched:'+Date.now(),JSON.stringify(unknown));}catch(e){notify('部分未匹配条目未能保存，请保留原备份文件。');}}
 return {count,unknown:Object.keys(unknown).length};
}
function paperLinks(ids){return ids.map(id=>{const p=DATA.papers.find(p=>p.id===id);return p?`<a class="ref-link" href="#paper:${id}">${esc(p.title)}</a>`:''}).join('');}
function external(url,label){return `<a href="${safeURL(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;}
function intro(title,text){return `<header class="page-intro"><div><h1>${title}</h1>${text?`<p>${text}</p>`:''}</div></header>`;}
function updateProgress(){const done=DATA.stage.filter(id=>getRecord(id).status==='read').length;if($('progress-count'))$('progress-count').textContent=`${done} / 15`;if($('progress-bar'))$('progress-bar').value=done;}
function home(){return intro('Statistics × LLM / Generative AI','Research Focus · Statistics for LLM / Generative AI')+`
<div class="research-focus"><p>How should we measure, evaluate, infer, adapt, and make decisions when large language models become part of the data-generating process?</p><small>关注测量、推断和决策；不以 “How to train a larger language model?” 为主线。</small></div>
<div class="home-actions"><a class="primary-link" href="#roadmap">继续 15-paper 阅读计划 →</a><a href="#papers">探索 ${DATA.papers.length} 篇论文</a><a href="#directions">比较候选研究问题</a></div>
<div class="flow compact-flow"><a href="#map">Data / Measurement</a><span>↓</span><a href="#map">Inference / Evaluation</a><span>↓</span><a href="#map">Preference / Post-training</a><span>↓</span><a href="#map">Agent / Adaptive Decision</a><span>↓</span><a href="#map">Deployment</a></div>
<div class="two-col"><article class="concept"><small>READING WORKSPACE</small><h2 id="progress-count">0 / 15</h2><progress id="progress-bar" max="15" value="0" aria-label="第一阶段阅读进度"></progress><p>题录、笔记和阅读进度按稳定论文 ID 关联。分数是策展判断，不是论文结论。</p></article><article class="concept"><small>THEORETICAL TOOLS</small><h3>由问题决定学什么数学</h3><p>Semiparametric Statistics · Causal Inference · Sequential Analysis · Statistical Decision Theory · Optimization · Learning Theory · Kernel / RKHS when useful</p><p><b>Kernel / RKHS / Learning Theory = tools, NOT the main research identity.</b></p></article></div>
<div class="section-note">适合统计学硕士生进入的理论、方法与可靠实验问题。排除大规模 foundation-model pretraining；UQ、隐私、公平性、水印和机制解释保留为低权重背景。</div>
<details class="direction"><summary>资料核验与使用边界</summary><p>35 篇均取得原始题录页面；15 篇提供重点导读。旧论文的未复核定理/实验字段明确标注，不能当作精读完成。论文年份优先正式发表年份，预印本年份单列。全部候选问题均未确认新颖性、未在此站运行实验。</p><p>本机笔记不上传服务器。不同浏览器、file:// 与 localhost 之间请用导出/导入迁移。旧 localStorage 不删除；无法识别的旧格式保留原样。</p><p><a href="verification-report.md">查看核验记录</a> · <a href="#tutorial">保留的 tutorial 导读</a></p></details>`;}
function mapMarkup(){return `<div class="map-grid">${[
 ['A','Data & Measurement','Y：人工/gold variable；Ỹ：AI 测量；z=G(X)：生成的高维信息。','LLM annotation · human labels · generated features · embeddings · structured extraction · synthetic data','measurement','synthetic'],
 ['B','Valid Inference & Evaluation','明确 estimand，再校正误差：E[ψ(Z;θ)]=0。','PPI · semisupervised / generative-augmented inference · judge calibration · model comparison · ranking','inference','evaluation'],
 ['C','Preference & Post-training','将偏好数据、统计模型与优化目标分别研究。','RLHF · DPO / IPO / KTO · heterogeneous preferences · SFT / preference / synthetic post-training data selection','preference','selection'],
 ['D','Agent / Adaptive Decision & Deployment','Xₜ → Aₜ → Yₜ → next state；通常不再 iid。','contextual bandits · causal / adaptive inference · OPE · routing / cascading · test-time compute · optimal stopping','adaptive','routing','compute']
 ].map(x=>`<article class="concept"><small>LAYER ${x[0]}</small><h2>${x[1]}</h2><p class="formula">${x[2]}</p><p>${x[3]}</p><div class="pill-row">${x.slice(4).map(id=>`<button class="ref-link" data-track="${id}">${esc(DATA.tracks.find(t=>t.id===id).name)}</button>`).join('')}</div></article>`).join('')}</div>`;}
function researchMap(){return intro('Research Map','四层主轴 · 按数据角色、目标参数与决策结构定位')+mapMarkup()+`
<div class="section-note"><b>不要混淆：</b>PPI 的预测标签、GAI 的辅助特征和 GESPI 的合成样本，是不同的数据角色。Mechanistic Statistical Analysis 与 Synthetic Data & Statistical Inference 已拆开。</div>
<h2>Research Roadmap</h2><div class="roadmap-asset"><div id="roadmap-image-wrap" hidden><button id="zoom-image" class="image-button" aria-label="放大研究路线图"><img id="roadmap-image" alt="用户导入的 Statistics × LLM 研究路线图"></button></div><div id="roadmap-fallback"><p>尚未收到你已生成的路线图原图。上方 HTML 地图可直接阅读；导入图片后可点击放大。</p><p>项目预留：<code>assets/statistics_llm_research_roadmap.png</code></p></div><label class="primary-link upload-label">导入路线图图片<input id="roadmap-upload" type="file" accept="image/png,image/jpeg,image/webp" class="sr-only"></label><button id="zoom-map">放大 HTML 地图</button><a id="download-image" hidden>保存已导入图片</a></div>
<p>地图从测量数据出发，经过有效推断、偏好后训练，走向自适应交互与部署。底层工具为半参数理论、因果推断、序贯分析/鞅、统计决策、优化/学习理论及按需使用的 Kernel/RKHS。第一阶段 15 篇按此逻辑进入八周计划。</p><a href="#roadmap">查看与地图对应的 15 篇论文 →</a>`;}
function fieldFilter(id,label,options,mode=''){return `<label>${label}<select id="filter-${id}" data-filter="${id}" aria-label="${label}"><option value="">不限${mode}</option>${options.map(o=>Array.isArray(o)?`<option value="${esc(o[0])}">${esc(o[1])}</option>`:`<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select></label>`;}
function paperExplorer(){const unique=k=>[...new Set(DATA.papers.map(p=>p[k]))];const levels=[1,2,3,4,5];return intro('Paper Explorer','先按问题与资源筛选，再展开假设、证据与个人笔记。')+`
<div class="toolbar"><label class="sr-only" for="search">搜索标题、作者、关键词或统计概念</label><input id="search" class="search" type="search" placeholder="搜索 title / author / keyword / statistical concept…"><div class="filter-grid">${fieldFilter('track','Research Track',DATA.tracks.map(t=>[t.id,t.name]))}${fieldFilter('problem','Statistical Problem',unique('problem'))}${fieldFilter('priority','Reading Priority',['First-stage 15','Extended','Watchlist'])}${fieldFilter('status','Reading Status',Object.entries(statusLabels))}</div>
<details class="advanced"><summary>更多筛选：理论、背景、算力、人工标注、代码、年份</summary><div class="filter-grid">${fieldFilter('type','Paper Type',['theory','method','empirical','system','survey'])}${fieldFilter('theory','Theory Level（等于）',levels)}${fieldFilter('stat','Statistical Background（最高）',levels)}${fieldFilter('llm','LLM Background（最高）',levels)}${fieldFilter('compute','Compute Requirement（最高）',levels)}${fieldFilter('human','Human Annotation Required',unique('human'))}${fieldFilter('code','Open-source Code',[['yes','来源已核验'],['no','未核验/未提供']])}${fieldFilter('potential','Master’s Potential（最低）',levels)}${fieldFilter('year','Year',unique('year').sort((a,b)=>b-a))}</div></details>
<div class="filter-row"><button id="scope-toggle" class="filter-toggle" aria-pressed="false">包含 Secondary / Watchlist</button><button id="clear-filters">清除筛选</button><button id="stage-only">只看第一阶段 15 篇</button></div></div>
<details class="rating-key"><summary>五项 1–5 评分如何解释？</summary><p>背景与理论：1 入门，5 深入；算力：1 CPU/缓存/API，2 轻量实验，3 单卡/小规模微调，4 多卡，5 大规模 GPU；研究潜力：1 低优先级，5 值得优先做可行性实验。均为针对最小复现的策展估计，不保证论文新颖性或论文原实验成本。</p></details><div class="result-heading"><span id="results-count" aria-live="polite"></span><span>个人笔记自动保存于本机</span></div><div id="paper-list" class="paper-list"></div>`;}
function matches(p){const f=state.filters,r=getRecord(p.id);if(state.scope==='core'&&p.scope!=='core')return false;
 if(state.query&&!JSON.stringify([p.title,p.authors,p.idea,p.formulation,p.question,p.problem,p.statBackground,p.extensions,p.trackName]).toLowerCase().includes(state.query))return false;
 for(const [k,v] of Object.entries(f)){if(v==='')continue;
  if(['stat','llm','compute'].includes(k)&&p.scores[k]>Number(v))return false;
  if(k==='theory'&&p.scores.theory!==Number(v))return false;
  if(k==='potential'&&p.scores.potential<Number(v))return false;
  if(k==='status'&&r.status!==v)return false;
  if(k==='code'&&Boolean(p.code&&p.codeVerified)!==(v==='yes'))return false;
  if(['track','problem','priority','human','year'].includes(k)&&String(p[k])!==v)return false;
  if(k==='type'&&p.paperType!==v)return false;
 }return true;
}
const detailFields=[['question','Core Statistical Question'],['idea','Main Idea'],['formulation','Statistical Formulation · 阅读用简化表达'],['assumptions','Key Assumptions'],['theory','Theoretical Results'],['experiment','Experimental Setup'],['why','Why It Matters'],['computeText','Computational Requirement'],['llmBackground','LLM Background'],['statBackground','Statistical Background'],['master','Potential for Master’s Research'],['extensions','Possible Extensions · 待查新'],['limit','Limitations']];
function card(p,index){const r=getRecord(p.id);return `<details class="paper ${p.scope==='secondary'?'secondary':''}" id="paper-${p.id}"><summary><span class="paper-number">${String(index+1).padStart(2,'0')}</span><div><div class="paper-meta"><span>${esc(p.trackName)}</span><span class="tag">${esc(p.priority)}</span><span>${p.year} · ${esc(p.paperType)}</span></div><h3>${esc(p.title)}</h3><p class="summary">${esc(p.idea)}</p><div class="authors">${esc(p.authors)}<br>${esc(p.venue)} · 首次公开 ${p.firstYear}</div><div class="pill-row">${Object.entries({stat:'统计背景',llm:'LLM背景',compute:'算力',theory:'理论',potential:'硕士潜力'}).map(([k,l])=>`<span class="pill">${l} ${p.scores[k]}/5</span>`).join('')}<span class="tag" id="badge-${p.id}">${esc(statusLabels[r.status]||'未读')}</span></div></div><span class="expand" aria-hidden="true">+</span></summary>
<div class="paper-detail"><p class="verification">题录核验 ${p.verifiedAt} · ${esc(p.verificationNote)}</p><div class="paper-links">${external(p.url,'Official / primary source')}${p.arxiv&&p.arxiv!==p.url?external(p.arxiv,'arXiv'):''}${p.pdf?external(p.pdf,'PDF'):''}${p.code&&p.codeVerified?external(p.code,'作者代码'):'<span>Code link：未核验/未提供</span>'}</div><dl>${detailFields.map(([k,l])=>`<dt>${l}</dt><dd class="${k==='formulation'?'formula':''}">${esc(p[k])}</dd>`).join('')}<dt>Theory Level</dt><dd>${p.scores.theory}/5 · 策展评分</dd><dt>Related Papers</dt><dd>${paperLinks(p.related)}</dd></dl><div class="personal"><label for="status-${p.id}">Reading status<select id="status-${p.id}" data-status="${p.id}">${Object.entries(statusLabels).map(([k,v])=>`<option value="${k}" ${r.status===k?'selected':''}>${v}</option>`).join('')}</select></label><label for="notes-${p.id}">My Notes<textarea id="notes-${p.id}" data-notes="${p.id}" rows="6" placeholder="记录 estimand、假设、证明疑问、实验与可能扩展…">${esc(r.notes)}</textarea></label><small>自动保存在本机；切换网址或浏览器前请导出备份。</small></div></div></details>`;}
function renderPapers(){const order=p=>{const i=DATA.stage.indexOf(p.id);return i<0?99:i;};const filtered=DATA.papers.filter(matches).sort((a,b)=>order(a)-order(b));$('results-count').textContent=`显示 ${filtered.length} / ${DATA.papers.length} 篇 · ${state.scope==='core'?'核心研究线':'包含次级方向'}`;$('paper-list').innerHTML=filtered.length?filtered.map(card).join(''):'<div class="empty"><h3>没有符合条件的论文</h3><p>请减少筛选条件，或包含 Secondary / Watchlist。</p><button data-reset>清除筛选</button></div>';
}
function resetFilters(){state.query='';state.filters={};$('search').value='';document.querySelectorAll('[data-filter]').forEach(s=>s.value='');renderPapers();}
function readingPlan(){return intro('First-Stage 15-Paper Reading Plan','八周 · 按研究逻辑阅读，年份与正式版本单独核验')+`<div class="section-note">每周产出一页笔记：目标参数、数据来源、关键假设、最接近的旧方法，以及一个可复现实验。阅读状态与 Paper Explorer 共用。</div><div class="timeline">${DATA.weeks.map(w=>`<article class="week"><span class="time">WEEK ${String(w.week).padStart(2,'0')}</span><div><h2>${esc(w.title)}</h2><ol class="reading-papers">${w.papers.map(id=>{const p=DATA.papers.find(p=>p.id===id);return `<li><a href="#paper:${id}">${esc(p.title)}</a><small>${esc(p.venue)} · ${esc(statusLabels[getRecord(id).status])}</small></li>`}).join('')}</ol><p class="deliverable">${esc(w.output)}</p></div></article>`).join('')}</div>`;}
function candidateQuestions(){return intro('Candidate Research Questions','7 个 Open Problem Cluster · 14 个示例问题 · 原有 6 个候选题完整保留')+`<div class="section-note">这里的 “Open Problem Cluster” 是探索分类，<b>不声称每个问题尚未被解决</b>。先查近邻文献和可用数据，再决定是否立项；没有在本站运行实验。</div>${DATA.clusters.map(c=>`<section class="cluster"><h2><span class="tag">CLUSTER ${c.id}</span> ${esc(c.title)}</h2>${c.questions.map(q=>`<details class="direction"><summary>${esc(q.title)}</summary><dl class="question-fields">${[['motivation','Motivation'],['formulation','Statistical Formulation'],['estimand','Estimand'],['data','Data Needed'],['baseline','Baseline'],['theory','Theory Opportunity'],['cost','Experiment Cost'],['failure','Failure Criterion']].map(([k,l])=>`<dt>${l}</dt><dd>${esc(q[k])}</dd>`).join('')}<dt>Closest Existing Papers</dt><dd>${paperLinks(c.papers)}</dd></dl></details>`).join('')}</section>`).join('')}<details class="direction secondary"><summary>保留：原站 6 个候选问题（非最终定题）</summary>${DATA.legacyDirections.map(q=>`<article><h3>${esc(q.title)}</h3><dl class="question-fields">${Object.entries(q).filter(([k])=>!['id','title','papers'].includes(k)).map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}<dt>Related Papers</dt><dd>${paperLinks(q.papers)}</dd></dl></article>`).join('')}</details>`;}
function industry(){return intro('Industry Signals','Enterprise Need → Statistical Formulation → Research Literature')+`<div class="section-note">Evidence A：官方论文、技术博客或 JD；B：官方产品／公开技术演讲；C：第三方补充。主矩阵只用 A/B。统计映射与硕士题目是本站推导，<b>不表示企业已采用该方法或正在招聘</b>。</div><div class="table-wrap"><table class="industry-matrix"><thead><tr>${['Enterprise Need / Pain Point','Statistical Problem / Track','Relevant Papers','Required Skills','Compute','Public Evidence','Possible Master’s Topic'].map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${DATA.industry.map(r=>`<tr><td><b>${esc(r.name)}</b><p>${esc(r.pain)}</p></td><td>${esc(r.stats)}<div>${r.tracks.map(t=>`<button class="ref-link" data-track="${t}">${esc(DATA.tracks.find(x=>x.id===t).name)}</button>`).join('')}</div></td><td>${paperLinks(r.papers)}</td><td>${esc(r.skills)}</td><td>${esc(r.compute)}</td><td>${r.evidence.map(id=>{const e=DATA.evidence.find(x=>x.id===id);return `<a class="ref-link" href="#evidence:${id}">Evidence ${e.level} · ${esc(e.company)}</a>`}).join('')}</td><td>${esc(r.topic)}</td></tr>`).join('')}</tbody></table></div><h2>公开证据与适用边界</h2><div class="evidence-grid">${DATA.evidence.map(e=>`<article class="concept ${e.level==='C'?'secondary':''}" id="evidence-${e.id}"><small>Evidence ${e.level} · ${esc(e.kind)}</small><h3>${esc(e.company)}</h3><p>${esc(e.types)}</p><p>${esc(e.claim)}</p><p><b>边界：</b>${esc(e.limit)}</p><p>${external(e.url,'来源')} · ${esc(e.date)}</p></article>`).join('')}</div><details class="direction secondary"><summary>保留上次企业招聘调研</summary><p>${external('https://seed.bytedance.com/zh/career','字节官方招聘')} · <a href="industry-guide.md">原六家公司调研笔记</a>。腾讯课题保留在原笔记，未把高校托管的企业文件冒充当前官方在招职位。DeepSeek/Kimi 详情仍只作 C 级补充。</p></details>`;}
function toolbox(){return intro('Theoretical Tool Box','未来学什么数学，取决于研究问题。')+`<div class="two-col">${DATA.tools.map(t=>`<article class="concept"><h2>${esc(t.name)}</h2><p class="formula">${esc(t.concepts)}</p><p>${esc(t.when)}</p>${paperLinks(t.papers)}</article>`).join('')}</div>`;}
function watchlist(){return intro('Watchlist / Secondary Topics','保留背景与次级理论线，降低视觉与阅读优先级。')+`<div class="two-col">${DATA.watchlist.map(w=>`<article class="concept secondary"><h2>${esc(w.name)}</h2><p>${esc(w.reason)}</p>${paperLinks(w.ids)}</article>`).join('')}</div><p>没有为凑数量添加未经核验的论文。主题保留不等于当前已有阅读推荐。</p>`;}
function tutorial(){return intro('保留的 tutorial 导读','An Overview of Large Language Models for Statisticians · 2025 年版本')+`<p>原综述提供统计学进入 LLM 的背景地图。本站研究主线已按 Data → Inference → Post-training → Adaptive Decision 更新；教程页码和原导读仍保留。</p><div class="reading-map">${DATA.tutorial.map(s=>`<article class="chapter"><div class="location">${esc(s[0])}</div><div><h3>${esc(s[1])}</h3><p>${esc(s[2])}</p><p>${esc(s[4])}</p></div><span class="tag">${esc(s[3])}</span></article>`).join('')}</div><p>${external('https://arxiv.org/pdf/2502.17814v1','对应版本 PDF')} · <a href="reading-guide.md">原阅读笔记</a></p>`;}
function buildViews(){const views={home:home(),map:researchMap(),papers:paperExplorer(),roadmap:readingPlan(),directions:candidateQuestions(),industry:industry(),tools:toolbox(),watchlist:watchlist(),tutorial:tutorial()};$('views').innerHTML=Object.entries(views).map(([id,s])=>`<section id="view-${id}" class="view" hidden>${s}</section>`).join('');}
function showView(name){if(!labels[name])name='home';document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!=='view-'+name);document.querySelectorAll('.navigation [data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===name);b.setAttribute('aria-current',b.dataset.view===name?'page':'false');});$('breadcrumb').textContent=labels[name];if(name==='roadmap')$('view-roadmap').innerHTML=readingPlan();window.scrollTo({top:0});}
function route(){const h=decodeURIComponent(location.hash.slice(1));if(h.startsWith('paper:')){state.scope='all';resetFilters();$('scope-toggle').setAttribute('aria-pressed','true');showView('papers');const el=$('paper-'+h.slice(6));if(el){el.open=true;requestAnimationFrame(()=>el.scrollIntoView({block:'start'}));}else notify('未找到论文 ID；原有论文 ID 均已保留。');}else if(h.startsWith('evidence:')){showView('industry');requestAnimationFrame(()=>$('evidence-'+h.slice(9))?.scrollIntoView({block:'start'}));}else showView(labels[h]?h:'home');}
function trackFilter(id){state.scope='all';resetFilters();state.filters.track=id;$('filter-track').value=id;$('scope-toggle').setAttribute('aria-pressed','true');renderPapers();location.hash='papers';showView('papers');}
let imageURL='';let importedImage=null;
function displayImage(url){imageURL=url;$('roadmap-image').src=url;$('roadmap-image-wrap').hidden=false;$('roadmap-fallback').hidden=true;$('download-image').hidden=false;$('download-image').href=url;$('download-image').download='statistics_llm_research_roadmap.png';}
function assetDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open('stats-llm-assets',1);req.onupgradeneeded=()=>req.result.createObjectStore('images');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function saveImage(file){const db=await assetDB();await new Promise((resolve,reject)=>{const tx=db.transaction('images','readwrite');tx.objectStore('images').put(file,'roadmap');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});db.close();}
async function loadImage(){try{const db=await assetDB();const blob=await new Promise((resolve,reject)=>{const r=db.transaction('images').objectStore('images').get('roadmap');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});db.close();if(blob){importedImage=blob;displayImage(URL.createObjectURL(blob));return;}}catch(e){}const probe=new Image();probe.onload=()=>displayImage('assets/statistics_llm_research_roadmap.png');probe.onerror=()=>{};probe.src='assets/statistics_llm_research_roadmap.png';}
function zoom(useImage){$('zoom-content').innerHTML=useImage&&imageURL?`<img class="zoomed-image" src="${esc(imageURL)}" alt="研究路线图放大视图">`:mapMarkup();$('zoom-dialog').showModal();}
migrateLegacy();buildViews();renderPapers();updateProgress();route();loadImage();
document.addEventListener('click',e=>{const b=e.target.closest('[data-view],[data-track],[data-reset]');if(b?.dataset.view)location.hash=b.dataset.view;if(b?.dataset.track)trackFilter(b.dataset.track);if(b?.hasAttribute('data-reset'))resetFilters();});
$('search').addEventListener('input',e=>{state.query=e.target.value.trim().toLowerCase();renderPapers();});
document.addEventListener('change',e=>{if(e.target.dataset.filter){state.filters[e.target.dataset.filter]=e.target.value;renderPapers();}if(e.target.dataset.status){const id=e.target.dataset.status;saveRecord(id,{status:e.target.value});$('badge-'+id).textContent=statusLabels[e.target.value];if(state.filters.status)renderPapers();}});
document.addEventListener('input',e=>{if(e.target.dataset.notes)saveRecord(e.target.dataset.notes,{notes:e.target.value});});
$('scope-toggle').addEventListener('click',()=>{state.scope=state.scope==='core'?'all':'core';$('scope-toggle').setAttribute('aria-pressed',String(state.scope==='all'));renderPapers();});
$('clear-filters').addEventListener('click',resetFilters);
$('stage-only').addEventListener('click',()=>{resetFilters();state.scope='core';$('scope-toggle').setAttribute('aria-pressed','false');state.filters.priority='First-stage 15';$('filter-priority').value='First-stage 15';renderPapers();});
$('export-notes').addEventListener('click',exportNotes);
$('import-notes').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{const result=mergeImport(JSON.parse(await file.text()));renderPapers();notify(`已合并 ${result.count} 篇笔记；${result.unknown} 条未匹配记录单独保留。原笔记与旧存储未删除。`);}catch(err){notify('导入失败：'+err.message+' 原有数据未删除。');}e.target.value='';});
$('roadmap-upload').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;if(!['image/png','image/jpeg','image/webp'].includes(f.type)){notify('请选择 PNG、JPEG 或 WebP 图片。');return;}const test=new Image();const u=URL.createObjectURL(f);test.onerror=()=>{URL.revokeObjectURL(u);notify('无法读取该图片，原有图片未修改。');};test.onload=async()=>{importedImage=f;displayImage(u);try{await saveImage(f);notify('路线图已保存于本机；可点击放大，或保存图片到项目 assets。');}catch(err){notify('图片已显示，但浏览器无法持久保存；请保留原图。');}};test.src=u;});
$('zoom-image').addEventListener('click',()=>zoom(true));$('zoom-map').addEventListener('click',()=>zoom(false));$('close-zoom').addEventListener('click',()=>$('zoom-dialog').close());
$('zoom-dialog').addEventListener('click',e=>{if(e.target===$('zoom-dialog'))$('zoom-dialog').close();});
window.addEventListener('hashchange',route);
window.addEventListener('storage',e=>{if(e.key?.startsWith(prefix)){delete memory[e.key.slice(prefix.length)];updateProgress();notify('另一窗口更新了阅读数据；重新打开论文可查看最新内容。');}});
if(saveFailed)notify('浏览器存储不可用；请用导出备份保存笔记。');
