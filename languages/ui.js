const languageLabels = {
  listTitle:{
    ru:'ГАДЫ',en:'SCUM',fr:'ORDURES',ar:'الأوغاد',tr:'PİSLER',he:'חלאות',hi:'घटिया लोग',hy:'ՍՐԻԿԱՆԵՐ',tt:'КАБАХӘТЛӘР',ja:'クズ一覧',zh:'烂人',pirate:'SCALLYWAGS',stone:'BAD TRIBE',it:'FECCIA',es:'ESCORIA',pcm:'BAD BELLE',ce:'ВОНАХОЙ',az:'PİSLƏR',uk:'ПОКИДЬКИ'
  },
  topTitle:{
    ru:'ТОП',en:'TOP',fr:'TOP',ar:'الأعلى',tr:'TOP',he:'טופ',hi:'टॉप',hy:'ԹՈՓ',tt:'ТОП',ja:'トップ',zh:'榜单',pirate:'TOP O’ THE CREW',stone:'BIG BAD',it:'TOP',es:'TOP',pcm:'TOP',ce:'ТОП',az:'TOP',uk:'ТОП'
  },
  listDocumentTitle:{
    ru:'СПИСОК',en:'LIST',fr:'LISTE',ar:'القائمة',tr:'LİSTE',he:'רשימה',hi:'सूची',hy:'ՑԱՆԿ',tt:'ИСЕМЛЕК',ja:'リスト',zh:'名单',pirate:'THE LIST',stone:'MARKS ON ROCK',it:'LISTA',es:'LISTA',pcm:'LIST',ce:'МОГӀАМ',az:'SİYAHI',uk:'СПИСОК'
  },
  topDocumentTitle:{
    ru:'ТОП ГНИД',en:'SCUM TOP',fr:'TOP DES ORDURES',ar:'أعلى الأوغاد',tr:'PİSLER TOPU',he:'טופ החלאות',hi:'घटिया टॉप',hy:'ՍՐԻԿԱՆԵՐԻ ԹՈՓ',tt:'КАБАХӘТЛӘР ТОПЫ',ja:'クズトップ',zh:'烂人排行',pirate:'SCUM TOP, ARR',stone:'BIG BAD TRIBE',it:'TOP FECCIA',es:'TOP ESCORIA',pcm:'BAD BELLE TOP',ce:'ВОНАХОЙ ТОП',az:'PİSLƏR TOPU',uk:'ТОП ПОКИДЬКІВ'
  },
  topLink:{
    ru:'ТОП',en:'TOP',fr:'TOP',ar:'الأعلى',tr:'TOP',he:'טופ',hi:'टॉप',hy:'ԹՈՓ',tt:'ТОП',ja:'トップ',zh:'榜单',pirate:'TOP',stone:'BIG BAD',it:'TOP',es:'TOP',pcm:'TOP',ce:'ТОП',az:'TOP',uk:'ТОП'
  },
  backLink:{
    ru:'СПИСОК',en:'LIST',fr:'LISTE',ar:'القائمة',tr:'LİSTE',he:'רשימה',hi:'सूची',hy:'ՑԱՆԿ',tt:'ИСЕМЛЕК',ja:'リスト',zh:'名单',pirate:'LIST',stone:'ROCK LIST',it:'LISTA',es:'LISTA',pcm:'LIST',ce:'МОГӀАМ',az:'SİYAHI',uk:'СПИСОК'
  },
  topNote:{
    ru:'Здесь не мера зла, только мера того, как сильно каждый меня бесит',
    en:'Not a measure of evil, only of how much each person gets on my nerves',
    fr:'Ce n’est pas une mesure du mal, juste de combien chacun m’énerve',
    ar:'ليس مقياسا للشر، بل فقط لمدى إزعاج كل واحد لي',
    tr:'Bu kötülük ölçüsü değil, sadece beni ne kadar sinir ettiklerinin ölçüsü',
    he:'זה לא מדד לרוע, רק כמה כל אחד עולה לי על העצבים',
    hi:'यह बुराई का माप नहीं, बस कौन मुझे कितना परेशान करता है',
    hy:'Սա չարի չափ չէ, այլ թե ամեն մեկը որքան է նյարդայնացնում ինձ',
    tt:'Бу явызлык үлчәве түгел, бары кем мине күпме чыгара',
    ja:'悪さの尺度じゃなくて、どれだけ自分をイラつかせるかだけ',
    zh:'这不是邪恶程度，只是每个人让我多烦的程度',
    pirate:'No measure o’ evil, just how much each bilge-rat grates me nerves',
    stone:'Not evil count. Only how much person make head hot.',
    it:'Non misura il male, solo quanto ciascuno mi dà sui nervi',
    es:'No mide la maldad, solo cuánto me saca de quicio cada persona',
    pcm:'No be evil score, na how much each person dey vex me',
    ce:'ХӀара зулам буьйцург дац, церан цхьана сан нерваш мел хийцадо хьуоца',
    az:'Bu pislik ölçüsü deyil, sadəcə hər kəsin məni nə qədər əsəbiləşdirməsidir',
    uk:'Це не міра зла, а лише наскільки кожен мене бісить'
  },
  showStars:{
    ru:'Показать звёздочки рядом с именами',en:'Show stars next to names',fr:'Afficher les étoiles près des noms',ar:'إظهار النجوم بجانب الأسماء',tr:'İsimlerin yanında yıldızları göster',he:'הצג כוכבים ליד השמות',hi:'नामों के पास सितारे दिखाएं',hy:'Ցույց տալ աստղերը անունների կողքին',tt:'Исемнәр янында йолдызларны күрсәтү',ja:'名前の横に星を表示',zh:'在名字旁显示星星',pirate:'Show stars by names',stone:'Show sky marks by names',it:'Mostra stelle accanto ai nomi',es:'Mostrar estrellas junto a los nombres',pcm:'Show star near names',ce:'ЦӀерийн юххехь седарчаш гойта',az:'Adların yanında ulduzları göstər',uk:'Показати зірочки біля імен'
  },
  hideStars:{
    ru:'Скрыть звёздочки рядом с именами',en:'Hide stars next to names',fr:'Masquer les étoiles près des noms',ar:'إخفاء النجوم بجانب الأسماء',tr:'İsimlerin yanındaki yıldızları gizle',he:'הסתר כוכבים ליד השמות',hi:'नामों के पास सितारे छिपाएं',hy:'Թաքցնել աստղերը անունների կողքին',tt:'Исемнәр янында йолдызларны яшерү',ja:'名前の横の星を隠す',zh:'隐藏名字旁的星星',pirate:'Hide stars by names',stone:'Hide sky marks by names',it:'Nascondi stelle accanto ai nomi',es:'Ocultar estrellas junto a los nombres',pcm:'Hide star near names',ce:'ЦӀерийн юххера седарчаш къайладаха',az:'Adların yanındakı ulduzları gizlət',uk:'Сховати зірочки біля імен'
  },
  sortStarsAsc:{
    ru:'Сортировать по звёздам: от меньшего к большему',en:'Sort by stars: low to high',fr:'Trier par étoiles: croissant',ar:'ترتيب النجوم: من الأقل إلى الأعلى',tr:'Yıldıza göre sırala: azdan çoğa',he:'מיון לפי כוכבים: נמוך לגבוה',hi:'सितारों से क्रम: कम से ज्यादा',hy:'Դասավորել աստղերով՝ քիչից շատ',tt:'Йолдыз буенча: аздан күпкә',ja:'星で並べ替え: 少ない順',zh:'按星级从低到高排序',pirate:'Sort stars: low to high',stone:'Sort sky marks small to big',it:'Ordina per stelle: crescente',es:'Ordenar por estrellas: menor a mayor',pcm:'Sort star small to big',ce:'Седарчашаца: кӀезигара дуккхача',az:'Ulduza görə sırala: azdan çoxa',uk:'Сортувати за зірками: від меншого до більшого'
  },
  sortStarsDesc:{
    ru:'Сортировать по звёздам: от большего к меньшему',en:'Sort by stars: high to low',fr:'Trier par étoiles: décroissant',ar:'ترتيب النجوم: من الأعلى إلى الأقل',tr:'Yıldıza göre sırala: çoktan aza',he:'מיון לפי כוכבים: גבוה לנמוך',hi:'सितारों से क्रम: ज्यादा से कम',hy:'Դասավորել աստղերով՝ շատից քիչ',tt:'Йолдыз буенча: күптән азга',ja:'星で並べ替え: 多い順',zh:'按星级从高到低排序',pirate:'Sort stars: high to low',stone:'Sort sky marks big to small',it:'Ordina per stelle: decrescente',es:'Ordenar por estrellas: mayor a menor',pcm:'Sort star big to small',ce:'Седарчашаца: дуккхара кӀезига',az:'Ulduza görə sırala: çoxdan aza',uk:'Сортувати за зірками: від більшого до меншого'
  },
  lightTheme:{
    ru:'Включить светлую тему',en:'Switch to light theme',fr:'Passer au thème clair',ar:'التبديل إلى النمط الفاتح',tr:'Açık temaya geç',he:'עבור לערכת נושא בהירה',hi:'हल्की थीम पर जाएं',hy:'Անցնել բաց թեմայի',tt:'Якты темага күчү',ja:'ライトテーマに切替',zh:'切换到浅色主题',pirate:'Hoist light theme',stone:'Make cave bright',it:'Passa al tema chiaro',es:'Cambiar al tema claro',pcm:'Change to light theme',ce:'Серло тема латта',az:'Açıq temaya keç',uk:'Увімкнути світлу тему'
  },
  darkTheme:{
    ru:'Включить тёмную тему',en:'Switch to dark theme',fr:'Passer au thème sombre',ar:'التبديل إلى النمط الداكن',tr:'Koyu temaya geç',he:'עבור לערכת נושא כהה',hi:'गहरी थीम पर जाएं',hy:'Անցնել մուգ թեմայի',tt:'Караңгы темага күчү',ja:'ダークテーマに切替',zh:'切换到深色主题',pirate:'Drop to dark theme',stone:'Make cave dark',it:'Passa al tema scuro',es:'Cambiar al tema oscuro',pcm:'Change to dark theme',ce:'Бода тема латта',az:'Tünd temaya keç',uk:'Увімкнути темну тему'
  },
  topSort:{
    ru:'Изменить порядок топа',en:'Reverse top order',fr:'Inverser le top',ar:'عكس ترتيب القائمة',tr:'Top sırasını ters çevir',he:'הפוך את סדר הטופ',hi:'टॉप क्रम उलटें',hy:'Շրջել թոփի կարգը',tt:'Топ тәртибен әйләндерү',ja:'トップ順を反転',zh:'反转榜单顺序',pirate:'Turn the top astern',stone:'Flip big bad order',it:'Inverti ordine top',es:'Invertir orden del top',pcm:'Reverse top order',ce:'Топ могӀам хийца',az:'Top sırasını tərsinə çevir',uk:'Змінити порядок топа'
  },
  irritation:{
    ru:'Насколько меня бесит',en:'How much this person annoys me',fr:'À quel point cette personne m’énerve',ar:'كم يزعجني هذا الشخص',tr:'Bu kişi beni ne kadar sinir ediyor',he:'כמה האדם הזה מעצבן אותי',hi:'यह व्यक्ति मुझे कितना परेशान करता है',hy:'Այս մարդը որքան է ինձ նյարդայնացնում',tt:'Бу кеше мине күпме чыгара',ja:'この人がどれだけイラつくか',zh:'这个人让我有多烦',pirate:'How much this swab vexes me',stone:'How much person make me grunt',it:'Quanto questa persona mi irrita',es:'Cuánto me molesta esta persona',pcm:'How much this person dey vex me',ce:'ХӀара стаг сан нерваш мел хийцадо',az:'Bu adam məni nə qədər əsəbiləşdirir',uk:'Наскільки ця людина мене бісить'
  },
  entryCount:{
    ru:'гнид',en:'ENTRIES',fr:'ENTRÉES',ar:'إدخالات',tr:'KAYIT',he:'רשומות',hi:'प्रविष्टियाँ',hy:'ԳՐԱՌՈՒՄ',tt:'ЯЗМА',ja:'件',zh:'条',pirate:'MARKS',stone:'SCRATCHES',it:'VOCI',es:'ENTRADAS',pcm:'ENTRIES',ce:'ЙОЗАНАШ',az:'QEYD',uk:'записів'
  }
};
