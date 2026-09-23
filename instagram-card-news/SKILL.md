---
name: instagram-card-news
description: Create, plan, improve, analyze, or generate Instagram carousel/card-news posts and related blog expansions, especially Korean/Japanese food, snack, recipe, food trend, nostalgia, food culture/news, product, and benchmark-adaptation posts. Use when the user asks for 인스타 카드뉴스, 인스타 게시물, 캐러셀, 카드뉴스, 음식 뉴스 게시물, 간식 트렌드 게시물, 벤치마킹 게시물 분석, 한국어버전, 일본어버전, 네이버 블로그 글, 네이버 이미지 프롬프트, 첫 장 hook, 슬라이드 구성, 댓글 유도, 저장/공유 유도, 카드뉴스 이미지 기획, Gemini 이미지 프롬프트, JPG 카드 제작, 성과 분석, or ecommerce-detail-page-style cut planning adapted to Instagram posts instead of product detail pages.
---

# Instagram Card News

Use this skill to create Instagram carousel/card-news posts. The default account direction is Korean-language food/lifestyle content built for reach, saves, shares, comments, profile visits, blog traffic, affiliate potential, product interest, and future creator monetization.

Treat the work as an evidence-based editorial process, not a taste exercise. Use current sources, benchmark mechanics, audience demand, visual proof, and repeatable scoring to find topics people are likely to need, wonder about, debate, save, or send to someone.

## User-Specific Output Preference

When the user asks to make a provided benchmark into a Korean version, Korean adaptation, or says phrases like `한국어버전으로 만들어줘`, do **not** generate or assemble final image files unless the user explicitly asks for final JPG/PNG production. Default to showing the saved skill-style deliverables only: Gemini-ready image prompt(s), Instagram caption, hashtags, CTA, and risk/source notes. If the user mentions that images will be made in Gemini, never use image generation or local image composition tools; provide copy-paste-ready Gemini prompts instead. If writing a Gemini image prompt for a benchmark Korean-version card, include only the approved main in-image hook text. Do not add top labels, footer cautions, CTA text, source text, account handles, or optional text inside the image prompt unless the user explicitly asks for those exact words to appear on the image. Put disclaimers, caution notes, source notes, and CTA in the caption or notes section instead. State clearly in the prompt: `이미지 안에는 아래 메인 문구만 넣고, 다른 문구는 절대 넣지 않는다.` Before writing the Gemini prompt, treat the user-approved in-image copy as locked. Put only that locked copy in `Exact Korean text`; do not rewrite, expand, add labels, add footer notes, or mix in caption/disclaimer wording unless the user explicitly approves the changed in-image text.

For Korean-version benchmark adaptations, localize cultural fit proactively. Preserve the benchmark's practical function and save value, but automatically revise details that feel foreign, awkward, uncommon, or low-relevance for Korean viewers. Examples include replacing unfamiliar ingredients, rice types, units, equipment names, meal contexts, holiday references, pantry assumptions, taste descriptions, or CTA wording with Korean-natural alternatives. If the original detail is useful but niche, move the specific name to the caption or notes and use a broader Korean-friendly phrase in the image copy, such as changing `jasmine or basmati rice` to `고슬고슬한 밥` or `향 좋은 쌀` on-card. Do this without asking each time unless the change could alter the recipe result, safety, identity of the dish, or the user's approved in-image text; in those cases, state the tradeoff and keep the smallest necessary change.

For Korean benchmark-recipe carousels, add a concise `재료 미니 가이드` section in the Instagram caption only when it earns its space: a core ingredient is unfamiliar, easily mispurchased, unusually named, non-interchangeable with a look-alike, or safety-sensitive. Explain in plain Korean what the ingredient is, the exact search/purchase wording when useful, what look-alike product not to buy, and any food-grade distinction that affects safe use. For example, explain `세몰리나 가루` versus semolina pasta, and require `식용`/`식품용`/`식품첨가물` labeling for baking soda rather than cleaning-only products. Skip the guide for ordinary, self-explanatory recipes using familiar ingredients such as flour, sugar, eggs, milk, and butter unless a real confusion risk exists. Keep detailed explanations out of card images unless required for recipe safety.

For Korean benchmark-recipe units, convert to grams or milliliters only when the source unit and conversion are reliable. When the benchmark uses cups and an exact metric conversion is uncertain, retain the cup measure but state the measuring standard or the ratio in reader-friendly Korean, such as `설탕과 물을 같은 계량컵으로 각각 2½컵` and `설탕:물은 1:1`. Never present an unverified cup-to-gram conversion as exact.

Keep common recipe-unit explanations minimal. Do not add a separate blog paragraph explaining a familiar cup measure or a simple equal-volume ratio unless the user asks, the source measurement is genuinely ambiguous in a way that changes the result, or readers need it to avoid a demonstrated mistake. Prioritize the short ingredient line over explanatory prose; reserve mini-guides for unfamiliar, easily mispurchased, or safety-sensitive ingredients.

## User Workflow Memory

The user often works from one benchmark through this sequence:

1. Korean Instagram/card-news version.
2. Feedback and prompt refinement after Gemini outputs.
3. Japanese version using the same card count, order, information structure, and visual mechanism.
4. Captions and hashtags for Korean/Japanese Instagram.
5. Naver blog expansion with blog copy, category recommendation when useful, separate Naver image prompts, and Naver blog hashtags/tags.

When the user continues in this sequence, preserve decisions already made in the thread unless they explicitly change direction. Do not restart from a new angle, change the recipe/topic, or expand/shorten the card count without a reason. Treat the approved Korean card structure as the source of truth for the Japanese version and Naver blog expansion.

Default size rules for this workflow:

- Korean Instagram/card-news images: `1080 x 1350px` vertical.
- Japanese Instagram/card-news images: `1080 x 1350px` vertical.
- Naver blog images: `1200 x 900px` horizontal.
- State the correct size inside every image prompt. Do not mix Instagram carousel sizes with Naver blog image sizes.

For Naver blog expansions from a benchmark/card-news recipe:

