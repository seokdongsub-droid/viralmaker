# Benchmark Library

Use this file to record benchmark posts provided by the user. Benchmarks may be food-related or non-food. The goal is not to copy them, but to extract reusable viral mechanics that can later be transformed into original food/snack/card-news posts.

## How To Use This Library

For each benchmark, extract:

- What the post is about.
- Why the first card stops scrolling.
- Why people keep swiping.
- Which emotion trigger it uses.
- Why people like, save, share, or comment.
- What visual/copy pattern can be reused.
- What must not be copied.
- How the mechanism can be adapted to food content.

Default adaptation rule:

- Non-food benchmark = borrow the structure, emotion, and interaction mechanic.
- Food benchmark = borrow the topic logic only after changing the angle, copy, visuals, and CTA.
- Never reuse source images, exact wording, captions, or layout too closely unless rights and originality are clear.

## Korean Adaptation Deliverables

When the user provides benchmark material and asks to make a Korean version, return a complete posting package by default:

- Korean carousel concept.
- Card-by-card Korean in-image text.
- Detailed AI image prompt for each card.
- Posting caption.
- Hashtags.
- Comment/save/share CTA.
- Copyright/originality transformation notes.

Do not stop at analysis unless the user explicitly asks only for analysis.

## Image Prompt Similarity And Safety

AI-generated images are still safest when the final creative is meaningfully transformed. Make prompts detailed, but direct the detail toward a new original scene.

Preserve from the benchmark:

- emotional temperature
- camera distance and angle
- lighting style
- visual hierarchy
- scene density
- color relationship
- text-safe area logic
- pacing across cards
- broad composition pattern, such as close-up, split-screen, object hero, lifestyle scene, or before/after contrast

Change from the benchmark:

- exact subject identity
- exact pose, gesture, or arrangement when distinctive
- exact background/location
- exact props if they are uniquely identifying
- exact text, caption, typography lockup, and card order when too close
- logos, UI screenshots, watermarks, brand marks, and copyrighted characters
- any image that implies a real person, brand, or news photo unless verified and allowed

Prompt-writing rule:

- Write a rich prompt that could produce the same kind of scroll-stopping image, not the same image.
- Translate the benchmark's visual mechanism into food/lifestyle terms.
- Include concrete food, setting, lens feel, lighting, composition, and text-safe zone.
- Add a strict negative prompt excluding copied layout, logos, watermarks, screenshots, real brand packaging, celebrity likenesses, and readable text unless the card intentionally needs original Korean text.
- If a benchmark image is iconic, highly distinctive, or character/IP-based, increase transformation: change subject category, setting, palette, and story while keeping only the emotional or structural mechanism.
- Before writing prompts, list the benchmark's must-preserve visual proof moments. For example: cover text card, environment shot, full object shot, comparison shot, macro detail, cut/open interior, process shot, or final proof image.
- If the user's goal is a similar concept, keep the same proof sequence unless there is a factual, copyright, or Korean-audience reason to change it.
- If a generated result misses a must-preserve proof moment, rewrite only that card prompt with stronger non-negotiable visual instructions instead of changing the whole carousel.

## Adding New Benchmarks

Add a new benchmark only when it teaches a reusable mechanism that is not already covered.

Before adding, check:

- The first card has a clear scroll-stopping reason.
- The swipe/retention structure is visible.
- The post has a comment, save, share, or follow mechanism.
- The mechanism can transfer to food/lifestyle content without copying.
- The entry adds something meaningfully different from existing benchmarks.

Memory rule:

- Treat user-provided benchmarks as a growing account-specific learning library.
- Save reusable mechanics, not copyrighted source material.
- Prefer concise analysis over long copied text.
- Do not paste full captions, full OCR transcripts, or image descriptions that are so exact they recreate the original.
- If the new benchmark resembles an existing entry, update the existing entry with a short `Related example` or `Additional learning` note instead of creating a duplicate.
- If the benchmark performs well or poorly and the user provides metrics, also record the performance lesson in `performance-learning-log.md`.

Use this entry shape:

```markdown
## Benchmark 000: Short Descriptive Name

Source:

### Content Summary
- Original domain:
- Surface topic:
- Card count:
- Visible engagement signal, if known:

### Viral Mechanism
- Hook:
- Emotional trigger:
- Swipe promise:
- Retention structure:
- Comment/save/share mechanism:

### Why It Works
-

### Reusable Structure
1.
2.
3.

### Food Adaptation
- Best-fit food topics:
- Example Korean hook:
- Visual direction:
- CTA direction:

### What Not To Copy
-

### Best Use
-
```

Keep entries concise. Preserve the transferable mechanic, not the whole post.

## Benchmark 001: Rejected Baby Monkey Finally Gets A Hug

Source: user-provided Instagram carousel screenshots. Reported performance: over 1M likes and over 10K comments.

### Content Summary

A baby monkey named Punch is shown before and after receiving care/comfort. Earlier images show the baby alone with a stuffed toy. Later images show the baby being hugged by an adult monkey. The caption explains that after days of rejection and loneliness, the baby finally experienced the comfort of acceptance, safety, and belonging.

### Viral Mechanism

- Primary emotion trigger: empathy.
- Secondary triggers: cute, belonging, relief, emotional recovery.
- First-card mechanism: a tender adult-and-baby animal hug image creates instant emotional understanding.
- Swipe mechanism: the carousel uses a before/after contrast, especially `How it was` versus `How it's going`.
- Comment mechanism: viewers naturally respond with relief, sadness, warmth, and protective feelings.
- Share mechanism: the post is easy to send as a wholesome emotional story.
- Save mechanism: weaker than comment/share, but the emotional story can still be saved as a comfort post.

### Why It Worked

- It does not rely on complex information. The image communicates the feeling immediately.
- It combines cuteness with a clear emotional arc: loneliness -> rejection -> acceptance -> comfort.
- The story is universal across languages and cultures.
- The baby animal creates protective instinct.
- The adult hug visually symbolizes safety and belonging.
- The before/after structure creates curiosity and retention.
- The caption adds narrative depth without making the viewer work hard.

### Reusable Pattern

Use this pattern when a post can show emotional transformation:

1. Painful or lonely starting point.
2. Small symbol of coping.
3. Warm replacement or solution.
4. Emotional resolution.
5. Comment question about the viewer's version of that feeling.

### Food Adaptation Ideas

Use food as the emotional comfort object instead of the adult monkey hug.

Possible food angles:

- `How it was`: tired night, empty fridge, no appetite.
- `How it's going`: warm snack, melted cheese, soup, toast, home-cafe dessert.
- "The snack that makes a lonely night feel less lonely."
- "Foods people eat when they need comfort, not just hunger."
- "The taste that feels like someone saying, 'You did enough today.'"
- "Childhood snacks that feel like being accepted again."

Possible comment prompts:

- "What food feels like comfort to you?"
- "What is your late-night comfort snack?"
- "Which snack made you feel less alone as a kid?"
- "If one food could hug you, what would it be?"

### What Not To Copy

- Do not reuse the monkey photos unless rights are clear.
- Do not copy the exact caption or story.
- Do not force animal welfare claims without verification.
- Do not present a staged or AI-generated image as a real rescue/news story.

### Best Use For Our Account

Use the emotional transformation mechanic for food posts about comfort snacks, nostalgia, after-work food, solo-living meals, warm desserts, and "food as emotional recovery" themes.

## Benchmark 002: Greek Island Cat Sanctuary Offers Free Stays

Source: user-provided Instagram carousel screenshots from Pubity. Topic is non-food, but the viral mechanism can be adapted to food/travel/lifestyle curiosity posts. Claims should be verified before reuse.

### Content Summary

A cat sanctuary on a Greek island is presented as offering free stays to volunteers who help care for rescued cats. The post says volunteers work about 5 hours a day helping feed, clean, and cuddle rescued cats in exchange for free accommodation, breakfast, and island living in Greece.

### Korean Translation

Cover text:

"그리스 섬의 고양이 보호소가 고양이를 돌봐주는 사람들에게 무료 숙박을 제공합니다."

Second card:

"보호소에서 하루 5시간만 일하면, 자원봉사자들은 구조된 고양이들에게 먹이를 주고, 청소하고, 안아주며 돌봅니다. 그 대가로 그리스에서 무료 숙소, 아침 식사, 섬 생활을 제공받습니다."

Caption:

"아름다운 그리스 섬에서 눈을 떴는데, 주변에는 바다 풍경이 펼쳐져 있고 구조된 고양이 수십 마리가 아침 식사를 기다리고 있다고 상상해보세요.

그리스의 한 고양이 보호소가 구조된 고양이를 돌봐줄 자원봉사자들에게 무료 숙박을 제공하고 있습니다. 해야 할 일은 먹이 주기, 청소, 그리고 하루 몇 시간 동안 동물들과 시간을 보내는 것입니다."

### Viral Mechanism

- Primary emotion trigger: cute.
- Secondary triggers: aspiration, escapism, empathy, curiosity, identity for cat lovers.
- First-card mechanism: a smiling person hugging a cat in a beautiful Greek island setting creates an immediate dream scenario.
- Swipe mechanism: the cover makes viewers wonder, "Is this real?" and "How does it work?"
- Comment mechanism: viewers tag friends, say they would do it, debate whether it is realistic, or express desire to live with cats in Greece.
- Share mechanism: highly sendable to cat lovers, travel lovers, and people tired of ordinary work life.
- Save mechanism: moderate to strong if viewers treat it as a possible opportunity or future dream.

### Why It Worked

