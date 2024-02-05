$(document).ready(function () {
    var zip = new JSZip();
    var archiveIndividual='';
    var defaultIncrement=0;
    var count=0;
    var keyName=[];
    var name='';
    $("#downloadAllIndividual").hide();
    $(document).on('keyup change', '.data' ,function(e){
        if($(".data").last().val() !== "" ){
               $(".qr").append(`<div class="qr-box"><div class="qr-form"><input type="text" id="file" class="keyData form-control"  placeholder="your file name"/> <input type="text" class="data form-control" placeholder="contents"/></div><div class="qr-content"><div class="qrcode">
                                    </div></div><div class="qr-action"></div></div>`)
        }
    })
    var count=0;
    $(document).on("change",".keyData",function(){
       name=$(this).val();
       if(name!="")
       {
           keyName.push(name)
       }
        var nname="";
        var newName=function duplicate () {
            var c=0;
            $.each(keyName,function (index,value) {
                if(value===name){
                    c++;
                    if(c>1)
                    {
                        nname=name+"-"+(c-1);
                        keyName.push(nname)
                    }
                    else{
                        nname=name;
                    }
                }
            })
        };
        newName();
        name=nname;
        $(this).parent().find(".keyData").val(name)
    })
    $(document).on("keydown change",'.data',function(e) {
        console.log("keypress")
        if ($(this).val() != "") {
            name=$(this).prev().val();
            if(name=="")
            {
                name="nameDefault"+defaultIncrement++;
            }
            var data = $(this).val();
            var svg = new QRCode(data).svg();
            $(this).parent().next().html(svg);
            $(this).parent().next().find("svg")[0].setAttribute("viewBox", "0 0 256 256");
            ++count;
            if(count>0)
            {
                $("#downloadAllIndividual").show();
            }
            if($(this).find(".qr-content").val()!=""){
                 if($(this).parent().parent().find(".qr-action").is(".checkAvailability")==false || $(this).parent().parent().find(".qr-action").is(".action-invisible")==true) {
                    $(this).parent().parent().find(".qr-action").append('<img src="./assets/img/delete.png" class="delete-icon" alt="delete"><img src="./assets/img/download.png" class="download-icon" alt="download">').addClass("checkAvailability").removeClass("action-invisible")
                 }
            }
        }
        else{
            $(this).parent().next().html("");
            $(this).parent().next().next().addClass("action-invisible").html("")
        }
    })
    $(document).on("click",'.download-icon',function (e) {
        var value=$(this).parent().parent().find(".qr-content").html();
        GenerateFile(name,value)
    })
    $(document).on("click",'.delete-icon',function(e){
        $(this).parent().parent().remove();
        --count;
        if(count==0){
            $("#downloadAllIndividual").hide();
        }
    })
    $(document).on('click','#downloadAllIndividual',function () {
        zip.remove("QRcode-Individual")
        let nameInc=0;
       $(".qr-box").each(function (index,value) {
           let len=$(".qr-box").length;
           if(index>0 && index<len-1 ) {
               var key = $(this).find(".qr-form :first-child").val();
               if(key==""){
                   key="nameDefault"+nameInc;
                   nameInc++;
               }
               var data = $(this).find(".qr-form :first-child").next().val();
                   var svg = new QRCode(data).svg();
                   console.log(key)
                     archiveIndividual = zip.folder("QRcode-Individual");
                   archiveIndividual.file(key+".svg", svg);
           }
        })
        archiveIndividual.generateAsync({type: "blob"})
            .then(function (blob) {
                saveAs(blob, "QRcodeIndivual.zip");
            });
    })
    function GenerateFile(name, svg) {
        var svg = svg;
        var fileName = name+".svg";
        var zip = new JSZip();
        zip.file(name+".svg", svg);
        zip.generateAsync({type:"blob"})
            .then(function(content) {
                saveAs(content, "QRcode.zip");
            });
    }
})