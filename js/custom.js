var API_URL = "https://telebusocial-api.enpointe.io";
// var API_URL = "http://localhost:3000";

$("#modalGetStarted").on("hidden.bs.modal", function () {
  var errorDiv = document.getElementById("get_started_error");
  errorDiv.innerHTML = "";
});
$("#modalOtp").on("hidden.bs.modal", function () {
  var errorDiv = document.getElementById("otp_modal_error");
  errorDiv.innerHTML = "";
});
$(document).ready(function () {
  var timerElement = document.getElementById("resend_timer");
  if (timerElement) timerElement.style.visibility = "hidden";

  let getStartedModal = $("#modalGetStarted")[0];
  // var submitButton;
  let submitButton = document.getElementById("getStartedSubmitButton");
  var otpModal = new bootstrap.Modal(document.getElementById("modalOtp"));
  var getStarted = new bootstrap.Modal(
    document.getElementById("modalGetStarted")
  );
  var errorDiv = document.getElementById("get_started_error");
  var getStartedModalInstance = bootstrap.Modal.getInstance(getStartedModal);
  if (submitButton)
    submitButton.addEventListener("click", async function () {
      let name = getStartedModal.querySelector(
        "[placeholder='Your Name']"
      ).value;
      let email = getStartedModal.querySelector("#business-email").value;
      let interest = localStorage.getItem("interest");
      // console.log(interest);
      let numbers = getStartedModal.querySelectorAll("#mobile-number");
      let countryCodeName = getStartedModal.querySelector("#country-code");
      let number = numbers[0].value;
      let country = countryCodeName.dataset.countryName;
      //let city = getStartedModal.querySelector("[placeholder='City']").value;
      let demo = getStartedModal.querySelector("#switch").checked;
      // console.log("demo" + demo)
      var xhr = new XMLHttpRequest();
      // var resendOtpButton = document.getElementById("resend_otp");
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
      var url = API_URL + "/get-started";
      const isValidate = validateForm();
      // let timer = 30;
      if (isValidate) {
        try {
          submitButton.disabled = true;
          submitButton.innerHTML = "Loading...";
          localStorage.setItem("email", email);
          xhr.open("POST", url, true);
          xhr.setRequestHeader("Content-Type", "application/json");

          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                getStarted.hide();

                // console.log("email sent");
                otpModal.show();
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
                submitButton.disabled = false;
                submitButton.innerHTML = "Next";
              } else {
                // alert("Email already Registered!!");
                errorDiv.innerText = "Email already registered!!";
                submitButton.disabled = false;
                getStartedModal.querySelector(
                  "[placeholder='Your Name']"
                ).value = "";
                getStartedModal.querySelector("#business-email").value = "";
                let numbers =
                  getStartedModal.querySelectorAll("#mobile-number");
                numbers[0].value = "";
                // console.log(numbers)
                //numbers[1].value = "";
                //getStartedModal.querySelector("[placeholder='City']").value =
                // "";
                getStartedModal.querySelector("#switch").checked = false;
                submitButton.innerHTML = "Next";
              }
            }
          };
          xhr.send(
            JSON.stringify({
              email,
              name,
              number,
              country,
              //city,
              demo,
              interest,
            })
          );
        } catch (error) {
          console.log(error);
        }
      }

      function validateForm() {
        let getStartedModal = $("#modalGetStarted")[0];
        document.getElementById("user_name").innerText = "";
        document.getElementById("user_email").innerText = "";

        let username = getStartedModal.querySelector(
          "[placeholder='Your Name']"
        ).value;

        var email = document.querySelector("#business-email").value;
        // console.log(email, username);
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

    var successModal = new bootstrap.Modal(
      document.getElementById("modalSuccess")
    );
    otpSubmitButton.addEventListener("click", function () {
      var otpInputs = document.querySelectorAll("#otp-inputs input");
      var otp = "";
      otpInputs.forEach((input) => (otp += input.value));

      var email = localStorage.getItem("email");
      var getStartedModal = $("#modalGetStarted")[0];
      if (otp.length !== 6) {
        alert("Please enter a 6-digit OTP.");
        return;
      }
      var url = API_URL + "/validate-otp";
      var otpModal = new bootstrap.Modal(document.getElementById("modalOtp"));
      otpSubmitButton.disabled = true;
      otpSubmitButton.textContent = "Verifying...";
      //let city = getStartedModal.querySelector("[placeholder='City']");
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
            getStartedModal.querySelector("[placeholder='Your Name']").value =
              "";
            getStartedModal.querySelector("#business-email").value = "";
            let numbers = getStartedModal.querySelectorAll("#mobile-number");
            numbers[0].value = "";
            //numbers[1].value = "";
            getStartedModal.querySelector("[placeholder='City']").value = "";
            getStartedModal.querySelector("#switch").checked = false;
          } else {
            // alert("Invalid OTP. Please try again.");
            var errorDiv = document.getElementById("otp_modal_error");
            errorDiv.innerText = "Invalid OTP. Please try again.";
            otpSubmitButton.disabled = false;
            otpSubmitButton.innerHTML = "Next";
            getStartedModal.querySelector("[placeholder='Your Name']").value =
              "";
            getStartedModal.querySelector("#business-email").value = "";
            let numbers = getStartedModal.querySelectorAll("#mobile-number");
            numbers[0].value = "";
            //numbers[1].value = "";
            //getStartedModal.querySelector("[placeholder='City']").value = "";
            getStartedModal.querySelector("#switch").checked = false;
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
    let parentDiv = subsSubmitButton.parentNode;
    let resultSpan = document.createElement("span");

    subsSubmitButton.addEventListener("click", function () {
      var _email = document.querySelectorAll("#subs_email");
      var email = _email[0].value;
      var subIsValid = true;
      var errorMessage = "";
      if (email.trim() === "") {
        errorMessage = "Email is required";

        subIsValid = false;
      } else if (!validateEmail(email)) {
        errorMessage = "Invalid email format.";
        subIsValid = false;
      }
      if (subIsValid == false) {
        resultSpan.innerHTML = errorMessage;
        resultSpan.style.color = "red";
        resultSpan.style.marginTop = "20px";
        resultSpan.style.display = "inline-block";
        parentDiv.insertBefore(resultSpan, subsSubmitButton);
      }
      var url = API_URL + "/subscribe";
      if (subIsValid) {
        subsSubmitButton.disabled = true;
        subsSubmitButton.textContent = "Subscribing...";

        var xhr = new XMLHttpRequest();

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              // alert("Subscribed Successfully");
              resultSpan.style.color = "green";
              resultSpan.style.marginTop = "20px";
              resultSpan.style.display = "inline-block";
              resultSpan.innerHTML = "Subscribed successfully";
              subsSubmitButton.disabled = false;
              subsSubmitButton.textContent = "Subscribe";
            } else {
              resultSpan.style.color = "red";
              resultSpan.style.marginTop = "20px";
              resultSpan.style.display = "inline-block";
              resultSpan.innerHTML = "Error subscribing. Retry later.";
            }
            parentDiv.insertBefore(resultSpan, subsSubmitButton);
          }
        };
        // console.log(email[0].value);
        xhr.send(
          JSON.stringify({
            email,
          })
        );
      }
      function validateEmail(email) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
      }
    });
  });

  //  Faq form submit

  $(document).ready(function () {
    let QueryForm = document.getElementById("query-submit");
    let QueryMessage = document.getElementById("query-message");
    let errorMessage = document.getElementById("errormessage");

    QueryForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var message = QueryMessage.value.trim();
      if (message === "") {
        errorMessage.innerHTML = "Message is required";
        errorMessage.style.color = "red";
        return;
      }
      sendEmail(message);
    });

    function sendEmail(message) {
      var url = API_URL + "/raise-query";
      var xhr = new XMLHttpRequest();

      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            errorMessage.innerHTML = "Message is successfully send";
            errorMessage.style.color = "white";
          } else {
            errorMessage.innerHTML = "Error sending your query";
            errorMessage.style.color = "red";
          }
        }
      };
      // console.log(email[0].value);
      xhr.send(
        JSON.stringify({
          query: message,
        })
      );
    }
  });

  $(document).ready(function () {
    let resendButton = document.getElementById("resend_otp");

    resendButton.addEventListener("click", function () {
      var email = localStorage.getItem("email");

      var url = API_URL + "/resend-otp";

      // var timerElement = document.getElementById("resend_timer");
      // var resendOtpButton = document.getElementById("resend_otp");
      // let time = 0;
      var xhr = new XMLHttpRequest();

      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
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
  $(document).ready(function () {
    const checkboxes = document.querySelectorAll(
      '#intrest_div input[type="checkbox"]'
    );

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        let interests = JSON.parse(localStorage.getItem("interest")) || [];

        if (checkbox.checked) {
          if (!interests.includes(checkbox.value)) {
            interests.push(checkbox.value);
          }
        } else {
          interests = interests.filter(
            (interest) => interest !== checkbox.value
          );
        }

        localStorage.setItem("interest", JSON.stringify(interests));
      });
    });
  });

  //Schedule Demo
  $(document).ready(function () {
    let scheduleDemo = $(".schedule-demo-form")[0];
    if (scheduleDemo) {
      let submitBtn = scheduleDemo.querySelector("#submit_button");

      if (submitBtn) {
        submitBtn.addEventListener("click", function () {
          var isValid = true;
          let name = scheduleDemo.querySelector("#name").value;
          let email = scheduleDemo.querySelector("#email").value;
          // console.log(name, email);
          if (email.trim() === "") {
            document.getElementById("email_error").innerText =
              "Email is required.";
            isValid = false;
          }
          let interest = localStorage.getItem("interest");
          let number = scheduleDemo.querySelector("#schedulefrom-number").value;
          let query = scheduleDemo.querySelector("#query").value;
          let city = scheduleDemo.querySelector("#city").value;
          let countryschedule = scheduleDemo.querySelector(
            "#schedulefrom-country"
          );
          let countryschedulecode = countryschedule.dataset.countryName;
          var xhr = new XMLHttpRequest();
          var url = API_URL + "/schedule-demo";
          xhr.open("POST", url, true);
          xhr.setRequestHeader("Content-Type", "application/json");
          if (isValid) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Scheduling...";
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  // alert("Demo requested");
                  var errorDiv = document.getElementById("otp_modal_error");
                  errorDiv.innerText = "Demo requested";
                  errorDiv.style.color = "green";
                  scheduleDemo.querySelector("#name").value = "";
                  scheduleDemo.querySelector("#email").value = "";
                  scheduleDemo.querySelector("#schedulefrom-number").value = "";
                  scheduleDemo.querySelector("#query").value = "";
                  scheduleDemo.querySelector("#city").value = "";
                  // let countryschedulecode = scheduleDemo.querySelector("#schedulefrom-country")
                  submitBtn.disabled = false;
                  submitBtn.textContent = "Next";
                  var errorDiv = document.getElementById("schedule_error");
                  // errorDiv.innerText = "";
                } else {
                  // alert("Unable to schedule demo");
                  var errorDiv = document.getElementById("schedule_error");
                  errorDiv.innerText = "Unable to schedule demo";
                  scheduleDemo.querySelector("#name").value = "";
                  scheduleDemo.querySelector("#email").value = "";
                  scheduleDemo.querySelector("#schedulefrom-number").value = "";
                  scheduleDemo.querySelector("#query").value = "";
                  scheduleDemo.querySelector("#city").value = "";
                  // let countryschedulecode = scheduleDemo.querySelector("#schedulefrom-country");
                  submitBtn.disabled = false;
                  submitBtn.textContent = "Next";
                }
              }
            };
            xhr.send(
              JSON.stringify({
                name,
                email,
                number,
                city,
                query,
                interest,
                country: countryschedulecode,
              })
            );
          }
        });
      }
    }
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
        var getStartedModal = $("#modalGetStarted")[0];
        console.log("Entered OTP code: " + otp);
        otpSubmitButton.disabled = true;
        otpSubmitButton.textContent = "Verifying...";
        var email = localStorage.getItem("email");
        var xhr = new XMLHttpRequest();
        var successModal = new bootstrap.Modal(
          document.getElementById("modalSuccess")
        );
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              otpModal.hide();

              otpSubmitButton.disabled = false;
              getStartedModal.querySelector("[placeholder='Your Name']").value =
                "";
              getStartedModal.querySelector("#business-email").value = "";
              let numbers = getStartedModal.querySelectorAll("#mobile-number");
              numbers[0].value = "";
              //numbers[1].value = "";
              otpSubmitButton.innerHTML = "Next";
              successModal.show();
            } else {
              // otpModal.hide();
              // alert("Invalid OTP. Please try again.");

              var errorDiv = document.getElementById("otp_modal_error");
              errorDiv.innerText = "Invalid OTP. Please try again.";
              errorDiv.style.color = "red";
              getStartedModal.querySelector("[placeholder='Your Name']").value =
                "";
              getStartedModal.querySelector("#business-email").value = "";
              let numbers = getStartedModal.querySelectorAll("#mobile-number");
              numbers[0].value = "";
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
// add sticky header function start
var headerHeight = $("header").innerHeight();
$(window).scroll(function () {
  if ($(this).scrollTop() > headerHeight) {
    $("header").addClass("sticky");
  } else {
    $("header").removeClass("sticky");
  }
});
// add sticky header function end

// country code function
document.addEventListener("DOMContentLoaded", function () {
  var phoneInputGroups = document.querySelectorAll(".phone-input-group");
  phoneInputGroups.forEach(function (group) {
    var phoneNumberInput = group.querySelector(".mobile-number");
    var countryCodeInput = group.querySelector(".country-code");

    var iti = window.intlTelInput(countryCodeInput, {
      initialCountry: "in",
      separateDialCode: false,
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      flagSize: 80,
    });
    var countryData = iti.getSelectedCountryData();
    var countryName = countryData.name;
    countryCodeInput.setAttribute("data-country-name", countryName);

    function getCountryName() {
      var countryData = iti.getSelectedCountryData();
      var countryName = countryData.name;
      countryCodeInput.setAttribute("data-country-name", countryName);
    }

    countryCodeInput.addEventListener("countrychange", function () {
      getCountryName();
    });
    countryCodeInput.setAttribute("placeholder", "");

    var initialDialCode = iti.getSelectedCountryData().dialCode;
    phoneNumberInput.value = "+" + initialDialCode;

    countryCodeInput.addEventListener("countrychange", function () {
      var dialCode = iti.getSelectedCountryData().dialCode;
      phoneNumberInput.value = "+" + dialCode;
      countryCodeInput.setAttribute("placeholder", "");
    });

    phoneNumberInput.addEventListener("input", function () {
      var dialCode = iti.getSelectedCountryData().dialCode;
      countryCodeInput.value = "+" + dialCode;
    });
  });
  const pricingCountryCode = document.querySelector("#pricing-form-number");
  if (pricingCountryCode) {
    window.intlTelInput(pricingCountryCode, {
      initialCountry: "in",
      separateDialCode: true,
      formatOnDisplay: true,
      nationalMode: false,
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      nationalMode: false,
    });
  }
});
// Remove html from url
document.addEventListener("DOMContentLoaded", function () {
  const url = window.location.pathname;
  if (url.endsWith(".html")) {
    const newUrl = url.replace(".html", "");
    window.history.replaceState({}, "", newUrl);
  }
});
// home page slider
$(".slider-for").slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
  autoplay: true,
  autoplaySpeed: 2000,
  asNavFor: ".slider-nav",
});
$(".slider-nav").slick({
  slidesToShow: 8,
  infinite: false,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: false,
  asNavFor: ".slider-for",
  dots: false,
  focusOnSelect: true,
  responsive: [
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 5,
        autoplaySpeed: 3000,
      },
    },
    {
      breakpoint: 767,
      settings: {
        infinite: true,
        slidesToShow: 3,
        autoplaySpeed: 3500,
      },
    },
  ],
});
// home page slider end

//pricing page scroll to from and from select option

$(".custom-pricing-tab").click(function (event) {
  $("html, body").animate(
    {
      scrollTop: $(".custom-pricing-section").offset().top - 180,
    },
    1000
  ); // Adjust the duration as needed
});
$(".pricing-select").on("change", function () {
  if ($(this).val() != "") {
    $(".other-query").slideDown();
  } else {
    $(".other-query").slideUp();
  }
  // if ($(this).val() === 'other') {
  //   console.log('test')
  //     $('.other-query').removeClass('d-none');
  // }
});