- It combines multiple desires in one sentence: free stay, Greek island, cats, meaningful work.
- The value proposition is instantly understandable.
- It uses a dream-life contrast against ordinary daily routine.
- The photo makes the claim emotionally believable before the details are read.
- The post has built-in comment bait: "Who wants to go with me?"
- It is not only cute; it also has an opportunity/news angle.

### Reusable Pattern

Use this pattern for posts built around surprising lifestyle opportunities:

1. Dream-like offer or surprising claim.
2. Cute/beautiful proof image.
3. Simple explanation of the exchange.
4. Why people want it.
5. Comment prompt that invites tagging a friend or choosing whether they would do it.

### Food Adaptation Ideas

Turn the mechanism into food-related dream/opportunity/curiosity posts:

- "This Italian village lets volunteers stay free if they help cook local meals."
- "A bakery overseas gives free bread to people who help at sunrise."
- "A cheese farm where travelers work a few hours and eat fresh cheese daily."
- "A Japanese guesthouse where breakfast is the real reason people visit."
- "Would you work 5 hours a day for free dessert and island life?"
- "The food job people would do even without pay."

Food-specific carousel angles:

- `Dream exchange`: "Help make bread for 4 hours, stay in a countryside bakery."
- `Cat sanctuary pattern`: "Care for [food/place/community] and receive [food/travel/lifestyle reward]."
- `Comment bait`: "Would you do this for unlimited pastries?"
- `Aspiration plus cuteness`: cute cafe animals, cozy bakery, scenic farm, home-cafe lifestyle.

Possible comment prompts:

- "Would you do this for free breakfast and island life?"
- "Tag the friend who would quit everything for this."
- "If this were a food version, what food would convince you?"
- "Cats + Greece + free breakfast: yes or too much work?"

### What Not To Copy

- Do not reuse Pubity images, exact caption, or exact visual layout.
- Do not repeat the free-stay claim as current fact without verification.
- Do not invent opportunities, compensation, locations, or volunteer terms.
- Do not imply endorsement by the sanctuary, Pubity, or pictured people.

### Best Use For Our Account

Use this mechanism for global food curiosity posts that mix food with travel, dream jobs, unusual volunteer programs, farm/cafe life, free-food opportunities, or "would you do this?" debate prompts. The strongest food adaptation is not recipe-based; it is a curiosity/news post about a food-related lifestyle scenario that people want to imagine themselves inside.

## Benchmark 003: 30 Hottest Temperatures Ever Recorded

Source: user-provided Instagram carousel screenshots from `insidehistory`. Topic is non-food, but useful for global fact/list/ranking-style posts. This benchmark contains obvious factual-risk signals and should be treated as a cautionary example.

### Content Summary

The post claims to show "The 30 hottest temperatures ever recorded on Earth." The cover uses a dramatic podium ranking with flags and extreme heat visuals. It places Japan at no. 1 with an impossible-looking value of 17,000.1°F / 9,426.7°C, the USA at no. 2 with Death Valley at 134.1°F / 56.7°C, and Tunisia at no. 3 with 131.0°F / 55.0°C. The second card lists the top 30 by country in Fahrenheit.

### Korean Translation

Cover text:

"지구에서 기록된 역대 가장 높은 기온 30가지"

Podium:

- "1위 일본 17,000.1°F / 9,426.7°C"
- "2위 미국 데스밸리 134.1°F / 56.7°C"
- "3위 튀니지 131.0°F / 55.0°C"

Second card:

"역대 공식적으로 확인된 세계 최고 기온 기록 Top 30 (화씨 기준)"

Caption:

"타는 듯한 사막 계곡부터 용서 없는 소금 평원까지, 지구는 거의 불가능해 보일 정도로 극단적인 기온을 경험해왔습니다. '지구에서 기록된 역대 가장 높은 기온 30가지'는 기록 역사상 가장 강렬했던 폭염 사건들을 살펴보며, 이 기록적인 기온이 발생한 장소, 날짜, 충격적인 조건을 보여줍니다.

데스밸리의 불타는 화로 같은 더위부터 중동과 아프리카 전역의 혹독한 폭염까지, 이 모음은 자연이 인간 생존의 한계를 어디까지 밀어붙일 수 있는지 보여줍니다. 극한 기온 뒤의 과학, 사람과 야생동물에 미친 영향, 그리고 온난화되는 세계에서 왜 세계 최고 기온 기록이 계속 높아지는지 알아보세요."

### Viral Mechanism

- Primary emotion trigger: intellectual vanity/curiosity.
- Secondary triggers: shock, debate, ranking completion, fear/awe.
- First-card mechanism: podium ranking plus flags creates instant competition and authority.
- Swipe mechanism: viewers want to check the full list and spot surprising countries.
- Comment mechanism: factual shock, national identity, disbelief, corrections, and debate.
- Share mechanism: "Did you know?" fact-list format is highly shareable.
- Save mechanism: list/ranking format can be saved as trivia, but only if trusted.

### Why It Worked

- The headline promises a complete ranked list.
- The image uses clear hierarchy: first, second, third.
- Flags add identity and country-based debate.
- Extreme numbers create shock.
- The topic is globally understandable.
- People may comment to correct, argue, or express disbelief, which can still drive engagement.

### Critical Risk

This benchmark appears to include a major factual error or likely fake/AI-generated data. A claim that Japan recorded 17,000.1°F / 9,426.7°C is not plausible for Earth surface temperature and should not be treated as fact.

Use this as a warning:

- Viral engagement can come from false or outrageous claims.
- High likes/comments do not mean the content is accurate.
- Ranking/list posts need source verification before adaptation.
- Incorrect science/news claims can damage trust, especially for a monetization account.

### Reusable Pattern

Use the format, not the unverified claim:

1. Dramatic ranked title.
2. Visual podium for top 3.
3. Full list or comparison table.
4. Short explanation of why the ranking matters.
5. Comment prompt asking which item surprised viewers.

### Food Adaptation Ideas

Food-safe versions of this ranking pattern:

- "The 10 spiciest dishes people actually eat around the world."
- "The countries that eat the most instant noodles."
- "The world's most expensive desserts."
- "The strangest ice cream flavors that really exist."
- "The hottest peppers ranked by Scoville units."
- "The most ordered late-night foods by country."
- "Top 10 convenience-store snacks that went viral overseas."

Possible comment prompts:

- "Which one surprised you the most?"
- "Which country did you expect to be no. 1?"
- "Could you eat no. 1?"
- "Which one should we try in Korea?"

### Verification Rules For Food Adaptation

Before using this pattern for food:

- Verify rankings from credible sources.
- Avoid impossible or unsourced numbers.
- Mark uncertain claims as "reported," "often cited," or remove them.
- Do not invent prices, heat levels, sales rankings, health effects, or country rankings.
- If the ranking is playful/opinion-based, label it as editorial opinion rather than fact.

### Best Use For Our Account

Use the strong visual ranking mechanic for food curiosity posts, but make accuracy a brand advantage. A good version should feel surprising without becoming fake. For food content, this pattern is best for spicy foods, food records, country comparisons, unusual food culture, convenience-store trends, and "which one would you try?" debate posts.

## Benchmark 004: Pizza Hut Revives Classic Dine-In Nostalgia

Source: user-provided Instagram carousel screenshots from `insidehistory`. Topic is directly food-related. The broad trend appears to be supported by recent reporting, but exact scope, number of locations, and executive quotes should be verified before reuse.

### Content Summary

The post says Pizza Hut is bringing back or remodeling select `Pizza Hut Classic` dine-in locations in the United States. The emphasis is on the old 1980s and 1990s family restaurant experience: red-roof buildings, stained-glass lamps, red booths, checkered tablecloths, arcade games, buffet stations, and the nostalgic family-friendly atmosphere many customers remember from childhood.

The caption frames the move as a reaction against years of delivery/carryout focus. Pizza Hut is presented as leaning into retro branding and vintage restaurant design because consumers miss old-school dine-in experiences.

### Korean Translation

Caption translation:

"피자헛은 1980년대와 1990년대에 이 브랜드를 문화적 아이콘으로 만들었던 클래식한 매장 식사 경험을 되살리고 있습니다.

CEO Aaron Powell 체제 아래, 회사는 미국 전역의 일부 `Pizza Hut Classic` 매장을 다시 열고 리모델링하고 있으며, 빨간 지붕 건물, 스테인드글라스 램프, 테이블 아케이드 게임, 뷔페 코너, 그리고 많은 고객들이 어린 시절을 떠올리는 향수 어린 가족 친화적 분위기 같은 상징적인 요소들을 되살리고 있습니다.

Powell은 목표가 피자헛을 미국 가족 외식의 대표 브랜드로 만들었던 향수와 감정적 연결을 다시 회복하는 것이라고 말합니다.

이 변화는 회사가 수년간 배달과 포장 서비스에 집중해온 뒤에 나온 것입니다. 그 전략은 많은 전통적인 매장 식사형 레스토랑의 감소로 이어졌습니다. 이제 피자헛은 사람들이 그리워하는 옛날식 외식 경험을 찾는 흐름에 맞춰 복고 브랜딩과 빈티지 매장 디자인을 받아들이고 있습니다."

### Viral Mechanism

- Primary emotion trigger: belonging/nostalgia.
- Secondary triggers: food memory, family identity, cultural comeback, curiosity.
- First-card mechanism: retro Pizza Hut photo immediately signals "old days" without needing explanation.
- Swipe mechanism: viewers want to see more interior photos and compare them with their childhood memories.
- Comment mechanism: people share memories, debate whether old Pizza Hut tasted better, ask where locations are, or tag friends/family.
- Share mechanism: highly sendable to people who grew up with Pizza Hut, old buffet culture, arcade machines, and family pizza nights.
- Save mechanism: moderate; viewers may save to find locations or revisit the trend.

