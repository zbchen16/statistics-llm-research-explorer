# 统计 × 大模型：教程导读与研究探索

整理日期：2026-09-30。范围：无需预训练；专门 UQ 低优先级。

## 教程是什么

用户提供的 PDF 是 Ji 等人的《An Overview of Large Language Models for Statisticians》，arXiv:2502.17814v1，2025-02-25，共 67 页；正文到第 35 页，参考文献约在 35–61 页，附录在 62–67 页。它是领域综述，不能把列出的宽泛 future research 直接等同于今天尚未解决的选题。

原文链接：https://arxiv.org/abs/2502.17814

## 核心总结

两条主线：Statistics for LLMs（统计方法帮助评测、对齐、检测和理解模型）；LLMs for Statistics（模型帮助抽取变量、标注与分析数据，再以统计方法纠正误差）。对你而言，最有用的转变是从“研究某一种工具”转向“先确定具体统计问题和数据机制”。

### §1–2 · pp.2–8：基础语言与评测｜快速读

语言模型是条件分布；token、embedding、Transformer 与评测基准构成共同语言。

理解输入、输出与能访问的信号即可；不必先掌握整套架构证明。

### §3.1 · pp.8–11：预训练与 scaling laws｜跳过研究

介绍训练目标、语料与规模规律。

按资源约束，不进入预训练、扩参数或大规模数据配比实验。

### §3.2–3.4 · pp.11–15：固定模型如何适应任务｜重点读

Prompt/ICL 在上下文中给例子；SFT/LoRA 更新少量参数；CoT 与多候选生成增加推理计算。

连接实验设计、样本效率、低秩估计、序贯决策；“不预训练”仍有很大空间。

### §3.5–3.6 · pp.15–18：偏好优化与自对齐｜重点读

RLHF、DPO、合成指令和自评审；奖励错设、评审偏差与数据多样性是主要难点。

核心不是把 loss 改一个符号，而是明确偏好是谁的、观测怎样来、奖励代理哪里错。

### §4.1 · pp.19–20：不确定性量化｜少量选读

置信度、conformal prediction 和幻觉检测，并讨论信心与事实正确性之间的落差。

只保留一篇专门 UQ 论文。统计区间和错误控制仍可作为评测、抽样与决策的工具。

### §4.2 · pp.20–22：水印与统计检测｜理论重点

在生成过程植入信号，通过枢轴统计量控制误报、研究最优检测；讨论编辑、混合片段和碰撞。

适合检验理论切入；有密钥的水印检测不等于通用 AI 文本鉴定。部分开放问题已有 2025 后续工作。

### §4.3–4.5 · pp.23–28：隐私、可解释性与公平｜选择性读

涵盖遗忘、隐私保护、特征与电路、群体差异及后处理。

优先看 §4.4 的电路检验；隐私训练和大规模 SAE 暂不作为起步主线。

### §4.6 · pp.28–29：对齐的统计视角｜精读

把偏好看作 BTL/PL 等比较数据，研究 MLE、覆盖条件与样本复杂度；讨论自生成数据反馈。

从低维奖励模型和偏好数据着手，后续再考虑小规模后训练。

### §5 · pp.29–33：大模型作为统计分析工具｜精读 §5.3

从非结构化文本抽变量、生成数据、清洗与分析；§5.3 重点介绍 PPI：不能把模型标签直接当真值。

最直接的低资源路线：可信测量、偏差校正和标注设计。医疗应用作为动机，不据此给临床建议。

### §6 · pp.33–35：统计学家的位置｜重点读

讨论小模型、黑箱模型外的校正方法、ICL 理论及人机协作中的反馈与分布变化。

按你的资源约束，选择已有模型上的统计层；kernel 和 learning theory 在需要时作为工具。

## 我的建议与原文结论的区别

优先试做评测与排序或标注校正；若更偏证明，考虑水印检测；若愿意做后训练，再推进偏好学习。这个优先级是结合你的约束作出的判断，不是综述作者的排名。UQ 不作为主线，但不把置信区间、功效分析或可靠决策都排除掉。