- Blog images should normally be `1200 x 900px` horizontal unless the user requests another size.
- Recommend the number of images before writing prompts. For simple one-bowl recipes, default to 5 images: cover thumbnail, ingredients, key process 1, key process 2, final serving/use shot. For a dense recipe with several distinct actions, texture checkpoints, baking, syrup/sauce, or finishing, use 8-12 separate blog images instead; default to 10: cover, ingredients, dry mix, wet ingredient addition, final batter texture, pan/spread, scoring/garnish, baked result, syrup/sauce, and final pouring/serving. Count irreversible or reader-critical actions, not Instagram card count.
- Never compress several sequential recipe actions into one collage-style blog image merely because they appeared together in an Instagram card. Give each reader-critical action its own textless process photo and place it immediately beside the matching instruction.
- When a Naver blog recipe deliverable sets or recommends an image count, always include a matching, numbered image-prompt package in the same response unless the user explicitly asks for blog body text only. Provide exactly one copy-paste-ready `1200 x 900px` horizontal prompt per planned image, aligned with its placeholder and alt text. Keep process/final prompts textless; allow Korean text only on the cover and ingredient image when it improves the blog.
- When the Naver prompt package derives from a benchmark, prefix every prompt with the exact source attachment instruction, including image number and count. Map each distinct blog process image to the closest benchmark card rather than attaching all benchmark images by default.
- The Naver cover thumbnail may include one strong title line or two short lines in Korean for click appeal.
- The Naver ingredients image may include short Korean ingredient labels only when it improves understanding.
- For Naver ingredient images with labels, decide explicitly between `label-free mood shot` and `complete labeled ingredient shot`. If using labels, include every core recipe ingredient that appears visually and keep labels consistent with the blog recipe text; do not label only some items unless intentionally showing a partial ingredient group.
- For Korean recipe ingredient labels, use the exact recipe ingredient name when specificity matters: prefer `중력분` over generic `밀가루` when the recipe calls for all-purpose/medium flour, and include labels for small but important items such as `바닐라 익스트랙`, `소금`, `슈가파우더`, `초코 글레이즈`, `딸기 글레이즈`, and `스프링클` when they appear in the image.
- Process and final serving images should usually have no text, labels, logos, watermarks, UI, or brand names.
- Naver blog copy should carry the detailed explanation, cautions, storage notes, and step details; do not overload images with long text.
- For benchmark-recipe Naver blog posts, place a short `처음 보는 재료, 쉽게 알아보기` or equivalent mini-guide immediately after the ingredient list only when readers may confuse a core ingredient, buy the wrong product, make an unsafe purchase, or wrongly substitute a look-alike. Use short, reader-friendly paragraphs explaining what it is, how to search or select it, what not to substitute or accidentally buy, and food-grade distinctions for safety-sensitive products such as baking soda. Skip this section for simple recipes with familiar ingredients when it adds no useful decision support. Keep this guidance in body text, not inside process images.
- Naver blog deliverables must include copy-paste-ready hashtags/tags unless the user explicitly asks for body text only. Default to 10-15 tags.
- When category placement is relevant, recommend the most natural existing category first and suggest creating a new category only after enough similar posts accumulate.
- End Naver blog deliverables with a short publishing checklist unless the user explicitly asks for only the body text. Include category, cover image, body images, tags, and caution/storage notes.
- If the user first says images should have no text but later asks for a title or ingredient labels, follow the newer instruction and make the text exceptions explicit.

## Operating Modes

Choose the mode before producing output:

1. **Topic recommendation**: find or suggest fresh food-related topics, rank candidates, and select the strongest angle.
2. **Benchmark adaptation**: analyze screenshots, links, captions, OCR text, or examples and transform the reusable viral mechanism into original food content.
3. **Carousel planning**: create the slide-by-slide plan, Korean copy, visual direction, caption, hashtags, CTA, and risk notes.
4. **Gemini prompt package**: produce card-by-card image prompts with exact Korean text and strict readability/crop instructions.
5. **Final JPG production**: generate or assemble upload-ready 4:5 card images and package deliverables.
6. **Performance diagnosis**: analyze a weak or strong post using observable metrics and update future rules.

Do not ask the user to choose a mode when the request makes it obvious. Infer the mode and continue.

## Reference Loading

Load only the references needed for the current mode:

- Always read `references/monetization-viral-playbook.md` when creating, planning, improving, or analyzing posts.
- Before recommending or creating topics, read `references/used-topic-log.md` and avoid repeats unless the user asks for a remake, update, follow-up, or performance analysis.
- For carousel structures, hooks, layouts, and output-mode details, read `references/carousel-patterns.md`.
- For benchmark analysis or adaptation, read `references/benchmark-analysis.md` and search `references/benchmark-library.md` for the closest reusable mechanics.
- For originality, food/news claims, health/safety, copyright, and source notes, read `references/content-safety.md`.
- For performance learning, read or update `references/performance-learning-log.md`.

If a reference file is large, search headings or keywords first instead of loading the whole file.

## Core Editorial Rules

- Write in natural Korean unless the user asks otherwise.
- Build posts that make people swipe, save, share, or comment.
- Do not copy another account's wording, card order, images, or design expression. Borrow only the mechanism.
- Do not force every post into `~한 이유`, a three-reason explainer, or a final vote card.
- One card should carry one clear idea.
- Separate fact, context, and opinion.
- Verify current news, prices, rankings, laws/rules, platform policies, health/safety claims, and product details with sources.
- Do not invent statistics, rankings, prices, claims, quotes, or brand statements.
- If evidence is weak, mark the topic as `보류` or `리스크검증` rather than forcing it.

## Topic Discovery

When the user asks for 소재 추천, 오늘 올릴 인스타 소재, food news ideas, or fresh topics, browse or inspect timely source material by default. Consider Korean and global food culture/news/trends, unusual food histories, snack trends, restaurant trends, grocery/package changes, food science, creator food trends, safety/recall topics, nostalgia, and K-food expansion.

For each candidate, include:

```text
Evidence: source article/benchmark/trend signal.
Audience demand: why people would care now.
Viral trigger: primary trigger.
Swipe reason: why card 2 is wanted.
Comment/save/share reason: concrete action mechanism.
Visual direction: what the first card can show.
Risk: what must be verified or softened.
Status: 진행추천 / 보류 / 리스크검증 / 중복주의.
```

Reject boring topics before planning. A topic should have at least one of: surprise, tension, self-recognition, utility, debate, emotional reaction, visual proof, or status shift.

For ranked lists, include a compact copy-paste top-15 block:

```text
1. [score] Topic - source/benchmark - hook angle - status
```

## Viral Trigger System

Pick one primary trigger and optionally one secondary trigger before writing:

