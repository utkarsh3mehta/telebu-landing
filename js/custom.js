var API_URL = "https://telebusocial-api.enpointe.io";

$(document).ready(function () {
  let getStartedModal = $("#modalGetStarted")[0];
  let submitButton = getStartedModal.querySelector(
    "[data-bs-target='#modalSuccess']"
  );
  if (submitButton)
    submitButton.addEventListener("click", function () {
      let name = getStartedModal.querySelector(
        "[placeholder='Your Name']"
      ).value;
      let email = getStartedModal.querySelector(
        "[placeholder='Your Email']"
      ).value;
      let numbers = getStartedModal.querySelectorAll("[placeholder='+00']");
      let country = numbers[0].value;
      let number = numbers[1].value;
      let city = getStartedModal.querySelector("[placeholder='City']").value;
      let demo = getStartedModal.querySelector("#switch").checked;
      var xhr = new XMLHttpRequest();
      var url = API_URL + "/get-started";

      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log("email sent");
          } else {
            alert("Unable to send details to server");
          }
        }
      };
      xhr.send(
        JSON.stringify({
          email,
          name,
          number,
          country,
          city,
          demo,
        })
      );
    });

  $(".testimonial-slider").slick({
    dots: false,
    arrows: true,
    infinite: true,
    speed: 300,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: $(".prev"),
    nextArrow: $(".next"),
  });

  /// Tab Start
  let tabItem = $(".custom-tabs .item");
  let tabDataItem = $(".tab-data-main .tab-data");

  tabItem.first().addClass("active");
  tabDataItem.first().show();

  tabItem.each(function () {
    $(this).on("click", function () {
      getIndex = $(this).index();
      $(this).siblings().removeClass("active");
      $(this).addClass("active");
      tabDataItem.siblings().hide();
      tabDataItem.eq(getIndex).show();
    });
  });

  /// Tab End

  /// Accordion Start

  let accordionItem = $(".custom-accordion .item");
  accordionItem.first().addClass("active");
  accordionItem.first().find(".accordion-data").slideDown();
  accordionItem.each(function () {
    $(this)
      .find(".accordion-title")
      .on("click", function () {
        $(this).parent().siblings().removeClass("active");
        $(this).parent().siblings().find(".accordion-data").slideUp();
        $(this).parent().toggleClass("active");
        $(this).parent().find(".accordion-data").slideToggle();
      });
  });

  let accordionItem2 = $(".custom-accordion-2 .item");
  // accordionItem2.first().addClass('active');
  // accordionItem2.first().find(".accordion-data").slideDown();
  accordionItem2.each(function () {
    $(this)
      .find(".accordion-title")
      .on("click", function () {
        $(this).parent().siblings().removeClass("active");
        $(this).parent().siblings().find(".accordion-data").slideUp();
        $(this).parent().toggleClass("active");
        $(this).parent().find(".accordion-data").slideToggle();
      });
  });

  /// Accordion End

  /// Mobile Menu Start

  $("header .logo .mob-menu-btn").click(function () {
    $("header nav").slideToggle();
    $(this).toggleClass("active");

    $("header nav ul li").removeClass("active");
    $("header nav ul li .fa-solid").removeClass("active");
    $("header nav ul li .dropdown").slideUp();
  });

  /// Mobile Menu End

  /// Currency Dropdown Start

  $(".currency-dropdown-main .selected-currency").on("click", function () {
    $(this).parent().find(".currency-dropdown").slideToggle();
    $(this).toggleClass("active");
  });

  $(".currency-dropdown-main .currency-dropdown .item").on(
    "click",
    function () {
      let getImg = $(this).find("img").attr("src");
      let getText = $(this).find("span").text();

      $("#selectedCurrency").attr("src", getImg);
      $("#selectedCurrencyInput").attr("value", getText);

      $(this).parent().slideUp();
      $(this)
        .parent()
        .parent()
        .find(".selected-currency")
        .removeClass("active");
    }
  );

  /// Currency Dropdown End

  /// OTP Start
  if ($("#otp-inputs").length > 0) {
    $("#otp-inputs").otpdesigner({
      onlyNumbers: true,
      typingDone: function (code) {
        console.log("Entered OTP code: " + code);
      },
    });
  }
  /// OTP End

  $(".marquee").marquee({
    //speed in milliseconds of the marquee
    duration: 15000,
    //gap in pixels between the tickers
    gap: 50,
    //time in milliseconds before the marquee will start animating
    delayBeforeStart: 0,
    //'left' or 'right'
    direction: "left",
    //true or false - should the marquee be duplicated to show an effect of continues flow
    duplicated: true,
  });

  $(".marquee-rev").marquee({
    //speed in milliseconds of the marquee
    duration: 15000,
    //gap in pixels between the tickers
    gap: 50,
    //time in milliseconds before the marquee will start animating
    delayBeforeStart: 0,
    //'left' or 'right'
    direction: "right",
    //true or false - should the marquee be duplicated to show an effect of continues flow
    duplicated: true,
  });

  $("#schedule-demo-datepicker").datepicker({});

  $("header nav ul li").find(".dropdown").parent().addClass("has-dropdown");

  $(".dropdown").siblings("a").addClass("drop-link");

  $("header nav ul li .fa-solid").on("click", function () {
    $(this).parent().siblings().find(".fa-solid").removeClass("active");
    $(this).parent().siblings().removeClass("active");
    $(this).parent().siblings().find(".dropdown").slideUp();

    $(this).toggleClass("active");
    $(this).parent().toggleClass("active");
    $(this).parent().find(".dropdown").slideToggle();
  });
});
