const CONFIG = {
  price: "99 000",
  telegram: "rbv024",
  humo: "5614 6840 9098 0960",
  visa: "4916 9903 4578 6393"
};
const TPL = [
  ["gold", "Золото", "photo_2026-10-07_22-46-44.jpg"],
  ["lace", "Кружево", "photo_2026-10-07_22-45-50.jpg"],
  ["rings", "Кольца", "photo_2026-10-07_22-46-29.jpg"],
  ["wine", "Бордо", "photo_2026-10-07_22-46-02.jpg"]
];
const I = {
  ru: {
    title: "Своё приглашение за 10 минут",
    lead: "Выберите конверт. После оплаты 99 000 открою ссылку.",
    types: [["toy","Свадьба","Той и ресторан"],["fotiha","Фотиха","Нежное приглашение"],["zags","ЗАГС","Роспись и адрес"],["bday","День рождения","Имя и место"],["sanduq","Sanduq party","Вечер и зал"]],
    next: "Дальше", back: "Назад", groom: "Жених / имя", bride: "Невеста / второе имя",
    date: "Дата", time: "Время", place: "Ресторан или место", city: "Город",
    gen: "Собрать приглашение", locked: "Готово. Ссылка после оплаты",
    pay: "Переведите 99 000 и отправьте чек. После проверки пришлю открытую ссылку.",
    copy: "Скопировать", check: "Отправить чек в Telegram"
  },
  uz: {
    title: "Taklifnoma 10 daqiqada",
    lead: "Konvertni tanlang. 99 000 to‘langach, havola ochiladi.",
    types: [["toy","To‘y","Restoran"],["fotiha","Fotiha","Nafis taklifnoma"],["zags","ZAGS","Vaqt va manzil"],["bday","Tug‘ilgan kun","Ism va joy"],["sanduq","Sanduq party","Kechki tadbir"]],
    next: "Keyingi", back: "Orqaga", groom: "Kuyov / ism", bride: "Kelin / ikkinchi ism",
    date: "Sana", time: "Vaqt", place: "Restoran yoki joy", city: "Shahar",
    gen: "Taklifnoma yig‘ish", locked: "Tayyor. Havola to‘lovdan keyin",
    pay: "99 000 o‘tkazing va chekni yuboring. Tekshirib, ochiq havola beraman.",
    copy: "Nusxa", check: "Chekni Telegramga"
  }
};
const state = { lang: "ru", step: 0, type: "toy", tpl: "gold", groom: "", bride: "", date: "", time: "", place: "", city: "Самарканд" };
const $ = (id) => document.getElementById(id);
const t = () => I[state.lang];
function esc(v) { return String(v || "").replace(/"/g, "&" + "quot;"); }
function read() {
  ["groom","bride","date","time","place","city"].forEach(k => { if ($(k)) state[k] = $(k).value.trim(); });
}
function link(open) {
  const q = new URLSearchParams({ type: state.type, tpl: state.tpl, g: state.groom, b: state.bride, d: state.date, tm: state.time, p: state.place, c: state.city });
  if (open) q.set("ok", "1");
  return "invite.html?" + q.toString();
}
function tg() {
  const id = Math.random().toString(36).slice(2, 7).toUpperCase();
  const text = `Buyurtma ${id}\n${state.groom} & ${state.bride}\n${state.type} ${state.date} ${state.time}\n${state.place}, ${state.city}\n99 000\n${location.href.replace(/index\.html$/, "")}${link(true)}`;
  return `https://t.me/${CONFIG.telegram}?text=${encodeURIComponent(text)}`;
}
function render() {
  const s = t();
  $("title").textContent = s.title;
  $("lead").textContent = s.lead;
  $("steps").innerHTML = [0,1,2,3].map(i => `<i class="${i <= state.step ? "on" : ""}"></i>`).join("");
  $("back").classList.toggle("hide", state.step === 0 || state.step === 3);
  $("back").textContent = s.back;
  $("ru").className = state.lang === "ru" ? "on" : "";
  $("uz").className = state.lang === "uz" ? "on" : "";
  if (state.step === 0) {
    $("box").innerHTML = `<div class="grid">${s.types.map(x => `<button class="choice ${state.type===x[0]?"on":""}" data-type="${x[0]}"><b>${x[1]}</b><span>${x[2]}</span></button>`).join("")}</div>`;
    $("go").textContent = s.next;
  } else if (state.step === 1) {
    $("box").innerHTML = `<label>${s.groom}</label><input id="groom" value="${esc(state.groom)}"><label>${s.bride}</label><input id="bride" value="${esc(state.bride)}"><div class="row"><div><label>${s.date}</label><input id="date" type="date" value="${esc(state.date)}"></div><div><label>${s.time}</label><input id="time" type="time" value="${esc(state.time)}"></div></div><label>${s.place}</label><input id="place" value="${esc(state.place)}"><label>${s.city}</label><input id="city" value="${esc(state.city)}">`;
    $("go").textContent = s.next;
  } else if (state.step === 2) {
    $("box").innerHTML = `<div class="grid">${TPL.map(x => `<button class="tpl ${state.tpl===x[0]?"on":""}" data-tpl="${x[0]}"><img src="${x[2]}" alt=""><b>${x[1]}</b></button>`).join("")}</div>`;
    $("go").textContent = s.gen;
  } else {
    $("box").innerHTML = `<div class="preview-wrap blurred"><iframe src="${link(false)}"></iframe><div class="lock"><div><b>99 000</b><span>${s.locked}</span></div></div></div><div class="paycard"><p>${s.pay}</p><p>Humo<br><strong>${CONFIG.humo}</strong></p><p>Visa<br><strong>${CONFIG.visa}</strong></p><button class="ghost" id="copy">${s.copy}</button><a class="paybtn" href="${tg()}">${s.check}</a></div>`;
    $("go").textContent = "99 000";
    $("copy").onclick = () => navigator.clipboard.writeText("Humo " + CONFIG.humo + "\nVisa " + CONFIG.visa);
  }
  $("box").querySelectorAll("[data-type]").forEach(b => b.onclick = () => { state.type = b.dataset.type; render(); });
  $("box").querySelectorAll("[data-tpl]").forEach(b => b.onclick = () => { state.tpl = b.dataset.tpl; render(); });
}
$("go").onclick = () => { read(); if (state.step === 1 && (!state.groom || !state.date || !state.place)) return; if (state.step < 3) state.step++; render(); };
$("back").onclick = () => { read(); if (state.step) state.step--; render(); };
$("ru").onclick = () => { state.lang = "ru"; render(); };
$("uz").onclick = () => { state.lang = "uz"; render(); };
render();
