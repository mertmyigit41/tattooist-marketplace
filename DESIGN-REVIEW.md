# Inqfy — tasarım incelemesi ve uygulama görevleri

Durum: inceleme tamamlandı; aşağıdaki görevler henüz uygulanmadı.

İncelenen sürüm: `480fd4d` üzerindeki yerel Mindloop değişiklikleri (`src/app/page.tsx`, `src/app/globals.css`, `src/app/layout.tsx`). İnceleme localhost'taki demo görünümünde yapıldı; canlı ilanların durumu veya gerçek teklif sayıları doğrulanmadı.

## Tasarım kararı

Önceki tasarım, ilanı ve teklifleri ilk ekranda gösterdiği için ürünü daha doğrudan anlatıyordu. Yeni tasarımın siyah-beyaz atmosferi, büyük tipografisi ve hareketi daha güçlü; ancak mevcut uyarlama, Inqfy'ye ait görsel hikâyeyi geri plana itiyor. Öneri: kullanıcının beğendiği Mindloop yönünü koruyup ürünün kendisini bu dilin merkezine yerleştirmek.

- **Ürün:** İnsanlar dövme isteğini bir kez paylaşır; stüdyolar tamamlanmış tekliflerle yanıtlar.
- **Karakter:** Kendinden emin, kişisel, açık sözlü.
- **Dünya:** Siyah mürekkep, dövme çizimi, stil referansı ve sanatçının gerçek işi.
- **Öne çıkan anlar:** Gerçek brief'in tekliflere dönüşmesi; portföy ve seans planını karşılaştırarak seçim yapma.
- **İmza:** Aynı brief çevresinde toplanan tekliflerin hareketi. Siyah-beyaz sahne, Inter ve Instrument Serif italik vurgular korunur.

İtalik, cam yüzey ve sinematik motion kullanıcının bilinçli seçimidir. Bunlar sırf genel bir kontrol listesine uymak için kaldırılmamalı. Görsel konusu, sayfa akışı ve uygulama bütünlüğü iyileştirilmeli.

## Kanıtlar

- Masaüstü landing 1440×900'de incelendi. Tam sayfa yüksekliği bu durumda 6196px; gerçek Sisifos konsepti ancak beşinci bölümde görülüyor.
- Hero'da astronot ve krom yıldız; sonraki bölümlerde yüzen ada ve soyut cisimler var. “Complete quote” başlığı altında bir teklif örneği gösterilmiyor.
- Landing siyah-beyazken `/create` ve ilan detayı sıcak grafit, krem, amber ve stencil moru kullanıyor. Fontlar ise global olarak değiştirilmiş.
- 360×740'ta sayfa yatay taşmıyor. Mobil navbar 118px; ana CTA iki satıra bölünüp 68px yüksekliğe çıkıyor. Hero'nun sabit minimum yüksekliği 740px.
- Video duraklatma düğmesi çalışıyor; ekran dışındaki videolar duruyor. Bu davranışlar korunmalı.
- Azaltılmış hareket tercihinde videolar kaldırılıyor, fakat manifesto önündeki 660px video alanı boş kalıyor.
- Video yüklemesi engellendiğinde poster bulunmuyor. JavaScript kapalıyken hero içeriğinin hesaplanan opaklığı `0`; başlık ve `/create` bağlantısı DOM'da mevcut ama görünmüyor.
- `generate()` yeni görsel üretmiyor: `STYLE_CONCEPTS` içinden bir görsel seçip `source: "curated"` döndürüyor. İlk adımın “Draw the design” olması davranışla uyuşmuyor.
- Kurucu hikâyesindeki “The search is still open” sabit metin. `useShowcaseHref()` canlıda en yeni açık ilana, yoksa en yeni herhangi bir ilana gidiyor; kurucunun ilanına veya açık bir ilana gitmeyi garanti etmiyor.
- İlan zaman çizelgesi, henüz seçim yapılmamış durumda da sonraki adımı “Booked” başlığıyla vurguluyor.
- Mevcut `og.png`, eski sıcak temada dört örnek teklifi “4 quotes” ve “live” olarak gösteriyor; görselin içinde demo açıklaması bulunmuyor.

Görsel ve gözlem dosyaları: `C:\Users\great\AppData\Local\Temp\inqfy-shots\audit-*`. `audit-observations.json` ölçümleri içerir. Önceki tasarım karşılaştırması `v2-landing-1440.png`; mevcut hero referansları `mindloop-1440.png` ve `mindloop-360.png`.