不要将“kernel 太老”理解为工具无效：问题的重要性、假设的现实性和可验证的贡献比工具年代更关键。目前无需先补完 kernel 全套课程。

## 研究题目卡

以下都是待验证候选问题，不声称首创；所有样本量和预算为建议实验设计，尚未运行实验。

### 新模型族到来后，少量题目还能可靠排序吗？

**动机**：模型更新很快，完整评测贵；固定的小题库可能对旧模型有效、对新模型失效。省预算同时减少错误选型，是明确的实际价值。

**统计问题**：在目标题目分布 Q 与 token 预算 B 下，估计模型之间的性能差 Δ，而不仅是单模型平均分；控制错误选出更差模型的概率。

**与已有工作的边界**：候选切口：在留出整个模型家族、题目主题或推理风格的情况下，以少量目标域校准题修复排名。查新时必须对照 tinyBenchmarks、LaRT 与序贯评测工作；单纯 IRT 或“正确率加长度”已有人做。

**最小实验**：先使用公开的逐题响应矩阵，按模型家族而非随机模型切分。预算取 50/100/200 题；比较均匀抽题、主题分层、tinyBenchmarks、目标域校准。若原数据不完整，再对 2–3 个现成小模型各跑 300 题。

**评价指标**：成对误排序率、全基准分数估计 MSE、最差主题误差、总 token/调用成本；按题目或主题做成簇重采样。

**理论目标**：在有限低秩或潜变量结构、可控分布漂移下，研究排序风险与目标域校准样本数的关系。

**停止条件**：若分层随机抽题已经同样好，或优势仅来自测试题泄漏，就停止增加复杂度；先确认跨家族失效是否真实稳定。

**资源**：第一阶段 CPU + 已有响应；后续才需要推理预算。无需训练 LLM。

**工具**：抽样设计、IRT、低秩估计、域适应。Kernel/MMD 只有在需要测量分布变化时再加入。

关联论文：tinyBenchmarks: evaluating LLMs with fewer examples, Latency-Response Theory Model: Evaluating Large Language Models via Response Accuracy and Chain-of-Thought Length, Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference, Knowing When to Stop: Bayesian Optimal Stopping for LLM Evaluations

### 模型更新后，旧人工标注还能复用多少？

**动机**：同一批文本可能反复被不同版本的 LLM 标注。每次从头人工核查浪费，盲目沿用旧校准又可能引入偏差。

**统计问题**：固定目标总体中的均值或回归参数，观察多个版本的代理标签，决定新一轮人工标签抽给哪些样本、旧校准何时失效。

**与已有工作的边界**：候选切口是模型更新、校准复用和选择性审计共同出现的情形。多代理最优分配已有 MultiPPI，跨任务共享已有新 PPI 工作；必须找到现有假设不覆盖的可观测更新机制。

**最小实验**：从带真实标签的文本数据中只暴露 50/100/200 个标签，其他标签仅作为离线真值。对 2 个版本或 2 套固定 prompt 生成代理标签。比较人工均值、naive plug-in、PPI++、主动推断及 MultiPPI 可用实现。

**评价指标**：点估计偏差、RMSE、人工标签预算、覆盖率与漂移后的恢复速度。覆盖率在这里用于检查统计结论是否失真。

**理论目标**：先明确标签抽样概率已知且正、预测器固定或交叉拟合等条件，再考虑随时间更新的校正量及方差。

**停止条件**：如果已有 MultiPPI/多任务 PPI 在该设定已直接适用，换切口；若代理标签与真值几乎无关，先解释无收益边界。

**资源**：CPU 仿真 + 缓存 LLM 标注。昂贵部分是可信人工标签；可先用公开真值验证。

**工具**：半监督估计、控制变量、交叉拟合、序贯设计。不能用更多有偏合成标签冒充真值。

关联论文：Prediction-Powered Inference, PPI++: Efficient Prediction-Powered Inference, Using Imperfect Surrogates for Downstream Inference: Design-based Supervised Learning for Social Science Applications of Large Language Models, Active Statistical Inference, Multiple-Prediction-Powered Inference, Prediction-Powered Inference Across Many Tasks for AI Evaluation & Social Science Research

