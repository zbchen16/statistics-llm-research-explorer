# 核验与升级记录

日期：2026-10-01。以下区分已完成、核验边界和缺少的素材。

## A. Research taxonomy

四层主轴为 Data & Measurement → Valid Inference & Evaluation → Preference & Post-training → Agent / Adaptive Decision & Deployment。

合成数据统计推断、后训练选数、自适应/因果推断、路由均独立；机制解释不再与合成数据合并。共有 12 个研究主题加 UQ watchlist，其中 ICL、机制解释、水印为工具/次级方向，默认论文视图显示 28 篇核心文献。

## B. 新增论文

新增 AutoEval Done Right、Alternative Annotator Test、Efficient Inference for Noisy LLM-as-a-Judge Evaluation、Generative Augmented Inference、General Synthetic-Powered Inference、PIPA、Preference Collapse and Matching Regularization、DavIR、Prediction-Powered Adaptive Inference、RouteLLM。完整题录和来源链接在下方表格及网站中。

总计 35 篇，第一阶段 15 篇按八周排列；每周有学习产出。另新增七组、14 个候选研究问题，提供目标参数、数据、基线、理论入口、成本和失败条件。

## C. 删除与降权

没有删除旧论文、原 tutorial 或六个旧候选方向。预训练不作为核心研究线；UQ、机制解释、水印及 ICL 降为背景或工具。Kernel/RKHS/learning theory 只在具体问题需要时使用。

## D. Industry Signals

新增六行“需求—统计问题—论文—候选题目”矩阵和 10 条分级证据。A 为官方论文/技术博客/招聘资料，B 为官方产品说明，C 为第三方补充。产业信号不等于公司正在招聘某个具体统计方向。

覆盖 Anthropic、Amazon Bedrock、Microsoft、NVIDIA、Google、字节、美团、MiniMax，以及 Kimi/DeepSeek 的低等级补充。包括评测校准、偏好建模、合成数据验证、后训练选数、Agent 自适应决策和成本路由。原企业调研仍保留。

## E. 核验边界与未完成素材

35 篇标题、作者和首次公开年份均与 arXiv 或正式论文页面核对。15 篇第一阶段提供详细结构化导读；其余 20 篇保留原导读，未逐条复核定理和实验设置，页面明确标注。评分、研究扩展和候选题目的新颖性没有被当作论文结论。

- PPI++ 正式 venue 本轮未确认，保留 arXiv 2023/修订 2024。部分旧论文只确认预印本题录，正式出版信息标为“未复核”，见下方完整表。
- AutoEval 使用 ICML 2025 六作者版本；RouteLLM 采用官方 PDF 的 with Preference Data；GAI 使用 ICML 2026 标题。
- GESPI 风险保护为 α + min{ε, c·d(P,Q)}，最坏 α+ε，不误写成 α。GAI 的效率支配结论需要相应抽样条件，不能无条件推广到协变量相关标注。
- 美团官方职位文本通过公开索引读取，不能保证持续在招；Kimi/DeepSeek 为 C 级第三方信息，不作为官方招聘确认。Kimi 记录含过期信号。腾讯原调研保留，但未加入本轮新增高等级证据。
- 检查新版结构化论文与企业证据中的 97 个外链：95 个 HTTP 成功；Science 和 Taylor & Francis 的两个 DOI 页面返回 403，保留可访问的 arXiv 备选。HTTP 成功不保证无需登录或能读全文。原 Markdown 历史链接未全部重新检测。详见 [原始链接检查结果](link-checks.json)。
- 用户提到的 roadmap 原图没有随文本附件提供。文字地图、放大框、图片导入入口已实现；没有原图时无法验收其显示效果。

## F. 本地启动

在项目根目录执行：

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

打开 http://127.0.0.1:8765/ 。固定地址可继续使用同一份本机笔记；换浏览器或地址前请导出备份。

## G. 文件结构

`dist/` 为可运行网站；`source/` 为 JSON 内容、JS、CSS 与构建和验证脚本；`backups/` 保留原站；`README.md` 说明维护和备份。原始 `evidence/` 下载档案仅保存在本机，不放进交付 ZIP。

## 功能验证

- 全部 25 个旧论文 ID、六个旧方向和 tutorial 数据保留：通过。
- 35 条记录必填字段、评分范围、论文交叉引用：通过。
- 第一阶段 + 方向 + 作者组合筛选：浏览器验证通过；算力范围、阅读状态和次级方向过滤测试通过。
- 旧版笔记与独立状态键合并迁移、冲突导入、未知条目保留、重复导入：隔离存储测试通过。
- 浏览器独立测试地址保存笔记/状态并刷新：通过。没有改动用户正式地址的个人笔记。
- 390px 手机首页无横向页面溢出；导航可横滑，研究地图单列；HTML 地图放大和关闭通过。
- 页面 JS 语法与浏览器错误检查通过；未导入的图片有明确占位说明。
- 原图上传后的完整视觉验收：待收到素材；未声称原图已经显示。

## 全部题录与发表状态