### Why It Worked

- It uses a famous food brand with existing emotional memory.
- The photos are not generic food shots; they show place, atmosphere, lamps, booths, tables, people, and family scenes.
- Nostalgia is specific: red cups, red booths, buffet, stained lamps, arcade games.
- It turns a business update into an emotional story about childhood and family dining.
- The topic naturally invites comments: "I remember this," "bring this back," "where is this?", "the old one was better."
- It bridges food, culture, and brand revival.

### Verification Notes

Recent reporting supports the broader Pizza Hut Classic revival trend:

- Reports mention retro-inspired or Classic locations with checkered tablecloths, red cups, Tiffany-style/stained-glass lamps, arcade games, salad bars, and classic red-roof design.
- Some reports describe 155 retro-inspired locations, while others discuss specific franchisees and local conversions. Because numbers vary, verify before publishing.
- Axios reporting notes that some broad reports about acquisitions/conversions were inaccurate, so avoid overclaiming.

### Reusable Pattern

Use this pattern for nostalgia-driven food posts:

1. Show a familiar food place/item from the past.
2. Name the specific memory trigger.
3. Explain what is coming back or why people miss it.
4. Show several atmosphere/details cards.
5. Ask viewers whether they remember it or want it back.

### Food Adaptation Ideas

Strong Korean food/card-news versions:

- "This old-school Pizza Hut feeling is coming back in the U.S. Why are people so excited?"
- "The restaurant details that make adults miss childhood pizza nights."
- "Why retro family restaurants are suddenly working again."
- "Korean snack brands should bring back this kind of store."
- "If old-school Korean snack bars came back, what should return first?"
- "The foods that taste better because of the place you ate them."

Local Korean adaptation topics:

- old-school Pizza Hut/KFC/Family Restaurant nostalgia.
- school snack bars and stationery-store snacks.
- 90s/00s bakery chains, buffets, family restaurants, ice cream shops.
- convenience-store products that returned with retro packaging.
- discontinued snacks people want back.

Possible comment prompts:

- "Do you remember this Pizza Hut mood?"
- "Which old restaurant should come back in Korea?"
- "Was old Pizza Hut actually better, or is it nostalgia?"
- "What food place from childhood do you want back?"
- "Which detail hits harder: red booths, buffet, lamps, or arcade games?"

### What Not To Copy

- Do not reuse insidehistory photos or captions without rights.
- Do not overstate official corporate plans without source verification.
- Do not invent locations, opening dates, or executive quotes.
- Do not use nostalgia to imply the old recipe/quality is back unless verified.

### Best Use For Our Account

This is a high-value food benchmark. Use it for nostalgic food/culture posts where the food is tied to a place, era, and social memory. The key is not "pizza" alone; the viral driver is "a place where people remember being together." For the user's account, this can become a recurring series about retro snacks, old family restaurants, discontinued products, school snacks, and food spaces people want back.

## Benchmark 005: Stray Cat Visits Shop Owner Every Morning For A Hug

Source: user-provided Instagram carousel screenshots from Pubity. Topic is non-food but useful for warm routine, local shop, and animal-human bond mechanics.

### Content Summary

A stray orange cat in Rize, Turkey reportedly visits the same market every morning, meows at the door, and hugs the shop owner, Ferhat Hayat. The owner first won the cat's trust by feeding and playing with her. The footage went viral and attracted people to the shop to see the daily routine. The caption also notes Turkey's long culture of local bonds with street cats.

### Korean Translation

Cover text:

"이 길고양이는 매일 아침 가게에 들러 주인을 안아주는 습관이 생겼습니다."

Caption:

"터키 리제의 한 길고양이는 매일 아침 같은 시장으로 걸어와 문 앞에서 야옹거리고, 가게 주인 Ferhat Hayat을 안아줍니다. 그는 처음에 먹이를 주고 함께 놀아주며 고양이의 마음을 얻었습니다.

이 영상은 수백만 조회수를 기록하며 바이럴이 되었고, 사람들은 이 매일의 루틴을 직접 보기 위해 그의 가게로 몰려들었습니다.

터키에는 지역 주민들이 길고양이와 유대감을 형성하는 오래되고 잘 알려진 문화가 있지만, 이 고양이에게는 분명 가장 좋아하는 사람이 생긴 것 같습니다.

출처: Hayat Ticaret 가게 보안 영상"

### Viral Mechanism

- Primary emotion trigger: cute.
- Secondary triggers: empathy, routine, belonging, wholesome local story.
- First-card mechanism: CCTV-like real-life image of a cat hugging a shop owner feels authentic and instantly warm.
- Swipe mechanism: viewers want to see the footage/proof after the headline.
- Comment mechanism: people react with "so cute," "animals know good people," "I would visit the shop," or tag animal lovers.
- Share mechanism: very sendable because it is simple, wholesome, and easy to explain.
- Save mechanism: weaker than comment/share, but can be saved as a feel-good post.

### Why It Worked

- The story has a daily ritual: every morning, same shop, same person, same hug.
- A stray animal choosing one human creates a strong "earned trust" narrative.
- The shop setting gives the story a real-world anchor.
- The security footage style makes it feel less staged.
- It creates a tiny local legend: people visit the shop to witness the routine.
- The caption gives cultural context about Turkey and street cats.

### Reusable Pattern

Use this pattern when a post can show an everyday ritual that became emotionally meaningful:

1. A repeated daily habit.
2. A small act of care.
3. A bond that formed over time.
4. A visible proof moment.
5. A community reaction or local fame effect.

### Food Adaptation Ideas

Food versions can center on daily routines, regular customers, neighborhood shops, or animals connected to food places.

Possible angles:

- "This bakery has one customer who comes every morning for the same bread."
- "A stray cat visits the same fish market every day for breakfast."
- "The cafe owner who leaves one warm pastry for an elderly regular."
- "The convenience-store snack a student bought every day for 3 years."
- "A market stall became famous because of one tiny daily ritual."
- "The food routine that made a whole neighborhood care."

Food-specific card flow:

1. Hook: "Every morning, someone comes for the same [food]."
2. Context: where and when it happens.
3. Bond: what the owner/person does.
4. Proof: repeat routine, photo/video, customer reaction.
5. Meaning: why people care.
6. Comment: ask about the viewer's own daily food ritual.

Possible comment prompts:

- "Do you have a food place you visit like this?"
- "What food would make you show up every morning?"
- "Which neighborhood shop deserves this kind of love?"
- "Tag someone who has a daily convenience-store routine."

### What Not To Copy

- Do not reuse Pubity images, CCTV footage, or exact caption without rights.
- Do not fabricate a local story or animal routine.
- Do not claim a food shop is famous unless verified.
- Do not exploit animal content in a way that encourages unsafe feeding or handling.

### Best Use For Our Account

Use this for warm food-community stories: bakeries, markets, cafes, convenience stores, street food stalls, regular customers, shop owners, and daily food rituals. This pattern is especially useful for posts that make food feel like relationship, not just taste.

## Benchmark 006: Dog's Apology Reaction After Eating Owner's Food

Source: user-provided Instagram carousel screenshots from Pubity. Topic includes food and pet reaction. Useful for food reaction, anthropomorphism, and "guilty but cute" mechanics.

### Content Summary

A small dog appears to have eaten or taken the owner's food. The post shows the dog facing the owner afterward, gently putting a paw on him and looking into his eyes. The caption frames the behavior as if the dog walked over to apologize face-to-face, saying "my bad, bro." The internet reacted emotionally to the dog's gentle expression and body language.

### Korean Translation

Cover text:

"주인의 음식을 먹은 뒤 이 강아지의 반응이 인터넷을 녹이고 있습니다."

Caption:

"이 작은 강아지는 마치 직접 얼굴을 보고 사과해야 한다는 듯이 걸어왔습니다.

강아지가 조심스럽게 주인에게 발을 올리고, '내가 잘못했어, 형'이라고 말하는 것처럼 눈을 바라보는 모습에 인터넷 사람들이 감동하고 있습니다.

출처: @ogaduke_"

### Viral Mechanism

- Primary emotion trigger: cute.
- Secondary triggers: humor, empathy, anthropomorphism, food conflict.
- First-card mechanism: split/sequence image shows before-after eye contact, making viewers ask what happened.
- Swipe mechanism: viewers want to see the actual video/proof of the dog's reaction.
- Comment mechanism: people project human emotion onto the dog: guilt, apology, love, "he knows what he did."
- Share mechanism: very sendable to dog lovers, pet owners, and people who like cute misbehavior.
- Save mechanism: lower than comment/share, unless used as a wholesome pet moment.

### Why It Worked

- The food creates a tiny conflict.
- The dog's body language invites human interpretation.
- The caption gives viewers a ready-made emotional reading: "my bad, bro."
- The post is short, simple, and instantly understandable.
- It triggers both cuteness and humor instead of only one emotion.
- Pet owners can relate to animals "acting guilty" around food.

### Reusable Pattern

Use this when a post can frame an animal/person/food moment as a mini emotional scene:

1. Small food-related mistake or conflict.
2. Visible reaction.
3. Human-like interpretation.
4. Cute or funny caption line.
5. Comment prompt asking viewers how they would react.

### Food Adaptation Ideas

Direct food/pet versions:

- "This dog tasted his owner's dinner and came back looking guilty."
- "The cat that steals one bite, then pretends nothing happened."
- "Pets reacting to human food they clearly should not eat."