### 偏好分歧来自标注噪声，还是不同用户？

**动机**：把不同用户的真实分歧全部当噪声，会得到对谁都不理想的平均奖励。它影响训练目标，也影响模型评价。

**统计问题**：研究少量重复标注下，随机错误与潜在用户类型能否区分；比较不同问法和比较集合带来的识别信息。

**与已有工作的边界**：异质性与三元比较已有专门工作。候选切口可收窄到预算约束下的重复标注设计、允许平局、用户类型变化；先逐项核对已有识别结果。

**最小实验**：先用 2 类或 3 类混合 Bradley–Terry 模型造数据，改变用户重复次数、平局率、标签翻转率。比较 pooled BT、混合 BT、异质偏好论文的方法；确认现象后再做一个小模型 LoRA/DPO 验证。

**评价指标**：参数恢复、留出用户预测对数损失、各群体效用、最差群体 regret，以及标注成本。

**理论目标**：可识别性、信息下界和样本复杂度；先证明无法区分的情形，往往比先设计新损失更有价值。

**停止条件**：真实数据若没有用户标识或重复比较，无法支持想证明的识别问题；不要用任意聚类标签充当真实偏好类型。

**资源**：理论和 CPU 模拟即可起步；完整后训练验证需要 GPU，具体显存取决于模型、序列长度和量化设置。

**工具**：随机效用、混合模型、M-estimation、learning theory。Kernel 不作为题目起点。

关联论文：Direct Preference Optimization: Your Language Model is Secretly a Reward Model, A General Theoretical Paradigm to Understand Learning from Human Preferences, Principled Reinforcement Learning with Human Feedback from Pairwise or K-wise Comparisons, Direct Preference Optimization with Unobserved Preference Heterogeneity: The Necessity of Ternary Preferences

### 局部编辑和重复文本下，水印证据如何合并？

**动机**：实际文档可能由多个片段拼接，还可能出现重复句子；全篇单次检验的理想条件容易被破坏。

**统计问题**：在明确给定的水印机制、编辑模型和密钥可用条件下，研究未知片段位置的扫描检测及全局误报控制。

**与已有工作的边界**：碰撞、片段定位都已有工作，不能直接宣称空白。候选交集是相关结构、未知位置与多次查询的联合控制；还需系统检索扫描检测与序贯水印论文。

**最小实验**：先对 token 概率和密钥随机量作仿真，控制片段长度、重复率及随机删除率。比较原始检验、去重规则、collision-aware 检验与 Bonferroni 扫描基线，再用一个开源模型生成少量文本。

**评价指标**：固定显著性水平下的实际误报率、功效、最短可检测片段长度和定位误差。

**理论目标**：minimax 检測边界、扫描统计量、依赖结构、可选停止；不能假设真实 token 独立同分布来省略关键问题。

**停止条件**：若算法只在独立模拟中成立，或强改写后信号已不存在，不把失败解释为实现问题；明确可检测边界。

**资源**：以理论和 CPU 仿真为主；真实文本验证仅需推理。必须能控制生成/密钥，普通黑箱 API 未必支持。

**工具**：假设检验、大偏差、经验过程；这是现有统计训练能直接转化的方向。

关联论文：A Watermark for Large Language Models, A Statistical Framework of Watermarks for Large Language Models: Pivot, Detection Efficiency and Optimal Rules, Optimal Detection for Language Watermarks with Pseudorandom Collision

### 验证器有偏时，继续生成一次还值不值？

**动机**：多生成候选答案会花钱，也可能让奖励模型选中更会迎合评分但更差的答案。成本与最终成功率要一起评价。

**统计问题**：给定任务分布与成本预算，学习继续采样、修正答案或停止的规则；目标是实际正确率或独立人评效用。

**与已有工作的边界**：最优停止本身已有论文。候选切口是有偏验证器或相关的自我修正轨迹；需检查已有 stopping 方法是否允许这种相关和奖励误差。

