import Vue from "vue";

export function phraseToSentenceCase(phrase = "", ignored = []) {
    if (phrase.length === 0) {
        return phrase;
    }

    const words = phrase.split(" ").map((w) => {
        const v = w.toLowerCase();
        const prepositions = ["of", "for", "and"];
        if (prepositions.includes(v)) {
            return v;
        } else if (ignored.includes(w)) {
            return w;
        }
        return (v[0] || "").toUpperCase() + (v.slice(1) || "");
    });

    return words.join(" ");
}

export function capitalizeFirstLetter(str = "") {
    const words = (str + "").toLowerCase().split(" ");
    const firstWord = (words[0] || "");
    const capiitalizedFirstWord = (firstWord[0] || "").toUpperCase() + firstWord.slice(1);
    return capiitalizedFirstWord + " " + words.slice(1).join(" ");
}

export function formatAmount(amount = 0) {
    try {
        return "\u20A6" + (parseFloat(amount).toFixed(2) * 1).toLocaleString("en", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
    } catch {
        return 0.00;
    }
}

export function formatNumber(num) {
    if (num === null || num === undefined) {
        return 0;
    }
    num += "";
    num = num.replace(/,/g, ""); // This is so filter still works if it's used on an already formatted num
    num = num * 1;

    num = num.toFixed(2); // Keep the 2dp consistent
    num = num * 1; // Convert back to number so we can apply locale string

    num = num.toLocaleString("en"); // EN so we always get the commafied version.
    return num;
}

export function formInitials(item = "") {
    if (item !== null && item !== "") {
        let initials = "";
        const name = item.split(" ");
        if (typeof name[1] === "undefined") {
            initials = item.slice(0, 2);
        } else {
            initials = name[0].slice(0, 1) + name[1].slice(0, 1);
        }
        return (initials + "").toUpperCase();
    }
};

export function htmlToText(str = "") {
    return str.replace(/<[^>]*>/g, "");
};

export function captialize(str = "") {
    return (str + "").toUpperCase();
}

export function initials(item = "") {
    if (!item) {
        return "";
    }
    let initials = "";
    item = item + "";
    const name = item.split(" ");
    if (typeof name[1] === "undefined") {
        initials = item.slice(0, 2);
    } else {
        initials = name[0].slice(0, 1) + name[1].slice(0, 1);
    }
    return initials;
}

export function toLowercase(str, igoredWords = []) {
    const ignored = ["ip", "PAN", "PANs", ...igoredWords];
    if (!str) {
        return str;
    }

    const words = str.split(" ");
    const lowers = [];
    for (const word of words) {
        if (ignored.map(w => w.toLowerCase()).includes(word.toLowerCase())) {
            lowers.push(word);
        } else {
            lowers.push(word.toLowerCase());
        }
    }
    return lowers.join(" ");
}

Vue.filter("initials", initials);
Vue.filter("phrase_to_sentence_case", phraseToSentenceCase);
Vue.filter("capitalize_first_letter", capitalizeFirstLetter);
Vue.filter("format_amount", formatAmount);
Vue.filter("format_number", formatNumber);
Vue.filter("initials", formInitials);
Vue.filter("html_to_text", htmlToText);
Vue.filter("capitalize", captialize);
Vue.filter("to_lowercase", toLowercase);