function separateEnglishAndChinese(inputString) {
 const englishRegex = /[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+/;///[a-zA-Z]/; // English letters
 const chineseRegex = /[\u4e00-\u9fa5]+/;///[\u4e00-\u9fa5]/; // Chinese characters range

 let englishChars = "";
 let chineseChars = "";

 let flag = '';
 let newStr = '';
 for (const char of inputString) {
   if (englishRegex.test(char)) {
     //englishChars += char;
     if (flag == 'C') {
       newStr += ' ';
     }

     flag = 'E';

   } else if (chineseRegex.test(char)) {
     //chineseChars += char;
     if (flag == 'E') {
       newStr += ' ';
     }

     flag = 'C'
   }
   newStr += char;
 }

 return newStr;
 // return {
 //   englishChars,
 //   chineseChars,
 // };
}
function ifEnglishOnly(content){
 return /^[A-Za-z0-9\s.,!?;:'"()\-+*/&%@#]+$/.test(content);
}
function ifValidPhoneNumber(content){
 return /^\d{1,4}-\d{1,4}-\d{1,10}$/.test(content);
}
function ifValidPhoneNumberWithExt(content){
 console.log('ifValidPhoneNumberWithExt', content);
 let testResult = /^\d{1,4}-\d{1,4}-\d{1,10}#\d{0,7}$/.test(content)
 console.log('ifValidPhoneNumberWithExt', content, testResult);
 return testResult;
}
function detectInputLanguage(inputText) {
 const englishPattern = /[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+/;
 const chinesePattern = /[\u4e00-\u9fa5]+/;

 const containsEnglish = englishPattern.test(inputText);
 const containsChinese = chinesePattern.test(inputText);

 if (containsEnglish && containsChinese) {
   return 'Mixed';//"Mixed";
 } else if (containsEnglish) {
   return 'E';//"English";
 } else if (containsChinese) {
   return 'C';//"Chinese";
 } else {
   return null;//"Unknown";
 }
}
function countSpaces(str) {
 let spaceCount = 0;

 for (let i = 0; i < str.length; i++) {
   if (str[i] === ' ') {
     spaceCount++;
   }
 }

 return spaceCount;
}

function padWithZero(num, targetLength) {
 return String(num).padStart(targetLength, '0');
}

function ifInArray(arr, value) {
 let q = arr.filter((elemInside) => elemInside == value);
 return q.length > 0;
}
function ifOtherInArray(arr, value) {
 let q = arr.filter((elemInside) => elemInside != value);
 return q.length > 0;
}
function ifFieldValueInArray(arr, field, fieldValue) {
 let q = arr.filter((elemInside) => elemInside[field] == fieldValue);
 return q.length > 0;
}
function removeItem(arr, value) {
 let idx = arr.indexOf(value);
 console.log(idx);
 if (idx >= 0) {
   arr.splice(idx, 1);
   // removeItem(arr, value);
 } else {
   return;
 }
 console.log(arr);
}
function removeItemWithFieldValue(arr, fieldName, fieldValue) {
 let idx = arr.findIndex(f => f[fieldName] == fieldValue);
 console.log(idx);
 if (idx >= 0) {
   arr.splice(idx, 1);
 } else {
   return;
 }
 console.log(arr);
}

function copyJsonObject(obj) {
 let str = JSON.stringify(obj);
 return JSON.parse(str);
}

(function () {
 /**
  * Decimal adjustment of a number.
  *
  * @param {String}  type  The type of adjustment.
  * @param {Number}  value The number.
  * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
  * @returns {Number} The adjusted value.
  */
 function decimalAdjust(type, value, exp) {
   // If the exp is undefined or zero...
   if (typeof exp === "undefined" || +exp === 0) {
     return Math[type](value);
   }
   value = +value;
   exp = +exp;
   // If the value is not a number or the exp is not an integer...
   if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
     return NaN;
   }
   // Shift
   value = value.toString().split("e");
   value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
   // Shift back
   value = value.toString().split("e");
   return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
 }

 // Decimal round
 if (!Math.round10) {
   Math.round10 = function (value, exp) {
     return decimalAdjust("round", value, exp);
   };
 }
 // Decimal floor
 if (!Math.floor10) {
   Math.floor10 = function (value, exp) {
     return decimalAdjust("floor", value, exp);
   };
 }
 // Decimal ceil
 if (!Math.ceil10) {
   Math.ceil10 = function (value, exp) {
     return decimalAdjust("ceil", value, exp);
   };
 }
})();

console.log('test here');
console.log(Math.round10(100.29, -1));

function uuid() {
 var d = Date.now();
 if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
   d += performance.now(); //use high-precision timer if available
 }
 return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
   var r = (d + Math.random() * 16) % 16 | 0;
   d = Math.floor(d / 16);
   return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
 });
}