Human food versions:

- "When you eat the last slice and make eye contact."
- "The face you make after saying you are on a diet and finishing the dessert."
- "When the snack is too good and you immediately feel guilty."
- "Foods so good they make you apologize to your diet."

Food-card-news versions without pets:

- A carousel about "foods that make people break their promises."
- "Snacks that make you say 'my bad' to tomorrow's diet."
- "The universal face after stealing one bite."

Possible comment prompts:

- "Would you forgive this face?"
- "What food would make you betray your diet?"
- "Have you ever eaten the last piece and pretended you didn't?"
- "Which snack makes you say 'my bad'?"

### What Not To Copy

- Do not reuse Pubity images/video or the creator's footage without rights.
- Do not encourage feeding unsafe human foods to pets.
- Do not make health/safety claims about pet food without sources.
- Do not copy the exact "my bad, bro" line too closely if adapting the story.

### Best Use For Our Account

This is useful for humorous snack/cheat-day/guilty-pleasure content. The main lesson is that food posts can perform well when they create a tiny emotional scene around the food: temptation, mistake, guilt, apology, forgiveness, or shared mischief.

## Benchmark 007: Space.go Seongsu/Ttukseom Hidden Food Places List

Source: user-provided Instagram carousel screenshots from `space.go`. Topic is directly food/lifestyle-related. The screenshots show a carousel about `성수말고 뚝섬으로 가볼만 한 곳 07`, followed by place cards such as 유어네이키드치즈, 피킹플레져, 디어벌스데이, 카츠곤, 멘야코노하, 목목, 심퍼티쿠시, plus a final follow CTA and a caption listing addresses and account handles.

### Content Summary

The post curates seven places around Ttukseom as an alternative to the more crowded Seongsu area. The cover uses a black background, a large isolated food photo, small account branding, and a bold list headline. Each following card presents one place with a full-bleed atmosphere/interior or exterior photo, a smaller inset food/detail photo, a large place name at the lower-left, and 1-2 lines explaining what the place offers. The final card asks viewers to follow the account for more taste-based recommendations. The caption works as a save-friendly directory with numbered place names, Seoul addresses, and Instagram handles.

### Viral Mechanism

- Primary emotion trigger: local discovery.
- Secondary triggers: taste identity, weekend planning, hidden-place curiosity, visual aspiration, save utility.
- First-card mechanism: `성수말고 뚝섬으로 가볼만 한 곳 07` creates a clear alternative-route hook. It borrows the popularity of Seongsu but promises less obvious, more tasteful choices nearby.
- Swipe mechanism: viewers want to complete the list of seven places and see whether any match their taste or weekend plan.
- Comment mechanism: viewers can share favorite Ttukseom/Seongsu spots, ask which place is best, or tag someone to go with.
- Share mechanism: highly sendable to friends planning a cafe/restaurant day in Seoul.
- Save mechanism: very strong because the caption includes addresses and handles, and the carousel itself functions as a mini local guide.

### Why It Worked

- The hook is specific and situational: not just `맛집 7곳`, but `성수 말고 뚝섬`.
- It positions the viewer as someone who knows a slightly more refined route than the obvious hotspot.
- Each place card sells both food and space. The main photo answers `what is the mood?`; the inset photo answers `what do I eat there?`.
- The visual system is repeatable and easy to scan: full-bleed place photo, inset food photo, place name, short description.
- Text density is low inside the images, so the post feels more like a polished magazine guide than a noisy listicle.
- The caption does the practical work: numbered list, addresses, account handles, and a prompt for users to share their own favorites.
- The final slide turns the carousel from a one-off recommendation into an account-follow pitch: follow for more taste discovery.

### Visual System

- Cover: black background, isolated hero food, small brand mark, large bold white headline, carousel dots.
- List cards: full-frame interior/exterior atmosphere image with dark bottom gradient, lower-left title and short body copy, small square/rectangular inset food image near top-right or top-left.
- Typography: large bold Korean place names, short white body text, minimal decorative elements.
- Color mood: each place keeps its own atmosphere, but the repeated layout creates series consistency.
- Navigation feel: carousel dots and side arrows in screenshots reinforce the `guide you swipe through` behavior.

### Reusable Pattern

Use this pattern for local food/place curation posts:

1. Cover: `Popular area A 말고, nearby area B로 가볼만한 곳 N`.
2. Card 1-N: one venue per slide.
3. Main image: space/interior/exterior mood.
4. Inset image: signature food, dessert, drink, or menu detail.
5. Copy: place name + one sentence on why to go.
6. Final card: follow/save CTA tied to taste discovery.
7. Caption: numbered directory with address, handle, and optional one-line reason.

### Food Adaptation Ideas

Strong Korean food/card-news versions:

- `성수 말고 뚝섬으로 가볼만한 디저트 7곳`
- `홍대 말고 연남으로 저장해둘 간식 코스 7`
- `익선동 말고 서촌에서 먹기 좋은 디저트 6`
- `을지로 말고 충무로에서 조용히 먹기 좋은 곳 7`
- `부산 광안리 말고 민락에서 가볼만한 간식집 6`
- `카페 말고 베이커리 중심으로 짜는 성수 코스`
- `외국인 친구 데려가기 좋은 한국 간식 코스 7`

Possible formats:

- Local guide: neighborhood route, save for weekend.
- Taste identity guide: `단맛파`, `빵순이`, `매운맛`, `혼밥`, `데이트`, `비 오는 날`.
- Course guide: brunch -> dessert -> coffee -> snack -> dinner.
- Comparison guide: overcrowded hotspot versus nearby alternative.

Possible comment prompts:

- `성수 말고 어디를 더 좋아하세요?`
- `뚝섬에서 여긴 꼭 가야 한다 싶은 곳 있나요?`
- `이 중에 첫 번째로 가보고 싶은 곳은?`
- `친구랑 간다면 카페/라멘/돈까스 중 뭐부터?`
- `여러분의 숨은 동네 맛집도 댓글로 공유해주세요.`

### What Not To Copy

- Do not reuse `space.go` screenshots, exact images, exact copy, or the same layout too closely without permission.
- Do not copy the exact list order as a new original recommendation unless independently researched and rewritten.
- Do not claim a place is hidden, quiet, trending, or reservation-only without checking current conditions.
- Do not invent addresses, account handles, menus, prices, opening hours, or reservation rules.
- If adapting for current recommendations, verify venue status, hours, addresses, and menu availability because local shops change quickly.

### Best Use For Our Account

This is a strong benchmark for save-driven Instagram food curation. Use it when the goal is not only likes/comments but saves, shares, profile visits, and trust. The key lesson is that a carousel can separate emotional persuasion and practical utility: images create desire, short copy gives taste context, and the caption becomes the usable directory. For the user's account, this pattern is best for neighborhood food routes, Korean snack/cafe lists, weekend dessert courses, `hot area alternative` posts, and creator-style local food maps.

## Benchmark 008: Wealth - The World Before It Turned Gray

Source: user-provided Instagram carousel screenshots from `wealth`, shared as a post viewed by more than 2 million people according to the user. The benchmark topic is non-food, but it has a strong transferable mechanism for food, restaurant, snack, cafe, package design, and food-culture posts.

### Content Summary

The carousel argues that the modern world has lost color. The cover uses a split street image: one side has colorful older buildings and a yellow taxi, while the other side is gray, modern, and sterile. The headline is large, yellow, condensed, and direct: `WHEN DID THE WORLD LOSE ITS COLOR`. Follow-up slides show before/after or top/bottom comparisons: colorful kitchenware versus white storage goods, colorful vintage cars versus gray modern parking lots, patterned living rooms versus minimalist gray interiors, yellow-green retro kitchens versus white modern kitchens, colorful tech objects versus black/gray devices, colorful clothing crowds versus neutral modern crowds, colorful storefronts versus gray-black luxury storefronts, vibrant food courts versus muted modern dining spaces, and colorful apartment facades versus gray modern apartment blocks.

The caption frames the topic as a cultural shift: color did not disappear overnight; it faded through objects people buy, rooms people stage, cars people drive, and buildings designed to offend nobody. The post uses data-like references and examples to make a visual complaint feel intellectually credible.

### Viral Mechanism

- Primary emotion trigger: intellectual vanity or moral superiority.
- Secondary triggers: nostalgia, cultural frustration, identity, aesthetic judgment, quiet anger.
- First-card mechanism: a huge abstract claim becomes instantly visible through a split image. The viewer understands the argument before reading the caption.
- Swipe mechanism: each slide asks the viewer to compare one category and think, `this really did happen`.
- Comment mechanism: viewers argue whether modern minimalism is tasteful or soulless, share what they miss, or name categories that lost color.
- Share mechanism: highly sendable because it gives people a sharp way to express a vague feeling they already had.
- Save mechanism: moderate. The post is more share/comment-driven than utility-driven, but it can be saved as a cultural observation or design reference.

### Why It Worked

- It turns a fuzzy cultural feeling into a simple visual proof system: colorful past versus gray present.
- The cover headline is not a neutral topic. It is a judgment with tension.
- The comparison format makes the post self-explanatory even without long text.
- The idea activates intellectual vanity: viewers feel observant for noticing a broad social/aesthetic pattern.
- It also activates moral/aesthetic superiority: viewers can feel that older design had more soul, warmth, or individuality.
- The post is easy to comment on because everyone has a preference about color, minimalism, nostalgia, and modern design.
- The visual system is highly repeatable: one category per card, direct contrast, low text density, strong headline typography.

