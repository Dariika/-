let current_user = null;

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
        login($('#reg-form')
                .find("input[name=username], input[name=password]").serialize(),
                () => tryFetchCurrentUser(onUserLoad));
        $("#overlay").hide();
    }, function(data){
        console.log("register failed!");
        console.log(data);
    });
});

$("#login-submit-btn").click(function () {
    login($('#login-form').serialize(), function (data) {
        console.log(data);
        tryFetchCurrentUser(onUserLoad);
        $("#overlay").hide();
    }, function(data){
        console.log("login failed");
        console.log(data);
    });
});