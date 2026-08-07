/*
 * 鎌倉市 地区別収集カレンダー（令和8年(2026年)4月1日から）
 * 出典: 鎌倉市配布冊子 PDF p.1-2
 *
 * schedule の各曜日は「その曜日に出せるもの」の配列。
 * nth が null のものは毎週。nth が数値(1〜4)のものは、
 * その月の「その曜日が何回目にあたるか」で判定する
 * （例: nth:3 は「その月で3回目の水曜日」。第3週ではない点に注意 — 冊子p.2参照）。
 * 月の5回目の該当曜日には、毎週の品目のみを収集（nth指定品目は収集なし）。
 */

const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri"];
const WEEKDAY_LABEL = { mon: "月", tue: "火", wed: "水", thu: "木", fri: "金", sat: "土", sun: "日" };

function w(cat, nth) { return { cat: cat, nth: nth || null }; }

const DISTRICTS = [
  {
    id: "junisho",
    label: "十二所・浄明寺・二階堂",
    areas: ["十二所", "浄明寺", "二階堂"],
    schedule: {
      mon: [w("moyasu")],
      tue: [w("kami"), w("nuno"), w("moenai", 1), w("kikenyugai", 1), w("shokuyu", 1), w("seihinpura", 3)],
      wed: [w("pet"), w("ueki")],
      thu: [w("moyasu")],
      fri: [w("inkanbin"), w("youkipura")],
    },
  },
  {
    id: "nishikadomon",
    label: "西御門・雪ノ下・扇ガ谷・小町・御成町・佐助",
    areas: ["西御門", "雪ノ下", "扇ガ谷", "小町", "御成町", "佐助"],
    schedule: {
      mon: [w("moyasu")],
      tue: [w("kami"), w("nuno"), w("moenai", 2), w("kikenyugai", 2), w("shokuyu", 2), w("seihinpura", 4)],
      wed: [w("pet"), w("ueki")],
      thu: [w("moyasu")],
      fri: [w("inkanbin"), w("youkipura")],
    },
  },
  {
    id: "omachi",
    label: "大町・材木座",
    areas: ["大町", "材木座"],
    schedule: {
      mon: [w("moyasu")],
      tue: [w("kami"), w("nuno"), w("moenai", 3), w("kikenyugai", 3), w("shokuyu", 3), w("seihinpura", 2)],
      wed: [w("pet"), w("ueki")],
      thu: [w("moyasu")],
      fri: [w("inkanbin"), w("youkipura")],
    },
  },
  {
    id: "yuigahama",
    label: "由比ガ浜・笹目町",
    areas: ["由比ガ浜", "笹目町"],
    schedule: {
      mon: [w("moyasu")],
      tue: [w("inkanbin"), w("youkipura")],
      wed: [w("pet"), w("ueki")],
      thu: [w("moyasu")],
      fri: [w("kami"), w("nuno"), w("moenai", 2), w("kikenyugai", 2), w("shokuyu", 2), w("seihinpura", 4)],
    },
  },
  {
    id: "hase",
    label: "長谷・極楽寺・坂ノ下",
    areas: ["長谷", "極楽寺", "坂ノ下"],
    schedule: {
      mon: [w("kami"), w("nuno")],
      tue: [w("moyasu")],
      wed: [w("pet"), w("moenai", 1), w("kikenyugai", 1), w("shokuyu", 1), w("seihinpura", 3)],
      thu: [w("inkanbin"), w("youkipura")],
      fri: [w("moyasu")],
    },
  },
  {
    id: "inamuragasaki",
    label: "稲村ガ崎・七里ガ浜東",
    areas: ["稲村ガ崎", "七里ガ浜東"],
    schedule: {
      mon: [w("kami"), w("nuno"), w("youkipura")],
      tue: [w("moyasu")],
      wed: [w("pet"), w("moenai", 1), w("kikenyugai", 1), w("shokuyu", 1), w("seihinpura", 3)],
      thu: [w("inkanbin"), w("ueki")],
      fri: [w("moyasu")],
    },
  },
  {
    id: "koshigoe1-5",
    label: "腰越一丁目〜五丁目・津西",
    areas: ["腰越一丁目〜五丁目", "津西"],
    schedule: {
      mon: [w("ueki"), w("youkipura")],
      tue: [w("moyasu")],
      wed: [w("inkanbin"), w("pet")],
      thu: [w("kami"), w("nuno"), w("moenai", 2), w("kikenyugai", 2), w("shokuyu", 2), w("seihinpura", 3)],
      fri: [w("moyasu")],
    },
  },
  {
    id: "koshigoe-hyoji",
    label: "腰越（未表示地区）・津・七里ガ浜",
    areas: ["腰越（未表示地区）", "津", "七里ガ浜"],
    schedule: {
      mon: [w("ueki"), w("youkipura")],
      tue: [w("moyasu")],
      wed: [w("inkanbin"), w("pet")],
      thu: [w("kami"), w("nuno"), w("moenai", 3), w("kikenyugai", 3), w("shokuyu", 3), w("seihinpura", 1)],
      fri: [w("moyasu")],
    },
  },
  {
    id: "nishikamakura",
    label: "西鎌倉・鎌倉山",
    areas: ["西鎌倉", "鎌倉山"],
    schedule: {
      mon: [w("kami"), w("nuno"), w("ueki")],
      tue: [w("moyasu")],
      wed: [w("pet"), w("moenai", 1), w("kikenyugai", 1), w("shokuyu", 1), w("seihinpura", 3)],
      thu: [w("inkanbin"), w("youkipura")],
      fri: [w("moyasu")],
    },
  },
  {
    id: "kajiwara-hyoji",
    label: "梶原（未表示地区）・寺分（未表示地区）",
    areas: ["梶原（未表示地区）", "寺分（未表示地区）"],
    schedule: {
      mon: [w("moyasu")],
      tue: [w("ueki"), w("youkipura")],
      wed: [w("pet"), w("moenai", 4), w("kikenyugai", 4), w("shokuyu", 4), w("seihinpura", 2)],
      thu: [w("moyasu")],
      fri: [w("kami"), w("nuno"), w("inkanbin")],
    },
  },
  {
    id: "kamimachiya",
    label: "上町屋・手広",
    areas: ["上町屋", "手広"],
    schedule: {
      mon: [w("kami"), w("nuno"), w("ueki")],
      tue: [w("moyasu")],
      wed: [w("pet"), w("moenai", 2), w("kikenyugai", 2), w("shokuyu", 2), w("seihinpura", 4)],
      thu: [w("inkanbin"), w("youkipura")],
      fri: [w("moyasu")],
    },
  },
  {
    id: "fueta",
    label: "笛田・常盤",
    areas: ["笛田", "常盤"],
    schedule: {
      mon: [w("kami"), w("nuno"), w("ueki")],
      tue: [w("moyasu")],
      wed: [w("pet"), w("moenai", 3), w("kikenyugai", 3), w("shokuyu", 3), w("seihinpura", 1)],
      thu: [w("inkanbin"), w("youkipura")],
      fri: [w("moyasu")],
    },
  },
  {
    id: "kajiwara1-5",
    label: "梶原一丁目〜五丁目・寺分一丁目〜三丁目・山崎（うぐいす山）",
    areas: ["梶原一丁目〜五丁目", "寺分一丁目〜三丁目", "山崎（うぐいす山）"],
    schedule: {
      mon: [w("moyasu")],
      tue: [w("ueki"), w("youkipura")],
      wed: [w("pet"), w("moenai", 4), w("kikenyugai", 4), w("shokuyu", 4), w("seihinpura", 2)],
      thu: [w("moyasu")],
      fri: [w("kami"), w("nuno"), w("inkanbin")],
    },
  },
  {
    id: "yamanouchi",
    label: "山ノ内",
    areas: ["山ノ内"],
    schedule: {
      mon: [w("moyasu")],
      tue: [w("ueki"), w("youkipura")],
      wed: [w("kami"), w("nuno"), w("pet")],
      thu: [w("moyasu")],
      fri: [w("inkanbin"), w("moenai", 1), w("kikenyugai", 1), w("shokuyu", 1), w("seihinpura", 3)],
    },
  },
  {
    id: "dai-hyoji",
    label: "台（未表示地区）",
    areas: ["台（未表示地区）"],
    schedule: {
      mon: [w("kami"), w("nuno"), w("youkipura")],
      tue: [w("moyasu")],
      wed: [w("inkanbin"), w("pet")],
      thu: [w("ueki"), w("moenai", 4), w("kikenyugai", 4), w("shokuyu", 4), w("seihinpura", 2)],
      fri: [w("moyasu")],
    },
  },
  {
    id: "kobukurogayatsu",
    label: "小袋谷",
    areas: ["小袋谷"],
    schedule: {
      mon: [w("moyasu")],
      tue: [w("ueki"), w("youkipura")],
      wed: [w("kami"), w("nuno"), w("pet")],
      thu: [w("moyasu")],
      fri: [w("inkanbin"), w("moenai", 3), w("kikenyugai", 3), w("shokuyu", 3), w("seihinpura", 1)],
    },
  },
  {
    id: "yamazaki-uguisu-nozoku",
    label: "山崎（うぐいす山除く）・台一丁目〜五丁目",
    areas: ["山崎（うぐいす山除く）", "台一丁目〜五丁目"],
    schedule: {
      mon: [w("kami"), w("nuno"), w("youkipura")],
      tue: [w("moyasu")],
      wed: [w("inkanbin"), w("pet")],
      thu: [w("ueki"), w("moenai", 4), w("kikenyugai", 4), w("shokuyu", 4), w("seihinpura", 2)],
      fri: [w("moyasu")],
    },
  },
  {
    id: "ofuna1-5",
    label: "大船一丁目〜五丁目・大船（未表示地区）",
    areas: ["大船一丁目〜五丁目", "大船（未表示地区）"],
    schedule: {
      mon: [w("moyasu")],
      tue: [w("inkanbin"), w("moenai", 3), w("kikenyugai", 3), w("shokuyu", 3), w("seihinpura", 1)],
      wed: [w("pet"), w("ueki")],
      thu: [w("moyasu")],
      fri: [w("kami"), w("nuno"), w("youkipura")],
    },
  },
  {
    id: "takano",
    label: "高野・今泉・今泉台",
    areas: ["高野", "今泉", "今泉台"],
    schedule: {
      mon: [w("moyasu")],
      tue: [w("inkanbin"), w("moenai", 4), w("kikenyugai", 4), w("shokuyu", 4), w("seihinpura", 2)],
      wed: [w("pet"), w("ueki")],
      thu: [w("moyasu")],
      fri: [w("kami"), w("nuno"), w("youkipura")],
    },
  },
  {
    id: "iwase",
    label: "岩瀬・大船六丁目",
    areas: ["岩瀬", "大船六丁目"],
    schedule: {
      mon: [w("moyasu")],
      tue: [w("inkanbin"), w("moenai", 2), w("kikenyugai", 2), w("shokuyu", 2), w("seihinpura", 4)],
      wed: [w("pet"), w("ueki")],
      thu: [w("moyasu")],
      fri: [w("kami"), w("nuno"), w("youkipura")],
    },
  },
  {
    id: "okamoto",
    label: "岡本",
    areas: ["岡本"],
    schedule: {
      mon: [w("inkanbin"), w("ueki")],
      tue: [w("moyasu")],
      wed: [w("kami"), w("nuno"), w("pet")],
      thu: [w("youkipura"), w("moenai", 1), w("kikenyugai", 1), w("shokuyu", 1), w("seihinpura", 4)],
      fri: [w("moyasu")],
    },
  },
  {
    id: "ueki",
    label: "植木",
    areas: ["植木"],
    schedule: {
      mon: [w("inkanbin"), w("ueki")],
      tue: [w("moyasu")],
      wed: [w("kami"), w("nuno"), w("pet")],
      thu: [w("youkipura"), w("moenai", 2), w("kikenyugai", 2), w("shokuyu", 2), w("seihinpura", 4)],
      fri: [w("moyasu")],
    },
  },
  {
    id: "tamanawa",
    label: "玉縄・城廻・関谷",
    areas: ["玉縄", "城廻", "関谷"],
    schedule: {
      mon: [w("inkanbin"), w("ueki")],
      tue: [w("moyasu")],
      wed: [w("kami"), w("nuno"), w("pet")],
      thu: [w("youkipura"), w("moenai", 3), w("kikenyugai", 3), w("shokuyu", 3), w("seihinpura", 1)],
      fri: [w("moyasu")],
    },
  },
];