### Visual System

- Cover: split-screen before/after street image with bold yellow all-caps headline at the bottom.
- Body slides: mostly top/bottom comparisons or side-by-side contrast.
- Typography: condensed, tall, distressed or editorial yellow display type for high urgency.
- Color logic: old side is saturated, warm, varied, and textured; modern side is neutral, gray, white, black, glass, and square.
- Layout: the comparison image carries most of the message. Text is minimal.
- Pacing: one visual category per slide, creating cumulative proof.

### Reusable Pattern

Use this pattern when the post can make a broad cultural claim visible through repeated comparisons:

1. Cover: provocative question or claim about a cultural shift.
2. Card 2: category example that immediately proves the claim.
3. Cards 3-8: repeat the contrast across categories.
4. Near-final card: explain why the shift happened or what people lost/gained.
5. Final card: ask viewers which side they prefer, what they miss, or whether the change is good.

Best structure:

- `Before had X / now we have Y`.
- `We thought it was progress, but something disappeared`.
- `This is why [ordinary category] feels different now`.
- `Which side would you choose?`

### Food Adaptation Feasibility

`가능`: The mechanism transfers very well to food content, especially if the food account wants comments, shares, and cultural identity. It should not be copied as `the world turned gray`; instead, transform the structure into food-specific contrasts such as color, warmth, abundance, packaging, table culture, restaurant atmosphere, or convenience.

Strongest food angles:

- `한국 음식은 언제부터 이렇게 예뻐지기만 했을까?`
- `분식집은 언제부터 색을 잃었을까?`
- `옛날 분식집엔 있고 요즘 맛집엔 사라진 것`
- `편의점 음식은 언제부터 한 끼 식사가 됐을까?`
- `카페 디저트는 언제부터 맛보다 사진이 먼저가 됐을까?`
- `옛날 과자 봉지는 왜 더 기억에 남을까?`
- `식당 메뉴판은 언제부터 다 똑같아졌을까?`
- `우리 동네 밥집은 언제부터 프랜차이즈처럼 보이기 시작했을까?`
- `급식판은 왜 추억이고, 요즘 도시락은 왜 콘텐츠일까?`

Recommended food versions:

1. **분식집 before/after**
   - Old: red chairs, yellow lights, handwritten menu, 떡볶이판, 튀김 바구니, 오뎅 국물.
   - New: white tiles, gray counters, packaged branding, kiosk, minimal logo.
   - Hook: `분식집은 언제부터 색을 잃었을까?`
   - Trigger: nostalgia + moral/aesthetic superiority.

2. **Korean snack packaging before/after**
   - Old: loud colors, mascot characters, handwritten-style typography, chaotic shelves.
   - New: muted premium packaging, beige/black minimal labels, health-coded design.
   - Hook: `옛날 과자 봉지가 더 맛있어 보였던 이유`
   - Trigger: nostalgia + belonging.

3. **Convenience-store meal culture**
   - Old: cup ramen, triangle kimbap, plastic table, quick snack.
   - New: full meal kits, protein drinks, dessert cups, cafe drinks, bento shelves.
   - Hook: `편의점은 언제부터 밥집이 됐을까?`
   - Trigger: intellectual vanity + belonging.

4. **Cafe/dessert aesthetics**
   - Old: colorful cakes, handwritten signs, cozy clutter.
   - New: white plates, gray interiors, tiny expensive desserts, photo-first plating.
   - Hook: `디저트는 언제부터 맛보다 사진이 먼저가 됐을까?`
   - Trigger: moral/aesthetic superiority + debate.

5. **Home kitchen/table culture**
   - Old: patterned plates, colorful bowls, 반찬통, family table chaos.
   - New: white plates, gray kitchens, uniform containers, staged home-cafe table.
   - Hook: `우리 밥상은 언제부터 이렇게 조용해졌을까?`
   - Trigger: empathy + nostalgia.

### Best Food Carousel Draft

Recommended first adaptation:

`분식집은 언제부터 색을 잃었을까?`

Card flow:

1. Cover: old colorful 분식집 split with minimal modern snack bar. Text: `분식집은 언제부터 색을 잃었을까?`
2. Old scene: red/yellow signage, handwritten menu, steaming 떡볶이. Text: `예전 분식집은 멀리서도 배고파졌어요.`
3. Modern scene: gray/white branded interior, kiosk, clean counter. Text: `요즘은 더 깔끔한데, 어딘가 조용해졌죠.`
4. Food contrast: messy 떡볶이+튀김+오뎅 plate versus neatly plated premium snack. Text: `맛은 좋아졌는데, 기억은 덜 남는 이유.`
5. Culture card: people standing, sharing, dipping, talking. Text: `분식은 원래 음식보다 분위기까지 먹는 거였으니까.`
6. Balanced take: not old is always better, but color and chaos created memory. Text: `깔끔함이 나쁜 건 아니에요. 다만 추억은 조금 지저분한 곳에 오래 남아요.`
7. Final comment card: `당신이 그리운 분식집 색깔은? 빨간 의자 / 노란 조명 / 손글씨 메뉴 / 오뎅 국물`

### Caption Pattern

First two lines:

`예전 분식집은 왜 사진이 없어도 기억날까요?`
`맛 때문만은 아닐지도 몰라요.`

Body:

`빨간 의자, 손글씨 메뉴, 뜨거운 오뎅 국물, 튀김 냄새, 떡볶이판 앞에서 고르던 시간. 요즘 분식집은 더 깨끗하고 예쁘지만, 가끔은 그 시끄러운 색깔이 그립습니다.`

CTA:

`당신이 다시 보고 싶은 분식집 장면은 뭐예요? 댓글로 하나만 골라주세요.`

### What Not To Copy

- Do not copy the exact `world turned gray` headline, yellow typography, or `wealth` visual sequence too closely.
- Do not reuse the benchmark images as final creative.
- Do not make unverifiable claims that all modern food spaces lost color or soul.
- Do not frame the post as old food culture being objectively better. Make it a debatable, nostalgic observation.
- Avoid using real brand logos, restaurant interiors, or product packaging as evidence unless rights and context are clear.

### Best Use For Our Account

This is a high-value benchmark for opinion-led food culture posts. Use it when the goal is comments and shares rather than only saves. It is especially strong for topics where viewers already feel a vague dissatisfaction but have not named it yet: gray cafes, minimal packaging, disappearing old 분식집, convenience stores becoming meal platforms, premiumization of snacks, food spaces designed for photos, and the loss of noisy local food atmosphere.

## Benchmark 009: Wealth Account-Level Viral Cover System

Source: user-provided Instagram profile/grid screenshots from `wealth`, described by the user as a popular account with more than 10 million followers. The screenshots show an account-level system rather than one isolated carousel. The account covers business, technology, news, entertainment, sports, history, geopolitics, and surprising facts with a highly repeatable visual and headline format.

### Account Pattern Summary

The profile presents a dense grid of high-contrast thumbnails. Most covers use a dramatic photo collage, celebrity/public figure/brand/object recognition, a black or dark lower band, yellow condensed all-caps text, and simple graphic cues such as arrows, circles, split comparisons, inset images, logos, or numeric rankings. Topics range from billionaires, banks, powerful countries, movies, sports, AI, gaming graphics, luxury mansions, medical oddities, celebrity news, and geopolitical updates.

The account is not only posting "news"; it packages every topic as a high-curiosity thumbnail. Each cover makes the viewer feel that there is a surprising fact, ranking, comparison, or hidden change behind a familiar object or person.

### Repeated Viral Mechanics

- Familiar anchor: known person, brand, movie, country, company, celebrity, technology, or object.
- Unexpected claim: a twist that makes the familiar anchor feel newly interesting.
- Visual proof cue: arrow, split screen, before/after, inset image, logo, ranking number, or dramatic close-up.
- Big headline: large condensed yellow text with a clear promise.
- Low cognitive load: the viewer understands the topic in under one second.
- High curiosity gap: the cover gives enough information to care, but not enough to satisfy the question.
- Broad category rotation: news, money, tech, entertainment, sports, history, science, weird facts, and pop culture are mixed to avoid feed fatigue.

### Hook Formulas Observed

Use these as mechanism templates, not exact copy:

- `The [number] [biggest/richest/most powerful] [category] in the world`
- `[Familiar brand/person] is doing [unexpected thing]`
- `[Upcoming year/event] is already shaping up to be [big claim]`
- `[Object/technology] needs to [surprising requirement] before [event]`
- `[Country/doctor/company] is using [unexpected material] to solve [serious problem]`
- `[Before/after comparison] looks insane`
- `[Famous person] has [surprising personal/detail/history]`
- `This creator shows how [technology] will change [everyday reality]`

### Why The Grid Works

- The account does not ask viewers to care about an abstract topic. It attaches every topic to a recognizable face, object, brand, or event.
- Covers create instant stakes: money, power, celebrity, danger, future, ranking, realism, medical surprise, or hidden history.
- The yellow text system creates brand recognition across unrelated topics.
- The visual hierarchy is ruthless: image first, then one huge claim, then small supporting cues.
- Many topics activate intellectual vanity: viewers feel they are learning an impressive fact they can repeat.
- Some topics activate social sharing: "Did you know this?" or "Look at this weird thing."
- The account can post at high volume because the cover formula is repeatable across categories.

### Food Adaptation Feasibility

`가능`: This is highly adaptable to a food account if the mechanism is used for topic selection and cover clarity, not copied as a yellow-text clone. Food posts should borrow the thumbnail logic: familiar food anchor + unexpected claim + visual proof cue + one-second readable headline.

