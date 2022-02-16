(()=>{"use strict";var e=function(){return e=Object.assign||function(e){for(var t,n=1,o=arguments.length;n<o;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e},e.apply(this,arguments)};const t=function(t){var n=this;this.controller=t,this.store={},this.getStore=function(){return n.store},this.setStore=function(t){var o;for(var r in t)n.store=e(e({},n.store),((o={})[r]=t[r],o))}},n=function(){function e(e){this.label="",this.label=e.label,this.onClick=e.onClick}return e.prototype.render=function(){var e=document.createElement("button");return e.textContent=this.label,e.className="button",this.onClick&&e.addEventListener("click",this.onClick.bind(this)),e},e}();var o=[{title:"Main",iconName:"Home.svg"},{title:"Textbook",iconName:"Square.svg"},{title:"Minigames",iconName:"games-icon.svg"},{title:"Statistics",iconName:"Chart.svg"}];const r=function(){function e(){}return e.prototype.closeMenu=function(){document.querySelector(".nav__close-wrap").classList.add("none"),document.querySelector(".nav__burger-wrap").classList.remove("none"),document.querySelectorAll(".menu__text").forEach((function(e){e.classList.add("none")})),document.querySelector(".nav").classList.remove("open"),document.querySelector(".nav__logout-wrap").classList.remove("none"),document.querySelector(".nav__logout").classList.add("none")},e.prototype.openMenu=function(){document.querySelector(".nav__close-wrap").classList.remove("none"),document.querySelector(".nav__burger-wrap").classList.add("none"),document.querySelectorAll(".menu__text").forEach((function(e){e.classList.remove("none")})),document.querySelector(".nav").classList.add("open"),document.querySelector(".nav__logout-wrap").classList.add("none"),document.querySelector(".nav__logout").classList.remove("none")},e.prototype.createCloseIcon=function(){var e=this,t=document.createElement("div");t.className="nav__close-wrap none";var n=document.createElement("img");return n.className="nav__close-img",n.src="src/assets/images/close.svg",t.append(n),t.addEventListener("click",(function(){return e.closeMenu()})),t},e.prototype.createBurgerIcon=function(){var e=this,t=document.createElement("div");t.className="nav__burger-wrap";var n=document.createElement("img");return n.className="nav__burger",n.src="src/assets/images/menu.svg",t.append(n),t.addEventListener("click",(function(){return e.openMenu()})),t},e.prototype.createIcon=function(e){var t=document.createElement("div");t.className="menu__icon-wrap";var n=document.createElement("img");return n.className="menu__img",n.src="src/assets/images/".concat(e),t.append(n),t},e.prototype.createLink=function(e){var t=e.iconName,n=e.title,o=document.createElement("li");o.className="menu__item";var r=document.createElement("a");r.className="menu__link";var a=document.createElement("span");return a.className="menu__text none",a.textContent=n,r.href="#".concat(n.toLowerCase()),r.append(this.createIcon(t),a),o.append(r),o},e.prototype.createLogoutBtn=function(){var e=new n({label:"Log out",onClick:function(){console.log("logout")}}).render();return e.className="nav__logout button none",e},e.prototype.createLogoutIcon=function(){var e=document.createElement("div");e.className="nav__logout-wrap";var t=document.createElement("img");return t.className="nav__logout-img",t.src="src/assets/images/logout.svg",e.append(t),e.addEventListener("click",(function(){return console.log("logout")})),e},e.prototype.render=function(){var e=this,t=document.createElement("nav");t.className="nav";var n=document.createElement("ul");return n.className="menu",o.forEach((function(t,o){n.append(e.createLink(t))})),t.append(this.createCloseIcon(),this.createBurgerIcon(),n,this.createLogoutBtn(),this.createLogoutIcon()),t},e}(),a=function(){function e(){}return e.prototype.createStartBtn=function(){var e=new n({label:"Let’s start",onClick:function(){location.hash="#textbook"}}).render();return e.classList.add("main__start"),e},e.prototype.createLoginBtn=function(){var e=new n({label:"Log in",onClick:function(){location.hash="#login"}}).render();return e.classList.add("main__login"),e},e.prototype.createTitle=function(){var e=document.createElement("h1");return e.textContent="RS Lang",e},e.prototype.createMainText=function(){var e=document.createElement("p");return e.className="main__subtitle",e.textContent="Memorizing English words can be fun and challenging. Play games, listen to pronunciation, improve your knowledge. With our app, learning is a joy.",e},e.prototype.createMainBackground=function(){var e=document.createElement("img");return e.className="main__img",e.src="src/assets/images/main.svg",e},e.prototype.createMainContent=function(){var e=document.createElement("div");return e.className="main__wrap",e.append(this.createTitle(),this.createMainText(),this.createStartBtn()),e},e.prototype.render=function(){var e=document.createElement("div");return e.className="main",e.append(this.createMainContent(),this.createMainBackground(),this.createLoginBtn()),e},e}(),c=function(){function e(){}return e.prototype.createTitle=function(){var e=document.createElement("h1");return e.textContent="Textbook",e},e.prototype.createDictionary=function(){var e=document.createElement("h2");return e.textContent="Vocabulary difficulty level",e},e.prototype.createGamesList=function(){var e=document.createElement("h2");return e.textContent="Games",e},e.prototype.render=function(){var e=document.createElement("div");return e.className="textbook",e.append(this.createTitle(),this.createDictionary(),this.createGamesList()),e},e}(),i=function(){function e(e,t){this.controller=e,this.root=t,this.appPage=null,this.nav=null,this.content=null,this.createRoot(t)}return e.prototype.changePage=function(e){switch(e.slice(1)){case"main":this.appPage=(new a).render();break;case"textbook":this.appPage=(new c).render()}this.content.innerHTML="",this.content.append(this.appPage),this.updateLink(e)},e.prototype.createRoot=function(e){var t=document.createElement("div");t.className="wrapper";var n=(new r).render();this.nav=n;var o=document.createElement("div");o.className="content",this.content=o,t.append(n,o),e.append(t)},e.prototype.updateLink=function(e){document.querySelectorAll(".menu__link").forEach((function(t){e===t.getAttribute("href")?t.classList.add("active"):t.classList.remove("active")}))},e}(),s=function(){function e(e){var n=this;this.root=e,this.model=new t(this),this.view=new i(this,this.root),window.addEventListener("hashchange",(function(){return n.changePage(location.hash)})),this.checkPage()}return e.prototype.checkPage=function(){var e;location.hash?this.changePage(location.hash):(e="main",window.location.hash=e)},e.prototype.changePage=function(e){this.view.changePage(e)},e.prototype.getStore=function(){return this.model.getStore()},e.prototype.setStore=function(e){this.model.setStore(e)},e}();new s(document.querySelector(".root"))})();