## Görevler

### D01 · P1 — Landing ve uygulamayı tek tasarım sisteminde birleştir

**Sorun:** “Post your tattoo” ile ilerleyince başka bir görsel kimliğe geçiliyor. `DESIGN.md` hâlâ Fraunces/Geist ve Ink & lamp tarif ediyor; font değişkenlerinin isimleri de artık gerçek aileleri yansıtmıyor.

**Yapılacak:** Siyah-beyaz yüzey, metin, sınır, buton ve focus rollerini ortak token'lara taşı. Inter arayüz fontu olsun; Instrument Serif, pazarlama başlıklarındaki seçilmiş vurgularda kullanılsın. Uygulama sayfa başlıkları Inter 500, fiyat ve tarihler mevcut mono olsun. Navbar, footer ve ortak `Button`, `Card`, `Pill`, input bileşenleri aynı temayı kullansın. Landing'in genişlik farkı açık bir layout tercihiyle yönetilsin. Yeni sistemi `DESIGN.md` içine işle.

**Kapsam:** `globals.css`, `layout.tsx`, `Navbar.tsx`, `Footer.tsx`, `ui.tsx`, `DESIGN.md`; gerekli sayfa başlığı kullanımları.

**Kabul:** Landing → create → request → quotes geçişinde yüzeyler ve kontroller aynı aileden görünür. Hata, seçim ve booked durumları metin/ikonla anlaşılır. Portföy fotoğraflarının gerçek renkleri tema uğruna silinmez. Oturum, rol ve demo kontrolleri çalışmayı sürdürür.

### D02 · P1 — Hero'nun görselini ve motion'unu ürüne bağla

**Sorun:** Genel uzay sahnesi, bir dövme talebine stüdyoların teklif vermesini açıklamıyor. Ürünün en güçlü kanıtı aşağıda kalıyor.

**Yapılacak:** Sinematik siyah-beyaz kompozisyonu koruyarak Sisifos brief'ini ve “mea culpa” stil referansını erken görünür yap. Hareketi tek bir anlatıya bağla: brief görünür → iki teklif sırayla belirir → karşılaştırılabilir alanlar anlaşılır. Masaüstünde bu ürün görünümü hero'nun alt bölümünde başlasın; mobilde aksiyonların hemen ardından gelsin. “Complete quote” bölümündeki soyut cisim videosunun yerine mevcut teklif bileşenlerinden türetilmiş okunabilir bir örnek yerleştir.

**Kapsam:** `page.tsx`, mevcut `HeroQuoteStack.tsx`, `QuoteCard.tsx` ve `QuoteTable.tsx` tasarım referansları; mevcut konsept ve referans görselleri.

**Kabul:** İlk ekran ve onu izleyen bölüm birlikte dövme fikrini, gelen teklifi ve müşterinin seçimini gösterir. Örnekte fiyat, seans planı, başlangıç ve üç portföy parçası bulunur. Örnek teklifler görünür biçimde “Example quotes” olarak etiketlenir; canlı teklif izlenimi yaratılmaz. Giriş animasyonu bir kez oynar; kartlar sürekli dönmez veya yüzmez.

### D03 · P1 — Mobil navbar ve ana CTA'yı yeniden düzenle

**Sorun:** İki satırlı mobil navbar ilk ekranı daraltıyor. “Your idea starts here” kutusu bir input gibi görünüyor ama yalnızca metin; yanında asıl aksiyon iki satıra bölünüyor.

**Yapılacak:** Mobil header'ı logo, hesap ve erişilebilir menü kontrolünden oluşan tek satıra indir. “Post your tattoo”yu tek satırlı, 48px yüksekliğinde, mobilde tam genişlikte bir aksiyon yap. İşlevsiz input görünümünü kaldır; kısa güvence metni gerekiyorsa butondan ayrı kullan. İkincil talep bağlantısı altında kalsın. Hero yüksekliğini sabit 740px yerine içerik ve görünür ekran alanıyla düzenle.

**Kapsam:** `Navbar.tsx`, `page.tsx`, hero ve CTA CSS'i.