1. **Intellectual vanity or moral superiority**: viewers feel smarter, safer, or more aware.
2. **Empathy**: viewers feel understood through memory, comfort, struggle, nostalgia, or daily life.
3. **Belonging**: viewers recognize their generation, region, tribe, routine, or food fandom.
4. **Humor or meme**: viewers want to send it because it is funny, absurd, or painfully relatable.
5. **Cute**: viewers want to watch/share through cozy, small, soft, nostalgic, or charming visuals.

If no trigger is active, revise the topic or hook before writing cards.

## Cover Gate

Before approving card 1, ask whether a cold viewer would stop beside other viral thumbnails. The cover must make a specific viewer think one of these:

- "왜?"
- "나도 그런데"
- "이건 저장해야겠다"
- "누구한테 보내야겠다"
- "댓글 달고 싶다"

The cover should promise a payoff: hidden reason, reversal, surprising example, ranking, checklist, identity test, warning, or debate. If the viewer can answer "그런가 보다" and move on, rewrite the hook.

Do not let attractive AI food photography compensate for a weak idea.

For carousel posts, card 1 must be a curiosity-triggering cover, not a complete summary card. Do not reveal all items, all answers, full lists, full steps, or the whole payoff on the first card unless the user explicitly requests a one-page infographic. Use teaser visuals, partial reveals, a question, tension, warning, reversal, or save-worthy promise so viewers have a clear reason to swipe.

When adapting a benchmark cover, do not weaken the original hook. If the benchmark's first-card hook uses strong authority, ranking, superlatives, urgency, warning, or save-value language such as `BEST`, `TOP`, `most`, `worst`, `avoid`, or `must-know`, preserve that force in Korean unless there is a factual or safety reason to soften it. If you cannot create a stronger or more curiosity-driving Korean hook than the benchmark, translate and localize the benchmark's original hook meaning directly rather than replacing it with a milder generic question.

For list-style benchmark covers, prefer Korean hooks that keep the benchmark's promise of value, such as `최고의`, `베스트`, `꼭 알아둘`, `저장 필수`, `설탕 대신 쓰기 좋은`, or `자연 단맛 대체재 BEST 5`. Avoid weak cover lines that only ask `무엇을 넣을까?` or state a bland category unless paired with a stronger value promise.

For benchmark adaptation, the first image and first Korean text are the highest-priority output. Do not settle for a literal translation or polite information line. Generate at least 5 cover hook candidates first, then choose the strongest one using the cover gate.

When the user chooses or prefers a cover hook, keep that hook as the base instead of overriding it. Improve the surrounding card flow, image prompt, line breaks, emphasis, caption first line, and follow-up cards to make the chosen hook work harder.

Reject cover lines that only explain the topic, such as `~를 알고 있었나요?`, only when the user has not chosen that direction and the visual is not strong enough. If the user chooses an information-style curiosity hook, preserve it and strengthen the curiosity through the image, wording rhythm, and next-card payoff. Prefer hooks that create:

- disbelief: `이거 합성 아닙니다`
- broken assumption: `바나나는 노란색인 줄 알았는데`
- visual proof demand: `진짜인지 보려고 넘기게 되는 과일`
- contradiction: `파란데, 익으면 노래집니다`
- familiar object made strange: `우리가 아는 바나나랑 색이 다릅니다`
- simple challenge: `이 바나나 색, 믿기세요?`

Before finalizing card 1, write a one-line reason why the hook would beat a plain information hook.

## Benchmark Adaptation

When benchmark material is provided:

1. Analyze the hook mechanism, emotional trigger, swipe promise, retention structure, save/share reason, comment trigger, visual system, card count, and pacing.
2. Decide whether the mechanism transfers to food content.
3. Change the topic, angle, card order, Korean wording, examples, visuals, CTA, and caption.
4. Use original, provided, licensed, or AI-generated visuals. Do not reuse benchmark images unless rights are clear.
5. When the benchmark teaches a reusable mechanism, summarize and save the mechanism in `references/benchmark-library.md` so future outputs improve from accumulated examples.

If the user asks for a Korean version of a provided benchmark, treat the benchmark as the source structure, not merely inspiration. Preserve the benchmark's main subject, recipe/content scope, information categories, practical details, and save-value sections unless the user explicitly asks to simplify, reinterpret, or make only a hook/teaser. Do not change the main subject, such as replacing an egg-focused protein post with a general protein-food list, unless needed for accuracy or the user requests a broader angle.

Benchmark content preservation gate:

- Before planning cards, make a complete content inventory from the benchmark: title/name, subtitle/value phrase, ingredients with quantities, method steps, tips, variations, warnings, labels, CTA, source notes, and any visible practical detail.
- Mark each inventory item as `keep in image`, `move to caption`, `move to notes`, or `omit with reason`. Do not silently drop recipe quantities, process steps, tips, or variations.
- If the benchmark is a dense one-page recipe or infographic, expand the Korean carousel enough to preserve the information with mobile-readable text. Prefer 5-7 cards when the original contains complete ingredients, multi-step method, tips, and variations. Use 3 cards only when the source truly has a short ingredient list and one simple method block.
- Split recipe details by function rather than compressing them away: cover/result, complete ingredients, process part 1, process part 2, finishing/serving, tips/variations.
- When shortening method text for readability, preserve the functional cooking logic: ingredient groups, quantities, sequence, divided uses such as `ice 1 cup` vs `remaining ice`, paste/mixing steps, garnish, serving timing, and texture tips.
- In Gemini prompts, repeat the non-negotiable content for that card and include `Do not omit, change, or invent quantities/steps from Exact Korean text.`
- After writing the card table or prompts, run a final coverage check comparing the inventory against cards/caption/notes. If anything is missing, add it or state the omission reason.

### Mandatory Benchmark Detail QA (run before any deliverable)

Do not produce a Korean-version plan, prompt package, caption, or final image until this QA is complete. This is a blocking gate, not an optional review.

1. Read the supplied benchmark closely at full available resolution. Extract every visible factual/detail item into a source ledger: exact title and claims, all quantities/units, ingredient qualifiers, sequence verbs, temperatures/times, divided ingredients, serving ideas, tips, warnings, labels, CTA, and visual proof requirements.
2. For dense images, inspect each region separately (cover, ingredient panel, process thumbnails, tip/serving/footer areas). Never infer that a cropped or tiny detail is absent; mark it `unclear in source` and ask or preserve it in notes rather than inventing it.
3. Create an internal coverage matrix with one row per ledger item and the destination: `card n`, `caption`, `notes`, or `intentional omission + reason`. Check both the wording and the quantity/sequence, not merely the broad topic.
4. Reconcile conflicts before writing output. Preserve the source's functional recipe logic by default; make a Korean-localization or practical-safety adjustment only when needed, and label it clearly as `한국형 보정` rather than silently replacing the benchmark detail.
5. Before handoff, compare the finished deliverable back to the ledger line by line. A result fails QA if any actionable quantity, ingredient qualifier, method step, tip, variation, serving option, warning, or source CTA is missing without a stated destination/reason.

