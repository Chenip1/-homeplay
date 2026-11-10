boot({tabs:[{"pagePath":"pages/index/index","text":"首页"},{"pagePath":"pages/game/game","text":"游戏"},{"pagePath":"pages/mall/mall","text":"商店"},{"pagePath":"pages/region/region","text":"地区"},{"pagePath":"pages/profile/profile","text":"我的"}], templates:{"pages/login/login":[{tag:"view",attrs:{"class":"wrap"},children:[{tag:"image",attrs:{"class":"bg","src":"./assets/login-nest-cropped.jpg","mode":"aspectFill"},children:[]},{tag:"view",attrs:{"class":"bottom"},children:[{tag:"button",attrs:{"class":"btn","bindtap":"start"},children:[{text:"开启你的萌宠play之旅"}]}]}]}],"pages/index/index":[{tag:"view",attrs:{"class":"page-shell","wx:if":scope => { with(scope) { return (state) } }},children:[{tag:"view",attrs:{"class":"home-frame"},children:[{tag:"image",attrs:{"class":"bg shot-layer","src":scope => { with(scope) { return (yard) } },"mode":"aspectFill","data-kind":"cover","data-src":scope => { with(scope) { return (yard) } }},children:[]},{tag:"view",attrs:{"class":"petStage"},children:[{tag:"view",attrs:{"class":"petPortrait shot-layer","wx:if":scope => { with(scope) { return (!dog3D && portrait) } },"data-kind":"portrait","data-src":scope => { with(scope) { return (atlas) } },"data-slot":scope => { with(scope) { return (portrait.portrait) } }},children:[{tag:"image",attrs:{"class":"petAtlas","src":scope => { with(scope) { return (atlas) } },"mode":"scaleToFill","style":scope => { with(scope) { return "left:"+String((portrait.offsetX) ?? "")+"%; top:"+String((portrait.offsetY) ?? "")+"%;" } }},children:[]}]},{tag:"image",attrs:{"wx:elif":scope => { with(scope) { return (!dog3D) } },"class":"pet shot-layer","src":scope => { with(scope) { return (starterArt) } },"mode":"aspectFit","data-kind":"image","data-src":scope => { with(scope) { return (starterArt) } }},children:[]},{tag:"canvas",attrs:{"type":"webgl","id":"dogCanvas","class":scope => { with(scope) { return "dogCanvas "+String((dog3D ? 'shot-layer' : 'dogHidden') ?? "")+"" } },"data-kind":scope => { with(scope) { return (portrait ? 'portrait' : 'image') } },"data-dog-model":scope => { with(scope) { return (true) } },"data-src":scope => { with(scope) { return (portrait ? atlas : starterArt) } },"data-slot":scope => { with(scope) { return (portrait.portrait) } }},children:[]},{tag:"view",attrs:{"class":scope => { with(scope) { return "dogTarget "+String((dressingTarget ? 'dressReady' : '') ?? "")+"" } }},children:[{tag:"text",attrs:{"wx:if":scope => { with(scope) { return (dressingTarget) } }},children:[{text:"松手穿戴"}]}]}]},{tag:"view",attrs:{"class":"yardDropZone"},children:[{tag:"image",attrs:{"wx:for":scope => { with(scope) { return (yardItems) } },"wx:key":"id","class":scope => { with(scope) { return "yardItem shot-layer "+String((draggingId === item.id ? 'dragging' : '') ?? "")+"" } },"src":scope => { with(scope) { return (item.image) } },"mode":"aspectFit","data-kind":"image","data-src":scope => { with(scope) { return (item.image) } },"aria-label":scope => { with(scope) { return (item.name) } },"data-id":scope => { with(scope) { return (item.id) } },"style":scope => { with(scope) { return "left:"+String((item.left) ?? "")+"%; top:"+String((item.top) ?? "")+"%;" } },"catchtouchstart":"startItemDrag","catchtouchmove":"dragItem","catchtouchend":"finishItemDrag","catchtouchcancel":"cancelItemDrag"},children:[]}]},{tag:"view",attrs:{"class":scope => { with(scope) { return "petStatus shot-layer "+String((petAlerts.moodLow || petAlerts.hungerLow ? 'petStatusAlert' : '') ?? "")+"" } },"data-kind":"box"},children:[{tag:"view",attrs:{"class":"statusHeader","bindtap":"renamePet","aria-role":"button","aria-label":"修改狗狗昵称"},children:[{tag:"text",attrs:{"class":"statusName shot-layer","data-kind":"text","data-text":scope => { with(scope) { return (petName) } }},children:[{text:scope => { with(scope) { return (petName) } }}]},{tag:"text",attrs:{"class":"editMark shot-layer","data-kind":"text","data-text":"✎"},children:[{text:"✎"}]}]},{tag:"view",attrs:{"class":"statusWarn shot-layer","wx:if":scope => { with(scope) { return (petAlerts.message) } },"data-kind":"text","data-text":scope => { with(scope) { return (petAlerts.message) } }},children:[{text:scope => { with(scope) { return (petAlerts.message) } }}]},{tag:"view",attrs:{"class":"statusRow","wx:for":scope => { with(scope) { return (statusRows) } },"wx:key":"id"},children:[{tag:"view",attrs:{"class":"statusMain"},children:[{tag:"view",attrs:{"class":"statusMeta"},children:[{tag:"text",attrs:{"class":"statusTitle shot-layer","data-kind":"text","data-text":scope => { with(scope) { return (item.label) } }},children:[{text:scope => { with(scope) { return (item.label) } }}]},{tag:"text",attrs:{"class":scope => { with(scope) { return "statusValue shot-layer "+String((item.low ? 'statusLow' : '') ?? "")+"" } },"data-kind":"text","data-text":scope => { with(scope) { return (item.summary) } }},children:[{text:scope => { with(scope) { return (item.summary) } }}]}]},{tag:"view",attrs:{"class":"statusBar shot-layer","data-kind":"box"},children:[{tag:"view",attrs:{"class":scope => { with(scope) { return "statusFill shot-layer "+String((item.low ? 'alertFill' : item.id + 'Fill') ?? "")+"" } },"style":scope => { with(scope) { return "width: "+String((item.value) ?? "")+"%;" } },"data-kind":"box"},children:[]}]}]},{tag:"view",attrs:{"class":"plusBtn shot-layer","bindtap":"useStatusSupply","data-stat":scope => { with(scope) { return (item.id) } },"data-kind":"button","data-text":"+","aria-role":"button"},children:[{text:"+"}]}]}]},{tag:"view",attrs:{"wx:for":scope => { with(scope) { return (toolGroups) } },"wx:for-item":"group","wx:key":"side","class":scope => { with(scope) { return "homeMenu "+String((group.side) ?? "")+"" } }},children:[{tag:"view",attrs:{"class":"homeTool","wx:for":scope => { with(scope) { return (group.tools) } },"wx:for-item":"tool","wx:key":"id","bindtap":scope => { with(scope) { return (tool.handler) } },"aria-role":"button","aria-label":scope => { with(scope) { return (tool.label) } }},children:[{tag:"image",attrs:{"class":scope => { with(scope) { return "toolIcon shot-layer "+String((tool.id === 'music' && !musicOn ? 'mutedIcon' : '') ?? "")+"" } },"src":scope => { with(scope) { return (tool.src) } },"mode":"aspectFit","data-kind":"image","data-src":scope => { with(scope) { return (tool.src) } }},children:[]},{tag:"text",attrs:{"class":"toolLabel shot-layer","data-kind":"text","data-text":scope => { with(scope) { return (tool.label) } }},children:[{text:scope => { with(scope) { return (tool.label) } }}]},{tag:"text",attrs:{"class":"badge shot-layer","wx:if":scope => { with(scope) { return (tool.id === 'messages' && unread) } },"data-kind":"button","data-text":scope => { with(scope) { return (unread) } }},children:[{text:scope => { with(scope) { return (unread) } }}]}]}]},{tag:"canvas",attrs:{"type":"2d","id":"homeCapture","class":"captureCanvas"},children:[]}]}]},{tag:"view",attrs:{"wx:else":true,"class":"loading"},children:[{text:"加载中…"}]}],"pages/pet/pet":[{tag:"view",attrs:{"class":"wrap","wx:if":scope => { with(scope) { return (state) } }},children:[{tag:"button",attrs:{"class":"quiet back","bindtap":"goBack"},children:[{text:"‹ 返回我的"}]},{tag:"view",attrs:{"class":"top"},children:[{tag:"view",attrs:{"class":"score"},children:[{text:"当前积分："},{tag:"text",attrs:{"class":"scoreNum"},children:[{text:scope => { with(scope) { return (state.user.score) } }}]}]},{tag:"view",attrs:{"class":"current"},children:[{text:scope => { with(scope) { return "当前陪伴："+String((state.pet.type === 'dog' ? state.pet.breedName : '请选择一只狗狗') ?? "")+"" } }}]}]},{tag:"view",attrs:{"class":"list"},children:[{tag:"view",attrs:{"class":scope => { with(scope) { return "item "+String((state.pet.breedId === item.id ? 'selected' : '') ?? "")+"" } },"wx:for":scope => { with(scope) { return (breeds) } },"wx:key":"id","data-breedid":scope => { with(scope) { return (item.id) } },"bindtap":"selectBreed"},children:[{tag:"view",attrs:{"class":"breed-label"},children:[{tag:"view",attrs:{"class":"breed-avatar"},children:[{tag:"image",attrs:{"class":"breed-atlas","src":scope => { with(scope) { return (atlas) } },"mode":"scaleToFill","style":scope => { with(scope) { return "left: "+String((item.offsetX) ?? "")+"%; top: "+String((item.offsetY) ?? "")+"%;" } }},children:[]}]},{tag:"view",attrs:{"class":"name"},children:[{text:scope => { with(scope) { return (item.name) } }}]}]},{tag:"view",attrs:{"class":"price"},children:[{tag:"text",attrs:{"wx:if":scope => { with(scope) { return (state.pet.breedId === item.id) } }},children:[{text:"陪伴中"}]},{tag:"text",attrs:{"wx:elif":scope => { with(scope) { return (state.ownedPets[item.id]) } }},children:[{text:"已拥有"}]},{tag:"text",attrs:{"wx:elif":scope => { with(scope) { return (item.price === 0) } }},children:[{text:"免费领养"}]},{tag:"text",attrs:{"wx:else":true},children:[{text:scope => { with(scope) { return ""+String((item.price) ?? "")+" 积分" } }}]}]}]}]},{tag:"picker",attrs:{"mode":"selector","range":scope => { with(scope) { return (breedChoices) } },"value":scope => { with(scope) { return (0) } },"bindchange":"pickBreed"},children:[{tag:"view",attrs:{"class":"action switch-companion","aria-role":"button"},children:[{text:"切换陪伴萌宠"}]}]},{tag:"view",attrs:{"class":"hint"},children:[{tag:"text",attrs:{},children:[{text:"领养过的萌宠会保存在「我的」里，切换时无需再次花费积分。"}]}]}]}],"pages/game/game":[{tag:"view",attrs:{"class":"play"},children:[{tag:"view",attrs:{"class":"hero"},children:[{tag:"view",attrs:{"class":"eyebrow"},children:[{text:"萌宠游乐场"}]},{tag:"view",attrs:{"class":"title"},children:[{text:scope => { with(scope) { return (mode === 'link' ? '狗粮连连看' : mode === 'quiz' ? '狗狗知识挑战' : '今天玩什么？') } }}]},{tag:"view",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return "我的积分 · "+String((total) ?? "")+"" } }}]}]},{tag:"block",attrs:{"wx:if":scope => { with(scope) { return (!mode) } }},children:[{tag:"view",attrs:{"class":"card entry","bindtap":"choose","data-mode":"link"},children:[{tag:"text",attrs:{"class":"badge"},children:[{text:"🦴"}]},{tag:"view",attrs:{},children:[{tag:"view",attrs:{"class":"name"},children:[{text:"狗粮连连看"}]},{tag:"view",attrs:{"class":"muted"},children:[{text:"连成一对，清空狗粮盘"}]}]},{tag:"text",attrs:{"class":"chevron"},children:[{text:"›"}]}]},{tag:"view",attrs:{"class":"card entry","bindtap":"choose","data-mode":"quiz"},children:[{tag:"text",attrs:{"class":"badge mint"},children:[{text:"💡"}]},{tag:"view",attrs:{},children:[{tag:"view",attrs:{"class":"name"},children:[{text:"狗狗知识挑战"}]},{tag:"view",attrs:{"class":"muted"},children:[{text:"五道题，测测你有多懂狗狗"}]}]},{tag:"text",attrs:{"class":"chevron"},children:[{text:"›"}]}]},{tag:"view",attrs:{"class":"card entry","bindtap":"choose","data-mode":"catch"},children:[{tag:"text",attrs:{"class":"badge blue"},children:[{text:"🧺"}]},{tag:"view",attrs:{},children:[{tag:"view",attrs:{"class":"name"},children:[{text:"接狗粮"}]},{tag:"view",attrs:{"class":"muted"},children:[{text:"拖动篮子，接住掉下来的狗粮"}]}]},{tag:"text",attrs:{"class":"chevron"},children:[{text:"›"}]}]}]},{tag:"block",attrs:{"wx:else":true},children:[{tag:"button",attrs:{"class":"quiet back","bindtap":"menu"},children:[{text:"‹ 返回游戏大厅"}]},{tag:"view",attrs:{"class":"card","wx:if":scope => { with(scope) { return (!result && mode === 'link') } }},children:[{tag:"view",attrs:{"class":"name"},children:[{text:scope => { with(scope) { return "还剩 "+String((pairs) ?? "")+" 对" } }}]},{tag:"view",attrs:{"class":"muted"},children:[{text:"相同图案之间最多拐两次，可从边缘绕行。"}]},{tag:"view",attrs:{"class":"link-board"},children:[{tag:"view",attrs:{"wx:for":scope => { with(scope) { return (board) } },"wx:key":"index","class":scope => { with(scope) { return "tile "+String((!item ? 'empty' : '') ?? "")+" "+String((selected === index || hints[0] === index || hints[1] === index ? 'lit' : '') ?? "")+"" } },"bindtap":"pick","data-i":scope => { with(scope) { return (index) } }},children:[{text:scope => { with(scope) { return (item) } }}]}]},{tag:"view",attrs:{"class":"row"},children:[{tag:"button",attrs:{"class":"quiet","bindtap":"showHint"},children:[{text:"提示"}]},{tag:"button",attrs:{"class":"quiet","bindtap":"reshuffle"},children:[{text:"重排"}]}]},{tag:"view",attrs:{"class":"muted notice"},children:[{text:scope => { with(scope) { return (notice) } }}]}]},{tag:"view",attrs:{"class":"card","wx:if":scope => { with(scope) { return (!result && mode === 'quiz') } }},children:[{tag:"view",attrs:{"class":"eyebrow"},children:[{text:scope => { with(scope) { return "第 "+String((index + 1) ?? "")+" / 5 题" } }}]},{tag:"view",attrs:{"class":"name question"},children:[{text:scope => { with(scope) { return (question[0]) } }}]},{tag:"button",attrs:{"class":"choice","wx:for":scope => { with(scope) { return (question[1]) } },"wx:key":"*this","data-i":scope => { with(scope) { return (index) } },"bindtap":"answer","disabled":scope => { with(scope) { return (!!feedback) } }},children:[{text:scope => { with(scope) { return (item) } }}]},{tag:"view",attrs:{"wx:if":scope => { with(scope) { return (feedback) } }},children:[{tag:"view",attrs:{"class":"notice"},children:[{text:scope => { with(scope) { return (feedback) } }}]},{tag:"button",attrs:{"class":"action","bindtap":"advance"},children:[{text:scope => { with(scope) { return (index === 4 ? '查看成绩' : '下一题') } }}]}]}]},{tag:"view",attrs:{"class":"card","wx:if":scope => { with(scope) { return (result) } }},children:[{tag:"view",attrs:{"class":"name"},children:[{text:scope => { with(scope) { return (result) } }}]},{tag:"button",attrs:{"class":"action","bindtap":"restart"},children:[{text:"再玩一次"}]}]}]}]}],"pages/mall/mall":[{tag:"view",attrs:{"class":"play"},children:[{tag:"view",attrs:{"class":"hero shop-hero"},children:[{tag:"view",attrs:{},children:[{tag:"view",attrs:{"class":"eyebrow"},children:[{text:"萌宠补给站"}]},{tag:"view",attrs:{"class":"title"},children:[{text:"道具商店"}]},{tag:"view",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return "6 个分类 · "+String((total) ?? "")+" 件好物" } }}]}]},{tag:"view",attrs:{"class":"score-box"},children:[{tag:"view",attrs:{"class":"muted"},children:[{text:"可用积分"}]},{tag:"view",attrs:{"class":"score"},children:[{text:scope => { with(scope) { return (score) } }}]}]}]},{tag:"button",attrs:{"class":"dex-entry","bindtap":"openDogDex"},children:[{tag:"view",attrs:{"class":"dex-thumb"},children:[{tag:"image",attrs:{"src":scope => { with(scope) { return (atlas) } },"mode":"scaleToFill"},children:[]}]},{tag:"view",attrs:{"class":"dex-label"},children:[{tag:"view",attrs:{"class":"name"},children:[{text:"狗狗图鉴"}]},{tag:"view",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return "解锁更多狗狗 · 已点亮 "+String((dogCount) ?? "")+" / "+String((dogTotal) ?? "")+"" } }}]}]},{tag:"text",attrs:{"class":"chevron"},children:[{text:"›"}]}]},{tag:"view",attrs:{"class":"categories"},children:[{tag:"button",attrs:{"wx:for":scope => { with(scope) { return (categories) } },"wx:key":"id","class":scope => { with(scope) { return "category "+String((active.id === item.id ? 'active' : '') ?? "")+"" } },"data-id":scope => { with(scope) { return (item.id) } },"bindtap":"selectCategory"},children:[{tag:"text",attrs:{"class":"category-icon"},children:[{text:scope => { with(scope) { return (item.icon) } }}]},{tag:"text",attrs:{},children:[{text:scope => { with(scope) { return (item.name) } }}]}]}]},{tag:"view",attrs:{"class":"section"},children:[{tag:"text",attrs:{"class":"name"},children:[{text:scope => { with(scope) { return (active.name) } }}]},{tag:"text",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return ""+String((items.length) ?? "")+" 件商品" } }}]}]},{tag:"view",attrs:{"class":"card product","wx:for":scope => { with(scope) { return (items) } },"wx:key":"id"},children:[{tag:"view",attrs:{"class":"product-main"},children:[{tag:"view",attrs:{"class":"name"},children:[{text:scope => { with(scope) { return (item.name) } }}]},{tag:"view",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return (item.effectText) } }}]},{tag:"view",attrs:{"class":"owned"},children:[{text:scope => { with(scope) { return "已拥有 "+String((item.owned) ?? "")+"" } }}]}]},{tag:"view",attrs:{"class":"product-side"},children:[{tag:"view",attrs:{"class":"price"},children:[{text:scope => { with(scope) { return (item.price) } }},{tag:"text",attrs:{},children:[{text:"积分"}]}]},{tag:"button",attrs:{"class":"action redeem","bindtap":"buy","data-id":scope => { with(scope) { return (item.id) } },"disabled":scope => { with(scope) { return (score < item.price) } }},children:[{text:scope => { with(scope) { return (score < item.price ? '积分不足' : '兑换') } }}]}]}]}]}],"pages/region/region":[{tag:"view",attrs:{"class":"play"},children:[{tag:"view",attrs:{"class":"hero"},children:[{tag:"view",attrs:{"class":"eyebrow"},children:[{text:"地区 · PK 专区"}]},{tag:"view",attrs:{"class":"title"},children:[{text:scope => { with(scope) { return (visit ? '串门时间' : '萌宠小窝大厅') } }}]},{tag:"view",attrs:{"class":"muted"},children:[{text:"拜访公开且在线的小窝，等大家同意后一起开玩。"}]}]},{tag:"view",attrs:{"class":"card","wx:if":scope => { with(scope) { return (error) } }},children:[{tag:"view",attrs:{},children:[{text:scope => { with(scope) { return (error) } }}]},{tag:"button",attrs:{"class":"quiet","bindtap":"retry"},children:[{text:"重新连接"}]}]},{tag:"block",attrs:{"wx:if":scope => { with(scope) { return (visit) } }},children:[{tag:"button",attrs:{"class":"quiet back","bindtap":"back"},children:[{text:"‹ 返回地区大厅"}]},{tag:"view",attrs:{"class":"card"},children:[{tag:"image",attrs:{"class":"nest-cover","src":"./assets/home_nest.png","mode":"aspectFit"},children:[]},{tag:"view",attrs:{"class":"name"},children:[{text:scope => { with(scope) { return ""+String((visit.name) ?? "")+"的小窝" } }}]},{tag:"view",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return "在线 · "+String((visit.pet) ?? "")+" · "+String((visit.city || '地区未设置') ?? "")+"" } }}]}]},{tag:"view",attrs:{"class":"card"},children:[{tag:"view",attrs:{"class":"name"},children:[{text:"发起 PK"}]},{tag:"view",attrs:{"class":"mode-grid"},children:[{tag:"button",attrs:{"wx:for":scope => { with(scope) { return (modes) } },"wx:key":"key","class":scope => { with(scope) { return "quiet "+String((mode.key === item.key ? 'chosen' : '') ?? "")+"" } },"bindtap":"choose","data-i":scope => { with(scope) { return (index) } }},children:[{text:scope => { with(scope) { return ""+String((item.name) ?? "")+" · "+String((item.size) ?? "")+" 人" } }}]}]},{tag:"view",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return "已邀请 "+String((selected.length) ?? "")+" / "+String((need) ?? "")+" 位玩家"+String((need > 1 ? '，请从下方再选队友' : '') ?? "")+"" } }}]},{tag:"block",attrs:{"wx:if":scope => { with(scope) { return (need > 1) } }},children:[{tag:"button",attrs:{"wx:for":scope => { with(scope) { return (nests) } },"wx:key":"key","wx:if":scope => { with(scope) { return (item.key !== visit.key) } },"class":"quiet","bindtap":"toggleGuest","data-key":scope => { with(scope) { return (item.key) } }},children:[{text:scope => { with(scope) { return (item.name) } }},{tag:"text",attrs:{"wx:if":scope => { with(scope) { return (selected[1] === item.key || selected[2] === item.key) } }},children:[{text:"· 已选"}]}]}]},{tag:"button",attrs:{"class":"action","bindtap":"invite","disabled":scope => { with(scope) { return (busy || selected.length !== need) } }},children:[{text:"发送邀请"}]}]}]},{tag:"block",attrs:{"wx:else":true},children:[{tag:"view",attrs:{"class":"card","wx:if":scope => { with(scope) { return (rooms.length) } }},children:[{tag:"view",attrs:{"class":"name"},children:[{text:"我的邀请与对局"}]},{tag:"button",attrs:{"wx:for":scope => { with(scope) { return (rooms) } },"wx:key":"id","class":"quiet","data-id":scope => { with(scope) { return (item.id) } },"bindtap":"openRoom"},children:[{text:scope => { with(scope) { return ""+String((item.players[0].name) ?? "")+" · "+String((item.modeName) ?? "")+" · "+String((item.status === 'playing' ? '对局中' : item.players[item.seat].accepted ? '等待开局' : '待确认') ?? "")+"" } }}]}]},{tag:"view",attrs:{"class":"row filters"},children:[{tag:"button",attrs:{"class":"quiet","bindtap":"toggleLocal"},children:[{text:scope => { with(scope) { return (local ? '正在看同城 · 切换全部' : '全部地区 · 筛选同城') } }}]},{tag:"button",attrs:{"class":"quiet","bindtap":"profile"},children:[{text:"我的小窝设置"}]}]},{tag:"view",attrs:{"class":"card entry","wx:for":scope => { with(scope) { return (visible) } },"wx:key":"key","bindtap":"visitNest","data-key":scope => { with(scope) { return (item.key) } }},children:[{tag:"text",attrs:{"class":"badge mint"},children:[{text:"🏡"}]},{tag:"view",attrs:{},children:[{tag:"view",attrs:{"class":"name"},children:[{text:scope => { with(scope) { return ""+String((item.name) ?? "")+"的小窝" } }}]},{tag:"view",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return "在线 · "+String((item.city || '地区未设置') ?? "")+" · "+String((item.pet) ?? "")+"" } }}]}]},{tag:"text",attrs:{"class":"chevron"},children:[{text:"›"}]}]},{tag:"view",attrs:{"class":"card muted","wx:if":scope => { with(scope) { return (!visible.length && !error) } }},children:[{text:scope => { with(scope) { return (loaded ? '现在没有符合条件的小窝。晚点再来串门吧！' : '正在寻找在线小窝…') } }}]}]}]}],"pages/profile/profile":[{tag:"view",attrs:{"class":"play"},children:[{tag:"button",attrs:{"wx:if":scope => { with(scope) { return (returnToRegion) } },"class":"quiet back","bindtap":"backToRegion"},children:[{text:"‹ 返回地区大厅"}]},{tag:"view",attrs:{"class":"hero"},children:[{tag:"view",attrs:{"class":"eyebrow"},children:[{text:"我的萌宠手账"}]},{tag:"view",attrs:{"class":"title"},children:[{text:scope => { with(scope) { return (nickname) } }}]},{tag:"view",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return "当前陪伴 · "+String((current) ?? "")+"　｜　"+String((score) ?? "")+" 积分" } }}]}]},{tag:"view",attrs:{"class":"card"},children:[{tag:"view",attrs:{"class":"name"},children:[{text:scope => { with(scope) { return "我的狗狗 · "+String((dogCount) ?? "")+" 种" } }}]},{tag:"view",attrs:{"class":"pet-line","wx:for":scope => { with(scope) { return (dogs) } },"wx:key":"breedId"},children:[{tag:"text",attrs:{},children:[{text:scope => { with(scope) { return "🐶 "+String((item.breedName) ?? "")+"" } }}]},{tag:"text",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return (item.current ? '陪伴中' : item.date) } }}]}]},{tag:"view",attrs:{"wx:if":scope => { with(scope) { return (!dogs.length) } },"class":"muted"},children:[{text:"还没有狗狗记录。"}]},{tag:"block",attrs:{"wx:if":scope => { with(scope) { return (others.length) } }},children:[{tag:"view",attrs:{"class":"name subsection"},children:[{text:"其他萌宠"}]},{tag:"view",attrs:{"class":"pet-line","wx:for":scope => { with(scope) { return (others) } },"wx:key":"breedId"},children:[{tag:"text",attrs:{},children:[{text:scope => { with(scope) { return "🐱 "+String((item.breedName) ?? "")+"" } }}]},{tag:"text",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return (item.current ? '陪伴中' : item.date) } }}]}]}]},{tag:"button",attrs:{"class":"quiet","bindtap":"manage"},children:[{text:"管理萌宠"}]}]},{tag:"view",attrs:{"class":"card"},children:[{tag:"view",attrs:{"class":"name"},children:[{text:"管理记录"}]},{tag:"view",attrs:{"wx:for":scope => { with(scope) { return (history) } },"wx:key":"id","class":"pet-line"},children:[{tag:"text",attrs:{},children:[{text:scope => { with(scope) { return ""+String((item.action) ?? "")+" · "+String((item.breedName) ?? "")+"" } }}]},{tag:"text",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return (item.date) } }}]}]},{tag:"view",attrs:{"wx:if":scope => { with(scope) { return (!history.length) } },"class":"muted"},children:[{text:"领养或切换萌宠后，记录会显示在这里。"}]}]},{tag:"view",attrs:{"class":"card"},children:[{tag:"view",attrs:{"class":"name"},children:[{text:"串门设置"}]},{tag:"view",attrs:{"class":"row"},children:[{tag:"input",attrs:{"class":"nickname","maxlength":"16","value":scope => { with(scope) { return (nickname) } },"bindinput":"nicknameInput","placeholder":"小窝主人昵称"},children:[]},{tag:"button",attrs:{"class":"quiet","bindtap":"saveName"},children:[{text:"保存昵称"}]}]},{tag:"picker",attrs:{"mode":"region","bindchange":"setRegion"},children:[{tag:"view",attrs:{"class":"pet-line"},children:[{tag:"text",attrs:{},children:[{text:"我的地区"}]},{tag:"text",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return ""+String((region) ?? "")+" ›" } }}]}]}]},{tag:"view",attrs:{"class":"pet-line"},children:[{tag:"text",attrs:{},children:[{text:"在线时公开小窝"}]},{tag:"switch",attrs:{"checked":scope => { with(scope) { return (open) } },"bindchange":"setOpen","color":"#a95722"},children:[]}]},{tag:"view",attrs:{"class":"muted"},children:[{text:"公开后，其他玩家可以串门并发起邀请。你同意后才会开始 PK。"}]}]}]}],"pages/messages/messages":[{tag:"view",attrs:{"class":"wrap","wx:if":scope => { with(scope) { return (state) } }},children:[{tag:"view",attrs:{"class":"topbar"},children:[{tag:"button",attrs:{"class":"backBtn","bindtap":"goBack"},children:[{text:"返回首页"}]},{tag:"view",attrs:{"class":"pageTitle"},children:[{text:"消息通知"}]}]},{tag:"view",attrs:{"class":"empty","wx:if":scope => { with(scope) { return (state.messages.list.length === 0) } }},children:[{text:"暂无消息"}]},{tag:"view",attrs:{"class":"item","wx:for":scope => { with(scope) { return (state.messages.list) } },"wx:key":"id"},children:[{tag:"view",attrs:{"class":"titleRow"},children:[{tag:"view",attrs:{"class":"title"},children:[{text:scope => { with(scope) { return (item.title) } }}]},{tag:"view",attrs:{"class":"dot","wx:if":scope => { with(scope) { return (!item.read) } }},children:[]}]},{tag:"view",attrs:{"class":"content"},children:[{text:scope => { with(scope) { return (item.content) } }}]},{tag:"view",attrs:{"class":"time"},children:[{text:scope => { with(scope) { return (item.time) } }}]}]}]}],"pages/catch/catch":[{tag:"view",attrs:{"class":"wrap"},children:[{tag:"view",attrs:{"class":"panel"},children:[{tag:"view",attrs:{"class":"panelHeader"},children:[{tag:"view",attrs:{"class":"panelTitle"},children:[{text:scope => { with(scope) { return (labels.title) } }}]},{tag:"button",attrs:{"class":"lobbyBtn","bindtap":"returnToLobby"},children:[{text:"‹ 返回游戏大厅"}]}]},{tag:"view",attrs:{"class":"hud"},children:[{tag:"view",attrs:{"class":"hudItem"},children:[{tag:"view",attrs:{"class":"hudLabel"},children:[{text:scope => { with(scope) { return (labels.time) } }}]},{tag:"view",attrs:{"class":"hudValue"},children:[{text:scope => { with(scope) { return ""+String((timeLeft) ?? "")+"s" } }}]}]},{tag:"view",attrs:{"class":"hudItem"},children:[{tag:"view",attrs:{"class":"hudLabel"},children:[{text:scope => { with(scope) { return (labels.score) } }}]},{tag:"view",attrs:{"class":"hudValue"},children:[{text:scope => { with(scope) { return (score) } }}]}]},{tag:"view",attrs:{"class":"hudItem"},children:[{tag:"view",attrs:{"class":"hudLabel"},children:[{text:scope => { with(scope) { return (labels.totalScore) } }}]},{tag:"view",attrs:{"class":"hudValue"},children:[{text:scope => { with(scope) { return (totalScore) } }}]}]}]}]},{tag:"canvas",attrs:{"type":"2d","id":"gameCanvas","class":"canvas","bindtouchstart":"onTouch","bindtouchmove":"onTouch"},children:[]},{tag:"view",attrs:{"class":"btns"},children:[{tag:"button",attrs:{"class":"primary","bindtap":"startGame","disabled":scope => { with(scope) { return (running || !ready) } }},children:[{text:scope => { with(scope) { return (ready ? buttonLabels.start : buttonLabels.loading) } }}]},{tag:"button",attrs:{"class":"secondary","bindtap":"stopGame","disabled":scope => { with(scope) { return (!running) } }},children:[{text:scope => { with(scope) { return (buttonLabels.stop) } }}]}]},{tag:"view",attrs:{"class":"tips"},children:[{tag:"text",attrs:{},children:[{text:scope => { with(scope) { return (labels.tips) } }}]}]}]}],"pages/pk/pk":[{tag:"view",attrs:{"class":"play"},children:[{tag:"button",attrs:{"class":"quiet back","bindtap":"lobby"},children:[{text:"‹ 返回地区大厅"}]},{tag:"view",attrs:{"class":"hero"},children:[{tag:"view",attrs:{"class":"eyebrow"},children:[{text:"小窝对战"}]},{tag:"view",attrs:{"class":"title"},children:[{text:scope => { with(scope) { return (room.modeName || 'PK 房间') } }}]},{tag:"view",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return (rule) } }}]}]},{tag:"view",attrs:{"class":"card","wx:if":scope => { with(scope) { return (error || !room) } }},children:[{tag:"view",attrs:{},children:[{text:scope => { with(scope) { return (error || '正在打开房间…') } }}]},{tag:"button",attrs:{"class":"quiet","wx:if":scope => { with(scope) { return (error) } },"bindtap":"refresh"},children:[{text:"重新连接"}]}]},{tag:"block",attrs:{"wx:if":scope => { with(scope) { return (room) } }},children:[{tag:"view",attrs:{"class":"card"},children:[{tag:"view",attrs:{"wx:for":scope => { with(scope) { return (room.players) } },"wx:key":"index","class":"seat"},children:[{tag:"text",attrs:{},children:[{text:scope => { with(scope) { return ""+String((item.name) ?? "")+""+String((index === room.seat ? '（你）' : '') ?? "")+"" } }}]},{tag:"text",attrs:{"class":"muted","wx:if":scope => { with(scope) { return (room.status === 'waiting') } }},children:[{text:scope => { with(scope) { return ""+String((item.accepted ? '已同意' : '待确认') ?? "")+""+String((item.pet ? ' · ' + item.pet : '') ?? "")+"" } }}]},{tag:"text",attrs:{"class":"muted","wx:elif":scope => { with(scope) { return (room.mode === 'quiz' && room.game) } }},children:[{text:scope => { with(scope) { return ""+String((room.game.progress[index].count) ?? "")+" / 5 题"+String((room.status === 'done' ? ' · 答对 ' + room.game.progress[index].correct : '') ?? "")+"" } }}]},{tag:"text",attrs:{"class":"muted","wx:elif":scope => { with(scope) { return (room.mode === 'race') } }},children:[{text:scope => { with(scope) { return (item.pet) } }}]},{tag:"text",attrs:{"class":"muted","wx:elif":scope => { with(scope) { return (room.game.counts) } }},children:[{text:scope => { with(scope) { return ""+String((room.game.landlord === index ? '地主 · ' : room.game.landlord >= 0 ? '农民 · ' : '') ?? "")+""+String((room.game.counts[index]) ?? "")+" 张" } }}]},{tag:"text",attrs:{"class":"muted","wx:elif":scope => { with(scope) { return (room.mode === 'gomoku') } }},children:[{text:scope => { with(scope) { return (index === 0 ? '黑棋' : '白棋') } }}]}]}]},{tag:"view",attrs:{"class":"card","wx:if":scope => { with(scope) { return (room.status === 'waiting') } }},children:[{tag:"block",attrs:{"wx:if":scope => { with(scope) { return (!room.players[room.seat].accepted) } }},children:[{tag:"view",attrs:{"class":"name"},children:[{text:scope => { with(scope) { return ""+String((room.players[0].name) ?? "")+" 邀请你一起玩" } }}]},{tag:"view",attrs:{"class":"row"},children:[{tag:"button",attrs:{"class":"action","bindtap":"accept","disabled":scope => { with(scope) { return (pending) } }},children:[{text:"接受 PK"}]},{tag:"button",attrs:{"class":"quiet","bindtap":"decline","disabled":scope => { with(scope) { return (pending) } }},children:[{text:"婉拒"}]}]}]},{tag:"block",attrs:{"wx:else":true},children:[{tag:"view",attrs:{"class":"name"},children:[{text:scope => { with(scope) { return (ready ? '大家都准备好了' : '等待玩家准备') } }}]},{tag:"block",attrs:{"wx:if":scope => { with(scope) { return (room.mode === 'race') } }},children:[{tag:"picker",attrs:{"range":scope => { with(scope) { return (pets) } },"bindchange":"setPet","disabled":scope => { with(scope) { return (pending) } }},children:[{tag:"view",attrs:{"class":"choice"},children:[{text:scope => { with(scope) { return "参赛萌宠 · "+String((racePet || '点这里选择') ?? "")+" ›" } }}]}]},{tag:"picker",attrs:{"wx:if":scope => { with(scope) { return (room.seat === 0) } },"range":scope => { with(scope) { return (room.maps) } },"value":scope => { with(scope) { return (mapIndex) } },"bindchange":"setMap","disabled":scope => { with(scope) { return (pending) } }},children:[{tag:"view",attrs:{"class":"choice"},children:[{text:scope => { with(scope) { return "地图 · "+String((room.mapName) ?? "")+" ›" } }}]}]},{tag:"view",attrs:{"class":"muted","wx:else":true},children:[{text:scope => { with(scope) { return "地图 · "+String((room.mapName) ?? "")+"（由发起人选择）" } }}]},{tag:"button",attrs:{"class":"action","wx:if":scope => { with(scope) { return (room.seat === 0) } },"bindtap":"start","disabled":scope => { with(scope) { return (pending || !ready) } }},children:[{text:"开始闯关"}]}]},{tag:"button",attrs:{"class":"quiet","bindtap":"cancel","disabled":scope => { with(scope) { return (pending) } }},children:[{text:"取消本场邀请"}]}]}]},{tag:"block",attrs:{"wx:elif":scope => { with(scope) { return (room.status === 'playing') } }},children:[{tag:"view",attrs:{"class":"card","wx:if":scope => { with(scope) { return (room.mode === 'gomoku') } }},children:[{tag:"view",attrs:{"class":"name"},children:[{text:scope => { with(scope) { return (myTurn ? '轮到你落子' : '等待对手落子') } }}]},{tag:"view",attrs:{"class":"gomoku"},children:[{tag:"view",attrs:{"wx:for":scope => { with(scope) { return (room.game.board) } },"wx:key":"index","class":"square","data-i":scope => { with(scope) { return (index) } },"bindtap":"place"},children:[{tag:"view",attrs:{"wx:if":scope => { with(scope) { return (item) } },"class":scope => { with(scope) { return "stone "+String((item === 1 ? 'black' : 'white') ?? "")+"" } }},children:[]}]}]}]},{tag:"view",attrs:{"class":"card","wx:elif":scope => { with(scope) { return (room.mode === 'quiz') } }},children:[{tag:"view",attrs:{"class":"eyebrow"},children:[{text:scope => { with(scope) { return "剩余 "+String((seconds) ?? "")+" 秒" } }}]},{tag:"block",attrs:{"wx:if":scope => { with(scope) { return (room.game.question) } }},children:[{tag:"view",attrs:{"class":"name question"},children:[{text:scope => { with(scope) { return ""+String((room.game.index + 1) ?? "")+" / 5 · "+String((room.game.question.text) ?? "")+"" } }}]},{tag:"button",attrs:{"class":"choice","wx:for":scope => { with(scope) { return (room.game.question.options) } },"wx:key":"*this","data-i":scope => { with(scope) { return (index) } },"bindtap":"answer","disabled":scope => { with(scope) { return (pending || !seconds) } }},children:[{text:scope => { with(scope) { return (item) } }}]}]},{tag:"view",attrs:{"wx:else":true,"class":"name"},children:[{text:"已完成，等待对方交卷"}]}]},{tag:"view",attrs:{"class":"card","wx:elif":scope => { with(scope) { return (room.mode === 'race') } }},children:[{tag:"view",attrs:{"class":"name"},children:[{text:scope => { with(scope) { return ""+String((room.mapName) ?? "")+" · "+String((seconds ? seconds + ' 秒后出发' : '跑向终点！') ?? "")+"" } }}]},{tag:"view",attrs:{"class":"muted"},children:[{text:"🐶 你　🐕 对手　🐾 同一格"}]},{tag:"view",attrs:{"class":"track"},children:[{tag:"view",attrs:{"wx:for":scope => { with(scope) { return (grid) } },"wx:key":"id","class":scope => { with(scope) { return "track-cell "+String((item.wall ? 'wall' : '') ?? "")+"" } }},children:[{text:scope => { with(scope) { return (item.label) } }}]}]},{tag:"view",attrs:{"id":"joystick","class":"joystick","catchtouchstart":"joystickStart","catchtouchmove":"joystickMove","catchtouchend":"stopJoystick","catchtouchcancel":"stopJoystick"},children:[{tag:"text",attrs:{"class":"up"},children:[{text:"▲"}]},{tag:"text",attrs:{"class":"down"},children:[{text:"▼"}]},{tag:"text",attrs:{"class":"left"},children:[{text:"◀"}]},{tag:"text",attrs:{"class":"right"},children:[{text:"▶"}]},{tag:"view",attrs:{"class":"knob","style":scope => { with(scope) { return "transform:translate("+String((joyX) ?? "")+"px,"+String((joyY) ?? "")+"px)" } }},children:[]}]}]},{tag:"view",attrs:{"class":"card","wx:else":true},children:[{tag:"view",attrs:{"class":"name"},children:[{text:scope => { with(scope) { return (myTurn ? '轮到你了' : '等待 ' + room.players[room.game.turn].name) } }}]},{tag:"block",attrs:{"wx:if":scope => { with(scope) { return (room.mode === 'cards') } }},children:[{tag:"view",attrs:{"class":"muted","wx:if":scope => { with(scope) { return (room.game.landlord < 0) } }},children:[{text:scope => { with(scope) { return "叫地主 · 当前最高 "+String((room.game.bid) ?? "")+" 分" } }}]},{tag:"view",attrs:{"class":"muted","wx:else":true},children:[{text:scope => { with(scope) { return "底牌 · "+String((bottom) ?? "")+"" } }},{tag:"view",attrs:{},children:[{text:scope => { with(scope) { return (last || '新一轮，自由出牌') } }}]}]}]},{tag:"block",attrs:{"wx:else":true},children:[{tag:"view",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return "牌墙剩余 "+String((room.game.remaining) ?? "")+" 张" } }}]},{tag:"view",attrs:{"wx:for":scope => { with(scope) { return (discards) } },"wx:key":"i","class":"muted"},children:[{text:scope => { with(scope) { return ""+String((item.name) ?? "")+"："+String((item.tiles || '尚未弃牌') ?? "")+"" } }}]}]},{tag:"view",attrs:{"class":"hand"},children:[{tag:"button",attrs:{"wx:for":scope => { with(scope) { return (hand) } },"wx:key":"id","class":scope => { with(scope) { return "face "+String((item.selected ? 'chosen' : '') ?? "")+"" } },"data-i":scope => { with(scope) { return (item.id) } },"bindtap":"pickCard","disabled":scope => { with(scope) { return (!myTurn || pending) } }},children:[{text:scope => { with(scope) { return (item.label) } }}]}]},{tag:"block",attrs:{"wx:if":scope => { with(scope) { return (myTurn) } }},children:[{tag:"view",attrs:{"class":"row","wx:if":scope => { with(scope) { return (room.mode === 'cards' && room.game.landlord < 0) } }},children:[{tag:"button",attrs:{"wx:for":scope => { with(scope) { return (bids) } },"wx:key":"*this","class":"quiet","data-i":scope => { with(scope) { return (item) } },"bindtap":"bid","disabled":scope => { with(scope) { return (pending) } }},children:[{text:scope => { with(scope) { return (item ? item + ' 分' : '不叫') } }}]}]},{tag:"view",attrs:{"class":"row","wx:elif":scope => { with(scope) { return (room.mode === 'cards') } }},children:[{tag:"button",attrs:{"class":"action","bindtap":"playCards","disabled":scope => { with(scope) { return (pending || !picked.length) } }},children:[{text:"出牌"}]},{tag:"button",attrs:{"class":"quiet","bindtap":"pass","disabled":scope => { with(scope) { return (pending || !room.game.last) } }},children:[{text:"不要"}]}]},{tag:"view",attrs:{"class":"row","wx:else":true},children:[{tag:"button",attrs:{"class":"action","bindtap":"discard","disabled":scope => { with(scope) { return (pending || !picked.length) } }},children:[{text:"打出"}]},{tag:"button",attrs:{"class":"quiet","bindtap":"hu","disabled":scope => { with(scope) { return (pending || !room.game.canHu) } }},children:[{text:"自摸"}]}]}]}]},{tag:"button",attrs:{"class":"quiet","bindtap":"leave","disabled":scope => { with(scope) { return (pending) } }},children:[{text:"结束对局"}]}]},{tag:"view",attrs:{"class":"card","wx:else":true},children:[{tag:"view",attrs:{"class":"name"},children:[{text:scope => { with(scope) { return (room.status === 'done' ? room.game.result : room.status === 'declined' ? '有玩家婉拒了邀请' : room.status === 'cancelled' ? '邀请已取消' : '房间已过期') } }}]},{tag:"button",attrs:{"class":"action","bindtap":"lobby"},children:[{text:"返回地区大厅"}]}]}]}]}],"pages/dogdex/dogdex":[{tag:"view",attrs:{"class":"play"},children:[{tag:"button",attrs:{"class":"quiet back","bindtap":"goBack"},children:[{text:"‹ 返回道具商店"}]},{tag:"view",attrs:{"class":"hero"},children:[{tag:"view",attrs:{"class":"eyebrow"},children:[{text:"萌宠收藏册"}]},{tag:"view",attrs:{"class":"title"},children:[{text:"狗狗图鉴"}]},{tag:"view",attrs:{"class":"dex-stats"},children:[{tag:"text",attrs:{},children:[{text:scope => { with(scope) { return "已点亮 "+String((count) ?? "")+" / "+String((total) ?? "")+" 种" } }}]},{tag:"text",attrs:{},children:[{text:scope => { with(scope) { return "可用 "+String((score) ?? "")+" 积分" } }}]}]},{tag:"progress",attrs:{"percent":scope => { with(scope) { return (100 * count / total) } },"stroke-width":"6","border-radius":"10","activeColor":"#aa5b2d","backgroundColor":"#fff5e5"},children:[]}]},{tag:"block",attrs:{"wx:for":scope => { with(scope) { return (groups) } },"wx:for-item":"group","wx:key":"id"},children:[{tag:"view",attrs:{"class":"tier"},children:[{tag:"text",attrs:{"class":"name"},children:[{text:scope => { with(scope) { return (group.name) } }}]},{tag:"text",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return ""+String((group.count) ?? "")+" / "+String((group.dogs.length) ?? "")+" 已点亮" } }}]}]},{tag:"view",attrs:{"class":"dex-grid"},children:[{tag:"view",attrs:{"class":"card breed","wx:for":scope => { with(scope) { return (group.dogs) } },"wx:for-item":"dog","wx:key":"id"},children:[{tag:"view",attrs:{"class":"portrait"},children:[{tag:"image",attrs:{"class":"atlas","src":scope => { with(scope) { return (atlas) } },"mode":"scaleToFill","style":scope => { with(scope) { return "left: "+String((dog.offsetX) ?? "")+"%; top: "+String((dog.offsetY) ?? "")+"%;" } }},children:[]}]},{tag:"view",attrs:{"class":"breed-info"},children:[{tag:"view",attrs:{"class":"breed-name"},children:[{text:scope => { with(scope) { return (dog.name) } }}]},{tag:"view",attrs:{"class":scope => { with(scope) { return "breed-status "+String((dog.owned ? 'owned' : '') ?? "")+"" } }},children:[{text:scope => { with(scope) { return (dog.current ? '陪伴中' : dog.owned ? '已点亮' : '未解锁') } }}]}]},{tag:"view",attrs:{"class":"breed-cost","wx:if":scope => { with(scope) { return (!dog.price) } }},children:[{text:"开局赠送"}]},{tag:"view",attrs:{"class":"breed-cost","wx:elif":scope => { with(scope) { return (!dog.owned) } }},children:[{text:scope => { with(scope) { return ""+String((dog.price) ?? "")+" 积分" } }}]},{tag:"view",attrs:{"class":"breed-cost","wx:else":true},children:[{text:"可免费切换"}]},{tag:"button",attrs:{"wx:if":scope => { with(scope) { return (!dog.owned) } },"class":"action dex-button","disabled":scope => { with(scope) { return (!dog.affordable) } },"data-id":scope => { with(scope) { return (dog.id) } },"bindtap":"unlock"},children:[{text:scope => { with(scope) { return (dog.affordable ? '解锁' : '积分不足') } }}]},{tag:"button",attrs:{"wx:else":true,"class":"quiet dex-button","disabled":scope => { with(scope) { return (dog.current) } },"data-id":scope => { with(scope) { return (dog.id) } },"bindtap":"switchPet"},children:[{text:scope => { with(scope) { return (dog.current ? '当前萌宠' : '设为陪伴') } }}]}]}]}]}]}],"pages/album/album":[{tag:"view",attrs:{"class":"play"},children:[{tag:"button",attrs:{"class":"quiet back","bindtap":"goBack"},children:[{text:"‹ 返回首页"}]},{tag:"view",attrs:{"class":"hero"},children:[{tag:"view",attrs:{"class":"eyebrow"},children:[{text:"小窝里的瞬间"}]},{tag:"view",attrs:{"class":"title"},children:[{text:"萌宠相册"}]},{tag:"view",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return ""+String((total) ?? "")+" 张照片" } }}]}]},{tag:"view",attrs:{"class":"card","wx:if":scope => { with(scope) { return (!total) } }},children:[{tag:"view",attrs:{"class":"name"},children:[{text:"还没有照片"}]},{tag:"view",attrs:{"class":"muted"},children:[{text:"点首页的相机，就能把小窝里的这一刻存下来。"}]}]},{tag:"view",attrs:{"class":"card","wx:for":scope => { with(scope) { return (groups) } },"wx:for-item":"group","wx:for-index":"groupIndex","wx:key":"id"},children:[{tag:"view",attrs:{"class":"name"},children:[{text:scope => { with(scope) { return (group.name) } }}]},{tag:"view",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return ""+String((group.photos.length) ?? "")+" 张照片" } }}]},{tag:"view",attrs:{"class":"photo-grid"},children:[{tag:"view",attrs:{"wx:for":scope => { with(scope) { return (group.photos) } },"wx:for-item":"photo","wx:key":"id","data-group":scope => { with(scope) { return (groupIndex) } },"data-path":scope => { with(scope) { return (photo.path) } },"bindtap":"preview"},children:[{tag:"image",attrs:{"class":"photo","src":scope => { with(scope) { return (photo.path) } },"mode":"aspectFill","lazy-load":scope => { with(scope) { return (true) } }},children:[]},{tag:"view",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return (photo.date) } }}]}]}]}]}]}],"pages/bag/bag":[{tag:"view",attrs:{"class":"play"},children:[{tag:"button",attrs:{"class":"quiet back","bindtap":"goBack"},children:[{text:"‹ 返回首页"}]},{tag:"view",attrs:{"class":"hero"},children:[{tag:"view",attrs:{"class":"eyebrow"},children:[{text:"我的小窝道具"}]},{tag:"view",attrs:{"class":"title"},children:[{text:"萌宠背包"}]},{tag:"view",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return "点「使用」把道具摆到首页，再拖动到喜欢的位置。已摆放 "+String((placedCount) ?? "")+" 件。" } }}]}]},{tag:"view",attrs:{"class":"card","wx:if":scope => { with(scope) { return (!items.length) } }},children:[{tag:"view",attrs:{"class":"name"},children:[{text:"背包空空的"}]},{tag:"view",attrs:{"class":"muted"},children:[{text:"在道具商店兑换的物品会放到这里。"}]},{tag:"button",attrs:{"class":"action","bindtap":"goShop"},children:[{text:"去道具商店"}]}]},{tag:"view",attrs:{"class":"card bag-item","wx:for":scope => { with(scope) { return (items) } },"wx:key":"id"},children:[{tag:"view",attrs:{"class":"bag-details"},children:[{tag:"image",attrs:{"class":"item-art","src":scope => { with(scope) { return (item.image) } },"mode":"aspectFit","lazy-load":scope => { with(scope) { return (true) } }},children:[]},{tag:"view",attrs:{"class":"item-info"},children:[{tag:"view",attrs:{"class":"name"},children:[{text:scope => { with(scope) { return (item.name) } }}]},{tag:"view",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return ""+String((item.category) ?? "")+" · "+String((item.price) ?? "")+" 积分" } }}]},{tag:"view",attrs:{"class":"muted"},children:[{text:scope => { with(scope) { return "背包 "+String((item.count) ?? "")+" 件 · 已摆放 "+String((item.placed) ?? "")+" 件" } }}]},{tag:"view",attrs:{"class":"muted","wx:if":scope => { with(scope) { return (item.wearing) } }},children:[{text:"当前狗狗穿戴中"}]},{tag:"view",attrs:{"class":"muted","wx:elif":scope => { with(scope) { return (item.wearable) } }},children:[{text:"摆放后可拖到狗狗身上穿戴"}]}]}]},{tag:"view",attrs:{"class":"row"},children:[{tag:"button",attrs:{"class":"action","data-id":scope => { with(scope) { return (item.id) } },"bindtap":"useItem","disabled":scope => { with(scope) { return (!item.count) } }},children:[{text:"使用"}]},{tag:"button",attrs:{"class":"quiet","wx:if":scope => { with(scope) { return (item.placed) } },"data-id":scope => { with(scope) { return (item.id) } },"bindtap":"collect"},children:[{text:"收回一件"}]},{tag:"button",attrs:{"class":"quiet","wx:if":scope => { with(scope) { return (item.wearing) } },"data-id":scope => { with(scope) { return (item.id) } },"bindtap":"undress"},children:[{text:"脱下"}]}]}]}]}]}, modules:{"data/pets":function(require,module,exports,Page,wx){
const tiers = [
  { id: 'starter', name: '初始' },
  { id: 'beginner', name: '入门' },
  { id: 'common', name: '常见' },
  { id: 'advanced', name: '进阶' },
  { id: 'rare', name: '稀有' },
  { id: 'legendary', name: '传说/限定' }
]

// The portrait slot refers to the dog's position in the 5 × 4 image atlas.
const dogRows = [
  ['dog_tianyuan', '中华田园犬', 0, 'starter', 0],
  ['dog_poodle', '泰迪（贵宾犬）', 350, 'beginner', 1],
  ['dog_bichon', '比熊犬', 600, 'beginner', 2],
  ['dog_pomeranian', '博美犬', 500, 'beginner', 3],
  ['dog_corgi', '柯基犬', 1000, 'common', 4],
  ['dog_shiba', '柴犬', 1100, 'common', 5],
  ['dog_schnauzer', '雪纳瑞', 1100, 'common', 6],
  ['dog_french_bulldog', '法斗', 1300, 'common', 7],
  ['dog_westie', '西高地', 800, 'common', 18],
  ['dog_husky', '哈士奇', 2400, 'advanced', 8],
  ['dog_samoyed', '萨摩耶', 2600, 'advanced', 9],
  ['dog_golden', '金毛', 2900, 'advanced', 10],
  ['dog_labrador', '拉布拉多', 2900, 'advanced', 11],
  ['dog_border_collie', '边境牧羊犬', 4800, 'rare', 12],
  ['dog_german_shepherd', '德国牧羊犬', 4800, 'rare', 13],
  ['dog_doberman', '杜宾犬', 5300, 'rare', 14],
  ['dog_akita', '秋田犬', 10000, 'legendary', 15],
  ['dog_rottweiler', '罗威纳犬', 10000, 'legendary', 16],
  ['dog_maltese', '马尔济斯犬', 7500, 'legendary', 17]
]
const dogs = dogRows.map(([id, name, price, tier, portrait]) => ({
  id, name, price, tier, portrait, type: 'dog',
  offsetX: -(portrait % 5) * 100,
  offsetY: -Math.floor(portrait / 5) * 100
}))
const breedById = Object.fromEntries(dogs.map(b => [b.id, b]))
const dogPortraitAtlas = './assets/dog-portraits.jpg'

module.exports = { dogs, tiers, breedById, dogPortraitAtlas }

},"utils/store":function(require,module,exports,Page,wx){
const KEY = "pet_app_state_v1"
const { breedById } = require("data/pets")
const DECAY_INTERVAL_MS = 60 * 1000
const DECAY_AMOUNT = 5
const ALERT_THRESHOLD = 30

function getState() {
  const stored = wx.getStorageSync(KEY)
  if (stored) {
    const normalized = normalizeState(stored)
    wx.setStorageSync(KEY, normalized)
    return normalized
  }

  const now = Date.now()
  const init = {
    user: {
      score: 500,
      region: { province: "未选择", city: "未选择" },
      loggedIn: false,
      userInfo: null
    },
    pet: {
      type: "dog",
      breedId: "dog_tianyuan",
      breedName: "中华田园犬",
      level: 1,
      exp: 0,
      mood: 100,
      hunger: 80,
      health: 100
    },
    inventory: {
      food_dog: 1,
      food_cat: 0
    },
    messages: {
      unread: 0,
      list: []
    },
    alertFlags: {
      moodLowNotified: false,
      hungerLowNotified: false
    },
    lastDecayAt: now
  }
  return setState(init)
}

function setState(next) {
  const normalized = normalizeState(next)
  wx.setStorageSync(KEY, normalized)
  return normalized
}

function update(mutator) {
  const s = getState()
  const next = mutator({
    ...s,
    user: { ...s.user },
    pet: { ...s.pet },
    inventory: { ...s.inventory },
    messages: { unread: s.messages?.unread || 0, list: [...(s.messages?.list || [])] },
    alertFlags: {
      moodLowNotified: !!s.alertFlags?.moodLowNotified,
      hungerLowNotified: !!s.alertFlags?.hungerLowNotified
    }
  })
  return setState(next)
}

function normalizeState(state) {
  const now = Date.now()
  const next = {
    ...state,
    user: { ...(state.user || {}) },
    pet: { ...(state.pet || {}) },
    inventory: { ...(state.inventory || {}) },
    messages: {
      unread: state.messages?.unread || 0,
      list: [...(state.messages?.list || [])]
    },
    alertFlags: {
      moodLowNotified: !!state.alertFlags?.moodLowNotified,
      hungerLowNotified: !!state.alertFlags?.hungerLowNotified
    }
  }

  const starter = { type: "dog", breedId: "dog_tianyuan", breedName: "中华田园犬", acquiredAt: 0 }
  next.ownedPets = { [starter.breedId]: starter, ...(state.ownedPets || {}) }
  next.petHistory = [...(state.petHistory || [])]
  next.yardItems = [...(state.yardItems || [])]
  if (next.pet.breedId && !next.ownedPets[next.pet.breedId]) {
    const { type, breedId, breedName } = next.pet
    next.ownedPets[breedId] = { type, breedId, breedName, acquiredAt: 0 }
  }
  const currentBreed = breedById[next.pet.breedId]
  if (currentBreed) next.pet.breedName = currentBreed.name
  for (const id of Object.keys(next.ownedPets)) {
    const breed = breedById[id]
    if (breed && next.ownedPets[id].breedName !== breed.name) {
      next.ownedPets[id] = { ...next.ownedPets[id], breedName: breed.name }
    }
  }

  const lastDecayAt = Number(state.lastDecayAt || now)
  const elapsed = now - lastDecayAt
  const passedSteps = Math.max(0, Math.floor(elapsed / DECAY_INTERVAL_MS))

  if (passedSteps > 0) {
    const decay = passedSteps * DECAY_AMOUNT
    next.pet.mood = Math.max(0, Number(next.pet.mood || 0) - decay)
    next.pet.hunger = Math.max(0, Number(next.pet.hunger || 0) - decay)
    next.lastDecayAt = lastDecayAt + passedSteps * DECAY_INTERVAL_MS
  } else {
    next.lastDecayAt = lastDecayAt
  }

  ensurePetAlerts(next)
  return next
}

function ensurePetAlerts(state) {
  const mood = Number(state.pet?.mood || 0)
  const hunger = Number(state.pet?.hunger || 0)

  if (mood <= ALERT_THRESHOLD) {
    if (!state.alertFlags.moodLowNotified) {
      pushSystemMessage(
        state,
        "宠物心情偏低",
        "你的宠物现在心情不太好，记得用玩具陪它玩一会儿。"
      )
      state.alertFlags.moodLowNotified = true
    }
  } else {
    state.alertFlags.moodLowNotified = false
  }

  if (hunger <= ALERT_THRESHOLD) {
    if (!state.alertFlags.hungerLowNotified) {
      pushSystemMessage(
        state,
        "宠物有点饿了",
        "你的宠物饥饿度已经偏低，记得去商店买点食物并及时喂它。"
      )
      state.alertFlags.hungerLowNotified = true
    }
  } else {
    state.alertFlags.hungerLowNotified = false
  }
}

function pushSystemMessage(state, title, content) {
  if (!state.messages) {
    state.messages = { unread: 0, list: [] }
  }

  state.messages.list.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title,
    content,
    time: new Date().toLocaleString(),
    read: false
  })
  state.messages.unread = (state.messages.unread || 0) + 1
}