// 地区選択セレクト用のフラットな地域名一覧（地域名 -> 地区index）
const AREA_INDEX = [];
DISTRICTS.forEach(function (d, i) {
  d.areas.forEach(function (areaName) {
    AREA_INDEX.push({ area: areaName, districtIndex: i });
  });
});

// 表示順の調整：「◯丁目」など番地表記のある地区の直後に、対応する「（未表示地区）」を並べる
var HYOJI_REORDER_PAIRS = [
  ["腰越一丁目〜五丁目", "腰越（未表示地区）"],
  ["梶原一丁目〜五丁目", "梶原（未表示地区）"],
  ["寺分一丁目〜三丁目", "寺分（未表示地区）"],
  ["台一丁目〜五丁目", "台（未表示地区）"],
  ["大船一丁目〜五丁目", "大船（未表示地区）"],
];
HYOJI_REORDER_PAIRS.forEach(function (pair) {
  var numberedName = pair[0], hyojiName = pair[1];
  var hyojiIdx = AREA_INDEX.findIndex(function (e) { return e.area === hyojiName; });
  if (hyojiIdx === -1) return;
  var entry = AREA_INDEX.splice(hyojiIdx, 1)[0];
  var numberedIdx = AREA_INDEX.findIndex(function (e) { return e.area === numberedName; });
  if (numberedIdx === -1) { AREA_INDEX.splice(hyojiIdx, 0, entry); return; }
  AREA_INDEX.splice(numberedIdx + 1, 0, entry);
});

if (typeof module !== "undefined") {
  module.exports = { DISTRICTS, AREA_INDEX, WEEKDAYS, WEEKDAY_LABEL };
}