For recipe benchmarks, the final response must include a concise `원본 대조 검수` block before the deliverable that states: `확인한 항목`, `캡션으로 이동한 항목`, `한국형 보정`, and `의도적으로 제외한 항목(사유)`. Do not claim a benchmark has been fully reflected unless this comparison has been performed.

### Korean Reader Clarity Gate

Localize for immediate understanding, not literal terminology. Before finalizing Korean card copy, prompts, or captions, replace foreign, technical, retail-only, or uncommon Korean terms with the shortest everyday Korean wording that preserves the recipe result. Prefer `우유` over `전지우유`, `밀가루` over a flour-classification term when the distinction does not matter, and `식용유` over a named oil when the oil type does not affect the result.

- Keep a precise term only when changing it could alter safety, the recipe outcome, a purchase decision, or a required claim.
- If precision matters but the term may be unfamiliar, use plain Korean first and a short parenthetical only when useful, such as `우유(일반 흰우유)`; do not place a mini glossary on the card.
- Put a one- or two-sentence `재료 미니 가이드` in the caption only for genuinely confusing, easily mispurchased, non-interchangeable, or safety-sensitive ingredients. Do not explain familiar household ingredients.
- Run a final plain-language pass: a Korean reader with ordinary home-cooking experience must be able to buy the ingredient and follow the step without needing to search unfamiliar words. Rewrite any term that fails this test.
- Rewrite culinary jargon, direct translations, and vague negatives into an immediately actionable everyday sentence. For example, replace `팬을 너무 채우지 마세요` or `팬을 과밀하게 하지 마세요` with `한 번에 너무 많이 넣지 마세요` or `나눠서 튀기면 더 바삭해요`. Prefer showing the reader what to do over naming the cooking concept.

Default deliverables for benchmark adaptation:

- Korean-version carousel concept and card-by-card copy.
- Detailed AI image prompts for each card.
- Instagram caption for posting.
- Hashtags.
- Comment/save/share CTA.
- Originality and copyright-risk notes.

When writing image prompts from a benchmark, preserve the useful visual direction: mood, lighting, camera angle, composition logic, subject scale, color relationship, and editorial density. Do not attempt to recreate the exact image, exact subject identity, distinctive artwork, unique layout, logos, screenshots, or copied text. Make the prompt detailed enough to produce a similar-quality original scene, not a duplicate.

For every image prompt package based on user-provided benchmark cards, state the attachment mapping before each prompt in a clear format such as `첨부: 원본 벤치마킹 3.png 1장`. Select the single most relevant matching benchmark card by default. Use two references only when both are genuinely necessary for distinct visual facts, state why each is attached, and never attach the entire benchmark set to every prompt. When a blog has more process images than the benchmark has cards, reuse the closest source card for its matching substeps and state that mapping explicitly. If no benchmark image is useful for a planned card, state `첨부 없음` rather than guessing.

User preference: when the user provides benchmark material, stay close to the benchmark's concept unless they ask for a major reinterpretation. Preserve the concept, emotional rhythm, visual proof style, card pacing, and overall content type. Transform only what is needed for Korean audience fit, originality, factual accuracy, caption/hashtag usefulness, and copyright safety.

User preference for English-to-Korean benchmark versions: when the user asks to make a Korean version of an English carousel or image-plus-caption post, do not turn it into a new safer editorial concept by default. Keep the original card count, card order, main visual subject, core claim, argumentative direction, pacing, and emphasis. Rewrite the wording into natural Korean Instagram copy with only small phrasing changes, and add the user's opinion lightly where it strengthens the original point. If a claim is risky, inaccurate, or needs evidence, preserve the author's intended point as much as possible while making the smallest necessary correction or softening. Do not bury the main message under caveats. Put medical/legal/safety caveats in the caption footer or final notes unless the original carousel itself uses them as part of the argument.

User preference for Korean-to-Japanese versions: when the user asks to make or continue a Japanese version from a Korean card-news plan, keep the same card count, card order, information structure, and benchmark mechanism unless the user requests a broader localization. Localize phrasing, ingredient names, food examples, and caution wording only enough for Japanese readers to understand naturally. After each Japanese card text or each Japanese Gemini prompt block, include a short Korean check translation labeled `한국어 확인:` so the user can verify the meaning. The Korean check translation should follow the Japanese text card-by-card and should not be a new Korean rewrite or improved alternate hook.

Never put Korean check translations inside a Gemini image prompt block for a Japanese version. The prompt block must contain only generation instructions and the Japanese `Exact text` that should appear in the image. Put `한국어 확인:` outside the fenced prompt block, immediately after it, so Gemini cannot accidentally render Korean translation text into the image.

For Japanese versions, use natural Japanese Instagram copy rather than literal Korean word order. Add short parenthetical explanations for ingredients that may be unfamiliar in Japan, such as jaggery, only when it improves comprehension. Keep health and nutrition wording modest and avoid making stronger claims than the Korean version.

For Japanese recipe cards, prefer recipe-native wording over literal Korean translations. Use concise cooking verbs that describe the actual technique:

- Always specify Japanese Instagram/card-news image prompts as `1080 x 1350px`. If reviewing generated Japanese cards, flag outputs like `1008 x 1350px` as a ratio/production issue and recommend regenerating or extending the canvas to `1080 x 1350px`.
- Before sending Japanese Gemini prompts, run a Japanese recipe-language QA pass. Check that wording sounds natural for ordinary Japanese recipe readers, not merely understandable. Prefer common recipe expressions such as `濃厚なスラッシュ食感`, `ふるっておくとよりなめらか`, `甘さはいちごの甘さに合わせて調整`, `ミキサーで混ぜる`, `ゆっくり注ぐ`, and `仕上げ`. Avoid stiff or literal phrases such as `濃いスラッシュ食感`, overly formal `攪拌` when `ミキサーで混ぜる` is clearer on a casual Instagram card, and awkward direct Korean word order.
- For Japanese ingredient and tip cards, add a text-density QA pass before finalizing prompts: long lists must use enough line spacing, visible section breaks, and readable mobile typography. If the card contains 7+ lines or both tips and variations, instruct Gemini to keep text uncluttered, not too thick, and split sections clearly.
- Do not over-focus on Gemini sparkle marks, decorative star marks, model signatures, or watermark-like symbols. The user may remove these separately in post-editing. Mention them only if the user explicitly asks, if they cover important text/food, or if they are unusually large and distracting. Do not recommend regeneration only because a small sparkle/model mark is visible.
- For Japanese recipe cover hooks, prefer present/future recipe-native phrasing such as `おうちで作る...` when inviting viewers to try the recipe. Use past-tense phrasing such as `作った...` only when the card is explicitly a result reveal or personal experience.
- For Japanese ingredient cards, avoid ambiguous single-word labels such as `粉` when ordinary readers need clarity. Prefer `小麦粉`, or `小麦粉（中力粉）` when the recipe specifically uses medium-strength flour.
- Do not add small extra ingredient labels, sticky notes, or duplicate micro-text inside Japanese image prompts unless the user asks for them. If labels are useful, make them part of `Exact Japanese text`; otherwise require no extra labels so Gemini does not create unapproved text.
- Localize topping names to common Japanese recipe language: use `チョコ` for compact flavor labels, `チョコレート` in ingredient/body copy when space allows, and consider `カラースプレー` instead of `スプリンクル` for Japanese dessert readers when referring to colorful sprinkles.
- For grinding/blending nuts into a spread, prefer `なめらかにする`, `ペースト状にする`, or `攪拌する` depending on the reader level; avoid weak literal wording like `細かくする` when smoothness is the point.
- For a second blend/mix step, prefer `再度攪拌する` or `もう一度混ぜる` rather than generic `混ぜる` if the texture needs to become smooth.
- For chocolate, use `チョコ` when cover space is tight and casual; use `チョコレート` in ingredient lists when space allows.
- For powdered sugar, prefer the shorter recipe-friendly `粉糖` when image space is tight; `粉砂糖` is acceptable when clarity matters.
- For flavor notes, use ordinary Japanese recipe phrases such as `濃厚でなめらか`, `香ばしい`, `コクのある`, and `やさしい甘さ`.

For Japanese ingredient/list cards, keep repeated labels consistent across the series. If the Korean cards use `맛 / 잘 어울림 / 참고`, use the same Japanese label set on every comparable card, usually `味 / 合うもの / メモ`. Do not let one card omit labels while the others include them unless the layout intentionally changes for a cover or final CTA.

For Japanese taste copy, avoid overly literal or culturally awkward food expressions. Translate Korean flavor notes into common Japanese food phrasing, such as `深みのある風味`, `ほのかに香ばしい`, `やさしい甘さ`, or `コクのある甘み`, rather than strange poetic phrases like `大地を感じる風味` unless the user explicitly wants a literary tone.

When a card is about one ingredient, keep the main visual unambiguous. Do not include another featured ingredient from a different card in a way that could confuse the subject, such as adding dates to a maple syrup card. Background props may support serving context, but the hero ingredient must be unmistakable.

Health and nutrition benchmark adaptation rule: do not overcorrect into a generic "safe health content" explainer. Keep the benchmark's boldness, emotional pressure, and practical recommendation as the default. When softening is necessary, soften only the smallest risky phrase, such as changing "is the root cause" to "can be a major factor", while preserving the same takeaway, subject, and urgency. Do not add broad disclaimers, multiple alternative foods, balanced-diet lectures, or medical caveats inside the card image unless the benchmark itself does that or the user requests it. Put necessary caution in a short caption footer or notes section.

Memory rule: keep durable notes about the benchmark's structure, emotion, hook, retention, CTA, and food-adaptation potential. Do not store full copied captions, full OCR text, or source images as the reusable asset unless the user explicitly asks and rights are clear.

Return `진행가능여부`:

- `가능`: mechanism transfers cleanly.
- `조건부 가능`: usable after changing claims, tone, visuals, or factual basis.
- `비추천`: weak transfer, high copyright/factual risk, or low food-account fit.

## Carousel Planning

Choose story shape from the source and trigger. Common shapes include:

- News reveal: what changed -> why it matters -> what may change next.
- Hidden mechanism: visible phenomenon -> actual mechanism -> surprising conclusion.
- Myth-busting: common belief -> contrary evidence -> practical meaning.
- Before/after culture shift: old scene -> current scene -> what changed emotionally or economically.
- Human-interest story: person/shop/event -> emotional reaction -> food's role.
- Ranking/list: strong criterion -> items with contrast -> saveable summary.
- Safety/risk: cautious hook -> verified fact -> checklist.
- Debate: split preference/behavior -> both sides -> easy comment question.
- Product/news issue: release/change -> consumer question -> judgment criteria.

Recommended card counts:

- Quick meme/relatable: 4-6
- Food trend/news: 6-8
- Nostalgia/list: 7-10
- Recipe teaser: 5-7
- Product/ingredient curation: 6-8
- Curious global food culture: 5-7
- Local/place/route curation: 6-10
- Debate/opinion: 5-6
- Food safety/recall/health-risk: 6-8

Use 4:5 vertical carousel by default: `1080 x 1350px`. This applies to both Korean and Japanese Instagram/card-news versions. It does not apply to Naver blog images, which use `1200 x 900px` horizontal by default.

## Visual Direction

Final food-related cards should feel like polished editorial food/lifestyle imagery, not placeholder graphics.

Use appetizing food photography, ingredient close-ups, cooking process shots, store/market scenes, realistic lifestyle scenes, or credible AI-generated food/news visuals. Use people only when they improve situation, scale, warmth, empathy, or story.

Avoid flat vector food icons as final visuals, empty geometric layouts, generic stock-like backgrounds, unrelated models, sexualized poses, brand/logo misuse, and AI images presented as real news evidence.

For Gemini text-in-image prompts, prioritize readability:

- Use one main text zone per card: top or bottom, not both.
- Keep Korean text short, polished, and natural.
- For recipe method/process cards, keep the user's preferred large readable text size, but compress each step into short action phrases. Avoid full sentence-style explanations when they make the method panel crowded; move detailed reasoning, cautions, and optional notes to the caption or blog copy.
- For covers, keep the main hook compact: usually 2-3 lines and roughly 18 Korean characters per main line. Avoid long explanatory cover copy unless the benchmark is explicitly a dense one-page infographic.
- Do not force Korean text onto every card. If the benchmark uses text only on the cover and photo-only proof cards afterward, preserve that rhythm when it improves swipe curiosity.
- When delivering image prompts, do not put important generation rules in a separate common-rules block if the user will copy prompts one by one. Repeat the needed safety, style, text, and negative-prompt instructions inside each card prompt.
- End every image-generation prompt, including Instagram, Japanese, and Naver blog prompts, with this exact final line: `이미지 생성해줘.` Put nothing after it inside the copy-paste prompt block. This prevents image tools from interpreting the request as a document or file-generation task.
- For benchmark-attached Gemini prompts, never output a separate section called `공통 사용법`, `공통 규칙`, or similar. Make each card prompt fully copy-paste-ready by embedding the benchmark-reference instruction, text-only instruction, aspect ratio, originality warning, and negative prompt inside that card's single prompt.
- Keep copy-paste prompts simple: one fenced prompt block per card, with `Exact Korean text:` inside the same block. Avoid extra explanation between prompt blocks unless the user asks for strategy or rationale.
- Before writing prompts, identify the benchmark's must-have visual proof cards, such as full object, environment/context, close-up texture, side-by-side comparison, cut/open interior, before/after, or final CTA image. Do not omit these proof cards.
- Give every image prompt a clear card role: cover hook, environment proof, texture proof, comparison proof, interior/cutaway proof, process proof, or final reaction/CTA.
- For any card that must show a specific visual fact, state the non-negotiable subject explicitly and repeatedly in natural language, such as `the cut face must be visible`, `ripe bananas must be clearly yellow`, or `no text at all`.
- For recipe process cards, ensure the visual does not contradict the steps. If the key step is "blend nuts first", the image should show that sequence or avoid showing all ingredients dumped together before that step.
- For recipe or product prompts that use trademark-like names such as `Nutella`, prefer generic in-image wording such as `초코 헤이즐넛 스프레드`; use `누텔라 스타일` or the trademarked comparison mainly in captions/notes when needed.
- Add explicit typography direction for polished Korean food cards: use soft premium Korean typography, such as a warm rounded title style or refined recipe-book title style, with clean readable gothic body text. Keep text large enough for mobile readability, but make the typography feel curated and editorial rather than blunt. Avoid default bold UI fonts, cheap free-template typography, worksheet-like titles, school handout styling, supermarket flyer styling, thick black box borders, and overly heavy box headings.
- Add `no watermark, no account handle, no UI` inside each prompt's negative instructions.
- Do not over-optimize against small decorative sparkle marks in Gemini outputs. Treat tiny corner sparkle decorations as acceptable unless they look like a watermark, logo, account mark, or distract from the food/text. Do not repeatedly regenerate only to remove harmless sparkle marks.
- Add typography/styling negatives when needed: `no cheap template look, no supermarket flyer style, no worksheet style, no school handout style, no default bold UI font, no thick black template borders, no clunky title box`.
- Avoid coordinate labels, visible crop guides, red boxes, safe-frame lines, UI screenshots, and tiny labels.
- Ask for a centered 4:5 Instagram-safe composition inside Gemini's larger output.
- Keep important text and subjects away from edges.
- If text fails repeatedly, simplify copy or use a two-step workflow: image first, local text overlay second.

## Final Image Package

If the user asks for final upload-ready cards, get approval of the card plan first unless they explicitly ask for direct production. Generate JPG by default:

```text
jpg/card-01.jpg
jpg/card-02.jpg
...
caption.txt
hashtags.txt
sources.txt
preview.html
zip package
```

Do not deliver final cards made only from simple geometric placeholder art unless the user explicitly requests a minimal graphic style.

## Production QA

Before handing off a final plan, Gemini prompt package, or JPG set, check:

- Topic is not generic, stale, common knowledge, or a duplicate.
- Evidence or benchmark signal is clear.
- Card 1 has a concrete tension, object, number, image, warning, reversal, or payoff.
- Card 1 does not give away the complete list, conclusion, answer, recipe, or main information unless the requested output is a one-page infographic. It should create curiosity and a reason to swipe.
- Repeated card labels, typography hierarchy, and section structure stay consistent across the carousel, especially for multilingual versions.
- Typography feels polished enough for the account: not like a basic free template, supermarket flyer, school worksheet, school handout, default UI font, thick bordered template, or overly clunky title box. Cover typography should feel intentional, warm, and food/editorial-appropriate.
- Large Korean text can be kept when the user likes the readability, but recipe method text must be concise. Each process step should read like a short command or action phrase, not a long explanatory sentence; move extra explanation to caption/blog notes.
- Recipe cards should feel like a premium Korean food magazine, warm bakery recipe book, or polished editorial home-cafe post. If the output looks like a worksheet, classroom handout, generic Canva template, or heavy boxed infographic, revise the typography and layout prompts before handoff.
- Card 1 text is short enough to work as a thumbnail. If it feels crowded, compress the title and move explanation to card 2, card 3, or the caption.
- Each ingredient card's main image clearly matches that card's ingredient and does not accidentally feature another card's ingredient as the apparent hero.
- Recipe process visuals do not mislead the cooking order, ingredient state, or key technique. If the generated image shows an impossible or wrong step, revise the prompt or note the issue before handoff.
- Japanese versions use natural Japanese food wording and avoid literal translations that sound stiff, overly poetic, or unusual for ordinary readers.
- Japanese recipe result reviews must classify issues by severity: `must fix before posting`, `recommended fix`, or `acceptable if speed matters`. Do not overstate minor wording awkwardness as blocking when the recipe meaning, quantities, and trust are intact. Do not treat small Gemini sparkle marks, decorative marks, or watermark-like symbols as issues unless the user asks about them or they interfere with the content.
- Japanese ingredient and tip cards must be checked for mobile readability: line spacing, section separation, text thickness, and whether long lists feel cramped. If only spacing is imperfect but readable, mark it as recommended rather than mandatory.
- For Japanese recipe cards, verify common recipe-native wording before approval, especially texture phrases, mixing/blending verbs, sweetness adjustment, garnish/finish wording, and ingredient units.
- Japanese Instagram/card-news outputs must be `1080 x 1350px`. If a generated file is narrower or otherwise not 4:5, flag it before approving even when the design looks good.
- Japanese recipe cover text should sound like a recipe invitation, not a literal translation. Prefer `おうちで作る...` for recipe hooks unless a past-tense result story is intentional.
- Japanese ingredient cards should avoid unclear shorthand such as `粉` and prefer reader-friendly terms such as `小麦粉` or `小麦粉（中力粉）`. Extra small ingredient labels or duplicate micro-text should be removed unless explicitly requested.
- Japanese recipe cards use technique-accurate cooking verbs and common recipe terms, especially for blending, grinding, melting, storage, and texture. Prefer concise terms that fit the card, such as `粉糖`, `チョコレート`, `なめらかにする`, and `再度攪拌`.
- Japanese flavor/topping choices should use natural reader-facing names. For colorful sprinkles, consider `カラースプレー` over `スプリンクル` when the target is ordinary Japanese dessert readers.
- Small Gemini-style decorative sparkle marks are not a blocking issue by themselves. Mention them only if the user asks, if they resemble a watermark/logo, or if they noticeably reduce the design quality.
- Story shape fits the topic and is not template-forced.
- Korean copy is natural, mobile-readable, and not a literal translation.
- Trademarked or brand-like names are handled carefully. Prefer generic in-image names where possible, and put comparisons, cautions, or source/risk notes in the caption or final notes.
- Facts are separated from commentary.
- Risky claims are verified, softened, or removed.
- Visual direction supports the hook instead of decorating it.
- CTA is easy and natural: comment, save, share, profile visit, or blog/link bridge.