**最小实验**：固定两个已有模型与一个验证器，选 200–500 道可自动核验的题，缓存每题至多 16 条答案。用独立验证集选阈值，比较固定 best-of-N、多数投票、现有最优停止方法和新规则。

**评价指标**：成功率–token 成本曲线、每个正确答案成本、不同难度组的退化；将评审成本也计入。

**理论目标**：部分可观测序贯决策、最优停止、相关奖励下的 regret 或代价界。

**停止条件**：若“收益”来自给新方法更多 token 或把真实答案当在线奖励，就是无效比较；先保证公平预算。

**资源**：无需训练，但多次采样可能昂贵；先离线重放缓存轨迹。

**工具**：bandit、序贯分析、决策论。可把 UQ 作为停止决策工具，而非独立卖点。

关联论文：Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters, Optimal Stopping vs Best-of-N for Inference Time Optimization, Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena

### 挑选过的模型电路，如何再做可靠验证？

**动机**：解释研究常先筛选“有用”的节点，再在同一数据上报告显著效果；容易把选择过程当成不存在。

**统计问题**：区分发现集与检验集，并研究不同消融/替换分布下，电路忠实性结论是否稳定。

**与已有工作的边界**：电路假设检验已有框架。候选问题是选择后有效性和干预分布敏感性；必须与已有 circuit-testing 和 optimal-ablation 文献对照。

**最小实验**：复现一个公开小模型电路；比较同数据发现/检验、样本分割、交叉拟合，再改变替换激活的构造。

**评价指标**：人工植入电路上的误报与功效、不同拆分稳定性、任务行为保留程度；真实电路没有可直接观测的完整金标准。

**理论目标**：选择性推断、多重检验、干预型 estimand；明确检验的是行为保持还是机制因果解释。

**停止条件**：如果无法定义可信的干预或目标行为，先退回评测问题，不靠漂亮的激活图得结论。

**资源**：需要开放权重和内部激活访问；小模型可起步，工程成本高于前两个方向。

**工具**：因果思维、非参数检验、选择后推断。

关联论文：Hypothesis Testing the Circuit Hypothesis in LLMs

## 四周阅读路线

### 第一周：建立共同语言

读教程 §3.2–3.5、§4.6、§5.3；读 tinyBenchmarks、PPI 与 DPO 的问题设定。

产出：写一页对照：数据从哪来、估计什么、需要什么假设、什么算成功。

### 第二周：只复现一条线

首选 tinyBenchmarks 的公开 demo；或用真实标签隐藏实验比较 naive、人工均值和 PPI++。

产出：输出一张预算–误差图与一张跨模型族/跨主题失效图。先不训练 LLM。

### 第三周：查近邻与缩题

评测线读 LaRT、序贯评测；标注线读 MultiPPI；偏好线读异质偏好识别。

产出：写清你相对最近论文究竟改变了哪个假设。没有差异就换问题。

### 第四周：形成可讨论的研究提案

选一个可证明的简化模型和一个真实任务。与老师讨论数学问题、数据可得性及计算上限。

产出：2 页提案：estimand、已有结果、候选命题、最小实验、失败标准。

## 25 篇论文

年份以首次公开为主，发表年份或修订日期另注明；预印本不等于已经同行评审。已核验题录、摘要或作者论文页面，未逐条审计所有证明、也未运行作者代码。

### Prediction-Powered Inference

Angelopoulos, Bates, Fannjiang, Jordan & Zrnic｜Science 2023｜标注与推断｜无需训练

https://arxiv.org/abs/2301.09633

少量真实标签用于纠正大量模型预测的偏差，目标是总体均值、分位数或回归系数，而不是让模型回答更自信。

统计工具：半监督估计、偏差校正、控制变量。

怎样读：先推导均值估计量，再看回归参数的推广；追踪真实标签究竟校正了什么。

限制：模型预测不等于真实标签；依赖标注与未标注样本的抽样条件，不能直接外推到任意分布漂移。

教程关联：教程 §5.3，p.31 直接讨论。