module.exports = { getState, setState, update }

},"pages/login/login":function(require,module,exports,Page,wx){
const { update } = require("utils/store")

Page({
  start() {
    wx.showModal({
      title: "\u5fae\u4fe1\u6388\u6743",
      content: "\u6388\u6743\u540e\u5373\u53ef\u8fdb\u5165\u840c\u5ba0 play\u3002\u5f53\u524d\u4e3a\u6f14\u793a\u7248\uff0c\u70b9\u51fb\u201c\u53bb\u6388\u6743\u201d\u4f1a\u76f4\u63a5\u8fdb\u5165\u9996\u9875\u3002",
      cancelText: "\u4e0d\u4e86",
      confirmText: "\u53bb\u6388\u6743",
      success: ({ confirm }) => {
        if (!confirm) return
        this.finishFakeAuth()
      }
    })
  },

  finishFakeAuth() {
    update((s) => {
      s.user.loggedIn = true

      if (!s.user.userInfo) {
        s.user.userInfo = {
          nickName: "\u5ba0\u7269\u73a9\u5bb6",
          avatarUrl: "./assets/icon_message.png"
        }
      }

      const first = !s._firstLoginDone
      if (first) {
        s._firstLoginDone = true
        if (!s.messages) s.messages = { unread: 0, list: [] }
        s.messages.list.unshift({
          id: String(Date.now()),
          title: "\u6b22\u8fce\u65b0\u4e3b\u4eba",
          content: "\u9996\u6b21\u767b\u5f55\uff0c\u606d\u559c\u83b7\u5f97\u4e00\u53ea\u4e2d\u534e\u7530\u56ed\u72ac\u3002",
          time: new Date().toLocaleString(),
          read: false
        })
        s.messages.unread = (s.messages.unread || 0) + 1
      }

      return s
    })

    wx.switchTab({ url: "/pages/index/index" })
  }
})

},"data/goods":function(require,module,exports,Page,wx){
const categories = [
  { id: 'food', name: '食物与零食', icon: '🥣' },
  { id: 'toy', name: '玩具类', icon: '🎾' },
  { id: 'care', name: '护理与健康', icon: '🫧' },
  { id: 'travel', name: '训练与出行', icon: '🐾' },
  { id: 'home', name: '生活与装饰', icon: '🏡' },
  { id: 'special', name: '特殊/运营商品', icon: '🎁' }
]

const rows = {
  food: [
    ['food_dog', '基础狗粮', 50, { hunger: 20 }],
    ['food_jerky', '肉干零食', 40, { hunger: 12 }, true],
    ['food_chew', '磨牙棒', 65, { hunger: 15 }],
    ['food_paste', '营养膏', 95, { hunger: 28 }],
    ['food_festive', '节日罐头', 130, { hunger: 40 }, true]
  ],
  toy: [
    ['toy_rubber', '橡胶磨牙棒', 65, { mood: 12 }],
    ['toy_feeder_ball', '漏食球', 110, { mood: 20 }],
    ['toy_rope', '拔河绳', 75, { mood: 14 }],
    ['toy_plush', '毛绒安抚玩偶', 125, { mood: 24 }],
    ['toy_disc', '飞盘', 90, { mood: 18 }],
    ['toy_roller', '自动滚球', 240, { mood: 36 }],
    ['toy_ball', '小号发声球', 80, { mood: 15 }]
  ],
  care: [
    ['care_shampoo', '宠物香波', 85],
    ['care_brush', '梳毛刷', 70],
    ['care_clipper', '指甲剪', 80],
    ['care_bags', '拾便袋', 25],
    ['care_dewormer', '驱虫药', 150],
    ['care_cleaner', '玩具清洁剂', 55],
    ['care_checkup', '疫苗券/体检券', 280]
  ],
  travel: [
    ['travel_clicker', '训练响片', 55],
    ['travel_leash', '牵引绳', 95],
    ['travel_harness', '项圈/胸背带', 130],
    ['travel_scoop', '拾便夹', 60],
    ['travel_treats', '训练零食包', 85, { hunger: 24 }, true]
  ],
  home: [
    ['home_bed', '狗窝', 230],
    ['home_bowls', '食盆/水盆', 75],
    ['home_pads', '尿垫', 35],
    ['home_raincoat', '雨衣', 145],
    ['home_clothes', '小衣服/配饰', 155],
    ['home_storage', '玩具收纳箱', 120]
  ],
  special: [
    ['special_blanket', '安抚巾', 140],
    ['special_feeder', '自动喂食器', 380],
    ['special_grooming', '美容券', 260],
    ['special_skin', '限定皮肤/项圈', 480]
  ]
}

const goods = categories.flatMap(({ id: type }) => rows[type].map(
  ([id, name, price, effect = null, forCats = false]) => ({
    id, name, type, price, effect, forCats, image: './assets/items/' + id + '.png'
  })
))

module.exports = { categories, goods }

},"utils/home-capture":function(require,module,exports,Page,wx){
function getScene(page) {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery().in(page)
    query.select('.home-frame').boundingClientRect()
    query.selectAll('.shot-layer').fields({
      rect: true, size: true, dataset: true,
      computedStyle: ['backgroundColor', 'borderRadius', 'color', 'fontSize', 'fontWeight', 'opacity', 'textShadow']
    })
    query.select('#homeCapture').fields({ node: true })
    query.exec(results => {
      const [frame, layers, result] = results || []
      if (frame?.width && layers?.length && result?.node) resolve({ frame, layers, canvas: result.node })
      else reject(new Error('首页还未完成加载'))
    })
  })
}