If the topic, trigger, cover, or swipe promise fails, rewrite the angle before polishing design.

## Performance Loop

When the user shares metrics or says a post did not perform, diagnose in this order:

1. Cover hook
2. Viral trigger
3. Audience fit
4. Swipe promise
5. Comment/save/share reason
6. Visual credibility
7. Caption first line
8. Posting context and timing

Record useful learnings in `references/performance-learning-log.md` when the user provides performance data.


## Blog And External Post Output Rules

Use these rules whenever the user asks for Naver blog copy, Tistory HTML, Blogspot/Blogger HTML, blog post text, or any external post text expanded from Instagram cards.

- Return blog copy as one continuous copy-paste block by default. Do not split it into multiple separate code blocks or segmented snippets unless the user explicitly asks for section-by-section output.
- Include image/product placeholders inside the same block, such as `[Image 1: insert cover image]`, `[Shopping Connect product: baking powder]`, or `[Coupang product: vanilla extract]`.
- For Tistory and Blogspot/Blogger requests, output copy-paste-ready HTML tag format by default, not plain Markdown and not a full standalone `<!doctype html>` document unless the user explicitly asks for a complete HTML file. Use body-safe tags such as `<div>`, `<h2>`, `<h3>`, `<p>`, `<ul>`, `<li>`, `<strong>`, `<hr>`, and optional inline styles when a styled version is requested.
- For Tistory and Blogspot/Blogger HTML, do not wrap image placeholders in decorative gray blocks unless the user asks for placeholder boxes. Use simple image insertion placeholders such as `<p>[이미지 1 삽입]</p>` so the user can replace them in the editor.
- For styled Tistory recipe HTML, default to a polished food-editorial layout rather than plain headings and paragraphs: use a warm title hero, restrained cream/olive/brown palette, rounded ingredient panels, compact tip callouts, dividers, and a gentle closing CTA panel. Use pistachio-green pill labels such as `<span style="display:inline-block;padding:5px 13px;border-radius:999px;background:#71804a;color:#fff;font-size:13px;font-weight:bold;letter-spacing:1px;">STEP 01</span>` before each recipe-step heading instead of circular number badges. Keep all styles inline and body-safe. Preserve simple image insertion placeholders as plain `<p>[이미지 N 삽입]</p>` lines; do not place placeholders inside decorative boxes or add text over process images. Use this richer style unless the user explicitly requests a plain/minimal HTML draft.
- For Tistory or Blogspot/Blogger image plans, provide concise Korean alt text for each image; when HTML uses actual `<img>` tags, include it in the `alt` attribute. For Naver blog drafts, do not include a separate image-alt-text section by default; include it only if the user explicitly asks. Keep Naver image placeholders simple and focused on insertion order.
- For every Tistory HTML recipe post, always provide a numbered `이미지 대체텍스트` list matching every image placeholder, written in concise natural Korean, outside and after the HTML article block. Never include this alt-text list inside the Tistory HTML article body unless the user explicitly asks for it inside the article. For every Ameba Blog Japanese recipe post, always append the matching numbered `画像の代替テキスト` list in natural Japanese. Do this by default even when the user does not explicitly ask for alt text.
- Describe the specific visible action or finished dish in alt text, not generic labels such as `이미지 3` or `調理写真`. Keep each alt text concise, factual, and aligned with the image prompt/placeholder; include core ingredients or the cooking action only when they are visibly relevant.
- For Tistory HTML copy-paste recipe posts, always provide publishing extras outside and after the HTML article block: a separate `이미지 대체텍스트` block and a separate `티스토리 해시태그` block. Keep hashtags in `#` format, usually 8-12 focused Korean tags matching the recipe name, main ingredients, method/tool, use case, and blog search intent. Do not put hashtags inside the Tistory HTML article body unless the user explicitly asks for them there.
- For Ameba Blog Japanese recipe HTML, follow the same publishing extras used by `platform-blog-detail-page`: write the main HTML article as portable inline-styled HTML, then outside the HTML block always provide separate copy blocks for `検索表示タイトル コピー用`, `アメブロ用ハッシュタグ コピー用`, and `Ameba Pick 検索キーワード`. Do not put the search-display title, hashtags, or product-search keywords inside the HTML article body.
- For Ameba Blog recipe posts, always include an `おすすめ材料` section immediately before the final `まとめ` section in the HTML article, even when Japanese affiliate links are not provided. Use this inline-styled HTML pattern by default, adapting only the bracketed material-selection guidance to the current recipe:
  ```html
  <h2 style="font-size:22px;margin:34px 0 12px;padding-left:12px;border-left:5px solid #d87735;color:#2a1d16;">
    おすすめ材料
  </h2>

  <p>
    このレシピでは、[レシピに合う材料選びのポイント]を選ぶと作りやすいです。
    [形・大きさ・溶けやすさ・食感など、Ameba Pickで選ぶときに見るポイント]をチェックしてみてください。
  </p>

  <p>
    下にAmeba Pickで選んだ材料を載せておきます。
  </p>
  ```
  Never invent product cards, prices, rankings, reviews, availability, or Japanese affiliate URLs.