function getRandomNumber(min, max) {
 return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDatetime({ date, format = 'YYYY-MM-DD', ifRoc = false, defaultWhenNull = '' }) {
 if (date == null) return defaultWhenNull;

 if (ifRoc) {
   let d = dayjs(date);
   return `${d.year() - 1911}-${d.month() + 1}-${d.date()}`;
 } else {
   return dayjs(date).format(format);
 }
}

function getPropertyFromObject(sourceObject, propertyName, defaultReturnIfSourceObjectNull) {
 if (sourceObject == null) {
   return defaultReturnIfSourceObjectNull;
 } else {
   return sourceObject[propertyName];
 }
}

function getQueryStringValueFromUrl(querySearch, queryStringParamName) {
 let urlSearchParams = new URLSearchParams(querySearch);
 //console.log(`f: ${urlSearchParams.get("f")}`);
 let value = urlSearchParams.get(queryStringParamName);
 return value;
}

function getThisPageQueryStringValue(queryStringParamName) {
 let _querySearch = document.location.search;
 return getQueryStringValueFromUrl(_querySearch, queryStringParamName)
}
function getThisPagePathValue(pathIndex) {
 let path = document.location.pathname;
 let pathArray = path.split('/');
 if (pathArray.length <= pathIndex) {
   return null;
 } else {
   return pathArray[pathIndex];
 }
}
function ifMatchToCurrentPagePath(givenPagePath) {
 let path = document.location.pathname;
 let _path = path.toLocaleLowerCase();
 return _path == givenPagePath.toLocaleLowerCase();
}

function copyToClipboard(text, okMsg, failedMsg) {
 navigator.clipboard.writeText(text).then(() => {
   console.log('Copied to clipboard successfully!');
   alert(okMsg);
 }).catch(err => {
   console.error('Failed to copy: ', err);
   alert(failedMsg)
 });
}

function addToCalendar({ title, location, description, startDate, endDate }) {
 const formatDate = (date) => {
   return date.toISOString().replace(/[-:]|\.\d{3}/g, "").slice(0, 15) + "Z";
 };

 const start = formatDate(new Date(startDate));
 const end = formatDate(new Date(endDate));

 const encodedTitle = encodeURIComponent(title);
 const encodedLocation = encodeURIComponent(location);
 const encodedDescription = encodeURIComponent(description);

 // Google Calendar Link
 const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${start}/${end}&details=${encodedDescription}&location=${encodedLocation}&sf=true&output=xml`;

 // Outlook Web Link
 const outlookUrl = `https://outlook.live.com/owa/?path=/calendar/action/compose&subject=${encodedTitle}&body=${encodedDescription}&startdt=${startDate}&enddt=${endDate}&location=${encodedLocation}`;

 // ICS file content (for Apple Calendar and Outlook)
 const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DTSTART:${start}
DTEND:${end}
LOCATION:${location}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;

 const downloadICS = () => {
   const blob = new Blob([icsContent], { type: "text/calendar" });
   const url = URL.createObjectURL(blob);

   const link = document.createElement("a");
   link.href = url;
   link.download = "event.ics";
   link.click();
 };

 return {
   googleUrl,
   outlookUrl,
   downloadICS,
 };
}

function ifDeletableData(formStatus, userRole) {
 if(userRole == "03"){
   return formStatus == null || formStatus == 'draft' || formStatus == 'rejected';
 }else if(userRole == 'B9'){
   // 顧問 不能刪除
   return false;
 }else{
   return true;
 }
}

// Function to mask user name (example: "Michael Chen" -> "M****l C***")
function maskString(stringValue, maskStartIndex, maskLength) {
 if (!stringValue) return ''

 let arr = [...stringValue];
 let converted = arr.map((item, idx) => {
   return (idx >= maskStartIndex && idx < maskStartIndex + maskLength) ? '*' : item;
 });
 return converted.join('');
}

function decodeHtmlEntities(str) {
 const htmlEntities = {
   '&amp;': '&',
   '&lt;': '<',
   '&gt;': '>',
   '&quot;': '"',
   '&#39;': "'",
   '&#x2F;': '/',
   '&#x5C;': '\\',
   '&#96;': '`',
   '\n': '<br>',
   '&nbsp;': ' ',
 };

 return str.replace(/&[a-zA-Z0-9#]+;/g, (entity) => htmlEntities[entity] || entity);
}

function sanitizeString(str){
 if(str == null || str == undefined) return '';
 let r = str.replace(/&amp;/gi, '&')
 r = r.replace('&lt;', '<');
 r = r.replace('&gt;', '>')
 return r;
}