Best food/news categories for this system:

- Global food business and brand moves.
- Weird food science and medical/health-related food facts.
- Expensive, rare, or historically powerful foods.
- Restaurant technology, AI kitchens, robot restaurants, delivery tech.
- Sports/celebrity food habits only when verified and relevant.
- Food safety, recalls, ingredient controversies, and regulatory shifts.
- Food rankings, records, shortages, and price shocks.
- Cultural food transformations: how a food became status, luxury, viral, or controversial.

### Food Cover Formula Examples

Use these as food-specific equivalents:

- `THE 10 MOST EXPENSIVE FOODS EVER SOLD`
  - Korean hook: `세상에서 가장 비싸게 팔린 음식 10가지`
  - Trigger: intellectual vanity + curiosity.

- `THIS FRUIT IS BECOMING THE NEXT MATCHA`
  - Korean hook: `말차 다음으로 뜨는 보라색 고구마의 정체`
  - Trigger: visual trend + cultural curiosity.

- `RESTAURANTS ARE CHANGING BECAUSE PEOPLE STOPPED EATING 3 MEALS`
  - Korean hook: `하루 세 끼가 무너지자 식당 메뉴가 바뀌고 있다`
  - Trigger: intellectual vanity + self-recognition.

- `SCIENTISTS ARE USING [UNEXPECTED FOOD MATERIAL] TO SOLVE [PROBLEM]`
  - Korean hook: `음식 재료가 치료에 쓰이는 이상한 이유`
  - Trigger: surprise + moral/intellectual curiosity.

- `THE WORLD'S MOST POWERFUL SNACK BRANDS`
  - Korean hook: `전 세계 간식 시장을 움직이는 브랜드들`
  - Trigger: money/power + food familiarity.

- `WHY THIS ORDINARY INGREDIENT BECAME A LUXURY SYMBOL`
  - Korean hook: `평범했던 재료가 갑자기 고급 이미지가 된 이유`
  - Trigger: status shift + curiosity.

- `THE FOOD TREND THAT STARTED AS A MEME`
  - Korean hook: `장난처럼 시작했다가 전 세계 메뉴판에 오른 음식`
  - Trigger: humor/meme + social proof.

### Daily Production Lesson

This benchmark is useful for the user's goal of producing five posts per day because it shows how one account can rotate many categories while keeping a consistent cover system. For a food account, use a daily rotation such as:

1. Food business/money/ranking.
2. Strange food science or health/safety.
3. Global food culture or viral ingredient.
4. Celebrity/sports/pop culture food angle.
5. Visual comparison, before/after, or nostalgia/culture shift.

The point is not to make every post a local food recommendation. The account should behave like a food-media page that can explain the world through food.

### What To Copy Safely

- The discipline of one clear cover promise.
- Familiar anchor plus unexpected twist.
- Strong visual proof cues such as arrows, inset images, rankings, and split comparisons.
- Category rotation for high-volume posting.
- Short, high-stakes headline syntax.

### What Not To Copy

- Do not copy the exact yellow condensed typography system, logo placement, or cover layout too closely.
- Do not use copyrighted celebrity/movie/game images without rights.
- Do not make unsupported claims just because the hook sounds dramatic.
- Do not overuse "most", "richest", "biggest", or "powerful" unless rankings are sourced.
- Do not let AI-generated fake evidence stand in for real news or verified facts.

### Best Use For Our Account

Use this as the default account-level production model for high-volume food card news: evidence-based global topic scanning, familiar food anchor, surprising claim, strong cover, low-text visual proof, and clear swipe payoff. It is especially useful when building a daily pipeline of five posts because the format can support news, rankings, trend explainers, cultural observations, weird science, and pop-culture food angles without becoming trapped in one niche like convenience stores or nostalgia.

## Benchmark 010: Nugget Account-Level Human-Interest Viral System

Source: user-provided Instagram profile/grid screenshots from `nugget`, described by the user as a popular account with more than 10 million followers. The screenshots show a high-volume viral media account focused on unusual, emotional, funny, and surprising stories about people, animals, technology, relationships, and everyday life.

### Account Pattern Summary

The account uses a repeatable cover system: one dramatic or emotional main image, bold white all-caps headline over a dark bottom band, a small orange nugget-like brand mark, white divider lines, and frequent circular inset images. The grid mixes wholesome stories, bizarre facts, animal stories, family/relationship posts, viral customer stories, medical/science curiosities, sports/news oddities, and meme screenshots.

Unlike `wealth`, which often frames topics through money, power, rankings, and future tech, `nugget` frames topics through human reaction: kindness, shock, unfairness, cuteness, irony, wholesome coincidence, relationship tension, and "I need to show someone this."

### Repeated Viral Mechanics

- Human-interest hook: one person, family, animal, worker, child, parent, couple, customer, or creator becomes the story anchor.
- Specific strange detail: the headline includes a concrete, almost unbelievable detail.
- Emotional polarity: wholesome, unfair, funny, adorable, shocking, or satisfying.
- Instant image recognition: faces, animals, uniforms, brands, receipts, notes, screenshots, before/after images, or circular proof insets.
- Low-context headline: the cover explains the whole setup in one sentence.
- Comment bait through judgment: viewers naturally react with "that's sweet", "that's crazy", "people are awful", "I would do this", "this restored my faith", or "this is so relatable".
- Broad category rotation: animals, relationships, parents, jobs, brands, travel, sport, medical oddities, internet memes, and everyday inconvenience.

### Hook Formulas Observed

Use these as mechanism templates, not exact copy:

- `Man/Woman/Child does [unexpected generous thing] after discovering [emotional context]`
- `[Animal] does [human-like behavior] and people cannot stop reacting`
- `[Brand/customer/workplace] story from [past/current moment] has people questioning [bigger issue]`
- `A [person] went viral after [small everyday event became absurd]`
- `[Study] shows [relationship/social behavior claim]`
- `[Object/receipt/note/order] goes viral because [specific surprising detail]`
- `[Child/family] did [wholesome action] and years later [payoff]`
- `People cannot believe [price/rule/demand/receipt] from [specific place or year]`

### Why The Grid Works

- The account makes every post about a person, animal, or concrete object, not an abstract topic.
- Headlines are long but extremely specific, so the viewer feels the story already started.
- Many posts have a built-in moral reaction: kind, unfair, ridiculous, cute, wasteful, generous, romantic, or suspicious.
- Inset images act as quick proof and increase the feeling that the story is real.
- The format supports high-volume posting because the story engine is simple: find a strange human-interest item, extract the emotional trigger, create a strong cover, then let comments carry the post.
- The account is strong at "soft viral": posts people share because they are heartwarming, weird, funny, or conversation-starting, not because they are useful.

### Food Adaptation Feasibility

`가능`: This account is very adaptable to food content, especially for daily high-volume production. The best transfer is not recipe content; it is food-adjacent human-interest stories, strange restaurant incidents, kindness stories, customer receipts, food prices, animal/food moments, brand oddities, family food rituals, and viral orders.

Food account adaptation should use:

- food as the emotional object
- receipt/order/menu/note as proof
- restaurant, grocery store, bakery, airline meal, school lunch, hospital meal, wedding food, or family dinner as the scene
- one person/animal/family/customer/worker as the story anchor

### Food Topic Categories For This System

1. **Kindness and wholesome food stories**
   - A stranger pays for a meal.
   - A restaurant remembers a customer's order for years.
   - A child brings food to a worker or parent.
   - A chef cooks for someone during a crisis.

2. **Viral receipts and prices**
   - Old grocery receipts versus today.
   - Restaurant bills that shocked people.
   - Wedding, stadium, airport, or delivery food prices.
   - Hidden fees or unusual discounts.

3. **Absurd food orders**
   - A pregnancy craving order.
   - A giant delivery order.
   - A bizarre pizza/sandwich customization.
   - A celebrity or athlete food routine.

4. **Animal and food stories**
   - Pets stealing food.
   - Animals visiting shops, markets, bakeries, or restaurants.
   - Rescue animals with food routines.
   - Cute food-shaped animals or animal cafes when verified and ethical.

5. **Restaurant/customer drama**
   - Long lists of demands.
   - Complaints that went viral.
   - Staff/customer kindness or conflict.
   - Workplace food rules.

6. **Food and relationships**
   - Couples bonding or fighting over food habits.
   - First dates, proposals, weddings, family recipes.
   - Food as apology, memory, or love language.

7. **Weird but verified food science**
   - Medical use of food-related materials.
   - Unexpected food safety facts.
   - Strange ingredients solving a problem.

### Food Cover Formula Examples

- `A MOM PACKED 200 SNACK BAGS FOR PASSENGERS BEFORE A LONG FLIGHT`
  - Korean hook: `엄마가 장거리 비행 전 승객들에게 간식 봉투를 나눠준 이유`
  - Trigger: empathy + wholesome moral reaction.

- `PEOPLE CAN'T BELIEVE THIS GROCERY RECEIPT FROM 2006`
  - Korean hook: `사람들이 2006년 장보기 영수증을 보고 놀란 이유`
  - Trigger: intellectual vanity + anger/nostalgia.

- `A RESTAURANT WORKER REMEMBERED A CUSTOMER'S ORDER FOR 20 YEARS`
  - Korean hook: `20년 동안 같은 주문을 기억한 식당 직원 이야기`
  - Trigger: empathy + belonging.

- `A DOG BRINGS GIFTS TO A BAKERY OWNER WHO FEEDS HIM EVERY MORNING`
  - Korean hook: `매일 빵집에 오는 강아지가 선물을 물고 온 이유`
  - Trigger: cute + wholesome share.