function loadImage(canvas, src) {
  return new Promise((resolve, reject) => {
    const image = canvas.createImage()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function roundBox(ctx, x, y, w, h, radius) {
  const r = Math.max(0, Math.min(radius, w / 2, h / 2))
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawArtwork(ctx, image, data, x, y, w, h, radius) {
  if (data.kind === 'portrait') {
    const sw = image.width / 5, sh = image.height / 4
    roundBox(ctx, x, y, w, h, radius)
    ctx.clip()
    ctx.drawImage(image, data.slot % 5 * sw, Math.floor(data.slot / 5) * sh, sw, sh, x, y, w, h)
    return
  }
  const fit = data.kind === 'cover' ? Math.max : Math.min
  const factor = fit(w / image.width, h / image.height)
  const dw = image.width * factor, dh = image.height * factor
  ctx.drawImage(image, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh)
}

function drawLayer(ctx, frame, layer, images) {
  const { dataset: data, width: w, height: h } = layer
  if (!data || w <= 0 || h <= 0) return
  const x = layer.left - frame.left, y = layer.top - frame.top
  const radius = layer.borderRadius?.includes('%') ? Math.min(w, h) / 2 : parseFloat(layer.borderRadius) || 0
  ctx.save()
  ctx.globalAlpha = Number(layer.opacity || 1)
  if (data.src) {
    drawArtwork(ctx, images.get(data.src), data, x, y, w, h, radius)
  } else {
    if (data.kind === 'box' || data.kind === 'button') {
      roundBox(ctx, x, y, w, h, radius)
      ctx.fillStyle = layer.backgroundColor || 'transparent'
      ctx.fill()
    }
    if (data.kind === 'text' || data.kind === 'button') {
      const centered = data.kind === 'button'
      ctx.font = (layer.fontWeight || 400) + ' ' + (layer.fontSize || '14px') + ' sans-serif'
      ctx.fillStyle = layer.color || '#543820'
      ctx.textAlign = centered ? 'center' : 'left'
      ctx.textBaseline = 'middle'
      if (layer.textShadow && layer.textShadow !== 'none') {
        ctx.shadowColor = '#4b2919'
        ctx.shadowBlur = 3
      }
      let label = String(data.text ?? '')
      if (ctx.measureText(label).width > w) {
        const chars = Array.from(label)
        while (chars.length && ctx.measureText(chars.join('') + '…').width > w) chars.pop()
        label = chars.join('') + '…'
      }
      ctx.fillText(label, centered ? x + w / 2 : x, y + h / 2)
    }
  }
  ctx.restore()
}

function exportCanvas(canvas, fileType, quality) {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      canvas, destWidth: canvas.width, destHeight: canvas.height, fileType, quality,
      success: ({ tempFilePath }) => resolve(tempFilePath),
      fail: reject
    })
  })
}

