/*!
 * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
 */
//
// Scripts
//

window.addEventListener("DOMContentLoaded", (event) => {
    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector("#sidebarToggle");
    if (sidebarToggle) {
      // Uncomment Below to persist sidebar toggle between refreshes
      // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
      //     document.body.classList.toggle('sb-sidenav-toggled');
      // }
      sidebarToggle.addEventListener("click", (event) => {
        event.preventDefault();
        document.body.classList.toggle("sb-sidenav-toggled");
        localStorage.setItem(
          "sb|sidebar-toggle",
          document.body.classList.contains("sb-sidenav-toggled")
        );
      });
    }
  });
  
  const list = [
    ["India", 30],
    ["China", 28],
    ["USA", 26],
    ["Nigeria", 24],
    ["Pakistan", 22],
    ["Indonesia", 20],
    ["Brazil", 18],
    ["Democratic", 16],
    ["Ethiopia", 14],
    ["Bangladesh", 12],
    ["Egypt", 10],
    ["Philippines", 8],
    ["Mexico", 6],
    ["Russian", 4],
    ["United", 2],
    ["Viet", 30],
    ["Japan", 28],
    ["Iran", 26],
    ["Turkey", 24],
    ["Uganda", 22],
    ["Kenya", 20],
    ["Sudan", 18],
    ["Germany", 16],
    ["Iraq", 14],
    ["Afghanistan", 12],
    ["South", 10],
    ["United", 8],
    ["Angola", 6],
    ["Thailand", 4],
    ["Niger", 2],
    ["France", 30],
    ["Mozambique", 28],
    ["Myanmar", 26],
    ["Algeria", 24],
    ["Colombia", 3],
    ["Yemen", 5],
    ["Italy", 7],
    ["Ghana", 9],
    ["Argentina", 11],
    ["Madagascar", 13],
    ["Côte", 15],
    ["Cameroon", 17],
    ["Saudi", 19],
    ["Mali", 21],
    ["Republic", 23],
    ["Canada", 13],
    ["Uzbekistan", 9],
    ["Morocco", 7],
    ["Spain", 5],
  ];
  
  const configList = {
    gridSize: 16,
    drawOutOfBound: false,
    list: list,
  };
  
  function loadWordCloud() {
    WordCloud(document.getElementById("word-cloud"), configList);
  }
  
  function triggerLangChange() {
    const lang_sel = document.querySelector("#lang-select");
    lang_sel.onchange = function () {
      loadJS(lang_sel.value);
    };
  }
  
  function loadLang() {
    triggerLangChange();
  }
  
  async function loadJS(language) {
    // DOM: Create the script element
    var jsElm = document.createElement("script");
    // set the type attribute
    jsElm.type = "application/javascript";
    // make the script element load file
    jsElm.src = `assets/js/lang/lang.${language}.js`;
    // finally insert the element to the body element in order to load the script
    document.body.appendChild(jsElm);
    jsElm.addEventListener("load", () => {
      const dashboardList = document.querySelectorAll(".dashboard");
      const wizardList = document.querySelectorAll(".wizard");
      dashboardList.forEach((e) => {
        e.innerHTML = lang.dashboard;
      });
      wizardList.forEach((e) => {
        e.innerHTML = lang.wizard;
      });
    });
  }