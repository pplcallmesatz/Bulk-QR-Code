$(document).ready(function () {

    var typeOfData='';
    var typeofButton='';
    var zip = new JSZip();
    var archiveURL=[];
    var archiveJSON=[];
    var keyAll=[];
    var url = '';
    var d=jQuery.Deferred();
    $("#generate").click(function () {
        $(".qr-list").html("")
        if($("#qrURL").val()==="")
        {
            swal("Empty content!", "Can't find JSON url", "info");
        }
        else{
            $("#json").append('<div class="loading"><img src="assets/img/loading.gif"></div>')
                typeOfData = "generateURL"
                url = $("#qrURL").val()
                createIndividual(url)
                $("#download-all").hide();
        }
    })
    var content='',
        JSONcontent='';
        $("#generateQR").click(function () {
                $(".qr-container").html("")
            if($("#enterJSON").val()==="")
            {
                swal("Empty content!", "Can't find any filename and its content", "info");
            }
               else
                {
                    $("#generateManual").append('<div class="loading"><img src="assets/img/loading.gif"></div>')
                    // $("#generateManual").append('<div class="loading"><div class="loader"></div></div>')
                    $(".loading").animate({ opacity: 1 },1, function(){
                        typeOfData = "generateKey"
                        content = $("#enterJSON").val();
                        $("#download-all-JSON").hide();
                        try{
                            JSONcontent = $.parseJSON(content);
                            d.done($.each(JSONcontent, function (i, keyVal) {
                                $.each(keyVal, function (key, val) {
                                    IndividualGenerateQr(key, val)
                                })
                            }))
                            $(".loading").hide()
                        }
                        catch (e) {
                            swal("Error!", "Missing the Format Somewhere!", "error");
                            $(".loading").hide()
                        }
                    });
                }
        })
    $(".download").click(function (e) {
        var url = $(".qrUrl").val();
        createIndividual(url);
    });
    $(document).on('click',".box",function downloadData(data){
        var svg = $(this).find(".svgData").html()
        var name = $(this).find(".Individualname").text();
        GenerateFile(name, svg);
    })
    $(document).on('click','#download-all',function () {
        typeofButton="downloadURL"
        downloadAll();
    })
    $(document).on('click','#download-all-JSON',function () {
        typeofButton="downloadJSON"
        downloadAll();
    })
    function downloadAll() {
      if(((typeofButton)==="downloadURL")) {
          archiveURL.generateAsync({type: "blob"})
              .then(function (blob) {
                  saveAs(blob, "QRcodeURL.zip");
              });
      }
        if(((typeofButton)==="downloadJSON")){
          archiveJSON.generateAsync({type: "blob"})
              .then(function (blob) {
                  saveAs(blob, "QRcodeJSON.zip");
              });
      }
   }
    function GenerateFile(name, svg) {
        var svg = svg;
        var fileName = name;
        var zip = new JSZip();
        zip.file(name, svg);
        zip.generateAsync({type:"blob"})
            .then(function(content) {
                saveAs(content, "QRcode.zip");
            });
    }
    function createIndividual(url) {
        var numberOfData=0;
        $.ajax({
                url: url,
                cache: false,
                success: function (url) {
                    d.done($.each(url, function (i, sample) {
                        $.each(sample, function (key, val) {
                            IndividualGenerateQr(key, val);
                            numberOfData++;
                        })
                    }))
                  if(numberOfData==0){
                      swal("No Data Found !", "Content is empty on this URL!", "info");
                  }
                   $(".loading").hide();
                },
                error:function () {
                    swal("Not found !", "Please check the URL !", "error");
                    $(".loading").hide();
                }
            })
    }
    function IndividualGenerateQr(name, data) {
        var qrcode = new QRCode({
            content: data,
            width: 200,
            height: 200,
            color: "black",
            background: "white",
            ecl: "H"
        });
        var name = name + ".svg";
        var svg = qrcode.svg();

        if(typeOfData==="generateURL") {
            $(".qr-list").addClass("list-loaded").append('<div class="box" "><div class="svgData">' + svg + '</div><div class="Individualname">' + name + '</div><div><a href="javascript:void(0)" class="individualDownload" >Download</a> </div></div>');
            $(".qr-list").load(name,svg)
            $("#download-all").show();
            archiveURL = zip.folder("QRcode-URL");
            archiveURL.file(name, svg);
        }
        else {
            $(".qr-container").addClass("list-loaded").append('<div class="box" "><div class="svgData">' + svg + '</div><div class="Individualname">' + name + '</div><div><a href="javascript:void(0)" class="individualDownload" >Download</a> </div></div>');
            $("#download-all-JSON").show();
            archiveJSON = zip.folder("QRcode-JSON");
            archiveJSON.file(name, svg);
        }
    }
})