async function captureHome(page) {
  const { frame, layers, canvas } = await getScene(page)
  const dogLayer = layers.find(layer => layer.dataset?.dogModel)
  if (dogLayer && page.dogRenderer) {
    try {
      const { width, height, pixels } = page.dogRenderer.snapshot()
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      const image = ctx.createImageData(width, height)
      const stride = width * 4
      // WebGL returns rows from the bottom up.
      for (let row = 0; row < height; row++) {
        const from = (height - row - 1) * stride
        image.data.set(pixels.subarray(from, from + stride), row * stride)
      }
      ctx.putImageData(image, 0, 0)
      const src = await exportCanvas(canvas, 'png')
      dogLayer.dataset = { kind: 'image', src }
    } catch (error) {
      console.warn('Using the dog portrait in the home capture', error)
    }
  }
  const scale = Math.min(2, 960 / frame.width)
  canvas.width = Math.round(frame.width * scale)
  canvas.height = Math.round(frame.height * scale)
  const ctx = canvas.getContext('2d')
  ctx.scale(canvas.width / frame.width, canvas.height / frame.height)
  const sources = [...new Set(layers.map(layer => layer.dataset?.src).filter(Boolean))]
  const images = new Map(await Promise.all(sources.map(async src => [src, await loadImage(canvas, src)])))
  ctx.fillStyle = '#2c2319'
  ctx.fillRect(0, 0, frame.width, frame.height)
  for (const layer of layers) drawLayer(ctx, frame, layer, images)
  return exportCanvas(canvas, 'jpg', 0.88)
}