- `A PREGNANT WOMAN'S PIZZA ORDER WENT VIRAL`
  - Korean hook: `임산부의 피자 주문서가 바이럴 된 이유`
  - Trigger: humor + empathy.

- `A SCHOOL LUNCH NOTE FROM A CHILD MADE THE INTERNET CRY`
  - Korean hook: `아이의 급식 메모 한 장이 사람들을 울린 이유`
  - Trigger: empathy + moral reaction.

- `A CUSTOMER LEFT A TIP THAT CHANGED A WAITER'S LIFE`
  - Korean hook: `손님의 팁 하나가 직원의 인생을 바꾼 사연`
  - Trigger: moral/emotional sharing.

### Daily Production Lesson

This benchmark is useful for the user's five-post-per-day goal because it adds a second high-volume lane alongside global trend/news analysis. Not every post needs to be a report or ranking. Some daily posts can be story-led:

1. One global food news/trend explainer.
2. One food business/ranking/price post.
3. One food human-interest story.
4. One food receipt/order/customer drama post.
5. One cute/wholesome animal or relationship food story.

This keeps the account from becoming too dry while still remaining food-centered.

### What To Copy Safely

- Human-interest story selection.
- Specific one-sentence headline with a concrete detail.
- Circular proof insets, arrows, receipts, notes, and screenshots as evidence cues.
- Emotional polarity: wholesome, unfair, funny, cute, shocking, satisfying.
- Category rotation for daily volume.

### What Not To Copy

- Do not copy Nugget's exact white all-caps layout, orange logo mark, divider lines, or cover composition too closely.
- Do not reuse viral screenshots, private photos, receipts, or people's faces without rights or strong fair-use/editorial rationale.
- Do not invent heartwarming stories or fake receipts. These formats rely heavily on perceived authenticity.
- Do not overstate study findings or turn weak anecdotal stories into universal claims.
- Be cautious with children, medical stories, health claims, private individuals, and tragedy-adjacent content.

### Best Use For Our Account

Use this benchmark to build a food-human-interest lane: food stories that make viewers react emotionally and comment quickly. It pairs well with evidence-first global food scouting because it captures softer viral triggers: empathy, cute, humor, moral reaction, and belonging. The strongest posts will make food the social object inside a human story, not just the subject of a recipe or trend.

## Benchmark 011: Omuk Official - Korean Food Magazine Grid System

Source: user-provided Instagram profile/grid screenshots from `omuk.official` / `오늘 뭐 먹지?`, described by the user as a large Korean food account with more than 1 million followers. The screenshots show a food-specific account-level benchmark with a very high posting volume and a mix of Korean product launches, cafe/restaurant news, recipes, reviews, tips, events, and food culture issues.

### Account Pattern Summary

This account behaves like a fast Korean food magazine. It does not focus on one narrow niche. It rotates quick food news, convenience-store products, franchise promotions, limited editions, viral recipes, restaurant openings, market/festival information, food tips, simple health claims, review-style posts, and visually indulgent food photos.

The grid uses strong food imagery with Korean text overlays. Many thumbnails have a small label such as `오늘 뭐 먹지? | PICK` or `ISSUE`, large white headline text, and red underline or red emphasis text. Most covers can be understood quickly without reading a long caption.

### Repeated Content Lanes Observed

1. **New product launches**
   - Examples from screenshots: 우베코어, 구운나쵸, 마가렛트 호두, 빙수하임, 미쯔 황치즈, 보라색 오레오, 파바노 황치즈, 덴든요 신상, 버거킹 롱치킨버거 컴백, 신라면 로제 큰사발면, 칼로리바란스 요거트베리맛, 캘로그 신상, 초코칩 황치즈, 쿠키런/연양갱 라인업.
   - Mechanism: novelty + shopping curiosity + "try or skip?" comments.

2. **Franchise and cafe promotions**
   - Examples: 스타벅스 프로모션 취소, 컴포즈 여름 신상, 메가커피/컴포즈/빽다방 커피 100원, 공차 소프트 1+1, 버거킹 플래그십 스토어, 롯데리아 가격 인상, 공차 매각설, 하나로마트 다이소 입점.
   - Mechanism: practical utility + brand familiarity + price/event urgency.

3. **Restaurant/place recommendations**
   - Examples: 내 주변 돈가스 맛집 지도, 부산 센텀 케이크 맛집, 일본 여행 아이엠도넛, 망원 브런치 코스, 광주 송정역 팝업스토어, 한국 급식 인기.
   - Mechanism: save utility + local discovery + food desire.

4. **Recipe and hack posts**
   - Examples: 물비빔국수 레시피, 김종석 짜파게티 레시피, 맵콤 팽이버섯덮밥, 삼겹김치찜, 김치 깔끔하게 씻는 팁, 냉면집 고치오염 지속 때 달걀 살모넬라 주의, 복분비빔밥, 치즈케이크 자르는 법.
   - Mechanism: save value + easy execution + curiosity.

5. **Food reviews and taste tests**
   - Examples: 존맛 과자 텔꼬움, 비초비 말차쇼콜라 후기, 씨리얼 호지차, 박맛젤, 2천 원대 떡볶이 솔직 후기, 던킨 신상 도넛, 버거킹/맥도날드 메뉴 후기.
   - Mechanism: product curiosity + purchase decision support.

6. **Food events and limited-time opportunities**
   - Examples: 2026 천안 빵빵데이, 춘천 감자축제, 5월 주차 주간신상, 맥날 해피스낵, 햄버거의 날, 궁중떡볶이 신상.
   - Mechanism: urgency + save/share + outing planning.

7. **Food culture, issue, and light controversy**
   - Examples: 소주 이렇게 먹는다는 영국인, 김치 유산균 효과/장내 미세플라스틱 배출, 냉면 달걀 살모넬라 주의, 농협 직원 쌀 횡령, 중국 순대/소시지 구제역 검출, 시장 논란.
   - Mechanism: intellectual curiosity + caution + debate.

8. **Indulgent visual food**
   - Examples: 치즈폭탄 핫치즈밥, 치즈스노윙, 맘스터치 콰트로미트피자, 김치짜파게티, 아이스도넛, 빙수, 초코/황치즈 디저트, 붉닭/로제/마라/매운 조합.
   - Mechanism: craving + shareability + visual satisfaction.

### Visual System

- Food-first thumbnails: close-up product, plated food, hand-held snack, package shot, storefront, or event poster.
- Text overlay: bold Korean headline, usually white with a red emphasized phrase or underline.
- Small recurring account label: `오늘 뭐 먹지? | PICK` or `ISSUE`.
- Many covers use real product packaging or actual food photos rather than abstract illustrations.
- Layout is dense but clear: the image shows what the viewer will eat or buy; text explains why it matters now.
- Visual tone is Korean mobile magazine/feed style: fast, practical, appetite-driven, and product-aware.

### Why It Works

- It matches the daily food decision loop: what to buy, what to eat, what is new, where to go, what to try, what to avoid.
- It uses familiar brands and products, lowering the barrier to attention.
- It balances practical value with appetite appeal.
- It creates small but frequent reasons to save: dates, prices, recipes, locations, product names, tips.
- It also creates comment prompts naturally: "먹어봤다", "이거 별로였다", "어디서 파냐", "이 조합 뭐냐", "사야겠다", "비싸다".
- It is highly scalable because food product/news cycles provide constant material.

### Weaknesses To Improve On

- Many posts are product/news announcements, so originality and commentary can become thin.
- Covers can feel crowded and similar if every post uses the same red/white text treatment.
- Some health/safety claims need careful verification and softer wording.
- Product launch posts may become time-sensitive and lose long-tail value quickly.
- If overused, the account may feel like a promotional bulletin rather than a distinctive editorial voice.

### Food Topic Memory Bank From Screenshots

Remember these observed 소재 categories and examples for future post ideation:

- Korean convenience-store and supermarket launches: ramen, snacks, cookies, drinks, ice cream, energy drinks, cheese snacks, protein/yogurt products.
- Franchise/cafe launches and promotions: McDonald's, Burger King, Lotteria, Starbucks, Gong Cha, Compose Coffee, Mega Coffee, Paikdabang, Dunkin, Baskin Robbins, Pizza Hut, Mom's Touch.
- Seasonal summer foods: bingsu, cold noodles, iced coffee, ice cream, fruit drinks, watermelon, yogurt, matcha/cookie drinks.
- Trend flavors: ube, matcha, hojicha, yellow cheese, mango, melon, rose, mala, buldak, spicy, cheesy, chocolate, mint chocolate.
- Food festivals/events: bread festivals, potato festivals, pop-up stores, limited sales, local food events.
- Viral recipes: jjapagetti variations, bibim noodles, cold noodles, kimchi fried rice, pork belly kimchi stew, spicy mushroom/rice bowl, instant noodle hacks.
- Food safety and practical tips: salmonella risk, kimchi washing/storage, imported meat/sausage inspection, egg size labeling, breakfast habits.
- Local/route curation: pork cutlet maps, cafe/dessert shops, brunch routes, market foods, train station/store pop-ups.
- Sports/celebrity/team food angles: LG Twins player picks, BTS Oreo, brand collaborations, movie/character collaborations.

### Reusable Pattern

Use this pattern for Korean food account operations:

1. Source: product launch, franchise event, recipe trend, local place, issue, or food safety note.
2. Cover: real product/food photo + headline that tells why it matters now.
3. Card flow: what it is -> why people care -> where/when/how to get it -> taste/price/context -> try/save/comment prompt.
4. Caption: product/place details, availability, dates, price when verified, and a direct comment question.
5. CTA: `먹어봤나요?`, `살까요 말까요?`, `어디서 봤나요?`, `이 조합 가능?`, `저장해두세요`.