作者代码：https://github.com/aangelopoulos/ppi_py

### PPI++: Efficient Prediction-Powered Inference

Angelopoulos, Duchi & Zrnic｜arXiv 2023 / v2 2024｜标注与推断｜无需训练

https://arxiv.org/abs/2311.01453

通过 power tuning 调节预测信息的权重，改进 PPI 的计算和统计效率。

统计工具：M-estimation、渐近方差、最优权重。

怎样读：把 λ=0、λ=1、数据估计的 λ 放在同一张 MSE 图里。

限制：效率比较须放在论文的正则条件和渐近框架内；不意味着每次有限样本实验都优于人工标签均值。

教程关联：教程 §5.3，p.31 直接讨论。

作者代码：https://github.com/aangelopoulos/ppi_py

### Using Imperfect Surrogates for Downstream Inference: Design-based Supervised Learning for Social Science Applications of Large Language Models

Egami, Hinck, Stewart & Wei｜NeurIPS 2023｜标注与推断｜无需训练

https://arxiv.org/abs/2306.04746

研究把 LLM 标注用于社会科学回归时产生的偏差，以抽样设计和少量高质量标签进行纠正。

统计工具：双重稳健、设计型推断、交叉拟合、测量误差。

怎样读：对照“LLM 标签直接回归”和 DSL，理解高分类准确率为什么不保证回归结论正确。

限制：需要真实标签抽样机制和目标总体的明确界定；预测准确率不能代替推断有效性。

教程关联：教程 §5.3 引用；本地综述参考文献的年份写作 2024，本站采用论文首次年份 2023。

### Active Statistical Inference

Zrnic & Candès｜arXiv 2024｜标注与推断｜无需训练

https://arxiv.org/abs/2403.03208

标注预算固定时，把人工工作分配给更能改善目标参数估计的样本。

统计工具：主动抽样、重要性加权、自适应数据收集。

怎样读：读抽样概率如何进入估计与方差；比较按预测困难度抽样与按估计贡献抽样。

限制：自适应选择后直接用普通样本均值会产生偏差；必须保留抽样概率和必要的探索。

教程关联：沿教程 §5.3 与 §6.3 延伸。

### Multiple-Prediction-Powered Inference

Cowen-Breen et al.｜ICLR 2026（arXiv 页面注明）｜标注与推断｜无需训练

https://arxiv.org/abs/2603.27414

将多个成本、误差相关性不同的代理测量合并，联合考虑资源分配与估计效率。

统计工具：多源估计、预算分配、相关结构、minimax。

怎样读：先读问题设定和成本模型，再对照单预测器 PPI；适合做当前方法基线。

限制：“多个 judge + 最优预算分配”已有系统工作，不能仅靠这个组合主张新颖性。

教程关联：2026 更新：教程发表之后的近邻工作。

### Prediction-Powered Inference Across Many Tasks for AI Evaluation & Social Science Research

Emmenegger, Stahler & Podimata｜arXiv 预印本 · 2026.05｜标注与推断｜无需训练

https://arxiv.org/abs/2605.29249

利用相关任务之间的校准结构，改善每个任务只有少量真实标签时的推断。

统计工具：跨任务共享、非线性校准、任务内校正。

怎样读：关注跨任务重校准相对 power-tuned PPI 的收益条件。

限制：论文在其框架内指出仿射校准不带来额外渐近收益；需细读条件，不能泛化成所有多任务方法的结论。

教程关联：2026 更新；目前按摘要与原文元信息筛选，未逐条审计证明。

### Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena

Zheng et al.｜NeurIPS 2023 Datasets & Benchmarks｜评测与排序｜无需训练

https://arxiv.org/abs/2306.05685

研究用 LLM 评价开放式回答的可行性，同时揭示位置、冗长和自我偏好等偏差。

统计工具：测量偏差、配对实验、评审一致性。

怎样读：先读偏差实验，把候选答案位置随机化；保留人类参照。

限制：与人类的一致率依赖数据与 judge；不能把单个百分比当成普遍准确率或金标准。

