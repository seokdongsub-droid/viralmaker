# Carousel Patterns

## Output Mode Rules

Choose the output depth from the user's request.

### Planning Only

Use when the user asks for 기획, 구성, 소재화, 카드뉴스 원고, or slide planning.

Return:

- concept summary
- production mode
- viral trigger
- hook candidates
- evidence and audience demand
- card table
- caption
- hashtags
- comment/save/share CTA
- visual direction
- originality/risk notes

Do not produce image prompts unless the user asks for Gemini, 이미지 프롬프트, or final images.

### Gemini Prompt Package

Use when the user asks for Gemini-ready prompts or image-generation prompts.

For each card, include:

```text
Canvas:
Scene:
Main visual:
Composition:
Exact Korean text:
Text layout rules:
Typography:
Strict negative prompt:
```

Keep `Exact Korean text` polished and final. Do not leave draft wording, planning notes, or alternative copy inside the image prompt.

Do not separate shared rules into a standalone "common rules" block when the user needs copy-paste prompts. Put all necessary style rules, text rules, copyright-safety rules, and negative prompts inside each card prompt.

Not every card needs text. If the benchmark has a text-heavy cover followed by photo-only evidence cards, use:

- Card 1: Korean cover text.
- Body cards: textless visual proof, or only minimal labels when needed.
- Final card: optional text only if the CTA cannot live in the caption.

This is especially useful for visual curiosity topics where the swipe reason is "I want to see more proof."

### Image Prompt QA Checklist

Before handing off prompts, check whether the benchmark has any must-have proof cards.

Common proof-card types:

- Cover hook: strongest visual plus text, if the benchmark uses text.
- Environment proof: shows where the food/object exists.
- Full-object proof: shows the complete food/object clearly.
- Texture proof: close-up surface, color, gloss, crumb, peel, sauce, or steam.
- Comparison proof: shows the unusual item beside a familiar reference.
- Interior/cutaway proof: shows inside, cross-section, filling, texture, or bite.
- Process proof: shows making, opening, cutting, pouring, cooking, or serving.
- Before/after proof: shows state change.
- Final CTA image: invites comment, try/not-try, save, or share.

For each prompt, state:

```text
Card role:
Non-negotiable visual:
Scene:
Main subject:
Composition:
Lighting/camera:
Text instruction:
Negative prompt:
```

The `Non-negotiable visual` line is required when the user needs a specific output, such as a cut banana cross-section or a yellow-vs-blue comparison. Repeat that requirement in the scene or main-subject sentence so image models do not ignore it.

If a generated result misses the card role:

- Missing cut/open view: ask for one object already cut open, cut face large and sharp, interior texture clearly visible.
- Wrong comparison: specify left/right or foreground/background objects and exact color difference.
- Text appears on a textless card: state `no text at all` in both text instruction and negative prompt.
- Watermark or sparkle mark appears: add `no watermark, no Gemini sparkle mark, no decorative star mark, no model signature`.
- Subject looks fake: add realistic imperfections, natural dirt/speckles, believable lighting, and avoid neon/plastic/surreal colors.
- Benchmark-like composition is missed: describe the mechanism, such as handheld proof shot, macro texture proof, or documentary environment proof, without copying the exact image.

### Final JPG Production

Use when the user asks for upload-ready cards, 최종 이미지, JPG, or a package.

Recommended deliverables:

- `jpg/card-01.jpg`, `jpg/card-02.jpg`, etc.
- `caption.txt`
- `hashtags.txt`
- `sources.txt` when sources are used
- `preview.html`
- ZIP package

Approval rule: if the user has not approved the card plan and the request is not explicitly direct-to-production, present the plan first.

### Performance Diagnosis

Use when the user reports 조회수, 도달, 저장, 공유, 댓글, 팔로우, or says a post failed.

Diagnose in this order:

1. cover hook
2. viral trigger
3. audience fit
4. swipe promise
5. comment/save/share reason
6. visual credibility
7. caption first line
8. timing and topic freshness

Return concrete changes: rewrite card 1, change story structure, strengthen CTA, simplify text, replace visual direction, or retire the topic.

## High-Engagement Carousel Formula

1. Cover: emotional hook or curiosity question
2. Context: why this matters or why people remember it
3. Examples: one clear item per slide
4. Pattern: show the bigger insight behind the examples
5. Final slide: ask a question people can answer from memory or preference

Do not use the same formula for every topic. Before writing, choose the strongest narrative structure for the topic: curiosity, trend, news, list, safety, nostalgia, debate, or local curation.

## Pattern: Curious Global Food Culture

Use for unusual food traditions, strange-seeming combinations, food history, and "why do people eat this?" topics.

Card flow:

1. "이걸 진짜 먹는다고?"
2. What the food actually is
3. Why it started or where it comes from
4. How people eat it now
5. What outsiders find surprising
6. "당신이라면 먹어볼래요?"

## Pattern: Food Trend / Viral Combination