| Paper | Venue | Primary source |
|---|---|---|
| Prediction-Powered Inference | Science 2023 | [Source](https://www.science.org/doi/10.1126/science.adi6000) |
| PPI++: Efficient Prediction-Powered Inference | arXiv 2023 · 修订 2024；正式 venue verification pending | [Source](https://arxiv.org/abs/2311.01453) |
| Using Imperfect Surrogates for Downstream Inference: Design-based Supervised Learning for Social Science Applications of Large Language Models | NeurIPS 2023（arXiv 作者说明） | [Source](https://arxiv.org/abs/2306.04746) |
| Active Statistical Inference | arXiv · 正式发表状态未复核 | [Source](https://arxiv.org/abs/2403.03208) |
| Multiple-Prediction-Powered Inference | ICLR 2026（arXiv 作者说明） | [Source](https://arxiv.org/abs/2603.27414) |
| Prediction-Powered Inference Across Many Tasks for AI Evaluation & Social Science Research | arXiv · 正式发表状态未复核 | [Source](https://arxiv.org/abs/2605.29249) |
| Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena | NeurIPS 2023（arXiv 作者说明） | [Source](https://arxiv.org/abs/2306.05685) |
| Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference | ICML 2024 | [Source](https://proceedings.mlr.press/v235/chiang24b.html) |
| tinyBenchmarks: evaluating LLMs with fewer examples | arXiv · 正式发表状态未复核 | [Source](https://arxiv.org/abs/2402.14992) |
| Latency-Response Theory Model: Evaluating Large Language Models via Response Accuracy and Chain-of-Thought Length | arXiv · 正式发表状态未复核 | [Source](https://arxiv.org/abs/2512.07019) |
| Knowing When to Stop: Bayesian Optimal Stopping for LLM Evaluations | arXiv · 正式发表状态未复核 | [Source](https://arxiv.org/abs/2608.14425) |
| Direct Preference Optimization: Your Language Model is Secretly a Reward Model | NeurIPS 2023 | [Source](https://proceedings.neurips.cc/paper_files/paper/2023/hash/a85b405ed65c6477a4fe8302b5e06ce7-Abstract-Conference.html) |
| A General Theoretical Paradigm to Understand Learning from Human Preferences | arXiv · 正式发表状态未复核 | [Source](https://arxiv.org/abs/2310.12036) |
| Principled Reinforcement Learning with Human Feedback from Pairwise or $K$-wise Comparisons | arXiv · 正式发表状态未复核 | [Source](https://arxiv.org/abs/2301.11270) |
| Direct Preference Optimization with Unobserved Preference Heterogeneity: The Necessity of Ternary Preferences | arXiv · 正式发表状态未复核 | [Source](https://arxiv.org/abs/2510.15716) |
| A Watermark for Large Language Models | ICML 2023（arXiv 作者说明） | [Source](https://arxiv.org/abs/2301.10226) |
| A Statistical Framework of Watermarks for Large Language Models: Pivot, Detection Efficiency and Optimal Rules | Annals of Statistics 接收（arXiv 作者说明；卷期未复核） | [Source](https://arxiv.org/abs/2404.01245) |
| Optimal Detection for Language Watermarks with Pseudorandom Collision | arXiv · 正式发表状态未复核 | [Source](https://arxiv.org/abs/2510.22007) |
| Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters | arXiv · 正式发表状态未复核 | [Source](https://arxiv.org/abs/2408.03314) |
| Optimal Stopping vs Best-of-$N$ for Inference Time Optimization | arXiv · 正式发表状态未复核 | [Source](https://arxiv.org/abs/2510.01394) |
| Many-Shot In-Context Learning | arXiv · 正式发表状态未复核 | [Source](https://arxiv.org/abs/2404.11018) |
| Transformers as Statisticians: Provable In-Context Learning with In-Context Algorithm Selection | arXiv · 正式发表状态未复核 | [Source](https://arxiv.org/abs/2306.04637) |
| Hypothesis Testing the Circuit Hypothesis in LLMs | arXiv · 正式发表状态未复核 | [Source](https://arxiv.org/abs/2410.13032) |
| Self-Instruct: Aligning Language Models with Self-Generated Instructions | ACL 2023（arXiv 作者说明） | [Source](https://arxiv.org/abs/2212.10560) |
| Conformal Language Modeling | ICLR 2024（arXiv 作者说明） | [Source](https://arxiv.org/abs/2306.10193) |
| AutoEval Done Right: Using Synthetic Data for Model Evaluation | ICML 2025 | [Source](https://proceedings.mlr.press/v267/boyeau25a.html) |
| The Alternative Annotator Test for LLM-as-a-Judge: How to Statistically Justify Replacing Human Annotators with LLMs | ACL 2025 | [Source](https://aclanthology.org/2025.acl-long.782/) |
| Efficient Inference for Noisy LLM-as-a-Judge Evaluation | ICML 2026 | [Source](https://proceedings.mlr.press/v306/chen26cq.html) |
| Generative Augmented Inference | ICML 2026 | [Source](https://proceedings.mlr.press/v306/lu26am.html) |
| General Synthetic-Powered Inference | ICML 2026 | [Source](https://proceedings.mlr.press/v306/bashari26a.html) |
| PIPA: Preference Alignment as Prior-Informed Statistical Estimation | ICML 2025 | [Source](https://proceedings.mlr.press/v267/li25cl.html) |
| On the Algorithmic Bias of Aligning Large Language Models with RLHF: Preference Collapse and Matching Regularization | JASA 120(552), 2154–2164 · 2025 | [Source](https://www.tandfonline.com/doi/abs/10.1080/01621459.2025.2555067) |
| DavIR: Data Selection via Implicit Reward for Large Language Models | ACL 2025 | [Source](https://aclanthology.org/2025.acl-long.452/) |
| Prediction-Powered Adaptive Inference with Pretrained AI Models for Contextual Bandits | ICML 2026 | [Source](https://proceedings.mlr.press/v306/sargent26a.html) |
| RouteLLM: Learning to Route LLMs with Preference Data | ICLR 2025 | [Source](https://proceedings.iclr.cc/paper_files/paper/2025/file/5503a7c69d48a2f86fc00b3dc09de686-Paper-Conference.pdf) |