教程关联：教程 §3.6.3、§5.2，pp.18、30。

### Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference

Chiang et al.｜arXiv 2024｜评测与排序｜无需训练

https://arxiv.org/abs/2403.04132

从匿名成对比较收集人类偏好，建立模型评估与排序流程。

统计工具：Bradley–Terry、成对比较、抽样与排名。

怎样读：区分“目标用户群体的胜率”与“总体排行榜分数”；看估计与排序如何连接。

限制：用户自选择和问题分布都会影响榜单；公开投票不天然代表目标应用人群。

教程关联：沿教程 §2.3 与 §4.6 延伸。

### tinyBenchmarks: evaluating LLMs with fewer examples

Maia Polo et al.｜ICML 2024｜评测与排序｜无需训练

https://arxiv.org/abs/2402.14992

用经过挑选的少量题目及 IRT 等估计方法，近似完整基准表现。

统计工具：项目反应理论 IRT、低维结构、抽样估计。

怎样读：从作者 MMLU demo 入手，研究新模型的完整得分如何被预测。

限制：100 道题是论文特定基准的实证结果，不是任意模型和新领域的保证；题目与模型划分很关键。

教程关联：对教程 §2.3 评测问题的统计延伸。

作者代码：https://github.com/felipemaiapolo/tinyBenchmarks

### Latency-Response Theory Model: Evaluating Large Language Models via Response Accuracy and Chain-of-Thought Length

Xu, Liu, Wang & Gu｜arXiv · v4 更新于 2026.08｜评测与排序｜无需训练

https://arxiv.org/abs/2512.07019

联合建模答题正确性与推理链长度，以潜在能力和速度刻画 LLM 表现。

统计工具：潜变量、可识别性、EM、测量模型。

怎样读：对比 IRT 与 LaRT 的观测模型；特别看长度信息何时改善估计。

限制：CoT token 长度不等于实际延迟；跨模型 tokenizer、截断和不可见推理会影响可比性。

教程关联：教程之后的新工作；“正确率加推理长度”已有明确方法。

作者代码：https://github.com/Toby-X/Latency-Response-Theory-Model

### Knowing When to Stop: Bayesian Optimal Stopping for LLM Evaluations

Toby D. Pilditch｜arXiv 预印本 · 2026.08｜评测与排序｜无需训练

https://arxiv.org/abs/2608.14425

用分层贝叶斯模型和精度驱动的停止规则分配评测重复次数。

统计工具：序贯设计、分层模型、停止规则。

怎样读：关注目标精度、近零正确率情形和回溯评测流程。

限制：摘要中的节省比例来自特定验证设置；后验精度不自动等于任意停止下的频率学保证。

教程关联：近期相邻工作；用于查新，不作为已确立的普遍结论。

### Direct Preference Optimization: Your Language Model is Secretly a Reward Model

Rafailov et al.｜arXiv 2023 / v3 2024｜偏好与后训练｜小规模后训练

https://arxiv.org/abs/2305.18290

借助奖励和策略之间的重参数化，直接用成对偏好训练策略。

统计工具：逻辑回归形式、Bradley–Terry、KL 正则。

怎样读：手推从 KL 正则奖励最大化到 DPO 损失；明确 reference policy 的作用。

限制：无需单独拟合奖励模型不等于没有统计假设；偏好噪声、覆盖和参考模型仍然重要。

教程关联：教程 §3.5，pp.15–16；§4.6，p.28。

### A General Theoretical Paradigm to Understand Learning from Human Preferences

Azar et al.｜AISTATS 2024（首发 2023）｜偏好与后训练｜小规模后训练

https://arxiv.org/abs/2310.12036

以 ΨPO 统一分析偏好优化，并提出 IPO，审视把成对偏好转换为点式奖励的近似。

统计工具：偏好建模、目标错设、正则化。

怎样读：对照 DPO 的目标，关注确定性偏好和过拟合等示例。

限制：不要把示例上的优势写成对所有 LLM 任务的统一改进。

教程关联：教程 §3.5 与参考文献直接涉及。