module.exports = { captureHome }

},"utils/home-album":function(require,module,exports,Page,wx){
const KEY = 'home_album_v1'

function listPhotos() {
  return wx.getStorageSync(KEY) || []
}

function savePhoto(tempFilePath, identity) {
  const fs = wx.getFileSystemManager()
  return new Promise((resolve, reject) => {
    fs.saveFile({
      tempFilePath,
      success: ({ savedFilePath }) => {
        const now = Date.now()
        const photo = { ...identity, id: now + '_' + Math.random().toString(36).slice(2, 8), path: savedFilePath, at: now }
        try {
          wx.setStorageSync(KEY, [photo, ...listPhotos()])
          resolve(photo)
        } catch (error) {
          fs.unlink({ filePath: savedFilePath })
          reject(error)
        }
      },
      fail: reject
    })
  })
}

function groupPhotos(photos) {
  const groups = new Map()
  for (const photo of photos) {
    const key = JSON.stringify([photo.breedId, photo.nickname])
    if (!groups.has(key)) {
      groups.set(key, {
        id: key,
        name: photo.nickname + ' · ' + photo.breedName,
        photos: []
      })
    }
    groups.get(key).photos.push(photo)
  }
  return Array.from(groups.values())
}

module.exports = { listPhotos, savePhoto, groupPhotos }

},"utils/yard-items":function(require,module,exports,Page,wx){
const { goods } = require("data/goods")
const { update } = require("utils/store")

const goodsById = Object.fromEntries(goods.map(item => [item.id, item]))
const wearableSlots = {
  home_clothes: 'body',
  home_raincoat: 'body',
  travel_harness: 'neck',
  special_skin: 'neck'
}
// Keep the whole icon inside the yard, including when the user drags to an edge.
const limits = { left: 0.08, right: 0.92, top: 0.135, bottom: 0.865 }

function boundedPosition(x, y) {
  return {
    x: Math.max(limits.left, Math.min(limits.right, x)),
    y: Math.max(limits.top, Math.min(limits.bottom, y))
  }
}

function nextPosition(placements) {
  let best, bestDistance = -1
  for (const y of [0.5, 0.79, 0.21]) {
    for (const x of [0.5, 0.32, 0.68, 0.14, 0.86]) {
      const distance = Math.min(...placements.map(item => Math.hypot(item.x - x, (item.y - y) * 0.6)))
      if (distance > bestDistance) {
        best = { x, y }
        bestDistance = distance
      }
    }
  }
  return best
}

function placeItem(itemId) {
  let placed = false
  const state = update(s => {
    if (!Object.prototype.hasOwnProperty.call(goodsById, itemId) || !(s.inventory[itemId] > 0)) return s
    const id = Date.now() + '_' + Math.random().toString(36).slice(2, 10)
    s.inventory[itemId] -= 1
    s.yardItems = [...s.yardItems, { id, itemId, ...nextPosition(s.yardItems) }]
    placed = true
    return s
  })
  return { state, placed }
}

function collectItem(itemId) {
  let collected = false
  const state = update(s => {
    const placement = s.yardItems.slice().reverse().find(item => item.itemId === itemId)
    if (!placement) return s
    s.yardItems = s.yardItems.filter(item => item.id !== placement.id)
    s.inventory[itemId] = (s.inventory[itemId] || 0) + 1
    collected = true
    return s
  })
  return { state, collected }
}

function moveItem(id, x, y) {
  return update(s => {
    const item = s.yardItems.find(item => item.id === id)
    if (!item || !Number.isFinite(x) || !Number.isFinite(y)) return s
    s.yardItems = [...s.yardItems.filter(item => item.id !== id), { ...item, ...boundedPosition(x, y) }]
    return s
  })
}

function dressDog(id, breedId) {
  let equipped = false
  const state = update(s => {
    const placement = s.yardItems.find(item => item.id === id)
    const slot = placement && wearableSlots[placement.itemId]
    if (!slot || s.pet.type !== 'dog' || s.pet.breedId !== breedId) return s
    const previous = s.pet.outfit?.[slot]
    if (previous) s.inventory[previous] = (s.inventory[previous] || 0) + 1
    s.pet.outfit = { ...s.pet.outfit, [slot]: placement.itemId }
    s.yardItems = s.yardItems.filter(item => item.id !== id)
    equipped = true
    return s
  })
  return { state, equipped }
}

function undressDog(itemId) {
  let removed = false
  const state = update(s => {
    const slot = wearableSlots[itemId]
    if (!slot || s.pet.outfit?.[slot] !== itemId) return s
    const outfit = { ...s.pet.outfit }
    delete outfit[slot]
    s.pet.outfit = outfit
    s.inventory[itemId] = (s.inventory[itemId] || 0) + 1
    removed = true
    return s
  })
  return { state, removed }
}

function yardItemsForDisplay(state) {
  return state.yardItems.filter(item => goodsById[item.itemId]?.image).map(item => ({
    ...item,
    name: goodsById[item.itemId].name,
    image: goodsById[item.itemId].image,
    wearable: !!wearableSlots[item.itemId],
    left: item.x * 100,
    top: item.y * 100
  }))
}

module.exports = { placeItem, collectItem, moveItem, boundedPosition, yardItemsForDisplay, dressDog, undressDog, wearableSlots }

},"data/dog-models":function(require,module,exports,Page,wx){
// Coat colors and silhouette presets for the rounded, toy-like 3D models.
const presets = {
  tianyuan: ['c78c4d','f1cd94','674731','point','plain',1,1,'curve'],
  poodle: ['b77748','e4ae76','8f573a','drop','curl',0.85,1.05,'short'],
  bichon: ['eee8db','fff8e9','d1c4b4','drop','curl',0.88,0.9,'curve'],
  pomeranian: ['cf793c','f3c184','96502d','point','fluff',0.83,0.86,'curl'],
  corgi: ['c98647','fff0d6','9d6137','big','blaze',1.13,0.58,'short'],
  shiba: ['bd753d','f9e4bc','9c5632','point','mask',0.95,0.91,'curl'],
  schnauzer: ['79746e','d3cbc0','49453f','fold','beard',0.93,0.91,'short'],
  french_bulldog: ['d0a675','f3d8b5','56413b','big','flat',0.88,0.72,'short'],
  westie: ['e8e2d1','fff6e4','c5b9a1','point','beard',0.95,0.75,'curve'],
  husky: ['65616e','f7eadb','47404d','point','mask',1.08,1.04,'fluff'],
  samoyed: ['e9e0d1','fff8ea','cdc1af','point','fluff',1.1,1,'curl'],
  golden: ['c78b4d','f1c78b','a5703d','drop','fluff',1.13,1.03,'fluff'],
  labrador: ['45404a','6d626a','302a32','drop','plain',1.14,1.04,'long'],
  border_collie: ['45404a','fff0dc','342d38','fold','blaze',1.06,0.99,'fluff'],
  german_shepherd: ['b67b4c','dfaa72','4d3833','point','saddle',1.13,1.1,'long'],
  doberman: ['403840','b87749','302830','drop','points',1.07,1.24,'short'],
  akita: ['aa673b','f4d7ae','754534','point','mask',1.19,1.07,'curl'],
  rottweiler: ['43383e','b6794e','352a30','fold','points',1.19,0.98,'short'],
  maltese: ['efe6d9','fff9eb','d2c4b0','drop','silky',0.84,0.73,'fluff']
}

const colors = new Map()
function rgb(hex) {
  if (!colors.has(hex)) {
    colors.set(hex, [0, 2, 4].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255))
  }
  return colors.get(hex)
}

function dogParts(breedId, outfit, seconds) {
  const key = breedId?.replace(/^dog_/, '')
  const [coat, cream, dark, ears, style, length, legs, tail] = presets[key] || presets.tianyuan
  const parts = []
  const add = (color, x, y, z, sx, sy, sz, angle = 0, taper = 0) =>
    parts.push({ color: rgb(color), x, y, z, sx, sy, sz, angle, taper })
  const breathe = Math.sin(seconds * 3) * 0.017
  const bob = Math.sin(seconds * 2.2) * 0.035
  const headY = 0.37 + (legs - 1) * 0.28 + bob
  const bodyY = -0.27 + (legs - 1) * 0.28 + breathe
  const bodyW = key === 'doberman' ? 0.43 : 0.53
  const faceW = key === 'french_bulldog' ? 0.62 : 0.55
  const pawY = -0.84
  const groundY = -1.05
  const bodyZ = 0.73 * length
  const wag = Math.sin(seconds * 6)
  const longTail = tail !== 'short'
  const segments = tail === 'curl' ? 5 : longTail ? 4 : 2
  for (let i = 0; i < segments; i++) {
    const t = i / segments
    const thick = (tail === 'fluff' || tail === 'curl' ? 0.18 : 0.13) * (1 - t * 0.52)
    add(i > 2 && (style === 'mask' || tail === 'fluff') ? cream : coat,
      wag * (0.09 + t * 0.42), bodyY + (tail === 'curl' ? 0.08 + 0.48 * Math.sin(t * 2.4) : 0.05 + (longTail ? 0.34 : 0.13) * t),
      -bodyZ - 0.03 - (longTail ? 0.48 : 0.18) * t, thick, thick * 1.14, thick * 1.42)
  }
  add(coat, 0, bodyY, -0.08, bodyW, 0.46, bodyZ)
  if (style === 'saddle') add(dark, 0, bodyY + 0.19, -0.25, bodyW * 0.98, 0.32, bodyZ * 0.80)
  add(coat, 0, bodyY + 0.12, 0.33, bodyW * 0.87, 0.46, 0.43)
  const whiteFeet = ['blaze','mask','fluff','curl','silky','beard','points'].includes(style)
  for (const side of [-1, 1]) {
    for (const front of [-1, 1]) {
      const z = front === 1 ? 0.36 : -0.51 * length
      const upperY = (bodyY + pawY) / 2
      add(coat, side * bodyW * 0.67, upperY, z, 0.165, (bodyY - pawY) / 2 + 0.11, 0.18)
      add(whiteFeet ? cream : coat, side * bodyW * 0.67, groundY + 0.11, z + 0.075, 0.177, 0.126, 0.235)
    }
  }
  if (style !== 'plain') add(cream, 0, bodyY - 0.04, 0.54, bodyW * 0.66, 0.33, 0.23)
  if (style === 'fluff') {
    for (const side of [-1, 1]) {
      add(coat, side * 0.37, bodyY + 0.12, 0.27, 0.24, 0.39, 0.33, -side * 0.2)
      add(cream, side * 0.23, headY - 0.35, 0.45, 0.31, 0.38, 0.31, -side * 0.25)
    }
  }
  if (outfit?.body) {
    const raincoat = outfit.body === 'home_raincoat'
    const fabric = raincoat ? 'e5a645' : '88a2a7'
    add(fabric, 0, bodyY + 0.10, -0.12, bodyW * 1.08, 0.43, bodyZ * 0.92)
    for (const side of [-1, 1]) {
      add(fabric, side * bodyW * 0.66, bodyY - 0.14, 0.29, 0.205, 0.25, 0.24)
      add(raincoat ? 'f4cf78' : 'e9d5b2', side * bodyW * 0.67, bodyY - 0.30, 0.30, 0.187, 0.064, 0.21)
    }
    add(raincoat ? 'f4cf78' : 'e9d5b2', 0, bodyY + 0.14, 0.39, 0.37, 0.34, 0.215)
    add(raincoat ? 'af7131' : 'b76649', 0, bodyY + 0.12, 0.598, 0.07, 0.07, 0.036)
  }
  if (outfit?.neck) {
    const limited = outfit.neck === 'special_skin'
    add(limited ? 'a75648' : '718764', 0, headY - 0.4, 0.39, 0.40, 0.09, 0.38)
    if (!limited) {
      for (const side of [-1, 1]) {
        add('718764', side * 0.16, headY - 0.60, 0.67, 0.067, 0.23, 0.10, -side * 0.52)
      }
    }
    add('e8b75f', 0, headY - 0.46, 0.758, 0.084, 0.092, 0.048)
  }
  // The ears sit behind the head. A tapered ellipsoid makes an upright ear.
  for (const side of [-1, 1]) {
    const pointed = ears === 'point' || ears === 'big'
    const big = ears === 'big'
    const x = side * (pointed ? 0.37 : 0.52)
    const y = headY + (pointed ? (big ? 0.46 : 0.39) : 0.05)
    const tilt = -side * (pointed ? 0.21 : 0.32) + wag * 0.037
    const earColor = style === 'curl' || style === 'silky' ? coat : dark
    add(pointed ? coat : earColor, x, y, 0.38, big ? 0.245 : 0.205,
      pointed ? (big ? 0.43 : 0.35) : ears === 'fold' ? 0.28 : 0.385, 0.177, tilt, pointed ? (big ? 0.31 : 0.68) : 0)
    if (pointed) add('c78d79', x, y + 0.045, 0.523, big ? 0.14 : 0.118, big ? 0.29 : 0.23, 0.047, tilt, 0.60)
  }
  add(coat, 0, headY, 0.52, faceW, 0.485, 0.46)
  if (style === 'curl' || style === 'fluff' || style === 'silky') {
    for (let i = -2; i <= 2; i++) {
      add(style === 'curl' ? cream : coat, i * 0.18, headY + 0.34 - Math.abs(i) * 0.035, 0.62, 0.195, 0.20, 0.22)
    }
  }
  if (style === 'mask' || style === 'blaze') {
    add(cream, 0, headY + 0.07, 0.91, style === 'mask' ? 0.105 : 0.14, 0.36, 0.10)
  }
  const snout = style === 'flat' ? 0.22 : 0.32
  const muzzle = style === 'flat' || style === 'saddle' ? dark : cream
  const blinkCycle = (seconds + 1.3) % 4.5
  const eyeOpen = blinkCycle < 0.18 ? Math.max(0.09, Math.abs(blinkCycle - 0.09) / 0.09) : 1
  for (const side of [-1, 1]) {
    if (style === 'mask' || style === 'points') {
      add(cream, side * 0.28, headY + 0.12, 0.886, 0.142, style === 'mask' ? 0.16 : 0.075, 0.063, side * 0.17)
    }
    add(muzzle, side * 0.137, headY - 0.175, 0.89, 0.22, 0.163, snout)
    if (style === 'beard' || style === 'silky') {
      add(cream, side * 0.17, headY - 0.27, 0.97, 0.159, 0.21, 0.20, -side * 0.22)
    }
    if (key === 'husky' && eyeOpen > 0.25) add('88bac5', side * 0.253, headY + 0.055, 0.925, 0.095, 0.104 * eyeOpen, 0.051)
    add('302527', side * 0.252, headY + 0.055, 0.959, 0.068, 0.088 * eyeOpen, 0.047)
    if (eyeOpen > 0.46) add('fff3d7', side * 0.252 - 0.015, headY + 0.084, 0.997, 0.020, 0.024, 0.014)
  }
  add('503032', 0, headY - 0.255, 0.91 + snout * 0.73, 0.133, 0.086, 0.065)
  add('d98181', 0.015, headY - 0.286 + Math.sin(seconds * 4) * 0.012, 0.96 + snout * 0.77, 0.062, 0.066, 0.044)
  add('382829', 0, headY - 0.107, 0.91 + snout * 0.91, 0.143, 0.093, 0.095)
  add('9b7671', -0.026, headY - 0.073, 0.99 + snout * 0.91, 0.048, 0.024, 0.018)
  return parts
}

module.exports = { presets, dogParts }

},"utils/dog-renderer":function(require,module,exports,Page,wx){
const { dogParts } = require("data/dog-models")

const vertexSource = `
attribute vec3 vertex;
uniform vec3 offset, size;
uniform vec2 partTurn, dogTurn, viewScale;
uniform float taper;
varying vec3 normal;
void main() {
  float taperScale = max(0.23, 1.0 - vertex.y * taper);
  vec3 p = vertex * size;
  p.xz *= taperScale;
  vec3 n = normalize(vertex / size);
  p.xy = mat2(partTurn.x, partTurn.y, -partTurn.y, partTurn.x) * p.xy;
  n.xy = mat2(partTurn.x, partTurn.y, -partTurn.y, partTurn.x) * n.xy;
  p += offset;
  p.xz = mat2(dogTurn.x, -dogTurn.y, dogTurn.y, dogTurn.x) * p.xz;
  n.xz = mat2(dogTurn.x, -dogTurn.y, dogTurn.y, dogTurn.x) * n.xz;
  normal = vec3(n.x, 0.984 * n.y - 0.178 * n.z, 0.178 * n.y + 0.984 * n.z);
  float y = 0.984 * p.y - 0.178 * p.z;
  float z = 0.178 * p.y + 0.984 * p.z;
  gl_Position = vec4(p.x * viewScale.x, (y + 0.045) * viewScale.y, -z * 0.21, 1.0);
}`

const fragmentSource = `
precision mediump float;
uniform vec3 color;
varying vec3 normal;
void main() {
  vec3 n = normalize(normal);
  vec3 sun = normalize(vec3(-0.46, 0.72, 0.57));
  float diffuse = max(0.0, dot(n, sun));
  float bounce = max(0.0, dot(n, vec3(0.87, -0.36, 0.33)));
  float softSpecular = pow(max(0.0, dot(n, normalize(sun + vec3(0.0, 0.0, 1.0)))), 21.0);
  vec3 shaded = color * (0.59 + diffuse * 0.44 + bounce * 0.12);
  gl_FragColor = vec4(shaded + vec3(1.0, 0.84, 0.66) * softSpecular * 0.11, 1.0);
}`

function sphereMesh() {
  const vertices = [], triangles = []
  const bands = 12, slices = 18
  for (let row = 0; row <= bands; row++) {
    const latitude = row * Math.PI / bands
    for (let col = 0; col <= slices; col++) {
      const longitude = col * Math.PI * 2 / slices
      vertices.push(Math.sin(latitude) * Math.cos(longitude), Math.cos(latitude), Math.sin(latitude) * Math.sin(longitude))
    }
  }
  for (let row = 0; row < bands; row++) {
    for (let col = 0; col < slices; col++) {
      const i = row * (slices + 1) + col
      const next = i + slices + 1
      triangles.push(i, next, i + 1, i + 1, next, next + 1)
    }
  }
  return { vertices: new Float32Array(vertices), triangles: new Uint16Array(triangles) }
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(error || 'Unable to compile dog shader')
  }
  return shader
}

function createDogRenderer(canvas) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, preserveDrawingBuffer: true })
  if (!gl) throw new Error('WebGL is unavailable')
  const program = gl.createProgram()
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(error || 'Unable to link dog shaders')
  }
  gl.useProgram(program)

  const mesh = sphereMesh()
  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW)
  const attribute = gl.getAttribLocation(program, 'vertex')
  gl.enableVertexAttribArray(attribute)
  gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 0, 0)
  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.triangles, gl.STATIC_DRAW)
  gl.clearColor(0, 0, 0, 0)
  gl.enable(gl.DEPTH_TEST)

  const uniforms = Object.fromEntries(['offset','size','partTurn','dogTurn','viewScale','taper','color']
    .map(name => [name, gl.getUniformLocation(program, name)]))
  let active = false, scheduled, breedId, outfit
  let lastDraw = 0
  const startedAt = Date.now()
  const nativeFrames = typeof canvas.requestAnimationFrame === 'function' && typeof canvas.cancelAnimationFrame === 'function'

  function draw(seconds) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    const yaw = 0.54 + Math.sin(seconds * 0.92) * 0.28
    gl.uniform2f(uniforms.dogTurn, Math.cos(yaw), Math.sin(yaw))
    for (const part of dogParts(breedId, outfit, seconds)) {
      gl.uniform3f(uniforms.offset, part.x, part.y, part.z)
      gl.uniform3f(uniforms.size, part.sx, part.sy, part.sz)
      gl.uniform3f(uniforms.color, ...part.color)
      gl.uniform2f(uniforms.partTurn, Math.cos(part.angle), Math.sin(part.angle))
      gl.uniform1f(uniforms.taper, part.taper)
      gl.drawElements(gl.TRIANGLES, mesh.triangles.length, gl.UNSIGNED_SHORT, 0)
    }
  }

  function tick() {
    if (!active) return
    const now = Date.now()
    if (now - lastDraw >= 30) {
      draw((now - startedAt) / 1000)
      lastDraw = now
    }
    scheduled = nativeFrames ? canvas.requestAnimationFrame(tick) : setTimeout(tick, 33)
  }

  function pause() {
    active = false
    if (scheduled == null) return
    if (nativeFrames) canvas.cancelAnimationFrame(scheduled)
    else clearTimeout(scheduled)
    scheduled = null
  }

  return {
    resize(width, height, ratio) {
      canvas.width = Math.max(1, Math.round(width * ratio))
      canvas.height = Math.max(1, Math.round(height * ratio))
      gl.viewport(0, 0, canvas.width, canvas.height)
      const pixelsPerUnit = Math.min(canvas.width / 2.48, canvas.height / 2.42)
      gl.uniform2f(uniforms.viewScale, 2 * pixelsPerUnit / canvas.width, 2 * pixelsPerUnit / canvas.height)
    },
    setDog(id, clothes) {
      breedId = id
      outfit = clothes
    },
    start() {
      if (active) return
      active = true
      tick()
    },
    pause,
    snapshot() {
      draw((Date.now() - startedAt) / 1000)
      const { width, height } = canvas
      const pixels = new Uint8Array(width * height * 4)
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
      return { width, height, pixels }
    },
    dispose() {
      pause()
      gl.deleteBuffer(vertexBuffer)
      gl.deleteBuffer(indexBuffer)
      gl.deleteProgram(program)
    }
  }
}

