const parabirimi1 = document.getElementById('currency-one');
const parabirimi2 = document.getElementById('currency-two');
const miktar1 = document.getElementById('amount-one');
const miktar2 = document.getElementById('amount-two'); //document.getElementById kullanarak html'de id verdiğimiz div ve inputlara erişim sağlandı

const rateEl = document.getElementById('rate'); //Döviz kurlarının verisini çekildi

function calculate() { //üstteki kutuda seçilen dövizin tl karşılığını bulup, alttaki kutuda seçilen dövizin karşılık değerine bölerek dönüşüm yapan fonksiyon
  const currency_one = parabirimi1.value; 
  const currency_two = parabirimi2.value; //default olarak seçili veya kullanıcının seçtiği para birimi değerlerinin ataması yapıldı  

  
  fetch("https://api.factmaven.com/xml-to-json/?xml=https://www.tcmb.gov.tr/kurlar/today.xml")
  .then(response => response.json())
  .then(data => {
    var array = data.Tarih_Date.Currency; // xml dosyasındaki bütün veriler array'e yüklendi

    if (currency_one == "TRY") {
      var one_tl_rate = 1 * miktar1.value ;
    } else {
      var one_tl_rate = array.find(item => item.CurrencyCode === currency_one).ForexBuying * miktar1.value; //seçilen para birimini array içindeki tüm para birimleri ile karşılaştırıp 
      //=== şartı sağlanınca eşleştirdi ve kur değeriyle çarptı. Bu değeri de kullanıcının girdiği input ile çarptı.
    }
    
    if (currency_two == "TRY") {
      var two_tl_rate = one_tl_rate;
    } else {
      var two_tl_rate = array.find(item => item.CurrencyCode === currency_two).ForexBuying; //seçilen para birimini array içindeki tüm para birimlerinin currencycode'u ile karşılaştırıp 
      //=== şartı sağlanınca eşleştirdi. Para biriminin kur değerini de two_tl_rate'e atadı 
    }

    console.log(currency_one, one_tl_rate, currency_two, two_tl_rate);

    if (currency_one == "TRY" && currency_two == "TRY") { //seçilen 2 para birimi de TRY ise kullanıcının girdiği miktarın aynısını yazdırdı, seçilen para birimleri farklıysa
      //fonksiyon açıklamasındaki hesaplama yöntemiyle dönüşümü yaptı 
      miktar2.value = miktar1.value;  
    } else if (currency_one != "TRY" && currency_two == "TRY") { //başka birimin TRY karşılığını bulmak isteme durumu
      miktar2.value = two_tl_rate; 
    }
    
    else { //TRY hariç iki para biriminin dönüşümü durumu
      miktar2.value = (one_tl_rate / two_tl_rate).toFixed(2);
    }

    
  })
  .catch(console.error);
}

parabirimi1.addEventListener('change', calculate);
miktar1.addEventListener('input', calculate);
parabirimi2.addEventListener('change', calculate);
miktar2.addEventListener('input', calculate);


calculate();


const dovizcinsi = document.getElementById('d-all');

function table() { //sayfanın sağında bulunan listenin xml dosyasındaki isim ve forexbuying etiketine sahip elemanlarını listelemek için veri çekme fonksiyonu
  fetch("https://api.factmaven.com/xml-to-json/?xml=https://www.tcmb.gov.tr/kurlar/today.xml")
  .then(response => response.json())
  .then(data => {
    var array = data.Tarih_Date.Currency; // xml dosyasındaki bütün veriler array'e yüklendi
    array = array.reverse(); // Array reverse edildi 
    array.forEach(element => {
      if (element.Kod === "XDR") return //Sayfanın en altındaki özel çekme hakkı ismine sahip değer, listede istenmiyor
      var row = dovizcinsi.insertRow(1);
      var one = row.insertCell(0); //ilk sütun
      var two = row.insertCell(1); //ikinci sütun
      one.innerHTML = element.Isim;
      two.innerHTML = element.ForexBuying;
    });
  })
}
table();