### Principled Reinforcement Learning with Human Feedback from Pairwise or K-wise Comparisons

Zhu, Jiao & Jordan｜arXiv 2023 / v5 2024｜偏好与后训练｜理论／小模拟

https://arxiv.org/abs/2301.11270

在线性奖励和 BTL/PL 模型下分析 MLE、悲观估计及成对和多元比较的效率。

统计工具：样本复杂度、MLE、覆盖条件、离线学习。

怎样读：先读线性奖励设定和覆盖条件，再看为什么奖励估计好不自动带来好策略。

限制：结论依赖结构假设；不要把线性模型的界直接解释成完整 Transformer 的界。

教程关联：教程 §4.6，p.28 的主要理论线。

### Direct Preference Optimization with Unobserved Preference Heterogeneity: The Necessity of Ternary Preferences

Chidambaram, Seetharaman & Syrgkanis｜arXiv 预印本 · 2025.10｜偏好与后训练｜小规模后训练

https://arxiv.org/abs/2510.15716

研究潜在用户偏好异质性的可识别性，并以 EM 型 DPO 和聚合方法建模不同类型。

统计工具：混合模型、可识别性、随机效用、minimax regret。

怎样读：先读二元比较的识别困难与三元排序的条件，再考虑是否有真实的重复用户标注。

限制：三元偏好和异质性不是空白；真实匿名数据未必保留识别所需信息。

教程关联：教程之后的重要近邻工作。

### A Watermark for Large Language Models

Kirchenbauer et al.｜ICML 2023｜水印与检测｜开源模型推理

https://arxiv.org/abs/2301.10226

在生成阶段轻微调整 token 选择，使持有相应检测机制的人能检验水印信号。

统计工具：假设检验、检测功效、质量与可检测性权衡。

怎样读：理解 green/red list 的随机化与检测统计量，不必重训模型。

限制：水印检测需要相应生成方案；它不能识别所有未加水印的 AI 文本。

教程关联：教程 §4.2，pp.20–22。

### A Statistical Framework of Watermarks for Large Language Models: Pivot, Detection Efficiency and Optimal Rules

Li, Ruan, Wang, Long & Su｜Annals of Statistics 2025（首发 2024）｜水印与检测｜理论／小模拟

https://arxiv.org/abs/2404.01245

用枢轴统计量控制误报，并在给定框架中推导高效及 minimax 意义下的检测规则。

统计工具：枢轴量、大偏差、minimax 检验。

怎样读：从零假设的已知分布开始，读备择集合怎样决定最优得分函数。

限制：最优性取决于 watermark 机制及参数集合；编辑和相关性需重新分析。

教程关联：教程 §4.2 的核心统计框架，p.21。

### Optimal Detection for Language Watermarks with Pseudorandom Collision

Cai, Li, Long, Su & Wen｜arXiv 预印本 · 2025.10｜水印与检测｜理论／小模拟

https://arxiv.org/abs/2510.22007

把重复文本导致的伪随机碰撞视为结构依赖，通过最小独立单元构建检测规则。

统计工具：依赖数据、非渐近效率、minimax 检验。

怎样读：看独立单元的构造及其与直接去重的关系。

限制：教程将碰撞列为挑战，但已有后续论文；“考虑重复 token”本身不足以成为新贡献。

教程关联：更新教程 p.22 提出的开放问题。

### Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters

Snell, Lee, Xu & Kumar｜arXiv 2024｜推理与决策｜开源模型推理

https://arxiv.org/abs/2408.03314

研究怎样按问题难度分配推理预算，并比较搜索、验证与迭代修正。

统计工具：计算资源分配、决策论、异质处理效果。

怎样读：把模型和总 token 预算固定，再比较不同策略；留意验证器自身成本。

限制：原文部分方法涉及训练或专用验证器；入门实验只复用现成模型与验证器。

教程关联：教程 §3.4，pp.14–15。

### Optimal Stopping vs Best-of-N for Inference Time Optimization

Kalayci, Raman & Dughmi｜arXiv 预印本 · 2025.10｜推理与决策｜开源模型推理