**Kabul:** 360×740 ve 390×844'te birincil aksiyon tek satırdır ve kaydırmadan görünür; menü yatay kaydırma gerektirmez. Tüm mevcut nav bağlantılarına erişilir. Menü Escape ile kapanır, odağı açan düğmeye geri verir ve açık/kapalı durumunu bildirir. Dokunma hedefleri en az 44px olur.

### D04 · P1 — Sayfanın ritmini ve tipografik hiyerarşisini kur

**Sorun:** Art arda büyük başlık, uzun boşluk ve dekoratif video geliyor. Hero ile neredeyse aynı büyüklükteki bölüm başlıkları her bölümü eşit ağırlığa taşıyor.

**Yapılacak:** Anlatı sırası: vaat + gerçek brief → teklifler nasıl gelir → karşılaştırma → kurucunun kısa hikâyesi → sorular → kapanış. Manifesto bu akışın kısa bir parçası olsun. Dekoratif ada bloğunu çıkar; kapsamlı yeniden sıralama bu görevin açık parçasıdır. Bölüm boşlukları masaüstünde 96px, mobilde 64px tabanına çekilsin. Büyük bölüm başlıkları masaüstünde 48–56px, mobilde 32–40px; alt başlıklar 18–20px olsun. Mevcut hero büyük kalabilir. İtalik vurgu her başlığın zorunlu şablonu olmasın.

**Kapsam:** `page.tsx`, `.mind-section`, `.mind-how`, `.mind-orbit`, başlık ve paragraf stilleri.

**Kabul:** Ürün kanıtına ulaşmadan birden fazla dekoratif ekran geçilmez. Teklif örneği manifesto ve kurucu anlatısından önce gelir. Başlık kırılımları anlamlıdır, gövde metni rahat okunur; dekoratif boşluk taşımak için sabit yükseklik kullanılmaz.

### D05 · P0 — Motion kapalıyken ve medya yüklenmediğinde tasarımı tamamla

**Sorun:** Hero içeriği JavaScript olmadan görünmüyor; reduced-motion durumunda büyük boş video alanı kalıyor. Videoların poster'i yok.

**Yapılacak:** Başlık ve ana bağlantılar HTML/CSS seviyesinde görünür olsun; giriş animasyonu bunun üzerine eklensin. Video bloklarına uygun statik poster sağla. Video hatası, autoplay engeli ve azaltılmış hareket durumunda poster veya gerçek ürün görseli göster; dekoratif boş alan bırakma. Oynatma durumunu gerçek video olaylarıyla eşleştir. Kontrolleri metin/medya kaplamasının karartmadığı bir katmana al. Ortak easing `[0.22, 1, 0.36, 1]`; kontrol geri bildirimi 150–200ms, içerik girişi 350–600ms aralığında olsun.

**Kapsam:** `Film`, `Reveal`, `Manifesto`, `Word`, ilgili CSS ve poster varlıkları.

**Kabul:** JavaScript kapalıyken hero başlığı ve `/create` linki görünür ve kullanılabilir. MP4 isteği başarısız olduğunda sahne tamamlanmış görünür. Reduced-motion'da manifesto okunur, video oynatılmaz ve 660px boş blok kalmaz. Otomatik oynatma engellenirse düğme gerçekte olmayan bir “playing” durumu göstermez. Mevcut pause ve ekran dışı durdurma davranışları korunur.

### D06 · P1 — İlan formunun diliyle yaptığı işi eşleştir

**Sorun:** Landing “brief bırak” diyor; form “Draw the design” ile başlıyor. “Draw concept + stencil” gerçekte galeriden bir örnek seçiyor.

**Yapılacak:** İlk adım “Describe your tattoo” olsun. Mevcut galeri seçimi “Choose a reference” olarak açıkça adlandırılsın; çizim ürettiği izlenimi verilmesin. Kullanıcının konsepti ile stil referansı ayrı, anlaşılır görsel alanlar olsun. Uzun brief için çok satırlı giriş kullan. Kullanıcının kendi konseptiyle devam etmesi görünür bir yol olsun; örnek görsel seçmek tasarım üretimi gibi sunulmasın.

**Kapsam:** `src/app/create/page.tsx`, form metinleri ve önizlemeleri; gerekiyorsa `ImageToggle.tsx`.

**Kabul:** Kullanıcı, neyin kendi konsepti neyin galeri örneği olduğunu ayırt eder. URL ile ön doldurma, en fazla üç referans, konum ve teklif penceresi korunur. “Draw” veya üretim iddiası, gerçekten üretim yapan bir özellik olmadan kullanılmaz. Form, mevcut create-request sözleşmesine uygun çıktı vermeyi sürdürür.