module.exports = { createDogRenderer }

},"pages/index/index":function(require,module,exports,Page,wx){
const { getState, update } = require("utils/store")
const { goods } = require("data/goods")
const { breedById, dogPortraitAtlas } = require("data/pets")
const { captureHome } = require("utils/home-capture")
const { savePhoto } = require("utils/home-album")
const { boundedPosition, moveItem, yardItemsForDisplay, dressDog } = require("utils/yard-items")
const { createDogRenderer } = require("utils/dog-renderer")

const toolGroups = [
  { side: "left", tools: [
    { id: "bag", label: "背包", handler: "goBag" },
    { id: "diary", label: "日记", handler: "goDiary" },
    { id: "album", label: "相册", handler: "goAlbum" },
    { id: "partner", label: "伙伴", handler: "goPartner" }
  ] },
  { side: "right", tools: [
    { id: "music", label: "音乐", handler: "toggleMusic" },
    { id: "messages", label: "消息", handler: "goMessages" },
    { id: "camera", label: "截图", handler: "takePhoto" }
  ] }
].map(group => ({
  ...group,
  tools: group.tools.map(tool => ({ ...tool, src: "./assets/home/tool-" + tool.id + ".png" }))
}))
const legacyItems = [
  { id: "food_cat", name: "猫粮", effect: { hunger: 20 }, forCats: true, catOnly: true },
  { id: "toy_teaser", name: "逗猫棒", effect: { mood: 20 } }
]
const supplies = [...legacyItems, ...goods]

function availableSupplies(state, stat) {
  return supplies.filter(item => {
    if (!(state.inventory[item.id] > 0) || !item.effect?.[stat]) return false
    if (stat !== "hunger") return true
    return state.pet.type === "cat" ? item.forCats : !item.catOnly
  })
}

Page({
  data: {
    state: null,
    yard: "./assets/home/yard-cropped.jpg",
    starterArt: "./assets/home/dog_tianyuan.png",
    atlas: dogPortraitAtlas,
    portrait: null,
    petName: "",
    unread: "",
    statusRows: [],
    yardItems: [],
    draggingId: "",
    dressingTarget: false,
    dog3D: false,
    toolGroups,
    musicOn: true,
    petAlerts: {
      moodLow: false,
      hungerLow: false,
      message: ""
    }
  },

  onShow() {
    this.visible = true
    const s = getState()

    if (!s?.user?.loggedIn) {
      wx.reLaunch({ url: "/pages/login/login" })
      return
    }

    if (!s.user.userInfo) {
      const next = update((st) => {
        st.user.userInfo = {
          nickName: "\u5ba0\u7269\u73a9\u5bb6",
          avatarUrl: "./assets/icon_message.png"
        }
        return st
      })
      this.renderState(next)
      return
    }

    this.renderState(s)
  },

  renderState(state) {
    const stock = stat => availableSupplies(state, stat).reduce((n, item) => n + state.inventory[item.id], 0)
    const petAlerts = this.getPetAlerts(state)
    const unread = state.messages.unread
    this.setData({
      state,
      petAlerts,
      yardItems: yardItemsForDisplay(state),
      petName: state.pet.nickname || state.pet.breedName,
      portrait: state.pet.breedId === "dog_tianyuan" ? null : breedById[state.pet.breedId] || null,
      unread: unread > 99 ? "99+" : unread || "",
      statusRows: [
        { id: "mood", label: "心情", value: state.pet.mood, low: petAlerts.moodLow, summary: state.pet.mood + "/100 · 玩具 " + stock("mood") },
        { id: "hunger", label: "饱食度", value: state.pet.hunger, low: petAlerts.hungerLow, summary: state.pet.hunger + "/100 · 食物 " + stock("hunger") }
      ]
    }, () => this.measureYard())
  },

  onHide() {
    this.visible = false
    this.dogRenderer?.pause()
    this.drag = null
    this.yardBounds = null
    this.setData({ draggingId: "", dressingTarget: false })
  },

  onUnload() { this.dogRenderer?.dispose() },

  onResize() {
    this.cancelItemDrag()
    this.measureYard()
  },

  measureYard() {
    const query = wx.createSelectorQuery().in(this)
    query.select(".yardDropZone").boundingClientRect()
    query.select(".dogTarget").boundingClientRect()
    query.select("#dogCanvas").fields({ node: true, size: true })
    query.exec(results => {
      if (!this.visible) return
      const [yard, target, canvas] = results || []
      if (yard?.width && yard?.height) this.yardBounds = yard
      this.dogBounds = target
      this.renderDog(canvas)
    })
  },

  renderDog(canvas) {
    const pet = this.data.state?.pet
    if (!canvas?.node || !canvas.width || !canvas.height || pet?.type !== "dog") {
      this.dogRenderer?.pause()
      if (this.data.dog3D) this.setData({ dog3D: false })
      return
    }
    try {
      if (!this.dogRenderer) this.dogRenderer = createDogRenderer(canvas.node)
      const size = canvas.width + "x" + canvas.height
      if (this.modelSize !== size) {
        this.dogRenderer.resize(canvas.width, canvas.height, Math.min(wx.getSystemInfoSync().pixelRatio || 1, 2))
        this.modelSize = size
      }
      this.dogRenderer.setDog(pet.breedId, pet.outfit)
      this.dogRenderer.start()
      if (!this.data.dog3D) this.setData({ dog3D: true })
    } catch (error) {
      this.dogRenderer?.dispose()
      this.dogRenderer = null
      this.modelSize = null
      this.setData({ dog3D: false })
      console.warn("Dog 3D unavailable", error)
    }
  },

  goBag() { wx.navigateTo({ url: "/pages/bag/bag" }) },

  startItemDrag(e) {
    if (this.drag || !this.yardBounds) return
    const index = this.data.yardItems.findIndex(item => item.id === e.currentTarget.dataset.id)
    const touch = e.changedTouches[0]
    if (index < 0 || !touch) return
    const { id, x, y, wearable } = this.data.yardItems[index]
    this.drag = {
      id, index, wearable, breedId: this.data.state.pet.breedId,
      finger: touch.identifier, startX: touch.clientX, startY: touch.clientY, x, y, position: null
    }
    this.setData({ draggingId: id })
  },

  dragItem(e) {
    const drag = this.drag
    const touch = drag && e.changedTouches.find(touch => touch.identifier === drag.finger)
    if (!touch || !this.yardBounds) return
    const { width, height } = this.yardBounds
    const dx = touch.clientX - drag.startX
    const dy = touch.clientY - drag.startY
    if (!drag.position && Math.abs(dx) + Math.abs(dy) < 3) return
    const x = drag.x + dx / width, y = drag.y + dy / height
    const canDress = drag.wearable && this.data.state.pet.type === "dog"
    const position = canDress ? { x, y } : boundedPosition(x, y)
    const centerX = this.yardBounds.left + position.x * width
    const centerY = this.yardBounds.top + position.y * height
    const target = this.dogBounds
    drag.onDog = !!(canDress && target &&
      centerX >= target.left && centerX <= target.right &&
      centerY >= target.top && centerY <= target.bottom)
    drag.position = position
    this.setData({
      ["yardItems[" + drag.index + "].left"]: position.x * 100,
      ["yardItems[" + drag.index + "].top"]: position.y * 100,
      dressingTarget: drag.onDog
    })
  },

  finishItemDrag(e) {
    const drag = this.drag
    if (!drag || !e.changedTouches.some(touch => touch.identifier === drag.finger)) return
    this.dragItem(e)
    this.drag = null
    this.setData({ draggingId: "", dressingTarget: false })
    if (drag.position) {
      if (drag.onDog) {
        const { state, equipped } = dressDog(drag.id, drag.breedId)
        if (equipped) {
          this.renderState(state)
          wx.showToast({ title: "穿戴成功" })
          return
        }
      }
      const { x, y } = drag.position
      const state = moveItem(drag.id, x, y)
      this.setData({ yardItems: yardItemsForDisplay(state) })
    }
  },

  cancelItemDrag() {
    if (!this.drag) return
    this.drag = null
    this.setData({ draggingId: "", dressingTarget: false, yardItems: yardItemsForDisplay(getState()) })
  },

  renamePet() {
    const { breedId, breedName, nickname } = getState().pet
    wx.showModal({
      title: "给狗狗起个名字",
      editable: true,
      content: nickname || breedName,
      placeholderText: "输入昵称，留空恢复品种名",
      confirmText: "保存",
      success: ({ confirm, content }) => {
        if (!confirm || typeof content !== "string") return
        const name = Array.from(content.trim()).slice(0, 16).join("")
        const next = update(state => {
          if (state.pet.breedId === breedId) state.pet.nickname = name === breedName ? "" : name
          return state
        })
        this.renderState(next)
      }
    })
  },

  getPetAlerts(state) {
    const mood = Number(state?.pet?.mood || 0)
    const hunger = Number(state?.pet?.hunger || 0)
    const moodLow = mood <= 30
    const hungerLow = hunger <= 30

    let message = ""
    if (moodLow && hungerLow) message = "\u5BA0\u7269\u5FC3\u60C5\u548C\u9965\u997F\u5EA6\u90FD\u504F\u4F4E\uff0c\u9700\u8981\u5FEB\u70B9\u7167\u987E"
    else if (moodLow) message = "\u5BA0\u7269\u5FC3\u60C5\u504F\u4F4E\uff0c\u53EF\u4EE5\u7528\u73A9\u5177\u54C4\u54C4\u5B83"
    else if (hungerLow) message = "\u5BA0\u7269\u6709\u70B9\u997F\u4E86\uff0C\u8BB0\u5F97\u5582\u5B83\u5403\u4E1C\u897F"

    return { moodLow, hungerLow, message }
  },

  useStatusSupply(e) {
    const { stat } = e.currentTarget.dataset
    if (stat === "mood" || stat === "hunger") this.useSupply(stat)
  },

  useSupply(stat) {
    const label = stat === "mood" ? "心情" : "饱食度"
    let message = ""
    let used = false
    const next = update(state => {
      if (state.pet[stat] >= 100) {
        message = label + "已满"
        return state
      }
      const [item] = availableSupplies(state, stat)
      if (!item) {
        message = stat === "mood" ? "没有玩具了，去商店兑换" : "没有可用食物，去商店兑换"
        return state
      }
      const delta = Math.min(100 - state.pet[stat], item.effect[stat])
      state.inventory[item.id] -= 1
      state.pet[stat] += delta
      message = item.name + " · " + label + " +" + delta
      used = true
      return state
    })
    this.renderState(next)
    wx.showToast({ title: message, icon: used ? "success" : "none" })
  },

  goDiary() {
    wx.showToast({ title: "\u6210\u957F\u65E5\u8BB0\u5F00\u53D1\u4E2D", icon: "none" })
  },

  goAlbum() {
    wx.navigateTo({ url: "/pages/album/album" })
  },

  async takePhoto() {
    if (this.capturing || !this.data.state) return
    this.capturing = true
    const { breedId, breedName } = this.data.state.pet
    const nickname = this.data.petName
    try {
      const path = await captureHome(this)
      await savePhoto(path, { breedId, breedName, nickname })
      wx.showToast({ title: "已存入萌宠相册" })
    } catch (error) {
      console.warn("Home capture failed", error)
      wx.showToast({ title: "截图保存失败，请重试", icon: "none" })
    } finally {
      this.capturing = false
    }
  },

  goPartner() {
    wx.showToast({ title: "\u4F19\u4F34\u7CFB\u7EDF\u5F00\u53D1\u4E2D", icon: "none" })
  },

  toggleMusic() {
    const next = !this.data.musicOn
    this.setData({ musicOn: next })
    wx.showToast({
      title: next ? "\u97F3\u4E50\u5DF2\u5F00\u542F" : "\u97F3\u4E50\u5DF2\u5173\u95ED",
      icon: "none"
    })
  },

  goMessages() {
    wx.navigateTo({ url: "/pages/messages/messages" })
  }
})

},"utils/pet-management":function(require,module,exports,Page,wx){
const { breedById } = require("data/pets")
const { getState, update } = require("utils/store")

function manageBreed(id, { switchTo = false, ownedOnly = false, acquisition = '领养' } = {}) {
  const breed = Object.prototype.hasOwnProperty.call(breedById, id) ? breedById[id] : null
  if (!breed) return { code: 'missing', state: getState() }

  let code
  const state = update(s => {
    const owned = s.ownedPets[id]
    if (!owned && ownedOnly) { code = 'locked'; return s }
    if (switchTo && s.pet.breedId === id) { code = 'current'; return s }
    if (owned && !switchTo) { code = 'owned'; return s }
    if (!owned && s.user.score < breed.price) { code = 'insufficient'; return s }

    const now = Date.now()
    const record = { type: breed.type, breedId: id, breedName: breed.name }
    if (!owned) {
      s.user.score -= breed.price
      s.ownedPets[id] = { ...record, acquiredAt: now }
    }
    if (switchTo) {
      const { breedId, ...stats } = s.pet
      s.ownedPets[breedId] = { ...s.ownedPets[breedId], stats }
      s.lastDecayAt = now
      s.pet = { level: 1, exp: 0, mood: 100, hunger: 80, health: 100, ...owned?.stats, ...record }
    }

    const action = owned ? '切换' : acquisition
    s.petHistory.unshift({
      id: now + '_' + action + '_' + id,
      at: now, breedName: breed.name, action
    })
    s.petHistory = s.petHistory.slice(0, 50)
    code = owned ? 'switched' : 'unlocked'
    return s
  })
  return { code, state }
}

module.exports = { manageBreed }

},"utils/pk-client":function(require,module,exports,Page,wx){
const { getState } = require("utils/store")
// Leave empty to use the default environment configured for this mini program.
const ENV_ID = ''
let initialized = false
let heartbeat = null
let presenceQueue = Promise.resolve()
async function call(action, fields = {}) {
  if (!wx.cloud) throw new Error('此网页地址未连接在线 PK 服务')
  if (!initialized) {
    wx.cloud.init(ENV_ID ? { env: ENV_ID } : {})
    initialized = true
  }
  let response
  try { response = await wx.cloud.callFunction({ name: 'petPk', data: { ...fields, action } }) }
  catch (_) { throw new Error('暂时连不上 PK 大厅，请稍后再试') }
  const result = response.result
  if (!result || !result.ok) throw new Error(result?.message || '暂时无法完成操作')
  return result.data
}
function syncNest(offline = false) {
  const s = getState()
  if (!s.user.loggedIn) return Promise.resolve()
  const data = { open: !!s.user.nestOpen, offline, name: s.user.userInfo?.nickName, region: s.user.region, pet: s.pet.breedName }
  const request = presenceQueue.then(async () => {
    const count = await call('presence', data)
    if (count) wx.setTabBarBadge({index:3, text:String(count)})
    else wx.removeTabBarBadge({index:3})
  })
  presenceQueue = request.catch(() => {})
  return request
}
function startPresence() {
  if (heartbeat) return
  if (getState().user.nestOpen) syncNest().catch(() => {})
  heartbeat = setInterval(() => {
    if (getState().user.nestOpen) syncNest().catch(() => {})
  }, 15000)
}
function stopPresence() {
  if (heartbeat) clearInterval(heartbeat)
  heartbeat = null
  if (getState().user.nestOpen) syncNest(true).catch(() => {})
}
module.exports = { call, syncNest, startPresence, stopPresence }

},"utils/navigation":function(require,module,exports,Page,wx){
let profileEntryFromRegion = false

function backToTab(fallback) {
  wx.navigateBack({
    delta: 1,
    fail: () => wx.switchTab({ url: fallback })
  })
}

function openProfileFromRegion() {
  profileEntryFromRegion = true
  wx.switchTab({
    url: '/pages/profile/profile',
    fail: () => { profileEntryFromRegion = false }
  })
}

function takeProfileEntryFromRegion() {
  const fromRegion = profileEntryFromRegion
  profileEntryFromRegion = false
  return fromRegion
}

module.exports = { backToTab, openProfileFromRegion, takeProfileEntryFromRegion }

},"pages/pet/pet":function(require,module,exports,Page,wx){
const { dogs, dogPortraitAtlas } = require("data/pets")
const { getState } = require("utils/store")
const { manageBreed } = require("utils/pet-management")
const { syncNest } = require("utils/pk-client")
const { backToTab } = require("utils/navigation")

Page({
  data: {
    breeds: [],
    atlas: dogPortraitAtlas,
    breedChoices: ["请选择狗狗", ...dogs.map(dog => dog.name)],
    state: null
  },

  onLoad() {
    this.setData({ breeds: dogs })
  },

  onShow() {
    this.setData({ state: getState() })
  },

  selectBreed(e) {
    const { breedid } = e.currentTarget.dataset
    this.confirmBreed(dogs.find(dog => dog.id === breedid))
  },

  pickBreed(e) {
    this.confirmBreed(dogs[Number(e.detail.value) - 1])
  },

  confirmBreed(breed) {
    if (!breed || this.confirming) return
    const state = getState()
    if (state.pet.breedId === breed.id) {
      return wx.showToast({ title: "已经是这只啦", icon: "none" })
    }
    const owned = !!state.ownedPets[breed.id]
    this.confirming = true
    wx.showModal({
      title: owned ? "切换陪伴萌宠" : "领养并更换",
      content: owned ? "免费切换为" + breed.name + "？" : "花费 " + breed.price + " 积分领养" + breed.name + "并设为陪伴？",
      confirmText: owned ? "确认切换" : "确认领养",
      success: ({ confirm }) => {
        if (confirm) this.buyAndSwitch(breed.id)
      },
      complete: () => { this.confirming = false }
    })
  },

  buyAndSwitch(breedId) {
    const { code, state } = manageBreed(breedId, { switchTo: true })
    this.setData({ state })
    if (code === "insufficient") return wx.showToast({ title: "积分不足", icon: "none" })
    if (code === "current") return wx.showToast({ title: "已经是这只啦", icon: "none" })
    if (code !== "switched" && code !== "unlocked") return
    wx.showToast({ title: "更换成功", icon: "success" })
    if (state.user.nestOpen) syncNest().catch(() => {})
  },

  goBack() {
    backToTab("/pages/profile/profile")
  }
})


},"utils/link":function(require,module,exports,Page,wx){
const icons = ['🦴','🥣','🍗','🥩','🧀','🥕','🍪','🍠']
const width = 6, height = 6
// The outside border is open, so connections can run around the board.
function connects(board, a, b) {
  if (a === b || !board[a] || board[a] !== board[b]) return false
  const targetX = b % width + 1, targetY = Math.floor(b / width) + 1
  const queue = [[a % width + 1, Math.floor(a / width) + 1, -1, 0]]
  const seen = new Set()
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]]
  for (let i = 0; i < queue.length; i++) {
    const [x,y,dir,turns] = queue[i]
    for (let d = 0; d < 4; d++) {
      const nx = x + dirs[d][0], ny = y + dirs[d][1]
      const t = turns + Number(dir !== -1 && dir !== d)
      if (t > 2 || nx < 0 || ny < 0 || nx > width + 1 || ny > height + 1) continue
      if (nx === targetX && ny === targetY) return true
      if (nx > 0 && nx <= width && ny > 0 && ny <= height && board[(ny - 1) * width + nx - 1]) continue
      const key = [nx,ny,d,t].join(',')
      if (!seen.has(key)) { seen.add(key); queue.push([nx,ny,d,t]) }
    }
  }
  return false
}
function hint(board) {
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) continue
    for (let j = i + 1; j < board.length; j++) if (connects(board, i, j)) return [i,j]
  }
  return []
}
// Assign pairs in an order that is itself a valid complete solution.
function shuffle(board) {
  const left = board.map((v,i) => v ? i : -1).filter(i => i >= 0)
  const pairs = board.filter(Boolean).sort().filter((_,i) => i % 2 === 0)
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pairs[i], pairs[j]] = [pairs[j], pairs[i]]
  }
  return board.map((v,i) => v ? pairs[Math.floor(left.indexOf(i) / 2)] : '')
}
function create() {
  return shuffle(Array.from({length: 36}, (_,i) => icons[Math.floor(i / 2) % icons.length]))
}
module.exports = { connects, create, shuffle, hint }

},"data/quiz":function(require,module,exports,Page,wx){
// Each entry contains the prompt, choices, and the index of the correct answer.
module.exports = [
  ['想和陌生狗狗打招呼，应该先做什么？',['先征得主人同意','直接摸头','从背后抱住它'],0],
  ['发现狗狗没水了，最合适的做法是？',['给它汽水','换上干净的饮用水','等到晚上再加水'],1],
  ['带狗狗出门前，最好先准备什么？',['牵引绳和拾便袋','一盒彩笔','一条围巾就够了'],0],
  ['狗狗在休息时，小朋友最好怎么做？',['突然拍醒它','把它抱起来','让它安静休息'],2],
  ['狗狗完成练习后，可以怎么鼓励它？',['立刻温和表扬','大声吓它','抢走它的玩具'],0],
  ['狗狗闻来闻去，主要是在做什么？',['用气味探索环境','在数路砖','在模仿鸟叫'],0],
  ['哪件东西适合当狗狗的玩具？',['易碎玻璃球','大小合适的宠物玩具','散落的电池'],1],
  ['遛狗时狗狗拉了便便，主人应该？',['留给别人处理','用落叶盖住','及时捡起并妥善丢弃'],2],
  ['狗狗退缩躲开时，最友好的做法是？',['追过去继续摸','给它留出空间','把它逼到角落'],1],
  ['下面哪项是每天照顾狗狗的一部分？',['检查饮水和食盆','给它喷香水','让它整天独处'],0]
]

},"pages/game/game":function(require,module,exports,Page,wx){
const link = require("utils/link")
const quiz = require("data/quiz")
const { getState, update } = require("utils/store")
Page({
  data: { mode: '', total: 0, board: [], selected: -1, hints: [], pairs: 0, result: '', correct: 0, index: 0, question: null, feedback: '', notice: '' },
  onShow() { this.setData({ total: getState().user.score }) },
  choose(e) {
    const mode = e.currentTarget.dataset.mode
    if (mode === 'catch') return wx.navigateTo({ url: '/pages/catch/catch' })
    this.setData({ mode, result: '', notice: '' })
    this.restart()
  },
  menu() { this.setData({ mode: '', result: '' }) },
  restart() {
    if (this.data.mode === 'link') this.setData({ board: link.create(), selected: -1, hints: [], pairs: 18, result: '', notice: '' })
    if (this.data.mode === 'quiz') {
      this.questions = quiz.map((_,i) => i)
      for (let i = this.questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]]
      }
      this.setData({ index: 0, correct: 0, result: '', question: quiz[this.questions[0]], feedback: '' })
    }
  },
  pick(e) {
    const i = Number(e.currentTarget.dataset.i)
    const { board, selected, result } = this.data
    if (result || !board[i]) return
    if (selected < 0 || selected === i) return this.setData({ selected: selected === i ? -1 : i, hints: [], notice: '' })
    if (!link.connects(board, selected, i)) return this.setData({ selected: i, hints: [], notice: '这两块暂时连不上，再试试。' })
    let next = board.slice()
    next[selected] = next[i] = ''
    const pairs = this.data.pairs - 1
    let notice = ''
    if (pairs && !link.hint(next).length) {
      next = link.shuffle(next)
      notice = '没有可连接的配对，已重新排列。'
    }
    this.setData({ board: next, pairs, selected: -1, hints: [], notice })
    if (!pairs) this.finish('全部配对成功', 30)
  },
  showHint() { this.setData({ hints: link.hint(this.data.board), selected: -1, notice: '试试高亮的两块。' }) },
  reshuffle() { this.setData({ board: link.shuffle(this.data.board), selected: -1, hints: [], notice: '已重新排列。' }) },
  answer(e) {
    if (this.data.feedback || this.data.result) return
    const answer = this.data.question[2]
    const right = Number(e.currentTarget.dataset.i) === answer
    this.setData({ correct: this.data.correct + Number(right), feedback: right ? '答对啦！' : '正确答案：' + this.data.question[1][answer] })
  },
  advance() {
    if (!this.data.feedback || this.data.result) return
    const index = this.data.index + 1
    if (index === 5) return this.finish('答对 ' + this.data.correct + ' / 5 题', this.data.correct * 5)
    this.setData({ index, question: quiz[this.questions[index]], feedback: '' })
  },
  finish(label, reward) {
    if (this.data.result) return
    const s = update(s => { s.user.score += reward; return s })
    this.setData({ result: label + ' · +' + reward + ' 积分', total: s.user.score })
  }
})

},"pages/mall/mall":function(require,module,exports,Page,wx){
const { categories, goods } = require("data/goods")
const { getState, update } = require("utils/store")
const { dogs, dogPortraitAtlas } = require("data/pets")

function effectText(item) {
  if (item.effect?.hunger) return '饱食度 +' + item.effect.hunger + (item.forCats ? ' · 狗狗和猫猫可用' : ' · 狗狗可用')
  if (item.effect?.mood) return '心情 +' + item.effect.mood + ' · 可在首页使用'
  return '兑换后存入背包'
}

Page({
  data: {
    categories,
    active: categories[0],
    items: [],
    score: 0,
    total: goods.length,
    dogCount: 0,
    dogTotal: dogs.length,
    atlas: dogPortraitAtlas
  },

  onShow() {
    this.refresh(getState())
  },

  selectCategory(e) {
    const active = categories.find(category => category.id === e.currentTarget.dataset.id)
    if (active) this.refresh(getState(), active)
  },

  openDogDex() {
    wx.navigateTo({ url: '/pages/dogdex/dogdex' })
  },

  refresh(state, active = this.data.active) {
    const outfits = [
      state.pet.outfit,
      ...Object.values(state.ownedPets).filter(pet => pet.breedId !== state.pet.breedId).map(pet => pet.stats?.outfit)
    ]
    const worn = outfits.flatMap(outfit => Object.values(outfit || {}))
    const items = goods.filter(item => item.type === active.id).map(item => ({
      ...item,
      owned: (state.inventory[item.id] || 0) +
        state.yardItems.filter(placement => placement.itemId === item.id).length +
        worn.filter(id => id === item.id).length,
      effectText: effectText(item)
    }))
    this.setData({ active, items, score: state.user.score, dogCount: dogs.filter(dog => state.ownedPets[dog.id]).length })
  },

  buy(e) {
    const item = goods.find(good => good.id === e.currentTarget.dataset.id)
    if (!item) return
    let bought = false
    const next = update(state => {
      if (state.user.score < item.price) return state
      state.user.score -= item.price
      state.inventory[item.id] = (state.inventory[item.id] || 0) + 1
      bought = true
      return state
    })
    this.refresh(next)
    wx.showToast({ title: bought ? '已兑换' : '积分不足', icon: bought ? 'success' : 'none' })
  }
})

},"pages/region/region":function(require,module,exports,Page,wx){
const { call, syncNest } = require("utils/pk-client")
const { getState } = require("utils/store")
const { openProfileFromRegion } = require("utils/navigation")
Page({
  data: { nests: [], visible: [], rooms: [], modes: [], visit: null, mode: null, selected: [], need: 1, local: false, city: '', error: '', busy: false, loaded: false },
  onShow() {
    this.active = true
    const region = getState().user.region
    const city = region?.city === '未选择' ? '' : (region?.city || '')
    this.setData({city, province:region?.province || '', local:!!city && this.data.local})
    this.refresh(true)
    this.timer = setInterval(() => this.refresh(), 5000)
  },
  onHide() { this.active = false; clearInterval(this.timer) },
  onUnload() { this.onHide() },
  async refresh(force = false) {
    if (this.loading) return
    this.loading = true
    try {
      if (force === true) await syncNest()
      const { nests, rooms, modes } = await call('lobby')
      if (!this.active) return
      const count = rooms.filter(r => r.status === 'waiting' && !r.players[r.seat].accepted).length
      if (count) wx.setTabBarBadge({index:3, text:String(count)})
      else wx.removeTabBarBadge({index:3})
      const visit = nests.find(n => n.key === this.data.visit?.key) || null
      const selected = visit ? this.data.selected.filter(key => nests.some(n => n.key === key)) : []
      this.setData({ nests, rooms, modes, visit, selected, loaded: true, error: '' })
      this.filter()
    } catch(e) { if (this.active) this.setData({ error: e.message }) }
    finally { this.loading = false }
  },
  retry() { this.refresh(true) },
  toggleLocal() {
    if (!this.data.city) return wx.showToast({title:'先在「我的」设置地区', icon:'none'})
    this.setData({local: !this.data.local}); this.filter()
  },
  filter() {
    const { nests, local, city, province } = this.data
    this.setData({visible:nests.filter(n => !local || (n.city === city && n.province === province))})
  },
  async visitNest(e) {
    try {
      const visit = await call('visit', {target:e.currentTarget.dataset.key})
      this.setData({visit, selected:[visit.key], mode:this.data.modes[0], need:1})
      this.filter()
    } catch(e) { wx.showToast({title:e.message,icon:'none'}) }
  },
  back() { this.setData({visit:null, selected:[]}); this.filter() },
  choose(e) {
    const mode = this.data.modes[Number(e.currentTarget.dataset.i)]
    this.setData({mode, need:mode.size-1, selected:[this.data.visit.key]})
    this.filter()
  },
  toggleGuest(e) {
    const key = e.currentTarget.dataset.key, selected = this.data.selected
    if (selected.includes(key)) this.setData({selected:selected.filter(k=>k!==key)})
    else if (selected.length < this.data.need) this.setData({selected:[...selected,key]})
    this.filter()
  },
  async invite() {
    if (this.data.busy || this.data.selected.length !== this.data.need) return
    this.setData({busy:true})
    try {
      await syncNest()
      const room = await call('invite',{mode:this.data.mode.key,targets:this.data.selected})
      this.back()
      this.open(room.id)
    } catch(e) { wx.showToast({title:e.message,icon:'none'}) }
    finally { this.setData({busy:false}) }
  },
  openRoom(e) { this.open(e.currentTarget.dataset.id) },
  open(id) { wx.navigateTo({url:'/pages/pk/pk?id=' + encodeURIComponent(id)}) },
  profile() { openProfileFromRegion() }
})

},"pages/profile/profile":function(require,module,exports,Page,wx){
const { getState, update } = require("utils/store")
const { syncNest } = require("utils/pk-client")
const { takeProfileEntryFromRegion } = require("utils/navigation")
Page({
  data: { score: 0, current: '', dogs: [], dogCount: 0, others: [], history: [], region: '未设置', open: false, nickname: '', returnToRegion: false },
  onShow() {
    if (takeProfileEntryFromRegion()) this.setData({ returnToRegion: true })
    const s = getState()
    const pets = Object.values(s.ownedPets).map(p => ({
      ...p, date: p.acquiredAt ? new Date(p.acquiredAt).toLocaleDateString() : '早期记录',
      current: s.pet.breedId === p.breedId
    }))
    const dogs = pets.filter(p => p.type === 'dog')
    const history = s.petHistory.map(p => ({ ...p, date: new Date(p.at).toLocaleString() }))
    const r = s.user.region
    this.setData({
      score: s.user.score, current: s.pet.breedName, dogs, dogCount: dogs.length,
      others: pets.filter(p => p.type !== 'dog'), history, region: r.city === '未选择' ? '未设置' : [r.province, r.city, r.district].filter(Boolean).join(' · '),
      open: !!s.user.nestOpen, nickname: s.user.userInfo?.nickName || '宠物玩家'
    })
  },
  onTabItemTap() {
    this.setData({ returnToRegion: false })
  },
  backToRegion() {
    wx.switchTab({
      url: '/pages/region/region',
      success: () => this.setData({ returnToRegion: false })
    })
  },
  nicknameInput(e) { this.pendingNickname = e.detail.value },
  saveName() {
    const name = (this.pendingNickname || '').trim()
    if (!name) return wx.showToast({ title: '请输入昵称', icon: 'none' })
    update(s => { s.user.userInfo = { ...s.user.userInfo, nickName: name.slice(0, 16) }; return s })
    this.onShow()
    syncNest().catch(() => {})
    wx.showToast({ title: '昵称已保存' })
  },
  setRegion(e) {
    const [province, city, district] = e.detail.value
    update(s => { s.user.region = { province, city, district }; return s })
    this.onShow()
    syncNest().catch(() => {})
  },
  setOpen(e) {
    const value = e.detail.value
    update(s => { s.user.nestOpen = value; return s })
    this.onShow()
    syncNest().catch(() => wx.showToast({ title: '设置已保存，暂未同步', icon: 'none' }))
  },
  manage() { wx.navigateTo({ url: '/pages/pet/pet' }) }
})

},"pages/messages/messages":function(require,module,exports,Page,wx){
const { getState, update } = require("utils/store")
const { backToTab } = require("utils/navigation")

Page({
  data: { state: null },

  onShow() {
    const next = update((s) => {
      if (!s.messages) s.messages = { unread: 0, list: [] }
      s.messages.list = s.messages.list.map((m) => ({ ...m, read: true }))
      s.messages.unread = 0
      return s
    })
    this.setData({ state: next || getState() })
  },

  goBack() {
    backToTab("/pages/index/index")
  }
})

},"pages/catch/catch":function(require,module,exports,Page,wx){
const { getState, update } = require("utils/store")
const { backToTab } = require("utils/navigation")

Page({
  data: {
    ready: false,
    running: false,
    timeLeft: 10,
    score: 0,
    totalScore: 0,
    labels: {
      title: "\u63a5\u72d7\u7cae",
      time: "\u5269\u4f59\u65f6\u95f4",
      score: "\u672c\u5c40\u79ef\u5206",
      totalScore: "\u603b\u79ef\u5206",
      tips: "\u73a9\u6cd5\uff1a\u62d6\u52a8\u5e95\u90e8\u7bee\u5b50\u53bb\u63a5\u843d\u4e0b\u7684\u72d7\u7cae\u300210s \u5185\u6bcf\u63a5\u4f4f\u4e00\u4e2a\u72d7\u7cae\uff0c+5 \u79ef\u5206\u3002"
    },
    buttonLabels: {
      start: "\u5f00\u59cb\u6e38\u620f",
      loading: "Canvas Loading...",
      stop: "\u63d0\u524d\u7ed3\u675f"
    }
  },

  canvas: null       ,
  ctx: null       ,
  rafId: null       ,
  timerId: null       ,

  W: 0,
  H: 0,

  basket: null       ,
  foods: []         ,

  onShow() {
    const s = getState()
    this.setData({ totalScore: s.user.score })
  },

  onReady() {
    const q = wx.createSelectorQuery().in(this)
    q.select("#gameCanvas")
      .fields({ node: true, size: true })
      .exec((res     ) => {
        const info = res && res[0]
        if (!info || !info.node) {
          wx.showToast({ title: "\u521d\u59cb\u5316\u753B\u5E03\u5931\u8D25", icon: "none" })
          return
        }

        const canvas = info.node
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          wx.showToast({ title: "\u521D\u59CB\u5316 ctx \u5931\u8D25", icon: "none" })
          return
        }

        const dpr = wx.getSystemInfoSync().pixelRatio
        this.W = info.width
        this.H = info.height

        canvas.width = this.W * dpr
        canvas.height = this.H * dpr
        ctx.scale(dpr, dpr)

        this.canvas = canvas
        this.ctx = ctx
        this.resetBasket()
        this.setData({ ready: true })
        this.drawSplash()
      })
  },

  resetBasket() {
    this.basket = {
      x: (this.W - 112) / 2,
      y: this.H - 46,
      w: 112,
      h: 18
    }
  },

  drawSplash() {
    if (!this.ctx) return
    this.drawFrame()
    const ctx = this.ctx
    ctx.fillStyle = "rgba(61, 45, 27, 0.85)"
    ctx.font = "bold 18px sans-serif"
    ctx.fillText("\u70B9\u51FB\u300C\u5F00\u59CB\u6E38\u620F\u300D", 20, 36)
    ctx.font = "14px sans-serif"
    ctx.fillText("10s \u5185\u6BCF\u63A5\u4F4F\u4E00\u4E2A\u72D7\u7CAE +5 \u79EF\u5206", 20, 60)
  },

  startGame() {
    if (!this.data.ready) {
      wx.showToast({ title: "\u753B\u5E03\u8FD8\u6CA1\u51C6\u5907\u597D", icon: "none" })
      return
    }
    if (this.data.running) return

    this.foods = []
    this.resetBasket()
    this.setData({ running: true, timeLeft: 10, score: 0 })

    this.timerId = setInterval(() => {
      const nextTime = this.data.timeLeft - 1
      this.setData({ timeLeft: nextTime })
      if (nextTime <= 0) this.stopGame()
    }, 1000)

    const loop = () => {
      if (!this.data.running) return
      this.updateFrame()
      this.drawFrame()
      this.rafId = this.canvas.requestAnimationFrame(loop)
    }

    loop()
  },

  stopGame() {
    const result = this.settleGame()
    if (!result) return
    const { gained, total } = result

    wx.showModal({
      title: "结算完成",
      content: `本局获得 ${gained} 积分\n当前总积分 ${total}`,
      showCancel: false
    })
  },

  returnToLobby() {
    this.settleGame()
    backToTab("/pages/game/game")
  },

  settleGame()                                           {
    if (!this.data.running) return null

    this.setData({ running: false })

    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }

    if (this.rafId && this.canvas) {
      this.canvas.cancelAnimationFrame(this.rafId)
      this.rafId = null
    }

    const gained = this.data.score
    const next = update((s     ) => {
      s.user.score += gained
      return s
    })

    this.setData({ totalScore: next.user.score })
    this.foods = []
    this.drawSplash()
    return { gained, total: next.user.score }
  },

  onTouch(e     ) {
    if (!this.basket || !this.data.running) return
    const x = e.touches?.[0]?.x
    if (typeof x !== "number") return
    this.basket.x = clamp(x - this.basket.w / 2, 0, this.W - this.basket.w)
  },

  updateFrame() {
    if (!this.basket) return

    if (Math.random() < 0.08) {
      this.foods.push({
        x: Math.random() * (this.W - 32) + 16,
        y: -18,
        r: 10 + Math.random() * 2,
        vy: 3 + Math.random() * 2.4
      })
    }

    const basket = this.basket
    const remain = []
    let gainedThisFrame = 0

    for (const food of this.foods) {
      food.y += food.vy

      const hit =
        food.x >= basket.x &&
        food.x <= basket.x + basket.w &&
        food.y + food.r >= basket.y &&
        food.y - food.r <= basket.y + basket.h

      if (hit) {
        gainedThisFrame += 5
        continue
      }

      if (food.y - food.r <= this.H + 20) {
        remain.push(food)
      }
    }

    this.foods = remain

    if (gainedThisFrame > 0) {
      this.setData({ score: this.data.score + gainedThisFrame })
    }
  },

  drawFrame() {
    if (!this.ctx) return
    const ctx = this.ctx

    ctx.clearRect(0, 0, this.W, this.H)

    const bg = ctx.createLinearGradient(0, 0, 0, this.H)
    bg.addColorStop(0, "#fff8ec")
    bg.addColorStop(1, "#ffe7bf")
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, this.W, this.H)

    ctx.fillStyle = "rgba(142, 96, 52, 0.18)"
    ctx.fillRect(0, this.H - 56, this.W, 56)

    for (const food of this.foods) {
      this.drawFood(food)
    }

    this.drawBasket()
  },

  drawFood(food     ) {
    if (!this.ctx) return
    const ctx = this.ctx

    ctx.fillStyle = "#8b5a2b"
    ctx.beginPath()
    ctx.ellipse(food.x, food.y, food.r, food.r * 0.72, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "rgba(255,255,255,0.25)"
    ctx.beginPath()
    ctx.arc(food.x - food.r * 0.2, food.y - food.r * 0.2, food.r * 0.22, 0, Math.PI * 2)
    ctx.fill()
  },

  drawBasket() {
    if (!this.ctx || !this.basket) return
    const ctx = this.ctx
    const basket = this.basket

    ctx.fillStyle = "#b97a3d"
    ctx.fillRect(basket.x, basket.y, basket.w, basket.h)

    ctx.strokeStyle = "#8b5a2b"
    ctx.lineWidth = 2
    ctx.strokeRect(basket.x, basket.y, basket.w, basket.h)

    ctx.beginPath()
    ctx.arc(basket.x + basket.w / 2, basket.y, basket.w / 3.2, Math.PI, 0)
    ctx.stroke()
  },

  onHide() {
    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }

    if (this.rafId && this.canvas) {
      this.canvas.cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    if (this.data.running) {
      this.setData({ running: false, timeLeft: 10, score: 0 })
      this.foods = []
      this.drawSplash()
    }
  },

  onUnload() {
    this.onHide()
  }
})