Use for global snack trends, flavor combinations, TikTok foods, store/restaurant trends, and sudden food hype.

Card flow:

1. "요즘 해외에서 이 조합이 뜹니다"
2. Why it looks strange or new
3. Why people like it
4. The visual/SNS moment that spreads it
5. Korean/local comparison or why it matters
6. "가능 / 불가능?" comment question

## Pattern: Food News Explainer

Use for current food news, restaurant comebacks, product returns, industry moves, and culture shifts. Verify current facts first.

Card flow:

1. What changed
2. Why people noticed
3. Background/context
4. Why it matters now
5. Food-culture meaning or practical takeaway
6. Viewer question or save prompt

## Pattern: Food Safety / Health Caution

Use for recall, food safety, storage, cooking risk, or health-misunderstanding topics. Use official or credible sources and avoid fear marketing.

Card flow:

1. Cautious but non-alarmist hook
2. Common misunderstanding
3. Verified fact
4. Who should be careful or when risk rises
5. Practical checklist
6. Save/share prompt

## Pattern: Debate / Preference

Use for rankings, best combinations, controversial food preferences, and "would you try it?" posts.

Card flow:

1. Debate hook
2. Side A or why people love it
3. Side B or why people hesitate
4. Context that makes both sides understandable
5. Your neutral takeaway
6. Comment prompt

## Pattern: Nostalgia Food

Use for old snacks, school snacks, convenience-store memories, old cafe trends, and childhood food.

Card flow:

1. "이거 기억나면 최소 [세대/시절]"
2. Food/item 1
3. Food/item 2
4. Food/item 3
5. What changed now
6. Why people miss it
7. Comment question

Good final questions:

- "당신의 추억 간식은 뭐였나요?"
- "이 중에 제일 다시 먹고 싶은 건?"
- "친구랑 꼭 나눠 먹던 간식 기억나요?"

## Pattern: Food Trend Explainer

Use for current food trends, recipe trends, ingredient trends, and platform-driven food topics.

Card flow:

1. "요즘 [음식/재료]가 다시 뜨는 이유"
2. The visible trend
3. Reason 1
4. Reason 2
5. What people are doing with it
6. How to try it at home
7. Blog/profile CTA or comment question

## Pattern: Recipe Teaser

Use when the goal is to send people to a blog/profile link.

Card flow:

1. Result-first hook
2. Problem/situation
3. Ingredient hint
4. Visual transformation
5. Failure point teaser
6. Full recipe CTA

Do not reveal exact measurements, full sequence, time/temperature, or detailed failure tips if traffic conversion is the goal.

## Pattern: Product/Ingredient Curation

Use for "things to keep in the kitchen", ingredients, tools, and food-related product ideas.

Card flow:

1. "요즘 저장해두는 [카테고리] 리스트"
2. Selection criteria
3. Item 1
4. Item 2
5. Item 3
6. Who should choose what
7. CTA or save prompt

Avoid too many links. Keep product mentions contextual and useful.

## Pattern: Local Food / Place Curation

Use for neighborhood food routes, restaurants, cafes, bakeries, snack shops, and save-driven weekend guides.

Card flow:

1. "Hotspot A 말고 Nearby Area B"
2. Place/item 1
3. Place/item 2
4. Place/item 3
5. Pattern or route suggestion
6. Save/comment/follow prompt

Use atmosphere photo + food/detail inset when useful. Caption should provide the practical directory: location, handle, and one-line reason only after verification.

## Design Pattern

Recommended default:

- Size: 1080 x 1350px
- Top or bottom safe text band, preferably a dark gradient band that does not cut through the main food/subject
- Strong image center
- Large bold title with crisp high-contrast typography
- 1-2 lines max per card for short list/location cards; 3-5 short lines max for explainer cards
- Consistent logo/handle placement
- Final question slide with minimal background

## Preferred Editorial Text Overlay Style

Use this style when generating final JPG cards unless the user requests another style:

1. Photo-first composition: full-bleed food, place, or lifestyle image.
2. Text-safe zone: bottom black/dark gradient band for cover/list cards, or top dark gradient band when the food is strongest at the bottom.
3. Cover title: heavy condensed gothic feel, white text, 2-5 short lines, strong line-height, subtle shadow/stroke.
4. Body title: bold Korean gothic, smaller than cover, 1-3 lines.
5. Body copy: medium weight, short lines, strong contrast; avoid long paragraphs inside the image.
6. Avoid default UI-looking typography. Use modern Korean fonts when locally compositing text.
7. Avoid semi-transparent rectangles across the middle of the photo; they can make food cards feel less premium.
8. Validate before delivery: no clipped Korean glyphs, no text touching edges, readable at phone preview size, and the main food/subject still visible.

Local post-processing font priority:

1. `NotoSansKR-VF.ttf`
2. Pretendard / SUIT / GmarketSans / Spoqa Han Sans Neo if installed
3. `Malgun Gothic` only as a fallback