### D07 · P1 — İlan durumu, kurucu hikâyesi ve linkleri tutarlı yap

**Sorun:** “See an open request” kapalı ilana gidebilir. Kurucu hikâyesiyle linkin hedefi aynı kişi/ilan olmayabilir. Henüz teklif seçilmeden “Booked” aktif görünür.

**Yapılacak:** Genel vitrin linkinin metnini hedefin gerçek durumuyla eşleştir. Kurucu hikâyesindeki kişisel bağlantıyı doğrulanmış canlı ilan kimliğine bağla; ilan yoksa kişisel bir ilan varmış izlenimi yaratma. “The search is still open” yalnızca doğrulanmış açık durum için gösterilsin. Seçim öncesi son timeline adımı “Choose a studio”, kabulden sonra “Booked” olsun. Kapanmış ve süresi bitmiş durumlar ayrı ve anlaşılır ifade edilsin.

**Kapsam:** `page.tsx`, `useShowcaseHref()` ve çağrı yerleri, `RequestTimeline.tsx`.

**Kabul:** Açık, süresi dolmuş, kapalı, booked ve hiç ilan olmayan durumlarda metin ile hedef tutarlıdır. Yeni başka bir ilan oluşturulması kurucunun kişisel linkini değiştirmez. Demo teklifleri canlı kayıtlarla karışmaz. Uygulama öncesinde gerçek kurucu ilan kimliği doğrulanmalıdır; bu inceleme o kimliği belirlemedi.

### D08 · P1 — Kapanışı ve paylaşım yüzeylerini Inqfy'ye ait hale getir

**Sorun:** Kapanışta Mindloop'tan kalan iç içe daire işareti var; üstteki Inqfy wordmark'ıyla bağ kurmuyor. Stüdyo tarafı yalnızca “I'm a tattoo artist” butonuna sıkışmış. Paylaşım görseli önceki tasarımı temsil ediyor ve örnek teklifleri “live” olarak etiketliyor.

**Yapılacak:** Kapanışta Inqfy wordmark'ını kullan. Stüdyoya ne sunulduğunu bir kısa cümleyle anlat: hazır brief, stil referansları ve eksiksiz teklif gönderme. İkincil aksiyonun adı hedefi anlatsın: “Browse tattoo requests”. Footer tipografisini ve boşluklarını ortak sisteme taşı. Tasarım tamamlanınca `og.png` ve açıklamasını yeni gerçek brief/ürün görseliyle güncelle.

**Kapsam:** `page.tsx`, `Footer.tsx`, `layout.tsx` metadata, `public/og.png`.

**Kabul:** Landing, kapanış ve sosyal kart aynı ürüne ait görünür. Paylaşım kartı canlı teklif varmış gibi sunulmaz. Stüdyo aksiyonu mevcut feed'e gider. Sosyal hesap, kullanıcı sayısı, testimonial veya başarı iddiası uydurulmaz.

## Uygulama sırası

1. **D05:** Görünür içerik ve medya fallback'i; yayından önce.
2. **D01 + D03:** Ortak dil, navbar ve mobil aksiyon.
3. **D02 + D04:** Inqfy'ye ait görsel hikâye ve sayfa ritmi; ikinci görsel inceleme burada.
4. **D06 + D07:** Form vaadi, gerçek durum ve doğru bağlantılar.
5. **D08:** Kapanış ve paylaşım görseli.

Her görev kendi kabul kriteriyle doğrulanmalı. Fonksiyonel değişiklikler için anlamlı dar testler seçilmeli; yalnızca stil değişikliklerine uygulamayı taklit eden test dosyaları eklenmemeli. Son pakette lint, tip kontrolü, production build ve 360/390/1440px görsel kontrolü yeterlidir; aynı değişmemiş sürüm için tam kontroller tekrar tekrar koşturulmamalı.

Bu rapor tasarım planıdır. İnceleme sırasında uygulama kodu değiştirilmedi; commit, push veya deploy yapılmadı.

İnceleme yöntemi: [Unslop — Damir Sokolovsky](https://heydamir.design/unslop), CC BY 4.0; kullanıcının seçtiği tasarım yönü esas alınarak uygulandı.
