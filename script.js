const people = [
  {name:"Мистер Г.",reason:"не запускает сервер в майнкрафте уже который день, мои ресурсы пропали навсегда",level:2},
  {name:"Йогурт",reason:"просто мне не нравится, я не знаю кто это",level:1},
  {name:"Анастасия Землеройка",reason:"без комментариев",level:5},
  {name:"Амсалат",reason:"забанил меня, максона, забрал модерку у олди, не возвращает доллар, украл роль. гандон",level:4},
  {name:"Никич",reason:"заставил меня скачать сранную асетту корсу чтобы поиграть 1 раз, мне пришлось качать кучу говна ты мне не нравишься",level:2},
  {name:"Дедпи47",reason:"забанил меня на своем ебанном сервере, ну не сильно и хотелось, я знаю ты это читаешь, будут последствия",level:1},
  {name:"Артемка",reason:"просто уебок",level:5},
  {name:"Санек",reason:"постоянно зовет меня играть в кс когда я сплю и потом жалуется что я не играю",level:1},
  {name:"Важдани",reason:"просто бесит меня еще и хейтит по какой то причине, я видел твое истинное лицо",level:3},
  {name:"Мисс В.",reason:"не мог не добавить ее сюда",level:5},
  {name:"Реднек",reason:"забанил меня везде, я все помню уебок я за тобой слежу",level:3},
  {name:"Ред Билдер",reason:"просто заебал меня уже я не могу читать твою хуйню брат",level:5},  
  {name:"Турбо",reason:"мега уебище, забанила меня не сервере и не пускает обратно я тебе уши отгрызу, поверь мне рано или поздно я буду там ",level:5},
  {name:"Декстер",reason:"сказал про меня гадость, пока на этом все но я знаю что дальше будет что то еще",level:1},
  {name:"repevfrt",reason:"я хуй знает кто это, просто позвонил в дискорде зачем то мне, ты в списке уебок",level:5},
  {name:"Мистер К.",reason:"просто заебал меня, очень неприятный человек",level:5},
  {name:"Креш Бандикут",reason:"назвал сынком, неуважение",level:1},
  {name:"Лоджик",reason:"просто захотелось вписать сюда, особо ничего плохого не сделал но вот как то так",level:1},
  {name:"Виплей",reason:"просто лох",level:3},
  {name:"Мистго",reason:"друг лоха",level:3},
  {name:"Рари",reason:"уебок, свиномать и так далее ",level:5},
  {name:"Дарья",reason:"рекомендует сериалы, говорит что это лучшее что она смотрела а по итогу это полная залупа, кто вернет мои потраченные часы",level:3},
  {name:"Данте",reason:"чмоха",level:5},
  {name:"В612",reason:"сел в тюрьму за терроризм на 20 лет ну что за хуйня чел",level:5},
];
 
for(let i = people.length - 1; i > 0; i--){
  const j = Math.floor(Math.random() * (i + 1));
  [people[i], people[j]] = [people[j], people[i]];
}
 
document.getElementById('countline').textContent = people.length + ' гниды';
 
function wobblyText(text) {
  return text.split('').map(ch => {
    if(ch === ' ') return ' ';
    const rot = (Math.random() - 0.5) * 14;
    const tx  = (Math.random() - 0.5) * 5;
    const ty  = (Math.random() - 0.5) * 8;
    return `<span style="transform:rotate(${rot}deg) translate(${tx}px,${ty}px)">${ch}</span>`;
  }).join('');
}
 
const list = document.getElementById('list');
 
people.forEach((p, i) => {
  const el = document.createElement('div');
  el.className = 'entry';
  el.style.animationDelay = `${i * 0.06}s`;
  el.style.animation = `fadeUp 0.4s ease forwards ${i * 0.06}s`;
 
  const dots = Array.from({length:5}, (_, d) =>
    `<div class="v-dot${d < p.level ? ' on' : ''}"></div>`
  ).join('');
 
  el.innerHTML = `
    <div class="entry-name">${wobblyText(p.name)}</div>
    <div class="entry-detail">
      <div class="entry-reason">${p.reason}</div>
      <div class="entry-level">${dots}</div>
    </div>`;
 
  el.querySelector('.entry-name').addEventListener('click', () => {
    const was = el.classList.contains('open');
    document.querySelectorAll('.entry.open').forEach(e => e.classList.remove('open'));
    if (!was) el.classList.add('open');
  });
 
  list.appendChild(el);
});