function clamp(v        , min        , max        ) {
  return Math.max(min, Math.min(max, v))
}

},"pages/pk/pk":function(require,module,exports,Page,wx){
const { call } = require("utils/pk-client")
const { getState } = require("utils/store")
const { backToTab } = require("utils/navigation")
const ranks = ['3','4','5','6','7','8','9','10','J','Q','K','A','2']
const suits = ['♠','♥','♣','♦']
const honors = ['东','南','西','北','中','发','白']
function face(id, mode) {
  if (mode === 'cards') return id === 52 ? '小王' : id === 53 ? '大王' : ranks[Math.floor(id/4)] + suits[id%4]
  const k = Math.floor(id/4)
  return k < 27 ? (k%9+1) + ['万','筒','条'][Math.floor(k/9)] : honors[k-27]
}
const modeRules = {
  gomoku:'黑棋先手，横、竖或斜向连成五子即获胜。',
  quiz:'90 秒内完成同一组题。先比答对数，答对数相同则比完成时间。',
  race:'拖动方向盘，绕开深色障碍。先到旗帜处获胜。',
  cards:'三人叫分定地主，地主单独对抗两位农民。一方先出完牌即获胜。',
  mahjong:'四人自摸场：轮流摸打，凑齐四组顺子或刻子加一对即可自摸。此场无吃、碰、杠或点炮。'
}
Page({
  data:{room:null, pending:false, error:'', picked:[], hand:[], last:'', bottom:'', discards:[], grid:[], bids:[], seconds:0, ready:false, myTurn:false, pets:[], racePet:'', mapIndex:0, rule:'', joyX:0, joyY:0},
  onLoad(query) {
    this.id = query.id
    this.setData({pets:Object.values(getState().ownedPets).map(p => p.breedName)})
  },
  onShow() {
    this.active = true
    this.refresh()
    this.poll = setInterval(() => this.refresh(), 1400)
    this.clock = setInterval(() => this.tick(), 250)
  },
  onHide() { this.active = false; clearInterval(this.poll); clearInterval(this.clock); this.stopJoystick() },
  onUnload() { this.onHide() },
  tick() {
    const r = this.data.room
    if (!r?.game || r.status !== 'playing') return
    const now = Date.now() + this.clockDelta
    if (r.mode === 'race') {
      const seconds = Math.max(0, Math.ceil((r.game.started-now)/1000))
      if (seconds !== this.data.seconds) this.setData({seconds})
    }
    if (r.mode === 'quiz') {
      const seconds = Math.max(0,Math.ceil((r.game.deadline-now)/1000))
      if (seconds !== this.data.seconds) this.setData({seconds})
    }
  },
  async refresh() {
    if (this.refreshing || this.data.pending || !this.id) return
    this.refreshing = true
    try {
      const room = await call('room',{id:this.id})
      this.renderRoom(room)
    } catch(e) { if (this.active) this.setData({error:e.message}) }
    finally { this.refreshing = false }
  },
  renderRoom(room) {
    if (!this.active || (this.data.room && room.version < this.data.room.version)) return
    this.clockDelta = room.now - Date.now()
    const { game:g, mode, seat, players } = room
    const picked = this.data.picked.filter(id => g?.hand?.includes(id))
    const hand = (g?.hand || []).map(id => ({id, label:face(id,mode), selected:picked.includes(id)}))
    const last = g?.last ? players[g.last.seat].name + '：' + g.last.cards.map(id=>face(id,mode)).join(' ') : ''
    const bottom = (g?.bottom || []).map(id=>face(id,mode)).join(' ')
    const discards = (g?.discards || []).map((row,i)=>({i,name:players[i].name,tiles:row.map(id=>face(id,mode)).join(' ')}))
    const grid = (g?.grid || []).flatMap((row,y)=>row.map((cell,x)=>{
      const seats = g.positions.map((p,i)=>p.x===x && p.y===y ? i : -1).filter(i=>i>=0)
      return { id:y*8+x, wall:cell==='#', label:seats.length > 1 ? '🐾' : seats.length ? (seats[0]===seat ? '🐶' : '🐕') : cell==='F' ? '🏁' : cell==='S' ? '起' : '' }
    }))
    const bids = [0,1,2,3].filter(v => !v || v > (g?.bid || 0))
    this.setData({
      room, picked, hand, last, bottom, discards, grid, bids, error:'',
      rule:modeRules[mode], myTurn:room.status === 'playing' && g?.turn === seat,
      ready:players.every(p=>p.accepted && p.pet),
      mapIndex:Math.max(0,room.maps.indexOf(room.mapName)),
      racePet:players[seat].pet
    })
    if (room.status !== 'playing' && this.joyTimer) this.stopJoystick()
    this.tick()
  },
  async send(action, params, silent = false) {
    if (this.data.pending) return
    this.setData({pending:true})
    try {
      const room = await call(action,{...params,id:this.id,version:this.data.room?.version})
      this.renderRoom(room)
    } catch(e) { if (!silent && this.active) wx.showToast({title:e.message,icon:'none'}) }
    finally { if (this.active) this.setData({pending:false}); else this.data.pending = false }
  },
  accept() { this.send('respond',{accept:true}) },
  decline() { this.send('respond',{accept:false}) },
  cancel() { this.send('cancel',{}) },
  setMap(e) { this.send('setup',{map:Number(e.detail.value)}) },
  setPet(e) { this.send('setup',{pet:this.data.pets[Number(e.detail.value)]}) },
  start() { this.send('setup',{start:true}) },
  answer(e) { this.send('move',{kind:'answer',value:Number(e.currentTarget.dataset.i),question:this.data.room.game.index}) },
  place(e) { if (this.data.myTurn) this.send('move',{kind:'place',value:Number(e.currentTarget.dataset.i)}) },
  bid(e) { this.send('move',{kind:'bid',value:Number(e.currentTarget.dataset.i)}) },
  pass() { this.send('move',{kind:'pass'}) },
  playCards() { this.send('move',{kind:'play',value:this.data.picked}) },
  discard() { this.send('move',{kind:'discard',value:this.data.picked[0]}) },
  hu() { this.send('move',{kind:'hu'}) },
  pickCard(e) {
    if (!this.data.myTurn) return
    const id = Number(e.currentTarget.dataset.i), {picked, room, hand} = this.data
    const next = picked.includes(id) ? picked.filter(v=>v!==id) : room.mode === 'mahjong' ? [id] : [...picked,id]
    this.setData({picked:next,hand:hand.map(c=>({...c,selected:next.includes(c.id)}))})
  },
  leave() {
    wx.showModal({title:'结束对局？',content:'退出会结束当前这场 PK。',success:res=>{if(res.confirm) this.send('move',{kind:'leave'})}})
  },
  lobby() { backToTab('/pages/region/region') },
  joystickStart(e) {
    if (this.data.seconds || this.data.room?.status !== 'playing') return
    const p = e.touches[0]
    const version = (this.touchVersion || 0) + 1
    this.touchVersion = version
    this.createSelectorQuery().select('#joystick').boundingClientRect(rect => {
      if (!rect || !this.active || version !== this.touchVersion) return
      this.center = { x:rect.left+rect.width/2, y:rect.top+rect.height/2, radius:rect.width*0.27 }
      this.direction(p)
      this.step()
      if (!this.joyTimer) this.joyTimer = setInterval(() => this.step(), 240)
    }).exec()
  },
  joystickMove(e) { this.direction(e.touches[0]) },
  direction(p) {
    if (!this.center || !p) return
    const dx = p.clientX-this.center.x, dy = p.clientY-this.center.y
    const length = Math.hypot(dx,dy)
    const scale = Math.min(1,this.center.radius/Math.max(length,1))
    this.dir = length < this.center.radius*0.26 ? null : Math.abs(dx)>Math.abs(dy) ? (dx>0 ? 3:1) : (dy>0 ? 2:0)
    this.setData({joyX:Math.round(dx*scale),joyY:Math.round(dy*scale)})
  },
  step() {
    if (this.dir != null && this.data.room?.status === 'playing' && !this.data.seconds) this.send('move',{kind:'run',value:this.dir},true)
  },
  stopJoystick() {
    this.touchVersion = (this.touchVersion || 0) + 1
    clearInterval(this.joyTimer)
    this.joyTimer = null; this.dir = null; this.center = null
    if (this.active) this.setData({joyX:0,joyY:0})
  }
})

},"pages/dogdex/dogdex":function(require,module,exports,Page,wx){
const { dogs, tiers, breedById, dogPortraitAtlas } = require("data/pets")
const { getState } = require("utils/store")
const { manageBreed } = require("utils/pet-management")
const { syncNest } = require("utils/pk-client")
const { backToTab } = require("utils/navigation")

Page({
  data: { score: 0, count: 0, total: dogs.length, groups: [], atlas: dogPortraitAtlas },

  onShow() { this.refresh(getState()) },

  goBack() { backToTab('/pages/mall/mall') },

  refresh(state) {
    const entries = dogs.map(dog => ({
      ...dog,
      owned: !!state.ownedPets[dog.id],
      current: state.pet.breedId === dog.id,
      affordable: state.user.score >= dog.price
    }))
    this.setData({
      score: state.user.score,
      count: entries.filter(dog => dog.owned).length,
      groups: tiers.map(tier => {
        const dogs = entries.filter(dog => dog.tier === tier.id)
        return { ...tier, dogs, count: dogs.filter(dog => dog.owned).length }
      })
    })
  },

  unlock(e) {
    const breed = breedById[e.currentTarget.dataset.id]
    if (!breed || breed.type !== 'dog' || !breed.price || this.confirming) return
    this.confirming = true
    wx.showModal({
      title: '解锁' + breed.name + '？',
      content: '花费 ' + breed.price + ' 积分，解锁后可在「我的」查看并免费切换陪伴。',
      confirmText: '确认解锁',
      success: ({ confirm }) => {
        if (!confirm) return
        const { code, state } = manageBreed(breed.id, { acquisition: '解锁' })
        this.refresh(state)
        const message = { unlocked: '图鉴已点亮', owned: '已经解锁啦', insufficient: '积分不足' }[code]
        if (message) wx.showToast({ title: message, icon: code === 'unlocked' ? 'success' : 'none' })
      },
      complete: () => { this.confirming = false }
    })
  },

  switchPet(e) {
    const { code, state } = manageBreed(e.currentTarget.dataset.id, { switchTo: true, ownedOnly: true })
    this.refresh(state)
    if (code !== 'switched') return
    wx.showToast({ title: '已设为陪伴' })
    if (state.user.nestOpen) syncNest().catch(() => {})
  }
})

},"pages/album/album":function(require,module,exports,Page,wx){
const { listPhotos, groupPhotos } = require("utils/home-album")
const { backToTab } = require("utils/navigation")

Page({
  data: { groups: [], total: 0 },

  onShow() {
    const photos = listPhotos().map(photo => ({
      ...photo, date: new Date(photo.at).toLocaleDateString()
    }))
    this.setData({ groups: groupPhotos(photos), total: photos.length })
  },

  preview(e) {
    const { group, path } = e.currentTarget.dataset
    const album = this.data.groups[group]
    if (album) wx.previewImage({ current: path, urls: album.photos.map(photo => photo.path) })
  },

  goBack() { backToTab('/pages/index/index') }
})

},"pages/bag/bag":function(require,module,exports,Page,wx){
const { categories, goods } = require("data/goods")
const { getState } = require("utils/store")
const { placeItem, collectItem, undressDog, wearableSlots } = require("utils/yard-items")
const { backToTab } = require("utils/navigation")

Page({
  data: { items: [], placedCount: 0 },

  onShow() { this.refresh(getState()) },

  refresh(state) {
    const placedCounts = {}
    for (const item of state.yardItems) {
      placedCounts[item.itemId] = (placedCounts[item.itemId] || 0) + 1
    }
    const worn = Object.values(state.pet.outfit || {})
    const items = goods.map(item => ({
      ...item,
      category: categories.find(category => category.id === item.type).name,
      count: state.inventory[item.id] || 0,
      placed: placedCounts[item.id] || 0,
      wearable: !!wearableSlots[item.id],
      wearing: worn.includes(item.id)
    })).filter(item => item.count || item.placed || item.wearing)
    this.setData({ items, placedCount: state.yardItems.length })
  },

  useItem(e) {
    const { state, placed } = placeItem(e.currentTarget.dataset.id)
    this.refresh(state)
    wx.showToast({ title: placed ? '已摆放到首页' : '背包里没有这件道具', icon: placed ? 'success' : 'none' })
  },

  collect(e) {
    const { state, collected } = collectItem(e.currentTarget.dataset.id)
    this.refresh(state)
    if (collected) wx.showToast({ title: '已收回背包' })
  },

  undress(e) {
    const { state, removed } = undressDog(e.currentTarget.dataset.id)
    this.refresh(state)
    if (removed) wx.showToast({ title: '已脱下并放回背包' })
  },

  goBack() { backToTab('/pages/index/index') },
  goShop() { wx.switchTab({ url: '/pages/mall/mall' }) }
})

}}});