- For Ameba Blog posts with local or generated images, use visible image insertion-marker paragraphs and short Japanese captions rather than hidden comments or public image URLs. Use natural markers such as `<p style="margin:18px 0 8px;padding:10px 12px;border:1px dashed #d9b98c;background:#fffaf2;color:#8a5a24;font-size:14px;">画像挿入：1枚目／完成カット／キウイカップのフルーツシリアル</p>`, and tell the user implicitly through the marker which image goes where.
- For Naver blog image prompt packages, default to `1200 x 900px` horizontal images. State the size inside every image prompt.
- Recommend Naver image count from recipe complexity before producing prompts. Use 4-5 images only for genuinely simple one-bowl recipes. For dense or multi-stage recipes, use 8-12 individual images; default to 10 for a recipe with mixing, texture adjustment, pan preparation, scoring/garnishing, baking, syrup/sauce, and finishing: title cover, ingredients, dry mix, wet ingredient addition, final batter texture, pan/spread, scoring/garnish, baked result, syrup/sauce, and final pouring/serving.
- Do not reuse an Instagram-style multi-panel collage as one Naver body image. Make each recipe-critical action a separate horizontal process image, place it directly after its matching body instruction, and provide matching alt text and a dedicated `1200 x 900px` prompt when prompts are requested.
- When the blog deliverable specifies an image count, include the full matching prompt package by default, not only an image plan. Produce one numbered, copy-paste-ready `1200 x 900px` horizontal prompt for every placeholder, keep its visual action consistent with the body copy and alt text, and do not combine multiple sequential actions into one process prompt.
- Naver blog images are not Instagram cards. Use food photography and editorial blog-thumbnail composition rather than dense carousel text layouts.
- Text rules for Naver images: the cover thumbnail may include a short title; the ingredients image may include simple ingredient-name labels; process and final images should usually be textless.
- If ingredient labels are requested, include only short Korean names, not quantities or long explanations, unless the user explicitly asks for those details in the image. For complete ingredient overview images, label all visually important ingredients and verify names match the written recipe exactly; avoid partial labeling that makes unlabeled ingredients look accidental.
- For Naver blog posts, always provide copy-paste-ready hashtags/tags after the blog body unless the user explicitly asks not to. This is required for every Naver blog deliverable, including recipe posts, image-prompt-only packages, and blog expansions from Instagram cards. Use 10-15 concise Korean tags that match the recipe, selected category, main ingredients, cooking method/tool, and use case. Output Naver hashtags as one single copy-paste line, not one tag per line. Avoid overly broad tags only, repeated synonyms, or unrelated trend tags.
- For Naver blog recipe posts, include image placeholders in the body, a short category recommendation when the user is deciding where to post, safety/allergy/storage notes when relevant, and hashtags/tags.
- End Naver blog recipe deliverables with a compact `발행 체크리스트`: category placement, cover image, body images, hashtags/tags, safety/allergy/storage notes, and any affiliate disclosure need.
- User's current Naver blog categories: `요리 레시피` includes `에어프라이어 레시피`, `모든 간식`, `빵/토스트/샌드위치`, `쿠키/디저트`, `과일/요거트`, `감자/고구마`, `계란/두부/치즈`, `아이간식`, `야식`, `소스/잼`, `홈카페 / 음료 레시피`; `음식 이야기` includes `음식 뉴스`, `유행 간식`, `해외 음식 트렌드`, `재료 이야기`, `브랜드/제품 이야기`; `재료/도구 추천` includes `자주 쓰는 재료`, `에어프라이어 도구`, `베이킹 도구`, `주방 소모품`, `보관/플레이팅`; `레시피모음` includes `10분 간식`, `주말 브런치`, `남은 재료 활용`, `손님초대 메뉴`, `도시락/간단식`. When recommending a Naver category, choose the best existing subcategory first. For general meal bowls, lunchbox, meal-prep, and quick one-bowl recipes, prefer `레시피모음 > 도시락/간단식`; for snack-like recipes, prefer the closest `요리 레시피` subcategory.
- Write for ordinary readers, not recipe experts. Prefer simple Korean words that a casual reader understands immediately.
- Avoid jargon or explain it in plain words. For example, prefer easy meanings such as "too thick/stiff batter" instead of specialist terms, and avoid unexplained words like "rich" or "scoop" when simpler wording works.
- Do not mention the benchmark, original post, or source image inside reader-facing blog copy unless the user specifically wants a benchmark-analysis article.
- For Tistory or Blogspot/Blogger HTML containing Coupang Partners links, put the disclosure sentence at the very top of the HTML post before the introduction: `이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.`
- For Naver blog drafts, do not include affiliate disclosure by default unless the draft itself contains Coupang Partners links or the user asks for it.
- Before finalizing blog copy, Tistory/Blogspot HTML, or Naver image prompts, check for reader-confusing words, unexplained recipe terms, awkward benchmark references, product-claim overstatement, incorrect image size, missing cover title when requested, ingredient labels that are too long, missing image placeholders, missing image alt text, missing hashtags/tags, missing category guidance when asked, missing safety/allergy/storage notes when relevant, missing publishing checklist, and image-generation artifacts.
## Default Output

Unless the user asks for a narrower result, return:

```markdown
## 인스타 카드뉴스 기획

### 1. 콘셉트
- 주제:
- 목적:
- 제작 모드:
- 진행가능여부(벤치마킹 자료가 있을 때):
- 타깃:
- 바이럴 트리거:
- 핵심 감정:
- 추천 카드 수/스토리 방향:

### 2. 첫 장 Hook 후보
1.
2.
3.

### 3. 근거/수요 분석
- Evidence:
- Audience demand:
- 바이럴 가능 점수:
- 보류/제외 사유(있을 때):

### 4. 벤치마킹 분석(자료가 있을 때)
- Hook 메커니즘:
- 감정 트리거:
- 스와이프 유지 장치:
- 댓글/저장/공유 장치:
- 디자인/레이아웃 특징:
- 음식 콘텐츠로 바꿀 때 유지할 것:
- 반드시 바꿀 것:

### 5. 카드 구성
| 카드 | 역할 | 화면 문구 | 이미지/비주얼 | 레이아웃 | CTA/메모 |
|---|---|---|---|---|---|

### 6. 캡션

### 7. 해시태그

### 8. 댓글/저장/공유 유도

### 9. 디자인 가이드

### 10. 원본성/저작권/리스크 체크
```







