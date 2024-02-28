!(function (t, e) {
    "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = e(require("bootstrap")))
      : "function" == typeof define && define.amd
      ? define(["bootstrap"], e)
      : ((t =
          "undefined" != typeof globalThis
            ? globalThis
            : t || self).BootstrapFormWizard = e(t.bootstrap));
  })(this, function (t) {
    "use strict";
    let e = document.querySelector(".needs-validation");
    class s {
      static instances = [];
      static defaultOptions = {
        lang: {
          backBtn: "< Back",
          nextBtn: "Next >",
          nextBtnSubmit: "Submit",
          fieldReqNotFocusable: "A required field in the form is not focusable.",
        },
        start: 1,
        submitForm: !0,
        useBootstrapValidation: 1,
      };
      id;
      element;
      elementWrapper;
      options;
      step;
      stepNavList;
      stepPanelList;
      constructor(t, e = {}) {
        if (
          ((this.element = "string" == typeof t ? document.querySelector(t) : t),
          (this.id = new Date().getTime().toString()),
          (this.elementWrapper = this.element.dataset.bfwWrapper
            ? document.querySelector(this.element.dataset.bfwWrapper)
            : this.element),
          !this.element || "form" != this.element.tagName.toLowerCase())
        )
          throw Error("The form element is invalid.");
        if (!this.elementWrapper) throw Error("The wrapper element is invalid.");
        if (
          ((this.element.id = this.element.id ? this.element.id : this.id),
          (this.options = Object.assign({}, s.defaultOptions, e)),
          this.options.backBtn ||
            (this.options.backBtn = this.elementWrapper.querySelector(
              'button[data-bfw-action="back"]'
            )),
          this.options.nextBtn ||
            (this.options.nextBtn = this.elementWrapper.querySelector(
              'button[data-bfw-action="next"]'
            )),
          !this.options.backBtn ||
            "button" != this.options.backBtn.tagName.toLowerCase() ||
            !this.options.nextBtn ||
            "button" != this.options.nextBtn.tagName.toLowerCase())
        )
          throw Error("The selector of the back or next button is invalid.");
        (this.options.backBtn.type = "button"),
          (this.options.backBtn.innerHTML = this.options.lang.backBtn),
          (this.options.nextBtn.type = "button"),
          this.options.backBtn.setAttribute("form", this.element.id),
          this.options.nextBtn.setAttribute("form", this.element.id),
          (this.options.backBtn.onclick = (t) => {
            this.back();
          }),
          (this.options.nextBtn.onclick = (t) => {
            this.next();
          }),
          (this.element.onreset = (t) => {
            this.goTo(1);
          }),
          (this.element.onsubmit = (t) => {
            this.options.submitForm
              ? "function" == typeof this.options.onSubmit &&
                this.options.onSubmit(t)
              : t.preventDefault();
          }),
          this.loadListSteps(),
          this.goTo(this.options.start),
          s.instances.push(this);
      }
      static forElement(t) {
        return (
          "string" == typeof t && (t = document.querySelector(t)),
          t ? s.instances.find((e) => e.element == t) : void 0
        );
      }
      checkValidityForm() {
        let t = !0;
        if (!this.element.noValidate) {
          if (!this.element.checkValidity()) {
            let e,
              s,
              i = Array.from(this.stepPanelList);
            t = Array.from(this.element.elements)
              .filter((t) => {
                if (t == this.options.backBtn || t == this.options.nextBtn)
                  return !1;
                for (e = t.parentElement, s = !1; e; ) {
                  if (i.includes(e)) return (s = !0), i.indexOf(e) < this.step;
                  if (e == this.elementWrapper) break;
                  e = e.parentElement;
                }
                if (!s) {
                  let n = Number(t.dataset.bfwInStep);
                  return n || (n = 1), n <= this.step;
                }
              })
              .every((t) => t.checkValidity());
          }
          "function" == typeof this.options.onValidated &&
            (t = this.options.onValidated(t));
        }
        return t;
      }
      getCurrentStep() {
        return {
          step: this.step,
          stepNav: this.stepNavList[this.step - 1],
          stepPanel: this.stepPanelList[this.step - 1],
        };
      }
      reportValidityForm() {
        if (this.options.useBootstrapValidation) e.classList.add("was-validated");
        else {
          let t = Array.from(this.element.elements).find(
            (t) => !t.checkValidity()
          );
          if (t) {
            let s = t.parentElement,
              i = !1,
              n = Array.from(this.stepPanelList);
            for (; s; ) {
              if (n.includes(s)) {
                (i = !0), this.goTo(n.indexOf(s) + 1);
                break;
              }
              if (s == this.elementWrapper) break;
              s = s.parentElement;
            }
            if (!i) {
              let o = Number(t.dataset.bfwInStep);
              o || (o = 1), this.goTo(o);
            }
            t.reportValidity() && alert(this.options.lang.fieldReqNotFocusable);
          }
        }
      }
      loadListSteps() {
        if (
          ((this.stepNavList = this.elementWrapper.querySelectorAll(
            '[data-bs-toggle="step"]'
          )),
          0 == this.stepNavList.length)
        )
          throw Error("No step elements were found in the list.");
        {
          let t = [];
          this.stepNavList.forEach((e, s) => {
            let i = e.dataset.bsTarget
                ? e.dataset.bsTarget
                : e.getAttribute("href"),
              n = this.elementWrapper.querySelector(i),
              o = (s + 1).toString();
            if (!n)
              throw Error(
                "The step panel for one of the steps in the list was not found."
              );
            (n.role = "steppanel"),
              n.setAttribute("panel", o),
              t.push(i),
              e.setAttribute("step", o),
              e.addEventListener("shown.bs.tab", (t) => {
                let e = t.target,
                  s = Array.from(this.stepNavList).indexOf(e);
                (this.step = s + 1),
                  1 == this.step
                    ? this.options.backBtn.setAttribute("disabled", "")
                    : this.options.backBtn.removeAttribute("disabled"),
                  (this.options.nextBtn.innerHTML =
                    this.step == this.stepNavList.length
                      ? this.options.lang.nextBtnSubmit
                      : this.options.lang.nextBtn),
                  (this.options.nextBtn.type = "button");
              });
          }),
            (this.stepPanelList = this.elementWrapper.querySelectorAll(
              t.join(", ")
            ));
        }
      }
      reset() {
        this.element.reset();
      }
      goTo(e) {
        let s = this.stepNavList.item(e - 1);
        if (!s)
          throw Error(
            "The step number to display is less than or greater than the number of recordfed steps."
          );
        t.Tab.getOrCreateInstance(s).show(),
          this.step ||
            ((this.step = e),
            1 == this.step
              ? this.options.backBtn.setAttribute("disabled", "")
              : this.options.backBtn.removeAttribute("disabled"),
            (this.options.nextBtn.innerHTML =
              this.step == this.stepNavList.length
                ? this.options.lang.nextBtnSubmit
                : this.options.lang.nextBtn),
            (this.options.nextBtn.type = "button"));
      }
      back() {
        this.stepNavList.item(this.step - 1) &&
          (this.goTo(this.step - 1),
          "function" == typeof this.options.onBack &&
            this.options.onBack(this.step));
      }
      next() {
        e.classList.remove("was-validated"),
          this.checkValidityForm()
            ? this.step == this.stepNavList.length
              ? this.options.nextBtn.form == this.element
                ? (this.options.nextBtn.type = "submit")
                : ((this.options.nextBtn.type = "submit"),
                  this.element.requestSubmit(this.options.nextBtn))
              : (this.goTo(this.step + 1),
                "function" == typeof this.options.onNext &&
                  this.options.onNext(this.step))
            : this.reportValidityForm();
      }
    }
    return s;
  });


  document.addEventListener("DOMContentLoaded", (event) => {
    // Initialize BootstrapFormWizard
    const formWizard = new BootstrapFormWizard(document.getElementById("example1"), {
      start: 1,
    });

    // Load language
    loadLang();

    // Check if the page was reloaded
    if (performance.navigation.type === 1) {
      // Page was reloaded, reset form in step 1
      resetFormStep1();
    }

    // Add custom validation for fields
    addCustomValidations();
  });

  function resetFormStep1() {
    const formStep1 = document.getElementById("ex1_step1");
    const formElements = formStep1.querySelectorAll("select, textarea, input");

    formElements.forEach((element) => {
      if (element.type === "checkbox" || element.type === "radio") {
        element.checked = false;
      } else {
        element.value = "";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", (event) => {
    // Initialize BootstrapFormWizard
    const formWizard = new BootstrapFormWizard(document.getElementById("example1"), {
      start: 1,
    });

    // Load language
    loadLang();

    // Check if the page was reloaded
    if (performance.navigation.type === 1) {
      // Page was reloaded, reset form in step 1
      resetFormStep1();
    }

    // Add custom validation for fields
    addCustomValidations();
  });

  function resetFormStep1() {
    const formStep1 = document.getElementById("ex1_step1");
    const formElements = formStep1.querySelectorAll("select, textarea, input");

    formElements.forEach((element) => {
      if (element.type === "checkbox" || element.type === "radio") {
        element.checked = false;
      } else {
        element.value = "";
      }
    });
  }

  function addCustomValidations() {
    const formStep1 = document.getElementById("ex1_step1");

    const fieldsToValidate = ['type', 'OperationalStatus', 'group', 'owner', 'inputProblemSummary'];

    fieldsToValidate.forEach((fieldName) => {
      const inputField = formStep1.querySelector(`#${fieldName}`);
      inputField.addEventListener('input', validateLetters);
    });
  }

  function validateLetters(event) {
    const inputField = event.target;
    const value = inputField.value.trim();

    // Check if the value contains only letters
    if (/^[A-Za-z]+$/.test(value)) {
      inputField.setCustomValidity('');
    } else {
      inputField.setCustomValidity('Please enter only letters');
    }
  }

  document.addEventListener("DOMContentLoaded", (event) => {
    // Initialize BootstrapFormWizard
    const formWizard = new BootstrapFormWizard(document.getElementById("example1"), {
      start: 1,
    });

    // Load language
    loadLang();

    // Check if the page was reloaded
    if (performance.navigation.type === 1) {
      // Page was reloaded, reset form in step 1
      resetFormStep1();
    }

    // Add custom validation for fields
    addCustomValidations();
  });

  function resetFormStep1() {
    const formStep1 = document.getElementById("ex1_step1");
    const formStep2 = document.getElementById("ex1_step2");

    // Reset form in step 1
    const formElementsStep1 = formStep1.querySelectorAll("select, textarea, input");
    formElementsStep1.forEach((element) => {
      if (element.type === "checkbox" || element.type === "radio") {
        element.checked = false;
      } else {
        element.value = "";
      }
    });

    // Clear validation messages for step 2
    const formElementsStep2 = formStep2.querySelectorAll("input");
    formElementsStep2.forEach((element) => {
      element.setCustomValidity('');
    });
  }

  function addCustomValidations() {
    const formStep2 = document.getElementById("ex1_step2");

    // Step 2 fields validation
    const inputOrgName = formStep2.querySelector("#inputOrgName");
    const inputBillingName = formStep2.querySelector("#inputBillingName");
    const inputBillingCCNumber = formStep2.querySelector("#inputBillingCCNumber");

    inputOrgName.addEventListener('input', validateNumbers);
    inputBillingName.addEventListener('input', validateLetters);
    inputBillingCCNumber.addEventListener('input', validateLetters);
  }

  function validateLetters(event) {
    const inputField = event.target;
    const value = inputField.value.trim();

    // Check if the value contains only letters
    if (/^[A-Za-z]+$/.test(value)) {
      inputField.setCustomValidity('');
    } else {
      inputField.setCustomValidity('Please enter only letters');
    }
  }

  function validateNumbers(event) {
    const inputField = event.target;
    const value = inputField.value.trim();

    // Check if the value contains only numbers
    if (/^\d+$/.test(value)) {
      inputField.setCustomValidity('');
    } else {
      inputField.setCustomValidity('Please enter only numbers');
    }
  }

  document.addEventListener("DOMContentLoaded", (event) => {
    // Initialize BootstrapFormWizard
    const formWizard = new BootstrapFormWizard(document.getElementById("example1"), {
      start: 1,
    });

    // Load language
    loadLang();

    // Check if the page was reloaded
    if (performance.navigation.type === 1) {
      // Page was reloaded, reset form in step 1
      resetFormStep1();
    }
  });

  function resetFormStep1() {
    const formStep1 = document.getElementById("ex1_step1");
    const formElements = formStep1.querySelectorAll("select, textarea, input");

    formElements.forEach((element) => {
      if (element.type === "checkbox" || element.type === "radio") {
        element.checked = false;
      } else {
        element.value = "";
      }
    });
  }