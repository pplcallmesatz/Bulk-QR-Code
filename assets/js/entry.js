$("document").ready(function(){



$("#manualMode-btn").click(function(){
   // var state=document.readyState;
   // console.log(state)

    $('html, body').animate({
        scrollTop: $("#manualMode").offset().top
    }, 1000);

})
    $("#json-btn").click(function () {
        $('html, body').animate({
            scrollTop: $("#json").offset().top
        },1000);
    })
})