### How To Combine With Global Benchmark Accounts

This account provides Korean food-market relevance. Combine it with:

- `wealth`: stronger global news/ranking/future/brand-power framing.
- `nugget`: stronger human-interest, wholesome, receipt/order, animal, and emotional story framing.
- `world turned gray`: stronger before/after culture-shift framing.

The best future posts should not merely announce products like Omuk. They should add one of these stronger editorial engines:

- Why this product exists now.
- What global trend it connects to.
- What behavior it reveals.
- Who will love/hate it.
- Whether the price, timing, or combination makes sense.
- What viewers should try, avoid, compare, or comment on.

### Best Use For Our Account

Use this as the Korean food relevance and posting-volume benchmark. It shows what kinds of food topics a large Korean audience already recognizes and clicks: new products, limited editions, franchise promotions, viral recipes, summer foods, Korean snack flavors, cafe drinks, and practical food tips. The user's account can improve on it by adding stronger evidence-first topic selection, global article analysis, sharper hooks, and more original commentary instead of simply reposting product news.

## Benchmark 012: Vacations - Blue Java Banana Visual Curiosity Carousel

Source: user-provided Instagram carousel screenshots from vacations account about Blue Java banana. Reported visible performance: about 9.5K likes and 99 comments in the screenshot.

### Content Summary

- Original domain: travel/nature curiosity content.
- Surface topic: Blue Java banana, a blue-tinged banana nicknamed the ice cream banana.
- Card count: 6 image cards.
- Visible engagement signal: strong likes for a simple single-topic nature curiosity post.

### Viral Mechanism

- Hook: a visually impossible-looking blue banana paired with a familiar taste comparison.
- Emotional trigger: curiosity, novelty, mild disbelief, visual craving.
- Swipe promise: viewers swipe to check whether the fruit is real, how blue it is, and what the inside looks like.
- Retention structure: cover claim -> plant/context image -> full bunch -> harvested bunch -> macro detail -> strongest close-up proof.
- Comment/save/share mechanism: easy question, "Would you try one?", and shareability from the surprising color.

### Why It Works

- The first card uses an extremely familiar object, a banana, with an unfamiliar color.
- The taste comparison is instantly understandable because vanilla ice cream is universal.
- The carousel does not need complex explanation; the photos function as proof.
- The topic is low-friction: no controversy, no heavy news, easy to send to a friend.

### Reusable Structure

1. Start with a familiar food that looks visually wrong or rare.
2. Pair it with a surprising but familiar taste/texture comparison.
3. Show multiple proof images: environment, close-up, cut/open view, texture detail.
4. Add one correction or nuance if the viral claim may be exaggerated.
5. End with a simple try/not-try comment prompt.

### Food Adaptation

- Best-fit food topics: rare fruit, unusual snack colors, overseas food curiosities, visual-first food myths, tropical ingredients.
- Example Korean hook: `파란 바나나가 정말 아이스크림 맛이라고?`
- Visual direction: saturated tropical garden, blue-green banana bunches, creamy cut banana close-up, editorial black text band, high-contrast Korean headline.
- CTA direction: `먹어보고 싶다 / 사진으로만 충분하다` or `이런 과일 실제로 보면 사볼 것 같나요?`

### What Not To Copy

- Do not reuse the exact screenshots, account watermark, English cover wording, circular inset composition, or original caption.
- Do not state that it tastes exactly like vanilla ice cream as verified fact.
- Avoid using real brand/account UI, carousel arrows, or Instagram interface elements in generated images.

### Best Use

Use when making Korean versions of visual curiosity posts where the main hook is "familiar food + impossible-looking color/texture + simple taste comparison."
## Benchmark 013: Yummy Stuff - One-Image Homemade Ice Cream Recipe Expanded To 3 Cards

Source: user-provided Instagram screenshot from `yummy_stuff1` showing a one-page homemade ice cream recipe infographic. Visible engagement in screenshot: about 486 likes, posted May 28, with simple recipe caption and hashtags.

### Content Summary

- Original domain: English recipe infographic / dessert recipe post.
- Surface topic: homemade ice cream using heavy whipping cream, milk, sugar, vanilla extract, salt, and optional toppings.
- Original format: one dense image containing cover, ingredients, six process thumbnails, and a tip.
- Korean adaptation produced: 3-card Instagram carousel plus Naver blog copy and Tistory HTML copy.

### Viral Mechanism

- Hook: finished creamy ice cream photo makes the recipe feel immediately desirable and easy.
- Emotional trigger: cute / comfort / save utility.
- Swipe promise: viewers can quickly collect ingredients and process without reading a long recipe.
- Save mechanism: short ingredient list plus simple no-machine process.
- Share/comment mechanism: summer dessert, kid snack, home cafe, and topping preference comments.

### Reusable Structure

For recipe benchmark images where the original packs everything into one infographic, choose card count by information density, not by a fixed 3-card habit:

- Use 3 cards only when the original contains a short ingredient list and one simple method block.
- Use 5-7 cards when the original contains complete ingredients with quantities, multi-step method, tips, flavor variations, warnings, or other save-worthy sections.
- Before rewriting, inventory every practical item in the benchmark: title, value phrase, ingredients and quantities, method steps, tips, variations, garnish, serving timing, and CTA.
- Preserve the inventory across cards/caption/notes. Do not silently drop quantities, divided-use ingredients, paste/prep steps, tips, or variations.

Reusable dense-recipe structure:

1. Finished dish cover: appetizing hero image + Korean recipe title + curiosity or save-value hook.
2. Complete ingredients card: all core ingredients and quantities, large readable Korean text.
3. Process card 1: first ingredient group or base layer, preserving quantities and sequence.
4. Process card 2: key technique, paste/prep step, or second layer.
5. Process card 3: assembly, garnish, serving timing.
6. Tips/variations card: all benchmark tips and flavor variations that affect saving or trying the recipe.

Move long explanations, product recommendations, affiliate notes, and optional commentary to captions or blog copy, but keep the recipe's functional information visible enough that viewers can save and follow the carousel.

### Korean Copy Pattern Used

Use natural Korean equivalents of these meanings:

- Cover title: Homemade ice cream recipe.
- Cover value phrase: creamy and simple.
- Ingredients: heavy cream 2 cups, milk 1 cup, sugar 3/4 cup, vanilla extract 1 tsp, pinch of salt, optional toppings such as chocolate chips, fruit, and nuts.
- Process: softly whip cream; mix milk, sugar, vanilla, and salt; gently combine with whipped cream; add toppings; freeze 6-8 hours; rest 5 minutes before eating so it scoops softly.

### Product / Blog Extension Pattern

When turning the carousel into Naver or Tistory content, add short body text between images:

- Image 1 section: finished result and why the recipe is easy.
- Image 2 section: ingredient explanation, especially vanilla extract vs vanilla oil/essence.
- Product recommendation section: for this recipe, recommend heavy cream and vanilla extract. Prefer vanilla extract for frozen/no-bake desserts; mention vanilla oil is better suited to baked goods.
- Image 3 section: process explanation and practical tip.

For Tistory HTML that contains Coupang Partners links, place the Coupang Partners disclosure at the very top of the post.

For Naver blog drafts, do not include the disclosure by default unless the post itself uses Coupang Partners links. If a disclosure is needed, provide it separately.

### Production QA Notes

- Remove AI artifacts such as `[cite: 17]`, Gemini sparkle marks, fake logos, account UI, screenshots, or watermark-like icons before publishing.
- For Japanese versions of dense recipe benchmarks, check before prompt delivery and after generation: natural recipe wording, readable list density, no cramped ingredient/tip text, correct units and quantities, and no missing benchmark information. Do not flag small Gemini sparkle/model signature marks by default because the user may remove them separately in post-editing.
- Prefer ordinary Japanese recipe wording for casual Instagram cards: `濃厚なスラッシュ食感`, `ふるっておくとよりなめらか`, `甘さはいちごの甘さに合わせて調整`, `ミキサーで混ぜる`, `ゆっくり注ぐ`, and `仕上げ`. Avoid stiff or literal phrasing such as `濃いスラッシュ食感` or formal `攪拌` when a simpler verb reads better.
- When reviewing generated cards, separate blocking issues from polish issues. Missing quantities, wrong ingredients, mistranslated steps, unreadable text, and wrong image ratio are blocking. Slightly cramped but readable text or minor wording stiffness are recommended fixes, not automatic blockers. Ignore tiny harmless sparkle/model marks unless the user asks about them or they cover important content.
- Prefer beginner-friendly Korean wording for vanilla extract and explain in body text that vanilla extract/essence can be used and it is optional.
- Replace confusing terms like scoop jargon with plain Korean meaning: rest briefly, then eat/scoop softly.
- Keep Korean recipe text large; dense one-page infographic layouts often become too small on mobile.

### What Not To Copy

- Do not copy the original English infographic layout exactly, doodle system, captions, account UI, or screenshot frame.
- Do not preserve English text or decorative claims such as `Ultra Creamy` unless rewritten naturally in Korean.
- Do not invent current prices or product availability in blog copy; prices change frequently.

### Best Use

Use this pattern for simple dessert, drink, sauce, no-bake snack, and home-cafe recipes where one benchmark image contains both ingredients and steps. The strongest output is usually a 3-card carousel plus caption/blog/Tistory expansion rather than a long carousel.