https://arxiv.org/abs/2510.01394

把每次生成视作带成本的随机奖励观测，用 Pandora’s Box 和 UCB 思路决定何时停止。

统计工具：最优停止、bandit、奖励归一化。

怎样读：读分布假设、停止阈值估计与固定 best-of-N 的对照。

限制：奖励模型分数不是最终任务正确性；独立采样与自适应修正轨迹需要区分。

教程关联：沿教程 inference-time scaling 延伸；最优停止已有基础工作。

### Many-Shot In-Context Learning

Agarwal et al.｜NeurIPS 2024｜ICL 与学习理论｜开源模型推理

https://arxiv.org/abs/2404.11018

在上下文中增加大量示例以适配任务，无需更新模型参数。

统计工具：上下文样本效率、例子选择、任务适应。

怎样读：先读示例来源与学习曲线，比较固定 token 预算下的示例选择。

限制：长上下文不是免费；结果依赖任务、模型和示例质量。

教程关联：教程 §3.2，p.12。

### Transformers as Statisticians: Provable In-Context Learning with In-Context Algorithm Selection

Bai, Chen, Wang, Xiong & Mei｜教程列 NeurIPS 2024；首发 2023｜ICL 与学习理论｜理论／小模拟

https://arxiv.org/abs/2306.04637

构造能在上下文内执行回归、Lasso 等算法并选择算法的 Transformer，连接 ICL 与统计学习。

统计工具：近似理论、算法选择、泛化与样本复杂度。

怎样读：只读 ICL 构造与算法选择部分；不安排预训练实验。

限制：构造性存在结果不证明任意现成 LLM 实际采用该算法；原文也含预训练分析，此处跳过。

教程关联：教程 §6.2，p.34；作为 learning theory 的工具读物。

### Hypothesis Testing the Circuit Hypothesis in LLMs

Shi et al.｜NeurIPS 2024｜机制与合成数据｜开源模型推理

https://arxiv.org/abs/2410.13032

把电路是否保留行为、行为是否局部化、是否最小等主张转为可检验假设。

统计工具：非参数检验、干预实验、多重比较。

怎样读：先读检验对象与消融设计，再尝试作者的小模型电路示例。

限制：需要访问内部激活；同一数据上发现再验证电路会引入选择问题。

教程关联：教程 §4.4，p.25。

作者代码：https://github.com/blei-lab/circuitry

### Self-Instruct: Aligning Language Models with Self-Generated Instructions

Wang et al.｜ACL 2023（首发 2022）｜机制与合成数据｜小规模后训练

https://arxiv.org/abs/2212.10560

从少量种子指令出发生成、筛选训练指令，用于已有模型的指令微调。

统计工具：选择偏差、合成样本相关性、分布覆盖。

怎样读：只关注后训练数据生成与筛选；把合成数据看成有偏抽样产物。

限制：没有提供合成数据普遍有效的统计保证；不能把同一母题的改写当成独立新信息。

教程关联：教程 §3.6、§5.1；不收录预训练 model-collapse 路线。

作者代码：https://github.com/yizhongw/self-instruct

### Conformal Language Modeling

Quach et al.｜arXiv 2023｜UQ 少量选读｜无需训练

https://arxiv.org/abs/2306.10193

校准生成与筛选过程，让返回的答案集合以高概率包含可接受答案。

统计工具：Conformal prediction、风险控制、采样停止。

怎样读：只读问题定义与保证：返回集合的保证不等于单个答案正确。

限制：需要校准样本、可接受性定义及相应数据假设；分布漂移不能自动继承保证。

教程关联：对照教程 §4.1；按偏好仅保留这一篇专门 UQ 读物。

## 研究卫生

先固定 estimand 和目标人群，再谈估计方法。冻结模型版本、prompt、温度及预算；缓存响应。用于选方法的数据与最终评价分开；同一题的多次采样不能冒充独立题目。已有公开 benchmark 可能被模型见过，优先报告跨主题/跨模型族泛化并核查污染。更高 judge 分数不能自动当作真实效用改进。