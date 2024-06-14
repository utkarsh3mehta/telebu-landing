var API_URL = "https://telebusocial-api.enpointe.io";
// var API_URL = "http://localhost:3000";
$("#modalGetStarted").on("hidden.bs.modal", function() {
    var errorDiv = document.getElementById("get_started_error");
    errorDiv.innerHTML = "";
});
$("#modalOtp").on("hidden.bs.modal", function() {
    var errorDiv = document.getElementById("otp_modal_error");
    errorDiv.innerHTML = "";
});
$(document).ready(function() {
    var timerElement = document.getElementById("resend_timer");
    if (timerElement) timerElement.style.visibility = "hidden";

    let getStartedModal = $("#modalGetStarted")[0];
    // var submitButton;
    let submitButton = getStartedModal.querySelector(
        "[id='getStartedSubmitButton']"
    );
    var otpModal = new bootstrap.Modal(document.getElementById("modalOtp"));
    var getStarted = new bootstrap.Modal(
        document.getElementById("modalGetStarted")
    );
    var errorDiv = document.getElementById("get_started_error");
    var getStartedModalInstance = bootstrap.Modal.getInstance(getStartedModal);
    if (submitButton)
        submitButton.addEventListener("click", async function() {
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
            console.log({
                email,
                name,
                number,
                country,
                city,
                demo,
            });
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

                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                getStarted.hide();

                                console.log("email sent");
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
                                submitFormButton.disabled = false;
                                submitFormButton.innerHTML = "Next";
                            } else {
                                // alert("Email already Registered!!");
                                errorDiv.innerText = "Email already registered!!";
                                submitFormButton.disabled = false;
                                getStartedModal.querySelector(
                                    "[placeholder='Your Name']"
                                ).value = "";
                                getStartedModal.querySelector(
                                    "[placeholder='Your Email']"
                                ).value = "";
                                let numbers = getStartedModal.querySelectorAll(
                                    "[placeholder='+00']"
                                );
                                numbers[0].value = "";
                                numbers[1].value = "";
                                getStartedModal.querySelector("[placeholder='City']").value =
                                    "";
                                getStartedModal.querySelector("#switch").checked = false;
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
                let getStartedModal = $("#modalGetStarted")[0];
                document.getElementById("user_name").innerText = "";
                document.getElementById("user_email").innerText = "";

                let username = getStartedModal.querySelector(
                    "[placeholder='Your Name']"
                ).value;

                var email = document.querySelector("[placeholder='Your Email']").value;
                console.log(email, username);
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

    $(document).ready(function() {
        let otpSubmitButton = document.getElementById("otpSubmitButton");

        var successModal = new bootstrap.Modal(
            document.getElementById("modalSuccess")
        );
        otpSubmitButton.addEventListener("click", function() {
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
            let name = getStartedModal.querySelector("[placeholder='Your Name']");
            let _email = getStartedModal.querySelector("[placeholder='Your Email']");
            let numbers = getStartedModal.querySelectorAll("[placeholder='+00']");
            let country = numbers[0];
            let number = numbers[1];
            let city = getStartedModal.querySelector("[placeholder='City']");
            var xhr = new XMLHttpRequest();

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        otpModal.hide();
                        otpSubmitButton.disabled = false;
                        otpSubmitButton.innerHTML = "Next";
                        successModal.show();
                        getStartedModal.querySelector("[placeholder='Your Name']").value =
                            "";
                        getStartedModal.querySelector("[placeholder='Your Email']").value =
                            "";
                        let numbers = getStartedModal.querySelectorAll(
                            "[placeholder='+00']"
                        );
                        numbers[0].value = "";
                        numbers[1].value = "";
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
                        getStartedModal.querySelector("[placeholder='Your Email']").value =
                            "";
                        let numbers = getStartedModal.querySelectorAll(
                            "[placeholder='+00']"
                        );
                        numbers[0].value = "";
                        numbers[1].value = "";
                        getStartedModal.querySelector("[placeholder='City']").value = "";
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
    $(document).ready(function() {
        let subsSubmitButton = document.getElementById("subs_btn");

        subsSubmitButton.addEventListener("click", function() {
            var _email = document.querySelectorAll("#subs_email");

            var url = API_URL + "/subscribe";

            subsSubmitButton.disabled = true;
            subsSubmitButton.textContent = "Subscribing...";

            var xhr = new XMLHttpRequest();

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            var email = _email[0].value;
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        alert("Subscribed Successfully");
                        subsSubmitButton.disabled = false;
                        subsSubmitButton.textContent = "Subscribe";
                    } else {
                        alert("Error in Subscribing");
                    }
                }
            };
            // console.log(email[0].value);
            xhr.send(
                JSON.stringify({
                    email,
                })
            );
        });
    });
    $(document).ready(function() {
        let resendButton = document.getElementById("resend_otp");

        resendButton.addEventListener("click", function() {
            var email = localStorage.getItem("email");

            var url = API_URL + "/resend-otp";

            var timerElement = document.getElementById("resend_timer");
            var resendOtpButton = document.getElementById("resend_otp");
            let time = 0;
            var xhr = new XMLHttpRequest();

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.onreadystatechange = function() {
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
    $(document).ready(function() {
        const checkboxes = document.querySelectorAll('#intrest_div input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                let interests = JSON.parse(localStorage.getItem('interest')) || [];

                if (checkbox.checked) {
                    if (!interests.includes(checkbox.value)) {
                        interests.push(checkbox.value);
                    }
                } else {
                    interests = interests.filter(interest => interest !== checkbox.value);
                }

                localStorage.setItem('interest', JSON.stringify(interests));
            });
        });
    });

    //Schedule Demo
    $(document).ready(function() {
        let scheduleDemo = $(".schedule-demo-form")[0];
        if (scheduleDemo) {
            let submitBtn = scheduleDemo.querySelector("#submit_button");

            if (submitBtn) {
                submitBtn.addEventListener("click", function() {
                    var isValid = true;
                    let name = scheduleDemo.querySelector("#name").value;
                    let email = scheduleDemo.querySelector("#email").value;
                    console.log(name, email);
                    if (email.trim() === "") {
                        document.getElementById("email_error").innerText =
                            "Email is required.";
                        isValid = false;
                    }
                    let interest = JSON.parse(localStorage.getItem('interest')) || [];
                    let number = scheduleDemo.querySelector("#number").value;
                    let query = scheduleDemo.querySelector("#query").value;
                    let city = scheduleDemo.querySelector("#city").value;
                    let country = scheduleDemo.querySelector("#country").value;

                    var xhr = new XMLHttpRequest();
                    var url = API_URL + "/schedule-demo";
                    xhr.open("POST", url, true);
                    xhr.setRequestHeader("Content-Type", "application/json");
                    if (isValid) {
                        submitBtn.disabled = true;
                        submitBtn.textContent = "Scheduling...";
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    // alert("Demo requested");
                                    var errorDiv = document.getElementById("otp_modal_error");
                                    errorDiv.innerText = "Demo requested";
                                    errorDiv.style.color = "green";
                                    let name = (scheduleDemo.querySelector("#name").value = "");
                                    let email = (scheduleDemo.querySelector("#email").value = "");
                                    let number = (scheduleDemo.querySelector("#number").value =
                                        "");
                                    let query = (scheduleDemo.querySelector("#query").value = "");
                                    let city = (scheduleDemo.querySelector("#city").value = "");
                                    let country = (scheduleDemo.querySelector("#country").value =
                                        "");
                                    submitBtn.disabled = false;
                                    submitBtn.textContent = "Next";
                                    var errorDiv = document.getElementById("schedule_error");
                                    errorDiv.innerText = "";
                                } else {
                                    // alert("Unable to schedule demo");
                                    var errorDiv = document.getElementById("schedule_error");
                                    errorDiv.innerText = "Unable to schedule demo";
                                    let name = (scheduleDemo.querySelector("#name").value = "");
                                    let email = (scheduleDemo.querySelector("#email").value = "");
                                    let number = (scheduleDemo.querySelector("#number").value =
                                        "");
                                    let query = (scheduleDemo.querySelector("#query").value = "");
                                    let city = (scheduleDemo.querySelector("#city").value = "");
                                    let country = (scheduleDemo.querySelector("#country").value =
                                        "");
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
                                country,
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

    tabItem.each(function() {
        $(this).on("click", function() {
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
    accordionItem.each(function() {
        $(this)
            .find(".accordion-title")
            .on("click", function() {
                $(this).parent().siblings().removeClass("active");
                $(this).parent().siblings().find(".accordion-data").slideUp();
                $(this).parent().toggleClass("active");
                $(this).parent().find(".accordion-data").slideToggle();
            });
    });

    let accordionItem2 = $(".custom-accordion-2 .item");
    // accordionItem2.first().addClass('active');
    // accordionItem2.first().find(".accordion-data").slideDown();
    accordionItem2.each(function() {
        $(this)
            .find(".accordion-title")
            .on("click", function() {
                $(this).parent().siblings().removeClass("active");
                $(this).parent().siblings().find(".accordion-data").slideUp();
                $(this).parent().toggleClass("active");
                $(this).parent().find(".accordion-data").slideToggle();
            });
    });

    /// Accordion End

    /// Mobile Menu Start

    $("header .logo .mob-menu-btn").click(function() {
        $("header nav").slideToggle();
        $(this).toggleClass("active");

        $("header nav ul li").removeClass("active");
        $("header nav ul li .fa-solid").removeClass("active");
        $("header nav ul li .dropdown").slideUp();
    });

    /// Mobile Menu End

    /// Currency Dropdown Start

    $(".currency-dropdown-main .selected-currency").on("click", function() {
        $(this).parent().find(".currency-dropdown").slideToggle();
        $(this).toggleClass("active");
    });

    $(".currency-dropdown-main .currency-dropdown .item").on(
        "click",
        function() {
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
            typingDone: function(otp) {
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
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            otpModal.hide();

                            otpSubmitButton.disabled = false;
                            getStartedModal.querySelector("[placeholder='Your Name']").value =
                                "";
                            getStartedModal.querySelector(
                                "[placeholder='Your Email']"
                            ).value = "";
                            let numbers = getStartedModal.querySelectorAll(
                                "[placeholder='+00']"
                            );
                            numbers[0].value = "";
                            numbers[1].value = "";
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
                            getStartedModal.querySelector(
                                "[placeholder='Your Email']"
                            ).value = "";
                            let numbers = getStartedModal.querySelectorAll(
                                "[placeholder='+00']"
                            );
                            numbers[0].value = "";
                            numbers[1].value = "";
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

    $("header nav ul li .fa-solid").on("click", function() {
        $(this).parent().siblings().find(".fa-solid").removeClass("active");
        $(this).parent().siblings().removeClass("active");
        $(this).parent().siblings().find(".dropdown").slideUp();

        $(this).toggleClass("active");
        $(this).parent().toggleClass("active");
        $(this).parent().find(".dropdown").slideToggle();
    });
});