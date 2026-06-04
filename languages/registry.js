const siteLanguages = [
  {code:'ru', short:'РУС', label:'Русский', locale:'ru'},
  {code:'en', short:'ENG', label:'English', locale:'en'},
  {code:'fr', short:'FR', label:'Français', locale:'fr'},
  {code:'ar', short:'AR', label:'العربية', locale:'ar', dir:'rtl'},
  {code:'tr', short:'TR', label:'Türkçe', locale:'tr'},
  {code:'he', short:'HE', label:'עברית', locale:'he', dir:'rtl'},
  {code:'hi', short:'HI', label:'हिन्दी', locale:'hi'},
  {code:'hy', short:'HY', label:'Հայերեն', locale:'hy'},
  {code:'tt', short:'TT', label:'Татарча', locale:'tt'},
  {code:'ja', short:'JP', label:'日本語', locale:'ja'},
  {code:'zh', short:'ZH', label:'中文', locale:'zh'},
  {code:'pirate', short:'ARR', label:'Pirate English', locale:'en'},
  {code:'stone', short:'UGH', label:'Prehistoric', locale:'en'},
  {code:'it', short:'IT', label:'Italiano', locale:'it'},
  {code:'es', short:'ES', label:'Español', locale:'es'},
  {code:'pcm', short:'NG', label:'Naija Pidgin', locale:'en-NG'},
  {code:'ce', short:'CE', label:'Нохчийн', locale:'ce'},
  {code:'az', short:'AZ', label:'Azərbaycanca', locale:'az'},
  {code:'uk', short:'UA', label:'Українська', locale:'uk'}
];

const supportedLanguageCodes = new Set(siteLanguages.map(language => language.code));
const peopleTranslations = {};

function registerPeopleTranslation(code, reasons, names = []) {
  const english = typeof peopleEng !== 'undefined' && Array.isArray(peopleEng) ? peopleEng : [];
  peopleTranslations[code] = people.map((person, index) => ({
    ...person,
    name: names[index] || english[index]?.name || person.name,
    reason: reasons[index] || english[index]?.reason || person.reason
  }));
}
