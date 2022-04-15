let current_user = null;

// добавляет после каждого поля ввода в форме регистрации
// строчку для вывода ошибок валидации этого поля
$("#reg-form input[type!=button]").each(function(index){
    $("<div>", {
        'class': 'error-message',
        'id': $(this).attr("name") + "-error-msg",
        'style': "display: none;"
    })
      .insertAfter($(this).next());
});

tryFetchCurrentUser(onUserLoad, onLogout);

$("#vixod").click(function(){
    if(user != null){
      logout(onLogout);
    }
});

function onUserLoad(data){
    current_user = data;
    fetchCsrf();
    $("#register-btn").hide();
    $("#vixod").show();
    if(current_user.group == "regular_user"){
        $("#add-pane").hide();
    }
    else{
        $("#add-pane").show();
    }
    $("#current_user_fio").show();
    $("#current_user_fio").text(`Добрый день, ${current_user.fio}`);
}

function onLogout(data){
    current_user = null;
    fetchCsrf();
    $("#register-btn").show();
    $("#vixod").hide();
    $("#add-pane").hide();
    $("#current_user_fio").hide();
}

$("#register-submit-btn").click(function(){
    register($('#reg-form').serialize(), function(data){
        console.log(data);
        $("#reg-form .error-message").hide();
        login($('#reg-form')
                .find("input[name=username], input[name=password]").serialize(),
                () => tryFetchCurrentUser(onUserLoad));
        $("#overlay").hide();
    }, function(data){
        console.log("register failed!");
        console.log(data);
        if(data.responseJSON != undefined){
            for(const [key, value] of Object.entries(data.responseJSON)){
                $(`#${key}-error-msg`).text(value.join("<br>")).show();
            }
        }
    });
});

$("#login-submit-btn").click(function () {
    login($('#login-form').serialize(), function (data) {
        console.log(data);
        $("#login-error").hide();
        tryFetchCurrentUser(onUserLoad);
        $("#overlay").hide();
    }, function(data){
        if(data.responseJSON != undefined){
            let errorMsg = "Ошибка сервера";
            if(data.responseJSON.detail == "Invalid credentials."){
                errorMsg = "Неверный логин или пароль";
            }
            $("#login-error").text(errorMsg).show();
        }
        console.log("login failed");
        console.log(data);
    });
});