var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// builds/module.js
__export(exports, {
  default: () => module_default
});

// src/index.js
var Plugin = function(Alpine) {
  const pluginName = "validate";
  function cleanText(str) {
    return String(str).trim();
  }
  function isEmpty(str) {
    return cleanText(str) === "";
  }
  function isEmail(str) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(cleanText(str));
  }
  function isPhone(str) {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(cleanText(str));
  }
  function isWebsite(str) {
    return /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+(-?[a-zA-Z0-9])*\.)+[\w]{2,}(\/\S*)?$/.test(cleanText(str));
  }
  function isUrl(str) {
    return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/.test(cleanText(str));
  }
  function isWholeNumber(str) {
    const num = Number(str);
    return Number.isInteger(num) && num > 0;
  }
  function isInteger(str) {
    return Number.isInteger(Number(str));
  }
  function isDate(str, format) {
    const [p1, p2, p3] = str.split(/[-\/.]/);
    let isoFormattedStr;
    if (format === "mm-dd-yyyy" && /^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})$/.test(str)) {
      isoFormattedStr = `${p3}-${p1}-${p2}`;
    } else if (format === "dd-mm-yyyy" && /^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})$/.test(str)) {
      isoFormattedStr = `${p3}-${p2}-${p1}`;
    } else if (format === "yyyy-mm-dd" && /^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/.test(str)) {
      isoFormattedStr = `${p1}-${p2}-${p3}`;
    } else
      return false;
    const date = new Date(isoFormattedStr);
    const timestamp = date.getTime();
    if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
      return false;
    }
    return date.toISOString().startsWith(isoFormattedStr);
  }
  const validate = (str) => {
    return !isEmpty(str);
  };
  validate.email = (str) => isEmail(str);
  validate.phone = (str) => isPhone(str);
  validate.website = (str) => isWebsite(str);
  validate.url = (str) => isUrl(str);
  validate.number = (str) => Number(str);
  validate.wholenumber = (str) => isWholeNumber(str);
  validate.integer = (str) => isInteger(str);
  validate.date = (str) => isDate(str, "mm-dd-yyyy");
  validate["date-mm-dd-yyyy"] = (str) => isDate(str, "mm-dd-yyyy");
  validate["date-dd-mm-yyyy"] = (str) => isDate(str, "dd-mm-yyyy");
  validate["date-yyyy-mm-dd"] = (str) => isDate(str, "yyyy-mm-dd");
  Alpine.magic(pluginName, () => validate);
  Alpine.directive(pluginName, (el, {
    modifiers,
    expression
  }, {
    evaluate
  }) => {
    let options = expression ? evaluate(expression) : {};
    function hasModifier(type) {
      return modifiers.includes(type);
    }
    function validateChecked() {
      if (!el.checked) {
        setError("required");
      } else {
        setValid();
      }
    }
    function validateInput() {
      const value = el.value;
      if (hasModifier("required") && isEmpty(value)) {
        setError("required");
        return false;
      }
      if (!hasModifier("required") && isEmpty(value)) {
        setValid();
        return false;
      }
      let error = false;
      modifiers.every((modifier, i) => {
        if (typeof validate[modifier] === "function") {
          if (modifier.includes("date") && !validate[modifier](value)) {
            const format = modifier.length > 4 ? modifier.slice(5) : "mm-dd-yyyy";
            error = `date required in ${format} format`;
            return false;
          } else if (!validate[modifier](value)) {
            error = `${modifier} required`;
            return false;
          }
        }
        return true;
      });
      if (options.test !== void 0) {
        options = expression ? evaluate(expression) : {};
        if (options.test === false) {
          error = error || "validation failed";
        }
      }
      if (error)
        setError(error);
      if (!error)
        setValid();
    }
    function setError(error) {
      error = options.error || error;
      el.parentNode.setAttribute("data-error", error);
      el.setAttribute("data-valid", false);
      if (hasModifier("refocus"))
        el.focus();
      if (el.nodeName === "INPUT" || el.nodeName === "TEXTAREA")
        addEventListener("input", validateInput);
    }
    function setValid() {
      el.parentNode.removeAttribute("data-error");
      el.setAttribute("data-valid", true);
    }
    if (options.test === void 0 && modifiers.length === 0) {
    } else if (el.nodeName === "INPUT" && modifiers.includes("checked") && (el.type === "checkbox" || el.type === "radio")) {
      el.setAttribute("data-valid", false);
      el.addEventListener("click", validateChecked);
    } else if (el.nodeName === "INPUT" || el.nodeName === "TEXTAREA" || el.nodeName === "SELECT") {
      el.setAttribute("data-valid", false);
      el.addEventListener("blur", validateInput);
    }
  });
};
var src_default = Plugin;

// builds/module.js
var module_default = src_default;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
