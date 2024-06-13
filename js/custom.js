// var API_URL = "https://telebusocial-api.enpointe.io";
var API_URL = "http://localhost:3000";

$(document).ready(function () {
  let getStartedModal = $("#modalGetStarted")[0];
  // var submitButton;
  let submitButton = getStartedModal.querySelector(
    "[id='getStartedSubmitButton']"
  );
  var otpModal = new bootstrap.Modal(document.getElementById("modalOtp"));
  var getStarted = new bootstrap.Modal(
    document.getElementById("modalGetStarted")
  );
  var getStartedModalInstance = bootstrap.Modal.getInstance(getStartedModal);
  if (submitButton)
    submitButton.addEventListener("click", async function () {
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
      let submitFormButton = document.getElementById("getStartedSubmitButton");
      var xhr = new XMLHttpRequest();
      var resendOtpButton = document.getElementById("resend_otp");
      // Need to comment this
      // otpModal.show();
      // var interval = setInterval(function () {
      //   resendOtpButton.style.pointerEvents = "none";
      //   resendOtpButton.style.color = "gray";
      //   var minutes = parseInt(timer / 60, 10);
      //   var seconds = parseInt(timer % 60, 10);

      //   minutes = minutes < 10 ? "0" + minutes : minutes;
      //   seconds = seconds < 10 ? "0" + seconds : seconds;

      //   timerElement.textContent = minutes + ":" + seconds;
      //   resend_otp.disabled = false;
      //   if (--timer < 0) {
      //     clearInterval(interval);
      //     resendOtpButton.style.pointerEvents = "auto";
      //     resendOtpButton.style.color = "blue";
      //     timerElement.textContent = "00:00"; // set to zero
      //   }
      // }, 1000);
      // till here
      var timerElement = document.getElementById("resend_timer");
      var resendOTPbutton = document.getElementById("resend_otp");
      var url = API_URL + "/get-started";
      const isValidate = validateForm();
      let timer = 30;
      if (isValidate) {
        try {
          submitFormButton.disabled = true;
          submitFormButton.innerHTML = "Loading...";
          localStorage.setItem("email", email);
          xhr.open("POST", url, true);
          xhr.setRequestHeader("Content-Type", "application/json");

          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                console.log("email sent");
                getStarted.hide();
                otpModal.show();
                var interval = setInterval(function () {
                  resendOtpButton.style.pointerEvents = "none";
                  resendOtpButton.style.color = "gray";
                  var minutes = parseInt(timer / 60, 10);
                  var seconds = parseInt(timer % 60, 10);

                  minutes = minutes < 10 ? "0" + minutes : minutes;
                  seconds = seconds < 10 ? "0" + seconds : seconds;

                  timerElement.textContent = minutes + ":" + seconds;
                  resend_otp.disabled = false;
                  if (--timer < 0) {
                    clearInterval(interval);
                    resendOtpButton.style.pointerEvents = "auto";
                    resendOtpButton.style.color = "blue";
                    timerElement.textContent = "00:00"; // set to zero
                  }
                }, 1000);
                submitFormButton.disabled = false;
                submitFormButton.innerHTML = "Next";
              } else {
                alert("Unable to send details to server");
                submitFormButton.disabled = false;
                submitFormButton.innerHTML = "Next";
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
          console.log("done");
        } catch (error) {
          console.log(error);
        }
      }

      function validateForm() {
        document.getElementById("user_name").innerText = "";
        document.getElementById("user_email").innerText = "";

        var username = document.querySelector(
          "[placeholder='Your Name']"
        ).value;
        var email = document.querySelector("[placeholder='Your Email']").value;

        var isValid = true;

        if (username.trim() === "") {
          document.getElementById("user_name").innerText = "Name is required.";
          isValid = false;
        }

        if (email.trim() === "") {
          document.getElementById("user_email").innerText =
            "Email is required.";
          isValid = false;
        } else if (!validateEmail(email)) {
          document.getElementById("user_email").innerText =
            "Invalid email format.";
          isValid = false;
        }

        return isValid;
      }

      function validateEmail(email) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
      }
    });

  $(document).ready(function () {
    let otpSubmitButton = document.getElementById("otpSubmitButton");
    var otpModal = new bootstrap.Modal(document.getElementById("modalOtp"));
    var successModal = new bootstrap.Modal(
      document.getElementById("modalSuccess")
    );
    otpSubmitButton.addEventListener("click", function () {
      var otpInputs = document.querySelectorAll("#otp-inputs input");
      var otp = "";
      otpInputs.forEach((input) => (otp += input.value));

      var email = localStorage.getItem("email");

      if (otp.length !== 6) {
        alert("Please enter a 6-digit OTP.");
        return;
      }
      var url = API_URL + "/validate-otp";

      otpSubmitButton.disabled = true;
      otpSubmitButton.textContent = "Verifying...";

      var xhr = new XMLHttpRequest();

      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            otpModal.hide();
            otpSubmitButton.disabled = false;
            otpSubmitButton.innerHTML = "Next";
            successModal.show();
          } else {
            alert("Invalid OTP. Please try again.");
            otpSubmitButton.disabled = false;
            otpSubmitButton.innerHTML = "Next";
          }
        }
      };
      xhr.send(
        JSON.stringify({
          email,
          otp,
        })
      );
    });
  });
  $(document).ready(function () {
    let subsSubmitButton = document.getElementById("subs_btn");

    subsSubmitButton.addEventListener("click", function () {
      var email = document.querySelectorAll("#subs_email");

      var url = API_URL + "/subscribe";

      subsSubmitButton.disabled = true;
      subsSubmitButton.textContent = "Subscribing...";

      var xhr = new XMLHttpRequest();

      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            otpModal.hide();
            otpSubmitButton.disabled = false;
            otpSubmitButton.innerHTML = "Next";
            successModal.show();
          } else {
            alert("Invalid OTP. Please try again.");
            otpSubmitButton.disabled = false;
            otpSubmitButton.innerHTML = "Next";
          }
        }
      };
      xhr.send(
        JSON.stringify({
          email,
        })
      );
    });
  });
  $(document).ready(function () {
    let resendButton = document.getElementById("resend_otp");

    resendButton.addEventListener("click", function () {
      var email = localStorage.getItem("email");

      var url = API_URL + "/resend-otp";

      var timerElement = document.getElementById("resend_timer");
      var resendOtpButton = document.getElementById("resend_otp");
      let time = 0;
      var xhr = new XMLHttpRequest();

      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var interval = setInterval(function () {
              resendOtpButton.style.pointerEvents = "none";
              resendOtpButton.style.color = "gray";
              var minutes = parseInt(timer / 60, 10);
              var seconds = parseInt(timer % 60, 10);

              minutes = minutes < 10 ? "0" + minutes : minutes;
              seconds = seconds < 10 ? "0" + seconds : seconds;

              timerElement.textContent = minutes + ":" + seconds;
              resend_otp.disabled = false;
              if (--timer < 0) {
                clearInterval(interval);
                resendOtpButton.style.pointerEvents = "auto";
                resendOtpButton.style.color = "blue";
                timerElement.textContent = "00:00"; // set to zero
              }
            }, 1000);
          } else {
            alert("Something went wrong!");
          }
        }
      };
      xhr.send(
        JSON.stringify({
          email,
        })
      );
    });
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
      typingDone: function (otp) {
        var url = API_URL + "/validate-otp";
        console.log("Entered OTP code: " + otp);
        otpSubmitButton.disabled = true;
        otpSubmitButton.textContent = "Verifying...";
        var email = localStorage.getItem("email");
        var xhr = new XMLHttpRequest();
        var successModal = new bootstrap.Modal(
          document.getElementById("modalSuccess")
        );
        var otpModal = new bootstrap.Modal(document.getElementById("modalOtp"));
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              otpModal.hide();
              otpSubmitButton.disabled = false;
              otpSubmitButton.innerHTML = "Next";
              successModal.show();
            } else {
              alert("Invalid OTP. Please try again.");
              otpSubmitButton.disabled = false;
              otpSubmitButton.innerHTML = "Next";
            }
          }
        };
        xhr.send(
          JSON.stringify({
            email,
            otp,
          })
        );
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
